import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Garage Door Screens',
  description: 'Garage Door Screens solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...',
  slug: '/garage-door-screens',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'garage', 'door'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/garage-door-screens', 'Garage Door Screens')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Garage Door Screens', description: 'Garage Door Screens solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping...', url: '/garage-door-screens' })) }} />
      </head>
      {children}
    </>
  )
}
