/**
 * Email Template Preview API
 * 
 * GET ?type=order_confirmation  - Returns rendered HTML for preview
 * POST { type, subject, html_body } - Returns rendered HTML from custom body for live preview
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  baseLayout,
  replaceMergeTags,
  SAMPLE_DATA,
  getDefaultTemplateBody,
  // Code-generated templates as fallback
  orderConfirmationTemplate,
  newOrderAlertTemplate,
  orderRefundTemplate,
  snapToolRefundTemplate,
  newLeadTemplate,
} from '@/lib/email/templates'

// Sample data objects for the code-generated templates
const SAMPLE_ORDER = {
  orderNumber: 'MC26-00042',
  orderId: 'preview-id',
  customerFirstName: 'Sarah',
  customerLastName: 'Johnson',
  customerEmail: 'sarah.johnson@example.com',
  totalAmount: 847.50,
  items: [
    { name: 'Panel 1: Front Left', description: '5.5ft x 96in Heavy Mosquito - Black', quantity: 1, unitPrice: 312.50, totalPrice: 312.50 },
    { name: 'Panel 2: Front Right', description: '5.5ft x 96in Heavy Mosquito - Black', quantity: 1, unitPrice: 312.50, totalPrice: 312.50 },
    { name: 'Standard Track 14ft', description: 'White standard track', quantity: 2, unitPrice: 49.00, totalPrice: 98.00 },
    { name: 'Industrial Snap Tool', description: 'Fully refundable if returned', quantity: 1, unitPrice: 130.00, totalPrice: 130.00 },
  ],
  createdAt: new Date().toISOString(),
}

const SAMPLE_REFUND = {
  orderNumber: 'MC26-00042',
  orderId: 'preview-id',
  customerFirstName: 'Sarah',
  customerLastName: 'Johnson',
  customerEmail: 'sarah.johnson@example.com',
  refundAmount: 847.50,
}

const SAMPLE_SNAP = {
  orderNumber: 'MC26-00042',
  orderId: 'preview-id',
  customerFirstName: 'Sarah',
  customerLastName: 'Johnson',
  customerEmail: 'sarah.johnson@example.com',
}

const SAMPLE_LEAD = {
  id: 'preview-lead-id',
  firstName: 'Mike',
  lastName: 'Thompson',
  email: 'mike.thompson@example.com',
  phone: '(555) 123-4567',
  interest: 'mosquito_curtains',
  projectType: 'porch',
  message: 'Hi, I have a 12x16 screened porch and I\'m interested in getting mosquito curtains installed. Can you give me a rough estimate?',
  source: 'contact_form',
  createdAt: new Date().toISOString(),
}

/**
 * GET - Render a template preview with sample data
 */
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')

  if (!type) {
    return NextResponse.json({ error: 'type parameter required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check for custom template in DB
  const { data: customTemplate } = await supabase
    .from('email_templates')
    .select('subject, html_body, is_custom')
    .eq('id', type)
    .eq('is_custom', true)
    .single()

  if (customTemplate) {
    // Render custom template with sample data
    const sampleValues = SAMPLE_DATA[type] || {}
    const subject = replaceMergeTags(customTemplate.subject, sampleValues)
    const html = baseLayout(replaceMergeTags(customTemplate.html_body, sampleValues))
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Email-Subject': subject,
      },
    })
  }

  // Fall back to code-generated template
  let result: { subject: string; html: string } | null = null

  switch (type) {
    case 'order_confirmation':
      result = orderConfirmationTemplate(SAMPLE_ORDER)
      break
    case 'new_order_alert':
      result = newOrderAlertTemplate(SAMPLE_ORDER)
      break
    case 'order_refund':
      result = orderRefundTemplate(SAMPLE_REFUND)
      break
    case 'snap_tool_refund':
      result = snapToolRefundTemplate(SAMPLE_SNAP)
      break
    case 'new_lead':
      result = newLeadTemplate(SAMPLE_LEAD)
      break
  }

  if (!result) {
    return NextResponse.json({ error: `Unknown template type: ${type}` }, { status: 400 })
  }

  return new NextResponse(result.html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Email-Subject': result.subject,
    },
  })
}

/**
 * POST - Live preview of custom body (for the editor)
 */
export async function POST(request: NextRequest) {
  try {
    const { type, subject, html_body } = await request.json()

    if (!type || !html_body) {
      return NextResponse.json({ error: 'type and html_body required' }, { status: 400 })
    }

    const sampleValues = SAMPLE_DATA[type] || {}
    const renderedSubject = replaceMergeTags(subject || '', sampleValues)
    const renderedHtml = baseLayout(replaceMergeTags(html_body, sampleValues))

    return new NextResponse(renderedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'X-Email-Subject': renderedSubject,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
