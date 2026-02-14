-- =============================================================================
-- Add product_types column to diy_wizard_hardware_recommendations
-- =============================================================================
-- Allows each recommendation rule to target specific product types.
-- Comma-separated values, same pattern as color_match.
-- NULL = applies to all product types.
-- Valid values: mosquito_curtains, clear_vinyl, raw_netting, raw_netting_panels
-- =============================================================================

ALTER TABLE public.diy_wizard_hardware_recommendations
    ADD COLUMN IF NOT EXISTS product_types text;

COMMENT ON COLUMN public.diy_wizard_hardware_recommendations.product_types IS
    'Comma-separated product types this rule applies to. NULL = all types. Values: mosquito_curtains, clear_vinyl, raw_netting, raw_netting_panels';

-- Set existing rules to mosquito_curtains + clear_vinyl
UPDATE public.diy_wizard_hardware_recommendations
SET product_types = 'mosquito_curtains,clear_vinyl'
WHERE item_key IN ('track_straight', 'track_splice', 'track_endcap',
                   'marine_snap_white', 'marine_snap_black',
                   'block_magnet', 'fiberglass_rod',
                   'stucco_strip', 'snap_tool');
