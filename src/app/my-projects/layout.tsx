import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'My Projects',
  description: 'My Projects - Shop custom mosquito curtains and screen enclosures. Configure your perfect fit online. Free shipping on qualifying orders.',
  slug: '/my-projects',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'projects'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/my-projects', 'My Projects')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'My Projects', description: 'My Projects - Shop custom mosquito curtains and screen enclosures. Configure your perfect fit online. Free shipping on qualifying orders.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/my-projects' })) }} />
      </head>
      {children}
    </>
  )
}
