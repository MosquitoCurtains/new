// Mosquito Curtains Navigation Configuration

import {
  LucideIcon,
  Home,
  Layers,
  Settings,
  ShoppingCart,
  Users,
  FileText,
  Menu,
  Eye,
  Calculator,
  LayoutGrid,
  Wrench,
  Image,
  Info,
  Package,
  MessageCircle,
  DollarSign,
  Truck,
  BarChart3,
  Target,
  UserCheck,
  FileUser,
  Shield,
  Map,
  Bell,
  Download,
  Megaphone,
  Briefcase,
  FolderOpen,
  Link2,
  Kanban,
} from 'lucide-react'

export interface NavItem {
  name: string
  label?: string
  href: string
  icon?: LucideIcon
  children?: NavItem[]
  badge?: string
  requiresAuth?: boolean
  hasDropdown?: boolean
}

export interface AdminNavSection {
  label: string
  items: NavItem[]
}

// ---------------------------------------------------------------------------
// Main public navigation (full menu matching mosquitocurtains.com)
// ---------------------------------------------------------------------------

export const userNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },

  {
    name: 'Products',
    href: '/products',
    icon: Layers,
    hasDropdown: true,
    children: [
      { name: 'Mosquito Curtains', href: '/screened-porch-enclosures' },
      { name: 'Clear Vinyl Winter Panels', href: '/clear-vinyl-plastic-patio-enclosures' },
      { name: 'Raw Netting', href: '/raw-netting-fabric-store' },
      { name: 'Roll Up Shade Screens', href: '/roll-up-shade-screens' },
    ],
  },

  {
    name: 'Learn Options',
    href: '/options',
    icon: Eye,
    hasDropdown: true,
    children: [
      { name: 'Mosquito Curtain Options', href: '/options' },
      { name: 'Clear Vinyl Options', href: '/clear-vinyl-options' },
    ],
  },

  {
    name: 'Instant Quote',
    href: '/quote/mosquito-curtains',
    icon: Calculator,
    hasDropdown: true,
    children: [
      { name: 'Mosquito Curtain Instant Quote', href: '/quote/mosquito-curtains' },
      { name: 'Clear Vinyl Instant Quote', href: '/quote/clear-vinyl' },
    ],
  },

  {
    name: 'Applications',
    href: '/applications',
    icon: LayoutGrid,
    hasDropdown: true,
    children: [
      { name: 'Awning Screen Enclosures', href: '/awning-screen-enclosures' },
      { name: 'Boat Screens', href: '/boat-screens' },
      { name: 'Camping Net', href: '/camping-net' },
      { name: 'Clear Vinyl Enclosures', href: '/clear-vinyl-plastic-patio-enclosures' },
      { name: 'Deck Screens', href: '/screened-in-decks' },
      { name: 'French Door Screens', href: '/french-door-screens' },
      { name: 'Garage Door Screens', href: '/garage-door-screens' },
      { name: 'Gazebo Screen Curtains', href: '/gazebo-screen-curtains' },
      { name: 'HVAC Chiller Screens', href: '/hvac-chiller-screens' },
      { name: 'Industrial Netting', href: '/industrial-netting' },
      { name: 'Outdoor Projection Screens', href: '/outdoor-projection-screens' },
      { name: 'Patio Enclosures', href: '/screen-patio' },
      { name: 'Pergola Screen Curtains', href: '/pergola-screen-curtains' },
      { name: 'Porch Enclosures', href: '/screened-porch' },
      { name: 'Roll Up Shade Screens', href: '/roll-up-shade-screens' },
      { name: 'Tent Screens', href: '/tent-screens' },
      { name: 'Theater Scrims', href: '/theater-scrims' },
      { name: 'Yardistry Gazebo Curtains', href: '/yardistry-gazebo-curtains' },
    ],
  },

  {
    name: 'Install',
    href: '/install',
    icon: Wrench,
    hasDropdown: true,
    children: [
      { name: 'Mosquito Curtains Tracking Installation', href: '/install/tracking' },
      { name: 'Mosquito Curtains Velcro Installation', href: '/install/velcro' },
      { name: 'Clear Vinyl Installation', href: '/install/clear-vinyl' },
      { name: 'Caring For Mosquito Curtains', href: '/care/mosquito-curtains' },
      { name: 'Caring For Clear Vinyl', href: '/care/clear-vinyl' },
    ],
  },

  {
    name: 'Gallery',
    href: '/gallery',
    icon: Image,
    hasDropdown: true,
    children: [
      { name: 'Mosquito Curtains', href: '/gallery?filter=mosquito_curtains' },
      { name: 'Clear Vinyl Plastic', href: '/gallery?filter=clear_vinyl' },
      { name: 'Video Gallery', href: '/videos' },
    ],
  },

  {
    name: 'About',
    href: '/about',
    icon: Info,
    hasDropdown: true,
    children: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'Customer Reviews', href: '/reviews' },
      { name: 'Shipping', href: '/shipping' },
      {
        name: "FAQ's",
        href: '/faq',
        hasDropdown: true,
        children: [
          { name: "Mosquito Curtains FAQ's", href: '/faq/mosquito-curtains' },
          { name: 'Clear Vinyl FAQs', href: '/faq/clear-vinyl' },
        ],
      },
      { name: 'Satisfaction Guarantee', href: '/satisfaction-guarantee' },
      { name: 'Opportunities', href: '/opportunities' },
    ],
  },

  {
    name: 'Order',
    href: '/order',
    icon: Package,
    hasDropdown: true,
    children: [
      { name: 'Order Mosquito Curtains', href: '/order/mosquito-curtains' },
      { name: 'Order Tracking Hardware', href: '/order/track-hardware' },
      { name: 'Order Attachment Hardware', href: '/order/attachments' },
      { name: 'Order Clear Vinyl', href: '/order/clear-vinyl' },
      { name: 'Order Mosquito Netting & Other Mesh Types', href: '/raw-netting-fabric-store' },
      { name: 'Order Roll Up Shade Screens', href: '/order/roll-up-shades' },
    ],
  },

  { name: 'Contact Us', href: '/contact', icon: MessageCircle },
]

// ---------------------------------------------------------------------------
// Admin sidebar navigation - grouped by section
// ---------------------------------------------------------------------------

export const adminNavSections: AdminNavSection[] = [
  {
    label: 'Sales & Orders',
    items: [
      {
        name: 'Sales',
        href: '/admin/mc-sales',
        icon: Briefcase,
        hasDropdown: true,
        children: [
          { name: 'MC Sales', href: '/admin/mc-sales' },
          { name: 'CV Sales', href: '/admin/cv-sales' },
          { name: 'RN Sales', href: '/admin/rn-sales' },
          { name: 'RU Sales', href: '/admin/ru-sales' },
        ],
      },
      { name: 'Orders', href: '/admin/orders', icon: Package },
    ],
  },
  {
    label: 'CRM',
    items: [
      { name: 'Pipeline', href: '/admin/crm', icon: Kanban },
      { name: 'Projects', href: '/admin/crm/projects', icon: FolderOpen },
      { name: 'Leads', href: '/admin/leads', icon: FileUser },
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Business', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Attribution', href: '/admin/mc-sales/analytics', icon: Target },
      { name: 'Customer Journeys', href: '/admin/mc-sales/analytics/waterfall', icon: UserCheck },
      { name: 'Leads', href: '/admin/mc-sales/analytics/leads', icon: FileUser },
      { name: 'Google Ads', href: '/admin/mc-sales/analytics/ads', icon: Megaphone },
      { name: 'UTM Builder', href: '/admin/utm-builder', icon: Link2 },
    ],
  },
  {
    label: 'Content & Media',
    items: [
      {
        name: 'Galleries',
        href: '/admin/galleries',
        icon: Image,
        hasDropdown: true,
        children: [
          { name: 'All Galleries', href: '/admin/galleries' },
          { name: 'Mesh Gallery', href: '/admin/galleries/mesh' },
        ],
      },
      { name: 'Site Assets', href: '/admin/assets', icon: FolderOpen },
      { name: 'Site Audit', href: '/admin/audit', icon: Shield },
      { name: 'Sitemap', href: '/admin/sitemap', icon: Map },
    ],
  },
  {
    label: 'Pricing & Config',
    items: [
      { name: 'Product Pricing', href: '/admin/pricing', icon: DollarSign },
      { name: 'Instant Quote Pricing', href: '/admin/instant-quote', icon: Calculator },
      { name: 'Shipping & Tax', href: '/admin/shipping-tax', icon: Truck },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Staff', href: '/admin/staff', icon: Users },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
      { name: 'Data Export', href: '/admin/export', icon: Download },
    ],
  },
]

// Flat admin navigation (for compatibility with Sidebar/MobileBottomNav)
export const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutGrid },
  ...adminNavSections.flatMap((s) => s.items),
]

// ---------------------------------------------------------------------------
// Mobile bottom navigation (simplified)
// ---------------------------------------------------------------------------

export const mobileNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Layers },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'More', href: '#', icon: Menu },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if nav item is active based on current pathname */
export function isNavItemActive(item: NavItem | string, pathname: string): boolean {
  const href = typeof item === 'string' ? item : item.href
  if (href === '/' || href === '/admin') {
    return pathname === href
  }
  if (href === '#') {
    return false
  }
  // Exact match for analytics parent so it doesn't highlight on sub-pages
  if (href === '/admin/mc-sales/analytics') {
    return pathname === href
  }
  return pathname.startsWith(href)
}

// Export aliases for compatibility
export { adminNavigation as centralAdminNav }
export { mobileNavigation as centralMobileNav }
export type { NavItem as CentralNavItem }
