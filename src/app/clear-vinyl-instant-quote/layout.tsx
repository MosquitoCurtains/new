import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Clear Vinyl Instant Quote',
  description: 'Get an instant price estimate for your custom clear vinyl enclosure project. Select your panel height, top attachment, and project dimensions for a quote within 5% of actual cost.',
  slug: '/clear-vinyl-instant-quote',
  keywords: ['clear vinyl', 'instant quote', 'price estimate', 'vinyl enclosure cost', 'patio enclosure', 'clear vinyl panels'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/clear-vinyl-instant-quote', 'Clear Vinyl Instant Quote')))} } />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Clear Vinyl Instant Quote', description: 'Get an instant price estimate for your custom clear vinyl enclosure project. Configure panel height, top attachment, project dimensions and get an accurate quote.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/clear-vinyl-instant-quote' })) }} />
      {children}
    </>
  )
}
