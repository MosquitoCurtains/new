/**
 * Notification Send Functions
 * 
 * High-level functions that:
 *  1. Read recipient config from notification_settings table
 *  2. Render the appropriate HTML template
 *  3. Send via SES
 *  4. Log to notification_log
 * 
 * All public functions are designed to be called fire-and-forget:
 *   sendOrderConfirmation(order).catch(console.error)
 */

import { sendEmail } from './ses'
import {
  orderConfirmationTemplate,
  newOrderAlertTemplate,
  orderRefundTemplate,
  snapToolRefundTemplate,
  newLeadTemplate,
  salespersonAssignedTemplate,
  renderCustomTemplate,
  replaceMergeTags,
  formatCurrency,
  formatDate,
  type OrderEmailData,
  type RefundEmailData,
  type SnapToolRefundEmailData,
  type LeadEmailData,
  type SalespersonAssignedEmailData,
} from './templates'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface NotificationSetting {
  id: string
  recipient_emails: string[]
  is_enabled: boolean
}

/**
 * Fetch notification setting by type ID. Returns null if not found.
 */
async function getSetting(typeId: string): Promise<NotificationSetting | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('notification_settings')
    .select('id, recipient_emails, is_enabled')
    .eq('id', typeId)
    .single()

  if (error || !data) return null
  return data as NotificationSetting
}

/**
 * Log a sent (or failed) notification to notification_log.
 */
async function logNotification(params: {
  notification_type: string
  recipient: string
  subject: string
  reference_id?: string
  status: 'sent' | 'failed'
  error_message?: string
}) {
  try {
    const supabase = createAdminClient()
    await supabase.from('notification_log').insert({
      notification_type: params.notification_type,
      recipient: params.recipient,
      subject: params.subject,
      reference_id: params.reference_id || null,
      status: params.status,
      error_message: params.error_message || null,
    })
  } catch (logErr) {
    // Logging should never throw - swallow and warn
    console.warn('Failed to log notification:', logErr)
  }
}

/**
 * Core send-and-log helper.
 */
async function sendAndLog(params: {
  notificationType: string
  to: string | string[]
  subject: string
  html: string
  referenceId?: string
  from?: string
  replyTo?: string
}) {
  const { notificationType, to, subject, html, referenceId, from, replyTo } = params
  const recipients = Array.isArray(to) ? to : [to]

  for (const recipient of recipients) {
    try {
      await sendEmail({ to: recipient, subject, html, from, replyTo })
      await logNotification({
        notification_type: notificationType,
        recipient,
        subject,
        reference_id: referenceId,
        status: 'sent',
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`Failed to send ${notificationType} to ${recipient}:`, errorMsg)
      await logNotification({
        notification_type: notificationType,
        recipient,
        subject,
        reference_id: referenceId,
        status: 'failed',
        error_message: errorMsg,
      })
    }
  }
}

/**
 * Check for a custom template in the DB. If found, render it with merge values.
 * Returns null if no custom template exists (caller should use code default).
 */
async function tryCustomTemplate(
  typeId: string,
  mergeValues: Record<string, string>
): Promise<{ subject: string; html: string } | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('email_templates')
      .select('subject, html_body, is_custom')
      .eq('id', typeId)
      .eq('is_custom', true)
      .single()

    if (!data) return null

    const subject = replaceMergeTags(data.subject, mergeValues)
    const html = renderCustomTemplate(data.html_body, mergeValues)
    return { subject, html }
  } catch {
    // DB error or table doesn't exist yet - fall back to code default
    return null
  }
}

// ---------------------------------------------------------------------------
// Merge value builders
// ---------------------------------------------------------------------------

function orderMergeValues(order: OrderEmailData): Record<string, string> {
  return {
    '{{customer_first_name}}': order.customerFirstName,
    '{{customer_last_name}}': order.customerLastName,
    '{{customer_email}}': order.customerEmail,
    '{{order_number}}': order.orderNumber,
    '{{order_total}}': formatCurrency(order.totalAmount),
    '{{order_date}}': formatDate(order.createdAt),
  }
}

function refundMergeValues(data: RefundEmailData): Record<string, string> {
  return {
    '{{customer_first_name}}': data.customerFirstName,
    '{{customer_last_name}}': data.customerLastName,
    '{{order_number}}': data.orderNumber,
    '{{refund_amount}}': formatCurrency(data.refundAmount),
  }
}

function snapMergeValues(data: SnapToolRefundEmailData): Record<string, string> {
  return {
    '{{customer_first_name}}': data.customerFirstName,
    '{{customer_last_name}}': data.customerLastName,
    '{{order_number}}': data.orderNumber,
  }
}

function leadMergeValues(lead: LeadEmailData): Record<string, string> {
  const interestMap: Record<string, string> = {
    mosquito_curtains: 'Mosquito Curtains',
    clear_vinyl: 'Clear Vinyl Panels',
    both: 'Both Products',
    raw_materials: 'Raw Materials',
    other: 'Other',
  }
  const projectMap: Record<string, string> = {
    porch: 'Porch / Patio',
    garage: 'Garage Door',
    pergola: 'Pergola',
    gazebo: 'Gazebo',
    deck: 'Deck',
    awning: 'Awning',
    industrial: 'Industrial / Commercial',
    other: 'Other',
  }
  return {
    '{{lead_name}}': [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Unknown',
    '{{lead_email}}': lead.email,
    '{{lead_phone}}': lead.phone || '',
    '{{lead_interest}}': interestMap[lead.interest || ''] || lead.interest || '',
    '{{lead_project}}': projectMap[lead.projectType || ''] || lead.projectType || '',
    '{{lead_message}}': lead.message || '',
    '{{lead_source}}': lead.source === 'contact_form' ? 'Contact Page' : 'Quick Connect Form',
    '{{lead_date}}': formatDate(lead.createdAt),
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send order confirmation email to the customer.
 */
export async function sendOrderConfirmation(order: OrderEmailData): Promise<void> {
  const setting = await getSetting('order_confirmation')
  if (setting && !setting.is_enabled) return

  const custom = await tryCustomTemplate('order_confirmation', orderMergeValues(order))
  const { subject, html } = custom || orderConfirmationTemplate(order)

  await sendAndLog({
    notificationType: 'order_confirmation',
    to: order.customerEmail,
    subject,
    html,
    referenceId: order.orderId,
    from: 'orders@mosquitocurtains.com',
  })
}

/**
 * Send new order alert to admin staff.
 */
export async function sendNewOrderAlert(order: OrderEmailData): Promise<void> {
  const setting = await getSetting('new_order_alert')
  if (!setting || !setting.is_enabled) return
  if (setting.recipient_emails.length === 0) return

  const custom = await tryCustomTemplate('new_order_alert', orderMergeValues(order))
  const { subject, html } = custom || newOrderAlertTemplate(order)

  await sendAndLog({
    notificationType: 'new_order_alert',
    to: setting.recipient_emails,
    subject,
    html,
    referenceId: order.orderId,
    from: 'orders@mosquitocurtains.com',
  })
}

/**
 * Send refund notification to the customer.
 */
export async function sendRefundNotification(data: RefundEmailData): Promise<void> {
  const setting = await getSetting('order_refund')
  if (setting && !setting.is_enabled) return

  const custom = await tryCustomTemplate('order_refund', refundMergeValues(data))
  const { subject, html } = custom || orderRefundTemplate(data)

  await sendAndLog({
    notificationType: 'order_refund',
    to: data.customerEmail,
    subject,
    html,
    referenceId: data.orderId,
    from: 'orders@mosquitocurtains.com',
  })
}

/**
 * Send snap tool refund email to the customer (manually triggered from admin).
 */
export async function sendSnapToolRefund(data: SnapToolRefundEmailData): Promise<void> {
  const setting = await getSetting('snap_tool_refund')
  if (setting && !setting.is_enabled) return

  const custom = await tryCustomTemplate('snap_tool_refund', snapMergeValues(data))
  const { subject, html } = custom || snapToolRefundTemplate(data)

  await sendAndLog({
    notificationType: 'snap_tool_refund',
    to: data.customerEmail,
    subject,
    html,
    referenceId: data.orderId,
    from: 'orders@mosquitocurtains.com',
  })
}

/**
 * Send salesperson auto-assignment notification.
 * Sent directly to the assigned salesperson (not from notification_settings recipients).
 */
export async function sendSalespersonAssignedNotification(data: SalespersonAssignedEmailData): Promise<void> {
  const setting = await getSetting('salesperson_assigned')
  if (setting && !setting.is_enabled) return

  const mergeValues: Record<string, string> = {
    '{{salesperson_name}}': data.salespersonName,
    '{{customer_name}}': data.customerName,
    '{{customer_email}}': data.customerEmail,
    '{{product_type}}': data.productType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    '{{project_url}}': `https://mosquitocurtains.com/admin/projects/${data.projectId}`,
  }

  const custom = await tryCustomTemplate('salesperson_assigned', mergeValues)
  const { subject, html } = custom || salespersonAssignedTemplate(data)

  // Send directly to the salesperson
  await sendAndLog({
    notificationType: 'salesperson_assigned',
    to: data.salespersonEmail,
    subject,
    html,
    referenceId: data.projectId,
    from: 'plan@mosquitocurtains.com',
  })

  // Also send to any additional configured recipients
  if (setting && setting.recipient_emails.length > 0) {
    const extraRecipients = setting.recipient_emails.filter(e => e !== data.salespersonEmail)
    if (extraRecipients.length > 0) {
      await sendAndLog({
        notificationType: 'salesperson_assigned',
        to: extraRecipients,
        subject,
        html,
        referenceId: data.projectId,
        from: 'plan@mosquitocurtains.com',
      })
    }
  }
}

/**
 * Send new lead notification to sales staff.
 */
export async function sendNewLeadNotification(lead: LeadEmailData): Promise<void> {
  const setting = await getSetting('new_lead')
  if (!setting || !setting.is_enabled) return
  if (setting.recipient_emails.length === 0) return

  const custom = await tryCustomTemplate('new_lead', leadMergeValues(lead))
  const { subject, html } = custom || newLeadTemplate(lead)

  await sendAndLog({
    notificationType: 'new_lead',
    to: setting.recipient_emails,
    subject,
    html,
    referenceId: lead.id,
    from: 'plan@mosquitocurtains.com',
  })
}
