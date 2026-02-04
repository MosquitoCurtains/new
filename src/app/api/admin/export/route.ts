/**
 * Admin Financial Export API
 * 
 * Generates CSV or JSON exports of orders, customers, products, or revenue data.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ExportType = 'orders' | 'customers' | 'products' | 'revenue'
type ExportFormat = 'csv' | 'json'

interface ExportRequest {
  type: ExportType
  format: ExportFormat
  startDate: string
  endDate: string
  includeLineItems?: boolean
  includeTax?: boolean
}

// =============================================================================
// CSV HELPERS
// =============================================================================

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCSV(data: Record<string, unknown>[], columns: string[]): string {
  const header = columns.join(',')
  const rows = data.map(row => 
    columns.map(col => escapeCSV(row[col])).join(',')
  )
  return [header, ...rows].join('\n')
}

// =============================================================================
// EXPORT HANDLERS
// =============================================================================

async function exportOrders(
  supabase: Awaited<ReturnType<typeof createClient>>,
  startDate: string,
  endDate: string,
  includeLineItems: boolean,
  format: ExportFormat
) {
  // Fetch orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59Z')
    .order('created_at', { ascending: false })

  if (error) throw error

  if (format === 'json') {
    return orders
  }

  const columns = [
    'id', 'order_number', 'created_at', 'order_status', 'payment_status',
    'customer_email', 'customer_first_name', 'customer_last_name',
    'subtotal', 'shipping', 'tax', 'total_amount',
    'shipping_address', 'city', 'state', 'zip_code'
  ]
  
  return arrayToCSV(orders || [], columns)
}

async function exportCustomers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  format: ExportFormat
) {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('total_spent', { ascending: false })

  if (error) throw error

  if (format === 'json') {
    return customers
  }

  const columns = [
    'id', 'email', 'first_name', 'last_name', 'phone',
    'city', 'state', 'total_orders', 'total_spent', 'avg_order_value',
    'first_order_date', 'last_order_date', 'ltv_tier', 'rfm_segment'
  ]
  
  return arrayToCSV(customers || [], columns)
}

async function exportProducts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  format: ExportFormat
) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('sku')

  if (error) throw error

  if (format === 'json') {
    return products
  }

  const columns = ['id', 'sku', 'name', 'description', 'product_type', 'base_price', 'is_active']
  
  return arrayToCSV(products || [], columns)
}

async function exportRevenue(
  supabase: Awaited<ReturnType<typeof createClient>>,
  startDate: string,
  endDate: string,
  format: ExportFormat
) {
  // Use the monthly_revenue view if it exists, otherwise aggregate manually
  const { data: orders, error } = await supabase
    .from('orders')
    .select('created_at, total_amount, payment_status')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59Z')
    .eq('payment_status', 'paid')

  if (error) throw error

  // Aggregate by month
  const monthlyData: Record<string, { month: string; orders: number; revenue: number }> = {}
  
  type OrderRow = { created_at: string; total_amount: number; payment_status: string }
  ;(orders as OrderRow[] | null)?.forEach(order => {
    const date = new Date(order.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        orders: 0,
        revenue: 0,
      }
    }
    
    monthlyData[monthKey].orders += 1
    monthlyData[monthKey].revenue += order.total_amount || 0
  })

  const result = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  if (format === 'json') {
    return result
  }

  const columns = ['month', 'orders', 'revenue']
  return arrayToCSV(result, columns)
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()
    const { type, format, startDate, endDate, includeLineItems = false } = body

    if (!type || !format || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    let data: unknown

    switch (type) {
      case 'orders':
        data = await exportOrders(supabase, startDate, endDate, includeLineItems, format)
        break
      case 'customers':
        data = await exportCustomers(supabase, format)
        break
      case 'products':
        data = await exportProducts(supabase, format)
        break
      case 'revenue':
        data = await exportRevenue(supabase, startDate, endDate, format)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Set appropriate headers
    const contentType = format === 'json' ? 'application/json' : 'text/csv'
    const filename = `${type}_export_${startDate}_${endDate}.${format}`

    return new NextResponse(
      format === 'json' ? JSON.stringify(data, null, 2) : data as string,
      {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      }
    )
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    )
  }
}
