# Customer Attribution & Journey Tracking System

**Last Updated:** February 5, 2026  
**Status:** Active

A comprehensive waterfall attribution system that tracks the complete customer journey from first landing through purchase, integrating real-time tracking with legacy historical data.

> **Key Concept:** The "waterfall" technique captures session data (including GCLID from Google Ads clicks) in a cookie-based visitor record, then "waterfalls" that attribution data to the customer record when they identify themselves via email. This preserves the connection between ad spend and revenue even when customers convert days or weeks later.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Database Schema](#database-schema)
4. [Customer Journey Flow](#customer-journey-flow)
5. [Attribution Model](#attribution-model)
6. [Google Ads Waterfall Attribution Example](#google-ads-waterfall-attribution-example) ← **NEW: Detailed flow**
7. [Legacy Data Integration](#legacy-data-integration)
8. [GA4 Integration](#ga4-integration)
9. [Google Ads Integration](#google-ads-integration)
10. [Admin Dashboards](#admin-dashboards)
11. [API Endpoints](#api-endpoints)
12. [Cookie & Session Management](#cookie--session-management)

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

## Google Ads Waterfall Attribution Example

This section walks through a **complete Google Ads customer journey** showing exactly how the waterfall attribution captures and preserves attribution data from ad click through purchase.

### The Core Problem

Without proper tracking, you lose the connection:

```
❌ BROKEN ATTRIBUTION:
─────────────────────────────────────────────────────────────────────
Day 1:  Customer clicks Google Ad → lands on site → browses → leaves
        (GCLID captured in URL but then... lost)

Day 5:  Customer returns directly → fills out contact form
        (No GCLID - form doesn't know they came from Google)

Day 12: Customer calls and orders
        (No connection to original Google Ad click)

Result: $500 order shows as "Direct" instead of "Google Ads"
─────────────────────────────────────────────────────────────────────
```

### The Waterfall Solution

The waterfall technique **captures and holds session data** until the customer identifies themselves:

```
✅ WATERFALL ATTRIBUTION:
─────────────────────────────────────────────────────────────────────
Day 1:  Customer clicks Google Ad
        │
        ├─ URL: mosquitocurtains.com/screened-porch?gclid=ABC123&utm_source=google
        │
        ▼
        ┌─────────────────────────────────────────────────────────┐
        │ STEP 1: CAPTURE SESSION (Anonymous)                     │
        │                                                         │
        │ Set Cookies:                                            │
        │   mc_visitor_id = "v_uuid_001"  (expires 365 days)      │
        │   mc_session_id = "s_uuid_001"  (expires 30 min)        │
        │                                                         │
        │ Store in Database:                                      │
        │   visitors table:                                       │
        │     id: v_uuid_001                                      │
        │     first_utm_source: "google"         ← SAVED!         │
        │     first_utm_medium: "cpc"            ← SAVED!         │
        │     first_utm_campaign: "spring_2026"  ← SAVED!         │
        │     first_landing_page: "/screened-porch"               │
        │     first_gclid: "ABC123"              ← SAVED!         │
        │     first_seen_at: 2026-02-01 10:15:00                  │
        │                                                         │
        │   sessions table:                                       │
        │     id: s_uuid_001                                      │
        │     visitor_id: v_uuid_001                              │
        │     gclid: "ABC123"                                     │
        │     utm_source: "google"                                │
        │     utm_medium: "cpc"                                   │
        │     landing_page: "/screened-porch"                     │
        │     started_at: 2026-02-01 10:15:00                     │
        └─────────────────────────────────────────────────────────┘
        │
        │  Customer browses: /screened-porch → /gallery → /contact
        │  (Each page view recorded to sessions table)
        │
        ▼
        Customer leaves without converting (session ends)
        BUT: mc_visitor_id cookie persists (365 days)


Day 5:  Customer returns DIRECTLY (no UTM params)
        │
        ├─ URL: mosquitocurtains.com/contact (direct visit)
        │
        ▼
        ┌─────────────────────────────────────────────────────────┐
        │ STEP 2: CONTINUE TRACKING (Still Anonymous)             │
        │                                                         │
        │ Read Cookie:                                            │
        │   mc_visitor_id = "v_uuid_001"  ← RECOGNIZED!           │
        │                                                         │
        │ Create NEW session:                                     │
        │   sessions table:                                       │
        │     id: s_uuid_002                                      │
        │     visitor_id: v_uuid_001      ← LINKED TO VISITOR     │
        │     utm_source: NULL            (direct visit)          │
        │     landing_page: "/contact"                            │
        │                                                         │
        │ BUT: visitors table still has:                          │
        │     first_utm_source: "google"  ← PRESERVED!            │
        │     first_gclid: "ABC123"       ← PRESERVED!            │
        │     session_count: 2            (incremented)           │
        └─────────────────────────────────────────────────────────┘
        │
        │  Customer fills out contact form with email
        │
        ▼
        ┌─────────────────────────────────────────────────────────┐
        │ STEP 3: IDENTIFICATION (Email Capture)                  │
        │                                                         │
        │ Form submission triggers: POST /api/tracking/identify   │
        │                                                         │
        │ Payload:                                                │
        │   {                                                     │
        │     visitorId: "v_uuid_001",                            │
        │     sessionId: "s_uuid_002",                            │
        │     email: "john@example.com",                          │
        │     firstName: "John",                                  │
        │     interest: "curtains"                                │
        │   }                                                     │
        │                                                         │
        │ THE WATERFALL HAPPENS:                                  │
        │                                                         │
        │   1. Find or create customer by email                   │
        │   2. COPY attribution from visitor → customer:          │
        │                                                         │
        │   customers table:                                      │
        │     id: c_uuid_001                                      │
        │     email: "john@example.com"                           │
        │     first_utm_source: "google"     ← FROM VISITOR!      │
        │     first_utm_medium: "cpc"        ← FROM VISITOR!      │
        │     first_utm_campaign: "spring_2026"                   │
        │     first_gclid: "ABC123"          ← FROM VISITOR!      │
        │     first_landing_page: "/screened-porch"               │
        │     first_seen_at: 2026-02-01      ← FROM VISITOR!      │
        │     email_captured_at: 2026-02-05                       │
        │     customer_status: "lead"                             │
        │                                                         │
        │   3. Link visitor to customer:                          │
        │      visitors.customer_id = c_uuid_001                  │
        │                                                         │
        │   4. Create journey event:                              │
        │      journey_events: email_captured                     │
        └─────────────────────────────────────────────────────────┘


Day 12: Customer makes purchase
        │
        ▼
        ┌─────────────────────────────────────────────────────────┐
        │ STEP 4: PURCHASE (Full Attribution)                     │
        │                                                         │
        │ Order created with COMPLETE attribution:                │
        │                                                         │
        │   orders table:                                         │
        │     id: o_uuid_001                                      │
        │     customer_id: c_uuid_001                             │
        │     visitor_id: v_uuid_001                              │
        │     session_id: s_uuid_003      (purchase session)      │
        │     total: 500.00                                       │
        │                                                         │
        │     FIRST-TOUCH (from customer record):                 │
        │     first_utm_source: "google"      ← GOOGLE GETS       │
        │     first_utm_campaign: "spring_2026"   CREDIT!         │
        │     first_gclid: "ABC123"                               │
        │                                                         │
        │     LAST-TOUCH (from current session):                  │
        │     converting_utm_source: "direct" (they came back)    │
        │                                                         │
        │   journey_events: purchase_completed                    │
        └─────────────────────────────────────────────────────────┘

RESULT:
  ✅ $500 order attributed to Google Ads campaign "spring_2026"
  ✅ GCLID "ABC123" links to specific ad click
  ✅ Full journey visible: 3 sessions, 4 days to lead, 11 days to purchase
─────────────────────────────────────────────────────────────────────
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GOOGLE ADS WATERFALL ATTRIBUTION                          │
└─────────────────────────────────────────────────────────────────────────────┘

  GOOGLE ADS CLICK                           FORM SUBMISSION
  ───────────────                           ────────────────
        │                                          │
        │ gclid=ABC123                             │ email=john@example.com
        │ utm_source=google                        │
        ▼                                          ▼
  ┌──────────────┐                          ┌──────────────┐
  │   VISITOR    │                          │   CUSTOMER   │
  │   (Cookie)   │───── WATERFALL ─────────▶│   (Email)    │
  │              │      TRANSFER            │              │
  │ • gclid      │                          │ • gclid      │
  │ • utm_source │                          │ • utm_source │
  │ • utm_medium │                          │ • utm_medium │
  │ • first_seen │                          │ • first_seen │
  └──────────────┘                          └──────────────┘
        │                                          │
        │                                          │
        ▼                                          ▼
  ┌──────────────┐                          ┌──────────────┐
  │   SESSIONS   │                          │    ORDERS    │
  │              │                          │              │
  │ Session 1:   │                          │ first_utm_   │
  │  gclid=ABC   │                          │  source=     │
  │  utm=google  │                          │  google      │
  │              │                          │              │
  │ Session 2:   │                          │ first_gclid= │
  │  direct      │                          │  ABC123      │
  └──────────────┘                          └──────────────┘
```

### Implementation: Session Tracking API

The `/api/tracking/session` endpoint captures attribution on first visit:

```typescript
// POST /api/tracking/session
export async function POST(request: Request) {
  const body = await request.json()
  const { visitorId, sessionId, isNewVisitor, utm, gclid, landingPage, referrer } = body
  
  if (isNewVisitor) {
    // First time ever seeing this visitor - capture FIRST-TOUCH
    await supabase.from('visitors').insert({
      id: visitorId,
      fingerprint: visitorId,
      first_landing_page: landingPage,
      first_referrer: referrer,
      first_utm_source: utm?.utm_source || null,
      first_utm_medium: utm?.utm_medium || null,
      first_utm_campaign: utm?.utm_campaign || null,
      first_gclid: gclid || null,           // ← CAPTURE GCLID
      first_seen_at: new Date().toISOString(),
    })
  }
  
  // Always create session record
  await supabase.from('sessions').insert({
    id: sessionId,
    visitor_id: visitorId,
    landing_page: landingPage,
    referrer: referrer,
    utm_source: utm?.utm_source || null,
    utm_medium: utm?.utm_medium || null,
    gclid: gclid || null,                   // ← ALSO ON SESSION
    started_at: new Date().toISOString(),
  })
}
```

### Implementation: Identity Transfer (The Waterfall)

The `/api/tracking/identify` endpoint performs the waterfall transfer:

```typescript
// POST /api/tracking/identify
export async function POST(request: Request) {
  const { visitorId, email, firstName, lastName } = await request.json()
  
  // 1. Get visitor's first-touch attribution
  const { data: visitor } = await supabase
    .from('visitors')
    .select('*')
    .eq('id', visitorId)
    .single()
  
  // 2. Find or create customer
  let customer = await supabase
    .from('customers')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  
  if (!customer.data) {
    // New customer - TRANSFER all first-touch attribution from visitor
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        
        // ═══════════════════════════════════════════════════════
        // THE WATERFALL: Copy visitor attribution to customer
        // ═══════════════════════════════════════════════════════
        first_utm_source: visitor.first_utm_source,      // ← TRANSFER
        first_utm_medium: visitor.first_utm_medium,      // ← TRANSFER
        first_utm_campaign: visitor.first_utm_campaign,  // ← TRANSFER
        first_gclid: visitor.first_gclid,                // ← TRANSFER
        first_landing_page: visitor.first_landing_page,  // ← TRANSFER
        first_referrer: visitor.first_referrer,          // ← TRANSFER
        first_seen_at: visitor.first_seen_at,            // ← TRANSFER
        // ═══════════════════════════════════════════════════════
        
        email_captured_at: new Date().toISOString(),
        customer_status: 'lead',
      })
      .select()
      .single()
    
    customer = newCustomer
  }
  
  // 3. Link visitor to customer (for future sessions)
  await supabase
    .from('visitors')
    .update({ customer_id: customer.data.id })
    .eq('id', visitorId)
  
  // 4. Create journey event
  await supabase.from('journey_events').insert({
    visitor_id: visitorId,
    customer_id: customer.data.id,
    event_type: 'email_captured',
    event_data: { email, source: 'contact_form' },
  })
}
```

### Client-Side: Capturing GCLID on Load

The tracking script must capture GCLID from the URL on first page load:

```typescript
// lib/tracking/client.ts
export function initTracking() {
  // Get or create visitor ID
  let visitorId = getCookie('mc_visitor_id')
  const isNewVisitor = !visitorId
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    setCookie('mc_visitor_id', visitorId, 365) // 365 days
  }
  
  // Get or create session ID
  let sessionId = getCookie('mc_session_id')
  const urlParams = new URLSearchParams(window.location.search)
  const hasNewUtm = urlParams.has('utm_source') || urlParams.has('gclid')
  
  // New session if: no session cookie OR new UTM/GCLID params
  if (!sessionId || hasNewUtm) {
    sessionId = crypto.randomUUID()
    setCookie('mc_session_id', sessionId, 30 / 1440) // 30 minutes
  }
  
  // ═══════════════════════════════════════════════════════
  // CRITICAL: Extract GCLID from URL before it's lost
  // ═══════════════════════════════════════════════════════
  const gclid = urlParams.get('gclid')
  const fbclid = urlParams.get('fbclid')
  
  // Extract all UTM params
  const utm = {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_content: urlParams.get('utm_content'),
    utm_term: urlParams.get('utm_term'),
  }
  
  // Send to server immediately
  fetch('/api/tracking/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      sessionId,
      isNewVisitor,
      isNewSession: !getCookie('mc_session_id') || hasNewUtm,
      landingPage: window.location.pathname,
      referrer: document.referrer,
      gclid,        // ← SEND GCLID
      fbclid,       // ← SEND FBCLID
      utm,
      device: getDeviceInfo(),
    }),
  })
}
```

### Key Points

1. **Capture immediately**: GCLID is in the URL only on the first click - capture it before the user navigates away

2. **Store in visitor**: The visitor record holds first-touch attribution forever (365-day cookie)

3. **Transfer on identify**: When email is captured, copy all attribution from visitor → customer

4. **Preserve on orders**: Orders inherit attribution from customer record

5. **Both touches captured**: 
   - `first_utm_source` = how they originally found you (Google)
   - `converting_utm_source` = what drove this specific action (may be direct)

### Why This Matters for Google Ads

Without the waterfall:
- Customer clicks ad → $5 CPC charged to Google
- Customer converts 2 weeks later → no GCLID
- You can't prove Google drove the sale
- ROAS looks terrible, you cut Google budget

With the waterfall:
- Customer clicks ad → $5 CPC, GCLID captured
- Customer converts 2 weeks later → GCLID attached to order
- You prove Google drove the $500 sale
- True ROAS = $500/$5 = 100x for that click

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

## Google Ads Integration

### Overview

Google Ads API integration provides campaign cost data for true ROAS calculation. While GA4 provides traffic and behavior metrics, Google Ads API provides the **actual spend data** needed to calculate return on investment.

### Why Both GA4 and Google Ads API?

| Data | GA4 | Google Ads API |
|------|-----|----------------|
| Page views & sessions | ✅ | ❌ |
| Traffic channels | ✅ | ❌ |
| **Campaign cost/spend** | ❌ | ✅ |
| Cost per click (CPC) | ❌ | ✅ |
| Impressions | Limited | ✅ Full |
| Keyword-level data | ❌ | ✅ |
| Quality Score | ❌ | ✅ |

### Setup

See `docs/GOOGLE_ADS_API_SETUP.md` for complete setup instructions.

Required environment variables:
```bash
GOOGLE_ADS_DEVELOPER_TOKEN=    # From Google Ads API Center
GOOGLE_ADS_CLIENT_ID=          # From Google Cloud Console
GOOGLE_ADS_CLIENT_SECRET=      # From Google Cloud Console
GOOGLE_ADS_REFRESH_TOKEN=      # From OAuth Playground
GOOGLE_ADS_CUSTOMER_ID=        # Your account ID (no dashes)
GOOGLE_ADS_LOGIN_CUSTOMER_ID=  # Optional: MCC account ID
```

### Daily Sync Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GOOGLE ADS SYNC FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │  Vercel     │────────▶│ /api/       │────────▶│ Google Ads  │
    │  Cron       │         │ google-ads/ │         │ API         │
    │  (daily)    │         │ sync        │         │             │
    └─────────────┘         └─────────────┘         └─────────────┘
                                   │                       │
                                   │                       │
                                   ▼                       │
                            ┌─────────────┐                │
                            │Supabase     │◀───────────────┘
                            │             │
                            │• google_ads_campaigns  (daily metrics)
                            │• google_ads_keywords   (keyword data)
                            │• google_ads_sync_log   (audit trail)
                            └─────────────┘
```

### Google Ads Tables

#### `google_ads_campaigns`

Daily campaign performance metrics:

| Column | Description |
|--------|-------------|
| `campaign_id` | Google Ads campaign ID |
| `campaign_name` | Campaign name |
| `date` | Date of data |
| `cost_micros` | Spend in micros (÷1,000,000 for dollars) |
| `impressions` | Ad impressions |
| `clicks` | Ad clicks |
| `conversions` | Tracked conversions |
| `conversion_value` | Value of conversions |
| `ctr` | Click-through rate |
| `avg_cpc_micros` | Average CPC in micros |

#### `google_ads_keywords` (Optional)

Keyword-level performance for detailed analysis:

| Column | Description |
|--------|-------------|
| `keyword_text` | Search keyword |
| `match_type` | EXACT, PHRASE, BROAD |
| `quality_score` | Google's quality score |
| `cost_micros` | Keyword spend |

### ROAS Views

The system creates views that join spend with revenue:

#### `campaign_roas` - Daily ROAS

```sql
SELECT date, total_spend, total_revenue, roas, cost_per_order
FROM campaign_roas
WHERE date >= '2026-01-01'
ORDER BY date DESC;
```

#### `monthly_roas` - Monthly aggregates

```sql
SELECT month, total_spend, total_revenue, roas
FROM monthly_roas
ORDER BY month DESC;
```

#### `campaign_performance` - By campaign

```sql
SELECT campaign_name, total_spend, total_clicks, avg_cpc
FROM campaign_performance
ORDER BY total_spend DESC;
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/google-ads/sync` | POST | Trigger sync (daily cron) |
| `/api/google-ads/sync` | GET | View sync history |
| `/api/google-ads/test` | GET | Test API connection |

### Backfill Historical Data

```bash
# Sync last 90 days
curl -X POST http://localhost:3001/api/google-ads/sync \
  -H "Content-Type: application/json" \
  -d '{"days": 90}'

# Sync specific date
curl -X POST http://localhost:3001/api/google-ads/sync \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-01-15"}'

# Force re-sync (overwrite existing)
curl -X POST http://localhost:3001/api/google-ads/sync \
  -H "Content-Type: application/json" \
  -d '{"days": 7, "force": true}'

# Include keyword data
curl -X POST http://localhost:3001/api/google-ads/sync \
  -H "Content-Type: application/json" \
  -d '{"days": 30, "includeKeywords": true}'
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
| `/api/google-ads/sync` | POST/GET | Trigger Google Ads sync |
| `/api/google-ads/test` | GET | Test Google Ads connection |

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
