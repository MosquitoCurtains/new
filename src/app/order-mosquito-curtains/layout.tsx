import type { Metadata } from 'next'
import { CartProvider } from '@/contexts/CartContext'
import OrderSidebarCart from '@/app/order/components/OrderSidebarCart'

export const metadata: Metadata = {
  alternates: {
    canonical: '/order/mosquito-curtains',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative">
        {children}
        <OrderSidebarCart />
      </div>
    </CartProvider>
  )
}
