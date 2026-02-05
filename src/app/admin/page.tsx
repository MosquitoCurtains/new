'use client'

/**
 * Admin Dashboard
 * 
 * Navigation hub for all admin areas.
 * Follows Mosquito Curtains Design System patterns.
 */

import Link from 'next/link'
import { 
  BarChart3,
  Users,
  Download,
  Image,
  ShoppingCart,
  Target,
  Map,
  TrendingUp,
  UserCheck,
  ArrowRight,
  Settings,
  LayoutGrid,
  FileUser,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface AdminArea {
  title: string
  description: string
  href: string
  icon: typeof BarChart3
  color: string
  badge?: string
}

// =============================================================================
// ADMIN AREAS
// =============================================================================

const ADMIN_AREAS: AdminArea[] = [
  {
    title: 'MC Sales',
    description: 'Salesperson order builder with pricing calculator',
    href: '/admin/mc-sales',
    icon: ShoppingCart,
    color: '#406517',
    badge: 'Sales Tool',
  },
  {
    title: 'Attribution Analytics',
    description: 'Campaign performance, funnel metrics, and GA4 sync',
    href: '/admin/mc-sales/analytics',
    icon: Target,
    color: '#003365',
    badge: 'New',
  },
  {
    title: 'Customer Journeys',
    description: 'Individual customer paths from first touch to purchase',
    href: '/admin/mc-sales/analytics/waterfall',
    icon: UserCheck,
    color: '#B30158',
    badge: 'New',
  },
  {
    title: 'Leads Analytics',
    description: 'Lead conversion rates, landing page performance, and attribution',
    href: '/admin/mc-sales/analytics/leads',
    icon: FileUser,
    color: '#0EA5E9',
    badge: 'New',
  },
  {
    title: 'Business Analytics',
    description: 'Revenue trends, KPIs, and performance metrics',
    href: '/admin/analytics',
    icon: BarChart3,
    color: '#406517',
  },
  {
    title: 'Customers',
    description: 'Customer database and individual profiles',
    href: '/admin/customers',
    icon: Users,
    color: '#003365',
  },
  {
    title: 'Galleries',
    description: 'Manage customer project galleries and images',
    href: '/admin/galleries',
    icon: Image,
    color: '#FFA501',
  },
  {
    title: 'Data Export',
    description: 'Export orders, customers, and analytics data',
    href: '/admin/export',
    icon: Download,
    color: '#6B7280',
  },
  {
    title: 'Sitemap',
    description: 'View and manage site page structure',
    href: '/admin/sitemap',
    icon: Map,
    color: '#6B7280',
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminDashboardPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#406517]/10 flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-[#406517]" />
            </div>
            <div>
              <Heading level={1} className="!mb-0">Admin Dashboard</Heading>
              <Text className="text-gray-500 !mb-0">
                Manage your store, analytics, and customer data
              </Text>
            </div>
          </div>
        </section>

        {/* Quick Stats (placeholder) */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-500 !mb-1">Today</Text>
                  <Text className="text-2xl font-bold text-gray-900 !mb-0">--</Text>
                  <Text size="sm" className="text-gray-400 !mb-0">Orders</Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#406517]/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#406517]" />
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-500 !mb-1">This Week</Text>
                  <Text className="text-2xl font-bold text-gray-900 !mb-0">--</Text>
                  <Text size="sm" className="text-gray-400 !mb-0">Revenue</Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#003365]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#003365]" />
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-500 !mb-1">Active</Text>
                  <Text className="text-2xl font-bold text-gray-900 !mb-0">--</Text>
                  <Text size="sm" className="text-gray-400 !mb-0">Visitors</Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#B30158]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#B30158]" />
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-500 !mb-1">Pending</Text>
                  <Text className="text-2xl font-bold text-gray-900 !mb-0">--</Text>
                  <Text size="sm" className="text-gray-400 !mb-0">Quotes</Text>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#FFA501]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#FFA501]" />
                </div>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Admin Areas Grid */}
        <section>
          <Heading level={2} className="!mb-4">Admin Areas</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {ADMIN_AREAS.map((area) => {
              const Icon = area.icon
              return (
                <Link key={area.href} href={area.href} className="group">
                  <Card 
                    variant="elevated" 
                    className="!p-6 h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${area.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: area.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Heading level={3} className="!text-lg !mb-0 group-hover:text-[#406517] transition-colors">
                            {area.title}
                          </Heading>
                          {area.badge && (
                            <Badge 
                              className={
                                area.badge === 'New' 
                                  ? '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30'
                                  : '!bg-gray-100 !text-gray-600 !border-gray-200'
                              }
                            >
                              {area.badge}
                            </Badge>
                          )}
                        </div>
                        <Text size="sm" className="text-gray-500 !mb-0">
                          {area.description}
                        </Text>
                      </div>
                      
                      <ArrowRight 
                        className="w-5 h-5 text-gray-300 group-hover:text-[#406517] group-hover:translate-x-1 transition-all shrink-0" 
                      />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </section>

        {/* Quick Actions */}
        <section>
          <Card variant="outlined" className="!p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <div>
                  <Text className="font-medium text-gray-900 !mb-0">Need help?</Text>
                  <Text size="sm" className="text-gray-500 !mb-0">
                    Access documentation or contact support
                  </Text>
                </div>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/admin/mc-sales" 
                  className="px-4 py-2 bg-[#406517] text-white rounded-full text-sm font-medium hover:bg-[#4d7a1c] transition-colors"
                >
                  Open MC Sales
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
