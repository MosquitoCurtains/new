import type { Metadata } from 'next'
import OrderShell from '@/app/order/components/OrderShell'

export const metadata: Metadata = {
  alternates: {
    canonical: '/raw-netting/mosquito-net',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OrderShell>{children}</OrderShell>
}
