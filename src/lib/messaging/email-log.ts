/**
 * Email Message Logging
 *
 * Logs outbound emails to the email_messages table after sending via SES.
 * Provides a helper that wraps sendEmail() and auto-logs.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, type SendEmailParams } from '@/lib/email/ses'

export interface LoggedEmailParams extends SendEmailParams {
  /** UUID of the lead this email is for */
  leadId?: string
  /** UUID of the project this email is about */
  projectId?: string
  /** Thread grouping identifier */
  threadId?: string
}

/**
 * Send an email via SES and log it to the email_messages table.
 * Returns the SES message ID.
 */
export async function sendAndLogEmail(params: LoggedEmailParams): Promise<string> {
  const { leadId, projectId, threadId, ...sesParams } = params

  // Send via SES
  const sesMessageId = await sendEmail(sesParams)

  // Log to database
  const supabase = createAdminClient()
  const toAddresses = Array.isArray(sesParams.to) ? sesParams.to : [sesParams.to]

  await supabase.from('email_messages').insert({
    lead_id: leadId || null,
    project_id: projectId || null,
    from_email: sesParams.from || process.env.SES_FROM_EMAIL || 'noreply@mosquitocurtains.com',
    to_email: toAddresses[0],
    subject: sesParams.subject,
    body_html: sesParams.html,
    body_text: '', // Could extract text from HTML if needed
    direction: 'outbound',
    status: 'sent',
    ses_message_id: sesMessageId,
    thread_id: threadId || null,
    sent_at: new Date().toISOString(),
  })

  return sesMessageId
}

/**
 * Log an inbound email to the database (used by IMAP sync).
 */
export async function logInboundEmail(params: {
  leadId?: string
  fromEmail: string
  toEmail: string
  subject: string
  bodyText?: string
  bodyHtml?: string
  imapMessageId?: string
  imapUid?: number
  sentAt?: string
}): Promise<void> {
  const supabase = createAdminClient()

  await supabase.from('email_messages').insert({
    lead_id: params.leadId || null,
    from_email: params.fromEmail,
    to_email: params.toEmail,
    subject: params.subject,
    body_text: params.bodyText || '',
    body_html: params.bodyHtml || '',
    direction: 'inbound',
    status: 'received',
    imap_message_id: params.imapMessageId || null,
    imap_uid: params.imapUid || null,
    is_reply: params.subject?.toLowerCase().startsWith('re:') || false,
    sent_at: params.sentAt || new Date().toISOString(),
  })
}
