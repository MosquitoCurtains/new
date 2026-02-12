import { NextRequest, NextResponse } from 'next/server'
import { chargeCard } from '@/lib/paypal/client'

/**
 * POST /api/admin/payments/charge
 *
 * Process a credit card payment via PayPal for phone orders.
 * Called from the PhoneOrderModal before creating the order.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      card_number,
      card_expiry,
      card_cvc,
      cardholder_name,
      billing_address_1,
      billing_address_2,
      billing_city,
      billing_state,
      billing_zip,
      invoice_id,
      description,
    } = body

    // Validate required fields
    if (!amount || !card_number || !card_expiry || !card_cvc) {
      return NextResponse.json(
        { error: 'Missing required card fields' },
        { status: 400 }
      )
    }

    const result = await chargeCard({
      amount: String(amount),
      cardNumber: card_number,
      expiry: card_expiry,
      securityCode: card_cvc,
      cardholderName: cardholder_name || '',
      billing: {
        addressLine1: billing_address_1 || '',
        addressLine2: billing_address_2 || undefined,
        city: billing_city || '',
        state: billing_state || '',
        postalCode: billing_zip || '',
      },
      invoiceId: invoice_id || undefined,
      description: description || 'Mosquito Curtains Phone Order',
    })

    if (!result.success) {
      return NextResponse.json(
        { error: `Payment ${result.status}: charge was not completed` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction_id: result.transactionId,
      status: result.status,
      amount: result.amount,
      card_brand: result.cardBrand,
      card_last_four: result.cardLastFour,
    })
  } catch (error) {
    console.error('Payment charge error:', error)
    const message = error instanceof Error ? error.message : 'Payment processing failed'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
