/**
 * Main Price Calculator
 * 
 * High-level API for calculating prices across all product types.
 * Used by the checkout system and quote wizard.
 */

import {
  calculateMeshPanelPrice,
  calculateVinylPanelPrice,
  calculateScrimPanelPrice,
  calculateRollupPanelPrice,
  calculateStraightTrackPrice,
  calculateCurvePrice,
  calculateSplicePrice,
  calculateEndCapPrice,
  calculateCarriersPrice,
  calculateMarineSnapPrice,
  calculateAdhesiveSnapPrice,
  calculateBlockMagnetPrice,
  calculateFiberglassRodPrice,
  calculateElasticCordPrice,
  calculateVelcroPrice,
  calculateWebbingPrice,
  calculateSnapTapePrice,
  calculateStuccoStripPrice,
  calculateRawMeshPrice,
  getSnapToolPrice,
  calculateShipping,
  round,
} from './formulas'

import type {
  MeshPanelConfig,
  VinylPanelConfig,
  ScrimPanelConfig,
  RollupPanelConfig,
  RawMeshConfig,
  LineItemPrice,
  MeshType,
  PanelColor,
  TopAttachment,
  TrackWeight,
} from './types'

// =============================================================================
// CART ITEM TYPES
// =============================================================================

export type CartItem = 
  | MeshPanelCartItem
  | VinylPanelCartItem
  | ScrimPanelCartItem
  | RollupPanelCartItem
  | TrackCartItem
  | AttachmentCartItem
  | AccessoryCartItem
  | ToolCartItem
  | RawMaterialCartItem
  | AdjustmentCartItem

interface BaseCartItem {
  id: string
  productSku: string
}

export interface MeshPanelCartItem extends BaseCartItem {
  type: 'mesh_panel'
  config: MeshPanelConfig
  quantity: number
}

export interface VinylPanelCartItem extends BaseCartItem {
  type: 'vinyl_panel'
  config: VinylPanelConfig
  quantity: number
}

export interface ScrimPanelCartItem extends BaseCartItem {
  type: 'scrim_panel'
  config: ScrimPanelConfig
  quantity: number
}

export interface RollupPanelCartItem extends BaseCartItem {
  type: 'rollup_panel'
  config: RollupPanelConfig
  quantity: number
}

export interface TrackCartItem extends BaseCartItem {
  type: 'track'
  trackType: 'straight' | 'curve_90' | 'curve_135' | 'splice' | 'endcap' | 'carriers'
  weight: TrackWeight
  color?: 'white' | 'brown'
  lengthFeet?: number
  quantity: number
}

export interface AttachmentCartItem extends BaseCartItem {
  type: 'attachment'
  attachmentType: 
    | 'marine_snap' 
    | 'adhesive_snap' 
    | 'chrome_snap' 
    | 'panel_snap'
    | 'block_magnet' 
    | 'ring_magnet'
    | 'fiberglass_rod' 
    | 'fiberglass_clip'
    | 'elastic_cord'
    | 'tether_clip'
    | 'belted_rib'
    | 'screw_stud'
    | 'l_screw'
    | 'rubber_washer'
    | 'rod_clip'
  color?: PanelColor
  size?: '1_inch' | '2_inch'
  quantity: number
}

export interface AccessoryCartItem extends BaseCartItem {
  type: 'accessory'
  accessoryType: 
    | 'adhesive_velcro' 
    | 'webbing' 
    | 'snap_tape' 
    | 'tieup_strap' 
    | 'fastwax_cleaner'
    | 'stucco_strip'
  color?: PanelColor
  lengthFeet?: number
  zippered?: boolean
  quantity: number
}

export interface ToolCartItem extends BaseCartItem {
  type: 'tool'
  toolType: 'industrial_snap_tool'
  quantity: number
}

export interface RawMaterialCartItem extends BaseCartItem {
  type: 'raw_material'
  config: RawMeshConfig
  quantity: number
}

export interface AdjustmentCartItem extends BaseCartItem {
  type: 'adjustment'
  adjustmentType: 'discount' | 'surcharge' | 'notch' | 'special'
  reason: string
  amount: number
  relatedItemId?: string
}

// =============================================================================
// MAIN CALCULATOR CLASS
// =============================================================================

export class PriceCalculator {
  /**
   * Calculate price for a single cart item
   */
  calculateItem(item: CartItem): LineItemPrice {
    switch (item.type) {
      case 'mesh_panel':
        return this.calculateMeshPanel(item)
      case 'vinyl_panel':
        return this.calculateVinylPanel(item)
      case 'scrim_panel':
        return this.calculateScrimPanel(item)
      case 'rollup_panel':
        return this.calculateRollupPanel(item)
      case 'track':
        return this.calculateTrack(item)
      case 'attachment':
        return this.calculateAttachment(item)
      case 'accessory':
        return this.calculateAccessory(item)
      case 'tool':
        return this.calculateTool(item)
      case 'raw_material':
        return this.calculateRawMaterial(item)
      case 'adjustment':
        return this.calculateAdjustment(item)
      default:
        throw new Error(`Unknown item type: ${(item as CartItem).type}`)
    }
  }

  /**
   * Calculate total for multiple cart items
   */
  calculateCart(items: CartItem[]): {
    items: LineItemPrice[]
    subtotal: number
    shipping: number
    tax: number
    total: number
  } {
    const pricedItems = items.map(item => this.calculateItem(item))
    const subtotal = round(pricedItems.reduce((sum, item) => sum + item.lineTotal, 0))
    const shipping = calculateShipping(subtotal)
    const tax = 0 // Tax calculated at checkout based on shipping address
    const total = round(subtotal + shipping + tax)

    return {
      items: pricedItems,
      subtotal,
      shipping,
      tax,
      total,
    }
  }

  // ==========================================================================
  // PANEL CALCULATIONS
  // ==========================================================================

  private calculateMeshPanel(item: MeshPanelCartItem): LineItemPrice {
    const breakdown = calculateMeshPanelPrice(item.config)
    const lineTotal = round(breakdown.total * item.quantity)

    return {
      productSku: 'mesh_panel',
      productName: `Mosquito Netting Panel (${item.config.widthInches}" × ${item.config.heightInches}")`,
      unitPrice: breakdown.total,
      quantity: item.quantity,
      lineTotal,
      breakdown,
      options: {
        mesh_type: item.config.meshType,
        color: item.config.color,
        top_attachment: item.config.topAttachment,
        bottom_option: item.config.bottomOption || 'weighted_hem',
        ...(item.config.hasDoor && { has_door: 'true' }),
        ...(item.config.hasZipper && { has_zipper: 'true' }),
        ...(item.config.hasNotch && { has_notch: 'true' }),
      },
    }
  }

  private calculateVinylPanel(item: VinylPanelCartItem): LineItemPrice {
    const breakdown = calculateVinylPanelPrice(item.config)
    const lineTotal = round(breakdown.total * item.quantity)

    return {
      productSku: 'vinyl_panel',
      productName: `Clear Vinyl Panel (${item.config.widthInches}" × ${item.config.heightInches}")`,
      unitPrice: breakdown.total,
      quantity: item.quantity,
      lineTotal,
      breakdown,
      options: {
        gauge: item.config.gauge,
        tint: item.config.tint,
        top_attachment: item.config.topAttachment,
        ...(item.config.hasDoor && { has_door: 'true' }),
        ...(item.config.hasZipper && { has_zipper: 'true' }),
      },
    }
  }

  private calculateScrimPanel(item: ScrimPanelCartItem): LineItemPrice {
    const breakdown = calculateScrimPanelPrice(item.config)
    const lineTotal = round(breakdown.total * item.quantity)

    return {
      productSku: 'scrim_panel',
      productName: `Scrim Netting Panel (${item.config.widthInches}" × ${item.config.heightInches}")`,
      unitPrice: breakdown.total,
      quantity: item.quantity,
      lineTotal,
      breakdown,
      options: {
        color: item.config.color,
        top_attachment: item.config.topAttachment,
      },
    }
  }

  private calculateRollupPanel(item: RollupPanelCartItem): LineItemPrice {
    const breakdown = calculateRollupPanelPrice(item.config)
    const lineTotal = round(breakdown.total * item.quantity)

    return {
      productSku: 'rollup_panel',
      productName: `Roll-Up Shade Screen (${item.config.widthInches}" × ${item.config.heightInches}")`,
      unitPrice: breakdown.total,
      quantity: item.quantity,
      lineTotal,
      breakdown,
      options: {
        mesh_type: item.config.meshType,
        color: item.config.color,
      },
    }
  }

  // ==========================================================================
  // TRACK CALCULATIONS
  // ==========================================================================

  private calculateTrack(item: TrackCartItem): LineItemPrice {
    let unitPrice: number
    let productName: string

    switch (item.trackType) {
      case 'straight':
        unitPrice = calculateStraightTrackPrice(item.lengthFeet || 7, item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} Straight Track (${item.lengthFeet || 7}ft)`
        break
      case 'curve_90':
        unitPrice = calculateCurvePrice(90, item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} 90° Curve`
        break
      case 'curve_135':
        unitPrice = calculateCurvePrice(135, item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} 135° Curve`
        break
      case 'splice':
        unitPrice = calculateSplicePrice(item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} Track Splice`
        break
      case 'endcap':
        unitPrice = calculateEndCapPrice(item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} End Cap`
        break
      case 'carriers':
        unitPrice = calculateCarriersPrice(item.weight, 1)
        productName = `${item.weight === 'heavy' ? 'Heavy' : 'Standard'} Snap Carriers`
        break
      default:
        throw new Error(`Unknown track type: ${item.trackType}`)
    }

    const lineTotal = round(unitPrice * item.quantity)

    return {
      productSku: item.trackType === 'straight' ? 'straight_track' :
                  item.trackType === 'curve_90' ? 'curve_90' :
                  item.trackType === 'curve_135' ? 'curve_135' :
                  item.trackType === 'splice' ? 'track_splice' :
                  item.trackType === 'endcap' ? 'track_endcap' : 'snap_carriers',
      productName,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      breakdown: this.emptyBreakdown(unitPrice, item.quantity, lineTotal),
      options: {
        weight: item.weight,
        ...(item.color && { color: item.color }),
        ...(item.lengthFeet && { length: String(item.lengthFeet) }),
      },
    }
  }

  // ==========================================================================
  // ATTACHMENT CALCULATIONS
  // ==========================================================================

  private calculateAttachment(item: AttachmentCartItem): LineItemPrice {
    let unitPrice: number
    let productName: string
    const sku = item.attachmentType

    switch (item.attachmentType) {
      case 'marine_snap':
        unitPrice = calculateMarineSnapPrice(1, item.color as 'black' | 'white')
        productName = `Marine Snaps (${item.color || 'black'})`
        break
      case 'adhesive_snap':
        unitPrice = calculateAdhesiveSnapPrice(1, item.color as 'black' | 'white' | 'clear')
        productName = `Adhesive Marine Snaps (${item.color || 'black'})`
        break
      case 'block_magnet':
        unitPrice = calculateBlockMagnetPrice(1)
        productName = 'Block Shaped Magnets'
        break
      case 'fiberglass_rod':
        unitPrice = calculateFiberglassRodPrice(1)
        productName = 'Fiberglass Rod Set'
        break
      case 'elastic_cord':
        unitPrice = calculateElasticCordPrice(1, item.color as 'black' | 'white')
        productName = `Elastic Cord & D-Rings (${item.color || 'black'})`
        break
      // Add other attachment types...
      default:
        unitPrice = this.getAttachmentPrice(item.attachmentType)
        productName = this.getAttachmentName(item.attachmentType)
    }

    const lineTotal = round(unitPrice * item.quantity)

    return {
      productSku: sku,
      productName,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      breakdown: this.emptyBreakdown(unitPrice, item.quantity, lineTotal),
      options: {
        ...(item.color && { color: item.color }),
        ...(item.size && { size: item.size }),
        quantity: String(item.quantity),
      },
    }
  }

  // ==========================================================================
  // ACCESSORY CALCULATIONS
  // ==========================================================================

  private calculateAccessory(item: AccessoryCartItem): LineItemPrice {
    let unitPrice: number
    let productName: string

    switch (item.accessoryType) {
      case 'adhesive_velcro':
        unitPrice = calculateVelcroPrice(item.lengthFeet || 10)
        productName = `Adhesive Hook Velcro (${item.lengthFeet || 10}ft, ${item.color || 'black'})`
        break
      case 'webbing':
        unitPrice = calculateWebbingPrice(item.lengthFeet || 10)
        productName = `2" Webbing (${item.lengthFeet || 10}ft, ${item.color || 'black'})`
        break
      case 'snap_tape':
        unitPrice = calculateSnapTapePrice(item.lengthFeet || 5)
        productName = `Snap Tape (${item.lengthFeet || 5}ft, ${item.color || 'black'})`
        break
      case 'stucco_strip':
        unitPrice = calculateStuccoStripPrice(1, item.zippered || false)
        productName = `Stucco Strip (${item.zippered ? 'Zippered' : 'Standard'})`
        break
      case 'tieup_strap':
        unitPrice = 2.00
        productName = 'Tie-Up Strap'
        break
      case 'fastwax_cleaner':
        unitPrice = 15.00
        productName = 'Fastwax Cleaner'
        break
      default:
        unitPrice = 0
        productName = 'Unknown Accessory'
    }

    const lineTotal = round(unitPrice * item.quantity)

    return {
      productSku: item.accessoryType,
      productName,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      breakdown: this.emptyBreakdown(unitPrice, item.quantity, lineTotal),
      options: {
        ...(item.color && { color: item.color }),
        ...(item.lengthFeet && { length: String(item.lengthFeet) }),
        ...(item.zippered !== undefined && { type: item.zippered ? 'zippered' : 'standard' }),
      },
    }
  }

  // ==========================================================================
  // TOOL CALCULATIONS
  // ==========================================================================

  private calculateTool(item: ToolCartItem): LineItemPrice {
    const unitPrice = getSnapToolPrice()
    const lineTotal = round(unitPrice * item.quantity)

    return {
      productSku: 'industrial_snap_tool',
      productName: 'Industrial Snap Tool (Fully Refundable)',
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      breakdown: this.emptyBreakdown(unitPrice, item.quantity, lineTotal),
      options: {},
    }
  }

  // ==========================================================================
  // RAW MATERIAL CALCULATIONS
  // ==========================================================================

  private calculateRawMaterial(item: RawMaterialCartItem): LineItemPrice {
    const unitPrice = calculateRawMeshPrice(item.config)
    const lineTotal = round(unitPrice * item.quantity)

    return {
      productSku: 'raw_mesh',
      productName: `Raw ${item.config.materialType.replace('_', ' ')} (${item.config.rollWidth}" × ${item.config.lengthFeet}ft)`,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      breakdown: this.emptyBreakdown(unitPrice, item.quantity, lineTotal),
      options: {
        material_type: item.config.materialType,
        roll_width: String(item.config.rollWidth),
        color: item.config.color,
        length: String(item.config.lengthFeet),
      },
    }
  }

  // ==========================================================================
  // ADJUSTMENT CALCULATIONS
  // ==========================================================================

  private calculateAdjustment(item: AdjustmentCartItem): LineItemPrice {
    return {
      productSku: 'price_adjustment',
      productName: `Price Adjustment: ${item.reason}`,
      unitPrice: item.amount,
      quantity: 1,
      lineTotal: item.amount,
      breakdown: this.emptyBreakdown(item.amount, 1, item.amount),
      options: {
        adjustment_type: item.adjustmentType,
        reason: item.reason,
        ...(item.relatedItemId && { related_item: item.relatedItemId }),
      },
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private emptyBreakdown(unitPrice: number, quantity: number, total: number) {
    return {
      basePrice: unitPrice,
      meshTypeMultiplier: 1,
      topAttachmentAdder: 0,
      bottomOptionAdder: 0,
      doorAdder: 0,
      zipperAdder: 0,
      notchAdder: 0,
      squareFeet: 0,
      quantity,
      subtotal: total,
      total,
      minimumApplied: false,
      formula: `$${unitPrice} × ${quantity} = $${total}`,
    }
  }

  private getAttachmentPrice(type: string): number {
    const prices: Record<string, number> = {
      chrome_snap: 0.50,
      panel_snap: 1.67,
      ring_magnet: 1.50,
      fiberglass_clip: 2.00,
      tether_clip: 10.00,
      belted_rib: 15.00,
      screw_stud: 0.15,
      l_screw: 0.25,
      rubber_washer: 0.20,
      rod_clip: 2.00,
    }
    return prices[type] || 0
  }

  private getAttachmentName(type: string): string {
    const names: Record<string, string> = {
      chrome_snap: 'Chrome Snaps',
      panel_snap: 'Panel-to-Panel Snaps',
      ring_magnet: 'Ring Magnets',
      fiberglass_clip: 'Fiberglass Rod Clips',
      tether_clip: 'Tether Clips',
      belted_rib: 'Belted Ribs',
      screw_stud: 'Screw Studs',
      l_screw: 'L Screws',
      rubber_washer: 'Rubber Washers',
      rod_clip: 'Rod Clips',
    }
    return names[type] || type
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const priceCalculator = new PriceCalculator()
