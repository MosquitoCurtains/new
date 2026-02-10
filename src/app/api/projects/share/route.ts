import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/projects/share?token=xxx
 * Public endpoint: Fetch project with cart + line items for the share page.
 * Returns salesperson contact info too.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Share token required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('share_token', token)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch the project's active cart
    const { data: carts } = await supabase
      .from('carts')
      .select('*')
      .eq('project_id', project.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)

    const cart = carts?.[0] || null

    // Fetch line items if cart exists
    let lineItems: Record<string, unknown>[] = []
    if (cart) {
      const { data } = await supabase
        .from('line_items')
        .select('*, line_item_options(*)')
        .eq('cart_id', cart.id)
        .order('created_at', { ascending: true })
      lineItems = data || []
    }

    // Fetch salesperson info
    let salesperson = null
    if (project.assigned_to) {
      const { data } = await supabase
        .from('staff')
        .select('name, email')
        .eq('id', project.assigned_to)
        .single()
      salesperson = data
    }

    // Track that the customer viewed the quote
    if (project.status === 'quote_sent') {
      await supabase
        .from('projects')
        .update({ status: 'quote_viewed' })
        .eq('id', project.id)
    }

    return NextResponse.json({
      project: {
        id: project.id,
        share_token: project.share_token,
        email: project.email,
        first_name: project.first_name,
        last_name: project.last_name,
        phone: project.phone,
        product_type: project.product_type,
        status: project.status,
        assigned_to: project.assigned_to,
        salesperson,
        cart: cart
          ? {
              id: cart.id,
              subtotal: cart.subtotal,
              shipping_amount: cart.shipping_amount,
              tax_amount: cart.tax_amount,
              total: cart.total,
              status: cart.status,
            }
          : null,
        lineItems,
      },
    })
  } catch (error) {
    console.error('Project share GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
