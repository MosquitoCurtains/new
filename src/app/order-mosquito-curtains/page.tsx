import type { Metadata } from 'next'
import OrderShell from '@/app/order/components/OrderShell'
import { MeshPanelsPage } from '@/app/order/components/pages/MeshPanelsPage'

// Canonical points to /order-mesh-panels/ (the primary WordPress URL for this content)
export const metadata: Metadata = {
  title: 'Order Mosquito Curtain Panels',
  alternates: { canonical: '/order-mesh-panels' },
}

export default function Page() {
  return (
    <OrderShell>
      <MeshPanelsPage />
    </OrderShell>
  )
}
