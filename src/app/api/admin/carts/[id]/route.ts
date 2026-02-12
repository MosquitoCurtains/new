import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/carts/[id]
 * Fetch a single cart with line items, options, and project/lead info.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch cart with project join
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        *,
        projects!project_id (
          id, email, first_name, last_name, phone, product_type,
          status, share_token, assigned_to, notes, cart_data, estimated_total,
          leads!lead_id (id, email, first_name, last_name, phone, status, interest)
        )
      `)
      .eq('id', id)
      .single()

    if (cartError || !cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    // Fetch line items with their options
    const { data: lineItems } = await supabase
      .from('line_items')
      .select(`
        *,
        line_item_options (*)
      `)
      .eq('cart_id', id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      cart,
      lineItems: lineItems || [],
    })
  } catch (error) {
    console.error('Cart GET [id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/carts/[id]
 * Update cart: items, totals, salesperson, status, shipping address.
 * Also syncs project cart_data and estimated_total.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      salesperson_id,
      sales_mode,
      items,
      subtotal,
      tax_amount,
      shipping_amount,
      total,
      status,
      shipping_first_name,
      shipping_last_name,
      shipping_address_1,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
    } = body

    const supabase = createAdminClient()

    // Build cart update payload (totals set to 0 initially — recomputed after line items)
    const cartUpdate: Record<string, unknown> = {}
    if (salesperson_id !== undefined) cartUpdate.salesperson_id = salesperson_id
    if (sales_mode !== undefined) cartUpdate.sales_mode = sales_mode
    if (status !== undefined) cartUpdate.status = status
    if (shipping_first_name !== undefined) cartUpdate.shipping_first_name = shipping_first_name
    if (shipping_last_name !== undefined) cartUpdate.shipping_last_name = shipping_last_name
    if (shipping_address_1 !== undefined) cartUpdate.shipping_address_1 = shipping_address_1
    if (shipping_city !== undefined) cartUpdate.shipping_city = shipping_city
    if (shipping_state !== undefined) cartUpdate.shipping_state = shipping_state
    if (shipping_zip !== undefined) cartUpdate.shipping_zip = shipping_zip
    if (shipping_country !== undefined) cartUpdate.shipping_country = shipping_country

    // Update cart row (metadata fields only, totals updated after line items)
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .update(cartUpdate)
      .eq('id', id)
      .select('*, projects!project_id (id)')
      .single()

    if (cartError || !cart) {
      console.error('Error updating cart:', cartError)
      return NextResponse.json(
        { error: `Failed to update cart: ${cartError?.message || 'Unknown DB error'}` },
        { status: 500 }
      )
    }

    // Replace line items if provided
    let actualSubtotal = 0
    let lineItemsInserted = false
    if (items !== undefined) {
      // Delete existing line items (cascade deletes options)
      await supabase.from('line_items').delete().eq('cart_id', id)

      if (items.length > 0) {
        // Resolve product UUIDs from SKUs
        const skus = [...new Set(items.map((i: LineItemInput) => i.product_sku).filter(Boolean))]
        const { data: products } = skus.length > 0
          ? await supabase.from('products').select('id, sku').in('sku', skus)
          : { data: [] }
        const skuToId: Record<string, string> = {}
        for (const p of (products || [])) {
          skuToId[p.sku] = p.id
        }

        const lineItems = items.map((item: LineItemInput) => ({
          cart_id: id,
          product_id: skuToId[item.product_sku] || null,
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
          .select('id, line_total')

        if (itemsError) {
          console.error('Error inserting line items (PUT):', itemsError)
          // Zero out cart totals since items failed
          await supabase.from('carts').update({ subtotal: 0, tax_amount: 0, shipping_amount: 0, total: 0 }).eq('id', id)
          return NextResponse.json({
            success: true,
            cart,
            warning: `Cart updated but line items failed: ${itemsError.message}`,
          })
        }

        // Compute actual subtotal from what was inserted
        actualSubtotal = (insertedItems || []).reduce(
          (sum, row) => sum + (Number(row.line_total) || 0), 0
        )
        lineItemsInserted = true

        // Insert options
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
    }

    // Compute final totals from successfully inserted line items
    const finalShipping = actualSubtotal > 0 ? (shipping_amount || 0) : 0
    const finalTax = actualSubtotal > 0 ? (tax_amount || 0) : 0
    const finalTotal = actualSubtotal + finalShipping + finalTax

    // Update cart with actual totals derived from line items
    const { data: finalCart } = await supabase
      .from('carts')
      .update({
        subtotal: actualSubtotal,
        tax_amount: finalTax,
        shipping_amount: finalShipping,
        total: finalTotal,
      })
      .eq('id', id)
      .select('*')
      .single()

    // Sync project estimated_total and cart_data
    const projectId = (cart as Record<string, unknown> & { projects?: { id: string } }).projects?.id || (cart as Record<string, unknown>).project_id
    if (projectId) {
      // Build a simplified cart_data snapshot from inserted items
      const cartDataSnapshot = lineItemsInserted
        ? (items || []).map((item: LineItemInput) => ({
            sku: item.product_sku,
            name: item.product_name,
            qty: item.quantity || 1,
            price: item.line_total,
          }))
        : []

      await supabase
        .from('projects')
        .update({
          estimated_total: finalTotal,
          cart_data: cartDataSnapshot,
        })
        .eq('id', projectId)
    }

    return NextResponse.json({ success: true, cart: finalCart || cart })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/carts/[id]
 * Soft-delete cart (set status to abandoned).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('carts')
      .update({ status: 'abandoned' })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Type helpers
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
