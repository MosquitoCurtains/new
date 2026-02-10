-- =============================================================================
-- Order Management System Migration
-- =============================================================================
-- Adds: cart salesperson/sales_mode fields, expanded order statuses,
--        order_notes table, order_tracking_numbers table, project status constraint
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1a. Expand carts table
-- ---------------------------------------------------------------------------

-- Salesperson (denormalized from project for quick display on orders)
ALTER TABLE carts ADD COLUMN IF NOT EXISTS salesperson_id uuid REFERENCES staff(id) ON DELETE SET NULL;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS salesperson_name text;

-- Which sales page mode this cart was built on
ALTER TABLE carts ADD COLUMN IF NOT EXISTS sales_mode text; -- 'mc','cv','rn','ru'

-- Shipping address (for checkout; may differ from lead's address)
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_first_name text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_last_name text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_address_1 text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_city text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_state text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_zip text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'US';

-- ---------------------------------------------------------------------------
-- 1b. Add project status constraint
-- ---------------------------------------------------------------------------

-- First migrate any existing status values that don't match the new constraint
UPDATE projects SET status = 'draft' WHERE status NOT IN (
  'draft', 'new', 'need_photos', 'need_measurements',
  'working_on_quote', 'quote_sent', 'quote_viewed',
  'need_decision', 'order_placed', 'closed', 'archived'
) AND status IS NOT NULL;

ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (
  status = ANY(ARRAY[
    'draft', 'new', 'need_photos', 'need_measurements',
    'working_on_quote', 'quote_sent', 'quote_viewed',
    'need_decision', 'order_placed', 'closed', 'archived'
  ])
);

-- ---------------------------------------------------------------------------
-- 1c. Expand order statuses to match production workflow (16 statuses)
-- ---------------------------------------------------------------------------

-- First migrate any existing status values to new format
UPDATE orders SET status = 'on-hold' WHERE status = 'on_hold';

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
  status = ANY(ARRAY[
    'on-hold', 'on-hold-waiting', 'pending', 'processing',
    'diagrams-uploaded', 'in-production', 'cut', 'resting',
    'sewing', 'qc', 'shipped', 'completed',
    'snap-tool-refund', 'failed', 'cancelled', 'refunded'
  ])
);

-- ---------------------------------------------------------------------------
-- 1d. Create order_notes table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS order_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  is_customer_visible boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_notes_order ON order_notes(order_id);

-- ---------------------------------------------------------------------------
-- 1e. Create order_tracking_numbers table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS order_tracking_numbers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number text NOT NULL,
  carrier text,
  tracking_url text,
  shipped_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_tracking_order ON order_tracking_numbers(order_id);

-- ---------------------------------------------------------------------------
-- RLS Policies for new tables
-- ---------------------------------------------------------------------------

ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking_numbers ENABLE ROW LEVEL SECURITY;

-- Staff can manage order notes
CREATE POLICY "Staff can view order notes" ON order_notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can insert order notes" ON order_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Staff can manage tracking numbers
CREATE POLICY "Staff can view tracking numbers" ON order_tracking_numbers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can insert tracking numbers" ON order_tracking_numbers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can delete tracking numbers" ON order_tracking_numbers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Public can view customer-visible notes (for /my-projects)
CREATE POLICY "Public can view customer-visible notes" ON order_notes
  FOR SELECT USING (is_customer_visible = true);

-- Public can view tracking numbers (for /my-projects)
CREATE POLICY "Public can view tracking numbers" ON order_tracking_numbers
  FOR SELECT USING (true);
