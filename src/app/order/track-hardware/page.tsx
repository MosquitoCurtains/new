import type { Metadata } from 'next'
import { TrackHardwarePage } from '@/app/order/components/pages/TrackHardwarePage'

export const metadata: Metadata = {
  title: 'Order Track Hardware',
  alternates: { canonical: '/order-tracking' },
}

export default function Page() { return <TrackHardwarePage /> }
