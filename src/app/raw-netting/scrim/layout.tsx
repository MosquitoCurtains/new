import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Theatre Scrim',
  description: 'Theatre Scrim solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping nationwide.',
  slug: '/raw-netting/scrim',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'netting', 'scrim'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/scrim', 'Theatre Scrim')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Theatre Scrim', description: 'Theatre Scrim solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping nationwide.', url: '/raw-netting/scrim' })) }} />
      </head>
      {children}
    </>
  )
}
