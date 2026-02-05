'use client'

/**
 * Attribution Analytics Dashboard
 * 
 * Campaign performance, traffic attribution, and funnel metrics.
 * Pulls real data from the journey tracking tables.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  BarChart3,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'
import { createClient } from '@/lib/supabase/client'

// =============================================================================
// TYPES
// =============================================================================

interface CampaignData {
  source: string
  medium: string
  device: string
  orders: number
  revenue: number
  avg_order_value: number
  unique_customers: number
}

interface FunnelData {
  stage: string
  stage_order: number
  count: number
  conversion_rate: number
}

interface SyncLog {
  id: string
  sync_date: string
  status: string
  records_synced: number
  created_at: string
}

interface SalespersonData {
  salesperson_username: string
  orders: number
  revenue: number
  avg_order_value: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AttributionDashboardPage() {
  const supabase = createClient()
  const [campaignData, setCampaignData] = useState<CampaignData[]>([])
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [salespersonData, setSalespersonData] = useState<SalespersonData[]>([])
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch from legacy attribution_analysis view (real order data!)
      // First get ALL rows for totals, then limit display
      let allCampaigns: CampaignData[] = []
      let offset = 0
      while (true) {
        const { data, error } = await supabase
          .from('attribution_analysis')
          .select('*')
          .order('revenue', { ascending: false })
          .range(offset, offset + 999)
        
        if (error) throw error
        if (!data || data.length === 0) break
        allCampaigns.push(...data)
        if (data.length < 1000) break
        offset += 1000
      }
      
      // Calculate totals from ALL data
      const totalsFromCampaigns = allCampaigns.reduce((acc, c) => ({
        orders: acc.orders + (c.orders || 0),
        revenue: acc.revenue + Number(c.revenue || 0)
      }), { orders: 0, revenue: 0 })
      setTotalOrders(totalsFromCampaigns.orders)
      setTotalRevenue(totalsFromCampaigns.revenue)
      
      // Display top 50 for the table
      setCampaignData(allCampaigns.slice(0, 50))
      
      // Build funnel from legacy_orders aggregates
      const { count: totalOrdersCount } = await supabase
        .from('legacy_orders')
        .select('*', { count: 'exact', head: true })
      
      const { count: ordersWithUtm } = await supabase
        .from('legacy_orders')
        .select('*', { count: 'exact', head: true })
        .not('utm_source', 'is', null)
      
      const { count: ordersWithSession } = await supabase
        .from('legacy_orders')
        .select('*', { count: 'exact', head: true })
        .not('session_entry', 'is', null)
      
      const { count: paidOrders } = await supabase
        .from('legacy_orders')
        .select('*', { count: 'exact', head: true })
        .in('utm_medium', ['cpc', 'paid', 'ppc'])
      
      const { count: organicOrders } = await supabase
        .from('legacy_orders')
        .select('*', { count: 'exact', head: true })
        .eq('utm_medium', 'organic')
      
      const funnelFromLegacy: FunnelData[] = [
        { stage: 'total_orders', stage_order: 1, count: totalOrdersCount || 0, conversion_rate: 100 },
        { stage: 'with_session_data', stage_order: 2, count: ordersWithSession || 0, conversion_rate: totalOrdersCount ? ((ordersWithSession || 0) / totalOrdersCount * 100) : 0 },
        { stage: 'with_utm_tracking', stage_order: 3, count: ordersWithUtm || 0, conversion_rate: totalOrdersCount ? ((ordersWithUtm || 0) / totalOrdersCount * 100) : 0 },
        { stage: 'from_paid_ads', stage_order: 4, count: paidOrders || 0, conversion_rate: totalOrdersCount ? ((paidOrders || 0) / totalOrdersCount * 100) : 0 },
        { stage: 'from_organic_search', stage_order: 5, count: organicOrders || 0, conversion_rate: totalOrdersCount ? ((organicOrders || 0) / totalOrdersCount * 100) : 0 },
      ]
      setFunnelData(funnelFromLegacy)
      
      // Fetch salesperson performance from legacy_orders (paginate to get all)
      let salesOrders: { salesperson_username: string; total: number }[] = []
      let salesOffset = 0
      while (true) {
        const { data, error } = await supabase
          .from('legacy_orders')
          .select('salesperson_username, total')
          .not('salesperson_username', 'is', null)
          .range(salesOffset, salesOffset + 999)
        
        if (error || !data || data.length === 0) break
        salesOrders.push(...data)
        if (data.length < 1000) break
        salesOffset += 1000
      }
      
      const salesAgg: Record<string, { orders: number; revenue: number }> = {}
      salesOrders.forEach(o => {
        const sp = o.salesperson_username
        if (!salesAgg[sp]) salesAgg[sp] = { orders: 0, revenue: 0 }
        salesAgg[sp].orders++
        salesAgg[sp].revenue += Number(o.total || 0)
      })
      
      const salespeople = Object.entries(salesAgg)
        .map(([username, data]) => ({
          salesperson_username: username,
          orders: data.orders,
          revenue: data.revenue,
          avg_order_value: data.orders > 0 ? data.revenue / data.orders : 0
        }))
        .sort((a, b) => b.revenue - a.revenue)
      setSalespersonData(salespeople)
      
      // Fetch recent GA4 sync logs
      const { data: logs, error: logsError } = await supabase
        .from('analytics_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (logsError) throw logsError
      setSyncLogs(logs || [])
      
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const triggerSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 1 })
      })
      
      if (!response.ok) throw new Error('Sync failed')
      
      // Refresh data after sync
      await fetchData()
      
    } catch (err) {
      console.error('Sync error:', err)
      setError('Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }

  // Calculate totals from state
  const totals = {
    orders: totalOrders,
    revenue: totalRevenue,
    uniqueCustomers: campaignData.reduce((acc, c) => acc + (c.unique_customers || 0), 0),
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Heading level={1} className="!mb-1">Attribution Analytics</Heading>
              <Text className="text-gray-600">
                Campaign performance and customer journey funnel
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={triggerSync}
                disabled={isSyncing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync GA4'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/mc-sales/analytics/leads">
                  <Target className="w-4 h-4 mr-2" />
                  Leads Analytics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/mc-sales/analytics/waterfall">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Journeys
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <Card className="!p-4 !bg-red-50 !border-red-200">
            <Text className="text-red-700 !mb-0">{error}</Text>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <Card className="!p-8">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
              <Text className="text-gray-500 !mb-0">Loading analytics data...</Text>
            </div>
          </Card>
        ) : (
          <>
            {/* KPI Cards */}
            <section>
              <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#406517]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#406517]" />
                    </div>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {totals.orders.toLocaleString()}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Orders</Text>
                </Card>
                
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003365]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#003365]" />
                    </div>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {totals.uniqueCustomers.toLocaleString()}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">Unique Customers</Text>
                </Card>
                
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#B30158]/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#B30158]" />
                    </div>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    ${(totals.revenue / 1000000).toFixed(1)}M
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Revenue</Text>
                </Card>
                
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFA501]/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#FFA501]" />
                    </div>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    ${totals.avgOrderValue.toFixed(0)}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">Avg Order Value</Text>
                </Card>
              </Grid>
            </section>

            {/* Funnel */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-[#406517]" />
                  <Heading level={3} className="!mb-0">Order Data Quality (All Orders)</Heading>
                </div>
                
                {funnelData.length > 0 ? (
                  <div className="space-y-4">
                    {funnelData.map((stage, index) => {
                      const maxCount = Math.max(...funnelData.map(s => s.count || 0))
                      const width = maxCount > 0 ? ((stage.count || 0) / maxCount) * 100 : 0
                      
                      return (
                        <div key={stage.stage}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className="!bg-gray-100 !text-gray-700 !border-gray-200">
                                {index + 1}
                              </Badge>
                              <Text className="font-medium text-gray-900 !mb-0 capitalize">
                                {stage.stage.replace('_', ' ')}
                              </Text>
                            </div>
                            <div className="flex items-center gap-4">
                              <Text className="text-gray-700 !mb-0">
                                {(stage.count || 0).toLocaleString()}
                              </Text>
                              <Text className="text-sm text-gray-500 !mb-0 w-16 text-right">
                                {(stage.conversion_rate || 0).toFixed(1)}%
                              </Text>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#406517] rounded-full transition-all"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          {index < funnelData.length - 1 && (
                            <div className="flex justify-center py-1">
                              <ArrowDown className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-8 !mb-0">
                    No funnel data available yet. Start tracking visitors!
                  </Text>
                )}
              </Card>
            </section>

            {/* Attribution Table - Source/Medium/Device */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#003365]" />
                    <Heading level={3} className="!mb-0">Attribution by Source (All Historical Orders)</Heading>
                  </div>
                </div>
                
                {campaignData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Source</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Medium</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Device</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">Orders</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">Revenue</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">AOV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {campaignData.map((campaign, index) => (
                          <tr key={`${campaign.source}-${campaign.medium}-${campaign.device}-${index}`}>
                            <td className="py-3 text-gray-900 font-medium">
                              {campaign.source || '(direct)'}
                            </td>
                            <td className="py-3 text-gray-700">
                              {campaign.medium || '(none)'}
                            </td>
                            <td className="py-3 text-gray-500">
                              {campaign.device || 'Unknown'}
                            </td>
                            <td className="py-3 text-right text-gray-700">
                              {(campaign.orders || 0).toLocaleString()}
                            </td>
                            <td className="py-3 text-right font-medium text-[#406517]">
                              ${(Number(campaign.revenue || 0) / 1000).toFixed(1)}k
                            </td>
                            <td className="py-3 text-right text-gray-500">
                              ${Number(campaign.avg_order_value || 0).toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-8 !mb-0">
                    No attribution data available.
                  </Text>
                )}
              </Card>
            </section>

            {/* Salesperson Performance */}
            {salespersonData.length > 0 && (
              <section>
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#B30158]" />
                    <Heading level={3} className="!mb-0">Salesperson Performance</Heading>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Salesperson</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">Orders</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">Revenue</th>
                          <th className="pb-3 text-right text-sm font-medium text-gray-500">AOV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {salespersonData.filter(sp => sp.salesperson_username && sp.salesperson_username !== '0.00').map((sp) => (
                          <tr key={sp.salesperson_username}>
                            <td className="py-3 text-gray-900 font-medium">
                              {sp.salesperson_username.replace('_', ' ')}
                            </td>
                            <td className="py-3 text-right text-gray-700">
                              {sp.orders.toLocaleString()}
                            </td>
                            <td className="py-3 text-right font-medium text-[#406517]">
                              ${(sp.revenue / 1000).toFixed(0)}k
                            </td>
                            <td className="py-3 text-right text-gray-500">
                              ${sp.avg_order_value.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            )}

            {/* Sync Status */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-5 h-5 text-gray-500" />
                  <Heading level={3} className="!mb-0">GA4 Sync History</Heading>
                </div>
                
                {syncLogs.length > 0 ? (
                  <div className="space-y-2">
                    {syncLogs.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={
                            log.status === 'success' 
                              ? '!bg-green-50 !text-green-700 !border-green-200' 
                              : log.status === 'failed'
                                ? '!bg-red-50 !text-red-700 !border-red-200'
                                : '!bg-yellow-50 !text-yellow-700 !border-yellow-200'
                          }>
                            {log.status}
                          </Badge>
                          <Text className="text-gray-700 !mb-0">
                            {new Date(log.sync_date).toLocaleDateString()}
                          </Text>
                        </div>
                        <Text className="text-sm text-gray-500 !mb-0">
                          {log.records_synced.toLocaleString()} records
                        </Text>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-4 !mb-0">
                    No sync history yet
                  </Text>
                )}
              </Card>
            </section>
          </>
        )}
      </Stack>
    </Container>
  )
}
