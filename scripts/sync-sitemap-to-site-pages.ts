/**
 * Sync Sitemap -> site_pages
 * 
 * Pushes every page from sitemap.ts into the site_pages table.
 * Uses upsert on slug so existing rows keep their data (review_status, notes, etc.)
 * and new rows get created with sensible defaults.
 * 
 * Usage:
 *   npx tsx scripts/sync-sitemap-to-site-pages.ts
 *   npx tsx scripts/sync-sitemap-to-site-pages.ts --dry-run
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DRY_RUN = process.argv.includes('--dry-run')

// ---------------------------------------------------------------------------
// Page type mapping (sitemap types -> site_pages page_type enum)
//
// DB enum (original): homepage, product_landing, seo_landing, category,
//   informational, legal, support, marketing, ecommerce, admin, utility
// DB enum (after migration 20260206000002): + product, ordering, landing,
//   planning, quote, faq, installation, gallery, blog, sale
//
// If migration hasn't run yet, we fall back to mapping sitemap types
// to the closest existing enum value.
// ---------------------------------------------------------------------------

type SitemapPageType =
  | 'homepage' | 'product' | 'ordering' | 'landing' | 'quote'
  | 'informational' | 'planning' | 'faq' | 'support'
  | 'installation' | 'gallery' | 'blog' | 'sale' | 'legal'

// Fallback mapping for when the new enum values don't exist yet
const FALLBACK_PAGE_TYPE: Record<SitemapPageType, string> = {
  homepage: 'homepage',
  product: 'product_landing',
  ordering: 'ecommerce',
  landing: 'seo_landing',
  quote: 'ecommerce',
  informational: 'informational',
  planning: 'informational',
  faq: 'informational',
  support: 'support',
  installation: 'informational',
  gallery: 'informational',
  blog: 'informational',
  sale: 'marketing',
  legal: 'legal',
}

// Try the exact type first; if it fails, use fallback
let useExactTypes = true

interface SitemapPage {
  slug: string
  type: SitemapPageType
}

function getPageType(type: SitemapPageType): string {
  return useExactTypes ? type : FALLBACK_PAGE_TYPE[type]
}

// ---------------------------------------------------------------------------
// All pages from sitemap.ts (copy of the STATIC_PAGES array)
// ---------------------------------------------------------------------------

const STATIC_PAGES: SitemapPage[] = [
  // Homepage
  { slug: '/', type: 'homepage' },

  // Product Pages
  { slug: '/products', type: 'product' },
  { slug: '/mosquito-netting', type: 'product' },
  { slug: '/no-see-um-netting-screen', type: 'product' },
  { slug: '/shade-screen-mesh', type: 'product' },
  { slug: '/industrial-mesh', type: 'product' },
  { slug: '/industrial-netting', type: 'product' },
  { slug: '/theatre-scrim', type: 'product' },
  { slug: '/theater-scrims', type: 'product' },
  { slug: '/roll-up-shade-screens', type: 'product' },
  { slug: '/ordering-clear-vinyl', type: 'product' },
  { slug: '/clear-vinyl-plastic-patio-enclosures', type: 'product' },
  { slug: '/porch-vinyl-curtains', type: 'product' },
  { slug: '/porch-vinyl-panels', type: 'product' },
  { slug: '/insulated-curtain-panels', type: 'product' },
  { slug: '/heavy-track', type: 'product' },
  { slug: '/camping-net', type: 'product' },
  { slug: '/outdoor-projection-screens', type: 'product' },
  { slug: '/pollen-protection', type: 'product' },
  { slug: '/tent-screens', type: 'product' },
  { slug: '/weather-curtains', type: 'product' },
  { slug: '/raw-netting-fabric-store', type: 'product' },

  // Raw Netting Category
  { slug: '/raw-netting', type: 'product' },
  { slug: '/raw-netting/mosquito-net', type: 'product' },
  { slug: '/raw-netting/no-see-um', type: 'product' },
  { slug: '/raw-netting/shade-mesh', type: 'product' },
  { slug: '/raw-netting/industrial', type: 'product' },
  { slug: '/raw-netting/scrim', type: 'product' },
  { slug: '/raw-netting/custom', type: 'product' },
  { slug: '/raw-netting/hardware', type: 'product' },
  { slug: '/raw-netting/rigging', type: 'product' },
  { slug: '/raw-netting/why-us', type: 'informational' },

  // Ordering Pages
  { slug: '/order', type: 'ordering' },
  { slug: '/order/mosquito-curtains', type: 'ordering' },
  { slug: '/order/clear-vinyl', type: 'ordering' },
  { slug: '/order/raw-netting', type: 'ordering' },
  { slug: '/order/roll-up-shades', type: 'ordering' },
  { slug: '/order/track-hardware', type: 'ordering' },
  { slug: '/order/attachments', type: 'ordering' },
  { slug: '/order/raw-netting-attachments', type: 'ordering' },
  { slug: '/order-mesh-panels', type: 'ordering' },
  { slug: '/order-mesh-netting-fabrics', type: 'ordering' },
  { slug: '/order-attachments', type: 'ordering' },
  { slug: '/order-raw-netting-attachment-hardware', type: 'ordering' },
  { slug: '/order-tracking', type: 'ordering' },

  // Clear Vinyl Options
  { slug: '/options', type: 'informational' },
  { slug: '/options/clear-vinyl', type: 'informational' },
  { slug: '/options/clear-vinyl/quality', type: 'informational' },
  { slug: '/options/clear-vinyl/ordering', type: 'informational' },
  { slug: '/options/clear-vinyl/considerations', type: 'informational' },
  { slug: '/options/clear-vinyl/diy', type: 'informational' },
  { slug: '/options/clear-vinyl/apron-colors', type: 'informational' },
  { slug: '/clear-vinyl-options', type: 'informational' },

  // Landing Pages
  { slug: '/screened-porch', type: 'landing' },
  { slug: '/screened-porch-enclosures', type: 'landing' },
  { slug: '/screened-in-decks', type: 'landing' },
  { slug: '/screen-patio', type: 'landing' },
  { slug: '/gazebo-screen-curtains', type: 'landing' },
  { slug: '/pergola-screen-curtains', type: 'landing' },
  { slug: '/garage-door-screens', type: 'landing' },
  { slug: '/french-door-screens', type: 'landing' },
  { slug: '/awning-screen-enclosures', type: 'landing' },
  { slug: '/boat-screens', type: 'landing' },
  { slug: '/hvac-chiller-screens', type: 'landing' },
  { slug: '/porch-winterize', type: 'landing' },
  { slug: '/patio-winterize', type: 'landing' },
  { slug: '/yardistry-gazebo-curtains', type: 'landing' },
  { slug: '/applications', type: 'landing' },

  // Quote & Start Pages
  { slug: '/start-project', type: 'quote' },
  { slug: '/mosquito-curtains-instant-quote', type: 'quote' },
  { slug: '/clear-vinyl-instant-quote', type: 'quote' },
  { slug: '/quote/mosquito-curtains', type: 'quote' },
  { slug: '/quote/clear-vinyl', type: 'quote' },
  { slug: '/work-with-a-planner', type: 'quote' },

  // Sale
  { slug: '/sale', type: 'sale' },

  // Planning & How-To Pages
  { slug: '/plan', type: 'planning' },
  { slug: '/plan/overview', type: 'planning' },
  { slug: '/plan/how-to-order', type: 'planning' },
  { slug: '/plan/tracking', type: 'planning' },
  { slug: '/plan/mesh-colors', type: 'planning' },
  { slug: '/plan/magnetic-doorways', type: 'planning' },
  { slug: '/plan/sealing-base', type: 'planning' },
  { slug: '/plan/free-standing', type: 'planning' },
  { slug: '/plan/tents-awnings', type: 'planning' },
  { slug: '/plan/1-sided', type: 'planning' },
  { slug: '/plan/2-sided', type: 'planning' },
  { slug: '/plan/2-sided/regular-tracking', type: 'planning' },
  { slug: '/plan/2-sided/regular-velcro', type: 'planning' },
  { slug: '/plan/2-sided/irregular-tracking', type: 'planning' },
  { slug: '/plan/2-sided/irregular-velcro', type: 'planning' },
  { slug: '/plan/3-sided', type: 'planning' },
  { slug: '/plan/3-sided/regular-tracking', type: 'planning' },
  { slug: '/plan/3-sided/regular-velcro', type: 'planning' },
  { slug: '/plan/3-sided/irregular-tracking', type: 'planning' },
  { slug: '/plan/3-sided/irregular-velcro', type: 'planning' },
  { slug: '/plan/4-sided', type: 'planning' },
  { slug: '/plan/4-sided/regular-tracking', type: 'planning' },
  { slug: '/plan/4-sided/regular-velcro', type: 'planning' },
  { slug: '/plan/4-sided/irregular-tracking', type: 'planning' },
  { slug: '/plan/4-sided/irregular-velcro', type: 'planning' },

  // Informational Pages
  { slug: '/about', type: 'informational' },
  { slug: '/our-story', type: 'informational' },
  { slug: '/professionals', type: 'informational' },
  { slug: '/contractors', type: 'informational' },
  { slug: '/opportunities', type: 'informational' },
  { slug: '/reviews', type: 'informational' },
  { slug: '/satisfaction-guarantee', type: 'informational' },

  // Care & Maintenance
  { slug: '/care/clear-vinyl', type: 'informational' },
  { slug: '/care/mosquito-curtains', type: 'informational' },

  // Installation Guides
  { slug: '/install', type: 'installation' },
  { slug: '/install/clear-vinyl', type: 'installation' },
  { slug: '/install/tracking', type: 'installation' },
  { slug: '/install/velcro', type: 'installation' },

  // FAQ
  { slug: '/faq', type: 'faq' },
  { slug: '/faq/mosquito-curtains', type: 'faq' },
  { slug: '/faq/clear-vinyl', type: 'faq' },

  // Support
  { slug: '/contact', type: 'support' },
  { slug: '/shipping', type: 'support' },
  { slug: '/returns', type: 'support' },

  // Gallery & Media
  { slug: '/gallery', type: 'gallery' },
  { slug: '/photos', type: 'gallery' },
  { slug: '/videos', type: 'gallery' },
  { slug: '/projects', type: 'gallery' },

  // Blog Index
  { slug: '/blog', type: 'blog' },

  // Legal
  { slug: '/privacy-policy', type: 'legal' },
]

const BLOG_SLUGS = [
  'history-of-mosquitoes',
  'mosquito-capitol-of-america',
  'mosquito-enclosures-for-decks',
  'gazebos-then-and-now',
  'porch-too-beautiful-to-screen',
  'pollen-and-porches',
  'northern-mosquitoes',
  'storm-proof-screening',
  'west-nile-virus-effects',
  'mosquito-protection-summary',
  'bond-sales-story',
  'kids-project',
  'dear-martha-stewart',
  'work-is-good',
  'mulligan-blocker',
  'airlines-screen-doors',
  'outdoor-projection-screens',
]

const GALLERY_SLUGS = [
  'featured',
  'porch-projects',
  'clear-vinyl',
  'mosquito-netting',
  'white-netting',
  'black-netting',
]

// ---------------------------------------------------------------------------
// Generate a human-readable title from a slug
// ---------------------------------------------------------------------------

function slugToTitle(slug: string): string {
  // Special cases
  const special: Record<string, string> = {
    '/': 'Home',
    '/faq': 'FAQ',
    '/faq/mosquito-curtains': 'FAQ: Mosquito Curtains',
    '/faq/clear-vinyl': 'FAQ: Clear Vinyl',
    '/hvac-chiller-screens': 'HVAC Chiller Screens',
    '/raw-netting/no-see-um': 'No-See-Um Mesh Fabric',
    '/raw-netting/why-us': 'Why Buy Netting From Us',
    '/raw-netting/mosquito-net': 'Heavy Mosquito Netting Fabric',
    '/raw-netting/scrim': 'Theatre Scrim Material',
    '/no-see-um-netting-screen': 'No-See-Um Netting Screen',
    '/clear-vinyl-plastic-patio-enclosures': 'Clear Vinyl Plastic Patio Enclosures',
    '/clear-vinyl-options': 'Clear Vinyl Options',
    '/clear-vinyl-instant-quote': 'Clear Vinyl Instant Quote',
    '/mosquito-curtains-instant-quote': 'Mosquito Curtains Instant Quote',
    '/raw-netting-fabric-store': 'Raw Netting Fabric Store',
    '/order-mesh-panels': 'Order Mesh Panels',
    '/order-mesh-netting-fabrics': 'Order Mesh Netting Fabrics',
    '/order-attachments': 'Order Attachments',
    '/order-raw-netting-attachment-hardware': 'Order Raw Netting Attachment Hardware',
    '/order-tracking': 'Order Tracking',
    '/options/clear-vinyl/diy': 'Clear Vinyl DIY',
    '/options/clear-vinyl/apron-colors': 'Clear Vinyl Apron Colors',
    '/options/clear-vinyl/quality': 'Clear Vinyl Quality',
    '/options/clear-vinyl/ordering': 'Clear Vinyl Ordering',
    '/options/clear-vinyl/considerations': 'Clear Vinyl Considerations',
  }
  if (special[slug]) return special[slug]

  // Take the last segment and titlecase it
  const lastSegment = slug.split('/').filter(Boolean).pop() || slug
  return lastSegment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Sync Sitemap -> site_pages ===')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log()

  // 1. Build the full page list
  const allPages: SitemapPage[] = [
    ...STATIC_PAGES,
    ...BLOG_SLUGS.map((s) => ({ slug: `/blog/${s}`, type: 'blog' as const })),
    ...GALLERY_SLUGS.map((s) => ({ slug: `/gallery/${s}`, type: 'gallery' as const })),
  ]

  console.log(`Total sitemap pages: ${allPages.length}`)

  // 2. Fetch existing site_pages to know what's already there
  const { data: existing, error: fetchErr } = await supabase
    .from('site_pages')
    .select('slug')

  if (fetchErr) {
    console.error('Failed to fetch existing pages:', fetchErr.message)
    process.exit(1)
  }

  const existingSlugs = new Set((existing || []).map((r: { slug: string }) => r.slug))
  console.log(`Existing site_pages rows: ${existingSlugs.size}`)

  const newPages = allPages.filter((p) => !existingSlugs.has(p.slug))
  const existingPages = allPages.filter((p) => existingSlugs.has(p.slug))

  console.log(`Already in table: ${existingPages.length}`)
  console.log(`New to insert: ${newPages.length}`)
  console.log()

  if (newPages.length === 0) {
    console.log('All sitemap pages are already in site_pages. Nothing to do!')

    // Still update page_type for existing pages to stay in sync
    console.log('\nUpdating page_type for existing pages to match sitemap...')
    let typeUpdates = 0
    for (const page of existingPages) {
      if (!DRY_RUN) {
        const { error } = await supabase
          .from('site_pages')
          .update({ page_type: getPageType(page.type) })
          .eq('slug', page.slug)
        if (error && error.message?.includes('invalid input value') && useExactTypes) {
          useExactTypes = false
          console.log('Switching to fallback page_type mapping...')
        }
        if (!error) typeUpdates++
      }
    }
    console.log(`Updated page_type for ${DRY_RUN ? existingPages.length + ' (dry run)' : typeUpdates} pages`)
    return
  }

  // 3. List new pages
  console.log('New pages to insert:')
  for (const page of newPages) {
    const title = slugToTitle(page.slug)
    console.log(`  ${page.slug} [${page.type}] -> "${title}"`)
  }
  console.log()

  if (DRY_RUN) {
    console.log('DRY RUN -- no changes made.')
    return
  }

  // 4. Insert new pages (try exact types first, fallback if enum is old)
  async function insertPages(pages: SitemapPage[]): Promise<number> {
    const rows = pages.map((page) => ({
      slug: page.slug,
      title: slugToTitle(page.slug),
      page_type: getPageType(page.type),
      migration_status: 'live',
      review_status: 'pending',
      migration_priority: 50,
    }))

    const { data: inserted, error: insertErr } = await supabase
      .from('site_pages')
      .insert(rows as never[])
      .select('slug')

    if (insertErr) {
      // If it's an enum error and we haven't tried fallback yet, switch to fallback
      if (insertErr.message?.includes('invalid input value for enum') && useExactTypes) {
        console.log('New page_type enum values not available. Using fallback mapping...')
        console.log('(Run migration 20260206000002_add_page_type_values.sql for exact types)')
        console.log()
        useExactTypes = false
        return insertPages(pages)  // Retry with fallback types
      }

      console.error('Batch insert failed:', insertErr.message)
      
      // Try one-by-one for partial success
      console.log('Trying individual inserts...')
      let success = 0
      let failed = 0
      for (const row of rows) {
        const { error } = await supabase
          .from('site_pages')
          .insert(row as never)
        if (error) {
          console.error(`  FAIL: ${row.slug} -- ${error.message}`)
          failed++
        } else {
          success++
        }
      }
      console.log(`Individual inserts: ${success} ok, ${failed} failed`)
      return success
    }

    return inserted?.length || 0
  }

  const insertedCount = await insertPages(newPages)
  console.log(`Inserted ${insertedCount} new pages`)

  // 5. Update page_type for existing pages to stay in sync
  console.log('\nUpdating page_type for existing pages to match sitemap...')
  let typeUpdates = 0
  for (const page of existingPages) {
    const { error } = await supabase
      .from('site_pages')
      .update({ page_type: getPageType(page.type) })
      .eq('slug', page.slug)
    if (!error) typeUpdates++
  }
  console.log(`Updated page_type for ${typeUpdates} existing pages`)

  // 6. Final count
  const { count } = await supabase
    .from('site_pages')
    .select('*', { count: 'exact', head: true })

  console.log(`\nFinal site_pages count: ${count}`)
  console.log('Done!')
}

main().catch(console.error)
