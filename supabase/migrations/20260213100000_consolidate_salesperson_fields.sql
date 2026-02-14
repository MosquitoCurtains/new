-- ============================================================================
-- Migration: Consolidate 3 salesperson references on orders into one
-- 
-- BEFORE: assigned_to (uuid FK), salesperson_id (uuid FK), salesperson_username (text)
-- AFTER:  salesperson_id (uuid FK) only
-- ============================================================================

BEGIN;

-- Step 1: Migrate assigned_to → salesperson_id where salesperson_id is null
UPDATE public.orders
SET salesperson_id = assigned_to
WHERE salesperson_id IS NULL
  AND assigned_to IS NOT NULL;

-- Step 2: Migrate salesperson_username → salesperson_id via staff name lookup
-- Only where salesperson_id is still null after step 1
UPDATE public.orders o
SET salesperson_id = s.id
FROM public.staff s
WHERE o.salesperson_id IS NULL
  AND o.salesperson_username IS NOT NULL
  AND (
    LOWER(s.name) = LOWER(o.salesperson_username)
    OR LOWER(REPLACE(s.name, ' ', '_')) = LOWER(o.salesperson_username)
  );

-- Step 3: Drop FK constraint for assigned_to
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_assigned_to_fkey;

-- Step 4: Drop index on salesperson_username
DROP INDEX IF EXISTS public.idx_orders_salesperson;

-- Step 5: Drop the redundant columns
ALTER TABLE public.orders DROP COLUMN IF EXISTS assigned_to;
ALTER TABLE public.orders DROP COLUMN IF EXISTS salesperson_username;

COMMIT;
