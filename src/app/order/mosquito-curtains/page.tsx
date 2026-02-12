import type { Metadata } from 'next'
import { MeshPanelsPage } from '@/app/order/components/pages/MeshPanelsPage'

export const metadata: Metadata = {
  title: 'Order Mosquito Curtain Panels',
  alternates: { canonical: '/order-mesh-panels' },
}

export default function Page() { return <MeshPanelsPage /> }
