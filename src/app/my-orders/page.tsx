'use client'

/**
 * Order History Page
 * 
 * Customer-facing page to view all past orders.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Package, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Truck,
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Phone,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Badge,
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface OrderSummary {
  id: string
  orderNumber: string
  status: 'processing' | 'production' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'paid' | 'pending' | 'refunded'
  total: number
  itemCount: number
  createdAt: string
  trackingNumber?: string
  trackingUrl?: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 'ord_001',
    orderNumber: 'MC-2026-001234',
    status: 'shipped',
    paymentStatus: 'paid',
    total: 1847.50,
    itemCount: 8,
    createdAt: '2026-01-20T14:30:00Z',
    trackingNumber: '1Z999AA10123456784',
    trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
  },
  {
    id: 'ord_002',
    orderNumber: 'MC-2026-001189',
    status: 'delivered',
    paymentStatus: 'paid',
    total: 645.00,
    itemCount: 4,
    createdAt: '2026-01-05T09:15:00Z',
  },
  {
    id: 'ord_003',
    orderNumber: 'MC-2025-089432',
    status: 'delivered',
    paymentStatus: 'paid',
    total: 2150.00,
    itemCount: 12,
    createdAt: '2025-11-18T16:45:00Z',
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const STATUS_CONFIG = {
  processing: { label: 'Processing', color: 'bg-[#FFA501]/10 text-[#FFA501] border-[#FFA501]/30', icon: Clock },
  production: { label: 'In Production', color: 'bg-[#003365]/10 text-[#003365] border-[#003365]/30', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-[#B30158]/10 text-[#B30158] border-[#B30158]/30', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-[#406517]/10 text-[#406517] border-[#406517]/30', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: AlertCircle },
  refunded: { label: 'Refunded', color: 'bg-red-50 text-red-600 border-red-200', icon: RefreshCw },
}

// =============================================================================
// COMPONENTS
// =============================================================================

function OrderCard({ order, isExpanded, onToggle }: { 
  order: OrderSummary
  isExpanded: boolean
  onToggle: () => void
}) {
  const status = STATUS_CONFIG[order.status]
  const StatusIcon = status.icon

  return (
    <Card variant="elevated" className="!p-0 overflow-hidden">
      {/* Header Row */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-[#406517]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-gray-900 !mb-0">{order.orderNumber}</Text>
              <Badge className={`!${status.color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <Text size="sm" className="text-gray-500 !mb-0">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })} | {order.itemCount} items
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Text className="font-bold text-[#406517] !mb-0">${order.total.toFixed(2)}</Text>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Tracking Number</Text>
                  <Text className="font-medium text-gray-900 !mb-0">{order.trackingNumber}</Text>
                </div>
                {order.trackingUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      <Truck className="w-4 h-4 mr-2" />
                      Track Package
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="primary" size="sm" asChild>
                <Link href={`/order/${order.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/start-project?reorder=${order.id}`}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reorder
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function MyOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    // For demo, show mock orders if email contains "demo"
    if (searchQuery.toLowerCase().includes('demo')) {
      setOrders(MOCK_ORDERS)
      setExpandedOrder(MOCK_ORDERS[0]?.id || null)
    } else {
      setOrders([])
    }
    setSearchedEmail(searchQuery)
    setIsSearching(false)
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter)

  return (
    <Container size="lg">
      <Stack gap="lg">
        {/* Header */}
        <section className="text-center">
          <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-[#406517]" />
          </div>
          <Heading level={1}>Order History</Heading>
          <Text className="text-gray-600">
            View your past orders and track shipments.
          </Text>
        </section>

        {/* Search Form */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8">
            <form onSubmit={handleSearch}>
              <div className="flex gap-3 max-w-xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your email address"
                    className="!pl-10"
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Find Orders'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        {searchedEmail && (
          <>
            {orders.length > 0 ? (
              <section>
                <Stack gap="md">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Heading level={3} className="!mb-1">Your Orders</Heading>
                      <Text className="text-gray-600">
                        Found {orders.length} order{orders.length !== 1 ? 's' : ''} for {searchedEmail}
                      </Text>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-[#406517]/20"
                      >
                        <option value="all">All Orders</option>
                        <option value="processing">Processing</option>
                        <option value="production">In Production</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Order List */}
                  <Stack gap="md">
                    {filteredOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        isExpanded={expandedOrder === order.id}
                        onToggle={() => setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )}
                      />
                    ))}
                  </Stack>

                  {filteredOrders.length === 0 && (
                    <Card variant="outlined" className="!p-6 text-center">
                      <Text className="text-gray-600">
                        No orders match the selected filter.
                      </Text>
                    </Card>
                  )}
                </Stack>
              </section>
            ) : (
              <section>
                <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <Heading level={3} className="!mb-2">No Orders Found</Heading>
                  <Text className="text-gray-600 mb-6">
                    We couldn&apos;t find any orders for &quot;{searchedEmail}&quot;.
                    Try a different email address or start a new project.
                  </Text>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="primary" asChild>
                      <Link href="/start-project">
                        Start a Project
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="tel:7706454745">
                        <Phone className="w-4 h-4 mr-2" />
                        Call for Help
                      </a>
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Help Section */}
        {!searchedEmail && (
          <section>
            <Card variant="outlined" className="!p-6">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                <div>
                  <Heading level={3} className="!mb-2">Need Help?</Heading>
                  <Text className="text-gray-600">
                    Can&apos;t find your order? Our team is here to help you locate your purchase.
                  </Text>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button variant="outline" asChild>
                    <a href="tel:7706454745">
                      <Phone className="w-4 h-4 mr-2" />
                      Call (770) 645-4745
                    </a>
                  </Button>
                  <Button variant="primary" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </Grid>
            </Card>
          </section>
        )}

        {/* Demo Note */}
        <section>
          <Card variant="outlined" className="!p-4 !bg-[#003365]/5 !border-[#003365]/20">
            <Text size="sm" className="text-[#003365]">
              <strong>Demo:</strong> Try searching for &quot;demo@example.com&quot; to see sample orders.
            </Text>
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
