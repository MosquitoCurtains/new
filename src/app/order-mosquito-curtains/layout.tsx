import type { Metadata } from 'next'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  alternates: {
    canonical: '/order/mosquito-curtains',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
