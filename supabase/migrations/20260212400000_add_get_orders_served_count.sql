-- ============================================================================
-- Function: get_orders_served_count()
-- ============================================================================
-- Returns the current order_number_seq value (i.e. the last order number).
-- This is used by the API to show live "customers served" count on the site.
-- ============================================================================

CREATE OR REPLACE FUNCTION get_orders_served_count()
RETURNS INTEGER AS $$
DECLARE
  current_val INTEGER;
BEGIN
  SELECT last_value INTO current_val
  FROM pg_sequences
  WHERE schemaname = 'public' AND sequencename = 'order_number_seq';

  RETURN COALESCE(current_val, 95000);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public access so the website can call it
GRANT EXECUTE ON FUNCTION get_orders_served_count() TO anon;
GRANT EXECUTE ON FUNCTION get_orders_served_count() TO authenticated;
