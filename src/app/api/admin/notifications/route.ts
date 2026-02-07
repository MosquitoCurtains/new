/**
 * Admin Notifications API
 * 
 * GET  - Fetch notification settings + recent log
 * PUT  - Update notification settings (recipients, enabled/disabled)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Fetch settings and recent log in parallel
    const [settingsResult, logResult] = await Promise.all([
      supabase
        .from('notification_settings')
        .select('*')
        .order('id'),
      supabase
        .from('notification_log')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50),
    ])

    if (settingsResult.error) {
      console.error('Error fetching notification settings:', settingsResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      settings: settingsResult.data || [],
      log: logResult.data || [],
    })
  } catch (error) {
    console.error('Notification settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, recipient_emails, is_enabled } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const updateData: Record<string, unknown> = {}
    if (recipient_emails !== undefined) {
      updateData.recipient_emails = recipient_emails
    }
    if (is_enabled !== undefined) {
      updateData.is_enabled = is_enabled
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notification_settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification setting:', error)
      return NextResponse.json(
        { error: 'Failed to update setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, setting: data })
  } catch (error) {
    console.error('Notification settings PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
