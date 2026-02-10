import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/orders/[id]/notes
 * Add a note to an order.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { author_name, content, is_customer_visible } = body

    if (!author_name || !content) {
      return NextResponse.json(
        { error: 'author_name and content are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: note, error } = await supabase
      .from('order_notes')
      .insert({
        order_id: id,
        author_name,
        content,
        is_customer_visible: is_customer_visible || false,
      })
      .select('*')
      .single()

    if (error || !note) {
      console.error('Error adding note:', error)
      return NextResponse.json(
        { error: 'Failed to add note' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error('Order notes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/orders/[id]/notes
 * List notes for an order.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: notes, error } = await supabase
      .from('order_notes')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch notes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notes: notes || [] })
  } catch (error) {
    console.error('Order notes GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
