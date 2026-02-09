/**
 * Mosquito Curtains Pricing Engine
 * 
 * All pricing lives in the `products` and `product_options` database tables.
 * There are NO hardcoded constants — the DB is the single source of truth.
 * 
 * Server-side (API routes / server components):
 *   import { getPricingMap } from '@/lib/pricing/service'
 *   import { PriceCalculator } from '@/lib/pricing'
 *   const prices = await getPricingMap()
 *   const calc = new PriceCalculator(prices)
 * 
 * Client-side (React components):
 *   import { usePricing } from '@/hooks/usePricing'
 *   import { calculateMeshPanelPrice } from '@/lib/pricing'
 *   const { prices, isLoading } = usePricing()
 *   if (prices) {
 *     const result = calculateMeshPanelPrice(config, prices)
 *   }
 * 
 * @module pricing
 */

export * from './calculator'
export * from './types'
export * from './formulas'
// Note: service.ts is NOT re-exported here because it uses server-only
// imports (Supabase server client). Import it directly:
//   import { getPricingMap } from '@/lib/pricing/service'