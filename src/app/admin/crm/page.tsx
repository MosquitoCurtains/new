'use client'

/**
 * CRM Pipeline – Kanban Board
 *
 * Drag-and-drop pipeline for managing leads through sales stages.
 * Each card shows the lead + linked projects count.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Kanban,
  RefreshCw,
  Search,
  GripVertical,
  Mail,
  Phone,
  FolderOpen,
  Clock,
  Camera,
  Users,
  ChevronDown,
  List,
  LayoutGrid,
  Filter,
} from 'lucide-react'
import {
  Container,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'

// =============================================================================
// PIPELINE COLUMN CONFIG
// =============================================================================

interface PipelineColumn {
  key: string
  label: string
  color: string
  bgColor: string
  borderColor: string
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: 'open', label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { key: 'pending', label: 'Pending', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { key: 'need_photos', label: 'Need Photos', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { key: 'invitation_to_plan', label: 'Invited to Plan', color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
  { key: 'need_measurements', label: 'Need Measurements', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { key: 'working_on_quote', label: 'Working Quote', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { key: 'quote_sent', label: 'Quote Sent', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { key: 'need_decision', label: 'Need Decision', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { key: 'order_placed', label: 'Order Placed', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { key: 'closed', label: 'Closed', color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
]

// Status colors for badges (also used by list view)
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
  converted: '!bg-emerald-100 !text-emerald-700 !border-emerald-200',
}

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Contact',
  expert_assistance: 'Expert',
  admin_sales: 'Admin',
  quick_connect: 'Quick',
}

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// TYPES
// =============================================================================

interface PipelineLead {
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
  pipeline_order: number | null
  // Joined from projects count
  project_count?: number
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CRMPipelinePage() {
  const [leads, setLeads] = useState<PipelineLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [filterAssigned, setFilterAssigned] = useState('all')
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('limit', '500')

      const [leadsRes, staffRes] = await Promise.all([
        fetch(`/api/admin/leads?${params}`),
        fetch('/api/admin/staff?active=true'),
      ])

      const leadsData = await leadsRes.json()
      const staffData = await staffRes.json()

      // Fetch project counts per lead
      const leadsWithProjects = leadsData.leads || []

      setLeads(leadsWithProjects)
      setStaffList(staffData.staff || [])
    } catch (err) {
      console.error('Failed to fetch pipeline:', err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleSearch = () => setSearch(searchInput)

  // --- Drag handlers ---
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggingId(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', leadId)
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnKey)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    setDraggingId(null)
    setDragOverColumn(null)

    if (!leadId) return

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    )

    // Persist
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!data.success) {
        // Revert on failure
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l))
        )
      }
    } catch {
      // Revert on error
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l))
      )
    }
  }

  // --- Filters ---
  const filteredLeads = leads.filter((l) => {
    if (filterAssigned !== 'all' && l.assigned_to !== filterAssigned) return false
    // Exclude converted from pipeline - they're customers now
    if (l.status === 'converted') return false
    return true
  })

  // Group by status for kanban
  const leadsByStatus = new Map<string, PipelineLead[]>()
  for (const col of PIPELINE_COLUMNS) {
    leadsByStatus.set(col.key, [])
  }
  for (const lead of filteredLeads) {
    const bucket = leadsByStatus.get(lead.status)
    if (bucket) {
      bucket.push(lead)
    }
  }

  const formatTimeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1d'
    if (days < 7) return `${days}d`
    if (days < 30) return `${Math.floor(days / 7)}w`
    return `${Math.floor(days / 30)}mo`
  }

  // Pipeline summary stats
  const totalActive = filteredLeads.filter((l) => l.status !== 'closed').length
  const totalValue = filteredLeads.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Kanban className="w-6 h-6 text-[#003365]" />
            <div>
              <Heading level={1} className="!mb-0 !text-xl">CRM Pipeline</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">
                {totalActive} active leads | {totalValue} total
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
            </div>

            <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3 mt-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365] focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterAssigned}
              onChange={(e) => setFilterAssigned(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
            >
              <option value="all">All Reps</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Quick nav links */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/leads">
                <Users className="w-3.5 h-3.5 mr-1" />
                All Leads
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/customers">
                <Users className="w-3.5 h-3.5 mr-1" />
                Customers
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Text className="text-gray-500">Loading pipeline...</Text>
        </div>
      ) : viewMode === 'kanban' ? (
        /* ===== KANBAN BOARD ===== */
        <div className="overflow-x-auto">
          <div className="flex gap-3 p-4 min-w-max">
            {PIPELINE_COLUMNS.map((col) => {
              const colLeads = leadsByStatus.get(col.key) || []
              const isOver = dragOverColumn === col.key

              return (
                <div
                  key={col.key}
                  className={`flex flex-col w-[280px] shrink-0 rounded-xl border-2 transition-colors ${
                    isOver
                      ? `${col.borderColor} ${col.bgColor}`
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                >
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2.5 border-b ${col.borderColor} ${col.bgColor} rounded-t-xl`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.bgColor.replace('bg-', 'bg-').replace('/50', '')} ${col.color}`}
                        style={{ backgroundColor: 'currentColor', opacity: 0.7 }}
                      />
                      <span className={`text-xs font-semibold ${col.color}`}>
                        {col.label}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${col.color} bg-white/60 px-2 py-0.5 rounded-full`}>
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2 min-h-[100px] max-h-[calc(100vh-250px)] overflow-y-auto">
                    {colLeads.length === 0 ? (
                      <div className="text-center py-6">
                        <Text size="sm" className="text-gray-400 !mb-0">No leads</Text>
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          dragging={draggingId === lead.id}
                          onDragStart={handleDragStart}
                          formatTimeAgo={formatTimeAgo}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ===== LIST VIEW ===== */
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                  {filteredLeads.map((lead) => (
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
                          <Clock className="w-3 h-3" /> {formatTimeAgo(lead.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// LEAD CARD (Kanban)
// =============================================================================

function LeadCard({
  lead,
  dragging,
  onDragStart,
  formatTimeAgo,
}: {
  lead: PipelineLead
  dragging: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  formatTimeAgo: (d: string) => string
}) {
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart(e, lead.id)
      }}
      className={`block bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:border-[#003365]/30 hover:shadow-sm transition-all group ${
        dragging ? 'opacity-40 scale-95' : ''
      }`}
    >
      {/* Name row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <GripVertical className="w-3 h-3 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-semibold text-gray-900 truncate">
            {lead.first_name || ''} {lead.last_name || ''}
            {!lead.first_name && !lead.last_name && <span className="text-gray-400 italic font-normal">Unknown</span>}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" />
          {formatTimeAgo(lead.created_at)}
        </span>
      </div>

      {/* Email */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 truncate">
        <Mail className="w-3 h-3 shrink-0" />
        <span className="truncate">{lead.email}</span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {lead.interest && (
          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded capitalize">
            {lead.interest.replace(/_/g, ' ')}
          </span>
        )}
        {lead.source && (
          <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
            {SOURCE_LABELS[lead.source] || lead.source}
          </span>
        )}
        {lead.phone && (
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <Phone className="w-2.5 h-2.5" />
          </span>
        )}
        {lead.photo_urls && lead.photo_urls.length > 0 && (
          <span className="text-[10px] text-[#406517] flex items-center gap-0.5">
            <Camera className="w-2.5 h-2.5" /> {lead.photo_urls.length}
          </span>
        )}
      </div>
    </Link>
  )
}
