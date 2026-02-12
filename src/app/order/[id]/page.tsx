'use client'

/**
 * Order Confirmation Page
 * 
 * Shows order details after successful checkout.
 * Fetches real order data from the database.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Phone,
  Mail,
  FileText,
  ArrowRight,
  Printer,
  Home,
  User,
  AlertCircle,
  MapPin,
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

interface OrderItem {
  id: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  widthInches?: number
  heightInches?: number
  lengthFeet?: number
  specs?: Record<string, unknown>
  options?: Array<{
    option_name: string
    option_value: string
    option_display?: string
  }>
}

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  email: string
  customerFirstName: string
  customerLastName: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  createdAt: string
  shippingAddress?: {
    firstName?: string
    lastName?: string
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.id as string
  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('not_found')
          } else {
            setError('fetch_failed')
          }
          return
        }

        const data = await res.json()
        setOrder(data.order)
        setItems(data.items || [])
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('fetch_failed')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="text-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-8 md:p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <Heading level={2} className="!mb-2">Order Not Found</Heading>
              <Text className="text-gray-600 mb-6">
                We couldn&apos;t find an order with that ID. If you just placed an order, 
                please check your email for confirmation.
              </Text>
              <div className="flex justify-center gap-4">
                <Button variant="primary" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:7706454745">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </Stack>
      </Container>
    )
  }

  // Build a description string for each item
  function getItemDescription(item: OrderItem): string {
    const parts: string[] = []
    if (item.widthInches) parts.push(`${item.widthInches}" wide`)
    if (item.heightInches) parts.push(`${item.heightInches}" tall`)
    if (item.lengthFeet) parts.push(`${item.lengthFeet} ft`)
    if (item.options && item.options.length > 0) {
      item.options.forEach(opt => {
        if (opt.option_display) {
          parts.push(opt.option_display)
        } else if (opt.option_value) {
          parts.push(opt.option_value)
        }
      })
    }
    return parts.join(' - ') || item.sku || ''
  }

  const hasShippingAddress = order.shippingAddress?.street

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Success Header */}
        {isSuccess && (
          <section className="text-center py-8">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#406517]" />
            </div>
            <Heading level={1} className="!mb-2">Thank You for Your Order!</Heading>
            <Text className="text-gray-600 text-lg">
              Your order has been received and is being processed.
            </Text>
          </section>
        )}

        {/* Order Header */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3">
                <Heading level={2} className="!mb-0">Order #{order.orderNumber}</Heading>
                <Badge 
                  className={order.paymentStatus === 'paid' 
                    ? '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30' 
                    : '!bg-[#FFA501]/10 !text-[#FFA501] !border-[#FFA501]/30'
                  }
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
              <Text className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8">
            <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
              {/* Order Details */}
              <div className="lg:col-span-2">
                <Stack gap="lg">
                  {/* Order Items */}
                  <Card variant="elevated" className="!p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-[#406517]" />
                      <Heading level={3} className="!mb-0">Order Items</Heading>
                    </div>

                    {items.length > 0 ? (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <Text className="font-medium text-gray-900 !mb-0">{item.name}</Text>
                              <Text size="sm" className="text-gray-500 !mb-0">
                                {getItemDescription(item)}
                              </Text>
                              {item.quantity > 1 && (
                                <Text size="sm" className="text-gray-400 !mb-0">
                                  Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}
                                </Text>
                              )}
                            </div>
                            <Text className="font-semibold text-gray-900 !mb-0">
                              ${item.totalPrice.toFixed(2)}
                            </Text>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text className="text-gray-500">
                        Order items will appear here once fully processed.
                      </Text>
                    )}

                    {/* Totals */}
                    <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">
                          {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span className="text-[#406517]">-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[#406517]">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* What's Next */}
                  <Card variant="elevated" className="!p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="w-5 h-5 text-[#003365]" />
                      <Heading level={3} className="!mb-0">What&apos;s Next?</Heading>
                    </div>

                    <Stack gap="md">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-[#406517]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#406517] font-bold">1</span>
                        </div>
                        <div>
                          <Text className="font-medium text-gray-900 !mb-1">Order Confirmation</Text>
                          <Text size="sm" className="text-gray-600 !mb-0">
                            You&apos;ll receive an email confirmation at {order.email}
                          </Text>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 font-bold">2</span>
                        </div>
                        <div>
                          <Text className="font-medium text-gray-900 !mb-1">Production</Text>
                          <Text size="sm" className="text-gray-600 !mb-0">
                            Your custom panels will be manufactured within 5-7 business days
                          </Text>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 font-bold">3</span>
                        </div>
                        <div>
                          <Text className="font-medium text-gray-900 !mb-1">Shipping</Text>
                          <Text size="sm" className="text-gray-600 !mb-0">
                            We&apos;ll send you tracking information once your order ships
                          </Text>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 font-bold">4</span>
                        </div>
                        <div>
                          <Text className="font-medium text-gray-900 !mb-1">Installation</Text>
                          <Text size="sm" className="text-gray-600 !mb-0">
                            Follow our installation guides or contact us for support
                          </Text>
                        </div>
                      </div>
                    </Stack>
                  </Card>
                </Stack>
              </div>

              {/* Sidebar */}
              <div>
                <Stack gap="md">
                  {/* Customer Info */}
                  <Card variant="outlined" className="!p-4">
                    <Heading level={4} className="!mb-3">Customer</Heading>
                    <Stack gap="sm">
                      {(order.customerFirstName || order.customerLastName) && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <Text className="text-gray-700 !mb-0">
                            {order.customerFirstName} {order.customerLastName}
                          </Text>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Text className="text-gray-700 !mb-0">{order.email}</Text>
                      </div>
                    </Stack>
                  </Card>

                  {/* Shipping Address */}
                  {hasShippingAddress && (
                    <Card variant="outlined" className="!p-4">
                      <Heading level={4} className="!mb-3">Shipping To</Heading>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <Text className="text-gray-700 !mb-0">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                          {order.shippingAddress?.street}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                        </Text>
                      </div>
                    </Card>
                  )}

                  {/* Need Help */}
                  <Card variant="outlined" className="!p-4">
                    <Heading level={4} className="!mb-3">Need Help?</Heading>
                    <Stack gap="sm">
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href="tel:7706454745">
                          <Phone className="w-4 h-4 mr-2" />
                          (770) 645-4745
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href="mailto:info@mosquitocurtains.com">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Support
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/install">
                          <FileText className="w-4 h-4 mr-2" />
                          Installation Guides
                        </Link>
                      </Button>
                    </Stack>
                  </Card>

                  {/* Actions */}
                  <Stack gap="sm">
                    <div className="flex justify-center">
                      <Button variant="primary" asChild>
                        <Link href="/">
                          <Home className="w-4 h-4 mr-2" />
                          Return Home
                        </Link>
                      </Button>
                    </div>
                  </Stack>
                </Stack>
              </div>
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
