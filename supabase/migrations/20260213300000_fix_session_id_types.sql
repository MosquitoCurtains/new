-- ============================================================================
-- Migration: Convert session_id on leads, projects, carts from text to uuid FK
--
-- These were stored as text but contain UUID values. This migration:
-- 1. Nullifies any non-UUID values
-- 2. Converts column type to uuid
-- 3. Adds FK constraint to sessions table
-- ============================================================================

BEGIN;

-- ── LEADS ──────────────────────────────────────────────────────────────────

-- Nullify non-UUID session_ids on leads
UPDATE public.leads
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Nullify session_ids that reference non-existent sessions
UPDATE public.leads
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id::uuid NOT IN (SELECT id FROM public.sessions);

-- Convert column type
ALTER TABLE public.leads
  ALTER COLUMN session_id TYPE uuid USING session_id::uuid;

-- Add FK constraint
ALTER TABLE public.leads
  ADD CONSTRAINT leads_session_id_fkey
  FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;

-- ── PROJECTS ───────────────────────────────────────────────────────────────

-- Nullify non-UUID session_ids on projects
UPDATE public.projects
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Nullify session_ids that reference non-existent sessions
UPDATE public.projects
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id::uuid NOT IN (SELECT id FROM public.sessions);

-- Convert column type
ALTER TABLE public.projects
  ALTER COLUMN session_id TYPE uuid USING session_id::uuid;

-- Add FK constraint
ALTER TABLE public.projects
  ADD CONSTRAINT projects_session_id_fkey
  FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;

-- ── CARTS ──────────────────────────────────────────────────────────────────

-- Nullify non-UUID session_ids on carts
UPDATE public.carts
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Nullify session_ids that reference non-existent sessions
UPDATE public.carts
SET session_id = NULL
WHERE session_id IS NOT NULL
  AND session_id::uuid NOT IN (SELECT id FROM public.sessions);

-- Drop RLS policies that depend on the session_id column (must be dropped before ALTER)
-- Direct policies on carts:
DROP POLICY IF EXISTS "Users can view own cart by session" ON public.carts;
DROP POLICY IF EXISTS "Users can update own cart" ON public.carts;
-- Policies on line_items that subquery carts.session_id:
DROP POLICY IF EXISTS "Anyone can view line items for accessible carts" ON public.line_items;
DROP POLICY IF EXISTS "Users can manage line items in own cart" ON public.line_items;

-- Convert column type
ALTER TABLE public.carts
  ALTER COLUMN session_id TYPE uuid USING session_id::uuid;

-- Recreate all RLS policies with the same definitions
CREATE POLICY "Users can view own cart by session" ON public.carts
  FOR SELECT USING (session_id IS NOT NULL);

CREATE POLICY "Users can update own cart" ON public.carts
  FOR UPDATE USING (
    (session_id IS NOT NULL)
    OR (customer_id IN (
      SELECT customers.id FROM public.customers
      WHERE customers.auth_user_id = auth.uid()
    ))
  );

CREATE POLICY "Anyone can view line items for accessible carts" ON public.line_items
  FOR SELECT USING (
    (cart_id IN (SELECT carts.id FROM public.carts WHERE carts.session_id IS NOT NULL))
    OR (EXISTS (
      SELECT 1 FROM public.staff
      WHERE staff.auth_user_id = auth.uid() AND staff.is_active = true
    ))
  );

CREATE POLICY "Users can manage line items in own cart" ON public.line_items
  USING (cart_id IN (
    SELECT carts.id FROM public.carts WHERE carts.session_id IS NOT NULL
  ));

-- Add FK constraint
ALTER TABLE public.carts
  ADD CONSTRAINT carts_session_id_fkey
  FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;

COMMIT;
