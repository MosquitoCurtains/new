-- ============================================================================
-- Migration: Merge orders.source and orders.order_source into one field
--
-- BEFORE: source (website|admin|import|api) + order_source (online_self|admin_sales|phone_sale|...)
-- AFTER:  order_source only, with merged check constraint
-- ============================================================================

BEGIN;

-- Step 1: Migrate source values into order_source where order_source has the default
UPDATE public.orders
SET order_source = CASE source
  WHEN 'website' THEN 'online_self'
  WHEN 'admin'   THEN 'admin_sales'
  WHEN 'import'  THEN 'import'
  WHEN 'api'     THEN 'api'
  ELSE COALESCE(order_source, 'online_self')
END
WHERE order_source = 'online_self'
  AND source IS NOT NULL
  AND source != 'website';

-- Step 2: Drop the old source check constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_source_check;

-- Step 3: Drop the source column
ALTER TABLE public.orders DROP COLUMN IF EXISTS source;

-- Step 4: Add a proper check constraint on order_source
ALTER TABLE public.orders ADD CONSTRAINT orders_order_source_check
  CHECK (order_source IN ('online_self', 'admin_sales', 'phone_sale', 'import', 'api', 'legacy'));

COMMIT;
