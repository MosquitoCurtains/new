-- Sales Cart & Lead Pipeline Migration
-- Adds cart_data + lead_id to projects, updates lead pipeline statuses
-- Run AFTER: 20260206000005_complete_pricing_data.sql

-- ============================================================================
-- 1. Add cart_data JSONB column to projects
-- Stores CartLineItem[] shape matching localStorage format
-- ============================================================================
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS cart_data JSONB DEFAULT '[]'::jsonb;

-- ============================================================================
-- 2. Link projects to leads (sales flow starts with leads, not customers)
-- ============================================================================
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_lead ON projects(lead_id);

-- ============================================================================
-- 3. Add pipeline_status to leads for sales workflow
-- Real pipeline stages from Zoho Desk, ordered to match actual sales flow
-- ============================================================================

-- Add phone column to leads if not present (needed for SMS)
-- (Already exists from initial_schema, but just in case)

-- Migrate existing lead statuses to new pipeline
-- Old: new, contacted, qualified, converted, closed
-- New: open, pending, need_photos, invitation_to_plan,
--   need_measurements, working_on_quote, quote_sent, need_decision,
--   order_placed, order_on_hold, difficult, closed
UPDATE leads SET status = 'open' WHERE status = 'new';
UPDATE leads SET status = 'pending' WHERE status = 'contacted';
UPDATE leads SET status = 'working_on_quote' WHERE status = 'qualified';
UPDATE leads SET status = 'order_placed' WHERE status = 'converted';
-- 'closed' stays as 'closed'

-- Drop old CHECK constraint if it exists
DO $$
BEGIN
  -- Try to drop old constraint (name varies, so we search for it)
  EXECUTE (
    SELECT 'ALTER TABLE leads DROP CONSTRAINT ' || conname
    FROM pg_constraint
    WHERE conrelid = 'leads'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%status%'
    LIMIT 1
  );
EXCEPTION WHEN OTHERS THEN
  -- No constraint found, that's fine
  NULL;
END $$;

-- Add new CHECK constraint with pipeline statuses
ALTER TABLE leads
  ADD CONSTRAINT leads_status_check CHECK (
    status IN (
      'open',
      'pending',
      'need_photos',
      'invitation_to_plan',
      'need_measurements',
      'working_on_quote',
      'quote_sent',
      'need_decision',
      'order_placed',
      'order_on_hold',
      'difficult',
      'closed'
    )
  );

-- Set default for new leads to 'open'
ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'open';

-- ============================================================================
-- 4. Add pipeline_order column for UI sorting (optional but useful)
-- ============================================================================
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS pipeline_order INTEGER DEFAULT 0;

-- Set pipeline order based on status
UPDATE leads SET pipeline_order = CASE status
  WHEN 'open' THEN 1
  WHEN 'pending' THEN 2
  WHEN 'need_photos' THEN 3
  WHEN 'invitation_to_plan' THEN 4
  WHEN 'need_measurements' THEN 5
  WHEN 'working_on_quote' THEN 6
  WHEN 'quote_sent' THEN 7
  WHEN 'need_decision' THEN 8
  WHEN 'order_placed' THEN 9
  WHEN 'order_on_hold' THEN 10
  WHEN 'difficult' THEN 11
  WHEN 'closed' THEN 12
  ELSE 0
END;

CREATE INDEX IF NOT EXISTS idx_leads_pipeline ON leads(pipeline_order, status);
