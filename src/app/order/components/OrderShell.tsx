'use client'

/**
 * OrderShell — Shared cart wrapper for pages OUTSIDE the /order/ route tree.
 * 
 * Used by:
 * - Legacy WP URL pages (/order-mesh-panels/, /order-tracking/, etc.)
 * - Raw netting SEO pages (/mosquito-netting/, /no-see-um-netting-screen/, etc.)
 * 
 * Provides CartContext + OrderSidebarCart, matching /order/layout.tsx behavior.
 */

import { CartProvider } from '@/contexts/CartContext'
import OrderSidebarCart from './OrderSidebarCart'

export default function OrderShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative">
        {children}
        <OrderSidebarCart />
      </div>
    </CartProvider>
  )
}
