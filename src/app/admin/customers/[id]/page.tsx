'use client'

/**
 * Admin Customer Detail Page
 * 
 * Detailed view of a single customer with order history and metrics.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Star,
  Package,
  Clock,
  CheckCircle,
  Edit,
  Tag,
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
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface CustomerDetail {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  firstOrderDate: string
  lastOrderDate: string
  rfmScore: {
    recency: number
    frequency: number
    monetary: number
    total: number
    segment: string
  }
  ltvTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  salesperson?: string
  notes?: string
  tags?: string[]
  orders: Array<{
    id: string
    orderNumber: string
    date: string
    total: number
    status: string
    itemCount: number
  }>
  productPreferences: Array<{
    category: string
    count: number
    percentage: number
  }>
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CUSTOMER: CustomerDetail = {
  id: 'cust_001',
  email: 'john.smith@example.com',
  firstName: 'John',
  lastName: 'Smith',
  phone: '(555) 123-4567',
  address: {
    street: '123 Oak Street',
    city: 'Atlanta',
    state: 'GA',
    zip: '30301',
  },
  totalOrders: 5,
  totalSpent: 4850.00,
  avgOrderValue: 970.00,
  firstOrderDate: '2024-03-15',
  lastOrderDate: '2026-01-20',
  rfmScore: { recency: 5, frequency: 4, monetary: 4, total: 13, segment: 'Champion' },
  ltvTier: 'gold',
  salesperson: 'Sarah M.',
  notes: 'Prefers tracking systems. Has a large screened porch.',
  tags: ['VIP', 'Repeat Buyer', 'Tracking'],
  orders: [
    { id: 'ord_001', orderNumber: 'MC-2026-001234', date: '2026-01-20', total: 1847.50, status: 'delivered', itemCount: 8 },
    { id: 'ord_002', orderNumber: 'MC-2025-089432', date: '2025-08-15', total: 1250.00, status: 'delivered', itemCount: 5 },
    { id: 'ord_003', orderNumber: 'MC-2025-045678', date: '2025-03-10', total: 650.00, status: 'delivered', itemCount: 3 },
  ],
  productPreferences: [
    { category: 'Mesh Panels', count: 12, percentage: 55 },
    { category: 'Track Hardware', count: 8, percentage: 35 },
    { category: 'Accessories', count: 3, percentage: 10 },
  ],
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const LTV_CONFIG = {
  bronze: { color: '!bg-amber-100 !text-amber-800 !border-amber-200', label: 'Bronze' },
  silver: { color: '!bg-gray-100 !text-gray-700 !border-gray-200', label: 'Silver' },
  gold: { color: '!bg-yellow-100 !text-yellow-800 !border-yellow-200', label: 'Gold' },
  platinum: { color: '!bg-cyan-100 !text-cyan-800 !border-cyan-200', label: 'Platinum' },
  diamond: { color: '!bg-purple-100 !text-purple-800 !border-purple-200', label: 'Diamond' },
}

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle }> = {
  delivered: { color: '!bg-[#406517]/10 !text-[#406517]', icon: CheckCircle },
  shipped: { color: '!bg-[#B30158]/10 !text-[#B30158]', icon: Package },
  processing: { color: '!bg-[#FFA501]/10 !text-[#FFA501]', icon: Clock },
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setCustomer(MOCK_CUSTOMER)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  if (isLoading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!customer) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <Card variant="elevated" className="!p-8 text-center">
            <Heading level={2}>Customer Not Found</Heading>
            <div className="flex justify-center mt-4">
              <Button variant="primary" asChild>
                <Link href="/admin/customers">Back to Customers</Link>
              </Button>
            </div>
          </Card>
        </Stack>
      </Container>
    )
  }

  const ltv = LTV_CONFIG[customer.ltvTier]

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/customers">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <Heading level={1} className="!mb-0">
                    {customer.firstName} {customer.lastName}
                  </Heading>
                  <Badge className={`${ltv.color} capitalize`}>
                    <Star className="w-3 h-3 mr-1" />
                    {ltv.label}
                  </Badge>
                </div>
                <Text className="text-gray-600">{customer.email}</Text>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </section>

        {/* Main Content */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8">
            <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Stack gap="lg">
                  {/* Metrics */}
                  <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                    <Card variant="elevated" className="!p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-[#406517]" />
                        <Text size="sm" className="text-gray-500 !mb-0">Total Spent</Text>
                      </div>
                      <Text className="text-2xl font-bold text-gray-900 !mb-0">
                        ${customer.totalSpent.toLocaleString()}
                      </Text>
                    </Card>

                    <Card variant="elevated" className="!p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-[#003365]" />
                        <Text size="sm" className="text-gray-500 !mb-0">Orders</Text>
                      </div>
                      <Text className="text-2xl font-bold text-gray-900 !mb-0">
                        {customer.totalOrders}
                      </Text>
                    </Card>

                    <Card variant="elevated" className="!p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#B30158]" />
                        <Text size="sm" className="text-gray-500 !mb-0">Avg Order</Text>
                      </div>
                      <Text className="text-2xl font-bold text-gray-900 !mb-0">
                        ${customer.avgOrderValue.toFixed(0)}
                      </Text>
                    </Card>

                    <Card variant="elevated" className="!p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-[#FFA501]" />
                        <Text size="sm" className="text-gray-500 !mb-0">Customer Since</Text>
                      </div>
                      <Text className="text-lg font-bold text-gray-900 !mb-0">
                        {new Date(customer.firstOrderDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </Text>
                    </Card>
                  </Grid>

                  {/* RFM Score */}
                  <Card variant="elevated" className="!p-6">
                    <Heading level={3} className="!mb-4">RFM Analysis</Heading>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#003365]/10 flex items-center justify-center mb-2">
                          <Text className="text-2xl font-bold text-[#003365] !mb-0">{customer.rfmScore.recency}</Text>
                        </div>
                        <Text size="sm" className="text-gray-500 !mb-0">Recency</Text>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#406517]/10 flex items-center justify-center mb-2">
                          <Text className="text-2xl font-bold text-[#406517] !mb-0">{customer.rfmScore.frequency}</Text>
                        </div>
                        <Text size="sm" className="text-gray-500 !mb-0">Frequency</Text>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#B30158]/10 flex items-center justify-center mb-2">
                          <Text className="text-2xl font-bold text-[#B30158] !mb-0">{customer.rfmScore.monetary}</Text>
                        </div>
                        <Text size="sm" className="text-gray-500 !mb-0">Monetary</Text>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[#FFA501]/10 flex items-center justify-center mb-2">
                          <Text className="text-2xl font-bold text-[#FFA501] !mb-0">{customer.rfmScore.total}</Text>
                        </div>
                        <Text size="sm" className="text-gray-500 !mb-0">Total</Text>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                        {customer.rfmScore.segment}
                      </Badge>
                    </div>
                  </Card>

                  {/* Order History */}
                  <Card variant="elevated" className="!p-6">
                    <Heading level={3} className="!mb-4">Order History</Heading>
                    <div className="space-y-3">
                      {customer.orders.map((order) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing
                        const StatusIcon = status.icon
                        return (
                          <div 
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${status.color} flex items-center justify-center`}>
                                <StatusIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <Text className="font-medium text-gray-900 !mb-0">{order.orderNumber}</Text>
                                <Text size="sm" className="text-gray-500 !mb-0">
                                  {new Date(order.date).toLocaleDateString()} | {order.itemCount} items
                                </Text>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Text className="font-bold text-[#406517] !mb-0">${order.total.toFixed(2)}</Text>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/order/${order.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </Stack>
              </div>

              {/* Sidebar */}
              <div>
                <Stack gap="md">
                  {/* Contact Info */}
                  <Card variant="outlined" className="!p-4">
                    <Heading level={4} className="!mb-4">Contact</Heading>
                    <Stack gap="sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Text className="text-gray-700 !mb-0">{customer.email}</Text>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <Text className="text-gray-700 !mb-0">{customer.phone}</Text>
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <Text className="text-gray-700 !mb-0">
                            {customer.address.street}<br />
                            {customer.address.city}, {customer.address.state} {customer.address.zip}
                          </Text>
                        </div>
                      )}
                    </Stack>
                  </Card>

                  {/* Tags */}
                  {customer.tags && customer.tags.length > 0 && (
                    <Card variant="outlined" className="!p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Heading level={4} className="!mb-0">Tags</Heading>
                        <Button variant="ghost" size="sm">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} className="!bg-gray-100 !text-gray-700 !border-gray-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Product Preferences */}
                  <Card variant="outlined" className="!p-4">
                    <Heading level={4} className="!mb-4">Product Preferences</Heading>
                    <Stack gap="sm">
                      {customer.productPreferences.map((pref) => (
                        <div key={pref.category}>
                          <div className="flex items-center justify-between mb-1">
                            <Text size="sm" className="text-gray-700 !mb-0">{pref.category}</Text>
                            <Text size="sm" className="text-gray-500 !mb-0">{pref.percentage}%</Text>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#406517] rounded-full"
                              style={{ width: `${pref.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </Stack>
                  </Card>

                  {/* Notes */}
                  {customer.notes && (
                    <Card variant="outlined" className="!p-4">
                      <Heading level={4} className="!mb-2">Notes</Heading>
                      <Text className="text-gray-700 !mb-0">{customer.notes}</Text>
                    </Card>
                  )}

                  {/* Salesperson */}
                  {customer.salesperson && (
                    <Card variant="outlined" className="!p-4">
                      <Text size="sm" className="text-gray-500 !mb-1">Assigned Salesperson</Text>
                      <Text className="font-medium text-gray-900 !mb-0">{customer.salesperson}</Text>
                    </Card>
                  )}
                </Stack>
              </div>
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
