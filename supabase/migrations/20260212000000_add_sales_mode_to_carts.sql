-- Add missing columns to carts table for admin sales flow
-- These columns are used by POST /api/admin/carts and PUT /api/admin/carts/[id]

ALTER TABLE carts ADD COLUMN IF NOT EXISTS sales_mode text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS salesperson_id uuid;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS salesperson_name text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_first_name text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_last_name text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_address_1 text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_city text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_state text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_zip text;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'US';
