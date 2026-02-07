/**
 * Tax Calculation
 * 
 * Matches shipping address to tax rates by specificity:
 *   1. Exact postcode + city match
 *   2. Exact postcode match
 *   3. State-level match
 *   4. Country-level match
 * 
 * Uses '*' as wildcard in the database for non-specific fields.
 */

import { createClient } from '@/lib/supabase/server'
import type { ShippingAddress } from './shipping'

// =============================================================================
// TYPES
// =============================================================================

export interface TaxRate {
  id: number
  country_code: string
  state_code: string
  postcode: string
  city: string
  rate: number
  tax_name: string
  priority: number
  is_compound: boolean
  is_shipping_taxable: boolean
  is_active: boolean
}

export interface TaxResult {
  taxAmount: number
  rate: number
  rateName: string
  isShippingTaxable: boolean
  matchedRate: TaxRate | null
}

// =============================================================================
// FALLBACK CONSTANTS
// =============================================================================

const FALLBACK_TAX_RATES: TaxRate[] = [
  // US Georgia: 7%
  { id: 1, country_code: 'US', state_code: 'GA', postcode: '*', city: '*', rate: 7.0, tax_name: 'Georgia', priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  // US Alpharetta GA 30004: 0% (pickup override)
  { id: 2, country_code: 'US', state_code: 'GA', postcode: '30004', city: 'ALPHARETTA', rate: 0.0, tax_name: 'Internal Zero', priority: 1, is_compound: false, is_shipping_taxable: true, is_active: true },
  // Canadian provinces
  { id: 3,  country_code: 'CA', state_code: 'AB', postcode: '*', city: '*', rate: 5.0,    tax_name: 'Alberta',               priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 4,  country_code: 'CA', state_code: 'BC', postcode: '*', city: '*', rate: 12.0,   tax_name: 'British Columbia',      priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 5,  country_code: 'CA', state_code: 'MB', postcode: '*', city: '*', rate: 12.0,   tax_name: 'Manitoba',              priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 6,  country_code: 'CA', state_code: 'NB', postcode: '*', city: '*', rate: 15.0,   tax_name: 'New-Brunswick',         priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 7,  country_code: 'CA', state_code: 'NL', postcode: '*', city: '*', rate: 15.0,   tax_name: 'Newfoundland and Labrador', priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 8,  country_code: 'CA', state_code: 'NS', postcode: '*', city: '*', rate: 15.0,   tax_name: 'Nova Scotia',           priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 9,  country_code: 'CA', state_code: 'NT', postcode: '*', city: '*', rate: 5.0,    tax_name: 'Northwest Territories', priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 10, country_code: 'CA', state_code: 'NU', postcode: '*', city: '*', rate: 5.0,    tax_name: 'Nunavut',               priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 11, country_code: 'CA', state_code: 'ON', postcode: '*', city: '*', rate: 13.0,   tax_name: 'Ontario',               priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 12, country_code: 'CA', state_code: 'PE', postcode: '*', city: '*', rate: 15.0,   tax_name: 'Prince Edward Island',  priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 13, country_code: 'CA', state_code: 'QC', postcode: '*', city: '*', rate: 14.975, tax_name: 'Quebec',                priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 14, country_code: 'CA', state_code: 'SK', postcode: '*', city: '*', rate: 11.0,   tax_name: 'Saskatchewan',          priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
  { id: 15, country_code: 'CA', state_code: 'YT', postcode: '*', city: '*', rate: 5.0,    tax_name: 'Yukon',                 priority: 1, is_compound: false, is_shipping_taxable: false, is_active: true },
]

// =============================================================================
// DATABASE FUNCTIONS
// =============================================================================

/**
 * Fetch all active tax rates from the database.
 */
export async function getAllTaxRates(): Promise<TaxRate[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .eq('is_active', true)
      .order('country_code')
      .order('state_code')
      .order('priority')

    if (error || !data || data.length === 0) {
      console.log('Tax rates: using fallback constants')
      return FALLBACK_TAX_RATES
    }

    return data
  } catch (err) {
    console.error('Error fetching tax rates:', err)
    return FALLBACK_TAX_RATES
  }
}

// =============================================================================
// TAX RATE MATCHING
// =============================================================================

/**
 * Find the most specific tax rate for an address.
 * Specificity order: postcode+city > postcode > state > country
 */
export function matchTaxRate(
  address: ShippingAddress,
  rates: TaxRate[]
): TaxRate | null {
  const country = address.country.toUpperCase()
  const state = address.state.toUpperCase()
  const postcode = (address.zip || '*').toUpperCase().trim()
  const city = (address.city || '*').toUpperCase().trim()

  // Filter to rates that match the country
  const countryRates = rates.filter(r => r.country_code === country)
  if (countryRates.length === 0) return null

  // Score each rate by specificity
  let bestMatch: TaxRate | null = null
  let bestScore = -1

  for (const rate of countryRates) {
    let score = 0

    // State match
    const rateState = rate.state_code.toUpperCase()
    if (rateState === '*') {
      score += 0
    } else if (rateState === state) {
      score += 10
    } else {
      continue // State doesn't match, skip
    }

    // Postcode match
    const ratePostcode = rate.postcode.toUpperCase()
    if (ratePostcode === '*') {
      score += 0
    } else if (ratePostcode === postcode) {
      score += 100
    } else {
      continue // Postcode doesn't match, skip
    }

    // City match
    const rateCity = rate.city.toUpperCase()
    if (rateCity === '*') {
      score += 0
    } else if (rateCity === city) {
      score += 1000
    } else {
      // City doesn't match but postcode does -- still a valid match at postcode level
      // Don't continue, just don't add city bonus
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = rate
    }
  }

  return bestMatch
}

// =============================================================================
// TAX CALCULATION
// =============================================================================

/**
 * Calculate tax for an order.
 */
export function calculateTaxFromRate(
  rate: TaxRate | null,
  subtotal: number,
  shippingCost: number
): TaxResult {
  if (!rate || rate.rate === 0) {
    return {
      taxAmount: 0,
      rate: rate?.rate || 0,
      rateName: rate?.tax_name || 'No tax',
      isShippingTaxable: rate?.is_shipping_taxable || false,
      matchedRate: rate,
    }
  }

  let taxableAmount = subtotal
  if (rate.is_shipping_taxable) {
    taxableAmount += shippingCost
  }

  const taxAmount = Math.round(taxableAmount * (rate.rate / 100) * 100) / 100

  return {
    taxAmount,
    rate: rate.rate,
    rateName: rate.tax_name,
    isShippingTaxable: rate.is_shipping_taxable,
    matchedRate: rate,
  }
}

/**
 * Full tax calculation: find rate + calculate amount.
 * This is the main entry point for tax calculation.
 */
export async function calculateTax(
  address: ShippingAddress,
  subtotal: number,
  shippingCost: number
): Promise<TaxResult> {
  const rates = await getAllTaxRates()
  const matched = matchTaxRate(address, rates)
  return calculateTaxFromRate(matched, subtotal, shippingCost)
}

/**
 * Pure calculation (no DB call) - useful for admin test calculator.
 */
export function calculateTaxPure(
  address: ShippingAddress,
  rates: TaxRate[],
  subtotal: number,
  shippingCost: number
): TaxResult {
  const matched = matchTaxRate(address, rates)
  return calculateTaxFromRate(matched, subtotal, shippingCost)
}
