/**
 * Admin Gallery Images Reorder API
 * PUT /api/admin/gallery/images/reorder - Batch update sort_order for images
 *
 * Body: { updates: Array<{ id: string; sort_order: number }> }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { updates } = body as { updates: { id: string; sort_order: number }[] }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'updates array is required with {id, sort_order} objects' },
        { status: 400 }
      )
    }

    // Batch update each row
    const errors: string[] = []
    for (const { id, sort_order } of updates) {
      const { error } = await supabase
        .from('gallery_images')
        .update({ sort_order })
        .eq('id', id)

      if (error) {
        errors.push(`${id}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Some updates failed', details: errors },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, updated: updates.length })
  } catch (error) {
    console.error('Admin gallery reorder error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
