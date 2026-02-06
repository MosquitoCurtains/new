import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Heavy Track',
  description: 'Custom heavy track by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.',
  slug: '/heavy-track',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'heavy', 'track'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/heavy-track', 'Heavy Track')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Heavy Track', description: 'Custom heavy track by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/heavy-track' })) }} />
      </head>
      {children}
    </>
  )
}
