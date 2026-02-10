import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug, ProductSchema } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'No-See-Um Mesh Fabric | Dense Weave Netting By the Foot',
  description: 'No-see-um mesh netting with 800 holes per sq inch blocks tiny biting midges. 101" and 123" wide rolls from $6.00/ft. Essential for coastal areas. Solution-dyed polyester, CA fire rated.',
  slug: '/raw-netting/no-see-um',
  keywords: ['no-see-um mesh', 'no-see-um netting', 'biting midge screen', 'sand fly netting', 'dense weave mesh', 'coastal bug netting', 'no see um fabric'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/raw-netting/no-see-um', 'No-See-Um Mesh'))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: 'No-See-Um Mesh Fabric', description: 'Dense weave netting with 800 holes per sq inch. Blocks tiny biting no-see-ums. 101" and 123" wide rolls in black or white. Solution-dyed polyester.', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/Noseeum-Mesh-1600.jpg', url: '/raw-netting/no-see-um' })) }} />
      {children}
    </>
  )
}
