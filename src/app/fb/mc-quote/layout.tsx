import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'FB MC Quote',
  description: 'FB MC Quote from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.',
  slug: '/fb/mc-quote',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'quote'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/fb/mc-quote', 'FB MC Quote')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'FB MC Quote', description: 'FB MC Quote from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.', url: '/fb/mc-quote' })) }} />
      </head>
      {children}
    </>
  )
}
