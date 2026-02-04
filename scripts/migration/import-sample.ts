/**
 * Import a small sample of orders (10) to test the full pipeline
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

const SAMPLE_SIZE = 10

async function importSample() {
  // Load parsed orders
  const inputPath = path.join(__dirname, '../../data/parsed-orders.json')
  console.log('Loading parsed orders...')
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  const orders: ParsedOrder[] = data.orders.slice(0, SAMPLE_SIZE)
  
  console.log(`\nImporting ${orders.length} sample orders...\n`)
  
  let success = 0
  let failed = 0
  
  for (const order of orders) {
    console.log(`Order ${order.orderNumber}:`)
    
    try {
      // Build insert object
      const legacyOrder = {
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
        payment_method_title: order.paymentMethodTitle,
        transaction_id: order.transactionId,
        // Attribution
        salesperson_username: order.salespersonUsername,
        utm_source: order.utmSource,
        utm_medium: order.utmMedium,
        utm_campaign: order.utmCampaign,
        utm_term: order.utmTerm,
        utm_content: order.utmContent,
        utm_id: order.utmId,
        utm_source_platform: order.utmSourcePlatform,
        utm_creative_format: order.utmCreativeFormat,
        utm_marketing_tactic: order.utmMarketingTactic,
        source_type: order.sourceType,
        referrer: order.referrer,
        device_type: order.deviceType,
        user_agent: order.userAgent,
        session_entry: order.sessionEntry,
        session_pages: order.sessionPages,
        session_count: order.sessionCount,
        session_start_time: order.sessionStartTime ? new Date(order.sessionStartTime).toISOString() : null,
        // Diagrams
        diagram_attachment_id: order.diagramAttachmentIds?.[0] || null,
        diagram_url: order.diagramUrls?.[0] || null,
        // Raw
        raw_line_items: order.rawLineItems,
        raw_csv_row: order.rawCsvRow,
      }
      
      // Insert order
      const { data: inserted, error } = await supabase
        .from('legacy_orders')
        .insert(legacyOrder)
        .select('id')
        .single()
      
      if (error) {
        console.log(`  ✗ Failed: ${error.message}`)
        failed++
        continue
      }
      
      console.log(`  ✓ Inserted: ${inserted.id}`)
      
      // Insert line items
      if (order.lineItems && order.lineItems.length > 0) {
        for (const item of order.lineItems) {
          const lineItem = {
            legacy_order_id: inserted.id,
            product_name: item.name,
            product_sku: item.sku || null,
            quantity: item.quantity,
            unit_price: item.quantity > 0 ? item.total / item.quantity : item.total,
            line_total: item.total,
            item_type: item.itemType,
            raw_meta: item.meta ? JSON.stringify(item.meta) : null,
          }
          
          const { error: lineError } = await supabase
            .from('legacy_line_items')
            .insert(lineItem)
          
          if (lineError) {
            console.log(`    Line item error: ${lineError.message}`)
          }
        }
        console.log(`    + ${order.lineItems.length} line items`)
      }
      
      success++
    } catch (err) {
      console.log(`  ✗ Exception: ${(err as Error).message}`)
      failed++
    }
  }
  
  console.log(`\n=== SAMPLE IMPORT COMPLETE ===`)
  console.log(`Success: ${success}`)
  console.log(`Failed: ${failed}`)
}

importSample().catch(console.error)
