import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Netting Attachment Hardware | Marine Snaps, Grommets & More',
  description: 'Attachment hardware for raw netting: marine snaps, grommets, elastic cord, nylon webbing, velcro, and cable ties. Same marine-grade hardware we use in our own fabricated products.',
  slug: '/raw-netting/hardware',
  keywords: ['netting hardware', 'marine snaps', 'mesh grommets', 'elastic cord', 'netting attachment', 'nylon webbing', 'velcro strips'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/hardware', 'Attachment Hardware'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Netting Attachment Hardware', description: 'Marine snaps, grommets, elastic cord, nylon webbing, velcro, and cable ties for attaching raw netting. Same hardware we use in our own products.', url: '/raw-netting/hardware' })) }} />
      {children}
    </>
  )
}
