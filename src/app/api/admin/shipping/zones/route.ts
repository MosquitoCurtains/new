// @ts-nocheck — shipping tables not in generated Supabase types yet
/**
 * GET /api/admin/shipping/zones - List all shipping zones with regions and rates
 * POST /api/admin/shipping/zones - Create a new shipping zone
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllShippingZones } from '@/lib/pricing/shipping'

export async function GET() {
  try {
    const zones = await getAllShippingZones()
    return NextResponse.json({ data: zones })
  } catch (error) {
    console.error('Error fetching shipping zones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping zones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, slug, sort_order, is_fallback, regions, rates } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Create the zone
    const { data: zone, error: zoneError } = await supabase
      .from('shipping_zones')
      .insert({
        name,
        slug,
        sort_order: sort_order || 0,
        is_fallback: is_fallback || false,
      })
      .select()
      .single()

    if (zoneError) {
      return NextResponse.json(
        { error: zoneError.message },
        { status: 500 }
      )
    }

    // Add regions if provided
    if (regions && Array.isArray(regions) && regions.length > 0) {
      const regionRows = regions.map((r: { country_code: string; state_code?: string }) => ({
        zone_id: zone.id,
        country_code: r.country_code,
        state_code: r.state_code || null,
      }))

      const { error: regError } = await supabase
        .from('shipping_zone_regions')
        .insert(regionRows)

      if (regError) {
        console.error('Error adding regions:', regError)
      }
    }

    // Add rates if provided
    if (rates && Array.isArray(rates) && rates.length > 0) {
      const rateRows = rates.map((r: { shipping_class: string; flat_cost: number; fee_percent: number }) => ({
        zone_id: zone.id,
        shipping_class: r.shipping_class,
        flat_cost: r.flat_cost,
        fee_percent: r.fee_percent,
      }))

      const { error: rateError } = await supabase
        .from('shipping_rates')
        .insert(rateRows)

      if (rateError) {
        console.error('Error adding rates:', rateError)
      }
    }

    return NextResponse.json({ data: zone })
  } catch (error) {
    console.error('Error creating shipping zone:', error)
    return NextResponse.json(
      { error: 'Failed to create shipping zone' },
      { status: 500 }
    )
  }
}
