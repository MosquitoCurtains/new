import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Checkout',
  description: 'Complete your Mosquito Curtains order. Secure checkout with shipping calculation and order review.',
  slug: '/checkout',
  noIndex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
