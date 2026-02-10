import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Start Project',
  description: 'Start your project today. Choose mosquito curtains, clear vinyl panels, or raw mesh fabric. Expert assistance, instant quote, or DIY builder.',
  slug: '/start-project',
  keywords: ['mosquito curtains', 'clear vinyl', 'raw netting', 'start project', 'expert assistance', 'instant quote', 'diy builder'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/start-project', 'Start Project')))} } />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'Start Project', description: 'Start Project - Shop custom mosquito curtains and screen enclosures. Configure your perfect fit online. Free shipping on qualifying orders.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '/start-project' })) }} />
      {children}
    </>
  )
}
