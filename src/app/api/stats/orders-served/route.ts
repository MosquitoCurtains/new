/**
 * Orders Served Count API
 * 
 * Returns the current "orders served" count for display on the website.
 * This is a public endpoint that can be cached.
 * 
 * GET /api/stats/orders-served
 * Response: { count: number, formatted: string }
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use anon key for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Get the orders served count from site_settings
    const { data, error } = await supabase
      .rpc('get_site_setting', { setting_key: 'orders_served_count' })

    if (error) {
      console.error('Error fetching orders served count:', error)
      // Fallback to a reasonable default
      return NextResponse.json(
        { 
          count: 92000, 
          formatted: '92,000+',
          source: 'fallback'
        },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          }
        }
      )
    }

    const count = data?.count || 92000
    const displayFormat = data?.display_format || '{count}+'
    
    // Format the count with commas
    const formattedCount = count.toLocaleString('en-US')
    const formatted = displayFormat.replace('{count}', formattedCount)

    return NextResponse.json(
      { 
        count,
        formatted,
        source: data?.source || 'database'
      },
      {
        status: 200,
        headers: {
          // Cache for 1 hour, allow stale for 24 hours while revalidating
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      }
    )
  } catch (error) {
    console.error('Orders served API error:', error)
    return NextResponse.json(
      { 
        count: 92000, 
        formatted: '92,000+',
        source: 'error-fallback'
      },
      { status: 200 }
    )
  }
}
