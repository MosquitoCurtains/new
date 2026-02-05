-- Add fbclid column to legacy_leads for Facebook attribution
-- Migration: 20260205000002_add_fbclid.sql

-- Add fbclid column
ALTER TABLE public.legacy_leads
ADD COLUMN IF NOT EXISTS fbclid TEXT;

-- Add index for fbclid queries
CREATE INDEX IF NOT EXISTS idx_legacy_leads_fbclid 
ON public.legacy_leads(fbclid) 
WHERE fbclid IS NOT NULL;

-- Add lead_source column to track where leads came from
ALTER TABLE public.legacy_leads
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'organic';

-- Add check constraint for lead_source
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'legacy_leads_source_check'
  ) THEN
    ALTER TABLE public.legacy_leads
    ADD CONSTRAINT legacy_leads_source_check
    CHECK (lead_source IN ('organic', 'google_ads', 'facebook_ads', 'referral', 'direct', 'unknown'));
  END IF;
END $$;

-- Update lead_source based on existing data
UPDATE public.legacy_leads
SET lead_source = CASE
  WHEN gclid IS NOT NULL AND gclid != '' THEN 'google_ads'
  WHEN fbclid IS NOT NULL AND fbclid != '' THEN 'facebook_ads'
  WHEN source_url LIKE '%fbclid=%' THEN 'facebook_ads'
  WHEN source_url LIKE '%gclid=%' THEN 'google_ads'
  ELSE 'organic'
END
WHERE lead_source IS NULL OR lead_source = 'organic';

COMMENT ON COLUMN public.legacy_leads.fbclid IS 'Facebook Click ID for ad attribution';
COMMENT ON COLUMN public.legacy_leads.lead_source IS 'Traffic source: organic, google_ads, facebook_ads, referral, direct';
