import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/customers/[id]
 * Fetch a single customer with their orders and projects.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch customer
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (custError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Fetch orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, total, subtotal, tax, shipping_cost, project_id, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false })

    // Fetch projects by customer_id
    const { data: projects } = await supabase
      .from('projects')
      .select('id, product_type, project_type, project_name, status, estimated_total, share_token, assigned_to, lead_id, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false })

    // Also fetch projects by email as fallback
    let allProjects = projects || []
    if (customer.email) {
      const { data: emailProjects } = await supabase
        .from('projects')
        .select('id, product_type, project_type, project_name, status, estimated_total, share_token, assigned_to, lead_id, created_at')
        .eq('email', customer.email)
        .is('customer_id', null)
        .order('created_at', { ascending: false })

      if (emailProjects && emailProjects.length > 0) {
        const existingIds = new Set(allProjects.map((p) => p.id))
        for (const p of emailProjects) {
          if (!existingIds.has(p.id)) allProjects.push(p)
        }
      }
    }

    // Fetch lead if linked
    let lead = null
    if (customer.lead_id) {
      const { data: leadData } = await supabase
        .from('leads')
        .select('id, email, first_name, last_name, status, source, interest, created_at')
        .eq('id', customer.lead_id)
        .single()
      lead = leadData
    }

    // Compute stats
    const allOrders = orders || []
    const totalSpent = allOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    const orderDates = allOrders.map((o) => new Date(o.created_at).getTime())

    return NextResponse.json({
      customer: {
        ...customer,
        total_orders: allOrders.length,
        total_spent: totalSpent,
        avg_order_value: allOrders.length > 0 ? totalSpent / allOrders.length : 0,
        last_order_date: orderDates.length > 0 ? new Date(Math.max(...orderDates)).toISOString() : null,
        first_order_date: orderDates.length > 0 ? new Date(Math.min(...orderDates)).toISOString() : null,
      },
      orders: allOrders,
      projects: allProjects,
      lead,
    })
  } catch (error) {
    console.error('Customer detail GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/customers/[id]
 * Update customer fields.
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
      'first_name', 'last_name', 'email', 'phone',
      'city', 'state', 'zip', 'notes',
      'customer_status', 'assigned_salesperson_id',
    ]
    const update: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field]
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('customers')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
    }

    return NextResponse.json({ success: true, customer: data })
  } catch (error) {
    console.error('Customer detail PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
