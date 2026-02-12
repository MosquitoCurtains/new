'use client'

/**
 * OrderShell — Cart context only for pages OUTSIDE the /order/ route tree.
 *
 * Used by legacy WP URL pages and raw netting SEO pages. Provides CartContext
 * so add-to-cart works; no sidebar (sidebar is only on /order/*). Users go to
 * /cart via the header cart icon.
 */

import { CartProvider } from '@/contexts/CartContext'

export default function OrderShell({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
