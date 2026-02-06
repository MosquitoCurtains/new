/**
 * Auto-Generate Page Metadata Script
 * 
 * For every live page in site_pages, generates a route-level layout.tsx
 * with proper Next.js metadata (title, description, OG, Twitter, canonical)
 * plus structured data (BreadcrumbList + page-type-specific schemas).
 * 
 * Since nearly all pages use 'use client', metadata must be in a layout.tsx
 * (server component) rather than directly in page.tsx.
 * 
 * Usage:
 *   npx tsx scripts/generate-metadata.ts                    # All live pages
 *   npx tsx scripts/generate-metadata.ts --dry-run           # Preview without writing
 *   npx tsx scripts/generate-metadata.ts --slugs /garage-door-screens,/french-door-screens
 *   npx tsx scripts/generate-metadata.ts --overwrite         # Replace existing metadata
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from 'dotenv'
import { resolve, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PROJECT_ROOT = resolve(__dirname, '..')
const WP_BASE = 'https://www.mosquitocurtains.com'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// Parse CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const OVERWRITE = args.includes('--overwrite')
const slugsIdx = args.indexOf('--slugs')
const FILTER_SLUGS: string[] | null = slugsIdx >= 0
  ? args[slugsIdx + 1].split(',').map((s) => s.trim())
  : null

// ---------------------------------------------------------------------------
// Description generator from WP content
// ---------------------------------------------------------------------------

async function fetchWPMetaDescription(wpUrl: string): Promise<string | null> {
  try {
    const resp = await fetch(wpUrl, {
      headers: { 'User-Agent': 'MosquitoCurtains-SEO-Bot/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!resp.ok) return null
    const html = await resp.text()
    const $ = cheerio.load(html)

    // Try WP meta description first
    const metaDesc = $('meta[name="description"]').attr('content')
      || $('meta[property="og:description"]').attr('content')
    if (metaDesc && metaDesc.length > 30) return metaDesc.trim()

    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Description generator from page title + type
// ---------------------------------------------------------------------------

function generateDescription(title: string, pageType: string, slug: string): string {
  const cleanTitle = title.replace(/ \| .*$/, '').trim()
  
  // Page-type specific templates
  const templates: Record<string, (t: string) => string> = {
    product_landing: (t) =>
      `Custom ${t.toLowerCase()} by Mosquito Curtains. Made-to-measure, shipped direct. Easy DIY installation. 92,000+ customers served since 2004.`,
    seo_landing: (t) =>
      `${t} solutions from Mosquito Curtains. Custom-fitted mosquito netting, clear vinyl, and screen enclosures. Free quotes and fast shipping nationwide.`,
    category: (t) =>
      `Browse our ${t.toLowerCase()} collection. Custom-made screen and netting solutions for porches, patios, garages, and more. Ships direct from our workshop.`,
    informational: (t) =>
      `Learn about ${t.toLowerCase()} from Mosquito Curtains. Expert guidance on custom screen enclosures, mosquito netting, and outdoor living solutions.`,
    support: (t) =>
      `${t} - Get help with your Mosquito Curtains order. Installation guides, measuring tips, and customer support for all our screen products.`,
    ecommerce: (t) =>
      `${t} - Shop custom mosquito curtains and screen enclosures. Configure your perfect fit online. Free shipping on qualifying orders.`,
    marketing: (t) =>
      `${t} from Mosquito Curtains. Discover custom screen and netting solutions for every outdoor space. 92,000+ satisfied customers.`,
    legal: (t) =>
      `${t} for Mosquito Curtains. Important information about our policies, terms, and commitments to our customers.`,
    utility: (t) =>
      `${t} - Mosquito Curtains. Custom screen enclosures and mosquito netting for porches, patios, garages, and outdoor spaces.`,
    homepage: () =>
      `Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. 92,000+ orders served since 2004. DIY installation in an afternoon.`,
  }

  const generator = templates[pageType] || templates.informational
  let desc = generator(cleanTitle)

  // Truncate to SEO-ideal 155 chars
  if (desc.length > 160) {
    desc = desc.substring(0, 157)
    const lastSpace = desc.lastIndexOf(' ')
    desc = desc.substring(0, lastSpace) + '...'
  }

  return desc
}

// ---------------------------------------------------------------------------
// Keywords by page type and title
// ---------------------------------------------------------------------------

function generateKeywords(title: string, pageType: string, slug: string): string[] {
  const slugParts = slug.split('/').filter(Boolean).flatMap((s) => s.split('-'))
  const base = ['mosquito curtains', 'custom screens', 'screen enclosures']
  const fromSlug = slugParts.filter((w) => w.length > 3 && !base.some((b) => b.includes(w)))
  return [...base, ...fromSlug.slice(0, 5)]
}

// ---------------------------------------------------------------------------
// Determine structured data type
// ---------------------------------------------------------------------------

function getSchemaType(pageType: string, slug: string, title: string): string {
  if (slug === '/') return 'organization'
  if (slug === '/faq') return 'faq'
  if (pageType === 'product_landing' || pageType === 'ecommerce') return 'product'
  if (slug.includes('install') || slug.includes('how-to') || slug.includes('guide'))
    return 'howto'
  return 'webpage'
}

// ---------------------------------------------------------------------------
// Build the layout.tsx content
// ---------------------------------------------------------------------------

function buildLayoutContent(page: {
  title: string
  slug: string
  page_type: string
  description: string
  keywords: string[]
  schemaType: string
}): string {
  const { title, slug, page_type, description, keywords, schemaType } = page
  const cleanTitle = title.replace(/ \| .*$/, '').trim()

  // Build structured data imports based on type
  const schemaImports: string[] = ['BreadcrumbSchema', 'breadcrumbsFromSlug']
  const schemaBlocks: string[] = []

  // Always add breadcrumb
  schemaBlocks.push(
    `        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema(breadcrumbsFromSlug('${slug}', '${cleanTitle.replace(/'/g, "\\'")}')))} } />`
  )

  // Add type-specific schema
  switch (schemaType) {
    case 'organization':
      schemaImports.push('OrganizationSchema', 'LocalBusinessSchema')
      schemaBlocks.push(
        `        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema()) }} />`,
        `        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LocalBusinessSchema()) }} />`
      )
      break
    case 'product':
      schemaImports.push('ProductSchema')
      schemaBlocks.push(
        `        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema({ name: '${cleanTitle.replace(/'/g, "\\'")}', description: '${description.replace(/'/g, "\\'")}', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png', url: '${slug}' })) }} />`
      )
      break
    case 'webpage':
    default:
      schemaImports.push('WebPageSchema')
      schemaBlocks.push(
        `        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebPageSchema({ title: '${cleanTitle.replace(/'/g, "\\'")}', description: '${description.replace(/'/g, "\\'")}', url: '${slug}' })) }} />`
      )
      break
  }

  const keywordsStr = keywords.map((k) => `'${k.replace(/'/g, "\\'")}'`).join(', ')

  return `import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { ${schemaImports.join(', ')} } from '@/lib/seo/structured-data'

export const metadata: Metadata = buildPageMetadata({
  title: '${cleanTitle.replace(/'/g, "\\'")}',
  description: '${description.replace(/'/g, "\\'")}',
  slug: '${slug}',
  keywords: [${keywordsStr}],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
${schemaBlocks.join('\n')}
      </head>
      {children}
    </>
  )
}
`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Metadata Generation Script ===')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Overwrite: ${OVERWRITE}`)
  console.log()

  // 1. Fetch all live pages from site_pages
  let query = supabase
    .from('site_pages')
    .select('slug, title, page_type, wordpress_url')
    .eq('migration_status', 'live')
    .order('slug')

  if (FILTER_SLUGS) {
    query = query.in('slug', FILTER_SLUGS)
  }

  const { data: pages, error } = await query

  if (error || !pages) {
    console.error('Failed to fetch pages:', error)
    process.exit(1)
  }

  console.log(`Found ${pages.length} live pages to process\n`)

  let created = 0
  let skipped = 0
  let overwritten = 0
  let failed = 0

  for (const page of pages) {
    const slug = page.slug as string
    const title = (page.title as string) || 'Mosquito Curtains'
    const pageType = (page.page_type as string) || 'informational'
    const wpUrl = page.wordpress_url as string | null

    // Determine the page directory
    const pageDir = slug === '/'
      ? join(PROJECT_ROOT, 'src', 'app')
      : join(PROJECT_ROOT, 'src', 'app', ...slug.split('/').filter(Boolean))

    const layoutPath = join(pageDir, 'layout.tsx')
    const pagePath = join(pageDir, 'page.tsx')

    // Skip if page.tsx doesn't exist
    if (!existsSync(pagePath)) {
      console.log(`  SKIP ${slug} -- no page.tsx found`)
      skipped++
      continue
    }

    // Skip root layout (handled separately)
    if (slug === '/') {
      console.log(`  SKIP ${slug} -- root layout handled separately`)
      skipped++
      continue
    }

    // Check for existing layout
    if (existsSync(layoutPath) && !OVERWRITE) {
      console.log(`  SKIP ${slug} -- layout.tsx already exists (use --overwrite)`)
      skipped++
      continue
    }

    // Try to get WP meta description
    let description: string | null = null
    if (wpUrl) {
      description = await fetchWPMetaDescription(wpUrl)
    }
    if (!description) {
      description = generateDescription(title, pageType, slug)
    }

    const keywords = generateKeywords(title, pageType, slug)
    const schemaType = getSchemaType(pageType, slug, title)

    const layoutContent = buildLayoutContent({
      title,
      slug,
      page_type: pageType,
      description,
      keywords,
      schemaType,
    })

    if (DRY_RUN) {
      console.log(`  WOULD CREATE ${slug}/layout.tsx`)
      console.log(`    Title: ${title}`)
      console.log(`    Desc: ${description.substring(0, 80)}...`)
      console.log(`    Schema: ${schemaType}`)
      created++
    } else {
      try {
        const isOverwriting = existsSync(layoutPath)
        writeFileSync(layoutPath, layoutContent, 'utf8')
        if (isOverwriting) {
          console.log(`  OVERWRITE ${slug}/layout.tsx`)
          overwritten++
        } else {
          console.log(`  CREATE ${slug}/layout.tsx`)
          created++
        }
      } catch (err) {
        console.error(`  FAIL ${slug}:`, err)
        failed++
      }
    }
  }

  console.log('\n=== Summary ===')
  console.log(`Created: ${created}`)
  console.log(`Overwritten: ${overwritten}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total: ${pages.length}`)
}

main().catch(console.error)
