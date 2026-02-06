# Page Migration Tracker

**Last Updated:** February 5, 2026 (Asset verification pass added)  
**Status:** Active  
**Total Pages:** 276 WordPress URLs - ~170 to migrate (rest are redirects/deprecated)

---

## Migration Resources

| Resource | Path | Purpose |
|----------|------|---------|
| Migration Workflow | `docs/PAGE_MIGRATION_WORKFLOW.md` | Step-by-step process for each page |
| Content Extraction Template | `docs/migrations/_TEMPLATE.md` | Template for extracting WordPress content |
| Design System Reference | `http://localhost:3002/design-system` | Live component examples |
| Page Building Rules | `rules/PAGE_BUILDING_RULES.md` | Design system patterns |
| Reference Page | `src/app/screened-porch/page.tsx` | Copy this pattern for new pages |
| **Admin Audit UI** | `http://localhost:3002/admin/audit` | **Track page status in database** |

**Before starting any page:** Read `docs/PAGE_MIGRATION_WORKFLOW.md` for the complete process.

**After completing any page:** Update the database via Admin Audit UI or SQL.

---

## Quick Stats

| Category | Total | Complete | In Progress | Not Started |
|----------|-------|----------|-------------|-------------|
| Legal/Policy | 1 | 1 | 0 | 0 |
| Core Product Pages | 16 | 14 | 0 | 2 |
| Planning/Options | 29 | 4 | 0 | 25 |
| Conversion Pages | 4 | 1 | 0 | 3 |
| Installation/Care | 6 | 6 | 0 | 0 |
| Support/Info | 10 | 9 | 0 | 1 |
| Raw Netting | 12 | 1 | 0 | 11 |
| Blog | 18 | 1 | 0 | 17 |
| Gallery | 12 | 2 | 0 | 10 |
| Marketing/Social | 7 | 1 | 0 | 6 |
| Business/Utility | 10 | 3 | 0 | 7 |
| SEO Landing Pages | 8 | 1 | 0 | 7 |
| WooCommerce Products | ~80 | 0 | 0 | ~80 |
| **TOTAL** | **~213** | **43** | **0** | **~170** |

**Completion:** 20% (43/213 pages migrated)

### Currently Live in Next.js (35 routes)

```
[DONE] / (home)
[DONE] /about
[DONE] /awning-screen-enclosures
[DONE] /care/clear-vinyl
[DONE] /care/mosquito-curtains
[DONE] /cart (system)
[DONE] /clear-vinyl-options
[DONE] /clear-vinyl-plastic-patio-enclosures
[DONE] /contact
[DONE] /gallery
[DONE] /gallery/[slug]
[DONE] /garage-door-screens
[DONE] /gazebo-screen-curtains
[DONE] /industrial-netting
[DONE] /install
[DONE] /install/clear-vinyl
[DONE] /install/tracking
[DONE] /install/velcro
[DONE] /my-orders (new)
[DONE] /my-projects (new)
[DONE] /options
[DONE] /options/clear-vinyl
[DONE] /order/[id] (system)
[DONE] /our-story
[DONE] /pergola-screen-curtains
[DONE] /professionals
[DONE] /raw-netting-fabric-store
[DONE] /reviews
[DONE] /satisfaction-guarantee
[DONE] /screen-patio
[DONE] /screened-in-decks
[DONE] /screened-porch
[DONE] /screened-porch-enclosures
[DONE] /shipping
[DONE] /start-project
[DONE] /privacy-policy
[DONE] /french-door-screens
[DONE] /returns
[DONE] /faq
[DONE] /faq/mosquito-curtains
[DONE] /fb
[DONE] /boat-screens
[DONE] /weather-curtains
[DONE] /pollen-protection
[DONE] /opportunities
```

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `[DONE]` | Page is live in Next.js + database updated |
| `[WIP]` | Currently being built |
| `[EXTRACTING]` | Content being extracted from WordPress |
| `[TODO]` | Needs to be built |
| `[REDIRECT]` | No page needed, just redirect |
| `[SKIP]` | Don't migrate (internal/test page) |
| `[PRIORITY]` | High traffic page per GA4/legacy_leads data |

### Workflow for Each Page

```
[TODO] -> [EXTRACTING] -> [WIP] -> [ASSET PASS] -> [DONE]
           |                |           |             |
           v                v           v             v
   docs/migrations/     src/app/    Verify ALL    Update DB
   [slug]-content.md    [slug]/     images &      site_pages
                        page.tsx    videos        table
```

### Completion Checklist (EVERY PAGE)

Before marking `[DONE]`:

1. **Asset Verification Pass** (Phase 4 in workflow)
   - [ ] Count images: WordPress = Next.js
   - [ ] Count videos: WordPress = Next.js
   - [ ] All videos have thumbnails

2. **Database Update** (REQUIRED)
   ```sql
   UPDATE site_pages SET migration_status = 'live', review_status = 'complete', went_live_at = NOW() WHERE slug = '/page-slug/';
   ```
   Or use Admin UI: `/admin/audit`

3. **Update this tracker**
   - Change `[TODO]` to `[DONE]`
   - Update Quick Stats

---

## Phase 0: Legal (CRITICAL - Do First) - COMPLETE

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Privacy Policy | `/privacy-policy/` | `/privacy-policy/` | **CRITICAL** | Legal requirement |

---

## Phase 1: Core Product Landing Pages

These are the main SEO landing pages. Check `page_analytics` for traffic data.

### Main Product Pages (2)

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Screen Porch Enclosures | `/screened-porch-enclosures/` | `/screened-porch-enclosures/` | [PRIORITY] HIGH | Main MC landing |
| [DONE] | Clear Vinyl Patio Enclosures | `/clear-vinyl-plastic-patio-enclosures/` | `/clear-vinyl-plastic-patio-enclosures/` | [PRIORITY] HIGH | Main CV landing |

### Project Type Pages (14)

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Screened Porch | `/screened-porch/` | `/screened-porch/` | [PRIORITY] HIGH | |
| [DONE] | Screen Patio | `/screen-patio/` | `/screen-patio/` | [PRIORITY] HIGH | |
| [DONE] | Garage Door Screens | `/garage-door-screens/` | `/garage-door-screens/` | HIGH | |
| [DONE] | Pergola Screen Curtains | `/pergola-screen-curtains/` | `/pergola-screen-curtains/` | HIGH | |
| [DONE] | Gazebo Screen Curtains | `/gazebo-screen-curtains/` | `/gazebo-screen-curtains/` | HIGH | |
| [DONE] | Screened in Decks | `/screened-in-decks/` | `/screened-in-decks/` | HIGH | |
| [DONE] | Awning Screen Enclosures | `/awning-screen-enclosures/` | `/awning-screen-enclosures/` | HIGH | |
| [DONE] | Industrial Netting | `/industrial-netting/` | `/industrial-netting/` | MEDIUM | |
| [DONE] | French Door Screens | `/french-door-screens/` | `/french-door-screens/` | HIGH | 10-page test |
| [DONE] | Boat Screens | `/boat-screens/` | `/boat-screens/` | MEDIUM | 10-page test |
| [TODO] | Tent Screens | `/tentscreenpanels/` | `/tent-screens/` | MEDIUM | Missing |
| [TODO] | Yardistry Gazebo Curtains | `/yardistry-gazebo-curtains/` | `/yardistry-gazebo-curtains/` | MEDIUM | Specific product |
| [TODO] | HVAC Chiller Screens | `/hvac-chiller-screens/` | `/hvac-chiller-screens/` | LOW | Industrial niche |
| [DONE] | Pollen Protection | `/pollen-protection/` | `/pollen-protection/` | LOW | 10-page test |

---

## Phase 2: Conversion/Quote Pages (CRITICAL for Attribution)

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Start Project | `/start-project/` | `/start-project/` | [PRIORITY] CRITICAL | Main conversion |
| [TODO] | MC Instant Quote | `/mosquito-curtains-instant-quote/` | `/quote/mosquito-curtains/` | [PRIORITY] CRITICAL | Tracks `quote_started` |
| [TODO] | CV Instant Quote | `/clear-vinyl-instant-quote/` | `/quote/clear-vinyl/` | [PRIORITY] CRITICAL | Tracks `quote_started` |
| [TODO] | Work With A Planner | `/work-with-a-planner/` | `/work-with-a-planner/` | [PRIORITY] HIGH | Main CTA |

---

## Phase 3: Planning/Options Pages

### Options Hub (4)

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Options Hub | `/options/` | `/options/` | HIGH | Planning hub |
| [DONE] | Clear Vinyl Options | `/clear-vinyl-options/` | `/clear-vinyl-options/` | HIGH | CV landing |
| [DONE] | Options / Clear Vinyl | N/A (nested) | `/options/clear-vinyl/` | HIGH | CV details |
| [TODO] | Plan Screen Porch | `/plan-screen-porch/` | `/plan/` | HIGH | MC planning hub |

### Plan Screen Porch Sub-pages (19)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Mesh and Colors | `/plan-screen-porch/mesh-and-colors/` | `/plan/mesh-colors/` | HIGH |
| [TODO] | Outdoor Curtain Tracking | `/plan-screen-porch/outdoor-curtain-tracking/` | `/plan/tracking/` | HIGH |
| [TODO] | Magnetic Doorways | `/plan-screen-porch/magnetic-doorways/` | `/plan/magnetic-doorways/` | MEDIUM |
| [TODO] | Sealing The Base | `/plan-screen-porch/sealing-the-base/` | `/plan/sealing-base/` | MEDIUM |
| [TODO] | How To Order | `/plan-screen-porch/how-to-order/` | `/plan/how-to-order/` | MEDIUM |
| [TODO] | Single Sided Exposure | `/plan-screen-porch/single-sided-exposure/` | `/plan/1-sided/` | MEDIUM |
| [TODO] | 2 Sided Exposure | `/plan-screen-porch/2-sided-exposure/` | `/plan/2-sided/` | MEDIUM |
| [TODO] | 3 Sided Exposure | `/plan-screen-porch/3-sided-exposure/` | `/plan/3-sided/` | MEDIUM |
| [TODO] | 4 Plus Sided Exposure | `/plan-screen-porch/4-plus-sided-exposure/` | `/plan/4-sided/` | MEDIUM |
| [TODO] | Free Standing | `/plan-screen-porch/free-standing/` | `/plan/free-standing/` | MEDIUM |
| [TODO] | Tents and Awnings | `/plan-screen-porch/tents-and-awnings/` | `/plan/tents-awnings/` | MEDIUM |
| [TODO] | 2-Sided Regular Tracking | `/plan-screen-porch/2-sided-exposure/regular-columns-tracking/` | `/plan/2-sided/regular-tracking/` | LOW |
| [TODO] | 2-Sided Irregular Tracking | `/plan-screen-porch/2-sided-exposure/irregular-columns-tracking/` | `/plan/2-sided/irregular-tracking/` | LOW |
| [TODO] | 2-Sided Regular Velcro | `/plan-screen-porch/2-sided-exposure/regular-columns-velcro/` | `/plan/2-sided/regular-velcro/` | LOW |
| [TODO] | 2-Sided Irregular Velcro | `/plan-screen-porch/2-sided-exposure/irregular-columns-velcro/` | `/plan/2-sided/irregular-velcro/` | LOW |
| [TODO] | 3-Sided Regular Tracking | `/plan-screen-porch/3-sided-exposure/regular-columns-tracking/` | `/plan/3-sided/regular-tracking/` | LOW |
| [TODO] | 3-Sided Irregular Tracking | `/plan-screen-porch/3-sided-exposure/irregular-columns-tracking/` | `/plan/3-sided/irregular-tracking/` | LOW |
| [TODO] | 3-Sided Regular Velcro | `/plan-screen-porch/3-sided-exposure/regular-columns-velcro/` | `/plan/3-sided/regular-velcro/` | LOW |
| [TODO] | 3-Sided Irregular Velcro | `/plan-screen-porch/3-sided-exposure/irregular-columns-velcro/` | `/plan/3-sided/irregular-velcro/` | LOW |
| [TODO] | 4-Sided Regular Tracking | `/plan-screen-porch/4-plus-sided-exposure/regular-columns-tracking/` | `/plan/4-sided/regular-tracking/` | LOW |
| [TODO] | 4-Sided Irregular Tracking | `/plan-screen-porch/4-plus-sided-exposure/screen-a-wrap-around-porch.../` | `/plan/4-sided/irregular-tracking/` | LOW |
| [TODO] | 4-Sided Regular Velcro | `/plan-screen-porch/4-plus-sided-exposure/regular-columns-velcro/` | `/plan/4-sided/regular-velcro/` | LOW |
| [TODO] | 4-Sided Irregular Velcro | `/plan-screen-porch/4-plus-sided-exposure/irregular-columns-velcro/` | `/plan/4-sided/irregular-velcro/` | LOW |

### Clear Vinyl Options Sub-pages (6)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Apron Colors | `/apron-colors-to-choose-from/` | `/options/clear-vinyl/apron-colors/` | MEDIUM |
| [TODO] | What Can Go Wrong | `/what-can-go-wrong-with-clear-vinyl/` | `/options/clear-vinyl/considerations/` | MEDIUM |
| [TODO] | Self-Install Advantages | `/clear-vinyl-self-installation-advantages/` | `/options/clear-vinyl/diy/` | MEDIUM |
| [TODO] | What Makes Product Better | `/what-makes-our-clear-vinyl-product-better/` | `/options/clear-vinyl/quality/` | MEDIUM |
| [TODO] | Ordering Clear Vinyl | `/ordering-clear-vinyl/` | `/options/clear-vinyl/ordering/` | MEDIUM |
| [TODO] | Project Planning | `/project-planning/` | `/plan/overview/` | MEDIUM |

---

## Phase 4: Installation & Care Pages

### Installation (4) - ALL COMPLETE

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [DONE] | Install Hub | `/install/` | `/install/` | HIGH |
| [DONE] | Tracking Installation | `/mosquito-curtains-tracking-installation/` | `/install/tracking/` | HIGH |
| [DONE] | Velcro Installation | `/mosquito-curtains-velcro-installation/` | `/install/velcro/` | HIGH |
| [DONE] | Clear Vinyl Installation | `/clear-vinyl-installation/` | `/install/clear-vinyl/` | HIGH |

### Care Guides (2) - ALL COMPLETE

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [DONE] | Care for MC | `/caring-for-mosquito-curtains/` | `/care/mosquito-curtains/` | MEDIUM |
| [DONE] | Care for CV | `/caring-for-clear-vinyl/` | `/care/clear-vinyl/` | MEDIUM |

---

## Phase 5: Support & Info Pages

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | About | `/about/` | `/about/` | MEDIUM | |
| [DONE] | Contact | `/contact/` | `/contact/` | HIGH | Lead capture |
| [DONE] | Shipping | `/shipping/` | `/shipping/` | MEDIUM | |
| [DONE] | Satisfaction Guarantee | `/satisfaction-guarantee/` | `/satisfaction-guarantee/` | MEDIUM | |
| [DONE] | Reviews | `/mosquito-curtains-reviews/` | `/reviews/` | MEDIUM | |
| [DONE] | Professionals | `/professionals/` | `/professionals/` | MEDIUM | |
| [DONE] | Returns | `/returns/` | `/returns/` | MEDIUM | 10-page test |
| [DONE] | FAQ Hub | `/faqs/` | `/faq/` | MEDIUM | 10-page test |
| [DONE] | MC FAQ | `/mosquito-curtains-faq/` | `/faq/mosquito-curtains/` | MEDIUM | 10-page test |
| [TODO] | CV FAQ | `/clear-vinyl-faq/` | `/faq/clear-vinyl/` | MEDIUM | Missing |

---

## Phase 6: Raw Netting Section

### Main Pages (5)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [DONE] | Fabric Store | `/raw-netting-fabric-store/` | `/raw-netting-fabric-store/` | HIGH |
| [TODO] | Mosquito Netting Hub | `/mosquito-netting/` | `/raw-netting/` | HIGH |
| [TODO] | Mosquito Net | `/mosquito-net/` | `/raw-netting/mosquito-net/` | MEDIUM |
| [TODO] | No-See-Um Netting | `/no-see-um-netting-screen/` | `/raw-netting/no-see-um/` | MEDIUM |
| [TODO] | Shade Screen Mesh | `/shade-screen-mesh/` | `/raw-netting/shade-mesh/` | MEDIUM |

### Sub-pages (7)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Theatre Scrim | `/theatre-scrim/` | `/raw-netting/scrim/` | MEDIUM |
| [TODO] | Industrial Mesh | `/industrial-mesh/` | `/raw-netting/industrial/` | MEDIUM |
| [TODO] | Attachment Hardware | `/mosquito-netting/all-netting-and-attachment-hardware/` | `/raw-netting/hardware/` | MEDIUM |
| [TODO] | Netting Ideas / Custom | `/mosquito-netting/let-us-make-it-for-you/` | `/raw-netting/custom/` | MEDIUM |
| [TODO] | Why Us for Raw Netting | `/mosquito-netting/why-us-for-raw-netting/` | `/raw-netting/why-us/` | LOW |
| [TODO] | Fasteners & Rigging | `/mosquito-netting/fasteners-and-rigging-ideas/` | `/raw-netting/rigging/` | LOW |
| [TODO] | Theater Scrims | `/theater-scrims/` | `/theater-scrims/` | LOW |

---

## Phase 7: Marketing/Social Landing Pages

**CRITICAL for Attribution** - These are ad landing pages that need UTM/GCLID tracking.

| Status | Page | WordPress URL | Next.js Route | Priority | Notes |
|--------|------|---------------|---------------|----------|-------|
| [DONE] | Facebook Hub | `/fb/` | `/fb/` | [PRIORITY] HIGH | 10-page test |
| [TODO] | FB MC Quote | `/fb/mc-quote/` | `/fb/mc-quote/` | [PRIORITY] HIGH | FB ad to MC quote |
| [TODO] | FB CV Quote | `/fb/cv-quote/` | `/fb/cv-quote/` | [PRIORITY] HIGH | FB ad to CV quote |
| [TODO] | Reddit Hub | `/reddit/` | `/reddit/` | [PRIORITY] HIGH | Reddit ad landing |
| [TODO] | Reddit MC Quote | `/reddit/mc-quote/` | `/reddit/mc-quote/` | [PRIORITY] HIGH | Reddit ad to MC quote |
| [TODO] | Videos | `/videos/` | `/videos/` | MEDIUM | Video content hub |
| [TODO] | Photos | `/photos/` | `/photos/` | MEDIUM | Photo upload CTA |

---

## Phase 8: Gallery Pages

### Gallery System (4) - Partial Complete

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [DONE] | Gallery Hub | `/project-gallery/` | `/gallery/` | HIGH |
| [DONE] | Gallery Dynamic | N/A | `/gallery/[slug]/` | HIGH |
| [TODO] | Project Series Hub | `/project-series/` | `/projects/` | MEDIUM |
| [TODO] | CV Project Example | `/project-series/clear-vinyl-project-87444/` | `/projects/[id]/` | MEDIUM |

### Gallery Collections (8)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Mosquito Netting Gallery | `/project-gallery/mosquito-netting-1/` | `/gallery/mosquito-netting/` | MEDIUM |
| [TODO] | White Netting | `/project-gallery/white-netting/` | `/gallery/white-netting/` | LOW |
| [TODO] | White Netting 2 | `/project-gallery/white-netting-2/` | `/gallery/white-netting/` | LOW |
| [TODO] | White Netting 3 | `/project-gallery/white-netting-3/` | `/gallery/white-netting/` | LOW |
| [TODO] | Black Netting | `/project-gallery/black-netting/` | `/gallery/black-netting/` | LOW |
| [TODO] | Black Netting 2 | `/project-gallery/black-netting-2/` | `/gallery/black-netting/` | LOW |
| [TODO] | Black Netting 3 | `/project-gallery/black-netting-3/` | `/gallery/black-netting/` | LOW |
| [TODO] | Clear Vinyl Enclosures | `/project-gallery/clear-vinyl-plastic-enclosures/` | `/gallery/clear-vinyl/` | MEDIUM |

---

## Phase 9: Blog Posts (26)

Create blog system: `/blog/` + `/blog/[slug]/`

| Status | Post | WordPress URL | Slug | Priority |
|--------|------|---------------|------|----------|
| [TODO] | Blog Hub | `/blog/` | `/blog/` | MEDIUM |
| [TODO] | History of Mosquitoes | `/history-of-mans-deadliest-killer/` | `mosquito-history` | LOW |
| [TODO] | Where Is Mosquito Capitol | `/where-is-the-mosquito-capitol/` | `mosquito-capitol` | LOW |
| [TODO] | Mosquito Enclosures for Decks | `/mosquito-enclosures-for-decks/` | `deck-enclosures` | LOW |
| [TODO] | Gazebos Then and Now | `/gazebos-then-and-now/` | `gazebo-history` | LOW |
| [TODO] | Porch Too Beautiful | `/is-your-porch-too-beautiful-to-screen/` | `beautiful-porches` | LOW |
| [TODO] | Pollen in Porches | `/how-to-cope-with-pollen-in-porches-and-gazebos/` | `pollen-porches` | LOW |
| [TODO] | Northern Mosquitoes | `/why-do-mosquitoes-seem-more-intense-in-northern-climates/` | `northern-mosquitoes` | LOW |
| [TODO] | Storm Proof Screening | `/finally-a-new-storm-proof-screening/` | `storm-proof` | LOW |
| [TODO] | West Nile Effects | `/lasting-effects-of-the-west-nile-virus/` | `west-nile` | LOW |
| [TODO] | Mosquito Protection Summary | `/a-summary-of-mosquito-protection-ideas/` | `protection-summary` | LOW |
| [TODO] | Bond Sales Story | `/bond-sales-mosquito-curtains-and-a-rodeo-ghost/` | `our-story` | MEDIUM |
| [TODO] | Kids Project | `/a-very-cool-project-for-kids-theyll-remember-it-forever/` | `kids-project` | LOW |
| [TODO] | Dear Martha Stewart | `/dear-martha-stewart/` | `martha-stewart` | LOW |
| [TODO] | Work is Good | `/teaching-children-that-work-is-good/` | `work-is-good` | LOW |
| [TODO] | Mulligan Blocker | `/a-new-mulligan-blocker-for-golf-course-residents/` | `golf-course` | LOW |
| [TODO] | Airlines Screen Doors | `/air-lines-explore-screen-doors-on-aircraft/` | `airlines-humor` | LOW |
| [TODO] | Outdoor Projection Screens | `/outdoor-projection-screens/` | `projection-screens` | LOW |

---

## Phase 10: Business & Utility Pages

### Business Pages (3)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [DONE] | Opportunities | `/opportunities/` | `/opportunities/` | LOW | 10-page test |
| [TODO] | Contractor | `/contractor/` | `/contractors/` | MEDIUM |
| [TODO] | Sale | `/sale/` | `/sale/` | MEDIUM |

### Utility/Hub Pages (5)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Products Hub | `/products/` | `/products/` | MEDIUM |
| [TODO] | Applications Hub | `/applications/` | `/applications/` | LOW |
| [TODO] | Client Uploads | `/client-uploads/` | `/uploads/` | MEDIUM |
| [DONE] | My Projects | N/A (new) | `/my-projects/` | HIGH |
| [DONE] | My Orders | N/A (new) | `/my-orders/` | HIGH |

### Specialty Product Pages (3)

| Status | Page | WordPress URL | Next.js Route | Priority |
|--------|------|---------------|---------------|----------|
| [TODO] | Outdoor Projection Screens | `/outdoor-projection-screens/` | `/outdoor-projection-screens/` | LOW |
| [DONE] | Our Story | `/our-story/` | `/our-story/` | MEDIUM |
| [TODO] | Heavy Track (content) | `/heavy-track/` | `/heavy-track/` | LOW |

---

## Phase 11: SEO Landing Pages

These target specific keywords. Check `page_analytics.organic_sessions` for traffic.

| Status | Page | WordPress URL | Next.js Route | Target Keyword |
|--------|------|---------------|---------------|----------------|
| [DONE] | Weather Curtains | `/weather-curtains/` | `/weather-curtains/` | "weather curtains" | 10-page test |
| [TODO] | Porch Winterize | `/porch-winterize/` | `/porch-winterize/` | "winterize porch" |
| [TODO] | Porch Vinyl Panels | `/porch-vinyl-panels/` | `/porch-vinyl-panels/` | "porch vinyl panels" |
| [TODO] | Patio Winterize | `/patio-winterize/` | `/patio-winterize/` | "winterize patio" |
| [TODO] | Porch Vinyl Curtains | `/porch-vinyl-curtains/` | `/porch-vinyl-curtains/` | "porch vinyl curtains" |
| [TODO] | Insulated Curtain Panels | `/insulated-curtain-panels/` | `/insulated-curtain-panels/` | "insulated curtains" |
| [TODO] | Roll Up Shade Screens | `/roll-up-shade-screens/` | `/roll-up-shade-screens/` | "roll up shade screens" |
| [TODO] | Camping Net | `/camping-net/` | `/camping-net/` | "camping mosquito net" |

---

## Phase 12: WooCommerce Products (~80)

Products should be migrated to database and rendered via `/product/[slug]/page.tsx`.

### Panel Products (15)

| Status | Product | WordPress URL | Priority |
|--------|---------|---------------|----------|
| [TODO] | Mesh Panels | `/product/mesh-panels/` | HIGH |
| [TODO] | Clear Vinyl Panels | `/product/clear-vinyl-panels/` | HIGH |
| [TODO] | Heavy Mosquito Mesh Panels | `/product/heavy-mosquito-mesh-panels/` | HIGH |
| [TODO] | Shade Mesh Panels | `/product/shade-mesh-panels/` | MEDIUM |
| [TODO] | No-See-Um Mesh Panels | `/product/no-see-um-mesh-panels/` | MEDIUM |
| [TODO] | Scrim Panels | `/product/scrim-panels/` | MEDIUM |
| [TODO] | Stucco Strips | `/product/stucco-strips/` | MEDIUM |
| [TODO] | Zippered Stucco Strips | `/product/zippered-stucco-strips/` | MEDIUM |
| [TODO] | Roll Up Shade Screens | `/product/roll-up-shade-mesh-screens/` | MEDIUM |
| [TODO] | Adjustment | `/product/adjustment/` | LOW |
| [TODO] | Adjustment Negative | `/product/adjustment-negative/` | LOW |
| [TODO] | Tax Credit | `/product/credit-for-sales-tax-exemption/` | LOW |
| [TODO] | Canadian Tariff | `/product/canadian-tariff/` | LOW |

### Track Hardware Products (12)

| Status | Product | WordPress URL | Priority |
|--------|---------|---------------|----------|
| [TODO] | Standard Track | `/product/standard-track/` | HIGH |
| [TODO] | Heavy Track | `/product/heavy-track/` | HIGH |
| [TODO] | 7ft Straight Track (standard) | `/product/7ft-straight-track-standard/` | MEDIUM |
| [TODO] | 7ft Straight Track (heavy) | `/product/7ft-straight-track-heavy/` | MEDIUM |
| [TODO] | 90 Degree Curve (standard) | `/product/90-degree-curve-standard/` | MEDIUM |
| [TODO] | 90 Degree Curve (heavy) | `/product/90-degree-curve-heavy/` | MEDIUM |
| [TODO] | 135 Degree Curve (standard) | `/product/135-degree-curve-standard/` | LOW |
| [TODO] | 135 Degree Curve (heavy) | `/product/135-degree-curve-heavy/` | LOW |
| [TODO] | Splice (standard) | `/product/splice-standard/` | LOW |
| [TODO] | Splice (heavy) | `/product/splice-heavy/` | LOW |
| [TODO] | End Cap (standard) | `/product/end-cap-standard/` | LOW |
| [TODO] | End Cap (heavy) | `/product/end-cap-heavy/` | LOW |
| [TODO] | Carriers (standard) | `/product/carriers-standard/` | LOW |
| [TODO] | Carriers (heavy) | `/product/carriers-heavy/` | LOW |
| [TODO] | Tracking Color | `/product/tracking-color/` | LOW |

### Attachment Products (20+)

| Status | Product | WordPress URL | Priority |
|--------|---------|---------------|----------|
| [TODO] | Attachment Items | `/product/attachment-items/` | HIGH |
| [TODO] | Black Marine Snaps | `/product/black-marine-snaps/` | MEDIUM |
| [TODO] | White Marine Snaps | `/product/white-marine-snaps/` | MEDIUM |
| [TODO] | Clear Adhesive Snaps | `/product/clear-adhesive-snaps/` | MEDIUM |
| [TODO] | Black Adhesive Snaps | `/product/black-adhesive-snaps/` | MEDIUM |
| [TODO] | White Adhesive Snaps | `/product/white-adhesive-snaps/` | MEDIUM |
| [TODO] | Block Magnets | `/product/block-magnets/` | MEDIUM |
| [TODO] | Extra Strength Ring Magnets | `/product/extra-strength-ring-magnets/` | MEDIUM |
| [TODO] | Fiberglass Rods | `/product/fiberglass-rods/` | MEDIUM |
| [TODO] | Fiberglass Rod Clips | `/product/fiberglass-rod-clips/` | LOW |
| [TODO] | Black Elastic Cord | `/product/black-elastic-cord/` | LOW |
| [TODO] | White Elastic Cord | `/product/white-elastic-cord/` | LOW |
| [TODO] | Rubber Washers | `/product/rubber-washers-bags-of-10/` | LOW |
| [TODO] | Industrial Snap Tool | `/product/fully-refundable-industrial-snap-tool/` | MEDIUM |
| [TODO] | White Webbing | `/product/white-webbing/` | LOW |
| [TODO] | Black Webbing | `/product/black-webbing/` | LOW |
| [TODO] | Velcro Color | `/product/velcro-color/` | LOW |
| [TODO] | Tie Up Straps | `/product/tie-up-straps/` | LOW |
| [TODO] | Fastwax Cleaner | `/product/fastwax-cleaner/` | LOW |

### Raw Netting Products (8)

| Status | Product | WordPress URL | Priority |
|--------|---------|---------------|----------|
| [TODO] | Raw Heavy Mosquito Mesh | `/product/raw-heavy-mosquito-mesh-2/` | MEDIUM |
| [TODO] | Raw Standard Mosquito Mesh | `/product/raw-standard-mosquito-mesh-mobile/` | MEDIUM |
| [TODO] | Raw No-See-Um Mesh | `/product/raw-no-see-um-mesh/` | MEDIUM |
| [TODO] | Raw Shade Mesh | `/product/raw-shade-mesh/` | MEDIUM |
| [TODO] | Raw Shark Tooth Scrim | `/product/raw-shark-tooth-scrim/` | MEDIUM |
| [TODO] | Raw Industrial Mesh | `/product/raw-industrial-mesh/` | MEDIUM |
| [TODO] | Raw Netting Attachment Items | `/product/raw-netting-attachment-items/` | MEDIUM |
| [TODO] | Camping Net | `/product/camping-net/` | LOW |

---

## Redirects Only (No Page Needed)

These pages should 301 redirect to appropriate destinations.

| Old URL | Redirect To | Reason |
|---------|-------------|--------|
| `/shop/` | `/products/` | WooCommerce system |
| `/cart/` | `/cart/` | Already exists |
| `/checkout/` | `/cart/` | Cart handles checkout |
| `/my-account/` | `/my-orders/` | Account page |
| `/order-mesh-panels/` | `/start-project/` | Legacy order flow |
| `/order-attachments/` | `/start-project/` | Legacy order flow |
| `/order-tracking/` | `/start-project/` | Legacy order flow |
| `/order-mosquito-curtains/` | `/start-project/` | Legacy order flow |
| `/order-mesh-netting-fabrics/` | `/raw-netting-fabric-store/` | Legacy order flow |
| `/order-raw-netting-attachment-hardware/` | `/raw-netting-fabric-store/` | Legacy order flow |
| `/mosquito-curtains-planning-session/` | `/work-with-a-planner/` | Private page |
| `/clear-vinyl-planning-session/` | `/work-with-a-planner/` | Legacy planning |
| `/mosquito-curtain-planning-session/` | `/work-with-a-planner/` | Duplicate |
| `/mc-sales/` | `/contact/` | Internal sales page |
| `/cv-sales/` | `/contact/` | Internal sales page |
| `/rn-sales/` | `/contact/` | Internal sales page |
| `/products/` | `/start-project/` | Product hub |
| `/applications/` | `/` | Applications hub |
| `/heavy-track/` | `/options/` | Content page |
| `/prepare/` | `/start-project/` | Prep page |

---

## Deprecated (Don't Migrate)

| URL | Reason |
|-----|--------|
| `/products-test/` | Test page |
| `/calculator-test/` | Test page |
| `/speed-test/` | Test page |
| `/404-error-page/` | Next.js handles |
| `/wpms-html-sitemap/` | Next.js sitemap |
| `/form-entry/` | Internal system |
| `/cv-redesign-1-11-23/` | Design test |
| `/screen-porch-enclosures-gs/` | A/B test |
| All `/sales/*` subpages | Internal sales tools |
| All Private status pages | Internal only |
| All `*-old` products | Deprecated |
| All `*-mobile` products | Duplicate |
| CRM/Zoho integration pages | System pages |

---

## How to Use This Tracker

### Marking Progress

1. Change `[TODO]` to `[WIP]` when starting a page
2. Change `[WIP]` to `[DONE]` when complete and deployed
3. Update the Quick Stats table at the top
4. Update the "Currently Live" list
5. Commit with message: `docs: mark /page-name/ as complete`

### Progress Tracking Workflow

```bash
# After completing a page migration:

# 1. Update this tracker
# 2. Commit the tracker update
git add docs/PAGE_MIGRATION_TRACKER.md
git commit -m "docs: mark /your-page/ as complete"

# 3. You can see migration progress over time
git log --oneline docs/PAGE_MIGRATION_TRACKER.md
```

### Weekly Progress Report

Run this SQL to see pages being tracked:

```sql
-- Pages viewed in last 7 days (shows which are getting traffic)
SELECT 
  page_path,
  SUM(pageviews) as views
FROM page_analytics  
WHERE date >= NOW() - INTERVAL '7 days'
GROUP BY page_path
ORDER BY views DESC;
```

### Before Starting a Page

1. Check `page_analytics` for traffic data:
   ```sql
   SELECT page_path, SUM(pageviews), SUM(organic_sessions)
   FROM page_analytics
   WHERE page_path LIKE '%your-page%'
   GROUP BY page_path;
   ```

2. Check `legacy_leads` for conversion data:
   ```sql
   SELECT landing_page, COUNT(*) as leads
   FROM legacy_leads
   WHERE landing_page LIKE '%your-page%'
   GROUP BY landing_page;
   ```

### After Completing a Page

1. Update status in this doc
2. Verify tracking works (check `page_views` table)
3. Add redirect if URL changed
4. Update sitemap

---

## Migration Batches (Prioritized Work Plan)

Break the migration into focused batches. Complete each batch fully before moving to the next.

### Batch 1: Legal + Conversion (CRITICAL)
**Pages:** 5 | **Priority:** CRITICAL | **Est. Effort:** 1-2 days

These pages are required for legal compliance and revenue tracking.

| Page | WordPress URL | Template Type |
|------|---------------|---------------|
| Privacy Policy | `/privacy-policy/` | Support Page |
| MC Instant Quote | `/mosquito-curtains-instant-quote/` | Quote Form |
| CV Instant Quote | `/clear-vinyl-instant-quote/` | Quote Form |
| Work With Planner | `/work-with-a-planner/` | Conversion Page |
| Returns | `/returns/` | Support Page |

**Workflow:**
1. Create content extraction files for each: `docs/migrations/[slug]-content.md`
2. Build pages following `PAGE_MIGRATION_WORKFLOW.md`
3. Test tracking integration (quote_started events)
4. Update tracker statuses to [DONE]

---

### Batch 2: Core Product Pages (HIGH)
**Pages:** 6 | **Priority:** HIGH | **Est. Effort:** 2-3 days

Missing product landing pages that drive organic traffic.

| Page | WordPress URL | Template Type |
|------|---------------|---------------|
| French Door Screens | `/french-door-screens/` | Product Landing |
| Boat Screens | `/boat-screens/` | Product Landing |
| Tent Screens | `/tentscreenpanels/` | Product Landing |
| Yardistry Gazebo | `/yardistry-gazebo-curtains/` | Product Landing |
| HVAC Screens | `/hvac-chiller-screens/` | Product Landing |
| Pollen Protection | `/pollen-protection/` | Feature Page |

**Reference:** Copy pattern from `src/app/screened-porch/page.tsx`

---

### Batch 3: Planning Hub (HIGH)
**Pages:** 5 | **Priority:** HIGH | **Est. Effort:** 2-3 days

Main planning section hub pages.

| Page | WordPress URL | Template Type |
|------|---------------|---------------|
| Plan Screen Porch Hub | `/plan-screen-porch/` | Hub Page |
| Mesh and Colors | `/plan-screen-porch/mesh-and-colors/` | Planning Guide |
| Outdoor Tracking | `/plan-screen-porch/outdoor-curtain-tracking/` | Planning Guide |
| Magnetic Doorways | `/plan-screen-porch/magnetic-doorways/` | Feature Page |
| How To Order | `/plan-screen-porch/how-to-order/` | Guide Page |

---

### Batch 4: Planning Sub-pages (MEDIUM)
**Pages:** 14 | **Priority:** MEDIUM | **Est. Effort:** 3-4 days

Exposure-based planning pages (1-sided, 2-sided, etc.)

| Group | Pages |
|-------|-------|
| Base Pages | 1-Sided, 2-Sided, 3-Sided, 4-Sided, Free-Standing, Tents/Awnings |
| Detailed Pages | [exposure]/[regular/irregular]-[tracking/velcro] variants |

**Approach:** Create a dynamic route `/plan/[exposure]/page.tsx` with content variants.

---

### Batch 5: Clear Vinyl Options (MEDIUM)
**Pages:** 6 | **Priority:** MEDIUM | **Est. Effort:** 1-2 days

| Page | WordPress URL |
|------|---------------|
| Apron Colors | `/apron-colors-to-choose-from/` |
| What Can Go Wrong | `/what-can-go-wrong-with-clear-vinyl/` |
| Self-Install Advantages | `/clear-vinyl-self-installation-advantages/` |
| What Makes Better | `/what-makes-our-clear-vinyl-product-better/` |
| Ordering CV | `/ordering-clear-vinyl/` |
| Project Planning | `/project-planning/` |

---

### Batch 6: Support & FAQ (MEDIUM)
**Pages:** 4 | **Priority:** MEDIUM | **Est. Effort:** 1-2 days

| Page | WordPress URL |
|------|---------------|
| FAQ Hub | `/faqs/` |
| MC FAQ | `/mosquito-curtains-faq/` |
| CV FAQ | `/clear-vinyl-faq/` |
| Returns | `/returns/` |

---

### Batch 7: Marketing/Social Landing (HIGH for Ads)
**Pages:** 7 | **Priority:** HIGH (Ad Tracking) | **Est. Effort:** 1-2 days

Critical for attribution tracking on paid campaigns.

| Page | WordPress URL | Purpose |
|------|---------------|---------|
| FB Hub | `/fb/` | Facebook landing |
| FB MC Quote | `/fb/mc-quote/` | FB to MC quote |
| FB CV Quote | `/fb/cv-quote/` | FB to CV quote |
| Reddit Hub | `/reddit/` | Reddit landing |
| Reddit MC Quote | `/reddit/mc-quote/` | Reddit to MC quote |
| Videos | `/videos/` | Video hub |
| Photos | `/photos/` | Photo upload |

---

### Batch 8: Raw Netting Section (MEDIUM)
**Pages:** 12 | **Priority:** MEDIUM | **Est. Effort:** 2-3 days

Complete the raw netting product section.

| Page | WordPress URL |
|------|---------------|
| Mosquito Netting Hub | `/mosquito-netting/` |
| Mosquito Net | `/mosquito-net/` |
| No-See-Um Netting | `/no-see-um-netting-screen/` |
| Shade Screen Mesh | `/shade-screen-mesh/` |
| Theatre Scrim | `/theatre-scrim/` |
| Industrial Mesh | `/industrial-mesh/` |
| + 6 more sub-pages | ... |

---

### Batch 9: Gallery Pages (MEDIUM)
**Pages:** 10 | **Priority:** MEDIUM | **Est. Effort:** 2-3 days

Gallery system already exists. Need to add collection pages.

| Page | WordPress URL |
|------|---------------|
| Project Series Hub | `/project-series/` |
| 8 Color/Type Collections | `/project-gallery/[collection]/` |

**Approach:** Extend existing `/gallery/[slug]/` system.

---

### Batch 10: Blog System (LOW)
**Pages:** 17 | **Priority:** LOW | **Est. Effort:** 3-4 days

Create blog system and migrate all posts.

| Task | Description |
|------|-------------|
| Create `/blog/` | Blog index page |
| Create `/blog/[slug]/` | Dynamic blog post page |
| Migrate 17 posts | Extract content, create posts |

---

### Batch 11: SEO Landing Pages (MEDIUM)
**Pages:** 8 | **Priority:** MEDIUM | **Est. Effort:** 1-2 days

Keyword-targeted landing pages.

| Page | Target Keyword |
|------|----------------|
| Weather Curtains | "weather curtains" |
| Porch Winterize | "winterize porch" |
| Porch Vinyl Panels | "porch vinyl panels" |
| Patio Winterize | "winterize patio" |
| + 4 more | ... |

---

### Batch 12: Business Pages (LOW)
**Pages:** 5 | **Priority:** LOW | **Est. Effort:** 1 day

| Page | WordPress URL |
|------|---------------|
| Opportunities | `/opportunities/` |
| Contractor | `/contractor/` |
| Sale | `/sale/` |
| Products Hub | `/products/` |
| Applications Hub | `/applications/` |

---

### Batch 13: WooCommerce Products (MEDIUM)
**Pages:** ~80 | **Priority:** MEDIUM | **Est. Effort:** 5-7 days

Migrate product catalog to database-driven system.

| Task | Description |
|------|-------------|
| Create product schema | Database table for products |
| Create `/product/[slug]/` | Dynamic product page |
| Migrate product data | Import from WooCommerce |
| Build product listing | `/products/` page with filters |

---

### Batch Summary

| Batch | Pages | Priority | Dependencies |
|-------|-------|----------|--------------|
| 1. Legal + Conversion | 5 | CRITICAL | None |
| 2. Core Product Pages | 6 | HIGH | None |
| 3. Planning Hub | 5 | HIGH | None |
| 4. Planning Sub-pages | 14 | MEDIUM | Batch 3 |
| 5. Clear Vinyl Options | 6 | MEDIUM | None |
| 6. Support & FAQ | 4 | MEDIUM | None |
| 7. Marketing/Social | 7 | HIGH | None |
| 8. Raw Netting | 12 | MEDIUM | None |
| 9. Gallery Pages | 10 | MEDIUM | Existing gallery |
| 10. Blog System | 17 | LOW | None |
| 11. SEO Landing | 8 | MEDIUM | None |
| 12. Business | 5 | LOW | None |
| 13. Products | ~80 | MEDIUM | Product schema |

**Recommended Order:** 1 -> 7 -> 2 -> 3 -> 4 -> 5 -> 6 -> 8 -> 9 -> 11 -> 10 -> 12 -> 13

---

## Complete Inventory Reconciliation

**Source:** `export-all-urls-203193.csv` (275 pages + 1 header = 276 lines)

### Page Count by Category

| Category | Count | Notes |
|----------|-------|-------|
| Core Product Pages | 16 | Main SEO landing pages |
| Planning/Options | 26 | Decision tree pages |
| Conversion Pages | 4 | Quote/planner pages |
| Installation | 4 | Install guides |
| Care | 2 | Care guides |
| Support/Info | 10 | About, FAQ, shipping, etc. |
| Raw Netting | 12 | Raw mesh section |
| Marketing/Social | 7 | FB, Reddit, etc. |
| Gallery | 12 | Project galleries |
| Blog | 17 | Blog posts |
| Business | 3 | Opportunities, contractor, sale |
| SEO Landing | 8 | Keyword-targeted pages |
| WooCommerce Products | ~80 | Product pages |
| **Subtotal (Migrate)** | **~201** | |
| | | |
| Redirects Only | 20 | Legacy order flows, etc. |
| Deprecated/Don't Migrate | ~30 | Test pages, private, old |
| System/CRM | 4 | Zoho, sitemap |
| Duplicate Products | ~20 | Mobile/old variants |
| **Subtotal (Skip)** | **~74** | |
| | | |
| **TOTAL** | **275** | All accounted for |

### Pages by WordPress Status

| Status | Count | Action |
|--------|-------|--------|
| Publish | ~220 | Migrate or redirect |
| Private | ~25 | Skip (internal) |
| Other | ~30 | Skip (test/deprecated) |

### Verification Checklist

- [x] All product landing pages (16)
- [x] All plan-screen-porch subpages (22)
- [x] All clear vinyl option pages (6)
- [x] All installation pages (4)
- [x] All care pages (2)
- [x] All support pages (10)
- [x] All raw netting pages (12)
- [x] All gallery pages (12)
- [x] All blog posts (17)
- [x] All SEO landing pages (8)
- [x] All social landing pages (7)
- [x] All WooCommerce products (~80)
- [x] All redirect targets identified (20)
- [x] All deprecated pages marked (~30)

---

## Analytics Queries for Prioritization

### Top Pages by Traffic (Last 90 Days)
```sql
SELECT 
  page_path,
  SUM(pageviews) as total_views,
  SUM(organic_sessions) as organic_traffic
FROM page_analytics
WHERE date >= NOW() - INTERVAL '90 days'
GROUP BY page_path
ORDER BY total_views DESC
LIMIT 30;
```

### Top Landing Pages by Lead Generation
```sql
SELECT 
  landing_page,
  COUNT(*) as lead_count,
  COUNT(DISTINCT CASE WHEN converted THEN email END) as converted_leads
FROM legacy_leads
WHERE landing_page IS NOT NULL
GROUP BY landing_page
ORDER BY lead_count DESC
LIMIT 20;
```

### Pages with Google Ads Traffic (GCLID)
```sql
SELECT 
  landing_page,
  COUNT(*) as gclid_leads
FROM legacy_leads
WHERE gclid IS NOT NULL
GROUP BY landing_page
ORDER BY gclid_leads DESC;
```
