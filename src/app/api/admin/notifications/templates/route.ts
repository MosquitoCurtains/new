/**
 * Email Templates CRUD API
 * 
 * GET  - Fetch all templates (custom from DB + defaults from code)
 * PUT  - Save a custom template override
 * DELETE ?type=... - Reset a template to default (delete custom override)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getDefaultTemplateBody,
  TEMPLATE_MERGE_TAGS,
} from '@/lib/email/templates'

const TEMPLATE_TYPES = [
  { id: 'order_confirmation', label: 'Order Confirmation' },
  { id: 'new_order_alert', label: 'New Order Alert' },
  { id: 'order_refund', label: 'Order Refund' },
  { id: 'snap_tool_refund', label: 'Snap Tool Refund' },
  { id: 'new_lead', label: 'New Lead' },
]

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Fetch any custom templates from DB
    const { data: customTemplates } = await supabase
      .from('email_templates')
      .select('*')

    const customMap = new Map(
      (customTemplates || []).map(t => [t.id, t])
    )

    // Build response: for each type, return custom if exists, else default
    const templates = TEMPLATE_TYPES.map(type => {
      const custom = customMap.get(type.id)
      const defaults = getDefaultTemplateBody(type.id)
      const mergeTags = TEMPLATE_MERGE_TAGS[type.id] || []

      if (custom && custom.is_custom) {
        return {
          id: type.id,
          label: type.label,
          subject: custom.subject,
          html_body: custom.html_body,
          is_custom: true,
          merge_tags: mergeTags,
          updated_at: custom.updated_at,
        }
      }

      return {
        id: type.id,
        label: type.label,
        subject: defaults?.subject || '',
        html_body: defaults?.body || '',
        is_custom: false,
        merge_tags: mergeTags,
        updated_at: null,
      }
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Templates API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, subject, html_body } = await request.json()

    if (!id || !subject || !html_body) {
      return NextResponse.json(
        { error: 'id, subject, and html_body are required' },
        { status: 400 }
      )
    }

    const typeInfo = TEMPLATE_TYPES.find(t => t.id === id)
    if (!typeInfo) {
      return NextResponse.json({ error: `Unknown template type: ${id}` }, { status: 400 })
    }

    const mergeTags = (TEMPLATE_MERGE_TAGS[id] || []).map(t => t.tag)
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('email_templates')
      .upsert({
        id,
        label: typeInfo.label,
        subject,
        html_body,
        merge_tags: mergeTags,
        is_custom: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving template:', error)
      return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
    }

    return NextResponse.json({ success: true, template: data })
  } catch (error) {
    console.error('Templates PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')
  if (!type) {
    return NextResponse.json({ error: 'type parameter required' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    await supabase.from('email_templates').delete().eq('id', type)
    return NextResponse.json({ success: true, message: `Template "${type}" reset to default` })
  } catch (error) {
    console.error('Templates DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
