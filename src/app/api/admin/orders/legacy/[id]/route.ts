import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/orders/legacy/[id]
 * Fetch a single legacy (WooCommerce) order by its UUID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: legacy, error } = await supabase
      .from('legacy_orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !legacy) {
      return NextResponse.json(
        { error: 'Legacy order not found' },
        { status: 404 }
      )
    }

    // Parse raw_line_items into a structured array for display
    // Format: "id:179498|name:Attachment Items|product_id:16444|sku:|quantity:2|subtotal:4.00|..."
    const lineItems = parseRawLineItems(legacy.raw_line_items)

    // Normalize to a shape close to the standard Order interface
    const order = {
      id: legacy.id,
      order_number: legacy.order_number,
      woo_order_id: legacy.woo_order_id,
      email: legacy.email,
      status: legacy.status,
      payment_status: legacy.transaction_id ? 'paid' : 'unknown',
      payment_method: legacy.payment_method_title || legacy.payment_method || null,
      payment_transaction_id: legacy.transaction_id || null,
      subtotal: legacy.subtotal || 0,
      tax_amount: legacy.tax || 0,
      shipping_amount: legacy.shipping || 0,
      discount_amount: legacy.discount || 0,
      total: legacy.total || 0,
      salesperson_name: legacy.salesperson_username || null,
      diagram_url: legacy.diagram_url || null,
      created_at: legacy.order_date,
      imported_at: legacy.imported_at,
      billing_first_name: legacy.billing_first_name || null,
      billing_last_name: legacy.billing_last_name || null,
      billing_phone: legacy.billing_phone || null,
      billing_address_1: legacy.billing_address_1 || null,
      billing_city: legacy.billing_city || null,
      billing_state: legacy.billing_state || null,
      billing_zip: legacy.billing_zip || null,
      shipping_first_name: legacy.shipping_first_name || null,
      shipping_last_name: legacy.shipping_last_name || null,
      shipping_address_1: legacy.shipping_address_1 || null,
      shipping_city: legacy.shipping_city || null,
      shipping_state: legacy.shipping_state || null,
      shipping_zip: legacy.shipping_zip || null,
      // UTM / attribution
      utm_source: legacy.utm_source || null,
      utm_medium: legacy.utm_medium || null,
      utm_campaign: legacy.utm_campaign || null,
      source_type: legacy.source_type || null,
      device_type: legacy.device_type || null,
      session_entry: legacy.session_entry || null,
      session_pages: legacy.session_pages || null,
      // Linkage
      new_order_id: legacy.new_order_id || null,
      customer_id: legacy.customer_id || null,
      // Flag
      source: 'legacy' as const,
    }

    return NextResponse.json({
      order,
      lineItems,
      source: 'legacy',
    })
  } catch (error) {
    console.error('Legacy order GET [id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Parse the raw_line_items text field from WooCommerce CSV import.
 * Each line item is separated by "; " and fields by "|" with "key:value" pairs.
 */
function parseRawLineItems(raw: string | null): Array<{
  name: string
  sku: string
  quantity: number
  subtotal: number
  product_id: string
  meta: string
}> {
  if (!raw) return []

  // Items are separated by "; " (semicolon + space) when there are multiple
  const items = raw.split(/;\s*(?=id:)/)

  return items.map((itemStr) => {
    const fields: Record<string, string> = {}
    // Split by | and parse key:value
    const parts = itemStr.split('|')
    for (const part of parts) {
      const colonIdx = part.indexOf(':')
      if (colonIdx > 0) {
        const key = part.substring(0, colonIdx).trim()
        const value = part.substring(colonIdx + 1).trim()
        fields[key] = value
      }
    }

    return {
      name: fields['name'] || 'Unknown Item',
      sku: fields['sku'] || '',
      quantity: parseInt(fields['quantity'] || '1', 10),
      subtotal: parseFloat(fields['subtotal'] || '0'),
      product_id: fields['product_id'] || '',
      meta: fields['meta'] || '',
    }
  })
}
