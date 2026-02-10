import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, WebPageSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Why Buy Netting From Us | Manufacturers Since 2003',
  description: 'Why buy raw netting from Mosquito Curtains? We are manufacturers who use these exact materials in our own products. Marine-grade quality, expert advice, fast shipping. 92,000+ customers served.',
  slug: '/raw-netting/why-us',
  keywords: ['why buy netting', 'mosquito curtains manufacturer', 'raw netting supplier', 'marine grade netting', 'quality mesh netting', 'netting manufacturer'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/why-us', 'Why Us'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: 'Why Buy Raw Netting From Us', description: 'We are manufacturers who use these exact materials in our own products. Marine-grade quality, expert advice, fast shipping. 92,000+ customers since 2003.', url: '/raw-netting/why-us' })) }} />
      {children}
    </>
  )
}
