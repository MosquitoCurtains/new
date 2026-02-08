import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Mosquito Curtains Instant Quote',
  description: 'Get an instant price estimate for your custom mosquito curtain project. Select your mesh type, top attachment, and project dimensions for a quote within 5% of actual cost.',
  slug: '/mosquito-curtains-instant-quote',
  keywords: ['mosquito curtains', 'instant quote', 'price estimate', 'screen enclosure cost', 'porch screens', 'outdoor curtains'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/mosquito-curtains-instant-quote', 'Mosquito Curtains Instant Quote')))} } />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Mosquito Curtains Instant Quote', description: 'Get an instant price estimate for your custom mosquito curtain project. Configure mesh type, top attachment, project dimensions and get an accurate quote.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/mosquito-curtains-instant-quote' })) }} />
      {children}
    </>
  )
}
