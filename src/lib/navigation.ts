// Mosquito Curtains Navigation Configuration

import { LucideIcon, Home, Layers, Settings, ShoppingCart, Users, FileText, Menu } from 'lucide-react'

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

// Main public navigation
export const userNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Mosquito Curtains', href: '/screened-porch-enclosures', icon: Layers },
  { name: 'Clear Vinyl', href: '/clear-vinyl-plastic-patio-enclosures', icon: Layers },
  { name: 'Raw Netting', href: '/raw-netting-fabric-store', icon: Layers },
  { name: 'Start a Project', href: '/start-project', icon: FileText },
]

// Admin/Staff navigation
export const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FileText },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

// Mobile navigation
export const mobileNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/screened-porch-enclosures', icon: Layers },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'More', href: '#', icon: Menu },
]

// Helper to check if nav item is active
export function isNavItemActive(item: NavItem | string, pathname: string): boolean {
  const href = typeof item === 'string' ? item : item.href
  if (href === '/') {
    return pathname === '/'
  }
  if (href === '#') {
    return false
  }
  return pathname.startsWith(href)
}

// Export aliases for compatibility
export { adminNavigation as centralAdminNav }
export { mobileNavigation as centralMobileNav }
export type { NavItem as CentralNavItem }
