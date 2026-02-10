/**
 * Admin Gallery Collection Images API
 * POST   /api/admin/gallery/collections/[id]/images - Add images to collection
 * DELETE /api/admin/gallery/collections/[id]/images - Remove images from collection
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    const { image_ids } = body

    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json(
        { error: 'image_ids array is required' },
        { status: 400 }
      )
    }

    // Get current max display_order
    const { data: existing } = await supabase
      .from('gallery_assignments')
      .select('display_order')
      .eq('gallery_id', galleryId)
      .order('display_order', { ascending: false })
      .limit(1)

    let nextOrder = (existing?.[0]?.display_order ?? -1) + 1

    // Insert assignments
    const assignments = image_ids.map((imageId: string) => ({
      gallery_id: galleryId,
      image_id: imageId,
      display_order: nextOrder++,
    }))

    const { data, error } = await supabase
      .from('gallery_assignments')
      .upsert(assignments, { onConflict: 'gallery_id,image_id' })
      .select()

    if (error) {
      console.error('Error adding images to collection:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ assignments: data }, { status: 201 })
  } catch (error) {
    console.error('Admin collection images add error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    const { image_ids } = body

    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json(
        { error: 'image_ids array is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('gallery_assignments')
      .delete()
      .eq('gallery_id', galleryId)
      .in('image_id', image_ids)

    if (error) {
      console.error('Error removing images from collection:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin collection images remove error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
