import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Track Hardware',
  description: 'Order ceiling track hardware for mosquito curtains. Standard and heavy-duty track, curves, splices, end caps, and snap carriers. Live pricing.',
  slug: '/order-tracking',
  keywords: ['order track hardware', 'ceiling track', 'curtain track system', 'mosquito curtain track'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
