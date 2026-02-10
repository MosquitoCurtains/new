/**
 * Admin Gallery Collections API
 * GET  /api/admin/gallery/collections - List all collections
 * POST /api/admin/gallery/collections - Create a new collection
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Fetch collections with image counts
    const { data: collections, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
    }

    // Get image counts for each collection
    const collectionsWithCounts = await Promise.all(
      (collections || []).map(async (collection) => {
        const { count } = await supabase
          .from('gallery_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('gallery_id', collection.id)

        return {
          ...collection,
          image_count: count || 0,
        }
      })
    )

    return NextResponse.json({ collections: collectionsWithCounts })
  } catch (error) {
    console.error('Admin collections error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { slug, name, description, is_published, display_on_page } = body

    if (!slug || !name) {
      return NextResponse.json(
        { error: 'slug and name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('galleries')
      .insert({
        slug,
        name,
        description: description || null,
        is_published: is_published ?? false,
        display_on_page: display_on_page || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating collection:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A collection with that slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection: data }, { status: 201 })
  } catch (error) {
    console.error('Admin collection create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
