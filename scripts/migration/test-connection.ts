/**
 * Quick test to verify Supabase connection and try one insert
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, '../../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('=== Supabase Connection Test ===\n')
console.log('URL:', SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('Key:', SUPABASE_KEY ? `✓ Set (${SUPABASE_KEY.slice(0, 20)}...)` : '✗ Missing')

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\nMissing credentials!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function test() {
  // Test 1: Check if legacy_orders table exists
  console.log('\n1. Testing table access...')
  const { data: tableCheck, error: tableError } = await supabase
    .from('legacy_orders')
    .select('id')
    .limit(1)
  
  if (tableError) {
    console.error('   ✗ Table error:', tableError.message)
    return
  }
  console.log('   ✓ legacy_orders table accessible')
  
  // Test 2: Try inserting a test order
  console.log('\n2. Testing insert...')
  const testOrder = {
    woo_order_id: 99999999,
    order_number: 'TEST-001',
    order_date: new Date().toISOString(),
    status: 'test',
    email: 'test@example.com',
    billing_first_name: 'Test',
    billing_last_name: 'User',
    total: 100.00,
    utm_source: 'test',
    raw_csv_row: { test: true }
  }
  
  const { data: insertData, error: insertError } = await supabase
    .from('legacy_orders')
    .insert(testOrder)
    .select('id')
    .single()
  
  if (insertError) {
    console.error('   ✗ Insert error:', insertError.message)
    console.error('   Details:', JSON.stringify(insertError, null, 2))
    return
  }
  
  console.log('   ✓ Insert successful! ID:', insertData.id)
  
  // Test 3: Clean up test record
  console.log('\n3. Cleaning up test record...')
  const { error: deleteError } = await supabase
    .from('legacy_orders')
    .delete()
    .eq('woo_order_id', 99999999)
  
  if (deleteError) {
    console.error('   ✗ Delete error:', deleteError.message)
    return
  }
  console.log('   ✓ Test record deleted')
  
  console.log('\n=== All tests passed! ===')
}

test().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
