// @ts-nocheck — shipping tables not in generated Supabase types yet
/**
 * Shipping Calculation
 * 
 * Zone-based shipping with shipping class overrides:
 *   - Clear Vinyl REPLACES the base shipping cost (different packaging)
 *   - Straight Track ADDS to the shipping cost (ships in separate box)
 * 
 * Formula:
 *   shipping = (hasVinyl ? vinylRate : baseRate) + (hasTrack ? trackRate : 0)
 *   where each rate = flat_cost + (subtotal * fee_percent / 100)
 */

import { createClient } from '@/lib/supabase/server'

// =============================================================================
// TYPES
// =============================================================================

export interface ShippingAddress {
  country: string   // ISO country code (US, CA, etc.)
  state: string     // State/province code (GA, ON, etc.)
  zip?: string      // Postal/ZIP code
  city?: string
}

export interface ShippingZone {
  id: number
  name: string
  slug: string
  sort_order: number
  is_fallback: boolean
  is_active: boolean
}

export interface ShippingRate {
  id: number
  zone_id: number
  shipping_class: 'default' | 'clear_vinyl' | 'straight_track'
  flat_cost: number
  fee_percent: number
  is_active: boolean
}

export interface ShippingZoneWithRates extends ShippingZone {
  regions: { country_code: string; state_code: string | null }[]
  rates: ShippingRate[]
}

export type ShippingClass = 'default' | 'clear_vinyl' | 'straight_track'

export interface ShippingCalculationInput {
  address: ShippingAddress
  hasVinyl: boolean
  hasTrack: boolean
  subtotal: number
}

export interface ShippingResult {
  total: number
  zone: { id: number; name: string; slug: string } | null
  breakdown: {
    baseOrVinyl: { class: string; flat: number; percentAmount: number; total: number }
    track: { flat: number; percentAmount: number; total: number } | null
  }
}

// =============================================================================
// FALLBACK CONSTANTS (used when DB is unavailable)
// =============================================================================

const FALLBACK_ZONES: ShippingZoneWithRates[] = [
  {
    id: 1, name: 'Eastern US', slug: 'eastern_us', sort_order: 1, is_fallback: false, is_active: true,
    regions: [
      ...['AL','AR','CT','DE','DC','FL','GA','IL','IN','IA','KS','KY','LA','ME',
          'MD','MA','MI','MN','MS','MO','NH','NJ','NY','NC','OH','OK','PA','RI',
          'SC','TN','TX','VT','VA','WV','WI','AA','AE','AP']
        .map(s => ({ country_code: 'US', state_code: s })),
    ],
    rates: [
      { id: 1, zone_id: 1, shipping_class: 'default',        flat_cost: 8,  fee_percent: 3.5, is_active: true },
      { id: 2, zone_id: 1, shipping_class: 'clear_vinyl',    flat_cost: 30, fee_percent: 3,   is_active: true },
      { id: 3, zone_id: 1, shipping_class: 'straight_track', flat_cost: 30, fee_percent: 0,   is_active: true },
    ],
  },
  {
    id: 2, name: 'Western US', slug: 'western_us', sort_order: 2, is_fallback: false, is_active: true,
    regions: [
      ...['AZ','CA','CO','ID','MT','NE','NV','NM','ND','OR','SD','UT','WA','WY']
        .map(s => ({ country_code: 'US', state_code: s })),
    ],
    rates: [
      { id: 4, zone_id: 2, shipping_class: 'default',        flat_cost: 10, fee_percent: 4,   is_active: true },
      { id: 5, zone_id: 2, shipping_class: 'clear_vinyl',    flat_cost: 45, fee_percent: 3,   is_active: true },
      { id: 6, zone_id: 2, shipping_class: 'straight_track', flat_cost: 45, fee_percent: 0,   is_active: true },
    ],
  },
  {
    id: 3, name: 'HI, AK, PR', slug: 'hi_ak_pr', sort_order: 3, is_fallback: false, is_active: true,
    regions: [
      ...['HI','AK','PR'].map(s => ({ country_code: 'US', state_code: s })),
    ],
    rates: [
      { id: 7, zone_id: 3, shipping_class: 'default',        flat_cost: 50, fee_percent: 5,   is_active: true },
      { id: 8, zone_id: 3, shipping_class: 'clear_vinyl',    flat_cost: 90, fee_percent: 0,   is_active: true },
      { id: 9, zone_id: 3, shipping_class: 'straight_track', flat_cost: 90, fee_percent: 0,   is_active: true },
    ],
  },
  {
    id: 4, name: 'Canada', slug: 'canada', sort_order: 4, is_fallback: false, is_active: true,
    regions: [
      ...['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT']
        .map(s => ({ country_code: 'CA', state_code: s })),
    ],
    rates: [
      { id: 10, zone_id: 4, shipping_class: 'default',        flat_cost: 55, fee_percent: 4.5, is_active: true },
      { id: 11, zone_id: 4, shipping_class: 'clear_vinyl',    flat_cost: 95, fee_percent: 3,   is_active: true },
      { id: 12, zone_id: 4, shipping_class: 'straight_track', flat_cost: 70, fee_percent: 0,   is_active: true },
    ],
  },
  {
    id: 5, name: 'Rest of World', slug: 'rest_of_world', sort_order: 99, is_fallback: true, is_active: true,
    regions: [],
    rates: [
      { id: 13, zone_id: 5, shipping_class: 'default',        flat_cost: 110, fee_percent: 3.5, is_active: true },
      { id: 14, zone_id: 5, shipping_class: 'clear_vinyl',    flat_cost: 90,  fee_percent: 5,   is_active: true },
      { id: 15, zone_id: 5, shipping_class: 'straight_track', flat_cost: 45,  fee_percent: 0,   is_active: true },
    ],
  },
]

// =============================================================================
// DATABASE FUNCTIONS
// =============================================================================

/**
 * Fetch all shipping zones with their regions and rates from the database.
 * Falls back to hardcoded constants if DB is unavailable.
 */
export async function getAllShippingZones(): Promise<ShippingZoneWithRates[]> {
  try {
    const supabase = await createClient()

    const { data: zones, error: zonesError } = await supabase
      .from('shipping_zones')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (zonesError || !zones || zones.length === 0) {
      console.log('Shipping zones: using fallback constants')
      return FALLBACK_ZONES
    }

    const { data: regions } = await supabase
      .from('shipping_zone_regions')
      .select('*')

    const { data: rates } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('is_active', true)

    return zones.map(zone => ({
      ...zone,
      regions: (regions || [])
        .filter(r => r.zone_id === zone.id)
        .map(r => ({ country_code: r.country_code, state_code: r.state_code })),
      rates: (rates || []).filter(r => r.zone_id === zone.id),
    }))
  } catch (err) {
    console.error('Error fetching shipping zones:', err)
    return FALLBACK_ZONES
  }
}

// =============================================================================
// ZONE MATCHING
// =============================================================================

/**
 * Find the shipping zone for an address.
 * Checks country+state against zone regions, falls back to the fallback zone.
 */
export function matchZone(
  address: ShippingAddress,
  zones: ShippingZoneWithRates[]
): ShippingZoneWithRates | null {
  const country = address.country.toUpperCase()
  const state = address.state.toUpperCase()

  // Try to match a non-fallback zone by country+state
  for (const zone of zones) {
    if (zone.is_fallback) continue
    const match = zone.regions.find(
      r => r.country_code === country && r.state_code === state
    )
    if (match) return zone
  }

  // Return the fallback zone (Rest of World)
  const fallback = zones.find(z => z.is_fallback)
  return fallback || null
}

/**
 * Find the shipping zone for an address, fetching zones from the database.
 */
export async function findShippingZone(
  address: ShippingAddress
): Promise<ShippingZoneWithRates | null> {
  const zones = await getAllShippingZones()
  return matchZone(address, zones)
}

// =============================================================================
// SHIPPING CALCULATION
// =============================================================================

/**
 * Calculate a single rate cost: flat + (subtotal * percent / 100)
 */
function calculateRateCost(rate: ShippingRate, subtotal: number): number {
  const flat = Number(rate.flat_cost) || 0
  const pct = Number(rate.fee_percent) || 0
  return Math.round((flat + (subtotal * pct / 100)) * 100) / 100
}

/**
 * Calculate shipping for an order.
 * 
 * Logic:
 *   - If Clear Vinyl items are on the order, use the clear_vinyl rate (REPLACES base)
 *   - Otherwise, use the default rate
 *   - If Track items are on the order, ADD the straight_track rate on top
 */
export function calculateShippingFromRates(
  zone: ShippingZoneWithRates,
  input: { hasVinyl: boolean; hasTrack: boolean; subtotal: number }
): ShippingResult {
  const { hasVinyl, hasTrack, subtotal } = input

  // Get rates by class
  const defaultRate = zone.rates.find(r => r.shipping_class === 'default')
  const vinylRate = zone.rates.find(r => r.shipping_class === 'clear_vinyl')
  const trackRate = zone.rates.find(r => r.shipping_class === 'straight_track')

  // Base or Vinyl (vinyl replaces base)
  const activeRate = hasVinyl && vinylRate ? vinylRate : defaultRate
  const baseOrVinylFlat = activeRate ? Number(activeRate.flat_cost) : 0
  const baseOrVinylPct = activeRate ? calculateRateCost(activeRate, subtotal) - baseOrVinylFlat : 0
  const baseOrVinylTotal = activeRate ? calculateRateCost(activeRate, subtotal) : 0

  // Track (always additive)
  let trackTotal = 0
  let trackFlat = 0
  let trackPct = 0
  if (hasTrack && trackRate) {
    trackFlat = Number(trackRate.flat_cost)
    trackPct = calculateRateCost(trackRate, subtotal) - trackFlat
    trackTotal = calculateRateCost(trackRate, subtotal)
  }

  const total = Math.round((baseOrVinylTotal + trackTotal) * 100) / 100

  return {
    total,
    zone: { id: zone.id, name: zone.name, slug: zone.slug },
    breakdown: {
      baseOrVinyl: {
        class: hasVinyl && vinylRate ? 'clear_vinyl' : 'default',
        flat: baseOrVinylFlat,
        percentAmount: Math.round(baseOrVinylPct * 100) / 100,
        total: baseOrVinylTotal,
      },
      track: hasTrack && trackRate ? {
        flat: trackFlat,
        percentAmount: Math.round(trackPct * 100) / 100,
        total: trackTotal,
      } : null,
    },
  }
}

/**
 * Full shipping calculation: find zone + calculate cost.
 * This is the main entry point for shipping calculation.
 */
export async function calculateShipping(
  input: ShippingCalculationInput
): Promise<ShippingResult> {
  const zone = await findShippingZone(input.address)

  if (!zone) {
    return {
      total: 0,
      zone: null,
      breakdown: {
        baseOrVinyl: { class: 'default', flat: 0, percentAmount: 0, total: 0 },
        track: null,
      },
    }
  }

  return calculateShippingFromRates(zone, input)
}

/**
 * Pure calculation (no DB call) - useful for admin test calculator.
 * Pass in pre-fetched zones.
 */
export function calculateShippingPure(
  address: ShippingAddress,
  zones: ShippingZoneWithRates[],
  input: { hasVinyl: boolean; hasTrack: boolean; subtotal: number }
): ShippingResult {
  const zone = matchZone(address, zones)

  if (!zone) {
    return {
      total: 0,
      zone: null,
      breakdown: {
        baseOrVinyl: { class: 'default', flat: 0, percentAmount: 0, total: 0 },
        track: null,
      },
    }
  }

  return calculateShippingFromRates(zone, input)
}
