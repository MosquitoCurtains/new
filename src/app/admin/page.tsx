'use client'

/**
 * Admin Dashboard
 * 
 * Navigation hub organized by section, matching the sidebar groupings.
 */

import Link from 'next/link'
import { 
  ArrowRight,
  LayoutGrid,
  ShoppingCart,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
} from '@/lib/design-system'
import { adminNavSections } from '@/lib/navigation'

// Section accent colors (one per section, matching brand palette)
const SECTION_COLORS: Record<string, string> = {
  'Sales & Commerce': '#406517',
  'Analytics': '#003365',
  'Customers': '#B30158',
  'Content & Media': '#FFA501',
  'System': '#6B7280',
}

export default function AdminDashboardPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-[#406517]/10 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-[#406517]" />
            </div>
            <div>
              <Heading level={1} className="!mb-0">Admin Dashboard</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">
                Manage your store, analytics, and customer data
              </Text>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="sm">
            <QuickStat label="Today" value="--" sub="Orders" icon={ShoppingCart} color="#406517" />
            <QuickStat label="This Week" value="--" sub="Revenue" icon={TrendingUp} color="#003365" />
            <QuickStat label="Active" value="--" sub="Visitors" icon={Users} color="#B30158" />
            <QuickStat label="Pending" value="--" sub="Quotes" icon={Target} color="#FFA501" />
          </Grid>
        </section>

        {/* Sections - matching sidebar groupings */}
        {adminNavSections.map((section) => {
          const color = SECTION_COLORS[section.label] || '#6B7280'
          return (
            <section key={section.label}>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                style={{ color }}
              >
                {section.label}
              </p>
              <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="sm">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href} className="group">
                      <Card
                        variant="elevated"
                        className="!p-4 h-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${color}12` }}
                            >
                              <Icon className="w-4.5 h-4.5" style={{ color }} />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900 group-hover:text-[#406517] transition-colors truncate">
                            {item.name}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-[#406517] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </Grid>
            </section>
          )
        })}
      </Stack>
    </Container>
  )
}

// Quick stat card
function QuickStat({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub: string; icon: typeof ShoppingCart; color: string
}) {
  return (
    <Card variant="elevated" className="!p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
    </Card>
  )
}
