import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Mesh Panels',
  description: 'Order custom-made mosquito curtain mesh panels online. Choose mesh type, color, and dimensions. Live pricing with instant cart. Ships in 3-7 business days.',
  slug: '/order-mesh-panels',
  keywords: ['order mesh panels', 'buy mosquito curtains', 'custom mesh panels', 'mosquito netting order'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
