import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/my-projects?email=xxx
 * Public endpoint: Returns projects (with cart totals) and orders for an email.
 * Rate-limited by email to prevent enumeration.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')?.toLowerCase().trim()

    if (!email) {
      return NextResponse.json(
        { error: 'email parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch projects for this email
    const { data: projects } = await supabase
      .from('projects')
      .select(`
        id, email, first_name, last_name, product_type, status,
        share_token, estimated_total, created_at, updated_at,
        staff:assigned_to (id, name, email)
      `)
      .eq('email', email)
      .not('status', 'eq', 'archived')
      .order('created_at', { ascending: false })

    // Fetch orders for this email
    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, email, status, total, payment_status, created_at, salesperson_id, staff!salesperson_id(name), shipping_first_name, shipping_last_name')
      .eq('email', email)
      .order('created_at', { ascending: false })

    // Fetch tracking numbers for these orders
    const orderIds = (orders || []).map((o) => o.id)
    let trackingNumbers: Record<string, unknown>[] = []
    if (orderIds.length > 0) {
      const { data } = await supabase
        .from('order_tracking_numbers')
        .select('*')
        .in('order_id', orderIds)
      trackingNumbers = data || []
    }

    // Fetch customer-visible notes
    let visibleNotes: Record<string, unknown>[] = []
    if (orderIds.length > 0) {
      const { data } = await supabase
        .from('order_notes')
        .select('*')
        .in('order_id', orderIds)
        .eq('is_customer_visible', true)
        .order('created_at', { ascending: true })
      visibleNotes = data || []
    }

    // Group tracking numbers and notes by order_id
    const trackingByOrder: Record<string, unknown[]> = {}
    trackingNumbers.forEach((t) => {
      const oid = t.order_id as string
      if (!trackingByOrder[oid]) trackingByOrder[oid] = []
      trackingByOrder[oid].push(t)
    })

    const notesByOrder: Record<string, unknown[]> = {}
    visibleNotes.forEach((n) => {
      const oid = n.order_id as string
      if (!notesByOrder[oid]) notesByOrder[oid] = []
      notesByOrder[oid].push(n)
    })

    // Enrich orders with tracking, notes, and flattened salesperson name
    const enrichedOrders = (orders || []).map((order) => {
      const staffJoin = (order as Record<string, unknown>).staff as { name: string } | null
      return {
        ...order,
        salesperson_name: staffJoin?.name || null,
        staff: undefined,
        tracking_numbers: trackingByOrder[order.id] || [],
        customer_notes: notesByOrder[order.id] || [],
      }
    })

    return NextResponse.json({
      projects: projects || [],
      orders: enrichedOrders,
    })
  } catch (error) {
    console.error('My projects GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
