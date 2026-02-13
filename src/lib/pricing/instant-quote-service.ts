/**
 * Instant Quote Pricing Service
 * 
 * Server-side service to load instant quote pricing from the database.
 * Transforms flat DB rows into the InstantQuotePricingConfig structure.
 * Includes a 5-minute cache to reduce DB calls.
 * 
 * Rows with admin_only=true are excluded from the public config/options
 * but are still returned by fetchInstantQuotePricingRows for the admin UI.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import {
  type InstantQuotePricingConfig,
  type ShippingParams,
  type ShipLocation,
  type MosquitoMeshType,
  type ClearVinylPanelHeight,
  type TopAttachmentMosquito,
  type TopAttachmentVinyl,
  DEFAULT_PRICING_CONFIG,
  MESH_TYPE_OPTIONS,
  PANEL_HEIGHT_OPTIONS,
  MOSQUITO_ATTACHMENT_OPTIONS,
  VINYL_ATTACHMENT_OPTIONS,
  SIDES_OPTIONS,
  SHIP_LOCATION_OPTIONS,
} from './instant-quote'

// =============================================================================
// TYPES
// =============================================================================

export interface InstantQuotePricingRow {
  id: string
  category: string
  pricing_key: string
  value: number
  display_label: string
  admin_only: boolean
  sort_order: number
  updated_at: string
}

/** Options the front-end uses for dropdown menus */
export interface InstantQuoteAvailableOptions {
  meshTypeOptions: Array<{ value: string; label: string }>
  panelHeightOptions: Array<{ value: string; label: string }>
  mosquitoAttachmentOptions: Array<{ value: string; label: string }>
  vinylAttachmentOptions: Array<{ value: string; label: string }>
  sidesOptions: Array<{ value: number; label: string }>
  shipLocationOptions: Array<{ value: string; label: string }>
}

// =============================================================================
// CACHE (5-minute TTL)
// =============================================================================

let cachedConfig: InstantQuotePricingConfig | null = null
let cachedOptions: InstantQuoteAvailableOptions | null = null
let cachedRows: InstantQuotePricingRow[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function invalidateInstantQuoteCache() {
  cachedConfig = null
  cachedOptions = null
  cachedRows = null
  cacheTimestamp = 0
}

// =============================================================================
// FETCH RAW ROWS (all rows, including admin_only — used by admin UI)
// =============================================================================

export async function fetchInstantQuotePricingRows(): Promise<InstantQuotePricingRow[]> {
  if (cachedRows && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedRows
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('instant_quote_pricing')
    .select('id, category, pricing_key, value, display_label, admin_only, sort_order, updated_at')
    .order('category')
    .order('sort_order')

  if (error) {
    console.error('[InstantQuotePricing] Error fetching rows:', error.message)
    return []
  }

  cachedRows = (data || []) as InstantQuotePricingRow[]
  cacheTimestamp = Date.now()
  return cachedRows
}

// =============================================================================
// TRANSFORM ROWS -> CONFIG (excludes admin_only rows)
// =============================================================================

function buildShippingParams(
  rows: InstantQuotePricingRow[],
  category: string,
): Record<ShipLocation, ShippingParams> {
  const map = new Map<string, number>()
  for (const r of rows.filter(r => r.category === category)) {
    map.set(r.pricing_key, Number(r.value))
  }

  const defaults = category === 'mosquito_shipping'
    ? DEFAULT_PRICING_CONFIG.mosquitoShipping
    : DEFAULT_PRICING_CONFIG.vinylShipping

  return {
    usa: {
      baseFee: map.get('usa_base_fee') ?? defaults.usa.baseFee,
      rate: map.get('usa_rate') ?? defaults.usa.rate,
      trackSurcharge: map.get('usa_track_surcharge') ?? defaults.usa.trackSurcharge,
    },
    canada: {
      baseFee: map.get('canada_base_fee') ?? defaults.canada.baseFee,
      rate: map.get('canada_rate') ?? defaults.canada.rate,
      trackSurcharge: map.get('canada_track_surcharge') ?? defaults.canada.trackSurcharge,
    },
    international: {
      baseFee: map.get('international_base_fee') ?? defaults.international.baseFee,
      rate: map.get('international_rate') ?? defaults.international.rate,
      trackSurcharge: map.get('international_track_surcharge') ?? defaults.international.trackSurcharge,
    },
  }
}

function buildRecordFromRows<K extends string>(
  rows: InstantQuotePricingRow[],
  category: string,
  defaults: Record<K, number>,
): Record<K, number> {
  const result = { ...defaults }
  for (const r of rows.filter(r => r.category === category)) {
    if (r.pricing_key in defaults) {
      (result as Record<string, number>)[r.pricing_key] = Number(r.value)
    }
  }
  return result
}

function buildNumberKeyRecord(
  rows: InstantQuotePricingRow[],
  category: string,
  defaults: Record<number, number>,
): Record<number, number> {
  const result = { ...defaults }
  for (const r of rows.filter(r => r.category === category)) {
    const key = parseInt(r.pricing_key, 10)
    if (!isNaN(key)) {
      result[key] = Number(r.value)
    }
  }
  return result
}

export function transformRowsToConfig(rows: InstantQuotePricingRow[]): InstantQuotePricingConfig {
  if (rows.length === 0) return DEFAULT_PRICING_CONFIG

  // Mosquito config (side cost + markup)
  const mosquitoConfigRows = rows.filter(r => r.category === 'mosquito_config')
  const mosquitoSideCost = mosquitoConfigRows.find(r => r.pricing_key === 'side_cost')
  const mosquitoMarkup = mosquitoConfigRows.find(r => r.pricing_key === 'markup_multiplier')

  return {
    mosquitoMeshPrice: buildRecordFromRows<MosquitoMeshType>(
      rows, 'mosquito_mesh_price', DEFAULT_PRICING_CONFIG.mosquitoMeshPrice,
    ),
    vinylHeightPrice: buildRecordFromRows<ClearVinylPanelHeight>(
      rows, 'vinyl_height_price', DEFAULT_PRICING_CONFIG.vinylHeightPrice,
    ),
    vinylSideCost: buildRecordFromRows<ClearVinylPanelHeight>(
      rows, 'vinyl_side_cost', DEFAULT_PRICING_CONFIG.vinylSideCost,
    ),
    mosquitoSideCost: mosquitoSideCost ? Number(mosquitoSideCost.value) : DEFAULT_PRICING_CONFIG.mosquitoSideCost,
    mosquitoMarkup: mosquitoMarkup ? Number(mosquitoMarkup.value) : DEFAULT_PRICING_CONFIG.mosquitoMarkup,
    topAttachmentCost: buildRecordFromRows<TopAttachmentMosquito | TopAttachmentVinyl>(
      rows, 'top_attachment_cost', DEFAULT_PRICING_CONFIG.topAttachmentCost,
    ),
    mosquitoSides: buildNumberKeyRecord(rows, 'mosquito_sides_multiplier', DEFAULT_PRICING_CONFIG.mosquitoSides),
    vinylSides: buildNumberKeyRecord(rows, 'vinyl_sides_multiplier', DEFAULT_PRICING_CONFIG.vinylSides),
    mosquitoShipping: buildShippingParams(rows, 'mosquito_shipping'),
    vinylShipping: buildShippingParams(rows, 'vinyl_shipping'),
  }
}

// =============================================================================
// BUILD AVAILABLE OPTIONS (excludes admin_only rows)
// =============================================================================

/**
 * Build the available dropdown options for the front-end,
 * filtering out any row where admin_only = true.
 * Falls back to hard-coded arrays if DB rows are empty.
 */
export function buildAvailableOptions(rows: InstantQuotePricingRow[]): InstantQuoteAvailableOptions {
  if (rows.length === 0) {
    return {
      meshTypeOptions: MESH_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label })),
      panelHeightOptions: PANEL_HEIGHT_OPTIONS.map(o => ({ value: o.value, label: o.label })),
      mosquitoAttachmentOptions: MOSQUITO_ATTACHMENT_OPTIONS.map(o => ({ value: o.value, label: o.label })),
      vinylAttachmentOptions: VINYL_ATTACHMENT_OPTIONS.map(o => ({ value: o.value, label: o.label })),
      sidesOptions: SIDES_OPTIONS.map(o => ({ value: o.value, label: o.label })),
      shipLocationOptions: SHIP_LOCATION_OPTIONS.map(o => ({ value: o.value, label: o.label })),
    }
  }

  // Helper: get active (non-admin_only) rows for a category, sorted
  const activeRows = (category: string) =>
    rows
      .filter(r => r.category === category && !r.admin_only)
      .sort((a, b) => a.sort_order - b.sort_order)

  // Mesh type options
  const meshTypeOptions = activeRows('mosquito_mesh_price')
    .map(r => ({ value: r.pricing_key, label: r.display_label }))

  // Panel height options
  const panelHeightOptions = activeRows('vinyl_height_price')
    .map(r => ({ value: r.pricing_key, label: r.display_label }))

  // Attachment options — mosquito uses all 4 (velcro, grommets, tracking x2),
  // vinyl uses 3 (velcro, tracking x2). Filter from the shared top_attachment_cost category.
  const activeAttachments = activeRows('top_attachment_cost')
  const mosquitoAttachmentKeys = ['tracking_under_10', 'tracking_over_10', 'velcro', 'grommets']
  const vinylAttachmentKeys = ['velcro', 'tracking_under_10', 'tracking_over_10']

  const mosquitoAttachmentOptions = mosquitoAttachmentKeys
    .map(key => activeAttachments.find(r => r.pricing_key === key))
    .filter(Boolean)
    .map(r => ({ value: r!.pricing_key, label: r!.display_label }))

  const vinylAttachmentOptions = vinylAttachmentKeys
    .map(key => activeAttachments.find(r => r.pricing_key === key))
    .filter(Boolean)
    .map(r => ({ value: r!.pricing_key, label: r!.display_label }))

  // Sides options (use mosquito_sides_multiplier as the source, same display for both)
  const sidesOptions = activeRows('mosquito_sides_multiplier')
    .map(r => ({ value: parseInt(r.pricing_key, 10), label: r.display_label }))

  // Ship location — these are derived from shipping params (always available)
  const shipLocationOptions = SHIP_LOCATION_OPTIONS.map(o => ({ value: o.value, label: o.label }))

  return {
    meshTypeOptions,
    panelHeightOptions,
    mosquitoAttachmentOptions,
    vinylAttachmentOptions,
    sidesOptions,
    shipLocationOptions,
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get the instant quote pricing config from the database.
 * Excludes admin_only rows from the config.
 * Returns DEFAULT_PRICING_CONFIG as fallback if DB is empty/unreachable.
 */
export async function getInstantQuotePricingConfig(): Promise<InstantQuotePricingConfig> {
  if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedConfig
  }

  const allRows = await fetchInstantQuotePricingRows()
  // Filter out admin_only rows for the public config
  const publicRows = allRows.filter(r => !r.admin_only)
  cachedConfig = transformRowsToConfig(publicRows)
  return cachedConfig
}

/**
 * Get available dropdown options for the front-end.
 * Excludes admin_only rows.
 */
export async function getInstantQuoteAvailableOptions(): Promise<InstantQuoteAvailableOptions> {
  if (cachedOptions && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedOptions
  }

  const allRows = await fetchInstantQuotePricingRows()
  cachedOptions = buildAvailableOptions(allRows)
  return cachedOptions
}
