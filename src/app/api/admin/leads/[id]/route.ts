import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/leads/[id]
 * Fetch a single lead with attached projects, carts, and orders.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Fetch projects linked to this lead
    const { data: projects } = await supabase
      .from('projects')
      .select('id, product_type, status, estimated_total, share_token, assigned_to, created_at')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })

    // Fetch projects by email as fallback (for leads created before lead_id linking)
    let allProjects = projects || []
    if (lead.email) {
      const { data: emailProjects } = await supabase
        .from('projects')
        .select('id, product_type, status, estimated_total, share_token, assigned_to, created_at')
        .eq('email', lead.email)
        .is('lead_id', null)
        .order('created_at', { ascending: false })

      if (emailProjects && emailProjects.length > 0) {
        const existingIds = new Set(allProjects.map((p) => p.id))
        for (const p of emailProjects) {
          if (!existingIds.has(p.id)) allProjects.push(p)
        }
      }
    }

    // Fetch orders linked to any of these projects
    const projectIds = allProjects.map((p) => p.id)
    let orders: Record<string, unknown>[] = []
    if (projectIds.length > 0) {
      const { data: orderData } = await supabase
        .from('orders')
        .select('id, order_number, status, total, project_id, created_at')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false })
      orders = orderData || []
    }

    return NextResponse.json({
      lead,
      projects: allProjects,
      orders,
    })
  } catch (error) {
    console.error('Lead detail GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/leads/[id]
 * Update lead fields.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createAdminClient()

    const allowedFields = [
      'status', 'assigned_to', 'first_name', 'last_name', 'phone',
      'email', 'interest', 'project_type', 'message',
    ]
    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field]
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('leads')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('Lead detail PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
