'use client'

/**
 * usePricing Hook — Client-Side Database-Driven Pricing
 * 
 * Fetches pricing data from /api/pricing on mount.
 * Returns a PricingMap that can be passed to formula functions
 * and the PriceCalculator.
 * 
 * The PricingMap is built from:
 *   - products table: sku -> base_price
 *   - product_options table: pricing_key -> price
 *   - Plus legacy formula-compatibility mappings
 * 
 * There are NO hardcoded fallbacks. While loading, `prices` is null
 * and components should show a loading state.
 * 
 * Uses a module-level cache so multiple components share one fetch.
 * 
 * Usage:
 *   const { prices, isLoading, error } = usePricing()
 *   if (isLoading || !prices) return <Spinner />
 *   const result = calculateMeshPanelPrice(config, prices)
 */

import { useState, useEffect } from 'react'
import type { PricingMap } from '@/lib/pricing/types'

// =============================================================================
// MODULE-LEVEL CACHE
// =============================================================================

let cachedPrices: PricingMap | null = null
let fetchPromise: Promise<PricingMap | null> | null = null
let cacheTimestamp = 0
const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function fetchPricing(): Promise<PricingMap | null> {
  // Return cached data if fresh
  if (cachedPrices && Date.now() - cacheTimestamp < CLIENT_CACHE_TTL_MS) {
    return Promise.resolve(cachedPrices)
  }

  // Deduplicate in-flight requests
  if (fetchPromise) return fetchPromise

  // Always fetch all prices (including admin_only) — the admin_only flag
  // controls product/option visibility, not price lookups
  fetchPromise = fetch('/api/pricing?context=admin')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Pricing API returned ${res.status}`)
      }
      return res.json()
    })
    .then(data => {
      if (!data.prices || Object.keys(data.prices).length === 0) {
        throw new Error('Pricing API returned empty data')
      }
      const prices = data.prices as PricingMap
      cachedPrices = prices
      cacheTimestamp = Date.now()
      fetchPromise = null
      return prices
    })
    .catch(err => {
      console.error('[usePricing] Failed to fetch pricing from database:', err)
      fetchPromise = null
      return null // Caller must handle null (show error state)
    })

  return fetchPromise
}

// =============================================================================
// HOOK
// =============================================================================

export function usePricing() {
  const [prices, setPrices] = useState<PricingMap | null>(cachedPrices)
  const [isLoading, setIsLoading] = useState(!cachedPrices)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchPricing().then(data => {
      if (!mounted) return
      if (data) {
        setPrices(data)
        setError(null)
      } else {
        setError('Unable to load pricing. Please refresh the page.')
      }
      setIsLoading(false)
    })

    return () => { mounted = false }
  }, [])

  /**
   * Look up a single price by its key (product SKU or pricing_key).
   * Returns `fallback` while loading or if the key is missing.
   */
  const getPrice = (id: string, fallback: number = 0): number => {
    if (!prices) return fallback
    return prices[id] ?? fallback
  }

  return {
    /** The pricing map from the database. Null while loading or on error. */
    prices,
    /** True while the initial fetch is in progress */
    isLoading,
    /** Error message if pricing could not be loaded */
    error,
    /** Look up a single price by key with an optional fallback */
    getPrice,
  }
}

/**
 * Force-refresh the client pricing cache.
 * Call this after saving prices in the admin panel.
 */
export function invalidateClientPricingCache(): void {
  cachedPrices = null
  cacheTimestamp = 0
  fetchPromise = null
}
