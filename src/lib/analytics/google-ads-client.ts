/**
 * Google Ads API Client
 * 
 * Handles fetching campaign and keyword data from Google Ads
 * for syncing to Supabase and ROAS calculation.
 */

import { GoogleAdsApi, enums } from 'google-ads-api'

// =============================================================================
// TYPES
// =============================================================================

export interface GoogleAdsCredentials {
  clientId: string
  clientSecret: string
  developerToken: string
  refreshToken: string
  customerId: string
  loginCustomerId?: string // For manager accounts
}

export interface DateRange {
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
}

export interface CampaignMetrics {
  campaignId: string
  campaignName: string
  campaignStatus: string
  campaignType: string
  date: string
  costMicros: number
  impressions: number
  clicks: number
  conversions: number
  conversionValue: number
  ctr: number
  avgCpcMicros: number
}

export interface KeywordMetrics {
  campaignId: string
  adGroupId: string
  keywordId: string
  keywordText: string
  matchType: string
  date: string
  costMicros: number
  impressions: number
  clicks: number
  conversions: number
  conversionValue: number
  qualityScore: number | null
}

export interface GoogleAdsReportResult {
  campaigns: CampaignMetrics[]
  keywords: KeywordMetrics[]
  dateRange: DateRange
  totals: {
    costMicros: number
    impressions: number
    clicks: number
    conversions: number
  }
}

// =============================================================================
// CLIENT CLASS
// =============================================================================

export class GoogleAdsClient {
  private api: GoogleAdsApi
  private customerId: string
  private loginCustomerId?: string
  
  constructor(credentials: GoogleAdsCredentials) {
    this.customerId = credentials.customerId.replace(/-/g, '') // Remove dashes
    this.loginCustomerId = credentials.loginCustomerId?.replace(/-/g, '')
    
    this.api = new GoogleAdsApi({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      developer_token: credentials.developerToken,
    })
  }
  
  /**
   * Get customer instance for API calls
   */
  private getCustomer() {
    console.log('[Google Ads] Creating customer with:', {
      customer_id: this.customerId,
      login_customer_id: this.loginCustomerId,
      has_refresh_token: !!process.env.GOOGLE_ADS_REFRESH_TOKEN
    })
    
    return this.api.Customer({
      customer_id: this.customerId,
      login_customer_id: this.loginCustomerId,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    })
  }
  
  /**
   * Test connection and get account info
   */
  async testConnection(): Promise<{ success: boolean; accountName?: string; currency?: string; error?: string }> {
    try {
      const customer = this.getCustomer()
      
      const [account] = await customer.query(`
        SELECT 
          customer.descriptive_name,
          customer.currency_code,
          customer.id
        FROM customer
        LIMIT 1
      `)
      
      return {
        success: true,
        accountName: account.customer?.descriptive_name || 'Unknown',
        currency: account.customer?.currency_code || 'USD'
      }
    } catch (error) {
      console.error('[Google Ads] Connection test failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  /**
   * Fetch campaign metrics for a date range
   */
  async fetchCampaignMetrics(dateRange: DateRange): Promise<CampaignMetrics[]> {
    try {
      const customer = this.getCustomer()
      
      const campaigns = await customer.query(`
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          segments.date,
          metrics.cost_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc
        FROM campaign
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status != 'REMOVED'
        ORDER BY segments.date DESC, metrics.cost_micros DESC
      `)
      
      return campaigns.map(row => ({
        campaignId: String(row.campaign?.id || ''),
        campaignName: row.campaign?.name || 'Unknown',
        campaignStatus: row.campaign?.status ? enums.CampaignStatus[row.campaign.status] : 'UNKNOWN',
        campaignType: row.campaign?.advertising_channel_type 
          ? enums.AdvertisingChannelType[row.campaign.advertising_channel_type] 
          : 'UNKNOWN',
        date: row.segments?.date || dateRange.startDate,
        costMicros: Number(row.metrics?.cost_micros || 0),
        impressions: Number(row.metrics?.impressions || 0),
        clicks: Number(row.metrics?.clicks || 0),
        conversions: Number(row.metrics?.conversions || 0),
        conversionValue: Number(row.metrics?.conversions_value || 0),
        ctr: Number(row.metrics?.ctr || 0),
        avgCpcMicros: Number(row.metrics?.average_cpc || 0),
      }))
      
    } catch (error) {
      console.error('[Google Ads] Error fetching campaign metrics:', error)
      throw error
    }
  }
  
  /**
   * Fetch keyword metrics for a date range (optional, for detailed tracking)
   */
  async fetchKeywordMetrics(dateRange: DateRange): Promise<KeywordMetrics[]> {
    try {
      const customer = this.getCustomer()
      
      const keywords = await customer.query(`
        SELECT
          campaign.id,
          ad_group.id,
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          segments.date,
          metrics.cost_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.conversions_value,
          ad_group_criterion.quality_info.quality_score
        FROM keyword_view
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status != 'REMOVED'
          AND ad_group.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
        LIMIT 10000
      `)
      
      return keywords.map(row => ({
        campaignId: String(row.campaign?.id || ''),
        adGroupId: String(row.ad_group?.id || ''),
        keywordId: String(row.ad_group_criterion?.criterion_id || ''),
        keywordText: row.ad_group_criterion?.keyword?.text || '',
        matchType: row.ad_group_criterion?.keyword?.match_type 
          ? enums.KeywordMatchType[row.ad_group_criterion.keyword.match_type]
          : 'UNKNOWN',
        date: row.segments?.date || dateRange.startDate,
        costMicros: Number(row.metrics?.cost_micros || 0),
        impressions: Number(row.metrics?.impressions || 0),
        clicks: Number(row.metrics?.clicks || 0),
        conversions: Number(row.metrics?.conversions || 0),
        conversionValue: Number(row.metrics?.conversions_value || 0),
        qualityScore: row.ad_group_criterion?.quality_info?.quality_score ?? null,
      }))
      
    } catch (error) {
      console.error('[Google Ads] Error fetching keyword metrics:', error)
      throw error
    }
  }
  
  /**
   * Fetch complete report (campaigns + optional keywords)
   */
  async fetchCompleteReport(dateRange: DateRange, includeKeywords = false): Promise<GoogleAdsReportResult> {
    const campaigns = await this.fetchCampaignMetrics(dateRange)
    const keywords = includeKeywords ? await this.fetchKeywordMetrics(dateRange) : []
    
    // Calculate totals
    const totals = campaigns.reduce(
      (acc, c) => ({
        costMicros: acc.costMicros + c.costMicros,
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        conversions: acc.conversions + c.conversions,
      }),
      { costMicros: 0, impressions: 0, clicks: 0, conversions: 0 }
    )
    
    return {
      campaigns,
      keywords,
      dateRange,
      totals
    }
  }
  
  /**
   * Fetch daily metrics for a single day
   */
  async fetchDailyMetrics(date: string): Promise<GoogleAdsReportResult> {
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
 * Create Google Ads client from environment variables
 */
export function createGoogleAdsClient(): GoogleAdsClient | null {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  
  if (!clientId || !clientSecret || !developerToken || !refreshToken || !customerId) {
    console.warn('[Google Ads] Missing required environment variables')
    console.warn('[Google Ads] Required: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID')
    return null
  }
  
  return new GoogleAdsClient({
    clientId,
    clientSecret,
    developerToken,
    refreshToken,
    customerId,
    loginCustomerId
  })
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
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Convert micros to dollars
 */
export function microsToDollars(micros: number): number {
  return micros / 1_000_000
}

/**
 * Format currency from micros
 */
export function formatCurrency(micros: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(microsToDollars(micros))
}
