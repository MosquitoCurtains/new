import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Clear Vinyl Patio Enclosures',
  description: 'Custom clear vinyl patio enclosures by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.',
  slug: '/clear-vinyl-plastic-patio-enclosures',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'clear', 'vinyl', 'plastic', 'patio'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/clear-vinyl-plastic-patio-enclosures', 'Clear Vinyl Patio Enclosures')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Clear Vinyl Patio Enclosures', description: 'Custom clear vinyl patio enclosures by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/clear-vinyl-plastic-patio-enclosures' })) }} />
      {children}
    </>
  )
}
