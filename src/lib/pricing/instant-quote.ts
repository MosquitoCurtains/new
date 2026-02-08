/**
 * Instant Quote Price Calculator
 * 
 * Implements the exact pricing formulas from the Gravity Forms instant quote tools.
 * Two product types: Mosquito Curtains (Form 124) and Clear Vinyl (Form 126).
 * 
 * Source: Gravity Forms JSON exports dated 1-11-24.
 */

// =============================================================================
// TYPES
// =============================================================================

export type MosquitoMeshType = 'heavy_mosquito' | 'no_see_um' | 'shade' | 'scrim'
export type ClearVinylPanelHeight = 'short' | 'medium' | 'tall'
export type TopAttachmentMosquito = 'tracking_under_10' | 'tracking_over_10' | 'velcro' | 'grommets'
export type TopAttachmentVinyl = 'velcro' | 'tracking_under_10' | 'tracking_over_10'
export type ShipLocation = 'usa' | 'canada' | 'international'

export interface MosquitoQuoteInputs {
  meshType: MosquitoMeshType | null
  topAttachment: TopAttachmentMosquito | null
  numberOfSides: number | null   // Display value: 1-5
  projectWidth: number | null    // 5-200 ft
  shipLocation: ShipLocation
}

export interface ClearVinylQuoteInputs {
  panelHeight: ClearVinylPanelHeight | null
  topAttachment: TopAttachmentVinyl | null
  numberOfSides: number | null   // Display value: 1-5
  projectWidth: number | null    // 5-200 ft
  shipLocation: ShipLocation
}

export interface QuoteResult {
  subtotal: number
  shipping: number
  total: number
  isComplete: boolean
}

// =============================================================================
// PRICING TABLES (from Gravity Forms field values)
// =============================================================================

// Mosquito mesh type -> price per linear foot
const MOSQUITO_MESH_PRICE: Record<MosquitoMeshType, number> = {
  heavy_mosquito: 18.95,
  no_see_um: 19.95,
  shade: 20.95,
  scrim: 20.95,
}

// Clear vinyl panel height -> price per linear foot
const VINYL_HEIGHT_PRICE: Record<ClearVinylPanelHeight, number> = {
  short: 29,   // Shorter Than 78"
  medium: 35,  // 78" - 108"
  tall: 42,    // Taller Than 108"
}

// Clear vinyl panel height -> per-side cost
const VINYL_SIDE_COST: Record<ClearVinylPanelHeight, number> = {
  short: 80,
  medium: 85,
  tall: 90,
}

// Mosquito: per-side cost is fixed at $52
const MOSQUITO_SIDE_COST = 52

// Top attachment -> additional cost per linear foot
const TOP_ATTACHMENT_COST: Record<TopAttachmentMosquito | TopAttachmentVinyl, number> = {
  velcro: 0,
  grommets: 0,
  tracking_under_10: 5.70,
  tracking_over_10: 8.00,
}

// =============================================================================
// SIDES MULTIPLIER MAPPING
// The Gravity Forms encode "number of sides" with hidden multiplier values.
// Display value (1-5) -> form value (used in calculation)
// =============================================================================

// Mosquito: 1->2, 2->3, 3->4, 4->5, More Than 4->6
const MOSQUITO_SIDES: Record<number, number> = {
  1: 2, 2: 3, 3: 4, 4: 5, 5: 6,
}

// Clear Vinyl: 1->2, 2->4, 3->6, 4->8, More Than 4->10
const VINYL_SIDES: Record<number, number> = {
  1: 2, 2: 4, 3: 6, 4: 8, 5: 10,
}

// =============================================================================
// SHIPPING PARAMETERS
// Shipping = baseFee + (subtotal * rate) + (hasTracking ? trackSurcharge : 0)
// =============================================================================

interface ShippingParams {
  baseFee: number
  rate: number
  trackSurcharge: number
}

const MOSQUITO_SHIPPING: Record<ShipLocation, ShippingParams> = {
  usa:           { baseFee: 15,  rate: 0.0275, trackSurcharge: 30 },
  canada:        { baseFee: 55,  rate: 0.03,   trackSurcharge: 50 },
  international: { baseFee: 40,  rate: 0.05,   trackSurcharge: 70 },
}

const VINYL_SHIPPING: Record<ShipLocation, ShippingParams> = {
  usa:           { baseFee: 45,  rate: 0.06, trackSurcharge: 30 },
  canada:        { baseFee: 105, rate: 0.06, trackSurcharge: 50 },
  international: { baseFee: 110, rate: 0.05, trackSurcharge: 70 },
}

// =============================================================================
// HELPERS
// =============================================================================

function isTracking(attachment: TopAttachmentMosquito | TopAttachmentVinyl): boolean {
  return attachment === 'tracking_under_10' || attachment === 'tracking_over_10'
}

function computeShipping(
  subtotal: number,
  shipLocation: ShipLocation,
  topAttachment: TopAttachmentMosquito | TopAttachmentVinyl,
  table: Record<ShipLocation, ShippingParams>,
): number {
  const p = table[shipLocation]
  return p.baseFee + (subtotal * p.rate) + (isTracking(topAttachment) ? p.trackSurcharge : 0)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// =============================================================================
// CALCULATORS
// =============================================================================

/**
 * Mosquito Curtains instant quote.
 * 
 * Subtotal = (meshPrice * width + attachmentPrice * width + sidesMult * 52) * 1.02
 * Shipping = baseFee + subtotal * rate + (tracking ? trackSurcharge : 0)
 * Total = subtotal + shipping
 */
export function calculateMosquitoQuote(inputs: MosquitoQuoteInputs): QuoteResult {
  const { meshType, topAttachment, numberOfSides, projectWidth, shipLocation } = inputs

  if (!meshType || !topAttachment || !numberOfSides || !projectWidth) {
    return { subtotal: 0, shipping: 0, total: 0, isComplete: false }
  }

  const meshPrice = MOSQUITO_MESH_PRICE[meshType]
  const attachmentPrice = TOP_ATTACHMENT_COST[topAttachment]
  const sidesMult = MOSQUITO_SIDES[numberOfSides] ?? 2

  const subtotal = (meshPrice * projectWidth + attachmentPrice * projectWidth + sidesMult * MOSQUITO_SIDE_COST) * 1.02
  const shipping = computeShipping(subtotal, shipLocation, topAttachment, MOSQUITO_SHIPPING)

  return {
    subtotal: round2(subtotal),
    shipping: round2(shipping),
    total: round2(subtotal + shipping),
    isComplete: true,
  }
}

/**
 * Clear Vinyl instant quote.
 * 
 * Subtotal = heightPrice * width + attachmentPrice * width + sidesMult * sideCost
 * Shipping = baseFee + subtotal * rate + (tracking ? trackSurcharge : 0)
 * Total = subtotal + shipping
 */
export function calculateClearVinylQuote(inputs: ClearVinylQuoteInputs): QuoteResult {
  const { panelHeight, topAttachment, numberOfSides, projectWidth, shipLocation } = inputs

  if (!panelHeight || !topAttachment || !numberOfSides || !projectWidth) {
    return { subtotal: 0, shipping: 0, total: 0, isComplete: false }
  }

  const heightPrice = VINYL_HEIGHT_PRICE[panelHeight]
  const attachmentPrice = TOP_ATTACHMENT_COST[topAttachment]
  const sidesMult = VINYL_SIDES[numberOfSides] ?? 2
  const sideCost = VINYL_SIDE_COST[panelHeight]

  const subtotal = heightPrice * projectWidth + attachmentPrice * projectWidth + sidesMult * sideCost
  const shipping = computeShipping(subtotal, shipLocation, topAttachment, VINYL_SHIPPING)

  return {
    subtotal: round2(subtotal),
    shipping: round2(shipping),
    total: round2(subtotal + shipping),
    isComplete: true,
  }
}

// =============================================================================
// DISPLAY OPTIONS (for form select elements)
// =============================================================================

export const MESH_TYPE_OPTIONS = [
  { value: 'heavy_mosquito' as const, label: 'Heavy Mosquito Mesh' },
  { value: 'no_see_um' as const, label: 'No-See-Um Mesh' },
  { value: 'shade' as const, label: 'Shade Mesh' },
  { value: 'scrim' as const, label: 'Scrim Material' },
]

export const PANEL_HEIGHT_OPTIONS = [
  { value: 'short' as const, label: 'Shorter Than 78"' },
  { value: 'medium' as const, label: '78" - 108"' },
  { value: 'tall' as const, label: 'Taller Than 108"' },
]

export const MOSQUITO_ATTACHMENT_OPTIONS = [
  { value: 'tracking_under_10' as const, label: 'Tracking < 10FT Tall' },
  { value: 'tracking_over_10' as const, label: 'Tracking > 10FT Tall' },
  { value: 'velcro' as const, label: 'Velcro\u00AE' },
  { value: 'grommets' as const, label: 'Grommets (For Fixed Awnings)' },
]

export const VINYL_ATTACHMENT_OPTIONS = [
  { value: 'velcro' as const, label: 'Velcro\u00AE (Most Common)' },
  { value: 'tracking_under_10' as const, label: 'Tracking < 10FT Tall' },
  { value: 'tracking_over_10' as const, label: 'Tracking > 10FT Tall' },
]

export const SIDES_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: 'More Than 4' },
]

export const SHIP_LOCATION_OPTIONS = [
  { value: 'usa' as const, label: 'USA' },
  { value: 'canada' as const, label: 'Canada' },
  { value: 'international' as const, label: 'International' },
]

// =============================================================================
// FORMAT HELPERS
// =============================================================================

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
