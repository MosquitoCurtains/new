import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Gallery Hub',
  description: 'Learn about gallery hub from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.',
  slug: '/gallery',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'gallery'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/gallery', 'Gallery Hub')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Gallery Hub', description: 'Learn about gallery hub from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.', url: '/gallery' })) }} />
      </head>
      {children}
    </>
  )
}
