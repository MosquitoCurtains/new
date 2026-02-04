/**
 * PayPal Capture API
 * 
 * Captures a PayPal order after customer approval.
 * This is the return URL after PayPal checkout.
 */

import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') // PayPal adds this
    const orderId = searchParams.get('orderId')

    if (!token) {
      return NextResponse.redirect(new URL('/cart?error=missing_token', request.url))
    }

    // Capture the payment
    const captureResult = await capturePayPalOrder(token)

    if (captureResult.status !== 'COMPLETED') {
      console.error('Payment not completed:', captureResult.status)
      return NextResponse.redirect(new URL(`/cart?error=payment_${captureResult.status.toLowerCase()}`, request.url))
    }

    // Get Supabase client
    const supabase = await createClient()

    // Create order in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .insert({
        paypal_order_id: token,
        paypal_capture_id: captureResult.captureId,
        payment_status: 'paid',
        order_status: 'processing',
        total_amount: parseFloat(captureResult.amount),
        customer_email: captureResult.payer.email_address,
        customer_first_name: captureResult.payer.name?.given_name,
        customer_last_name: captureResult.payer.name?.surname,
        payer_id: captureResult.payer.payer_id,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      // Still redirect to success - payment was captured
    }

    // Redirect to order confirmation
    const confirmationOrderId = order?.id || token
    return NextResponse.redirect(new URL(`/order/${confirmationOrderId}?success=true`, request.url))
    
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.redirect(new URL('/cart?error=capture_failed', request.url))
  }
}

// Also handle POST for programmatic captures
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    const captureResult = await capturePayPalOrder(orderId)

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Payment ${captureResult.status}` },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabase = await createClient()

    // Create order in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .insert({
        paypal_order_id: orderId,
        paypal_capture_id: captureResult.captureId,
        payment_status: 'paid',
        order_status: 'processing',
        total_amount: parseFloat(captureResult.amount),
        customer_email: captureResult.payer.email_address,
        customer_first_name: captureResult.payer.name?.given_name,
        customer_last_name: captureResult.payer.name?.surname,
        payer_id: captureResult.payer.payer_id,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
    }

    return NextResponse.json({
      success: true,
      orderId: order?.id,
      captureId: captureResult.captureId,
      amount: captureResult.amount,
    })
    
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to capture payment' },
      { status: 500 }
    )
  }
}
