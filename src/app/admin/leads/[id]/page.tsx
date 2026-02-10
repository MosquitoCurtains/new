'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
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
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  landing_page: string | null
  created_at: string
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
          </div>
        </section>

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
                            ? 'bg-[#003365]/5 border-[#003365]/15 ml-4'
                            : 'bg-gray-50 border-gray-100 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge className={msg.direction === 'outbound' ? '!bg-[#003365]/10 !text-[#003365] !border-[#003365]/20 !text-[10px]' : '!bg-gray-100 !text-gray-600 !border-gray-200 !text-[10px]'}>
                              {msg.direction === 'outbound' ? 'Sent' : 'Received'}
                            </Badge>
                            <Badge className="!bg-gray-100 !text-gray-500 !border-gray-200 !text-[10px]">
                              {msg.type}
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

              {/* Send Email */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Send Email</Text>
                </div>
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
                      {sendingEmail ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Status</Text>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                  <Button variant="primary" size="sm" onClick={handleStatusUpdate} disabled={savingStatus || selectedStatus === lead.status}>
                    <Save className="w-3.5 h-3.5" />
                  </Button>
                </div>
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
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Contact</Text>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Email: </span><a href={`mailto:${lead.email}`} className="text-[#003365] hover:underline">{lead.email}</a></div>
                  {lead.phone && <div><span className="text-gray-500">Phone: </span><span className="text-gray-900">{lead.phone}</span></div>}
                  {lead.interest && <div><span className="text-gray-500">Interest: </span><span className="text-gray-900 capitalize">{lead.interest.replace(/_/g, ' ')}</span></div>}
                  {lead.project_type && <div><span className="text-gray-500">Type: </span><span className="text-gray-900 capitalize">{lead.project_type}</span></div>}
                </div>
              </Card>

              {/* Message */}
              {lead.message && (
                <Card variant="elevated" className="!p-4">
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Message</Text>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
                </Card>
              )}

              {/* Attribution */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Attribution</Text>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {lead.utm_source && <div><Tag className="w-3 h-3 inline mr-1" />Source: <span className="text-gray-700">{lead.utm_source}</span></div>}
                  {lead.utm_medium && <div><Tag className="w-3 h-3 inline mr-1" />Medium: <span className="text-gray-700">{lead.utm_medium}</span></div>}
                  {lead.utm_campaign && <div><Tag className="w-3 h-3 inline mr-1" />Campaign: <span className="text-gray-700">{lead.utm_campaign}</span></div>}
                  {lead.referrer && <div className="truncate"><ExternalLink className="w-3 h-3 inline mr-1" />Referrer: <span className="text-gray-700">{lead.referrer}</span></div>}
                  {lead.landing_page && <div className="truncate"><Globe className="w-3 h-3 inline mr-1" />Landing: <span className="text-gray-700">{lead.landing_page}</span></div>}
                  {!lead.utm_source && !lead.utm_medium && !lead.referrer && (
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
