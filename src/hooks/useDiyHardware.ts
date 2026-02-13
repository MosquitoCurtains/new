'use client'

/**
 * useDiyHardware Hook — Fetches DIY hardware items from the database
 *
 * Client-side hook for the PanelBuilder component.
 * Fetches active hardware items from /api/diy-hardware and provides
 * a function to compute product recommendations based on panel configuration.
 *
 * Uses module-level cache (same pattern as useProducts).
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { MeshColor } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface DiyHardwareItem {
  id: string
  item_key: string
  category: string
  name: string
  description_template: string | null
  image_url: string | null
  product_url: string | null
  unit_label: string
  unit_price: number
  pack_quantity: number
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
 * Compute hardware recommendations from panel configuration + DB items.
 *
 * The calculation LOGIC lives here in code; the PARAMETERS come from the DB
 * (calc_params). This keeps the rules flexible while the admin controls
 * prices, display, parameters, and active/inactive status.
 */
export function computeHardwareRecommendations(
  panels: PanelForHardware[],
  hardwareItems: DiyHardwareItem[] | null,
  meshColor: MeshColor,
): HardwareRecommendation[] {
  if (panels.length === 0 || !hardwareItems || hardwareItems.length === 0) return []

  const results: HardwareRecommendation[] = []

  // ── Pre-compute panel aggregates ──
  const trackingPanels = panels.filter(p => p.topAttachment === 'tracking')
  const totalTrackInches = trackingPanels.reduce((sum, p) => sum + p.finalWidth, 0)
  const totalTrackFeet = totalTrackInches / 12
  const sidesWithTracking = new Set(trackingPanels.map(p => p.side)).size

  const snapEdges = panels.reduce((n, p) => n + (p.side1 === 'marine_snaps' ? 1 : 0) + (p.side2 === 'marine_snaps' ? 1 : 0), 0)
  const magnetEdges = panels.reduce((n, p) => n + (p.side1 === 'magnetic_door' ? 1 : 0) + (p.side2 === 'magnetic_door' ? 1 : 0), 0)
  const magnetDoorways = Math.ceil(magnetEdges / 2)
  const stuccoEdges = panels.reduce((n, p) => n + (p.side1 === 'stucco_strip' ? 1 : 0) + (p.side2 === 'stucco_strip' ? 1 : 0), 0)

  for (const item of hardwareItems) {
    // ── Color matching: skip items that don't match the current mesh color ──
    if (item.color_match) {
      const matchColors = item.color_match.split(',').map(c => c.trim())
      if (!matchColors.includes(meshColor)) continue
    }

    let qty = 0
    let description = item.description_template || ''

    switch (item.calc_rule) {
      // ── Track: linear pieces ──
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

      // ── Track: splices ──
      case 'track_splices': {
        if (trackingPanels.length === 0) continue
        const pieceLengthInches = 84 // Use track_straight's param if available
        const trackStraight = hardwareItems.find(h => h.calc_rule === 'track_linear_pieces')
        const actualPieceLength = trackStraight ? (Number(trackStraight.calc_params.piece_length_inches) || 84) : pieceLengthInches
        const trackPieces = Math.ceil(totalTrackFeet / (actualPieceLength / 12))
        qty = Math.max(0, trackPieces - sidesWithTracking)
        if (qty === 0) continue
        description = description
          .replace('{pieces}', String(trackPieces))
          .replace('{runs}', String(sidesWithTracking))
        break
      }

      // ── Track: end caps ──
      case 'track_endcaps': {
        if (trackingPanels.length === 0) continue
        const perRun = Number(item.calc_params.per_run) || 2
        qty = sidesWithTracking * perRun
        description = description
          .replace('{runs}', String(sidesWithTracking))
        break
      }

      // ── Marine snaps: per edge ──
      case 'per_snap_edge': {
        if (snapEdges === 0) continue
        qty = snapEdges
        description = description
          .replace('{edges}', String(snapEdges))
          .replace('{pack_qty}', String(item.pack_quantity))
        break
      }

      // ── Per doorway count (magnets, rods) ──
      case 'per_doorway_count': {
        if (magnetDoorways === 0) continue
        const perDoorway = Number(item.calc_params.per_doorway) || 1
        qty = magnetDoorways * perDoorway
        description = description
          .replace('{per_doorway}', String(perDoorway))
          .replace('{doorways}', String(magnetDoorways))
        break
      }

      // ── Stucco: per edge ──
      case 'per_stucco_edge': {
        if (stuccoEdges === 0) continue
        qty = stuccoEdges
        description = description
          .replace('{edges}', String(stuccoEdges))
        break
      }

      // ── Fixed quantity (snap tool, etc.) ──
      case 'fixed_quantity': {
        qty = Number(item.calc_params.quantity) || 1
        break
      }

      default:
        continue
    }

    if (qty <= 0) continue

    results.push({
      key: item.item_key,
      itemKey: item.item_key,
      label: item.name,
      description,
      qty,
      unit: item.unit_label,
      unitPrice: item.unit_price,
      totalPrice: qty * item.unit_price,
      image: item.image_url,
      productUrl: item.product_url,
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
        setError('Unable to load hardware items.')
      }
      setIsLoading(false)
    })

    return () => { mounted = false }
  }, [])

  const getRecommendations = useCallback(
    (panels: PanelForHardware[], meshColor: MeshColor) =>
      computeHardwareRecommendations(panels, items, meshColor),
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
