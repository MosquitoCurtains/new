-- =============================================================================
-- Add first_name and last_name to staff table + make auth_user_id nullable
-- =============================================================================

-- Allow staff to exist without a linked auth user
ALTER TABLE staff ALTER COLUMN auth_user_id DROP NOT NULL;

ALTER TABLE staff ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS last_name text;

-- Backfill from existing name: split on first space
UPDATE staff
SET
  first_name = COALESCE(NULLIF(SPLIT_PART(TRIM(name), ' ', 1), ''), name),
  last_name = CASE
    WHEN POSITION(' ' IN TRIM(name)) > 0
    THEN NULLIF(TRIM(SUBSTRING(TRIM(name) FROM POSITION(' ' IN TRIM(name)) + 1)), '')
    ELSE NULL
  END
WHERE first_name IS NULL AND name IS NOT NULL;

-- Clean up any rows that had the fake placeholder UUID
UPDATE staff SET auth_user_id = NULL WHERE auth_user_id = '00000000-0000-0000-0000-000000000000';

-- Allow authenticated users to read their own staff record (needed for login verification)
CREATE POLICY "Users can read own staff record" ON staff
  FOR SELECT USING (auth_user_id = auth.uid());

-- Allow staff to read all staff records (for dropdowns, staff page, etc.)
CREATE POLICY "Staff can read all staff" ON staff
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff s WHERE s.auth_user_id = auth.uid() AND s.is_active = true)
  );
