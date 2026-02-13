'use client'

/**
 * Admin CRM — Projects
 *
 * Searchable, filterable, sortable list of all projects.
 * Uses GET /api/admin/sales/projects (returns projects with joined lead data).
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  FolderOpen,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  RefreshCw,
  Briefcase,
  Clock,
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
  Badge,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  status: string | null
  interest: string | null
}

interface Project {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  project_name: string | null
  project_type: string | null
  status: string
  estimated_total: number | null
  assigned_to: string | null
  share_token: string | null
  lead_id: string | null
  customer_id: string | null
  created_at: string
  updated_at: string
  leads: Lead | null
}

interface Staff {
  id: string
  name: string
  email: string
}

type SortField = 'created_at' | 'updated_at' | 'estimated_total'
type SortDirection = 'asc' | 'desc'

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_COLORS: Record<string, string> = {
  draft: '!bg-gray-100 !text-gray-600 !border-gray-200',
  new: '!bg-blue-100 !text-blue-700 !border-blue-200',
  need_photos: '!bg-amber-100 !text-amber-700 !border-amber-200',
  working_on_quote: '!bg-indigo-100 !text-indigo-700 !border-indigo-200',
  quote_sent: '!bg-purple-100 !text-purple-700 !border-purple-200',
  quote_viewed: '!bg-purple-100 !text-purple-600 !border-purple-200',
  need_decision: '!bg-orange-100 !text-orange-700 !border-orange-200',
  order_placed: '!bg-green-100 !text-green-700 !border-green-200',
  closed: '!bg-gray-100 !text-gray-500 !border-gray-200',
  archived: '!bg-gray-100 !text-gray-400 !border-gray-200',
}

const PROJECT_STATUSES = [
  'draft', 'new', 'need_photos', 'working_on_quote', 'quote_sent',
  'quote_viewed', 'need_decision', 'order_placed', 'closed', 'archived',
]

const PRODUCT_TYPES = [
  { value: 'curtains', label: 'Mosquito Curtains' },
  { value: 'mosquito_curtains', label: 'Mosquito Curtains' },
  { value: 'clear_vinyl', label: 'Clear Vinyl' },
  { value: 'raw_netting', label: 'Raw Netting' },
  { value: 'raw_materials', label: 'Raw Materials' },
  { value: 'rollup_shades', label: 'Rollup Shades' },
]

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function productLabel(pt: string) {
  const found = PRODUCT_TYPES.find((p) => p.value === pt)
  return found ? found.label : pt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminCrmProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('updated_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const [projRes, staffRes] = await Promise.all([
        fetch(`/api/admin/sales/projects?${params}`),
        fetch('/api/admin/staff?active=true'),
      ])

      const projData = await projRes.json()
      setProjects(projData.projects || [])

      const staffData = await staffRes.json()
      setStaffList(staffData.staff || [])
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = () => {
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  // ---------------------------------------------------------------------------
  // Filter + sort
  // ---------------------------------------------------------------------------

  const filtered = useMemo(() => {
    let list = [...projects]

    // Search by name or email
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.email?.toLowerCase().includes(q) ||
          (p.first_name || '').toLowerCase().includes(q) ||
          (p.last_name || '').toLowerCase().includes(q) ||
          (p.project_name || '').toLowerCase().includes(q)
      )
    }

    // Product type filter
    if (productFilter !== 'all') {
      list = list.filter((p) => p.product_type === productFilter)
    }

    // Assigned filter
    if (assignedFilter === 'unassigned') {
      list = list.filter((p) => !p.assigned_to)
    } else if (assignedFilter !== 'all') {
      list = list.filter((p) => p.assigned_to === assignedFilter)
    }

    return list
  }, [projects, searchQuery, productFilter, assignedFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'updated_at':
          cmp = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
        case 'estimated_total':
          cmp = (a.estimated_total || 0) - (b.estimated_total || 0)
          break
      }
      return sortDirection === 'asc' ? cmp : -cmp
    })
    return arr
  }, [filtered, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------

  const stats = useMemo(() => {
    const active = projects.filter((p) => !['closed', 'archived'].includes(p.status))
    const withQuote = projects.filter((p) => p.estimated_total && p.estimated_total > 0)
    const totalEstimated = withQuote.reduce((sum, p) => sum + (p.estimated_total || 0), 0)
    return {
      total: projects.length,
      active: active.length,
      totalEstimated,
      avgEstimated: withQuote.length > 0 ? totalEstimated / withQuote.length : 0,
    }
  }, [projects])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatMoney = (v: number | null) =>
    v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '--'

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const staffName = (id: string | null) => {
    if (!id) return null
    const s = staffList.find((st) => st.id === id)
    return s ? s.name : null
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="!mb-1">Projects</Heading>
              <Text className="text-gray-600 !mb-0">
                All customer projects across product lines.
              </Text>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003365]/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-[#003365]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Total Projects</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {stats.total.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="!p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#406517]" />
                </div>
                <div>
                  <Text size="sm" className="text-gray-500 !mb-0">Active</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {stats.active.toLocaleString()}
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
                  <Text size="sm" className="text-gray-500 !mb-0">Pipeline Value</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {formatMoney(stats.totalEstimated)}
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
                  <Text size="sm" className="text-gray-500 !mb-0">Avg Estimate</Text>
                  <Text className="text-xl font-bold text-gray-900 !mb-0">
                    {formatMoney(stats.avgEstimated)}
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
              {/* Search */}
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name, email, or project name..."
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSearch}>
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400" />

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[#003365]"
                >
                  <option value="all">All Statuses</option>
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>

                {/* Product type */}
                <select
                  value={productFilter}
                  onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[#003365]"
                >
                  <option value="all">All Products</option>
                  {[...new Map(PRODUCT_TYPES.map((p) => [p.label, p])).values()].map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>

                {/* Assigned to */}
                <select
                  value={assignedFilter}
                  onChange={(e) => { setAssignedFilter(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-[#003365]"
                >
                  <option value="all">All Staff</option>
                  <option value="unassigned">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Table */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Text className="text-gray-500">Loading projects...</Text>
              </div>
            ) : paginated.length === 0 ? (
              <div className="p-12 text-center">
                <FolderOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-400">No projects found</Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('estimated_total')}
                      >
                        <div className="flex items-center gap-1">
                          Estimated
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Assigned</th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('updated_at')}
                      >
                        <div className="flex items-center gap-1">
                          Updated
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((proj) => (
                      <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium text-gray-900">
                              {proj.first_name || ''} {proj.last_name || ''}
                              {!proj.first_name && !proj.last_name && (
                                <span className="text-gray-400 italic">Unknown</span>
                              )}
                            </span>
                            <Text size="sm" className="text-gray-500 !mb-0">{proj.email}</Text>
                          </div>
                        </td>

                        {/* Project name */}
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/projects/${proj.id}`}
                            className="text-[#003365] hover:underline font-medium"
                          >
                            {proj.project_name || (
                              <span className="text-gray-400 italic">Untitled</span>
                            )}
                          </Link>
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3">
                          <Text size="sm" className="text-gray-700 !mb-0 capitalize">
                            {productLabel(proj.product_type)}
                          </Text>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge className={`${STATUS_COLORS[proj.status] || '!bg-gray-100 !text-gray-600'} !text-[10px]`}>
                            {statusLabel(proj.status)}
                          </Badge>
                        </td>

                        {/* Estimated total */}
                        <td className="px-4 py-3">
                          <Text className="font-bold text-[#406517] !mb-0">
                            {proj.estimated_total && proj.estimated_total > 0
                              ? formatMoney(proj.estimated_total)
                              : '--'}
                          </Text>
                        </td>

                        {/* Assigned */}
                        <td className="px-4 py-3">
                          {proj.assigned_to ? (
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[#003365]" />
                              <Text size="sm" className="text-gray-700 !mb-0">
                                {staffName(proj.assigned_to) || 'Unknown'}
                              </Text>
                            </div>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-3">
                          <Text size="sm" className="text-gray-500 !mb-0">
                            {formatDate(proj.updated_at)}
                          </Text>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3">
                          <Text size="sm" className="text-gray-500 !mb-0">
                            {formatDate(proj.created_at)}
                          </Text>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/projects/${proj.id}`}>
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
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
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
