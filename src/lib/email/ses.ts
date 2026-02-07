/**
 * AWS SES Email Client
 * 
 * Low-level wrapper around AWS SES for sending emails.
 * Reuses existing AWS credentials from env.
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let sesClient: SESClient | null = null

function getClient(): SESClient {
  if (!sesClient) {
    sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }
  return sesClient
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const FROM_EMAIL = () => process.env.SES_FROM_EMAIL || 'noreply@mosquitocurtains.com'

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

/**
 * Send an email via AWS SES.
 * Returns the SES message ID on success.
 */
export async function sendEmail(params: SendEmailParams): Promise<string> {
  const { to, subject, html, from, replyTo } = params
  const toAddresses = Array.isArray(to) ? to : [to]
  const fromAddress = from || FROM_EMAIL()

  const command = new SendEmailCommand({
    Source: `Mosquito Curtains <${fromAddress}>`,
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: html, Charset: 'UTF-8' },
      },
    },
    ReplyToAddresses: replyTo ? [replyTo] : [fromAddress],
  })

  const response = await getClient().send(command)
  return response.MessageId || 'unknown'
}
