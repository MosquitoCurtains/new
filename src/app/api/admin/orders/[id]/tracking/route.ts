import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/orders/[id]/tracking
 * Add a tracking number to an order.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { tracking_number, carrier, tracking_url } = body

    if (!tracking_number) {
      return NextResponse.json(
        { error: 'tracking_number is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: tracking, error } = await supabase
      .from('order_tracking_numbers')
      .insert({
        order_id: id,
        tracking_number,
        carrier: carrier || null,
        tracking_url: tracking_url || null,
      })
      .select('*')
      .single()

    if (error || !tracking) {
      console.error('Error adding tracking:', error)
      return NextResponse.json(
        { error: 'Failed to add tracking number' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, tracking })
  } catch (error) {
    console.error('Order tracking POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/orders/[id]/tracking
 * Remove a tracking number. Expects { tracking_id } in body.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params // ensure params are awaited
    const body = await request.json()
    const { tracking_id } = body

    if (!tracking_id) {
      return NextResponse.json(
        { error: 'tracking_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('order_tracking_numbers')
      .delete()
      .eq('id', tracking_id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete tracking number' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order tracking DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
