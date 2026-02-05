/**
 * PayPal Capture API
 * 
 * Captures a PayPal order after customer approval.
 * This is the return URL after PayPal checkout.
 * 
 * Includes journey tracking:
 * - Links order to visitor/session
 * - Records first-touch and converting attribution
 * - Creates purchase_completed event
 */

import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') // PayPal adds this
    const orderId = searchParams.get('orderId')
    
    // Get tracking cookies
    const visitorId = request.cookies.get('mc_visitor_id')?.value
    const sessionId = request.cookies.get('mc_session_id')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/cart?error=missing_token', request.url))
    }

    // Capture the payment
    const captureResult = await capturePayPalOrder(token)

    if (captureResult.status !== 'COMPLETED') {
      console.error('Payment not completed:', captureResult.status)
      return NextResponse.redirect(new URL(`/cart?error=payment_${captureResult.status.toLowerCase()}`, request.url))
    }

    // Get Supabase clients
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    
    // ---------------------------------------------------------------------------
    // Get visitor and customer attribution data
    // ---------------------------------------------------------------------------
    let actualVisitorId: string | null = null
    let actualSessionId: string | null = null
    let customerId: string | null = null
    let firstUtmSource: string | null = null
    let firstUtmCampaign: string | null = null
    let convertingUtmSource: string | null = null
    let convertingUtmCampaign: string | null = null
    
    if (visitorId) {
      // Get visitor record
      const { data: visitor } = await adminSupabase
        .from('visitors')
        .select('id, customer_id, first_utm_source, first_utm_campaign')
        .eq('fingerprint', visitorId)
        .single()
      
      if (visitor) {
        actualVisitorId = visitor.id
        customerId = visitor.customer_id
        firstUtmSource = visitor.first_utm_source
        firstUtmCampaign = visitor.first_utm_campaign
      }
    }
    
    if (sessionId) {
      // Get session record for converting attribution
      const { data: session } = await adminSupabase
        .from('sessions')
        .select('id, utm_source, utm_campaign')
        .eq('id', sessionId)
        .single()
      
      if (session) {
        actualSessionId = session.id
        convertingUtmSource = session.utm_source
        convertingUtmCampaign = session.utm_campaign
      }
    }
    
    // If no customer yet, try to find/create by email
    if (!customerId && captureResult.payer.email_address) {
      const { data: existingCustomer } = await adminSupabase
        .from('customers')
        .select('id')
        .eq('email', captureResult.payer.email_address.toLowerCase())
        .single()
      
      customerId = existingCustomer?.id || null
    }

    // Create order in database with attribution
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
        customer_id: customerId,
        visitor_id: actualVisitorId,
        session_id: actualSessionId,
        first_utm_source: firstUtmSource,
        first_utm_campaign: firstUtmCampaign,
        converting_utm_source: convertingUtmSource,
        converting_utm_campaign: convertingUtmCampaign,
        order_source: 'online_self',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      // Still redirect to success - payment was captured
    }
    
    // ---------------------------------------------------------------------------
    // Track purchase_completed event
    // ---------------------------------------------------------------------------
    if (actualVisitorId) {
      await adminSupabase.from('journey_events').insert({
        visitor_id: actualVisitorId,
        session_id: actualSessionId,
        customer_id: customerId,
        event_type: 'purchase_completed',
        event_data: {
          order_id: order?.id,
          order_total: captureResult.amount,
          payment_method: 'paypal'
        }
      })
      
      // Update session as converted
      if (actualSessionId) {
        await adminSupabase
          .from('sessions')
          .update({
            converted: true,
            conversion_type: 'purchase',
            conversion_at: new Date().toISOString()
          })
          .eq('id', actualSessionId)
      }
      
      // Update customer status and first_purchase_at
      if (customerId) {
        await adminSupabase
          .from('customers')
          .update({
            customer_status: 'customer',
            first_purchase_at: new Date().toISOString()
          })
          .eq('id', customerId)
          .is('first_purchase_at', null) // Only if not already set
      }
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
    const { orderId, visitorId, sessionId } = body

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

    // Get Supabase clients
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    
    // Get visitor attribution data
    let actualVisitorId: string | null = null
    let actualSessionId: string | null = null
    let customerId: string | null = null
    let firstUtmSource: string | null = null
    let firstUtmCampaign: string | null = null
    let convertingUtmSource: string | null = null
    let convertingUtmCampaign: string | null = null
    
    if (visitorId) {
      const { data: visitor } = await adminSupabase
        .from('visitors')
        .select('id, customer_id, first_utm_source, first_utm_campaign')
        .eq('fingerprint', visitorId)
        .single()
      
      if (visitor) {
        actualVisitorId = visitor.id
        customerId = visitor.customer_id
        firstUtmSource = visitor.first_utm_source
        firstUtmCampaign = visitor.first_utm_campaign
      }
    }
    
    if (sessionId) {
      const { data: session } = await adminSupabase
        .from('sessions')
        .select('id, utm_source, utm_campaign')
        .eq('id', sessionId)
        .single()
      
      if (session) {
        actualSessionId = session.id
        convertingUtmSource = session.utm_source
        convertingUtmCampaign = session.utm_campaign
      }
    }

    // Create order in database with attribution
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
        customer_id: customerId,
        visitor_id: actualVisitorId,
        session_id: actualSessionId,
        first_utm_source: firstUtmSource,
        first_utm_campaign: firstUtmCampaign,
        converting_utm_source: convertingUtmSource,
        converting_utm_campaign: convertingUtmCampaign,
        order_source: 'online_self',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
    }
    
    // Track purchase event
    if (actualVisitorId) {
      await adminSupabase.from('journey_events').insert({
        visitor_id: actualVisitorId,
        session_id: actualSessionId,
        customer_id: customerId,
        event_type: 'purchase_completed',
        event_data: {
          order_id: order?.id,
          order_total: captureResult.amount,
          payment_method: 'paypal'
        }
      })
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
