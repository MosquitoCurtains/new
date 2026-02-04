/**
 * FAST Bulk Import - Uses batch inserts for speed
 * 
 * Imports orders in bulk batches instead of one-at-a-time
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { ParsedOrder } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BATCH_SIZE = 500 // Larger batches for speed

interface OrderInsert {
  woo_order_id: number
  woo_order_key: string | null
  order_number: string
  order_date: string
  status: string
  email: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_address_1: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  subtotal: number | null
  tax: number | null
  shipping: number | null
  discount: number | null
  total: number | null
  payment_method: string | null
  payment_method_title: string | null
  transaction_id: string | null
  salesperson_username: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  source_type: string | null
  referrer: string | null
  device_type: string | null
  session_entry: string | null
  session_pages: number | null
  session_count: number | null
  diagram_attachment_id: number | null
  diagram_url: string | null
  raw_line_items: string | null
  raw_csv_row: Record<string, unknown>
}

function transformOrder(order: ParsedOrder): OrderInsert {
  return {
    woo_order_id: order.wooOrderId,
    woo_order_key: order.orderKey || null,
    order_number: order.orderNumber,
    order_date: order.orderDate,
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
    payment_method_title: order.paymentMethodTitle || null,
    transaction_id: order.transactionId || null,
    salesperson_username: order.salespersonUsername || null,
    utm_source: order.utmSource || null,
    utm_medium: order.utmMedium || null,
    utm_campaign: order.utmCampaign || null,
    utm_term: order.utmTerm || null,
    utm_content: order.utmContent || null,
    source_type: order.sourceType || null,
    referrer: order.referrer || null,
    device_type: order.deviceType || null,
    session_entry: order.sessionEntry || null,
    session_pages: order.sessionPages || null,
    session_count: order.sessionCount || null,
    diagram_attachment_id: order.diagramAttachmentIds?.[0] || null,
    diagram_url: order.diagramUrls?.[0] || null,
    raw_line_items: order.rawLineItems || null,
    raw_csv_row: order.rawCsvRow as Record<string, unknown>,
  }
}

async function importBulk() {
  console.log('=== FAST BULK IMPORT ===\n')
  
  // Load parsed orders
  const inputPath = path.join(__dirname, '../../data/parsed-orders.json')
  console.log('Loading parsed orders...')
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  const orders: ParsedOrder[] = data.orders
  
  console.log(`Found ${orders.length} orders to import`)
  console.log(`Using batch size: ${BATCH_SIZE}\n`)
  
  const totalBatches = Math.ceil(orders.length / BATCH_SIZE)
  let totalSuccess = 0
  let totalFailed = 0
  let totalLineItems = 0
  
  const startTime = Date.now()
  
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const batchOrders = orders.slice(i, i + BATCH_SIZE)
    
    console.log(`Batch ${batchNum}/${totalBatches}: Orders ${i + 1}-${Math.min(i + BATCH_SIZE, orders.length)}`)
    
    // Transform orders for insert
    const orderInserts = batchOrders.map(transformOrder)
    
    // Bulk insert orders
    const { data: insertedOrders, error: orderError } = await supabase
      .from('legacy_orders')
      .upsert(orderInserts, { onConflict: 'woo_order_id' })
      .select('id, woo_order_id')
    
    if (orderError) {
      console.log(`  ✗ Order batch failed: ${orderError.message}`)
      totalFailed += batchOrders.length
      continue
    }
    
    totalSuccess += insertedOrders.length
    
    // Create a map of woo_order_id -> uuid
    const orderIdMap = new Map<number, string>()
    for (const o of insertedOrders) {
      orderIdMap.set(o.woo_order_id, o.id)
    }
    
    // Prepare line items for bulk insert
    const lineItemInserts: Array<{
      legacy_order_id: string
      product_name: string
      product_sku: string | null
      quantity: number
      unit_price: number
      line_total: number
      item_type: string
      raw_meta: string | null
    }> = []
    
    for (const order of batchOrders) {
      const orderId = orderIdMap.get(order.wooOrderId)
      if (!orderId || !order.lineItems) continue
      
      for (const item of order.lineItems) {
        lineItemInserts.push({
          legacy_order_id: orderId,
          product_name: item.name,
          product_sku: item.sku || null,
          quantity: item.quantity,
          unit_price: item.quantity > 0 ? item.total / item.quantity : item.total,
          line_total: item.total,
          item_type: item.itemType,
          raw_meta: item.meta ? JSON.stringify(item.meta) : null,
        })
      }
    }
    
    // Bulk insert line items
    if (lineItemInserts.length > 0) {
      const { error: lineError } = await supabase
        .from('legacy_line_items')
        .insert(lineItemInserts)
      
      if (lineError) {
        console.log(`  ⚠ Line items error: ${lineError.message}`)
      } else {
        totalLineItems += lineItemInserts.length
      }
    }
    
    console.log(`  ✓ ${insertedOrders.length} orders, ${lineItemInserts.length} line items`)
  }
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  
  console.log(`\n=== IMPORT COMPLETE ===`)
  console.log(`Time: ${elapsed}s`)
  console.log(`Orders: ${totalSuccess} success, ${totalFailed} failed`)
  console.log(`Line Items: ${totalLineItems}`)
  console.log(`Speed: ${(totalSuccess / parseFloat(elapsed)).toFixed(0)} orders/sec`)
}

importBulk().catch(console.error)
