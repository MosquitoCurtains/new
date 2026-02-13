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

COMMIT;
