import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Marine Grade Quality Theatre Scrim Material',
  description: 'Buy theatre scrim material by the foot. Raw shark tooth scrim in white or silver. 100% polyester suitable for outdoors. 120" and 140" wide rolls from $7/ft.',
  slug: '/theatre-scrim',
  keywords: ['theatre scrim', 'theater scrim', 'shark tooth scrim', 'scrim material', 'projection scrim', 'raw scrim fabric'],
  type: 'product',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
