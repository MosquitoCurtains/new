import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: '3 Sided Exposure',
  description: '3 Sided Exposure - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/plan/3-sided',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'plan', 'sided'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/plan/3-sided', '3 Sided Exposure')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: '3 Sided Exposure', description: '3 Sided Exposure - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/plan/3-sided' })) }} />
      </head>
      {children}
    </>
  )
}
