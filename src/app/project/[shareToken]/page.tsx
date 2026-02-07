'use client'

/**
 * Customer-Facing Share Page: /project/[shareToken]
 *
 * Displays the pre-built cart from a sales project.
 * Lead can review items + pricing, then proceed to checkout.
 * Cart is read-only — only the salesperson can edit it.
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, ArrowRight, Loader2, Phone, Mail, Package } from 'lucide-react'
import type { CartLineItem } from '@/hooks/useCart'

interface SharedProject {
  id: string
  share_token: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  cart_data: CartLineItem[]
  estimated_total: number | null
  status: string
  assigned_to: string | null
}

function fmt(v: number) {
  return v.toFixed(2)
}

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const shareToken = params.shareToken as string

  const [project, setProject] = useState<SharedProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!shareToken) return
    ;(async () => {
      try {
        const res = await fetch(`/api/projects?token=${shareToken}`)
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

  const cartItems: CartLineItem[] = project?.cart_data || []
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  const handleCheckout = () => {
    if (!project || cartItems.length === 0) return
    setCheckingOut(true)

    // Load cart into localStorage (same format the cart page expects)
    const cartData = {
      id: `cart-${Date.now()}`,
      items: cartItems,
      subtotal,
      shipping: 0,
      tax: 0,
      total: subtotal,
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
          <Loader2 className="w-8 h-8 animate-spin text-[#406517] mx-auto mb-3" />
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
              <h1 className="text-lg font-bold text-gray-900">Your Quote from Mosquito Curtains</h1>
              <p className="text-sm text-gray-500">
                Prepared for {project.first_name} {project.last_name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Quote info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">
            We have put together the following quote based on your project specifications.
            Review the items below, then click &ldquo;Proceed to Checkout&rdquo; when you are ready to purchase.
          </p>
        </div>

        {/* Line items */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Items ({cartItems.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {cartItems.map((item, i) => (
              <div key={item.id || i} className="px-5 py-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity} x ${fmt(item.unitPrice)}
                    </p>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  ${fmt(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">${fmt(subtotal)}</span>
          </div>
        </div>

        {/* Note about shipping/tax */}
        <p className="text-xs text-gray-400 text-center">
          Shipping and tax will be calculated at checkout based on your delivery address.
        </p>

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || checkingOut}
          className="w-full bg-[#406517] text-white rounded-xl py-4 text-base font-bold hover:bg-[#4e7a1d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {checkingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Proceed to Checkout <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

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
