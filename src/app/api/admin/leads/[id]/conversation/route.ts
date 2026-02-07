import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/leads/[id]/conversation
 *
 * Fetches both email_messages and sms_messages for a lead,
 * merges them chronologically, and returns a unified Message[] timeline.
 */

interface ConversationMessage {
  type: 'email' | 'sms'
  id: string
  content: string
  htmlContent?: string
  subject?: string
  direction: 'inbound' | 'outbound'
  timestamp: string
  metadata?: {
    from?: string
    to?: string
    status?: string
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, email, phone')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Fetch emails (by lead_id OR by matching email address)
    const { data: emails } = await supabase
      .from('email_messages')
      .select('*')
      .or(`lead_id.eq.${id},from_email.eq.${lead.email},to_email.eq.${lead.email}`)
      .order('created_at', { ascending: true })
      .limit(200)

    // Fetch SMS (by lead_id)
    const { data: smsMessages } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: true })
      .limit(200)

    // Merge into unified timeline
    const conversation: ConversationMessage[] = []

    if (emails) {
      for (const email of emails) {
        conversation.push({
          type: 'email',
          id: email.id,
          content: email.body_text || '',
          htmlContent: email.body_html || undefined,
          subject: email.subject || undefined,
          direction: email.direction,
          timestamp: email.sent_at || email.created_at,
          metadata: {
            from: email.from_email,
            to: email.to_email,
            status: email.status,
          },
        })
      }
    }

    if (smsMessages) {
      for (const sms of smsMessages) {
        conversation.push({
          type: 'sms',
          id: sms.id,
          content: sms.body,
          direction: sms.direction,
          timestamp: sms.created_at,
          metadata: {
            from: sms.from_number,
            to: sms.to_number,
            status: sms.status,
          },
        })
      }
    }

    // Sort chronologically
    conversation.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    return NextResponse.json({
      conversation,
      lead: {
        id: lead.id,
        email: lead.email,
        phone: lead.phone,
      },
    })
  } catch (error) {
    console.error('Conversation GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
