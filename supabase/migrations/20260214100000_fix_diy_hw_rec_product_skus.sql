-- =============================================================================
-- Fix diy_wizard_hardware_recommendations: set product_sku values
-- =============================================================================
-- The product_sku column is null for all rows. This prevents the PanelBuilder
-- from resolving product images and pricing from the products table.
-- Each item_key maps to a specific product SKU.
-- =============================================================================

UPDATE public.diy_wizard_hardware_recommendations
SET product_sku = CASE item_key
    WHEN 'track_straight'     THEN 'track_standard_straight'
    WHEN 'track_splice'       THEN 'track_standard_splice'
    WHEN 'track_endcap'       THEN 'track_standard_endcap'
    WHEN 'marine_snap_white'  THEN 'marine_snap_white'
    WHEN 'marine_snap_black'  THEN 'marine_snap_black'
    WHEN 'block_magnet'       THEN 'block_magnet'
    WHEN 'fiberglass_rod'     THEN 'fiberglass_rod'
    WHEN 'stucco_strip'       THEN 'stucco_standard'
    WHEN 'snap_tool'          THEN 'snap_tool'
    ELSE product_sku
END
WHERE product_sku IS NULL;
