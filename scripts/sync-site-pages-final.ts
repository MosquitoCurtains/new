/**
 * Final site_pages sync:
 * 1. Delete 28 orphaned rows (phantom pages + wrong-slug blog posts)
 * 2. Insert all BUILD pages at their exact WP URLs
 * 3. Populate duplicate_canonical_url for canonical wrapper pages
 */
import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(__dirname, '..', '.env.local') })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// 28 orphaned rows to delete
const ORPHANED_SLUGS = [
  // 14 phantom pages that never existed
  '/attachment-guide', '/bug-off-screen-doors', '/clear-vinyl-mesh-combo',
  '/horse-stall-screens', '/instant-quote', '/measure-guide',
  '/mosquito-netting-fabric', '/outdoor-curtains', '/patio-curtains',
  '/porch-curtains', '/porch-enclosure', '/retractable-screens',
  '/sample-kit', '/terms-of-service',
  // 14 wrong-slug blog posts (correct slugs already exist)
  '/blog/airlines-humor', '/blog/beautiful-porches', '/blog/deck-enclosures',
  '/blog/gazebo-history', '/blog/golf-course', '/blog/martha-stewart',
  '/blog/mosquito-capitol', '/blog/mosquito-history', '/blog/our-story',
  '/blog/pollen-porches', '/blog/projection-screens', '/blog/protection-summary',
  '/blog/storm-proof', '/blog/west-nile',
]

// All BUILD pages that need to exist in site_pages
// [slug, title, pageType, duplicateCanonicalUrl | null]
const BUILD_PAGES: [string, string, string, string | null][] = [
  // Category A: exact match (61)
  ['/', 'Home', 'homepage', null],
  ['/about', 'About Us', 'informational', null],
  ['/awning-screen-enclosures', 'Awning Screen Enclosures', 'product_landing', null],
  ['/boat-screens', 'Boat Screens', 'product_landing', null],
  ['/blog', 'Blog', 'informational', null],
  ['/camping-net', 'Camping Net', 'product_landing', null],
  ['/cart', 'Cart', 'ecommerce', null],
  ['/checkout', 'Checkout', 'ecommerce', null],
  ['/clear-vinyl-instant-quote', 'Clear Vinyl Instant Quote', 'ecommerce', null],
  ['/clear-vinyl-options', 'Clear Vinyl Options', 'informational', null],
  ['/clear-vinyl-plastic-patio-enclosures', 'Clear Vinyl Plastic Patio Enclosures', 'product_landing', null],
  ['/contact', 'Contact', 'support', null],
  ['/french-door-screens', 'French Door Screens', 'product_landing', null],
  ['/garage-door-screens', 'Garage Door Screens', 'product_landing', null],
  ['/gazebo-screen-curtains', 'Gazebo Screen Curtains', 'product_landing', null],
  ['/heavy-track', 'Heavy Track', 'product_landing', null],
  ['/hvac-chiller-screens', 'HVAC Chiller Screens', 'product_landing', null],
  ['/industrial-mesh', 'Industrial Mesh', 'product_landing', null],
  ['/industrial-netting', 'Industrial Netting', 'product_landing', null],
  ['/install', 'Installation Hub', 'informational', null],
  ['/insulated-curtain-panels', 'Insulated Curtain Panels', 'product_landing', null],
  ['/mosquito-curtains-instant-quote', 'Mosquito Curtains Instant Quote', 'ecommerce', null],
  ['/mosquito-netting', 'Mosquito Netting', 'product_landing', null],
  ['/no-see-um-netting-screen', 'No-See-Um Netting Screen', 'product_landing', null],
  ['/opportunities', 'Opportunities', 'informational', null],
  ['/options', 'Options Hub', 'informational', null],
  ['/order-attachments', 'Order Attachments', 'ecommerce', null],
  ['/order-mesh-netting-fabrics', 'Order Mesh Netting Fabrics', 'ecommerce', null],
  ['/order-mesh-panels', 'Order Mesh Panels', 'ecommerce', null],
  ['/order-raw-netting-attachment-hardware', 'Order Raw Netting Hardware', 'ecommerce', null],
  ['/order-tracking', 'Order Tracking', 'ecommerce', null],
  ['/ordering-clear-vinyl', 'Ordering Clear Vinyl', 'ecommerce', null],
  ['/outdoor-projection-screens', 'Outdoor Projection Screens', 'product_landing', null],
  ['/patio-winterize', 'Patio Winterize', 'product_landing', null],
  ['/pergola-screen-curtains', 'Pergola Screen Curtains', 'product_landing', null],
  ['/photos', 'Photos', 'informational', null],
  ['/pollen-protection', 'Pollen Protection', 'product_landing', null],
  ['/porch-vinyl-curtains', 'Porch Vinyl Curtains', 'product_landing', null],
  ['/porch-vinyl-panels', 'Porch Vinyl Panels', 'product_landing', null],
  ['/porch-winterize', 'Porch Winterize', 'product_landing', null],
  ['/privacy-policy', 'Privacy Policy', 'legal', null],
  ['/products', 'Products', 'informational', null],
  ['/professionals', 'Professionals', 'informational', null],
  ['/raw-netting-fabric-store', 'Raw Netting Fabric Store', 'ecommerce', null],
  ['/returns', 'Returns', 'support', null],
  ['/roll-up-shade-screens', 'Roll Up Shade Screens', 'product_landing', null],
  ['/sale', 'Sale', 'marketing', null],
  ['/satisfaction-guarantee', 'Satisfaction Guarantee', 'support', null],
  ['/screen-patio', 'Screen Patio', 'seo_landing', null],
  ['/screened-in-decks', 'Screened in Decks', 'seo_landing', null],
  ['/screened-porch', 'Screened Porch', 'seo_landing', null],
  ['/screened-porch-enclosures', 'Screen Porch Enclosures', 'product_landing', null],
  ['/shade-screen-mesh', 'Shade Screen Mesh', 'product_landing', null],
  ['/shipping', 'Shipping', 'support', null],
  ['/tent-screens', 'Tent Screens', 'product_landing', null],
  ['/theater-scrims', 'Theater Scrims', 'product_landing', null],
  ['/theatre-scrim', 'Theatre Scrim', 'product_landing', null],
  ['/videos', 'Videos', 'informational', null],
  ['/weather-curtains', 'Weather Curtains', 'product_landing', null],
  ['/work-with-a-planner', 'Work With A Planner', 'support', null],
  ['/yardistry-gazebo-curtains', 'Yardistry Gazebo Curtains', 'product_landing', null],

  // Category B: canonical wrappers (50)
  ['/plan-screen-porch', 'Plan Screen Porch', 'informational', '/plan'],
  ['/plan-screen-porch/magnetic-doorways', 'Magnetic Doorways', 'informational', '/plan/magnetic-doorways'],
  ['/plan-screen-porch/mesh-and-colors', 'Mesh and Colors', 'informational', '/plan/mesh-colors'],
  ['/plan-screen-porch/outdoor-curtain-tracking', 'Outdoor Curtain Tracking', 'informational', '/plan/tracking'],
  ['/plan-screen-porch/how-to-order', 'How To Order (Plan)', 'informational', '/plan/how-to-order'],
  ['/plan-screen-porch/sealing-the-base', 'Sealing The Base', 'informational', '/plan/sealing-base'],
  ['/plan-screen-porch/free-standing', 'Free Standing', 'informational', '/plan/free-standing'],
  ['/plan-screen-porch/tents-and-awnings', 'Tents and Awnings', 'informational', '/plan/tents-awnings'],
  ['/plan-screen-porch/single-sided-exposure', 'Single Sided Exposure', 'informational', '/plan/1-sided'],
  ['/plan-screen-porch/2-sided-exposure', '2 Sided Exposure', 'informational', '/plan/2-sided'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-tracking', '2S Regular Tracking', 'informational', '/plan/2-sided/regular-tracking'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-velcro', '2S Regular Velcro', 'informational', '/plan/2-sided/regular-velcro'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', '2S Irregular Tracking', 'informational', '/plan/2-sided/irregular-tracking'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', '2S Irregular Velcro', 'informational', '/plan/2-sided/irregular-velcro'],
  ['/plan-screen-porch/3-sided-exposure', '3 Sided Exposure', 'informational', '/plan/3-sided'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-tracking', '3S Regular Tracking', 'informational', '/plan/3-sided/regular-tracking'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-velcro', '3S Regular Velcro', 'informational', '/plan/3-sided/regular-velcro'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', '3S Irregular Tracking', 'informational', '/plan/3-sided/irregular-tracking'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', '3S Irregular Velcro', 'informational', '/plan/3-sided/irregular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure', '4+ Sided Exposure', 'informational', '/plan/4-sided'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', '4S Regular Tracking', 'informational', '/plan/4-sided/regular-tracking'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', '4S Regular Velcro', 'informational', '/plan/4-sided/regular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', '4S Irregular Velcro', 'informational', '/plan/4-sided/irregular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', '4S Wrap-Around Irregular Tracking', 'informational', '/plan/4-sided/irregular-tracking'],
  ['/caring-for-clear-vinyl', 'Caring For Clear Vinyl', 'informational', '/care/clear-vinyl'],
  ['/caring-for-mosquito-curtains', 'Caring For Mosquito Curtains', 'informational', '/care/mosquito-curtains'],
  ['/clear-vinyl-faq', 'Clear Vinyl FAQ', 'informational', '/faq/clear-vinyl'],
  ['/faqs', 'FAQs', 'informational', '/faq'],
  ['/mosquito-curtains-faq', 'Mosquito Curtains FAQ', 'informational', '/faq/mosquito-curtains'],
  ['/mosquito-curtains-reviews', 'Mosquito Curtains Reviews', 'informational', '/reviews'],
  ['/mosquito-curtains-tracking-installation', 'MC Tracking Installation', 'informational', '/install/tracking'],
  ['/mosquito-curtains-velcro-installation', 'MC Velcro Installation', 'informational', '/install/velcro'],
  ['/clear-vinyl-installation', 'Clear Vinyl Installation', 'informational', '/install/clear-vinyl'],
  ['/how-to-order', 'How To Order', 'informational', '/plan/how-to-order'],
  ['/mosquito-net', 'Mosquito Net', 'product_landing', '/raw-netting/mosquito-net'],
  ['/mosquito-netting/all-netting-and-attachment-hardware', 'Netting Attachment Hardware', 'product_landing', '/raw-netting/hardware'],
  ['/mosquito-netting/fasteners-and-rigging-ideas', 'Fasteners and Rigging Ideas', 'product_landing', '/raw-netting/rigging'],
  ['/mosquito-netting/why-us-for-raw-netting', 'Why Us For Raw Netting', 'product_landing', '/raw-netting/why-us'],
  ['/mosquito-netting/let-us-make-it-for-you', 'Custom Netting', 'product_landing', '/raw-netting/custom'],
  ['/apron-colors-to-choose-from', 'Apron Colors', 'informational', '/options/clear-vinyl/apron-colors'],
  ['/clear-vinyl-self-installation-advantages', 'CV Self-Installation Advantages', 'informational', '/options/clear-vinyl/diy'],
  ['/what-can-go-wrong-with-clear-vinyl', 'What Can Go Wrong With CV', 'informational', '/options/clear-vinyl/considerations'],
  ['/what-makes-our-clear-vinyl-product-better', 'What Makes Our CV Better', 'informational', '/options/clear-vinyl/quality'],
  ['/tentscreenpanels', 'Tent Screen Panels', 'product_landing', '/tent-screens'],
  ['/contractor', 'Contractor', 'informational', '/contractors'],
  ['/client-uploads', 'Client Uploads', 'utility', '/uploads'],
  ['/order-mosquito-curtains', 'Order Mosquito Curtains', 'ecommerce', '/order/mosquito-curtains'],
  ['/my-account', 'My Account', 'ecommerce', '/my-orders'],
  ['/project-series', 'Project Series', 'informational', '/projects'],

  // Category C: fresh builds (7 including project-planning which was rebuilt)
  ['/mosquito-curtain-planning-session', 'MC Planning Session', 'informational', null],
  ['/clear-vinyl-planning-session', 'CV Planning Session', 'informational', null],
  ['/project-planning', 'Project Planning', 'informational', null],
  ['/project-series/clear-vinyl-project-87444', 'CV Project #87444', 'informational', null],
  ['/404-error-page', '404 Error Page', 'utility', null],
  ['/form-entry', 'Form Entry', 'utility', null],
  ['/prepare', 'Prepare', 'utility', null],
]

async function main() {
  console.log('=== Final site_pages Sync ===\n')

  // Step 1: Delete orphaned rows
  console.log('Step 1: Deleting orphaned rows...')
  let deleted = 0
  for (const slug of ORPHANED_SLUGS) {
    const { error, count } = await supabase
      .from('site_pages')
      .delete({ count: 'exact' })
      .eq('slug', slug)
    if (error) {
      console.error(`  FAIL delete ${slug}: ${error.message}`)
    } else if (count && count > 0) {
      console.log(`  DELETED: ${slug}`)
      deleted++
    }
  }
  console.log(`  Deleted: ${deleted}\n`)

  // Step 2: Get existing slugs
  const { data: existing } = await supabase.from('site_pages').select('slug')
  const existingSlugs = new Set((existing || []).map((r: any) => r.slug))

  // Step 3: Insert missing BUILD pages + update duplicate_canonical_url
  console.log('Step 2: Inserting/updating BUILD pages...')
  let inserted = 0
  let updated = 0

  for (const [slug, title, pageType, canonical] of BUILD_PAGES) {
    if (!existingSlugs.has(slug)) {
      // Insert new
      const { error } = await supabase.from('site_pages').insert({
        slug,
        title,
        page_type: pageType,
        migration_status: 'live',
        review_status: 'pending',
        migration_priority: 5,
        duplicate_canonical_url: canonical,
      } as never)
      if (error) {
        // Try without duplicate_canonical_url if column doesn't exist yet
        if (error.message?.includes('duplicate_canonical_url')) {
          const { error: e2 } = await supabase.from('site_pages').insert({
            slug, title, page_type: pageType,
            migration_status: 'live', review_status: 'pending', migration_priority: 5,
          } as never)
          if (e2) console.error(`  FAIL insert ${slug}: ${e2.message}`)
          else { console.log(`  INSERT (no canonical col): ${slug}`); inserted++ }
        } else {
          console.error(`  FAIL insert ${slug}: ${error.message}`)
        }
      } else {
        console.log(`  INSERT: ${slug}${canonical ? ` (canonical: ${canonical})` : ''}`)
        inserted++
      }
    } else if (canonical) {
      // Update existing row with canonical URL
      const { error } = await supabase
        .from('site_pages')
        .update({ duplicate_canonical_url: canonical } as never)
        .eq('slug', slug)
      if (error) {
        if (!error.message?.includes('duplicate_canonical_url')) {
          console.error(`  FAIL update ${slug}: ${error.message}`)
        }
        // Silently skip if column doesn't exist yet
      } else {
        updated++
      }
    }
  }

  console.log(`  Inserted: ${inserted} | Canonical updated: ${updated}\n`)

  // Step 4: Final count
  const { count } = await supabase.from('site_pages').select('*', { count: 'exact', head: true })
  console.log(`Final site_pages count: ${count}`)
}

main().catch(console.error)
