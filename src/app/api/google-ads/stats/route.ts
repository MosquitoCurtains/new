import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/google-ads/stats
 * 
 * Fetch Google Ads performance stats for the dashboard.
 * Uses service role to bypass RLS.
 * 
 * Query params:
 * - days: Number of days to look back (default: 90)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '90')
    
    // Calculate date filter
    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - days)
    const dateStr = dateFilter.toISOString().split('T')[0]
    
    // Fetch ALL campaign data with pagination
    let allCampaignRows: {
      campaign_id: string
      campaign_name: string
      campaign_type: string
      date: string
      cost_micros: number
      clicks: number
      impressions: number
      conversions: number
    }[] = []
    
    let offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('google_ads_campaigns')
        .select('campaign_id, campaign_name, campaign_type, date, cost_micros, clicks, impressions, conversions')
        .gte('date', dateStr)
        .order('date', { ascending: false })
        .range(offset, offset + 999)
      
      if (error) throw error
      if (!data || data.length === 0) break
      allCampaignRows.push(...data)
      if (data.length < 1000) break
      offset += 1000
    }
    
    // Aggregate totals
    let totalSpend = 0
    let totalClicks = 0
    let totalImpressions = 0
    let totalConversions = 0
    
    // Aggregate by campaign
    const campaignMap: Record<string, {
      campaign_id: string
      campaign_name: string
      campaign_type: string
      total_spend: number
      total_clicks: number
      total_impressions: number
      total_conversions: number
    }> = {}
    
    // Aggregate by month
    const monthlyMap: Record<string, {
      spend: number
      clicks: number
      impressions: number
      conversions: number
    }> = {}
    
    allCampaignRows.forEach(row => {
      const id = row.campaign_id
      const month = row.date.substring(0, 7)
      
      // Campaign aggregation
      if (!campaignMap[id]) {
        campaignMap[id] = {
          campaign_id: id,
          campaign_name: row.campaign_name,
          campaign_type: row.campaign_type,
          total_spend: 0,
          total_clicks: 0,
          total_impressions: 0,
          total_conversions: 0,
        }
      }
      campaignMap[id].total_spend += row.cost_micros / 1_000_000
      campaignMap[id].total_clicks += row.clicks
      campaignMap[id].total_impressions += row.impressions
      campaignMap[id].total_conversions += Number(row.conversions)
      
      // Monthly aggregation
      if (!monthlyMap[month]) {
        monthlyMap[month] = { spend: 0, clicks: 0, impressions: 0, conversions: 0 }
      }
      monthlyMap[month].spend += row.cost_micros / 1_000_000
      monthlyMap[month].clicks += row.clicks
      monthlyMap[month].impressions += row.impressions
      monthlyMap[month].conversions += Number(row.conversions)
      
      // Totals
      totalSpend += row.cost_micros / 1_000_000
      totalClicks += row.clicks
      totalImpressions += row.impressions
      totalConversions += Number(row.conversions)
    })
    
    // Sort campaigns by spend
    const campaigns = Object.values(campaignMap)
      .sort((a, b) => b.total_spend - a.total_spend)
      .slice(0, 20)
    
    // Sort monthly data
    const monthly = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12)
    
    // Fetch revenue from legacy_orders for ROAS
    let allOrders: { order_date: string; total: number }[] = []
    let orderOffset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('order_date, total')
        .gte('order_date', dateStr)
        .range(orderOffset, orderOffset + 999)
      
      if (error) throw error
      if (!data || data.length === 0) break
      allOrders.push(...data)
      if (data.length < 1000) break
      orderOffset += 1000
    }
    
    // Calculate revenue totals and by month
    let totalRevenue = 0
    const revenueByMonth: Record<string, number> = {}
    
    allOrders.forEach(order => {
      if (order.order_date) {
        const month = order.order_date.substring(0, 7)
        if (!revenueByMonth[month]) revenueByMonth[month] = 0
        revenueByMonth[month] += Number(order.total || 0)
        totalRevenue += Number(order.total || 0)
      }
    })
    
    // Add revenue to monthly data
    const monthlyWithRevenue = monthly.map(m => ({
      ...m,
      revenue: revenueByMonth[m.month] || 0,
      roas: m.spend > 0 ? (revenueByMonth[m.month] || 0) / m.spend : null
    }))
    
    // Fetch sync logs
    const { data: syncLogs } = await supabase
      .from('google_ads_sync_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    return NextResponse.json({
      success: true,
      days,
      totals: {
        spend: totalSpend,
        clicks: totalClicks,
        impressions: totalImpressions,
        conversions: totalConversions,
        revenue: totalRevenue,
        roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      },
      campaigns,
      monthly: monthlyWithRevenue,
      syncLogs: syncLogs || [],
      recordCount: allCampaignRows.length
    })
    
  } catch (error) {
    console.error('[Google Ads Stats] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
