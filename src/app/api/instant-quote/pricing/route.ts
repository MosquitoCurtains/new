import { NextResponse } from 'next/server'
import {
  getInstantQuotePricingConfig,
  getInstantQuoteAvailableOptions,
} from '@/lib/pricing/instant-quote-service'

/**
 * GET /api/instant-quote/pricing
 * 
 * Public endpoint that returns the instant quote pricing config
 * and available dropdown options (excludes admin_only rows).
 * Used by the client-side StandaloneInstantQuote component.
 * Falls back to hard-coded defaults if DB is unreachable.
 */
export async function GET() {
  try {
    const [config, availableOptions] = await Promise.all([
      getInstantQuotePricingConfig(),
      getInstantQuoteAvailableOptions(),
    ])
    return NextResponse.json({ config, availableOptions })
  } catch (err) {
    console.error('[InstantQuotePricing] API error:', err)
    // Return defaults on error so the calculator still works
    const { DEFAULT_PRICING_CONFIG } = await import('@/lib/pricing/instant-quote')
    return NextResponse.json({ config: DEFAULT_PRICING_CONFIG, availableOptions: null })
  }
}
