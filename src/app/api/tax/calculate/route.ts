/**
 * POST /api/tax/calculate
 * 
 * Calculate tax for a given address, subtotal, and shipping cost.
 * Used by the checkout flow to show real-time tax amounts.
 */

import { NextRequest, NextResponse } from 'next/server'
import { calculateTax } from '@/lib/pricing/tax'
import type { ShippingAddress } from '@/lib/pricing/shipping'

interface CalculateTaxRequest {
  address: {
    country: string
    state: string
    zip?: string
    city?: string
  }
  subtotal: number
  shipping: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateTaxRequest = await request.json()

    // Validate required fields
    if (!body.address?.country || !body.address?.state) {
      return NextResponse.json(
        { error: 'Address with country and state is required' },
        { status: 400 }
      )
    }

    if (typeof body.subtotal !== 'number' || body.subtotal < 0) {
      return NextResponse.json(
        { error: 'Valid subtotal is required' },
        { status: 400 }
      )
    }

    const address: ShippingAddress = {
      country: body.address.country,
      state: body.address.state,
      zip: body.address.zip,
      city: body.address.city,
    }

    const result = await calculateTax(
      address,
      body.subtotal,
      body.shipping || 0
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Tax calculation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate tax' },
      { status: 500 }
    )
  }
}
