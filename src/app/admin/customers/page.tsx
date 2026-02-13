'use client'

/**
 * Admin Customer CRM Page
 *
 * Real data from customers table with order/project stats.
 * Searchable, filterable, sortable.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Users,
  ArrowUpDown,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  FolderOpen,
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
  Input,
  Badge,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  city: string | null
  state: string | null
  zip: string | null
  customer_status: string | null
  notes: string | null
  lead_id: string | null
  created_at: string
  // Computed from API
  total_orders: number
  total_spent: number
  avg_order_value: number
  first_order_date: string | null
  last_order_date: string | null
  total_projects: number
}

type SortField = 'total_spent' | 'total_orders' | 'last_order_date' | 'created_at'
type SortDirection = 'asc' | 'desc'

// =============================================================================
// STATUS CONFIG
// =============================================================================

const CUSTOMER_STATUS_COLORS: Record<string, string> = {
  lead: '!bg-blue-100 !text-blue-700 !border-blue-200',
  quoted: '!bg-purple-100 !text-purple-700 !border-purple-200',
  customer: '!bg-green-100 !text-green-700 !border-green-200',
  repeat: '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30',
  churned: '!bg-red-100 !text-red-600 !border-red-200',
}

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('total_spent')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      params.set('limit', '500')

      const res = await fetch(`/api/admin/customers?${params}`)
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleSearch = () => {
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  // Sort
  const sortedCustomers = useMemo(() => {
    const sorted = [...customers]
    sorted.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'total_spent':
          comparison = a.total_spent - b.total_spent
          break
        case 'total_orders':
          comparison = a.total_orders - b.total_orders
          break
        case 'last_order_date':
          comparison = (new Date(a.last_order_date || 0).getTime()) - (new Date(b.last_order_date || 0).getTime())
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [customers, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / pageSize)
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Summary stats
  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
    avgSpend: customers.length > 0 ? customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length : 0,
    totalProjects: customers.reduce((sum, c) => sum + c.total_projects, 0),
  }), [customers])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatMoney = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="!mb-1">Customers</Heading>
              <Text className="text-gray-600 !mb-0">
                Manage customers, track orders and projects.
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={fetchCustomers} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/export?type=customers">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#406517]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Customers</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {stats.totalCustomers.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#406517]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Revenue</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {formatMoney(stats.totalRevenue)}
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#B30158]/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#B30158]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Avg Spend</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {formatMoney(stats.avgSpend)}
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003365]/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-[#003365]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Projects</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {stats.totalProjects.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Filters */}
        <section>
          <Card variant="outlined" className="!p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSearch}>
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[#003365]"
                >
                  <option value="all">All Statuses</option>
                  <option value="lead">Lead</option>
                  <option value="quoted">Quoted</option>
                  <option value="customer">Customer</option>
                  <option value="repeat">Repeat</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Customer Table */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Text className="text-gray-500">Loading customers...</Text>
              </div>
            ) : paginatedCustomers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-400">No customers found</Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('total_orders')}
                      >
                        <div className="flex items-center gap-1">
                          Orders
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('total_spent')}
                      >
                        <div className="flex items-center gap-1">
                          Total Spent
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Projects</th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('last_order_date')}
                      >
                        <div className="flex items-center gap-1">
                          Last Order
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <Link href={`/admin/customers/${customer.id}`} className="font-medium text-[#003365] hover:underline">
                              {customer.first_name || ''} {customer.last_name || ''}
                              {!customer.first_name && !customer.last_name && (
                                <span className="text-gray-400 italic">Unknown</span>
                              )}
                            </Link>
                            <Text size="sm" className="text-gray-500 !mb-0">{customer.email}</Text>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {customer.city && customer.state ? (
                            <Text size="sm" className="text-gray-700 !mb-0">
                              {customer.city}, {customer.state}
                            </Text>
                          ) : customer.state ? (
                            <Text size="sm" className="text-gray-700 !mb-0">{customer.state}</Text>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {customer.customer_status ? (
                            <Badge className={`${CUSTOMER_STATUS_COLORS[customer.customer_status] || '!bg-gray-100 !text-gray-600'} capitalize !text-[10px]`}>
                              {statusLabel(customer.customer_status)}
                            </Badge>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Text className="font-medium text-gray-900 !mb-0">{customer.total_orders}</Text>
                        </td>
                        <td className="px-4 py-3">
                          <Text className="font-bold text-[#406517] !mb-0">
                            {customer.total_spent > 0 ? formatMoney(customer.total_spent) : '--'}
                          </Text>
                        </td>
                        <td className="px-4 py-3">
                          {customer.total_projects > 0 ? (
                            <span className="flex items-center gap-1 text-[#003365]">
                              <FolderOpen className="w-3.5 h-3.5" /> {customer.total_projects}
                            </span>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {customer.last_order_date ? (
                            <Text size="sm" className="text-gray-700 !mb-0">
                              {new Date(customer.last_order_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <Text size="sm" className="text-gray-500 !mb-0">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedCustomers.length)} of {sortedCustomers.length}
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Text className="text-gray-700 !mb-0">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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
