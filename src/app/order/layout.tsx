import { CartProvider } from '@/contexts/CartContext'
import OrderSidebarCart from './components/OrderSidebarCart'
import OrderContentWrapper from './components/OrderContentWrapper'

/**
 * Order Layout — CartContext + sidebar cart. Content has right margin on desktop
 * so it is not covered by the cart (like admin sales).
 */
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative">
        <OrderContentWrapper>{children}</OrderContentWrapper>
        <OrderSidebarCart />
      </div>
    </CartProvider>
  )
}
