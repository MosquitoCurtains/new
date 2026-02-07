// @ts-nocheck — tax tables not in generated Supabase types yet
/**
 * PUT /api/admin/tax/rates/[id] - Update a tax rate
 * DELETE /api/admin/tax/rates/[id] - Delete a tax rate
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
    if (body.rate !== undefined) fields.rate = body.rate
    if (body.tax_name !== undefined) fields.tax_name = body.tax_name
    if (body.country_code !== undefined) fields.country_code = body.country_code
    if (body.state_code !== undefined) fields.state_code = body.state_code
    if (body.postcode !== undefined) fields.postcode = body.postcode
    if (body.city !== undefined) fields.city = body.city
    if (body.priority !== undefined) fields.priority = body.priority
    if (body.is_compound !== undefined) fields.is_compound = body.is_compound
    if (body.is_shipping_taxable !== undefined) fields.is_shipping_taxable = body.is_shipping_taxable
    if (body.is_active !== undefined) fields.is_active = body.is_active

    const { data, error } = await supabase
      .from('tax_rates')
      .update(fields)
      .eq('id', rateId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating tax rate:', error)
    return NextResponse.json(
      { error: 'Failed to update tax rate' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const rateId = parseInt(id)
    if (isNaN(rateId)) {
      return NextResponse.json({ error: 'Invalid rate ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tax_rates')
      .delete()
      .eq('id', rateId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tax rate:', error)
    return NextResponse.json(
      { error: 'Failed to delete tax rate' },
      { status: 500 }
    )
  }
}
