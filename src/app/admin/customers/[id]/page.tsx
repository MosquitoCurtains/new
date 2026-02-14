'use client'

/**
 * Admin Customer Detail Page
 *
 * Real data: customer info, order history, linked projects, and lead origin.
 */

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Edit,
  FolderOpen,
  FileUser,
  ExternalLink,
  Save,
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
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface CustomerDetail {
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
  assigned_salesperson_id: string | null
  created_at: string
  first_seen_at: string | null
  email_captured_at: string | null
  first_quote_at: string | null
  first_purchase_at: string | null
  // Computed
  total_orders: number
  total_spent: number
  avg_order_value: number
  first_order_date: string | null
  last_order_date: string | null
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total: number
  subtotal: number
  tax: number
  shipping_cost: number
  project_id: string | null
  created_at: string
}

interface Project {
  id: string
  product_type: string
  project_type: string | null
  project_name: string | null
  status: string
  estimated_total: number | null
  share_token: string | null
  assigned_to: string | null
  lead_id: string | null
  created_at: string
}

interface LeadRef {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  status: string
  source: string | null
  interest: string | null
  created_at: string
}

// =============================================================================
// STATUS HELPERS
// =============================================================================

const CUSTOMER_STATUS_COLORS: Record<string, string> = {
  lead: '!bg-blue-100 !text-blue-700 !border-blue-200',
  quoted: '!bg-purple-100 !text-purple-700 !border-purple-200',
  customer: '!bg-green-100 !text-green-700 !border-green-200',
  repeat: '!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30',
  churned: '!bg-red-100 !text-red-600 !border-red-200',
}

const ORDER_STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle }> = {
  delivered: { color: '!bg-[#406517]/10 !text-[#406517]', icon: CheckCircle },
  shipped: { color: '!bg-[#B30158]/10 !text-[#B30158]', icon: Package },
  processing: { color: '!bg-[#FFA501]/10 !text-[#FFA501]', icon: Clock },
  pending: { color: '!bg-blue-100 !text-blue-700', icon: Clock },
  paid: { color: '!bg-green-100 !text-green-700', icon: CheckCircle },
  cancelled: { color: '!bg-red-100 !text-red-600', icon: Clock },
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
  draft: '!bg-gray-100 !text-gray-600 !border-gray-200',
  new: '!bg-blue-100 !text-blue-700 !border-blue-200',
  need_photos: '!bg-amber-100 !text-amber-700 !border-amber-200',
  working_on_quote: '!bg-indigo-100 !text-indigo-700 !border-indigo-200',
  quote_sent: '!bg-purple-100 !text-purple-700 !border-purple-200',
  order_placed: '!bg-green-100 !text-green-700 !border-green-200',
}

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const formatMoney = (v: number | null) => v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '--'

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [lead, setLead] = useState<LeadRef | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/customers/${params.id}`)
      const data = await res.json()

      if (data.customer) {
        setCustomer(data.customer)
        setNotesValue(data.customer.notes || '')
      }
      setOrders(data.orders || [])
      setProjects(data.projects || [])
      setLead(data.lead || null)
    } catch (err) {
      console.error('Failed to fetch customer:', err)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSaveNotes = async () => {
    if (!customer) return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesValue }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomer((prev) => prev ? { ...prev, notes: notesValue } : prev)
        setEditingNotes(false)
      }
    } catch (err) {
      console.error('Save notes error:', err)
    } finally {
      setSavingNotes(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!customer) return
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomer((prev) => prev ? { ...prev, customer_status: newStatus } : prev)
      }
    } catch (err) {
      console.error('Status change error:', err)
    }
  }

  if (isLoading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!customer) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <Card variant="elevated" className="!p-8 text-center">
            <Heading level={2}>Customer Not Found</Heading>
            <div className="flex justify-center mt-4">
              <Button variant="primary" asChild>
                <Link href="/admin/customers">Back to Customers</Link>
              </Button>
            </div>
          </Card>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/customers">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <Heading level={1} className="!mb-0">
                    {customer.first_name || ''} {customer.last_name || ''}
                    {!customer.first_name && !customer.last_name && <span className="text-gray-400 italic">Unknown</span>}
                  </Heading>
                  {customer.customer_status && (
                    <Badge className={`${CUSTOMER_STATUS_COLORS[customer.customer_status] || '!bg-gray-100 !text-gray-600'} capitalize`}>
                      {statusLabel(customer.customer_status)}
                    </Badge>
                  )}
                </div>
                <Text className="text-gray-600 !mb-0">{customer.email}</Text>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section>
          <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
            {/* Left: Main Content (2 cols) */}
            <div className="lg:col-span-2">
              <Stack gap="lg">
                {/* Metrics */}
                <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                  <Card variant="elevated" className="!p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#406517]" />
                      <Text size="sm" className="text-gray-500 !mb-0">Total Spent</Text>
                    </div>
                    <Text className="text-2xl font-bold text-gray-900 !mb-0">
                      {formatMoney(customer.total_spent)}
                    </Text>
                  </Card>

                  <Card variant="elevated" className="!p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="w-4 h-4 text-[#003365]" />
                      <Text size="sm" className="text-gray-500 !mb-0">Orders</Text>
                    </div>
                    <Text className="text-2xl font-bold text-gray-900 !mb-0">
                      {customer.total_orders}
                    </Text>
                  </Card>

                  <Card variant="elevated" className="!p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#B30158]" />
                      <Text size="sm" className="text-gray-500 !mb-0">Avg Order</Text>
                    </div>
                    <Text className="text-2xl font-bold text-gray-900 !mb-0">
                      {customer.avg_order_value > 0 ? formatMoney(customer.avg_order_value) : '--'}
                    </Text>
                  </Card>

                  <Card variant="elevated" className="!p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#FFA501]" />
                      <Text size="sm" className="text-gray-500 !mb-0">Customer Since</Text>
                    </div>
                    <Text className="text-lg font-bold text-gray-900 !mb-0">
                      {formatDate(customer.created_at)}
                    </Text>
                  </Card>
                </Grid>

                {/* Projects */}
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#406517]" />
                      <Heading level={3} className="!mb-0">Projects</Heading>
                      <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">{projects.length}</Badge>
                    </div>
                  </div>
                  {projects.length === 0 ? (
                    <Text className="text-gray-400 !mb-0">No projects linked to this customer.</Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Project</th>
                            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase">Est. Total</th>
                            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {projects.map((p) => {
                            const linkedOrder = orders.find((o) => o.project_id === p.id)
                            return (
                              <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2.5">
                                  <div className="font-medium text-gray-900">
                                    {p.project_name || p.product_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Project'}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">{p.product_type?.replace(/_/g, ' ')}</div>
                                </td>
                                <td className="px-3 py-2.5">
                                  <Badge className={`${PROJECT_STATUS_COLORS[p.status] || '!bg-gray-100 !text-gray-600 !border-gray-200'} !text-[10px]`}>
                                    {statusLabel(p.status)}
                                  </Badge>
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-700">{formatMoney(p.estimated_total)}</td>
                                <td className="px-3 py-2.5 text-gray-500">{formatDate(p.created_at)}</td>
                                <td className="px-3 py-2.5 text-right space-x-2">
                                  <Link href={`/admin/projects/${p.id}`} className="text-[#003365] hover:underline text-xs font-medium">
                                    View
                                  </Link>
                                  {linkedOrder && (
                                    <Link href={`/admin/orders/${linkedOrder.id}`} className="text-[#406517] hover:underline text-xs font-medium">
                                      Order #{linkedOrder.order_number}
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

                {/* Order History */}
                <Card variant="elevated" className="!p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-5 h-5 text-[#003365]" />
                    <Heading level={3} className="!mb-0">Order History</Heading>
                    <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">{orders.length}</Badge>
                  </div>
                  {orders.length === 0 ? (
                    <Text className="text-gray-400 !mb-0">No orders yet.</Text>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const statusConf = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.processing
                        const StatusIcon = statusConf.icon
                        return (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${statusConf.color} flex items-center justify-center`}>
                                <StatusIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <Text className="font-medium text-gray-900 !mb-0">
                                  {order.order_number || `Order #${order.id.slice(0, 8)}`}
                                </Text>
                                <Text size="sm" className="text-gray-500 !mb-0">
                                  {formatDate(order.created_at)} | {statusLabel(order.status)}
                                </Text>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Text className="font-bold text-[#406517] !mb-0">{formatMoney(Number(order.total))}</Text>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </Stack>
            </div>

            {/* Right: Sidebar */}
            <div>
              <Stack gap="md">
                {/* Status */}
                <Card variant="outlined" className="!p-4">
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Status</Text>
                  <select
                    value={customer.customer_status || ''}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    <option value="">No Status</option>
                    <option value="lead">Lead</option>
                    <option value="quoted">Quoted</option>
                    <option value="customer">Customer</option>
                    <option value="repeat">Repeat</option>
                    <option value="churned">Churned</option>
                  </select>
                </Card>

                {/* Contact Info */}
                <Card variant="outlined" className="!p-4">
                  <Heading level={4} className="!mb-4">Contact</Heading>
                  <Stack gap="sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${customer.email}`} className="text-sm text-[#003365] hover:underline">{customer.email}</a>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <Text className="text-gray-700 !mb-0 text-sm">{customer.phone}</Text>
                      </div>
                    )}
                    {(customer.city || customer.state) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <Text className="text-gray-700 !mb-0 text-sm">
                          {[customer.city, customer.state, customer.zip].filter(Boolean).join(', ')}
                        </Text>
                      </div>
                    )}
                  </Stack>
                </Card>

                {/* Lead Origin */}
                {lead && (
                  <Card variant="outlined" className="!p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileUser className="w-4 h-4 text-[#003365]" />
                      <Heading level={4} className="!mb-0">Lead Origin</Heading>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div><span className="text-gray-500">Source: </span><span className="text-gray-700 capitalize">{lead.source?.replace(/_/g, ' ') || '--'}</span></div>
                      <div><span className="text-gray-500">Interest: </span><span className="text-gray-700 capitalize">{lead.interest?.replace(/_/g, ' ') || '--'}</span></div>
                      <div><span className="text-gray-500">Created: </span><span className="text-gray-700">{formatDate(lead.created_at)}</span></div>
                    </div>
                    <div className="mt-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/leads/${lead.id}`}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Lead
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Timeline */}
                <Card variant="outlined" className="!p-4">
                  <Heading level={4} className="!mb-4">Timeline</Heading>
                  <div className="space-y-3">
                    {customer.first_seen_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-gray-500">First seen:</span>
                        <span className="text-gray-700">{formatDate(customer.first_seen_at)}</span>
                      </div>
                    )}
                    {customer.email_captured_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-gray-500">Email captured:</span>
                        <span className="text-gray-700">{formatDate(customer.email_captured_at)}</span>
                      </div>
                    )}
                    {customer.first_quote_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-gray-500">First quote:</span>
                        <span className="text-gray-700">{formatDate(customer.first_quote_at)}</span>
                      </div>
                    )}
                    {customer.first_purchase_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-gray-500">First purchase:</span>
                        <span className="text-gray-700">{formatDate(customer.first_purchase_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-gray-500">Record created:</span>
                      <span className="text-gray-700">{formatDate(customer.created_at)}</span>
                    </div>
                  </div>
                </Card>

                {/* Notes */}
                <Card variant="outlined" className="!p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Heading level={4} className="!mb-0">Notes</Heading>
                    {!editingNotes && (
                      <Button variant="ghost" size="sm" onClick={() => setEditingNotes(true)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365] resize-none"
                        placeholder="Add notes about this customer..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingNotes(false); setNotesValue(customer.notes || '') }}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveNotes} disabled={savingNotes}>
                          <Save className="w-3.5 h-3.5 mr-1" />
                          {savingNotes ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Text className="text-gray-700 !mb-0 text-sm">
                      {customer.notes || <span className="text-gray-400 italic">No notes yet.</span>}
                    </Text>
                  )}
                </Card>
              </Stack>
            </div>
          </Grid>
        </section>
      </Stack>
    </Container>
  )
}
