/**
 * PayPal Webhook API
 * 
 * Handles PayPal IPN (Instant Payment Notification) events.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Get headers for signature verification
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value
    })

    // Verify webhook signature
    if (WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature({
        webhookId: WEBHOOK_ID,
        headers,
        body,
      })

      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const event = JSON.parse(body)
    const eventType = event.event_type
    const resource = event.resource

    console.log('PayPal webhook event:', eventType)

    // Get Supabase client
    const supabase = await createClient()

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        // Payment was successfully captured
        const paypalOrderId = resource.supplementary_data?.related_ids?.order_id
        const captureId = resource.id
        const amount = resource.amount?.value

        if (paypalOrderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              paypal_capture_id: captureId,
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_order_id', paypalOrderId)
        }
        break
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        // Payment was refunded
        const paypalOrderId = resource.supplementary_data?.related_ids?.order_id

        if (paypalOrderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'refunded',
              order_status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_order_id', paypalOrderId)
        }
        break
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        // Payment was denied
        const paypalOrderId = resource.supplementary_data?.related_ids?.order_id

        if (paypalOrderId) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'denied',
              order_status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_order_id', paypalOrderId)
        }
        break
      }

      case 'CHECKOUT.ORDER.APPROVED': {
        // Order was approved but not yet captured
        // This is informational - we handle capture in the return URL
        console.log('Order approved:', resource.id)
        break
      }

      default:
        console.log('Unhandled PayPal event:', eventType)
    }

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
