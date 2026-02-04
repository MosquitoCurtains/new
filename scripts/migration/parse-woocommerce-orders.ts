/**
 * WooCommerce Order CSV Parser
 * 
 * Parses WooCommerce CSV exports and extracts:
 * - Order details
 * - Line items with product classification
 * - Panel specifications from meta fields
 * - Diagram URLs from attachment IDs
 * - Salesperson attribution
 * 
 * Usage: npx ts-node scripts/migration/parse-woocommerce-orders.ts [input.csv] [output.json]
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import type {
  WooCommerceCSVRow,
  ParsedOrder,
  ParsedLineItem,
  PanelSpec,
  ImportStats,
} from './types'

// =============================================================================
// CONFIGURATION
// =============================================================================

const CLOUDFRONT_BASE = 'https://static.mosquitocurtains.com'
const WP_UPLOADS_PATH = '/wp-media-folder-mosquito-curtains/wp-content/uploads'

// Product classification patterns
const PRODUCT_PATTERNS = {
  panel: [
    /mosquito.*curtain/i,
    /mesh.*panel/i,
    /clear.*vinyl/i,
    /vinyl.*panel/i,
    /scrim/i,
    /roll.?up.*shade/i,
    /netting.*panel/i,
  ],
  track: [
    /track/i,
    /curve.*90/i,
    /curve.*135/i,
    /splice/i,
    /end.*cap/i,
    /carrier/i,
  ],
  tool: [
    /snap.*tool/i,
    /industrial.*tool/i,
  ],
  attachment: [
    /snap/i,
    /magnet/i,
    /fiberglass.*rod/i,
    /elastic.*cord/i,
    /velcro/i,
    /webbing/i,
    /stucco.*strip/i,
    /tether/i,
    /belted.*rib/i,
    /screw.*stud/i,
    /l.*screw/i,
    /washer/i,
    /grommet/i,
  ],
  raw_material: [
    /raw.*mesh/i,
    /raw.*netting/i,
    /fabric.*roll/i,
  ],
  adjustment: [
    /adjustment/i,
    /discount/i,
    /credit/i,
    /surcharge/i,
  ],
  bundle: [
    /attachment.*item/i,
    /hardware.*kit/i,
    /bundle/i,
  ],
}

// =============================================================================
// LINE ITEM PARSER
// =============================================================================

/**
 * Parse the pipe-delimited line items string
 * Format: id:123|name:Product|product_id:456|sku:|quantity:1|subtotal:10.00|...;id:124|name:Another|...
 */
function parseLineItems(lineItemsString: string): ParsedLineItem[] {
  if (!lineItemsString || lineItemsString.trim() === '') {
    return []
  }

  const items: ParsedLineItem[] = []
  
  // Split by semicolon to get individual items
  // But be careful - the string might have newlines within meta fields
  const rawItems = lineItemsString.split(/;(?=id:)/)
  
  for (const rawItem of rawItems) {
    if (!rawItem.trim()) continue
    
    try {
      const item = parseLineItem(rawItem)
      if (item) {
        items.push(item)
      }
    } catch (err) {
      console.warn('Failed to parse line item:', rawItem.substring(0, 100), err)
    }
  }
  
  return items
}

/**
 * Parse a single line item from pipe-delimited format
 */
function parseLineItem(rawItem: string): ParsedLineItem | null {
  // Extract key:value pairs
  const fields: Record<string, string> = {}
  
  // Match patterns like "key:value" separated by |
  // Handle the meta field specially as it contains comma-separated values
  const metaMatch = rawItem.match(/meta:(.*)$/)
  const metaString = metaMatch ? metaMatch[1] : ''
  
  // Remove meta from the raw item for parsing other fields
  const withoutMeta = rawItem.replace(/\|meta:.*$/, '')
  
  // Parse regular fields
  const parts = withoutMeta.split('|')
  for (const part of parts) {
    const colonIndex = part.indexOf(':')
    if (colonIndex > 0) {
      const key = part.substring(0, colonIndex).trim()
      const value = part.substring(colonIndex + 1).trim()
      fields[key] = value
    }
  }
  
  if (!fields.id || !fields.name) {
    return null
  }
  
  // Parse meta into key=value pairs
  const meta: Record<string, string> = {}
  if (metaString) {
    // Meta format: "Key=Value,Key2=Value2" or with newlines for panel dimensions
    const metaParts = metaString.split(/,(?=[A-Za-z])/)
    for (const mp of metaParts) {
      const eqIndex = mp.indexOf('=')
      if (eqIndex > 0) {
        const key = mp.substring(0, eqIndex).trim()
        const value = mp.substring(eqIndex + 1).trim()
        meta[key] = value
      }
    }
  }
  
  const item: ParsedLineItem = {
    id: fields.id,
    name: fields.name,
    productId: fields.product_id || '',
    sku: fields.sku || '',
    quantity: parseInt(fields.quantity || '1', 10),
    subtotal: parseFloat(fields.subtotal || '0'),
    subtotalTax: parseFloat(fields.subtotal_tax || '0'),
    total: parseFloat(fields.total || '0'),
    totalTax: parseFloat(fields.total_tax || '0'),
    refunded: parseFloat(fields.refunded || '0'),
    refundedQty: parseInt(fields.refunded_qty || '0', 10),
    meta,
    rawMeta: metaString,
    itemType: classifyProduct(fields.name),
  }
  
  return item
}

/**
 * Classify a product by name into type categories
 */
function classifyProduct(name: string): ParsedLineItem['itemType'] {
  const lowerName = name.toLowerCase()
  
  // Check each pattern category
  for (const [type, patterns] of Object.entries(PRODUCT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerName)) {
        return type as ParsedLineItem['itemType']
      }
    }
  }
  
  return 'unknown'
}

// =============================================================================
// PANEL SPEC EXTRACTOR
// =============================================================================

/**
 * Extract panel specifications from line item meta
 * Panel dimensions are often in a multi-line format like:
 * "Panel Width (Feet Portion)\nPanel Width (Inches Portion)\nHeight (Inches)"
 */
function extractPanelSpecs(lineItem: ParsedLineItem): PanelSpec[] {
  const specs: PanelSpec[] = []
  const meta = lineItem.meta
  
  // Look for panel dimension patterns in meta
  // Common patterns:
  // - "Clear Vinyl Panels" or "Mosquito Curtains" with dimension data
  // - Individual width/height fields
  
  // Check for the main panel dimension field
  const panelFields = [
    'Clear Vinyl Panels',
    'Mosquito Curtains',
    'Mesh Panels',
    'Panel Dimensions',
  ]
  
  for (const field of panelFields) {
    if (meta[field]) {
      const dimensionSpecs = parsePanelDimensions(meta[field], meta)
      specs.push(...dimensionSpecs)
    }
  }
  
  // If no specs found but this is a panel type, try to extract from any dimension fields
  if (specs.length === 0 && lineItem.itemType === 'panel') {
    // Look for width/height patterns in any meta field
    for (const [key, value] of Object.entries(meta)) {
      if (/width|height|dimension/i.test(key) || /\d+.*x.*\d+/i.test(value)) {
        const spec = parseSimpleDimension(value, meta)
        if (spec) {
          specs.push(spec)
        }
      }
    }
  }
  
  return specs
}

/**
 * Parse panel dimensions from a multi-line or formatted string
 */
function parsePanelDimensions(dimensionString: string, meta: Record<string, string>): PanelSpec[] {
  const specs: PanelSpec[] = []
  
  // Split by common panel separators
  const lines = dimensionString.split(/[\n\r]+/).filter(l => l.trim())
  
  // Try to extract dimensions from the lines
  // Common format: "72" (width) followed by "96" (height) or "72 x 96"
  
  let panelNumber = 1
  let currentWidth: number | null = null
  let currentHeight: number | null = null
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Check for "X x Y" format
    const xyMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/)
    if (xyMatch) {
      const width = parseFloat(xyMatch[1])
      const height = parseFloat(xyMatch[2])
      
      specs.push({
        panelNumber: panelNumber++,
        widthInches: width,
        heightInches: height,
        sqft: (width * height) / 144,
        meshType: meta['Mesh Type'] || meta['Mesh'] || null,
        color: meta['Color'] || meta['Mesh Color'] || meta['Canvas Color'] || null,
        topAttachment: meta['Top Attachment'] || null,
        bottomAttachment: meta['Bottom'] || meta['Bottom Attachment'] || null,
        hasDoor: /door/i.test(JSON.stringify(meta)),
        hasZipper: /zipper/i.test(JSON.stringify(meta)),
        hasNotch: /notch/i.test(JSON.stringify(meta)),
        notchSpecs: meta['Notch'] || null,
        rawDimensionString: trimmed,
      })
      continue
    }
    
    // Check for single number (width or height)
    const numMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/)
    if (numMatch) {
      const num = parseFloat(numMatch[1])
      if (currentWidth === null) {
        currentWidth = num
      } else if (currentHeight === null) {
        currentHeight = num
        
        // We have both width and height, create spec
        specs.push({
          panelNumber: panelNumber++,
          widthInches: currentWidth,
          heightInches: currentHeight,
          sqft: (currentWidth * currentHeight) / 144,
          meshType: meta['Mesh Type'] || meta['Mesh'] || null,
          color: meta['Color'] || meta['Mesh Color'] || meta['Canvas Color'] || null,
          topAttachment: meta['Top Attachment'] || null,
          bottomAttachment: meta['Bottom'] || meta['Bottom Attachment'] || null,
          hasDoor: /door/i.test(JSON.stringify(meta)),
          hasZipper: /zipper/i.test(JSON.stringify(meta)),
          hasNotch: /notch/i.test(JSON.stringify(meta)),
          notchSpecs: meta['Notch'] || null,
          rawDimensionString: `${currentWidth} x ${currentHeight}`,
        })
        
        currentWidth = null
        currentHeight = null
      }
    }
  }
  
  return specs
}

/**
 * Parse a simple dimension string like "72 x 96" or "72"x96""
 */
function parseSimpleDimension(value: string, meta: Record<string, string>): PanelSpec | null {
  const match = value.match(/(\d+(?:\.\d+)?)\s*[xX×"']\s*(\d+(?:\.\d+)?)/)
  if (!match) return null
  
  const width = parseFloat(match[1])
  const height = parseFloat(match[2])
  
  return {
    panelNumber: 1,
    widthInches: width,
    heightInches: height,
    sqft: (width * height) / 144,
    meshType: meta['Mesh Type'] || meta['Mesh'] || null,
    color: meta['Color'] || meta['Mesh Color'] || null,
    topAttachment: meta['Top Attachment'] || null,
    bottomAttachment: meta['Bottom'] || null,
    hasDoor: false,
    hasZipper: false,
    hasNotch: false,
    notchSpecs: null,
    rawDimensionString: value,
  }
}

// =============================================================================
// DIAGRAM URL BUILDER
// =============================================================================

/**
 * Build CloudFront URLs from WordPress attachment IDs
 * Format: https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/YYYY/MM/XXXXX.pdf
 * 
 * Since we don't have access to the WP database to look up actual paths,
 * we'll store the attachment IDs and construct a pattern-based URL
 */
function extractDiagramInfo(row: WooCommerceCSVRow): { attachmentIds: number[]; urls: string[] } {
  const attachmentIds: number[] = []
  const urls: string[] = []
  
  // Check all meta fields for diagram attachment IDs
  const diagramFields = [
    'meta:_mc_files_0_mc_file',
    'meta:_mc_files_1_mc_file',
    'meta:_mc_files_2_mc_file',
    'meta:mc_files_0_mc_file',
    'meta:mc_files_1_mc_file',
    'meta:mc_files_2_mc_file',
  ]
  
  for (const field of diagramFields) {
    const value = row[field]
    if (value && value.trim() && /^\d+$/.test(value.trim())) {
      const attachmentId = parseInt(value.trim(), 10)
      if (attachmentId > 0 && !attachmentIds.includes(attachmentId)) {
        attachmentIds.push(attachmentId)
        
        // Construct URL pattern based on order date
        // The actual path includes year/month from upload date, which we don't know
        // We'll use the order number as the filename pattern
        const orderNumber = row.order_number
        const orderDate = new Date(row.date)
        const year = orderDate.getFullYear()
        const month = String(orderDate.getMonth() + 1).padStart(2, '0')
        
        // Construct estimated URL
        const estimatedUrl = `${CLOUDFRONT_BASE}${WP_UPLOADS_PATH}/${year}/${month}/${orderNumber}.pdf`
        urls.push(estimatedUrl)
      }
    }
  }
  
  return { attachmentIds, urls }
}

// =============================================================================
// MAIN PARSER
// =============================================================================

/**
 * Parse a single CSV row into a structured order
 */
function parseOrder(row: WooCommerceCSVRow): ParsedOrder {
  // Parse line items
  const lineItems = parseLineItems(row.line_items)
  
  // Extract panel specs from panel-type line items
  const panelSpecs: PanelSpec[] = []
  for (const item of lineItems) {
    if (item.itemType === 'panel') {
      const specs = extractPanelSpecs(item)
      panelSpecs.push(...specs)
    }
  }
  
  // Extract diagram info
  const { attachmentIds, urls } = extractDiagramInfo(row)
  
  // Calculate subtotal from line items if not directly available
  const lineItemSubtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0)
  
  // Get salesperson (prefer mc_username, fall back to Salesperson column)
  const salesperson = row['meta:mc_username'] || row.Salesperson || null
  
  const order: ParsedOrder = {
    // Identifiers
    wooOrderId: parseInt(row.order_id, 10),
    orderNumber: row.order_number,
    orderKey: row['meta:_order_key'] || null,
    
    // Timestamps
    orderDate: new Date(row.date),
    
    // Status
    status: row.status,
    
    // Customer
    email: row.billing_email || '',
    billingFirstName: row.billing_first_name || '',
    billingLastName: row.billing_last_name || '',
    billingPhone: row.billing_phone || '',
    billingAddress1: row.billing_address_1 || '',
    billingAddress2: row.billing_address_2 || '',
    billingCity: row.billing_city || '',
    billingState: row.billing_state || '',
    billingZip: row.billing_postcode || '',
    billingCountry: row.billing_country || 'US',
    
    shippingFirstName: row.shipping_first_name || '',
    shippingLastName: row.shipping_last_name || '',
    shippingAddress1: row.shipping_address_1 || '',
    shippingAddress2: row.shipping_address_2 || '',
    shippingCity: row.shipping_city || '',
    shippingState: row.shipping_state || '',
    shippingZip: row.shipping_postcode || '',
    shippingCountry: row.shipping_country || 'US',
    
    // Financials
    subtotal: lineItemSubtotal || parseFloat(row.order_total) - parseFloat(row.shipping_total || '0'),
    tax: parseFloat(row.tax_total || '0'),
    shipping: parseFloat(row.shipping_total || '0'),
    discount: parseFloat(row.discount_total || '0'),
    total: parseFloat(row.order_total || '0'),
    refunded: parseFloat(row.refunded_total || '0'),
    
    // Payment
    paymentMethod: row.payment_method || '',
    paymentMethodTitle: row['meta:_payment_method_title'] || null,
    transactionId: row['meta:_transaction_id'] || null,
    
    // Attribution - Salesperson
    salespersonUsername: salesperson,
    
    // Attribution - UTM Parameters
    utmSource: row['meta:_wc_order_attribution_utm_source'] || null,
    utmMedium: row['meta:_wc_order_attribution_utm_medium'] || null,
    utmCampaign: row['meta:_wc_order_attribution_utm_campaign'] || null,
    utmTerm: row['meta:_wc_order_attribution_utm_term'] || null,
    utmContent: row['meta:_wc_order_attribution_utm_content'] || null,
    utmId: row['meta:_wc_order_attribution_utm_id'] || null,
    utmSourcePlatform: row['meta:_wc_order_attribution_utm_source_platform'] || null,
    utmCreativeFormat: row['meta:_wc_order_attribution_utm_creative_format'] || null,
    utmMarketingTactic: row['meta:_wc_order_attribution_utm_marketing_tactic'] || null,
    
    // Attribution - Session Data  
    sourceType: row['meta:_wc_order_attribution_source_type'] || null,
    referrer: row['meta:_wc_order_attribution_referrer'] || null,
    deviceType: row['meta:_wc_order_attribution_device_type'] || null,
    userAgent: row['meta:_wc_order_attribution_user_agent'] || null,
    sessionEntry: row['meta:_wc_order_attribution_session_entry'] || null,
    sessionPages: row['meta:_wc_order_attribution_session_pages'] 
      ? parseInt(row['meta:_wc_order_attribution_session_pages'], 10) 
      : null,
    sessionCount: row['meta:_wc_order_attribution_session_count']
      ? parseInt(row['meta:_wc_order_attribution_session_count'], 10)
      : null,
    sessionStartTime: row['meta:_wc_order_attribution_session_start_time']
      ? new Date(row['meta:_wc_order_attribution_session_start_time'])
      : null,
    
    // Diagrams
    diagramAttachmentIds: attachmentIds,
    diagramUrls: urls,
    
    // Notes
    customerNote: row.customer_note || null,
    
    // Parsed Data
    lineItems,
    panelSpecs,
    
    // Raw data
    rawLineItems: row.line_items,
    rawCsvRow: row as Record<string, string>,
  }
  
  return order
}

/**
 * Parse entire CSV file
 */
export function parseWooCommerceCSV(csvPath: string): { orders: ParsedOrder[]; stats: ImportStats } {
  console.log(`Reading CSV file: ${csvPath}`)
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  console.log('Parsing CSV...')
  const rows: WooCommerceCSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  })
  
  console.log(`Found ${rows.length} orders to process`)
  
  const orders: ParsedOrder[] = []
  const stats: ImportStats = {
    totalOrders: rows.length,
    successfulOrders: 0,
    failedOrders: 0,
    totalLineItems: 0,
    lineItemsByType: {},
    totalPanelSpecs: 0,
    ordersWithDiagrams: 0,
    uniqueCustomers: 0,
    uniqueSalespersons: new Set(),
    dateRange: { earliest: null, latest: null },
    totalRevenue: 0,
    errors: [],
  }
  
  const uniqueEmails = new Set<string>()
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    
    if (i > 0 && i % 1000 === 0) {
      console.log(`Processed ${i} orders...`)
    }
    
    try {
      const order = parseOrder(row)
      orders.push(order)
      
      // Update stats
      stats.successfulOrders++
      stats.totalLineItems += order.lineItems.length
      stats.totalPanelSpecs += order.panelSpecs.length
      stats.totalRevenue += order.total
      
      if (order.diagramAttachmentIds.length > 0) {
        stats.ordersWithDiagrams++
      }
      
      if (order.email) {
        uniqueEmails.add(order.email.toLowerCase())
      }
      
      if (order.salespersonUsername) {
        stats.uniqueSalespersons.add(order.salespersonUsername)
      }
      
      // Line items by type
      for (const item of order.lineItems) {
        stats.lineItemsByType[item.itemType] = (stats.lineItemsByType[item.itemType] || 0) + 1
      }
      
      // Date range
      if (!stats.dateRange.earliest || order.orderDate < stats.dateRange.earliest) {
        stats.dateRange.earliest = order.orderDate
      }
      if (!stats.dateRange.latest || order.orderDate > stats.dateRange.latest) {
        stats.dateRange.latest = order.orderDate
      }
      
    } catch (error) {
      stats.failedOrders++
      stats.errors.push({
        orderId: row.order_id,
        error: (error as Error).message,
      })
    }
  }
  
  stats.uniqueCustomers = uniqueEmails.size
  
  console.log('\n=== PARSING COMPLETE ===')
  console.log(`Total orders: ${stats.totalOrders}`)
  console.log(`Successful: ${stats.successfulOrders}`)
  console.log(`Failed: ${stats.failedOrders}`)
  console.log(`Total line items: ${stats.totalLineItems}`)
  console.log(`Panel specs extracted: ${stats.totalPanelSpecs}`)
  console.log(`Orders with diagrams: ${stats.ordersWithDiagrams}`)
  console.log(`Unique customers: ${stats.uniqueCustomers}`)
  console.log(`Unique salespersons: ${stats.uniqueSalespersons.size}`)
  console.log(`Total revenue: $${stats.totalRevenue.toLocaleString()}`)
  console.log(`Date range: ${stats.dateRange.earliest?.toISOString()} - ${stats.dateRange.latest?.toISOString()}`)
  console.log('\nLine items by type:')
  for (const [type, count] of Object.entries(stats.lineItemsByType)) {
    console.log(`  ${type}: ${count}`)
  }
  
  return { orders, stats }
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

// Run main function (ES module compatible)
async function main() {
  const args = process.argv.slice(2)
  
  const inputPath = args[0] || path.join(__dirname, '../../All Previous Orders/All woocommerce orders.csv')
  const outputPath = args[1] || path.join(__dirname, '../../data/parsed-orders.json')
  
  console.log('WooCommerce Order Parser')
  console.log('========================\n')
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`)
    process.exit(1)
  }
  
  const { orders, stats } = parseWooCommerceCSV(inputPath)
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Write parsed orders
  console.log(`\nWriting ${orders.length} orders to ${outputPath}...`)
  fs.writeFileSync(outputPath, JSON.stringify({ orders, stats: {
    ...stats,
    uniqueSalespersons: Array.from(stats.uniqueSalespersons),
  } }, null, 2))
  
  // Write stats summary
  const statsPath = path.join(outputDir, 'import-stats.json')
  fs.writeFileSync(statsPath, JSON.stringify({
    ...stats,
    uniqueSalespersons: Array.from(stats.uniqueSalespersons),
  }, null, 2))
  
  console.log('Done!')
}

main().catch(console.error)

export { parseOrder, parseLineItems, classifyProduct, extractPanelSpecs }
