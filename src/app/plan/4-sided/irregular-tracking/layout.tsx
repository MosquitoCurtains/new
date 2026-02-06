import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: '4-Sided Irregular Tracking',
  description: 'Learn about 4-sided irregular tracking from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.',
  slug: '/plan/4-sided/irregular-tracking',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'plan', 'sided', 'irregular', 'tracking'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/plan/4-sided/irregular-tracking', '4-Sided Irregular Tracking')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: '4-Sided Irregular Tracking', description: 'Learn about 4-sided irregular tracking from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.', url: '/plan/4-sided/irregular-tracking' })) }} />
      </head>
      {children}
    </>
  )
}
