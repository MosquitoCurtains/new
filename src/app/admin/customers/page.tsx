'use client'

/**
 * Admin Customer CRM Page
 * 
 * Searchable customer table with filters, RFM segmentation, and LTV tiers.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useMemo } from 'react'
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
  firstName: string
  lastName: string
  phone?: string
  state?: string
  city?: string
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
}

type SortField = 'totalSpent' | 'totalOrders' | 'lastOrderDate' | 'avgOrderValue'
type SortDirection = 'asc' | 'desc'

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    state: 'GA',
    city: 'Atlanta',
    totalOrders: 5,
    totalSpent: 4850.00,
    avgOrderValue: 970.00,
    firstOrderDate: '2024-03-15',
    lastOrderDate: '2026-01-20',
    rfmScore: { recency: 5, frequency: 4, monetary: 4, total: 13, segment: 'Champion' },
    ltvTier: 'gold',
    salesperson: 'Sarah M.',
  },
  {
    id: 'cust_002',
    email: 'mary.johnson@example.com',
    firstName: 'Mary',
    lastName: 'Johnson',
    phone: '(555) 987-6543',
    state: 'FL',
    city: 'Miami',
    totalOrders: 12,
    totalSpent: 15680.00,
    avgOrderValue: 1306.67,
    firstOrderDate: '2022-06-10',
    lastOrderDate: '2025-12-05',
    rfmScore: { recency: 4, frequency: 5, monetary: 5, total: 14, segment: 'Loyal' },
    ltvTier: 'platinum',
    salesperson: 'Mike T.',
  },
  {
    id: 'cust_003',
    email: 'robert.williams@example.com',
    firstName: 'Robert',
    lastName: 'Williams',
    state: 'TX',
    city: 'Houston',
    totalOrders: 2,
    totalSpent: 890.00,
    avgOrderValue: 445.00,
    firstOrderDate: '2025-08-22',
    lastOrderDate: '2025-11-18',
    rfmScore: { recency: 3, frequency: 2, monetary: 2, total: 7, segment: 'Promising' },
    ltvTier: 'bronze',
  },
  {
    id: 'cust_004',
    email: 'jennifer.davis@example.com',
    firstName: 'Jennifer',
    lastName: 'Davis',
    phone: '(555) 456-7890',
    state: 'CA',
    city: 'San Diego',
    totalOrders: 8,
    totalSpent: 9450.00,
    avgOrderValue: 1181.25,
    firstOrderDate: '2023-01-05',
    lastOrderDate: '2026-01-10',
    rfmScore: { recency: 5, frequency: 4, monetary: 5, total: 14, segment: 'Champion' },
    ltvTier: 'gold',
    salesperson: 'Sarah M.',
  },
  {
    id: 'cust_005',
    email: 'michael.brown@example.com',
    firstName: 'Michael',
    lastName: 'Brown',
    state: 'NC',
    city: 'Charlotte',
    totalOrders: 1,
    totalSpent: 1250.00,
    avgOrderValue: 1250.00,
    firstOrderDate: '2025-12-20',
    lastOrderDate: '2025-12-20',
    rfmScore: { recency: 4, frequency: 1, monetary: 3, total: 8, segment: 'New' },
    ltvTier: 'silver',
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const LTV_COLORS = {
  bronze: '!bg-amber-100 !text-amber-800 !border-amber-200',
  silver: '!bg-gray-100 !text-gray-700 !border-gray-200',
  gold: '!bg-yellow-100 !text-yellow-800 !border-yellow-200',
  platinum: '!bg-cyan-100 !text-cyan-800 !border-cyan-200',
  diamond: '!bg-purple-100 !text-purple-800 !border-purple-200',
}

const RFM_SEGMENT_COLORS: Record<string, string> = {
  'Champion': '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30',
  'Loyal': '!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30',
  'Promising': '!bg-teal-100 !text-teal-700 !border-teal-200',
  'New': '!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30',
  'At Risk': '!bg-[#FFA501]/10 !text-[#FFA501] !border-[#FFA501]/30',
  'Dormant': '!bg-red-100 !text-red-700 !border-red-200',
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [ltvFilter, setLtvFilter] = useState<string>('all')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('totalSpent')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Get unique states for filter
  const uniqueStates = useMemo(() => {
    return [...new Set(customers.map(c => c.state).filter(Boolean))] as string[]
  }, [customers])

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let result = [...customers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.email.toLowerCase().includes(query) ||
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.phone?.includes(query)
      )
    }

    if (ltvFilter !== 'all') {
      result = result.filter(c => c.ltvTier === ltvFilter)
    }

    if (stateFilter !== 'all') {
      result = result.filter(c => c.state === stateFilter)
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent
          break
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders
          break
        case 'avgOrderValue':
          comparison = a.avgOrderValue - b.avgOrderValue
          break
        case 'lastOrderDate':
          comparison = new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [customers, searchQuery, ltvFilter, stateFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Summary stats
  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgLTV: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
    avgOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length,
  }), [customers])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="!mb-1">Customer CRM</Heading>
              <Text className="text-gray-600">
                Manage customers, view RFM scores, and track lifetime value.
              </Text>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/export?type=customers">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Link>
            </Button>
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
                    ${stats.totalRevenue.toLocaleString()}
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
                  <Text size="sm" className="text-gray-500 !mb-0">Avg LTV</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    ${stats.avgLTV.toFixed(0)}
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003365]/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#003365]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Avg Orders</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {stats.avgOrders.toFixed(1)}
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
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by name, email, or phone..."
                  className="!pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={ltvFilter}
                  onChange={(e) => { setLtvFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  <option value="all">All LTV Tiers</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>

              <select
                value={stateFilter}
                onChange={(e) => { setStateFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="all">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </Card>
        </section>

        {/* Customer Table */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('totalOrders')}
                    >
                      <div className="flex items-center gap-1">
                        Orders
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('totalSpent')}
                    >
                      <div className="flex items-center gap-1">
                        Total Spent
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">LTV Tier</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">RFM Segment</th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('lastOrderDate')}
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
                          <Text className="font-medium text-gray-900 !mb-0">
                            {customer.firstName} {customer.lastName}
                          </Text>
                          <Text size="sm" className="text-gray-500 !mb-0">{customer.email}</Text>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {customer.city && customer.state && (
                          <Text size="sm" className="text-gray-700 !mb-0">
                            {customer.city}, {customer.state}
                          </Text>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Text className="font-medium text-gray-900 !mb-0">{customer.totalOrders}</Text>
                      </td>
                      <td className="px-4 py-3">
                        <Text className="font-bold text-[#406517] !mb-0">
                          ${customer.totalSpent.toLocaleString()}
                        </Text>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${LTV_COLORS[customer.ltvTier]} capitalize`}>
                          {customer.ltvTier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={RFM_SEGMENT_COLORS[customer.rfmScore.segment] || '!bg-gray-100 !text-gray-600'}>
                          {customer.rfmScore.segment}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Text size="sm" className="text-gray-700 !mb-0">
                          {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </Text>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <Text size="sm" className="text-gray-500 !mb-0">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} customers
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
