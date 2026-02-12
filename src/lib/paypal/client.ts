/**
 * PayPal REST API Client
 *
 * Server-side utility for processing payments via PayPal's Orders API.
 * Uses PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, and PAYPAL_MODE from env.
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

// =============================================================================
// AUTH
// =============================================================================

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Reuse token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal auth failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  }
  return data.access_token
}

// =============================================================================
// TYPES
// =============================================================================

export interface CardChargeRequest {
  /** Amount in USD (e.g. "125.50") */
  amount: string
  /** Card number (no spaces/dashes) */
  cardNumber: string
  /** Expiry in YYYY-MM format */
  expiry: string
  /** CVV/CVC */
  securityCode: string
  /** Cardholder name */
  cardholderName: string
  /** Billing address */
  billing: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    countryCode?: string
  }
  /** Our internal order/cart reference */
  invoiceId?: string
  /** Description shown on card statement */
  description?: string
}

export interface CardChargeResult {
  success: boolean
  transactionId: string
  status: string
  amount: string
  cardBrand?: string
  cardLastFour?: string
  rawResponse?: unknown
}

// =============================================================================
// CHARGE CARD
// =============================================================================

export async function chargeCard(req: CardChargeRequest): Promise<CardChargeResult> {
  const token = await getAccessToken()

  const payload = {
    intent: 'CAPTURE',
    payment_source: {
      card: {
        number: req.cardNumber.replace(/[\s-]/g, ''),
        expiry: req.expiry, // YYYY-MM
        security_code: req.securityCode,
        name: req.cardholderName,
        billing_address: {
          address_line_1: req.billing.addressLine1,
          ...(req.billing.addressLine2 ? { address_line_2: req.billing.addressLine2 } : {}),
          admin_area_2: req.billing.city,
          admin_area_1: req.billing.state,
          postal_code: req.billing.postalCode,
          country_code: req.billing.countryCode || 'US',
        },
      },
    },
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: req.amount,
        },
        ...(req.description ? { description: req.description } : {}),
        ...(req.invoiceId ? { invoice_id: req.invoiceId } : {}),
      },
    ],
  }

  // PayPal requires a unique idempotency key when payment_source is present
  const requestId = `mc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': requestId,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    // Extract meaningful error from PayPal response
    const details = data.details?.[0]
    const errorMsg = details?.description || details?.issue || data.message || `PayPal error (${res.status})`
    throw new Error(errorMsg)
  }

  // Extract capture details
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  const card = data.payment_source?.card

  return {
    success: data.status === 'COMPLETED',
    transactionId: capture?.id || data.id,
    status: data.status,
    amount: capture?.amount?.value || req.amount,
    cardBrand: card?.brand,
    cardLastFour: card?.last_digits,
    rawResponse: data,
  }
}
