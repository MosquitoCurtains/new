import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Roll Up Shade Screens',
  description: 'Roll Up Shade Screens solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...',
  slug: '/roll-up-shade-screens',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'roll', 'shade'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/roll-up-shade-screens', 'Roll Up Shade Screens')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Roll Up Shade Screens', description: 'Roll Up Shade Screens solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...', url: '/roll-up-shade-screens' })) }} />
      </head>
      {children}
    </>
  )
}
