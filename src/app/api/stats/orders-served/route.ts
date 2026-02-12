/**
 * Orders Served Count API
 * 
 * Returns the current "orders served" count pulled live from the
 * order_number_seq sequence in the database.
 * 
 * GET /api/stats/orders-served
 * Response: { count: number, formatted: string, source: string }
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const FALLBACK_COUNT = 95000

function buildResponse(count: number, source: string) {
  const formatted = `${count.toLocaleString('en-US')}+`
  return NextResponse.json(
    { count, formatted, source },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return buildResponse(FALLBACK_COUNT, 'env-fallback')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Call the DB function that reads the sequence value directly
    const { data, error } = await supabase.rpc('get_orders_served_count')

    if (error) {
      console.error('Error fetching orders served count:', error)
      return buildResponse(FALLBACK_COUNT, 'fallback')
    }

    const count = typeof data === 'number' ? data : FALLBACK_COUNT
    return buildResponse(count, 'database')
  } catch (error) {
    console.error('Orders served API error:', error)
    return buildResponse(FALLBACK_COUNT, 'error-fallback')
  }
}
