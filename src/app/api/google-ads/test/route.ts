import { NextResponse } from 'next/server'
import { createGoogleAdsClient } from '@/lib/analytics/google-ads-client'

/**
 * GET /api/google-ads/test
 * 
 * Test Google Ads API connection and return account info
 */
export async function GET() {
  try {
    const client = createGoogleAdsClient()
    
    if (!client) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'Google Ads client not configured',
        help: 'Missing environment variables. Required: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID',
        envStatus: {
          GOOGLE_ADS_CLIENT_ID: !!process.env.GOOGLE_ADS_CLIENT_ID,
          GOOGLE_ADS_CLIENT_SECRET: !!process.env.GOOGLE_ADS_CLIENT_SECRET,
          GOOGLE_ADS_DEVELOPER_TOKEN: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          GOOGLE_ADS_REFRESH_TOKEN: !!process.env.GOOGLE_ADS_REFRESH_TOKEN,
          GOOGLE_ADS_CUSTOMER_ID: !!process.env.GOOGLE_ADS_CUSTOMER_ID,
          GOOGLE_ADS_LOGIN_CUSTOMER_ID: !!process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
        }
      }, { status: 500 })
    }
    
    const result = await client.testConnection()
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        configured: true,
        error: result.error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      configured: true,
      message: 'Google Ads API connected successfully',
      accountName: result.accountName,
      currency: result.currency
    })
    
  } catch (error) {
    console.error('[Google Ads Test] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
