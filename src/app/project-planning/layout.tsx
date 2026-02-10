import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { BreadcrumbSchema, breadcrumbsFromSlug } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: 'Project Planning',
  description: 'Choose how to plan your mosquito curtain or clear vinyl project. Work with our planning team or use our self-service planning tools.',
  slug: '/project-planning',
  keywords: ['project planning', 'mosquito curtains', 'clear vinyl', 'planner assistance'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('/project-planning', 'Project Planning'))) }} />
      {children}
    </>
  )
}
