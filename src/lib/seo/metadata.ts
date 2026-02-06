import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// Site-wide SEO constants
// ---------------------------------------------------------------------------

export const SITE_NAME = 'Mosquito Curtains'
export const SITE_URL = 'https://www.mosquitocurtains.com'
export const DEFAULT_OG_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png'
export const TWITTER_HANDLE = '@mosquitocurtain'

// ---------------------------------------------------------------------------
// Page SEO Config
// ---------------------------------------------------------------------------

export interface PageSEOConfig {
  /** Page title (without site suffix) */
  title: string
  /** Meta description (aim for 150-160 chars) */
  description: string
  /** Page slug starting with / (e.g., "/garage-door-screens") */
  slug: string
  /** Open Graph image URL (defaults to site-wide OG image) */
  ogImage?: string
  /** Page type for Open Graph */
  type?: 'website' | 'article' | 'product'
  /** Additional keywords */
  keywords?: string[]
  /** Set true to add noindex */
  noIndex?: boolean
}

// ---------------------------------------------------------------------------
// Metadata Builder
// ---------------------------------------------------------------------------

/**
 * Builds a complete Next.js Metadata object for a page.
 * Use as the return value of `generateMetadata` or `export const metadata`.
 *
 * @example
 * export const metadata = buildPageMetadata({
 *   title: 'Garage Door Screens',
 *   description: 'Custom-fitted garage door screen enclosures...',
 *   slug: '/garage-door-screens',
 * })
 */
export function buildPageMetadata(config: PageSEOConfig): Metadata {
  const {
    title,
    description,
    slug,
    ogImage = DEFAULT_OG_IMAGE,
    type = 'website',
    keywords = [],
    noIndex = false,
  } = config

  const fullTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = `${SITE_URL}${slug}`

  const baseKeywords = [
    'mosquito curtains',
    'screen enclosures',
    'mosquito netting',
    'custom screens',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords].join(', '),

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: type === 'article' ? 'article' : 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      site: TWITTER_HANDLE,
    },

    // Robots
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),

    // Icons (inherited from layout, but can be overridden)
    icons: {
      icon: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Netting-Curtains-Logo-512.png',
    },
  }
}

// ---------------------------------------------------------------------------
// Description helpers
// ---------------------------------------------------------------------------

/**
 * Truncates a description to the ideal SEO length (150-160 chars).
 * Cuts at the last complete word and adds ellipsis if needed.
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace) + '...'
}
