/**
 * Admin Manual Notification Send API
 * 
 * POST - Send a manual notification (snap tool refund, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSnapToolRefund } from '@/lib/email/notifications'
import { sendEmail } from '@/lib/email/ses'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, orderId, customerEmail, customerName } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Notification type is required' },
        { status: 400 }
      )
    }

    if (type === 'snap_tool_refund') {
      if (!customerEmail) {
        return NextResponse.json(
          { error: 'Customer email is required' },
          { status: 400 }
        )
      }

      // Try to look up order details if orderId provided
      let orderNumber = orderId || 'N/A'
      let firstName = ''
      let lastName = ''

      if (orderId) {
        const supabase = createAdminClient()
        const { data: order } = await supabase
          .from('orders')
          .select('order_number, customer_first_name, customer_last_name')
          .eq('id', orderId)
          .single()

        if (order) {
          orderNumber = order.order_number || orderNumber
          firstName = order.customer_first_name || ''
          lastName = order.customer_last_name || ''
        }
      }

      // Allow override from the form
      if (customerName) {
        const parts = customerName.trim().split(/\s+/)
        firstName = parts[0] || firstName
        lastName = parts.slice(1).join(' ') || lastName
      }

      await sendSnapToolRefund({
        orderNumber,
        orderId: orderId || '',
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail,
      })

      return NextResponse.json({ success: true, message: 'Snap tool refund email sent' })
    }

    if (type === 'test_email') {
      if (!customerEmail) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }
      const { _testSubject, _testHtml } = body
      if (!_testSubject || !_testHtml) {
        return NextResponse.json({ error: 'Subject and HTML required for test' }, { status: 400 })
      }
      await sendEmail({
        to: customerEmail,
        subject: `[TEST] ${_testSubject}`,
        html: _testHtml,
      })
      return NextResponse.json({ success: true, message: 'Test email sent' })
    }

    return NextResponse.json(
      { error: `Unknown notification type: ${type}` },
      { status: 400 }
    )
  } catch (error) {
    console.error('Manual notification send error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send notification' },
      { status: 500 }
    )
  }
}
