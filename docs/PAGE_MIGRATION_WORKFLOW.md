# Page Migration Workflow

**Last Updated:** February 9, 2026  
**Status:** Active

---

## CRITICAL: Asset Verification

**EVERY PAGE requires Phase 4 (Asset Verification Pass) before completion.**

Common mistakes:
- Missing images from WordPress sections
- Missing videos from WordPress
- Videos without thumbnails
- Skipping the side-by-side comparison

The workflow now includes a dedicated Asset Verification Pass (Phase 4) with explicit counts to ensure nothing is missed.

This document provides a step-by-step workflow for migrating each WordPress page to Next.js using the design system. Every page must follow this process to ensure consistency and quality.

---

## Quick Reference

### Design System Imports (ALWAYS USE THIS)

Import from `@/lib/design-system` only. Use the full design system:

```tsx
import { 
  // Layout
  Container, Stack, Grid, TwoColumn, Frame, FourColumn,
  
  // Typography
  Text, Heading, Title, PageTitles, PageHeader, PageHero,
  
  // Forms & UI
  Button, Badge, Input, Textarea, Select, Checkbox, Radio, RadioGroup,
  
  // Lists
  BulletedList, ListItem, OrderedList, IconList, OfferStack,
  
  // Cards
  Card, FeatureCard, CategoryCard, CategoryGrid, ItemListCard, PricingCard,
  
  // Media
  YouTubeEmbed, Video, ImageLightbox,
  
  // Section Containers
  HeaderBarSection, GradientSection, CTASection, TwoColumnSection,
  
  // Pre-built Templates (EDIT ONCE, UPDATE EVERYWHERE)
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  HowItWorksTemplate,
  WhoWeAreWhatWeDoTemplate,
  FinalCTATemplate,
  ProfessionalsCalloutTemplate,
  
  // Hero actions (when using PowerHeaderTemplate)
  MC_HERO_ACTIONS,
  MC_ACTIONS,
  CV_HERO_ACTIONS,
  getMCHeroActions,
} from '@/lib/design-system'
```

### Page Structure Pattern

```tsx
<Container size="xl">
  <Stack gap="lg">
    {/* 1. HERO - PowerHeaderTemplate or custom */}
    {/* 2. TEMPLATES - WhyChooseUsTemplate, ClientReviewsTemplate, etc. */}
    {/* 3. CONTENT - HeaderBarSection blocks */}
    {/* 4. GALLERY - Grid + Frame + Card if applicable */}
    {/* 5. FINAL CTA - FinalCTATemplate */}
  </Stack>
</Container>
```

---

## Phase 1: Content Extraction (WordPress)

Before writing any code, extract ALL content from the WordPress page.

### 1.1 Visit the WordPress Page

```
URL: https://mosquitocurtains.com/[page-slug]/
```

### 1.2 Create Content Extraction Document

Create a temporary file to store extracted content:

```
/docs/migrations/[page-slug]-content.md
```

### 1.3 Extract These Elements

| Element | What to Capture | Where to Find |
|---------|-----------------|---------------|
| Page Title | H1 heading | Top of page |
| Subtitle | First paragraph under H1 | Below title |
| Meta Description | SEO description | View page source or Yoast |
| Hero Image | Main image URL | Right-click > Copy image address |
| Hero Video | YouTube video ID | Extract from embed URL |
| Video Thumbnail | Custom URL or "YouTube auto" | Use custom image URL, or omit and YouTubeEmbed pulls from YouTube |
| Section Headings | All H2/H3 headings | Throughout page |
| Body Text | All paragraphs | Each section |
| Bullet Lists | All bullet points | Throughout page |
| Images | All image URLs | Right-click > Copy image address |
| Videos | All YouTube video or vimeo IDs | Extract from embeds |
| CTAs | Button text + link destinations | Throughout page |
| Testimonials | Quote text + attribution | If present |

### 1.4 Content Template

Use this template for extraction:

```markdown
# [Page Title] - Content Extraction

## Meta
- **WordPress URL:** /original-slug/
- **New Route:** /new-slug/
- **Meta Title:** 
- **Meta Description:** 

## Hero Section
- **Title:** 
- **Subtitle:** 
- **Video ID:** (YouTube)
- **Thumbnail:** Custom image URL, or leave blank to use YouTube auto thumbnail

## Section 1: [Heading]
- **Icon:** (suggest Lucide icon)
- **Content:**
  [Paragraph text here]
- **Bullets:**
  - Bullet 1
  - Bullet 2
  - Bullet 3
- **Video ID:** (if applicable)
- **Image URL:** (if applicable)
- **CTA:** [Button text] -> [Link destination]

## Section 2: [Heading]
...

## Images to Migrate
| Description | WordPress URL | CloudFront URL |
|-------------|---------------|----------------|
| Hero image | https://... | TBD |
| Section 1 image | https://... | TBD |

## Videos (every video must have a thumbnail: custom URL or YouTube auto)
| Description | YouTube ID | Thumbnail | Used In |
|-------------|------------|-----------|---------|
| Overview | FqNe9pDsZ8M | (YouTube auto) or URL | Hero |
| Installation | abc123 | (YouTube auto) or URL | Section 2 |
```

---

## Phase 2: Content Mapping (Design System)

Map extracted content to design system components.

### 2.1 Page Type Determination

| WordPress Content | Design System Approach |
|-------------------|----------------------|
| Product landing page | PowerHeaderTemplate + HeaderBarSection content |
| FAQ page | HeaderBarSection + BulletedList/Accordion |
| Installation guide | PowerHeaderTemplate + TwoColumn with videos |
| Blog post | Article layout with Text components |
| Gallery page | Grid with Frame components |
| Support page | HeaderBarSection content sections |

### 2.2 Component Mapping

| WordPress Element | Design System Component |
|-------------------|------------------------|
| Hero section | `PowerHeaderTemplate` |
| Section with heading | `HeaderBarSection` |
| Two-column layout | `TwoColumn` |
| Feature list | `BulletedList` + `ListItem` |
| YouTube embed | `YouTubeEmbed` |
| Image | `Frame` + `img` |
| Image gallery | `Grid` + `Frame` |
| Call-to-action | `Button` with `Link` |
| Trust badges | `WhyChooseUsTemplate` |
| Client reviews (6 + CTA) | `ClientReviewsTemplate` |
| Final CTA | `FinalCTATemplate` |

### 2.3 Icon Selection (Lucide React)

Choose icons from Lucide React that match your content:

```tsx
import { 
  Bug,           // Mosquito/pest related
  Shield,        // Protection/guarantee
  Wrench,        // Installation/tools
  Award,         // Quality/awards
  CheckCircle,   // Features/benefits
  Sparkles,      // Premium/special
  Sun,           // Outdoor/weather
  Wind,          // Weather protection
  Thermometer,   // Temperature/seasons
  Camera,        // Photos/gallery
  Play,          // Video
  Phone,         // Contact
  Mail,          // Email
  MapPin,        // Location
  Clock,         // Time/quick
  Truck,         // Shipping
  CreditCard,    // Payment
  Star,          // Reviews/ratings
  Users,         // Customers/testimonials
  Home,          // Residential
  Building2,     // Commercial
  Ruler,         // Measurements
  Scissors,      // Custom/DIY
} from 'lucide-react'
```

---

## Phase 3: Page Creation

### 3.1 Create Page File

```bash
# Create the page directory and file
mkdir -p src/app/[page-slug]
touch src/app/[page-slug]/page.tsx
```

### 3.2 Starter Template

Copy this template and customize:

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Bug, Camera, Shield, Wrench } from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid,
  TwoColumn,
  Frame,
  Text, 
  Button,
  Card,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

// ============================================================================
// PAGE METADATA (update these)
// ============================================================================
const PAGE_CONFIG = {
  title: 'Page Title Here',
  subtitle: 'Clear, concise description of the page content.',
  videoId: 'YOUTUBE_VIDEO_ID',  // or null if no video
  videoTitle: 'Video Title',
  thumbnailUrl: undefined,     // optional: custom thumbnail URL; omit to use YouTube auto
}

// ============================================================================
// CONTENT SECTIONS (extracted from WordPress)
// ============================================================================
const SECTIONS = [
  {
    icon: Bug,
    label: 'Section 1 Label',
    content: `
      Your paragraph content here. Copy directly from WordPress.
      Can be multiple sentences.
    `,
    bullets: [
      'Bullet point 1',
      'Bullet point 2',
      'Bullet point 3',
    ],
    videoId: 'VIDEO_ID_OR_NULL',
    videoTitle: 'Video Title',
    thumbnailUrl: undefined,  // optional; omit to use YouTube thumbnail
    ctaText: 'Call to Action',
    ctaLink: '/destination',
  },
  // Add more sections...
]

// ============================================================================
// GALLERY IMAGES (if applicable)
// ============================================================================
const GALLERY_IMAGES = [
  { src: 'https://cloudfront-url/image1.jpg', alt: 'Description 1' },
  { src: 'https://cloudfront-url/image2.jpg', alt: 'Description 2' },
  // Add more images...
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function PageName() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <PowerHeaderTemplate
          title={PAGE_CONFIG.title}
          subtitle={PAGE_CONFIG.subtitle}
          videoId={PAGE_CONFIG.videoId}
          videoTitle={PAGE_CONFIG.videoTitle}
          thumbnailUrl={PAGE_CONFIG.thumbnailUrl}
          variant="compact"
        />

        {/* ============================================================ */}
        {/* WHY CHOOSE US (shared template) */}
        {/* ============================================================ */}
        <WhyChooseUsTemplate />

        {/* ============================================================ */}
        {/* CLIENT REVIEWS (optional: 6 reviews + See more reviews) */}
        {/* ============================================================ */}
        {/* <ClientReviewsTemplate /> */}

        {/* ============================================================ */}
        {/* CONTENT SECTIONS */}
        {/* ============================================================ */}
        {SECTIONS.map((section, idx) => (
          <HeaderBarSection 
            key={idx}
            icon={section.icon} 
            label={section.label} 
            variant="dark"
          >
            <TwoColumn gap="lg" className="items-center">
              <Stack gap="md">
                <Text className="text-gray-600">
                  {section.content}
                </Text>
                {section.bullets && section.bullets.length > 0 && (
                  <BulletedList spacing="sm">
                    {section.bullets.map((bullet, i) => (
                      <ListItem key={i} variant="checked" iconColor="#406517">
                        {bullet}
                      </ListItem>
                    ))}
                  </BulletedList>
                )}
                {section.ctaText && (
                  <div className="pt-2">
                    <Button variant="primary" asChild>
                      <Link href={section.ctaLink}>
                        {section.ctaText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </Stack>
              {section.videoId && (
                <YouTubeEmbed
                  videoId={section.videoId}
                  title={section.videoTitle}
                  variant="card"
                  thumbnailUrl={section.thumbnailUrl}
                />
              )}
            </TwoColumn>
          </HeaderBarSection>
        ))}

        {/* ============================================================ */}
        {/* GALLERY (if applicable) */}
        {/* ============================================================ */}
        {GALLERY_IMAGES.length > 0 && (
          <HeaderBarSection icon={Camera} label="Project Gallery" variant="dark">
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
              {GALLERY_IMAGES.map((img, idx) => (
                <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Frame>
              ))}
            </Grid>
            <div className="flex justify-center pt-6">
              <Button variant="outline" asChild>
                <Link href="/gallery">
                  See Full Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </HeaderBarSection>
        )}

        {/* ============================================================ */}
        {/* FINAL CTA (shared template) */}
        {/* ============================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
```

### 3.3 Fill In Content

1. Update `PAGE_CONFIG` with hero content
2. Update `SECTIONS` array with all content sections
3. Update `GALLERY_IMAGES` if page has images
4. Remove unused sections

---

## Phase 4: Asset Verification Pass (CRITICAL)

**WHY THIS EXISTS:** Assets (images, videos) are commonly missed or incomplete during the initial build. This dedicated pass ensures EVERY asset from the WordPress page makes it into the Next.js page.

### 4.1 Asset Audit Process

**DO NOT SKIP THIS PHASE.** Open both pages side-by-side:
- LEFT: WordPress page (https://mosquitocurtains.com/[slug]/)
- RIGHT: Next.js page (http://localhost:3002/[slug]/)

### 4.2 Image Verification Checklist

Go through the WordPress page TOP TO BOTTOM and check off each image:

| Check | Action |
|-------|--------|
| 1. Count WordPress images | Write down the total: ____ images |
| 2. Count Next.js images | Write down the total: ____ images |
| 3. Numbers match? | If NO, find missing images |

For EACH image on WordPress:
- [ ] Hero/header image present?
- [ ] All section images present?
- [ ] All gallery images present?
- [ ] All inline content images present?
- [ ] All product images present?
- [ ] All background images present?

**Image Extraction Reminder:**
```
Right-click image -> Copy image address
Check if already on CloudFront, otherwise note for migration
```

### 4.3 Video Verification Checklist

| Check | Action |
|-------|--------|
| 1. Count WordPress videos | Write down the total: ____ videos |
| 2. Count Next.js videos | Write down the total: ____ videos |
| 3. Numbers match? | If NO, find missing videos |

For EACH video on WordPress:
- [ ] Video ID extracted correctly?
- [ ] Video embedded with `YouTubeEmbed variant="card"`?
- [ ] Video has thumbnail? (see 4.4 below)
- [ ] Vimeo videos handled correctly?

**Video ID Extraction:**
```
YouTube: https://www.youtube.com/watch?v=VIDEO_ID
         https://youtu.be/VIDEO_ID
Vimeo:   https://vimeo.com/VIDEO_ID
```

### 4.4 Video Thumbnail Requirement

**RULE: Every video MUST display a thumbnail.** No video should appear without a thumbnail.

You have two options:

1. **Custom thumbnail:** Pass `thumbnailUrl` with your image URL (e.g. from static.mosquitocurtains.com or CloudFront). Use when you have a branded or higher-quality thumbnail.
2. **YouTube auto thumbnail:** Omit `thumbnailUrl`. The `YouTubeEmbed` component will pull the thumbnail from YouTube automatically (tries `maxresdefault.jpg`, then falls back to `hqdefault.jpg`).

**In code:**

```tsx
// Option A: Custom thumbnail (e.g. hero video with branded image)
<YouTubeEmbed 
  videoId="FqNe9pDsZ8M"
  title="Video Title"
  variant="card"
  thumbnailUrl="https://static.mosquitocurtains.com/.../custom-thumb.jpg"
/>

// Option B: Use YouTube's thumbnail (no thumbnailUrl – component fetches it)
<YouTubeEmbed 
  videoId="FqNe9pDsZ8M"
  title="Video Title"
  variant="card"
/>
```

**PowerHeaderTemplate (hero):** Use `thumbnailUrl` when you have a custom hero thumbnail; otherwise omit it and the template will use YouTube's thumbnail for the video.

**YouTube thumbnail URLs (for reference):**
| Size | URL Pattern | Resolution |
|------|-------------|------------|
| Max | `https://img.youtube.com/vi/{id}/maxresdefault.jpg` | 1280x720 |
| High | `https://img.youtube.com/vi/{id}/hqdefault.jpg` | 480x360 |
| Medium | `https://img.youtube.com/vi/{id}/mqdefault.jpg` | 320x180 |

### 4.5 Asset Verification Sign-Off

Before proceeding to Phase 5, confirm:

- [ ] ALL images from WordPress are present in Next.js
- [ ] ALL videos from WordPress are present in Next.js  
- [ ] ALL videos have thumbnails (YouTube auto-thumb or custom)
- [ ] Image count matches: WordPress ____ = Next.js ____
- [ ] Video count matches: WordPress ____ = Next.js ____

**If counts don't match, DO NOT PROCEED. Find and add the missing assets.**

---

## Phase 5: Quality Checklist

### 5.1 Design System Compliance

- [ ] Imports from `@/lib/design-system` (NOT `/components`)
- [ ] Uses `Container size="xl"` as outermost wrapper
- [ ] Uses `Stack gap="lg"` as direct child of Container
- [ ] Uses `PowerHeaderTemplate` for hero
- [ ] Uses `HeaderBarSection variant="dark"` for content sections
- [ ] Uses `TwoColumn` for text + media layouts
- [ ] Uses `BulletedList` + `ListItem` for features
- [ ] Uses `YouTubeEmbed variant="card"` for videos (with thumbnail: custom `thumbnailUrl` or YouTube auto)
- [ ] Uses `ClientReviewsTemplate` where client reviews are needed
- [ ] Ends with `FinalCTATemplate`
- [ ] NO `mb-X`, `mt-X`, `my-X` on direct Stack children
- [ ] NO `PageLayout` wrapper (GlobalLayout handles this)

### 5.2 Content Completeness

- [ ] All text content migrated from WordPress
- [ ] All images migrated and URLs updated (verified in Phase 4)
- [ ] All videos embedded with correct IDs (verified in Phase 4)
- [ ] All video thumbnails present (verified in Phase 4)
- [ ] All links updated to new routes
- [ ] Meta title set (via Next.js metadata)
- [ ] Meta description set
- [ ] Alt text on all images

### 5.3 Mobile Responsiveness

- [ ] Test at 375px width (iPhone SE)
- [ ] Test at 768px width (iPad)
- [ ] Test at 1024px width (laptop)
- [ ] Test at 1440px width (desktop)
- [ ] All text readable on mobile
- [ ] All buttons tappable on mobile
- [ ] Images don't overflow on mobile
- [ ] TwoColumn stacks properly on mobile

---

## Phase 6: SEO & Metadata

### 6.1 Add Metadata Export

Add metadata to the page file:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Mosquito Curtains',
  description: 'Meta description copied from WordPress or improved.',
  openGraph: {
    title: 'Page Title | Mosquito Curtains',
    description: 'Meta description...',
    images: ['/og-image.jpg'],
  },
}
```

### 6.2 SEO Checklist

- [ ] Title tag is unique and descriptive (50-60 chars)
- [ ] Meta description is compelling (150-160 chars)
- [ ] H1 matches or closely matches title tag
- [ ] Only ONE H1 per page
- [ ] H2s used for section headings
- [ ] Images have descriptive alt text
- [ ] Internal links use correct new routes

---

## Phase 7: Redirect Configuration

If the URL changed, add a redirect.

### 7.1 Update next.config.ts

```typescript
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      // Add your redirect
      {
        source: '/old-wordpress-slug/',
        destination: '/new-nextjs-slug/',
        permanent: true,  // 301 redirect
      },
    ]
  },
}
```

### 7.2 Redirect Testing

- [ ] Old URL redirects to new URL
- [ ] Redirect is 301 (permanent)
- [ ] No redirect loops

---

## Phase 8: Final Review & Completion

### 8.1 Visual Comparison

1. Open WordPress page in one browser tab
2. Open Next.js page in another tab
3. Compare side-by-side
4. Verify all content is present
5. Verify visual hierarchy matches
6. **FINAL ASSET CHECK:** Count images and videos one more time

### 8.2 Deployment

```bash
# Commit the page
git add src/app/[page-slug]/
git commit -m "feat: migrate /page-slug/ page from WordPress"

# Push to trigger deployment
git push
```

### 8.3 Post-Deployment Verification

After deployment completes:
- [ ] Production page loads correctly
- [ ] All images load on production
- [ ] All videos play on production (and each has a thumbnail)
- [ ] Mobile view works on production

---

## Templates Reference

### Available Templates (Edit Once, Update Everywhere)

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `PowerHeaderTemplate` | Hero with video + action cards; optional subtitle, thumbnailUrl | All category/product pages |
| `WhyChooseUsTemplate` | "Why X+ Customers Choose Us" + Google Reviews + 4 feature cards | Most pages |
| `ClientReviewsTemplate` | "X+ Happy Clients Since 2004" + 6 review cards + See more reviews | Pages that need social proof |
| `HowItWorksTemplate` | 3-step process (Plan → Receive → Install) | Landing pages |
| `WhoWeAreWhatWeDoTemplate` | Two-column "Who We Are" / "What We Do" | About-style pages |
| `FinalCTATemplate` | Big gradient CTA | All page bottoms |
| `ProfessionalsCalloutTemplate` | "For Professionals" callout with header bar | Trade/pro pages |

### To Edit a Template Globally

1. Find the template in `src/lib/design-system/templates/`
2. Edit the file
3. All pages using that template will update automatically

### Section Containers (Add Your Own Content)

| Container | Purpose | When to Use |
|-----------|---------|-------------|
| `HeaderBarSection` | Colored header bar + content | Most content sections |
| `GradientSection` | Gradient-bordered card | Special sections |
| `CTASection` | Call-to-action block | Mid-page CTAs |
| `TwoColumnSection` | Two-column layout | Text + media |

---

## Common Patterns

### Text + Video Section

```tsx
<HeaderBarSection icon={Bug} label="Section Title" variant="dark">
  <TwoColumn gap="lg" className="items-center">
    <Stack gap="md">
      <Text className="text-gray-600">
        Paragraph content here...
      </Text>
      <BulletedList spacing="sm">
        <ListItem variant="checked" iconColor="#406517">Feature 1</ListItem>
        <ListItem variant="checked" iconColor="#406517">Feature 2</ListItem>
      </BulletedList>
      <div className="pt-2">
        <Button variant="primary" asChild>
          <Link href="/destination">
            Call to Action
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Stack>
    <YouTubeEmbed videoId="VIDEO_ID" title="Title" variant="card" />
  </TwoColumn>
</HeaderBarSection>
```

### Image Gallery Section

```tsx
<HeaderBarSection icon={Camera} label="Gallery" variant="dark">
  <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
    {images.map((img, idx) => (
      <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Frame>
    ))}
  </Grid>
</HeaderBarSection>
```

### FAQ Section

```tsx
<HeaderBarSection icon={HelpCircle} label="Frequently Asked Questions" variant="dark">
  <Stack gap="md">
    {faqs.map((faq, idx) => (
      <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
        <Text className="font-semibold text-gray-900 mb-2">{faq.question}</Text>
        <Text className="text-gray-600">{faq.answer}</Text>
      </div>
    ))}
  </Stack>
</HeaderBarSection>
```

### Centered CTA Button

```tsx
<div className="flex justify-center pt-4">
  <Button variant="primary" asChild>
    <Link href="/start-project">
      Get Started
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
  </Button>
</div>
```

---

## Troubleshooting

### Issue: Double padding/margins

**Cause:** Using `PageLayout` wrapper or adding padding to `Container`

**Fix:** Remove `PageLayout` wrapper. GlobalLayout handles this.

### Issue: Uneven section spacing

**Cause:** Using `mb-X` classes on Stack children

**Fix:** Remove all margin classes from direct Stack children. Use `Stack gap="lg"`.

### Issue: Video not displaying

**Cause:** Wrong video ID format

**Fix:** Use only the 11-character ID, not full URL. Example: `FqNe9pDsZ8M`

### Issue: Images stretched/distorted

**Cause:** Not using Frame component

**Fix:** Wrap images in `<Frame ratio="16/9">` or appropriate ratio.

### Issue: Mobile layout broken

**Cause:** Fixed widths or columns

**Fix:** Use responsive classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Summary: The Golden Path

For every page migration:

1. **Extract** all content from WordPress
2. **Map** content to design system components
3. **Create** page using the starter template
4. **Fill in** content from extraction
5. **Check** design system compliance
6. **Test** on mobile and desktop
7. **Add** metadata for SEO
8. **Configure** redirects if URL changed
9. **Compare** visually with WordPress
10. **Commit** and deploy (no database steps required)

**Reference Files:**
- `src/app/screened-porch/page.tsx` - Category page pattern
- `src/app/page.tsx` - Custom hero pattern
- `http://localhost:3002/design-system` - All components

---

## Automated pipeline: Crawl → Extract → Fix URLs → Verify → Rewrite

This section explains the **script-based** process for crawling WordPress HTML, extracting assets and text, stripping low-res image URL addons, verifying fixed URLs, and rewriting pages with the design system.

### Overview

| Step | What happens | Script / util |
|------|----------------|---------------|
| 1. Crawl | Fetch live WordPress page HTML | `audit-content.ts`, `resolve-content-gaps.ts` |
| 2. Extract | Pull images, videos, headings, body text from HTML | Cheerio in both scripts |
| 3. Strip WP URL addons | Convert low-res image URLs to full-res | `fix-image-urls.ts`, `src/lib/utils/image-url.ts` |
| 4. Verify | Ensure the fixed URL returns HTTP 200 | `fix-image-urls.ts` (HEAD request) |
| 5. Rewrite | Generate design-system JSX and write `page.tsx` | `resolve-content-gaps.ts` |

### 1. Crawling the HTML

- **Scripts:** `scripts/audit-content.ts`, `scripts/resolve-content-gaps.ts`
- **Source:** `https://www.mosquitocurtains.com/{path}/` (trailing slash for WordPress).
- **How:** `fetch()` with a friendly `User-Agent`, then parse the response with **Cheerio** (jQuery-like API) to query the DOM.

### 2. Getting images, videos, and text

**Images**

- Cheerio selects `img` and reads `src` (or `data-src` for lazy-loaded images).
- Only URLs under `wp-content/uploads` or `wp-media-folder` are kept.
- Template/chrome images are filtered out (logos, planner images, thumbnails, etc.) via `TEMPLATE_IMAGE_PATTERNS` and `TEMPLATE_IMAGE_PATTERNS` in the scripts.
- Each image is stored as `{ src, alt }`.

**Videos**

- Regex over the **raw HTML** for YouTube URLs: `youtube.com/embed/`, `youtube.com/watch?v=`, `youtu.be/`.
- The 11-character video ID is extracted; template/known IDs (e.g. photo guidelines) are excluded.

**Text**

- **Headings:** `h1`–`h4` text, deduped and filtered against shared template headings (e.g. “Contact us”, “Why choose us”).
- **Body:** Text is taken from Elementor widgets (e.g. `.elementor-widget-text-editor`, `.elementor-widget-toggle`, `.elementor-icon-box-content`), then joined and word-counted.
- **Sections:** Content is grouped by heading so “Section = heading + following paragraphs/lists/images” for mapping to design-system sections.

### 3. Stripping WordPress URL addons (low-res images)

WordPress and plugins often append resolution and duplicate markers to filenames. Those produce low-res or duplicate variants.

**Examples of what gets stripped or changed:**

| WordPress URL pattern | Meaning | Action |
|----------------------|--------|--------|
| `Image-200x150-1.jpg` | 200×150 thumb + duplicate #1 | Strip `-200x150-1` → use base `Image.jpg` (or appropriate full-size) |
| `Image-400x300-1.jpg` | User’s 400×300 size | Treated as “user size”; may be swapped to `-1200x900` (see below) |
| `Image-300x225.jpg` | WP-generated size | Strip `-300x225` → base filename |
| `Image-768x576.jpg` | WP-generated size | Strip → base |
| `Image-1200-400x300.jpg` | Crop from 1200px width | Strip `-400x300`, keep base |

**Where it’s implemented**

- **Runtime / shared util:** `src/lib/utils/image-url.ts` — `normalizeImageUrl(url)`.
- **Batch fix for existing code:** `scripts/fix-image-urls.ts` — scans all `.tsx`/`.ts` under `src/`, finds `static.mosquitocurtains.com` image URLs, normalizes them with the same rules, then (optionally) rewrites the file.

**Rules (summary):**

1. Only alter URLs that include `static.mosquitocurtains.com`.
2. Strip trailing **dimension suffixes** like `-200x150`, `-300x225`, `-768x576`, etc., except “user” sizes `400x300` and `1200x900`.
3. Strip trailing **duplicate markers** (e.g. `-1`, `-2`) when they follow a dimension (so `-200x150-1` → strip both).
4. **User sizes:** If the only dimension left is `-400x300`, replace with `-1200x900` for higher resolution; if the path already has `-1200`, just strip the extra dimension.

Result: one “best” URL per image (no low-res addons, preferring 1200×900 when that’s the user size).

### 4. Testing that the fixed URL exists

- **Script:** `scripts/fix-image-urls.ts`
- **How:** After normalizing a URL, the script runs a **HEAD request** (`fetch(url, { method: 'HEAD', redirect: 'follow' })`) to the normalized URL.
- **If the response is not OK (e.g. 404):** that replacement is **not** applied; the original URL is left in the file and the script reports “SKIP (404)”.
- **Usage:**  
  - `npx tsx scripts/fix-image-urls.ts` — fix and rewrite files.  
  - `npx tsx scripts/fix-image-urls.ts --dry-run` — show what would change without writing.  
  - `npx tsx scripts/fix-image-urls.ts --skip-validation` — normalize and rewrite without HEAD checks (use only when you’re sure targets exist).

So: “fixed URL” = normalized URL that has been verified to exist (unless validation is skipped).

### 5. Rewriting the page with the design system

- **Script:** `scripts/resolve-content-gaps.ts`
- **Input:** Pages in `site_pages` with `needs_revision` and `revision_items` (from the audit) describing missing images, word-count gap, missing headings, etc.
- **Process:**
  1. For each such page, **re-fetch the WordPress HTML** and re-extract content (sections with heading, text, images, lists).
  2. **Images:** If the URL is already on `static.mosquitocurtains.com`, use it as-is. Otherwise the script can migrate the image to S3/CloudFront and use the new URL (optional).
  3. **Sections** are turned into design-system JSX:
     - **HeaderBarSection** (with icon and label) for each section.
     - **Grid** + **Card** + **Frame** for galleries; **TwoColumn** + **Frame** for inline image + text.
     - **Stack**, **Text**, **BulletedList** for paragraphs and lists.
  4. Required design-system imports are inferred and added.
  5. The script **writes** the updated `page.tsx` (or shows a diff in `--dry-run`).

So the “rewriting” step is: **crawled + extracted content → design-system components → overwrite or patch the Next.js page file**.

### End-to-end flow (automated)

1. **Audit (optional but typical):**  
   `npx tsx scripts/audit-content.ts`  
   Fetches each WordPress page, extracts videos, images, headings, word count, and (optionally) writes findings to `site_pages` (e.g. `revision_items`).

2. **Fix image URLs in the repo:**  
   `npx tsx scripts/fix-image-urls.ts`  
   Scans `src/**/*.tsx`, normalizes `static.mosquitocurtains.com` image URLs (strip WP addons, prefer high-res), verifies each with a HEAD request, and rewrites the file only when the new URL exists.

3. **Resolve gaps and rewrite pages:**  
   `npx tsx scripts/resolve-content-gaps.ts`  
   For pages marked `needs_revision`, re-crawls WP, extracts sections and assets, generates design-system JSX, and writes `page.tsx`.  
   Use `--dry-run` to preview, or `--images-only` / `--text-only` to limit scope.

Manual follow-up (e.g. Phase 4 Asset Verification in this doc) is still recommended after any automated rewrite to confirm image/video counts and quality.
