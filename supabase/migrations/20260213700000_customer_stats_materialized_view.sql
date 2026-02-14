-- ============================================================================
-- Migration: Move computed aggregates off customers into materialized view
--
-- These columns on customers are derivable from orders + line_items:
--   total_orders, total_spent, average_order_value,
--   first_order_at, last_order_at, preferred_products,
--   rfm_recency_score, rfm_frequency_score, rfm_monetary_score, ltv_tier
--
-- Creates mv_customer_stats materialized view and drops the columns.
-- Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_stats;
-- ============================================================================

BEGIN;

-- Step 0: Drop views that depend on the aggregate columns we're removing
DROP VIEW IF EXISTS public.customer_journey;
DROP VIEW IF EXISTS public.campaign_attribution;

-- Step 1: Create materialized view
CREATE MATERIALIZED VIEW public.mv_customer_stats AS
SELECT
  c.id AS customer_id,
  COUNT(o.id)::integer                       AS total_orders,
  COALESCE(SUM(o.total), 0)::numeric(12,2)  AS total_spent,
  COALESCE(AVG(o.total), 0)::numeric(10,2)  AS average_order_value,
  MIN(o.created_at)                          AS first_order_at,
  MAX(o.created_at)                          AS last_order_at
FROM public.customers c
LEFT JOIN public.orders o
  ON o.customer_id = c.id
  AND o.payment_status = 'paid'
GROUP BY c.id;

-- Unique index for CONCURRENTLY refresh
CREATE UNIQUE INDEX idx_mv_customer_stats_pk
  ON public.mv_customer_stats (customer_id);

-- Step 2: Drop computed columns from customers
ALTER TABLE public.customers DROP COLUMN IF EXISTS total_orders;
ALTER TABLE public.customers DROP COLUMN IF EXISTS total_spent;
ALTER TABLE public.customers DROP COLUMN IF EXISTS average_order_value;
ALTER TABLE public.customers DROP COLUMN IF EXISTS first_order_at;
ALTER TABLE public.customers DROP COLUMN IF EXISTS last_order_at;
ALTER TABLE public.customers DROP COLUMN IF EXISTS preferred_products;
ALTER TABLE public.customers DROP COLUMN IF EXISTS rfm_recency_score;
ALTER TABLE public.customers DROP COLUMN IF EXISTS rfm_frequency_score;
ALTER TABLE public.customers DROP COLUMN IF EXISTS rfm_monetary_score;
ALTER TABLE public.customers DROP COLUMN IF EXISTS ltv_tier;

-- Drop orphaned check constraints from removed columns
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_rfm_recency_score_check;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_rfm_frequency_score_check;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_rfm_monetary_score_check;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_ltv_tier_check;

-- Step 3: Recreate customer_journey view using mv_customer_stats + visitors
CREATE OR REPLACE VIEW public.customer_journey AS
SELECT
  c.id AS customer_id,
  c.email,
  c.first_name,
  c.last_name,
  c.phone,
  c.customer_status,

  -- First touch attribution (from visitors)
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

  -- Aggregates (from materialized view)
  COALESCE(s.total_orders, 0)        AS total_orders,
  COALESCE(s.total_spent, 0)         AS total_spent,
  COALESCE(s.average_order_value, 0) AS average_order_value,

  -- Visitor metrics
  v.session_count,
  v.total_pageviews,
  v.last_seen_at AS visitor_last_seen,

  -- Calculated fields
  EXTRACT(DAY FROM (c.email_captured_at - c.first_seen_at)) AS days_to_email,
  EXTRACT(DAY FROM (c.first_purchase_at - c.first_seen_at)) AS days_to_purchase,
  EXTRACT(DAY FROM (c.first_purchase_at - c.email_captured_at)) AS days_email_to_purchase

FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id
LEFT JOIN public.mv_customer_stats s ON s.customer_id = c.id;

-- Step 4: Recreate campaign_attribution view using visitors + mv_customer_stats
CREATE OR REPLACE VIEW public.campaign_attribution AS
SELECT
  COALESCE(v.first_utm_source, '(direct)') AS source,
  COALESCE(v.first_utm_campaign, '(none)') AS campaign,

  COUNT(DISTINCT c.id) AS total_customers,
  COUNT(DISTINCT CASE WHEN c.customer_status = 'lead' THEN c.id END) AS leads,
  COUNT(DISTINCT CASE WHEN c.customer_status = 'quoted' THEN c.id END) AS quoted,
  COUNT(DISTINCT CASE WHEN c.customer_status IN ('customer', 'repeat') THEN c.id END) AS purchasers,

  SUM(COALESCE(s.total_spent, 0)) AS total_revenue,
  AVG(s.total_spent) FILTER (WHERE s.total_spent > 0) AS avg_customer_value,
  AVG(s.average_order_value) FILTER (WHERE s.average_order_value > 0) AS avg_order_value,

  ROUND(
    COUNT(DISTINCT CASE WHEN c.customer_status IN ('customer', 'repeat') THEN c.id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT c.id), 0) * 100,
    2
  ) AS conversion_rate_pct

FROM public.customers c
LEFT JOIN public.visitors v ON v.customer_id = c.id
LEFT JOIN public.mv_customer_stats s ON s.customer_id = c.id
GROUP BY COALESCE(v.first_utm_source, '(direct)'), COALESCE(v.first_utm_campaign, '(none)')
ORDER BY total_revenue DESC NULLS LAST;

COMMIT;
