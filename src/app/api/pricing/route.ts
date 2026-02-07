import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PricingMap } from '@/lib/pricing/types'

/**
 * GET /api/pricing
 * 
 * Public endpoint that returns the pricing map for client-side use.
 * Fetches from the product_pricing database table.
 * 
 * Query params:
 *   ?context=admin — return ALL prices (including admin_only)
 *   (default)     — filter out admin_only items for public/storefront use
 * 
 * Admin pages under /admin/ should call with ?context=admin to get freebies,
 * adjustments, and other admin-only pricing.
 * 
 * Response (200): { prices: PricingMap, source: 'database' }
 * Response (503): { error: string }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context')
    const isAdmin = context === 'admin'

    const supabase = await createClient()
    let query = supabase
      .from('product_pricing' as never)
      .select('id, value, admin_only')

    // Public context: filter out admin-only items
    if (!isAdmin) {
      query = query.or('admin_only.is.null,admin_only.eq.false')
    }

    const { data, error } = await query as { data: { id: string; value: number; admin_only?: boolean }[] | null; error: { message: string } | null }

    if (error) {
      console.error('[/api/pricing] Database error:', error.message)
      return NextResponse.json(
        { error: 'Pricing database unavailable. Please try again.' },
        { status: 503 }
      )
    }

    if (!data || data.length === 0) {
      console.error('[/api/pricing] product_pricing table is empty')
      return NextResponse.json(
        { error: 'Pricing data not found. The database may need to be seeded.' },
        { status: 503 }
      )
    }

    // Build the pricing map
    const prices: PricingMap = {}
    for (const row of data) {
      prices[row.id] = Number(row.value)
    }

    return NextResponse.json(
      { prices, source: 'database' },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=900',
        },
      }
    )
  } catch (err) {
    console.error('[/api/pricing] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Failed to load pricing data.' },
      { status: 503 }
    )
  }
}
