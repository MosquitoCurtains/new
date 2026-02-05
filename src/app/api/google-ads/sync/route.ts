import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { 
  createGoogleAdsClient, 
  getYesterdayDate, 
  getLastNDaysRange,
  type DateRange 
} from '@/lib/analytics/google-ads-client'

/**
 * POST /api/google-ads/sync
 * 
 * Sync Google Ads campaign data to Supabase.
 * 
 * Body params:
 * - date: Specific date to sync (YYYY-MM-DD)
 * - days: Number of days to sync (default: 1 for yesterday)
 * - force: Force re-sync even if data exists
 * - includeKeywords: Include keyword-level data (default: false)
 * 
 * Called by:
 * - Vercel cron (daily)
 * - Manual backfill
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
    const { date, days = 1, force = false, includeKeywords = false } = body
    
    // Initialize clients
    const adsClient = createGoogleAdsClient()
    if (!adsClient) {
      return NextResponse.json(
        { 
          error: 'Google Ads client not configured',
          help: 'Check environment variables: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID'
        },
        { status: 500 }
      )
    }
    
    const supabase = createAdminClient()
    
    // Determine date range
    let dateRange: DateRange
    let syncDate: string
    
    if (date) {
      dateRange = { startDate: date, endDate: date }
      syncDate = date
    } else {
      dateRange = getLastNDaysRange(days)
      syncDate = days === 1 ? getYesterdayDate() : `${dateRange.startDate}_to_${dateRange.endDate}`
    }
    
    // Check if already synced (unless force)
    if (!force && days === 1) {
      const { data: existingSync } = await supabase
        .from('google_ads_sync_log')
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
      .from('google_ads_sync_log')
      .insert({
        sync_date: date || getYesterdayDate(),
        sync_type: days === 1 ? 'daily' : 'backfill',
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (syncLogError) {
      console.error('[Google Ads Sync] Failed to create sync log:', syncLogError)
    }
    
    const syncLogId = syncLog?.id
    
    try {
      // Fetch data from Google Ads
      console.log(`[Google Ads Sync] Fetching data for ${dateRange.startDate} to ${dateRange.endDate}`)
      const report = await adsClient.fetchCompleteReport(dateRange, includeKeywords)
      
      // ---------------------------------------------------------------------------
      // Upsert campaign data
      // ---------------------------------------------------------------------------
      let campaignRecords = 0
      
      if (report.campaigns.length > 0) {
        const batchSize = 100
        for (let i = 0; i < report.campaigns.length; i += batchSize) {
          const batch = report.campaigns.slice(i, i + batchSize)
          
          const campaignData = batch.map(campaign => ({
            campaign_id: campaign.campaignId,
            campaign_name: campaign.campaignName,
            campaign_status: campaign.campaignStatus,
            campaign_type: campaign.campaignType,
            date: campaign.date,
            cost_micros: Math.round(campaign.costMicros),
            impressions: Math.round(campaign.impressions),
            clicks: Math.round(campaign.clicks),
            conversions: campaign.conversions,
            conversion_value: campaign.conversionValue,
            ctr: campaign.ctr,
            avg_cpc_micros: Math.round(campaign.avgCpcMicros),
            synced_at: new Date().toISOString()
          }))
          
          const { error: campaignError } = await supabase
            .from('google_ads_campaigns')
            .upsert(campaignData, { 
              onConflict: 'campaign_id,date',
              ignoreDuplicates: false 
            })
          
          if (campaignError) {
            console.error('[Google Ads Sync] Campaign upsert error:', campaignError)
          } else {
            campaignRecords += batch.length
          }
        }
      }
      
      // ---------------------------------------------------------------------------
      // Upsert keyword data (if requested)
      // ---------------------------------------------------------------------------
      let keywordRecords = 0
      
      if (includeKeywords && report.keywords.length > 0) {
        const batchSize = 100
        for (let i = 0; i < report.keywords.length; i += batchSize) {
          const batch = report.keywords.slice(i, i + batchSize)
          
          const keywordData = batch.map(keyword => ({
            campaign_id: keyword.campaignId,
            ad_group_id: keyword.adGroupId,
            keyword_id: keyword.keywordId,
            keyword_text: keyword.keywordText,
            match_type: keyword.matchType,
            date: keyword.date,
            cost_micros: keyword.costMicros,
            impressions: keyword.impressions,
            clicks: keyword.clicks,
            conversions: keyword.conversions,
            conversion_value: keyword.conversionValue,
            quality_score: keyword.qualityScore,
            synced_at: new Date().toISOString()
          }))
          
          const { error: keywordError } = await supabase
            .from('google_ads_keywords')
            .upsert(keywordData, { 
              onConflict: 'keyword_id,date',
              ignoreDuplicates: false 
            })
          
          if (keywordError) {
            console.error('[Google Ads Sync] Keyword upsert error:', keywordError)
          } else {
            keywordRecords += batch.length
          }
        }
      }
      
      // ---------------------------------------------------------------------------
      // Update sync log
      // ---------------------------------------------------------------------------
      const duration = Date.now() - startTime
      
      if (syncLogId) {
        await supabase
          .from('google_ads_sync_log')
          .update({
            status: 'success',
            campaigns_synced: campaignRecords,
            keywords_synced: keywordRecords,
            total_cost_micros: report.totals.costMicros,
            completed_at: new Date().toISOString(),
            duration_ms: duration
          })
          .eq('id', syncLogId)
      }
      
      return NextResponse.json({
        success: true,
        dateRange,
        campaignRecords,
        keywordRecords,
        totals: {
          spend: `$${(report.totals.costMicros / 1_000_000).toFixed(2)}`,
          impressions: report.totals.impressions,
          clicks: report.totals.clicks,
          conversions: report.totals.conversions
        },
        durationMs: duration
      })
      
    } catch (fetchError) {
      // Update sync log with error
      if (syncLogId) {
        await supabase
          .from('google_ads_sync_log')
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
    console.error('[Google Ads Sync] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/google-ads/sync
 * 
 * Get sync status and history
 */
export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: syncLogs, error } = await supabase
      .from('google_ads_sync_log')
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
    console.error('[Google Ads Sync] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
