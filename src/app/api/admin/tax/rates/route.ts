// @ts-nocheck — tax tables not in generated Supabase types yet
/**
 * GET /api/admin/tax/rates - List all tax rates
 * POST /api/admin/tax/rates - Create or bulk-update tax rates
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllTaxRates } from '@/lib/pricing/tax'

export async function GET() {
  try {
    const rates = await getAllTaxRates()
    return NextResponse.json({ data: rates })
  } catch (error) {
    console.error('Error fetching tax rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tax rates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Bulk update mode
    if (body.updates && Array.isArray(body.updates)) {
      const results = await Promise.all(
        body.updates.map(async (update: { id: number; rate?: number; tax_name?: string; is_active?: boolean }) => {
          const fields: Record<string, unknown> = {}
          if (update.rate !== undefined) fields.rate = update.rate
          if (update.tax_name !== undefined) fields.tax_name = update.tax_name
          if (update.is_active !== undefined) fields.is_active = update.is_active

          const { data, error } = await supabase
            .from('tax_rates')
            .update(fields)
            .eq('id', update.id)
            .select()
            .single()

          return { id: update.id, data, error }
        })
      )

      const errors = results.filter(r => r.error)
      if (errors.length > 0) {
        return NextResponse.json(
          { error: 'Some updates failed', failed: errors.map(e => e.id) },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, updated: results.length })
    }

    // Single create mode
    const { country_code, state_code, postcode, city, rate, tax_name, priority, is_compound, is_shipping_taxable } = body

    if (!country_code || rate === undefined || !tax_name) {
      return NextResponse.json(
        { error: 'country_code, rate, and tax_name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tax_rates')
      .insert({
        country_code,
        state_code: state_code || '*',
        postcode: postcode || '*',
        city: city || '*',
        rate,
        tax_name,
        priority: priority || 1,
        is_compound: is_compound || false,
        is_shipping_taxable: is_shipping_taxable || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error with tax rates:', error)
    return NextResponse.json(
      { error: 'Failed to process tax rates' },
      { status: 500 }
    )
  }
}
