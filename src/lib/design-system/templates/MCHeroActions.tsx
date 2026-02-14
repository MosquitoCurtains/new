'use client'

import { MessageSquare, Calculator, Hammer, Scissors, ShoppingCart, LucideIcon } from 'lucide-react'

// ============================================================================
// HERO ACTIONS — Edit Once, Update All Landing Pages
// ============================================================================
//
// Product-line-specific action buttons shown in the PowerHeaderTemplate hero.
//
// MC pages  -> MC_HERO_ACTIONS  (Expert Assistance / DIY Builder / Instant Quote)
// CV pages  -> CV_HERO_ACTIONS  (Expert Assistance / DIY Builder / Instant Quote)
// RN pages  -> RN_HERO_ACTIONS  (Shop Fabric / Custom Cut / Expert Help)
// General   -> MC_HERO_ACTIONS  (default fallback)
//
// Use `getHeroActions(productLine)` in pages instead of importing a specific set.
// ============================================================================

export interface MCHeroAction {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText: string
  /** Brand color for icon background/text */
  color: string
}

// ============================================================================
// MC HERO ACTIONS — Mosquito Curtain Pages
// ============================================================================

export const MC_HERO_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project/mosquito-curtains/expert-assistance',
    buttonText: 'Get Help',
    color: '#406517', // Brand green
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project/mosquito-curtains/diy-builder',
    buttonText: 'Build',
    color: '#B30158', // Brand magenta
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project/mosquito-curtains/instant-quote',
    buttonText: 'Calculate',
    color: '#003365', // Brand blue
  },
]

/** Alias for backwards compat */
export const MC_ACTIONS = MC_HERO_ACTIONS

// ============================================================================
// CV HERO ACTIONS — Clear Vinyl Pages
// ============================================================================

export const CV_HERO_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project/clear-vinyl/expert-assistance',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure clear vinyl panels and add to cart.',
    href: '/start-project/clear-vinyl/diy-builder',
    buttonText: 'Build',
    color: '#B30158',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project/clear-vinyl/instant-quote',
    buttonText: 'Calculate',
    color: '#003365',
  },
]

// ============================================================================
// RN HERO ACTIONS — Raw Netting Pages
// ============================================================================

export const RN_HERO_ACTIONS: MCHeroAction[] = [
  {
    icon: ShoppingCart,
    title: 'Shop Fabric',
    description: 'Browse our full selection of raw mesh and netting by the foot.',
    href: '/order/raw-netting',
    buttonText: 'Shop Now',
    color: '#7C3AED', // Purple for RN brand
  },
  {
    icon: Scissors,
    title: 'Custom Cut',
    description: 'Need a specific size? We cut to your measurements.',
    href: '/raw-netting/custom',
    buttonText: 'Custom Order',
    color: '#B30158',
  },
  {
    icon: MessageSquare,
    title: 'Expert Help',
    description: 'Not sure what you need? Our team can help.',
    href: '/start-project/raw-netting/expert-assistance',
    buttonText: 'Get Help',
    color: '#406517',
  },
]

// ============================================================================
// GENERAL / SIMPLE ACTIONS — Fallback for general pages
// ============================================================================

export const MC_SIMPLE_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project',
    buttonText: 'Build',
    color: '#B30158',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project',
    buttonText: 'Calculate',
    color: '#003365',
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get hero actions by product line — preferred way to get CTA actions.
 * 
 * @example
 * import { getHeroActions } from '@/lib/design-system'
 * const actions = getHeroActions('cv')
 * <PowerHeaderTemplate actions={actions} ... />
 */
export function getHeroActions(
  productLine: 'mc' | 'cv' | 'rn' | 'general' = 'mc'
): MCHeroAction[] {
  switch (productLine) {
    case 'cv':
      return CV_HERO_ACTIONS
    case 'rn':
      return RN_HERO_ACTIONS
    case 'general':
      return MC_SIMPLE_ACTIONS
    default:
      return MC_HERO_ACTIONS
  }
}

/**
 * @deprecated Use `getHeroActions()` instead. Kept for backwards compatibility.
 */
export function getMCHeroActions(
  pageType: 'mc' | 'cv' | 'rn' | 'simple' | 'general' = 'mc'
): MCHeroAction[] {
  if (pageType === 'simple') return MC_SIMPLE_ACTIONS
  return getHeroActions(pageType as 'mc' | 'cv' | 'rn' | 'general')
}
