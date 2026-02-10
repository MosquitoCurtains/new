/**
 * Audit all 116 BUILD pages from the WordPress CSV.
 * Categorize each into:
 *   A) Already built at exact WP URL
 *   B) Content exists at different URL (needs canonical wrapper)
 *   C) No equivalent (needs fresh build)
 */

import { existsSync } from 'fs'
import { resolve } from 'path'

const APP_DIR = resolve(__dirname, '..', 'src', 'app')

// All BUILD pages from the CSV (116 total, minus 1 skip = 115)
// Format: [wpSlug, title, canonicalNewUrl | null]
// null = page should exist at exact WP URL (Category A)
// string = content exists at this URL instead (Category B)
const BUILD_PAGES: [string, string, string | null][] = [
  // === CATEGORY A: Same URL on both sites ===
  ['/', 'Home', null],
  ['/about', 'About Us', null],
  ['/awning-screen-enclosures', 'Awning Screen Enclosures', null],
  ['/boat-screens', 'Boat Screens', null],
  ['/blog', 'Blog', null],
  ['/camping-net', 'Camping Net', null],
  ['/cart', 'Cart', null],
  ['/checkout', 'Checkout', null],
  ['/clear-vinyl-instant-quote', 'Clear Vinyl Instant Quote', null],
  ['/clear-vinyl-options', 'Clear Vinyl Options', null],
  ['/clear-vinyl-plastic-patio-enclosures', 'Clear Vinyl Plastic Patio Enclosures', null],
  ['/contact', 'Contact', null],
  ['/french-door-screens', 'French Door Screens', null],
  ['/garage-door-screens', 'Garage Door Screens', null],
  ['/gazebo-screen-curtains', 'Gazebo Screen Curtains', null],
  ['/heavy-track', 'Heavy Track', null],
  ['/hvac-chiller-screens', 'HVAC Chiller Screens', null],
  ['/industrial-mesh', 'Industrial Mesh', null],
  ['/industrial-netting', 'Industrial Netting', null],
  ['/install', 'Install', null],
  ['/insulated-curtain-panels', 'Insulated Curtain Panels', null],
  ['/mosquito-curtains-instant-quote', 'Mosquito Curtains Instant Quote', null],
  ['/mosquito-netting', 'Mosquito Netting', null],
  ['/no-see-um-netting-screen', 'No-See-Um Netting Screen', null],
  ['/opportunities', 'Opportunities', null],
  ['/options', 'Options', null],
  ['/order-attachments', 'Order Attachments', null],
  ['/order-mesh-netting-fabrics', 'Order Mesh Netting Fabrics', null],
  ['/order-mesh-panels', 'Order Mesh Panels', null],
  ['/order-raw-netting-attachment-hardware', 'Order Raw Netting Attachment Hardware', null],
  ['/order-tracking', 'Order Tracking', null],
  ['/ordering-clear-vinyl', 'Ordering Clear Vinyl', null],
  ['/outdoor-projection-screens', 'Outdoor Projection Screens', null],
  ['/patio-winterize', 'Patio Winterize', null],
  ['/pergola-screen-curtains', 'Pergola Screen Curtains', null],
  ['/photos', 'Photos', null],
  ['/pollen-protection', 'Pollen Protection', null],
  ['/porch-vinyl-curtains', 'Porch Vinyl Curtains', null],
  ['/porch-vinyl-panels', 'Porch Vinyl Panels', null],
  ['/porch-winterize', 'Porch Winterize', null],
  ['/privacy-policy', 'Privacy Policy', null],
  ['/products', 'Products', null],
  ['/professionals', 'Professionals', null],
  ['/raw-netting-fabric-store', 'Raw Netting Fabric Store', null],
  ['/returns', 'Returns', null],
  ['/roll-up-shade-screens', 'Roll Up Shade Screens', null],
  ['/sale', 'Sale', null],
  ['/satisfaction-guarantee', 'Satisfaction Guarantee', null],
  ['/screen-patio', 'Screen Patio', null],
  ['/screened-in-decks', 'Screened in Decks', null],
  ['/screened-porch', 'Screened Porch', null],
  ['/screened-porch-enclosures', 'Screen Porch Enclosures', null],
  ['/shade-screen-mesh', 'Shade Screen Mesh', null],
  ['/shipping', 'Shipping', null],
  ['/tent-screens', 'Tent Screens', null],
  ['/theater-scrims', 'Theater Scrims', null],
  ['/theatre-scrim', 'Theatre Scrim', null],
  ['/videos', 'Videos', null],
  ['/weather-curtains', 'Weather Curtains', null],
  ['/work-with-a-planner', 'Work With A Planner', null],
  ['/yardistry-gazebo-curtains', 'Yardistry Gazebo Curtains', null],

  // === CATEGORY B: Different slug on new site (needs canonical wrapper) ===
  // Plan section
  ['/plan-screen-porch', 'Plan Screen Porch', '/plan'],
  ['/plan-screen-porch/magnetic-doorways', 'Magnetic Doorways', '/plan/magnetic-doorways'],
  ['/plan-screen-porch/mesh-and-colors', 'Mesh and Colors', '/plan/mesh-colors'],
  ['/plan-screen-porch/outdoor-curtain-tracking', 'Outdoor Curtain Tracking', '/plan/tracking'],
  ['/plan-screen-porch/how-to-order', 'How To Order', '/plan/how-to-order'],
  ['/plan-screen-porch/sealing-the-base', 'Sealing The Base', '/plan/sealing-base'],
  ['/plan-screen-porch/free-standing', 'Free Standing', '/plan/free-standing'],
  ['/plan-screen-porch/tents-and-awnings', 'Tents and Awnings', '/plan/tents-awnings'],
  ['/plan-screen-porch/single-sided-exposure', 'Single Sided Exposure', '/plan/1-sided'],
  ['/plan-screen-porch/2-sided-exposure', '2 Sided Exposure', '/plan/2-sided'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-tracking', '2S Regular Tracking', '/plan/2-sided/regular-tracking'],
  ['/plan-screen-porch/2-sided-exposure/regular-columns-velcro', '2S Regular Velcro', '/plan/2-sided/regular-velcro'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', '2S Irregular Tracking', '/plan/2-sided/irregular-tracking'],
  ['/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', '2S Irregular Velcro', '/plan/2-sided/irregular-velcro'],
  ['/plan-screen-porch/3-sided-exposure', '3 Sided Exposure', '/plan/3-sided'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-tracking', '3S Regular Tracking', '/plan/3-sided/regular-tracking'],
  ['/plan-screen-porch/3-sided-exposure/regular-columns-velcro', '3S Regular Velcro', '/plan/3-sided/regular-velcro'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', '3S Irregular Tracking', '/plan/3-sided/irregular-tracking'],
  ['/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', '3S Irregular Velcro', '/plan/3-sided/irregular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure', '4 Plus Sided Exposure', '/plan/4-sided'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', '4S Regular Tracking', '/plan/4-sided/regular-tracking'],
  ['/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', '4S Regular Velcro', '/plan/4-sided/regular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', '4S Irregular Velcro', '/plan/4-sided/irregular-velcro'],
  ['/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', '4S Irregular Tracking', '/plan/4-sided/irregular-tracking'],
  // Care / FAQ / Install / Reviews
  ['/caring-for-clear-vinyl', 'Caring For Clear Vinyl', '/care/clear-vinyl'],
  ['/caring-for-mosquito-curtains', 'Caring For Mosquito Curtains', '/care/mosquito-curtains'],
  ['/clear-vinyl-faq', 'CV FAQ', '/faq/clear-vinyl'],
  ['/faqs', "FAQ's", '/faq'],
  ['/mosquito-curtains-faq', 'MC FAQ', '/faq/mosquito-curtains'],
  ['/mosquito-curtains-reviews', 'Mosquito Curtains Reviews', '/reviews'],
  ['/mosquito-curtains-tracking-installation', 'MC Tracking Installation', '/install/tracking'],
  ['/mosquito-curtains-velcro-installation', 'MC Velcro Installation', '/install/velcro'],
  ['/clear-vinyl-installation', 'Clear Vinyl Installation', '/install/clear-vinyl'],
  ['/how-to-order', 'How To Order', '/plan/how-to-order'],
  // Raw Netting
  ['/mosquito-net', 'Mosquito Net', '/raw-netting/mosquito-net'],
  ['/mosquito-netting/all-netting-and-attachment-hardware', 'Netting Attachment Fasteners', '/raw-netting/hardware'],
  ['/mosquito-netting/fasteners-and-rigging-ideas', 'Fasteners and Rigging Ideas', '/raw-netting/rigging'],
  ['/mosquito-netting/why-us-for-raw-netting', 'Why Us For Raw Netting', '/raw-netting/why-us'],
  ['/mosquito-netting/let-us-make-it-for-you', 'Mosquito Netting Ideas', '/raw-netting/custom'],
  // Clear Vinyl Options
  ['/apron-colors-to-choose-from', 'Apron Colors', '/options/clear-vinyl/apron-colors'],
  ['/clear-vinyl-self-installation-advantages', 'CV Self-Installation Advantages', '/options/clear-vinyl/diy'],
  ['/what-can-go-wrong-with-clear-vinyl', 'What Can Go Wrong With CV', '/options/clear-vinyl/considerations'],
  ['/what-makes-our-clear-vinyl-product-better', 'What Makes Our CV Better', '/options/clear-vinyl/quality'],
  // Other
  ['/tentscreenpanels', 'Tent Screens (old slug)', '/tent-screens'],
  ['/contractor', 'Contractor', '/contractors'],
  ['/client-uploads', 'Client Uploads', '/uploads'],
  ['/order-mosquito-curtains', 'Order Mosquito Curtains', '/order/mosquito-curtains'],
  ['/my-account', 'My Account', '/my-orders'],
  ['/project-series', 'Project Series', '/projects'],
  ['/project-planning', 'Project Planning', '/plan'],

  // === CATEGORY C: No equivalent, needs fresh build ===
  // (canonicalNewUrl = '__BUILD__' as marker)
  ['/mosquito-curtain-planning-session', 'MC Planning Session', '__BUILD__'],
  ['/clear-vinyl-planning-session', 'CV Planning Session', '__BUILD__'],
  ['/project-series/clear-vinyl-project-87444', 'CV Project 87444', '__BUILD__'],
  ['/404-error-page', '404 Error Page', '__BUILD__'],
  ['/form-entry', 'Form Entry', '__BUILD__'],
  ['/prepare', 'Prepare', '__BUILD__'],
]

function slugToDir(slug: string): string {
  if (slug === '/') return ''
  return slug.replace(/^\//, '')
}

function pageExists(slug: string): boolean {
  const dir = slugToDir(slug)
  const pagePath = resolve(APP_DIR, dir, 'page.tsx')
  return existsSync(pagePath)
}

const catA: string[] = []
const catAMissing: string[] = []
const catB: [string, string, string][] = []
const catBExists: string[] = []
const catC: [string, string][] = []

for (const [wpSlug, title, canonical] of BUILD_PAGES) {
  if (canonical === '__BUILD__') {
    catC.push([wpSlug, title])
  } else if (canonical === null) {
    if (pageExists(wpSlug)) {
      catA.push(wpSlug)
    } else {
      catAMissing.push(wpSlug)
    }
  } else {
    if (pageExists(wpSlug)) {
      catBExists.push(wpSlug)
    }
    catB.push([wpSlug, title, canonical])
  }
}

console.log('=== BUILD PAGE AUDIT ===\n')
console.log(`Category A (exact match, already built): ${catA.length}`)
if (catAMissing.length) {
  console.log(`  WARNING: ${catAMissing.length} Cat A pages MISSING page.tsx:`)
  catAMissing.forEach(s => console.log(`    MISSING: ${s}`))
}
console.log(`Category B (needs canonical wrapper): ${catB.length}`)
if (catBExists.length) {
  console.log(`  NOTE: ${catBExists.length} Cat B pages already have page.tsx (may need updating):`)
  catBExists.forEach(s => console.log(`    EXISTS: ${s}`))
}
console.log(`Category C (needs fresh build): ${catC.length}`)
catC.forEach(([s, t]) => console.log(`  BUILD: ${s} -- "${t}"`))
console.log(`\nTotal: ${catA.length + catB.length + catC.length}`)
