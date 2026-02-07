import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSMS, validatePhoneNumber, isTwilioConfigured } from '@/lib/messaging/twilio'

/**
 * POST /api/admin/leads/[id]/sms
 * Send an SMS to a lead and log it to sms_messages.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message body is required' },
        { status: 400 }
      )
    }

    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'SMS service not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.' },
        { status: 503 }
      )
    }

    // Fetch lead
    const supabase = createAdminClient()
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name, phone')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    if (!lead.phone) {
      return NextResponse.json(
        { error: 'Lead has no phone number' },
        { status: 400 }
      )
    }

    // Validate phone
    const validation = validatePhoneNumber(lead.phone)
    if (!validation.valid || !validation.formatted) {
      return NextResponse.json(
        { error: `Invalid phone number: ${validation.error}` },
        { status: 400 }
      )
    }

    // Send SMS
    const result = await sendSMS({
      to: validation.formatted,
      body: message,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send SMS' },
        { status: 500 }
      )
    }

    // Log to database
    await supabase.from('sms_messages').insert({
      lead_id: lead.id,
      direction: 'outbound',
      from_number: process.env.TWILIO_PHONE_NUMBER || '',
      to_number: validation.formatted,
      body: message,
      status: 'sent',
      twilio_sid: result.sid,
    })

    return NextResponse.json({
      success: true,
      sid: result.sid,
    })
  } catch (error) {
    console.error('Lead SMS send error:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
