'use client'

/**
 * useDiyHardware Hook — Fetches DIY hardware recommendation rules
 *
 * Client-side hook for the PanelBuilder component.
 * Fetches active recommendation rules from /api/diy-hardware and provides
 * a function to compute product recommendations based on panel configuration.
 *
 * The rules define WHAT to recommend and HOW MANY. Pricing/images come from
 * the products table (passed in via the `products` parameter).
 *
 * Uses module-level cache (same pattern as useProducts).
 */

import { useState, useEffect, useCallback } from 'react'
import type { MeshColor } from '@/lib/pricing/types'
import type { DBProduct } from '@/hooks/useProducts'

// =============================================================================
// TYPES
// =============================================================================

export interface DiyHardwareItem {
  id: string
  item_key: string
  category: string
  product_sku: string | null
  name: string
  description_template: string | null
  unit_label: string
  calc_rule: string
  calc_params: Record<string, number | string>
  color_match: string | null
  sort_order: number
  active: boolean
}

export interface HardwareRecommendation {
  key: string
  itemKey: string
  label: string
  description: string
  qty: number
  unit: string
  unitPrice: number
  totalPrice: number
  image: string | null
  productUrl: string | null
}

/** Panel info needed for hardware calculations */
export interface PanelForHardware {
  finalWidth: number
  finalHeight: number
  topAttachment: string
  side1: string
  side2: string
  side: number
}

// =============================================================================
// MODULE-LEVEL CACHE
// =============================================================================

let cachedItems: DiyHardwareItem[] | null = null
let fetchPromise: Promise<DiyHardwareItem[] | null> | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000

function fetchHardwareItems(): Promise<DiyHardwareItem[] | null> {
  if (cachedItems && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return Promise.resolve(cachedItems)
  }

  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('/api/diy-hardware')
    .then(res => {
      if (!res.ok) throw new Error(`Hardware API returned ${res.status}`)
      return res.json()
    })
    .then(json => {
      const items = (json.items || []) as DiyHardwareItem[]
      cachedItems = items
      cacheTimestamp = Date.now()
      fetchPromise = null
      return items
    })
    .catch(err => {
      console.error('[useDiyHardware] Failed to fetch items:', err)
      fetchPromise = null
      return null
    })

  return fetchPromise
}

// =============================================================================
// CALCULATION ENGINE
// =============================================================================

/**
 * Compute hardware recommendations from panel configuration + DB rules.
 *
 * The calculation LOGIC lives here in code; the PARAMETERS come from the DB
 * (calc_params). Pricing/images come from the products table via product_sku.
 */
export function computeHardwareRecommendations(
  panels: PanelForHardware[],
  hardwareItems: DiyHardwareItem[] | null,
  products: DBProduct[] | null,
  meshColor: MeshColor,
): HardwareRecommendation[] {
  if (panels.length === 0 || !hardwareItems || hardwareItems.length === 0) return []

  const findProduct = (sku: string | null) =>
    sku && products ? products.find(p => p.sku === sku) : null

  const results: HardwareRecommendation[] = []

  // ── Pre-compute panel aggregates ──
  const trackingPanels = panels.filter(p => p.topAttachment === 'tracking')
  const totalTrackInches = trackingPanels.reduce((sum, p) => sum + p.finalWidth, 0)
  const totalTrackFeet = totalTrackInches / 12
  const sidesWithTracking = new Set(trackingPanels.map(p => p.side)).size

  const snapEdges = panels.reduce((n, p) =>
    n + (p.side1 === 'marine_snaps' ? 1 : 0) + (p.side2 === 'marine_snaps' ? 1 : 0), 0)
  const magnetEdges = panels.reduce((n, p) =>
    n + (p.side1 === 'magnetic_door' ? 1 : 0) + (p.side2 === 'magnetic_door' ? 1 : 0), 0)
  const magnetDoorways = Math.ceil(magnetEdges / 2)
  const stuccoEdges = panels.reduce((n, p) =>
    n + (p.side1 === 'stucco_strip' ? 1 : 0) + (p.side2 === 'stucco_strip' ? 1 : 0), 0)

  for (const item of hardwareItems) {
    // ── Color matching ──
    if (item.color_match) {
      const matchColors = item.color_match.split(',').map(c => c.trim())
      if (!matchColors.includes(meshColor)) continue
    }

    let qty = 0
    let description = item.description_template || ''

    switch (item.calc_rule) {
      case 'track_linear_pieces': {
        if (trackingPanels.length === 0) continue
        const pieceLengthInches = Number(item.calc_params.piece_length_inches) || 84
        const pieceLengthFeet = pieceLengthInches / 12
        qty = Math.ceil(totalTrackFeet / pieceLengthFeet)
        description = description
          .replace('{pieces}', String(qty))
          .replace('{total_feet}', String(Math.ceil(totalTrackFeet)))
        break
      }

      case 'track_splices': {
        if (trackingPanels.length === 0) continue
        // Look up the track piece length from the track_linear_pieces item
        const trackStraight = hardwareItems.find(h => h.calc_rule === 'track_linear_pieces')
        const actualPieceLength = trackStraight
          ? (Number(trackStraight.calc_params.piece_length_inches) || 84)
          : 84
        const trackPieces = Math.ceil(totalTrackFeet / (actualPieceLength / 12))
        qty = Math.max(0, trackPieces - sidesWithTracking)
        if (qty === 0) continue
        description = description
          .replace('{pieces}', String(trackPieces))
          .replace('{runs}', String(sidesWithTracking))
        break
      }

      case 'track_endcaps': {
        if (trackingPanels.length === 0) continue
        const perRun = Number(item.calc_params.per_run) || 2
        qty = sidesWithTracking * perRun
        description = description.replace('{runs}', String(sidesWithTracking))
        break
      }

      case 'per_snap_edge': {
        if (snapEdges === 0) continue
        qty = snapEdges
        const product = findProduct(item.product_sku)
        const packQty = product?.pack_quantity || 10
        description = description
          .replace('{edges}', String(snapEdges))
          .replace('{pack_qty}', String(packQty))
        break
      }

      case 'per_doorway_count': {
        if (magnetDoorways === 0) continue
        const perDoorway = Number(item.calc_params.per_doorway) || 1
        qty = magnetDoorways * perDoorway
        description = description
          .replace('{per_doorway}', String(perDoorway))
          .replace('{doorways}', String(magnetDoorways))
        break
      }

      case 'per_stucco_edge': {
        if (stuccoEdges === 0) continue
        qty = stuccoEdges
        description = description.replace('{edges}', String(stuccoEdges))
        break
      }

      case 'fixed_quantity': {
        qty = Number(item.calc_params.quantity) || 1
        break
      }

      default:
        continue
    }

    if (qty <= 0) continue

    // Resolve pricing + image from the products table
    const product = findProduct(item.product_sku)
    const unitPrice = product?.base_price ?? 0
    const image = product?.image_url ?? null

    results.push({
      key: item.item_key,
      itemKey: item.item_key,
      label: product?.name || item.name,
      description,
      qty,
      unit: item.unit_label,
      unitPrice,
      totalPrice: qty * unitPrice,
      image,
      productUrl: null,
    })
  }

  return results
}

// =============================================================================
// HOOK
// =============================================================================

export function useDiyHardware() {
  const [items, setItems] = useState<DiyHardwareItem[] | null>(cachedItems)
  const [isLoading, setIsLoading] = useState(!cachedItems)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchHardwareItems().then(data => {
      if (!mounted) return
      if (data) {
        setItems(data)
        setError(null)
      } else {
        setError('Unable to load hardware rules.')
      }
      setIsLoading(false)
    })

    return () => { mounted = false }
  }, [])

  /**
   * Compute recommendations. Requires both the panel config AND
   * the products array (from useProducts) for pricing/images.
   */
  const getRecommendations = useCallback(
    (panels: PanelForHardware[], products: DBProduct[] | null, meshColor: MeshColor) =>
      computeHardwareRecommendations(panels, items, products, meshColor),
    [items]
  )

  return {
    items,
    isLoading,
    error,
    getRecommendations,
  }
}

/** Force-refresh the client hardware cache */
export function invalidateDiyHardwareClientCache(): void {
  cachedItems = null
  cacheTimestamp = 0
  fetchPromise = null
}
