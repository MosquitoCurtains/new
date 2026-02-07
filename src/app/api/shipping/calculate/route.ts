/**
 * POST /api/shipping/calculate
 * 
 * Calculate shipping cost for a given address and cart contents.
 * Used by the checkout flow to show real-time shipping costs.
 */

import { NextRequest, NextResponse } from 'next/server'
import { calculateShipping } from '@/lib/pricing/shipping'
import type { ShippingAddress } from '@/lib/pricing/shipping'

interface CalculateShippingRequest {
  address: {
    country: string
    state: string
    zip?: string
    city?: string
  }
  hasVinyl: boolean
  hasTrack: boolean
  subtotal: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateShippingRequest = await request.json()

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

    const result = await calculateShipping({
      address,
      hasVinyl: body.hasVinyl || false,
      hasTrack: body.hasTrack || false,
      subtotal: body.subtotal,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Shipping calculation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate shipping' },
      { status: 500 }
    )
  }
}
