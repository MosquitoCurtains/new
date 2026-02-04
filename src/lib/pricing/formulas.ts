/**
 * Pricing Formulas
 * 
 * Core calculation functions for all product types.
 * Based on Gravity Forms logic from WordPress.
 */

import {
  // Mesh
  MESH_BASE_SQFT,
  MESH_MIN_SQFT,
  MESH_TYPE_MULTIPLIERS,
  TOP_ATTACHMENT_ADDERS,
  BOTTOM_OPTION_ADDERS,
  DOOR_ADDER,
  ZIPPER_PER_FOOT,
  NOTCH_ADDER,
  // Vinyl
  VINYL_BASE_SQFT,
  VINYL_MIN_SQFT,
  VINYL_GAUGE_MULTIPLIERS,
  VINYL_DOOR_ADDER,
  // Scrim
  SCRIM_BASE_SQFT,
  SCRIM_MIN_SQFT,
  // Rollup
  ROLLUP_BASE_SQFT,
  ROLLUP_MIN_SQFT,
  ROLLUP_MECHANISM_ADDER,
  // Track
  TRACK_STD_PER_FOOT,
  TRACK_HEAVY_MULTIPLIER,
  TRACK_CURVE_90_PRICE,
  TRACK_CURVE_135_PRICE,
  TRACK_SPLICE_PRICE,
  TRACK_ENDCAP_PRICE,
  TRACK_CARRIER_PRICE,
  CARRIER_HEAVY_MULTIPLIER,
  // Attachments
  MARINE_SNAP_PRICE,
  ADHESIVE_SNAP_PRICES,
  CHROME_SNAP_PRICE,
  PANEL_SNAP_PRICE,
  BLOCK_MAGNET_PRICE,
  RING_MAGNET_PRICE,
  FIBERGLASS_ROD_SET_PRICE,
  FIBERGLASS_CLIP_PRICE,
  ELASTIC_CORD_SET_PRICE,
  TETHER_CLIP_PRICE,
  BELTED_RIB_PRICE,
  SCREW_STUD_PRICE,
  L_SCREW_PRICE,
  RUBBER_WASHER_PRICE,
  ROD_CLIP_PRICE,
  // Accessories
  ADHESIVE_VELCRO_PER_FOOT,
  WEBBING_PER_FOOT,
  SNAP_TAPE_PER_FOOT,
  TIEUP_STRAP_PRICE,
  FASTWAX_PRICE,
  STUCCO_STANDARD_PRICE,
  STUCCO_ZIPPERED_PRICE,
  // Tool
  SNAP_TOOL_PRICE,
  // Raw
  RAW_MESH_BASE_SQFT,
  ROLL_WIDTH_MULTIPLIERS,
  RAW_MESH_TYPE_MULTIPLIERS,
} from './constants'

import type {
  MeshPanelConfig,
  VinylPanelConfig,
  ScrimPanelConfig,
  RollupPanelConfig,
  TrackConfig,
  AttachmentConfig,
  RawMeshConfig,
  PriceBreakdown,
} from './types'

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
 * Formula from Gravity Forms Form 8:
 * price = max(sqft, 10) × $1.50 × meshMultiplier + topAdder + bottomAdder + doorAdder + zipperAdder
 */
export function calculateMeshPanelPrice(config: MeshPanelConfig): PriceBreakdown {
  const { sqft, minimumApplied } = calculateSqFt(
    config.widthInches, 
    config.heightInches, 
    MESH_MIN_SQFT
  )
  
  const meshMultiplier = MESH_TYPE_MULTIPLIERS[config.meshType]
  const topAdder = TOP_ATTACHMENT_ADDERS[config.topAttachment]
  const bottomAdder = config.bottomOption 
    ? BOTTOM_OPTION_ADDERS[config.bottomOption] 
    : 0
  const doorAdder = config.hasDoor ? DOOR_ADDER : 0
  const zipperAdder = config.hasZipper 
    ? round(config.heightInches / 12 * ZIPPER_PER_FOOT) 
    : 0
  const notchAdder = config.hasNotch ? NOTCH_ADDER : 0
  
  const basePrice = round(sqft * MESH_BASE_SQFT * meshMultiplier)
  const total = round(basePrice + topAdder + bottomAdder + doorAdder + zipperAdder + notchAdder)
  
  return {
    basePrice: MESH_BASE_SQFT,
    meshTypeMultiplier: meshMultiplier,
    topAttachmentAdder: topAdder,
    bottomOptionAdder: bottomAdder,
    doorAdder,
    zipperAdder,
    notchAdder,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied,
    formula: `max(${round((config.widthInches * config.heightInches) / 144)} sqft, ${MESH_MIN_SQFT}) × $${MESH_BASE_SQFT} × ${meshMultiplier} + $${topAdder} + $${bottomAdder} + $${doorAdder} + $${zipperAdder} + $${notchAdder} = $${total}`
  }
}

// =============================================================================
// VINYL PANEL PRICING
// =============================================================================

/**
 * Calculate vinyl panel price
 * 
 * Formula from Gravity Forms Form 10:
 * price = max(sqft, 10) × $4.00 × gaugeMultiplier + doorAdder
 */
export function calculateVinylPanelPrice(config: VinylPanelConfig): PriceBreakdown {
  const { sqft, minimumApplied } = calculateSqFt(
    config.widthInches, 
    config.heightInches, 
    VINYL_MIN_SQFT
  )
  
  const gaugeMultiplier = VINYL_GAUGE_MULTIPLIERS[config.gauge]
  const doorAdder = config.hasDoor ? VINYL_DOOR_ADDER : 0
  const zipperAdder = config.hasZipper 
    ? round(config.heightInches / 12 * ZIPPER_PER_FOOT) 
    : 0
  
  const basePrice = round(sqft * VINYL_BASE_SQFT * gaugeMultiplier)
  const total = round(basePrice + doorAdder + zipperAdder)
  
  return {
    basePrice: VINYL_BASE_SQFT,
    meshTypeMultiplier: gaugeMultiplier, // Using this field for gauge
    topAttachmentAdder: 0,
    bottomOptionAdder: 0,
    doorAdder,
    zipperAdder,
    notchAdder: 0,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied,
    formula: `max(${round((config.widthInches * config.heightInches) / 144)} sqft, ${VINYL_MIN_SQFT}) × $${VINYL_BASE_SQFT} × ${gaugeMultiplier} + $${doorAdder} + $${zipperAdder} = $${total}`
  }
}

// =============================================================================
// SCRIM PANEL PRICING
// =============================================================================

/**
 * Calculate scrim panel price
 * 
 * Formula from Gravity Forms Form 23:
 * price = max(sqft, 10) × $2.50
 */
export function calculateScrimPanelPrice(config: ScrimPanelConfig): PriceBreakdown {
  const { sqft, minimumApplied } = calculateSqFt(
    config.widthInches, 
    config.heightInches, 
    SCRIM_MIN_SQFT
  )
  
  const topAdder = TOP_ATTACHMENT_ADDERS[config.topAttachment]
  const basePrice = round(sqft * SCRIM_BASE_SQFT)
  const total = round(basePrice + topAdder)
  
  return {
    basePrice: SCRIM_BASE_SQFT,
    meshTypeMultiplier: 1,
    topAttachmentAdder: topAdder,
    bottomOptionAdder: 0,
    doorAdder: 0,
    zipperAdder: 0,
    notchAdder: 0,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied,
    formula: `max(${round((config.widthInches * config.heightInches) / 144)} sqft, ${SCRIM_MIN_SQFT}) × $${SCRIM_BASE_SQFT} + $${topAdder} = $${total}`
  }
}

// =============================================================================
// ROLL-UP PANEL PRICING
// =============================================================================

/**
 * Calculate roll-up shade screen panel price
 * 
 * price = max(sqft, 10) × $3.00 × meshMultiplier + rollupMechanism
 */
export function calculateRollupPanelPrice(config: RollupPanelConfig): PriceBreakdown {
  const { sqft, minimumApplied } = calculateSqFt(
    config.widthInches, 
    config.heightInches, 
    ROLLUP_MIN_SQFT
  )
  
  const meshMultiplier = MESH_TYPE_MULTIPLIERS[config.meshType]
  const basePrice = round(sqft * ROLLUP_BASE_SQFT * meshMultiplier)
  const total = round(basePrice + ROLLUP_MECHANISM_ADDER)
  
  return {
    basePrice: ROLLUP_BASE_SQFT,
    meshTypeMultiplier: meshMultiplier,
    topAttachmentAdder: ROLLUP_MECHANISM_ADDER,
    bottomOptionAdder: 0,
    doorAdder: 0,
    zipperAdder: 0,
    notchAdder: 0,
    squareFeet: sqft,
    quantity: 1,
    subtotal: total,
    total,
    minimumApplied,
    formula: `max(${round((config.widthInches * config.heightInches) / 144)} sqft, ${ROLLUP_MIN_SQFT}) × $${ROLLUP_BASE_SQFT} × ${meshMultiplier} + $${ROLLUP_MECHANISM_ADDER} = $${total}`
  }
}

// =============================================================================
// TRACK PRICING
// =============================================================================

/**
 * Calculate straight track price
 */
export function calculateStraightTrackPrice(
  lengthFeet: number,
  weight: 'standard' | 'heavy',
  quantity: number = 1
): number {
  const multiplier = weight === 'heavy' ? TRACK_HEAVY_MULTIPLIER : 1
  return round(lengthFeet * TRACK_STD_PER_FOOT * multiplier * quantity)
}

/**
 * Calculate curve price (90 or 135 degree)
 */
export function calculateCurvePrice(
  degree: 90 | 135,
  weight: 'standard' | 'heavy',
  quantity: number = 1
): number {
  const basePrice = degree === 90 ? TRACK_CURVE_90_PRICE : TRACK_CURVE_135_PRICE
  const multiplier = weight === 'heavy' ? TRACK_HEAVY_MULTIPLIER : 1
  return round(basePrice * multiplier * quantity)
}

/**
 * Calculate splice price
 */
export function calculateSplicePrice(
  weight: 'standard' | 'heavy',
  quantity: number = 1
): number {
  const multiplier = weight === 'heavy' ? TRACK_HEAVY_MULTIPLIER : 1
  return round(TRACK_SPLICE_PRICE * multiplier * quantity)
}

/**
 * Calculate end cap price
 */
export function calculateEndCapPrice(
  weight: 'standard' | 'heavy',
  quantity: number = 2
): number {
  const multiplier = weight === 'heavy' ? TRACK_HEAVY_MULTIPLIER : 1
  return round(TRACK_ENDCAP_PRICE * multiplier * quantity)
}

/**
 * Calculate snap carriers price
 */
export function calculateCarriersPrice(
  weight: 'standard' | 'heavy',
  quantity: number = 10
): number {
  const multiplier = weight === 'heavy' ? CARRIER_HEAVY_MULTIPLIER : 1
  return round(TRACK_CARRIER_PRICE * multiplier * quantity)
}

// =============================================================================
// ATTACHMENT PRICING
// =============================================================================

/**
 * Calculate marine snap price
 */
export function calculateMarineSnapPrice(
  quantity: number,
  _color: 'black' | 'white' = 'black'
): number {
  return round(MARINE_SNAP_PRICE * quantity)
}

/**
 * Calculate adhesive snap price
 */
export function calculateAdhesiveSnapPrice(
  quantity: number,
  color: 'black' | 'white' | 'clear' = 'black'
): number {
  const unitPrice = ADHESIVE_SNAP_PRICES[color]
  return round(unitPrice * quantity)
}

/**
 * Calculate block magnet price
 */
export function calculateBlockMagnetPrice(quantity: number): number {
  return round(BLOCK_MAGNET_PRICE * quantity)
}

/**
 * Calculate fiberglass rod set price
 */
export function calculateFiberglassRodPrice(quantity: number): number {
  return round(FIBERGLASS_ROD_SET_PRICE * quantity)
}

/**
 * Calculate elastic cord set price
 */
export function calculateElasticCordPrice(
  quantity: number,
  _color: 'black' | 'white' = 'black'
): number {
  return round(ELASTIC_CORD_SET_PRICE * quantity)
}

// =============================================================================
// ACCESSORY PRICING
// =============================================================================

/**
 * Calculate adhesive velcro price
 */
export function calculateVelcroPrice(lengthFeet: number): number {
  return round(ADHESIVE_VELCRO_PER_FOOT * lengthFeet)
}

/**
 * Calculate webbing price
 */
export function calculateWebbingPrice(lengthFeet: number): number {
  return round(WEBBING_PER_FOOT * lengthFeet)
}

/**
 * Calculate snap tape price
 */
export function calculateSnapTapePrice(lengthFeet: number): number {
  return round(SNAP_TAPE_PER_FOOT * lengthFeet)
}

/**
 * Calculate stucco strip price
 */
export function calculateStuccoStripPrice(
  quantity: number,
  zippered: boolean = false
): number {
  const unitPrice = zippered ? STUCCO_ZIPPERED_PRICE : STUCCO_STANDARD_PRICE
  return round(unitPrice * quantity)
}

// =============================================================================
// RAW MATERIAL PRICING
// =============================================================================

/**
 * Calculate raw mesh price
 * 
 * Formula from Gravity Forms Form 16725:
 * price = sqft × $0.75 × materialMultiplier × widthMultiplier
 */
export function calculateRawMeshPrice(config: RawMeshConfig): number {
  const sqft = (config.rollWidth / 12) * config.lengthFeet
  const materialMultiplier = RAW_MESH_TYPE_MULTIPLIERS[config.materialType]
  const widthMultiplier = ROLL_WIDTH_MULTIPLIERS[config.rollWidth]
  
  return round(sqft * RAW_MESH_BASE_SQFT * materialMultiplier * widthMultiplier)
}

// =============================================================================
// TOOL PRICING
// =============================================================================

/**
 * Get snap tool price (fully refundable)
 */
export function getSnapToolPrice(): number {
  return SNAP_TOOL_PRICE
}

// =============================================================================
// SHIPPING CALCULATION
// =============================================================================

import { FREE_SHIPPING_THRESHOLD, FLAT_RATE_SHIPPING } from './constants'

/**
 * Calculate shipping cost
 */
export function calculateShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return FLAT_RATE_SHIPPING
}
