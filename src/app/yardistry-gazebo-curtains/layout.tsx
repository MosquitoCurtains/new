import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Yardistry Gazebo Curtains',
  description: 'Yardistry Gazebo Curtains solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast...',
  slug: '/yardistry-gazebo-curtains',
  keywords: ['mosquito curtains', 'custom screens', 'screen enclosures', 'yardistry', 'gazebo'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/yardistry-gazebo-curtains', 'Yardistry Gazebo Curtains')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Yardistry Gazebo Curtains', description: 'Yardistry Gazebo Curtains solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast...', url: '/yardistry-gazebo-curtains' })) }} />
      </head>
      {children}
    </>
  )
}
