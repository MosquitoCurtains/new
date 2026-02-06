import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Fasteners & Rigging',
  description: 'Fasteners & Rigging - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/raw-netting/rigging',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'netting', 'rigging'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/rigging', 'Fasteners & Rigging')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Fasteners & Rigging', description: 'Fasteners & Rigging - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/raw-netting/rigging' })) }} />
      </head>
      {children}
    </>
  )
}
