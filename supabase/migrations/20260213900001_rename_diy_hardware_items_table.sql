-- =============================================================================
-- Rename diy_hardware_items → diy_wizard_hardware_recommendations
-- =============================================================================
-- Clearer name: these are the recommendation rules for the DIY panel builder
-- wizard's "Track & Attachments" step, not a general hardware catalog.
-- =============================================================================

-- 1. Rename the table
ALTER TABLE public.diy_hardware_items
    RENAME TO diy_wizard_hardware_recommendations;

-- 2. Rename indexes
ALTER INDEX idx_diy_hardware_category RENAME TO idx_diy_wizard_hw_rec_category;
ALTER INDEX idx_diy_hardware_active RENAME TO idx_diy_wizard_hw_rec_active;

-- 3. Rename trigger + function
DROP TRIGGER IF EXISTS set_diy_hardware_items_updated_at ON public.diy_wizard_hardware_recommendations;

CREATE OR REPLACE FUNCTION update_diy_wizard_hw_rec_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_diy_wizard_hw_rec_updated_at
    BEFORE UPDATE ON public.diy_wizard_hardware_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_diy_wizard_hw_rec_updated_at();

-- Clean up old function
DROP FUNCTION IF EXISTS update_diy_hardware_items_updated_at();

-- Note: RLS policies auto-follow the table rename — no action needed.
