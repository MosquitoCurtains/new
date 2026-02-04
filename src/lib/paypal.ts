/**
 * PayPal API Client
 * 
 * Server-side PayPal integration for order creation and capture.
 */

// =============================================================================
// TYPES
// =============================================================================

interface PayPalAccessToken {
  access_token: string
  token_type: string
  expires_in: number
}

interface PayPalOrderItem {
  name: string
  description?: string
  sku?: string
  unit_amount: {
    currency_code: string
    value: string
  }
  quantity: string
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION'
}

interface PayPalCreateOrderResponse {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

interface PayPalCaptureResponse {
  id: string
  status: string
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
      }>
    }
  }>
  payer: {
    email_address: string
    payer_id: string
    name: {
      given_name: string
      surname: string
    }
    address?: {
      country_code: string
    }
  }
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'

const PAYPAL_API_BASE = PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }

  const data: PayPalAccessToken = await response.json()
  return data.access_token
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(params: {
  items: PayPalOrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  returnUrl: string
  cancelUrl: string
  reference?: string
}): Promise<{ orderId: string; approvalUrl: string }> {
  const accessToken = await getAccessToken()

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: params.reference || `order-${Date.now()}`,
      description: 'Mosquito Curtains Order',
      amount: {
        currency_code: 'USD',
        value: params.total.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: params.subtotal.toFixed(2),
          },
          shipping: {
            currency_code: 'USD',
            value: params.shipping.toFixed(2),
          },
          tax_total: {
            currency_code: 'USD',
            value: params.tax.toFixed(2),
          },
        },
      },
      items: params.items,
    }],
    application_context: {
      brand_name: 'Mosquito Curtains',
      landing_page: 'BILLING',
      shipping_preference: 'GET_FROM_FILE',
      user_action: 'PAY_NOW',
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
    },
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create PayPal order: ${error}`)
  }

  const data: PayPalCreateOrderResponse = await response.json()
  
  const approvalLink = data.links.find(link => link.rel === 'approve')
  if (!approvalLink) {
    throw new Error('No approval URL in PayPal response')
  }

  return {
    orderId: data.id,
    approvalUrl: approvalLink.href,
  }
}

/**
 * Capture a PayPal order after approval
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  captureId: string
  status: string
  amount: string
  payer: PayPalCaptureResponse['payer']
}> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to capture PayPal order: ${error}`)
  }

  const data: PayPalCaptureResponse = await response.json()
  const capture = data.purchase_units[0]?.payments?.captures?.[0]

  if (!capture) {
    throw new Error('No capture data in PayPal response')
  }

  return {
    captureId: capture.id,
    status: capture.status,
    amount: capture.amount.value,
    payer: data.payer,
  }
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyWebhookSignature(params: {
  webhookId: string
  headers: Record<string, string>
  body: string
}): Promise<boolean> {
  const accessToken = await getAccessToken()

  const verificationData = {
    auth_algo: params.headers['paypal-auth-algo'],
    cert_url: params.headers['paypal-cert-url'],
    transmission_id: params.headers['paypal-transmission-id'],
    transmission_sig: params.headers['paypal-transmission-sig'],
    transmission_time: params.headers['paypal-transmission-time'],
    webhook_id: params.webhookId,
    webhook_event: JSON.parse(params.body),
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationData),
  })

  if (!response.ok) {
    console.error('Webhook verification failed:', await response.text())
    return false
  }

  const data = await response.json()
  return data.verification_status === 'SUCCESS'
}
