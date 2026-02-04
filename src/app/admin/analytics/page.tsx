'use client'

/**
 * Admin Analytics Dashboard
 * 
 * Business metrics, revenue trends, and KPIs.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Map,
  Target,
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

// =============================================================================
// TYPES
// =============================================================================

interface KPI {
  label: string
  value: string
  change: number
  changeLabel: string
  icon: typeof DollarSign
  color: string
}

interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface ProductMix {
  category: string
  revenue: number
  percentage: number
  color: string
}

interface SalespersonMetrics {
  name: string
  orders: number
  revenue: number
  conversionRate: number
}

interface StateData {
  state: string
  orders: number
  revenue: number
}

interface AttributionData {
  source: string
  orders: number
  revenue: number
  percentage: number
}

// =============================================================================
// MOCK DATA
// =============================================================================

const KPIS: KPI[] = [
  { label: 'Total Revenue', value: '$847,250', change: 23.5, changeLabel: 'vs last year', icon: DollarSign, color: '#406517' },
  { label: 'Orders', value: '1,248', change: 18.2, changeLabel: 'vs last year', icon: ShoppingCart, color: '#003365' },
  { label: 'Avg Order Value', value: '$678', change: 4.5, changeLabel: 'vs last year', icon: Target, color: '#B30158' },
  { label: 'Active Customers', value: '892', change: 31.2, changeLabel: 'vs last year', icon: Users, color: '#FFA501' },
]

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan', revenue: 65000, orders: 95 },
  { month: 'Feb', revenue: 58000, orders: 85 },
  { month: 'Mar', revenue: 72000, orders: 108 },
  { month: 'Apr', revenue: 85000, orders: 125 },
  { month: 'May', revenue: 98000, orders: 142 },
  { month: 'Jun', revenue: 112000, orders: 165 },
  { month: 'Jul', revenue: 95000, orders: 138 },
  { month: 'Aug', revenue: 88000, orders: 128 },
  { month: 'Sep', revenue: 76000, orders: 112 },
  { month: 'Oct', revenue: 68000, orders: 98 },
  { month: 'Nov', revenue: 54000, orders: 78 },
  { month: 'Dec', revenue: 45000, orders: 65 },
]

const PRODUCT_MIX: ProductMix[] = [
  { category: 'Mesh Panels', revenue: 425000, percentage: 50.2, color: '#406517' },
  { category: 'Clear Vinyl', revenue: 178500, percentage: 21.1, color: '#003365' },
  { category: 'Track Hardware', revenue: 152000, percentage: 17.9, color: '#B30158' },
  { category: 'Attachments', revenue: 68750, percentage: 8.1, color: '#FFA501' },
  { category: 'Raw Materials', revenue: 23000, percentage: 2.7, color: '#6B7280' },
]

const SALESPERSON_DATA: SalespersonMetrics[] = [
  { name: 'Sarah M.', orders: 285, revenue: 198500, conversionRate: 42 },
  { name: 'Mike T.', orders: 248, revenue: 178200, conversionRate: 38 },
  { name: 'Jennifer L.', orders: 195, revenue: 142800, conversionRate: 35 },
  { name: 'David K.', orders: 168, revenue: 115200, conversionRate: 33 },
  { name: 'Online (No Rep)', orders: 352, revenue: 212550, conversionRate: 28 },
]

const TOP_STATES: StateData[] = [
  { state: 'Florida', orders: 245, revenue: 168500 },
  { state: 'Texas', orders: 198, revenue: 142800 },
  { state: 'California', orders: 175, revenue: 128500 },
  { state: 'Georgia', orders: 142, revenue: 98600 },
  { state: 'North Carolina', orders: 118, revenue: 82400 },
]

const ATTRIBUTION_DATA: AttributionData[] = [
  { source: 'Google Organic', orders: 485, revenue: 328500, percentage: 38.8 },
  { source: 'Direct', orders: 312, revenue: 218400, percentage: 25.0 },
  { source: 'Google Ads', orders: 198, revenue: 138600, percentage: 15.9 },
  { source: 'Referral', orders: 145, revenue: 98500, percentage: 11.6 },
  { source: 'Social', orders: 108, revenue: 63250, percentage: 8.7 },
]

// =============================================================================
// COMPONENT
// =============================================================================

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('ytd')
  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue))

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Heading level={1} className="!mb-1">Analytics Dashboard</Heading>
              <Text className="text-gray-600">
                Business performance metrics and insights
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="ytd">Year to Date</option>
                <option value="last12">Last 12 Months</option>
                <option value="last6">Last 6 Months</option>
                <option value="q4">Q4 2025</option>
              </select>
              <Button variant="outline" asChild>
                <Link href="/admin/export">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {KPIS.map((kpi) => {
              const Icon = kpi.icon
              const isPositive = kpi.change > 0
              return (
                <Card key={kpi.label} variant="elevated" className="!p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-[#406517]' : 'text-red-500'}`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(kpi.change)}%
                    </div>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">{kpi.value}</Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{kpi.label}</Text>
                </Card>
              )
            })}
          </Grid>
        </section>

        {/* Charts Row */}
        <section>
          <Grid responsiveCols={{ mobile: 1, desktop: 2 }} gap="lg">
            {/* Revenue Trend */}
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#406517]" />
                  <Heading level={3} className="!mb-0">Monthly Revenue</Heading>
                </div>
                <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +23.5% YoY
                </Badge>
              </div>
              
              <div className="flex items-end justify-between gap-2 h-48">
                {MONTHLY_DATA.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-[#406517] rounded-t transition-all hover:bg-[#4d7a1c]"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      title={`$${data.revenue.toLocaleString()}`}
                    />
                    <Text size="sm" className="text-gray-500 !mb-0">{data.month}</Text>
                  </div>
                ))}
              </div>
            </Card>

            {/* Product Mix */}
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-[#003365]" />
                <Heading level={3} className="!mb-0">Product Mix</Heading>
              </div>
              
              <Stack gap="md">
                {PRODUCT_MIX.map((product) => (
                  <div key={product.category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: product.color }}
                        />
                        <Text className="text-gray-700 !mb-0">{product.category}</Text>
                      </div>
                      <div className="flex items-center gap-3">
                        <Text size="sm" className="text-gray-500 !mb-0">
                          ${(product.revenue / 1000).toFixed(0)}k
                        </Text>
                        <Text className="font-medium text-gray-900 !mb-0 w-12 text-right">
                          {product.percentage}%
                        </Text>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${product.percentage}%`, backgroundColor: product.color }}
                      />
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid>
        </section>

        {/* Tables Row */}
        <section>
          <Grid responsiveCols={{ mobile: 1, desktop: 2 }} gap="lg">
            {/* Salesperson Performance */}
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#B30158]" />
                <Heading level={3} className="!mb-0">Salesperson Performance</Heading>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500">Orders</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500">Revenue</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500">Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SALESPERSON_DATA.map((person) => (
                      <tr key={person.name}>
                        <td className="py-3 text-gray-900">{person.name}</td>
                        <td className="py-3 text-right text-gray-700">{person.orders}</td>
                        <td className="py-3 text-right font-medium text-[#406517]">
                          ${(person.revenue / 1000).toFixed(0)}k
                        </td>
                        <td className="py-3 text-right text-gray-500">{person.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Geographic Distribution */}
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-[#FFA501]" />
                <Heading level={3} className="!mb-0">Top States</Heading>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left text-sm font-medium text-gray-500">State</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500">Orders</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-500">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {TOP_STATES.map((state, index) => (
                      <tr key={state.state}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-600' :
                              index === 2 ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-50 text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-gray-900">{state.state}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-gray-700">{state.orders}</td>
                        <td className="py-3 text-right font-medium text-[#406517]">
                          ${(state.revenue / 1000).toFixed(0)}k
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Attribution */}
        <section>
          <Card variant="elevated" className="!p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-[#003365]" />
              <Heading level={3} className="!mb-0">Marketing Attribution</Heading>
            </div>
            
            <Grid responsiveCols={{ mobile: 2, tablet: 5 }} gap="md">
              {ATTRIBUTION_DATA.map((source) => (
                <div key={source.source} className="p-4 bg-gray-50 rounded-xl text-center">
                  <Text className="text-2xl font-bold text-gray-900 !mb-1">{source.percentage}%</Text>
                  <Text size="sm" className="text-gray-500 !mb-1">{source.source}</Text>
                  <Text size="sm" className="text-[#406517] !mb-0">${(source.revenue / 1000).toFixed(0)}k</Text>
                </div>
              ))}
            </Grid>
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
