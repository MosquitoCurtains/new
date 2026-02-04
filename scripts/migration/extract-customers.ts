/**
 * Customer Extractor
 * 
 * Extracts and aggregates customer data from legacy orders.
 * Calculates:
 * - Total orders & spend
 * - Average order value
 * - RFM scores (Recency, Frequency, Monetary)
 * - LTV tier
 * - Product preferences
 * - Geographic data
 * 
 * Usage: npx ts-node scripts/migration/extract-customers.ts
 */

import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env vars
config({ path: path.join(__dirname, '../../.env.local') })

// =============================================================================
// CONFIGURATION
// =============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabase: SupabaseClient

function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials. Check .env.local')
  }
  
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  })
}

// =============================================================================
// RFM SCORING
// =============================================================================

interface CustomerMetrics {
  email: string
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  firstOrderDate: Date
  lastOrderDate: Date
  daysSinceLastOrder: number
  productTypes: string[]
  states: string[]
  salespersons: string[]
}

/**
 * Calculate RFM scores (1-5, with 5 being best)
 */
function calculateRFM(
  customers: CustomerMetrics[],
  referenceDate: Date = new Date()
): Map<string, { recency: number; frequency: number; monetary: number; tier: string }> {
  const scores = new Map()
  
  if (customers.length === 0) return scores
  
  // Calculate percentiles for each metric
  const recencyValues = customers.map(c => c.daysSinceLastOrder).sort((a, b) => a - b)
  const frequencyValues = customers.map(c => c.totalOrders).sort((a, b) => a - b)
  const monetaryValues = customers.map(c => c.totalSpent).sort((a, b) => a - b)
  
  const getPercentile = (values: number[], value: number): number => {
    const index = values.findIndex(v => v >= value)
    return index === -1 ? 100 : (index / values.length) * 100
  }
  
  const scoreFromPercentile = (percentile: number, reverse: boolean = false): number => {
    const adjusted = reverse ? 100 - percentile : percentile
    if (adjusted >= 80) return 5
    if (adjusted >= 60) return 4
    if (adjusted >= 40) return 3
    if (adjusted >= 20) return 2
    return 1
  }
  
  for (const customer of customers) {
    // Recency: lower days = better = higher score
    const recencyScore = scoreFromPercentile(
      getPercentile(recencyValues, customer.daysSinceLastOrder), 
      true
    )
    
    // Frequency: higher orders = better = higher score
    const frequencyScore = scoreFromPercentile(
      getPercentile(frequencyValues, customer.totalOrders)
    )
    
    // Monetary: higher spend = better = higher score
    const monetaryScore = scoreFromPercentile(
      getPercentile(monetaryValues, customer.totalSpent)
    )
    
    // Calculate LTV tier based on combined score
    const totalScore = recencyScore + frequencyScore + monetaryScore
    let tier: string
    if (totalScore >= 13) tier = 'vip'
    else if (totalScore >= 10) tier = 'high'
    else if (totalScore >= 7) tier = 'medium'
    else if (totalScore >= 4) tier = 'low'
    else tier = 'new'
    
    scores.set(customer.email, {
      recency: recencyScore,
      frequency: frequencyScore,
      monetary: monetaryScore,
      tier,
    })
  }
  
  return scores
}

// =============================================================================
// MAIN EXTRACTION
// =============================================================================

async function extractAndUpdateCustomers(): Promise<void> {
  console.log('=== CUSTOMER EXTRACTION ===\n')
  
  initSupabase()
  
  // Get all legacy orders with customer data
  console.log('Fetching legacy orders...')
  
  const { data: orders, error } = await supabase
    .from('legacy_orders')
    .select(`
      email,
      order_date,
      total,
      billing_state,
      salesperson_username,
      legacy_line_items (
        item_type
      )
    `)
    .not('email', 'is', null)
    .order('email')
  
  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }
  
  console.log(`Found ${orders?.length || 0} orders`)
  
  if (!orders || orders.length === 0) {
    console.log('No orders to process')
    return
  }
  
  // Aggregate by customer email
  console.log('Aggregating customer metrics...')
  
  const customerMap = new Map<string, CustomerMetrics>()
  const now = new Date()
  
  for (const order of orders) {
    const email = order.email.toLowerCase().trim()
    
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        email,
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
        firstOrderDate: new Date(order.order_date),
        lastOrderDate: new Date(order.order_date),
        daysSinceLastOrder: 0,
        productTypes: [],
        states: [],
        salespersons: [],
      })
    }
    
    const customer = customerMap.get(email)!
    customer.totalOrders++
    customer.totalSpent += order.total || 0
    
    const orderDate = new Date(order.order_date)
    if (orderDate < customer.firstOrderDate) {
      customer.firstOrderDate = orderDate
    }
    if (orderDate > customer.lastOrderDate) {
      customer.lastOrderDate = orderDate
    }
    
    // Collect product types
    if (order.legacy_line_items) {
      for (const item of order.legacy_line_items as any[]) {
        if (item.item_type && !customer.productTypes.includes(item.item_type)) {
          customer.productTypes.push(item.item_type)
        }
      }
    }
    
    // Collect states
    if (order.billing_state && !customer.states.includes(order.billing_state)) {
      customer.states.push(order.billing_state)
    }
    
    // Collect salespersons
    if (order.salesperson_username && !customer.salespersons.includes(order.salesperson_username)) {
      customer.salespersons.push(order.salesperson_username)
    }
  }
  
  // Finalize metrics
  const customers = Array.from(customerMap.values())
  for (const customer of customers) {
    customer.avgOrderValue = customer.totalOrders > 0 
      ? customer.totalSpent / customer.totalOrders 
      : 0
    customer.daysSinceLastOrder = Math.floor(
      (now.getTime() - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  }
  
  console.log(`Found ${customers.length} unique customers`)
  
  // Calculate RFM scores
  console.log('Calculating RFM scores...')
  const rfmScores = calculateRFM(customers)
  
  // Update customers in database
  console.log('Updating customer records...')
  
  let updated = 0
  let created = 0
  let failed = 0
  
  for (const customer of customers) {
    const rfm = rfmScores.get(customer.email) || { recency: 1, frequency: 1, monetary: 1, tier: 'new' }
    
    // Check if customer exists
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single()
    
    const customerData = {
      total_orders: customer.totalOrders,
      total_spent: customer.totalSpent,
      average_order_value: customer.avgOrderValue,
      first_order_at: customer.firstOrderDate.toISOString(),
      last_order_at: customer.lastOrderDate.toISOString(),
      rfm_recency_score: rfm.recency,
      rfm_frequency_score: rfm.frequency,
      rfm_monetary_score: rfm.monetary,
      ltv_tier: rfm.tier,
      preferred_products: customer.productTypes,
      state: customer.states[0] || null,
      assigned_salesperson: customer.salespersons[0] || null,
    }
    
    if (existing) {
      // Update existing customer
      const { error: updateError } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', existing.id)
      
      if (updateError) {
        console.warn(`Failed to update ${customer.email}: ${updateError.message}`)
        failed++
      } else {
        updated++
      }
    } else {
      // Create new customer
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          email: customer.email,
          ...customerData,
          acquisition_source: 'import',
        })
      
      if (insertError) {
        console.warn(`Failed to create ${customer.email}: ${insertError.message}`)
        failed++
      } else {
        created++
      }
    }
    
    // Progress indicator
    if ((updated + created + failed) % 500 === 0) {
      console.log(`  Processed ${updated + created + failed} customers...`)
    }
  }
  
  // Summary
  console.log('\n=== EXTRACTION COMPLETE ===')
  console.log(`Updated: ${updated}`)
  console.log(`Created: ${created}`)
  console.log(`Failed: ${failed}`)
  
  // LTV tier distribution
  const tierCounts: Record<string, number> = {}
  for (const [_, rfm] of rfmScores) {
    tierCounts[rfm.tier] = (tierCounts[rfm.tier] || 0) + 1
  }
  
  console.log('\nLTV Tier Distribution:')
  for (const [tier, count] of Object.entries(tierCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tier}: ${count} (${((count / customers.length) * 100).toFixed(1)}%)`)
  }
  
  // Top states
  const stateCounts: Record<string, number> = {}
  for (const customer of customers) {
    for (const state of customer.states) {
      stateCounts[state] = (stateCounts[state] || 0) + 1
    }
  }
  
  console.log('\nTop 10 States:')
  Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([state, count]) => {
      console.log(`  ${state}: ${count}`)
    })
  
  // Revenue by tier
  console.log('\nRevenue by LTV Tier:')
  const revenueByTier: Record<string, number> = {}
  for (const customer of customers) {
    const tier = rfmScores.get(customer.email)?.tier || 'unknown'
    revenueByTier[tier] = (revenueByTier[tier] || 0) + customer.totalSpent
  }
  
  for (const [tier, revenue] of Object.entries(revenueByTier).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tier}: $${revenue.toLocaleString()}`)
  }
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

extractAndUpdateCustomers()
  .then(() => {
    console.log('\nCustomer extraction complete!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Extraction failed:', error)
    process.exit(1)
  })

export { extractAndUpdateCustomers, calculateRFM }
