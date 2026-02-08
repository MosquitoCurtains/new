import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Order Raw Netting Attachment Hardware',
  description: 'Order attachment hardware for raw netting. Marine snaps, elastic cord, webbing, and snap tool for rigging your mesh. Live pricing.',
  slug: '/order-raw-netting-attachment-hardware',
  keywords: ['raw netting hardware', 'marine snaps', 'netting attachment', 'mesh rigging supplies'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
