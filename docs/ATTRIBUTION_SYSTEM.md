# Customer Attribution & Journey Tracking System

**Last Updated:** February 5, 2026  
**Status:** Active

A comprehensive waterfall attribution system that tracks the complete customer journey from first landing through purchase, integrating real-time tracking with legacy historical data.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Database Schema](#database-schema)
4. [Customer Journey Flow](#customer-journey-flow)
5. [Attribution Model](#attribution-model)
6. [Legacy Data Integration](#legacy-data-integration)
7. [GA4 Integration](#ga4-integration)
8. [Admin Dashboards](#admin-dashboards)
9. [API Endpoints](#api-endpoints)
10. [Cookie & Session Management](#cookie--session-management)

---

## System Overview

The attribution system answers the critical business questions:
- **Where do customers come from?** (UTM source, campaign, referrer)
- **What path do they take?** (pages viewed, time on site, sessions)
- **When do they convert?** (days to email capture, days to purchase)
- **What marketing drives revenue?** (campaign ROI, channel performance)

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **First-Touch Attribution** | Permanently captures how a customer first found you |
| **Multi-Session Tracking** | Tracks visitors across multiple visits over time |
| **Full Journey Capture** | Every page view, event, and milestone recorded |
| **Legacy Data Integration** | Historical orders and leads from WordPress/Gravity Forms |
| **GA4 Sync** | Daily sync of Google Analytics data for aggregate metrics |
| **Real-Time Dashboards** | Admin dashboards for attribution analysis |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CUSTOMER JOURNEY FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   LANDING    │────▶│   BROWSING   │────▶│    EMAIL     │────▶│   PURCHASE   │
    │  (Anonymous) │     │  (Sessions)  │     │  (Identified)│     │  (Customer)  │
    └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
          │                    │                    │                    │
          ▼                    ▼                    ▼                    ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   visitors   │     │   sessions   │     │   customers  │     │    orders    │
    │   table      │     │   table      │     │   table      │     │    table     │
    └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
          │                    │                                          │
          │                    ▼                                          │
          │              ┌──────────────┐                                 │
          │              │  page_views  │                                 │
          │              │    table     │                                 │
          │              └──────────────┘                                 │
          │                    │                                          │
          └────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   journey_events    │
                    │   (milestones)      │
                    └─────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA SOURCES                                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │   REAL-TIME     │     │   LEGACY DATA   │     │   GA4 SYNC      │
    │   TRACKING      │     │   (Historical)  │     │   (Daily)       │
    └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
             │                       │                       │
             ▼                       ▼                       ▼
    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │ • visitors      │     │ • legacy_orders │     │ • page_analytics│
    │ • sessions      │     │ • legacy_leads  │     │ • traffic_sources│
    │ • page_views    │     │                 │     │                 │
    │ • journey_events│     │                 │     │                 │
    └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Database Schema

### Core Journey Tables

#### `visitors` - Anonymous Visitor Tracking

Tracks visitors from their very first page load using browser cookies.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `fingerprint` | TEXT | Cookie-based identifier (`mc_visitor_id`) |
| `first_landing_page` | TEXT | First page they ever visited |
| `first_referrer` | TEXT | Where they came from originally |
| `first_utm_source` | TEXT | Original UTM source (never changes) |
| `first_utm_medium` | TEXT | Original UTM medium |
| `first_utm_campaign` | TEXT | Original UTM campaign |
| `last_utm_source` | TEXT | Most recent UTM source |
| `session_count` | INTEGER | Total number of sessions |
| `total_pageviews` | INTEGER | Total pages viewed |
| `customer_id` | UUID | Link to customer (after email capture) |
| `first_seen_at` | TIMESTAMPTZ | Very first visit timestamp |
| `last_seen_at` | TIMESTAMPTZ | Most recent activity |

#### `sessions` - Individual Visit Sessions

Each visit/session with its own attribution data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `visitor_id` | UUID | Links to visitors table |
| `landing_page` | TEXT | Entry page for this session |
| `referrer` | TEXT | Referrer for this session |
| `utm_source` | TEXT | UTM source for this session |
| `utm_campaign` | TEXT | UTM campaign for this session |
| `device_type` | TEXT | mobile, tablet, desktop |
| `browser` | TEXT | Chrome, Safari, Firefox, etc. |
| `pageview_count` | INTEGER | Pages viewed in session |
| `converted` | BOOLEAN | Did this session convert? |
| `conversion_type` | TEXT | email, quote, purchase |

#### `page_views` - Individual Page Views

Every page viewed, in order.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `session_id` | UUID | Links to sessions |
| `visitor_id` | UUID | Links to visitors |
| `page_path` | TEXT | URL path viewed |
| `page_title` | TEXT | Page title |
| `view_order` | INTEGER | Sequence in session |
| `time_on_page_seconds` | INTEGER | Time spent |
| `scroll_depth` | INTEGER | 0-100% scrolled |

#### `journey_events` - Conversion Milestones

Key events in the customer journey.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `visitor_id` | UUID | Links to visitors |
| `session_id` | UUID | Links to sessions |
| `customer_id` | UUID | Links to customers |
| `event_type` | TEXT | See event types below |
| `event_data` | JSONB | Event-specific payload |

**Event Types:**
- `email_captured` - Customer provided email
- `quote_started` - Started configuring a quote
- `quote_submitted` - Submitted quote request
- `photos_uploaded` - Uploaded project photos
- `cart_created` - Created shopping cart
- `cart_updated` - Modified cart
- `checkout_started` - Began checkout
- `purchase_completed` - Completed purchase

### Customer & Order Attribution

#### `customers` - Enhanced with Attribution

Added columns for first-touch tracking:

| Column | Type | Description |
|--------|------|-------------|
| `first_utm_source` | TEXT | Original source |
| `first_utm_campaign` | TEXT | Original campaign |
| `first_landing_page` | TEXT | Original entry page |
| `first_referrer` | TEXT | Original referrer |
| `first_seen_at` | TIMESTAMPTZ | First visit |
| `email_captured_at` | TIMESTAMPTZ | When email was captured |
| `first_purchase_at` | TIMESTAMPTZ | First purchase |
| `customer_status` | TEXT | lead, quoted, customer, repeat, churned |

#### `orders` - Enhanced with Attribution

Added columns for attribution tracking:

| Column | Type | Description |
|--------|------|-------------|
| `visitor_id` | UUID | Links to visitor |
| `session_id` | UUID | Links to converting session |
| `first_utm_source` | TEXT | Customer's original source |
| `converting_utm_source` | TEXT | Source that drove the purchase |
| `salesperson_id` | TEXT | Assigned salesperson |
| `order_source` | TEXT | online_self, phone, manual, legacy |

---

## Customer Journey Flow

### Phase 1: Anonymous Visitor (Pre-Identification)

```
User lands on site
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Check for mc_visitor_id cookie                     │
│   ├─ EXISTS: Returning visitor                     │
│   └─ NOT EXISTS: New visitor                       │
│       └─ Generate UUID, set cookie (365 days)      │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Check for mc_session_id cookie                     │
│   ├─ EXISTS + no new UTMs: Continue session        │
│   └─ NOT EXISTS or new UTMs: New session           │
│       └─ Generate UUID, set cookie (30 min)        │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Capture Attribution Data                           │
│   • Landing page path                              │
│   • Referrer (external only)                       │
│   • UTM parameters from URL                        │
│   • Device/browser info                            │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│ API Call: POST /api/tracking/session               │
│   • Create/update visitor record                   │
│   • Create new session record                      │
│   • Store first-touch if new visitor               │
└───────────────────────────────────────────────────┘
```

### Phase 2: Browsing & Engagement

```
User navigates site
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Each Page View                                     │
│   • API Call: POST /api/tracking/pageview          │
│   • Records page path, title, timestamp            │
│   • Increments view_order counter                  │
│   • Updates session last_activity_at               │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Key Events Tracked                                 │
│   • Photos uploaded → photos_uploaded event        │
│   • Quote started → quote_started event            │
│   • Cart created → cart_created event              │
└───────────────────────────────────────────────────┘
```

### Phase 3: Identification (Email Capture)

```
User enters email (EmailGate component)
        │
        ▼
┌───────────────────────────────────────────────────┐
│ API Call: POST /api/tracking/identify              │
│   1. Create or find customer by email              │
│   2. Link visitor to customer                      │
│   3. Copy first-touch attribution to customer      │
│   4. Create email_captured event                   │
│   5. Update customer status to 'lead'              │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│ Customer Record Now Has:                           │
│   • first_utm_source (from visitor)                │
│   • first_landing_page (from visitor)              │
│   • email_captured_at (now)                        │
│   • customer_status = 'lead'                       │
└───────────────────────────────────────────────────┘
```

### Phase 4: Conversion (Purchase)

```
User completes checkout (PayPal)
        │
        ▼
┌───────────────────────────────────────────────────┐
│ POST /api/paypal/capture                           │
│   1. Retrieve visitor_id, session_id from cookies  │
│   2. Fetch visitor attribution data                │
│   3. Create order with:                            │
│      • visitor_id                                  │
│      • session_id                                  │
│      • first_utm_source (customer's original)      │
│      • converting_utm_source (this session's)      │
│   4. Update customer status to 'customer'          │
│   5. Create purchase_completed event               │
└───────────────────────────────────────────────────┘
```

---

## Attribution Model

### First-Touch Attribution (Primary)

The system prioritizes **first-touch attribution** - crediting the original source that brought the customer to the site.

```
Example Journey:
─────────────────────────────────────────────────────────────────────
Day 1:  Google Ads click → lands on /screened-porch → browses
Day 5:  Direct visit → views more pages
Day 8:  Facebook Ad click → submits email
Day 12: Direct visit → makes purchase

Attribution:
  first_utm_source = 'google'        ← Google gets credit
  first_utm_campaign = 'spring_2026'
  converting_utm_source = 'direct'   ← Also tracked
─────────────────────────────────────────────────────────────────────
```

### Why First-Touch?

| Model | Best For | Our Use |
|-------|----------|---------|
| **First-Touch** | Understanding discovery | ✅ Primary |
| Last-Touch | Short sales cycles | ✅ Also captured |
| Linear | Complex B2B journeys | Not used |
| Time Decay | Longer consideration | Not used |

For custom products with long consideration periods, first-touch shows **where customers discover you**, which is critical for marketing budget allocation.

### Both Attribution Points Captured

The system captures both for flexibility:

```sql
-- orders table
first_utm_source       -- How customer originally found us
converting_utm_source  -- What drove this specific purchase
```

---

## Legacy Data Integration

### Overview

Historical data from WordPress/WooCommerce is stored separately to:
1. Preserve raw historical records
2. Enable correlation with new tracking
3. Support aggregate analytics across all time periods

### Legacy Orders (`legacy_orders`)

Imported from WooCommerce exports.

| Column | Description |
|--------|-------------|
| `woocommerce_order_id` | Original WC order ID |
| `order_date` | When order was placed |
| `email` | Customer email (for matching) |
| `first_name`, `last_name` | Customer name |
| `total`, `subtotal`, `tax`, `shipping` | Order amounts |
| `payment_method`, `payment_title` | Payment info |
| `salesperson` | Assigned rep (from meta) |
| `meta_data` | Full WC meta as JSONB |

### Legacy Leads (`legacy_leads`)

Imported from Gravity Forms CSV exports.

| Column | Description |
|--------|-------------|
| `gravity_form_entry_id` | Original GF entry ID |
| `entry_date` | When lead was submitted |
| `email` | Customer email |
| `interest` | Curtains, Vinyl, Both |
| `project_type` | Porch/Patio, Gazebo, etc. |
| `landing_page` | Page they submitted from |
| `source_url` | Full URL with any params |
| `gclid` | Google Click ID (if present) |
| `fbclid` | Facebook Click ID (if present) |
| `lead_source` | google_ads, facebook_ads, organic |
| `has_photos` | Whether they uploaded photos |
| `worked_with_before` | Returning customer flag |
| `previous_salesperson` | Who they worked with |

### Correlation Views

The system creates views that join legacy data for analysis:

#### `legacy_lead_conversion`

Matches leads to orders by email:

```sql
SELECT 
  ll.email,
  ll.entry_date AS lead_date,
  ll.interest,
  ll.landing_page,
  -- Order correlation
  MIN(lo.order_date) AS first_order_date,
  CASE WHEN COUNT(lo.id) > 0 THEN true ELSE false END AS converted,
  EXTRACT(DAY FROM MIN(lo.order_date) - ll.entry_date) AS days_to_conversion,
  COUNT(lo.id) AS order_count,
  SUM(lo.total) AS total_revenue
FROM legacy_leads ll
LEFT JOIN legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date  -- Only orders AFTER the lead
GROUP BY ll.id, ...
```

#### Other Analytics Views

| View | Purpose |
|------|---------|
| `legacy_lead_by_landing_page` | Which pages generate leads that convert? |
| `legacy_lead_by_interest` | Which product interest converts best? |
| `legacy_lead_by_salesperson` | Returning customer performance by rep |
| `legacy_lead_monthly` | Monthly lead volume and conversion trends |

### Data Flow: Legacy to New System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LEGACY DATA INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

    HISTORICAL DATA                    ANALYTICS VIEWS                 DASHBOARDS
    ───────────────                    ───────────────                 ──────────

    ┌─────────────┐                   ┌──────────────────┐
    │legacy_orders│──────────────────▶│attribution_      │───────▶ /admin/mc-sales/
    │  (8K+ rows) │                   │analysis view     │            analytics
    └─────────────┘                   └──────────────────┘
          │
          │    JOIN on email
          ▼
    ┌─────────────┐                   ┌──────────────────┐
    │legacy_leads │──────────────────▶│legacy_lead_      │───────▶ /admin/mc-sales/
    │  (7K+ rows) │                   │conversion view   │       analytics/leads
    └─────────────┘                   └──────────────────┘
          │
          │
          │                           ┌──────────────────┐
          └──────────────────────────▶│legacy_lead_by_   │───────▶ Landing page
                                      │landing_page      │         performance
                                      └──────────────────┘
```

---

## GA4 Integration

### Daily Sync Process

Google Analytics 4 data syncs daily via Vercel Cron:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GA4 SYNC FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │  Vercel     │────────▶│ /api/       │────────▶│ GA4 Data    │
    │  Cron       │         │ analytics/  │         │ API         │
    │  (daily)    │         │ sync        │         │             │
    └─────────────┘         └─────────────┘         └─────────────┘
                                   │                       │
                                   │                       │
                                   ▼                       │
                            ┌─────────────┐                │
                            │Supabase     │◀───────────────┘
                            │             │
                            │• page_analytics    (pageviews, sessions)
                            │• traffic_sources   (channel breakdown)
                            │• analytics_sync_log (audit trail)
                            └─────────────┘
```

### GA4 Tables

#### `page_analytics`

Daily page-level metrics from GA4:

| Column | Description |
|--------|-------------|
| `page_path` | URL path |
| `date` | Date of data |
| `pageviews` | Total page views |
| `unique_pageviews` | Unique page views |
| `sessions` | Sessions with this page |
| `organic_sessions` | Organic search sessions |
| `avg_time_on_page` | Average engagement |
| `bounce_rate` | Bounce rate |

#### `traffic_sources`

Channel breakdown per page:

| Column | Description |
|--------|-------------|
| `page_path` | URL path |
| `date` | Date |
| `channel` | Organic Search, Direct, Paid, Referral |
| `sessions` | Sessions from this channel |
| `new_users` | New users from this channel |

### Backfill Script

For historical GA4 data:

```bash
# Run from project root
npx ts-node scripts/analytics/backfill-ga4.ts
```

---

## Admin Dashboards

### Dashboard Navigation

| URL | Dashboard | Purpose |
|-----|-----------|---------|
| `/admin` | Hub | Navigation to all admin areas |
| `/admin/mc-sales/analytics` | Attribution Analytics | Campaign performance, revenue by source |
| `/admin/mc-sales/analytics/leads` | Leads Analytics | Lead-to-order conversion, landing page performance |
| `/admin/mc-sales/analytics/waterfall` | Customer Journeys | Full journey view with all touchpoints |
| `/admin/customers` | Customer List | Browse all customers |
| `/admin/customers/[id]` | Customer Detail | Individual customer journey |

### Attribution Analytics (`/admin/mc-sales/analytics`)

**Key Metrics:**
- Total revenue by UTM source
- Conversion rates by campaign
- Salesperson performance
- GCLID/FBCLID attribution

**Data Sources:**
- `legacy_orders` (historical orders)
- `attribution_analysis` view
- Real-time orders

### Leads Analytics (`/admin/mc-sales/analytics/leads`)

**Key Metrics:**
- Lead volume by interest type
- Landing page conversion rates
- Google Ads leads (GCLID)
- Facebook Ads leads (FBCLID)
- Days to conversion distribution
- Monthly trends

**Data Sources:**
- `legacy_leads` table
- `legacy_lead_conversion` view
- `legacy_lead_by_landing_page` view
- `legacy_lead_by_interest` view

### Customer Journeys (`/admin/mc-sales/analytics/waterfall`)

**Features:**
- Full customer list with aggregated metrics
- Total orders and revenue per customer
- Customer detail with order history
- Journey timeline (when available)

**Data Sources:**
- `customers` table
- `legacy_orders` (aggregated by email)
- `visitors`, `sessions`, `journey_events` (real-time)

---

## API Endpoints

### Tracking Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tracking/session` | POST | Initialize/update session |
| `/api/tracking/pageview` | POST | Record page view |
| `/api/tracking/event` | POST | Record journey event |
| `/api/tracking/identify` | POST | Link visitor to customer |

### Analytics Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analytics/sync` | POST/GET | Trigger GA4 sync |

### Tracking Payload Examples

**Session Initialization:**
```json
{
  "visitorId": "uuid-...",
  "sessionId": "uuid-...",
  "isNewVisitor": true,
  "isNewSession": true,
  "landingPage": "/screened-porch",
  "referrer": "https://google.com",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring_2026"
  },
  "device": {
    "type": "desktop",
    "browser": "Chrome",
    "os": "macOS"
  }
}
```

**Identify (Email Capture):**
```json
{
  "visitorId": "uuid-...",
  "sessionId": "uuid-...",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-1234"
}
```

---

## Cookie & Session Management

### Cookies Used

| Cookie | Purpose | Expiry |
|--------|---------|--------|
| `mc_visitor_id` | Unique visitor identifier | 365 days |
| `mc_session_id` | Current session identifier | 30 minutes |
| `mc_utm` | Current session UTM params | 30 minutes |
| `mc_first_touch` | First-touch attribution | 365 days |

### Session Rules

1. **New Session Created When:**
   - No `mc_session_id` cookie exists
   - New UTM parameters appear in URL (new campaign click)

2. **Session Extended When:**
   - User navigates within site
   - Cookie expiry refreshed to 30 minutes

3. **Visitor Persists:**
   - Same `mc_visitor_id` across all sessions
   - Links all activity for a single person

### Privacy Considerations

- Respects Do Not Track (DNT) browser setting
- No PII stored in cookies (only UUIDs)
- All data stored in Supabase with RLS policies
- GDPR-friendly design (can delete visitor data)

---

## Summary

This attribution system provides:

1. **Complete Journey Visibility** - From first click to purchase
2. **First-Touch Attribution** - Know what marketing works
3. **Legacy Data Integration** - Historical context preserved
4. **Real-Time Tracking** - Live customer journeys
5. **Actionable Dashboards** - Make data-driven decisions

For questions or enhancements, refer to the migration files:
- `supabase/migrations/20260205000000_journey_schema.sql`
- `supabase/migrations/20260205000001_legacy_leads.sql`
