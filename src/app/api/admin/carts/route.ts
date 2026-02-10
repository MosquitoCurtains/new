import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/carts
 * Create a new cart linked to a project.
 * Requires project_id. Inserts cart row + line_items + line_item_options.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      project_id,
      salesperson_id,
      salesperson_name,
      sales_mode,
      items,
      subtotal,
      tax_amount,
      shipping_amount,
      total,
      shipping_first_name,
      shipping_last_name,
      shipping_address_1,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
    } = body

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch project to get customer/email info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, email, customer_id, lead_id')
      .eq('id', project_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create the cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .insert({
        project_id,
        customer_id: project.customer_id || null,
        email: project.email,
        salesperson_id: salesperson_id || null,
        salesperson_name: salesperson_name || null,
        sales_mode: sales_mode || null,
        subtotal: subtotal || 0,
        tax_amount: tax_amount || 0,
        shipping_amount: shipping_amount || 0,
        total: total || 0,
        status: 'active',
        shipping_first_name: shipping_first_name || null,
        shipping_last_name: shipping_last_name || null,
        shipping_address_1: shipping_address_1 || null,
        shipping_city: shipping_city || null,
        shipping_state: shipping_state || null,
        shipping_zip: shipping_zip || null,
        shipping_country: shipping_country || 'US',
      })
      .select('*')
      .single()

    if (cartError || !cart) {
      console.error('Error creating cart:', cartError)
      return NextResponse.json(
        { error: 'Failed to create cart' },
        { status: 500 }
      )
    }

    // Insert line items if provided
    if (items && items.length > 0) {
      const lineItems = items.map((item: LineItemInput) => ({
        cart_id: cart.id,
        product_id: item.product_id,
        product_sku: item.product_sku,
        product_name: item.product_name,
        quantity: item.quantity || 1,
        width_inches: item.width_inches || null,
        height_inches: item.height_inches || null,
        length_feet: item.length_feet || null,
        unit_price: item.unit_price,
        line_total: item.line_total,
        adjustment_type: item.adjustment_type || null,
        adjustment_reason: item.adjustment_reason || null,
        panel_specs: item.panel_specs || {},
        original_bundle_name: item.original_bundle_name || null,
      }))

      const { data: insertedItems, error: itemsError } = await supabase
        .from('line_items')
        .insert(lineItems)
        .select('id')

      if (itemsError) {
        console.error('Error inserting line items:', itemsError)
        // Cart was created, items failed — return partial success
        return NextResponse.json({
          success: true,
          cart,
          warning: 'Cart created but some line items failed to insert',
        })
      }

      // Insert line item options if provided
      if (insertedItems) {
        const allOptions: Array<{
          line_item_id: string
          option_name: string
          option_value: string
          option_display: string | null
          price_impact: number
        }> = []

        items.forEach((item: LineItemInput, index: number) => {
          if (item.options && insertedItems[index]) {
            item.options.forEach((opt: LineItemOptionInput) => {
              allOptions.push({
                line_item_id: insertedItems[index].id,
                option_name: opt.option_name,
                option_value: opt.option_value,
                option_display: opt.option_display || null,
                price_impact: opt.price_impact || 0,
              })
            })
          }
        })

        if (allOptions.length > 0) {
          await supabase.from('line_item_options').insert(allOptions)
        }
      }
    }

    // Update project estimated_total and status
    await supabase
      .from('projects')
      .update({
        estimated_total: total || 0,
        status: 'working_on_quote',
      })
      .eq('id', project_id)

    return NextResponse.json({ success: true, cart })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/carts
 * List carts with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    const salespersonId = searchParams.get('salesperson_id')

    const supabase = createAdminClient()

    let query = supabase
      .from('carts')
      .select(`
        *,
        projects!project_id (
          id, email, first_name, last_name, phone, product_type,
          status, share_token, assigned_to, notes,
          leads!lead_id (id, email, first_name, last_name, phone, status)
        )
      `)
      .order('updated_at', { ascending: false })

    if (projectId) query = query.eq('project_id', projectId)
    if (status) query = query.eq('status', status)
    if (salespersonId) query = query.eq('salesperson_id', salespersonId)

    const { data, error } = await query.limit(100)

    if (error) {
      console.error('Error fetching carts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch carts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ carts: data || [] })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Type helpers for request body
interface LineItemOptionInput {
  option_name: string
  option_value: string
  option_display?: string
  price_impact?: number
}

interface LineItemInput {
  product_id: string
  product_sku: string
  product_name: string
  quantity?: number
  width_inches?: number
  height_inches?: number
  length_feet?: number
  unit_price: number
  line_total: number
  adjustment_type?: string
  adjustment_reason?: string
  panel_specs?: Record<string, unknown>
  original_bundle_name?: string
  options?: LineItemOptionInput[]
}
