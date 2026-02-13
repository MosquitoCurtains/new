-- =============================================================================
-- Add admin_only column to instant_quote_pricing
-- =============================================================================
-- Allows admins to hide specific options from the front-end quote form.
-- When admin_only = true, the option won't appear in customer dropdowns.
-- =============================================================================

ALTER TABLE public.instant_quote_pricing
    ADD COLUMN IF NOT EXISTS admin_only boolean DEFAULT false NOT NULL;
