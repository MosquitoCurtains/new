import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.mosquitocurtains.com'

type PageType =
  | 'homepage'
  | 'product'
  | 'ordering'
  | 'landing'
  | 'quote'
  | 'informational'
  | 'planning'
  | 'faq'
  | 'support'
  | 'installation'
  | 'gallery'
  | 'blog'
  | 'sale'
  | 'legal'

type PageEntry = {
  slug: string
  type: PageType
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']
}

// Priority by page type
const PRIORITY: Record<PageType, number> = {
  homepage: 1.0,
  product: 0.9,
  ordering: 0.85,
  landing: 0.8,
  quote: 0.8,
  sale: 0.8,
  informational: 0.7,
  planning: 0.7,
  installation: 0.65,
  faq: 0.6,
  support: 0.6,
  gallery: 0.5,
  blog: 0.5,
  legal: 0.3,
}

// Default change frequency by page type
const FREQUENCY: Record<PageType, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  homepage: 'weekly',
  product: 'monthly',
  ordering: 'monthly',
  landing: 'monthly',
  quote: 'monthly',
  sale: 'weekly',
  informational: 'monthly',
  planning: 'monthly',
  installation: 'monthly',
  faq: 'monthly',
  support: 'monthly',
  gallery: 'weekly',
  blog: 'yearly',
  legal: 'yearly',
}

// ─── All public pages organized by category ─────────────────────────────────

const STATIC_PAGES: PageEntry[] = [
  // ── Homepage ───────────────────────────────────────────────────────────────
  { slug: '/', type: 'homepage' },

  // ── Product Pages ──────────────────────────────────────────────────────────
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

  // ── Raw Netting Category ───────────────────────────────────────────────────
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

  // ── Ordering Pages ─────────────────────────────────────────────────────────
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

  // ── Clear Vinyl Options ────────────────────────────────────────────────────
  { slug: '/options', type: 'informational' },
  { slug: '/options/clear-vinyl', type: 'informational' },
  { slug: '/options/clear-vinyl/quality', type: 'informational' },
  { slug: '/options/clear-vinyl/ordering', type: 'informational' },
  { slug: '/options/clear-vinyl/considerations', type: 'informational' },
  { slug: '/options/clear-vinyl/diy', type: 'informational' },
  { slug: '/options/clear-vinyl/apron-colors', type: 'informational' },
  { slug: '/clear-vinyl-options', type: 'informational' },

  // ── Landing Pages (Application/Use-Case) ───────────────────────────────────
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

  // ── Quote & Start Pages ────────────────────────────────────────────────────
  { slug: '/start-project', type: 'quote' },
  { slug: '/mosquito-curtains-instant-quote', type: 'quote' },
  { slug: '/clear-vinyl-instant-quote', type: 'quote' },
  { slug: '/quote/mosquito-curtains', type: 'quote' },
  { slug: '/quote/clear-vinyl', type: 'quote' },
  { slug: '/work-with-a-planner', type: 'quote' },

  // ── Sale ───────────────────────────────────────────────────────────────────
  { slug: '/sale', type: 'sale' },

  // ── Planning & How-To Pages ────────────────────────────────────────────────
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

  // ── Informational Pages ────────────────────────────────────────────────────
  { slug: '/about', type: 'informational' },
  { slug: '/our-story', type: 'informational' },
  { slug: '/professionals', type: 'informational' },
  { slug: '/contractors', type: 'informational' },
  { slug: '/opportunities', type: 'informational' },
  { slug: '/reviews', type: 'informational' },
  { slug: '/satisfaction-guarantee', type: 'informational' },

  // ── Care & Maintenance ─────────────────────────────────────────────────────
  { slug: '/care/clear-vinyl', type: 'informational' },
  { slug: '/care/mosquito-curtains', type: 'informational' },

  // ── Installation Guides ────────────────────────────────────────────────────
  { slug: '/install', type: 'installation' },
  { slug: '/install/clear-vinyl', type: 'installation' },
  { slug: '/install/tracking', type: 'installation' },
  { slug: '/install/velcro', type: 'installation' },

  // ── FAQ ────────────────────────────────────────────────────────────────────
  { slug: '/faq', type: 'faq' },
  { slug: '/faq/mosquito-curtains', type: 'faq' },
  { slug: '/faq/clear-vinyl', type: 'faq' },

  // ── Support ────────────────────────────────────────────────────────────────
  { slug: '/contact', type: 'support' },
  { slug: '/shipping', type: 'support' },
  { slug: '/returns', type: 'support' },

  // ── Gallery & Media ────────────────────────────────────────────────────────
  { slug: '/gallery', type: 'gallery' },
  { slug: '/photos', type: 'gallery' },
  { slug: '/videos', type: 'gallery' },
  { slug: '/projects', type: 'gallery' },

  // ── Blog Index ─────────────────────────────────────────────────────────────
  { slug: '/blog', type: 'blog', changeFrequency: 'weekly' },

  // ── Legal ──────────────────────────────────────────────────────────────────
  { slug: '/privacy-policy', type: 'legal' },
]

// ─── Dynamic slugs for blog posts ────────────────────────────────────────────

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

// ─── Dynamic slugs for gallery collections ───────────────────────────────────

const GALLERY_SLUGS = [
  'featured',
  'porch-projects',
  'clear-vinyl',
  'mosquito-netting',
  'white-netting',
  'black-netting',
]

// ─── Build the sitemap ───────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: page.slug === '/' ? SITE_URL : `${SITE_URL}${page.slug}`,
    lastModified: now,
    changeFrequency: page.changeFrequency ?? FREQUENCY[page.type],
    priority: PRIORITY[page.type],
  }))

  // Blog post pages
  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: PRIORITY.blog,
  }))

  // Gallery collection pages
  const galleryEntries: MetadataRoute.Sitemap = GALLERY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/gallery/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: PRIORITY.gallery,
  }))

  return [...staticEntries, ...blogEntries, ...galleryEntries]
}
