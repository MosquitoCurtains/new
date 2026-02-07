/**
 * IMAP Email Sync
 *
 * Pulls inbound emails from Google Workspace via IMAP.
 * Matches sender email to leads, deduplicates by imap_message_id.
 * Ported from VibrationFit's src/lib/messaging/imap-sync.ts,
 * adapted to use leads instead of user_profiles.
 */

import Imap from 'imap'
import { simpleParser } from 'mailparser'
import { createAdminClient } from '@/lib/supabase/admin'

export interface EmailSyncResult {
  success: boolean
  newMessages: number
  errors: string[]
}

/**
 * Sync inbound emails from Google Workspace via IMAP.
 * Connects to the configured mailbox, fetches unread emails,
 * matches senders to leads, and logs to email_messages.
 */
export async function syncInboundEmails(): Promise<EmailSyncResult> {
  return new Promise((resolve) => {
    const result: EmailSyncResult = {
      success: true,
      newMessages: 0,
      errors: [],
    }

    // Check IMAP configuration
    if (!process.env.IMAP_HOST || !process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
      result.success = false
      result.errors.push('IMAP not configured - missing IMAP_HOST, IMAP_USER, or IMAP_PASSWORD')
      return resolve(result)
    }

    const imap = new Imap({
      user: process.env.IMAP_USER!,
      password: process.env.IMAP_PASSWORD!,
      host: process.env.IMAP_HOST!,
      port: parseInt(process.env.IMAP_PORT || '993'),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    })

    const supabase = createAdminClient()

    imap.once('ready', () => {
      imap.openBox('INBOX', false, async (err) => {
        if (err) {
          result.success = false
          result.errors.push(`Failed to open inbox: ${err.message}`)
          imap.end()
          return resolve(result)
        }

        // Search for unread emails from the last 30 days
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        imap.search(['UNSEEN', ['SINCE', since]], async (err, results) => {
          if (err) {
            result.success = false
            result.errors.push(`Search failed: ${err.message}`)
            imap.end()
            return resolve(result)
          }

          if (!results || results.length === 0) {
            console.log('[IMAP] No new emails to sync')
            imap.end()
            return resolve(result)
          }

          console.log(`[IMAP] Found ${results.length} new emails to sync`)

          const fetch = imap.fetch(results, { bodies: '', markSeen: true })

          fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream) => {
              simpleParser(stream as any, async (err, parsed) => {
                if (err) {
                  result.errors.push(`Parse error: ${err.message}`)
                  return
                }

                try {
                  const fromValue = Array.isArray(parsed.from) ? parsed.from[0] : parsed.from
                  const toValue = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to
                  const fromEmail = fromValue?.value?.[0]?.address || ''
                  const toEmail = toValue?.value?.[0]?.address || ''
                  const subject = parsed.subject || '(No subject)'
                  const bodyText = parsed.text || ''
                  const bodyHtml = parsed.html || ''
                  const messageId = parsed.messageId || ''

                  // Check if already synced (deduplication)
                  if (messageId) {
                    const { data: existing } = await supabase
                      .from('email_messages')
                      .select('id')
                      .eq('imap_message_id', messageId)
                      .single()

                    if (existing) {
                      return // Skip duplicate
                    }
                  }

                  // Find matching lead by sender email
                  const { data: lead } = await supabase
                    .from('leads')
                    .select('id')
                    .eq('email', fromEmail)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                  // Save to database
                  const { error: insertError } = await supabase
                    .from('email_messages')
                    .insert({
                      lead_id: lead?.id || null,
                      from_email: fromEmail,
                      to_email: toEmail,
                      subject,
                      body_text: bodyText,
                      body_html: bodyHtml || '',
                      direction: 'inbound',
                      status: 'received',
                      imap_message_id: messageId || null,
                      imap_uid: seqno,
                      is_reply: subject.toLowerCase().startsWith('re:'),
                      sent_at: parsed.date?.toISOString() || new Date().toISOString(),
                    })

                  if (insertError) {
                    result.errors.push(`DB insert failed: ${insertError.message}`)
                  } else {
                    result.newMessages++
                    console.log(`[IMAP] Synced email from ${fromEmail}: ${subject}`)
                  }
                } catch (error: any) {
                  result.errors.push(`Processing error: ${error.message}`)
                }
              })
            })
          })

          fetch.once('end', () => {
            console.log(`[IMAP] Email sync complete: ${result.newMessages} new messages`)
            imap.end()
          })

          fetch.once('error', (err) => {
            result.success = false
            result.errors.push(`Fetch error: ${err.message}`)
            imap.end()
          })
        })
      })
    })

    imap.once('error', (err: any) => {
      result.success = false
      result.errors.push(`IMAP connection error: ${err.message}`)
      resolve(result)
    })

    imap.once('end', () => {
      resolve(result)
    })

    imap.connect()
  })
}
