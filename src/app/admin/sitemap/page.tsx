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
  BarChart3,
  Search,
  Globe,
  Lock,
  Palette,
  Megaphone,
  BookOpen,
  Layers,
  Settings,
  Truck,
  Eye,
  EyeOff,
  Filter,
  ScrollText,
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

interface SiteRoute {
  path: string
  name: string
  description?: string
  inSitemap: boolean // Is this in the public SEO sitemap?
  dynamicParent?: string // If set, this route is a child of a dynamic [slug] route
}

interface SiteSection {
  title: string
  icon: typeof Home
  color: string
  routes: SiteRoute[]
}

// =============================================================================
// COMPLETE SITE MAP — EVERY PAGE IN THE PROJECT
// =============================================================================

const SITE_SECTIONS: SiteSection[] = [
  // ── Core ─────────────────────────────────────────────────────────────────
  {
    title: 'Core Pages',
    icon: Home,
    color: '#406517',
    routes: [
      { path: '/', name: 'Homepage', description: 'Main landing page', inSitemap: true },
      { path: '/about', name: 'About Us', inSitemap: true },
      { path: '/our-story', name: 'Our Story', inSitemap: true },
      { path: '/products', name: 'Products Hub', description: 'All product categories', inSitemap: true },
      { path: '/applications', name: 'Applications', description: 'Use-case overview', inSitemap: true },
    ],
  },

  // ── Mosquito Curtains & Mesh Products ────────────────────────────────────
  {
    title: 'Mosquito Curtain Products',
    icon: Package,
    color: '#003365',
    routes: [
      { path: '/screened-porch-enclosures', name: 'Mosquito Curtains (Main)', description: 'Primary MC landing page', inSitemap: true },
      { path: '/mosquito-netting', name: 'Mosquito Netting', inSitemap: true },
      { path: '/no-see-um-netting-screen', name: 'No-See-Um Netting', inSitemap: true },
      { path: '/shade-screen-mesh', name: 'Shade Screen Mesh', inSitemap: true },
      { path: '/industrial-mesh', name: 'Industrial Mesh', inSitemap: true },
      { path: '/industrial-netting', name: 'Industrial Netting', inSitemap: true },
      { path: '/theatre-scrim', name: 'Theatre Scrim', inSitemap: true },
      { path: '/theater-scrims', name: 'Theater Scrims', description: 'Alt spelling landing', inSitemap: true },
      { path: '/roll-up-shade-screens', name: 'Roll-Up Shade Screens', inSitemap: true },
      { path: '/heavy-track', name: 'Heavy Track', inSitemap: true },
      { path: '/camping-net', name: 'Camping Net', inSitemap: true },
      { path: '/outdoor-projection-screens', name: 'Outdoor Projection Screens', inSitemap: true },
      { path: '/pollen-protection', name: 'Pollen Protection', inSitemap: true },
      { path: '/tent-screens', name: 'Tent Screens', inSitemap: true },
      { path: '/weather-curtains', name: 'Weather Curtains', inSitemap: true },
      { path: '/insulated-curtain-panels', name: 'Insulated Curtain Panels', inSitemap: true },
    ],
  },

  // ── Clear Vinyl Products ─────────────────────────────────────────────────
  {
    title: 'Clear Vinyl Products',
    icon: Package,
    color: '#0891B2',
    routes: [
      { path: '/clear-vinyl-plastic-patio-enclosures', name: 'Clear Vinyl (Main)', description: 'Primary CV landing page', inSitemap: true },
      { path: '/ordering-clear-vinyl', name: 'Ordering Clear Vinyl', inSitemap: true },
      { path: '/porch-vinyl-curtains', name: 'Porch Vinyl Curtains', inSitemap: true },
      { path: '/porch-vinyl-panels', name: 'Porch Vinyl Panels', inSitemap: true },
    ],
  },

  // ── Raw Netting / DIY Fabric ─────────────────────────────────────────────
  {
    title: 'Raw Netting & DIY Fabric',
    icon: Layers,
    color: '#7C3AED',
    routes: [
      { path: '/raw-netting', name: 'Raw Netting Hub', inSitemap: true },
      { path: '/raw-netting-fabric-store', name: 'Raw Netting Fabric Store', inSitemap: true },
      { path: '/raw-netting/mosquito-net', name: 'Mosquito Net Fabric', inSitemap: true },
      { path: '/raw-netting/no-see-um', name: 'No-See-Um Fabric', inSitemap: true },
      { path: '/raw-netting/shade-mesh', name: 'Shade Mesh Fabric', inSitemap: true },
      { path: '/raw-netting/industrial', name: 'Industrial Fabric', inSitemap: true },
      { path: '/raw-netting/scrim', name: 'Scrim Fabric', inSitemap: true },
      { path: '/raw-netting/custom', name: 'Custom Fabric', inSitemap: true },
      { path: '/raw-netting/hardware', name: 'Hardware', inSitemap: true },
      { path: '/raw-netting/rigging', name: 'Rigging', inSitemap: true },
      { path: '/raw-netting/why-us', name: 'Why Buy From Us', inSitemap: true },
    ],
  },

  // ── SEO Landing Pages (Project Types) ────────────────────────────────────
  {
    title: 'SEO Landing Pages',
    icon: MapPin,
    color: '#B30158',
    routes: [
      { path: '/screened-porch', name: 'Screened Porch', inSitemap: true },
      { path: '/screen-patio', name: 'Screen Patio', inSitemap: true },
      { path: '/screened-in-decks', name: 'Screened-In Decks', inSitemap: true },
      { path: '/garage-door-screens', name: 'Garage Door Screens', inSitemap: true },
      { path: '/pergola-screen-curtains', name: 'Pergola Screens', inSitemap: true },
      { path: '/gazebo-screen-curtains', name: 'Gazebo Screens', inSitemap: true },
      { path: '/yardistry-gazebo-curtains', name: 'Yardistry Gazebo Curtains', inSitemap: true },
      { path: '/awning-screen-enclosures', name: 'Awning Enclosures', inSitemap: true },
      { path: '/french-door-screens', name: 'French Door Screens', inSitemap: true },
      { path: '/boat-screens', name: 'Boat Screens', inSitemap: true },
      { path: '/hvac-chiller-screens', name: 'HVAC Chiller Screens', inSitemap: true },
      { path: '/porch-winterize', name: 'Porch Winterize', inSitemap: true },
      { path: '/patio-winterize', name: 'Patio Winterize', inSitemap: true },
    ],
  },

  // ── Clear Vinyl Options ──────────────────────────────────────────────────
  {
    title: 'Clear Vinyl Options & Guides',
    icon: Settings,
    color: '#FFA501',
    routes: [
      { path: '/options', name: 'Options Hub', inSitemap: true },
      { path: '/options/clear-vinyl', name: 'CV Options Overview', inSitemap: true },
      { path: '/options/clear-vinyl/quality', name: 'CV Quality', inSitemap: true },
      { path: '/options/clear-vinyl/ordering', name: 'CV Ordering', inSitemap: true },
      { path: '/options/clear-vinyl/considerations', name: 'CV Considerations', inSitemap: true },
      { path: '/options/clear-vinyl/diy', name: 'CV DIY', inSitemap: true },
      { path: '/options/clear-vinyl/apron-colors', name: 'CV Apron Colors', inSitemap: true },
      { path: '/clear-vinyl-options', name: 'Clear Vinyl Options', description: 'Alt landing', inSitemap: true },
    ],
  },

  // ── Ordering Pages ───────────────────────────────────────────────────────
  {
    title: 'Ordering Pages',
    icon: ShoppingCart,
    color: '#10B981',
    routes: [
      { path: '/order', name: 'Order Hub', description: 'Main ordering page', inSitemap: true },
      { path: '/order/mosquito-curtains', name: 'Order: Mosquito Curtains', inSitemap: true },
      { path: '/order/clear-vinyl', name: 'Order: Clear Vinyl', inSitemap: true },
      { path: '/order/raw-netting', name: 'Order: Raw Netting', inSitemap: true },
      { path: '/order/roll-up-shades', name: 'Order: Roll-Up Shades', inSitemap: true },
      { path: '/order/track-hardware', name: 'Order: Track Hardware', inSitemap: true },
      { path: '/order/attachments', name: 'Order: Attachments', inSitemap: true },
      { path: '/order/raw-netting-attachments', name: 'Order: Raw Netting Attachments', inSitemap: true },
      { path: '/order-mesh-panels', name: 'Order Mesh Panels', description: 'Legacy ordering URL', inSitemap: true },
      { path: '/order-mesh-netting-fabrics', name: 'Order Mesh Netting Fabrics', description: 'Legacy ordering URL', inSitemap: true },
      { path: '/order-attachments', name: 'Order Attachments', description: 'Legacy ordering URL', inSitemap: true },
      { path: '/order-raw-netting-attachment-hardware', name: 'Order Raw Netting Hardware', description: 'Legacy ordering URL', inSitemap: true },
      { path: '/order-tracking', name: 'Order Tracking', description: 'Legacy ordering URL', inSitemap: true },
      { path: '/order/[id]', name: 'Order Confirmation', description: 'Dynamic per-order page', inSitemap: false },
    ],
  },

  // ── Quote & Start Project ────────────────────────────────────────────────
  {
    title: 'Quote & Start Project',
    icon: FileText,
    color: '#059669',
    routes: [
      { path: '/start-project', name: 'Start Project', description: 'Project wizard', inSitemap: true },
      { path: '/mosquito-curtains-instant-quote', name: 'MC Instant Quote', inSitemap: true },
      { path: '/clear-vinyl-instant-quote', name: 'CV Instant Quote', inSitemap: true },
      { path: '/quote/mosquito-curtains', name: 'MC Quote Form', inSitemap: true },
      { path: '/quote/clear-vinyl', name: 'CV Quote Form', inSitemap: true },
      { path: '/work-with-a-planner', name: 'Work With a Planner', inSitemap: true },
    ],
  },

  // ── Planning & Measurement Guides ────────────────────────────────────────
  {
    title: 'Planning & Measurement',
    icon: ScrollText,
    color: '#D97706',
    routes: [
      { path: '/plan', name: 'Planning Hub', inSitemap: true },
      { path: '/plan/overview', name: 'Overview', inSitemap: true },
      { path: '/plan/how-to-order', name: 'How to Order', inSitemap: true },
      { path: '/plan/tracking', name: 'Tracking Guide', inSitemap: true },
      { path: '/plan/mesh-colors', name: 'Mesh Colors', inSitemap: true },
      { path: '/plan/magnetic-doorways', name: 'Magnetic Doorways', inSitemap: true },
      { path: '/plan/sealing-base', name: 'Sealing the Base', inSitemap: true },
      { path: '/plan/free-standing', name: 'Free-Standing', inSitemap: true },
      { path: '/plan/tents-awnings', name: 'Tents & Awnings', inSitemap: true },
      { path: '/plan/1-sided', name: '1-Sided Opening', inSitemap: true },
      { path: '/plan/2-sided', name: '2-Sided Opening', inSitemap: true },
      { path: '/plan/2-sided/regular-tracking', name: '2-Sided Regular Tracking', inSitemap: true },
      { path: '/plan/2-sided/regular-velcro', name: '2-Sided Regular Velcro', inSitemap: true },
      { path: '/plan/2-sided/irregular-tracking', name: '2-Sided Irregular Tracking', inSitemap: true },
      { path: '/plan/2-sided/irregular-velcro', name: '2-Sided Irregular Velcro', inSitemap: true },
      { path: '/plan/3-sided', name: '3-Sided Opening', inSitemap: true },
      { path: '/plan/3-sided/regular-tracking', name: '3-Sided Regular Tracking', inSitemap: true },
      { path: '/plan/3-sided/regular-velcro', name: '3-Sided Regular Velcro', inSitemap: true },
      { path: '/plan/3-sided/irregular-tracking', name: '3-Sided Irregular Tracking', inSitemap: true },
      { path: '/plan/3-sided/irregular-velcro', name: '3-Sided Irregular Velcro', inSitemap: true },
      { path: '/plan/4-sided', name: '4-Sided Opening', inSitemap: true },
      { path: '/plan/4-sided/regular-tracking', name: '4-Sided Regular Tracking', inSitemap: true },
      { path: '/plan/4-sided/regular-velcro', name: '4-Sided Regular Velcro', inSitemap: true },
      { path: '/plan/4-sided/irregular-tracking', name: '4-Sided Irregular Tracking', inSitemap: true },
      { path: '/plan/4-sided/irregular-velcro', name: '4-Sided Irregular Velcro', inSitemap: true },
    ],
  },

  // ── Installation Guides ──────────────────────────────────────────────────
  {
    title: 'Installation Guides',
    icon: Wrench,
    color: '#406517',
    routes: [
      { path: '/install', name: 'Installation Hub', inSitemap: true },
      { path: '/install/tracking', name: 'Tracking Install', inSitemap: true },
      { path: '/install/velcro', name: 'Velcro Install', inSitemap: true },
      { path: '/install/clear-vinyl', name: 'Clear Vinyl Install', inSitemap: true },
    ],
  },

  // ── Care & Maintenance ───────────────────────────────────────────────────
  {
    title: 'Care & Maintenance',
    icon: Heart,
    color: '#EC4899',
    routes: [
      { path: '/care/mosquito-curtains', name: 'Mosquito Curtain Care', inSitemap: true },
      { path: '/care/clear-vinyl', name: 'Clear Vinyl Care', inSitemap: true },
    ],
  },

  // ── FAQ ───────────────────────────────────────────────────────────────────
  {
    title: 'FAQ',
    icon: HelpCircle,
    color: '#6366F1',
    routes: [
      { path: '/faq', name: 'FAQ Hub', inSitemap: true },
      { path: '/faq/mosquito-curtains', name: 'MC FAQ', description: '40+ questions', inSitemap: true },
      { path: '/faq/clear-vinyl', name: 'CV FAQ', inSitemap: true },
    ],
  },

  // ── Support & Company Info ───────────────────────────────────────────────
  {
    title: 'Support & Company Info',
    icon: Users,
    color: '#003365',
    routes: [
      { path: '/contact', name: 'Contact', inSitemap: true },
      { path: '/shipping', name: 'Shipping & Delivery', inSitemap: true },
      { path: '/returns', name: 'Returns Policy', inSitemap: true },
      { path: '/satisfaction-guarantee', name: 'Satisfaction Guarantee', inSitemap: true },
      { path: '/reviews', name: 'Reviews', inSitemap: true },
      { path: '/professionals', name: 'For Professionals', inSitemap: true },
      { path: '/contractors', name: 'For Contractors', inSitemap: true },
      { path: '/opportunities', name: 'Careers / Opportunities', inSitemap: true },
      { path: '/privacy-policy', name: 'Privacy Policy', inSitemap: true },
    ],
  },

  // ── Gallery & Media ──────────────────────────────────────────────────────
  {
    title: 'Gallery & Media',
    icon: Image,
    color: '#F59E0B',
    routes: [
      { path: '/gallery', name: 'Gallery Hub', inSitemap: true },
      { path: '/gallery/[slug]', name: 'Gallery Collection', description: 'Dynamic route — 6 collections', inSitemap: false },
      { path: '/gallery/featured', name: 'Featured Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/gallery/porch-projects', name: 'Porch Projects Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/gallery/clear-vinyl', name: 'Clear Vinyl Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/gallery/mosquito-netting', name: 'Mosquito Netting Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/gallery/white-netting', name: 'White Netting Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/gallery/black-netting', name: 'Black Netting Collection', inSitemap: true, dynamicParent: '/gallery/[slug]' },
      { path: '/photos', name: 'Photos', inSitemap: true },
      { path: '/videos', name: 'Videos', inSitemap: true },
      { path: '/projects', name: 'Projects', inSitemap: true },
    ],
  },

  // ── Blog ─────────────────────────────────────────────────────────────────
  {
    title: 'Blog',
    icon: BookOpen,
    color: '#8B5CF6',
    routes: [
      { path: '/blog', name: 'Blog Index', inSitemap: true },
      { path: '/blog/[slug]', name: 'Blog Post', description: 'Dynamic route — 17 posts', inSitemap: false },
      { path: '/blog/history-of-mosquitoes', name: 'History of Mosquitoes', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/mosquito-capitol-of-america', name: 'Mosquito Capitol of America', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/mosquito-enclosures-for-decks', name: 'Mosquito Enclosures for Decks', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/gazebos-then-and-now', name: 'Gazebos Then and Now', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/porch-too-beautiful-to-screen', name: 'Porch Too Beautiful to Screen', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/pollen-and-porches', name: 'Pollen and Porches', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/northern-mosquitoes', name: 'Northern Mosquitoes', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/storm-proof-screening', name: 'Storm-Proof Screening', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/west-nile-virus-effects', name: 'West Nile Virus Effects', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/mosquito-protection-summary', name: 'Mosquito Protection Summary', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/bond-sales-story', name: 'Bond Sales Story', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/kids-project', name: 'Kids Project', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/dear-martha-stewart', name: 'Dear Martha Stewart', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/work-is-good', name: 'Work is Good', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/mulligan-blocker', name: 'Mulligan Blocker', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/airlines-screen-doors', name: 'Airlines Screen Doors', inSitemap: true, dynamicParent: '/blog/[slug]' },
      { path: '/blog/outdoor-projection-screens', name: 'Outdoor Projection Screens', inSitemap: true, dynamicParent: '/blog/[slug]' },
    ],
  },

  // ── Sale ─────────────────────────────────────────────────────────────────
  {
    title: 'Sales & Promotions',
    icon: Megaphone,
    color: '#EF4444',
    routes: [
      { path: '/sale', name: 'Sale Page', inSitemap: true },
    ],
  },

  // ── Marketing Landing Pages ──────────────────────────────────────────────
  {
    title: 'Marketing Landing Pages',
    icon: Megaphone,
    color: '#14B8A6',
    routes: [
      { path: '/fb', name: 'Facebook Hub', description: 'FB ad landing', inSitemap: false },
      { path: '/fb/mc-quote', name: 'FB: MC Quote', description: 'Facebook MC ad', inSitemap: false },
      { path: '/fb/cv-quote', name: 'FB: CV Quote', description: 'Facebook CV ad', inSitemap: false },
      { path: '/reddit', name: 'Reddit Hub', description: 'Reddit ad landing', inSitemap: false },
      { path: '/reddit/mc-quote', name: 'Reddit: MC Quote', description: 'Reddit MC ad', inSitemap: false },
    ],
  },

  // ── E-commerce / Transactional ───────────────────────────────────────────
  {
    title: 'E-commerce (Transactional)',
    icon: ShoppingCart,
    color: '#64748B',
    routes: [
      { path: '/cart', name: 'Shopping Cart', inSitemap: false },
      { path: '/checkout', name: 'Checkout', inSitemap: false },
      { path: '/my-orders', name: 'My Orders', description: 'Customer order lookup', inSitemap: false },
      { path: '/my-projects', name: 'My Projects', description: 'Customer project lookup', inSitemap: false },
      { path: '/uploads', name: 'Uploads', description: 'File upload page', inSitemap: false },
      { path: '/project/[shareToken]', name: 'Shared Project', description: 'Dynamic project link', inSitemap: false },
      { path: '/experiment', name: 'Experiment', description: 'Internal testing', inSitemap: false },
    ],
  },

  // ── WordPress Legacy URLs (Canonical Wrappers) ─────────────────────────
  {
    title: 'WordPress Legacy URLs (Canonical Wrappers)',
    icon: Layers,
    color: '#9333EA',
    routes: [
      // Plan Section Wrappers (24 routes)
      { path: '/plan-screen-porch', name: 'Plan Screen Porch (WP)', description: 'Canonical wrapper for /plan', inSitemap: false },
      { path: '/plan-screen-porch/magnetic-doorways', name: 'Magnetic Doorways (WP)', description: 'Canonical wrapper for /plan/magnetic-doorways', inSitemap: false },
      { path: '/plan-screen-porch/mesh-and-colors', name: 'Mesh and Colors (WP)', description: 'Canonical wrapper for /plan/mesh-colors', inSitemap: false },
      { path: '/plan-screen-porch/outdoor-curtain-tracking', name: 'Outdoor Curtain Tracking (WP)', description: 'Canonical wrapper for /plan/tracking', inSitemap: false },
      { path: '/plan-screen-porch/how-to-order', name: 'How To Order (WP)', description: 'Canonical wrapper for /plan/how-to-order', inSitemap: false },
      { path: '/plan-screen-porch/sealing-the-base', name: 'Sealing The Base (WP)', description: 'Canonical wrapper for /plan/sealing-base', inSitemap: false },
      { path: '/plan-screen-porch/free-standing', name: 'Free Standing (WP)', description: 'Canonical wrapper for /plan/free-standing', inSitemap: false },
      { path: '/plan-screen-porch/tents-and-awnings', name: 'Tents and Awnings (WP)', description: 'Canonical wrapper for /plan/tents-awnings', inSitemap: false },
      { path: '/plan-screen-porch/single-sided-exposure', name: 'Single Sided Exposure (WP)', description: 'Canonical wrapper for /plan/1-sided', inSitemap: false },
      { path: '/plan-screen-porch/2-sided-exposure', name: '2-Sided Exposure (WP)', description: 'Canonical wrapper for /plan/2-sided', inSitemap: false },
      { path: '/plan-screen-porch/2-sided-exposure/regular-columns-tracking', name: '2S Regular Tracking (WP)', description: 'Canonical wrapper for /plan/2-sided/regular-tracking', inSitemap: false },
      { path: '/plan-screen-porch/2-sided-exposure/regular-columns-velcro', name: '2S Regular Velcro (WP)', description: 'Canonical wrapper for /plan/2-sided/regular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', name: '2S Irregular Tracking (WP)', description: 'Canonical wrapper for /plan/2-sided/irregular-tracking', inSitemap: false },
      { path: '/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', name: '2S Irregular Velcro (WP)', description: 'Canonical wrapper for /plan/2-sided/irregular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/3-sided-exposure', name: '3-Sided Exposure (WP)', description: 'Canonical wrapper for /plan/3-sided', inSitemap: false },
      { path: '/plan-screen-porch/3-sided-exposure/regular-columns-tracking', name: '3S Regular Tracking (WP)', description: 'Canonical wrapper for /plan/3-sided/regular-tracking', inSitemap: false },
      { path: '/plan-screen-porch/3-sided-exposure/regular-columns-velcro', name: '3S Regular Velcro (WP)', description: 'Canonical wrapper for /plan/3-sided/regular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', name: '3S Irregular Tracking (WP)', description: 'Canonical wrapper for /plan/3-sided/irregular-tracking', inSitemap: false },
      { path: '/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', name: '3S Irregular Velcro (WP)', description: 'Canonical wrapper for /plan/3-sided/irregular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/4-plus-sided-exposure', name: '4+ Sided Exposure (WP)', description: 'Canonical wrapper for /plan/4-sided', inSitemap: false },
      { path: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', name: '4S Regular Tracking (WP)', description: 'Canonical wrapper for /plan/4-sided/regular-tracking', inSitemap: false },
      { path: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', name: '4S Regular Velcro (WP)', description: 'Canonical wrapper for /plan/4-sided/regular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', name: '4S Irregular Velcro (WP)', description: 'Canonical wrapper for /plan/4-sided/irregular-velcro', inSitemap: false },
      { path: '/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', name: '4S Wrap-Around Tracking (WP)', description: 'Canonical wrapper for /plan/4-sided/irregular-tracking', inSitemap: false },

      // Care/FAQ/Install Wrappers (10 routes)
      { path: '/caring-for-clear-vinyl', name: 'Caring For Clear Vinyl (WP)', description: 'Canonical wrapper for /care/clear-vinyl', inSitemap: false },
      { path: '/caring-for-mosquito-curtains', name: 'Caring For MC (WP)', description: 'Canonical wrapper for /care/mosquito-curtains', inSitemap: false },
      { path: '/clear-vinyl-faq', name: 'CV FAQ (WP)', description: 'Canonical wrapper for /faq/clear-vinyl', inSitemap: false },
      { path: '/faqs', name: 'FAQs (WP)', description: 'Canonical wrapper for /faq', inSitemap: false },
      { path: '/mosquito-curtains-faq', name: 'MC FAQ (WP)', description: 'Canonical wrapper for /faq/mosquito-curtains', inSitemap: false },
      { path: '/mosquito-curtains-reviews', name: 'MC Reviews (WP)', description: 'Canonical wrapper for /reviews', inSitemap: false },
      { path: '/mosquito-curtains-tracking-installation', name: 'Tracking Install (WP)', description: 'Canonical wrapper for /install/tracking', inSitemap: false },
      { path: '/mosquito-curtains-velcro-installation', name: 'Velcro Install (WP)', description: 'Canonical wrapper for /install/velcro', inSitemap: false },
      { path: '/clear-vinyl-installation', name: 'CV Installation (WP)', description: 'Canonical wrapper for /install/clear-vinyl', inSitemap: false },
      { path: '/how-to-order', name: 'How To Order (WP)', description: 'Canonical wrapper for /plan/how-to-order', inSitemap: false },

      // Raw Netting Wrappers (5 routes)
      { path: '/mosquito-net', name: 'Mosquito Net (WP)', description: 'Canonical wrapper for /raw-netting/mosquito-net', inSitemap: false },
      { path: '/mosquito-netting/all-netting-and-attachment-hardware', name: 'Netting Hardware (WP)', description: 'Canonical wrapper for /raw-netting/hardware', inSitemap: false },
      { path: '/mosquito-netting/fasteners-and-rigging-ideas', name: 'Rigging Ideas (WP)', description: 'Canonical wrapper for /raw-netting/rigging', inSitemap: false },
      { path: '/mosquito-netting/why-us-for-raw-netting', name: 'Why Us (WP)', description: 'Canonical wrapper for /raw-netting/why-us', inSitemap: false },
      { path: '/mosquito-netting/let-us-make-it-for-you', name: 'Custom Netting (WP)', description: 'Canonical wrapper for /raw-netting/custom', inSitemap: false },

      // CV Options Wrappers (4 routes)
      { path: '/apron-colors-to-choose-from', name: 'Apron Colors (WP)', description: 'Canonical wrapper for /options/clear-vinyl/apron-colors', inSitemap: false },
      { path: '/clear-vinyl-self-installation-advantages', name: 'CV DIY (WP)', description: 'Canonical wrapper for /options/clear-vinyl/diy', inSitemap: false },
      { path: '/what-can-go-wrong-with-clear-vinyl', name: 'CV Considerations (WP)', description: 'Canonical wrapper for /options/clear-vinyl/considerations', inSitemap: false },
      { path: '/what-makes-our-clear-vinyl-product-better', name: 'CV Quality (WP)', description: 'Canonical wrapper for /options/clear-vinyl/quality', inSitemap: false },

      // Other Wrappers (7 routes)
      { path: '/tentscreenpanels', name: 'Tent Screens (WP)', description: 'Canonical wrapper for /tent-screens', inSitemap: false },
      { path: '/contractor', name: 'Contractor (WP)', description: 'Canonical wrapper for /contractors', inSitemap: false },
      { path: '/client-uploads', name: 'Client Uploads (WP)', description: 'Canonical wrapper for /uploads', inSitemap: false },
      { path: '/order-mosquito-curtains', name: 'Order MC (WP)', description: 'Canonical wrapper for /order/mosquito-curtains', inSitemap: false },
      { path: '/my-account', name: 'My Account (WP)', description: 'Canonical wrapper for /my-orders', inSitemap: false },
      { path: '/project-series', name: 'Project Series (WP)', description: 'Canonical wrapper for /projects', inSitemap: false },
      { path: '/project-planning', name: 'Project Planning', description: 'Canonical wrapper for /start-project', inSitemap: false },
    ],
  },

  // ── Session Prep & Utility ────────────────────────────────────────────
  {
    title: 'Session Prep & Utility',
    icon: FileText,
    color: '#059669',
    routes: [
      { path: '/mosquito-curtain-planning-session', name: 'MC Planning Session', description: 'Pre-session prep page for mosquito curtain planners', inSitemap: false },
      { path: '/clear-vinyl-planning-session', name: 'CV Planning Session', description: 'Pre-session prep page for clear vinyl planners', inSitemap: false },
      { path: '/prepare', name: 'Prepare (Post-Form)', description: 'Post-form preparation landing page', inSitemap: false },
      { path: '/form-entry', name: 'Form Entry (Post-Form)', description: 'Post-form entry landing page', inSitemap: false },
      { path: '/404-error-page', name: '404 Error Page', description: 'Custom 404 error page', inSitemap: false },
      { path: '/project-series/clear-vinyl-project-87444', name: 'CV Project #87444', description: 'Clear vinyl project series entry', inSitemap: false },
    ],
  },

  // ── Admin Pages ──────────────────────────────────────────────────────────
  {
    title: 'Admin Dashboard',
    icon: Lock,
    color: '#374151',
    routes: [
      { path: '/admin', name: 'Admin Home', inSitemap: false },
      { path: '/admin/sitemap', name: 'Site Map (this page)', inSitemap: false },
      { path: '/admin/pricing', name: 'Pricing Manager', inSitemap: false },
      { path: '/admin/sales', name: 'Sales Dashboard', inSitemap: false },
      { path: '/admin/mc-sales', name: 'MC Sales', inSitemap: false },
      { path: '/admin/mc-sales/analytics', name: 'MC Analytics', inSitemap: false },
      { path: '/admin/mc-sales/analytics/ads', name: 'MC Ad Analytics', inSitemap: false },
      { path: '/admin/mc-sales/analytics/leads', name: 'MC Lead Analytics', inSitemap: false },
      { path: '/admin/mc-sales/analytics/waterfall', name: 'MC Waterfall', inSitemap: false },
      { path: '/admin/cv-sales', name: 'CV Sales', inSitemap: false },
      { path: '/admin/rn-sales', name: 'RN Sales', inSitemap: false },
      { path: '/admin/ru-sales', name: 'RU Sales', inSitemap: false },
      { path: '/admin/audit', name: 'Page Audit', inSitemap: false },
      { path: '/admin/customers', name: 'Customer CRM', inSitemap: false },
      { path: '/admin/customers/[id]', name: 'Customer Detail', description: 'Dynamic customer page', inSitemap: false },
      { path: '/admin/analytics', name: 'Analytics', inSitemap: false },
      { path: '/admin/export', name: 'Financial Export', inSitemap: false },
      { path: '/admin/gallery', name: 'Gallery Manager', inSitemap: false },
      { path: '/admin/galleries', name: 'Collections Manager', inSitemap: false },
      { path: '/admin/notifications', name: 'Notifications', inSitemap: false },
      { path: '/admin/notifications/templates', name: 'Notification Templates', inSitemap: false },
      { path: '/admin/shipping-tax', name: 'Shipping & Tax', inSitemap: false },
    ],
  },

  // ── Design System ────────────────────────────────────────────────────────
  {
    title: 'Design System',
    icon: Palette,
    color: '#A855F7',
    routes: [
      { path: '/design-system', name: 'Design System Hub', inSitemap: false },
      { path: '/design-system/button', name: 'Button', inSitemap: false },
      { path: '/design-system/card', name: 'Card', inSitemap: false },
      { path: '/design-system/container', name: 'Container', inSitemap: false },
      { path: '/design-system/grid', name: 'Grid', inSitemap: false },
      { path: '/design-system/stack', name: 'Stack', inSitemap: false },
      { path: '/design-system/heading', name: 'Heading', inSitemap: false },
      { path: '/design-system/text', name: 'Text', inSitemap: false },
      { path: '/design-system/input', name: 'Input', inSitemap: false },
      { path: '/design-system/frame', name: 'Frame', inSitemap: false },
      { path: '/design-system/two-column', name: 'Two Column', inSitemap: false },
      { path: '/design-system/bulleted-list', name: 'Bulleted List', inSitemap: false },
      { path: '/design-system/gradient-section', name: 'Gradient Section', inSitemap: false },
      { path: '/design-system/header-bar-section', name: 'Header Bar Section', inSitemap: false },
      { path: '/design-system/cta-section', name: 'CTA Section', inSitemap: false },
      { path: '/design-system/feature-card', name: 'Feature Card', inSitemap: false },
      { path: '/design-system/youtube-embed', name: 'YouTube Embed', inSitemap: false },
      { path: '/design-system/power-header-template', name: 'Power Header Template', inSitemap: false },
      { path: '/design-system/final-cta-template', name: 'Final CTA Template', inSitemap: false },
      { path: '/design-system/why-choose-us-template', name: 'Why Choose Us Template', inSitemap: false },
    ],
  },
]

// =============================================================================
// FILTER OPTIONS
// =============================================================================

type FilterMode = 'all' | 'sitemap' | 'private'

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminSitemapPage() {
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  // Compute stats
  const stats = useMemo(() => {
    let total = 0
    let inSitemap = 0
    let privateCount = 0
    let sections = 0

    for (const section of SITE_SECTIONS) {
      sections++
      for (const route of section.routes) {
        total++
        if (route.inSitemap) inSitemap++
        else privateCount++
      }
    }

    return { total, inSitemap, privateCount, sections }
  }, [])

  // Filter sections/routes based on search and filter mode
  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()

    return SITE_SECTIONS.map((section) => {
      const filteredRoutes = section.routes.filter((route) => {
        // Filter mode
        if (filterMode === 'sitemap' && !route.inSitemap) return false
        if (filterMode === 'private' && route.inSitemap) return false

        // Search
        if (q) {
          return (
            route.name.toLowerCase().includes(q) ||
            route.path.toLowerCase().includes(q) ||
            (route.description?.toLowerCase().includes(q) ?? false)
          )
        }

        return true
      })

      return { ...section, routes: filteredRoutes }
    }).filter((section) => section.routes.length > 0)
  }, [search, filterMode])

  const filteredTotal = filteredSections.reduce((acc, s) => acc + s.routes.length, 0)

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-8 h-8" />
            <Heading level={1} className="!text-white !mb-0">Complete Site Map</Heading>
          </div>
          <Text className="!text-white/70 mb-6">
            Every page in the project. Click any link to open in a new tab.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Badge className="!bg-white/10 !text-white !border-white/20 !text-sm !px-3 !py-1">
              {stats.total} Total Pages
            </Badge>
            <Badge className="!bg-[#406517] !text-white !border-0 !text-sm !px-3 !py-1">
              {stats.inSitemap} In Public Sitemap
            </Badge>
            <Badge className="!bg-gray-600 !text-white !border-0 !text-sm !px-3 !py-1">
              {stats.privateCount} Private / Internal
            </Badge>
            <Badge className="!bg-white/10 !text-white !border-white/20 !text-sm !px-3 !py-1">
              {stats.sections} Sections
            </Badge>
          </div>
        </div>

        {/* Search & Filter Bar */}
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

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
              <FilterButton
                active={filterMode === 'all'}
                onClick={() => setFilterMode('all')}
                icon={Filter}
                label="All"
                count={stats.total}
              />
              <FilterButton
                active={filterMode === 'sitemap'}
                onClick={() => setFilterMode('sitemap')}
                icon={Globe}
                label="Public"
                count={stats.inSitemap}
              />
              <FilterButton
                active={filterMode === 'private'}
                onClick={() => setFilterMode('private')}
                icon={Lock}
                label="Private"
                count={stats.privateCount}
              />
            </div>
          </div>
          {search && (
            <Text size="sm" className="!text-gray-500 mt-2">
              Showing {filteredTotal} result{filteredTotal !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </Text>
          )}
        </Card>

        {/* Sections Grid */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
          {filteredSections.map((section) => (
            <Card key={section.title} variant="elevated" className="!p-0 overflow-hidden">
              {/* Section header */}
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: section.color }}
              >
                <section.icon className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">{section.title}</span>
                <Badge className="!bg-white/20 !text-white !border-0 ml-auto text-xs">
                  {section.routes.length}
                </Badge>
              </div>

              {/* Routes */}
              <div className="p-3 max-h-[500px] overflow-y-auto">
                <Stack gap="xs">
                  {section.routes.map((route) => {
                    const isDynamic = route.path.includes('[')
                    const isChild = !!route.dynamicParent

                    const content = (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm transition-colors ${isChild ? 'text-gray-700' : 'text-gray-900'} group-hover:text-[#406517]`}>
                              {route.name}
                            </span>
                            {route.inSitemap ? (
                              <span title="In public sitemap"><Globe className="w-3 h-3 text-green-500 shrink-0" /></span>
                            ) : (
                              <span title="Not in public sitemap"><EyeOff className="w-3 h-3 text-gray-300 shrink-0" /></span>
                            )}
                            {isDynamic && (
                              <Badge className="!bg-amber-100 !text-amber-700 !border-amber-200 !text-[10px] !px-1.5 !py-0">
                                Dynamic
                              </Badge>
                            )}
                          </div>
                          {route.description && (
                            <span className="text-xs text-gray-500">{route.description}</span>
                          )}
                          <span className="text-xs text-gray-400 block truncate">{route.path}</span>
                        </div>
                        {!isDynamic && (
                          <ExternalLink className={`w-4 h-4 group-hover:text-[#406517] flex-shrink-0 ml-2 ${isChild ? 'text-gray-200' : 'text-gray-300'}`} />
                        )}
                      </>
                    )

                    // Dynamic template route (e.g. /blog/[slug])
                    if (isDynamic) {
                      return (
                        <div
                          key={route.path}
                          className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 group"
                        >
                          {content}
                        </div>
                      )
                    }

                    // Child of a dynamic route (e.g. /blog/history-of-mosquitoes)
                    if (isChild) {
                      return (
                        <Link
                          key={route.path}
                          href={route.path}
                          target="_blank"
                          className="flex items-center justify-between p-2 pl-3 rounded-lg hover:bg-amber-50/50 transition-colors group ml-3 border-l-2 border-amber-300/60"
                        >
                          {content}
                        </Link>
                      )
                    }

                    // Regular static route
                    return (
                      <Link
                        key={route.path}
                        href={route.path}
                        target="_blank"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        {content}
                      </Link>
                    )
                  })}
                </Stack>
              </div>
            </Card>
          ))}
        </Grid>

        {/* No results */}
        {filteredSections.length === 0 && (
          <Card variant="outlined" className="!p-12 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <Heading level={3} className="!text-gray-500 !mb-2">No pages found</Heading>
            <Text className="!text-gray-400">
              Try adjusting your search or filter.
            </Text>
          </Card>
        )}

        {/* Legend */}
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-gray-500 font-medium">Legend:</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-green-500" />
              <span className="text-gray-600">In public sitemap (SEO indexed)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-600">Private / not indexed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Badge className="!bg-amber-100 !text-amber-700 !border-amber-200 !text-[10px] !px-1.5 !py-0">
                Dynamic
              </Badge>
              <span className="text-gray-600">Dynamic [slug] route</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 border-l-2 border-amber-300/60" />
              <span className="text-gray-600">Child of dynamic route</span>
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
