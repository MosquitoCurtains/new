'use client'

/**
 * useProducts Hook — Fetches products from the database
 * 
 * Simplified: every product variant is its own row with name, price, image,
 * pack_quantity, and category info. No meta parsing needed.
 * 
 * Uses module-level cache like usePricing.
 */

import { useState, useEffect, useMemo } from 'react'

// =============================================================================
// TYPES
// =============================================================================

/** Product option from the database */
export type DBProductOption = {
  id: string
  product_id: string
  option_name: string
  option_value: string
  display_label: string
  price: number
  fee: number
  image_url: string | null
  is_default: boolean
  sort_order: number
  admin_only: boolean
  pricing_key: string | null
}

/** Product row from the database */
export type DBProduct = {
  id: string
  sku: string
  name: string
  description: string | null
  product_type: string
  base_price: number
  unit: string
  pack_quantity: number
  image_url: string | null
  is_active: boolean
  admin_only: boolean
  product_category: string | null
  category_section: string | null
  category_order: number
  quantity_step: number
  quantity_min: number
  quantity_max: number
  meta: Record<string, unknown> | null
  options?: DBProductOption[]
}

// =============================================================================
// MODULE-LEVEL CACHE
// =============================================================================

let cachedProducts: DBProduct[] | null = null
let fetchPromise: Promise<DBProduct[] | null> | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function fetchProducts(types?: string[]): Promise<DBProduct[] | null> {
  const typeParam = types ? types.join(',') : ''
  const url = typeParam
    ? `/api/admin/products?type=${typeParam}`
    : '/api/admin/products'

  if (cachedProducts && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return Promise.resolve(cachedProducts)
  }

  if (fetchPromise) return fetchPromise

  fetchPromise = fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Products API returned ${res.status}`)
      return res.json()
    })
    .then(json => {
      const products = (json.data || []) as DBProduct[]
      cachedProducts = products
      cacheTimestamp = Date.now()
      fetchPromise = null
      return products
    })
    .catch(err => {
      console.error('[useProducts] Failed to fetch products:', err)
      fetchPromise = null
      return null
    })

  return fetchPromise
}

// =============================================================================
// DISPLAY LABEL HELPER
// =============================================================================

/**
 * Derive a human-readable price label from unit + pack_quantity.
 * e.g. "Each", "Per Pack of 10", "Per Foot"
 */
export function getPriceLabel(unit: string, packQuantity: number): string {
  if (packQuantity > 1) {
    return `Per Pack of ${packQuantity}`
  }
  switch (unit) {
    case '/ft': return 'Per Foot'
    case '/panel': return 'Per Panel'
    case '/piece': return 'Per Piece'
    case '/set': return 'Per Set'
    case '/notch': return 'Per Notch'
    default: return 'Each'
  }
}

// =============================================================================
// HOOK
// =============================================================================

export function useProducts() {
  const [products, setProducts] = useState<DBProduct[] | null>(cachedProducts)
  const [isLoading, setIsLoading] = useState(!cachedProducts)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchProducts().then(data => {
      if (!mounted) return
      if (data) {
        setProducts(data)
        setError(null)
      } else {
        setError('Unable to load products. Please refresh the page.')
      }
      setIsLoading(false)
    })

    return () => { mounted = false }
  }, [])

  /** Products filtered by type */
  const getByType = (type: string) => {
    if (!products) return []
    return products.filter(p => p.product_type === type)
  }

  /** Products filtered by category */
  const getByCategory = (category: string) => {
    if (!products) return []
    return products.filter(p => p.product_category === category)
  }

  /** Track products: standard variants */
  const standardTrackItems = useMemo(() => {
    if (!products) return []
    return products
      .filter(p => p.product_type === 'track' && p.category_section === 'Standard Track')
      .sort((a, b) => a.category_order - b.category_order)
  }, [products])

  /** Track products: heavy variants */
  const heavyTrackItems = useMemo(() => {
    if (!products) return []
    return products
      .filter(p => p.product_type === 'track' && p.category_section === 'Heavy Track')
      .sort((a, b) => a.category_order - b.category_order)
  }, [products])

  /** Attachment + accessory items grouped by category_section */
  const attachmentItems = useMemo(() => {
    if (!products) return []
    return products
      .filter(p => p.product_type === 'attachment' || p.product_type === 'accessory')
      .filter(p => !p.admin_only) // Filter admin_only items for sales page
      .sort((a, b) => {
        // Sort by category, then section, then order
        const catCompare = (a.product_category || '').localeCompare(b.product_category || '')
        if (catCompare !== 0) return catCompare
        const secCompare = (a.category_section || '').localeCompare(b.category_section || '')
        if (secCompare !== 0) return secCompare
        return a.category_order - b.category_order
      })
  }, [products])

  /** Ordered list of unique attachment/accessory sections */
  const attachmentGroups = useMemo(() => {
    return Array.from(new Set(attachmentItems.map(item => item.category_section || 'Other')))
  }, [attachmentItems])

  /** Get the adjustment product and its options */
  const adjustmentProduct = useMemo(() => {
    if (!products) return null
    return products.find(p => p.product_type === 'adjustment') || null
  }, [products])

  /** Panel products (mesh, vinyl, rollup) */
  const panelProducts = useMemo(() => {
    if (!products) return []
    return products.filter(p => p.product_type === 'panel')
  }, [products])

  /** Snap tool product */
  const snapTool = useMemo(() => {
    if (!products) return null
    return products.find(p => p.sku === 'snap_tool') || null
  }, [products])

  return {
    /** Raw products from the database */
    products,
    /** True while the initial fetch is in progress */
    isLoading,
    /** Error message if products could not be loaded */
    error,
    /** Helper to get products by type */
    getByType,
    /** Helper to get products by category */
    getByCategory,
    /** Standard track products sorted by category_order */
    standardTrackItems,
    /** Heavy track products sorted by category_order */
    heavyTrackItems,
    /** Attachment + accessory items (non-admin) */
    attachmentItems,
    /** Unique attachment group names (category_section) */
    attachmentGroups,
    /** The adjustment product with its options */
    adjustmentProduct,
    /** Panel products (mesh, vinyl, rollup) */
    panelProducts,
    /** The snap tool product */
    snapTool,
  }
}

/**
 * Force-refresh the client products cache.
 */
export function invalidateProductsCache(): void {
  cachedProducts = null
  cacheTimestamp = 0
  fetchPromise = null
}
