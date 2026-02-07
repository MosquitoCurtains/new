import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAndLogEmail } from '@/lib/messaging/email-log'

/**
 * POST /api/admin/leads/[id]/email
 * Compose and send an email to a lead, auto-logged to email_messages.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { subject, html, from, replyTo } = body

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Subject and html body are required' },
        { status: 400 }
      )
    }

    // Fetch lead
    const supabase = createAdminClient()
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Send and log
    const sesMessageId = await sendAndLogEmail({
      to: lead.email,
      subject,
      html,
      from,
      replyTo,
      leadId: lead.id,
    })

    return NextResponse.json({
      success: true,
      messageId: sesMessageId,
    })
  } catch (error) {
    console.error('Lead email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
