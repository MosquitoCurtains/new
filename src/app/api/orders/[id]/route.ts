/**
 * GET /api/orders/[id]
 * 
 * Public-facing order lookup for order confirmation page.
 * Returns limited order data (no internal notes, salesperson info, etc.)
 * Uses admin client since customers are not authenticated.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, email, billing_first_name, billing_last_name, subtotal, tax_amount, shipping_amount, discount_amount, total, created_at, shipping_first_name, shipping_last_name, shipping_address_1, shipping_city, shipping_state, shipping_zip, shipping_country')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Fetch line items with options
    const { data: lineItems } = await supabase
      .from('line_items')
      .select('id, product_sku, product_name, quantity, width_inches, height_inches, length_feet, unit_price, line_total, panel_specs, line_item_options(option_name, option_value, option_display)')
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        email: order.email,
        customerFirstName: order.billing_first_name,
        customerLastName: order.billing_last_name,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax_amount) || 0,
        shipping: Number(order.shipping_amount) || 0,
        discount: Number(order.discount_amount) || 0,
        total: Number(order.total),
        createdAt: order.created_at,
        shippingAddress: {
          firstName: order.shipping_first_name,
          lastName: order.shipping_last_name,
          street: order.shipping_address_1,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          country: order.shipping_country,
        },
      },
      items: (lineItems || []).map((item) => ({
        id: item.id,
        name: item.product_name,
        sku: item.product_sku,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.line_total),
        widthInches: item.width_inches,
        heightInches: item.height_inches,
        lengthFeet: item.length_feet,
        specs: item.panel_specs,
        options: item.line_item_options || [],
      })),
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
