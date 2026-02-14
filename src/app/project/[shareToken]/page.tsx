'use client'

/**
 * Project Detail Page: /project/[shareToken]
 *
 * Full project detail view — shows ALL project info, photos, cart/quote,
 * project configuration, timeline, and contact.
 * Uses the MC design system: Container, Stack, Card, HeaderBarSection, etc.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  Package,
  User,
  Clock,
  Camera,
  Play,
  FolderOpen,
  Calendar,
  Hash,
  Ruler,
  Layers,
  Grid3X3,
  ChevronUp,
  StickyNote,
  Info,
  CheckCircle,
  AlertCircle,
  CircleDot,
  Timer,
  Upload,
  ClipboardList,
  Hammer,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
  Button,
  Spinner,
  ImageLightbox,
  HeaderBarSection,
} from '@/lib/design-system'
import { PhotoUploader, UploadedPhoto } from '@/components/project/PhotoUploader'

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
  unit_price: number
  line_total: number
  panel_specs: Record<string, unknown> | null
  line_item_options: LineItemOption[]
}

interface ProjectPhoto {
  id: string
  storage_path: string
  filename: string
  content_type: string
  category?: 'planning' | 'installed'
}

interface SharedProject {
  id: string
  share_token: string
  email: string
  project_name: string | null
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
  lead_id: string | null
  customer_id: string | null
  created_at: string
  updated_at: string
  cart_data: unknown[]
  salesperson?: {
    name: string
    email: string
  } | null
  photos?: ProjectPhoto[]
  cart?: {
    id: string
    subtotal: number
    shipping_amount: number
    tax_amount: number
    total: number
    status: string
  } | null
  lineItems?: LineItem[]
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle; message: string }> = {
  draft: {
    label: 'Submitted',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: CircleDot,
    message: 'Your project has been submitted. A planner will be in touch soon.',
  },
  new: {
    label: 'Received',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: CircleDot,
    message: 'Your project has been received. A planner will be reviewing it shortly.',
  },
  need_photos: {
    label: 'Photos Needed',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Camera,
    message: 'We need photos of your space to prepare an accurate quote. Please check your email for instructions.',
  },
  need_measurements: {
    label: 'Measurements Needed',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Ruler,
    message: 'We need measurements for your space to finalize your quote. Please check your email for details.',
  },
  working_on_quote: {
    label: 'Preparing Quote',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: Timer,
    message: 'Your planner is preparing your custom quote. We\'ll have it ready for you shortly.',
  },
  quote_sent: {
    label: 'Quote Ready',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: CheckCircle,
    message: 'Your quote is ready! Review the items below and proceed to checkout when you\'re ready.',
  },
  quote_viewed: {
    label: 'Quote Ready',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: CheckCircle,
    message: 'Your quote is ready! Review the items below and proceed to checkout when you\'re ready.',
  },
  need_decision: {
    label: 'Quote Ready',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertCircle,
    message: 'Your quote is ready! Let us know if you have any questions.',
  },
  order_placed: {
    label: 'Order Placed',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    message: 'Your order has been placed! We\'re getting started on production.',
  },
  closed: {
    label: 'Closed',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: CircleDot,
    message: 'This project has been closed.',
  },
  archived: {
    label: 'Archived',
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: CircleDot,
    message: 'This project has been archived.',
  },
}

const PRODUCT_LABELS: Record<string, string> = {
  mosquito_curtains: 'Mosquito Curtains',
  curtains: 'Mosquito Curtains',
  clear_vinyl: 'Clear Vinyl Panels',
  raw_netting: 'Raw Netting',
  raw_materials: 'Raw Materials',
  rollup_shades: 'Roll-Up Shades',
}

function fmt(v: number) {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function capitalize(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function guessContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', heic: 'image/heic', pdf: 'application/pdf',
    mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  }
  return map[ext || ''] || 'image/jpeg'
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const shareToken = params.shareToken as string

  const [project, setProject] = useState<SharedProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [extraPhotos, setExtraPhotos] = useState<ProjectPhoto[]>([])
  const savedKeysRef = useRef<Set<string>>(new Set())
  const savingRef = useRef(false)

  // Generic save handler for both categories
  const savePhotos = useCallback(async (photos: UploadedPhoto[], category: 'planning' | 'installed') => {
    if (!shareToken || savingRef.current) return

    const newPhotos = photos.filter(
      (p) => p.status === 'complete' && p.publicUrl && !savedKeysRef.current.has(p.key)
    )
    if (newPhotos.length === 0) return

    savingRef.current = true
    newPhotos.forEach((p) => savedKeysRef.current.add(p.key))

    try {
      const res = await fetch('/api/projects/share/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: shareToken,
          category,
          photos: newPhotos.map((p) => ({
            url: p.publicUrl,
            fileName: p.fileName,
            contentType: guessContentType(p.fileName),
          })),
        }),
      })
      const data = await res.json()
      if (data.photos) {
        setExtraPhotos((prev) => [...prev, ...data.photos])
      }
    } catch (err) {
      console.error('Failed to save photos:', err)
      newPhotos.forEach((p) => savedKeysRef.current.delete(p.key))
    } finally {
      savingRef.current = false
    }
  }, [shareToken])

  const handlePlanningUploadComplete = useCallback(
    (photos: UploadedPhoto[]) => savePhotos(photos, 'planning'),
    [savePhotos]
  )

  const handleInstalledUploadComplete = useCallback(
    (photos: UploadedPhoto[]) => savePhotos(photos, 'installed'),
    [savePhotos]
  )

  useEffect(() => {
    if (!shareToken) return
    ;(async () => {
      try {
        const res = await fetch(`/api/projects/share?token=${shareToken}`)
        if (!res.ok) {
          setError('Project not found or link has expired.')
          setLoading(false)
          return
        }
        const data = await res.json()
        setProject(data.project)
      } catch {
        setError('Failed to load project. Please try again.')
      }
      setLoading(false)
    })()
  }, [shareToken])

  // Photos/videos for lightbox gallery (combine server + newly uploaded)
  const allPhotos = [...(project?.photos || []), ...extraPhotos]
  const planningPhotos = allPhotos.filter(p => !p.category || p.category === 'planning')
  const installedPhotos = allPhotos.filter(p => p.category === 'installed')

  const planningImages = planningPhotos.filter(p => p.content_type?.startsWith('image/'))
  const planningVideos = planningPhotos.filter(p => p.content_type?.startsWith('video/'))
  const installedImages = installedPhotos.filter(p => p.content_type?.startsWith('image/'))
  const installedVideos = installedPhotos.filter(p => p.content_type?.startsWith('video/'))

  // Combined images for lightbox (planning first, then installed)
  const allImages = [...planningImages, ...installedImages]
  const lightboxImages = allImages.map(p => ({
    url: p.storage_path,
    alt: p.filename,
    caption: p.filename,
  }))

  const hasCart = project?.cart && project.cart.status === 'active' && project.lineItems && project.lineItems.length > 0
  const lineItems = project?.lineItems || []
  const cartSubtotal = project?.cart?.subtotal || 0
  const cartShipping = project?.cart?.shipping_amount || 0
  const cartTax = project?.cart?.tax_amount || 0
  const cartTotal = project?.cart?.total || 0

  const statusConfig = project ? STATUS_CONFIG[project.status] || STATUS_CONFIG.draft : STATUS_CONFIG.draft
  const StatusIcon = statusConfig.icon

  // Parse notes
  let notesText = ''
  if (project?.notes) {
    try {
      const parsed = JSON.parse(project.notes)
      notesText = parsed.projectNote || project.notes
    } catch {
      notesText = project.notes
    }
  }

  // Build project config items
  const configItems: { label: string; value: string; icon: typeof Layers }[] = []
  if (project) {
    if (project.product_type) configItems.push({ label: 'Product', value: PRODUCT_LABELS[project.product_type] || capitalize(project.product_type), icon: Package })
    if (project.project_type) configItems.push({ label: 'Project Type', value: capitalize(project.project_type), icon: FolderOpen })
    if (project.mesh_type) configItems.push({ label: 'Mesh Type', value: capitalize(project.mesh_type), icon: Grid3X3 })
    if (project.top_attachment) configItems.push({ label: 'Top Attachment', value: capitalize(project.top_attachment), icon: ChevronUp })
    if (project.total_width) configItems.push({ label: 'Total Width', value: `${project.total_width}"`, icon: Ruler })
    if (project.number_of_sides) configItems.push({ label: 'Number of Sides', value: `${project.number_of_sides}`, icon: Layers })
  }

  const handleCheckout = async () => {
    if (!project || !hasCart || !project.cart) return
    setCheckingOut(true)

    const cartData = {
      id: project.cart.id,
      items: lineItems.map((item) => ({
        id: item.id,
        type: 'panel' as const,
        productSku: item.product_sku,
        name: item.product_name,
        description: item.line_item_options?.map((o) => `${o.option_name}: ${o.option_display || o.option_value}`).join(', ') || '',
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.line_total),
      })),
      subtotal: Number(cartSubtotal),
      shipping: Number(cartShipping),
      tax: Number(cartTax),
      total: Number(cartTotal),
      contact: {
        firstName: project.first_name || '',
        lastName: project.last_name || '',
        email: project.email || '',
        phone: project.phone || '',
      },
      sessionId: `share-${shareToken}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    localStorage.setItem('mc_cart', JSON.stringify(cartData))
    router.push('/cart')
  }

  // ─── Loading ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-3" />
          <Text className="text-gray-500 !mb-0">Loading your project...</Text>
        </div>
      </Container>
    )
  }

  // ─── Error ───────────────────────────────────────────────────────────

  if (error || !project) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Card className="text-center p-6 md:p-10 lg:p-12 max-w-md mx-auto">
          <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <Heading level={2} className="!text-xl md:!text-2xl !mb-2">Project Not Found</Heading>
          <Text className="text-gray-500 !mb-0">{error || 'This link may have expired or is invalid.'}</Text>
        </Card>
      </Container>
    )
  }

  // ─── Main ────────────────────────────────────────────────────────────

  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ═══════════ HERO HEADER ═══════════ */}
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/8 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Left: Project info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className={`!${statusConfig.bg} !${statusConfig.color} !${statusConfig.border}`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    {statusConfig.label}
                  </Badge>
                  <Text size="xs" className="text-gray-400 !mb-0">
                    ID: {project.id.slice(0, 8)}
                  </Text>
                </div>

                <Heading level={1} className="!text-2xl md:!text-3xl lg:!text-4xl !mb-2">
                  {project.project_name || `${PRODUCT_LABELS[project.product_type] || capitalize(project.product_type)} Project`}
                </Heading>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {(project.first_name || project.last_name) && (
                    <Text size="sm" className="text-gray-600 !mb-0 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#003365]" />
                      {project.first_name} {project.last_name}
                    </Text>
                  )}
                  <Text size="sm" className="text-gray-500 !mb-0 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {project.email}
                  </Text>
                  {project.phone && (
                    <Text size="sm" className="text-gray-500 !mb-0 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {project.phone}
                    </Text>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Created {formatDate(project.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Updated {formatDateTime(project.updated_at)}
                  </span>
                </div>
              </div>

              {/* Right: Planner card + quick actions */}
              <div className="lg:w-80 shrink-0 space-y-4">
                {project.salesperson && (
                  <Card variant="elevated" className="!p-4 md:!p-5 !rounded-2xl">
                    <Text size="xs" className="font-semibold text-gray-400 uppercase tracking-wider !mb-3">Your Planner</Text>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#003365]/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-[#003365]" />
                      </div>
                      <div>
                        <Text size="sm" className="font-semibold text-gray-900 !mb-0">{project.salesperson.name}</Text>
                        <a href={`mailto:${project.salesperson.email}`} className="text-xs text-[#406517] hover:underline">
                          {project.salesperson.email}
                        </a>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Estimated total badge */}
                {!hasCart && project.estimated_total && (
                  <Card variant="elevated" className="!p-4 md:!p-5 !rounded-2xl !bg-[#406517]/5 !border-[#406517]/20">
                    <Text size="xs" className="font-semibold text-[#406517] uppercase tracking-wider !mb-1">Estimated Total</Text>
                    <Text className="!text-3xl font-bold text-[#406517] !mb-0">${fmt(Number(project.estimated_total))}</Text>
                    <Text size="xs" className="text-gray-400 !mb-0 mt-1">Final quote may vary based on specifications.</Text>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATUS BANNER ═══════════ */}
        <section className={`rounded-2xl border-2 p-4 md:p-6 ${statusConfig.bg} ${statusConfig.border}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusConfig.bg}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            </div>
            <div>
              <Text size="sm" className={`font-bold !mb-0.5 ${statusConfig.color}`}>{statusConfig.label}</Text>
              <Text size="sm" className="text-gray-600 !mb-0">{statusConfig.message}</Text>
            </div>
          </div>
        </section>

        {/* ═══════════ QUOTE / CART ═══════════ */}
        {hasCart && (
          <HeaderBarSection icon={ShoppingCart} label={`Your Quote (${lineItems.length} ${lineItems.length === 1 ? 'item' : 'items'})`} variant="dark">
            <div className="divide-y divide-gray-100 -mx-6 md:-mx-8 lg:-mx-10">
              {lineItems.map((item, idx) => (
                <div key={item.id} className="px-6 md:px-8 lg:px-10 py-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#406517]/10 flex items-center justify-center shrink-0 text-sm font-bold text-[#406517]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text size="sm" className="font-bold text-gray-900 !mb-0">{item.product_name}</Text>
                    {item.line_item_options?.map((opt) => (
                      <Text key={opt.id} size="xs" className="text-gray-500 !mb-0 mt-0.5">
                        {opt.option_name}: {opt.option_display || opt.option_value}
                        {Number(opt.price_impact) !== 0 && (
                          <span className="text-gray-400 ml-1">
                            ({Number(opt.price_impact) > 0 ? '+' : ''}${fmt(Number(opt.price_impact))})
                          </span>
                        )}
                      </Text>
                    ))}
                    {item.width_inches && item.height_inches && (
                      <Text size="xs" className="text-gray-400 !mb-0 mt-1 flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        {item.width_inches}&quot;W x {item.height_inches}&quot;H
                      </Text>
                    )}
                    {item.quantity > 1 && (
                      <Text size="xs" className="text-gray-400 !mb-0 mt-0.5">
                        Qty: {item.quantity} x ${fmt(Number(item.unit_price))}
                      </Text>
                    )}
                  </div>
                  <Text className="font-bold text-gray-900 whitespace-nowrap !mb-0">
                    ${fmt(Number(item.line_total))}
                  </Text>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="-mx-6 md:-mx-8 lg:-mx-10 px-6 md:px-8 lg:px-10 py-5 border-t-2 border-gray-100 bg-gray-50/50 rounded-b-3xl space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${fmt(Number(cartSubtotal))}</span>
              </div>
              {Number(cartShipping) > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${fmt(Number(cartShipping))}</span>
                </div>
              )}
              {Number(cartTax) > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${fmt(Number(cartTax))}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-lg md:text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl md:text-3xl font-bold text-[#406517]">${fmt(Number(cartTotal))}</span>
              </div>
              {Number(cartShipping) === 0 && Number(cartTax) === 0 && (
                <Text size="xs" className="text-gray-400 !mb-0 pt-1">
                  Shipping and tax will be calculated at checkout based on your delivery address.
                </Text>
              )}
            </div>

            {/* Checkout button */}
            <div className="flex justify-center pt-6">
              <Button variant="primary" size="lg" onClick={handleCheckout} disabled={checkingOut}>
                {checkingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {checkingOut ? 'Loading...' : 'Proceed to Checkout'}
                {!checkingOut && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>
          </HeaderBarSection>
        )}

        {/* ═══════════ TWO COLUMN: CONFIG + DETAILS ═══════════ */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="md">
            {/* Project Configuration */}
            {configItems.length > 0 && (
              <Card variant="elevated" className="!p-5 md:!p-6 !rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-5 h-5 text-[#406517]" />
                  <Text size="sm" className="font-bold text-gray-500 uppercase tracking-wider !mb-0">Project Configuration</Text>
                </div>
                <div className="space-y-3">
                  {configItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#003365]" /> {item.label}
                        </span>
                        <span className="text-sm text-gray-900 font-semibold">{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Project Details */}
            <Card variant="elevated" className="!p-5 md:!p-6 !rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-[#003365]" />
                <Text size="sm" className="font-bold text-gray-500 uppercase tracking-wider !mb-0">Project Details</Text>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#003365]" /> Project ID
                  </span>
                  <span className="text-sm text-gray-700 font-mono">{project.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#003365]" /> Created
                  </span>
                  <span className="text-sm text-gray-700">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#003365]" /> Last Updated
                  </span>
                  <span className="text-sm text-gray-700">{formatDateTime(project.updated_at)}</span>
                </div>
                {project.email && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#003365]" /> Email
                    </span>
                    <span className="text-sm text-gray-700 truncate ml-4">{project.email}</span>
                  </div>
                )}
                {project.phone && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#003365]" /> Phone
                    </span>
                    <a href={`tel:${project.phone}`} className="text-sm text-[#406517] font-medium hover:underline">{project.phone}</a>
                  </div>
                )}
              </div>
            </Card>
          </Grid>
        </section>

        {/* ═══════════ PLANNING PHOTOS ═══════════ */}
        <HeaderBarSection icon={ClipboardList} label={`Planning Photos${planningPhotos.length > 0 ? ` (${planningPhotos.length})` : ''}`} variant="dark">
          <div className="mb-4">
            <Text size="sm" className="text-gray-600 !mb-0">
              We use these photos to plan your project. Upload images of your space so our team can prepare an accurate quote.
            </Text>
          </div>

          {/* Planning image thumbnails */}
          {planningImages.length > 0 && (
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {planningImages.map((photo) => {
                const lbIdx = allImages.findIndex(p => p.id === photo.id)
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => { setLightboxIndex(lbIdx); setLightboxOpen(true) }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#406517] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <Image
                      src={photo.storage_path}
                      alt={photo.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white truncate block">{photo.filename}</span>
                    </div>
                  </button>
                )
              })}
            </Grid>
          )}

          {/* Planning video items */}
          {planningVideos.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${planningImages.length > 0 ? 'mt-6' : ''}`}>
              {planningVideos.map((video) => (
                <div key={video.id} className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-900">
                  <video
                    src={video.storage_path}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Play className="w-3 h-3" /> {video.filename}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Planning upload */}
          <div className={planningPhotos.length > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-[#406517]" />
                <Text size="sm" className="font-semibold text-gray-700 !mb-0">
                  {planningPhotos.length > 0 ? 'Add more planning photos' : 'Upload photos of your space'}
                </Text>
              </div>
              <Text size="xs" className="text-gray-400 !mb-0">
                Photos of the area where your curtains or panels will be installed help us prepare your quote.
              </Text>
            </div>
            <PhotoUploader
              projectId={project.id}
              category="planning"
              maxFiles={10}
              onUploadComplete={handlePlanningUploadComplete}
            />
          </div>
        </HeaderBarSection>

        {/* ═══════════ INSTALLATION PHOTOS ═══════════ */}
        <HeaderBarSection icon={Hammer} label={`Installation Photos${installedPhotos.length > 0 ? ` (${installedPhotos.length})` : ''}`} variant="dark">
          <div className="mb-4">
            <Text size="sm" className="text-gray-600 !mb-0">
              We use these photos to see your completed project. Upload images after your curtains or panels have been installed.
            </Text>
          </div>

          {/* Installed image thumbnails */}
          {installedImages.length > 0 && (
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {installedImages.map((photo) => {
                const lbIdx = allImages.findIndex(p => p.id === photo.id)
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => { setLightboxIndex(lbIdx); setLightboxOpen(true) }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#406517] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <Image
                      src={photo.storage_path}
                      alt={photo.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white truncate block">{photo.filename}</span>
                    </div>
                  </button>
                )
              })}
            </Grid>
          )}

          {/* Installed video items */}
          {installedVideos.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${installedImages.length > 0 ? 'mt-6' : ''}`}>
              {installedVideos.map((video) => (
                <div key={video.id} className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-900">
                  <video
                    src={video.storage_path}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Play className="w-3 h-3" /> {video.filename}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Installed upload */}
          <div className={installedPhotos.length > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-[#406517]" />
                <Text size="sm" className="font-semibold text-gray-700 !mb-0">
                  {installedPhotos.length > 0 ? 'Add more installation photos' : 'Upload installation photos'}
                </Text>
              </div>
              <Text size="xs" className="text-gray-400 !mb-0">
                Share photos of your completed installation so we can see how everything turned out.
              </Text>
            </div>
            <PhotoUploader
              projectId={project.id}
              category="installed"
              maxFiles={10}
              onUploadComplete={handleInstalledUploadComplete}
            />
          </div>
        </HeaderBarSection>

        {/* Lightbox for full-size image viewing */}
        {lightboxOpen && lightboxImages.length > 0 && (
          <ImageLightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
            showCopyButton={false}
          />
        )}

        {/* ═══════════ NOTES ═══════════ */}
        {notesText && (
          <HeaderBarSection icon={StickyNote} label="Project Notes" variant="dark">
            <Text className="text-gray-700 whitespace-pre-wrap !mb-0">{notesText}</Text>
          </HeaderBarSection>
        )}

        {/* ═══════════ TIMELINE ═══════════ */}
        <section>
          <div className="bg-gradient-to-br from-[#003365]/5 via-white to-[#406517]/5 border-[#003365]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#003365]" />
              <Heading level={3} className="!mb-0 !text-lg">Project Timeline</Heading>
            </div>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#406517] via-[#003365] to-gray-200" />

              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-[#406517] border-2 border-white shadow-md" />
                  <div>
                    <Text size="sm" className="font-bold text-gray-900 !mb-0">Project Created</Text>
                    <Text size="xs" className="text-gray-400 !mb-0">{formatDateTime(project.created_at)}</Text>
                  </div>
                </div>

                {project.status !== 'draft' && (
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />
                    <div>
                      <Text size="sm" className="font-bold text-gray-900 !mb-0">Under Review</Text>
                      <Text size="xs" className="text-gray-400 !mb-0">Your project is being reviewed by our team</Text>
                    </div>
                  </div>
                )}

                {['quote_sent', 'quote_viewed', 'need_decision', 'order_placed', 'closed'].includes(project.status) && (
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-md" />
                    <div>
                      <Text size="sm" className="font-bold text-gray-900 !mb-0">Quote Delivered</Text>
                      <Text size="xs" className="text-gray-400 !mb-0">Your custom quote was sent to you</Text>
                    </div>
                  </div>
                )}

                {project.status === 'order_placed' && (
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-md" />
                    <div>
                      <Text size="sm" className="font-bold text-gray-900 !mb-0">Order Placed</Text>
                      <Text size="xs" className="text-gray-400 !mb-0">Your order is now in production</Text>
                    </div>
                  </div>
                )}

                {/* Current status marker */}
                {!['draft', 'order_placed'].includes(project.status) && (
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-md animate-pulse" />
                    <div>
                      <Text size="sm" className="font-semibold text-gray-600 !mb-0">Current: {statusConfig.label}</Text>
                      <Text size="xs" className="text-gray-400 !mb-0">{formatDateTime(project.updated_at)}</Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CONTACT CTA ═══════════ */}
        <section>
          <div className="bg-gradient-to-br from-[#406517] to-[#2d4710] rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="flex flex-col items-center relative z-10 max-w-2xl mx-auto">
              <Heading level={2} className="!text-2xl md:!text-3xl lg:!text-4xl text-white !mb-3">
                Questions About Your Project?
              </Heading>
              <Text className="text-white/80 !mb-6 md:!mb-8 text-base md:text-lg">
                Our team is here to help. Reach out anytime and we&apos;ll get back to you promptly.
              </Text>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="highlight" size="lg" asChild>
                  <a href="tel:+18883649870">
                    <Phone className="mr-2 w-5 h-5" />
                    (888) 364-9870
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10" asChild>
                  <a href="mailto:info@mosquitocurtains.com">
                    <Mail className="mr-2 w-5 h-5" />
                    Email Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </Stack>
    </Container>
  )
}
