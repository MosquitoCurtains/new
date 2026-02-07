// @ts-nocheck — product_pricing table not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { invalidatePricingCache } from '@/lib/pricing/service'

/**
 * GET /api/admin/pricing
 * Fetch all product pricing from the database (including admin_only items).
 * 
 * Query params:
 *   ?context=public — filter out admin_only items
 *   (default)       — return everything (admin context)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context')

    const supabase = await createClient()
    
    let query = supabase
      .from('product_pricing')
      .select('*')
      .order('category')
      .order('label')

    if (context === 'public') {
      query = query.or('admin_only.is.null,admin_only.eq.false')
    }

    const { data, error } = await query
    
    if (error) {
      console.error('[Admin Pricing] Database error:', error.message)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 503 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'product_pricing table is empty. Run the seed migration.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ data, source: 'database' })
  } catch (err) {
    console.error('[Admin Pricing] API error:', err)
    return NextResponse.json(
      { error: 'Failed to load pricing data.' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/pricing
 * Update a single product price.
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { id, value } = body
    
    if (!id || value === undefined) {
      return NextResponse.json({ error: 'Missing id or value' }, { status: 400 })
    }
    
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('product_pricing')
      .update({ value: numValue })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating pricing:', error)
      return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 })
    }
    
    // Invalidate server-side cache
    invalidatePricingCache()
    
    return NextResponse.json({ data })
  } catch (err) {
    console.error('Pricing API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/pricing
 * Bulk update multiple prices.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { updates } = body as { updates: { id: string; value: number }[] }
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }
    
    const results = await Promise.all(
      updates.map(async ({ id, value }) => {
        const { data, error } = await supabase
          .from('product_pricing')
          .update({ value })
          .eq('id', id)
          .select()
          .single()
        
        return { id, data, error }
      })
    )
    
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Some pricing updates failed:', errors)
      return NextResponse.json({ 
        error: 'Some updates failed', 
        failed: errors.map(e => e.id) 
      }, { status: 500 })
    }
    
    // Invalidate server-side cache
    invalidatePricingCache()
    
    return NextResponse.json({ 
      success: true, 
      updated: results.length 
    })
  } catch (err) {
    console.error('Pricing API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
