'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Globe,
  Monitor,
  Archive,
  ExternalLink,
  ShoppingCart,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
  Button,
} from '@/lib/design-system'

// =============================================================================
// STATUS CONFIG (legacy subset)
// =============================================================================

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  'shipped': { label: 'Shipped', color: '!bg-teal-100 !text-teal-700 !border-teal-200' },
  'snap-tool-refund': { label: 'Refunded Snap Tool', color: '!bg-purple-100 !text-purple-700 !border-purple-200' },
  'completed': { label: 'Completed', color: '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30' },
  'in-production': { label: 'In Production', color: '!bg-gray-100 !text-gray-700 !border-gray-200' },
  'processing': { label: 'Payment Received', color: '!bg-green-100 !text-green-700 !border-green-200' },
  'on-hold-waiting': { label: 'On Hold - Waiting', color: '!bg-orange-100 !text-orange-600 !border-orange-200' },
  'failed': { label: 'Failed', color: '!bg-red-100 !text-red-700 !border-red-200' },
  'refunded': { label: 'Refunded', color: '!bg-purple-100 !text-purple-600 !border-purple-200' },
  'cancelled': { label: 'Cancelled', color: '!bg-red-100 !text-red-600 !border-red-200' },
}

function getStatusConfig(status: string) {
  return STATUS_MAP[status] || { label: status, color: '!bg-gray-100 !text-gray-600 !border-gray-200' }
}

// =============================================================================
// TYPES
// =============================================================================

interface LegacyOrder {
  id: string
  order_number: string
  woo_order_id: number
  email: string
  status: string
  payment_status: string | null
  payment_method: string | null
  payment_transaction_id: string | null
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  salesperson_name: string | null
  diagram_url: string | null
  created_at: string
  imported_at: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_address_1: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  source_type: string | null
  device_type: string | null
  session_entry: string | null
  session_pages: number | null
  new_order_id: string | null
  customer_id: string | null
  source: 'legacy'
}

interface LegacyLineItem {
  name: string
  sku: string
  quantity: number
  subtotal: number
  product_id: string
  meta: string
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function LegacyOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<LegacyOrder | null>(null)
  const [lineItems, setLineItems] = useState<LegacyLineItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/legacy/${id}`)
      const data = await res.json()
      if (data.order) {
        setOrder(data.order)
        setLineItems(data.lineItems || [])
      }
    } catch (err) {
      console.error('Failed to fetch legacy order:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const formatMoney = (val: number | null) => {
    if (val == null) return '$0.00'
    return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Loading legacy order...</Text>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Legacy order not found</Text>
      </Container>
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/orders')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Heading level={1} className="!mb-0">{order.order_number}</Heading>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Archive className="w-3.5 h-3.5" />
                  Legacy WooCommerce
                </span>
              </div>
              <Text size="sm" className="text-gray-500 !mb-0 mt-1">
                Order Date: {formatDate(order.created_at)}
                {order.woo_order_id > 0 && (
                  <span className="ml-3 text-gray-400">WOO #{order.woo_order_id}</span>
                )}
              </Text>
            </div>
          </div>
        </section>

        {/* Read-only notice */}
        <section>
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Archive className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <Text size="sm" className="text-amber-800 !mb-0">
              This is a legacy order imported from WooCommerce. It is read-only and cannot be modified.
            </Text>
          </div>
        </section>

        {/* Main content */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 1, desktop: 3 }} gap="md">
            {/* Left: main content (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Line Items */}
              <Card variant="elevated" className="!p-0 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-500" />
                  <Text size="sm" className="font-semibold text-gray-600 uppercase tracking-wider !mb-0">
                    Line Items
                  </Text>
                </div>
                {lineItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="text-center px-4 py-2 text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {lineItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              {item.sku && (
                                <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                              )}
                              {item.meta && (
                                <div className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">{item.meta}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                              {formatMoney(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No line item data available for this legacy order.
                  </div>
                )}

                {/* Totals */}
                <div className="border-t border-gray-200 px-4 py-3 space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span><span>{formatMoney(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span><span>{formatMoney(order.shipping_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span><span>{formatMoney(order.tax_amount)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span><span>-{formatMoney(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span><span>{formatMoney(order.total)}</span>
                  </div>
                </div>
              </Card>

              {/* Attribution / UTM */}
              {(order.utm_source || order.source_type || order.device_type) && (
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-[#003365]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Attribution</Text>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {order.utm_source && (
                      <div>
                        <span className="text-gray-500">UTM Source: </span>
                        <span className="text-gray-900">{order.utm_source}</span>
                      </div>
                    )}
                    {order.utm_medium && (
                      <div>
                        <span className="text-gray-500">UTM Medium: </span>
                        <span className="text-gray-900">{order.utm_medium}</span>
                      </div>
                    )}
                    {order.utm_campaign && (
                      <div>
                        <span className="text-gray-500">UTM Campaign: </span>
                        <span className="text-gray-900">{order.utm_campaign}</span>
                      </div>
                    )}
                    {order.source_type && (
                      <div>
                        <span className="text-gray-500">Source Type: </span>
                        <span className="text-gray-900">{order.source_type}</span>
                      </div>
                    )}
                    {order.device_type && (
                      <div>
                        <span className="text-gray-500">Device: </span>
                        <span className="text-gray-900 flex items-center gap-1">
                          <Monitor className="w-3.5 h-3.5" />
                          {order.device_type}
                        </span>
                      </div>
                    )}
                    {order.session_pages != null && (
                      <div>
                        <span className="text-gray-500">Session Pages: </span>
                        <span className="text-gray-900">{order.session_pages}</span>
                      </div>
                    )}
                    {order.session_entry && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Entry Page: </span>
                        <span className="text-gray-900 break-all text-xs">{order.session_entry}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Customer</Text>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-gray-500">Name: </span>
                    <span className="text-gray-900 font-medium">
                      {order.billing_first_name} {order.billing_last_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email: </span>
                    <a href={`mailto:${order.email}`} className="text-[#003365] hover:underline">{order.email}</a>
                  </div>
                  {order.billing_phone && (
                    <div>
                      <span className="text-gray-500">Phone: </span>
                      <span className="text-gray-900">{order.billing_phone}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Shipping Address */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Shipping Address</Text>
                </div>
                <div className="text-sm text-gray-700 space-y-0.5">
                  <div>{order.shipping_first_name} {order.shipping_last_name}</div>
                  {order.shipping_address_1 && <div>{order.shipping_address_1}</div>}
                  <div>
                    {[order.shipping_city, order.shipping_state, order.shipping_zip]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
              </Card>

              {/* Salesperson */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Salesperson</Text>
                <Text className="text-gray-900 !mb-0">
                  {order.salesperson_name
                    ? order.salesperson_name.replace(/_/g, ' ')
                    : 'None'}
                </Text>
              </Card>

              {/* Payment */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Payment</Text>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-500">Method: </span>
                    <span className="text-gray-900">{order.payment_method || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="text-gray-900 capitalize">{order.payment_status || 'unknown'}</span>
                  </div>
                  {order.payment_transaction_id && (
                    <div>
                      <span className="text-gray-500">Transaction: </span>
                      <span className="text-gray-900 font-mono text-xs">{order.payment_transaction_id}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Import Info */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Archive className="w-4 h-4 text-amber-600" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Import Info</Text>
                </div>
                <div className="text-sm space-y-1">
                  {order.woo_order_id > 0 && (
                    <div>
                      <span className="text-gray-500">WooCommerce ID: </span>
                      <span className="text-gray-900 font-mono">{order.woo_order_id}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Imported: </span>
                    <span className="text-gray-900">{formatDate(order.imported_at)}</span>
                  </div>
                  {order.new_order_id && (
                    <div>
                      <span className="text-gray-500">Migrated to: </span>
                      <Link
                        href={`/admin/orders/${order.new_order_id}`}
                        className="text-[#003365] hover:underline flex items-center gap-1"
                      >
                        View New Order <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Grid>
        </section>
      </Stack>
    </Container>
  )
}
