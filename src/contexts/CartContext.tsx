'use client'

/**
 * CartContext — Wraps useCart with sidebar open/close state and auto-open behavior.
 *
 * Provides:
 * - All useCart return values
 * - sidebarOpen / setSidebarOpen state
 * - addItem opens sidebar; sidebar stays open until user closes it.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useCart, type CartLineItem, type CartData } from '@/hooks/useCart'
import type { PricingMap } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

interface CartContextValue {
  // Cart state
  cart: CartData | null
  isLoading: boolean
  isCalculatingShipping: boolean
  shippingZoneName: string | null
  taxRateName: string | null
  itemCount: number
  prices: PricingMap | null

  // Cart actions
  addItem: (item: Omit<CartLineItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateContact: (contact: CartData['contact']) => void
  updateShippingAddress: (address: CartData['shippingAddress']) => Promise<void>
  clearCart: () => void

  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  openSidebar: () => void
  closeSidebar: () => void
  /** Desktop only: collapsed = narrow strip. Used so main content can apply matching margin. */
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

// =============================================================================
// CONTEXT
// =============================================================================

const CartContext = createContext<CartContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const openSidebar = useCallback(() => setSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const addItem = useCallback((item: Omit<CartLineItem, 'id'>) => {
    cartHook.addItem(item)
    setSidebarOpen(true)
  }, [cartHook])

  const value: CartContextValue = {
    // Cart state
    cart: cartHook.cart,
    isLoading: cartHook.isLoading,
    isCalculatingShipping: cartHook.isCalculatingShipping,
    shippingZoneName: cartHook.shippingZoneName,
    taxRateName: cartHook.taxRateName,
    itemCount: cartHook.itemCount,
    prices: cartHook.prices,

    // Cart actions (addItem overridden above)
    addItem,
    removeItem: cartHook.removeItem,
    updateQuantity: cartHook.updateQuantity,
    updateContact: cartHook.updateContact,
    updateShippingAddress: cartHook.updateShippingAddress,
    clearCart: cartHook.clearCart,

    // Sidebar state
    sidebarOpen,
    setSidebarOpen,
    openSidebar,
    closeSidebar,
    sidebarCollapsed,
    setSidebarCollapsed,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
