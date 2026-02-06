import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Client Uploads',
  description: 'Client Uploads - Mosquito Curtains. Custom screen enclosures and mosquito netting for porches, patios, garages, and outdoor spaces.',
  slug: '/uploads',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'uploads'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/uploads', 'Client Uploads')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Client Uploads', description: 'Client Uploads - Mosquito Curtains. Custom screen enclosures and mosquito netting for porches, patios, garages, and outdoor spaces.', url: '/uploads' })) }} />
      {children}
    </>
  )
}
