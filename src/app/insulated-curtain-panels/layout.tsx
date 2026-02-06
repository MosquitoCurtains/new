import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Insulated Curtain Panels',
  description: 'Insulated Curtain Panels solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...',
  slug: '/insulated-curtain-panels',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'insulated', 'panels'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/insulated-curtain-panels', 'Insulated Curtain Panels')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Insulated Curtain Panels', description: 'Insulated Curtain Panels solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...', url: '/insulated-curtain-panels' })) }} />
      </head>
      {children}
    </>
  )
}
