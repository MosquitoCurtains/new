'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  ExternalLink,
  Home,
  Package,
  MapPin,
  Wrench,
  HelpCircle,
  Heart,
  Image,
  ShoppingCart,
  FileText,
  Layout,
  Users,
  Search,
  Globe,
  Lock,
  Palette,
  Megaphone,
  BookOpen,
  Layers,
  Settings,
  Eye,
  EyeOff,
  Filter,
  ScrollText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
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
import {
  PAGE_REGISTRY,
  PRODUCT_LINE_LABELS,
  PRODUCT_LINE_SHORT,
  PRODUCT_LINE_COLORS,
  CTA_LABELS,
  getPagesByProductLine,
  getProductLineStats,
  type ProductLine,
  type ExpectedCTA,
  type PageEntry,
  type PageType,
} from '@/lib/page-registry'

// =============================================================================
// TYPES
// =============================================================================

type FilterMode = 'all' | 'sitemap' | 'private'
type ProductLineFilter = 'all' | ProductLine
type ViewMode = 'sections' | 'product-lines' | 'cta-audit'

// =============================================================================
// SECTION GROUPING (for "Sections" view mode)
// =============================================================================

interface SiteSection {
  title: string
  icon: typeof Home
  color: string
  pageTypes: PageType[]
  productLines?: ProductLine[]
}

const SITE_SECTIONS: SiteSection[] = [
  { title: 'Core Pages', icon: Home, color: '#406517', pageTypes: ['homepage', 'informational'], productLines: ['general'] },
  { title: 'Mosquito Curtain Products', icon: Package, color: '#003365', pageTypes: ['product', 'landing'], productLines: ['mc'] },
  { title: 'Clear Vinyl Products', icon: Package, color: '#0891B2', pageTypes: ['product', 'landing', 'options'], productLines: ['cv'] },
  { title: 'Raw Netting & DIY Fabric', icon: Layers, color: '#7C3AED', pageTypes: ['product', 'informational'], productLines: ['rn'] },
  { title: 'Roll-Up Shades', icon: Layers, color: '#D97706', pageTypes: ['product'], productLines: ['ru'] },
  { title: 'SEO Landing Pages', icon: MapPin, color: '#B30158', pageTypes: ['landing'], productLines: ['mc'] },
  { title: 'Ordering Pages', icon: ShoppingCart, color: '#10B981', pageTypes: ['ordering'] },
  { title: 'Quote & Start Project', icon: FileText, color: '#059669', pageTypes: ['quote'] },
  { title: 'Planning & Measurement', icon: ScrollText, color: '#D97706', pageTypes: ['planning'] },
  { title: 'Installation Guides', icon: Wrench, color: '#406517', pageTypes: ['installation'] },
  { title: 'Care & Maintenance', icon: Heart, color: '#EC4899', pageTypes: ['care'] },
  { title: 'FAQ', icon: HelpCircle, color: '#6366F1', pageTypes: ['faq'] },
  { title: 'Support & Company', icon: Users, color: '#003365', pageTypes: ['support', 'legal'] },
  { title: 'Gallery & Media', icon: Image, color: '#F59E0B', pageTypes: ['gallery'] },
  { title: 'Blog', icon: BookOpen, color: '#8B5CF6', pageTypes: ['blog'] },
  { title: 'Sales & Promotions', icon: Megaphone, color: '#EF4444', pageTypes: ['sale'] },
  { title: 'Marketing Landing', icon: Megaphone, color: '#EA580C', pageTypes: ['marketing'] },
  { title: 'E-commerce', icon: ShoppingCart, color: '#64748B', pageTypes: ['ecommerce'] },
  { title: 'Session Prep & Utility', icon: FileText, color: '#059669', pageTypes: ['session-prep', 'utility'] },
  { title: 'WordPress Legacy', icon: Layers, color: '#9333EA', pageTypes: ['canonical-wrapper'] },
  { title: 'Admin', icon: Lock, color: '#374151', pageTypes: ['admin'] },
]

// =============================================================================
// PRODUCT LINE BADGE
// =============================================================================

function ProductLineBadge({ productLine, size = 'sm' }: { productLine: ProductLine; size?: 'sm' | 'xs' }) {
  const colors = PRODUCT_LINE_COLORS[productLine]
  const sizeClass = size === 'xs' ? '!text-[10px] !px-1.5 !py-0' : '!text-xs !px-2 !py-0.5'
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}>
      {PRODUCT_LINE_SHORT[productLine]}
    </span>
  )
}

function CTABadge({ cta }: { cta: ExpectedCTA }) {
  if (cta === 'none') return <span className="text-xs text-gray-300">--</span>
  const ctaColors: Record<string, string> = {
    mc: 'bg-blue-50 text-blue-600 border-blue-200',
    cv: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    rn: 'bg-purple-50 text-purple-600 border-purple-200',
    general: 'bg-gray-50 text-gray-500 border-gray-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full text-[10px] font-medium px-1.5 py-0 border ${ctaColors[cta] || ctaColors.general}`}>
      {CTA_LABELS[cta]}
    </span>
  )
}

// =============================================================================
// ROUTE DISPLAY
// =============================================================================

function RouteRow({ page }: { page: PageEntry }) {
  return (
    <Link
      href={page.path}
      target="_blank"
      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 group-hover:text-[#406517] truncate">
            {page.name}
          </span>
          <ProductLineBadge productLine={page.productLine} size="xs" />
          {page.inSitemap ? (
            <span title="In public sitemap"><Globe className="w-3 h-3 text-green-500 shrink-0" /></span>
          ) : (
            <span title="Not in public sitemap"><EyeOff className="w-3 h-3 text-gray-300 shrink-0" /></span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400 truncate">{page.path}</span>
          {page.expectedCTA !== 'none' && <CTABadge cta={page.expectedCTA} />}
        </div>
        {page.description && (
          <span className="text-xs text-gray-500 block">{page.description}</span>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#406517] flex-shrink-0 ml-2" />
    </Link>
  )
}

// =============================================================================
// SECTIONS VIEW
// =============================================================================

function SectionsView({ pages, filterMode, productLineFilter, search }: {
  pages: PageEntry[]
  filterMode: FilterMode
  productLineFilter: ProductLineFilter
  search: string
}) {
  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()

    // Build grouped sections from page types
    const used = new Set<string>()
    const sections: { title: string; icon: typeof Home; color: string; routes: PageEntry[] }[] = []

    for (const section of SITE_SECTIONS) {
      const routes = pages.filter(page => {
        const key = page.path
        if (used.has(key)) return false

        // Must match section criteria
        const matchesType = section.pageTypes.includes(page.pageType)
        const matchesProductLine = !section.productLines || section.productLines.includes(page.productLine)
        if (!matchesType || !matchesProductLine) return false

        // Apply filters
        if (filterMode === 'sitemap' && !page.inSitemap) return false
        if (filterMode === 'private' && page.inSitemap) return false
        if (productLineFilter !== 'all' && page.productLine !== productLineFilter) return false

        // Search
        if (q) {
          return page.name.toLowerCase().includes(q) ||
            page.path.toLowerCase().includes(q) ||
            (page.description?.toLowerCase().includes(q) ?? false)
        }

        return true
      })

      // Mark used
      for (const r of routes) used.add(r.path)
      if (routes.length > 0) {
        sections.push({ title: section.title, icon: section.icon, color: section.color, routes })
      }
    }

    // Catch any unmatched pages
    const remaining = pages.filter(page => {
      if (used.has(page.path)) return false
      if (filterMode === 'sitemap' && !page.inSitemap) return false
      if (filterMode === 'private' && page.inSitemap) return false
      if (productLineFilter !== 'all' && page.productLine !== productLineFilter) return false
      if (q) {
        return page.name.toLowerCase().includes(q) ||
          page.path.toLowerCase().includes(q) ||
          (page.description?.toLowerCase().includes(q) ?? false)
      }
      return true
    })
    if (remaining.length > 0) {
      sections.push({ title: 'Other', icon: FileText, color: '#6B7280', routes: remaining })
    }

    return sections
  }, [pages, filterMode, productLineFilter, search])

  return (
    <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
      {filteredSections.map((section) => (
        <Card key={section.title} variant="elevated" className="!p-0 overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: section.color }}>
            <section.icon className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">{section.title}</span>
            <Badge className="!bg-white/20 !text-white !border-0 ml-auto text-xs">
              {section.routes.length}
            </Badge>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto">
            <Stack gap="xs">
              {section.routes.map((page) => (
                <RouteRow key={page.path} page={page} />
              ))}
            </Stack>
          </div>
        </Card>
      ))}
    </Grid>
  )
}

// =============================================================================
// PRODUCT LINES VIEW
// =============================================================================

function ProductLinesView({ pages, filterMode, search }: {
  pages: PageEntry[]
  filterMode: FilterMode
  search: string
}) {
  const q = search.toLowerCase().trim()

  const productLines: ProductLine[] = ['mc', 'cv', 'rn', 'ru', 'general']

  const grouped = useMemo(() => {
    return productLines.map(pl => {
      const filtered = pages.filter(page => {
        if (page.productLine !== pl) return false
        if (filterMode === 'sitemap' && !page.inSitemap) return false
        if (filterMode === 'private' && page.inSitemap) return false
        if (q) {
          return page.name.toLowerCase().includes(q) ||
            page.path.toLowerCase().includes(q) ||
            (page.description?.toLowerCase().includes(q) ?? false)
        }
        return true
      })
      return { productLine: pl, pages: filtered }
    }).filter(g => g.pages.length > 0)
  }, [pages, filterMode, search])

  const plColors: Record<ProductLine, string> = {
    mc: '#003365',
    cv: '#0891B2',
    rn: '#7C3AED',
    ru: '#D97706',
    general: '#6B7280',
  }

  return (
    <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="md">
      {grouped.map(({ productLine, pages: plPages }) => (
        <Card key={productLine} variant="elevated" className="!p-0 overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: plColors[productLine] }}>
            <span className="text-white font-bold text-sm">{PRODUCT_LINE_SHORT[productLine]}</span>
            <span className="text-white/80 text-sm">{PRODUCT_LINE_LABELS[productLine]}</span>
            <Badge className="!bg-white/20 !text-white !border-0 ml-auto text-xs">
              {plPages.length}
            </Badge>
          </div>
          <div className="p-3 max-h-[600px] overflow-y-auto">
            <Stack gap="xs">
              {plPages.map((page) => (
                <RouteRow key={page.path} page={page} />
              ))}
            </Stack>
          </div>
        </Card>
      ))}
    </Grid>
  )
}

// =============================================================================
// CTA AUDIT VIEW
// =============================================================================

function CTAAuditView({ pages }: { pages: PageEntry[] }) {
  // Group pages by expectedCTA, only show pages that should have CTAs
  const pagesWithCTA = pages.filter(p => p.expectedCTA !== 'none' && p.inSitemap)

  const ctaGroups: { cta: ExpectedCTA; label: string; color: string; pages: PageEntry[] }[] = [
    {
      cta: 'mc',
      label: 'MC CTA — Should link to MC Start Project',
      color: '#003365',
      pages: pagesWithCTA.filter(p => p.expectedCTA === 'mc'),
    },
    {
      cta: 'cv',
      label: 'CV CTA — Should link to CV Start Project',
      color: '#0891B2',
      pages: pagesWithCTA.filter(p => p.expectedCTA === 'cv'),
    },
    {
      cta: 'rn',
      label: 'RN CTA — Should link to RN Shop/Custom',
      color: '#7C3AED',
      pages: pagesWithCTA.filter(p => p.expectedCTA === 'rn'),
    },
    {
      cta: 'general',
      label: 'General CTA — Should link to /start-project',
      color: '#6B7280',
      pages: pagesWithCTA.filter(p => p.expectedCTA === 'general'),
    },
  ]

  return (
    <Stack gap="md">
      {/* Summary */}
      <Card variant="outlined" className="!p-4">
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pagesWithCTA.length}</p>
            <p className="text-xs text-gray-500">Pages with CTAs</p>
          </div>
          {ctaGroups.map(g => (
            <div key={g.cta} className="text-center">
              <p className="text-2xl font-bold" style={{ color: g.color }}>{g.pages.length}</p>
              <p className="text-xs text-gray-500">{CTA_LABELS[g.cta]}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">CTA Audit Checklist</p>
            <p className="text-sm text-amber-700 mt-1">
              Each page below should use the correct hero actions and FinalCTATemplate for its product line.
              MC pages should link to <code className="bg-amber-100 px-1 rounded">/start-project/mosquito-curtains</code>,
              CV pages to <code className="bg-amber-100 px-1 rounded">/start-project/clear-vinyl</code>,
              RN pages to <code className="bg-amber-100 px-1 rounded">/order/raw-netting</code> or <code className="bg-amber-100 px-1 rounded">/raw-netting/custom</code>.
            </p>
          </div>
        </div>
      </div>

      {ctaGroups.filter(g => g.pages.length > 0).map(group => (
        <Card key={group.cta} variant="elevated" className="!p-0 overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: group.color }}>
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">{group.label}</span>
            <Badge className="!bg-white/20 !text-white !border-0 ml-auto text-xs">
              {group.pages.length} pages
            </Badge>
          </div>
          <div className="p-3 max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2 pl-2">Page</th>
                  <th className="pb-2 w-16">Line</th>
                  <th className="pb-2 w-20">Type</th>
                  <th className="pb-2 w-20">CTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {group.pages.map(page => (
                  <tr key={page.path} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 pl-2">
                      <Link href={page.path} target="_blank" className="flex items-center gap-2 group">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-[#406517]">{page.name}</span>
                        <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-[#406517]" />
                      </Link>
                      <span className="text-xs text-gray-400">{page.path}</span>
                    </td>
                    <td className="py-2"><ProductLineBadge productLine={page.productLine} size="xs" /></td>
                    <td className="py-2"><span className="text-xs text-gray-500">{page.pageType}</span></td>
                    <td className="py-2"><CTABadge cta={page.expectedCTA} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </Stack>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AdminSitemapPage() {
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [productLineFilter, setProductLineFilter] = useState<ProductLineFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('product-lines')

  const stats = useMemo(() => {
    const plStats = getProductLineStats()
    const inSitemap = PAGE_REGISTRY.filter(p => p.inSitemap).length
    const privateCount = PAGE_REGISTRY.length - inSitemap
    return { total: PAGE_REGISTRY.length, inSitemap, privateCount, ...plStats }
  }, [])

  const filteredTotal = useMemo(() => {
    const q = search.toLowerCase().trim()
    return PAGE_REGISTRY.filter(page => {
      if (filterMode === 'sitemap' && !page.inSitemap) return false
      if (filterMode === 'private' && page.inSitemap) return false
      if (productLineFilter !== 'all' && page.productLine !== productLineFilter) return false
      if (q) {
        return page.name.toLowerCase().includes(q) ||
          page.path.toLowerCase().includes(q) ||
          (page.description?.toLowerCase().includes(q) ?? false)
      }
      return true
    }).length
  }, [search, filterMode, productLineFilter])

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-8 h-8" />
            <Heading level={1} className="!text-white !mb-0">Page Registry & Site Map</Heading>
          </div>
          <Text className="!text-white/70 mb-6">
            Every page classified by product line (MC, CV, RN, RU) with CTA validation.
          </Text>

          {/* Product line stat pills */}
          <div className="flex flex-wrap gap-3">
            <Badge className="!bg-white/10 !text-white !border-white/20 !text-sm !px-3 !py-1">
              {stats.total} Total Pages
            </Badge>
            <Badge className="!bg-[#003365] !text-white !border-0 !text-sm !px-3 !py-1">
              MC {stats.mc}
            </Badge>
            <Badge className="!bg-[#0891B2] !text-white !border-0 !text-sm !px-3 !py-1">
              CV {stats.cv}
            </Badge>
            <Badge className="!bg-[#7C3AED] !text-white !border-0 !text-sm !px-3 !py-1">
              RN {stats.rn}
            </Badge>
            <Badge className="!bg-[#D97706] !text-white !border-0 !text-sm !px-3 !py-1">
              RU {stats.ru}
            </Badge>
            <Badge className="!bg-white/10 !text-white !border-white/20 !text-sm !px-3 !py-1">
              General {stats.general}
            </Badge>
            <Badge className="!bg-[#406517] !text-white !border-0 !text-sm !px-3 !py-1">
              {stats.inSitemap} Public
            </Badge>
            <Badge className="!bg-gray-600 !text-white !border-0 !text-sm !px-3 !py-1">
              {stats.privateCount} Private
            </Badge>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex border-b border-gray-200">
          {([
            { id: 'product-lines' as ViewMode, label: 'By Product Line', icon: Layers },
            { id: 'sections' as ViewMode, label: 'By Section', icon: Layout },
            { id: 'cta-audit' as ViewMode, label: 'CTA Audit', icon: Zap },
          ]).map(tab => {
            const isActive = viewMode === tab.id
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#406517] text-[#406517]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search & Filter Bar */}
        {viewMode !== 'cta-audit' && (
          <Card variant="outlined" className="!p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages by name, path, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
                />
              </div>

              {/* Sitemap filter */}
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                <FilterButton active={filterMode === 'all'} onClick={() => setFilterMode('all')} icon={Filter} label="All" count={stats.total} />
                <FilterButton active={filterMode === 'sitemap'} onClick={() => setFilterMode('sitemap')} icon={Globe} label="Public" count={stats.inSitemap} />
                <FilterButton active={filterMode === 'private'} onClick={() => setFilterMode('private')} icon={Lock} label="Private" count={stats.privateCount} />
              </div>
            </div>

            {/* Product line filter */}
            {viewMode === 'sections' && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500 font-medium">Product Line:</span>
                {(['all', 'mc', 'cv', 'rn', 'ru', 'general'] as ProductLineFilter[]).map(pl => {
                  const isActive = productLineFilter === pl
                  return (
                    <button
                      key={pl}
                      onClick={() => setProductLineFilter(pl)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#406517] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pl === 'all' ? 'All' : PRODUCT_LINE_SHORT[pl]}
                    </button>
                  )
                })}
              </div>
            )}

            {search && (
              <Text size="sm" className="!text-gray-500 mt-2">
                Showing {filteredTotal} result{filteredTotal !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
              </Text>
            )}
          </Card>
        )}

        {/* Views */}
        {viewMode === 'sections' && (
          <SectionsView pages={PAGE_REGISTRY} filterMode={filterMode} productLineFilter={productLineFilter} search={search} />
        )}
        {viewMode === 'product-lines' && (
          <ProductLinesView pages={PAGE_REGISTRY} filterMode={filterMode} search={search} />
        )}
        {viewMode === 'cta-audit' && (
          <CTAAuditView pages={PAGE_REGISTRY} />
        )}

        {/* No results */}
        {viewMode !== 'cta-audit' && filteredTotal === 0 && (
          <Card variant="outlined" className="!p-12 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <Heading level={3} className="!text-gray-500 !mb-2">No pages found</Heading>
            <Text className="!text-gray-400">Try adjusting your search or filter.</Text>
          </Card>
        )}

        {/* Legend */}
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-gray-500 font-medium">Legend:</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-green-500" />
              <span className="text-gray-600">In public sitemap</span>
            </span>
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-600">Private / not indexed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ProductLineBadge productLine="mc" size="xs" />
              <span className="text-gray-600">Mosquito Curtains</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ProductLineBadge productLine="cv" size="xs" />
              <span className="text-gray-600">Clear Vinyl</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ProductLineBadge productLine="rn" size="xs" />
              <span className="text-gray-600">Raw Netting</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ProductLineBadge productLine="ru" size="xs" />
              <span className="text-gray-600">Roll-Up Shades</span>
            </span>
          </div>
        </Card>
      </Stack>
    </Container>
  )
}

// =============================================================================
// FILTER BUTTON
// =============================================================================

function FilterButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Filter
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
        ${active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      <span className={`ml-0.5 ${active ? 'text-gray-500' : 'text-gray-400'}`}>
        {count}
      </span>
    </button>
  )
}
