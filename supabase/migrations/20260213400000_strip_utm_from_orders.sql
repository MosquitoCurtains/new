-- ============================================================================
-- Migration: Remove UTM/attribution columns from orders
--
-- Orders already have session_id FK → sessions and visitor_id FK → visitors.
-- All attribution data is available via JOINs. These flat columns are redundant.
--
-- Creates vw_orders_with_attribution view for convenience.
-- ============================================================================

BEGIN;

-- Step 1: Drop redundant UTM columns from orders
ALTER TABLE public.orders DROP COLUMN IF EXISTS utm_source;
ALTER TABLE public.orders DROP COLUMN IF EXISTS utm_medium;
ALTER TABLE public.orders DROP COLUMN IF EXISTS utm_campaign;
ALTER TABLE public.orders DROP COLUMN IF EXISTS referrer;
ALTER TABLE public.orders DROP COLUMN IF EXISTS first_utm_source;
ALTER TABLE public.orders DROP COLUMN IF EXISTS first_utm_campaign;
ALTER TABLE public.orders DROP COLUMN IF EXISTS converting_utm_source;
ALTER TABLE public.orders DROP COLUMN IF EXISTS converting_utm_campaign;

-- Step 2: Create convenience view for orders with full attribution
CREATE OR REPLACE VIEW public.vw_orders_with_attribution AS
SELECT
  o.*,
  -- Converting session (the session that led to this order)
  s.utm_source      AS session_utm_source,
  s.utm_medium      AS session_utm_medium,
  s.utm_campaign    AS session_utm_campaign,
  s.utm_term        AS session_utm_term,
  s.utm_content     AS session_utm_content,
  s.landing_page    AS session_landing_page,
  s.referrer        AS session_referrer,
  s.device_type     AS session_device_type,
  -- First-touch attribution (from visitor)
  v.first_utm_source,
  v.first_utm_medium,
  v.first_utm_campaign,
  v.first_utm_term,
  v.first_utm_content,
  v.first_landing_page,
  v.first_referrer,
  v.first_seen_at   AS visitor_first_seen_at,
  -- Salesperson name (from staff join)
  st.name           AS salesperson_name
FROM public.orders o
LEFT JOIN public.sessions s  ON o.session_id = s.id
LEFT JOIN public.visitors v  ON o.visitor_id = v.id
LEFT JOIN public.staff st    ON o.salesperson_id = st.id;

COMMIT;
