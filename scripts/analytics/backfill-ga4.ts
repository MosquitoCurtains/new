/**
 * GA4 Backfill Script
 * 
 * Backfills historical GA4 data into Supabase.
 * Syncs data month by month to avoid timeouts.
 * 
 * Usage:
 *   npx ts-node --esm scripts/analytics/backfill-ga4.ts
 * 
 * Options:
 *   --months=24    Number of months to backfill (default: 24)
 *   --dry-run      Show what would be synced without making changes
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// =============================================================================
// CONFIGURATION
// =============================================================================

// Load from env file if exists
const envPath = path.join(__dirname, '../../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  }
}

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '280174022'
const GA4_CREDENTIALS_PATH = process.env.GA4_CREDENTIALS_PATH || '/Users/jvmacmini/Downloads/mc-analytics-486504-f3b080fb39be.json'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Parse arguments
const args = process.argv.slice(2)
const monthsArg = args.find(a => a.startsWith('--months='))
const MONTHS_TO_BACKFILL = monthsArg ? parseInt(monthsArg.split('=')[1]) : 24
const DRY_RUN = args.includes('--dry-run')

// =============================================================================
// HELPERS
// =============================================================================

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getMonthRange(monthsAgo: number): { startDate: string; endDate: string; label: string } {
  const now = new Date()
  
  // End of target month
  const endDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0)
  
  // Start of target month
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  
  const label = `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    label
  }
}

// =============================================================================
// MAIN BACKFILL FUNCTION
// =============================================================================

async function backfillGA4Data() {
  console.log('='.repeat(60))
  console.log('GA4 Data Backfill Script')
  console.log('='.repeat(60))
  console.log(`Months to backfill: ${MONTHS_TO_BACKFILL}`)
  console.log(`Dry run: ${DRY_RUN}`)
  console.log('')
  
  // Load GA4 credentials
  let credentials
  try {
    const credentialsContent = fs.readFileSync(GA4_CREDENTIALS_PATH, 'utf8')
    credentials = JSON.parse(credentialsContent)
  } catch (error) {
    console.error('Failed to load GA4 credentials from:', GA4_CREDENTIALS_PATH)
    console.error('Set GA4_CREDENTIALS_PATH environment variable or update the path')
    process.exit(1)
  }
  
  // Initialize clients
  const ga4Client = new BetaAnalyticsDataClient({ credentials })
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  
  const property = `properties/${GA4_PROPERTY_ID}`
  
  // Track totals
  let totalPages = 0
  let totalSources = 0
  
  // Process each month
  for (let monthsAgo = MONTHS_TO_BACKFILL; monthsAgo >= 1; monthsAgo--) {
    const range = getMonthRange(monthsAgo)
    console.log(`\n[${range.label}] Processing ${range.startDate} to ${range.endDate}...`)
    
    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would sync this month`)
      continue
    }
    
    try {
      // ---------------------------------------------------------------------------
      // Fetch page metrics
      // ---------------------------------------------------------------------------
      const [pageResponse] = await ga4Client.runReport({
        property,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'date' }
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ],
        limit: 50000
      })
      
      // ---------------------------------------------------------------------------
      // Fetch organic traffic
      // ---------------------------------------------------------------------------
      const [organicResponse] = await ga4Client.runReport({
        property,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'date' }
        ],
        metrics: [
          { name: 'sessions' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionDefaultChannelGroup',
            stringFilter: {
              matchType: 'EXACT',
              value: 'Organic Search'
            }
          }
        },
        limit: 50000
      })
      
      // Build organic map
      const organicMap = new Map<string, number>()
      if (organicResponse.rows) {
        for (const row of organicResponse.rows) {
          const path = row.dimensionValues?.[0]?.value || '/'
          const date = row.dimensionValues?.[1]?.value || ''
          const key = `${path}|${date}`
          const sessions = parseInt(row.metricValues?.[0]?.value || '0')
          organicMap.set(key, sessions)
        }
      }
      
      // ---------------------------------------------------------------------------
      // Insert page analytics
      // ---------------------------------------------------------------------------
      if (pageResponse.rows && pageResponse.rows.length > 0) {
        const pageData = pageResponse.rows.map(row => {
          const pagePath = row.dimensionValues?.[0]?.value || '/'
          const dateStr = row.dimensionValues?.[1]?.value || ''
          // Convert YYYYMMDD to YYYY-MM-DD
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
          const key = `${pagePath}|${dateStr}`
          
          return {
            page_path: pagePath,
            date: formattedDate,
            pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
            unique_pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
            sessions: parseInt(row.metricValues?.[1]?.value || '0'),
            organic_sessions: organicMap.get(key) || 0,
            new_users: parseInt(row.metricValues?.[2]?.value || '0'),
            avg_time_on_page: parseFloat(row.metricValues?.[3]?.value || '0'),
            bounce_rate: parseFloat(row.metricValues?.[4]?.value || '0')
          }
        })
        
        // Batch insert
        const batchSize = 500
        for (let i = 0; i < pageData.length; i += batchSize) {
          const batch = pageData.slice(i, i + batchSize)
          
          const { error } = await supabase
            .from('page_analytics')
            .upsert(batch, { onConflict: 'page_path,date' })
          
          if (error) {
            console.error(`  Error inserting batch: ${error.message}`)
          }
        }
        
        totalPages += pageData.length
        console.log(`  Synced ${pageData.length} page records`)
      }
      
      // ---------------------------------------------------------------------------
      // Fetch and insert traffic sources
      // ---------------------------------------------------------------------------
      const [sourceResponse] = await ga4Client.runReport({
        property,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'date' },
          { name: 'sessionDefaultChannelGroup' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'newUsers' }
        ],
        limit: 50000
      })
      
      if (sourceResponse.rows && sourceResponse.rows.length > 0) {
        const sourceData = sourceResponse.rows.map(row => {
          const dateStr = row.dimensionValues?.[1]?.value || ''
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
          
          return {
            page_path: row.dimensionValues?.[0]?.value || '/',
            date: formattedDate,
            channel: row.dimensionValues?.[2]?.value || 'Unknown',
            sessions: parseInt(row.metricValues?.[0]?.value || '0'),
            new_users: parseInt(row.metricValues?.[1]?.value || '0')
          }
        })
        
        // Batch insert
        const batchSize = 500
        for (let i = 0; i < sourceData.length; i += batchSize) {
          const batch = sourceData.slice(i, i + batchSize)
          
          const { error } = await supabase
            .from('traffic_sources')
            .upsert(batch, { onConflict: 'page_path,date,channel' })
          
          if (error) {
            console.error(`  Error inserting traffic sources: ${error.message}`)
          }
        }
        
        totalSources += sourceData.length
        console.log(`  Synced ${sourceData.length} traffic source records`)
      }
      
      // Small delay between months to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`  Error processing ${range.label}:`, error)
    }
  }
  
  // ---------------------------------------------------------------------------
  // Log completion
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60))
  console.log('Backfill Complete!')
  console.log('='.repeat(60))
  console.log(`Total page analytics records: ${totalPages}`)
  console.log(`Total traffic source records: ${totalSources}`)
  
  // Create sync log entry
  if (!DRY_RUN) {
    await supabase.from('analytics_sync_log').insert({
      sync_date: formatDate(new Date()),
      sync_type: 'backfill',
      records_synced: totalPages + totalSources,
      pages_synced: totalPages,
      status: 'success',
      completed_at: new Date().toISOString()
    })
  }
}

// Run
backfillGA4Data().catch(console.error)
