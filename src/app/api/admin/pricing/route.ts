// @ts-nocheck — products/product_options tables not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { invalidatePricingCache } from '@/lib/pricing/service'

/**
 * GET /api/admin/pricing
 * Fetch all products and options with prices for the admin pricing page.
 * Returns products grouped by category with their options.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch ALL products (including inactive) with prices
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, sku, name, description, product_type, base_price, unit, pack_quantity, product_category, category_section, category_order, admin_only, is_active')
      .order('product_category')
      .order('category_section')
      .order('category_order')

    if (productsError) {
      console.error('[Admin Pricing] Products error:', productsError.message)
      return NextResponse.json(
        { error: `Database error: ${productsError.message}` },
        { status: 503 }
      )
    }

    // Fetch all options with pricing data
    const { data: options, error: optionsError } = await supabase
      .from('product_options')
      .select('id, product_id, option_name, option_value, display_label, price, fee, pricing_key, admin_only, sort_order')
      .order('sort_order')

    if (optionsError) {
      console.error('[Admin Pricing] Options error:', optionsError.message)
      return NextResponse.json(
        { error: `Database error: ${optionsError.message}` },
        { status: 503 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Products table is empty. Run the seed migration.' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      products: products || [],
      options: options || [],
      source: 'database',
    })
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
 * Update a single product price or option price.
 * Body: { type: 'product' | 'option', id: string, field: 'base_price' | 'price' | 'fee', value: number }
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { type, id, field, value } = body

    if (!type || !id || !field || value === undefined) {
      return NextResponse.json({ error: 'Missing type, id, field, or value' }, { status: 400 })
    }

    const isBooleanField = field === 'admin_only' || field === 'is_active'
    const numValue = isBooleanField ? 0 : parseFloat(value)
    if (!isBooleanField && isNaN(numValue)) {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
    }

    if (type === 'product') {
      if (!['base_price', 'admin_only', 'is_active'].includes(field)) {
        return NextResponse.json({ error: 'Only base_price, admin_only, and is_active can be updated for products' }, { status: 400 })
      }

      const updateValue = (field === 'admin_only' || field === 'is_active') ? Boolean(value) : numValue
      const { data, error } = await supabase
        .from('products')
        .update({ [field]: updateValue })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product price:', error)
        return NextResponse.json({ error: 'Failed to update product price' }, { status: 500 })
      }

      invalidatePricingCache()
      return NextResponse.json({ data })
    }

    if (type === 'option') {
      if (!['price', 'fee', 'admin_only'].includes(field)) {
        return NextResponse.json({ error: 'Only price, fee, and admin_only can be updated for options' }, { status: 400 })
      }

      const updateValue = field === 'admin_only' ? Boolean(value) : numValue
      const { data, error } = await supabase
        .from('product_options')
        .update({ [field]: updateValue })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating option price:', error)
        return NextResponse.json({ error: 'Failed to update option price' }, { status: 500 })
      }

      invalidatePricingCache()
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: 'Invalid type. Use "product" or "option".' }, { status: 400 })
  } catch (err) {
    console.error('Pricing API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/pricing
 * Bulk update multiple product/option prices.
 * Body: { updates: Array<{ type: 'product' | 'option', id: string, field: string, value: number }> }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { updates } = body as {
      updates: Array<{ type: string; id: string; field: string; value: number }>
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const results = await Promise.all(
      updates.map(async ({ type, id, field, value }) => {
        const table = type === 'product' ? 'products' : 'product_options'
        const isBool = field === 'admin_only' || field === 'is_active'
        const updateValue = isBool ? Boolean(value) : value
        const { data, error } = await supabase
          .from(table)
          .update({ [field]: updateValue })
          .eq('id', id)
          .select()
          .single()

        return { type, id, field, data, error }
      })
    )

    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Some pricing updates failed:', errors)
      return NextResponse.json({
        error: 'Some updates failed',
        failed: errors.map(e => ({ id: e.id, message: e.error?.message })),
      }, { status: 500 })
    }

    invalidatePricingCache()

    return NextResponse.json({
      success: true,
      updated: results.length,
    })
  } catch (err) {
    console.error('Pricing API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
