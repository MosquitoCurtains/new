import { SITE_NAME, SITE_URL } from './metadata'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

interface HowToStep {
  name: string
  text: string
  image?: string
}

interface ProductInfo {
  name: string
  description: string
  image: string
  url: string
  sku?: string
  priceRange?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}

interface WebPageInfo {
  title: string
  description: string
  url: string
  dateModified?: string
}

// ---------------------------------------------------------------------------
// JSON-LD Component Helper
// ---------------------------------------------------------------------------

/**
 * Returns a <script type="application/ld+json"> element for embedding in pages.
 * Usage: place in JSX like {JsonLd(schema)}
 */
export function JsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  }
}

// ---------------------------------------------------------------------------
// Organization Schema (site-wide)
// ---------------------------------------------------------------------------

export function OrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png',
    description: 'Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric since 2004.',
    foundingDate: '2004',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-508-760-1510',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'South Yarmouth',
      addressRegion: 'MA',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.facebook.com/mosquitocurtains',
      'https://www.instagram.com/mosquitocurtains',
      'https://www.youtube.com/@mosquitocurtains',
    ],
  }
}

// ---------------------------------------------------------------------------
// Local Business Schema
// ---------------------------------------------------------------------------

export function LocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: '+1-508-760-1510',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '54 Long Pond Dr',
      addressLocality: 'South Yarmouth',
      addressRegion: 'MA',
      postalCode: '02664',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.6688,
      longitude: -70.1962,
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    priceRange: '$$',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png',
    description: 'Custom-made mosquito netting curtains, clear vinyl patio enclosures, and raw netting fabric. Serving 92,000+ customers since 2004.',
  }
}

// ---------------------------------------------------------------------------
// Breadcrumb Schema
// ---------------------------------------------------------------------------

export function BreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      })),
    ],
  }
}

// ---------------------------------------------------------------------------
// Product Schema
// ---------------------------------------------------------------------------

export function ProductSchema(product: ProductInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url.startsWith('http') ? product.url : `${SITE_URL}${product.url}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.priceRange
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            availability: `https://schema.org/${product.availability || 'InStock'}`,
          },
        }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// FAQ Page Schema
// ---------------------------------------------------------------------------

export function FAQPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ---------------------------------------------------------------------------
// HowTo Schema
// ---------------------------------------------------------------------------

export function HowToSchema(name: string, description: string, steps: HowToStep[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
  }
}

// ---------------------------------------------------------------------------
// WebPage Schema (generic)
// ---------------------------------------------------------------------------

export function WebPageSchema(page: WebPageInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url.startsWith('http') ? page.url : `${SITE_URL}${page.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(page.dateModified
      ? { dateModified: page.dateModified }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// Helper: Build breadcrumbs from a slug
// ---------------------------------------------------------------------------

/**
 * Generates breadcrumb items from a slug like "/plan/tracking"
 * Returns: [{ name: "Plan", url: "/plan" }, { name: "Tracking", url: "/plan/tracking" }]
 */
export function breadcrumbsFromSlug(slug: string, title: string): BreadcrumbItem[] {
  const parts = slug.split('/').filter(Boolean)
  if (parts.length === 0) return []

  const items: BreadcrumbItem[] = []

  // Build intermediate breadcrumbs
  for (let i = 0; i < parts.length - 1; i++) {
    const path = '/' + parts.slice(0, i + 1).join('/')
    const name = parts[i]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    items.push({ name, url: path })
  }

  // Final breadcrumb is the current page
  items.push({ name: title, url: slug })

  return items
}
