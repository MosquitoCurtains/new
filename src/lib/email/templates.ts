/**
 * Email HTML Templates
 * 
 * Responsive HTML email templates for all notification types.
 * Uses Mosquito Curtains brand colors:
 *   - Green: #406517
 *   - Navy:  #003365
 *   - Accent: #B30158
 *   - Orange: #FFA501
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderEmailData {
  orderNumber: string
  orderId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  totalAmount: number
  items?: Array<{
    name: string
    description?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  createdAt: string
}

export interface RefundEmailData {
  orderNumber: string
  orderId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  refundAmount: number
}

export interface SnapToolRefundEmailData {
  orderNumber: string
  orderId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
}

export interface LeadEmailData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  interest?: string
  projectType?: string
  message?: string
  source: string
  createdAt: string
}

export interface SalespersonAssignedEmailData {
  salespersonName: string
  salespersonEmail: string
  customerName: string
  customerEmail: string
  productType: string
  projectId: string
}

// ---------------------------------------------------------------------------
// Merge tag definitions per template type
// ---------------------------------------------------------------------------

export const TEMPLATE_MERGE_TAGS: Record<string, { tag: string; description: string }[]> = {
  order_confirmation: [
    { tag: '{{customer_first_name}}', description: 'Customer first name' },
    { tag: '{{customer_last_name}}', description: 'Customer last name' },
    { tag: '{{customer_email}}', description: 'Customer email address' },
    { tag: '{{order_number}}', description: 'Order number (e.g. MC26-00001)' },
    { tag: '{{order_total}}', description: 'Order total formatted (e.g. $847.50)' },
    { tag: '{{order_date}}', description: 'Order date formatted' },
  ],
  new_order_alert: [
    { tag: '{{customer_first_name}}', description: 'Customer first name' },
    { tag: '{{customer_last_name}}', description: 'Customer last name' },
    { tag: '{{customer_email}}', description: 'Customer email address' },
    { tag: '{{order_number}}', description: 'Order number' },
    { tag: '{{order_total}}', description: 'Order total formatted' },
    { tag: '{{order_date}}', description: 'Order date formatted' },
  ],
  order_refund: [
    { tag: '{{customer_first_name}}', description: 'Customer first name' },
    { tag: '{{customer_last_name}}', description: 'Customer last name' },
    { tag: '{{order_number}}', description: 'Order number' },
    { tag: '{{refund_amount}}', description: 'Refund amount formatted' },
  ],
  snap_tool_refund: [
    { tag: '{{customer_first_name}}', description: 'Customer first name' },
    { tag: '{{customer_last_name}}', description: 'Customer last name' },
    { tag: '{{order_number}}', description: 'Order number' },
  ],
  new_lead: [
    { tag: '{{lead_name}}', description: 'Lead full name' },
    { tag: '{{lead_email}}', description: 'Lead email address' },
    { tag: '{{lead_phone}}', description: 'Lead phone number' },
    { tag: '{{lead_interest}}', description: 'Product interest' },
    { tag: '{{lead_project}}', description: 'Project type' },
    { tag: '{{lead_message}}', description: 'Lead message text' },
    { tag: '{{lead_source}}', description: 'Form source (Contact Page / Quick Connect)' },
    { tag: '{{lead_date}}', description: 'Submission date formatted' },
  ],
  salesperson_assigned: [
    { tag: '{{salesperson_name}}', description: 'Salesperson full name' },
    { tag: '{{customer_name}}', description: 'Customer full name' },
    { tag: '{{customer_email}}', description: 'Customer email address' },
    { tag: '{{product_type}}', description: 'Product type for the project' },
    { tag: '{{project_url}}', description: 'Link to the project in admin' },
  ],
}

/**
 * Replace merge tags in a template string with actual values.
 */
export function replaceMergeTags(template: string, values: Record<string, string>): string {
  let result = template
  for (const [tag, value] of Object.entries(values)) {
    result = result.replace(new RegExp(tag.replace(/[{}]/g, '\\$&'), 'g'), value)
  }
  return result
}

// ---------------------------------------------------------------------------
// Sample data for template previews
// ---------------------------------------------------------------------------

export const SAMPLE_DATA: Record<string, Record<string, string>> = {
  order_confirmation: {
    '{{customer_first_name}}': 'Sarah',
    '{{customer_last_name}}': 'Johnson',
    '{{customer_email}}': 'sarah.johnson@example.com',
    '{{order_number}}': 'MC26-00042',
    '{{order_total}}': '$847.50',
    '{{order_date}}': 'Thursday, February 6, 2026',
  },
  new_order_alert: {
    '{{customer_first_name}}': 'Sarah',
    '{{customer_last_name}}': 'Johnson',
    '{{customer_email}}': 'sarah.johnson@example.com',
    '{{order_number}}': 'MC26-00042',
    '{{order_total}}': '$847.50',
    '{{order_date}}': 'Thursday, February 6, 2026',
  },
  order_refund: {
    '{{customer_first_name}}': 'Sarah',
    '{{customer_last_name}}': 'Johnson',
    '{{order_number}}': 'MC26-00042',
    '{{refund_amount}}': '$847.50',
  },
  snap_tool_refund: {
    '{{customer_first_name}}': 'Sarah',
    '{{customer_last_name}}': 'Johnson',
    '{{order_number}}': 'MC26-00042',
  },
  new_lead: {
    '{{lead_name}}': 'Mike Thompson',
    '{{lead_email}}': 'mike.thompson@example.com',
    '{{lead_phone}}': '(555) 123-4567',
    '{{lead_interest}}': 'Mosquito Curtains',
    '{{lead_project}}': 'Porch / Patio',
    '{{lead_message}}': 'Hi, I have a 12x16 screened porch and I\'m interested in getting mosquito curtains installed. Can you give me a rough estimate?',
    '{{lead_source}}': 'Contact Page',
    '{{lead_date}}': 'Thursday, February 6, 2026',
  },
  salesperson_assigned: {
    '{{salesperson_name}}': 'Jordan B.',
    '{{customer_name}}': 'Sarah Johnson',
    '{{customer_email}}': 'sarah.johnson@example.com',
    '{{product_type}}': 'Clear Vinyl Panels',
    '{{project_url}}': 'https://mosquitocurtains.com/admin/projects/abc-123',
  },
}

// ---------------------------------------------------------------------------
// Base layout wrapper (exported for custom template rendering)
// ---------------------------------------------------------------------------

export function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mosquito Curtains</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">
                MOSQUITO CURTAINS
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
                      Mosquito Curtains &mdash; Made in Atlanta, Georgia
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                      <a href="tel:7706454745" style="color:#406517;text-decoration:none;">(770) 645-4745</a>
                      &nbsp;&bull;&nbsp;
                      <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;">help@mosquitocurtains.com</a>
                    </p>
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      <a href="https://mosquitocurtains.com" style="color:#003365;text-decoration:none;">mosquitocurtains.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function greenBadge(text: string): string {
  return `<span style="display:inline-block;background-color:#406517;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">${text}</span>`
}

/**
 * Render a custom template body (from DB) with the base layout and merge tags.
 */
export function renderCustomTemplate(htmlBody: string, mergeValues: Record<string, string>): string {
  const replaced = replaceMergeTags(htmlBody, mergeValues)
  return baseLayout(replaced)
}

/**
 * Get the default (code-generated) template body content (without base layout wrapper)
 * for a given template type. Used to seed the editor with defaults.
 */
export function getDefaultTemplateBody(type: string): { subject: string; body: string } | null {
  switch (type) {
    case 'order_confirmation':
      return { subject: 'Order Confirmed - {{order_number}} | Mosquito Curtains', body: DEFAULT_BODIES.order_confirmation }
    case 'new_order_alert':
      return { subject: 'New Order {{order_number}} - {{order_total}}', body: DEFAULT_BODIES.new_order_alert }
    case 'order_refund':
      return { subject: 'Refund Processed - {{order_number}} | Mosquito Curtains', body: DEFAULT_BODIES.order_refund }
    case 'snap_tool_refund':
      return { subject: 'Snap Tool Refund Processed - {{order_number}} | Mosquito Curtains', body: DEFAULT_BODIES.snap_tool_refund }
    case 'new_lead':
      return { subject: 'New Lead: {{lead_name}} - {{lead_source}}', body: DEFAULT_BODIES.new_lead }
    case 'salesperson_assigned':
      return { subject: 'New Project Assigned: {{customer_name}} - {{product_type}}', body: DEFAULT_BODIES.salesperson_assigned }
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Default template bodies with merge tags (for seeding editor)
// ---------------------------------------------------------------------------

const DEFAULT_BODIES: Record<string, string> = {
  order_confirmation: `<div style="text-align:center;margin-bottom:24px;">
  <div style="width:64px;height:64px;background-color:#406517;border-radius:50%;margin:0 auto 16px;line-height:64px;text-align:center;">
    <span style="color:#ffffff;font-size:28px;">&#10003;</span>
  </div>
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:24px;">Thank You for Your Order!</h2>
  <p style="margin:0;color:#6b7280;font-size:15px;">Your order has been received and is being processed.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#f9fafb;border-radius:8px;">
  <tr><td style="padding:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:50%;padding:4px 0;">
          <span style="color:#6b7280;font-size:13px;">Order Number</span><br>
          <strong style="color:#1f2937;font-size:16px;">{{order_number}}</strong>
        </td>
        <td style="width:50%;padding:4px 0;text-align:right;">
          <span style="color:#6b7280;font-size:13px;">Date</span><br>
          <strong style="color:#1f2937;font-size:14px;">{{order_date}}</strong>
        </td>
      </tr>
      <tr><td colspan="2" style="padding:8px 0 0;"><span style="display:inline-block;background-color:#406517;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">Payment Confirmed</span></td></tr>
    </table>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
  <tr>
    <td style="padding:12px 0;font-weight:700;color:#1f2937;font-size:16px;">Order Total</td>
    <td style="padding:12px 0;text-align:right;font-weight:700;color:#406517;font-size:20px;">{{order_total}}</td>
  </tr>
</table>

<h3 style="margin:24px 0 12px;color:#1f2937;font-size:16px;border-bottom:2px solid #003365;padding-bottom:8px;">What's Next?</h3>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:8px 0;vertical-align:top;width:32px;"><div style="width:24px;height:24px;background-color:#406517;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:13px;font-weight:700;">1</div></td>
    <td style="padding:8px 8px;"><strong style="color:#1f2937;">Order Confirmed</strong><br><span style="color:#6b7280;font-size:14px;">You'll receive any updates at {{customer_email}}</span></td>
  </tr>
  <tr>
    <td style="padding:8px 0;vertical-align:top;"><div style="width:24px;height:24px;background-color:#e5e7eb;border-radius:50%;text-align:center;line-height:24px;color:#6b7280;font-size:13px;font-weight:700;">2</div></td>
    <td style="padding:8px 8px;"><strong style="color:#1f2937;">Production</strong><br><span style="color:#6b7280;font-size:14px;">Your custom panels will be manufactured within 5-7 business days</span></td>
  </tr>
  <tr>
    <td style="padding:8px 0;vertical-align:top;"><div style="width:24px;height:24px;background-color:#e5e7eb;border-radius:50%;text-align:center;line-height:24px;color:#6b7280;font-size:13px;font-weight:700;">3</div></td>
    <td style="padding:8px 8px;"><strong style="color:#1f2937;">Shipping</strong><br><span style="color:#6b7280;font-size:14px;">We'll send you tracking information once your order ships</span></td>
  </tr>
</table>

<div style="text-align:center;margin-top:24px;">
  <p style="color:#6b7280;font-size:14px;margin:0;">Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a></p>
</div>`,

  new_order_alert: `<div style="margin-bottom:20px;">
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Order Received</h2>
  <p style="margin:0;color:#6b7280;">A new online order has been placed.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
  <tr><td style="padding:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:4px 0;"><span style="color:#6b7280;font-size:13px;">Order</span><br><strong style="color:#1f2937;font-size:18px;">{{order_number}}</strong></td>
        <td style="padding:4px 0;text-align:right;"><span style="color:#6b7280;font-size:13px;">Total</span><br><strong style="color:#406517;font-size:20px;">{{order_total}}</strong></td>
      </tr>
    </table>
  </td></tr>
</table>

<h3 style="margin:0 0 8px;color:#1f2937;font-size:15px;">Customer</h3>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;width:80px;">Name</td><td style="padding:4px 0;color:#1f2937;font-size:14px;">{{customer_first_name}} {{customer_last_name}}</td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:4px 0;"><a href="mailto:{{customer_email}}" style="color:#003365;text-decoration:none;">{{customer_email}}</a></td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Date</td><td style="padding:4px 0;color:#1f2937;font-size:14px;">{{order_date}}</td></tr>
</table>

<div style="text-align:center;margin-top:16px;">
  <a href="https://mosquitocurtains.com/admin/mc-sales" style="display:inline-block;background-color:#003365;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View in Admin</a>
</div>`,

  order_refund: `<div style="text-align:center;margin-bottom:24px;">
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:22px;">Refund Processed</h2>
  <p style="margin:0;color:#6b7280;font-size:15px;">Your refund for order {{order_number}} has been processed.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;">
  <tr><td style="padding:20px;text-align:center;">
    <span style="color:#6b7280;font-size:13px;">Refund Amount</span><br>
    <strong style="color:#1f2937;font-size:28px;">{{refund_amount}}</strong>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;width:100px;">Order</td><td style="padding:4px 0;color:#1f2937;font-size:14px;font-weight:600;">{{order_number}}</td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Customer</td><td style="padding:4px 0;color:#1f2937;font-size:14px;">{{customer_first_name}} {{customer_last_name}}</td></tr>
</table>

<p style="color:#6b7280;font-size:14px;line-height:1.5;">The refund will be returned to your original payment method. Please allow 5-10 business days for the refund to appear on your statement.</p>

<div style="text-align:center;margin-top:24px;">
  <p style="color:#6b7280;font-size:14px;margin:0;">Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a></p>
</div>`,

  snap_tool_refund: `<div style="text-align:center;margin-bottom:24px;">
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:22px;">Snap Tool Refund Processed</h2>
  <p style="margin:0;color:#6b7280;font-size:15px;">Hi {{customer_first_name}}, your Industrial Snap Tool return has been received.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
  <tr><td style="padding:20px;text-align:center;">
    <span style="color:#6b7280;font-size:13px;">Refund Amount</span><br>
    <strong style="color:#406517;font-size:28px;">$130.00</strong><br>
    <span style="color:#6b7280;font-size:13px;margin-top:4px;display:inline-block;">Industrial Snap Tool &mdash; Full Refund</span>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;width:100px;">Order</td><td style="padding:4px 0;color:#1f2937;font-size:14px;font-weight:600;">{{order_number}}</td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Item</td><td style="padding:4px 0;color:#1f2937;font-size:14px;">Industrial Snap Tool</td></tr>
</table>

<p style="color:#6b7280;font-size:14px;line-height:1.5;">Thank you for returning the snap tool! As promised, we're processing your full $130.00 refund. The refund will be returned to your original payment method. Please allow 5-10 business days for the refund to appear on your statement.</p>

<p style="color:#6b7280;font-size:14px;line-height:1.5;">We hope you're enjoying your mosquito curtains! If you have any questions about your installation or need any support, don't hesitate to reach out.</p>

<div style="text-align:center;margin-top:24px;">
  <p style="color:#6b7280;font-size:14px;margin:0;">Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a></p>
</div>`,

  salesperson_assigned: `<div style="margin-bottom:20px;">
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Project Assigned to You</h2>
  <p style="margin:0;color:#6b7280;">A returning customer has been assigned to you.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
  <tr><td style="padding:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;">Customer</td><td style="padding:6px 0;color:#1f2937;font-size:14px;font-weight:600;">{{customer_name}}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;"><a href="mailto:{{customer_email}}" style="color:#003365;text-decoration:none;font-weight:600;">{{customer_email}}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Product</td><td style="padding:6px 0;color:#1f2937;font-size:14px;">{{product_type}}</td></tr>
    </table>
  </td></tr>
</table>

<p style="color:#6b7280;font-size:14px;line-height:1.5;">Hi {{salesperson_name}}, this customer previously worked with you and has started a new project. You have been automatically assigned as their salesperson.</p>

<div style="text-align:center;margin-top:16px;">
  <a href="{{project_url}}" style="display:inline-block;background-color:#003365;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Project</a>
</div>`,

  new_lead: `<div style="margin-bottom:20px;">
  <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Lead Received</h2>
  <p style="margin:0;color:#6b7280;">From the {{lead_source}} on mosquitocurtains.com</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
  <tr><td style="padding:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;">Name</td><td style="padding:6px 0;color:#1f2937;font-size:14px;font-weight:600;">{{lead_name}}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;"><a href="mailto:{{lead_email}}" style="color:#003365;text-decoration:none;font-weight:600;">{{lead_email}}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:6px 0;"><a href="tel:{{lead_phone}}" style="color:#003365;text-decoration:none;font-weight:600;">{{lead_phone}}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Interest</td><td style="padding:6px 0;color:#1f2937;font-size:14px;">{{lead_interest}}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Project</td><td style="padding:6px 0;color:#1f2937;font-size:14px;">{{lead_project}}</td></tr>
    </table>
  </td></tr>
</table>

<h3 style="margin:0 0 8px;color:#1f2937;font-size:15px;">Message</h3>
<div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
  <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">{{lead_message}}</p>
</div>

<p style="margin:0;color:#9ca3af;font-size:12px;">Submitted: {{lead_date}}</p>`,
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/**
 * Order Confirmation - sent to customers after successful payment
 */
export function orderConfirmationTemplate(order: OrderEmailData): { subject: string; html: string } {
  const subject = `Order Confirmed - ${order.orderNumber} | Mosquito Curtains`

  const itemRows = order.items?.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <strong style="color:#1f2937;">${item.name}</strong>
        ${item.description ? `<br><span style="font-size:13px;color:#6b7280;">${item.description}</span>` : ''}
        ${item.quantity > 1 ? `<br><span style="font-size:13px;color:#9ca3af;">Qty: ${item.quantity} x ${formatCurrency(item.unitPrice)}</span>` : ''}
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;font-weight:600;color:#1f2937;">
        ${formatCurrency(item.totalPrice)}
      </td>
    </tr>
  `).join('') || ''

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background-color:#406517;border-radius:50%;margin:0 auto 16px;line-height:64px;text-align:center;">
        <span style="color:#ffffff;font-size:28px;">&#10003;</span>
      </div>
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:24px;">Thank You for Your Order!</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">
        Your order has been received and is being processed.
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#f9fafb;border-radius:8px;padding:16px;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:50%;padding:4px 0;">
                <span style="color:#6b7280;font-size:13px;">Order Number</span><br>
                <strong style="color:#1f2937;font-size:16px;">${order.orderNumber}</strong>
              </td>
              <td style="width:50%;padding:4px 0;text-align:right;">
                <span style="color:#6b7280;font-size:13px;">Date</span><br>
                <strong style="color:#1f2937;font-size:14px;">${formatDate(order.createdAt)}</strong>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0 0;">
                ${greenBadge('Payment Confirmed')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${order.items && order.items.length > 0 ? `
    <h3 style="margin:0 0 12px;color:#1f2937;font-size:16px;border-bottom:2px solid #406517;padding-bottom:8px;">Order Items</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      ${itemRows}
      <tr>
        <td style="padding:12px 0 0;font-weight:700;color:#1f2937;font-size:16px;">Total</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:700;color:#406517;font-size:18px;">${formatCurrency(order.totalAmount)}</td>
      </tr>
    </table>
    ` : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding:12px 0;font-weight:700;color:#1f2937;font-size:16px;">Order Total</td>
        <td style="padding:12px 0;text-align:right;font-weight:700;color:#406517;font-size:20px;">${formatCurrency(order.totalAmount)}</td>
      </tr>
    </table>
    `}

    <h3 style="margin:24px 0 12px;color:#1f2937;font-size:16px;border-bottom:2px solid #003365;padding-bottom:8px;">What's Next?</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:32px;">
          <div style="width:24px;height:24px;background-color:#406517;border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:13px;font-weight:700;">1</div>
        </td>
        <td style="padding:8px 8px;">
          <strong style="color:#1f2937;">Order Confirmed</strong><br>
          <span style="color:#6b7280;font-size:14px;">You'll receive any updates at ${order.customerEmail}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="width:24px;height:24px;background-color:#e5e7eb;border-radius:50%;text-align:center;line-height:24px;color:#6b7280;font-size:13px;font-weight:700;">2</div>
        </td>
        <td style="padding:8px 8px;">
          <strong style="color:#1f2937;">Production</strong><br>
          <span style="color:#6b7280;font-size:14px;">Your custom panels will be manufactured within 5-7 business days</span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="width:24px;height:24px;background-color:#e5e7eb;border-radius:50%;text-align:center;line-height:24px;color:#6b7280;font-size:13px;font-weight:700;">3</div>
        </td>
        <td style="padding:8px 8px;">
          <strong style="color:#1f2937;">Shipping</strong><br>
          <span style="color:#6b7280;font-size:14px;">We'll send you tracking information once your order ships</span>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin-top:24px;">
      <p style="color:#6b7280;font-size:14px;margin:0;">
        Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a>
      </p>
    </div>
  `

  return { subject, html: baseLayout(content) }
}

/**
 * New Order Alert - sent to admin staff when a new order is placed
 */
export function newOrderAlertTemplate(order: OrderEmailData): { subject: string; html: string } {
  const subject = `New Order ${order.orderNumber} - ${formatCurrency(order.totalAmount)}`

  const content = `
    <div style="margin-bottom:20px;">
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Order Received</h2>
      <p style="margin:0;color:#6b7280;">A new online order has been placed.</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;">
                <span style="color:#6b7280;font-size:13px;">Order</span><br>
                <strong style="color:#1f2937;font-size:18px;">${order.orderNumber}</strong>
              </td>
              <td style="padding:4px 0;text-align:right;">
                <span style="color:#6b7280;font-size:13px;">Total</span><br>
                <strong style="color:#406517;font-size:20px;">${formatCurrency(order.totalAmount)}</strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <h3 style="margin:0 0 8px;color:#1f2937;font-size:15px;">Customer</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;width:80px;">Name</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;">${order.customerFirstName} ${order.customerLastName}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Email</td>
        <td style="padding:4px 0;"><a href="mailto:${order.customerEmail}" style="color:#003365;text-decoration:none;">${order.customerEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Date</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;">${formatDate(order.createdAt)}</td>
      </tr>
    </table>

    <div style="text-align:center;margin-top:16px;">
      <a href="https://mosquitocurtains.com/admin/mc-sales" style="display:inline-block;background-color:#003365;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        View in Admin
      </a>
    </div>
  `

  return { subject, html: baseLayout(content) }
}

/**
 * Order Refund - sent to customers when a refund is processed
 */
export function orderRefundTemplate(data: RefundEmailData): { subject: string; html: string } {
  const subject = `Refund Processed - ${data.orderNumber} | Mosquito Curtains`

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:22px;">Refund Processed</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">
        Your refund for order ${data.orderNumber} has been processed.
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <span style="color:#6b7280;font-size:13px;">Refund Amount</span><br>
          <strong style="color:#1f2937;font-size:28px;">${formatCurrency(data.refundAmount)}</strong>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;width:100px;">Order</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;font-weight:600;">${data.orderNumber}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Customer</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;">${data.customerFirstName} ${data.customerLastName}</td>
      </tr>
    </table>

    <p style="color:#6b7280;font-size:14px;line-height:1.5;">
      The refund will be returned to your original payment method. Please allow 5-10 business days for the refund to appear on your statement.
    </p>

    <div style="text-align:center;margin-top:24px;">
      <p style="color:#6b7280;font-size:14px;margin:0;">
        Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a>
      </p>
    </div>
  `

  return { subject, html: baseLayout(content) }
}

/**
 * Snap Tool Refund - special template for the $130 refundable snap tool return
 */
export function snapToolRefundTemplate(data: SnapToolRefundEmailData): { subject: string; html: string } {
  const subject = `Snap Tool Refund Processed - ${data.orderNumber} | Mosquito Curtains`

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:22px;">Snap Tool Refund Processed</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">
        Hi ${data.customerFirstName}, your Industrial Snap Tool return has been received.
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <span style="color:#6b7280;font-size:13px;">Refund Amount</span><br>
          <strong style="color:#406517;font-size:28px;">$130.00</strong><br>
          <span style="color:#6b7280;font-size:13px;margin-top:4px;display:inline-block;">Industrial Snap Tool &mdash; Full Refund</span>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;width:100px;">Order</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;font-weight:600;">${data.orderNumber}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Item</td>
        <td style="padding:4px 0;color:#1f2937;font-size:14px;">Industrial Snap Tool</td>
      </tr>
    </table>

    <p style="color:#6b7280;font-size:14px;line-height:1.5;">
      Thank you for returning the snap tool! As promised, we're processing your full $130.00 refund. 
      The refund will be returned to your original payment method. Please allow 5-10 business days 
      for the refund to appear on your statement.
    </p>

    <p style="color:#6b7280;font-size:14px;line-height:1.5;">
      We hope you're enjoying your mosquito curtains! If you have any questions about your installation 
      or need any support, don't hesitate to reach out.
    </p>

    <div style="text-align:center;margin-top:24px;">
      <p style="color:#6b7280;font-size:14px;margin:0;">
        Questions? Call us at <a href="tel:7706454745" style="color:#406517;text-decoration:none;font-weight:600;">(770) 645-4745</a> or email <a href="mailto:help@mosquitocurtains.com" style="color:#406517;text-decoration:none;font-weight:600;">help@mosquitocurtains.com</a>
      </p>
    </div>
  `

  return { subject, html: baseLayout(content) }
}

/**
 * Salesperson Assigned - sent when a salesperson is auto-assigned to a returning customer's project
 */
export function salespersonAssignedTemplate(data: SalespersonAssignedEmailData): { subject: string; html: string } {
  const productLabel = data.productType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const subject = `New Project Assigned: ${data.customerName} - ${productLabel}`
  const projectUrl = `https://mosquitocurtains.com/admin/projects/${data.projectId}`

  const content = `
    <div style="margin-bottom:20px;">
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Project Assigned to You</h2>
      <p style="margin:0;color:#6b7280;">A returning customer has been assigned to you.</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;">Customer</td>
              <td style="padding:6px 0;color:#1f2937;font-size:14px;font-weight:600;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:6px 0;"><a href="mailto:${data.customerEmail}" style="color:#003365;text-decoration:none;font-weight:600;">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Product</td>
              <td style="padding:6px 0;color:#1f2937;font-size:14px;">${productLabel}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#6b7280;font-size:14px;line-height:1.5;">
      Hi ${data.salespersonName}, this customer previously worked with you and has started a new project.
      You have been automatically assigned as their salesperson.
    </p>

    <div style="text-align:center;margin-top:16px;">
      <a href="${projectUrl}" style="display:inline-block;background-color:#003365;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        View Project
      </a>
    </div>
  `

  return { subject, html: baseLayout(content) }
}

/**
 * New Lead - sent to staff when a lead/contact form is submitted
 */
export function newLeadTemplate(lead: LeadEmailData): { subject: string; html: string } {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Unknown'
  const sourceLabel = lead.source === 'contact_form' ? 'Contact Page' : 'Quick Connect Form'
  const subject = `New Lead: ${name} - ${sourceLabel}`

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

  const content = `
    <div style="margin-bottom:20px;">
      <h2 style="margin:0 0 4px;color:#1f2937;font-size:20px;">New Lead Received</h2>
      <p style="margin:0;color:#6b7280;">From the ${sourceLabel} on mosquitocurtains.com</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;">Name</td>
              <td style="padding:6px 0;color:#1f2937;font-size:14px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:6px 0;">
                <a href="mailto:${lead.email}" style="color:#003365;text-decoration:none;font-weight:600;">${lead.email}</a>
              </td>
            </tr>
            ${lead.phone ? `
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td>
              <td style="padding:6px 0;">
                <a href="tel:${lead.phone.replace(/\D/g, '')}" style="color:#003365;text-decoration:none;font-weight:600;">${lead.phone}</a>
              </td>
            </tr>
            ` : ''}
            ${lead.interest ? `
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Interest</td>
              <td style="padding:6px 0;color:#1f2937;font-size:14px;">${interestMap[lead.interest] || lead.interest}</td>
            </tr>
            ` : ''}
            ${lead.projectType ? `
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Project</td>
              <td style="padding:6px 0;color:#1f2937;font-size:14px;">${projectMap[lead.projectType] || lead.projectType}</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    ${lead.message ? `
    <h3 style="margin:0 0 8px;color:#1f2937;font-size:15px;">Message</h3>
    <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${lead.message}</p>
    </div>
    ` : ''}

    <p style="margin:0;color:#9ca3af;font-size:12px;">
      Submitted: ${formatDate(lead.createdAt)}
    </p>
  `

  return { subject, html: baseLayout(content) }
}
