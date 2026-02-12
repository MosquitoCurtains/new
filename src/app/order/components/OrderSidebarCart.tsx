'use client'

/**
 * OrderSidebarCart — Customer-facing cart. Styled like /admin/sales CartSidebar.
 *
 * - Desktop (md+): Fixed right sidebar, collapsible (w-12 / w-72). Compact list, Checkout at bottom.
 * - Mobile: Slide-over drawer when open; floating cart button when closed.
 * - Auto-opens on add, stays open until user closes.
 */

import { useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  X,
  Trash2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { useCartContext } from '@/contexts/CartContext'
import type { CartLineItem } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const GROUP_LABELS: Record<string, string> = {
  panel: 'Panels',
  track: 'Track Hardware',
  hardware: 'Hardware & Attachments',
  addon: 'Add-ons & Adjustments',
  fabric: 'Raw Materials',
}

function formatMoney(value: number) {
  return value.toFixed(2)
}

export default function OrderSidebarCart() {
  const {
    cart,
    itemCount,
    sidebarOpen,
    openSidebar,
    closeSidebar,
    removeItem,
    clearCart,
    sidebarCollapsed,
    setSidebarCollapsed,
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

  // When sidebar opens (e.g. after add), expand on desktop
  useEffect(() => {
    if (sidebarOpen) setSidebarCollapsed(false)
  }, [sidebarOpen, setSidebarCollapsed])

  const groupedContent = (
    <>
      {items.length === 0 ? (
        <div className="py-12 text-center px-3">
          <ShoppingCart className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Cart is empty</p>
        </div>
      ) : (
        <div className="p-2.5 space-y-2.5">
          {Object.entries(groupedItems).map(([type, groupItems]) => {
            if (groupItems.length === 0) return null
            return (
              <div key={type}>
                <p className="px-1 mb-1 text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                  {GROUP_LABELS[type] || type}
                </p>
                <div className="space-y-px">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start gap-1 py-1 px-1.5 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-800 truncate leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate leading-tight">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-gray-400">x{item.quantity}</span>
                          )}
                          <span className="text-[11px] font-semibold text-gray-700">
                            ${formatMoney(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-red-500 transition-all mt-0.5"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )

  const footerContent =
    items.length > 0 ? (
      <div className="border-t border-gray-100 px-2.5 py-2 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Subtotal</span>
          <span className="text-sm font-bold text-gray-900">${formatMoney(subtotal)}</span>
        </div>
        <Link
          href="/cart"
          onClick={() => {
            closeSidebar()
            setSidebarCollapsed(false)
          }}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] font-semibold bg-[#003365] text-white rounded-md hover:bg-[#002244] transition-colors"
        >
          Checkout
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => {
            clearCart()
            closeSidebar()
          }}
          className="flex items-center justify-center gap-1 w-full py-1 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-2.5 h-2.5" />
          Clear
        </button>
      </div>
    ) : null

  return (
    <>
      {/* Mobile: floating cart button when drawer is closed */}
      <button
        onClick={openSidebar}
        className={cn(
          'fixed bottom-6 right-6 z-30 md:hidden w-12 h-12 rounded-full bg-[#003365] text-white shadow-lg flex items-center justify-center hover:bg-[#002244] transition-colors',
          sidebarOpen && 'hidden'
        )}
        aria-label="Open cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#406517] text-white text-[10px] font-bold flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* Mobile: backdrop + drawer when open */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-12 px-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#003365]" />
            <span className="text-sm font-bold text-[#003365]">
              Cart{itemCount > 0 && ` (${itemCount})`}
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{groupedContent}</div>
        {footerContent}
      </aside>

      {/* Desktop: fixed right sidebar below header (admin-style, collapsible) */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed top-16 right-0 bottom-0 z-20 bg-white border-l border-gray-200 transition-[width] duration-300 ease-in-out',
          sidebarCollapsed ? 'w-12' : 'w-72'
        )}
      >
        <div className="flex items-center justify-between h-12 px-2.5 border-b border-gray-100 shrink-0">
          {sidebarCollapsed ? (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="mx-auto p-1.5 rounded-md hover:bg-gray-100 transition-colors relative"
              title="Expand cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#003365] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Collapse cart"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-[#003365]" />
                <span className="text-xs font-bold text-[#003365]">
                  Cart{itemCount > 0 && ` (${itemCount})`}
                </span>
              </div>
            </>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="flex-1 overflow-y-auto">{groupedContent}</div>
            {footerContent}
          </>
        )}
      </aside>
    </>
  )
}
