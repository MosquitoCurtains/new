import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/google-ads/attribution
 * 
 * Calculate true Google Ads ROAS by matching:
 * 1. Google Ads spend (from google_ads_campaigns)
 * 2. Leads with GCLID (from legacy_leads)
 * 3. Orders from those leads (from legacy_orders via email match)
 * 
 * This gives accurate Google-attributed revenue.
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
    
    // 1. Get total Google Ads spend
    let totalSpend = 0
    let offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('google_ads_campaigns')
        .select('cost_micros, date')
        .gte('date', dateStr)
        .range(offset, offset + 999)
      
      if (error) throw error
      if (!data || data.length === 0) break
      data.forEach(row => { totalSpend += row.cost_micros / 1_000_000 })
      if (data.length < 1000) break
      offset += 1000
    }
    
    // 2. Get all leads with GCLID (Google-attributed)
    let googleLeads: { email: string; entry_date: string; gclid: string }[] = []
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_leads')
        .select('email, entry_date, gclid')
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
    
    // Get unique emails (case-insensitive)
    const googleEmails = [...new Set(googleLeads.map(l => l.email.toLowerCase()))]
    
    // 3. Get orders from Google-attributed leads
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
    
    // Calculate Google-attributed revenue
    const googleRevenue = googleOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)
    const googleCustomers = new Set(googleOrders.map(o => o.email.toLowerCase())).size
    
    // 4. Get ALL leads for comparison
    const { count: totalLeadsCount } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .gte('entry_date', dateStr)
    
    // 5. Get ALL orders for comparison
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
    
    // 6. Calculate monthly breakdown
    const monthlyMap: Record<string, {
      spend: number
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
      monthlyMap[month] = { spend: 0, googleLeads: 0, googleOrders: 0, googleRevenue: 0, allRevenue: 0 }
    }
    
    // Aggregate spend by month
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('google_ads_campaigns')
        .select('cost_micros, date')
        .gte('date', dateStr)
        .range(offset, offset + 999)
      
      if (error) throw error
      if (!data || data.length === 0) break
      data.forEach(row => {
        const month = row.date.substring(0, 7)
        if (monthlyMap[month]) {
          monthlyMap[month].spend += row.cost_micros / 1_000_000
        }
      })
      if (data.length < 1000) break
      offset += 1000
    }
    
    // Aggregate Google leads by month
    googleLeads.forEach(lead => {
      const month = lead.entry_date.substring(0, 10).substring(0, 7)
      if (monthlyMap[month]) {
        monthlyMap[month].googleLeads++
      }
    })
    
    // Aggregate Google orders/revenue by month
    googleOrders.forEach(order => {
      if (order.order_date) {
        const month = order.order_date.substring(0, 7)
        if (monthlyMap[month]) {
          monthlyMap[month].googleOrders++
          monthlyMap[month].googleRevenue += Number(order.total || 0)
        }
      }
    })
    
    // Aggregate all revenue by month
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
    
    // Format monthly data
    const monthly = Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        ...data,
        googleRoas: data.spend > 0 ? data.googleRevenue / data.spend : null,
        allRoas: data.spend > 0 ? data.allRevenue / data.spend : null,
        googleRevenuePercent: data.allRevenue > 0 ? (data.googleRevenue / data.allRevenue) * 100 : 0
      }))
      .filter(m => m.spend > 0 || m.googleRevenue > 0 || m.allRevenue > 0)
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 24)
    
    return NextResponse.json({
      success: true,
      days,
      summary: {
        // Google Ads spend
        googleAdsSpend: totalSpend,
        
        // Google-attributed metrics
        googleLeadsCount: googleLeads.length,
        googleCustomersCount: googleCustomers,
        googleOrdersCount: googleOrders.length,
        googleRevenue: googleRevenue,
        googleRoas: totalSpend > 0 ? googleRevenue / totalSpend : 0,
        
        // Total metrics (for comparison)
        totalLeadsCount: totalLeadsCount || 0,
        totalOrdersCount: totalOrderCount,
        totalRevenue: totalRevenue,
        allRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
        
        // Percentages
        googleLeadsPercent: (totalLeadsCount || 0) > 0 
          ? (googleLeads.length / (totalLeadsCount || 1)) * 100 
          : 0,
        googleRevenuePercent: totalRevenue > 0 
          ? (googleRevenue / totalRevenue) * 100 
          : 0,
        
        // Conversion metrics
        googleLeadToOrderRate: googleLeads.length > 0 
          ? (googleCustomers / googleLeads.length) * 100 
          : 0,
        googleAvgOrderValue: googleOrders.length > 0 
          ? googleRevenue / googleOrders.length 
          : 0,
        costPerGoogleLead: googleLeads.length > 0 
          ? totalSpend / googleLeads.length 
          : 0,
        costPerGoogleCustomer: googleCustomers > 0 
          ? totalSpend / googleCustomers 
          : 0,
      },
      monthly
    })
    
  } catch (error) {
    console.error('[Google Ads Attribution] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
