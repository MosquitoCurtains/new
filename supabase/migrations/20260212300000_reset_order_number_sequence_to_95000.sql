-- ============================================================================
-- Reset Order Number Sequence to 95000
-- ============================================================================
-- 1. Fix the existing order that has an incorrect order_number
-- 2. Reset the sequence to start at 95000
-- 3. Update site_settings to reflect new starting count
-- ============================================================================

-- Step 1: Fix the existing order with incorrect order_number
-- Update any order that doesn't have a pure numeric order_number (e.g. MC26-XXXXX format)
UPDATE orders
SET order_number = '95000'
WHERE order_number !~ '^\d+$'
   OR order_number::bigint < 95000;

-- Step 2: Create the sequence (if it doesn't exist) and set it to 95000
CREATE SEQUENCE IF NOT EXISTS order_number_seq
  START WITH 95000
  INCREMENT BY 1
  NO MAXVALUE
  NO CYCLE;

-- Grant usage to authenticated users (for the trigger)
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO service_role;

-- Set the sequence so the NEXT order gets 95001
SELECT setval('order_number_seq', 95000, true);

-- Step 2b: Drop the old function (may have wrong return type) and recreate as trigger
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := nextval('order_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_generate_order_number ON orders;
CREATE TRIGGER auto_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Note: site_settings table does not exist yet, skipping count update.
