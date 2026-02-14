'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  FileText,
  MessageSquare,
  Truck,
  Upload,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Printer,
  CreditCard,
  FolderOpen,
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
import { getCartOptionLabels } from '@/lib/cart-option-labels'

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
    value: status, label: status, color: '!bg-gray-100 !text-gray-600 !border-gray-200',
  }
}

// =============================================================================
// TYPES
// =============================================================================

interface LineItemOption {
  id: string
  option_name: string
  option_value: string
  option_display: string | null
  price_impact: number
}

interface LineItem {
  id: string
  product_sku: string
  product_name: string
  quantity: number
  width_inches: number | null
  height_inches: number | null
  length_feet: number | null
  unit_price: number
  line_total: number
  adjustment_type: string | null
  adjustment_reason: string | null
  panel_specs: Record<string, unknown> | null
  original_bundle_name: string | null
  line_item_options: LineItemOption[]
}

interface OrderNote {
  id: string
  author_name: string
  content: string
  is_customer_visible: boolean
  created_at: string
}

interface TrackingNumber {
  id: string
  tracking_number: string
  carrier: string | null
  tracking_url: string | null
  shipped_at: string
  created_at: string
}

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  payment_status: string | null
  payment_method: string | null
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  salesperson_name: string | null
  salesperson_id: string | null
  diagram_url: string | null
  cart_id: string | null
  project_id: string | null
  created_at: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_address_2: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_phone: string | null
  shipping_address_1: string | null
  shipping_address_2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  internal_note: string | null
  customer_note: string | null
}

interface Project {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  status: string
  share_token: string
  notes: string | null
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [notes, setNotes] = useState<OrderNote[]>([])
  const [trackingNumbers, setTrackingNumbers] = useState<TrackingNumber[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Status change
  const [selectedStatus, setSelectedStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  // Notes form
  const [newNote, setNewNote] = useState('')
  const [noteAuthor, setNoteAuthor] = useState('')
  const [noteVisible, setNoteVisible] = useState(false)
  const [addingNote, setAddingNote] = useState(false)

  // Tracking form
  const [newTracking, setNewTracking] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [addingTracking, setAddingTracking] = useState(false)

  // Diagram upload
  const [uploadingDiagram, setUploadingDiagram] = useState(false)

  // Delete order
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState(false)

  // Staff list for salesperson dropdown
  const [staffList, setStaffList] = useState<{ id: string; name: string; email: string }[]>([])

  useEffect(() => {
    fetch('/api/admin/staff?active=true')
      .then(res => res.json())
      .then(data => setStaffList(data.staff || []))
      .catch(() => {})
  }, [])

  const handleSalespersonChange = async (staffId: string) => {
    if (!order) return
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesperson_id: staffId || null }),
      })
      const data = await res.json()
      if (data.success && data.order) {
        // Re-fetch to get the joined salesperson_name
        await fetchOrder()
      }
    } catch (err) {
      console.error('Salesperson update error:', err)
    }
  }

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`)
      const data = await res.json()
      if (data.order) {
        setOrder(data.order)
        setSelectedStatus(data.order.status)
        setLineItems(data.lineItems || [])
        setNotes(data.notes || [])
        setTrackingNumbers(data.trackingNumbers || [])
        setProject(data.project || null)
      }
    } catch (err) {
      console.error('Failed to fetch order:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const formatMoney = (val: number | null) => {
    if (val == null) return '$0.00'
    return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  // --- Status Update ---
  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })
      const data = await res.json()
      if (data.success) setOrder(data.order)
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setSavingStatus(false)
    }
  }

  // --- Add Note ---
  const handleAddNote = async () => {
    if (!newNote.trim() || !noteAuthor.trim()) return
    setAddingNote(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: noteAuthor, content: newNote, is_customer_visible: noteVisible }),
      })
      const data = await res.json()
      if (data.success) {
        setNotes((prev) => [...prev, data.note])
        setNewNote('')
        setNoteVisible(false)
      }
    } catch (err) {
      console.error('Failed to add note:', err)
    } finally {
      setAddingNote(false)
    }
  }

  // --- Add Tracking ---
  const handleAddTracking = async () => {
    if (!newTracking.trim()) return
    setAddingTracking(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: newTracking, carrier: trackingCarrier || null, tracking_url: trackingUrl || null }),
      })
      const data = await res.json()
      if (data.success) {
        setTrackingNumbers((prev) => [...prev, data.tracking])
        setNewTracking('')
        setTrackingCarrier('')
        setTrackingUrl('')
      }
    } catch (err) {
      console.error('Failed to add tracking:', err)
    } finally {
      setAddingTracking(false)
    }
  }

  // --- Delete Tracking ---
  const handleDeleteTracking = async (trackingId: string) => {
    try {
      await fetch(`/api/admin/orders/${id}/tracking`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: trackingId }),
      })
      setTrackingNumbers((prev) => prev.filter((t) => t.id !== trackingId))
    } catch (err) {
      console.error('Failed to delete tracking:', err)
    }
  }

  // --- Delete Order ---
  const handleDeleteOrder = async () => {
    setDeletingOrder(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/orders')
      } else {
        console.error('Failed to delete order:', data.error)
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      console.error('Failed to delete order:', err)
      setShowDeleteConfirm(false)
    } finally {
      setDeletingOrder(false)
    }
  }

  // --- Diagram Upload ---
  const handleDiagramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingDiagram(true)
    try {
      const presignedRes = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadType: 'diagram',
          projectId: order?.project_id || undefined,
        }),
      })
      const { presignedUrl, publicUrl } = await presignedRes.json()
      if (!presignedUrl) return

      await fetch(presignedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })

      const updateRes = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagram_url: publicUrl }),
      })
      const data = await updateRes.json()
      if (data.success) setOrder(data.order)
    } catch (err) {
      console.error('Failed to upload diagram:', err)
    } finally {
      setUploadingDiagram(false)
    }
  }

  if (loading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Loading order...</Text>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Order not found</Text>
      </Container>
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/orders')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Heading level={1} className="!mb-0">{order.order_number}</Heading>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>
              <Text size="sm" className="text-gray-500 !mb-0 mt-1">
                Created {formatDate(order.created_at)}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
                  <FileText className="w-4 h-4 mr-1" /> Invoice
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/orders/${order.id}/packing-list`} target="_blank">
                  <Printer className="w-4 h-4 mr-1" /> Packing List
                </Link>
              </Button>
              {order.project_id && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/mc-sales/project/${order.project_id}`}>
                    <Package className="w-4 h-4 mr-1" /> Edit Cart
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="!border-red-200 !text-red-600 hover:!bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Main content: two columns */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 1, desktop: 3 }} gap="md">
            {/* Left: main content (2 cols wide) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Change */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Status</Text>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStatusUpdate}
                    disabled={savingStatus || selectedStatus === order.status}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {savingStatus ? 'Saving...' : 'Update'}
                  </Button>
                </div>
              </Card>

              {/* Line Items */}
              <Card variant="elevated" className="!p-0 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <Text size="sm" className="font-semibold text-gray-600 uppercase tracking-wider !mb-0">Line Items</Text>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="text-center px-4 py-2 text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lineItems.map((item) => {
                        // Build options map from panel_specs (original options) or line_item_options
                        const optionsMap: Record<string, string | number | boolean> =
                          (item.panel_specs && typeof item.panel_specs === 'object' && Object.keys(item.panel_specs).length > 0)
                            ? (item.panel_specs as Record<string, string | number | boolean>)
                            : item.line_item_options?.reduce((acc, opt) => {
                                acc[opt.option_name] = opt.option_value
                                return acc
                              }, {} as Record<string, string | number | boolean>) || {}
                        const optLabels = getCartOptionLabels(item.product_sku, optionsMap)
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">{item.product_name}</div>
                              <div className="text-xs text-gray-500">{item.product_sku}</div>
                              {optLabels.length > 0 ? (
                                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                                  {optLabels.map((ol, idx) => (
                                    <span key={idx} className="text-xs text-gray-500">
                                      <span className="font-medium text-gray-600">{ol.label}:</span> {ol.value}
                                    </span>
                                  ))}
                                </div>
                              ) : item.line_item_options?.length ? (
                                item.line_item_options.map((opt) => (
                                  <div key={opt.id} className="text-xs text-gray-500">
                                    {opt.option_name}: {opt.option_display || opt.option_value}
                                  </div>
                                ))
                              ) : null}
                              {item.adjustment_type && (
                                <div className="text-xs text-amber-600">
                                  {item.adjustment_type}: {item.adjustment_reason}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-gray-700">{formatMoney(item.unit_price)}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">{formatMoney(item.line_total)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Totals */}
                <div className="border-t border-gray-200 px-4 py-3 space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span><span>{formatMoney(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span><span>{formatMoney(order.shipping_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span><span>{formatMoney(order.tax_amount)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span><span>-{formatMoney(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span><span>{formatMoney(order.total)}</span>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-3">Notes</Text>
                {notes.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{note.author_name}</span>
                          <div className="flex items-center gap-2">
                            {note.is_customer_visible && (
                              <Badge className="!bg-blue-100 !text-blue-700 !border-blue-200 !text-[10px]">Customer visible</Badge>
                            )}
                            <span className="text-xs text-gray-400">{formatDate(note.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noteVisible}
                        onChange={(e) => setNoteVisible(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Visible to customer
                    </label>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddNote}
                      disabled={addingNote || !newNote.trim() || !noteAuthor.trim()}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      {addingNote ? 'Adding...' : 'Add Note'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Tracking Numbers */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-3">Tracking Numbers</Text>
                {trackingNumbers.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {trackingNumbers.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-teal-600" />
                            <span className="text-sm font-mono text-gray-900">{t.tracking_number}</span>
                            {t.carrier && (
                              <Badge className="!bg-gray-100 !text-gray-600 !border-gray-200 !text-xs">{t.carrier}</Badge>
                            )}
                          </div>
                          {t.tracking_url && (
                            <a href={t.tracking_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#003365] hover:underline flex items-center gap-1 mt-1">
                              Track Package <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTracking(t.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Tracking number"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <input
                    type="text"
                    placeholder="Carrier (UPS, FedEx...)"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddTracking}
                    disabled={addingTracking || !newTracking.trim()}
                    className="w-full"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    {addingTracking ? 'Adding...' : 'Add Tracking'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Customer</Text>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-gray-500">Name: </span>
                    <span className="text-gray-900 font-medium">{order.billing_first_name} {order.billing_last_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email: </span>
                    <a href={`mailto:${order.email}`} className="text-[#003365] hover:underline">{order.email}</a>
                  </div>
                  {order.billing_phone && (
                    <div>
                      <span className="text-gray-500">Phone: </span>
                      <span className="text-gray-900">{order.billing_phone}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Shipping Address */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Shipping Address</Text>
                </div>
                <div className="text-sm text-gray-700 space-y-0.5">
                  <div>{order.shipping_first_name} {order.shipping_last_name}</div>
                  {order.shipping_address_1 && <div>{order.shipping_address_1}</div>}
                  {order.shipping_address_2 && <div>{order.shipping_address_2}</div>}
                  <div>{[order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}</div>
                </div>
              </Card>

              {/* Salesperson */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Salesperson</Text>
                </div>
                <select
                  value={order.salesperson_id || ''}
                  onChange={(e) => handleSalespersonChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Card>

              {/* Project Link */}
              {project && (
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="w-4 h-4 text-[#406517]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Project</Text>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-gray-900 font-medium">{project.product_type}</div>
                    <div className="text-gray-600">{project.first_name} {project.last_name}</div>
                    <Link
                      href={`/project/${project.share_token}`}
                      target="_blank"
                      className="text-[#003365] hover:underline flex items-center gap-1 text-xs"
                    >
                      View Project <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              )}

              {/* Payment */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Payment</Text>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-500">Method: </span>
                    <span className="text-gray-900">{order.payment_method || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="text-gray-900 capitalize">{order.payment_status || 'pending'}</span>
                  </div>
                </div>
              </Card>

              {/* Diagram Attachment */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Panel Diagram</Text>
                </div>
                {order.diagram_url ? (
                  <div className="space-y-2">
                    <a
                      href={order.diagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#003365] hover:underline flex items-center gap-1"
                    >
                      View Diagram PDF <ExternalLink className="w-3 h-3" />
                    </a>
                    <label className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      Replace
                      <input type="file" accept=".pdf" onChange={handleDiagramUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    {uploadingDiagram ? 'Uploading...' : 'Upload Diagram PDF'}
                    <input type="file" accept=".pdf" onChange={handleDiagramUpload} className="hidden" disabled={uploadingDiagram} />
                  </label>
                )}
              </Card>
            </div>
          </Grid>
        </section>
      </Stack>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <Heading level={3} className="!mb-0">Delete Order</Heading>
            </div>
            <Text size="sm" className="text-gray-600 mb-2">
              Are you sure you want to delete <strong>{order.order_number}</strong>? This will permanently remove:
            </Text>
            <ul className="text-sm text-gray-600 mb-6 ml-4 list-disc space-y-1">
              <li>The order and all its details</li>
              <li>All line items ({lineItems.length})</li>
              <li>All line item options</li>
              <li>All order notes ({notes.length})</li>
            </ul>
            <Text size="xs" className="text-red-600 font-medium mb-4">
              This action cannot be undone.
            </Text>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingOrder}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteOrder}
                disabled={deletingOrder}
                className="!bg-red-600 hover:!bg-red-700 !border-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {deletingOrder ? 'Deleting...' : 'Delete Order'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
