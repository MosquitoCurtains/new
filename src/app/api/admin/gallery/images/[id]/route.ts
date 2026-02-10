/**
 * Admin Gallery Image Detail API
 * GET    /api/admin/gallery/images/[id] - Get single image
 * PUT    /api/admin/gallery/images/[id] - Update an image
 * DELETE /api/admin/gallery/images/[id] - Delete an image
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json({ image: data })
  } catch (error) {
    console.error('Admin gallery image get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    // Only include fields that were provided
    const updates: Record<string, any> = {}
    const allowedFields = [
      'image_url', 'thumbnail_url', 'title', 'description',
      'product_type', 'project_type', 'mesh_type', 'top_attachment',
      'color', 'canvas_color', 'location', 'customer_name',
      'is_featured', 'sort_order',
    ]

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery image:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json({ image: data })
  } catch (error) {
    console.error('Admin gallery image update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gallery image:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin gallery image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
