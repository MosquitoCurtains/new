'use client'

/**
 * OrderSidebarCart — Customer-facing slide-in cart drawer.
 *
 * - Slide-in from the right with backdrop on mobile
 * - Auto-opens on addItem via CartContext
 * - Auto-closes after 5 seconds of no interaction
 * - "View Cart" & "Proceed to Checkout" CTA buttons
 * - Quantity +/- steppers inline
 * - Groups items by type (panel, track, hardware, addon, fabric)
 */

import { useMemo } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
} from 'lucide-react'
import { useCartContext } from '@/contexts/CartContext'
import type { CartLineItem } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

// =============================================================================
// GROUP LABELS
// =============================================================================

const GROUP_LABELS: Record<string, string> = {
  panel: 'Panels',
  track: 'Track Hardware',
  hardware: 'Hardware & Attachments',
  addon: 'Add-ons & Adjustments',
  fabric: 'Raw Materials',
}

const GROUP_ICONS: Record<string, string> = {
  panel: 'bg-[#406517]/10 text-[#406517]',
  track: 'bg-[#003365]/10 text-[#003365]',
  hardware: 'bg-amber-100 text-amber-700',
  addon: 'bg-purple-100 text-purple-700',
  fabric: 'bg-[#B30158]/10 text-[#B30158]',
}

// =============================================================================
// COMPONENT
// =============================================================================

function formatMoney(value: number) {
  return value.toFixed(2)
}

function CartLineItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartLineItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  const isCustom = item.type === 'panel' || item.type === 'fabric'

  return (
    <div className="group flex items-start gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-tight">
          {item.name}
        </p>
        {item.description && (
          <p className="text-xs text-gray-500 leading-tight mt-0.5 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity stepper */}
          {isCustom ? (
            <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-medium text-gray-700">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900">
            ${formatMoney(item.totalPrice)}
          </span>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all mt-0.5"
        title="Remove"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function OrderSidebarCart() {
  const {
    cart,
    itemCount,
    sidebarOpen,
    closeSidebar,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartContext()

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0

  const groupedItems = useMemo(() => {
    const groups: Record<string, CartLineItem[]> = {
      panel: [],
      track: [],
      hardware: [],
      addon: [],
      fabric: [],
    }
    items.forEach((item) => {
      const key = item.type in groups ? item.type : 'addon'
      groups[key].push(item)
    })
    return groups
  }, [items])

  return (
    <>
      {/* Backdrop (mobile & tablet) */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#003365]" />
            <span className="text-base font-bold text-[#003365]">
              Your Cart{itemCount > 0 && ` (${itemCount})`}
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Your cart is empty</p>
              <p className="text-gray-400 text-xs text-center">
                Add items from our product pages to get started.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedItems).map(([type, groupItems]) => {
                if (groupItems.length === 0) return null
                return (
                  <div key={type} className="mb-2">
                    <div className="px-5 py-1.5">
                      <span className={cn(
                        'text-[10px] font-semibold uppercase tracking-widest',
                        GROUP_ICONS[type]?.split(' ')[1] || 'text-gray-400'
                      )}>
                        {GROUP_LABELS[type] || type}
                      </span>
                    </div>
                    <div className="px-2">
                      {groupItems.map((item) => (
                        <CartLineItemRow
                          key={item.id}
                          item={item}
                          onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                ${formatMoney(subtotal)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#003365] text-white text-sm font-semibold rounded-full hover:bg-[#002244] transition-colors"
              >
                View Full Cart
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  clearCart()
                  closeSidebar()
                }}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
