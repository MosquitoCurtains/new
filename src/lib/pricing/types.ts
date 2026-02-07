/**
 * Pricing System Types
 * 
 * IMPORTANT: These types match the actual Gravity Forms product structure
 * from mosquitocurtains.com
 */

// =============================================================================
// Database-Driven Pricing
// =============================================================================

/**
 * Map of pricing keys to their numeric values.
 * Built from the `products` and `product_options` tables:
 *   - Product SKU -> base_price (for simple products)
 *   - Option pricing_key -> price (for configurable product options)
 *   - Plus legacy formula-compatibility mappings
 * 
 * When passed to formula functions, DB values take precedence.
 * When a key is missing, the `p()` helper logs an error and returns 0.
 */
export type PricingMap = Record<string, number>

// =============================================================================
// Product Types
// =============================================================================

export type ProductType = 
  | 'panel' 
  | 'track' 
  | 'attachment' 
  | 'raw_material' 
  | 'tool' 
  | 'accessory' 
  | 'adjustment'

// =============================================================================
// Mesh Panel Types (from Gravity Form 16028)
// =============================================================================

export type MeshType = 
  | 'heavy_mosquito'  // $18/linear ft
  | 'no_see_um'       // $19/linear ft
  | 'shade'           // $20/linear ft
  | 'scrim'           // For raw materials
  | 'theater_scrim'   // For raw materials

// Mesh color availability depends on mesh type:
// - heavy_mosquito: black, white, ivory
// - no_see_um: black, white
// - shade: black, white
export type MeshColor = 
  | 'black' 
  | 'white' 
  | 'ivory'  // Only available for heavy_mosquito
  | 'silver' // Theater scrim option

export type MeshTopAttachment = 
  | 'standard_track'  // For panels under 10ft tall
  | 'heavy_track'     // For panels over 10ft tall
  | 'velcro'          // Fixed in place (shows velcro_color option)
  | 'special_rigging' // Custom attachment

export type VelcroColor = 'black' | 'white'

// =============================================================================
// Clear Vinyl Panel Types (from Gravity Form 16698)
// =============================================================================

// Panel size determines pricing tier (not gauge/thickness!)
// Vinyl is always 20-gauge
export type VinylPanelSize = 
  | 'short'   // $28/linear ft
  | 'medium'  // $34/linear ft (default)
  | 'tall'    // $41/linear ft

// Canvas color - the fabric border around the clear vinyl
// Only available for medium and tall panels (short = N/A)
export type CanvasColor = 
  | 'tbd'               // To Be Determined
  | 'ashen_gray'
  | 'burgundy'
  | 'black'
  | 'cocoa_brown'
  | 'clear_top_to_bottom' // No canvas border
  | 'forest_green'
  | 'moss_green'
  | 'navy_blue'
  | 'royal_blue'
  | 'sandy_tan'

export type VinylTopAttachment = 
  | 'standard_track'  // For panels under 10ft tall
  | 'heavy_track'     // For panels over 10ft tall
  | 'velcro'          // Fixed in place (shows velcro_color option)
  | 'binding_only'    // Just finished edge, no attachment
  | 'special_rigging' // Custom attachment

// Legacy types - kept for backwards compatibility
export type PanelColor = MeshColor | CanvasColor
export type TopAttachment = MeshTopAttachment | VinylTopAttachment

export type BottomOption = 
  | 'weighted_hem' 
  | 'chain_weight' 
  | 'rod_pocket'

// DEPRECATED - Vinyl doesn't have gauge/thickness options
// It's always 20-gauge. Price varies by panel HEIGHT (short/medium/tall)
export type VinylGauge = '20_gauge'
export type VinylTint = 'clear' | 'tinted'

// =============================================================================
// Track Types
// =============================================================================

export type TrackWeight = 
  | 'standard' 
  | 'heavy'

export type TrackColor = 
  | 'white' 
  | 'brown'

export type TrackLength = 
  | '4' | '5' | '6' | '7' | '8' | 'custom'

// =============================================================================
// Configuration Interfaces
// =============================================================================

/**
 * Mesh Panel Configuration
 * Matches Gravity Form 16028 - Mesh Panels
 */
export interface MeshPanelConfig {
  // Dimensions
  widthFeet: number
  widthInches: number  // 0-11 portion
  heightInches: number
  
  // Required Options
  meshType: MeshType           // Determines price per linear foot
  meshColor: MeshColor         // Conditional on meshType (ivory only for heavy_mosquito)
  topAttachment: MeshTopAttachment
  
  // Conditional Options
  velcroColor?: VelcroColor    // Only when topAttachment = 'velcro'
}

/**
 * Clear Vinyl Panel Configuration
 * Matches Gravity Form 16698 - Clear Vinyl Panels
 */
export interface VinylPanelConfig {
  // Dimensions
  widthFeet: number
  widthInches: number  // 0-11 portion
  heightInches: number
  
  // Required Options
  panelSize: VinylPanelSize    // Determines price per linear foot (short/medium/tall)
  topAttachment: VinylTopAttachment
  
  // Conditional Options
  canvasColor?: CanvasColor    // Only for medium/tall panels (not short)
  velcroColor?: VelcroColor    // Only when topAttachment = 'velcro'
  
  // Optional Additions
  hasDoor?: boolean
  hasZipper?: boolean
  notes?: string
}

/**
 * Scrim Panel Configuration
 */
export interface ScrimPanelConfig {
  widthFeet: number
  widthInches: number
  heightInches: number
  color: MeshColor
  topAttachment: MeshTopAttachment
}

/**
 * Roll-up Panel Configuration
 */
export interface RollupPanelConfig {
  widthFeet: number
  widthInches: number
  heightInches: number
  meshType: MeshType
  color: MeshColor
}

export interface TrackConfig {
  weight: TrackWeight
  color: TrackColor
  lengthFeet?: number  // For straight track
  quantity?: number    // For end caps, carriers
}

export interface AttachmentConfig {
  color?: PanelColor
  quantity: number
  size?: '1_inch' | '2_inch'  // For screw studs
}

export interface RawMeshConfig {
  materialType: MeshType | 'scrim'
  rollWidth: 101 | 120 | 123 | 138 | 140
  color: PanelColor
  lengthFeet: number
}

// =============================================================================
// Pricing Result
// =============================================================================

export interface PriceBreakdown {
  basePrice: number
  meshTypeMultiplier: number
  topAttachmentAdder: number
  bottomOptionAdder: number
  doorAdder: number
  zipperAdder: number
  notchAdder: number
  squareFeet: number
  quantity: number
  subtotal: number
  total: number
  minimumApplied: boolean
  formula: string
}

export interface LineItemPrice {
  productSku: string
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
  breakdown: PriceBreakdown
  options: Record<string, string>
}

// =============================================================================
// Shipping & Tax Types
// =============================================================================

/** Shipping class determines which shipping rate to use */
export type ShippingClass = 'default' | 'clear_vinyl' | 'straight_track'

/** Maps product SKU prefixes to their shipping class */
export function getShippingClassForItem(item: { type: string; productSku: string }): ShippingClass {
  // Clear vinyl panels
  if (item.productSku.startsWith('vinyl_') || item.productSku === 'clear_vinyl_panel') {
    return 'clear_vinyl'
  }
  // Track and track hardware
  if (
    item.type === 'track' ||
    item.productSku.startsWith('track_') ||
    item.productSku === 'heavy_track' ||
    item.productSku === 'standard_track'
  ) {
    return 'straight_track'
  }
  // Everything else uses default shipping
  return 'default'
}
