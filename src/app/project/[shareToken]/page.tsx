'use client'

/**
 * Customer-Facing Share Page: /project/[shareToken]
 *
 * Displays the pre-built cart from a sales project with real DB line items.
 * Customer can review items + pricing, then proceed to PayPal checkout.
 * Cart is read-only — only the salesperson can edit it.
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowRight, Loader2, Phone, Mail, Package, User, Clock, Camera, Play } from 'lucide-react'
import { Spinner, ImageLightbox } from '@/lib/design-system'

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
  status: string
  assigned_to: string | null
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

const PROJECT_STATUS_MESSAGES: Record<string, string> = {
  draft: 'Your project has been submitted. A planner will be in touch soon.',
  new: 'Your project has been submitted. A planner will be in touch soon.',
  need_photos: 'We need photos of your space to prepare a quote. Please check your email for instructions.',
  need_measurements: 'We need measurements for your space to finalize your quote.',
  working_on_quote: 'Your planner is working on your quote. We\'ll send it to you shortly.',
  quote_sent: 'Your quote is ready! Review the items below and proceed to checkout when ready.',
  quote_viewed: 'Your quote is ready! Review the items below and proceed to checkout when ready.',
  need_decision: 'Your quote is ready! Review the items below and proceed to checkout when ready.',
  order_placed: 'Your order has been placed! You can track it from your My Projects page.',
  closed: 'This project has been closed.',
  archived: 'This project has been archived.',
}

function fmt(v: number) {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

  // Photos/videos for lightbox gallery
  const projectPhotos = project?.photos || []
  const imagePhotos = projectPhotos.filter(p => p.content_type.startsWith('image/'))
  const videoPhotos = projectPhotos.filter(p => p.content_type.startsWith('video/'))
  const lightboxImages = imagePhotos.map(p => ({
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

  const handleCheckout = async () => {
    if (!project || !hasCart || !project.cart) return
    setCheckingOut(true)

    // Load cart data into localStorage for the checkout page
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your quote...</p>
        </div>
      </div>
    )
  }

  // ─── Error ───────────────────────────────────────────────────────────

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-sm text-gray-500">{error || 'This link may have expired or is invalid.'}</p>
        </div>
      </div>
    )
  }

  // ─── Main ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#406517] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">MC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {project.project_name || 'Your Project'} &mdash; Mosquito Curtains
              </h1>
              <p className="text-sm text-gray-500">
                Prepared for {project.first_name} {project.last_name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Planner info */}
        {project.salesperson && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#003365]/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-[#003365]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Your planner: {project.salesperson.name}</p>
              <a href={`mailto:${project.salesperson.email}`} className="text-xs text-[#406517] hover:underline">
                {project.salesperson.email}
              </a>
            </div>
          </div>
        )}

        {/* Project Photos & Videos Gallery */}
        {projectPhotos.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Project Photos & Videos ({projectPhotos.length})
              </h2>
            </div>
            <div className="p-4">
              {/* Image thumbnails */}
              {imagePhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePhotos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => { setLightboxIndex(idx); setLightboxOpen(true) }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 hover:border-[#406517] hover:shadow-md transition-all cursor-pointer group"
                    >
                      <Image
                        src={photo.storage_path}
                        alt={photo.filename}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Video items */}
              {videoPhotos.length > 0 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${imagePhotos.length > 0 ? 'mt-3' : ''}`}>
                  {videoPhotos.map((video) => (
                    <div key={video.id} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
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
            </div>
          </div>
        )}

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

        {/* No cart yet -- show status message */}
        {!hasCart && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Clock className="w-10 h-10 text-[#406517]/40 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Quote in Progress</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {PROJECT_STATUS_MESSAGES[project.status] || 'Your quote is being prepared. Please check back soon.'}
            </p>
          </div>
        )}

        {/* Line items from DB cart */}
        {hasCart && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-600">
                We have put together the following quote based on your project specifications.
                Review the items below, then click &ldquo;Proceed to Checkout&rdquo; when you are ready to purchase.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Items ({lineItems.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {lineItems.map((item) => (
                  <div key={item.id} className="px-5 py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                      {item.line_item_options?.map((opt) => (
                        <p key={opt.id} className="text-xs text-gray-500 mt-0.5">
                          {opt.option_name}: {opt.option_display || opt.option_value}
                        </p>
                      ))}
                      {item.width_inches && item.height_inches && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.width_inches}&quot;W x {item.height_inches}&quot;H
                        </p>
                      )}
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity} x ${fmt(Number(item.unit_price))}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      ${fmt(Number(item.line_total))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 space-y-1">
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
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${fmt(Number(cartTotal))}</span>
                </div>
              </div>
            </div>

            {Number(cartShipping) === 0 && Number(cartTax) === 0 && (
              <p className="text-xs text-gray-400 text-center">
                Shipping and tax will be calculated at checkout based on your delivery address.
              </p>
            )}

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-[#406517] text-white rounded-xl py-4 text-base font-bold hover:bg-[#4e7a1d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Proceed to Checkout <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </>
        )}

        {/* Contact */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Questions about your quote?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="tel:+18883649870" className="flex items-center gap-1 text-[#406517] hover:underline">
              <Phone className="w-3.5 h-3.5" /> (888) 364-9870
            </a>
            <a href="mailto:info@mosquitocurtains.com" className="flex items-center gap-1 text-[#406517] hover:underline">
              <Mail className="w-3.5 h-3.5" /> Email us
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
