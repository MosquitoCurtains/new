'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  RefreshCw,
  FileUser,
  Clock,
  Camera,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'

// =============================================================================
// STATUS CONFIG
// =============================================================================

const FILTER_STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'need_photos', label: 'Need Photos' },
  { value: 'working_on_quote', label: 'Working on Quote' },
  { value: 'quote_sent', label: 'Quote Sent' },
  { value: 'need_decision', label: 'Need Decision' },
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'closed', label: 'Closed' },
]

const STATUS_COLORS: Record<string, string> = {
  open: '!bg-blue-100 !text-blue-700 !border-blue-200',
  pending: '!bg-orange-100 !text-orange-700 !border-orange-200',
  need_photos: '!bg-amber-100 !text-amber-700 !border-amber-200',
  invitation_to_plan: '!bg-teal-100 !text-teal-700 !border-teal-200',
  need_measurements: '!bg-amber-100 !text-amber-600 !border-amber-200',
  working_on_quote: '!bg-indigo-100 !text-indigo-700 !border-indigo-200',
  quote_sent: '!bg-purple-100 !text-purple-700 !border-purple-200',
  need_decision: '!bg-orange-100 !text-orange-600 !border-orange-200',
  order_placed: '!bg-green-100 !text-green-700 !border-green-200',
  order_on_hold: '!bg-red-100 !text-red-600 !border-red-200',
  difficult: '!bg-red-100 !text-red-700 !border-red-200',
  closed: '!bg-gray-100 !text-gray-500 !border-gray-200',
}

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Contact',
  expert_assistance: 'Expert',
  admin_sales: 'Admin',
  quick_connect: 'Quick',
}

// =============================================================================
// TYPES
// =============================================================================

interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  interest: string | null
  source: string | null
  status: string
  assigned_to: string | null
  photo_urls: string[] | null
  created_at: string
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (search) params.set('search', search)
      params.set('limit', '200')

      const res = await fetch(`/api/admin/leads?${params}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, search])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleSearch = () => {
    setSearch(searchInput)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return formatDate(d)
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileUser className="w-6 h-6 text-[#003365]" />
            <Heading level={1} className="!mb-0">Leads</Heading>
            <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">{leads.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </section>

        {/* Filters */}
        <section>
          <Card variant="elevated" className="!p-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleSearch}>
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                >
                  {FILTER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Leads list */}
        <section>
          <Card variant="elevated" className="!p-0 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Text className="text-gray-500">Loading leads...</Text>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center">
                <FileUser className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <Text className="text-gray-400">No leads found</Text>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Interest</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Photos</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/admin/leads/${lead.id}`} className="text-[#003365] font-medium hover:underline">
                            {lead.first_name || ''} {lead.last_name || ''}
                            {!lead.first_name && !lead.last_name && <span className="text-gray-400 italic">Unknown</span>}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{lead.email}</td>
                        <td className="px-4 py-3 text-gray-600 capitalize">{lead.interest?.replace(/_/g, ' ') || '--'}</td>
                        <td className="px-4 py-3">
                          <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-[10px]">
                            {SOURCE_LABELS[lead.source || ''] || lead.source || '--'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${STATUS_COLORS[lead.status] || '!bg-gray-100 !text-gray-600 !border-gray-200'} !text-[10px]`}>
                            {statusLabel(lead.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {lead.photo_urls && lead.photo_urls.length > 0 ? (
                            <span className="flex items-center gap-1 text-[#406517]">
                              <Camera className="w-3.5 h-3.5" /> {lead.photo_urls.length}
                            </span>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(lead.created_at)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
