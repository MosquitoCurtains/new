import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/ad-spend-efficiency
 * 
 * Comprehensive ad spend efficiency analysis combining:
 * - Google Ads campaign spend data
 * - Keyword-level performance
 * - GCLID-attributed leads & orders for true ROAS
 * - Monthly trend analysis
 * - Source/medium attribution breakdown
 * 
 * Built for account rep meeting prep.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '365')

    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - days)
    const dateStr = dateFilter.toISOString().split('T')[0]

    // =========================================================================
    // 1. CAMPAIGN DATA - Aggregate spend, clicks, impressions by campaign
    // =========================================================================
    let allCampaignRows: {
      campaign_id: string
      campaign_name: string
      campaign_type: string
      campaign_status: string
      date: string
      cost_micros: number
      clicks: number
      impressions: number
      conversions: number
      conversion_value: number
      ctr: number
      avg_cpc_micros: number
    }[] = []

    let offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('google_ads_campaigns')
        .select('campaign_id, campaign_name, campaign_type, campaign_status, date, cost_micros, clicks, impressions, conversions, conversion_value, ctr, avg_cpc_micros')
        .gte('date', dateStr)
        .order('date', { ascending: false })
        .range(offset, offset + 999)

      if (error) throw error
      if (!data || data.length === 0) break
      allCampaignRows.push(...data)
      if (data.length < 1000) break
      offset += 1000
    }

    // Aggregate by campaign
    const campaignMap: Record<string, {
      campaign_id: string
      campaign_name: string
      campaign_type: string
      campaign_status: string
      total_spend: number
      total_clicks: number
      total_impressions: number
      total_conversions: number
      total_conversion_value: number
      avg_ctr: number
      avg_cpc: number
      days_active: number
      daily_spend_data: { date: string; spend: number }[]
    }> = {}

    allCampaignRows.forEach(row => {
      const id = row.campaign_id
      if (!campaignMap[id]) {
        campaignMap[id] = {
          campaign_id: id,
          campaign_name: row.campaign_name,
          campaign_type: row.campaign_type,
          campaign_status: row.campaign_status,
          total_spend: 0,
          total_clicks: 0,
          total_impressions: 0,
          total_conversions: 0,
          total_conversion_value: 0,
          avg_ctr: 0,
          avg_cpc: 0,
          days_active: 0,
          daily_spend_data: [],
        }
      }
      const spend = row.cost_micros / 1_000_000
      campaignMap[id].total_spend += spend
      campaignMap[id].total_clicks += row.clicks
      campaignMap[id].total_impressions += row.impressions
      campaignMap[id].total_conversions += Number(row.conversions || 0)
      campaignMap[id].total_conversion_value += Number(row.conversion_value || 0)
      if (spend > 0) {
        campaignMap[id].days_active++
        campaignMap[id].daily_spend_data.push({ date: row.date, spend })
      }
    })

    // Calculate derived metrics for campaigns
    const campaigns = Object.values(campaignMap)
      .map(c => ({
        ...c,
        avg_ctr: c.total_impressions > 0 ? (c.total_clicks / c.total_impressions) * 100 : 0,
        avg_cpc: c.total_clicks > 0 ? c.total_spend / c.total_clicks : 0,
        cost_per_conversion: c.total_conversions > 0 ? c.total_spend / c.total_conversions : null,
        daily_avg_spend: c.days_active > 0 ? c.total_spend / c.days_active : 0,
        daily_spend_data: undefined, // Don't send raw daily data
      }))
      .sort((a, b) => b.total_spend - a.total_spend)

    // =========================================================================
    // 2. KEYWORD DATA - Top performers and budget drains
    // =========================================================================
    let allKeywordRows: {
      keyword_text: string
      match_type: string
      campaign_id: string
      cost_micros: number
      clicks: number
      impressions: number
      conversions: number
      quality_score: number | null
    }[] = []

    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('google_ads_keywords')
        .select('keyword_text, match_type, campaign_id, cost_micros, clicks, impressions, conversions, quality_score')
        .gte('date', dateStr)
        .range(offset, offset + 999)

      if (error) {
        // Table might not have data yet - that's ok
        console.warn('[Ad Spend Efficiency] Keywords table error:', error.message)
        break
      }
      if (!data || data.length === 0) break
      allKeywordRows.push(...data)
      if (data.length < 1000) break
      offset += 1000
    }

    // Aggregate keywords
    const keywordMap: Record<string, {
      keyword_text: string
      match_type: string
      total_spend: number
      total_clicks: number
      total_impressions: number
      total_conversions: number
      quality_scores: number[]
    }> = {}

    allKeywordRows.forEach(row => {
      const key = `${row.keyword_text}|${row.match_type}`
      if (!keywordMap[key]) {
        keywordMap[key] = {
          keyword_text: row.keyword_text,
          match_type: row.match_type,
          total_spend: 0,
          total_clicks: 0,
          total_impressions: 0,
          total_conversions: 0,
          quality_scores: [],
        }
      }
      keywordMap[key].total_spend += row.cost_micros / 1_000_000
      keywordMap[key].total_clicks += row.clicks
      keywordMap[key].total_impressions += row.impressions
      keywordMap[key].total_conversions += Number(row.conversions || 0)
      if (row.quality_score !== null && row.quality_score > 0) {
        keywordMap[key].quality_scores.push(row.quality_score)
      }
    })

    const keywords = Object.values(keywordMap)
      .map(k => ({
        keyword_text: k.keyword_text,
        match_type: k.match_type,
        total_spend: k.total_spend,
        total_clicks: k.total_clicks,
        total_impressions: k.total_impressions,
        total_conversions: k.total_conversions,
        ctr: k.total_impressions > 0 ? (k.total_clicks / k.total_impressions) * 100 : 0,
        cpc: k.total_clicks > 0 ? k.total_spend / k.total_clicks : 0,
        cost_per_conversion: k.total_conversions > 0 ? k.total_spend / k.total_conversions : null,
        avg_quality_score: k.quality_scores.length > 0
          ? k.quality_scores.reduce((a, b) => a + b, 0) / k.quality_scores.length
          : null,
      }))
      .sort((a, b) => b.total_spend - a.total_spend)

    // Identify budget drains: high spend, zero or very low conversions
    const budgetDrains = keywords
      .filter(k => k.total_spend > 50 && (k.total_conversions === 0 || (k.cost_per_conversion !== null && k.cost_per_conversion > 200)))
      .sort((a, b) => b.total_spend - a.total_spend)
      .slice(0, 15)

    // Top performers: best conversion rate relative to spend
    const topPerformers = keywords
      .filter(k => k.total_conversions > 0 && k.total_spend > 10)
      .sort((a, b) => (a.cost_per_conversion || Infinity) - (b.cost_per_conversion || Infinity))
      .slice(0, 15)

    // =========================================================================
    // 3. GCLID ATTRIBUTION - True Google Ads to revenue pipeline
    // =========================================================================
    let googleLeads: { email: string; entry_date: string }[] = []
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_leads')
        .select('email, entry_date')
        .not('gclid', 'is', null)
        .neq('gclid', '')
        .gte('entry_date', dateStr)
        .range(offset, offset + 999)

      if (error) throw error
      if (!data || data.length === 0) break
      googleLeads.push(...data)
      if (data.length < 1000) break
      offset += 1000
    }

    const googleEmails = [...new Set(googleLeads.map(l => l.email.toLowerCase()))]

    // Get orders from Google-attributed leads
    let googleOrders: { email: string; total: number; order_date: string }[] = []
    for (let i = 0; i < googleEmails.length; i += 200) {
      const batch = googleEmails.slice(i, i + 200)
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('email, total, order_date')
        .in('email', batch)

      if (error) throw error
      if (data) googleOrders.push(...data)
    }

    const googleRevenue = googleOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)
    const googleCustomers = new Set(googleOrders.map(o => o.email.toLowerCase())).size

    // Total leads for comparison
    const { count: totalLeadsCount } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .gte('entry_date', dateStr)

    // Total orders/revenue for comparison
    let totalRevenue = 0
    let totalOrderCount = 0
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('total, order_date')
        .gte('order_date', dateStr)
        .range(offset, offset + 999)

      if (error) throw error
      if (!data || data.length === 0) break
      data.forEach(row => {
        totalRevenue += Number(row.total || 0)
        totalOrderCount++
      })
      if (data.length < 1000) break
      offset += 1000
    }

    // Total ad spend
    const totalSpend = campaigns.reduce((sum, c) => sum + c.total_spend, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.total_clicks, 0)
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.total_impressions, 0)

    // =========================================================================
    // 4. MONTHLY TREND DATA
    // =========================================================================
    const monthlyMap: Record<string, {
      spend: number
      clicks: number
      impressions: number
      conversions: number
      googleLeads: number
      googleOrders: number
      googleRevenue: number
      allRevenue: number
    }> = {}

    // Initialize months
    for (let i = 0; i < Math.min(days / 30, 36); i++) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const month = d.toISOString().substring(0, 7)
      monthlyMap[month] = { spend: 0, clicks: 0, impressions: 0, conversions: 0, googleLeads: 0, googleOrders: 0, googleRevenue: 0, allRevenue: 0 }
    }

    // Fill campaign data into months
    allCampaignRows.forEach(row => {
      const month = row.date.substring(0, 7)
      if (monthlyMap[month]) {
        monthlyMap[month].spend += row.cost_micros / 1_000_000
        monthlyMap[month].clicks += row.clicks
        monthlyMap[month].impressions += row.impressions
        monthlyMap[month].conversions += Number(row.conversions || 0)
      }
    })

    // Fill Google leads into months
    googleLeads.forEach(lead => {
      const month = lead.entry_date.substring(0, 7)
      if (monthlyMap[month]) monthlyMap[month].googleLeads++
    })

    // Fill Google orders/revenue into months
    googleOrders.forEach(order => {
      if (order.order_date) {
        const month = order.order_date.substring(0, 7)
        if (monthlyMap[month]) {
          monthlyMap[month].googleOrders++
          monthlyMap[month].googleRevenue += Number(order.total || 0)
        }
      }
    })

    // Fill all revenue into months
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('total, order_date')
        .gte('order_date', dateStr)
        .range(offset, offset + 999)

      if (error) throw error
      if (!data || data.length === 0) break
      data.forEach(row => {
        if (row.order_date) {
          const month = row.order_date.substring(0, 7)
          if (monthlyMap[month]) {
            monthlyMap[month].allRevenue += Number(row.total || 0)
          }
        }
      })
      if (data.length < 1000) break
      offset += 1000
    }

    const monthly = Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        ...data,
        cpc: data.clicks > 0 ? data.spend / data.clicks : 0,
        ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
        costPerLead: data.googleLeads > 0 ? data.spend / data.googleLeads : null,
        costPerCustomer: data.googleOrders > 0 ? data.spend / data.googleOrders : null,
        googleRoas: data.spend > 0 ? data.googleRevenue / data.spend : null,
        allRoas: data.spend > 0 ? data.allRevenue / data.spend : null,
        googleRevenuePercent: data.allRevenue > 0 ? (data.googleRevenue / data.allRevenue) * 100 : 0,
      }))
      .filter(m => m.spend > 0 || m.googleRevenue > 0 || m.allRevenue > 0)
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 24)

    // =========================================================================
    // 5. ATTRIBUTION ANALYSIS - Source/Medium breakdown
    // =========================================================================
    let attributionRows: {
      source: string
      medium: string
      device: string
      orders: number
      revenue: number
      avg_order_value: number
      unique_customers: number
    }[] = []

    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('attribution_analysis')
        .select('source, medium, device, orders, revenue, avg_order_value, unique_customers')
        .order('revenue', { ascending: false })
        .range(offset, offset + 999)

      if (error) throw error
      if (!data || data.length === 0) break
      attributionRows.push(...data)
      if (data.length < 1000) break
      offset += 1000
    }

    // Aggregate by source+medium (ignore device for summary)
    const sourceMap: Record<string, { source: string; medium: string; orders: number; revenue: number; customers: number }> = {}
    attributionRows.forEach(row => {
      const key = `${row.source || '(direct)'}|${row.medium || '(none)'}`
      if (!sourceMap[key]) {
        sourceMap[key] = { source: row.source || '(direct)', medium: row.medium || '(none)', orders: 0, revenue: 0, customers: 0 }
      }
      sourceMap[key].orders += row.orders || 0
      sourceMap[key].revenue += Number(row.revenue || 0)
      sourceMap[key].customers += row.unique_customers || 0
    })

    const sourceMedium = Object.values(sourceMap)
      .map(s => ({
        ...s,
        avg_order_value: s.orders > 0 ? s.revenue / s.orders : 0,
        revenue_percent: totalRevenue > 0 ? (s.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20)

    // =========================================================================
    // 6. GENERATE INSIGHTS & RECOMMENDATIONS
    // =========================================================================
    const trueRoas = totalSpend > 0 ? googleRevenue / totalSpend : 0
    const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const costPerLead = googleLeads.length > 0 ? totalSpend / googleLeads.length : 0
    const costPerCustomer = googleCustomers > 0 ? totalSpend / googleCustomers : 0
    const leadToCustomerRate = googleLeads.length > 0 ? (googleCustomers / googleLeads.length) * 100 : 0
    const avgOrderValue = googleOrders.length > 0 ? googleRevenue / googleOrders.length : 0

    // Find highest/lowest ROAS months
    const monthsWithRoas = monthly.filter(m => m.googleRoas !== null && m.spend > 100)
    const bestMonth = monthsWithRoas.length > 0 ? monthsWithRoas.reduce((best, m) => (m.googleRoas || 0) > (best.googleRoas || 0) ? m : best) : null
    const worstMonth = monthsWithRoas.length > 0 ? monthsWithRoas.reduce((worst, m) => (m.googleRoas || 0) < (worst.googleRoas || 0) ? m : worst) : null

    // Campaign-type breakdown
    const campaignTypeMap: Record<string, { type: string; spend: number; clicks: number; impressions: number; conversions: number }> = {}
    campaigns.forEach(c => {
      const type = c.campaign_type || 'UNKNOWN'
      if (!campaignTypeMap[type]) {
        campaignTypeMap[type] = { type, spend: 0, clicks: 0, impressions: 0, conversions: 0 }
      }
      campaignTypeMap[type].spend += c.total_spend
      campaignTypeMap[type].clicks += c.total_clicks
      campaignTypeMap[type].impressions += c.total_impressions
      campaignTypeMap[type].conversions += c.total_conversions
    })

    const campaignTypes = Object.values(campaignTypeMap)
      .map(ct => ({
        ...ct,
        cpc: ct.clicks > 0 ? ct.spend / ct.clicks : 0,
        ctr: ct.impressions > 0 ? (ct.clicks / ct.impressions) * 100 : 0,
        spend_percent: totalSpend > 0 ? (ct.spend / totalSpend) * 100 : 0,
      }))
      .sort((a, b) => b.spend - a.spend)

    // Recent 3 month trend vs prior 3 months
    const sortedMonths = [...monthly].sort((a, b) => b.month.localeCompare(a.month))
    const recent3 = sortedMonths.slice(0, 3)
    const prior3 = sortedMonths.slice(3, 6)

    const recent3Spend = recent3.reduce((s, m) => s + m.spend, 0)
    const prior3Spend = prior3.reduce((s, m) => s + m.spend, 0)
    const recent3Revenue = recent3.reduce((s, m) => s + m.googleRevenue, 0)
    const prior3Revenue = prior3.reduce((s, m) => s + m.googleRevenue, 0)
    const recent3Roas = recent3Spend > 0 ? recent3Revenue / recent3Spend : 0
    const prior3Roas = prior3Spend > 0 ? prior3Revenue / prior3Spend : 0

    const spendTrend = prior3Spend > 0 ? ((recent3Spend - prior3Spend) / prior3Spend) * 100 : 0
    const roasTrend = prior3Roas > 0 ? ((recent3Roas - prior3Roas) / prior3Roas) * 100 : 0

    return NextResponse.json({
      success: true,
      days,
      dateRange: { start: dateStr, end: new Date().toISOString().split('T')[0] },

      // Summary metrics
      summary: {
        totalSpend,
        totalClicks,
        totalImpressions,
        overallCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        overallCpc: totalClicks > 0 ? totalSpend / totalClicks : 0,

        // Attribution
        googleLeadsCount: googleLeads.length,
        googleCustomersCount: googleCustomers,
        googleOrdersCount: googleOrders.length,
        googleRevenue,
        trueRoas,
        blendedRoas,
        totalLeadsCount: totalLeadsCount || 0,
        totalOrdersCount: totalOrderCount,
        totalRevenue,

        // Efficiency
        costPerLead,
        costPerCustomer,
        leadToCustomerRate,
        avgOrderValue,
        googleRevenuePercent: totalRevenue > 0 ? (googleRevenue / totalRevenue) * 100 : 0,

        // Trends (recent 3mo vs prior 3mo)
        recent3Spend,
        prior3Spend,
        recent3Roas,
        prior3Roas,
        spendTrend,
        roasTrend,

        // Peak/trough
        bestMonth: bestMonth ? { month: bestMonth.month, roas: bestMonth.googleRoas } : null,
        worstMonth: worstMonth ? { month: worstMonth.month, roas: worstMonth.googleRoas } : null,
      },

      // Detailed data
      campaigns: campaigns.slice(0, 25),
      campaignTypes,
      keywords: {
        topPerformers,
        budgetDrains,
        totalKeywords: keywords.length,
      },
      monthly,
      sourceMedium,
    })

  } catch (error) {
    console.error('[Ad Spend Efficiency] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
