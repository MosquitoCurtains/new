/**
 * PayPal Create Order API
 * 
 * Creates a PayPal order from the shopping cart.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'

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

    // Create PayPal order
    const { orderId, approvalUrl } = await createPayPalOrder({
      items: paypalItems,
      subtotal: cartData.subtotal,
      shipping: cartData.shipping,
      tax: cartData.tax || 0,
      total: cartData.total,
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
