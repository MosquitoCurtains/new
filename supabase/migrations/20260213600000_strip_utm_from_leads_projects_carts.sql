-- ============================================================================
-- Migration: Remove UTM fields from leads, projects, and carts
--
-- All three tables now have session_id (uuid FK → sessions) from migration 3.
-- Attribution is available via JOINs to sessions → visitors.
-- ============================================================================

BEGIN;

-- ── LEADS ──────────────────────────────────────────────────────────────────
ALTER TABLE public.leads DROP COLUMN IF EXISTS utm_source;
ALTER TABLE public.leads DROP COLUMN IF EXISTS utm_medium;
ALTER TABLE public.leads DROP COLUMN IF EXISTS utm_campaign;
ALTER TABLE public.leads DROP COLUMN IF EXISTS utm_content;
ALTER TABLE public.leads DROP COLUMN IF EXISTS utm_term;
ALTER TABLE public.leads DROP COLUMN IF EXISTS referrer;
ALTER TABLE public.leads DROP COLUMN IF EXISTS landing_page;

-- ── PROJECTS ───────────────────────────────────────────────────────────────
ALTER TABLE public.projects DROP COLUMN IF EXISTS utm_source;
ALTER TABLE public.projects DROP COLUMN IF EXISTS utm_medium;
ALTER TABLE public.projects DROP COLUMN IF EXISTS utm_campaign;
ALTER TABLE public.projects DROP COLUMN IF EXISTS utm_content;
ALTER TABLE public.projects DROP COLUMN IF EXISTS utm_term;
ALTER TABLE public.projects DROP COLUMN IF EXISTS referrer;
ALTER TABLE public.projects DROP COLUMN IF EXISTS landing_page;

-- ── CARTS ──────────────────────────────────────────────────────────────────
ALTER TABLE public.carts DROP COLUMN IF EXISTS utm_source;
ALTER TABLE public.carts DROP COLUMN IF EXISTS utm_medium;
ALTER TABLE public.carts DROP COLUMN IF EXISTS utm_campaign;
ALTER TABLE public.carts DROP COLUMN IF EXISTS referrer;

-- ── CONVENIENCE VIEWS ──────────────────────────────────────────────────────

-- View: leads with session attribution
CREATE OR REPLACE VIEW public.vw_leads_with_attribution AS
SELECT
  l.*,
  s.utm_source      AS session_utm_source,
  s.utm_medium      AS session_utm_medium,
  s.utm_campaign    AS session_utm_campaign,
  s.utm_term        AS session_utm_term,
  s.utm_content     AS session_utm_content,
  s.landing_page    AS session_landing_page,
  s.referrer        AS session_referrer
FROM public.leads l
LEFT JOIN public.sessions s ON l.session_id = s.id;

COMMIT;
