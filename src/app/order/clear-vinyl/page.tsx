import type { Metadata } from 'next'
import { ClearVinylPage } from '@/app/order/components/pages/ClearVinylPage'

export const metadata: Metadata = {
  title: 'Order Clear Vinyl Panels',
  alternates: { canonical: '/ordering-clear-vinyl' },
}

export default function Page() { return <ClearVinylPage /> }
