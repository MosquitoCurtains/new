import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Clear Vinyl Panels',
  description: 'Order custom-made clear vinyl patio enclosure panels online. Choose canvas color and dimensions. Live pricing with instant cart. Ships in 3-7 business days.',
  slug: '/ordering-clear-vinyl',
  keywords: ['order clear vinyl', 'clear vinyl panels', 'patio enclosures', 'vinyl curtains order'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
