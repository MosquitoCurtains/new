/**
 * Pricing Constants
 * 
 * All pricing formulas extracted from Gravity Forms
 * Last Updated: February 2026
 */

// =============================================================================
// MESH PANEL PRICING (Form 8)
// =============================================================================

/** Base price per square foot for mesh panels */
export const MESH_BASE_SQFT = 1.50

/** Minimum square footage for mesh panels */
export const MESH_MIN_SQFT = 10

/** Multipliers for different mesh types */
export const MESH_TYPE_MULTIPLIERS = {
  heavy_mosquito: 1.00,
  no_see_um: 1.20,
  shade: 1.10,
  scrim: 0.95,
  theater_scrim: 0.95,
} as const

/** Top attachment adders (per panel, not per sqft) */
export const TOP_ATTACHMENT_ADDERS = {
  velcro: 0,
  tracking_short: 2.00,
  tracking_tall: 4.00,
  grommets: 0,
} as const

/** Bottom option adders */
export const BOTTOM_OPTION_ADDERS = {
  weighted_hem: 0,
  chain_weight: 5.00,
  rod_pocket: 3.00,
} as const

/** Door adder per panel */
export const DOOR_ADDER = 15.00

/** Zipper adder per linear foot (height) */
export const ZIPPER_PER_FOOT = 2.50

/** Notch adder per notch */
export const NOTCH_ADDER = 10.00

// =============================================================================
// CLEAR VINYL PANEL PRICING (Form 10)
// =============================================================================

/** Base price per square foot for vinyl panels */
export const VINYL_BASE_SQFT = 4.00

/** Minimum square footage for vinyl panels */
export const VINYL_MIN_SQFT = 10

/** Gauge multipliers */
export const VINYL_GAUGE_MULTIPLIERS = {
  '20_gauge': 1.00,
  '30_gauge': 1.25,
  '40_gauge': 1.50,
} as const

/** Vinyl door adder */
export const VINYL_DOOR_ADDER = 25.00

// =============================================================================
// SCRIM PANEL PRICING (Form 23)
// =============================================================================

/** Base price per square foot for scrim panels */
export const SCRIM_BASE_SQFT = 2.50

/** Minimum square footage for scrim panels */
export const SCRIM_MIN_SQFT = 10

// =============================================================================
// ROLL-UP PANEL PRICING (Based on historical data)
// =============================================================================

/** Base price per square foot for roll-up panels */
export const ROLLUP_BASE_SQFT = 3.00

/** Minimum square footage for roll-up panels */
export const ROLLUP_MIN_SQFT = 10

/** Roll mechanism adder per panel */
export const ROLLUP_MECHANISM_ADDER = 20.00

// =============================================================================
// TRACK PRICING (Forms 16379 & 16391)
// =============================================================================

/** Standard track price per linear foot */
export const TRACK_STD_PER_FOOT = 3.50

/** Heavy track multiplier */
export const TRACK_HEAVY_MULTIPLIER = 1.40

/** Curve prices (per piece) */
export const TRACK_CURVE_90_PRICE = 12.00
export const TRACK_CURVE_135_PRICE = 15.00

/** Splice price */
export const TRACK_SPLICE_PRICE = 5.00

/** End cap price (each) */
export const TRACK_ENDCAP_PRICE = 2.50

/** Snap carrier price (each) */
export const TRACK_CARRIER_PRICE = 0.75

/** Carrier heavy multiplier */
export const CARRIER_HEAVY_MULTIPLIER = 1.20

// =============================================================================
// ATTACHMENT PRICING (Form 16727)
// =============================================================================

/** Marine snap price (each, includes screw stud) */
export const MARINE_SNAP_PRICE = 0.35

/** Adhesive snap prices by color */
export const ADHESIVE_SNAP_PRICES = {
  black: 2.00,
  white: 2.00,
  clear: 3.00,
} as const

/** Chrome snap price */
export const CHROME_SNAP_PRICE = 0.50

/** Panel-to-panel snap price */
export const PANEL_SNAP_PRICE = 1.67

/** Block magnet price */
export const BLOCK_MAGNET_PRICE = 1.00

/** Ring magnet price */
export const RING_MAGNET_PRICE = 1.50

/** Fiberglass rod set price */
export const FIBERGLASS_ROD_SET_PRICE = 10.00

/** Fiberglass clip price (extra) */
export const FIBERGLASS_CLIP_PRICE = 2.00

/** Elastic cord set price */
export const ELASTIC_CORD_SET_PRICE = 10.00

/** Tether clip price */
export const TETHER_CLIP_PRICE = 10.00

/** Belted rib price */
export const BELTED_RIB_PRICE = 15.00

/** Screw stud price */
export const SCREW_STUD_PRICE = 0.15

/** L screw price */
export const L_SCREW_PRICE = 0.25

/** Rubber washer price */
export const RUBBER_WASHER_PRICE = 0.20

/** Rod clip price */
export const ROD_CLIP_PRICE = 2.00

// =============================================================================
// ACCESSORY PRICING
// =============================================================================

/** Adhesive velcro per foot */
export const ADHESIVE_VELCRO_PER_FOOT = 0.50

/** Webbing per foot */
export const WEBBING_PER_FOOT = 0.40

/** Snap tape per foot */
export const SNAP_TAPE_PER_FOOT = 2.00

/** Tie-up strap price */
export const TIEUP_STRAP_PRICE = 2.00

/** Fastwax cleaner price */
export const FASTWAX_PRICE = 15.00

/** Stucco strip prices */
export const STUCCO_STANDARD_PRICE = 24.00
export const STUCCO_ZIPPERED_PRICE = 40.00

// =============================================================================
// TOOL PRICING
// =============================================================================

/** Industrial snap tool price (fully refundable) */
export const SNAP_TOOL_PRICE = 130.00

// =============================================================================
// RAW MATERIAL PRICING (Form 16725)
// =============================================================================

/** Base raw mesh price per sqft */
export const RAW_MESH_BASE_SQFT = 0.75

/** Roll width multipliers */
export const ROLL_WIDTH_MULTIPLIERS = {
  54: 1.00,
  72: 1.33,
  96: 1.78,
} as const

/** Material type multipliers for raw mesh */
export const RAW_MESH_TYPE_MULTIPLIERS = {
  heavy_mosquito: 1.00,
  no_see_um: 1.20,
  shade: 1.10,
  scrim: 1.50,
  theater_scrim: 1.50,
} as const

// =============================================================================
// SHIPPING THRESHOLDS
// =============================================================================

/** Free shipping threshold */
export const FREE_SHIPPING_THRESHOLD = 200.00

/** Flat rate shipping for orders under threshold */
export const FLAT_RATE_SHIPPING = 15.00
