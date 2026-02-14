/**
 * Pricing Formulas — Database-Driven (Single Source of Truth)
 * 
 * All pricing values come from the `products` and `product_options` tables.
 * The PricingMap is built from product SKUs and option pricing_keys.
 * Every function REQUIRES a PricingMap — there are no hardcoded fallbacks.
 * 
 * If a required pricing key is missing from the map, the `p()` helper
 * logs a loud error and returns 0. This makes data integrity issues
 * visible without crashing the UI.
 */

import type {
  MeshPanelConfig,
  VinylPanelConfig,
  RollupPanelConfig,
  RawMeshConfig,
  PriceBreakdown,
  PricingMap,
} from './types'

// =============================================================================
// PRICE LOOKUP HELPER
// =============================================================================

/**
 * Look up a price from the DB-driven pricing map.
 * Logs a clear error if the key is missing — no silent fallback.
 */
function p(prices: PricingMap, id: string): number {
  const val = prices[id]
  if (val === undefined) {
    console.error(
      `[Pricing] MISSING VALUE for '${id}' in PricingMap. ` +
      `Check products/product_options tables or /admin/pricing.`
    )
    return 0
  }
  return val
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate square feet from inches, applying minimum
 */
export function calculateSqFt(
  widthInches: number, 
  heightInches: number, 
  minSqFt: number
): { sqft: number; minimumApplied: boolean } {
  const calculatedSqFt = (widthInches * heightInches) / 144
  const sqft = Math.max(calculatedSqFt, minSqFt)
  return {
    sqft,
    minimumApplied: calculatedSqFt < minSqFt
  }
}

/**
 * Round to 2 decimal places
 */
export function round(value: number): number {
  return Math.round(value * 100) / 100
}

// =============================================================================
// MESH PANEL PRICING
// =============================================================================

/**
 * Calculate mesh panel price
 * 
 * Formula: (width_feet + width_inches/12) × mesh_rate + panel_fee
 * 
 * DB keys used: mesh_{meshType}, mesh_panel_fee
 */
export function calculateMeshPanelPrice(
  config: MeshPanelConfig,
  prices: PricingMap
): PriceBreakdown {
  const totalWidthFeet = config.widthFeet + (config.widthInches / 12)
  const rate = p(prices, `mesh_${config.meshType}`)
  const panelFee = p(prices, 'mesh_panel_fee')
  const basePrice = round(totalWidthFeet * rate)
  const total = round(basePrice + panelFee)

  return {
    basePrice: rate,
    meshTypeMultiplier: 1,
    topAttachmentAdder: 0,
    bottomOptionAdder: 0,
    doorAdder: 0,
    zipperAdder: 0,
    notchAdder: 0,
    squareFeet: 0,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied: false,
    formula: `(${round(totalWidthFeet)} ft × $${rate}) + $${panelFee} = $${total}`
  }
}

// =============================================================================
// VINYL PANEL PRICING
// =============================================================================

/**
 * Calculate vinyl panel price
 * 
 * Formula: widthFeet × linearFootRate + panelFee
 * 
 * Panel fee is tiered by panel size (from Gravity Forms):
 *   short  (<48")  = vinyl_panel_fee_short
 *   medium (48-96") = vinyl_panel_fee_medium
 *   tall   (>96")  = vinyl_panel_fee_tall
 * 
 * DB keys used: vinyl_{panelSize}, vinyl_panel_fee_{panelSize}
 */
export function calculateVinylPanelPrice(
  config: VinylPanelConfig,
  prices: PricingMap
): PriceBreakdown {
  const totalWidthFeet = config.widthFeet + (config.widthInches / 12)
  const rate = p(prices, `vinyl_${config.panelSize}`)
  const panelFee = p(prices, `vinyl_panel_fee_${config.panelSize}`)
  
  const basePrice = round(totalWidthFeet * rate)
  const total = round(basePrice + panelFee)
  const sqft = round((totalWidthFeet * config.heightInches) / 12)
  
  return {
    basePrice: rate,
    meshTypeMultiplier: 1.0,
    topAttachmentAdder: 0,
    bottomOptionAdder: 0,
    doorAdder: 0,
    zipperAdder: 0,
    notchAdder: 0,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied: false,
    formula: `${round(totalWidthFeet)}ft × $${rate}/ft + $${panelFee} panel fee = $${total}`
  }
}

// =============================================================================
// SCRIM PANEL PRICING (DEPRECATED — scrim now uses calculateMeshPanelPrice)
// =============================================================================
// Scrim is a mesh type with key 'mesh_scrim' at $19/linear ft.
// Use calculateMeshPanelPrice with meshType = 'scrim' instead.

// =============================================================================
// ROLL-UP PANEL PRICING
// =============================================================================

/**
 * Calculate roll-up shade screen panel price
 * 
 * Formula: max(sqft, min_sqft) × base_rate × meshMultiplier + mechanism_adder
 * 
 * DB keys used: rollup_base_sqft, rollup_min_sqft, rollup_mechanism_adder,
 *               mesh_multiplier_{meshType}
 */
export function calculateRollupPanelPrice(
  config: RollupPanelConfig,
  prices: PricingMap
): PriceBreakdown {
  const baseSqft = p(prices, 'rollup_base_sqft')
  const minSqft = p(prices, 'rollup_min_sqft')
  const mechanismAdder = p(prices, 'rollup_mechanism_adder')
  const widthInches = config.widthFeet * 12 + (config.widthInches || 0)
  const { sqft, minimumApplied } = calculateSqFt(widthInches, config.heightInches, minSqft)
  
  const meshMultiplier = p(prices, `mesh_multiplier_${config.meshType}`)
  const basePrice = round(sqft * baseSqft * meshMultiplier)
  const total = round(basePrice + mechanismAdder)
  
  return {
    basePrice: baseSqft,
    meshTypeMultiplier: meshMultiplier,
    topAttachmentAdder: mechanismAdder,
    bottomOptionAdder: 0,
    doorAdder: 0,
    zipperAdder: 0,
    notchAdder: 0,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied,
    formula: `max(${round((widthInches * config.heightInches) / 144)} sqft, ${minSqft}) × $${baseSqft} × ${meshMultiplier} + $${mechanismAdder} = $${total}`
  }
}

// =============================================================================
// TRACK PRICING (Per-Piece from Gravity Forms)
// =============================================================================

/**
 * Calculate straight track price (7ft pieces)
 * DB keys: track_std_7ft, track_heavy_7ft
 */
export function calculateStraightTrackPrice(
  _lengthFeet: number,
  weight: 'standard' | 'heavy',
  quantity: number = 1,
  prices: PricingMap
): number {
  const key = weight === 'heavy' ? 'track_heavy_7ft' : 'track_std_7ft'
  return round(p(prices, key) * quantity)
}

/**
 * Calculate curve price (90 or 135 degree)
 * DB keys: track_curve_90, track_curve_135, track_heavy_curve_90, track_heavy_curve_135
 */
export function calculateCurvePrice(
  degree: 90 | 135,
  weight: 'standard' | 'heavy',
  quantity: number = 1,
  prices: PricingMap
): number {
  const key = weight === 'heavy'
    ? `track_heavy_curve_${degree}`
    : `track_curve_${degree}`
  return round(p(prices, key) * quantity)
}

/**
 * Calculate splice price
 * DB keys: track_splice, track_heavy_splice
 */
export function calculateSplicePrice(
  weight: 'standard' | 'heavy',
  quantity: number = 1,
  prices: PricingMap
): number {
  const key = weight === 'heavy' ? 'track_heavy_splice' : 'track_splice'
  return round(p(prices, key) * quantity)
}

/**
 * Calculate end cap price
 * DB keys: track_endcap, track_heavy_endcap
 */
export function calculateEndCapPrice(
  weight: 'standard' | 'heavy',
  quantity: number = 2,
  prices: PricingMap
): number {
  const key = weight === 'heavy' ? 'track_heavy_endcap' : 'track_endcap'
  return round(p(prices, key) * quantity)
}

/**
 * Calculate snap carriers price
 * DB keys: track_carrier, track_heavy_carrier
 */
export function calculateCarriersPrice(
  weight: 'standard' | 'heavy',
  quantity: number = 10,
  prices: PricingMap
): number {
  const key = weight === 'heavy' ? 'track_heavy_carrier' : 'track_carrier'
  return round(p(prices, key) * quantity)
}

// =============================================================================
// ATTACHMENT PRICING
// =============================================================================

/** DB key: marine_snap */
export function calculateMarineSnapPrice(
  quantity: number,
  _color: 'black' | 'white' = 'black',
  prices: PricingMap
): number {
  return round(p(prices, 'marine_snap') * quantity)
}

/** DB keys: adhesive_snap_bw, adhesive_snap_clear */
export function calculateAdhesiveSnapPrice(
  quantity: number,
  color: 'black' | 'white' | 'clear' = 'black',
  prices: PricingMap
): number {
  const id = color === 'clear' ? 'adhesive_snap_clear' : 'adhesive_snap_bw'
  return round(p(prices, id) * quantity)
}

/** DB key: block_magnet */
export function calculateBlockMagnetPrice(quantity: number, prices: PricingMap): number {
  return round(p(prices, 'block_magnet') * quantity)
}

/** DB key: fiberglass_rod */
export function calculateFiberglassRodPrice(quantity: number, prices: PricingMap): number {
  return round(p(prices, 'fiberglass_rod') * quantity)
}

/** DB key: elastic_cord */
export function calculateElasticCordPrice(
  quantity: number,
  _color: 'black' | 'white' = 'black',
  prices: PricingMap
): number {
  return round(p(prices, 'elastic_cord') * quantity)
}

// =============================================================================
// ACCESSORY PRICING
// =============================================================================

/** DB key: adhesive_velcro */
export function calculateVelcroPrice(lengthFeet: number, prices: PricingMap): number {
  return round(p(prices, 'adhesive_velcro') * lengthFeet)
}

/** DB key: webbing */
export function calculateWebbingPrice(lengthFeet: number, prices: PricingMap): number {
  return round(p(prices, 'webbing') * lengthFeet)
}

/** DB key: snap_tape */
export function calculateSnapTapePrice(lengthFeet: number, prices: PricingMap): number {
  return round(p(prices, 'snap_tape') * lengthFeet)
}

/** DB keys: stucco_standard, stucco_zippered */
export function calculateStuccoStripPrice(
  quantity: number,
  zippered: boolean = false,
  prices: PricingMap
): number {
  const unitPrice = zippered
    ? p(prices, 'stucco_zippered')
    : p(prices, 'stucco_standard')
  return round(unitPrice * quantity)
}

// =============================================================================
// RAW MATERIAL PRICING
// =============================================================================

/**
 * Calculate raw mesh price
 * 
 * Formula: lengthFeet × perFootRate
 * 
 * DB keys (new canonical): raw_panel_{abbrev}_{rollWidth}
 * e.g. raw_panel_hm_101, raw_panel_nsu_123, raw_panel_shade_120, etc.
 * 
 * Abbreviation map:
 *   heavy_mosquito -> hm
 *   no_see_um      -> nsu
 *   shade          -> shade
 *   theater_scrim / scrim -> scrim
 *   industrial     -> ind
 */
const MESH_KEY_ABBREV: Record<string, string> = {
  heavy_mosquito: 'hm',
  no_see_um: 'nsu',
  shade: 'shade',
  theater_scrim: 'scrim',
  scrim: 'scrim',
  industrial: 'ind',
}

export function calculateRawMeshPrice(config: RawMeshConfig, prices: PricingMap): number {
  const abbrev = MESH_KEY_ABBREV[config.materialType] || config.materialType
  const key = `raw_panel_${abbrev}_${config.rollWidth}`
  // Fallback to legacy key format for backwards compatibility
  const legacyKey = `raw_${config.materialType}_${config.rollWidth}`
  const perFootRate = prices[key] ?? p(prices, legacyKey)
  return round(perFootRate * config.lengthFeet)
}

// =============================================================================
// TOOL PRICING
// =============================================================================

/** DB key: snap_tool */
export function getSnapToolPrice(prices: PricingMap): number {
  return p(prices, 'snap_tool')
}
