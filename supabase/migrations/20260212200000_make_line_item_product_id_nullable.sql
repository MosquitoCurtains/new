-- Make product_id nullable on line_items
-- Adjustment items (discounts, surcharges, tariffs) don't have a real product row.
-- The API will resolve product_id from product_sku when a matching product exists.

ALTER TABLE public.line_items ALTER COLUMN product_id DROP NOT NULL;
