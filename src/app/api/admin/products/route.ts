// @ts-nocheck — products/product_options tables not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/products
 * Fetch products from the database with their options.
 * 
 * Products come back ready to use — each variant is its own row
 * with name, price, image, pack_quantity, and category info.
 * 
 * Query params:
 *   ?type=attachment,track,accessory — filter by product_type (comma-separated)
 *   ?category=Track Hardware          — filter by product_category
 *   ?active=true                      — only active products (default: true)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const types = searchParams.get('type')?.split(',').map(t => t.trim()).filter(Boolean)
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active') !== 'false'

    const supabase = await createClient()
    
    let query = supabase
      .from('products')
      .select('*')
      .order('product_category')
      .order('category_section')
      .order('category_order')
      .order('name')

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    if (types && types.length > 0) {
      query = query.in('product_type', types)
    }

    if (category) {
      query = query.eq('product_category', category)
    }

    const { data: products, error: productsError } = await query
    
    if (productsError) {
      console.error('[Admin Products] Database error:', productsError.message)
      return NextResponse.json(
        { error: `Database error: ${productsError.message}` },
        { status: 503 }
      )
    }

    // Fetch options for configurable products (panels, raw materials, adjustments)
    const configurableIds = (products || [])
      .filter(p => ['panel', 'raw_material', 'adjustment'].includes(p.product_type))
      .map(p => p.id)

    let options: Record<string, unknown>[] = []
    if (configurableIds.length > 0) {
      const { data: optionsData, error: optionsError } = await supabase
        .from('product_options')
        .select('*')
        .in('product_id', configurableIds)
        .order('option_name')
        .order('sort_order')

      if (optionsError) {
        console.error('[Admin Products] Options error:', optionsError.message)
        // Non-fatal — return products without options
      } else {
        options = optionsData || []
      }
    }

    // Group options by product_id
    const optionsByProduct: Record<string, Record<string, unknown>[]> = {}
    for (const opt of options) {
      const pid = opt.product_id as string
      if (!optionsByProduct[pid]) optionsByProduct[pid] = []
      optionsByProduct[pid].push(opt)
    }

    // Attach options to products
    const enrichedProducts = (products || []).map(p => ({
      ...p,
      options: optionsByProduct[p.id] || [],
    }))

    return NextResponse.json({ data: enrichedProducts })
  } catch (err) {
    console.error('[Admin Products] API error:', err)
    return NextResponse.json(
      { error: 'Failed to load products.' },
      { status: 500 }
    )
  }
}
