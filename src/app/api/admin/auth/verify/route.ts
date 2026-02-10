import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/auth/verify
 * Verifies an auth user has an active staff record.
 * Uses the admin client to bypass RLS.
 */
export async function POST(request: NextRequest) {
  try {
    const { auth_user_id } = await request.json()

    if (!auth_user_id) {
      return NextResponse.json({ staff: null })
    }

    const supabase = createAdminClient()

    const { data: staffRecord } = await supabase
      .from('staff')
      .select('id, name, first_name, last_name, role, is_active')
      .eq('auth_user_id', auth_user_id)
      .eq('is_active', true)
      .single()

    return NextResponse.json({ staff: staffRecord || null })
  } catch {
    return NextResponse.json({ staff: null })
  }
}
