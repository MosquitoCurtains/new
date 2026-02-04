-- E-Commerce Schema Migration
-- Migration: 20260202000000_ecommerce_schema.sql
-- Description: Creates full e-commerce system with product-options model, carts, orders
-- Run this AFTER: 20260129000000_initial_schema.sql and 20260131000000_gallery_tables.sql

-- ============================================================================
-- PRODUCTS TABLE (Base products - 20 core products)
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Product Identity
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Product Type
  product_type TEXT NOT NULL CHECK (product_type IN (
    'panel',           -- Custom sized panels (mesh, vinyl, scrim, rollup)
    'track',           -- Track hardware
    'attachment',      -- Snaps, magnets, clips, etc.
    'raw_material',    -- Raw mesh by the roll
    'tool',            -- Snap tool (refundable)
    'accessory',       -- Fastwax, webbing, tape
    'adjustment'       -- Price adjustments (+/-)
  )),
  
  -- Pricing Model
  pricing_type TEXT NOT NULL CHECK (pricing_type IN (
    'sqft',            -- Price per square foot (panels)
    'linear_ft',       -- Price per linear foot (track, tape, webbing)
    'each',            -- Price per item (snaps, magnets)
    'set',             -- Price per set (rod + clips)
    'fixed',           -- Fixed price (tool)
    'calculated'       -- Complex formula (adjustments)
  )),
  base_price DECIMAL(10,2) DEFAULT 0,
  
  -- Display
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  image_url TEXT,
  
  -- Metadata
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- ============================================================================
-- PRODUCT OPTIONS (Options available for each product)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Option Definition
  name TEXT NOT NULL,            -- 'mesh_type', 'color', 'quantity', 'length'
  display_name TEXT NOT NULL,    -- 'Mesh Type', 'Color', 'Quantity', 'Length'
  option_type TEXT NOT NULL CHECK (option_type IN (
    'select',          -- Dropdown selection
    'color',           -- Color picker
    'number',          -- Numeric input
    'dimension'        -- Width/height input
  )),
  
  -- Behavior
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  UNIQUE(product_id, name)
);

CREATE INDEX IF NOT EXISTS idx_product_options_product ON product_options(product_id);

-- ============================================================================
-- OPTION VALUES (Possible values for each option)
-- ============================================================================
CREATE TABLE IF NOT EXISTS option_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  
  -- Value Definition
  value TEXT NOT NULL,           -- 'heavy_mosquito', 'black', '10'
  display_value TEXT NOT NULL,   -- 'Heavy Mosquito Netting', 'Black', '10 Pack'
  
  -- Pricing Impact
  price_modifier DECIMAL(10,2) DEFAULT 0,     -- Add/subtract from base price
  price_multiplier DECIMAL(10,4) DEFAULT 1,   -- Multiply base price
  
  -- Display
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  UNIQUE(option_id, value)
);

CREATE INDEX IF NOT EXISTS idx_option_values_option ON option_values(option_id);

-- ============================================================================
-- CARTS (Shopping carts for customers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Owner (can be anonymous or linked)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_id TEXT,               -- For anonymous carts
  email TEXT,                    -- Captured early in funnel
  
  -- Cart Status
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN (
    'active',          -- Shopping
    'checkout',        -- In checkout process
    'abandoned',       -- Left without purchase
    'converted'        -- Became an order
  )),
  
  -- Totals (denormalized for performance)
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  
  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  
  -- Linked Project (if started from wizard)
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_carts_customer ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_email ON carts(email);

-- ============================================================================
-- LINE ITEMS (Items in cart or order)
-- ============================================================================
CREATE TABLE IF NOT EXISTS line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Parent (either cart or order, not both)
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  order_id UUID,  -- Will reference orders table (created below)
  
  -- Product Reference
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_sku TEXT NOT NULL,     -- Denormalized for history
  product_name TEXT NOT NULL,    -- Denormalized for history
  
  -- Quantity & Dimensions
  quantity INTEGER DEFAULT 1 NOT NULL,
  width_inches INTEGER,          -- For panels
  height_inches INTEGER,         -- For panels
  length_feet DECIMAL(10,2),     -- For linear products
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  
  -- For Adjustments
  adjustment_type TEXT CHECK (adjustment_type IN ('discount', 'surcharge', 'notch', 'special', NULL)),
  adjustment_reason TEXT,
  related_line_item_id UUID REFERENCES line_items(id) ON DELETE SET NULL,
  
  -- From Historical Import
  original_bundle_name TEXT,     -- If expanded from WooCommerce bundle
  legacy_order_id UUID,          -- Link to imported order
  
  -- Panel Specifications (for custom panels)
  panel_specs JSONB DEFAULT '{}'::jsonb,
  
  CHECK (cart_id IS NOT NULL OR order_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_line_items_cart ON line_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_line_items_order ON line_items(order_id);
CREATE INDEX IF NOT EXISTS idx_line_items_product ON line_items(product_id);

-- ============================================================================
-- LINE ITEM OPTIONS (Selected options for each line item)
-- ============================================================================
CREATE TABLE IF NOT EXISTS line_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  line_item_id UUID NOT NULL REFERENCES line_items(id) ON DELETE CASCADE,
  
  -- Option Reference
  option_name TEXT NOT NULL,         -- 'mesh_type', 'color'
  option_value TEXT NOT NULL,        -- 'heavy_mosquito', 'black'
  option_display TEXT NOT NULL,      -- 'Heavy Mosquito Netting', 'Black'
  
  -- Pricing Impact Applied
  price_impact DECIMAL(10,2) DEFAULT 0,
  
  UNIQUE(line_item_id, option_name)
);

CREATE INDEX IF NOT EXISTS idx_line_item_options_line_item ON line_item_options(line_item_id);

-- ============================================================================
-- ORDERS (Completed purchases)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Order Number (human readable)
  order_number TEXT NOT NULL UNIQUE,
  
  -- Customer
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  
  -- Contact Info (denormalized)
  billing_first_name TEXT,
  billing_last_name TEXT,
  billing_phone TEXT,
  billing_address_1 TEXT,
  billing_address_2 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  billing_country TEXT DEFAULT 'US',
  
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_phone TEXT,
  shipping_address_1 TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT DEFAULT 'US',
  
  -- Order Status
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN (
    'pending',         -- Awaiting payment
    'processing',      -- Payment received, being made
    'on_hold',         -- Needs attention
    'completed',       -- Shipped/delivered
    'cancelled',       -- Cancelled
    'refunded',        -- Fully refunded
    'failed'           -- Payment failed
  )),
  
  -- Financial
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method TEXT,           -- 'paypal', 'stripe', 'manual'
  payment_transaction_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'refunded', 'failed'
  )),
  paid_at TIMESTAMPTZ,
  
  -- Fulfillment
  shipped_at TIMESTAMPTZ,
  tracking_number TEXT,
  tracking_url TEXT,
  
  -- Notes
  customer_note TEXT,
  internal_note TEXT,
  
  -- Staff Assignment
  assigned_to UUID REFERENCES staff(id) ON DELETE SET NULL,
  salesperson_username TEXT,     -- From WooCommerce import
  
  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  
  -- Source
  source TEXT DEFAULT 'website' CHECK (source IN (
    'website',         -- New checkout
    'admin',           -- Created by staff
    'import',          -- Historical import
    'api'              -- External integration
  )),
  
  -- From Project/Cart
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  cart_id UUID REFERENCES carts(id) ON DELETE SET NULL,
  
  -- Diagram/Attachment
  diagram_url TEXT,              -- PDF diagram on S3
  
  -- Legacy Import Fields
  legacy_woo_order_id INTEGER,
  legacy_woo_order_key TEXT,
  legacy_raw_data JSONB
);

-- Add foreign key from line_items to orders (now that orders exists)
ALTER TABLE line_items 
  ADD CONSTRAINT fk_line_items_order 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_salesperson ON orders(salesperson_username);

-- ============================================================================
-- EXTEND CUSTOMERS TABLE (Add metrics for CRM)
-- ============================================================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  total_orders INTEGER DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  total_spent DECIMAL(12,2) DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  average_order_value DECIMAL(10,2) DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  first_order_at TIMESTAMPTZ;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  last_order_at TIMESTAMPTZ;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  rfm_recency_score INTEGER CHECK (rfm_recency_score BETWEEN 1 AND 5);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  rfm_frequency_score INTEGER CHECK (rfm_frequency_score BETWEEN 1 AND 5);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  rfm_monetary_score INTEGER CHECK (rfm_monetary_score BETWEEN 1 AND 5);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  ltv_tier TEXT CHECK (ltv_tier IN ('vip', 'high', 'medium', 'low', 'new'));

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  preferred_products TEXT[];     -- Most purchased product types

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  acquisition_source TEXT;       -- First UTM source

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  assigned_salesperson TEXT;     -- Primary salesperson

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  city TEXT;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  state TEXT;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  zip TEXT;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS
  notes TEXT;

CREATE INDEX IF NOT EXISTS idx_customers_ltv ON customers(ltv_tier);
CREATE INDEX IF NOT EXISTS idx_customers_state ON customers(state);

-- ============================================================================
-- LEGACY ORDERS (Historical WooCommerce Import)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- WooCommerce IDs
  woo_order_id INTEGER NOT NULL UNIQUE,
  woo_order_key TEXT,
  
  -- Order Basics
  order_number TEXT NOT NULL,
  order_date TIMESTAMPTZ NOT NULL,
  status TEXT,
  
  -- Customer
  email TEXT NOT NULL,
  billing_first_name TEXT,
  billing_last_name TEXT,
  billing_phone TEXT,
  billing_address_1 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_address_1 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  
  -- Financials
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  discount DECIMAL(10,2),
  total DECIMAL(10,2),
  
  -- Payment
  payment_method TEXT,
  payment_method_title TEXT,
  transaction_id TEXT,
  
  -- Attribution - Salesperson
  salesperson_username TEXT,
  
  -- Attribution - UTM Parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  utm_id TEXT,
  utm_source_platform TEXT,
  utm_creative_format TEXT,
  utm_marketing_tactic TEXT,
  
  -- Attribution - Session Data
  source_type TEXT,              -- 'organic', 'referral', 'typein', 'utm', etc.
  referrer TEXT,
  device_type TEXT,              -- 'Desktop', 'Mobile', 'Tablet'
  user_agent TEXT,
  session_entry TEXT,            -- Landing page URL
  session_pages INTEGER,
  session_count INTEGER,
  session_start_time TIMESTAMPTZ,
  
  -- Attachments
  diagram_attachment_id INTEGER,
  diagram_url TEXT,
  
  -- Raw Data
  raw_line_items TEXT,           -- Original pipe-delimited string
  raw_meta TEXT,                 -- Original meta string
  raw_csv_row JSONB,             -- Full CSV row as JSON (preserves ALL fields)
  
  -- Link to new order (if migrated)
  new_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_legacy_orders_woo_id ON legacy_orders(woo_order_id);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_email ON legacy_orders(email);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_date ON legacy_orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_salesperson ON legacy_orders(salesperson_username);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_utm_source ON legacy_orders(utm_source);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_source_type ON legacy_orders(source_type);
CREATE INDEX IF NOT EXISTS idx_legacy_orders_device ON legacy_orders(device_type);

-- ============================================================================
-- LEGACY LINE ITEMS (Parsed from WooCommerce)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  legacy_order_id UUID NOT NULL REFERENCES legacy_orders(id) ON DELETE CASCADE,
  
  -- Product Info
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER DEFAULT 1,
  
  -- Pricing
  unit_price DECIMAL(10,2),
  line_total DECIMAL(10,2),
  
  -- Item Type Classification
  item_type TEXT CHECK (item_type IN (
    'panel', 'track', 'attachment', 'raw_material', 
    'tool', 'accessory', 'adjustment', 'bundle', 'unknown'
  )),
  
  -- Raw Meta
  raw_meta TEXT,
  parsed_meta JSONB,
  
  -- Link to new line item
  new_line_item_id UUID REFERENCES line_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_legacy_line_items_order ON legacy_line_items(legacy_order_id);
CREATE INDEX IF NOT EXISTS idx_legacy_line_items_type ON legacy_line_items(item_type);

-- ============================================================================
-- LEGACY PANEL SPECS (Parsed panel dimensions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legacy_panel_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  legacy_line_item_id UUID NOT NULL REFERENCES legacy_line_items(id) ON DELETE CASCADE,
  
  -- Panel Details
  panel_number INTEGER DEFAULT 1,
  width_inches INTEGER,
  height_inches INTEGER,
  sqft DECIMAL(10,2),
  
  -- Options
  mesh_type TEXT,
  color TEXT,
  top_attachment TEXT,
  bottom_attachment TEXT,
  
  -- Features
  has_door BOOLEAN DEFAULT false,
  has_zipper BOOLEAN DEFAULT false,
  has_notch BOOLEAN DEFAULT false,
  notch_specs TEXT,
  
  -- Raw
  raw_dimension_string TEXT
);

CREATE INDEX IF NOT EXISTS idx_legacy_panel_specs_line_item ON legacy_panel_specs(legacy_line_item_id);

-- ============================================================================
-- AUDIT LOG (Track changes for PE due diligence)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- What Changed
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  
  -- Who Changed It
  user_id UUID,
  user_email TEXT,
  
  -- Change Details
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  
  -- Context
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);

-- ============================================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  changed_fields TEXT[];
  old_json JSONB;
  new_json JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_json := to_jsonb(OLD);
    INSERT INTO audit_log (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, old_json, auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
    -- Find changed fields
    SELECT array_agg(key) INTO changed_fields
    FROM jsonb_each(old_json) o
    FULL OUTER JOIN jsonb_each(new_json) n USING (key)
    WHERE o.value IS DISTINCT FROM n.value;
    
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_fields, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, old_json, new_json, changed_fields, auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_json := to_jsonb(NEW);
    INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, new_json, auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_orders ON orders;
CREATE TRIGGER audit_orders
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_customers ON customers;
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_products ON products;
CREATE TRIGGER audit_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================================
-- UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_line_items_updated_at ON line_items;
CREATE TRIGGER update_line_items_updated_at
  BEFORE UPDATE ON line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- ============================================================================

-- Products - public read, staff write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Carts - owner access
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart by session" ON carts
  FOR SELECT USING (session_id IS NOT NULL);

CREATE POLICY "Users can create carts" ON carts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own cart" ON carts
  FOR UPDATE USING (session_id IS NOT NULL OR customer_id IN (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all carts" ON carts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Line Items
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view line items for accessible carts" ON line_items
  FOR SELECT USING (
    cart_id IN (SELECT id FROM carts WHERE session_id IS NOT NULL)
    OR EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can manage line items in own cart" ON line_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE session_id IS NOT NULL)
  );

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Staff can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can manage orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Legacy tables - staff only
ALTER TABLE legacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_panel_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can access legacy orders" ON legacy_orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can access legacy line items" ON legacy_line_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can access legacy panel specs" ON legacy_panel_specs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Audit log - staff read only
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view audit log" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Product options/values - same as products
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_item_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product options" ON product_options
  FOR SELECT USING (true);

CREATE POLICY "Staff can manage product options" ON product_options
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Anyone can view option values" ON option_values
  FOR SELECT USING (true);

CREATE POLICY "Staff can manage option values" ON option_values
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Anyone can view line item options" ON line_item_options
  FOR SELECT USING (true);

CREATE POLICY "Users can manage line item options" ON line_item_options
  FOR ALL USING (true);

-- ============================================================================
-- HELPER FUNCTION: Generate Order Number
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  seq_part TEXT;
  new_number TEXT;
BEGIN
  year_part := to_char(NOW(), 'YY');
  
  -- Get next sequence number for this year
  SELECT LPAD((COALESCE(MAX(
    CASE 
      WHEN order_number ~ ('^MC' || year_part || '-[0-9]+$')
      THEN SUBSTRING(order_number FROM 6)::INTEGER
      ELSE 0
    END
  ), 0) + 1)::TEXT, 5, '0')
  INTO seq_part
  FROM orders
  WHERE order_number LIKE 'MC' || year_part || '-%';
  
  new_number := 'MC' || year_part || '-' || seq_part;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Update customer metrics on order
-- ============================================================================
CREATE OR REPLACE FUNCTION update_customer_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers SET
      total_orders = (
        SELECT COUNT(*) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      total_spent = (
        SELECT COALESCE(SUM(total), 0) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      average_order_value = (
        SELECT COALESCE(AVG(total), 0) FROM orders 
        WHERE customer_id = NEW.customer_id AND status NOT IN ('cancelled', 'refunded', 'failed')
      ),
      first_order_at = (
        SELECT MIN(created_at) FROM orders WHERE customer_id = NEW.customer_id
      ),
      last_order_at = (
        SELECT MAX(created_at) FROM orders WHERE customer_id = NEW.customer_id
      ),
      updated_at = NOW()
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_customer_on_order ON orders;
CREATE TRIGGER update_customer_on_order
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_metrics();

-- ============================================================================
-- DONE!
-- ============================================================================
