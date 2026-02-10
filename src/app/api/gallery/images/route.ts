/**
 * Public Gallery Images API
 * GET /api/gallery/images - Fetch gallery images with optional filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    // Build query
    let query = supabase
      .from('gallery_images')
      .select('*')

    // Apply filters
    const productType = searchParams.get('product_type')
    if (productType) {
      query = query.eq('product_type', productType)
    }

    const projectType = searchParams.get('project_type')
    if (projectType) {
      query = query.eq('project_type', projectType)
    }

    const meshType = searchParams.get('mesh_type')
    if (meshType) {
      query = query.eq('mesh_type', meshType)
    }

    const color = searchParams.get('color')
    if (color) {
      query = query.eq('color', color)
    }

    const canvasColor = searchParams.get('canvas_color')
    if (canvasColor) {
      query = query.eq('canvas_color', canvasColor)
    }

    const topAttachment = searchParams.get('top_attachment')
    if (topAttachment) {
      query = query.eq('top_attachment', topAttachment)
    }

    const featured = searchParams.get('featured')
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Ordering
    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false })

    // Pagination
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching gallery images:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }

    return NextResponse.json({ images: data || [], count })
  } catch (error) {
    console.error('Gallery images API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
