/**
 * Twilio SMS Client
 *
 * Sends SMS via Twilio REST API with phone number validation.
 * Ported from VibrationFit's src/lib/messaging/twilio.ts.
 *
 * Env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */

import { Twilio } from 'twilio'

// Initialize Twilio client (lazy — only if env vars present)
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SendSMSParams {
  to: string
  body: string
  mediaUrls?: string[]
}

export interface SMSResponse {
  success: boolean
  sid?: string
  status?: string
  error?: string
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Send an SMS via Twilio.
 */
export async function sendSMS(params: SendSMSParams): Promise<SMSResponse> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.error('[Twilio] Not configured — missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER')
    return { success: false, error: 'SMS service not configured' }
  }

  const { to, body, mediaUrls } = params

  try {
    const message = await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to,
      body,
      ...(mediaUrls && mediaUrls.length > 0 && { mediaUrl: mediaUrls }),
    })

    console.log('[Twilio] SMS sent:', { sid: message.sid, to, status: message.status })

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    }
  } catch (error: any) {
    console.error('[Twilio] Failed to send SMS:', error)
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    }
  }
}

/**
 * Get SMS delivery status by SID.
 */
export async function getSMSStatus(
  sid: string
): Promise<{ status: string; error?: string }> {
  if (!twilioClient) {
    return { status: 'unknown', error: 'Twilio not configured' }
  }

  try {
    const message = await twilioClient.messages(sid).fetch()
    return { status: message.status }
  } catch (error: any) {
    console.error('[Twilio] Failed to fetch SMS status:', error)
    return { status: 'unknown', error: error.message }
  }
}

/**
 * Validate and format a phone number to E.164.
 */
export function validatePhoneNumber(
  phone: string
): { valid: boolean; formatted?: string; error?: string } {
  const digits = phone.replace(/\D/g, '')

  if (digits.length < 10) {
    return { valid: false, error: 'Phone number too short' }
  }
  if (digits.length > 11) {
    return { valid: false, error: 'Phone number too long' }
  }

  let formatted: string
  if (digits.length === 10) {
    formatted = `+1${digits}` // Assume US
  } else if (digits.length === 11 && digits.startsWith('1')) {
    formatted = `+${digits}`
  } else {
    formatted = `+${digits}`
  }

  return { valid: true, formatted }
}

/**
 * Check if Twilio is configured.
 */
export function isTwilioConfigured(): boolean {
  return !!(twilioClient && twilioPhoneNumber)
}
