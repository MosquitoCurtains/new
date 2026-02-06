-- ============================================================================
-- Order Number Sequence System
-- ============================================================================
-- Creates an auto-incrementing order number system that:
-- 1. Continues from legacy WooCommerce order numbers
-- 2. Auto-generates order_number on INSERT to orders table
-- 3. Provides a function to get "orders served" count for display
-- ============================================================================

-- ============================================================================
-- SEQUENCE: order_number_seq
-- ============================================================================
-- Starting at 92035 (will be updated at launch to actual value)
-- Each new order gets the next number in sequence

CREATE SEQUENCE IF NOT EXISTS order_number_seq
  START WITH 92035
  INCREMENT BY 1
  NO MAXVALUE
  NO CYCLE;

-- Grant usage to authenticated users (for the trigger)
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO service_role;

-- ============================================================================
-- FUNCTION: generate_order_number()
-- ============================================================================
-- Called by trigger to auto-populate order_number on INSERT

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if order_number is not provided or is empty
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := nextval('order_number_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: auto_generate_order_number
-- ============================================================================
-- Fires before INSERT on orders to auto-populate order_number

DROP TRIGGER IF EXISTS auto_generate_order_number ON orders;
CREATE TRIGGER auto_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- ============================================================================
-- FUNCTION: get_orders_served_count()
-- ============================================================================
-- Returns the current "orders served" count for display on the website
-- This is the last value of the sequence (current value - 1 since nextval increments first)
-- For display purposes, we show the current value which represents total orders

CREATE OR REPLACE FUNCTION get_orders_served_count()
RETURNS INTEGER AS $$
DECLARE
  current_val INTEGER;
BEGIN
  -- Get the current value of the sequence without incrementing
  -- We use lastval() if the sequence has been used, otherwise get from pg_sequences
  SELECT last_value INTO current_val
  FROM pg_sequences
  WHERE schemaname = 'public' AND sequencename = 'order_number_seq';
  
  -- Return 0 if sequence hasn't been used yet
  RETURN COALESCE(current_val, 92035);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to public for API access
GRANT EXECUTE ON FUNCTION get_orders_served_count() TO anon;
GRANT EXECUTE ON FUNCTION get_orders_served_count() TO authenticated;

-- ============================================================================
-- FUNCTION: set_order_number_sequence(start_value)
-- ============================================================================
-- Admin function to set the sequence to a specific value (for launch/sync)

CREATE OR REPLACE FUNCTION set_order_number_sequence(start_value INTEGER)
RETURNS VOID AS $$
BEGIN
  PERFORM setval('order_number_seq', start_value, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only service_role can reset the sequence
GRANT EXECUTE ON FUNCTION set_order_number_sequence(INTEGER) TO service_role;

-- ============================================================================
-- SITE SETTINGS TABLE (for configurable values)
-- ============================================================================
-- Stores site-wide settings including the displayed "orders served" count
-- This allows manual adjustment if needed (e.g., including legacy orders not in DB)

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert initial orders served setting
INSERT INTO site_settings (key, value, description)
VALUES (
  'orders_served_count',
  '{"count": 92035, "display_format": "{count}+", "source": "sequence"}'::jsonb,
  'Total orders served count displayed on the website. Updates automatically with new orders.'
)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site_settings
CREATE POLICY "site_settings_read_public" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only authenticated staff can update
CREATE POLICY "site_settings_update_staff" ON site_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff 
      WHERE staff.user_id = auth.uid() 
      AND staff.role IN ('admin', 'manager')
    )
  );

-- ============================================================================
-- FUNCTION: get_site_setting(key)
-- ============================================================================
-- Helper function to get a site setting value

CREATE OR REPLACE FUNCTION get_site_setting(setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT value INTO result
  FROM site_settings
  WHERE key = setting_key;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_site_setting(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_site_setting(TEXT) TO authenticated;

-- ============================================================================
-- FUNCTION: increment_orders_served()
-- ============================================================================
-- Called after a successful order to update the site_settings count
-- This keeps the displayed count in sync with actual orders

CREATE OR REPLACE FUNCTION increment_orders_served()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE site_settings
  SET 
    value = jsonb_set(
      value,
      '{count}',
      to_jsonb((value->>'count')::INTEGER + 1)
    ),
    updated_at = NOW()
  WHERE key = 'orders_served_count';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment count after order insert
DROP TRIGGER IF EXISTS increment_orders_served_trigger ON orders;
CREATE TRIGGER increment_orders_served_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION increment_orders_served();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON SEQUENCE order_number_seq IS 'Auto-incrementing sequence for order numbers, starting from legacy WooCommerce order count';
COMMENT ON FUNCTION generate_order_number() IS 'Trigger function to auto-generate order_number on INSERT';
COMMENT ON FUNCTION get_orders_served_count() IS 'Returns the current orders served count for website display';
COMMENT ON FUNCTION set_order_number_sequence(INTEGER) IS 'Admin function to set the order number sequence starting value';
COMMENT ON TABLE site_settings IS 'Site-wide configuration settings';
COMMENT ON FUNCTION get_site_setting(TEXT) IS 'Get a site setting value by key';
COMMENT ON FUNCTION increment_orders_served() IS 'Increment the displayed orders served count after each order';
