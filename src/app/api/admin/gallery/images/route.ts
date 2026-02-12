/**
 * Admin Gallery Images API
 * GET  /api/admin/gallery/images - List all images (with filters)
 * POST /api/admin/gallery/images - Create a new gallery image
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    let query = supabase
      .from('gallery_images')
      .select('*', { count: 'exact' })

    // Filters
    const productType = searchParams.get('product_type')
    if (productType) query = query.eq('product_type', productType)

    const projectType = searchParams.get('project_type')
    if (projectType) query = query.eq('project_type', projectType)

    const meshType = searchParams.get('mesh_type')
    if (meshType) query = query.eq('mesh_type', meshType)

    const color = searchParams.get('color')
    if (color) query = query.eq('color', color)

    const featured = searchParams.get('featured')
    if (featured === 'true') query = query.eq('is_featured', true)
    if (featured === 'false') query = query.eq('is_featured', false)

    // Search by title
    const search = searchParams.get('search')
    if (search) query = query.ilike('title', `%${search}%`)

    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false })

    // Pagination
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching gallery images:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }

    return NextResponse.json({ images: data || [], total: count || 0 })
  } catch (error) {
    console.error('Admin gallery images error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const {
      image_url,
      thumbnail_url,
      title,
      description,
      product_type,
      project_type,
      mesh_type,
      top_attachment,
      color,
      canvas_color,
      location,
      customer_name,
      is_featured,
      sort_order,
    } = body

    // Validate required fields
    if (!image_url || !product_type || !project_type) {
      return NextResponse.json(
        { error: 'image_url, product_type, and project_type are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url,
        thumbnail_url: thumbnail_url || null,
        title: title || null,
        description: description || null,
        product_type,
        project_type,
        mesh_type: mesh_type || null,
        top_attachment: top_attachment || null,
        color: color || null,
        canvas_color: canvas_color || null,
        location: location || null,
        customer_name: customer_name || null,
        is_featured: is_featured || false,
        sort_order: sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating gallery image:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image: data }, { status: 201 })
  } catch (error) {
    console.error('Admin gallery image create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
