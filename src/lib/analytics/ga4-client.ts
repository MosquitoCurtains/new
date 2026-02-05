/**
 * GA4 Analytics Data API Client
 * 
 * Handles fetching analytics data from Google Analytics 4 
 * for syncing to Supabase.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data'

// =============================================================================
// TYPES
// =============================================================================

export interface GA4Credentials {
  propertyId: string
  credentials: {
    client_email: string
    private_key: string
    [key: string]: unknown
  }
}

export interface DateRange {
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
}

export interface PageMetrics {
  pagePath: string
  pageTitle?: string
  pageviews: number
  uniquePageviews: number
  sessions: number
  organicSessions: number
  avgTimeOnPage: number
  bounceRate: number
  exitRate: number
  newUsers: number
}

export interface TrafficSourceMetrics {
  pagePath: string
  channel: string
  sessions: number
  newUsers: number
}

export interface GA4ReportResult {
  pages: PageMetrics[]
  trafficSources: TrafficSourceMetrics[]
  dateRange: DateRange
}

// =============================================================================
// CLIENT CLASS
// =============================================================================

export class GA4Client {
  private client: BetaAnalyticsDataClient
  private propertyId: string
  
  constructor(credentials: GA4Credentials) {
    this.propertyId = credentials.propertyId
    this.client = new BetaAnalyticsDataClient({
      credentials: credentials.credentials
    })
  }
  
  /**
   * Format property ID for API calls
   */
  private get property(): string {
    return `properties/${this.propertyId}`
  }
  
  /**
   * Fetch page metrics for a date range
   */
  async fetchPageMetrics(dateRange: DateRange): Promise<PageMetrics[]> {
    try {
      const [response] = await this.client.runReport({
        property: this.property,
        dateRanges: [{
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' }
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'engagementRate' }
        ],
        orderBys: [
          { metric: { metricName: 'screenPageViews' }, desc: true }
        ],
        limit: 10000
      })
      
      if (!response.rows) return []
      
      return response.rows.map(row => ({
        pagePath: row.dimensionValues?.[0]?.value || '/',
        pageTitle: row.dimensionValues?.[1]?.value || '',
        pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
        uniquePageviews: parseInt(row.metricValues?.[0]?.value || '0'), // GA4 doesn't have unique pageviews
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        organicSessions: 0, // Will be fetched separately
        newUsers: parseInt(row.metricValues?.[2]?.value || '0'),
        avgTimeOnPage: parseFloat(row.metricValues?.[3]?.value || '0'),
        bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
        exitRate: 1 - parseFloat(row.metricValues?.[5]?.value || '0') // engagement rate inverse
      }))
      
    } catch (error) {
      console.error('[GA4] Error fetching page metrics:', error)
      throw error
    }
  }
  
  /**
   * Fetch organic traffic by page
   */
  async fetchOrganicTraffic(dateRange: DateRange): Promise<Map<string, number>> {
    try {
      const [response] = await this.client.runReport({
        property: this.property,
        dateRanges: [{
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }],
        dimensions: [
          { name: 'pagePath' }
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
        limit: 10000
      })
      
      const organicMap = new Map<string, number>()
      
      if (response.rows) {
        for (const row of response.rows) {
          const path = row.dimensionValues?.[0]?.value || '/'
          const sessions = parseInt(row.metricValues?.[0]?.value || '0')
          organicMap.set(path, sessions)
        }
      }
      
      return organicMap
      
    } catch (error) {
      console.error('[GA4] Error fetching organic traffic:', error)
      throw error
    }
  }
  
  /**
   * Fetch traffic sources by page
   */
  async fetchTrafficSources(dateRange: DateRange): Promise<TrafficSourceMetrics[]> {
    try {
      const [response] = await this.client.runReport({
        property: this.property,
        dateRanges: [{
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'sessionDefaultChannelGroup' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'newUsers' }
        ],
        orderBys: [
          { metric: { metricName: 'sessions' }, desc: true }
        ],
        limit: 10000
      })
      
      if (!response.rows) return []
      
      return response.rows.map(row => ({
        pagePath: row.dimensionValues?.[0]?.value || '/',
        channel: row.dimensionValues?.[1]?.value || 'Unknown',
        sessions: parseInt(row.metricValues?.[0]?.value || '0'),
        newUsers: parseInt(row.metricValues?.[1]?.value || '0')
      }))
      
    } catch (error) {
      console.error('[GA4] Error fetching traffic sources:', error)
      throw error
    }
  }
  
  /**
   * Fetch complete report for a date range
   * Combines page metrics with organic traffic data
   */
  async fetchCompleteReport(dateRange: DateRange): Promise<GA4ReportResult> {
    // Fetch all data in parallel
    const [pageMetrics, organicTraffic, trafficSources] = await Promise.all([
      this.fetchPageMetrics(dateRange),
      this.fetchOrganicTraffic(dateRange),
      this.fetchTrafficSources(dateRange)
    ])
    
    // Merge organic sessions into page metrics
    const pagesWithOrganic = pageMetrics.map(page => ({
      ...page,
      organicSessions: organicTraffic.get(page.pagePath) || 0
    }))
    
    return {
      pages: pagesWithOrganic,
      trafficSources,
      dateRange
    }
  }
  
  /**
   * Fetch daily metrics for a single day
   * Used for incremental daily sync
   */
  async fetchDailyMetrics(date: string): Promise<GA4ReportResult> {
    return this.fetchCompleteReport({
      startDate: date,
      endDate: date
    })
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create GA4 client from environment variables
 */
export function createGA4Client(): GA4Client | null {
  const propertyId = process.env.GA4_PROPERTY_ID
  const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY
  
  if (!propertyId || !serviceAccountKey) {
    console.warn('[GA4] Missing GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_KEY')
    return null
  }
  
  try {
    const credentials = JSON.parse(serviceAccountKey)
    
    return new GA4Client({
      propertyId,
      credentials
    })
  } catch (error) {
    console.error('[GA4] Failed to parse service account key:', error)
    return null
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get date string for yesterday
 */
export function getYesterdayDate(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return formatDate(date)
}

/**
 * Get date range for last N days
 */
export function getLastNDaysRange(days: number): DateRange {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - 1) // Start from yesterday
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  }
}

/**
 * Get date range for last N months
 */
export function getLastNMonthsRange(months: number): DateRange {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() - 1) // Start from yesterday
  
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  }
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
