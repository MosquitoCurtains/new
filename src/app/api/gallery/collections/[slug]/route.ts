/**
 * Public Gallery Collection API
 * GET /api/gallery/collections/[slug] - Fetch a collection with its images
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = createAdminClient()

    // Fetch collection
    const { data: collection, error: collError } = await supabase
      .from('galleries')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (collError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Fetch assigned images
    const { data: assignments, error: assignError } = await supabase
      .from('gallery_assignments')
      .select(`
        display_order,
        gallery_images (*)
      `)
      .eq('gallery_id', collection.id)
      .order('display_order', { ascending: true })

    if (assignError) {
      console.error('Error fetching gallery assignments:', assignError)
      return NextResponse.json({ error: 'Failed to fetch collection images' }, { status: 500 })
    }

    // Flatten the images from assignments
    const images = (assignments || [])
      .map((a: any) => a.gallery_images)
      .filter(Boolean)

    return NextResponse.json({
      collection: {
        ...collection,
        images,
      },
    })
  } catch (error) {
    console.error('Gallery collection API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
