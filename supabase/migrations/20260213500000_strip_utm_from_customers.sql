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

COMMIT;
