'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  FolderOpen,
  Camera,
  ShoppingCart,
  Package,
  FileText,
  User,
  ExternalLink,
  Save,
  Upload,
  Play,
  Briefcase,
  Copy,
  Check,
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

const PROJECT_STATUSES = [
  'draft', 'new', 'need_photos', 'working_on_quote', 'quote_sent',
  'quote_viewed', 'need_decision', 'order_placed', 'closed', 'archived',
]

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

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// TYPES
// =============================================================================

interface ProjectData {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  project_type: string | null
  mesh_type: string | null
  top_attachment: string | null
  total_width: number | null
  number_of_sides: number | null
  notes: string | null
  estimated_total: number | null
  status: string
  assigned_to: string | null
  share_token: string
  lead_id: string | null
  customer_id: string | null
  created_at: string
}

interface Photo {
  id: string
  storage_path: string
  filename: string
  content_type: string | null
  size_bytes: number | null
  created_at: string
}

interface CartData {
  id: string
  status: string
  subtotal: number
  total: number
  created_at: string
}

interface OrderData {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
}

interface Staff {
  id: string
  name: string
  email: string
}

// =============================================================================
// HELPERS
// =============================================================================

function isVideo(ct: string | null, filename: string): boolean {
  if (ct && ct.startsWith('video/')) return true
  return /\.(mp4|mov|webm)$/i.test(filename)
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [project, setProject] = useState<ProjectData | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [cart, setCart] = useState<CartData | null>(null)
  const [order, setOrder] = useState<OrderData | null>(null)
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  // Status
  const [selectedStatus, setSelectedStatus] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  // Notes
  const [notesText, setNotesText] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  // Upload
  const [uploading, setUploading] = useState(false)

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  // Share link copy
  const [copied, setCopied] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [projRes, photosRes, staffRes] = await Promise.all([
        fetch(`/api/admin/sales/projects/${id}`),
        fetch(`/api/admin/projects/${id}/photos`),
        fetch('/api/admin/staff?active=true'),
      ])

      const projData = await projRes.json()
      if (projData.project) {
        setProject(projData.project)
        setSelectedStatus(projData.project.status)
        // Parse notes - could be JSON string or plain text
        try {
          const parsed = JSON.parse(projData.project.notes || '{}')
          setNotesText(parsed.projectNote || projData.project.notes || '')
        } catch {
          setNotesText(projData.project.notes || '')
        }
      }

      const photosData = await photosRes.json()
      setPhotos(photosData.photos || [])

      const staffData = await staffRes.json()
      setStaffList(staffData.staff || [])

      // Fetch cart if exists
      try {
        const cartRes = await fetch(`/api/admin/carts?project_id=${id}`)
        const cartData = await cartRes.json()
        if (cartData.carts && cartData.carts.length > 0) {
          setCart(cartData.carts[0])
        }
      } catch { /* no cart */ }

      // Fetch order if exists
      try {
        const orderRes = await fetch(`/api/admin/orders?search=${id}&limit=1`)
        const orderData = await orderRes.json()
        // Search by project_id through orders
        const matching = (orderData.orders || []).find((o: Record<string, unknown>) => o.project_id === id)
        if (matching) setOrder(matching as OrderData)
      } catch { /* no order */ }
    } catch (err) {
      console.error('Failed to fetch project:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formatMoney = (v: number | null) => v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '--'

  // --- Status update ---
  const handleStatusUpdate = async () => {
    if (!project || selectedStatus === project.status) return
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/sales/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })
      const data = await res.json()
      if (data.project) setProject(data.project)
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setSavingStatus(false)
    }
  }

  // --- Assign salesperson ---
  const handleAssign = async (staffId: string) => {
    try {
      const res = await fetch(`/api/admin/sales/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: staffId || null }),
      })
      const data = await res.json()
      if (data.project) setProject(data.project)
    } catch (err) {
      console.error('Assign error:', err)
    }
  }

  // --- Save notes ---
  const handleSaveNotes = async () => {
    if (!project) return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/admin/sales/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesText }),
      })
      const data = await res.json()
      if (data.project) setProject(data.project)
    } catch (err) {
      console.error('Notes save error:', err)
    } finally {
      setSavingNotes(false)
    }
  }

  // --- Upload photo ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !project) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const mimeFallback: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        webp: 'image/webp', heic: 'image/heic', pdf: 'application/pdf',
        mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
      }
      const fileType = file.type || mimeFallback[ext] || 'image/jpeg'

      const presignedRes = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType,
          fileSize: file.size,
          uploadType: 'project-photo',
          projectId: project.id,
        }),
      })
      const { presignedUrl, publicUrl } = await presignedRes.json()
      if (!presignedUrl) return

      await fetch(presignedUrl, { method: 'PUT', headers: { 'Content-Type': fileType }, body: file })

      // Save to project_photos
      const saveRes = await fetch(`/api/admin/projects/${id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: [{ url: publicUrl, fileName: file.name, contentType: fileType, sizeBytes: file.size }],
        }),
      })
      const saveData = await saveRes.json()
      if (saveData.photos) {
        setPhotos((prev) => [...prev, ...saveData.photos])
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  // --- Copy share link ---
  const handleCopyShareLink = () => {
    if (!project) return
    const url = `${window.location.origin}/project/${project.share_token}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // --- Sales page route ---
  const salesRoute = project ? {
    mosquito_curtains: '/admin/mc-sales',
    clear_vinyl: '/admin/cv-sales',
    raw_materials: '/admin/rn-sales',
  }[project.product_type] || '/admin/mc-sales' : '/admin/mc-sales'

  if (loading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Loading project...</Text>
      </Container>
    )
  }

  if (!project) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Text className="text-gray-500">Project not found</Text>
      </Container>
    )
  }

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
                <Heading level={1} className="!mb-0 capitalize">
                  {project.product_type?.replace(/_/g, ' ')} Project
                </Heading>
                <Badge className={STATUS_COLORS[project.status] || '!bg-gray-100 !text-gray-600'}>
                  {statusLabel(project.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{project.first_name} {project.last_name} &middot; {project.email}</span>
                <span>{formatDate(project.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.lead_id && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/leads/${project.lead_id}`}>
                    <User className="w-4 h-4 mr-1" /> View Lead
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopyShareLink}>
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : 'Share Link'}
              </Button>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 1, desktop: 3 }} gap="md">
            {/* Left: main content (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo / Video Gallery */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#406517]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">
                      Photos & Videos ({photos.length})
                    </Text>
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#003365] text-white rounded-full hover:bg-[#002244] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/quicktime,video/webm,.pdf"
                      onChange={handleUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                {photos.length === 0 ? (
                  <div className="py-12 text-center">
                    <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <Text size="sm" className="text-gray-400 !mb-0">No photos or videos uploaded yet.</Text>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos.map((photo) => {
                      const isVid = isVideo(photo.content_type, photo.filename)
                      return (
                        <button
                          key={photo.id}
                          onClick={() => setLightboxUrl(photo.storage_path)}
                          className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-[#003365] transition-colors"
                        >
                          {isVid ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900/10">
                              <Play className="w-8 h-8 text-white drop-shadow-lg" />
                              <video src={photo.storage_path} className="absolute inset-0 w-full h-full object-cover" muted />
                            </div>
                          ) : photo.content_type === 'application/pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                              <span className="text-xs text-gray-500 mt-1 truncate px-2">{photo.filename}</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photo.storage_path}
                              alt={photo.filename}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white truncate block">{photo.filename}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </Card>

              {/* Notes */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-3">Notes</Text>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365] resize-none"
                  placeholder="Project notes..."
                />
                <div className="flex justify-end mt-2">
                  <Button variant="primary" size="sm" onClick={handleSaveNotes} disabled={savingNotes}>
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </Button>
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
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                  <Button variant="primary" size="sm" onClick={handleStatusUpdate} disabled={savingStatus || selectedStatus === project.status}>
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
                  value={project.assigned_to || ''}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365]"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Card>

              {/* Cart / Quote */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-[#003365]" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Quote / Cart</Text>
                </div>
                {cart ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900 font-medium">{formatMoney(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="text-gray-900 font-bold">{formatMoney(cart.total)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`${salesRoute}?cart=${cart.id}`}>
                        <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Edit Cart
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {project.estimated_total && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Estimated</span>
                        <span className="text-gray-900 font-medium">{formatMoney(project.estimated_total)}</span>
                      </div>
                    )}
                    <Button variant="primary" size="sm" className="w-full" asChild>
                      <Link href={`${salesRoute}?project=${project.id}`}>
                        <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Start Quote
                      </Link>
                    </Button>
                  </div>
                )}
              </Card>

              {/* Order */}
              {order && (
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-[#406517]" />
                    <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Order</Text>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order #</span>
                      <span className="text-gray-900 font-medium">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="text-gray-900 capitalize">{order.status.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="text-gray-900 font-bold">{formatMoney(order.total)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Package className="w-3.5 h-3.5 mr-1" /> View Order
                      </Link>
                    </Button>
                  </div>
                </Card>
              )}

              {/* Project Config */}
              <Card variant="elevated" className="!p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="w-4 h-4 text-gray-400" />
                  <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-0">Project Config</Text>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div><span className="text-gray-500">Product: </span><span className="text-gray-900 capitalize">{project.product_type?.replace(/_/g, ' ')}</span></div>
                  {project.project_type && <div><span className="text-gray-500">Type: </span><span className="text-gray-900 capitalize">{project.project_type}</span></div>}
                  {project.mesh_type && <div><span className="text-gray-500">Mesh: </span><span className="text-gray-900 capitalize">{project.mesh_type.replace(/_/g, ' ')}</span></div>}
                  {project.top_attachment && <div><span className="text-gray-500">Top Attach: </span><span className="text-gray-900 capitalize">{project.top_attachment}</span></div>}
                  {project.total_width && <div><span className="text-gray-500">Width: </span><span className="text-gray-900">{project.total_width}&quot;</span></div>}
                  {project.number_of_sides && <div><span className="text-gray-500">Sides: </span><span className="text-gray-900">{project.number_of_sides}</span></div>}
                </div>
              </Card>

              {/* Share Link */}
              <Card variant="elevated" className="!p-4">
                <Text size="sm" className="font-semibold text-gray-500 uppercase tracking-wider !mb-2">Share Link</Text>
                <a
                  href={`/project/${project.share_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#003365] hover:underline flex items-center gap-1"
                >
                  /project/{project.share_token.slice(0, 12)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Card>
            </div>
          </Grid>
        </section>
      </Stack>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {isVideo(null, lightboxUrl) ? (
              <video
                src={lightboxUrl}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-lg"
              />
            ) : lightboxUrl.endsWith('.pdf') ? (
              <iframe src={lightboxUrl} className="w-full h-[85vh] rounded-lg bg-white" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lightboxUrl}
                alt="Full size"
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
            <div className="text-center mt-3">
              <Button variant="ghost" size="sm" onClick={() => setLightboxUrl(null)} className="!text-white hover:!bg-white/10">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}
