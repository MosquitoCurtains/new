import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/orders
 * Create an order from a cart. Copies line items, updates statuses.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cart_id,
      payment_method,
      payment_transaction_id,
      payment_status: requestedPaymentStatus,
      billing_first_name,
      billing_last_name,
      billing_phone,
      billing_email,
      billing_address_1,
      billing_address_2,
      billing_city,
      billing_state,
      billing_zip,
      billing_country,
      shipping_first_name: reqShipFirst,
      shipping_last_name: reqShipLast,
      shipping_address_1: reqShipAddr1,
      shipping_address_2: reqShipAddr2,
      shipping_city: reqShipCity,
      shipping_state: reqShipState,
      shipping_zip: reqShipZip,
      internal_note,
      order_source: reqOrderSource,
    } = body

    if (!cart_id) {
      return NextResponse.json(
        { error: 'cart_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch cart with project info
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        *,
        projects!project_id (
          id, email, first_name, last_name, phone, lead_id, customer_id
        )
      `)
      .eq('id', cart_id)
      .single()

    if (cartError || !cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const project = (cart as Record<string, unknown>).projects as Record<string, unknown> | null

    // Generate order number using the DB function
    const { data: orderNumData } = await supabase.rpc('generate_order_number')
    const orderNumber = orderNumData || `MC${new Date().getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-5)}`

    // Determine payment status and initial order status
    const finalPaymentStatus = requestedPaymentStatus || 'pending'
    const initialOrderStatus = finalPaymentStatus === 'paid' ? 'processing' : 'pending'

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: project?.customer_id as string || cart.customer_id || null,
        email: billing_email || project?.email as string || cart.email || '',
        billing_first_name: billing_first_name || project?.first_name as string || null,
        billing_last_name: billing_last_name || project?.last_name as string || null,
        billing_phone: billing_phone || project?.phone as string || null,
        billing_address_1: billing_address_1 || null,
        billing_address_2: billing_address_2 || null,
        billing_city: billing_city || null,
        billing_state: billing_state || null,
        billing_zip: billing_zip || null,
        billing_country: billing_country || 'US',
        shipping_first_name: reqShipFirst || cart.shipping_first_name || billing_first_name || project?.first_name as string || null,
        shipping_last_name: reqShipLast || cart.shipping_last_name || billing_last_name || project?.last_name as string || null,
        shipping_address_1: reqShipAddr1 || cart.shipping_address_1 || billing_address_1 || null,
        shipping_address_2: reqShipAddr2 || cart.shipping_address_2 || billing_address_2 || null,
        shipping_city: reqShipCity || cart.shipping_city || billing_city || null,
        shipping_state: reqShipState || cart.shipping_state || billing_state || null,
        shipping_zip: reqShipZip || cart.shipping_zip || billing_zip || null,
        shipping_country: cart.shipping_country || billing_country || 'US',
        status: initialOrderStatus,
        subtotal: cart.subtotal || 0,
        tax_amount: cart.tax_amount || 0,
        shipping_amount: cart.shipping_amount || 0,
        total: cart.total || 0,
        payment_method: payment_method || null,
        payment_transaction_id: payment_transaction_id || null,
        payment_status: finalPaymentStatus,
        paid_at: finalPaymentStatus === 'paid' ? new Date().toISOString() : null,
        salesperson_id: cart.salesperson_id || null,
        salesperson_name: cart.salesperson_name || null,
        project_id: cart.project_id || null,
        cart_id: cart.id,
        source: 'admin',
        order_source: reqOrderSource || 'admin_sales',
        internal_note: internal_note || null,
      })
      .select('*')
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Copy line items from cart to order
    const { data: cartItems } = await supabase
      .from('line_items')
      .select('*, line_item_options(*)')
      .eq('cart_id', cart_id)

    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        const { data: newItem } = await supabase
          .from('line_items')
          .insert({
            order_id: order.id,
            cart_id: cart_id, // Keep reference to original cart
            product_id: item.product_id,
            product_sku: item.product_sku,
            product_name: item.product_name,
            quantity: item.quantity,
            width_inches: item.width_inches,
            height_inches: item.height_inches,
            length_feet: item.length_feet,
            unit_price: item.unit_price,
            line_total: item.line_total,
            adjustment_type: item.adjustment_type,
            adjustment_reason: item.adjustment_reason,
            panel_specs: item.panel_specs,
            original_bundle_name: item.original_bundle_name,
          })
          .select('id')
          .single()

        // Copy options
        if (newItem && item.line_item_options && item.line_item_options.length > 0) {
          const options = item.line_item_options.map((opt: Record<string, unknown>) => ({
            line_item_id: newItem.id,
            option_name: opt.option_name,
            option_value: opt.option_value,
            option_display: opt.option_display || null,
            price_impact: opt.price_impact || 0,
          }))
          await supabase.from('line_item_options').insert(options)
        }
      }
    }

    // Update cart status to converted
    await supabase
      .from('carts')
      .update({ status: 'converted' })
      .eq('id', cart_id)

    // Update project status to order_placed
    if (cart.project_id) {
      await supabase
        .from('projects')
        .update({ status: 'order_placed' })
        .eq('id', cart.project_id)
    }

    return NextResponse.json({
      success: true,
      order,
      order_number: orderNumber,
    })
  } catch (error) {
    console.error('Order POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/orders
 * List orders with filters and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const salesperson = searchParams.get('salesperson')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (salesperson) query = query.eq('salesperson_name', salesperson)
    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,email.ilike.%${search}%,billing_first_name.ilike.%${search}%,billing_last_name.ilike.%${search}%`
      )
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orders: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
