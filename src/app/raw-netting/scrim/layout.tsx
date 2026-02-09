import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Theatre Scrim Material | Marine-Grade Shark Tooth Scrim',
  description: 'Marine-grade shark tooth scrim for theatre, concerts, events, and projection. 120" and 140" wide rolls from $7.00/ft. White or silver. 100% polyester, suitable for outdoors. Can seam to ANY size.',
  slug: '/raw-netting/scrim',
  keywords: ['theatre scrim', 'shark tooth scrim', 'stage scrim material', 'theater scrim fabric', 'outdoor scrim', 'projection scrim', 'marine grade scrim'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/scrim', 'Theatre Scrim'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Marine Grade Theatre Scrim Material', description: 'Shark tooth scrim fabric for theatre productions, concerts, and events. 100% polyester, suitable for outdoors. 120" and 140" wide rolls in white or silver.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Sharks-tooth-Scrim-1200.jpg', url: '/raw-netting/scrim' })) }} />
      {children}
    </>
  )
}
