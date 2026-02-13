-- ============================================================================
-- Migration: Remove duplicate contact info from projects
--
-- Projects always have lead_id → leads, which stores the canonical contact info.
-- Keeping email on projects as it's used as a universal lookup key.
-- Dropping: first_name, last_name, phone (join to leads instead).
-- ============================================================================

BEGIN;

-- Step 1: Ensure every project has a lead_id (backfill orphans by email match)
UPDATE public.projects p
SET lead_id = (
  SELECT l.id FROM public.leads l
  WHERE l.email = p.email
  ORDER BY l.created_at DESC
  LIMIT 1
)
WHERE p.lead_id IS NULL
  AND p.email IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.leads l WHERE l.email = p.email
  );

-- Step 2: For any remaining projects without a lead, create a minimal lead
-- (so we don't lose contact data when dropping the columns)
INSERT INTO public.leads (email, first_name, last_name, phone, source, status)
SELECT DISTINCT ON (p.email)
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  'admin_sales',
  'converted'
FROM public.projects p
WHERE p.lead_id IS NULL
  AND p.email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.leads l WHERE l.email = p.email
  );

-- Link those newly created leads
UPDATE public.projects p
SET lead_id = (
  SELECT l.id FROM public.leads l
  WHERE l.email = p.email
  ORDER BY l.created_at DESC
  LIMIT 1
)
WHERE p.lead_id IS NULL
  AND p.email IS NOT NULL;

-- Step 3: Drop the redundant contact columns
ALTER TABLE public.projects DROP COLUMN IF EXISTS first_name;
ALTER TABLE public.projects DROP COLUMN IF EXISTS last_name;
ALTER TABLE public.projects DROP COLUMN IF EXISTS phone;

-- Step 4: Create convenience view for projects with contact info
CREATE OR REPLACE VIEW public.vw_projects_with_contact AS
SELECT
  p.*,
  COALESCE(l.first_name, '') AS first_name,
  COALESCE(l.last_name, '')  AS last_name,
  l.phone,
  l.interest,
  l.status AS lead_status
FROM public.projects p
LEFT JOIN public.leads l ON p.lead_id = l.id;

COMMIT;
