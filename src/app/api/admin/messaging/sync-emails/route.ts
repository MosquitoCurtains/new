import { NextResponse } from 'next/server'
import { syncInboundEmails } from '@/lib/messaging/imap-sync'

/**
 * POST /api/admin/messaging/sync-emails
 * Trigger IMAP sync to pull inbound emails from Google Workspace.
 * Admin only — can be called manually or via cron.
 */
export async function POST() {
  try {
    const result = await syncInboundEmails()

    return NextResponse.json({
      success: result.success,
      newMessages: result.newMessages,
      errors: result.errors,
    })
  } catch (error) {
    console.error('Email sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    )
  }
}
