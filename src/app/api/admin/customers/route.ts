import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/customers
 * List customers with order/project stats from real data.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '200', 10)

    const supabase = createAdminClient()

    // Fetch customers
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'all') {
      query = query.eq('customer_status', status)
    }

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`
      )
    }

    const { data: customers, error } = await query

    if (error) {
      console.error('Customers list error:', error)
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({ customers: [] })
    }

    // Fetch order stats for each customer
    const customerIds = customers.map((c) => c.id)

    const { data: orders } = await supabase
      .from('orders')
      .select('id, customer_id, total, status, created_at')
      .in('customer_id', customerIds)

    // Fetch projects for each customer
    const { data: projects } = await supabase
      .from('projects')
      .select('id, customer_id, product_type, status, estimated_total, created_at')
      .in('customer_id', customerIds)

    // Build stats per customer
    const ordersByCustomer = new Map<string, typeof orders>()
    const projectsByCustomer = new Map<string, typeof projects>()

    for (const o of orders || []) {
      const list = ordersByCustomer.get(o.customer_id) || []
      list.push(o)
      ordersByCustomer.set(o.customer_id, list)
    }

    for (const p of projects || []) {
      if (!p.customer_id) continue
      const list = projectsByCustomer.get(p.customer_id) || []
      list.push(p)
      projectsByCustomer.set(p.customer_id, list)
    }

    const enriched = customers.map((c) => {
      const custOrders = ordersByCustomer.get(c.id) || []
      const custProjects = projectsByCustomer.get(c.id) || []
      const totalSpent = custOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
      const orderDates = custOrders.map((o) => new Date(o.created_at).getTime()).filter(Boolean)

      return {
        ...c,
        total_orders: custOrders.length,
        total_spent: totalSpent,
        avg_order_value: custOrders.length > 0 ? totalSpent / custOrders.length : 0,
        last_order_date: orderDates.length > 0 ? new Date(Math.max(...orderDates)).toISOString() : null,
        first_order_date: orderDates.length > 0 ? new Date(Math.min(...orderDates)).toISOString() : null,
        total_projects: custProjects.length,
      }
    })

    return NextResponse.json({ customers: enriched })
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
