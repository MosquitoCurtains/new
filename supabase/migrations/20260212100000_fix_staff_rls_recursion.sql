-- =============================================================================
-- Fix infinite recursion in staff RLS policies
-- =============================================================================
-- The "Staff can read all staff" policy queries the staff table itself,
-- which triggers RLS evaluation on staff, which triggers the policy again...
-- infinite recursion.
--
-- Fix: Create a SECURITY DEFINER function that bypasses RLS to check
-- if the current user is an active staff member, then use that function
-- in the policy instead of a direct subquery on staff.
-- =============================================================================

-- 1. Create a SECURITY DEFINER function to check staff membership
--    SECURITY DEFINER runs with the privileges of the function owner,
--    bypassing RLS on the staff table and breaking the recursion.
CREATE OR REPLACE FUNCTION public.is_active_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff
    WHERE auth_user_id = auth.uid()
      AND is_active = true
  );
$$;

-- 2. Drop the recursive policy on staff
DROP POLICY IF EXISTS "Staff can read all staff" ON staff;

-- 3. Recreate it using the safe function
CREATE POLICY "Staff can read all staff" ON staff
  FOR SELECT USING (public.is_active_staff());
