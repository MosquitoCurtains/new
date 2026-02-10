/**
 * Centralized Redirect Map
 *
 * All 301 redirects from old WordPress URLs to new Next.js routes.
 * Imported by next.config.ts — keeps the config clean and this file auditable.
 *
 * Source: "Checked URLS Mosquito Curtains.csv" — all rows with Page Instructions = "REDIRECT"
 *
 * Categories:
 *   - Product pages (/product/*) -> /products
 *   - Gallery pages (/project-gallery/*) -> /gallery
 *   - Blog root-level slugs -> /blog/*
 *   - Sales admin pages -> /admin/sales
 *   - Ad landing pages -> / (already have new routes)
 *   - Misc legacy URLs
 */

export interface RedirectEntry {
  source: string
  destination: string
  permanent: boolean
  has?: { type: 'query' | 'header' | 'cookie'; key: string; value?: string }[]
}

export const REDIRECTS: RedirectEntry[] = [
  // =========================================================================
  // PRODUCT PAGES -> /products
  // =========================================================================

  // Attachment & Track Hardware
  { source: '/product/attachment-items-raw-netting-mobile', destination: '/products', permanent: true },
  { source: '/product/attachment-items-raw-netting', destination: '/products', permanent: true },
  { source: '/product/attachment-items-sales', destination: '/products', permanent: true },
  { source: '/product/attachment-items', destination: '/products', permanent: true },
  { source: '/product/fully-refundable-industrial-snap-tool', destination: '/products', permanent: true },
  { source: '/product/heavy-track', destination: '/products', permanent: true },
  { source: '/product/raw-netting-attachment-items', destination: '/products', permanent: true },
  { source: '/product/standard-track', destination: '/products', permanent: true },

  // Elastic Cord
  { source: '/product/black-elastic-cord', destination: '/products', permanent: true },
  { source: '/product/white-elastic-cord', destination: '/products', permanent: true },

  // Magnetic Doorways
  { source: '/product/block-magnets', destination: '/products', permanent: true },
  { source: '/product/extra-strength-ring-magnets', destination: '/products', permanent: true },
  { source: '/product/fiberglass-rod-clips', destination: '/products', permanent: true },
  { source: '/product/fiberglass-rods', destination: '/products', permanent: true },

  // Sealing Sides
  { source: '/product/black-adhesive-snaps', destination: '/products', permanent: true },
  { source: '/product/black-marine-snaps', destination: '/products', permanent: true },
  { source: '/product/clear-adhesive-snaps', destination: '/products', permanent: true },
  { source: '/product/rubber-washers-bags-of-10', destination: '/products', permanent: true },
  { source: '/product/white-adhesive-snaps', destination: '/products', permanent: true },
  { source: '/product/white-marine-snaps', destination: '/products', permanent: true },

  // Hidden Products
  { source: '/product/belted-ribs', destination: '/products', permanent: true },
  { source: '/product/tether-clips', destination: '/products', permanent: true },
  { source: '/product/zippered-stucco-strip', destination: '/products', permanent: true },
  { source: '/product/whole-roll-black-hook-velcro', destination: '/products', permanent: true },
  { source: '/product/whole-roll-white-hook-velcro', destination: '/products', permanent: true },

  // Other Items
  { source: '/product/1-inch-screw-studs', destination: '/products', permanent: true },
  { source: '/product/2-inch-screw-studs', destination: '/products', permanent: true },
  { source: '/product/black-adhesive-hook-velcro', destination: '/products', permanent: true },
  { source: '/product/fastwax-cleaner', destination: '/products', permanent: true },
  { source: '/product/l-screws', destination: '/products', permanent: true },
  { source: '/product/tie-up-straps', destination: '/products', permanent: true },
  { source: '/product/white-adhesive-hook-velcro', destination: '/products', permanent: true },
  { source: '/product/panel-to-panel-snaps', destination: '/products', permanent: true },
  { source: '/product/black-webbing', destination: '/products', permanent: true },
  { source: '/product/white-webbing', destination: '/products', permanent: true },

  // Panels
  { source: '/product/adjustment-copy', destination: '/products', permanent: true },
  { source: '/product/adjustment-negative', destination: '/products', permanent: true },
  { source: '/product/adjustment', destination: '/products', permanent: true },
  { source: '/product/clear-vinyl-enclosure-product', destination: '/products', permanent: true },
  { source: '/product/clear-vinyl-panels-2', destination: '/products', permanent: true },
  { source: '/product/clear-vinyl-panels', destination: '/products', permanent: true },
  { source: '/product/clear-vinyl-plastic-face-shield', destination: '/products', permanent: true },
  { source: '/product/credit-for-sales-tax-exemption', destination: '/products', permanent: true },
  { source: '/product/cv-panels', destination: '/products', permanent: true },
  { source: '/product/heavy-mosquito-mesh-gs', destination: '/products', permanent: true },
  { source: '/product/heavy-mosquito-mesh-panels', destination: '/products', permanent: true },
  { source: '/product/mesh-panels-store', destination: '/products', permanent: true },
  { source: '/product/mesh-panels', destination: '/products', permanent: true },
  { source: '/product/no-see-um-mesh-panels', destination: '/products', permanent: true },
  { source: '/product/panels', destination: '/products', permanent: true },
  { source: '/product/project-planner', destination: '/products', permanent: true },
  { source: '/product/raw-heavy-mosquito-mesh-2', destination: '/products', permanent: true },
  { source: '/product/raw-heavy-mosquito-mesh', destination: '/products', permanent: true },
  { source: '/product/raw-industrial-mesh', destination: '/products', permanent: true },
  { source: '/product/raw-no-see-um-mesh-mobile', destination: '/products', permanent: true },
  { source: '/product/raw-no-see-um-mesh', destination: '/products', permanent: true },
  { source: '/product/raw-shade-mesh-mobile', destination: '/products', permanent: true },
  { source: '/product/raw-shade-mesh', destination: '/products', permanent: true },
  { source: '/product/raw-shark-tooth-scrim-mobile', destination: '/products', permanent: true },
  { source: '/product/raw-shark-tooth-scrim', destination: '/products', permanent: true },
  { source: '/product/raw-standard-mosquito-mesh-mobile', destination: '/products', permanent: true },
  { source: '/product/roll-up-shade-mesh-screens', destination: '/products', permanent: true },
  { source: '/product/screen-porch-enclosure-product', destination: '/products', permanent: true },
  { source: '/product/scrim-panels', destination: '/products', permanent: true },
  { source: '/product/shade-mesh-panels', destination: '/products', permanent: true },
  { source: '/product/stucco-strips', destination: '/products', permanent: true },
  { source: '/product/zippered-stucco-strips', destination: '/products', permanent: true },

  // Old Raw Netting Products
  { source: '/product/heavy-mosquito-mesh-old', destination: '/products', permanent: true },
  { source: '/product/no-see-um-mesh-old', destination: '/products', permanent: true },
  { source: '/product/scrim-material-old', destination: '/products', permanent: true },
  { source: '/product/shade-mesh-120-roll-old', destination: '/products', permanent: true },
  { source: '/product/standard-mosquito-mesh-old', destination: '/products', permanent: true },

  // Track Hardware
  { source: '/product/heavy-track-hardware', destination: '/products', permanent: true },
  { source: '/product/standard-tracking-hardware-old', destination: '/products', permanent: true },
  { source: '/product/tracking-color', destination: '/products', permanent: true },
  { source: '/product/velcro-color', destination: '/products', permanent: true },

  // Misc Products
  { source: '/product/135-degree-curve-heavy', destination: '/products', permanent: true },
  { source: '/product/135-degree-curve-standard', destination: '/products', permanent: true },
  { source: '/product/7ft-straight-track-heavy', destination: '/products', permanent: true },
  { source: '/product/7ft-straight-track-standard', destination: '/products', permanent: true },
  { source: '/product/90-degree-curve-heavy', destination: '/products', permanent: true },
  { source: '/product/90-degree-curve-standard', destination: '/products', permanent: true },
  { source: '/product/camping-net', destination: '/products', permanent: true },
  { source: '/product/canadian-tariff', destination: '/products', permanent: true },
  { source: '/product/carriers-heavy', destination: '/products', permanent: true },
  { source: '/product/carriers-standard', destination: '/products', permanent: true },
  { source: '/product/end-cap-heavy', destination: '/products', permanent: true },
  { source: '/product/end-cap-standard', destination: '/products', permanent: true },
  { source: '/product/mosquito-curtain', destination: '/products', permanent: true },
  { source: '/product/splice-heavy', destination: '/products', permanent: true },
  { source: '/product/splice-standard', destination: '/products', permanent: true },
  { source: '/product/test-panel-1', destination: '/products', permanent: true },
  { source: '/product/test-panel-2', destination: '/products', permanent: true },

  // =========================================================================
  // GALLERY PAGES -> /gallery
  // =========================================================================
  { source: '/project-gallery', destination: '/gallery', permanent: true },
  { source: '/project-gallery/clear-vinyl-plastic-enclosures', destination: '/gallery/clear-vinyl', permanent: true },
  { source: '/project-gallery/mosquito-netting-1', destination: '/gallery/mosquito-netting', permanent: true },
  { source: '/project-gallery/black-netting-2', destination: '/gallery/black-netting', permanent: true },
  { source: '/project-gallery/black-netting-3', destination: '/gallery/black-netting', permanent: true },
  { source: '/project-gallery/black-netting', destination: '/gallery/black-netting', permanent: true },
  { source: '/project-gallery/white-netting-2', destination: '/gallery/white-netting', permanent: true },
  { source: '/project-gallery/white-netting-3', destination: '/gallery/white-netting', permanent: true },
  { source: '/project-gallery/white-netting', destination: '/gallery/white-netting', permanent: true },
  { source: '/project-gallery/mosquito-netting-2', destination: '/gallery', permanent: true },
  { source: '/project-gallery/mosquito-netting-3', destination: '/gallery', permanent: true },
  { source: '/project-gallery/mosquito-netting-4', destination: '/gallery', permanent: true },
  { source: '/project-gallery/mosquito-netting-5', destination: '/gallery', permanent: true },

  // =========================================================================
  // BLOG ROOT-LEVEL SLUGS -> /blog/*
  // =========================================================================
  { source: '/a-new-mulligan-blocker-for-golf-course-residents', destination: '/blog/mulligan-blocker', permanent: true },
  { source: '/a-summary-of-mosquito-protection-ideas', destination: '/blog/mosquito-protection-summary', permanent: true },
  { source: '/a-very-cool-project-for-kids-theyll-remember-it-forever', destination: '/blog/kids-project', permanent: true },
  { source: '/air-lines-explore-screen-doors-on-aircraft', destination: '/blog/airlines-screen-doors', permanent: true },
  { source: '/bond-sales-mosquito-curtains-and-a-rodeo-ghost', destination: '/blog/bond-sales-story', permanent: true },
  { source: '/dear-martha-stewart', destination: '/blog/dear-martha-stewart', permanent: true },
  { source: '/finally-a-new-storm-proof-screening', destination: '/blog/storm-proof-screening', permanent: true },
  { source: '/gazebos-then-and-now', destination: '/blog/gazebos-then-and-now', permanent: true },
  { source: '/history-of-mans-deadliest-killer', destination: '/blog/history-of-mosquitoes', permanent: true },
  { source: '/how-to-cope-with-pollen-in-porches-and-gazebos', destination: '/blog/pollen-and-porches', permanent: true },
  { source: '/is-your-porch-too-beautiful-to-screen', destination: '/blog/porch-too-beautiful-to-screen', permanent: true },
  { source: '/lasting-effects-of-the-west-nile-virus', destination: '/blog/west-nile-virus-effects', permanent: true },
  { source: '/mosquito-enclosures-for-decks', destination: '/blog/mosquito-enclosures-for-decks', permanent: true },
  { source: '/teaching-children-that-work-is-good', destination: '/blog/work-is-good', permanent: true },
  { source: '/where-is-the-mosquito-capitol', destination: '/blog/mosquito-capitol-of-america', permanent: true },
  { source: '/why-do-mosquitoes-seem-more-intense-in-northern-climates', destination: '/blog/northern-mosquitoes', permanent: true },

  // =========================================================================
  // SALES ADMIN PAGES -> /admin/sales
  // =========================================================================
  { source: '/mc-sales', destination: '/admin/mc-sales', permanent: true },
  { source: '/ru-sales', destination: '/admin/ru-sales', permanent: true },
  { source: '/sales', destination: '/admin/sales', permanent: true },
  { source: '/mp-sales', destination: '/admin/sales', permanent: true },
  { source: '/cp-sales', destination: '/admin/sales', permanent: true },
  { source: '/cv-sales', destination: '/admin/sales', permanent: true },
  { source: '/rn-sales', destination: '/admin/sales', permanent: true },
  { source: '/sp-sales', destination: '/admin/sales', permanent: true },
  { source: '/ta-sales', destination: '/admin/sales', permanent: true },
  { source: '/sales/adjustments', destination: '/admin/sales', permanent: true },
  { source: '/sales/attachments', destination: '/admin/sales', permanent: true },
  { source: '/sales/cv', destination: '/admin/sales', permanent: true },
  { source: '/sales/heavy-track', destination: '/admin/sales', permanent: true },
  { source: '/sales/mc', destination: '/admin/sales', permanent: true },
  { source: '/sales/scrim', destination: '/admin/sales', permanent: true },
  { source: '/sales/standard-tracking', destination: '/admin/sales', permanent: true },

  // =========================================================================
  // AD LANDING PAGES -> / (pages deleted, now redirects)
  // =========================================================================
  { source: '/fb', destination: '/', permanent: true },
  { source: '/fb/cv-quote', destination: '/', permanent: true },
  { source: '/fb/mc-quote', destination: '/', permanent: true },
  { source: '/reddit', destination: '/', permanent: true },
  { source: '/reddit/mc-quote', destination: '/', permanent: true },

  // =========================================================================
  // LEGACY / DEPRECATED PAGES -> /
  // =========================================================================
  { source: '/applications', destination: '/', permanent: true },
  { source: '/calculator-test', destination: '/', permanent: true },
  { source: '/clear-vinyl-plastic-face-shields', destination: '/', permanent: true },
  { source: '/covid-19', destination: '/', permanent: true },
  { source: '/cv-redesign-1-11-23', destination: '/', permanent: true },
  { source: '/plan-unique-applications', destination: '/', permanent: true },
  { source: '/pollen-protection', destination: '/', permanent: true },
  { source: '/products-test', destination: '/', permanent: true },
  { source: '/speed-test', destination: '/', permanent: true },
  { source: '/wordpress-seo-premium-16-7-zip', destination: '/', permanent: true },
  { source: '/wpms-html-sitemap', destination: '/', permanent: true },

  // =========================================================================
  // MISC LEGACY -> APPROPRIATE NEW PAGES
  // =========================================================================
  { source: '/shop', destination: '/products', permanent: true },
  { source: '/screen-porch-enclosures-gs', destination: '/screened-porch-enclosures', permanent: true },

  // Outdoor Projection Screens blog post (root-level redirect)
  // Note: /outdoor-projection-screens BUILD page exists, this is the blog alt
  { source: '/outdoor-projection-screens-blog', destination: '/blog/outdoor-projection-screens', permanent: true },

  // =========================================================================
  // PLAN PAGES -> /plan-screen-porch (pages renamed to match WordPress URLs)
  // =========================================================================
  { source: '/plan', destination: '/plan-screen-porch', permanent: true },
  { source: '/plan/overview', destination: '/plan-screen-porch', permanent: true },
  { source: '/plan/1-sided', destination: '/plan-screen-porch/single-sided-exposure', permanent: true },
  { source: '/plan/2-sided', destination: '/plan-screen-porch/2-sided-exposure', permanent: true },
  { source: '/plan/2-sided/regular-tracking', destination: '/plan-screen-porch/2-sided-exposure/regular-columns-tracking', permanent: true },
  { source: '/plan/2-sided/regular-velcro', destination: '/plan-screen-porch/2-sided-exposure/regular-columns-velcro', permanent: true },
  { source: '/plan/2-sided/irregular-tracking', destination: '/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', permanent: true },
  { source: '/plan/2-sided/irregular-velcro', destination: '/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', permanent: true },
  { source: '/plan/3-sided', destination: '/plan-screen-porch/3-sided-exposure', permanent: true },
  { source: '/plan/3-sided/regular-tracking', destination: '/plan-screen-porch/3-sided-exposure/regular-columns-tracking', permanent: true },
  { source: '/plan/3-sided/regular-velcro', destination: '/plan-screen-porch/3-sided-exposure/regular-columns-velcro', permanent: true },
  { source: '/plan/3-sided/irregular-tracking', destination: '/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', permanent: true },
  { source: '/plan/3-sided/irregular-velcro', destination: '/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', permanent: true },
  { source: '/plan/4-sided', destination: '/plan-screen-porch/4-plus-sided-exposure', permanent: true },
  { source: '/plan/4-sided/regular-tracking', destination: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', permanent: true },
  { source: '/plan/4-sided/regular-velcro', destination: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', permanent: true },
  { source: '/plan/4-sided/irregular-tracking', destination: '/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', permanent: true },
  { source: '/plan/4-sided/irregular-velcro', destination: '/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', permanent: true },
  { source: '/plan/free-standing', destination: '/plan-screen-porch/free-standing', permanent: true },
  { source: '/plan/how-to-order', destination: '/plan-screen-porch/how-to-order', permanent: true },
  { source: '/plan/magnetic-doorways', destination: '/plan-screen-porch/magnetic-doorways', permanent: true },
  { source: '/plan/mesh-colors', destination: '/plan-screen-porch/mesh-and-colors', permanent: true },
  { source: '/plan/tracking', destination: '/plan-screen-porch/outdoor-curtain-tracking', permanent: true },
  { source: '/plan/sealing-base', destination: '/plan-screen-porch/sealing-the-base', permanent: true },
  { source: '/plan/tents-awnings', destination: '/plan-screen-porch/tents-and-awnings', permanent: true },

  // =========================================================================
  // START-PROJECT QUERY PARAM REDIRECTS -> /start-project/[product]/[path]
  // (More specific redirects first - mode + product)
  // =========================================================================
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'quote' }, { type: 'query', key: 'product', value: 'clear_vinyl' }], destination: '/start-project/clear-vinyl/instant-quote', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'quote' }, { type: 'query', key: 'product', value: 'cv' }], destination: '/start-project/clear-vinyl/instant-quote', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'planner' }, { type: 'query', key: 'product', value: 'clear_vinyl' }], destination: '/start-project/clear-vinyl/expert-assistance', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'planner' }, { type: 'query', key: 'product', value: 'cv' }], destination: '/start-project/clear-vinyl/expert-assistance', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'diy' }, { type: 'query', key: 'product', value: 'clear_vinyl' }], destination: '/start-project/clear-vinyl/diy-builder', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'diy' }, { type: 'query', key: 'product', value: 'cv' }], destination: '/start-project/clear-vinyl/diy-builder', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'quote' }], destination: '/start-project/mosquito-curtains/instant-quote', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'planner' }], destination: '/start-project/mosquito-curtains/expert-assistance', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'mode', value: 'diy' }], destination: '/start-project/mosquito-curtains/diy-builder', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'product', value: 'clear_vinyl' }], destination: '/start-project/clear-vinyl', permanent: true },
  { source: '/start-project', has: [{ type: 'query', key: 'product', value: 'cv' }], destination: '/start-project/clear-vinyl', permanent: true },

  // Legacy instant quote pages -> new start-project routes
  { source: '/mosquito-curtains-instant-quote', destination: '/start-project/mosquito-curtains/instant-quote', permanent: true },
  { source: '/clear-vinyl-instant-quote', destination: '/start-project/clear-vinyl/instant-quote', permanent: true },
]
