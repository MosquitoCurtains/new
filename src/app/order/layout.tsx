import { CartProvider } from '@/contexts/CartContext'
import OrderSidebarCart from './components/OrderSidebarCart'

/**
 * Order Layout — Wraps all /order/* routes with CartContext + OrderSidebarCart.
 * The sidebar cart is always rendered; visibility is controlled by CartContext.
 */
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative">
        {children}
        <OrderSidebarCart />
      </div>
    </CartProvider>
  )
}
