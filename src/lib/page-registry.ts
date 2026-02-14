/**
 * Page Registry — Single Source of Truth for Page Classification
 *
 * Every public page classified by:
 * - productLine: Which product category the page belongs to (mc, cv, rn, ru, general)
 * - pageType:    Functional purpose (product, landing, ordering, planning, etc.)
 * - expectedCTA: Which CTA set the page should use (mc, cv, rn, general)
 * - inSitemap:   Whether it appears in the public XML sitemap
 *
 * Used by: Admin Sitemap, CTA validation, analytics, SEO audits
 */

// =============================================================================
// TYPES
// =============================================================================

/** Product line classification */
export type ProductLine = 'mc' | 'cv' | 'rn' | 'ru' | 'general'

/** Functional page type */
export type PageType =
  | 'homepage'
  | 'product'
  | 'landing'        // SEO landing / project-type pages
  | 'ordering'
  | 'quote'          // start-project, instant quote, etc.
  | 'planning'       // measurement & planning guides
  | 'installation'
  | 'care'
  | 'faq'
  | 'options'        // product options / info pages
  | 'informational'
  | 'support'
  | 'gallery'
  | 'blog'
  | 'sale'
  | 'legal'
  | 'marketing'      // fb, reddit, etc.
  | 'ecommerce'      // cart, checkout, my-orders
  | 'session-prep'   // planning session prep pages
  | 'utility'        // design system, uploads, experiments
  | 'admin'
  | 'canonical-wrapper' // WordPress legacy canonical wrappers

/** Which CTA set a page should use */
export type ExpectedCTA = 'mc' | 'cv' | 'rn' | 'general' | 'none'

export interface PageEntry {
  path: string
  name: string
  productLine: ProductLine
  pageType: PageType
  expectedCTA: ExpectedCTA
  inSitemap: boolean
  description?: string
}

// =============================================================================
// PAGE REGISTRY
// =============================================================================

export const PAGE_REGISTRY: PageEntry[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERAL / CROSS-PRODUCT PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  // -- Core --
  { path: '/', name: 'Homepage', productLine: 'general', pageType: 'homepage', expectedCTA: 'general', inSitemap: true },
  { path: '/about', name: 'About Us', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/our-story', name: 'Our Story', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/products', name: 'Products Hub', productLine: 'general', pageType: 'product', expectedCTA: 'general', inSitemap: true },
  { path: '/applications', name: 'Applications Hub', productLine: 'general', pageType: 'landing', expectedCTA: 'general', inSitemap: true },

  // -- Support & Company --
  { path: '/contact', name: 'Contact', productLine: 'general', pageType: 'support', expectedCTA: 'general', inSitemap: true },
  { path: '/shipping', name: 'Shipping & Delivery', productLine: 'general', pageType: 'support', expectedCTA: 'general', inSitemap: true },
  { path: '/returns', name: 'Returns Policy', productLine: 'general', pageType: 'support', expectedCTA: 'general', inSitemap: true },
  { path: '/satisfaction-guarantee', name: 'Satisfaction Guarantee', productLine: 'general', pageType: 'support', expectedCTA: 'general', inSitemap: true },
  { path: '/reviews', name: 'Reviews', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/professionals', name: 'For Professionals', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/contractors', name: 'For Contractors', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/opportunities', name: 'Careers / Opportunities', productLine: 'general', pageType: 'informational', expectedCTA: 'general', inSitemap: true },
  { path: '/privacy-policy', name: 'Privacy Policy', productLine: 'general', pageType: 'legal', expectedCTA: 'none', inSitemap: true },
  { path: '/work-with-a-planner', name: 'Work With a Planner', productLine: 'general', pageType: 'quote', expectedCTA: 'general', inSitemap: true },

  // -- Start Project Hub --
  { path: '/start-project', name: 'Start Project Hub', productLine: 'general', pageType: 'quote', expectedCTA: 'general', inSitemap: true },

  // -- Gallery & Media --
  { path: '/gallery', name: 'Gallery Hub', productLine: 'general', pageType: 'gallery', expectedCTA: 'general', inSitemap: true },
  { path: '/gallery/featured', name: 'Featured Collection', productLine: 'general', pageType: 'gallery', expectedCTA: 'general', inSitemap: true },
  { path: '/gallery/porch-projects', name: 'Porch Projects', productLine: 'mc', pageType: 'gallery', expectedCTA: 'mc', inSitemap: true },
  { path: '/gallery/clear-vinyl', name: 'Clear Vinyl Gallery', productLine: 'cv', pageType: 'gallery', expectedCTA: 'cv', inSitemap: true },
  { path: '/gallery/mosquito-netting', name: 'Mosquito Netting Gallery', productLine: 'mc', pageType: 'gallery', expectedCTA: 'mc', inSitemap: true },
  { path: '/gallery/white-netting', name: 'White Netting Gallery', productLine: 'mc', pageType: 'gallery', expectedCTA: 'mc', inSitemap: true },
  { path: '/gallery/black-netting', name: 'Black Netting Gallery', productLine: 'mc', pageType: 'gallery', expectedCTA: 'mc', inSitemap: true },
  { path: '/photos', name: 'Photos', productLine: 'general', pageType: 'gallery', expectedCTA: 'general', inSitemap: true },
  { path: '/videos', name: 'Videos', productLine: 'general', pageType: 'gallery', expectedCTA: 'general', inSitemap: true },
  { path: '/projects', name: 'Projects', productLine: 'general', pageType: 'gallery', expectedCTA: 'general', inSitemap: true },

  // -- Blog --
  { path: '/blog', name: 'Blog Index', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/history-of-mosquitoes', name: 'History of Mosquitoes', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/mosquito-capitol-of-america', name: 'Mosquito Capitol of America', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/mosquito-enclosures-for-decks', name: 'Mosquito Enclosures for Decks', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/gazebos-then-and-now', name: 'Gazebos Then and Now', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/porch-too-beautiful-to-screen', name: 'Porch Too Beautiful to Screen', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/pollen-and-porches', name: 'Pollen and Porches', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/northern-mosquitoes', name: 'Northern Mosquitoes', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/storm-proof-screening', name: 'Storm-Proof Screening', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/west-nile-virus-effects', name: 'West Nile Virus Effects', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/mosquito-protection-summary', name: 'Mosquito Protection Summary', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/bond-sales-story', name: 'Bond Sales Story', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/kids-project', name: 'Kids Project', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/dear-martha-stewart', name: 'Dear Martha Stewart', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/work-is-good', name: 'Work is Good', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/mulligan-blocker', name: 'Mulligan Blocker', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },
  { path: '/blog/airlines-screen-doors', name: 'Airlines Screen Doors', productLine: 'general', pageType: 'blog', expectedCTA: 'general', inSitemap: true },
  { path: '/blog/outdoor-projection-screens', name: 'Outdoor Projection Screens', productLine: 'mc', pageType: 'blog', expectedCTA: 'mc', inSitemap: true },

  // -- Sale --
  { path: '/sale', name: 'Sale Page', productLine: 'general', pageType: 'sale', expectedCTA: 'general', inSitemap: true },

  // -- Options Hub --
  { path: '/options', name: 'Options Hub', productLine: 'general', pageType: 'options', expectedCTA: 'general', inSitemap: true },

  // -- FAQ Hub --
  { path: '/faq', name: 'FAQ Hub', productLine: 'general', pageType: 'faq', expectedCTA: 'general', inSitemap: true },

  // -- Order Hub --
  { path: '/order', name: 'Order Hub', productLine: 'general', pageType: 'ordering', expectedCTA: 'general', inSitemap: true },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOSQUITO CURTAINS (MC) PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  // -- MC Products --
  { path: '/screened-porch-enclosures', name: 'Mosquito Curtains (Main)', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/mosquito-netting', name: 'Mosquito Netting', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/no-see-um-netting-screen', name: 'No-See-Um Netting', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/shade-screen-mesh', name: 'Shade Screen Mesh', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/industrial-mesh', name: 'Industrial Mesh', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/industrial-netting', name: 'Industrial Netting', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/theatre-scrim', name: 'Theatre Scrim', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/theater-scrims', name: 'Theater Scrims', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/heavy-track', name: 'Heavy Track', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/camping-net', name: 'Camping Net', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/outdoor-projection-screens', name: 'Outdoor Projection Screens', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/tent-screens', name: 'Tent Screens', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/weather-curtains', name: 'Weather Curtains', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },
  { path: '/insulated-curtain-panels', name: 'Insulated Curtain Panels', productLine: 'mc', pageType: 'product', expectedCTA: 'mc', inSitemap: true },

  // -- MC SEO Landing Pages (Project Types) --
  { path: '/screened-porch', name: 'Screened Porch', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/screen-patio', name: 'Screen Patio', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/screened-in-decks', name: 'Screened-In Decks', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/garage-door-screens', name: 'Garage Door Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/pergola-screen-curtains', name: 'Pergola Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/gazebo-screen-curtains', name: 'Gazebo Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/yardistry-gazebo-curtains', name: 'Yardistry Gazebo Curtains', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/awning-screen-enclosures', name: 'Awning Enclosures', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/french-door-screens', name: 'French Door Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/boat-screens', name: 'Boat Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },
  { path: '/hvac-chiller-screens', name: 'HVAC Chiller Screens', productLine: 'mc', pageType: 'landing', expectedCTA: 'mc', inSitemap: true },

  // -- MC Ordering --
  { path: '/order/mosquito-curtains', name: 'Order: Mosquito Curtains', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order/track-hardware', name: 'Order: Track Hardware', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order/attachments', name: 'Order: Attachments', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order-mesh-panels', name: 'Order Mesh Panels (Legacy)', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order-attachments', name: 'Order Attachments (Legacy)', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order-tracking', name: 'Order Tracking (Legacy)', productLine: 'mc', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },

  // -- MC Quote & Start Project --
  { path: '/start-project/mosquito-curtains', name: 'MC Start Project', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/mosquito-curtains/expert-assistance', name: 'MC Expert Assistance', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/mosquito-curtains/instant-quote', name: 'MC Instant Quote', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/mosquito-curtains/diy-builder', name: 'MC DIY Builder', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/quote/mosquito-curtains', name: 'MC Quote Form', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/mosquito-curtains-instant-quote', name: 'MC Instant Quote (Legacy)', productLine: 'mc', pageType: 'quote', expectedCTA: 'none', inSitemap: true },

  // -- MC Planning & Measurement --
  { path: '/plan-screen-porch', name: 'Planning Hub', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/how-to-order', name: 'How to Order', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/outdoor-curtain-tracking', name: 'Tracking Guide', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/mesh-and-colors', name: 'Mesh & Colors', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/magnetic-doorways', name: 'Magnetic Doorways', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/sealing-the-base', name: 'Sealing the Base', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/free-standing', name: 'Free-Standing', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/tents-and-awnings', name: 'Tents & Awnings', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/single-sided-exposure', name: 'Single-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/2-sided-exposure', name: '2-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/2-sided-exposure/regular-columns-tracking', name: '2S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/2-sided-exposure/regular-columns-velcro', name: '2S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/2-sided-exposure/irregular-columns-tracking', name: '2S Irregular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/2-sided-exposure/irregular-columns-velcro', name: '2S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/3-sided-exposure', name: '3-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/3-sided-exposure/regular-columns-tracking', name: '3S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/3-sided-exposure/regular-columns-velcro', name: '3S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/3-sided-exposure/irregular-columns-tracking', name: '3S Irregular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/3-sided-exposure/irregular-columns-velcro', name: '3S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/4-plus-sided-exposure', name: '4+ Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking', name: '4S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro', name: '4S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro', name: '4S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch-with-odd-shaped-columns-and-a-tracking-attachment', name: '4S Wrap-Around Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },

  // -- MC Installation --
  { path: '/install', name: 'Installation Hub', productLine: 'mc', pageType: 'installation', expectedCTA: 'mc', inSitemap: true },
  { path: '/install/tracking', name: 'Tracking Install', productLine: 'mc', pageType: 'installation', expectedCTA: 'mc', inSitemap: true },
  { path: '/install/velcro', name: 'Velcro Install', productLine: 'mc', pageType: 'installation', expectedCTA: 'mc', inSitemap: true },

  // -- MC Care --
  { path: '/care/mosquito-curtains', name: 'Mosquito Curtain Care', productLine: 'mc', pageType: 'care', expectedCTA: 'mc', inSitemap: true },

  // -- MC FAQ --
  { path: '/faq/mosquito-curtains', name: 'MC FAQ', productLine: 'mc', pageType: 'faq', expectedCTA: 'mc', inSitemap: true },

  // -- MC Session Prep --
  { path: '/mosquito-curtain-planning-session', name: 'MC Planning Session', productLine: 'mc', pageType: 'session-prep', expectedCTA: 'mc', inSitemap: false },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEAR VINYL (CV) PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  // -- CV Products --
  { path: '/clear-vinyl-plastic-patio-enclosures', name: 'Clear Vinyl (Main)', productLine: 'cv', pageType: 'product', expectedCTA: 'cv', inSitemap: true },
  { path: '/ordering-clear-vinyl', name: 'Ordering Clear Vinyl', productLine: 'cv', pageType: 'product', expectedCTA: 'cv', inSitemap: true },
  { path: '/porch-vinyl-curtains', name: 'Porch Vinyl Curtains', productLine: 'cv', pageType: 'product', expectedCTA: 'cv', inSitemap: true },
  { path: '/porch-vinyl-panels', name: 'Porch Vinyl Panels', productLine: 'cv', pageType: 'product', expectedCTA: 'cv', inSitemap: true },

  // -- CV SEO Landing --
  { path: '/porch-winterize', name: 'Porch Winterize', productLine: 'cv', pageType: 'landing', expectedCTA: 'cv', inSitemap: true },
  { path: '/patio-winterize', name: 'Patio Winterize', productLine: 'cv', pageType: 'landing', expectedCTA: 'cv', inSitemap: true },

  // -- CV Options --
  { path: '/options/clear-vinyl', name: 'CV Options Overview', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/options/clear-vinyl/quality', name: 'CV Quality', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/options/clear-vinyl/ordering', name: 'CV Ordering', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/options/clear-vinyl/considerations', name: 'CV Considerations', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/options/clear-vinyl/diy', name: 'CV DIY', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/options/clear-vinyl/apron-colors', name: 'CV Apron Colors', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },
  { path: '/clear-vinyl-options', name: 'Clear Vinyl Options', productLine: 'cv', pageType: 'options', expectedCTA: 'cv', inSitemap: true },

  // -- CV Ordering --
  { path: '/order/clear-vinyl', name: 'Order: Clear Vinyl', productLine: 'cv', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },

  // -- CV Quote & Start Project --
  { path: '/start-project/clear-vinyl', name: 'CV Start Project', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/clear-vinyl/expert-assistance', name: 'CV Expert Assistance', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/clear-vinyl/instant-quote', name: 'CV Instant Quote', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/clear-vinyl/diy-builder', name: 'CV DIY Builder', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/quote/clear-vinyl', name: 'CV Quote Form', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/clear-vinyl-instant-quote', name: 'CV Instant Quote (Legacy)', productLine: 'cv', pageType: 'quote', expectedCTA: 'none', inSitemap: true },

  // -- CV Installation --
  { path: '/install/clear-vinyl', name: 'Clear Vinyl Install', productLine: 'cv', pageType: 'installation', expectedCTA: 'cv', inSitemap: true },

  // -- CV Care --
  { path: '/care/clear-vinyl', name: 'Clear Vinyl Care', productLine: 'cv', pageType: 'care', expectedCTA: 'cv', inSitemap: true },

  // -- CV FAQ --
  { path: '/faq/clear-vinyl', name: 'CV FAQ', productLine: 'cv', pageType: 'faq', expectedCTA: 'cv', inSitemap: true },

  // -- CV Session Prep --
  { path: '/clear-vinyl-planning-session', name: 'CV Planning Session', productLine: 'cv', pageType: 'session-prep', expectedCTA: 'cv', inSitemap: false },

  // ═══════════════════════════════════════════════════════════════════════════
  // RAW NETTING (RN) PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/raw-netting', name: 'Raw Netting Hub', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting-fabric-store', name: 'Raw Netting Fabric Store', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/mosquito-net', name: 'Mosquito Net Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/no-see-um', name: 'No-See-Um Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/shade-mesh', name: 'Shade Mesh Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/industrial', name: 'Industrial Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/scrim', name: 'Scrim Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/custom', name: 'Custom Fabric', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/hardware', name: 'Hardware', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/rigging', name: 'Rigging', productLine: 'rn', pageType: 'product', expectedCTA: 'rn', inSitemap: true },
  { path: '/raw-netting/why-us', name: 'Why Buy From Us', productLine: 'rn', pageType: 'informational', expectedCTA: 'rn', inSitemap: true },

  // -- RN Ordering --
  { path: '/order/raw-netting', name: 'Order: Raw Netting', productLine: 'rn', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order/raw-netting-attachments', name: 'Order: RN Attachments', productLine: 'rn', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order-mesh-netting-fabrics', name: 'Order Mesh Fabrics (Legacy)', productLine: 'rn', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },
  { path: '/order-raw-netting-attachment-hardware', name: 'Order RN Hardware (Legacy)', productLine: 'rn', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },

  // -- RN Quote & Start Project --
  { path: '/start-project/raw-netting', name: 'RN Start Project', productLine: 'rn', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/raw-netting/expert-assistance', name: 'RN Expert Assistance', productLine: 'rn', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/raw-netting/instant-quote', name: 'RN Contact for Quote', productLine: 'rn', pageType: 'quote', expectedCTA: 'none', inSitemap: true },
  { path: '/start-project/raw-netting/diy-builder', name: 'RN DIY Builder', productLine: 'rn', pageType: 'quote', expectedCTA: 'none', inSitemap: true },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROLL-UP SHADES (RU) PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/roll-up-shade-screens', name: 'Roll-Up Shade Screens', productLine: 'ru', pageType: 'product', expectedCTA: 'mc', inSitemap: true, description: 'Uses MC CTA since no dedicated RU flow yet' },
  { path: '/order/roll-up-shades', name: 'Order: Roll-Up Shades', productLine: 'ru', pageType: 'ordering', expectedCTA: 'none', inSitemap: true },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW PLAN ROUTES (plan/ prefix versions)
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/plan/overview', name: 'Plan Overview', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/tracking', name: 'Plan: Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/magnetic-doorways', name: 'Plan: Magnetic Doorways', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/sealing-base', name: 'Plan: Sealing Base', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/free-standing', name: 'Plan: Free-Standing', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/tents-awnings', name: 'Plan: Tents & Awnings', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/1-sided', name: 'Plan: 1-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/2-sided', name: 'Plan: 2-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/2-sided/regular-tracking', name: 'Plan: 2S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/2-sided/regular-velcro', name: 'Plan: 2S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/2-sided/irregular-tracking', name: 'Plan: 2S Irregular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/2-sided/irregular-velcro', name: 'Plan: 2S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/3-sided', name: 'Plan: 3-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/3-sided/regular-tracking', name: 'Plan: 3S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/3-sided/regular-velcro', name: 'Plan: 3S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/3-sided/irregular-tracking', name: 'Plan: 3S Irregular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/3-sided/irregular-velcro', name: 'Plan: 3S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/4-sided', name: 'Plan: 4-Sided', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/4-sided/regular-tracking', name: 'Plan: 4S Regular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/4-sided/regular-velcro', name: 'Plan: 4S Regular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/4-sided/irregular-tracking', name: 'Plan: 4S Irregular Tracking', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },
  { path: '/plan/4-sided/irregular-velcro', name: 'Plan: 4S Irregular Velcro', productLine: 'mc', pageType: 'planning', expectedCTA: 'mc', inSitemap: true },

  // ═══════════════════════════════════════════════════════════════════════════
  // E-COMMERCE / TRANSACTIONAL (not in sitemap)
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/cart', name: 'Shopping Cart', productLine: 'general', pageType: 'ecommerce', expectedCTA: 'none', inSitemap: false },
  { path: '/checkout', name: 'Checkout', productLine: 'general', pageType: 'ecommerce', expectedCTA: 'none', inSitemap: false },
  { path: '/my-orders', name: 'My Orders', productLine: 'general', pageType: 'ecommerce', expectedCTA: 'none', inSitemap: false },
  { path: '/my-projects', name: 'My Projects', productLine: 'general', pageType: 'ecommerce', expectedCTA: 'none', inSitemap: false },

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION PREP & UTILITY (not in sitemap)
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/prepare', name: 'Prepare (Post-Form)', productLine: 'general', pageType: 'session-prep', expectedCTA: 'none', inSitemap: false },
  { path: '/form-entry', name: 'Form Entry (Post-Form)', productLine: 'general', pageType: 'session-prep', expectedCTA: 'none', inSitemap: false },
  { path: '/uploads', name: 'Uploads', productLine: 'general', pageType: 'utility', expectedCTA: 'none', inSitemap: false },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKETING LANDING PAGES (not in sitemap)
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/fb', name: 'Facebook Hub', productLine: 'general', pageType: 'marketing', expectedCTA: 'general', inSitemap: false },
  { path: '/fb/mc-quote', name: 'FB: MC Quote', productLine: 'mc', pageType: 'marketing', expectedCTA: 'mc', inSitemap: false },
  { path: '/fb/cv-quote', name: 'FB: CV Quote', productLine: 'cv', pageType: 'marketing', expectedCTA: 'cv', inSitemap: false },
  { path: '/reddit', name: 'Reddit Hub', productLine: 'general', pageType: 'marketing', expectedCTA: 'general', inSitemap: false },
  { path: '/reddit/mc-quote', name: 'Reddit: MC Quote', productLine: 'mc', pageType: 'marketing', expectedCTA: 'mc', inSitemap: false },

  // ═══════════════════════════════════════════════════════════════════════════
  // WORDPRESS LEGACY CANONICAL WRAPPERS (not in sitemap)
  // ═══════════════════════════════════════════════════════════════════════════

  { path: '/caring-for-clear-vinyl', name: 'Caring For CV (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/caring-for-mosquito-curtains', name: 'Caring For MC (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/clear-vinyl-faq', name: 'CV FAQ (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/faqs', name: 'FAQs (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-curtains-faq', name: 'MC FAQ (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-curtains-reviews', name: 'MC Reviews (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-curtains-tracking-installation', name: 'Tracking Install (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-curtains-velcro-installation', name: 'Velcro Install (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/clear-vinyl-installation', name: 'CV Install (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/how-to-order', name: 'How To Order (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-net', name: 'Mosquito Net (WP)', productLine: 'rn', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-netting/all-netting-and-attachment-hardware', name: 'RN Hardware (WP)', productLine: 'rn', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-netting/fasteners-and-rigging-ideas', name: 'Rigging (WP)', productLine: 'rn', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-netting/why-us-for-raw-netting', name: 'Why Us (WP)', productLine: 'rn', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/mosquito-netting/let-us-make-it-for-you', name: 'Custom Netting (WP)', productLine: 'rn', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/apron-colors-to-choose-from', name: 'Apron Colors (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/clear-vinyl-self-installation-advantages', name: 'CV DIY (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/what-can-go-wrong-with-clear-vinyl', name: 'CV Considerations (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/what-makes-our-clear-vinyl-product-better', name: 'CV Quality (WP)', productLine: 'cv', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/tentscreenpanels', name: 'Tent Screens (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/contractor', name: 'Contractor (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/client-uploads', name: 'Client Uploads (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/order-mosquito-curtains', name: 'Order MC (WP)', productLine: 'mc', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/my-account', name: 'My Account (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/project-series', name: 'Project Series (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
  { path: '/project-planning', name: 'Project Planning (WP)', productLine: 'general', pageType: 'canonical-wrapper', expectedCTA: 'none', inSitemap: false },
]

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

/** Map for O(1) path lookups */
const _pageMap = new Map<string, PageEntry>()
for (const page of PAGE_REGISTRY) {
  _pageMap.set(page.path, page)
}

/** Look up a page by its path */
export function getPage(path: string): PageEntry | undefined {
  return _pageMap.get(path)
}

/** Get all pages for a given product line */
export function getPagesByProductLine(productLine: ProductLine): PageEntry[] {
  return PAGE_REGISTRY.filter(p => p.productLine === productLine)
}

/** Get all pages for a given page type */
export function getPagesByType(pageType: PageType): PageEntry[] {
  return PAGE_REGISTRY.filter(p => p.pageType === pageType)
}

/** Get all public (in sitemap) pages */
export function getPublicPages(): PageEntry[] {
  return PAGE_REGISTRY.filter(p => p.inSitemap)
}

/** Get product line stats */
export function getProductLineStats(): Record<ProductLine, number> {
  const stats: Record<ProductLine, number> = { mc: 0, cv: 0, rn: 0, ru: 0, general: 0 }
  for (const page of PAGE_REGISTRY) {
    stats[page.productLine]++
  }
  return stats
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

export const PRODUCT_LINE_LABELS: Record<ProductLine, string> = {
  mc: 'Mosquito Curtains',
  cv: 'Clear Vinyl',
  rn: 'Raw Netting',
  ru: 'Roll-Up Shades',
  general: 'General',
}

export const PRODUCT_LINE_SHORT: Record<ProductLine, string> = {
  mc: 'MC',
  cv: 'CV',
  rn: 'RN',
  ru: 'RU',
  general: 'GEN',
}

export const PRODUCT_LINE_COLORS: Record<ProductLine, { bg: string; text: string; border: string }> = {
  mc: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  cv: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  rn: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  ru: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  general: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
}

export const CTA_LABELS: Record<ExpectedCTA, string> = {
  mc: 'MC CTA',
  cv: 'CV CTA',
  rn: 'RN CTA',
  general: 'General CTA',
  none: 'No CTA',
}
