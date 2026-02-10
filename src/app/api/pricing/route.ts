// @ts-nocheck — products/product_options tables not in generated Supabase types yet
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PricingMap } from '@/lib/pricing/types'

/**
 * GET /api/pricing
 * 
 * Public endpoint that returns the pricing map for client-side use.
 * Builds the PricingMap from the `products` and `product_options` tables.
 * 
 * For simple products: key = product.sku, value = product.base_price
 * For configurable options: key = option.pricing_key, value = option.price
 * Plus special formula-compatibility mappings (mesh_panel_fee, vinyl fees, etc.)
 * 
 * Query params:
 *   ?context=admin — return ALL prices (including admin_only)
 *   (default)     — filter out admin_only items for public/storefront use
 * 
 * Response (200): { prices: PricingMap, source: 'database' }
 * Response (503): { error: string }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context')
    const isAdmin = context === 'admin'

    const supabase = createAdminClient()

    // Fetch all active products
    let productsQuery = supabase
      .from('products')
      .select('sku, base_price, admin_only')
      .eq('is_active', true)

    if (!isAdmin) {
      productsQuery = productsQuery.or('admin_only.is.null,admin_only.eq.false')
    }

    const { data: products, error: productsError } = await productsQuery

    if (productsError) {
      console.error('[/api/pricing] Products query error:', productsError.message)
      return NextResponse.json(
        { error: 'Pricing database unavailable. Please try again.' },
        { status: 503 }
      )
    }

    // Fetch all options with pricing_key
    let optionsQuery = supabase
      .from('product_options')
      .select('pricing_key, price, fee, option_name, option_value, admin_only, product_id')
      .not('pricing_key', 'is', null)

    if (!isAdmin) {
      optionsQuery = optionsQuery.or('admin_only.is.null,admin_only.eq.false')
    }

    const { data: options, error: optionsError } = await optionsQuery

    if (optionsError) {
      console.error('[/api/pricing] Options query error:', optionsError.message)
      return NextResponse.json(
        { error: 'Pricing database unavailable. Please try again.' },
        { status: 503 }
      )
    }

    if (!products || products.length === 0) {
      console.error('[/api/pricing] products table is empty')
      return NextResponse.json(
        { error: 'Pricing data not found. The database may need to be seeded.' },
        { status: 503 }
      )
    }

    // Build the pricing map
    const prices: PricingMap = {}

    // 1. All product SKUs -> base_price
    for (const product of products) {
      prices[product.sku] = Number(product.base_price)
    }

    // 2. All options with pricing_key -> price
    if (options) {
      for (const option of options) {
        if (option.pricing_key) {
          prices[option.pricing_key] = Number(option.price)
        }
      }
    }

    // 3. Formula compatibility: mesh_panel_fee
    // The mesh panel formula uses p(prices, 'mesh_panel_fee') for the panel fee.
    // This is the mesh_panel product's base_price.
    if (prices['mesh_panel'] !== undefined) {
      prices['mesh_panel_fee'] = prices['mesh_panel']
    }

    // 4. Formula compatibility: vinyl panel fees
    // The vinyl formula uses p(prices, 'vinyl_panel_fee_short'), etc.
    // These come from the fee column on vinyl_panel size options.
    if (options) {
      for (const option of options) {
        if (option.pricing_key && option.fee && Number(option.fee) > 0) {
          // vinyl_short -> vinyl_panel_fee_short
          if (option.pricing_key.startsWith('vinyl_')) {
            prices[`vinyl_panel_fee_${option.option_value}`] = Number(option.fee)
          }
        }
      }
    }

    // 5. Formula compatibility: legacy track keys
    // Old formulas use track_std_7ft, track_heavy_7ft, etc.
    // Map from new SKUs to old formula keys.
    const trackLegacyMap: Record<string, string> = {
      'track_standard_straight': 'track_std_7ft',
      'track_heavy_straight': 'track_heavy_7ft',
      'track_standard_curve_90': 'track_curve_90',
      'track_heavy_curve_90': 'track_heavy_curve_90',
      'track_standard_curve_135': 'track_curve_135',
      'track_heavy_curve_135': 'track_heavy_curve_135',
      'track_standard_splice': 'track_splice',
      'track_heavy_splice': 'track_heavy_splice',
      'track_standard_endcap': 'track_endcap',
      'track_heavy_endcap': 'track_heavy_endcap',
      'track_standard_carrier': 'track_carrier',
      'track_heavy_carrier': 'track_heavy_carrier',
    }
    for (const [newSku, oldKey] of Object.entries(trackLegacyMap)) {
      if (prices[newSku] !== undefined) {
        prices[oldKey] = prices[newSku]
      }
    }

    // 6. Formula compatibility: legacy attachment/accessory keys
    // Old formulas use single keys like 'marine_snap', 'elastic_cord', etc.
    const legacyKeys: Record<string, string> = {
      'marine_snap_black': 'marine_snap',
      'adhesive_snap_black': 'adhesive_snap_bw',
      'adhesive_snap_clear': 'adhesive_snap_clear',
      'elastic_cord_black': 'elastic_cord',
      'velcro_black': 'adhesive_velcro',
      'webbing_black': 'webbing',
      'snap_tape_black': 'snap_tape',
    }
    for (const [newSku, oldKey] of Object.entries(legacyKeys)) {
      if (prices[newSku] !== undefined && prices[oldKey] === undefined) {
        prices[oldKey] = prices[newSku]
      }
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
