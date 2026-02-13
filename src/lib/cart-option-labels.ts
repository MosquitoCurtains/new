/**
 * Cart Option Labels
 *
 * Extracts human-readable option labels from a CartLineItem's `options` map.
 * Used by both admin and customer cart sidebars so manufacturing-critical
 * data (mesh type, color, top attachment, etc.) is always visible.
 */

// ─── Label maps ──────────────────────────────────────────────────────────────

const MESH_TYPE: Record<string, string> = {
  heavy_mosquito: 'Heavy Mosquito',
  no_see_um: 'No See Um',
  shade: 'Shade',
  scrim: 'Scrim',
  theater_scrim: 'Theater Scrim',
  theatre_scrim: 'Theater Scrim',
  industrial: 'Industrial',
}

const TOP_ATTACHMENT: Record<string, string> = {
  standard_track: 'Std Track (<10)',
  heavy_track: 'Heavy Track (10+)',
  tracking_under_10: 'Std Track (<10)',
  tracking_over_10: 'Heavy Track (10+)',
  velcro: 'Velcro',
  binding_only: 'Binding Only',
  special_rigging: 'Special Rigging',
  grommets: 'Grommets',
}

const COLOR: Record<string, string> = {
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

const PANEL_SIZE: Record<string, string> = {
  short: 'Short',
  medium: 'Medium',
  tall: 'Tall',
}

function titleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmt(map: Record<string, string>, val: unknown): string {
  const s = String(val)
  return map[s] || titleCase(s)
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface OptionLabel {
  label: string
  value: string
}

/**
 * Given a cart item's productSku and options map, return the key config
 * labels that should be visible in the cart for manufacturing clarity.
 */
export function getCartOptionLabels(
  productSku: string,
  options?: Record<string, string | number | boolean>,
): OptionLabel[] {
  if (!options) return []
  const labels: OptionLabel[] = []
  const sku = (productSku || '').toLowerCase()

  // ─── Mesh panels ─────────────────────────────────────────────
  if (sku === 'mesh_panel') {
    if (options.meshType) labels.push({ label: 'Mesh Type', value: fmt(MESH_TYPE, options.meshType) })
    if (options.color || options.meshColor) labels.push({ label: 'Color', value: fmt(COLOR, options.color || options.meshColor) })
    if (options.topAttachment) labels.push({ label: 'Top Attach', value: fmt(TOP_ATTACHMENT, options.topAttachment) })
    if (options.velcroColor && String(options.topAttachment).includes('velcro')) {
      labels.push({ label: 'Velcro', value: fmt(COLOR, options.velcroColor) })
    }
    return labels
  }

  // ─── Clear vinyl panels ──────────────────────────────────────
  if (sku === 'vinyl_panel') {
    if (options.panelSize) labels.push({ label: 'Panel Size', value: fmt(PANEL_SIZE, options.panelSize) })
    if (options.canvasColor) labels.push({ label: 'Canvas', value: fmt(COLOR, options.canvasColor) })
    if (options.topAttachment) labels.push({ label: 'Top Attach', value: fmt(TOP_ATTACHMENT, options.topAttachment) })
    if (options.velcroColor && String(options.topAttachment).includes('velcro')) {
      labels.push({ label: 'Velcro', value: fmt(COLOR, options.velcroColor) })
    }
    return labels
  }

  // ─── Roll-up shades ──────────────────────────────────────────
  if (sku === 'rollup_shade_screen') {
    if (options.ply) labels.push({ label: 'Ply', value: titleCase(String(options.ply)) })
    if (options.meshColor || options.color) labels.push({ label: 'Color', value: fmt(COLOR, options.meshColor || options.color) })
    return labels
  }

  // ─── Track ───────────────────────────────────────────────────
  if (sku.includes('track') || sku.includes('splice') || sku.includes('endcap') || sku.includes('end_cap') || sku.includes('carrier')) {
    if (options.color) labels.push({ label: 'Color', value: fmt(COLOR, options.color) })
    if (options.weight) labels.push({ label: 'Weight', value: titleCase(String(options.weight)) })
    return labels
  }

  // ─── Raw netting ─────────────────────────────────────────────
  if (sku === 'raw_netting_panel') {
    if (options.mesh_type) labels.push({ label: 'Material', value: fmt(MESH_TYPE, options.mesh_type) })
    // Roll width stored as roll_width_<type>
    for (const k of Object.keys(options)) {
      if (k.startsWith('roll_width')) {
        labels.push({ label: 'Roll Width', value: `${options[k]}"` })
        break
      }
    }
    if (options.color) labels.push({ label: 'Color', value: fmt(COLOR, options.color) })
    if (options.lengthFeet) labels.push({ label: 'Length', value: `${options.lengthFeet} ft` })
    if (options.purchase_type) labels.push({ label: 'Type', value: options.purchase_type === 'by_foot' ? 'By the Foot' : 'Full Roll' })
    return labels
  }

  // ─── Stucco strips ──────────────────────────────────────────
  if (sku.includes('stucco')) {
    if (options.heightInches) labels.push({ label: 'Height', value: `${options.heightInches}"` })
    if (options.zippered) labels.push({ label: 'Zippered', value: 'Yes' })
    return labels
  }

  // ─── Adjustments ─────────────────────────────────────────────
  if (sku.startsWith('adjustment')) {
    if (options.adjustment_type) labels.push({ label: 'Type', value: titleCase(String(options.adjustment_type)) })
    if (options.amount) labels.push({ label: 'Amount', value: `$${Math.abs(Number(options.amount)).toFixed(2)}` })
    return labels
  }

  // ─── Hardware / Attachments (generic) ────────────────────────
  if (options.quantity && Number(options.quantity) > 1) {
    labels.push({ label: 'Pieces', value: String(options.quantity) })
  }
  if (options.color) labels.push({ label: 'Color', value: fmt(COLOR, options.color) })

  return labels
}
