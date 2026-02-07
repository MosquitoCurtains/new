-- =============================================================================
-- Email Templates Table
-- =============================================================================
-- Stores custom email template overrides (subject + HTML body).
-- When a row exists for a template type, it is used instead of the code default.
-- Templates support merge tags like {{customer_name}}, {{order_number}}, etc.

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  merge_tags TEXT[] NOT NULL DEFAULT '{}',
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_email_templates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_templates_updated_at ON email_templates;
CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_timestamp();

COMMENT ON TABLE email_templates IS 'Custom email template overrides with merge tag support';
COMMENT ON COLUMN email_templates.is_custom IS 'True if user has customized this template (false = code default stored for reference)';
COMMENT ON COLUMN email_templates.merge_tags IS 'Array of available merge tags for this template type';
