'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  FileText,
  RefreshCw,
  DollarSign,
  Clock,
  ShoppingBag,
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
} from '@/lib/design-system'

// =============================================================================
// ORDER STATUS CONFIG
// =============================================================================

const ORDER_STATUSES = [
  { value: 'on-hold', label: 'Wait For Check', color: '!bg-orange-100 !text-orange-700 !border-orange-200' },
  { value: 'on-hold-waiting', label: 'On Hold - Waiting', color: '!bg-orange-100 !text-orange-600 !border-orange-200' },
  { value: 'pending', label: 'Pending Payment', color: '!bg-blue-100 !text-blue-700 !border-blue-200' },
  { value: 'processing', label: 'Payment Received', color: '!bg-green-100 !text-green-700 !border-green-200' },
  { value: 'diagrams-uploaded', label: 'Diagrams Uploaded', color: '!bg-green-100 !text-green-800 !border-green-200' },
  { value: 'in-production', label: 'In Production', color: '!bg-gray-100 !text-gray-700 !border-gray-200' },
  { value: 'cut', label: 'Cut', color: '!bg-gray-100 !text-gray-600 !border-gray-200' },
  { value: 'resting', label: 'Resting', color: '!bg-gray-100 !text-gray-600 !border-gray-200' },
  { value: 'sewing', label: 'Sewing', color: '!bg-gray-100 !text-gray-600 !border-gray-200' },
  { value: 'qc', label: 'QC', color: '!bg-gray-100 !text-gray-700 !border-gray-200' },
  { value: 'shipped', label: 'Shipped', color: '!bg-teal-100 !text-teal-700 !border-teal-200' },
  { value: 'completed', label: 'Completed', color: '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30' },
  { value: 'snap-tool-refund', label: 'Refunded Snap Tool', color: '!bg-purple-100 !text-purple-700 !border-purple-200' },
  { value: 'failed', label: 'Failed', color: '!bg-red-100 !text-red-700 !border-red-200' },
  { value: 'cancelled', label: 'Cancelled', color: '!bg-red-100 !text-red-600 !border-red-200' },
  { value: 'refunded', label: 'Refunded', color: '!bg-purple-100 !text-purple-600 !border-purple-200' },
] as const

function getStatusConfig(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status) || {
    value: status,
    label: status,
    color: '!bg-gray-100 !text-gray-600 !border-gray-200',
  }
}

// =============================================================================
// TYPES
// =============================================================================

interface Order {
  id: string
  order_number: string
  email: string
  billing_first_name: string | null
  billing_last_name: string | null
  status: string
  total: number
  salesperson_name: string | null
  created_at: string
  payment_status: string | null
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '25')
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()

      if (data.orders) {
        setOrders(data.orders)
        setTotalPages(data.totalPages || 1)
        setTotal(data.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Debounced search
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const formatMoney = (val: number | null) => {
    if (val == null) return '$0.00'
    return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="!mb-1">Orders</Heading>
              <Text className="text-gray-600">
                Manage orders, track production status, and handle fulfillment.
                {total > 0 && ` (${total} total)`}
              </Text>
            </div>
            <Button variant="outline" onClick={fetchOrders}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section>
          <Card variant="outlined" className="!p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                  placeholder="Search by order #, name, or email..."
                  className="!pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  <option value="">All Statuses</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Table */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Order #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Salesperson
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const statusConfig = getStatusConfig(order.status)
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-sm font-mono font-medium text-[#003365] hover:text-[#406517]"
                            >
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <Text className="font-medium text-gray-900 !mb-0 !text-sm">
                              {order.billing_first_name} {order.billing_last_name}
                            </Text>
                            <Text size="sm" className="text-gray-500 !mb-0 !text-xs">
                              {order.email}
                            </Text>
                          </td>
                          <td className="px-4 py-3">
                            <Text size="sm" className="text-gray-700 !mb-0">
                              {formatDate(order.created_at)}
                            </Text>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Text className="font-bold text-[#406517] !mb-0 !text-sm">
                              {formatMoney(order.total)}
                            </Text>
                          </td>
                          <td className="px-4 py-3">
                            <Text size="sm" className="text-gray-600 !mb-0">
                              {order.salesperson_name || 'None'}
                            </Text>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/orders/${order.id}`} title="View order">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/orders/${order.id}/invoice`} target="_blank" title="Invoice">
                                  <FileText className="w-4 h-4" />
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <Text size="sm" className="text-gray-500 !mb-0">
                  Page {page} of {totalPages} ({total} orders)
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Text className="text-gray-700 !mb-0">
                    Page {page} of {totalPages}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
