import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Attachments',
  description: 'Order attachment hardware for mosquito curtains. Marine snaps, magnets, elastic cord, webbing, stucco strips, and snap tool. Live pricing.',
  slug: '/order-attachments',
  keywords: ['order attachments', 'marine snaps', 'magnetic doorway', 'elastic cord', 'curtain hardware'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
