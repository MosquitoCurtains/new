// @ts-nocheck — shipping tables not in generated Supabase types yet
/**
 * PUT /api/admin/shipping/zones/[id] - Update a shipping zone
 * DELETE /api/admin/shipping/zones/[id] - Delete a shipping zone
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

    const zoneId = parseInt(id)
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid zone ID' }, { status: 400 })
    }

    const { name, slug, sort_order, is_active, is_fallback, regions } = body

    // Update the zone
    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (slug !== undefined) updateFields.slug = slug
    if (sort_order !== undefined) updateFields.sort_order = sort_order
    if (is_active !== undefined) updateFields.is_active = is_active
    if (is_fallback !== undefined) updateFields.is_fallback = is_fallback

    if (Object.keys(updateFields).length > 0) {
      const { error } = await supabase
        .from('shipping_zones')
        .update(updateFields)
        .eq('id', zoneId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    // Replace regions if provided
    if (regions !== undefined && Array.isArray(regions)) {
      // Delete existing regions
      await supabase
        .from('shipping_zone_regions')
        .delete()
        .eq('zone_id', zoneId)

      // Insert new regions
      if (regions.length > 0) {
        const regionRows = regions.map((r: { country_code: string; state_code?: string }) => ({
          zone_id: zoneId,
          country_code: r.country_code,
          state_code: r.state_code || null,
        }))

        await supabase
          .from('shipping_zone_regions')
          .insert(regionRows)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating shipping zone:', error)
    return NextResponse.json(
      { error: 'Failed to update shipping zone' },
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

    const zoneId = parseInt(id)
    if (isNaN(zoneId)) {
      return NextResponse.json({ error: 'Invalid zone ID' }, { status: 400 })
    }

    // Cascade will delete regions and rates
    const { error } = await supabase
      .from('shipping_zones')
      .delete()
      .eq('id', zoneId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shipping zone:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipping zone' },
      { status: 500 }
    )
  }
}
