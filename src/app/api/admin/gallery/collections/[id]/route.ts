/**
 * Admin Gallery Collection Detail API
 * GET    /api/admin/gallery/collections/[id] - Get single collection with images
 * PUT    /api/admin/gallery/collections/[id] - Update a collection
 * DELETE /api/admin/gallery/collections/[id] - Delete a collection
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

    const { data: collection, error: collError } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single()

    if (collError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Fetch assigned images
    const { data: assignments } = await supabase
      .from('gallery_assignments')
      .select(`
        id,
        display_order,
        gallery_images (*)
      `)
      .eq('gallery_id', id)
      .order('display_order', { ascending: true })

    const images = (assignments || []).map((a: any) => ({
      assignment_id: a.id,
      display_order: a.display_order,
      ...a.gallery_images,
    }))

    return NextResponse.json({
      collection: { ...collection, images },
    })
  } catch (error) {
    console.error('Admin collection get error:', error)
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

    const updates: Record<string, any> = {}
    const allowedFields = ['slug', 'name', 'description', 'is_published', 'display_on_page']

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('galleries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating collection:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A collection with that slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection: data })
  } catch (error) {
    console.error('Admin collection update error:', error)
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
      .from('galleries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting collection:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin collection delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
