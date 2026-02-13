// @ts-nocheck — diy_wizard_hardware_recommendations table not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchDiyHardwareItems,
  invalidateDiyHardwareCache,
  addDiyHardwareItem,
  deleteDiyHardwareItem,
} from '@/lib/pricing/diy-hardware-service'

/**
 * GET /api/admin/diy-hardware
 * Fetch all DIY hardware recommendation rules (including inactive) for admin.
 */
export async function GET() {
  try {
    const items = await fetchDiyHardwareItems()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'DIY hardware items table is empty. Run the seed migration.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ items, source: 'database' })
  } catch (err) {
    console.error('[Admin DiyHardware] API error:', err)
    return NextResponse.json(
      { error: 'Failed to load DIY hardware rules.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/diy-hardware
 * Handles bulk updates, add, and delete operations.
 *
 * Body shapes:
 *   Bulk update: { updates: Array<{ id, field, value }> }
 *   Add item:    { action: 'add', item: { ... } }
 *   Delete item: { action: 'delete', id: string }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // ── Add new item ──
    if (body.action === 'add' && body.item) {
      const result = await addDiyHardwareItem(body.item)
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ success: true, item: result.data })
    }

    // ── Delete item ──
    if (body.action === 'delete' && body.id) {
      const result = await deleteDiyHardwareItem(body.id)
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    // ── Bulk updates ──
    const { updates } = body as {
      updates: Array<{ id: string; field: string; value: unknown }>
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    // Only allow fields that exist on the thin table
    const ALLOWED_FIELDS = [
      'product_sku', 'calc_rule', 'calc_params',
      'color_match', 'product_types', 'sort_order', 'active',
    ]

    const results = await Promise.all(
      updates.map(async ({ id, field, value }) => {
        if (!ALLOWED_FIELDS.includes(field)) {
          return { id, error: `Invalid field: ${field}` }
        }

        const updatePayload: Record<string, unknown> = {}

        if (field === 'sort_order') {
          const intValue = parseInt(String(value), 10)
          if (isNaN(intValue)) {
            return { id, error: 'Invalid integer value for sort_order' }
          }
          updatePayload.sort_order = intValue
        } else if (field === 'active') {
          updatePayload.active = Boolean(value)
        } else if (field === 'calc_params') {
          updatePayload.calc_params = typeof value === 'string' ? JSON.parse(value) : value
        } else {
          // String fields (product_sku, calc_rule, color_match, product_types)
          updatePayload[field] = value === null ? null : String(value)
        }

        const { data, error } = await supabase
          .from('diy_wizard_hardware_recommendations')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single()

        return { id, data, error }
      })
    )

    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('[Admin DiyHardware] Some updates failed:', errors)
      return NextResponse.json({
        error: 'Some updates failed',
        failed: errors.map(e => ({
          id: e.id,
          message: typeof e.error === 'string' ? e.error : e.error?.message,
        })),
      }, { status: 500 })
    }

    invalidateDiyHardwareCache()

    return NextResponse.json({
      success: true,
      updated: results.length,
    })
  } catch (err) {
    console.error('[Admin DiyHardware] API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
