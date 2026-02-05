-- =============================================================================
-- MIGRATION: Legacy Leads from Gravity Forms
-- =============================================================================
-- Stores historical lead data imported from Gravity Forms CSV exports.
-- Keeps raw data separate from new leads captured by the Next.js app.

-- =============================================================================
-- LEGACY LEADS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.legacy_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Gravity Forms metadata
  gravity_form_entry_id INTEGER NOT NULL UNIQUE,
  entry_date TIMESTAMPTZ NOT NULL,
  date_updated TIMESTAMPTZ,
  
  -- Contact Info
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- Interest & Project
  interest TEXT,           -- Curtains, Vinyl, Both
  project_type TEXT,       -- Porch/Patio, Gazebo, Deck, etc.
  message TEXT,            -- Project description / notes
  
  -- Installation
  installation_method TEXT, -- Self install, Handyman/Contractor
  has_photos BOOLEAN DEFAULT false,
  photo_urls TEXT[],        -- Array of uploaded image URLs
  
  -- Returning Customer Info
  worked_with_before BOOLEAN DEFAULT false,
  previous_salesperson TEXT,
  
  -- Attribution
  source_url TEXT,          -- Full URL they came from
  landing_page TEXT,        -- Just the path
  gclid TEXT,               -- Google Click ID
  
  -- Device Info
  user_agent TEXT,
  user_ip TEXT,
  
  -- Raw data for reference
  raw_csv_row JSONB,
  
  -- Link to converted customer (if they ordered)
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  converted_to_order BOOLEAN DEFAULT false,
  first_order_id UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_legacy_leads_email ON public.legacy_leads(email);
CREATE INDEX IF NOT EXISTS idx_legacy_leads_entry_date ON public.legacy_leads(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_legacy_leads_entry_id ON public.legacy_leads(gravity_form_entry_id);
CREATE INDEX IF NOT EXISTS idx_legacy_leads_interest ON public.legacy_leads(interest);
CREATE INDEX IF NOT EXISTS idx_legacy_leads_landing_page ON public.legacy_leads(landing_page);
CREATE INDEX IF NOT EXISTS idx_legacy_leads_salesperson ON public.legacy_leads(previous_salesperson);

-- =============================================================================
-- VIEW: Lead to Order Conversion (matches legacy_leads to legacy_orders)
-- =============================================================================
CREATE OR REPLACE VIEW public.legacy_lead_conversion AS
SELECT 
  ll.id AS lead_id,
  ll.email,
  ll.first_name,
  ll.last_name,
  ll.entry_date AS lead_date,
  ll.interest,
  ll.project_type,
  ll.landing_page,
  ll.previous_salesperson,
  ll.has_photos,
  
  -- First matching order
  MIN(lo.order_date) AS first_order_date,
  
  -- Conversion metrics
  CASE WHEN COUNT(lo.id) > 0 THEN true ELSE false END AS converted,
  EXTRACT(DAY FROM MIN(lo.order_date) - ll.entry_date) AS days_to_conversion,
  
  -- Order totals
  COUNT(lo.id) AS order_count,
  COALESCE(SUM(lo.total), 0) AS total_revenue
  
FROM public.legacy_leads ll
LEFT JOIN public.legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date  -- Only orders after the lead
GROUP BY 
  ll.id, ll.email, ll.first_name, ll.last_name, ll.entry_date,
  ll.interest, ll.project_type, ll.landing_page, ll.previous_salesperson, ll.has_photos;

-- =============================================================================
-- VIEW: Landing Page Lead Performance
-- =============================================================================
CREATE OR REPLACE VIEW public.legacy_lead_by_landing_page AS
SELECT 
  COALESCE(ll.landing_page, '(unknown)') AS landing_page,
  COUNT(*) AS total_leads,
  COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END) AS converted_leads,
  ROUND(
    COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS conversion_rate_pct,
  COALESCE(SUM(lo.total), 0) AS total_revenue,
  ROUND(AVG(lo.total) FILTER (WHERE lo.total > 0), 2) AS avg_order_value,
  COUNT(CASE WHEN ll.has_photos THEN 1 END) AS leads_with_photos
FROM public.legacy_leads ll
LEFT JOIN public.legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date
GROUP BY COALESCE(ll.landing_page, '(unknown)')
ORDER BY total_leads DESC;

-- =============================================================================
-- VIEW: Interest Type Performance
-- =============================================================================
CREATE OR REPLACE VIEW public.legacy_lead_by_interest AS
SELECT 
  COALESCE(ll.interest, '(not specified)') AS interest,
  COUNT(*) AS total_leads,
  COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END) AS converted_leads,
  ROUND(
    COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS conversion_rate_pct,
  COALESCE(SUM(lo.total), 0) AS total_revenue,
  ROUND(AVG(lo.total) FILTER (WHERE lo.total > 0), 2) AS avg_order_value
FROM public.legacy_leads ll
LEFT JOIN public.legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date
GROUP BY COALESCE(ll.interest, '(not specified)')
ORDER BY total_leads DESC;

-- =============================================================================
-- VIEW: Salesperson Lead Attribution
-- =============================================================================
CREATE OR REPLACE VIEW public.legacy_lead_by_salesperson AS
SELECT 
  COALESCE(ll.previous_salesperson, '(no previous contact)') AS salesperson,
  COUNT(*) AS returning_leads,
  COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END) AS converted_leads,
  ROUND(
    COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS conversion_rate_pct,
  COALESCE(SUM(lo.total), 0) AS total_revenue,
  ROUND(AVG(lo.total) FILTER (WHERE lo.total > 0), 2) AS avg_order_value
FROM public.legacy_leads ll
LEFT JOIN public.legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date
WHERE ll.worked_with_before = true
GROUP BY COALESCE(ll.previous_salesperson, '(no previous contact)')
ORDER BY returning_leads DESC;

-- =============================================================================
-- VIEW: Monthly Lead Trends
-- =============================================================================
CREATE OR REPLACE VIEW public.legacy_lead_monthly AS
SELECT 
  DATE_TRUNC('month', ll.entry_date) AS month,
  COUNT(*) AS total_leads,
  COUNT(CASE WHEN ll.interest ILIKE '%vinyl%' THEN 1 END) AS vinyl_leads,
  COUNT(CASE WHEN ll.interest ILIKE '%curtain%' THEN 1 END) AS curtain_leads,
  COUNT(CASE WHEN ll.interest ILIKE '%both%' THEN 1 END) AS both_leads,
  COUNT(CASE WHEN ll.has_photos THEN 1 END) AS leads_with_photos,
  COUNT(CASE WHEN ll.worked_with_before THEN 1 END) AS returning_leads,
  COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END) AS converted_leads,
  ROUND(
    COUNT(CASE WHEN lo.email IS NOT NULL THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS conversion_rate_pct
FROM public.legacy_leads ll
LEFT JOIN public.legacy_orders lo ON LOWER(ll.email) = LOWER(lo.email)
  AND lo.order_date >= ll.entry_date
GROUP BY DATE_TRUNC('month', ll.entry_date)
ORDER BY month DESC;

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE public.legacy_leads IS 'Historical leads imported from Gravity Forms contact forms.';
COMMENT ON VIEW public.legacy_lead_conversion IS 'Individual lead conversion tracking with order matching.';
COMMENT ON VIEW public.legacy_lead_by_landing_page IS 'Lead performance aggregated by landing page.';
COMMENT ON VIEW public.legacy_lead_by_interest IS 'Lead performance aggregated by product interest.';
COMMENT ON VIEW public.legacy_lead_by_salesperson IS 'Returning customer lead performance by previous salesperson.';
COMMENT ON VIEW public.legacy_lead_monthly IS 'Monthly lead volume and conversion trends.';

-- =============================================================================
-- RLS POLICIES
-- =============================================================================
ALTER TABLE public.legacy_leads ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access to legacy_leads"
  ON public.legacy_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read
CREATE POLICY "Authenticated users can read legacy_leads"
  ON public.legacy_leads
  FOR SELECT
  TO authenticated
  USING (true);
