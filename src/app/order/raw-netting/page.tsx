import type { Metadata } from 'next'
import { RawNettingPage } from '@/app/order/components/pages/RawNettingPage'

export const metadata: Metadata = {
  title: 'Order Raw Netting',
  alternates: { canonical: '/order-mesh-netting-fabrics' },
}

export default function Page() { return <RawNettingPage /> }
