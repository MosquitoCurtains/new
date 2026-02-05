'use client'

/**
 * Google Ads Performance & True ROAS Dashboard
 * 
 * Shows campaign spend and TRUE Google-attributed revenue by matching:
 * - Google Ads spend (from API sync)
 * - Leads with GCLID (Google Click ID)
 * - Orders from those leads
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointer,
  Eye,
  Target,
  RefreshCw,
  Calendar,
  ArrowLeft,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

interface AttributionSummary {
  googleAdsSpend: number
  googleLeadsCount: number
  googleCustomersCount: number
  googleOrdersCount: number
  googleRevenue: number
  googleRoas: number
  totalLeadsCount: number
  totalOrdersCount: number
  totalRevenue: number
  allRoas: number
  googleLeadsPercent: number
  googleRevenuePercent: number
  googleLeadToOrderRate: number
  googleAvgOrderValue: number
  costPerGoogleLead: number
  costPerGoogleCustomer: number
}

interface MonthlyData {
  month: string
  spend: number
  googleLeads: number
  googleOrders: number
  googleRevenue: number
  allRevenue: number
  googleRoas: number | null
  allRoas: number | null
  googleRevenuePercent: number
}

interface AttributionResponse {
  success: boolean
  days: number
  summary: AttributionSummary
  monthly: MonthlyData[]
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function GoogleAdsDashboardPage() {
  const [data, setData] = useState<AttributionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'30' | '90' | '365' | '1095'>('365')

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/google-ads/attribution?days=${dateRange}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      setData(result)
    } catch (err) {
      console.error('Error fetching Google Ads data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const triggerSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/google-ads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 7 })
      })
      
      if (!response.ok) throw new Error('Sync failed')
      await fetchData()
    } catch (err) {
      console.error('Sync error:', err)
      setError('Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }

  const summary = data?.summary

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
                <h1 className="text-2xl font-bold text-gray-900">Google Ads Attribution</h1>
                <p className="text-gray-600 text-sm">
                  True ROAS based on GCLID-tracked leads → orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['30', '90', '365', '1095'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      dateRange === range
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '1095' ? '3yr' : range === '365' ? '1yr' : `${range}d`}
                  </button>
                ))}
              </div>
              <button 
                onClick={triggerSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-[#003365] text-white rounded-lg hover:bg-[#002244] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ROAS Comparison Banner */}
        {summary && (
          <div className={`rounded-xl p-6 ${
            summary.googleRoas >= 1 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {summary.googleRoas >= 1 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">True Google Ads ROAS</h2>
                </div>
                <p className="text-sm text-gray-600">
                  {summary.googleRoas >= 1 
                    ? 'Google Ads is profitable! Revenue exceeds spend.'
                    : 'Google Ads is losing money. Revenue is less than spend.'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-5xl font-bold ${summary.googleRoas >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.googleRoas.toFixed(2)}x
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  vs {summary.allRoas.toFixed(1)}x if counting all revenue
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards - Spend vs Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-gray-600 text-sm">Google Ads Spend</span>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ${(summary?.googleAdsSpend || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total ad spend in period</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600 text-sm">Google-Attributed Revenue</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${(summary?.googleRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {(summary?.googleRevenuePercent || 0).toFixed(1)}% of ${((summary?.totalRevenue || 0) / 1000000).toFixed(1)}M total
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-600 text-sm">Cost per Customer</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${(summary?.costPerGoogleCustomer || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ${(summary?.costPerGoogleLead || 0).toFixed(0)} per lead
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600 text-sm">Avg Order Value</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${(summary?.googleAvgOrderValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">From Google customers</p>
          </div>
        </div>

        {/* Funnel Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Google Ads Funnel</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {((summary?.totalLeadsCount || 0) / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-1 w-full bg-gray-200 relative">
                <div 
                  className="h-1 bg-blue-500 absolute left-0"
                  style={{ width: `${summary?.googleLeadsPercent || 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {(summary?.googleLeadsCount || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Google Leads</p>
              <p className="text-xs text-gray-400">{(summary?.googleLeadsPercent || 0).toFixed(1)}%</p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-1 w-full bg-gray-200 relative">
                <div 
                  className="h-1 bg-green-500 absolute left-0"
                  style={{ width: `${summary?.googleLeadToOrderRate || 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {(summary?.googleCustomersCount || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Google Customers</p>
              <p className="text-xs text-gray-400">
                {(summary?.googleLeadToOrderRate || 0).toFixed(1)}% conversion
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Attribution Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#406517]" />
              <h2 className="text-lg font-semibold text-gray-900">Monthly Google Ads Attribution</h2>
            </div>
          </div>

          {data?.monthly && data.monthly.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ad Spend</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Google Leads</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Google Orders</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Google Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Google ROAS</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.monthly.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-red-600">
                        ${month.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {month.googleLeads.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {month.googleOrders}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">
                        ${month.googleRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {month.googleRoas !== null ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            month.googleRoas >= 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {month.googleRoas.toFixed(2)}x
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        {month.googleRevenuePercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No monthly data available
            </div>
          )}
        </div>

        {/* Insight Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How This Works</h3>
          <p className="text-sm text-blue-800 mb-3">
            This dashboard tracks <strong>true Google Ads attribution</strong> by:
          </p>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Syncing daily ad spend from Google Ads API</li>
            <li>Matching leads that have a <strong>GCLID</strong> (Google Click ID) in their form submission</li>
            <li>Finding orders placed by those lead emails</li>
            <li>Calculating ROAS only from that Google-attributed revenue</li>
          </ol>
          <p className="text-sm text-blue-600 mt-3">
            Note: This is a conservative measure. Some Google customers may convert without GCLID tracking (phone calls, direct visits later, etc.)
          </p>
        </div>
      </div>
    </div>
  )
}
