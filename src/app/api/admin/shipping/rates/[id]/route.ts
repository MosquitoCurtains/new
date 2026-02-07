// @ts-nocheck — shipping tables not in generated Supabase types yet
/**
 * PUT /api/admin/shipping/rates/[id] - Update a shipping rate
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const rateId = parseInt(id)
    if (isNaN(rateId)) {
      return NextResponse.json({ error: 'Invalid rate ID' }, { status: 400 })
    }

    const fields: Record<string, unknown> = {}
    if (body.flat_cost !== undefined) fields.flat_cost = body.flat_cost
    if (body.fee_percent !== undefined) fields.fee_percent = body.fee_percent
    if (body.is_active !== undefined) fields.is_active = body.is_active

    const { data, error } = await supabase
      .from('shipping_rates')
      .update(fields)
      .eq('id', rateId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating shipping rate:', error)
    return NextResponse.json(
      { error: 'Failed to update shipping rate' },
      { status: 500 }
    )
  }
}
