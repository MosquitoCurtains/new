import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * PUT /api/admin/staff/[id]
 * Update a staff member's name, email, role, or active status.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = createAdminClient()

    const allowedFields = ['first_name', 'last_name', 'name', 'email', 'role', 'is_active', 'auth_user_id']
    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field]
      }
    }
    // When first_name or last_name change, update name for display
    if (update.first_name !== undefined || update.last_name !== undefined) {
      let firstName = update.first_name as string | undefined
      let lastName = update.last_name as string | undefined
      if (firstName === undefined || lastName === undefined) {
        const { data: current } = await supabase.from('staff').select('first_name, last_name').eq('id', id).single()
        if (current) {
          firstName = firstName ?? current.first_name ?? ''
          lastName = lastName ?? current.last_name ?? ''
        }
      }
      if (firstName != null && lastName != null) {
        update.name = `${String(firstName).trim()} ${String(lastName).trim()}`.trim()
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data: staff, error } = await supabase
      .from('staff')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !staff) {
      console.error('Error updating staff:', error)
      return NextResponse.json(
        { error: 'Failed to update staff member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, staff })
  } catch (error) {
    console.error('Staff PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/staff/[id]
 * Soft-delete: set is_active to false.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('staff')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to deactivate staff member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Staff DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
