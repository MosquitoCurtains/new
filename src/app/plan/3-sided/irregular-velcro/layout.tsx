import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: '3-Sided Irregular Velcro',
  description: '3-Sided Irregular Velcro - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.',
  slug: '/plan/3-sided/irregular-velcro',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'plan', 'sided', 'irregular', 'velcro'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/plan/3-sided/irregular-velcro', '3-Sided Irregular Velcro')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: '3-Sided Irregular Velcro', description: '3-Sided Irregular Velcro - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.', url: '/plan/3-sided/irregular-velcro' })) }} />
      </head>
      {children}
    </>
  )
}
