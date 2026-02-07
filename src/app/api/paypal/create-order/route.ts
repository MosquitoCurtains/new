/**
 * PayPal Create Order API
 * 
 * Creates a PayPal order from the shopping cart.
 * Server-side validates shipping and tax before sending to PayPal.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'
import { calculateShipping } from '@/lib/pricing/shipping'
import { calculateTax } from '@/lib/pricing/tax'
import { getShippingClassForItem } from '@/lib/pricing/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, cart } = body

    if (!cart && !cartId) {
      return NextResponse.json(
        { error: 'Cart ID or cart data required' },
        { status: 400 }
      )
    }

    // If we have cart data directly, use it
    // Otherwise, we would fetch from database by cartId
    const cartData = cart

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

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

    // Convert cart items to PayPal format
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

    // Create PayPal order with validated amounts
    const { orderId, approvalUrl } = await createPayPalOrder({
      items: paypalItems,
      subtotal: cartData.subtotal,
      shipping,
      tax,
      total,
      returnUrl: `${baseUrl}/api/paypal/capture?orderId=${cartId || 'cart'}`,
      cancelUrl: `${baseUrl}/cart?cancelled=true`,
      reference: cartId || `cart-${Date.now()}`,
    })

    // Store the PayPal order ID for later capture
    // In a production app, save this to database
    
    return NextResponse.json({
      orderId,
      approvalUrl,
    })
  } catch (error) {
    console.error('PayPal create order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
