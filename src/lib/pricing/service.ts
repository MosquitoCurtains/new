/**
 * Pricing Service — Single Source of Truth
 * 
 * Fetches pricing data from the `product_pricing` Supabase table.
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
 * Returns a `PricingMap` keyed by the `id` column of `product_pricing`.
 * 
 * Throws if the database is unreachable or the table is empty.
 * There are NO hardcoded fallbacks — the DB is the single source of truth.
 */
export async function getPricingMap(): Promise<PricingMap> {
  // Return cached data if still fresh
  if (cachedPrices && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPrices
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_pricing' as never)
    .select('id, value') as { data: { id: string; value: number }[] | null; error: { message: string } | null }

  if (error) {
    throw new Error(`[PricingService] Database error: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error(
      '[PricingService] product_pricing table is empty. ' +
      'Run the seed migration (20260206000002_product_pricing.sql + 20260206000005_complete_pricing_data.sql).'
    )
  }

  // Build the pricing map
  const prices: PricingMap = {}
  for (const row of data) {
    prices[row.id] = Number(row.value)
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
