'use client'

/**
 * Ad Spend Efficiency - Meeting Prep Dashboard
 * 
 * Comprehensive analysis of Google Ads performance with actionable
 * insights for account rep meetings. Pulls live data from:
 * - Google Ads campaign/keyword spend
 * - GCLID-attributed leads → orders for true ROAS
 * - UTM source/medium attribution
 * - Monthly trend analysis
 */

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointer,
  Eye,
  Target,
  RefreshCw,
  ArrowLeft,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Zap,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Ban,
  Award,
  Lightbulb,
  Printer,
  Clock,
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
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface Summary {
  totalSpend: number
  totalClicks: number
  totalImpressions: number
  overallCtr: number
  overallCpc: number
  googleLeadsCount: number
  googleCustomersCount: number
  googleOrdersCount: number
  googleRevenue: number
  trueRoas: number
  blendedRoas: number
  totalLeadsCount: number
  totalOrdersCount: number
  totalRevenue: number
  costPerLead: number
  costPerCustomer: number
  leadToCustomerRate: number
  avgOrderValue: number
  googleRevenuePercent: number
  recent3Spend: number
  prior3Spend: number
  recent3Roas: number
  prior3Roas: number
  spendTrend: number
  roasTrend: number
  bestMonth: { month: string; roas: number | null } | null
  worstMonth: { month: string; roas: number | null } | null
}

interface Campaign {
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
  cost_per_conversion: number | null
  daily_avg_spend: number
  days_active: number
}

interface CampaignType {
  type: string
  spend: number
  clicks: number
  impressions: number
  conversions: number
  cpc: number
  ctr: number
  spend_percent: number
}

interface KeywordEntry {
  keyword_text: string
  match_type: string
  total_spend: number
  total_clicks: number
  total_impressions: number
  total_conversions: number
  ctr: number
  cpc: number
  cost_per_conversion: number | null
  avg_quality_score: number | null
}

interface MonthlyData {
  month: string
  spend: number
  clicks: number
  impressions: number
  conversions: number
  googleLeads: number
  googleOrders: number
  googleRevenue: number
  allRevenue: number
  cpc: number
  ctr: number
  costPerLead: number | null
  costPerCustomer: number | null
  googleRoas: number | null
  allRoas: number | null
  googleRevenuePercent: number
}

interface SourceMedium {
  source: string
  medium: string
  orders: number
  revenue: number
  customers: number
  avg_order_value: number
  revenue_percent: number
}

interface ApiResponse {
  success: boolean
  days: number
  dateRange: { start: string; end: string }
  summary: Summary
  campaigns: Campaign[]
  campaignTypes: CampaignType[]
  keywords: {
    topPerformers: KeywordEntry[]
    budgetDrains: KeywordEntry[]
    totalKeywords: number
  }
  monthly: MonthlyData[]
  sourceMedium: SourceMedium[]
}

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (compact && Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatMonth(monthStr: string): string {
  return new Date(monthStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function TrendBadge({ value, suffix = '%', inverse = false }: { value: number; suffix?: string; inverse?: boolean }) {
  const isPositive = inverse ? value < 0 : value > 0
  const isNeutral = Math.abs(value) < 1
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isNeutral
        ? 'bg-gray-100 text-gray-600'
        : isPositive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
    }`}>
      {!isNeutral && (isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdSpendEfficiencyPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'90' | '365' | '1095'>('365')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/ad-spend-efficiency?days=${dateRange}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      setData(result)
    } catch (err) {
      console.error('Error fetching ad spend efficiency data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const s = data?.summary

  // =========================================================================
  // GENERATE RECOMMENDATIONS
  // =========================================================================
  const recommendations: { priority: 'high' | 'medium' | 'low'; title: string; detail: string }[] = []

  if (s) {
    // ROAS-based recommendations
    if (s.trueRoas < 1) {
      recommendations.push({
        priority: 'high',
        title: 'Google Ads is unprofitable on true ROAS',
        detail: `True ROAS is ${s.trueRoas.toFixed(2)}x - you're spending ${formatCurrency(s.totalSpend)} but only generating ${formatCurrency(s.googleRevenue)} in GCLID-attributed revenue. The blended ROAS (${s.blendedRoas.toFixed(1)}x counting all revenue) suggests Google Ads may be assisting conversions that complete through other channels.`,
      })
    } else if (s.trueRoas < 3) {
      recommendations.push({
        priority: 'medium',
        title: 'ROAS is positive but has room for improvement',
        detail: `True ROAS of ${s.trueRoas.toFixed(2)}x means every $1 spent returns $${s.trueRoas.toFixed(2)}. Industry benchmarks suggest 3-5x ROAS for e-commerce. Focus on scaling top-performing campaigns while cutting underperformers.`,
      })
    }

    // Cost per lead analysis
    if (s.costPerLead > 100) {
      recommendations.push({
        priority: 'high',
        title: `High cost per lead: ${formatCurrency(s.costPerLead)}`,
        detail: `Each Google-attributed lead costs ${formatCurrency(s.costPerLead)}. With a ${formatPercent(s.leadToCustomerRate)} lead-to-customer rate, your cost per customer is ${formatCurrency(s.costPerCustomer)}. Consider tightening keyword targeting or improving landing page conversion rates.`,
      })
    }

    // Lead-to-customer conversion rate
    if (s.leadToCustomerRate < 10) {
      recommendations.push({
        priority: 'high',
        title: `Low lead-to-customer conversion: ${formatPercent(s.leadToCustomerRate)}`,
        detail: `Only ${formatPercent(s.leadToCustomerRate)} of Google leads convert to paying customers. Improving sales follow-up speed or lead quality targeting could dramatically improve efficiency.`,
      })
    } else if (s.leadToCustomerRate < 20) {
      recommendations.push({
        priority: 'medium',
        title: `Lead conversion rate at ${formatPercent(s.leadToCustomerRate)}`,
        detail: `${formatPercent(s.leadToCustomerRate)} of Google leads become customers. Faster follow-up on Google leads or better qualification could lift this rate and improve ROAS without increasing spend.`,
      })
    }

    // Spend trend analysis
    if (s.spendTrend > 20 && s.roasTrend < 0) {
      recommendations.push({
        priority: 'high',
        title: 'Spend is increasing while ROAS is declining',
        detail: `Spend is up ${formatPercent(s.spendTrend)} quarter-over-quarter but ROAS dropped ${formatPercent(Math.abs(s.roasTrend))}. This suggests diminishing returns from increased budget. Consider reallocating to higher-performing campaigns.`,
      })
    }

    if (s.roasTrend > 10) {
      recommendations.push({
        priority: 'low',
        title: 'ROAS is trending upward',
        detail: `ROAS improved ${formatPercent(s.roasTrend)} quarter-over-quarter. Recent optimizations are working. Consider testing incremental budget increases on top campaigns.`,
      })
    }

    // Budget drain keywords
    if (data?.keywords.budgetDrains && data.keywords.budgetDrains.length > 0) {
      const wastedSpend = data.keywords.budgetDrains.reduce((sum, k) => sum + k.total_spend, 0)
      recommendations.push({
        priority: 'high',
        title: `${formatCurrency(wastedSpend)} spent on low/no-conversion keywords`,
        detail: `${data.keywords.budgetDrains.length} keywords are burning budget with minimal conversions. Review the "Budget Drains" section below and consider adding as negatives or pausing.`,
      })
    }

    // CTR analysis
    if (s.overallCtr < 2) {
      recommendations.push({
        priority: 'medium',
        title: `Low click-through rate: ${formatPercent(s.overallCtr)}`,
        detail: `A CTR below 2% typically indicates ad copy or keyword relevance issues. Test new ad copy variations and review search term reports for irrelevant queries.`,
      })
    }

    // Google attribution percentage
    if (s.googleRevenuePercent < 10) {
      recommendations.push({
        priority: 'medium',
        title: `Google Ads drives only ${formatPercent(s.googleRevenuePercent)} of trackable revenue`,
        detail: `Most revenue comes from other channels. Ensure GCLID tracking is working properly and consider whether Google Ads budget could be better allocated to channels driving more revenue.`,
      })
    }

    // Seasonality insight
    if (s.bestMonth && s.worstMonth) {
      recommendations.push({
        priority: 'low',
        title: `Seasonal performance varies significantly`,
        detail: `Best ROAS month: ${formatMonth(s.bestMonth.month)} (${(s.bestMonth.roas || 0).toFixed(2)}x). Worst: ${formatMonth(s.worstMonth.month)} (${(s.worstMonth.roas || 0).toFixed(2)}x). Consider adjusting budget seasonally - increase spend during high-ROAS months and reduce during low periods.`,
      })
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // =========================================================================
  // RENDER
  // =========================================================================

  if (isLoading) {
    return (
      <Container size="xl">
        <Stack gap="lg" className="py-8">
          <div className="flex items-center justify-center gap-3 py-24">
            <Spinner size="lg" />
            <Text className="text-gray-500 !mb-0">Crunching ad spend data...</Text>
          </div>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg" className="py-2">
        {/* ============================================================= */}
        {/* HEADER                                                         */}
        {/* ============================================================= */}
        <section className="print:mb-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin/mc-sales/analytics/ads"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Heading level={1} className="!mb-0">Ad Spend Efficiency</Heading>
                    <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/20">
                      Meeting Prep
                    </Badge>
                  </div>
                  <Text className="text-gray-500 !mb-0 mt-1">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Account rep meeting - Thursday, Feb 19, 2026
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['90', '365', '1095'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      dateRange === range
                        ? 'bg-white text-gray-900 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '1095' ? '3yr' : range === '365' ? '1yr' : '90d'}
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <Card className="!p-4 !bg-red-50 !border-red-200">
            <Text className="text-red-700 !mb-0">{error}</Text>
          </Card>
        )}

        {s && data && (
          <>
            {/* ============================================================= */}
            {/* EXECUTIVE SUMMARY BANNER                                       */}
            {/* ============================================================= */}
            <section>
              <div className={`rounded-2xl p-6 border-2 ${
                s.trueRoas >= 3
                  ? 'bg-green-50 border-green-400'
                  : s.trueRoas >= 1
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {s.trueRoas >= 1 ? (
                        <CheckCircle className={`w-6 h-6 ${s.trueRoas >= 3 ? 'text-green-600' : 'text-yellow-600'}`} />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      )}
                      <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Over the past {dateRange === '90' ? '90 days' : dateRange === '365' ? 'year' : '3 years'},
                      you spent <strong>{formatCurrency(s.totalSpend, true)}</strong> on Google Ads generating{' '}
                      <strong>{formatNumber(s.googleLeadsCount)} leads</strong> and{' '}
                      <strong>{formatNumber(s.googleCustomersCount)} paying customers</strong> for{' '}
                      <strong>{formatCurrency(s.googleRevenue, true)}</strong> in directly attributed revenue.
                      {s.trueRoas >= 1
                        ? ` That's a ${s.trueRoas.toFixed(2)}x return on every dollar spent.`
                        : ` At ${s.trueRoas.toFixed(2)}x ROAS, you're spending more than you're directly recovering.`}
                    </p>
                  </div>
                  <div className="text-center md:text-right md:min-w-[160px]">
                    <p className={`text-5xl font-black ${
                      s.trueRoas >= 3 ? 'text-green-600' : s.trueRoas >= 1 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {s.trueRoas.toFixed(2)}x
                    </p>
                    <p className="text-sm text-gray-500 mt-1">True ROAS</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ({s.blendedRoas.toFixed(1)}x blended)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================= */}
            {/* KPI CARDS                                                      */}
            {/* ============================================================= */}
            <section>
              <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                <Card variant="elevated" className="!p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-red-600" />
                    </div>
                    <Text size="sm" className="text-gray-500 !mb-0">Total Ad Spend</Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {formatCurrency(s.totalSpend, true)}
                  </Text>
                  <div className="flex items-center gap-2">
                    <Text size="sm" className="text-gray-400 !mb-0">Q/Q:</Text>
                    <TrendBadge value={s.spendTrend} inverse />
                  </div>
                </Card>

                <Card variant="elevated" className="!p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <Text size="sm" className="text-gray-500 !mb-0">Google Revenue</Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {formatCurrency(s.googleRevenue, true)}
                  </Text>
                  <Text size="sm" className="text-gray-400 !mb-0">
                    {formatPercent(s.googleRevenuePercent)} of {formatCurrency(s.totalRevenue, true)} total
                  </Text>
                </Card>

                <Card variant="elevated" className="!p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <Text size="sm" className="text-gray-500 !mb-0">Cost / Customer</Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {formatCurrency(s.costPerCustomer)}
                  </Text>
                  <Text size="sm" className="text-gray-400 !mb-0">
                    {formatCurrency(s.costPerLead)} per lead
                  </Text>
                </Card>

                <Card variant="elevated" className="!p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <Text size="sm" className="text-gray-500 !mb-0">Avg Order Value</Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">
                    {formatCurrency(s.avgOrderValue)}
                  </Text>
                  <Text size="sm" className="text-gray-400 !mb-0">
                    {formatPercent(s.leadToCustomerRate)} lead-to-sale
                  </Text>
                </Card>
              </Grid>
            </section>

            {/* Secondary KPIs */}
            <section>
              <Grid responsiveCols={{ mobile: 3, tablet: 6 }} gap="sm">
                {[
                  { label: 'Impressions', value: formatNumber(s.totalImpressions), icon: Eye },
                  { label: 'Clicks', value: formatNumber(s.totalClicks), icon: MousePointer },
                  { label: 'CTR', value: formatPercent(s.overallCtr), icon: Zap },
                  { label: 'Avg CPC', value: formatCurrency(s.overallCpc), icon: DollarSign },
                  { label: 'Google Leads', value: formatNumber(s.googleLeadsCount), icon: Users },
                  { label: 'Google Customers', value: formatNumber(s.googleCustomersCount), icon: CheckCircle },
                ].map((kpi) => (
                  <Card key={kpi.label} variant="outlined" className="!p-3 text-center">
                    <kpi.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <Text className="text-lg font-bold text-gray-900 !mb-0">{kpi.value}</Text>
                    <Text size="sm" className="text-gray-500 !mb-0">{kpi.label}</Text>
                  </Card>
                ))}
              </Grid>
            </section>

            {/* ============================================================= */}
            {/* RECOMMENDATIONS                                                */}
            {/* ============================================================= */}
            {recommendations.length > 0 && (
              <section>
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[#FFA501]" />
                    <Heading level={3} className="!mb-0">Recommendations for Your Rep</Heading>
                  </div>
                  <div className="space-y-4">
                    {recommendations.map((rec, i) => (
                      <div key={i} className={`rounded-xl p-4 border-l-4 ${
                        rec.priority === 'high'
                          ? 'bg-red-50 border-red-500'
                          : rec.priority === 'medium'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-green-50 border-green-500'
                      }`}>
                        <div className="flex items-start gap-3">
                          <Badge className={`!text-xs shrink-0 ${
                            rec.priority === 'high'
                              ? '!bg-red-100 !text-red-700 !border-red-200'
                              : rec.priority === 'medium'
                                ? '!bg-yellow-100 !text-yellow-700 !border-yellow-200'
                                : '!bg-green-100 !text-green-700 !border-green-200'
                          }`}>
                            {rec.priority}
                          </Badge>
                          <div>
                            <Text className="font-semibold text-gray-900 !mb-1">{rec.title}</Text>
                            <Text size="sm" className="text-gray-600 !mb-0 leading-relaxed">{rec.detail}</Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* ============================================================= */}
            {/* QUARTERLY TREND COMPARISON                                      */}
            {/* ============================================================= */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#003365]" />
                  <Heading level={3} className="!mb-0">Quarter-over-Quarter Trend</Heading>
                </div>
                <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <Text size="sm" className="text-gray-500 !mb-1">Recent 3 Mo Spend</Text>
                    <Text className="text-xl font-bold text-gray-900 !mb-1">{formatCurrency(s.recent3Spend, true)}</Text>
                    <TrendBadge value={s.spendTrend} inverse />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <Text size="sm" className="text-gray-500 !mb-1">Prior 3 Mo Spend</Text>
                    <Text className="text-xl font-bold text-gray-900 !mb-0">{formatCurrency(s.prior3Spend, true)}</Text>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <Text size="sm" className="text-gray-500 !mb-1">Recent 3 Mo ROAS</Text>
                    <Text className="text-xl font-bold text-gray-900 !mb-1">{s.recent3Roas.toFixed(2)}x</Text>
                    <TrendBadge value={s.roasTrend} />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <Text size="sm" className="text-gray-500 !mb-1">Prior 3 Mo ROAS</Text>
                    <Text className="text-xl font-bold text-gray-900 !mb-0">{s.prior3Roas.toFixed(2)}x</Text>
                  </div>
                </Grid>
              </Card>
            </section>

            {/* ============================================================= */}
            {/* CAMPAIGN PERFORMANCE TABLE                                      */}
            {/* ============================================================= */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#406517]" />
                  <Heading level={3} className="!mb-0">Campaign Performance</Heading>
                  <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200">
                    {data.campaigns.length} campaigns
                  </Badge>
                </div>

                {data.campaigns.length > 0 ? (
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                          <th className="px-3 pb-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Spend</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Clicks</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">CTR</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Avg CPC</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Conv.</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/Conv</th>
                          <th className="px-6 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Daily Avg</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.campaigns.map((campaign) => (
                          <tr key={campaign.campaign_id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3">
                              <div>
                                <Text className="font-medium text-gray-900 !mb-0 text-sm truncate max-w-[250px]">
                                  {campaign.campaign_name}
                                </Text>
                                <Text size="sm" className="text-gray-400 !mb-0">
                                  {campaign.campaign_status === 'ENABLED' ? (
                                    <span className="text-green-600">Active</span>
                                  ) : (
                                    <span className="text-gray-400">{campaign.campaign_status}</span>
                                  )}
                                </Text>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">
                                {campaign.campaign_type.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-3 py-3 text-right text-sm font-medium text-red-600">
                              {formatCurrency(campaign.total_spend)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatNumber(campaign.total_clicks)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm">
                              <span className={campaign.avg_ctr >= 3 ? 'text-green-600' : campaign.avg_ctr >= 1.5 ? 'text-gray-700' : 'text-red-500'}>
                                {formatPercent(campaign.avg_ctr)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatCurrency(campaign.avg_cpc)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {campaign.total_conversions > 0 ? formatNumber(campaign.total_conversions) : '-'}
                            </td>
                            <td className="px-3 py-3 text-right text-sm">
                              {campaign.cost_per_conversion !== null ? (
                                <span className={campaign.cost_per_conversion > 200 ? 'text-red-500 font-medium' : 'text-gray-700'}>
                                  {formatCurrency(campaign.cost_per_conversion)}
                                </span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-500">
                              {formatCurrency(campaign.daily_avg_spend)}/d
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-8 !mb-0">No campaign data available</Text>
                )}
              </Card>
            </section>

            {/* ============================================================= */}
            {/* CAMPAIGN TYPE BREAKDOWN                                         */}
            {/* ============================================================= */}
            {data.campaignTypes.length > 0 && (
              <section>
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#B30158]" />
                    <Heading level={3} className="!mb-0">Spend by Campaign Type</Heading>
                  </div>
                  <div className="space-y-4">
                    {data.campaignTypes.map((ct) => (
                      <div key={ct.type}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Text className="font-medium text-gray-900 !mb-0">{ct.type.replace(/_/g, ' ')}</Text>
                            <Text size="sm" className="text-gray-400 !mb-0">
                              {formatPercent(ct.spend_percent)} of budget
                            </Text>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="text-red-600 font-medium">{formatCurrency(ct.spend)}</span>
                            <span className="text-gray-500">{formatNumber(ct.clicks)} clicks</span>
                            <span className="text-gray-500">{formatPercent(ct.ctr)} CTR</span>
                            <span className="text-gray-500">{formatCurrency(ct.cpc)} CPC</span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#003365] rounded-full transition-all"
                            style={{ width: `${ct.spend_percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* ============================================================= */}
            {/* KEYWORD ANALYSIS                                                */}
            {/* ============================================================= */}
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {/* Budget Drains */}
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ban className="w-5 h-5 text-red-500" />
                  <Heading level={3} className="!mb-0">Budget Drains</Heading>
                </div>
                <Text size="sm" className="text-gray-500 !mb-4">
                  High spend, low/no conversions. Consider as negative keywords.
                </Text>
                {data.keywords.budgetDrains.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {data.keywords.budgetDrains.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="min-w-0 flex-1 mr-3">
                          <Text className="font-medium text-gray-900 !mb-0 text-sm truncate">
                            {kw.keyword_text || '(unknown)'}
                          </Text>
                          <Text size="sm" className="text-gray-400 !mb-0">
                            {kw.match_type} | {formatNumber(kw.total_clicks)} clicks | {formatPercent(kw.ctr)} CTR
                          </Text>
                        </div>
                        <div className="text-right shrink-0">
                          <Text className="font-medium text-red-600 !mb-0 text-sm">{formatCurrency(kw.total_spend)}</Text>
                          <Text size="sm" className="text-gray-400 !mb-0">
                            {kw.total_conversions === 0 ? '0 conv.' : `${kw.total_conversions} conv.`}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-gray-400 text-center py-4 !mb-0">
                    No keyword data synced yet. Run a sync with keywords enabled.
                  </Text>
                )}
              </Card>

              {/* Top Performers */}
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  <Heading level={3} className="!mb-0">Top Performers</Heading>
                </div>
                <Text size="sm" className="text-gray-500 !mb-4">
                  Best cost-per-conversion keywords. Consider increasing bids.
                </Text>
                {data.keywords.topPerformers.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {data.keywords.topPerformers.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="min-w-0 flex-1 mr-3">
                          <Text className="font-medium text-gray-900 !mb-0 text-sm truncate">
                            {kw.keyword_text || '(unknown)'}
                          </Text>
                          <Text size="sm" className="text-gray-400 !mb-0">
                            {kw.match_type} | {formatNumber(kw.total_clicks)} clicks | {formatPercent(kw.ctr)} CTR
                            {kw.avg_quality_score !== null && ` | QS: ${kw.avg_quality_score.toFixed(0)}`}
                          </Text>
                        </div>
                        <div className="text-right shrink-0">
                          <Text className="font-medium text-green-600 !mb-0 text-sm">
                            {kw.cost_per_conversion !== null ? `${formatCurrency(kw.cost_per_conversion)}/conv` : '-'}
                          </Text>
                          <Text size="sm" className="text-gray-400 !mb-0">
                            {kw.total_conversions} conv. | {formatCurrency(kw.total_spend)}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-gray-400 text-center py-4 !mb-0">
                    No keyword data synced yet. Run a sync with keywords enabled.
                  </Text>
                )}
              </Card>
            </Grid>

            {/* ============================================================= */}
            {/* MONTHLY TREND TABLE                                             */}
            {/* ============================================================= */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#406517]" />
                  <Heading level={3} className="!mb-0">Monthly Performance</Heading>
                </div>
                {data.monthly.length > 0 ? (
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full min-w-[1000px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Spend</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Clicks</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">CPC</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">CTR</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Leads</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">CPL</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Customers</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">ROAS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.monthly.map((month) => (
                          <tr key={month.month} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {formatMonth(month.month)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-red-600 font-medium">
                              {formatCurrency(month.spend)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatNumber(month.clicks)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatCurrency(month.cpc)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm">
                              <span className={month.ctr >= 3 ? 'text-green-600' : month.ctr >= 1.5 ? 'text-gray-700' : 'text-red-500'}>
                                {formatPercent(month.ctr)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatNumber(month.googleLeads)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {month.costPerLead !== null ? formatCurrency(month.costPerLead) : '-'}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">
                              {formatNumber(month.googleOrders)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-green-600 font-medium">
                              {formatCurrency(month.googleRevenue, true)}
                            </td>
                            <td className="px-3 py-3 text-right">
                              {month.googleRoas !== null ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  month.googleRoas >= 3
                                    ? 'bg-green-100 text-green-800'
                                    : month.googleRoas >= 1
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {month.googleRoas.toFixed(2)}x
                                </span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-8 !mb-0">No monthly data available</Text>
                )}
              </Card>
            </section>

            {/* ============================================================= */}
            {/* SOURCE/MEDIUM ATTRIBUTION                                       */}
            {/* ============================================================= */}
            <section>
              <Card variant="elevated" className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-[#003365]" />
                  <Heading level={3} className="!mb-0">Revenue by Source / Medium</Heading>
                  <Text size="sm" className="text-gray-400 !mb-0 ml-2">(All channels, historical orders)</Text>
                </div>

                {data.sourceMedium.length > 0 ? (
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                          <th className="px-3 pb-3 text-left text-xs font-medium text-gray-500 uppercase">Medium</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-3 pb-3 text-right text-xs font-medium text-gray-500 uppercase">% Revenue</th>
                          <th className="px-6 pb-3 text-right text-xs font-medium text-gray-500 uppercase">AOV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.sourceMedium.map((sm, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">{sm.source}</td>
                            <td className="px-3 py-3 text-sm text-gray-600">{sm.medium}</td>
                            <td className="px-3 py-3 text-right text-sm text-gray-700">{formatNumber(sm.orders)}</td>
                            <td className="px-3 py-3 text-right text-sm font-medium text-[#406517]">
                              {formatCurrency(sm.revenue, true)}
                            </td>
                            <td className="px-3 py-3 text-right text-sm text-gray-500">
                              {formatPercent(sm.revenue_percent)}
                            </td>
                            <td className="px-6 py-3 text-right text-sm text-gray-500">
                              {formatCurrency(sm.avg_order_value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Text className="text-gray-500 text-center py-8 !mb-0">No attribution data available</Text>
                )}
              </Card>
            </section>

            {/* ============================================================= */}
            {/* METHODOLOGY NOTE                                                */}
            {/* ============================================================= */}
            <section className="print:break-before-page">
              <Card variant="outlined" className="!p-6 !bg-blue-50 !border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <Heading level={4} className="!mb-0 text-blue-900">How This Data Works</Heading>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Text className="font-semibold text-blue-900 !mb-2">True ROAS (Conservative)</Text>
                    <Text size="sm" className="text-blue-700 !mb-0 leading-relaxed">
                      Matches Google Ads spend to revenue from leads that had a GCLID (Google Click ID).
                      Only counts revenue from customers we can directly trace to a Google Ad click.
                      This is a conservative lower bound.
                    </Text>
                  </div>
                  <div>
                    <Text className="font-semibold text-blue-900 !mb-2">Blended ROAS (Upper Bound)</Text>
                    <Text size="sm" className="text-blue-700 !mb-0 leading-relaxed">
                      Divides ALL revenue by Google Ads spend. Overestimates Google&apos;s contribution since
                      it includes organic, direct, and other channel revenue. The real number is between
                      True and Blended ROAS.
                    </Text>
                  </div>
                </div>
              </Card>
            </section>
          </>
        )}
      </Stack>
    </Container>
  )
}
