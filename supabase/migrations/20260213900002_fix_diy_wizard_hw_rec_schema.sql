-- =============================================================================
-- Fix diy_wizard_hardware_recommendations schema — PART 1: Schema changes
-- =============================================================================
-- Run this first, then run PART 2 (seed data) separately.
-- =============================================================================

-- Drop the incorrectly-added product data columns
ALTER TABLE public.diy_wizard_hardware_recommendations
    DROP COLUMN IF EXISTS unit_price;

ALTER TABLE public.diy_wizard_hardware_recommendations
    DROP COLUMN IF EXISTS image_url;

ALTER TABLE public.diy_wizard_hardware_recommendations
    DROP COLUMN IF EXISTS product_url;

ALTER TABLE public.diy_wizard_hardware_recommendations
    DROP COLUMN IF EXISTS pack_quantity;

-- Add product_sku column (links to products.sku for pricing/images)
ALTER TABLE public.diy_wizard_hardware_recommendations
    ADD COLUMN IF NOT EXISTS product_sku text;
