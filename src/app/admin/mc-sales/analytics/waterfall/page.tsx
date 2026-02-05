'use client'

/**
 * Customer Order History View
 * 
 * View individual customer order history from legacy data:
 * - Customer list with lifetime value
 * - First touch attribution
 * - Complete order timeline with attribution per order
 * - Salesperson tracking
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Globe,
  CreditCard,
  Search,
  RefreshCw,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
  Input,
} from '@/lib/design-system'
import { createClient } from '@/lib/supabase/client'

// =============================================================================
// TYPES
// =============================================================================

interface LegacyCustomer {
  email: string
  first_name: string | null
  last_name: string | null
  order_count: number
  total_spent: number
  first_order_date: string
  last_order_date: string
  first_utm_source: string | null
  first_utm_medium: string | null
}

interface LegacyOrder {
  id: string
  order_number: string
  order_date: string
  total: number
  status: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  session_entry: string | null
  session_pages: number | null
  device_type: string | null
  referrer: string | null
  salesperson_username: string | null
  billing_first_name: string | null
  billing_last_name: string | null
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomerWaterfallPage() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<LegacyCustomer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<LegacyCustomer | null>(null)
  const [orders, setOrders] = useState<LegacyOrder[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Fetch customer list
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      // Get unique customers from legacy_orders with aggregates (paginate to get all)
      let allOrders: {
        email: string
        billing_first_name: string | null
        billing_last_name: string | null
        order_date: string
        total: number
        utm_source: string | null
        utm_medium: string | null
      }[] = []
      
      let offset = 0
      while (true) {
        const { data, error } = await supabase
          .from('legacy_orders')
          .select('email, billing_first_name, billing_last_name, order_date, total, utm_source, utm_medium')
          .order('order_date', { ascending: false })
          .range(offset, offset + 999)
        
        if (error) throw error
        if (!data || data.length === 0) break
        allOrders.push(...data)
        if (data.length < 1000) break
        offset += 1000
      }
      
      // Aggregate by email
      const customerMap = new Map<string, LegacyCustomer>()
      allOrders.forEach(o => {
        const existing = customerMap.get(o.email)
        if (existing) {
          existing.order_count++
          existing.total_spent += Number(o.total || 0)
          if (o.order_date < existing.first_order_date) {
            existing.first_order_date = o.order_date
            existing.first_utm_source = o.utm_source
            existing.first_utm_medium = o.utm_medium
          }
          if (o.order_date > existing.last_order_date) {
            existing.last_order_date = o.order_date
          }
        } else {
          customerMap.set(o.email, {
            email: o.email,
            first_name: o.billing_first_name,
            last_name: o.billing_last_name,
            order_count: 1,
            total_spent: Number(o.total || 0),
            first_order_date: o.order_date,
            last_order_date: o.order_date,
            first_utm_source: o.utm_source,
            first_utm_medium: o.utm_medium
          })
        }
      })
      
      // Sort by most recent order
      const sortedCustomers = Array.from(customerMap.values())
        .sort((a, b) => new Date(b.last_order_date).getTime() - new Date(a.last_order_date).getTime())
        .slice(0, 100)
      
      setCustomers(sortedCustomers)
    } catch (err) {
      console.error('Error fetching customers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomerOrders = async (email: string) => {
    setIsLoadingDetails(true)
    try {
      const { data, error } = await supabase
        .from('legacy_orders')
        .select('id, order_number, order_date, total, status, utm_source, utm_medium, utm_campaign, session_entry, session_pages, device_type, referrer, salesperson_username, billing_first_name, billing_last_name')
        .eq('email', email)
        .order('order_date', { ascending: true })
      
      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching customer orders:', err)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const selectCustomer = async (customer: LegacyCustomer) => {
    setSelectedCustomer(customer)
    await fetchCustomerOrders(customer.email)
  }

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      c.email?.toLowerCase().includes(query) ||
      c.first_name?.toLowerCase().includes(query) ||
      c.last_name?.toLowerCase().includes(query)
    )
  })

  const getStatusColor = (orderCount: number) => {
    if (orderCount >= 5) return '!bg-purple-50 !text-purple-700 !border-purple-200'
    if (orderCount >= 2) return '!bg-green-50 !text-green-700 !border-green-200'
    return '!bg-blue-50 !text-blue-700 !border-blue-200'
  }

  const getStatusLabel = (orderCount: number) => {
    if (orderCount >= 5) return 'VIP'
    if (orderCount >= 2) return 'Repeat'
    return 'Customer'
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/mc-sales/analytics">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          <Heading level={1} className="!mb-1">Customer Journeys</Heading>
          <Text className="text-gray-600">
            View individual customer paths from first touch to purchase
          </Text>
        </section>

        {/* Search */}
        <section>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {/* Content */}
        <section>
          <Grid responsiveCols={{ mobile: 1, desktop: 2 }} gap="lg">
            {/* Customer List */}
            <Card variant="elevated" className="!p-0 overflow-hidden max-h-[600px] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
                <Heading level={3} className="!mb-0 !text-base">
                  Customers ({filteredCustomers.length})
                </Heading>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : filteredCustomers.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.email}
                      onClick={() => selectCustomer(customer)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedCustomer?.email === customer.email ? 'bg-[#406517]/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Text className="font-medium text-gray-900 !mb-0">
                            {customer.first_name || customer.last_name 
                              ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                              : 'Anonymous'}
                          </Text>
                          <Text size="sm" className="text-gray-500 !mb-0">
                            {customer.email}
                          </Text>
                        </div>
                        <Badge className={getStatusColor(customer.order_count)}>
                          {getStatusLabel(customer.order_count)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        {customer.first_utm_source && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {customer.first_utm_source}/{customer.first_utm_medium || 'none'}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {customer.order_count} order{customer.order_count !== 1 ? 's' : ''}
                        </span>
                        {customer.total_spent > 0 && (
                          <span className="text-[#406517] font-medium">
                            ${customer.total_spent.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Text className="text-gray-500 !mb-0">No customers found</Text>
                </div>
              )}
            </Card>

            {/* Customer Detail */}
            <Card variant="elevated" className="!p-6">
              {selectedCustomer ? (
                <Stack gap="lg">
                  {/* Customer Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <Heading level={2} className="!mb-1">
                        {selectedCustomer.first_name || selectedCustomer.last_name 
                          ? `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim()
                          : 'Customer'}
                      </Heading>
                      <Text className="text-gray-500 !mb-0">{selectedCustomer.email}</Text>
                    </div>
                    <Badge className={getStatusColor(selectedCustomer.order_count)}>
                      {getStatusLabel(selectedCustomer.order_count)}
                    </Badge>
                  </div>

                  {/* Customer Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <Text size="sm" className="text-gray-500 !mb-1">First Touch</Text>
                      <Text className="font-medium text-gray-900 !mb-0">
                        {selectedCustomer.first_utm_source || 'Direct'}
                        {selectedCustomer.first_utm_medium && (
                          <span className="text-gray-500"> / {selectedCustomer.first_utm_medium}</span>
                        )}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" className="text-gray-500 !mb-1">Total Orders</Text>
                      <Text className="font-medium text-gray-900 !mb-0">
                        {selectedCustomer.order_count}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" className="text-gray-500 !mb-1">Lifetime Value</Text>
                      <Text className="font-medium text-[#406517] !mb-0">
                        ${selectedCustomer.total_spent.toLocaleString()}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" className="text-gray-500 !mb-1">Customer Since</Text>
                      <Text className="font-medium text-gray-900 !mb-0">
                        {new Date(selectedCustomer.first_order_date).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>

                  {/* Order History Timeline */}
                  {isLoadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div>
                      <Heading level={3} className="!mb-4">Order History</Heading>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                        
                        <Stack gap="sm">
                          {orders.map((order, index) => (
                            <div key={order.id} className="relative flex items-start gap-4 pl-10">
                              <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                                index === 0 ? 'bg-[#406517]' : 'bg-gray-400'
                              }`}>
                                <CreditCard className="w-3 h-3 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <Text className="font-medium text-gray-900 !mb-0">
                                    Order #{order.order_number}
                                  </Text>
                                  <Text className="font-semibold text-[#406517] !mb-0">
                                    ${Number(order.total).toLocaleString()}
                                  </Text>
                                </div>
                                <Text size="sm" className="text-gray-500 !mb-0">
                                  {new Date(order.order_date).toLocaleString()}
                                </Text>
                                
                                {/* Order Attribution */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {order.utm_source && (
                                    <Badge className="!bg-blue-50 !text-blue-700 !border-blue-200 !text-xs">
                                      {order.utm_source}/{order.utm_medium || 'none'}
                                    </Badge>
                                  )}
                                  {order.device_type && (
                                    <Badge className="!bg-gray-50 !text-gray-600 !border-gray-200 !text-xs">
                                      {order.device_type}
                                    </Badge>
                                  )}
                                  {order.salesperson_username && (
                                    <Badge className="!bg-purple-50 !text-purple-700 !border-purple-200 !text-xs">
                                      {order.salesperson_username.replace('_', ' ')}
                                    </Badge>
                                  )}
                                  {order.session_pages && (
                                    <Badge className="!bg-green-50 !text-green-700 !border-green-200 !text-xs">
                                      {order.session_pages} pages viewed
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Entry Page */}
                                {order.session_entry && (
                                  <Text size="sm" className="text-gray-400 !mb-0 mt-1 truncate">
                                    Entry: {order.session_entry.replace('https://www.mosquitocurtains.com', '')}
                                  </Text>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {orders.length === 0 && (
                            <Text className="text-gray-500 !mb-0 py-4 text-center">
                              No order history found
                            </Text>
                          )}
                        </Stack>
                      </div>
                    </div>
                  )}
                </Stack>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="w-12 h-12 text-gray-300 mb-4" />
                  <Heading level={3} className="text-gray-500 !mb-2">Select a Customer</Heading>
                  <Text className="text-gray-400 !mb-0">
                    Click on a customer to view their order history
                  </Text>
                </div>
              )}
            </Card>
          </Grid>
        </section>
      </Stack>
    </Container>
  )
}
