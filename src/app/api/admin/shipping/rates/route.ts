// @ts-nocheck — shipping tables not in generated Supabase types yet
/**
 * GET /api/admin/shipping/rates - List all shipping rates
 * POST /api/admin/shipping/rates - Create or bulk-update shipping rates
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*, shipping_zones(name, slug)')
      .order('zone_id')
      .order('shipping_class')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching shipping rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping rates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Bulk update mode
    if (body.updates && Array.isArray(body.updates)) {
      const results = await Promise.all(
        body.updates.map(async (update: { id: number; flat_cost?: number; fee_percent?: number }) => {
          const fields: Record<string, unknown> = {}
          if (update.flat_cost !== undefined) fields.flat_cost = update.flat_cost
          if (update.fee_percent !== undefined) fields.fee_percent = update.fee_percent

          const { data, error } = await supabase
            .from('shipping_rates')
            .update(fields)
            .eq('id', update.id)
            .select()
            .single()

          return { id: update.id, data, error }
        })
      )

      const errors = results.filter(r => r.error)
      if (errors.length > 0) {
        return NextResponse.json(
          { error: 'Some updates failed', failed: errors.map(e => e.id) },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, updated: results.length })
    }

    // Single create mode
    const { zone_id, shipping_class, flat_cost, fee_percent } = body

    if (!zone_id || !shipping_class) {
      return NextResponse.json(
        { error: 'zone_id and shipping_class are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('shipping_rates')
      .insert({
        zone_id,
        shipping_class,
        flat_cost: flat_cost || 0,
        fee_percent: fee_percent || 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error with shipping rates:', error)
    return NextResponse.json(
      { error: 'Failed to process shipping rates' },
      { status: 500 }
    )
  }
}
