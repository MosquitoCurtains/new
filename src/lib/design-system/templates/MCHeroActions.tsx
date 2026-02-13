'use client'

import { MessageSquare, Calculator, Hammer, LucideIcon } from 'lucide-react'

// ============================================================================
// MC HERO ACTIONS
// ============================================================================
// 
// EDIT HERE TO UPDATE ALL LANDING PAGES
// 
// This defines the action buttons that appear in the bottom bar of the 
// PowerHeaderTemplate (compact variant). Edit these once, update everywhere.
//
// Used by: /screened-porch, /pergola-screen-curtains, /gazebo-screen-curtains,
//          /screened-in-decks, /screen-patio, /awning-screen-enclosures, etc.
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
// MC HERO ACTIONS (GLOBAL)
// ============================================================================
// 
// These are the three action buttons shown in the hero section of landing pages.
// Edit these to change all pages that use MC_HERO_ACTIONS.

export const MC_HERO_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project?mode=planner',
    buttonText: 'Get Help',
    color: '#406517', // Brand green
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy',
    buttonText: 'Build',
    color: '#B30158', // Brand magenta
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote',
    buttonText: 'Calculate',
    color: '#003365', // Brand blue
  },
]

// ============================================================================
// VARIANT CONFIGURATIONS
// ============================================================================
// 
// Different action sets for different page types. All still globally editable.

/**
 * Actions for Mosquito Curtain product pages (default)
 * Uses the full project flow with Expert Assistance, Quote, and DIY
 */
export const MC_ACTIONS = MC_HERO_ACTIONS

/**
 * Actions for Clear Vinyl product pages
 * Same structure, could be customized in future if needed
 */
export const CV_HERO_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project?mode=planner',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy',
    buttonText: 'Build',
    color: '#B30158',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote',
    buttonText: 'Calculate',
    color: '#003365',
  },
]

/**
 * Simplified actions for info/support pages
 * Fewer options, focused on contact
 */
export const MC_SIMPLE_ACTIONS: MCHeroAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project?mode=planner',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy',
    buttonText: 'Build',
    color: '#B30158',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote',
    buttonText: 'Calculate',
    color: '#003365',
  },
]

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Get hero actions for a given page type
 * 
 * @example
 * const actions = getMCHeroActions('mc')
 * <PowerHeaderTemplate actions={actions} ... />
 */
export function getMCHeroActions(
  pageType: 'mc' | 'cv' | 'simple' = 'mc'
): MCHeroAction[] {
  switch (pageType) {
    case 'cv':
      return CV_HERO_ACTIONS
    case 'simple':
      return MC_SIMPLE_ACTIONS
    default:
      return MC_HERO_ACTIONS
  }
}
