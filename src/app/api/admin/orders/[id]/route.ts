import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/orders/[id]
 * Fetch full order with line items, options, notes, and tracking numbers.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Fetch line items with options
    const { data: lineItems } = await supabase
      .from('line_items')
      .select('*, line_item_options(*)')
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    // Fetch notes
    const { data: notes } = await supabase
      .from('order_notes')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    // Fetch tracking numbers
    const { data: trackingNumbers } = await supabase
      .from('order_tracking_numbers')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    // Fetch project info if linked
    let project = null
    if (order.project_id) {
      const { data } = await supabase
        .from('projects')
        .select(`
          id, email, first_name, last_name, phone, product_type,
          status, share_token, notes,
          leads!lead_id (id, email, first_name, last_name, phone)
        `)
        .eq('id', order.project_id)
        .single()
      project = data
    }

    return NextResponse.json({
      order,
      lineItems: lineItems || [],
      notes: notes || [],
      trackingNumbers: trackingNumbers || [],
      project,
    })
  } catch (error) {
    console.error('Order GET [id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Update order status, fields, diagram_url, etc.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = createAdminClient()

    // Build update payload with allowed fields
    const allowedFields = [
      'status', 'payment_status', 'payment_method', 'payment_transaction_id',
      'paid_at', 'shipped_at', 'diagram_url', 'customer_note', 'internal_note',
      'salesperson_name', 'salesperson_id', 'salesperson_username',
      'billing_first_name', 'billing_last_name', 'billing_phone',
      'billing_address_1', 'billing_address_2', 'billing_city',
      'billing_state', 'billing_zip', 'billing_country',
      'shipping_first_name', 'shipping_last_name', 'shipping_phone',
      'shipping_address_1', 'shipping_address_2', 'shipping_city',
      'shipping_state', 'shipping_zip', 'shipping_country',
      'discount_amount',
    ]

    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field]
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !order) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
