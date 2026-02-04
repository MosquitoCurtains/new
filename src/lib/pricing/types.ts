/**
 * Pricing System Types
 */

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

export type PricingType = 
  | 'sqft' 
  | 'linear_ft' 
  | 'each' 
  | 'set' 
  | 'fixed' 
  | 'calculated'

// =============================================================================
// Panel Types
// =============================================================================

export type MeshType = 
  | 'heavy_mosquito' 
  | 'no_see_um' 
  | 'shade'

export type PanelColor = 
  | 'black' 
  | 'white' 
  | 'gray' 
  | 'ivory'

export type TopAttachment = 
  | 'velcro' 
  | 'tracking_short' 
  | 'tracking_tall' 
  | 'grommets'

export type BottomOption = 
  | 'weighted_hem' 
  | 'chain_weight' 
  | 'rod_pocket'

export type VinylGauge = 
  | '20_gauge' 
  | '30_gauge' 
  | '40_gauge'

export type VinylTint = 
  | 'clear' 
  | 'tinted'

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

export interface MeshPanelConfig {
  widthInches: number
  heightInches: number
  meshType: MeshType
  color: PanelColor
  topAttachment: TopAttachment
  bottomOption?: BottomOption
  hasDoor?: boolean
  hasZipper?: boolean
  hasNotch?: boolean
  notchWidth?: number
  notchHeight?: number
}

export interface VinylPanelConfig {
  widthInches: number
  heightInches: number
  gauge: VinylGauge
  tint: VinylTint
  topAttachment: TopAttachment
  hasDoor?: boolean
  hasZipper?: boolean
}

export interface ScrimPanelConfig {
  widthInches: number
  heightInches: number
  color: PanelColor
  topAttachment: TopAttachment
}

export interface RollupPanelConfig {
  widthInches: number
  heightInches: number
  meshType: MeshType
  color: PanelColor
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
  rollWidth: 54 | 72 | 96
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
