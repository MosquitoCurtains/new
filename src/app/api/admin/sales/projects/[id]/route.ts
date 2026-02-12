import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/sales/projects/[id]
 * Fetch a single project by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        leads!lead_id (
          id, email, first_name, last_name, phone, status, interest
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('Project detail GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/sales/projects/[id]
 * Update project fields.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createAdminClient()

    const allowedFields = [
      'status', 'assigned_to', 'notes', 'estimated_total',
      'product_type', 'project_type', 'mesh_type', 'top_attachment',
      'total_width', 'number_of_sides', 'project_name',
      'first_name', 'last_name', 'email', 'phone',
    ]
    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field]
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('projects')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !data) {
      console.error('Project update error:', error)
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('Project detail PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
