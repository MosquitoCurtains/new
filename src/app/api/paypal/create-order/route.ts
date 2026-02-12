/**
 * PayPal Create Order API
 * 
 * Creates a PayPal order from the shopping cart.
 * Saves the cart to database first so we can load it during capture.
 * Server-side validates shipping and tax before sending to PayPal.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/paypal'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateShipping } from '@/lib/pricing/shipping'
import { calculateTax } from '@/lib/pricing/tax'
import { getShippingClassForItem } from '@/lib/pricing/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart } = body

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const cartData = cart

    // Server-side shipping/tax validation
    const address = cartData.shippingAddress
    let shipping = cartData.shipping || 0
    let tax = cartData.tax || 0

    if (address?.country && address?.state) {
      // Detect shipping classes from cart items
      let hasVinyl = false
      let hasTrack = false
      for (const item of cartData.items) {
        const cls = getShippingClassForItem({ type: item.type, productSku: item.productSku })
        if (cls === 'clear_vinyl') hasVinyl = true
        if (cls === 'straight_track') hasTrack = true
      }

      // Recalculate server-side to prevent tampering
      const shippingResult = await calculateShipping({
        address: {
          country: address.country,
          state: address.state,
          zip: address.zip,
          city: address.city,
        },
        hasVinyl,
        hasTrack,
        subtotal: cartData.subtotal,
      })

      const taxResult = await calculateTax(
        {
          country: address.country,
          state: address.state,
          zip: address.zip,
          city: address.city,
        },
        cartData.subtotal,
        shippingResult.total
      )

      shipping = shippingResult.total
      tax = taxResult.taxAmount
    }

    const total = cartData.subtotal + shipping + tax

    // =========================================================================
    // Save cart to database so we can load it during capture
    // =========================================================================
    const adminSupabase = createAdminClient()

    const { data: dbCart, error: cartError } = await adminSupabase
      .from('carts')
      .insert({
        email: cartData.contact?.email || null,
        status: 'checkout',
        subtotal: cartData.subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        total,
        shipping_first_name: cartData.contact?.firstName || address?.firstName || null,
        shipping_last_name: cartData.contact?.lastName || address?.lastName || null,
        shipping_address_1: address?.street || null,
        shipping_city: address?.city || null,
        shipping_state: address?.state || null,
        shipping_zip: address?.zip || null,
        shipping_country: address?.country || 'US',
      })
      .select('id')
      .single()

    if (cartError || !dbCart) {
      console.error('Error saving cart to DB:', cartError)
      return NextResponse.json(
        { error: 'Failed to save cart' },
        { status: 500 }
      )
    }

    // Resolve product UUIDs from SKUs
    const skus = [...new Set(
      cartData.items
        .map((i: { productSku: string }) => i.productSku)
        .filter(Boolean)
    )]
    const { data: products } = skus.length > 0
      ? await adminSupabase.from('products').select('id, sku').in('sku', skus)
      : { data: [] }
    const skuToId: Record<string, string> = {}
    for (const p of (products || [])) {
      skuToId[p.sku] = p.id
    }

    // Insert line items
    const lineItems = cartData.items.map((item: {
      productSku: string
      name: string
      description: string
      quantity: number
      unitPrice: number
      totalPrice: number
      type: string
      options?: Record<string, string | number | boolean>
    }) => ({
      cart_id: dbCart.id,
      product_id: skuToId[item.productSku] || null,
      product_sku: item.productSku,
      product_name: item.name,
      quantity: item.quantity || 1,
      unit_price: item.unitPrice,
      line_total: item.totalPrice,
      panel_specs: item.options || {},
    }))

    const { data: insertedItems, error: itemsError } = await adminSupabase
      .from('line_items')
      .insert(lineItems)
      .select('id')

    if (itemsError) {
      console.error('Error saving line items:', itemsError)
      // Non-blocking: cart was created, line items failed
    }

    // Insert line item options if items have options
    if (insertedItems) {
      const allOptions: Array<{
        line_item_id: string
        option_name: string
        option_value: string
        option_display: string | null
        price_impact: number
      }> = []

      cartData.items.forEach((item: {
        options?: Record<string, string | number | boolean>
      }, index: number) => {
        if (item.options && insertedItems[index]) {
          Object.entries(item.options).forEach(([key, value]) => {
            allOptions.push({
              line_item_id: insertedItems[index].id,
              option_name: key,
              option_value: String(value),
              option_display: null,
              price_impact: 0,
            })
          })
        }
      })

      if (allOptions.length > 0) {
        await adminSupabase.from('line_item_options').insert(allOptions)
      }
    }

    // =========================================================================
    // Convert cart items to PayPal format
    // =========================================================================
    const paypalItems = cartData.items.map((item: {
      name: string
      description: string
      productSku: string
      unitPrice: number
      quantity: number
    }) => ({
      name: item.name.substring(0, 127), // PayPal limit
      description: item.description?.substring(0, 127) || '',
      sku: item.productSku,
      unit_amount: {
        currency_code: 'USD',
        value: item.unitPrice.toFixed(2),
      },
      quantity: item.quantity.toString(),
      category: 'PHYSICAL_GOODS' as const,
    }))

    // Get the base URL from the request
    const baseUrl = request.headers.get('origin') || 
                   `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`

    // Create PayPal order with validated amounts — pass cart_id in return URL
    const { orderId, approvalUrl } = await createPayPalOrder({
      items: paypalItems,
      subtotal: cartData.subtotal,
      shipping,
      tax,
      total,
      returnUrl: `${baseUrl}/api/paypal/capture?cartId=${dbCart.id}`,
      cancelUrl: `${baseUrl}/cart?cancelled=true`,
      reference: dbCart.id,
    })

    // Store the PayPal order ID on the cart for reference
    await adminSupabase
      .from('carts')
      .update({ session_id: orderId })
      .eq('id', dbCart.id)

    return NextResponse.json({
      orderId,
      approvalUrl,
      cartId: dbCart.id,
    })
  } catch (error) {
    console.error('PayPal create order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
