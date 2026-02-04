/**
 * Fast Customer Extractor with pagination
 * 
 * Uses SQL aggregation for speed instead of fetching all orders
 */
import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CustomerAggregation {
  email: string
  total_orders: number
  total_spent: number
  first_order: string
  last_order: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_state: string | null
  billing_city: string | null
  billing_zip: string | null
  first_salesperson: string | null
  first_utm_source: string | null
}

function calculateRFMScores(
  customers: CustomerAggregation[],
  referenceDate: Date
): Map<string, { r: number; f: number; m: number; ltv: string }> {
  // Calculate percentiles for each metric
  const recencies = customers.map(c => {
    const daysSince = Math.floor((referenceDate.getTime() - new Date(c.last_order).getTime()) / (1000 * 60 * 60 * 24))
    return { email: c.email, value: daysSince }
  }).sort((a, b) => a.value - b.value) // Lower is better for recency
  
  const frequencies = customers.map(c => ({ email: c.email, value: c.total_orders }))
    .sort((a, b) => b.value - a.value) // Higher is better
  
  const monetaries = customers.map(c => ({ email: c.email, value: c.total_spent }))
    .sort((a, b) => b.value - a.value) // Higher is better

  const scores = new Map<string, { r: number; f: number; m: number; ltv: string }>()
  
  // Assign quintile scores (1-5)
  const assignScore = (list: { email: string; value: number }[], higherIsBetter: boolean) => {
    const n = list.length
    list.forEach((item, index) => {
      const percentile = index / n
      let score: number
      if (higherIsBetter) {
        score = percentile < 0.2 ? 5 : percentile < 0.4 ? 4 : percentile < 0.6 ? 3 : percentile < 0.8 ? 2 : 1
      } else {
        score = percentile < 0.2 ? 5 : percentile < 0.4 ? 4 : percentile < 0.6 ? 3 : percentile < 0.8 ? 2 : 1
      }
      
      const existing = scores.get(item.email) || { r: 0, f: 0, m: 0, ltv: 'new' }
      scores.set(item.email, existing)
    })
  }
  
  // Simpler: Just calculate based on index position in sorted list
  recencies.forEach((item, index) => {
    const percentile = index / recencies.length
    const score = percentile < 0.2 ? 5 : percentile < 0.4 ? 4 : percentile < 0.6 ? 3 : percentile < 0.8 ? 2 : 1
    const existing = scores.get(item.email) || { r: 0, f: 0, m: 0, ltv: 'new' }
    existing.r = score
    scores.set(item.email, existing)
  })
  
  frequencies.forEach((item, index) => {
    const percentile = index / frequencies.length
    const score = percentile < 0.2 ? 5 : percentile < 0.4 ? 4 : percentile < 0.6 ? 3 : percentile < 0.8 ? 2 : 1
    const existing = scores.get(item.email)!
    existing.f = score
  })
  
  monetaries.forEach((item, index) => {
    const percentile = index / monetaries.length
    const score = percentile < 0.2 ? 5 : percentile < 0.4 ? 4 : percentile < 0.6 ? 3 : percentile < 0.8 ? 2 : 1
    const existing = scores.get(item.email)!
    existing.m = score
    
    // Calculate LTV tier based on total spent
    if (item.value >= 5000) existing.ltv = 'vip'
    else if (item.value >= 2000) existing.ltv = 'high'
    else if (item.value >= 500) existing.ltv = 'medium'
    else if (item.value >= 100) existing.ltv = 'low'
    else existing.ltv = 'new'
  })
  
  return scores
}

async function extractCustomers() {
  console.log('=== CUSTOMER EXTRACTION (Fast) ===\n')
  
  // Use raw SQL for aggregation - much faster than fetching all rows
  console.log('Aggregating customer data via SQL...')
  
  const PAGE_SIZE = 1000
  let allCustomers: CustomerAggregation[] = []
  let offset = 0
  let hasMore = true
  
  while (hasMore) {
    const { data, error } = await supabase.rpc('get_customer_aggregation', {
      p_limit: PAGE_SIZE,
      p_offset: offset
    })
    
    if (error) {
      // Function doesn't exist, let's create it or use alternative
      console.log('Creating aggregation function...')
      break
    }
    
    if (data && data.length > 0) {
      allCustomers = allCustomers.concat(data)
      offset += PAGE_SIZE
      console.log(`  Fetched ${allCustomers.length} customers...`)
    } else {
      hasMore = false
    }
  }
  
  // Fallback: paginate through orders manually
  if (allCustomers.length === 0) {
    console.log('Using fallback pagination method...')
    console.log('(Fetching all 31k+ orders with pagination...)\n')
    
    const customerMap = new Map<string, CustomerAggregation>()
    let orderOffset = 0
    const ORDER_PAGE = 1000 // Supabase default limit is 1000
    
    while (true) {
      const { data: orders, error, count } = await supabase
        .from('legacy_orders')
        .select('email, order_date, total, billing_first_name, billing_last_name, billing_phone, billing_state, billing_city, billing_zip, salesperson_username, utm_source', { count: 'exact' })
        .not('email', 'is', null)
        .range(orderOffset, orderOffset + ORDER_PAGE - 1)
        .order('woo_order_id', { ascending: true })
      
      if (error) {
        console.error('Error fetching orders:', error.message)
        break
      }
      
      if (!orders || orders.length === 0) {
        console.log(`  No more orders at offset ${orderOffset}`)
        break
      }
      
      console.log(`  Processing orders ${orderOffset + 1}-${orderOffset + orders.length} of ~${count || '?'}...`)
      
      for (const order of orders) {
        const email = order.email.toLowerCase().trim()
        const existing = customerMap.get(email)
        
        if (existing) {
          existing.total_orders++
          existing.total_spent += order.total || 0
          if (new Date(order.order_date) > new Date(existing.last_order)) {
            existing.last_order = order.order_date
          }
          if (new Date(order.order_date) < new Date(existing.first_order)) {
            existing.first_order = order.order_date
            existing.first_salesperson = order.salesperson_username
            existing.first_utm_source = order.utm_source
          }
        } else {
          customerMap.set(email, {
            email,
            total_orders: 1,
            total_spent: order.total || 0,
            first_order: order.order_date,
            last_order: order.order_date,
            billing_first_name: order.billing_first_name,
            billing_last_name: order.billing_last_name,
            billing_phone: order.billing_phone,
            billing_state: order.billing_state,
            billing_city: order.billing_city,
            billing_zip: order.billing_zip,
            first_salesperson: order.salesperson_username,
            first_utm_source: order.utm_source,
          })
        }
      }
      
      orderOffset += ORDER_PAGE
      if (orders.length < ORDER_PAGE) break
    }
    
    allCustomers = Array.from(customerMap.values())
  }
  
  console.log(`\nFound ${allCustomers.length} unique customers`)
  
  if (allCustomers.length === 0) {
    console.log('No customers to process')
    return
  }
  
  // Calculate RFM scores
  console.log('Calculating RFM scores...')
  const rfmScores = calculateRFMScores(allCustomers, new Date())
  
  // Update customers in batches
  console.log('Updating customer records...')
  const BATCH_SIZE = 100
  let updated = 0
  let created = 0
  
  for (let i = 0; i < allCustomers.length; i += BATCH_SIZE) {
    const batch = allCustomers.slice(i, i + BATCH_SIZE)
    
    for (const customer of batch) {
      const rfm = rfmScores.get(customer.email)!
      
      const customerData = {
        email: customer.email,
        first_name: customer.billing_first_name,
        last_name: customer.billing_last_name,
        phone: customer.billing_phone,
        city: customer.billing_city,
        state: customer.billing_state,
        zip: customer.billing_zip,
        total_orders: customer.total_orders,
        total_spent: customer.total_spent,
        average_order_value: customer.total_orders > 0 ? customer.total_spent / customer.total_orders : 0,
        first_order_at: customer.first_order,
        last_order_at: customer.last_order,
        rfm_recency_score: rfm.r,
        rfm_frequency_score: rfm.f,
        rfm_monetary_score: rfm.m,
        ltv_tier: rfm.ltv,
        acquisition_source: customer.first_utm_source,
        assigned_salesperson: customer.first_salesperson,
        updated_at: new Date().toISOString(),
      }
      
      const { error } = await supabase
        .from('customers')
        .upsert(customerData, { onConflict: 'email' })
      
      if (error) {
        console.error(`Error updating ${customer.email}: ${error.message}`)
      } else {
        updated++
      }
    }
    
    console.log(`  Processed ${Math.min(i + BATCH_SIZE, allCustomers.length)}/${allCustomers.length}`)
  }
  
  console.log(`\n=== COMPLETE ===`)
  console.log(`Customers updated: ${updated}`)
  
  // Show tier distribution
  const tierCounts = new Map<string, number>()
  for (const customer of allCustomers) {
    const rfm = rfmScores.get(customer.email)!
    tierCounts.set(rfm.ltv, (tierCounts.get(rfm.ltv) || 0) + 1)
  }
  
  console.log('\nLTV Tier Distribution:')
  for (const [tier, count] of tierCounts) {
    console.log(`  ${tier}: ${count}`)
  }
}

extractCustomers().catch(console.error)
