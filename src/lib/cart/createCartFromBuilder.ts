/**
 * createCartFromBuilder — Server-side helper
 *
 * Transforms DIY builder cart_data into a real `carts` row with priced
 * `line_items`, matching the exact same shape that admin/sales produces.
 *
 * Uses PriceCalculator + DB-driven PricingMap for real per-panel pricing.
 *
 * Called from POST /api/projects after project creation. Non-fatal — if
 * cart creation fails, the project + lead still succeed.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { PriceCalculator } from '@/lib/pricing/calculator'
import type {
  CartItem,
  MeshPanelCartItem,
  VinylPanelCartItem,
  RawMaterialCartItem,
} from '@/lib/pricing/calculator'
import { calculateRawMeshPrice, round } from '@/lib/pricing/formulas'
import type {
  PricingMap,
  MeshType,
  MeshColor,
  VinylPanelSize,
  MeshTopAttachment,
  VinylTopAttachment,
  CanvasColor,
} from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

interface CreateCartParams {
  supabase: SupabaseClient
  projectId: string
  product: string
  cartData: unknown[]
  leadId: string | null
  sessionId?: string
  visitorId?: string
  email?: string
}

interface CreateCartResult {
  cartId: string
  cartTotal: number
  itemCount: number
}

/** Shape of a single side from the MC / CV builders' buildCartData() */
interface BuilderSide {
  side: number
  totalWidth: number
  leftHeight: number
  rightHeight: number
  layout: string
  topAttachment: string
  leftEdge: string
  rightEdge: string
  // MC-specific
  meshType?: string
  meshColor?: string
  // CV-specific
  product?: string
  canvasColor?: string
  panelSize?: string
  velcroColor?: string
  panels: BuilderPanel[]
}

interface BuilderPanel {
  rawWidth: number
  rawHeight: number
  finalWidth: number
  finalHeight: number
  topAttachment: string
  side1: string
  side2: string
  // CV-specific
  vinylHeight?: number
  canvasHeight?: number
}

/** Shape of a single panel from the raw netting builder's buildCartData() */
interface RawNettingPanel {
  panelIndex: number
  meshType: string
  meshColor: string
  rollWidth: number
  widthInches: number
  topEdge: string
  rightEdge: string
  bottomEdge: string
  leftEdge: string
  allSidesSame: boolean
  pricing?: {
    meshCost: number
    perFootRate: number
    topCost: number | null
    bottomCost: number | null
    leftCost: number | null
    rightCost: number | null
    edgeTotal: number | null
    panelTotal: number | null
    needsQuote: boolean
  }
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PRODUCT_TO_SALES_MODE: Record<string, string> = {
  mosquito_curtains: 'mc',
  clear_vinyl: 'cv',
  raw_materials: 'rn',
}

/** Edge finish price per foot — matches RawNettingPanelBuilder EDGE_OPTIONS */
const EDGE_PRICE_PER_FT: Record<string, number | null> = {
  none: 0,
  binding_1in: 1.00,
  binding_1in_grommets_6: 1.00,
  binding_1in_grommets_12: 1.00,
  binding_1in_grommets_18: 1.00,
  binding_1in_grommets_24: 1.00,
  binding_1in_velcro: 1.50,
  binding_1in_velcro_grommets_6: 1.50,
  binding_1in_velcro_grommets_12: 1.50,
  binding_1in_velcro_grommets_18: 1.50,
  binding_1in_velcro_grommets_24: 1.50,
  // Webbing options — null means "needs quote"
  webbing_3in_6: null,
  webbing_3in_12: null,
  webbing_3in_18: null,
  webbing_3in_24: null,
  webbing_4in_6: null,
  webbing_4in_12: null,
  webbing_6in_6: null,
  webbing_6in_12: null,
}

function getSizeTier(heightInches: number): VinylPanelSize {
  if (heightInches < 48) return 'short'
  if (heightInches <= 96) return 'medium'
  return 'tall'
}

// =============================================================================
// PRICING MAP (admin-client version — no cookie dependency)
// =============================================================================

async function buildPricingMap(supabase: SupabaseClient): Promise<PricingMap> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('sku, base_price')

  if (productsError || !products || products.length === 0) {
    throw new Error(
      `[createCartFromBuilder] Cannot build pricing map: ${productsError?.message || 'products table empty'}`
    )
  }

  const { data: options, error: optionsError } = await supabase
    .from('product_options')
    .select('pricing_key, price, fee, option_value')

  if (optionsError) {
    throw new Error(`[createCartFromBuilder] Options query error: ${optionsError.message}`)
  }

  const prices: PricingMap = {}

  // Product SKUs -> base_price
  for (const product of products) {
    prices[product.sku] = Number(product.base_price)
  }

  // Options with pricing_key -> price
  if (options) {
    for (const option of options) {
      if (option.pricing_key) {
        prices[option.pricing_key] = Number(option.price)
      }
    }
  }

  // Formula compatibility: mesh_panel_fee
  if (prices['mesh_panel'] !== undefined) {
    prices['mesh_panel_fee'] = prices['mesh_panel']
  }

  // Formula compatibility: vinyl panel fees
  if (options) {
    for (const option of options) {
      if (option.pricing_key?.startsWith('vinyl_') && option.fee && Number(option.fee) > 0) {
        prices[`vinyl_panel_fee_${option.option_value}`] = Number(option.fee)
      }
    }
  }

  // Legacy track key mappings
  const trackLegacyMap: Record<string, string> = {
    track_standard_straight: 'track_std_7ft',
    track_heavy_straight: 'track_heavy_7ft',
    track_standard_curve_90: 'track_curve_90',
    track_heavy_curve_90: 'track_heavy_curve_90',
    track_standard_curve_135: 'track_curve_135',
    track_heavy_curve_135: 'track_heavy_curve_135',
    track_standard_splice: 'track_splice',
    track_heavy_splice: 'track_heavy_splice',
    track_standard_endcap: 'track_endcap',
    track_heavy_endcap: 'track_heavy_endcap',
    track_standard_carrier: 'track_carrier',
    track_heavy_carrier: 'track_heavy_carrier',
  }
  for (const [newSku, oldKey] of Object.entries(trackLegacyMap)) {
    if (prices[newSku] !== undefined) {
      prices[oldKey] = prices[newSku]
    }
  }

  // Legacy attachment/accessory keys
  const legacyKeys: Record<string, string> = {
    marine_snap_black: 'marine_snap',
    adhesive_snap_black: 'adhesive_snap_bw',
    elastic_cord_black: 'elastic_cord',
    velcro_black: 'adhesive_velcro',
    webbing_black: 'webbing',
    snap_tape_black: 'snap_tape',
  }
  for (const [newSku, oldKey] of Object.entries(legacyKeys)) {
    if (prices[newSku] !== undefined && prices[oldKey] === undefined) {
      prices[oldKey] = prices[newSku]
    }
  }

  return prices
}

// =============================================================================
// TRANSFORM: Mosquito Curtains
// =============================================================================

function transformMosquitoCurtains(cartData: unknown[]): CartItem[] {
  const sides = cartData as BuilderSide[]
  const items: CartItem[] = []
  let panelCount = 0

  for (const side of sides) {
    if (!side.panels || side.panels.length === 0) continue

    for (const panel of side.panels) {
      if (!panel.finalWidth || !panel.finalHeight) continue
      panelCount++

      const item: MeshPanelCartItem = {
        id: `mc_panel_${panelCount}`,
        type: 'mesh_panel',
        productSku: 'mesh_panel',
        config: {
          widthFeet: Math.floor(panel.finalWidth / 12),
          widthInches: panel.finalWidth % 12,
          heightInches: panel.finalHeight,
          meshType: (side.meshType || 'heavy_mosquito') as MeshType,
          meshColor: (side.meshColor || 'black') as MeshColor,
          topAttachment: (side.topAttachment || 'velcro') as MeshTopAttachment,
        },
        quantity: 1,
      }

      items.push(item)
    }
  }

  return items
}

/** Build panel_specs for a mosquito curtain panel (matches admin/sales shape) */
function buildMeshPanelSpecs(
  side: BuilderSide,
  panel: BuilderPanel,
  panelIndex: number
): Record<string, string | number | boolean> {
  return {
    widthFeet: Math.floor(panel.finalWidth / 12),
    widthInches: panel.finalWidth % 12,
    heightInches: panel.finalHeight,
    meshType: side.meshType || 'heavy_mosquito',
    color: side.meshColor || 'black',
    topAttachment: side.topAttachment || 'velcro',
    side: side.side,
    panelIndex,
    rawWidth: panel.rawWidth,
    rawHeight: panel.rawHeight,
    side1: panel.side1,
    side2: panel.side2,
  }
}

// =============================================================================
// TRANSFORM: Clear Vinyl
// =============================================================================

function transformClearVinyl(cartData: unknown[]): CartItem[] {
  const sides = cartData as BuilderSide[]
  const items: CartItem[] = []
  let panelCount = 0

  for (const side of sides) {
    if (!side.panels || side.panels.length === 0) continue

    // panelSize can come from the side data or be derived from height
    const sidePanelSize = side.panelSize as VinylPanelSize | undefined

    for (const panel of side.panels) {
      if (!panel.finalWidth || !panel.finalHeight) continue
      panelCount++

      const panelSize = sidePanelSize || getSizeTier(panel.finalHeight)

      const item: VinylPanelCartItem = {
        id: `cv_panel_${panelCount}`,
        type: 'vinyl_panel',
        productSku: 'vinyl_panel',
        config: {
          widthFeet: Math.floor(panel.finalWidth / 12),
          widthInches: panel.finalWidth % 12,
          heightInches: panel.finalHeight,
          panelSize,
          topAttachment: (side.topAttachment || 'velcro') as VinylTopAttachment,
          canvasColor: (side.canvasColor || 'tbd') as CanvasColor,
        },
        quantity: 1,
      }

      items.push(item)
    }
  }

  return items
}

/** Build panel_specs for a clear vinyl panel (matches admin/sales shape) */
function buildVinylPanelSpecs(
  side: BuilderSide,
  panel: BuilderPanel,
  panelIndex: number,
  panelSize: VinylPanelSize
): Record<string, string | number | boolean> {
  return {
    widthFeet: Math.floor(panel.finalWidth / 12),
    widthInches: panel.finalWidth % 12,
    heightInches: panel.finalHeight,
    panelSize,
    canvasColor: side.canvasColor || 'tbd',
    topAttachment: side.topAttachment || 'velcro',
    velcroColor: side.velcroColor || 'black',
    side: side.side,
    panelIndex,
    rawWidth: panel.rawWidth,
    rawHeight: panel.rawHeight,
    vinylHeight: panel.vinylHeight || 0,
    canvasHeight: panel.canvasHeight || 0,
  }
}

// =============================================================================
// TRANSFORM: Raw Netting
// =============================================================================

/**
 * Calculate raw netting edge cost (same logic as RawNettingPanelBuilder).
 * Returns null if the edge option requires a manual quote (webbing).
 */
function calcEdgeCost(edgeId: string, lengthInches: number): number | null {
  const pricePerFt = EDGE_PRICE_PER_FT[edgeId]
  if (pricePerFt === undefined || pricePerFt === null) return null
  return round(pricePerFt * (lengthInches / 12))
}

interface RawNettingTransformResult {
  /** CartItems for PriceCalculator (mesh cost only) */
  items: CartItem[]
  /** Full per-panel totals (mesh + edges), null if any edge needs quote */
  fullPrices: (number | null)[]
  /** Raw panels for building panel_specs */
  panels: RawNettingPanel[]
}

function transformRawNetting(
  cartData: unknown[],
  prices: PricingMap
): RawNettingTransformResult {
  const panels = cartData as RawNettingPanel[]
  const items: CartItem[] = []
  const fullPrices: (number | null)[] = []

  for (let i = 0; i < panels.length; i++) {
    const p = panels[i]
    if (!p.widthInches || !p.rollWidth) continue

    // CartItem for PriceCalculator (mesh cost only)
    const item: RawMaterialCartItem = {
      id: `rn_panel_${i + 1}`,
      type: 'raw_material',
      productSku: 'raw_netting_panel',
      config: {
        materialType: (p.meshType || 'heavy_mosquito') as MeshType,
        rollWidth: p.rollWidth as 65 | 101 | 120 | 123 | 138 | 140,
        color: (p.meshColor || 'black') as MeshColor,
        lengthFeet: p.widthInches / 12,
      },
      quantity: 1,
    }
    items.push(item)

    // Compute full price: mesh + edges
    const meshCost = calculateRawMeshPrice(item.config, prices)
    const topCost = calcEdgeCost(p.topEdge, p.widthInches)
    const bottomCost = calcEdgeCost(p.bottomEdge, p.widthInches)
    const leftCost = calcEdgeCost(p.leftEdge, p.rollWidth)
    const rightCost = calcEdgeCost(p.rightEdge, p.rollWidth)

    const allEdgesKnown =
      topCost !== null && bottomCost !== null && leftCost !== null && rightCost !== null

    if (allEdgesKnown && meshCost > 0) {
      fullPrices.push(round(meshCost + topCost! + bottomCost! + leftCost! + rightCost!))
    } else {
      fullPrices.push(null) // needs manual quote
    }
  }

  return { items, fullPrices, panels }
}

/** Build panel_specs for a raw netting panel (matches admin/sales + builder shape) */
function buildRawNettingPanelSpecs(
  panel: RawNettingPanel
): Record<string, string | number | boolean> {
  return {
    mesh_type: panel.meshType,
    [`roll_width_${panel.meshType}`]: String(panel.rollWidth),
    color: panel.meshColor,
    purchase_type: 'by_foot',
    widthInches: panel.widthInches,
    topEdge: panel.topEdge,
    rightEdge: panel.rightEdge,
    bottomEdge: panel.bottomEdge,
    leftEdge: panel.leftEdge,
    allSidesSame: panel.allSidesSame,
    needsQuote: panel.pricing?.needsQuote ?? false,
  }
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export async function createCartFromBuilder(
  params: CreateCartParams
): Promise<CreateCartResult | null> {
  const { supabase, projectId, product, cartData, leadId, sessionId, visitorId, email } = params

  if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
    console.log('[createCartFromBuilder] No cart_data to process, skipping cart creation')
    return null
  }

  try {
    // -------------------------------------------------------------------------
    // 1. Build pricing map from DB
    // -------------------------------------------------------------------------
    const prices = await buildPricingMap(supabase)
    const calculator = new PriceCalculator(prices)

    // -------------------------------------------------------------------------
    // 2. Transform builder cart_data into CartItem[] based on product type
    // -------------------------------------------------------------------------
    let cartItems: CartItem[] = []
    let rawNettingResult: RawNettingTransformResult | null = null

    switch (product) {
      case 'mosquito_curtains':
        cartItems = transformMosquitoCurtains(cartData)
        break
      case 'clear_vinyl':
        cartItems = transformClearVinyl(cartData)
        break
      case 'raw_materials':
        rawNettingResult = transformRawNetting(cartData, prices)
        cartItems = rawNettingResult.items
        break
      default:
        console.warn(`[createCartFromBuilder] Unknown product type: ${product}`)
        return null
    }

    if (cartItems.length === 0) {
      console.log('[createCartFromBuilder] No valid panels found in cart_data')
      return null
    }

    // -------------------------------------------------------------------------
    // 3. Price items using PriceCalculator
    // -------------------------------------------------------------------------
    const pricedCart = calculator.calculateCart(cartItems)

    // For raw netting, override prices with full mesh+edge totals
    if (product === 'raw_materials' && rawNettingResult) {
      for (let i = 0; i < pricedCart.items.length; i++) {
        const fullPrice = rawNettingResult.fullPrices[i]
        if (fullPrice !== null) {
          pricedCart.items[i].unitPrice = fullPrice
          pricedCart.items[i].lineTotal = fullPrice
        } else {
          // Panel needs manual quote — keep mesh-only price as estimate
          // Mark in options so it's visible in admin
          pricedCart.items[i].options = {
            ...pricedCart.items[i].options,
            needs_quote: 'true',
          }
        }
      }
      // Recompute subtotal with overridden prices
      pricedCart.subtotal = round(
        pricedCart.items.reduce((sum, item) => sum + item.lineTotal, 0)
      )
      pricedCart.total = pricedCart.subtotal
    }

    // -------------------------------------------------------------------------
    // 4. Resolve product SKUs to UUIDs
    // -------------------------------------------------------------------------
    const skus = [...new Set(pricedCart.items.map((item) => item.productSku))]
    const { data: productRows } = await supabase
      .from('products')
      .select('id, sku')
      .in('sku', skus)

    const skuToId: Record<string, string> = {}
    for (const p of productRows || []) {
      skuToId[p.sku] = p.id
    }

    // -------------------------------------------------------------------------
    // 5. Create cart row
    //    Attribution fields (visitor_id, session_id) are optional — never block
    //    the cart creation if they're missing or invalid.
    // -------------------------------------------------------------------------
    const cartInsert: Record<string, unknown> = {
      project_id: projectId,
      email: email || null,
      sales_mode: PRODUCT_TO_SALES_MODE[product] || null,
      subtotal: 0,
      tax_amount: 0,
      shipping_amount: 0,
      total: 0,
      status: 'active',
      lead_id: leadId || null,
    }

    // Only include attribution FKs when we have valid values
    // These reference visitors/sessions tables and must exist if provided
    if (visitorId) cartInsert.visitor_id = visitorId
    if (sessionId) cartInsert.session_id = sessionId

    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .insert(cartInsert)
      .select('*')
      .single()

    if (cartError || !cart) {
      console.error('[createCartFromBuilder] Error creating cart:', cartError)
      return null
    }

    // -------------------------------------------------------------------------
    // 6. Build and insert line items
    // -------------------------------------------------------------------------
    const sides = cartData as BuilderSide[]
    const rawPanels = rawNettingResult?.panels || []

    const lineItemRows = pricedCart.items.map((priced, index) => {
      // Build panel_specs matching admin/sales format
      let panelSpecs: Record<string, unknown> = {}

      if (product === 'mosquito_curtains') {
        // Find the corresponding side and panel
        const { sideIdx, panelIdx } = findSidePanelIndex(sides, index)
        if (sideIdx >= 0 && panelIdx >= 0) {
          panelSpecs = buildMeshPanelSpecs(sides[sideIdx], sides[sideIdx].panels[panelIdx], panelIdx + 1)
        }
      } else if (product === 'clear_vinyl') {
        const { sideIdx, panelIdx } = findSidePanelIndex(sides, index)
        if (sideIdx >= 0 && panelIdx >= 0) {
          const side = sides[sideIdx]
          const panel = sides[sideIdx].panels[panelIdx]
          const panelSize = (side.panelSize as VinylPanelSize) || getSizeTier(panel.finalHeight)
          panelSpecs = buildVinylPanelSpecs(side, panel, panelIdx + 1, panelSize)
        }
      } else if (product === 'raw_materials' && rawPanels[index]) {
        panelSpecs = buildRawNettingPanelSpecs(rawPanels[index])
      }

      // Dimensions for the line_items table columns
      let widthInches: number | null = null
      let heightInches: number | null = null
      let lengthFeet: number | null = null

      if (product === 'raw_materials' && rawPanels[index]) {
        widthInches = rawPanels[index].widthInches
        heightInches = rawPanels[index].rollWidth
      } else {
        // MC and CV store finalWidth/finalHeight
        const { sideIdx, panelIdx } = findSidePanelIndex(sides, index)
        if (sideIdx >= 0 && panelIdx >= 0) {
          widthInches = sides[sideIdx].panels[panelIdx].finalWidth
          heightInches = sides[sideIdx].panels[panelIdx].finalHeight
        }
      }

      return {
        cart_id: cart.id,
        product_id: skuToId[priced.productSku] || null,
        product_sku: priced.productSku,
        product_name: priced.productName,
        quantity: priced.quantity,
        width_inches: widthInches,
        height_inches: heightInches,
        length_feet: lengthFeet,
        unit_price: priced.unitPrice,
        line_total: priced.lineTotal,
        panel_specs: panelSpecs,
      }
    })

    const { data: insertedItems, error: itemsError } = await supabase
      .from('line_items')
      .insert(lineItemRows)
      .select('id, line_total')

    if (itemsError) {
      console.error('[createCartFromBuilder] Error inserting line items:', itemsError)
      // Cart created but items failed — return partial result
      return { cartId: cart.id, cartTotal: 0, itemCount: 0 }
    }

    // -------------------------------------------------------------------------
    // 7. Insert line_item_options
    // -------------------------------------------------------------------------
    if (insertedItems && insertedItems.length > 0) {
      const allOptions: Array<{
        line_item_id: string
        option_name: string
        option_value: string
        option_display: string | null
        price_impact: number
      }> = []

      for (let i = 0; i < insertedItems.length; i++) {
        const priced = pricedCart.items[i]
        if (!priced.options) continue

        for (const [key, value] of Object.entries(priced.options)) {
          allOptions.push({
            line_item_id: insertedItems[i].id,
            option_name: key,
            option_value: String(value),
            option_display: null,
            price_impact: 0,
          })
        }
      }

      if (allOptions.length > 0) {
        const { error: optionsError } = await supabase
          .from('line_item_options')
          .insert(allOptions)

        if (optionsError) {
          console.error('[createCartFromBuilder] Error inserting line item options:', optionsError)
          // Non-fatal
        }
      }
    }

    // -------------------------------------------------------------------------
    // 8. Update cart totals
    // -------------------------------------------------------------------------
    const actualSubtotal = (insertedItems || []).reduce(
      (sum, row) => sum + (Number(row.line_total) || 0),
      0
    )
    const finalTotal = round(actualSubtotal)

    await supabase
      .from('carts')
      .update({
        subtotal: finalTotal,
        total: finalTotal,
      })
      .eq('id', cart.id)

    // Update project estimated_total
    await supabase
      .from('projects')
      .update({ estimated_total: finalTotal })
      .eq('id', projectId)

    // -------------------------------------------------------------------------
    // 9. Fire cart_created journey event (only if visitor_id exists —
    //    journey_events.visitor_id is NOT NULL, so we skip when missing.
    //    Attribution tracking should never block the lead/cart flow.)
    // -------------------------------------------------------------------------
    if (visitorId) {
      supabase
        .from('journey_events')
        .insert({
          visitor_id: visitorId,
          session_id: sessionId || null,
          lead_id: leadId || null,
          project_id: projectId,
          event_type: 'cart_created',
          event_data: {
            cart_id: cart.id,
            subtotal: finalTotal,
            total: finalTotal,
            item_count: insertedItems?.length || 0,
            source: 'diy_builder',
            product,
          },
        })
        .then(({ error: evtErr }) => {
          if (evtErr) console.error('[createCartFromBuilder] Journey event error:', evtErr)
        })
    }

    return {
      cartId: cart.id,
      cartTotal: finalTotal,
      itemCount: insertedItems?.length || 0,
    }
  } catch (err) {
    console.error('[createCartFromBuilder] Unexpected error:', err)
    return null
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Given a flat panel index (across all sides), find which side and which
 * panel within that side it corresponds to.
 */
function findSidePanelIndex(
  sides: BuilderSide[],
  flatIndex: number
): { sideIdx: number; panelIdx: number } {
  let running = 0
  for (let s = 0; s < sides.length; s++) {
    const panels = sides[s].panels || []
    // Only count panels with valid dimensions (matching transform logic)
    const validPanels = panels.filter((p) => p.finalWidth && p.finalHeight)
    if (flatIndex < running + validPanels.length) {
      return { sideIdx: s, panelIdx: flatIndex - running }
    }
    running += validPanels.length
  }
  return { sideIdx: -1, panelIdx: -1 }
}
