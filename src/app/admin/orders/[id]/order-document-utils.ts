/**
 * Shared helpers for Invoice and Packing List documents.
 *
 * Provides formatting, classification, and grouping utilities so both
 * documents render order line-items in a production-friendly layout that
 * matches the legacy WooCommerce packing-slip / invoice flow.
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

export interface LineItemOption {
  id: string
  option_name: string
  option_value: string
  option_display: string | null
  price_impact: number
}

export interface LineItem {
  id: string
  product_sku: string
  product_name: string
  quantity: number
  width_inches: number | null
  height_inches: number | null
  length_feet: number | null
  unit_price: number
  line_total: number
  adjustment_type: string | null
  adjustment_reason: string | null
  panel_specs: Record<string, unknown> | null
  original_bundle_name: string | null
  line_item_options: LineItemOption[]
}

export interface Order {
  id: string
  order_number: string
  email: string
  status: string
  payment_method: string | null
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  salesperson_name: string | null
  salesperson_id: string | null
  created_at: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_address_2: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  billing_country: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_phone: string | null
  shipping_address_1: string | null
  shipping_address_2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  internal_note: string | null
  customer_note: string | null
}

export interface Salesperson {
  name: string
  email: string
  phone?: string | null
}

// =============================================================================
// ITEM CATEGORIES
// =============================================================================

export type ItemCategory =
  | 'mesh_panel'
  | 'vinyl_panel'
  | 'rollup'
  | 'raw_netting'
  | 'track'
  | 'attachment'
  | 'tool'
  | 'adjustment'
  | 'stucco'
  | 'accessory'
  | 'other'

export function classifyItem(item: LineItem): ItemCategory {
  const sku = (item.product_sku || '').toLowerCase()

  if (sku === 'mesh_panel') return 'mesh_panel'
  if (sku === 'vinyl_panel') return 'vinyl_panel'
  if (sku === 'rollup_shade_screen') return 'rollup'
  if (sku === 'raw_netting_panel') return 'raw_netting'
  if (sku === 'snap_tool') return 'tool'
  if (sku.startsWith('adjustment')) return 'adjustment'
  if (sku.includes('stucco')) return 'stucco'
  if (sku.includes('track') || sku.includes('splice') || sku.includes('endcap') || sku.includes('end_cap') || sku.includes('carrier')) return 'track'
  if (sku.includes('velcro') || sku.includes('webbing') || sku.includes('snap_tape') || sku.includes('tieup') || sku.includes('fastwax')) return 'accessory'

  // Fallback checks from panel_specs
  const specs = item.panel_specs as Record<string, unknown> | null
  if (specs?.meshType || specs?.mesh_type) return 'mesh_panel'
  if (specs?.canvasColor || specs?.canvas_color || specs?.panelSize || specs?.panel_size) return 'vinyl_panel'
  if (specs?.ply) return 'rollup'
  if (specs?.purchase_type) return 'raw_netting'

  return 'attachment' // default hardware-like items
}

// =============================================================================
// SPEC ACCESSORS  (handles both camelCase and snake_case keys)
// =============================================================================

function spec(specs: Record<string, unknown> | null, ...keys: string[]): unknown {
  if (!specs) return undefined
  for (const k of keys) {
    if (specs[k] !== undefined && specs[k] !== null && specs[k] !== '') return specs[k]
  }
  return undefined
}

export function getMeshType(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'meshType', 'mesh_type') as string | undefined
}
export function getMeshColor(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'color', 'meshColor', 'mesh_color') as string | undefined
}
export function getCanvasColor(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'canvasColor', 'canvas_color') as string | undefined
}
export function getTopAttachment(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'topAttachment', 'top_attachment') as string | undefined
}
export function getPanelSize(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'panelSize', 'panel_size') as string | undefined
}
export function getVelcroColor(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'velcroColor', 'velcro_color') as string | undefined
}
export function getWidthFeet(specs: Record<string, unknown> | null): number {
  return Number(spec(specs, 'widthFeet', 'width_feet') ?? 0)
}
export function getWidthInches(specs: Record<string, unknown> | null): number {
  return Number(spec(specs, 'widthInches', 'width_inches') ?? 0)
}
export function getHeightInches(specs: Record<string, unknown> | null): number {
  return Number(spec(specs, 'heightInches', 'height_inches', 'height') ?? 0)
}
export function getTrackColor(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'color') as string | undefined
}
export function getTrackWeight(specs: Record<string, unknown> | null): string | undefined {
  return spec(specs, 'weight') as string | undefined
}
export function getOptionQty(specs: Record<string, unknown> | null): number | undefined {
  const v = spec(specs, 'quantity')
  return v !== undefined ? Number(v) : undefined
}

// =============================================================================
// FORMAT HELPERS
// =============================================================================

const MESH_TYPE_LABELS: Record<string, string> = {
  heavy_mosquito: 'Heavy Mosquito',
  no_see_um: 'No See Um',
  shade: 'Shade',
  scrim: 'Scrim',
  theater_scrim: 'Theater Scrim',
  theatre_scrim: 'Theater Scrim',
  industrial: 'Industrial',
}

const TOP_ATTACHMENT_LABELS: Record<string, string> = {
  standard_track: 'Standard Track (<10 Tall Panels)',
  heavy_track: 'Heavy Track (10+ Tall Panels)',
  tracking_under_10: 'Standard Track (<10 Tall Panels)',
  tracking_over_10: 'Heavy Track (10+ Tall Panels)',
  velcro: 'Velcro',
  binding_only: 'Binding Only',
  special_rigging: 'Special Rigging',
  grommets: 'Grommets',
}

const COLOR_LABELS: Record<string, string> = {
  black: 'Black',
  white: 'White',
  ivory: 'Ivory',
  silver: 'Silver',
  olive_green: 'Olive Green',
  brown: 'Brown',
  ashen_gray: 'Ashen Gray',
  burgundy: 'Burgundy',
  cocoa_brown: 'Cocoa Brown',
  clear_top_to_bottom: 'Clear Top to Bottom',
  forest_green: 'Forest Green',
  moss_green: 'Moss Green',
  navy_blue: 'Navy Blue',
  royal_blue: 'Royal Blue',
  sandy_tan: 'Sandy Tan',
  tbd: 'TBD',
}

const PANEL_SIZE_LABELS: Record<string, string> = {
  short: 'Short',
  medium: 'Medium',
  tall: 'Tall',
}

export function formatMeshType(val: string | undefined): string {
  if (!val) return 'N/A'
  return MESH_TYPE_LABELS[val] || titleCase(val)
}

export function formatTopAttachment(val: string | undefined): string {
  if (!val) return 'N/A'
  return TOP_ATTACHMENT_LABELS[val] || titleCase(val)
}

export function formatColor(val: string | undefined): string {
  if (!val) return 'N/A'
  return COLOR_LABELS[val] || titleCase(val)
}

export function formatPanelSize(val: string | undefined): string {
  if (!val) return 'N/A'
  return PANEL_SIZE_LABELS[val] || titleCase(val)
}

export function formatMoney(val: number | null | undefined): string {
  if (val == null) return '$0.00'
  return `$${Math.abs(Number(val)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatSignedMoney(val: number | null | undefined): string {
  if (val == null) return '$0.00'
  const n = Number(val)
  const prefix = n < 0 ? '-' : ''
  return `${prefix}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function titleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// GROUPING
// =============================================================================

export interface PanelGroup {
  type: 'mesh' | 'vinyl' | 'rollup'
  label: string
  meshType?: string
  color?: string
  topAttachment?: string
  panelSize?: string
  velcroColor?: string
  panels: Array<{
    index: number
    widthFeet: number
    widthInches: number
    heightInches: number
    price: number
    item: LineItem
  }>
  totalPrice: number
}

export interface TrackGroup {
  color: string
  weight: string
  label: string
  items: Array<{
    name: string
    qty: number
    price: number
    item: LineItem
  }>
  totalPrice: number
}

export interface HardwareDetail {
  name: string
  qty: number
  price: number
  item: LineItem
}

export interface GroupedItems {
  panelGroups: PanelGroup[]
  trackGroups: TrackGroup[]
  attachmentItems: HardwareDetail[]
  attachmentTotal: number
  accessoryItems: HardwareDetail[]
  accessoryTotal: number
  stuccoItems: HardwareDetail[]
  stuccoTotal: number
  rawNettingItems: LineItem[]
  tools: LineItem[]
  adjustments: LineItem[]
  other: LineItem[]
  hasMixedMaterials: boolean
}

export function groupLineItems(lineItems: LineItem[]): GroupedItems {
  const meshPanels: LineItem[] = []
  const vinylPanels: LineItem[] = []
  const rollupPanels: LineItem[] = []
  const trackItems: LineItem[] = []
  const attachments: LineItem[] = []
  const accessories: LineItem[] = []
  const stuccoItems: LineItem[] = []
  const rawNettingItems: LineItem[] = []
  const tools: LineItem[] = []
  const adjustments: LineItem[] = []
  const other: LineItem[] = []

  for (const item of lineItems) {
    const cat = classifyItem(item)
    switch (cat) {
      case 'mesh_panel': meshPanels.push(item); break
      case 'vinyl_panel': vinylPanels.push(item); break
      case 'rollup': rollupPanels.push(item); break
      case 'track': trackItems.push(item); break
      case 'attachment': attachments.push(item); break
      case 'accessory': accessories.push(item); break
      case 'stucco': stuccoItems.push(item); break
      case 'raw_netting': rawNettingItems.push(item); break
      case 'tool': tools.push(item); break
      case 'adjustment': adjustments.push(item); break
      default: other.push(item)
    }
  }

  // --- Group mesh panels by shared config ---
  const meshGroups = buildPanelGroups(meshPanels, 'mesh')

  // --- Group vinyl panels by shared config ---
  const vinylGroups = buildPanelGroups(vinylPanels, 'vinyl')

  // --- Group rollup panels ---
  const rollupGroups = buildPanelGroups(rollupPanels, 'rollup')

  const panelGroups = [...meshGroups, ...vinylGroups, ...rollupGroups]

  // --- Group track by color+weight ---
  const trackGroupMap = new Map<string, TrackGroup>()
  for (const item of trackItems) {
    const specs = item.panel_specs
    const color = getTrackColor(specs) || 'default'
    const weight = getTrackWeight(specs) || 'standard'
    const key = `${color}-${weight}`
    if (!trackGroupMap.has(key)) {
      trackGroupMap.set(key, {
        color,
        weight,
        label: `${formatColor(color)} ${weight === 'heavy' ? 'Heavy' : 'Standard'} Track`,
        items: [],
        totalPrice: 0,
      })
    }
    const group = trackGroupMap.get(key)!
    group.items.push({
      name: item.product_name,
      qty: item.quantity,
      price: Number(item.line_total),
      item,
    })
    group.totalPrice += Number(item.line_total)
  }
  const trackGroups = Array.from(trackGroupMap.values())

  // --- Attachment hardware details ---
  const attachmentDetails: HardwareDetail[] = attachments.map((item) => {
    const specs = item.panel_specs
    const optQty = getOptionQty(specs)
    return {
      name: item.product_name,
      qty: optQty ?? item.quantity,
      price: Number(item.line_total),
      item,
    }
  })
  const attachmentTotal = attachmentDetails.reduce((sum, a) => sum + a.price, 0)

  // --- Accessory details ---
  const accessoryDetails: HardwareDetail[] = accessories.map((item) => {
    const specs = item.panel_specs
    const optQty = getOptionQty(specs)
    return {
      name: item.product_name,
      qty: optQty ?? item.quantity,
      price: Number(item.line_total),
      item,
    }
  })
  const accessoryTotal = accessoryDetails.reduce((sum, a) => sum + a.price, 0)

  // --- Stucco details ---
  const stuccoDetails: HardwareDetail[] = stuccoItems.map((item) => ({
    name: item.product_name,
    qty: item.quantity,
    price: Number(item.line_total),
    item,
  }))
  const stuccoTotal = stuccoDetails.reduce((sum, s) => sum + s.price, 0)

  // --- Detect mixed materials ---
  const meshTypes = new Set<string>()
  for (const item of [...meshPanels, ...vinylPanels]) {
    const cat = classifyItem(item)
    if (cat === 'mesh_panel') {
      const mt = getMeshType(item.panel_specs)
      if (mt) meshTypes.add(mt)
    }
    if (cat === 'vinyl_panel') meshTypes.add('clear_vinyl')
  }
  const hasMixedMaterials = meshTypes.size > 1 || (meshPanels.length > 0 && vinylPanels.length > 0)

  return {
    panelGroups,
    trackGroups,
    attachmentItems: attachmentDetails,
    attachmentTotal,
    accessoryItems: accessoryDetails,
    accessoryTotal,
    stuccoItems: stuccoDetails,
    stuccoTotal,
    rawNettingItems,
    tools,
    adjustments,
    other,
    hasMixedMaterials,
  }
}

// =============================================================================
// PANEL GROUPING HELPER
// =============================================================================

function buildPanelGroups(panels: LineItem[], panelType: 'mesh' | 'vinyl' | 'rollup'): PanelGroup[] {
  if (panels.length === 0) return []

  const groupMap = new Map<string, PanelGroup>()

  for (const item of panels) {
    const specs = item.panel_specs
    let key: string
    let label: string
    let meshType: string | undefined
    let color: string | undefined
    let topAttachment: string | undefined
    let panelSize: string | undefined
    let velcroColor: string | undefined

    if (panelType === 'mesh') {
      meshType = getMeshType(specs)
      color = getMeshColor(specs)
      topAttachment = getTopAttachment(specs)
      velcroColor = getVelcroColor(specs)
      key = `${meshType}-${color}-${topAttachment}`
      label = 'Mesh Panels'
    } else if (panelType === 'vinyl') {
      panelSize = getPanelSize(specs)
      color = getCanvasColor(specs)
      topAttachment = getTopAttachment(specs)
      velcroColor = getVelcroColor(specs)
      key = `${panelSize}-${color}-${topAttachment}`
      label = 'Clear Vinyl Panels'
    } else {
      // rollup
      color = getMeshColor(specs)
      const ply = spec(specs, 'ply') as string | undefined
      key = `${color}-${ply}`
      label = 'Roll-Up Shade Panels'
    }

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        type: panelType,
        label,
        meshType,
        color,
        topAttachment,
        panelSize,
        velcroColor,
        panels: [],
        totalPrice: 0,
      })
    }

    const group = groupMap.get(key)!
    group.panels.push({
      index: group.panels.length + 1,
      widthFeet: getWidthFeet(specs),
      widthInches: getWidthInches(specs),
      heightInches: getHeightInches(specs),
      price: Number(item.line_total),
      item,
    })
    group.totalPrice += Number(item.line_total)
  }

  return Array.from(groupMap.values())
}

// =============================================================================
// SUMMARY ROWS — collapsed view for the bottom table
// =============================================================================

export interface SummaryRow {
  label: string
  qty: number
  price: number
}

export function buildSummaryRows(grouped: GroupedItems): SummaryRow[] {
  const rows: SummaryRow[] = []

  for (const pg of grouped.panelGroups) {
    rows.push({
      label: `${pg.label} Set`,
      qty: 1,
      price: pg.totalPrice,
    })
  }

  if (grouped.trackGroups.length > 0) {
    const trackTotal = grouped.trackGroups.reduce((s, g) => s + g.totalPrice, 0)
    rows.push({ label: 'Track Hardware', qty: 1, price: trackTotal })
  }

  if (grouped.attachmentItems.length > 0) {
    rows.push({ label: 'Attachment Items', qty: 1, price: grouped.attachmentTotal })
  }

  if (grouped.accessoryItems.length > 0) {
    rows.push({ label: 'Accessories', qty: 1, price: grouped.accessoryTotal })
  }

  if (grouped.stuccoItems.length > 0) {
    rows.push({ label: 'Stucco Strips', qty: 1, price: grouped.stuccoTotal })
  }

  for (const item of grouped.rawNettingItems) {
    rows.push({ label: item.product_name, qty: item.quantity, price: Number(item.line_total) })
  }

  for (const item of grouped.tools) {
    rows.push({ label: item.product_name, qty: item.quantity, price: Number(item.line_total) })
  }

  for (const item of grouped.adjustments) {
    rows.push({ label: item.product_name, qty: item.quantity, price: Number(item.line_total) })
  }

  for (const item of grouped.other) {
    rows.push({ label: item.product_name, qty: item.quantity, price: Number(item.line_total) })
  }

  return rows
}

// =============================================================================
// RAW NETTING DISPLAY HELPERS
// =============================================================================

export function getRawNettingDetails(item: LineItem) {
  const specs = item.panel_specs
  const meshType = (spec(specs, 'mesh_type', 'meshType') as string) || undefined
  const color = (spec(specs, 'color') as string) || undefined
  const purchaseType = (spec(specs, 'purchase_type') as string) || undefined
  const lengthFeet = spec(specs, 'lengthFeet', 'length_feet') as number | undefined

  // Roll width can be stored under different keys based on mesh type
  let rollWidth: string | undefined
  if (specs) {
    for (const k of Object.keys(specs)) {
      if (k.startsWith('roll_width')) {
        rollWidth = String(specs[k])
        break
      }
    }
  }

  return { meshType, color, purchaseType, lengthFeet, rollWidth }
}

// =============================================================================
// ROLLUP DISPLAY HELPERS
// =============================================================================

export function getRollupDetails(specs: Record<string, unknown> | null) {
  const ply = spec(specs, 'ply') as string | undefined
  const widthInches = Number(spec(specs, 'widthInches', 'width_inches') ?? 0)
  const heightInches = Number(spec(specs, 'heightInches', 'height_inches') ?? 0)
  return { ply, widthInches, heightInches }
}

// =============================================================================
// ADJUSTMENT DISPLAY HELPERS
// =============================================================================

export function getAdjustmentDetails(item: LineItem) {
  const specs = item.panel_specs
  const adjustmentType = (spec(specs, 'adjustment_type', 'amount') as string) || item.adjustment_type || ''
  const reason = item.adjustment_reason || item.product_name || ''
  const amount = Number(item.line_total)
  const isNegative = amount < 0
  return { adjustmentType, reason, amount, isNegative }
}
