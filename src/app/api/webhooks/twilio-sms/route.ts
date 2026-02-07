import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/webhooks/twilio-sms
 *
 * Twilio webhook for inbound SMS.
 * Receives incoming texts, matches from_number to a lead,
 * and logs with direction: 'inbound'.
 *
 * Configure this URL in your Twilio phone number webhook settings.
 */
export async function POST(request: NextRequest) {
  try {
    // Twilio sends form-encoded data
    const formData = await request.formData()
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const body = formData.get('Body') as string
    const messageSid = formData.get('MessageSid') as string
    const numMedia = parseInt(formData.get('NumMedia') as string || '0')

    if (!from || !body) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Collect media URLs if MMS
    const mediaUrls: string[] = []
    for (let i = 0; i < numMedia; i++) {
      const url = formData.get(`MediaUrl${i}`) as string
      if (url) mediaUrls.push(url)
    }

    const supabase = createAdminClient()

    // Check for duplicate (by twilio_sid)
    if (messageSid) {
      const { data: existing } = await supabase
        .from('sms_messages')
        .select('id')
        .eq('twilio_sid', messageSid)
        .single()

      if (existing) {
        // Already processed — return 200 so Twilio doesn't retry
        return new NextResponse(
          '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
          { headers: { 'Content-Type': 'text/xml' } }
        )
      }
    }

    // Match from_number to a lead by phone
    // Normalize: try both +1XXXXXXXXXX and XXXXXXXXXX formats
    const digits = from.replace(/\D/g, '')
    const { data: lead } = await supabase
      .from('leads')
      .select('id, phone')
      .or(`phone.eq.${from},phone.eq.${digits},phone.eq.+${digits}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Log to database
    await supabase.from('sms_messages').insert({
      lead_id: lead?.id || null,
      direction: 'inbound',
      from_number: from,
      to_number: to || process.env.TWILIO_PHONE_NUMBER || '',
      body,
      media_urls: mediaUrls.length > 0 ? mediaUrls : null,
      status: 'received',
      twilio_sid: messageSid || null,
    })

    console.log(`[Twilio Webhook] Inbound SMS from ${from}${lead ? ` (lead: ${lead.id})` : ' (no matching lead)'}`)

    // Return empty TwiML response (no auto-reply)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { 'Content-Type': 'text/xml' } }
    )
  } catch (error) {
    console.error('[Twilio Webhook] Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
