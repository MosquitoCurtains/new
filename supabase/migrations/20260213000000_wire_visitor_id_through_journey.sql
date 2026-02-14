-- ============================================================================
-- Wire visitor_id Through Entire Journey Chain
-- ============================================================================
-- Ensures every CRM entity (Lead → Project → Cart → Order → Customer)
-- can trace back to the original anonymous visitor and ad click.
--
-- Architecture:
--   Visitor → Session → Lead → Project → Cart → Order → Customer
--     all share visitor_id for full journey traceability
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add visitor_id to leads, projects, carts
-- ---------------------------------------------------------------------------

-- LEADS: add visitor_id (uuid FK to visitors)
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES visitors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_visitor_id ON leads (visitor_id) WHERE visitor_id IS NOT NULL;

-- PROJECTS: add visitor_id (uuid FK to visitors)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES visitors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_visitor_id ON projects (visitor_id) WHERE visitor_id IS NOT NULL;

-- CARTS: add visitor_id (uuid FK to visitors)
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS visitor_id uuid REFERENCES visitors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_carts_visitor_id ON carts (visitor_id) WHERE visitor_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 2. Add lead_id to carts, orders to complete the chain
-- ---------------------------------------------------------------------------

-- CARTS: add lead_id
ALTER TABLE carts
  ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES leads(id) ON DELETE SET NULL;

-- ORDERS: add lead_id
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES leads(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_lead_id ON orders (lead_id) WHERE lead_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. Add lead_id and project_id to journey_events
-- ---------------------------------------------------------------------------

ALTER TABLE journey_events
  ADD COLUMN IF NOT EXISTS lead_id uuid,
  ADD COLUMN IF NOT EXISTS project_id uuid;

-- ---------------------------------------------------------------------------
-- 4. Fix session_id type mismatch (text → uuid) on leads, projects, carts
--    This allows proper FK constraints to the sessions table.
-- ---------------------------------------------------------------------------

-- LEADS: convert session_id from text to uuid
ALTER TABLE leads
  ALTER COLUMN session_id TYPE uuid USING (
    CASE WHEN session_id IS NOT NULL AND session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN session_id::uuid
    ELSE NULL
    END
  );

-- PROJECTS: convert session_id from text to uuid
ALTER TABLE projects
  ALTER COLUMN session_id TYPE uuid USING (
    CASE WHEN session_id IS NOT NULL AND session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN session_id::uuid
    ELSE NULL
    END
  );

-- CARTS: convert session_id from text to uuid
ALTER TABLE carts
  ALTER COLUMN session_id TYPE uuid USING (
    CASE WHEN session_id IS NOT NULL AND session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN session_id::uuid
    ELSE NULL
    END
  );

-- Now add FK constraints to sessions table
ALTER TABLE leads
  ADD CONSTRAINT fk_leads_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

ALTER TABLE projects
  ADD CONSTRAINT fk_projects_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

ALTER TABLE carts
  ADD CONSTRAINT fk_carts_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- 5. Add 'lead_created' to journey_events event_type CHECK constraint
-- ---------------------------------------------------------------------------

-- Drop and recreate the CHECK constraint with the new value
ALTER TABLE journey_events
  DROP CONSTRAINT IF EXISTS journey_events_event_type_check;

ALTER TABLE journey_events
  ADD CONSTRAINT journey_events_event_type_check CHECK (
    event_type = ANY (ARRAY[
      'email_captured',
      'lead_created',
      'quote_started',
      'quote_submitted',
      'photos_uploaded',
      'cart_created',
      'cart_updated',
      'cart_sent',
      'checkout_started',
      'payment_initiated',
      'purchase_completed',
      'project_created',
      'project_updated'
    ])
  );

-- ---------------------------------------------------------------------------
-- 6. Comments for documentation
-- ---------------------------------------------------------------------------

COMMENT ON COLUMN leads.visitor_id IS 'Links lead to anonymous visitor — traces back to original ad click (gclid/fbclid)';
COMMENT ON COLUMN projects.visitor_id IS 'Inherited from lead — traces back to original ad click';
COMMENT ON COLUMN carts.visitor_id IS 'Inherited from project — traces back to original ad click';
COMMENT ON COLUMN carts.lead_id IS 'Inherited from project — links cart to originating lead';
COMMENT ON COLUMN orders.lead_id IS 'Inherited from cart/project — links order to originating lead';
COMMENT ON COLUMN journey_events.lead_id IS 'Optional: links event to a specific lead';
COMMENT ON COLUMN journey_events.project_id IS 'Optional: links event to a specific project';
