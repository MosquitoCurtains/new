import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/analytics/attribution-audit
 * 
 * Audit legacy data to see what attribution signals exist
 */
export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Total leads
    const { count: totalLeads } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
    
    // Leads with GCLID
    const { count: withGclid } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .not('gclid', 'is', null)
      .neq('gclid', '')
    
    // Leads with FBCLID
    const { count: withFbclid } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .not('fbclid', 'is', null)
      .neq('fbclid', '')
    
    // Leads with source_url
    const { count: withSourceUrl } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .not('source_url', 'is', null)
      .neq('source_url', '')
    
    // Leads with landing_page
    const { count: withLandingPage } = await supabase
      .from('legacy_leads')
      .select('*', { count: 'exact', head: true })
      .not('landing_page', 'is', null)
      .neq('landing_page', '')
    
    // Sample source_urls to see what data looks like
    const { data: sampleUrls } = await supabase
      .from('legacy_leads')
      .select('source_url')
      .not('source_url', 'is', null)
      .neq('source_url', '')
      .limit(20)
    
    // Check for UTM params in source_url
    let withUtmSource = 0
    let withUtmMedium = 0
    let withUtmCampaign = 0
    
    // Paginate through all leads to check UTM params
    let offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_leads')
        .select('source_url')
        .not('source_url', 'is', null)
        .range(offset, offset + 999)
      
      if (error || !data || data.length === 0) break
      
      data.forEach(row => {
        const url = row.source_url || ''
        if (url.includes('utm_source=')) withUtmSource++
        if (url.includes('utm_medium=')) withUtmMedium++
        if (url.includes('utm_campaign=')) withUtmCampaign++
      })
      
      if (data.length < 1000) break
      offset += 1000
    }
    
    // Get unique referrer domains from source_url
    const referrerDomains: Record<string, number> = {}
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_leads')
        .select('source_url')
        .not('source_url', 'is', null)
        .range(offset, offset + 999)
      
      if (error || !data || data.length === 0) break
      
      data.forEach(row => {
        try {
          const url = new URL(row.source_url)
          // Check for referrer in query params
          const ref = url.searchParams.get('ref') || url.searchParams.get('referrer')
          if (ref) {
            referrerDomains[`ref:${ref}`] = (referrerDomains[`ref:${ref}`] || 0) + 1
          }
          // Extract utm_source
          const utmSource = url.searchParams.get('utm_source')
          if (utmSource) {
            referrerDomains[`utm:${utmSource}`] = (referrerDomains[`utm:${utmSource}`] || 0) + 1
          }
        } catch {
          // Invalid URL
        }
      })
      
      if (data.length < 1000) break
      offset += 1000
    }
    
    // Sort referrers by count
    const topReferrers = Object.entries(referrerDomains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
    
    // Total orders
    const { count: totalOrders } = await supabase
      .from('legacy_orders')
      .select('*', { count: 'exact', head: true })
    
    // Orders that match a lead email
    let ordersFromLeads = 0
    let ordersWithGclid = 0
    let ordersWithFbclid = 0
    
    // Get all lead emails with gclid
    const gclidEmails = new Set<string>()
    const fbclidEmails = new Set<string>()
    const allLeadEmails = new Set<string>()
    
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_leads')
        .select('email, gclid, fbclid')
        .range(offset, offset + 999)
      
      if (error || !data || data.length === 0) break
      
      data.forEach(row => {
        const email = row.email?.toLowerCase()
        if (email) {
          allLeadEmails.add(email)
          if (row.gclid) gclidEmails.add(email)
          if (row.fbclid) fbclidEmails.add(email)
        }
      })
      
      if (data.length < 1000) break
      offset += 1000
    }
    
    // Count orders by attribution
    offset = 0
    while (true) {
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('email')
        .range(offset, offset + 999)
      
      if (error || !data || data.length === 0) break
      
      data.forEach(row => {
        const email = row.email?.toLowerCase()
        if (email) {
          if (allLeadEmails.has(email)) ordersFromLeads++
          if (gclidEmails.has(email)) ordersWithGclid++
          if (fbclidEmails.has(email)) ordersWithFbclid++
        }
      })
      
      if (data.length < 1000) break
      offset += 1000
    }
    
    return NextResponse.json({
      success: true,
      leads: {
        total: totalLeads || 0,
        withGclid: withGclid || 0,
        withFbclid: withFbclid || 0,
        withSourceUrl: withSourceUrl || 0,
        withLandingPage: withLandingPage || 0,
        withUtmSource,
        withUtmMedium,
        withUtmCampaign,
      },
      orders: {
        total: totalOrders || 0,
        fromLeads: ordersFromLeads,
        fromGclidLeads: ordersWithGclid,
        fromFbclidLeads: ordersWithFbclid,
        directOrders: (totalOrders || 0) - ordersFromLeads,
      },
      topReferrers,
      sampleUrls: (sampleUrls || []).map(u => u.source_url).slice(0, 10),
    })
    
  } catch (error) {
    console.error('[Attribution Audit] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
