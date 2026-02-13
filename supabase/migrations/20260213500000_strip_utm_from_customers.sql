-- ============================================================================
-- Migration: Remove first-touch UTM fields from customers
--
-- First-touch attribution lives on the visitors table. Customers link to
-- visitors via visitors.customer_id. These flat copies are redundant.
--
-- Keeps lifecycle timestamps: first_seen_at, email_captured_at,
-- first_quote_at, first_purchase_at (these are customer milestones).
--
-- Creates vw_customer_attribution view for convenience.
-- ============================================================================

BEGIN;

-- Step 0: Drop views that depend on the columns we're removing
DROP VIEW IF EXISTS public.customer_journey;
DROP VIEW IF EXISTS public.campaign_attribution;

-- Step 1: Drop redundant first-touch UTM columns
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_utm_source;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_utm_medium;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_utm_campaign;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_utm_term;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_utm_content;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_landing_page;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_referrer;
ALTER TABLE public.customers DROP COLUMN IF EXISTS acquisition_source;

-- Step 2: Create convenience view for customers with attribution
CREATE OR REPLACE VIEW public.vw_customer_attribution AS
SELECT
  c.*,
  -- First-touch attribution from the linked visitor
  v.first_utm_source,
  v.first_utm_medium,
  v.first_utm_campaign,
  v.first_utm_term,
  v.first_utm_content,
  v.first_landing_page,
  v.first_referrer,
  v.first_seen_at      AS visitor_first_seen_at,
  v.last_seen_at       AS visitor_last_seen_at,
  v.session_count       AS visitor_session_count,
  v.total_pageviews     AS visitor_total_pageviews
FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id;

-- Step 3: Recreate customer_journey view using visitors for attribution
CREATE OR REPLACE VIEW public.customer_journey AS
SELECT
  c.id AS customer_id,
  c.email,
  c.first_name,
  c.last_name,
  c.phone,
  c.customer_status,

  -- First touch attribution (now from visitors)
  v.first_utm_source,
  v.first_utm_medium,
  v.first_utm_campaign,
  v.first_landing_page,
  v.first_referrer,

  -- Lifecycle timestamps
  c.first_seen_at,
  c.email_captured_at,
  c.first_quote_at,
  c.first_purchase_at,
  c.created_at AS customer_created_at,

  -- Aggregates (still on customers until migration 7 moves them)
  c.total_orders,
  c.total_spent,
  c.average_order_value,
  c.ltv_tier,

  -- Visitor metrics
  v.session_count,
  v.total_pageviews,
  v.last_seen_at AS visitor_last_seen,

  -- Calculated fields
  EXTRACT(DAY FROM (c.email_captured_at - c.first_seen_at)) AS days_to_email,
  EXTRACT(DAY FROM (c.first_purchase_at - c.first_seen_at)) AS days_to_purchase,
  EXTRACT(DAY FROM (c.first_purchase_at - c.email_captured_at)) AS days_email_to_purchase

FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id;

-- Step 4: Recreate campaign_attribution view using visitors for attribution
CREATE OR REPLACE VIEW public.campaign_attribution AS
SELECT
  COALESCE(v.first_utm_source, '(direct)') AS source,
  COALESCE(v.first_utm_campaign, '(none)') AS campaign,

  -- Customer counts
  COUNT(DISTINCT c.id) AS total_customers,
  COUNT(DISTINCT CASE WHEN c.customer_status = 'lead' THEN c.id END) AS leads,
  COUNT(DISTINCT CASE WHEN c.customer_status = 'quoted' THEN c.id END) AS quoted,
  COUNT(DISTINCT CASE WHEN c.customer_status IN ('customer', 'repeat') THEN c.id END) AS purchasers,

  -- Revenue
  SUM(c.total_spent) AS total_revenue,
  AVG(c.total_spent) FILTER (WHERE c.total_spent > 0) AS avg_customer_value,
  AVG(c.average_order_value) FILTER (WHERE c.average_order_value > 0) AS avg_order_value,

  -- Conversion rate
  ROUND(
    COUNT(DISTINCT CASE WHEN c.customer_status IN ('customer', 'repeat') THEN c.id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT c.id), 0) * 100,
    2
  ) AS conversion_rate_pct

FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id
GROUP BY COALESCE(v.first_utm_source, '(direct)'), COALESCE(v.first_utm_campaign, '(none)')
ORDER BY total_revenue DESC NULLS LAST;

COMMIT;
