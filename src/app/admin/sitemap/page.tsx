'use client'

import Link from 'next/link'
import { 
  ExternalLink, 
  Home, 
  Package, 
  MapPin, 
  Settings, 
  Wrench,
  HelpCircle,
  Heart,
  Image,
  ShoppingCart,
  FileText,
  Layout,
  Users,
  BarChart3,
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

interface SiteSection {
  title: string
  icon: typeof Home
  color: string
  routes: {
    path: string
    name: string
    description?: string
    isNew?: boolean
  }[]
}

const SITE_SECTIONS: SiteSection[] = [
  {
    title: 'Core Pages',
    icon: Home,
    color: '#406517',
    routes: [
      { path: '/', name: 'Homepage', description: 'Main landing page' },
      { path: '/design-system', name: 'Design System', description: 'Component showcase' },
    ],
  },
  {
    title: 'Main Product Pages',
    icon: Package,
    color: '#003365',
    routes: [
      { path: '/screened-porch-enclosures', name: 'Mosquito Curtains', description: 'Main MC landing', isNew: true },
      { path: '/clear-vinyl-plastic-patio-enclosures', name: 'Clear Vinyl', description: 'Main CV landing', isNew: true },
    ],
  },
  {
    title: 'Project Type Pages (SEO)',
    icon: MapPin,
    color: '#B30158',
    routes: [
      { path: '/screened-porch', name: 'Screened Porch', isNew: true },
      { path: '/screen-patio', name: 'Screen Patio', isNew: true },
      { path: '/garage-door-screens', name: 'Garage Door Screens', isNew: true },
      { path: '/pergola-screen-curtains', name: 'Pergola Screens', isNew: true },
      { path: '/gazebo-screen-curtains', name: 'Gazebo Screens', isNew: true },
      { path: '/screened-in-decks', name: 'Screened-In Decks', isNew: true },
      { path: '/awning-screen-enclosures', name: 'Awning Enclosures', isNew: true },
      { path: '/industrial-netting', name: 'Industrial Netting', isNew: true },
    ],
  },
  {
    title: 'Project Planning',
    icon: Settings,
    color: '#FFA501',
    routes: [
      { path: '/options', name: 'Options Guide', description: 'Mesh, attachments, hardware', isNew: true },
      { path: '/start-project', name: 'Start Project', description: 'Wizard with instant quote', isNew: true },
      { path: '/my-projects', name: 'My Projects', description: 'Customer project lookup', isNew: true },
    ],
  },
  {
    title: 'E-commerce',
    icon: ShoppingCart,
    color: '#10B981',
    routes: [
      { path: '/cart', name: 'Shopping Cart', description: 'Cart with line items & checkout', isNew: true },
      { path: '/order/demo', name: 'Order Confirmation', description: 'Post-checkout success page', isNew: true },
      { path: '/my-orders', name: 'Order History', description: 'Customer order lookup', isNew: true },
    ],
  },
  {
    title: 'Admin Dashboard',
    icon: BarChart3,
    color: '#8B5CF6',
    routes: [
      { path: '/admin/customers', name: 'Customer CRM', description: 'Customer list with RFM & LTV', isNew: true },
      { path: '/admin/analytics', name: 'Analytics', description: 'Business metrics & KPIs', isNew: true },
      { path: '/admin/export', name: 'Financial Export', description: 'Export for accounting', isNew: true },
    ],
  },
  {
    title: 'Installation Guides',
    icon: Wrench,
    color: '#406517',
    routes: [
      { path: '/install', name: 'Installation Hub', isNew: true },
      { path: '/install/tracking', name: 'Tracking Install', isNew: true },
      { path: '/install/velcro', name: 'Velcro Install', isNew: true },
      { path: '/install/clear-vinyl', name: 'Clear Vinyl Install', isNew: true },
    ],
  },
  {
    title: 'Support & Info',
    icon: HelpCircle,
    color: '#003365',
    routes: [
      { path: '/about', name: 'About Us', isNew: true },
      { path: '/professionals', name: 'For Professionals', isNew: true },
      { path: '/contact', name: 'Contact', isNew: true },
      { path: '/shipping', name: 'Shipping & Delivery', isNew: true },
      { path: '/satisfaction-guarantee', name: 'Satisfaction Guarantee', isNew: true },
      { path: '/reviews', name: 'Reviews', isNew: true },
    ],
  },
  {
    title: 'Product Care',
    icon: Heart,
    color: '#B30158',
    routes: [
      { path: '/care/mosquito-curtains', name: 'Mosquito Curtain Care', isNew: true },
      { path: '/care/clear-vinyl', name: 'Clear Vinyl Care', isNew: true },
    ],
  },
  {
    title: 'Gallery System',
    icon: Image,
    color: '#FFA501',
    routes: [
      { path: '/gallery', name: 'Public Gallery', description: 'Filterable gallery', isNew: true },
      { path: '/gallery/featured', name: 'Featured Collection', isNew: true },
      { path: '/gallery/porch-projects', name: 'Porch Projects', isNew: true },
      { path: '/gallery/clear-vinyl', name: 'Clear Vinyl Gallery', isNew: true },
      { path: '/admin/gallery', name: 'Admin: Images', description: 'Manage images', isNew: true },
      { path: '/admin/galleries', name: 'Admin: Collections', description: 'Manage collections', isNew: true },
    ],
  },
  {
    title: 'Other Pages',
    icon: FileText,
    color: '#666666',
    routes: [
      { path: '/our-story', name: 'Our Story', description: 'Company story', isNew: true },
      { path: '/raw-netting-fabric-store', name: 'Raw Mesh Store', description: 'DIY materials', isNew: true },
    ],
  },
]

export default function AdminSitemapPage() {
  const totalPages = SITE_SECTIONS.reduce((acc, section) => acc + section.routes.length, 0)
  const newPages = SITE_SECTIONS.reduce(
    (acc, section) => acc + section.routes.filter(r => r.isNew).length, 
    0
  )

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-8 h-8" />
            <Heading level={1} className="!text-white !mb-0">Site Map</Heading>
          </div>
          <Text className="!text-white/70 mb-4">
            Quick navigation to all pages on the site. Click any link to open in a new tab.
          </Text>
          <div className="flex gap-4">
            <Badge className="!bg-white/10 !text-white !border-white/20">
              {totalPages} Total Pages
            </Badge>
            <Badge className="!bg-[#406517] !text-white !border-0">
              {newPages} New Pages Built
            </Badge>
          </div>
        </div>

        {/* Sections */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
          {SITE_SECTIONS.map((section) => (
            <Card key={section.title} variant="elevated" className="!p-0 overflow-hidden">
              <div 
                className="px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: section.color }}
              >
                <section.icon className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{section.title}</span>
                <Badge className="!bg-white/20 !text-white !border-0 ml-auto text-xs">
                  {section.routes.length}
                </Badge>
              </div>
              <div className="p-4">
                <Stack gap="xs">
                  {section.routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      target="_blank"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 group-hover:text-[#406517] transition-colors">
                            {route.name}
                          </span>
                          {route.isNew && (
                            <Badge className="!bg-green-100 !text-green-700 !border-green-200 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        {route.description && (
                          <span className="text-xs text-gray-500">{route.description}</span>
                        )}
                        <span className="text-xs text-gray-400 block truncate">{route.path}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#406517] flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </Stack>
              </div>
            </Card>
          ))}
        </Grid>

        {/* Quick Stats */}
        <Card variant="outlined" className="!p-6">
          <Heading level={3} className="!mb-4">Build Summary</Heading>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#406517]">5</p>
              <p className="text-sm text-gray-500">Page Templates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#003365]">10</p>
              <p className="text-sm text-gray-500">SEO Landing Pages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#10B981]">6</p>
              <p className="text-sm text-gray-500">E-commerce Pages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#8B5CF6]">{newPages}</p>
              <p className="text-sm text-gray-500">Total New Pages</p>
            </div>
          </Grid>
        </Card>

        {/* Database Info */}
        <Card variant="outlined" className="!p-4 !bg-blue-50 !border-blue-200">
          <Text size="sm" className="text-blue-800">
            <strong>Note:</strong> The e-commerce system requires running the database migrations in order:{' '}
            <code className="bg-blue-100 px-1 rounded">20260129000000_initial_schema.sql</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">20260131000000_gallery_tables.sql</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">20260202000000_ecommerce_schema.sql</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">20260202000001_seed_products.sql</code>, and{' '}
            <code className="bg-blue-100 px-1 rounded">20260202000002_legacy_product_mapping.sql</code>.
          </Text>
        </Card>
      </Stack>
    </Container>
  )
}
