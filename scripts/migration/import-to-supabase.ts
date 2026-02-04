/**
 * Supabase Order Importer
 * 
 * Takes parsed WooCommerce orders and imports them into Supabase.
 * Creates records in:
 * - legacy_orders
 * - legacy_line_items  
 * - legacy_panel_specs
 * - customers (if not exists)
 * 
 * Usage: npx ts-node scripts/migration/import-to-supabase.ts [parsed-orders.json]
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type {
  ParsedOrder,
  ParsedLineItem,
  PanelSpec,
  LegacyOrderInsert,
  LegacyLineItemInsert,
  LegacyPanelSpecInsert,
  ImportStats,
} from './types.js'

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env vars
config({ path: path.join(__dirname, '../../.env.local') })

// =============================================================================
// CONFIGURATION
// =============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const BATCH_SIZE = 100 // Orders per batch
const RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

// =============================================================================
// SUPABASE CLIENT
// =============================================================================

let supabase: SupabaseClient

function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials. Check .env.local')
  }
  
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  })
  
  console.log('Supabase client initialized')
}

// =============================================================================
// CUSTOMER UPSERT
// =============================================================================

interface CustomerCache {
  [email: string]: string // email -> customer_id
}

const customerCache: CustomerCache = {}

async function getOrCreateCustomer(order: ParsedOrder): Promise<string | null> {
  if (!order.email) return null
  
  const email = order.email.toLowerCase().trim()
  
  // Check cache first
  if (customerCache[email]) {
    return customerCache[email]
  }
  
  // Check if customer exists
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single()
  
  if (existing) {
    customerCache[email] = existing.id
    return existing.id
  }
  
  // Create new customer
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      email,
      first_name: order.billingFirstName || null,
      last_name: order.billingLastName || null,
      phone: order.billingPhone || null,
      city: order.billingCity || null,
      state: order.billingState || null,
      zip: order.billingZip || null,
      acquisition_source: order.utmSource || 'import',
      assigned_salesperson: order.salespersonUsername || null,
    })
    .select('id')
    .single()
  
  if (error) {
    console.warn(`Failed to create customer for ${email}:`, error.message)
    return null
  }
  
  if (newCustomer) {
    customerCache[email] = newCustomer.id
    return newCustomer.id
  }
  
  return null
}

// =============================================================================
// ORDER IMPORT
// =============================================================================

async function importOrder(order: ParsedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Get or create customer
    const customerId = await getOrCreateCustomer(order)
    
    // Prepare legacy order insert
    const legacyOrder: LegacyOrderInsert = {
      woo_order_id: order.wooOrderId,
      woo_order_key: order.orderKey,
      order_number: order.orderNumber,
      order_date: order.orderDate.toISOString(),
      status: order.status,
      email: order.email,
      billing_first_name: order.billingFirstName || null,
      billing_last_name: order.billingLastName || null,
      billing_phone: order.billingPhone || null,
      billing_address_1: order.billingAddress1 || null,
      billing_city: order.billingCity || null,
      billing_state: order.billingState || null,
      billing_zip: order.billingZip || null,
      shipping_first_name: order.shippingFirstName || null,
      shipping_last_name: order.shippingLastName || null,
      shipping_address_1: order.shippingAddress1 || null,
      shipping_city: order.shippingCity || null,
      shipping_state: order.shippingState || null,
      shipping_zip: order.shippingZip || null,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod || null,
      payment_method_title: order.paymentMethodTitle,
      transaction_id: order.transactionId,
      // Attribution - Salesperson
      salesperson_username: order.salespersonUsername,
      // Attribution - UTM Parameters
      utm_source: order.utmSource,
      utm_medium: order.utmMedium,
      utm_campaign: order.utmCampaign,
      utm_term: order.utmTerm,
      utm_content: order.utmContent,
      utm_id: order.utmId,
      utm_source_platform: order.utmSourcePlatform,
      utm_creative_format: order.utmCreativeFormat,
      utm_marketing_tactic: order.utmMarketingTactic,
      // Attribution - Session Data
      source_type: order.sourceType,
      referrer: order.referrer,
      device_type: order.deviceType,
      user_agent: order.userAgent,
      session_entry: order.sessionEntry,
      session_pages: order.sessionPages,
      session_count: order.sessionCount,
      session_start_time: order.sessionStartTime?.toISOString() || null,
      // Attachments
      diagram_attachment_id: order.diagramAttachmentIds[0] || null,
      diagram_url: order.diagramUrls[0] || null,
      // Raw Data
      raw_line_items: order.rawLineItems,
      raw_meta: null,
      raw_csv_row: order.rawCsvRow,
    }
    
    // Insert legacy order
    const { data: insertedOrder, error: orderError } = await supabase
      .from('legacy_orders')
      .insert(legacyOrder)
      .select('id')
      .single()
    
    if (orderError) {
      // Check if it's a duplicate
      if (orderError.code === '23505') { // Unique violation
        console.log(`Order ${order.orderNumber} already exists, skipping`)
        return { success: true, orderId: 'duplicate' }
      }
      throw new Error(`Order insert failed: ${orderError.message}`)
    }
    
    const legacyOrderId = insertedOrder.id
    
    // Link to customer if we have one
    if (customerId) {
      await supabase
        .from('legacy_orders')
        .update({ customer_id: customerId })
        .eq('id', legacyOrderId)
    }
    
    // Insert line items
    for (const lineItem of order.lineItems) {
      await importLineItem(legacyOrderId, lineItem, order.panelSpecs)
    }
    
    return { success: true, orderId: legacyOrderId }
    
  } catch (error) {
    return { 
      success: false, 
      error: `Order ${order.orderNumber}: ${(error as Error).message}` 
    }
  }
}

async function importLineItem(
  legacyOrderId: string, 
  lineItem: ParsedLineItem,
  panelSpecs: PanelSpec[]
): Promise<void> {
  const insert: LegacyLineItemInsert = {
    legacy_order_id: legacyOrderId,
    product_name: lineItem.name,
    product_sku: lineItem.sku || null,
    quantity: lineItem.quantity,
    unit_price: lineItem.quantity > 0 ? lineItem.total / lineItem.quantity : lineItem.total,
    line_total: lineItem.total,
    item_type: lineItem.itemType,
    raw_meta: lineItem.rawMeta || null,
    parsed_meta: lineItem.meta,
  }
  
  const { data: insertedItem, error } = await supabase
    .from('legacy_line_items')
    .insert(insert)
    .select('id')
    .single()
  
  if (error) {
    console.warn(`Failed to insert line item: ${error.message}`)
    return
  }
  
  // If this is a panel item, insert panel specs
  if (lineItem.itemType === 'panel' && panelSpecs.length > 0) {
    for (const spec of panelSpecs) {
      await importPanelSpec(insertedItem.id, spec)
    }
  }
}

async function importPanelSpec(lineItemId: string, spec: PanelSpec): Promise<void> {
  const insert: LegacyPanelSpecInsert = {
    legacy_line_item_id: lineItemId,
    panel_number: spec.panelNumber,
    width_inches: spec.widthInches,
    height_inches: spec.heightInches,
    sqft: spec.sqft,
    mesh_type: spec.meshType,
    color: spec.color,
    top_attachment: spec.topAttachment,
    bottom_attachment: spec.bottomAttachment,
    has_door: spec.hasDoor,
    has_zipper: spec.hasZipper,
    has_notch: spec.hasNotch,
    notch_specs: spec.notchSpecs,
    raw_dimension_string: spec.rawDimensionString || null,
  }
  
  const { error } = await supabase
    .from('legacy_panel_specs')
    .insert(insert)
  
  if (error) {
    console.warn(`Failed to insert panel spec: ${error.message}`)
  }
}

// =============================================================================
// BATCH IMPORT
// =============================================================================

interface ImportResult {
  totalProcessed: number
  successful: number
  failed: number
  duplicates: number
  errors: string[]
}

async function importOrderBatch(orders: ParsedOrder[]): Promise<ImportResult> {
  const result: ImportResult = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    duplicates: 0,
    errors: [],
  }
  
  for (const order of orders) {
    result.totalProcessed++
    
    let success = false
    let lastError = ''
    
    // Retry logic
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      const importResult = await importOrder(order)
      
      if (importResult.success) {
        if (importResult.orderId === 'duplicate') {
          result.duplicates++
        } else {
          result.successful++
        }
        success = true
        break
      } else {
        lastError = importResult.error || 'Unknown error'
        if (attempt < RETRY_ATTEMPTS) {
          await sleep(RETRY_DELAY_MS * attempt)
        }
      }
    }
    
    if (!success) {
      result.failed++
      result.errors.push(lastError)
    }
  }
  
  return result
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// =============================================================================
// MAIN IMPORT FUNCTION
// =============================================================================

export async function importOrders(parsedDataPath: string): Promise<void> {
  console.log('=== SUPABASE ORDER IMPORTER ===\n')
  
  // Initialize Supabase
  initSupabase()
  
  // Read parsed orders
  console.log(`Reading parsed orders from: ${parsedDataPath}`)
  const rawData = fs.readFileSync(parsedDataPath, 'utf-8')
  const { orders, stats: parseStats } = JSON.parse(rawData) as { 
    orders: ParsedOrder[]
    stats: ImportStats 
  }
  
  console.log(`Found ${orders.length} orders to import\n`)
  
  // Import in batches
  const totalBatches = Math.ceil(orders.length / BATCH_SIZE)
  let totalResult: ImportResult = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    duplicates: 0,
    errors: [],
  }
  
  console.log(`Importing in ${totalBatches} batches of ${BATCH_SIZE}...`)
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE
    const end = Math.min(start + BATCH_SIZE, orders.length)
    const batch = orders.slice(start, end)
    
    console.log(`\nBatch ${i + 1}/${totalBatches}: Orders ${start + 1}-${end}`)
    
    const batchResult = await importOrderBatch(batch)
    
    totalResult.totalProcessed += batchResult.totalProcessed
    totalResult.successful += batchResult.successful
    totalResult.failed += batchResult.failed
    totalResult.duplicates += batchResult.duplicates
    totalResult.errors.push(...batchResult.errors)
    
    console.log(`  Processed: ${batchResult.totalProcessed}, Success: ${batchResult.successful}, Failed: ${batchResult.failed}, Duplicates: ${batchResult.duplicates}`)
    
    // Small delay between batches
    if (i < totalBatches - 1) {
      await sleep(500)
    }
  }
  
  // Final report
  console.log('\n=== IMPORT COMPLETE ===')
  console.log(`Total processed: ${totalResult.totalProcessed}`)
  console.log(`Successful: ${totalResult.successful}`)
  console.log(`Duplicates skipped: ${totalResult.duplicates}`)
  console.log(`Failed: ${totalResult.failed}`)
  console.log(`Unique customers created: ${Object.keys(customerCache).length}`)
  
  if (totalResult.errors.length > 0) {
    console.log(`\nFirst 10 errors:`)
    totalResult.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
    
    // Save all errors to file
    const errorLogPath = path.join(path.dirname(parsedDataPath), 'import-errors.json')
    fs.writeFileSync(errorLogPath, JSON.stringify(totalResult.errors, null, 2))
    console.log(`\nAll errors saved to: ${errorLogPath}`)
  }
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

async function main() {
  const args = process.argv.slice(2)
  const inputPath = args[0] || path.join(__dirname, '../../data/parsed-orders.json')
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Parsed orders file not found: ${inputPath}`)
    console.log('Run parse-woocommerce-orders.ts first')
    process.exit(1)
  }
  
  await importOrders(inputPath)
  console.log('\nImport complete!')
}

main().catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})
