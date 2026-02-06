import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Pergola Screen Curtains',
  description: 'Pergola Screen Curtains solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...',
  slug: '/pergola-screen-curtains',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'pergola'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/pergola-screen-curtains', 'Pergola Screen Curtains')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Pergola Screen Curtains', description: 'Pergola Screen Curtains solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...', url: '/pergola-screen-curtains' })) }} />
      </head>
      {children}
    </>
  )
}
