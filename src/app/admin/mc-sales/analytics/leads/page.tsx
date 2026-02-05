'use client'

/**
 * Leads Analytics Dashboard
 * 
 * Shows lead performance metrics, conversion rates, and attribution data
 * Works with both legacy_leads and future new leads
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Target,
  Camera,
  UserCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Search
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LeadsByInterest {
  interest: string
  total_leads: number
  converted_leads: number
  conversion_rate_pct: number
  total_revenue: number
  avg_revenue_per_lead: number
}

interface LeadsByLandingPage {
  landing_page: string
  total_leads: number
  converted_leads: number
  conversion_rate_pct: number
  total_revenue: number
}

interface MonthlyLeads {
  month: string
  total_leads: number
  converted_leads: number
  conversion_rate_pct: number
  total_revenue: number
}

interface LeadConversion {
  lead_id: string
  email: string
  first_name: string | null
  last_name: string | null
  lead_date: string
  interest: string | null
  landing_page: string | null
  converted: boolean
  days_to_conversion: number | null
  order_count: number
  total_revenue: number
}

export default function LeadsAnalyticsDashboard() {
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Summary stats
  const [totalLeads, setTotalLeads] = useState(0)
  const [convertedLeads, setConvertedLeads] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [avgDaysToConvert, setAvgDaysToConvert] = useState(0)
  
  // Breakdown data
  const [interestData, setInterestData] = useState<LeadsByInterest[]>([])
  const [landingPageData, setLandingPageData] = useState<LeadsByLandingPage[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyLeads[]>([])
  const [recentConversions, setRecentConversions] = useState<LeadConversion[]>([])
  
  // Photo/returning stats
  const [photoStats, setPhotoStats] = useState({ with: 0, without: 0, withConverted: 0, withoutConverted: 0 })
  const [returningStats, setReturningStats] = useState({ total: 0, converted: 0, revenue: 0 })
  const [gclidStats, setGclidStats] = useState({ total: 0, byClickId: 0, converted: 0, orders: 0, revenue: 0 })
  const [fbclidStats, setFbclidStats] = useState({ total: 0, byClickId: 0, converted: 0, orders: 0, revenue: 0 })
  const [leadSourceStats, setLeadSourceStats] = useState<Record<string, number>>({})
  
  // UI state
  const [showAllPages, setShowAllPages] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch interest breakdown
      const { data: interests, error: interestError } = await supabase
        .from('legacy_lead_by_interest')
        .select('*')
        .order('total_leads', { ascending: false })
      
      if (interestError) throw interestError
      setInterestData(interests || [])
      
      // Calculate totals from interest data
      const totals = (interests || []).reduce((acc, i) => ({
        leads: acc.leads + (i.total_leads || 0),
        converted: acc.converted + (i.converted_leads || 0),
        revenue: acc.revenue + Number(i.total_revenue || 0)
      }), { leads: 0, converted: 0, revenue: 0 })
      
      setTotalLeads(totals.leads)
      setConvertedLeads(totals.converted)
      setTotalRevenue(totals.revenue)
      
      // Fetch landing page breakdown
      const { data: pages, error: pagesError } = await supabase
        .from('legacy_lead_by_landing_page')
        .select('*')
        .order('total_leads', { ascending: false })
        .limit(50)
      
      if (pagesError) throw pagesError
      setLandingPageData(pages || [])
      
      // Fetch monthly data
      const { data: monthly, error: monthlyError } = await supabase
        .from('legacy_lead_monthly')
        .select('*')
        .order('month', { ascending: false })
        .limit(24)
      
      if (monthlyError) throw monthlyError
      setMonthlyData((monthly || []).reverse())
      
      // Fetch recent conversions
      const { data: conversions, error: convError } = await supabase
        .from('legacy_lead_conversion')
        .select('*')
        .eq('converted', true)
        .order('first_order_date', { ascending: false })
        .limit(20)
      
      if (convError) throw convError
      setRecentConversions(conversions || [])
      
      // Calculate avg days to convert
      const validDays = (conversions || [])
        .filter(c => c.days_to_conversion !== null && c.days_to_conversion >= 0)
        .map(c => c.days_to_conversion as number)
      
      if (validDays.length > 0) {
        setAvgDaysToConvert(validDays.reduce((sum, d) => sum + d, 0) / validDays.length)
      }
      
      // Fetch photo upload stats
      const { count: withPhotos, error: photoErr } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('has_photos', true)
      
      if (photoErr) console.error('Photo query error:', photoErr)
      
      const { count: withoutPhotos } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('has_photos', false)
      
      setPhotoStats(prev => ({ ...prev, with: withPhotos || 0, without: withoutPhotos || 0 }))
      
      // Fetch returning customer stats
      const { count: returningCount, error: retErr } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('worked_with_before', true)
      
      if (retErr) console.error('Returning query error:', retErr)
      setReturningStats(prev => ({ ...prev, total: returningCount || 0 }))
      
      // Fetch lead source stats
      const { count: googleAdsCount, error: gErr } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('lead_source', 'google_ads')
      
      if (gErr) console.error('Google Ads query error:', gErr)
      
      const { count: facebookAdsCount, error: fbErr } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('lead_source', 'facebook_ads')
      
      if (fbErr) console.error('Facebook Ads query error:', fbErr)
      
      const { count: organicCount } = await supabase
        .from('legacy_leads')
        .select('*', { count: 'exact', head: true })
        .eq('lead_source', 'organic')
      
      console.log('Lead source counts:', { googleAdsCount, facebookAdsCount, organicCount })
      
      setLeadSourceStats({
        google_ads: googleAdsCount || 0,
        facebook_ads: facebookAdsCount || 0,
        organic: organicCount || 0
      })
      
      // Fetch actual GCLID count and conversion data (paginate to get all)
      let gclidLeads: { email: string }[] = []
      let gclidOffset = 0
      while (true) {
        const { data, error } = await supabase
          .from('legacy_leads')
          .select('email')
          .not('gclid', 'is', null)
          .neq('gclid', '')
          .range(gclidOffset, gclidOffset + 999)
        
        if (error || !data || data.length === 0) break
        gclidLeads.push(...data)
        if (data.length < 1000) break
        gclidOffset += 1000
      }
      
      const gclidEmails = [...new Set(gclidLeads.map(l => l.email.toLowerCase()))]
      
      // Get GCLID orders (batch query)
      let gclidOrders: { email: string; total: number }[] = []
      for (let i = 0; i < gclidEmails.length; i += 200) {
        const batch = gclidEmails.slice(i, i + 200)
        const { data } = await supabase.from('legacy_orders').select('email, total').in('email', batch)
        if (data) gclidOrders.push(...data)
      }
      
      const gclidRevenue = gclidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)
      const gclidCustomers = new Set(gclidOrders.map(o => o.email.toLowerCase())).size
      
      // Fetch actual FBCLID count and conversion data (paginate to get all)
      let fbclidLeads: { email: string }[] = []
      let fbclidOffset = 0
      while (true) {
        const { data, error } = await supabase
          .from('legacy_leads')
          .select('email')
          .not('fbclid', 'is', null)
          .neq('fbclid', '')
          .range(fbclidOffset, fbclidOffset + 999)
        
        if (error || !data || data.length === 0) break
        fbclidLeads.push(...data)
        if (data.length < 1000) break
        fbclidOffset += 1000
      }
      
      const fbclidEmails = [...new Set(fbclidLeads.map(l => l.email.toLowerCase()))]
      
      // Get FBCLID orders (batch query)
      let fbclidOrders: { email: string; total: number }[] = []
      for (let i = 0; i < fbclidEmails.length; i += 200) {
        const batch = fbclidEmails.slice(i, i + 200)
        const { data } = await supabase.from('legacy_orders').select('email, total').in('email', batch)
        if (data) fbclidOrders.push(...data)
      }
      
      const fbclidRevenue = fbclidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)
      const fbclidCustomers = new Set(fbclidOrders.map(o => o.email.toLowerCase())).size
      
      console.log('Click ID stats:', { 
        gclid: { leads: gclidEmails.length, converted: gclidCustomers, orders: gclidOrders.length, revenue: gclidRevenue },
        fbclid: { leads: fbclidEmails.length, converted: fbclidCustomers, orders: fbclidOrders.length, revenue: fbclidRevenue }
      })
      
      setGclidStats({ 
        total: googleAdsCount || 0, 
        byClickId: gclidEmails.length, 
        converted: gclidCustomers,
        orders: gclidOrders.length,
        revenue: gclidRevenue 
      })
      setFbclidStats({ 
        total: facebookAdsCount || 0, 
        byClickId: fbclidEmails.length,
        converted: fbclidCustomers,
        orders: fbclidOrders.length,
        revenue: fbclidRevenue
      })
      
    } catch (err) {
      console.error('Error fetching leads data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100) : 0
  const avgRevenuePerLead = convertedLeads > 0 ? (totalRevenue / convertedLeads) : 0
  
  const displayedPages = showAllPages ? landingPageData : landingPageData.slice(0, 10)
  
  // Filter recent conversions by search
  const filteredConversions = recentConversions.filter(c => 
    !searchQuery || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.last_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/mc-sales/analytics"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leads Analytics</h1>
                <p className="text-gray-600 text-sm">Lead performance, conversion rates, and attribution</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-[#003365] text-white rounded-lg hover:bg-[#002244] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600 text-sm">Total Leads</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalLeads.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All time from Gravity Forms</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600 text-sm">Conversion Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">{convertedLeads.toLocaleString()} converted to orders</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-600 text-sm">Revenue from Leads</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-sm text-gray-500 mt-1">${avgRevenuePerLead.toFixed(0)} avg per converted lead</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-600 text-sm">Avg Days to Convert</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgDaysToConvert.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">From lead to first order</p>
          </div>
        </div>

        {/* Attribution Signals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Target className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Google Ads (GCLID)</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${gclidStats.revenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{gclidStats.byClickId.toLocaleString()} leads → {gclidStats.converted} converted</p>
            <p className="text-xs text-gray-400 mt-2">
              {gclidStats.orders} orders • {((gclidStats.converted / (gclidStats.byClickId || 1)) * 100).toFixed(1)}% conv rate
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Facebook Ads (FBCLID)</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${fbclidStats.revenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{fbclidStats.byClickId.toLocaleString()} leads → {fbclidStats.converted} converted</p>
            <p className="text-xs text-gray-400 mt-2">
              {fbclidStats.orders} orders • {((fbclidStats.converted / (fbclidStats.byClickId || 1)) * 100).toFixed(1)}% conv rate
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Camera className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Photo Uploads</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{photoStats.with.toLocaleString()}</p>
            <p className="text-sm text-gray-500">leads uploaded photos</p>
            <p className="text-xs text-gray-400 mt-2">
              {((photoStats.with / (totalLeads || 1)) * 100).toFixed(1)}% of all leads
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Returning Customers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{returningStats.total.toLocaleString()}</p>
            <p className="text-sm text-gray-500">leads from previous customers</p>
            <p className="text-xs text-gray-400 mt-2">
              {((returningStats.total / (totalLeads || 1)) * 100).toFixed(1)}% of all leads
            </p>
          </div>
        </div>

        {/* Interest Type Performance */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance by Interest Type</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Leads</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Converted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Conv Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg/Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {interestData.map((item) => (
                  <tr key={item.interest} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.interest === 'curtains' ? 'bg-green-100 text-green-800' :
                        item.interest === 'vinyl' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.interest || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{(item.total_leads || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{(item.converted_leads || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${
                        (item.conversion_rate_pct || 0) >= 50 ? 'text-green-600' :
                        (item.conversion_rate_pct || 0) >= 35 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(item.conversion_rate_pct || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">${Number(item.total_revenue || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      ${(item.converted_leads > 0 ? Number(item.total_revenue || 0) / item.converted_leads : 0).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Landing Page Performance */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Landing Pages</h2>
            <button
              onClick={() => setShowAllPages(!showAllPages)}
              className="flex items-center gap-1 text-sm text-[#003365] hover:text-[#002244]"
            >
              {showAllPages ? 'Show Less' : `Show All (${landingPageData.length})`}
              {showAllPages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Landing Page</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Leads</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Converted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Conv Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 font-mono">{page.landing_page || '/'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{(page.total_leads || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{(page.converted_leads || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${
                        (page.conversion_rate_pct || 0) >= 50 ? 'text-green-600' :
                        (page.conversion_rate_pct || 0) >= 35 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(page.conversion_rate_pct || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">${Number(page.total_revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Lead Trends</h2>
          </div>
          <div className="p-6">
            {/* Simple bar visualization */}
            <div className="space-y-2">
              {monthlyData.slice(-12).map((month) => {
                const maxLeads = Math.max(...monthlyData.map(m => m.total_leads || 0))
                const barWidth = maxLeads > 0 ? ((month.total_leads || 0) / maxLeads) * 100 : 0
                
                return (
                  <div key={month.month} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-20 font-mono">{month.month}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#003365] to-[#406517] rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 20 && (
                            <span className="text-xs text-white font-medium">{(month.total_leads || 0).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      {barWidth <= 20 && (
                        <span className="text-xs text-gray-600 w-12">{(month.total_leads || 0).toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">{(month.conversion_rate_pct || 0).toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Conversions</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Days to Convert</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConversions.map((conv) => (
                  <tr key={conv.lead_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {conv.first_name || conv.last_name 
                            ? `${conv.first_name || ''} ${conv.last_name || ''}`.trim()
                            : 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{conv.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(conv.lead_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        conv.interest === 'curtains' ? 'bg-green-100 text-green-800' :
                        conv.interest === 'vinyl' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conv.interest || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${
                        (conv.days_to_conversion || 0) <= 7 ? 'text-green-600' :
                        (conv.days_to_conversion || 0) <= 30 ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {conv.days_to_conversion ?? '-'} days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{conv.order_count}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${Number(conv.total_revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
