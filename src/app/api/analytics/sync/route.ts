import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { 
  createGA4Client, 
  getYesterdayDate, 
  getLastNDaysRange,
  formatDate,
  type DateRange 
} from '@/lib/analytics/ga4-client'

/**
 * POST /api/analytics/sync
 * 
 * Sync GA4 analytics data to Supabase.
 * 
 * Body params:
 * - date: Specific date to sync (YYYY-MM-DD)
 * - days: Number of days to sync (default: 1 for yesterday)
 * - force: Force re-sync even if data exists
 * 
 * Called by:
 * - Vercel cron (daily)
 * - Manual backfill script
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check for API key (simple auth for cron)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json().catch(() => ({}))
    const { date, days = 1, force = false } = body
    
    // Initialize clients
    const ga4Client = createGA4Client()
    if (!ga4Client) {
      return NextResponse.json(
        { error: 'GA4 client not configured. Check GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY.' },
        { status: 500 }
      )
    }
    
    const supabase = createAdminClient()
    
    // Determine date range
    let dateRange: DateRange
    let syncDate: string
    
    if (date) {
      // Specific date
      dateRange = { startDate: date, endDate: date }
      syncDate = date
    } else {
      // Last N days (default: yesterday only)
      dateRange = getLastNDaysRange(days)
      syncDate = days === 1 ? getYesterdayDate() : `${dateRange.startDate}_to_${dateRange.endDate}`
    }
    
    // Check if already synced (unless force)
    if (!force && days === 1) {
      const { data: existingSync } = await supabase
        .from('analytics_sync_log')
        .select('id')
        .eq('sync_date', date || getYesterdayDate())
        .eq('status', 'success')
        .single()
      
      if (existingSync) {
        return NextResponse.json({
          success: true,
          message: 'Already synced for this date',
          skipped: true
        })
      }
    }
    
    // Create sync log entry
    const { data: syncLog, error: syncLogError } = await supabase
      .from('analytics_sync_log')
      .insert({
        sync_date: date || getYesterdayDate(),
        sync_type: days === 1 ? 'daily' : 'backfill',
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (syncLogError) {
      console.error('[Analytics Sync] Failed to create sync log:', syncLogError)
    }
    
    const syncLogId = syncLog?.id
    
    try {
      // Fetch data from GA4
      console.log(`[Analytics Sync] Fetching GA4 data for ${dateRange.startDate} to ${dateRange.endDate}`)
      const report = await ga4Client.fetchCompleteReport(dateRange)
      
      // ---------------------------------------------------------------------------
      // Upsert page analytics
      // ---------------------------------------------------------------------------
      let pageRecords = 0
      const syncDateForDb = date || getYesterdayDate()
      
      if (report.pages.length > 0) {
        // Process in batches to avoid hitting limits
        const batchSize = 100
        for (let i = 0; i < report.pages.length; i += batchSize) {
          const batch = report.pages.slice(i, i + batchSize)
          
          const pageData = batch.map(page => ({
            page_path: page.pagePath,
            date: syncDateForDb,
            pageviews: page.pageviews,
            unique_pageviews: page.uniquePageviews,
            sessions: page.sessions,
            organic_sessions: page.organicSessions,
            new_users: page.newUsers,
            avg_time_on_page: page.avgTimeOnPage,
            bounce_rate: page.bounceRate,
            exit_rate: page.exitRate,
            updated_at: new Date().toISOString()
          }))
          
          const { error: pageError } = await supabase
            .from('page_analytics')
            .upsert(pageData, { 
              onConflict: 'page_path,date',
              ignoreDuplicates: false 
            })
          
          if (pageError) {
            console.error('[Analytics Sync] Page upsert error:', pageError)
          } else {
            pageRecords += batch.length
          }
        }
      }
      
      // ---------------------------------------------------------------------------
      // Upsert traffic sources
      // ---------------------------------------------------------------------------
      let sourceRecords = 0
      
      if (report.trafficSources.length > 0) {
        const batchSize = 100
        for (let i = 0; i < report.trafficSources.length; i += batchSize) {
          const batch = report.trafficSources.slice(i, i + batchSize)
          
          const sourceData = batch.map(source => ({
            page_path: source.pagePath,
            date: syncDateForDb,
            channel: source.channel,
            sessions: source.sessions,
            new_users: source.newUsers
          }))
          
          const { error: sourceError } = await supabase
            .from('traffic_sources')
            .upsert(sourceData, { 
              onConflict: 'page_path,date,channel',
              ignoreDuplicates: false 
            })
          
          if (sourceError) {
            console.error('[Analytics Sync] Traffic sources upsert error:', sourceError)
          } else {
            sourceRecords += batch.length
          }
        }
      }
      
      // ---------------------------------------------------------------------------
      // Update sync log
      // ---------------------------------------------------------------------------
      const duration = Date.now() - startTime
      
      if (syncLogId) {
        await supabase
          .from('analytics_sync_log')
          .update({
            status: 'success',
            records_synced: pageRecords + sourceRecords,
            pages_synced: report.pages.length,
            completed_at: new Date().toISOString(),
            duration_ms: duration
          })
          .eq('id', syncLogId)
      }
      
      return NextResponse.json({
        success: true,
        dateRange,
        pageRecords,
        sourceRecords,
        totalRecords: pageRecords + sourceRecords,
        durationMs: duration
      })
      
    } catch (fetchError) {
      // Update sync log with error
      if (syncLogId) {
        await supabase
          .from('analytics_sync_log')
          .update({
            status: 'failed',
            error_message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
            completed_at: new Date().toISOString(),
            duration_ms: Date.now() - startTime
          })
          .eq('id', syncLogId)
      }
      
      throw fetchError
    }
    
  } catch (error) {
    console.error('[Analytics Sync] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics/sync
 * 
 * Get sync status and history
 */
export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: syncLogs, error } = await supabase
      .from('analytics_sync_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sync logs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      logs: syncLogs
    })
    
  } catch (error) {
    console.error('[Analytics Sync] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
