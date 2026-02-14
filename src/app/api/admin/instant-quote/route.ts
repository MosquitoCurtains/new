// @ts-nocheck — instant_quote_pricing table not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchInstantQuotePricingRows,
  invalidateInstantQuoteCache,
} from '@/lib/pricing/instant-quote-service'

/**
 * GET /api/admin/instant-quote
 * Fetch all instant quote pricing rows for the admin page.
 */
export async function GET() {
  try {
    const rows = await fetchInstantQuotePricingRows()

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Instant quote pricing table is empty. Run the seed migration.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ rows, source: 'database' })
  } catch (err) {
    console.error('[Admin InstantQuote] API error:', err)
    return NextResponse.json(
      { error: 'Failed to load instant quote pricing data.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/instant-quote
 * Bulk update instant quote pricing values and/or admin_only flags.
 * Body: { updates: Array<{ id: string, field: 'value' | 'admin_only', value: number | boolean }> }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { updates } = body as {
      updates: Array<{ id: string; field: string; value: number | boolean }>
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const results = await Promise.all(
      updates.map(async ({ id, field, value }) => {
        if (field !== 'value' && field !== 'admin_only') {
          return { id, error: 'Invalid field' }
        }

        const updatePayload: Record<string, number | boolean> = {}
        if (field === 'value') {
          const numValue = parseFloat(String(value))
          if (isNaN(numValue)) {
            return { id, error: 'Invalid value' }
          }
          updatePayload.value = numValue
        } else {
          updatePayload.admin_only = Boolean(value)
        }

        const { data, error } = await supabase
          .from('instant_quote_pricing')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single()

        return { id, data, error }
      })
    )

    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('[Admin InstantQuote] Some updates failed:', errors)
      return NextResponse.json({
        error: 'Some updates failed',
        failed: errors.map(e => ({ id: e.id, message: typeof e.error === 'string' ? e.error : e.error?.message })),
      }, { status: 500 })
    }

    invalidateInstantQuoteCache()

    return NextResponse.json({
      success: true,
      updated: results.length,
    })
  } catch (err) {
    console.error('[Admin InstantQuote] API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
