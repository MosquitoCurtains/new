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
  LayoutGrid,
  List,
  Mail,
  Phone,
  GripVertical,
  X,
  Save,
  Edit,
  FolderOpen,
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
  { value: 'invitation_to_plan', label: 'Invited to Plan' },
  { value: 'need_measurements', label: 'Need Measurements' },
  { value: 'working_on_quote', label: 'Working on Quote' },
  { value: 'quote_sent', label: 'Quote Sent' },
  { value: 'need_decision', label: 'Need Decision' },
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'closed', label: 'Closed' },
]

const ALL_LEAD_STATUSES = [
  'open', 'pending', 'need_photos', 'invitation_to_plan', 'need_measurements',
  'working_on_quote', 'quote_sent', 'need_decision', 'order_placed',
  'order_on_hold', 'difficult', 'closed',
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
  converted: '!bg-emerald-100 !text-emerald-700 !border-emerald-200',
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

// Kanban column config
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

// =============================================================================
// TYPES
// =============================================================================

interface LeadProject {
  id: string
  project_name: string | null
  product_type: string
  status: string
  estimated_total: number | null
}

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
  projects?: LeadProject[]
}

interface Staff {
  id: string
  name: string
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
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [staffList, setStaffList] = useState<Staff[]>([])

  // Drag state for kanban
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Edit modal
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', phone: '', interest: '', status: '', assigned_to: '' })
  const [savingEdit, setSavingEdit] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (search) params.set('search', search)
      params.set('limit', '500')

      const [leadsRes, staffRes] = await Promise.all([
        fetch(`/api/admin/leads?${params}`),
        fetch('/api/admin/staff?active=true'),
      ])
      const leadsData = await leadsRes.json()
      const staffData = await staffRes.json()
      setLeads(leadsData.leads || [])
      setStaffList(staffData.staff || [])
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, search])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleSearch = () => setSearch(searchInput)

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1d ago'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  // ---- Edit handlers ----
  const openEdit = (lead: Lead) => {
    setEditingLead(lead)
    setEditForm({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      email: lead.email,
      phone: lead.phone || '',
      interest: lead.interest || '',
      status: lead.status,
      assigned_to: lead.assigned_to || '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editingLead) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editForm.first_name || null,
          last_name: editForm.last_name || null,
          email: editForm.email,
          phone: editForm.phone || null,
          interest: editForm.interest || null,
          status: editForm.status,
          assigned_to: editForm.assigned_to || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setLeads((prev) => prev.map((l) => l.id === editingLead.id ? { ...l, ...data.lead } : l))
        setEditingLead(null)
      }
    } catch (err) {
      console.error('Edit save error:', err)
    } finally {
      setSavingEdit(false)
    }
  }

  // ---- Drag handlers (kanban) ----
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

  const handleDragLeave = () => setDragOverColumn(null)

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    setDraggingId(null)
    setDragOverColumn(null)
    if (!leadId) return

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l))

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!data.success) {
        setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: lead.status } : l))
      }
    } catch {
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: lead.status } : l))
    }
  }

  // Group for kanban
  const leadsByStatus = new Map<string, Lead[]>()
  for (const col of PIPELINE_COLUMNS) leadsByStatus.set(col.key, [])
  for (const lead of leads) {
    if (lead.status === 'converted') continue
    const bucket = leadsByStatus.get(lead.status)
    if (bucket) bucket.push(lead)
  }

  const activeCount = leads.filter((l) => l.status !== 'closed' && l.status !== 'converted').length

  return (
    <>
      <Container size="xl">
        <Stack gap="lg">
          {/* Header */}
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileUser className="w-6 h-6 text-[#003365]" />
              <Heading level={1} className="!mb-0">Leads</Heading>
              <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">{leads.length}</Badge>
              <span className="text-xs text-gray-400 hidden sm:inline">({activeCount} active)</span>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'board' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Board
                </button>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </section>

          {/* Filters */}
          <section>
            <Card variant="elevated" className="!p-3">
              <div className="flex flex-wrap items-center gap-3">
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

          {/* ===== LIST VIEW ===== */}
          {viewMode === 'list' && (
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
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Project</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Source</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Photos</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                            <td className="px-4 py-3">
                              {lead.projects && lead.projects.length > 0 ? (
                                <div className="space-y-0.5">
                                  {lead.projects.map((proj) => (
                                    <div key={proj.id} className="flex items-center gap-1 text-xs">
                                      <FolderOpen className="w-3 h-3 text-[#406517] shrink-0" />
                                      <span className="text-gray-900 truncate max-w-[160px]">
                                        {proj.project_name || proj.product_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) + ' Project'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-300 text-xs">No project</span>
                              )}
                            </td>
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
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => openEdit(lead)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-[#003365] hover:bg-[#003365]/5 rounded-md transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </section>
          )}

          {/* ===== BOARD VIEW (Kanban) ===== */}
          {viewMode === 'board' && (
            <section>
              {loading ? (
                <div className="p-12 text-center">
                  <Text className="text-gray-500">Loading pipeline...</Text>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="flex gap-3 min-w-max pb-4">
                    {PIPELINE_COLUMNS.map((col) => {
                      const colLeads = leadsByStatus.get(col.key) || []
                      const isOver = dragOverColumn === col.key

                      return (
                        <div
                          key={col.key}
                          className={`flex flex-col w-[260px] shrink-0 rounded-xl border-2 transition-colors ${
                            isOver ? `${col.borderColor} ${col.bgColor}` : 'border-gray-200 bg-gray-50/50'
                          }`}
                          onDragOver={(e) => handleDragOver(e, col.key)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, col.key)}
                        >
                          {/* Column header */}
                          <div className={`flex items-center justify-between px-3 py-2 border-b ${col.borderColor} ${col.bgColor} rounded-t-xl`}>
                            <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                            <span className={`text-xs font-bold ${col.color} bg-white/60 px-2 py-0.5 rounded-full`}>
                              {colLeads.length}
                            </span>
                          </div>

                          {/* Cards */}
                          <div className="flex-1 p-2 space-y-2 min-h-[80px] max-h-[calc(100vh-300px)] overflow-y-auto">
                            {colLeads.length === 0 ? (
                              <div className="text-center py-4">
                                <Text size="sm" className="text-gray-400 !mb-0">No leads</Text>
                              </div>
                            ) : (
                              colLeads.map((lead) => (
                                <div
                                  key={lead.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, lead.id)}
                                  className={`bg-white rounded-lg border border-gray-200 p-2.5 cursor-grab active:cursor-grabbing hover:border-[#003365]/30 hover:shadow-sm transition-all group ${
                                    draggingId === lead.id ? 'opacity-40 scale-95' : ''
                                  }`}
                                >
                                  {/* Top row: name + edit */}
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-1 min-w-0">
                                      <GripVertical className="w-3 h-3 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <span className="text-sm font-semibold text-gray-900 truncate hover:text-[#003365]">
                                        {lead.first_name || ''} {lead.last_name || ''}
                                        {!lead.first_name && !lead.last_name && <span className="text-gray-400 italic font-normal">Unknown</span>}
                                      </span>
                                    </Link>
                                    <button
                                      onClick={() => openEdit(lead)}
                                      className="p-1 text-gray-400 hover:text-[#003365] hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                      title="Edit lead"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Email */}
                                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1 truncate">
                                    <Mail className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>

                                  {/* Projects */}
                                  {lead.projects && lead.projects.length > 0 && (
                                    <div className="mb-1.5 space-y-0.5">
                                      {lead.projects.map((proj) => (
                                        <div key={proj.id} className="flex items-center gap-1 text-[10px] bg-[#406517]/5 text-[#406517] px-1.5 py-0.5 rounded">
                                          <FolderOpen className="w-2.5 h-2.5 shrink-0" />
                                          <span className="truncate font-medium">
                                            {proj.project_name || proj.product_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) + ' Project'}
                                          </span>
                                          {proj.estimated_total && (
                                            <span className="ml-auto shrink-0 text-[#406517]/70">${Number(proj.estimated_total).toLocaleString()}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Meta */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {lead.interest && (
                                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded capitalize">
                                        {lead.interest.replace(/_/g, ' ')}
                                      </span>
                                    )}
                                    {lead.phone && <Phone className="w-2.5 h-2.5 text-gray-400" />}
                                    {lead.photo_urls && lead.photo_urls.length > 0 && (
                                      <span className="text-[10px] text-[#406517] flex items-center gap-0.5">
                                        <Camera className="w-2.5 h-2.5" /> {lead.photo_urls.length}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" />
                                      {timeAgo(lead.created_at)}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          )}
        </Stack>
      </Container>

      {/* ===== EDIT MODAL ===== */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingLead(null)} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <Heading level={3} className="!mb-0 !text-lg">Edit Lead</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">{editingLead.email}</Text>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Status + Interest row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    {ALL_LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Interest</label>
                  <select
                    value={editForm.interest}
                    onChange={(e) => setEditForm({ ...editForm, interest: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    <option value="">None</option>
                    <option value="mosquito_curtains">Mosquito Curtains</option>
                    <option value="clear_vinyl">Clear Vinyl</option>
                    <option value="raw_netting">Raw Netting</option>
                    <option value="roll_up_shades">Roll Up Shades</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assigned To</label>
                <select
                  value={editForm.assigned_to}
                  onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/leads/${editingLead.id}`}>
                  View Full Record
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingLead(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveEdit} disabled={savingEdit}>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
