import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog Hub',
  description: 'Learn about blog hub from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.',
  slug: '/blog',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'blog'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/blog', 'Blog Hub')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Blog Hub', description: 'Learn about blog hub from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.', url: '/blog' })) }} />
      </head>
      {children}
    </>
  )
}
