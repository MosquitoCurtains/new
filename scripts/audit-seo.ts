/**
 * SEO + AI Readiness Audit Script
 * 
 * Crawls rendered HTML from the Vercel deployment (or localhost) for every
 * live page, scores SEO and AI readiness, and writes results to the
 * audit_seo and audit_ai_readiness tables in Supabase.
 * 
 * Scoring:
 *   SEO (100 points): meta title, description, canonical, OG, Twitter,
 *     H1, heading hierarchy, image alt text, internal links, structured data,
 *     sitemap, mobile viewport
 *   AI Readiness (100 points): structured data, semantic HTML, heading clarity,
 *     FAQ/HowTo content, factual details, image alt, ARIA labels
 * 
 * Usage:
 *   npx tsx scripts/audit-seo.ts                       # All live pages
 *   npx tsx scripts/audit-seo.ts --dry-run              # Preview scores
 *   npx tsx scripts/audit-seo.ts --slugs /garage-door-screens,/about
 *   npx tsx scripts/audit-seo.ts --base-url http://localhost:3000
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const baseUrlIdx = args.indexOf('--base-url')
const BASE_URL = baseUrlIdx >= 0
  ? args[baseUrlIdx + 1]
  : 'https://new-rho-neon.vercel.app'
const slugsIdx = args.indexOf('--slugs')
const FILTER_SLUGS: string[] | null = slugsIdx >= 0
  ? args[slugsIdx + 1].split(',').map((s) => s.trim())
  : null

const SITE_URL = 'https://www.mosquitocurtains.com'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SEOAuditResult {
  // Overall
  seo_score: number
  seo_rating: 'excellent' | 'good' | 'needs_work' | 'poor'

  // Meta
  has_meta_title: boolean
  meta_title: string | null
  meta_title_length: number
  meta_title_ok: boolean
  has_meta_description: boolean
  meta_description: string | null
  meta_description_length: number
  meta_description_ok: boolean
  has_canonical: boolean
  canonical_url: string | null

  // OG
  has_og_title: boolean
  has_og_description: boolean
  has_og_image: boolean
  og_image_url: string | null

  // Twitter
  has_twitter_card: boolean

  // Headings
  has_h1: boolean
  h1_count: number
  h1_text: string | null
  heading_hierarchy_ok: boolean

  // Images
  images_have_alt: boolean
  images_missing_alt: number

  // Links
  internal_links_count: number
  external_links_count: number
  broken_links_count: number

  // Technical
  has_robots_meta: boolean
  is_indexable: boolean
  has_sitemap_entry: boolean
  viewport_configured: boolean
  is_mobile_friendly: boolean

  // Issues
  issues: { type: string; message: string; severity: string }[]
  recommendations: { type: string; message: string }[]
}

interface AIAuditResult {
  // Overall
  ai_score: number
  ai_rating: 'excellent' | 'good' | 'needs_work' | 'poor'

  // Structured Data
  has_structured_data: boolean
  structured_data_types: string[]
  structured_data_valid: boolean
  structured_data_errors: string[]

  // Content Quality
  has_clear_headings: boolean
  has_faq_section: boolean
  has_how_to_content: boolean
  content_is_factual: boolean
  has_specific_details: boolean

  // Semantic HTML
  uses_semantic_html: boolean
  has_main_element: boolean
  has_article_element: boolean
  has_nav_element: boolean
  has_header_footer: boolean

  // Accessibility
  has_aria_labels: boolean
  has_skip_links: boolean
  form_labels_ok: boolean

  // Content extraction
  content_in_html: boolean
  avoids_infinite_scroll: boolean
  has_clear_content_boundaries: boolean

  // Issues
  issues: { type: string; message: string; severity: string }[]
  recommendations: { type: string; message: string }[]
}

// ---------------------------------------------------------------------------
// Fetch rendered HTML
// ---------------------------------------------------------------------------

async function fetchRenderedHTML(slug: string): Promise<string | null> {
  const url = slug === '/' ? BASE_URL : `${BASE_URL}${slug}`
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'MosquitoCurtains-SEOAudit/1.0',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(30000),
    })
    if (!resp.ok) {
      console.error(`  HTTP ${resp.status} for ${url}`)
      return null
    }
    return await resp.text()
  } catch (err) {
    console.error(`  Fetch failed for ${url}:`, err)
    return null
  }
}

// ---------------------------------------------------------------------------
// SEO Audit
// ---------------------------------------------------------------------------

function auditSEO(html: string, slug: string, inSitemap: boolean): SEOAuditResult {
  const $ = cheerio.load(html)
  const issues: SEOAuditResult['issues'] = []
  const recommendations: SEOAuditResult['recommendations'] = []
  let score = 0

  // --- Meta Title (15 pts) ---
  const metaTitle = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || null
  const metaTitleLength = metaTitle?.length || 0
  const metaTitleOk = metaTitleLength >= 30 && metaTitleLength <= 70
  const hasMetaTitle = !!metaTitle && metaTitleLength > 0

  if (hasMetaTitle && metaTitleOk) {
    score += 15
  } else if (hasMetaTitle) {
    score += 8
    if (metaTitleLength < 30) issues.push({ type: 'meta_title', message: `Title too short (${metaTitleLength} chars, aim for 50-60)`, severity: 'warning' })
    if (metaTitleLength > 70) issues.push({ type: 'meta_title', message: `Title too long (${metaTitleLength} chars, max ~60)`, severity: 'warning' })
  } else {
    issues.push({ type: 'meta_title', message: 'Missing meta title', severity: 'error' })
  }

  // --- Meta Description (15 pts) ---
  const metaDesc = $('meta[name="description"]').attr('content') || null
  const metaDescLength = metaDesc?.length || 0
  const metaDescOk = metaDescLength >= 120 && metaDescLength <= 165
  const hasMetaDesc = !!metaDesc && metaDescLength > 0

  if (hasMetaDesc && metaDescOk) {
    score += 15
  } else if (hasMetaDesc) {
    score += 8
    if (metaDescLength < 120) issues.push({ type: 'meta_description', message: `Description short (${metaDescLength} chars, aim 150-160)`, severity: 'warning' })
    if (metaDescLength > 165) issues.push({ type: 'meta_description', message: `Description long (${metaDescLength} chars, max ~160)`, severity: 'warning' })
  } else {
    issues.push({ type: 'meta_description', message: 'Missing meta description', severity: 'error' })
  }

  // --- Canonical URL (5 pts) ---
  const canonical = $('link[rel="canonical"]').attr('href') || null
  const hasCanonical = !!canonical
  if (hasCanonical) {
    score += 5
  } else {
    issues.push({ type: 'canonical', message: 'Missing canonical URL', severity: 'warning' })
    recommendations.push({ type: 'canonical', message: 'Add a canonical URL to prevent duplicate content issues' })
  }

  // --- Open Graph (10 pts) ---
  const hasOgTitle = !!$('meta[property="og:title"]').attr('content')
  const hasOgDesc = !!$('meta[property="og:description"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content') || null
  const hasOgImage = !!ogImage

  if (hasOgTitle && hasOgDesc && hasOgImage) {
    score += 10
  } else if (hasOgTitle || hasOgDesc) {
    score += 5
    if (!hasOgImage) issues.push({ type: 'og', message: 'Missing OG image', severity: 'warning' })
  } else {
    issues.push({ type: 'og', message: 'Missing Open Graph tags', severity: 'warning' })
    recommendations.push({ type: 'og', message: 'Add Open Graph tags for better social media sharing' })
  }

  // --- Twitter Card (5 pts) ---
  const hasTwitterCard = !!$('meta[name="twitter:card"]').attr('content')
  if (hasTwitterCard) {
    score += 5
  } else {
    recommendations.push({ type: 'twitter', message: 'Add Twitter Card meta tags' })
  }

  // --- H1 Tag (10 pts) ---
  const h1Elements = $('h1')
  const h1Count = h1Elements.length
  const h1Text = h1Elements.first().text().trim() || null
  const hasH1 = h1Count > 0

  if (hasH1 && h1Count === 1) {
    score += 10
  } else if (hasH1) {
    score += 5
    if (h1Count > 1) issues.push({ type: 'h1', message: `Multiple H1 tags found (${h1Count})`, severity: 'warning' })
  } else {
    issues.push({ type: 'h1', message: 'Missing H1 tag', severity: 'error' })
  }

  // --- Heading Hierarchy (5 pts) ---
  const headingLevels: number[] = []
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headingLevels.push(parseInt(el.tagName?.replace('h', '') || '0'))
  })

  let hierarchyOk = true
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) {
      hierarchyOk = false
      break
    }
  }

  if (hierarchyOk && headingLevels.length > 0) {
    score += 5
  } else if (!hierarchyOk) {
    issues.push({ type: 'headings', message: 'Heading hierarchy has gaps (e.g., H1 -> H3 skipping H2)', severity: 'info' })
  }

  // --- Image Alt Text (10 pts) ---
  let totalImages = 0
  let missingAlt = 0
  $('img').each((_, el) => {
    const src = $(el).attr('src') || ''
    // Skip tracking pixels and tiny images
    if (src.includes('pixel') || src.includes('clickcease') || src.startsWith('data:')) return
    totalImages++
    const alt = $(el).attr('alt')
    if (!alt || alt.trim() === '') missingAlt++
  })

  const imagesHaveAlt = totalImages > 0 && missingAlt === 0
  if (imagesHaveAlt) {
    score += 10
  } else if (totalImages > 0 && missingAlt <= 2) {
    score += 7
    issues.push({ type: 'images', message: `${missingAlt} image(s) missing alt text`, severity: 'warning' })
  } else if (totalImages > 0) {
    score += 3
    issues.push({ type: 'images', message: `${missingAlt} of ${totalImages} images missing alt text`, severity: 'warning' })
  } else {
    score += 10 // No images = no penalty
  }

  // --- Internal Links (5 pts) ---
  let internalLinks = 0
  let externalLinks = 0
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href.startsWith('/') || href.includes('mosquitocurtains.com')) {
      internalLinks++
    } else if (href.startsWith('http')) {
      externalLinks++
    }
  })

  if (internalLinks >= 3) {
    score += 5
  } else if (internalLinks >= 1) {
    score += 3
  } else {
    recommendations.push({ type: 'links', message: 'Add internal links to other pages for better crawlability' })
  }

  // --- Structured Data (10 pts) ---
  const jsonLdScripts = $('script[type="application/ld+json"]')
  const hasStructuredData = jsonLdScripts.length > 0

  if (hasStructuredData) {
    score += 10
  } else {
    issues.push({ type: 'structured_data', message: 'No JSON-LD structured data found', severity: 'warning' })
    recommendations.push({ type: 'structured_data', message: 'Add Schema.org structured data for rich results' })
  }

  // --- Sitemap Entry (5 pts) ---
  if (inSitemap) {
    score += 5
  } else {
    recommendations.push({ type: 'sitemap', message: 'Page not found in sitemap' })
  }

  // --- Mobile Viewport (5 pts) ---
  const viewport = $('meta[name="viewport"]').attr('content') || ''
  const viewportConfigured = viewport.includes('width=device-width')
  if (viewportConfigured) {
    score += 5
  } else {
    issues.push({ type: 'mobile', message: 'Missing or incomplete viewport meta tag', severity: 'warning' })
  }

  // --- Robots Meta ---
  const robotsMeta = $('meta[name="robots"]').attr('content') || ''
  const hasRobotsMeta = !!robotsMeta
  const isIndexable = !robotsMeta.includes('noindex')

  // Rating
  const seo_rating: SEOAuditResult['seo_rating'] =
    score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs_work' : 'poor'

  return {
    seo_score: score,
    seo_rating,
    has_meta_title: hasMetaTitle,
    meta_title: metaTitle,
    meta_title_length: metaTitleLength,
    meta_title_ok: metaTitleOk,
    has_meta_description: hasMetaDesc,
    meta_description: metaDesc,
    meta_description_length: metaDescLength,
    meta_description_ok: metaDescOk,
    has_canonical: hasCanonical,
    canonical_url: canonical,
    has_og_title: hasOgTitle,
    has_og_description: hasOgDesc,
    has_og_image: hasOgImage,
    og_image_url: ogImage,
    has_twitter_card: hasTwitterCard,
    has_h1: hasH1,
    h1_count: h1Count,
    h1_text: h1Text,
    heading_hierarchy_ok: hierarchyOk,
    images_have_alt: imagesHaveAlt,
    images_missing_alt: missingAlt,
    internal_links_count: internalLinks,
    external_links_count: externalLinks,
    broken_links_count: 0, // Would need link checking
    has_robots_meta: hasRobotsMeta,
    is_indexable: isIndexable,
    has_sitemap_entry: inSitemap,
    viewport_configured: viewportConfigured,
    is_mobile_friendly: viewportConfigured, // Basic check
    issues,
    recommendations,
  }
}

// ---------------------------------------------------------------------------
// AI Readiness Audit
// ---------------------------------------------------------------------------

function auditAIReadiness(html: string, slug: string): AIAuditResult {
  const $ = cheerio.load(html)
  const issues: AIAuditResult['issues'] = []
  const recommendations: AIAuditResult['recommendations'] = []
  let score = 0

  // --- Structured Data Present (20 pts) ---
  const jsonLdScripts = $('script[type="application/ld+json"]')
  const hasStructuredData = jsonLdScripts.length > 0
  const structuredDataTypes: string[] = []
  const structuredDataErrors: string[] = []

  jsonLdScripts.each((_, el) => {
    try {
      const content = $(el).text()
      const data = JSON.parse(content)
      const type = data['@type']
      if (type) {
        if (Array.isArray(type)) {
          structuredDataTypes.push(...type)
        } else {
          structuredDataTypes.push(type)
        }
      }
    } catch (e) {
      structuredDataErrors.push('Invalid JSON-LD syntax')
    }
  })

  if (hasStructuredData && structuredDataErrors.length === 0) {
    score += 20
  } else if (hasStructuredData) {
    score += 12
    issues.push({ type: 'structured_data', message: 'JSON-LD has syntax errors', severity: 'warning' })
  } else {
    issues.push({ type: 'structured_data', message: 'No structured data found', severity: 'error' })
    recommendations.push({ type: 'structured_data', message: 'Add JSON-LD structured data (BreadcrumbList, Product, FAQPage, etc.)' })
  }

  // --- Structured Data Types Appropriate (10 pts) ---
  const hasExpectedTypes = structuredDataTypes.some((t) =>
    ['BreadcrumbList', 'Product', 'FAQPage', 'HowTo', 'WebPage', 'Organization', 'LocalBusiness'].includes(t)
  )
  if (hasExpectedTypes && structuredDataTypes.length >= 2) {
    score += 10
  } else if (hasExpectedTypes) {
    score += 5
    recommendations.push({ type: 'structured_data', message: 'Add more structured data types (BreadcrumbList is essential)' })
  } else if (hasStructuredData) {
    score += 3
  }

  // --- Semantic HTML (15 pts) ---
  const hasMain = $('main').length > 0
  const hasArticle = $('article').length > 0
  const hasNav = $('nav').length > 0
  const hasHeader = $('header').length > 0
  const hasFooter = $('footer').length > 0
  const hasHeaderFooter = hasHeader && hasFooter

  const semanticCount = [hasMain, hasArticle, hasNav, hasHeaderFooter].filter(Boolean).length

  if (semanticCount >= 3) {
    score += 15
  } else if (semanticCount >= 2) {
    score += 10
  } else if (semanticCount >= 1) {
    score += 5
  } else {
    issues.push({ type: 'semantic', message: 'No semantic HTML elements found', severity: 'warning' })
    recommendations.push({ type: 'semantic', message: 'Use <main>, <article>, <nav>, <header>, <footer> elements' })
  }

  const usesSemanticHtml = semanticCount >= 2

  // --- Clear Heading Hierarchy (10 pts) ---
  const headings = $('h1, h2, h3, h4, h5, h6')
  const headingCount = headings.length
  let headingsWithContent = 0
  headings.each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 3) headingsWithContent++
  })

  const hasClearHeadings = headingCount >= 3 && headingsWithContent >= 3
  if (hasClearHeadings) {
    score += 10
  } else if (headingCount >= 1) {
    score += 5
  } else {
    issues.push({ type: 'headings', message: 'Too few descriptive headings', severity: 'warning' })
  }

  // --- FAQ Section (10 pts, if applicable) ---
  const faqIndicators = [
    $('[class*="faq"]').length,
    $('dt, dd').length,
    html.includes('FAQPage'),
    $('h2, h3').filter((_, el) => {
      const text = $(el).text().toLowerCase()
      return text.includes('faq') || text.includes('frequently asked')
    }).length,
  ]
  const hasFaqSection = faqIndicators.some((v) => v > 0)
  if (hasFaqSection) score += 10

  // --- HowTo Content (10 pts, if applicable) ---
  const howToIndicators = [
    html.includes('HowTo'),
    $('ol li').length >= 3,
    $('h2, h3').filter((_, el) => {
      const text = $(el).text().toLowerCase()
      return text.includes('how to') || text.includes('steps') || text.includes('installation')
    }).length,
  ]
  const hasHowToContent = howToIndicators.some((v) => v > 0)
  if (hasHowToContent) score += 10

  // If neither FAQ nor HowTo is applicable, redistribute points
  if (!hasFaqSection && !hasHowToContent) {
    // Give partial credit for having substantial content
    const bodyText = $('body').text()
    const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length
    if (wordCount > 300) score += 10
    else if (wordCount > 100) score += 5
  }

  // --- Content Quality (10 pts) ---
  const bodyText = $('body').text()
  const hasNumbers = /\d+\s*(inches?|feet|ft|cm|mm|sq|square|lbs?|oz|pounds?|grams?|degrees?|years?|months?|days?|hours?|minutes?|%)/i.test(bodyText)
  const hasSpecificBrands = /marine.?grade|sunbrella|phifer|textilene|vinyl/i.test(bodyText)
  const contentIsFactual = hasNumbers || hasSpecificBrands
  const hasSpecificDetails = hasNumbers

  if (contentIsFactual && hasSpecificDetails) {
    score += 10
  } else if (contentIsFactual || hasSpecificDetails) {
    score += 5
  } else {
    recommendations.push({ type: 'content', message: 'Add specific measurements, specs, or factual details' })
  }

  // --- Image Alt Text (10 pts) ---
  let totalImages = 0
  let descriptiveAlts = 0
  $('img').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (src.includes('pixel') || src.includes('clickcease') || src.startsWith('data:')) return
    totalImages++
    const alt = $(el).attr('alt')?.trim()
    if (alt && alt.length > 5) descriptiveAlts++
  })

  if (totalImages > 0 && descriptiveAlts === totalImages) {
    score += 10
  } else if (totalImages > 0 && descriptiveAlts >= totalImages * 0.8) {
    score += 7
  } else if (totalImages === 0) {
    score += 10 // No images is fine
  } else {
    score += 3
    recommendations.push({ type: 'images', message: 'Add descriptive alt text to all images' })
  }

  // --- ARIA Labels (5 pts) ---
  const hasAriaLabels = $('[aria-label], [aria-labelledby], [role]').length > 0
  const hasSkipLinks = $('a[href="#main"], a[href="#content"], .skip-link').length > 0
  const formLabels = $('form label').length
  const formInputs = $('form input:not([type="hidden"]), form select, form textarea').length
  const formLabelsOk = formInputs === 0 || formLabels >= formInputs

  if (hasAriaLabels) {
    score += 5
  } else {
    recommendations.push({ type: 'accessibility', message: 'Add ARIA labels to interactive elements' })
  }

  // --- Content Extraction (auto-pass for SSR Next.js) ---
  const contentInHtml = true
  const avoidsInfiniteScroll = true
  const hasClearBoundaries = hasMain || $('[class*="container"], [class*="content"]').length > 0

  // --- Rating ---
  const ai_rating: AIAuditResult['ai_rating'] =
    score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs_work' : 'poor'

  return {
    ai_score: score,
    ai_rating,
    has_structured_data: hasStructuredData,
    structured_data_types: structuredDataTypes,
    structured_data_valid: structuredDataErrors.length === 0,
    structured_data_errors: structuredDataErrors,
    has_clear_headings: hasClearHeadings,
    has_faq_section: hasFaqSection,
    has_how_to_content: hasHowToContent,
    content_is_factual: contentIsFactual,
    has_specific_details: hasSpecificDetails,
    uses_semantic_html: usesSemanticHtml,
    has_main_element: hasMain,
    has_article_element: hasArticle,
    has_nav_element: hasNav,
    has_header_footer: hasHeaderFooter,
    has_aria_labels: hasAriaLabels,
    has_skip_links: hasSkipLinks,
    form_labels_ok: formLabelsOk,
    content_in_html: contentInHtml,
    avoids_infinite_scroll: avoidsInfiniteScroll,
    has_clear_content_boundaries: hasClearBoundaries,
    issues,
    recommendations,
  }
}

// ---------------------------------------------------------------------------
// Write to Supabase
// ---------------------------------------------------------------------------

async function writeSEOAudit(pageId: string, audit: SEOAuditResult): Promise<boolean> {
  const { error } = await supabase
    .from('audit_seo')
    .upsert(
      {
        page_id: pageId,
        ...audit,
        audited_at: new Date().toISOString(),
      },
      { onConflict: 'page_id' }
    )

  if (error) {
    console.error(`  Failed to write SEO audit:`, error.message)
    return false
  }
  return true
}

async function writeAIAudit(pageId: string, audit: AIAuditResult): Promise<boolean> {
  const { error } = await supabase
    .from('audit_ai_readiness')
    .upsert(
      {
        page_id: pageId,
        ...audit,
        audited_at: new Date().toISOString(),
      },
      { onConflict: 'page_id' }
    )

  if (error) {
    console.error(`  Failed to write AI audit:`, error.message)
    return false
  }
  return true
}

async function writeAuditHistory(pageId: string, seoScore: number, aiScore: number): Promise<void> {
  await supabase.from('audit_history').insert({
    page_id: pageId,
    audit_type: 'full',
    seo_score: seoScore,
    ai_score: aiScore,
    overall_score: Math.round(seoScore * 0.6 + aiScore * 0.4),
    audit_data: { seo_score: seoScore, ai_score: aiScore },
  })
}

async function updateLastAudited(pageId: string): Promise<void> {
  await supabase
    .from('site_pages')
    .update({ last_audited_at: new Date().toISOString() })
    .eq('id', pageId)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== SEO + AI Readiness Audit ===')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log()

  // 1. Fetch all live pages
  let query = supabase
    .from('site_pages')
    .select('id, slug, title, page_type')
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

  console.log(`Found ${pages.length} live pages to audit\n`)

  // Build sitemap slug set for checking
  const sitemapSlugs = new Set(pages.map((p) => p.slug))

  let audited = 0
  let failed = 0
  const seoScores: number[] = []
  const aiScores: number[] = []

  for (const page of pages) {
    const slug = page.slug as string
    const pageId = page.id as string
    const title = page.title as string

    process.stdout.write(`  ${slug} ... `)

    // Fetch rendered HTML
    const html = await fetchRenderedHTML(slug)
    if (!html) {
      console.log('FETCH FAILED')
      failed++
      continue
    }

    // Run both audits
    const seoResult = auditSEO(html, slug, sitemapSlugs.has(slug))
    const aiResult = auditAIReadiness(html, slug)

    seoScores.push(seoResult.seo_score)
    aiScores.push(aiResult.ai_score)

    console.log(`SEO: ${seoResult.seo_score}/100 (${seoResult.seo_rating})  |  AI: ${aiResult.ai_score}/100 (${aiResult.ai_rating})`)

    // Log issues
    if (seoResult.issues.length > 0) {
      for (const issue of seoResult.issues) {
        console.log(`    SEO ${issue.severity}: ${issue.message}`)
      }
    }
    if (aiResult.issues.length > 0) {
      for (const issue of aiResult.issues) {
        console.log(`    AI ${issue.severity}: ${issue.message}`)
      }
    }

    if (!DRY_RUN) {
      const seoOk = await writeSEOAudit(pageId, seoResult)
      const aiOk = await writeAIAudit(pageId, aiResult)

      if (seoOk && aiOk) {
        await writeAuditHistory(pageId, seoResult.seo_score, aiResult.ai_score)
        await updateLastAudited(pageId)
        audited++
      } else {
        failed++
      }
    } else {
      audited++
    }

    // Small delay to avoid hammering the server
    await new Promise((r) => setTimeout(r, 200))
  }

  // --- Summary ---
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Pages audited: ${audited}`)
  console.log(`Pages failed: ${failed}`)

  if (seoScores.length > 0) {
    const avgSEO = Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
    const minSEO = Math.min(...seoScores)
    const maxSEO = Math.max(...seoScores)
    console.log(`\nSEO Scores:`)
    console.log(`  Average: ${avgSEO}/100`)
    console.log(`  Range: ${minSEO} - ${maxSEO}`)
    console.log(`  Excellent (90+): ${seoScores.filter((s) => s >= 90).length}`)
    console.log(`  Good (70-89): ${seoScores.filter((s) => s >= 70 && s < 90).length}`)
    console.log(`  Needs Work (50-69): ${seoScores.filter((s) => s >= 50 && s < 70).length}`)
    console.log(`  Poor (<50): ${seoScores.filter((s) => s < 50).length}`)
  }

  if (aiScores.length > 0) {
    const avgAI = Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length)
    const minAI = Math.min(...aiScores)
    const maxAI = Math.max(...aiScores)
    console.log(`\nAI Readiness Scores:`)
    console.log(`  Average: ${avgAI}/100`)
    console.log(`  Range: ${minAI} - ${maxAI}`)
    console.log(`  Excellent (90+): ${aiScores.filter((s) => s >= 90).length}`)
    console.log(`  Good (70-89): ${aiScores.filter((s) => s >= 70 && s < 90).length}`)
    console.log(`  Needs Work (50-69): ${aiScores.filter((s) => s >= 50 && s < 70).length}`)
    console.log(`  Poor (<50): ${aiScores.filter((s) => s < 50).length}`)
  }

  console.log('\nDone!')
}

main().catch(console.error)
