import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * PATCH /api/admin/sales/projects/[id]
 * Update project cart_data, estimated_total, or status.
 * Called on every cart change (debounced from client).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { cart_data, estimated_total, status, notes } = body

    const supabase = createAdminClient()

    // Build update payload — only include provided fields
    const update: Record<string, unknown> = {}
    if (cart_data !== undefined) update.cart_data = cart_data
    if (estimated_total !== undefined) update.estimated_total = estimated_total
    if (status !== undefined) update.status = status
    if (notes !== undefined) update.notes = notes

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !data) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, project: data })
  } catch (error) {
    console.error('Sales project PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/sales/projects/[id]
 * Fetch a single project with lead info.
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
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('Sales project GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
