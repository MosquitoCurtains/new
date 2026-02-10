import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/staff
 * List staff members. ?active=true to filter only active.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active')

    const supabase = createAdminClient()

    let query = supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true })

    if (activeOnly === 'true') {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching staff:', error)
      return NextResponse.json(
        { error: 'Failed to fetch staff' },
        { status: 500 }
      )
    }

    return NextResponse.json({ staff: data || [] })
  } catch (error) {
    console.error('Staff GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/staff
 * Create a new staff member.
 * If `password` is provided, also creates a Supabase Auth user and links them.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, name, email, role, auth_user_id, password } = body

    const displayName = first_name != null && last_name != null
      ? `${String(first_name).trim()} ${String(last_name).trim()}`.trim()
      : name

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    if ((!first_name?.trim() || !last_name?.trim()) && !name?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name (or name) and email are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check for duplicate email in staff table
    const { data: existing } = await supabase
      .from('staff')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A staff member with this email already exists' },
        { status: 409 }
      )
    }

    // If password provided, create a Supabase Auth user first
    let linkedAuthUserId: string | null = auth_user_id || null
    if (password && !linkedAuthUserId) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: displayName, role: role || 'sales' },
      })

      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError)
        return NextResponse.json(
          { error: authError?.message || 'Failed to create auth account' },
          { status: 500 }
        )
      }

      linkedAuthUserId = authData.user.id
    }

    const insertPayload: Record<string, unknown> = {
      name: displayName || email,
      email,
      role: role || 'sales',
      auth_user_id: linkedAuthUserId,
      is_active: true,
    }
    if (first_name != null) insertPayload.first_name = String(first_name).trim()
    if (last_name != null) insertPayload.last_name = String(last_name).trim()

    const { data: staff, error } = await supabase
      .from('staff')
      .insert(insertPayload)
      .select('*')
      .single()

    if (error || !staff) {
      console.error('Error creating staff:', error)
      return NextResponse.json(
        { error: 'Failed to create staff member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, staff })
  } catch (error) {
    console.error('Staff POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
