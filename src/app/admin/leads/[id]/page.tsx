'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  UserCheck,
  Mail,
  Phone as PhoneIcon,
  FolderOpen,
  MessageSquare,
  Send,
  Plus,
  ExternalLink,
  Save,
  Globe,
  Tag,
  Clock,
  Briefcase,
  Smartphone,
  AlertCircle,
  Edit,
  X,
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
// STATUS CONFIG
// =============================================================================

const LEAD_STATUSES = [
  'open', 'pending', 'need_photos', 'invitation_to_plan', 'need_measurements',
  'working_on_quote', 'quote_sent', 'need_decision', 'order_placed',
  'order_on_hold', 'difficult', 'closed', 'converted',
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

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  draft: '!bg-gray-100 !text-gray-600 !border-gray-200',
  new: '!bg-blue-100 !text-blue-700 !border-blue-200',
  need_photos: '!bg-amber-100 !text-amber-700 !border-amber-200',
  working_on_quote: '!bg-indigo-100 !text-indigo-700 !border-indigo-200',
  quote_sent: '!bg-purple-100 !text-purple-700 !border-purple-200',
  order_placed: '!bg-green-100 !text-green-700 !border-green-200',
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
  project_type: string | null
  message: string | null
  source: string | null
  status: string
  assigned_to: string | null
  photo_urls: string[] | null
  created_at: string
  // Session-based attribution (joined via API)
  session_utm_source?: string | null
  session_utm_medium?: string | null
  session_utm_campaign?: string | null
  session_referrer?: string | null
  session_landing_page?: string | null
}

interface Project {
  id: string
  product_type: string
  status: string
  estimated_total: number | null
  share_token: string
  assigned_to: string | null
  created_at: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  project_id: string
  created_at: string
}

interface ConversationMsg {
  type: 'email' | 'sms'
  id: string
  content: string
  htmlContent?: string
  subject?: string
  direction: 'inbound' | 'outbound'
  timestamp: string
  metadata?: { from?: string; to?: string; status?: string }
}

interface Staff {
  id: string
  name: string
  email: string
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lead, setLead] = useState<Lead | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [conversation, setConversation] = useState<ConversationMsg[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  // Status
  const [selectedStatus, setSelectedStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  // Email compose
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailProjectId, setEmailProjectId] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  // SMS compose
  const [smsBody, setSmsBody] = useState('')
  const [sendingSms, setSendingSms] = useState(false)
  const [smsError, setSmsError] = useState<string | null>(null)
  const [smsSuccess, setSmsSuccess] = useState(false)

  // Compose mode toggle
  const [composeMode, setComposeMode] = useState<'email' | 'sms'>('email')

  // Edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', phone: '', interest: '', project_type: '' })
  const [savingEdit, setSavingEdit] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [leadRes, convRes, staffRes] = await Promise.all([
        fetch(`/api/admin/leads/${id}`),
        fetch(`/api/admin/leads/${id}/conversation`),
        fetch('/api/admin/staff?active=true'),
      ])

      const leadData = await leadRes.json()
      if (leadData.lead) {
        setLead(leadData.lead)
        setSelectedStatus(leadData.lead.status)
        setProjects(leadData.projects || [])
        setOrders(leadData.orders || [])

        // Auto-select project for email if only one
        if (leadData.projects?.length === 1) {
          setEmailProjectId(leadData.projects[0].id)
        }
      }

      const convData = await convRes.json()
      setConversation(convData.conversation || [])

      const staffData = await staffRes.json()
      setStaffList(staffData.staff || [])
    } catch (err) {
      console.error('Failed to fetch lead:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formatDateTime = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  const formatMoney = (v: number | null) => v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '--'

  // --- Status update ---
  const handleStatusUpdate = async () => {
    if (!lead || selectedStatus === lead.status) return
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })
      const data = await res.json()
      if (data.success) setLead(data.lead)
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setSavingStatus(false)
    }
  }

  // --- Assign salesperson ---
  const handleAssign = async (staffId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: staffId || null }),
      })
      const data = await res.json()
      if (data.success) setLead(data.lead)
    } catch (err) {
      console.error('Assign error:', err)
    }
  }

  // --- Send email ---
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/admin/leads/${id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          html: `<div style="font-family: sans-serif; line-height: 1.6;">${emailBody.replace(/\n/g, '<br>')}</div>`,
          projectId: emailProjectId || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEmailSubject('')
        setEmailBody('')
        // Refresh conversation
        const convRes = await fetch(`/api/admin/leads/${id}/conversation`)
        const convData = await convRes.json()
        setConversation(convData.conversation || [])
      }
    } catch (err) {
      console.error('Send email error:', err)
    } finally {
      setSendingEmail(false)
    }
  }

  // --- Edit contact ---
  const openEditMode = () => {
    if (!lead) return
    setEditForm({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      email: lead.email,
      phone: lead.phone || '',
      interest: lead.interest || '',
      project_type: lead.project_type || '',
    })
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!lead) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editForm.first_name || null,
          last_name: editForm.last_name || null,
          email: editForm.email,
          phone: editForm.phone || null,
          interest: editForm.interest || null,
          project_type: editForm.project_type || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setLead(data.lead)
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Edit save error:', err)
    } finally {
      setSavingEdit(false)
    }
  }

  // --- Send SMS ---
  const handleSendSms = async () => {
    if (!smsBody.trim()) return
    setSendingSms(true)
    setSmsError(null)
    setSmsSuccess(false)
    try {
      const res = await fetch(`/api/admin/leads/${id}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: smsBody }),
      })
      const data = await res.json()
      if (data.success) {
        setSmsBody('')
        setSmsSuccess(true)
        setTimeout(() => setSmsSuccess(false), 3000)
        // Refresh conversation
        const convRes = await fetch(`/api/admin/leads/${id}/conversation`)
        const convData = await convRes.json()
        setConversation(convData.conversation || [])
      } else {
        setSmsError(data.error || 'Failed to send SMS')
      }
    } catch (err) {
      console.error('Send SMS error:', err)
      setSmsError('Failed to send SMS')
    } finally {
      setSendingSms(false)
    }
  }

  // Character count for SMS (160 char segments)
  const smsCharCount = smsBody.length
  const smsSegments = Math.ceil(smsCharCount / 160) || 0

  if (loading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Loading lead...</Text>
      </Container>
    )
  }

  if (!lead) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Lead not found</Text>
      </Container>
    )
  }

  const assignedStaff = staffList.find((s) => s.id === lead.assigned_to)

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Heading level={1} className="!mb-0">
                  {lead.first_name || ''} {lead.last_name || 'Unknown'}
                </Heading>
                <Badge className={STATUS_COLORS[lead.status] || '!bg-gray-100 !text-gray-600'}>
                  {statusLabel(lead.status)}
                </Badge>
                {lead.source && (
                  <Badge className="!bg-gray-100 !text-gray-500 !border-gray-200">
                    {lead.source.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>
                {lead.phone && <span className="flex items-center gap-1"><PhoneIcon className="w-3.5 h-3.5" /> {lead.phone}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(lead.created_at)}</span>
              </div>
            </div>
            {lead.status !== 'converted' && (
              <Button variant="outline" size="sm" onClick={openEditMode}>
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Converted Banner */}
        {lead.status === 'converted' && (
          <section>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <UserCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <Text size="sm" className="font-semibold text-emerald-800 !mb-0">
                  Lead Converted to Customer
                </Text>
                <Text size="sm" className="text-emerald-600 !mb-0">
                  This lead was converted when an order was placed. The customer record is the source of truth going forward.
                </Text>
              </div>
            </div>
          </section>
        )}

        {/* Two-column layout */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 1, desktop: 3 }} gap="md">
            {/* Left: main content (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#406517]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Projects</Text>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/mc-sales?lead=${lead.id}`}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> New Project
                    </Link>
                  </Button>
                </div>
                {projects.length === 0 ? (
                  <Text size="sm" className="text-gray-400 !mb-0">No projects yet.</Text>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase">Est. Total</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {projects.map((p) => {
                          const order = orders.find((o) => o.project_id === p.id)
                          return (
                            <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2.5 font-medium text-gray-900 capitalize">
                                {p.product_type?.replace(/_/g, ' ')}
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge className={PROJECT_STATUS_COLORS[p.status] || '!bg-gray-100 !text-gray-600 !border-gray-200'}>
                                  {statusLabel(p.status)}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5 text-right text-gray-700">{formatMoney(p.estimated_total)}</td>
                              <td className="px-3 py-2.5 text-gray-500">{formatDate(p.created_at)}</td>
                              <td className="px-3 py-2.5 text-right space-x-1">
                                <Link href={`/admin/projects/${p.id}`} className="text-[#003365] hover:underline text-xs font-medium">
                                  View
                                </Link>
                                {order && (
                                  <Link href={`/admin/orders/${order.id}`} className="text-[#406517] hover:underline text-xs font-medium ml-2">
                                    Order #{order.order_number}
                                  </Link>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Communication Timeline */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Communication</Text>
                  {conversation.length > 0 && (
                    <Badge className="!bg-gray-100 !text-gray-500 !border-gray-200 !text-[10px]">{conversation.length}</Badge>
                  )}
                </div>
                {conversation.length === 0 ? (
                  <Text size="sm" className="text-gray-400 !mb-0">No messages yet.</Text>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {conversation.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg border ${
                          msg.direction === 'outbound'
                            ? msg.type === 'sms'
                              ? 'bg-green-50/60 border-green-200/60 ml-4'
                              : 'bg-[#003365]/5 border-[#003365]/15 ml-4'
                            : msg.type === 'sms'
                              ? 'bg-green-50/30 border-green-100 mr-4'
                              : 'bg-gray-50 border-gray-100 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {msg.type === 'sms' ? (
                              <Smartphone className="w-3 h-3 text-green-600" />
                            ) : (
                              <Mail className="w-3 h-3 text-[#003365]" />
                            )}
                            <Badge className={msg.direction === 'outbound' ? '!bg-[#003365]/10 !text-[#003365] !border-[#003365]/20 !text-[10px]' : '!bg-gray-100 !text-gray-600 !border-gray-200 !text-[10px]'}>
                              {msg.direction === 'outbound' ? 'Sent' : 'Received'}
                            </Badge>
                            <Badge className={msg.type === 'sms' ? '!bg-green-100 !text-green-700 !border-green-200 !text-[10px]' : '!bg-gray-100 !text-gray-500 !border-gray-200 !text-[10px]'}>
                              {msg.type === 'sms' ? 'Text' : 'Email'}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-400">{formatDateTime(msg.timestamp)}</span>
                        </div>
                        {msg.subject && (
                          <p className="text-sm font-medium text-gray-900 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{msg.content || '(HTML email)'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Compose – Email & SMS tabs */}
              <Card variant="elevated" className="!p-4">
                {/* Tab switcher */}
                <div className="flex items-center gap-1 mb-3">
                  <button
                    onClick={() => setComposeMode('email')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      composeMode === 'email'
                        ? 'bg-[#003365]/10 text-[#003365]'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                  <button
                    onClick={() => setComposeMode('sms')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      composeMode === 'sms'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Text
                    {!lead.phone && (
                      <span className="text-[9px] text-gray-400 ml-0.5">(no phone)</span>
                    )}
                  </button>
                </div>

                {composeMode === 'email' ? (
                  /* ===== EMAIL COMPOSE ===== */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                      />
                      {projects.length > 1 && (
                        <select
                          value={emailProjectId}
                          onChange={(e) => setEmailProjectId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                        >
                          <option value="">Link to project (optional)</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.product_type?.replace(/_/g, ' ')} - {statusLabel(p.status)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <textarea
                      placeholder="Email body..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSendEmail}
                        disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        {sendingEmail ? 'Sending...' : 'Send Email'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ===== SMS COMPOSE ===== */
                  <div className="space-y-3">
                    {!lead.phone ? (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <Text size="sm" className="text-amber-800 !mb-0">
                          This lead has no phone number. Add a phone number to send texts.
                        </Text>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Smartphone className="w-3.5 h-3.5 text-green-600" />
                          <span>Sending to <span className="font-medium text-gray-700">{lead.phone}</span></span>
                        </div>
                        <textarea
                          placeholder="Type your text message..."
                          value={smsBody}
                          onChange={(e) => { setSmsBody(e.target.value); setSmsError(null) }}
                          rows={3}
                          maxLength={1600}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-500 resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${smsCharCount > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                              {smsCharCount}/160
                              {smsSegments > 1 && (
                                <span className="ml-1">({smsSegments} segments)</span>
                              )}
                            </span>
                            {smsError && (
                              <span className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {smsError}
                              </span>
                            )}
                            {smsSuccess && (
                              <span className="text-xs text-green-600 font-medium">Text sent!</span>
                            )}
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSendSms}
                            disabled={sendingSms || !smsBody.trim() || !lead.phone}
                            className="!bg-green-600 hover:!bg-green-700"
                          >
                            <Smartphone className="w-3.5 h-3.5 mr-1" />
                            {sendingSms ? 'Sending...' : 'Send Text'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Status</Text>
                {lead.status === 'converted' ? (
                  <div className="flex items-center gap-2">
                    <Badge className="!bg-emerald-100 !text-emerald-700 !border-emerald-200">Converted</Badge>
                    <Text size="sm" className="text-gray-400 !mb-0">Read-only</Text>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                    >
                      {LEAD_STATUSES.filter(s => s !== 'converted').map((s) => (
                        <option key={s} value={s}>{statusLabel(s)}</option>
                      ))}
                    </select>
                    <Button variant="primary" size="sm" onClick={handleStatusUpdate} disabled={savingStatus || selectedStatus === lead.status}>
                      <Save className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Assigned To */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Assigned To</Text>
                </div>
                <select
                  value={lead.assigned_to || ''}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {assignedStaff && (
                  <Text size="sm" className="text-gray-500 mt-1 !mb-0">{assignedStaff.email}</Text>
                )}
              </Card>

              {/* Contact Info */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#003365]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Contact</Text>
                  </div>
                  {!isEditing && lead.status !== 'converted' && (
                    <button
                      onClick={openEditMode}
                      className="p-1 text-gray-400 hover:text-[#003365] hover:bg-gray-100 rounded transition-colors"
                      title="Edit contact info"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-0.5">First Name</label>
                        <input
                          type="text"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Last Name</label>
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Interest</label>
                        <select
                          value={editForm.interest}
                          onChange={(e) => setEditForm({ ...editForm, interest: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                        >
                          <option value="">None</option>
                          <option value="mosquito_curtains">Mosquito Curtains</option>
                          <option value="clear_vinyl">Clear Vinyl</option>
                          <option value="raw_netting">Raw Netting</option>
                          <option value="roll_up_shades">Roll Up Shades</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Type</label>
                        <input
                          type="text"
                          value={editForm.project_type}
                          onChange={(e) => setEditForm({ ...editForm, project_type: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                          placeholder="e.g. porch, gazebo"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <Button variant="primary" size="sm" onClick={handleSaveEdit} disabled={savingEdit}>
                        <Save className="w-3 h-3 mr-1" />
                        {savingEdit ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Email: </span><a href={`mailto:${lead.email}`} className="text-[#003365] hover:underline">{lead.email}</a></div>
                    {lead.phone && <div><span className="text-gray-500">Phone: </span><span className="text-gray-900">{lead.phone}</span></div>}
                    {lead.interest && <div><span className="text-gray-500">Interest: </span><span className="text-gray-900 capitalize">{lead.interest.replace(/_/g, ' ')}</span></div>}
                    {lead.project_type && <div><span className="text-gray-500">Type: </span><span className="text-gray-900 capitalize">{lead.project_type}</span></div>}
                  </div>
                )}
              </Card>

              {/* Message */}
              {lead.message && (
                <Card variant="elevated" className="!p-4">
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Message</Text>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
                </Card>
              )}

              {/* Attribution (from session) */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Attribution</Text>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {lead.session_utm_source && <div><Tag className="w-3 h-3 inline mr-1" />Source: <span className="text-gray-700">{lead.session_utm_source}</span></div>}
                  {lead.session_utm_medium && <div><Tag className="w-3 h-3 inline mr-1" />Medium: <span className="text-gray-700">{lead.session_utm_medium}</span></div>}
                  {lead.session_utm_campaign && <div><Tag className="w-3 h-3 inline mr-1" />Campaign: <span className="text-gray-700">{lead.session_utm_campaign}</span></div>}
                  {lead.session_referrer && <div className="truncate"><ExternalLink className="w-3 h-3 inline mr-1" />Referrer: <span className="text-gray-700">{lead.session_referrer}</span></div>}
                  {lead.session_landing_page && <div className="truncate"><Globe className="w-3 h-3 inline mr-1" />Landing: <span className="text-gray-700">{lead.session_landing_page}</span></div>}
                  {!lead.session_utm_source && !lead.session_utm_medium && !lead.session_referrer && (
                    <span className="text-gray-400">No attribution data</span>
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
