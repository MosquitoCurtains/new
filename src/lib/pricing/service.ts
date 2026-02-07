/**
 * Pricing Service — Single Source of Truth
 * 
 * Builds the PricingMap from the `products` and `product_options` tables.
 * Uses an in-memory cache with a 5-minute TTL.
 * 
 * There are NO hardcoded fallbacks. If the database is unreachable,
 * this service throws so the caller can handle it (show error UI, etc.).
 * 
 * Usage (server-side only — API routes, server components):
 *   import { getPricingMap, invalidatePricingCache } from '@/lib/pricing/service'
 *   const prices = await getPricingMap()
 */

import { createClient } from '@/lib/supabase/server'
import type { PricingMap } from './types'

// =============================================================================
// CACHE
// =============================================================================

let cachedPrices: PricingMap | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Fetch the full pricing map from the database.
 * Builds a `PricingMap` from `products` (sku -> base_price) and
 * `product_options` (pricing_key -> price).
 * 
 * Includes formula-compatibility mappings for legacy keys.
 * 
 * Throws if the database is unreachable or the tables are empty.
 */
export async function getPricingMap(): Promise<PricingMap> {
  // Return cached data if still fresh
  if (cachedPrices && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPrices
  }

  const supabase = await createClient()

  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products' as never)
    .select('sku, base_price') as { data: { sku: string; base_price: number }[] | null; error: { message: string } | null }

  if (productsError) {
    throw new Error(`[PricingService] Products query error: ${productsError.message}`)
  }

  if (!products || products.length === 0) {
    throw new Error('[PricingService] products table is empty. Run the seed migration.')
  }

  // Fetch options with pricing_key
  const { data: options, error: optionsError } = await supabase
    .from('product_options' as never)
    .select('pricing_key, price, fee, option_value') as {
      data: { pricing_key: string | null; price: number; fee: number; option_value: string }[] | null;
      error: { message: string } | null
    }

  if (optionsError) {
    throw new Error(`[PricingService] Options query error: ${optionsError.message}`)
  }

  // Build the pricing map
  const prices: PricingMap = {}

  // 1. Product SKUs -> base_price
  for (const product of products) {
    prices[product.sku] = Number(product.base_price)
  }

  // 2. Options with pricing_key -> price
  if (options) {
    for (const option of options) {
      if (option.pricing_key) {
        prices[option.pricing_key] = Number(option.price)
      }
    }
  }

  // 3. Formula compatibility: mesh_panel_fee
  if (prices['mesh_panel'] !== undefined) {
    prices['mesh_panel_fee'] = prices['mesh_panel']
  }

  // 4. Formula compatibility: vinyl panel fees
  if (options) {
    for (const option of options) {
      if (option.pricing_key?.startsWith('vinyl_') && option.fee && Number(option.fee) > 0) {
        prices[`vinyl_panel_fee_${option.option_value}`] = Number(option.fee)
      }
    }
  }

  // 5. Legacy track key mappings
  const trackLegacyMap: Record<string, string> = {
    'track_standard_straight': 'track_std_7ft',
    'track_heavy_straight': 'track_heavy_7ft',
    'track_standard_curve_90': 'track_curve_90',
    'track_heavy_curve_90': 'track_heavy_curve_90',
    'track_standard_curve_135': 'track_curve_135',
    'track_heavy_curve_135': 'track_heavy_curve_135',
    'track_standard_splice': 'track_splice',
    'track_heavy_splice': 'track_heavy_splice',
    'track_standard_endcap': 'track_endcap',
    'track_heavy_endcap': 'track_heavy_endcap',
    'track_standard_carrier': 'track_carrier',
    'track_heavy_carrier': 'track_heavy_carrier',
  }
  for (const [newSku, oldKey] of Object.entries(trackLegacyMap)) {
    if (prices[newSku] !== undefined) {
      prices[oldKey] = prices[newSku]
    }
  }

  // 6. Legacy attachment/accessory keys
  const legacyKeys: Record<string, string> = {
    'marine_snap_black': 'marine_snap',
    'adhesive_snap_black': 'adhesive_snap_bw',
    'elastic_cord_black': 'elastic_cord',
    'velcro_black': 'adhesive_velcro',
    'webbing_black': 'webbing',
    'snap_tape_black': 'snap_tape',
  }
  for (const [newSku, oldKey] of Object.entries(legacyKeys)) {
    if (prices[newSku] !== undefined && prices[oldKey] === undefined) {
      prices[oldKey] = prices[newSku]
    }
  }

  // Update cache
  cachedPrices = prices
  cacheTimestamp = Date.now()

  return prices
}

/**
 * Clear the in-memory pricing cache.
 * Call this after updating prices in the admin panel.
 */
export function invalidatePricingCache(): void {
  cachedPrices = null
  cacheTimestamp = 0
}
