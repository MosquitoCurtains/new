-- =============================================================================
-- Notification System Tables
-- =============================================================================
-- Stores notification settings (configurable recipients per type)
-- and a log of all sent notifications for audit trail.

-- =============================================================================
-- notification_settings - Configurable recipients per notification type
-- =============================================================================

CREATE TABLE IF NOT EXISTS notification_settings (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  recipient_emails TEXT[] NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_notification_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notification_settings_updated_at ON notification_settings;
CREATE TRIGGER notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_timestamp();

-- =============================================================================
-- Seed default notification settings
-- =============================================================================

INSERT INTO notification_settings (id, label, description, recipient_emails) VALUES
  ('order_confirmation', 'Order Confirmation', 'Sent to customers after successful payment', '{}'),
  ('new_order_alert', 'New Order Alert', 'Sent to staff when a new order is placed', '{help@mosquitocurtains.com}'),
  ('order_refund', 'Order Refund', 'Sent to customers when a refund is processed', '{}'),
  ('snap_tool_refund', 'Snap Tool Refund', 'Manually sent to customers when snap tool is returned and refunded', '{}'),
  ('new_lead', 'New Lead', 'Sent to staff when a lead or contact form is submitted', '{sales@mosquitocurtains.com}')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- notification_log - Audit trail of all sent notifications
-- =============================================================================

CREATE TABLE IF NOT EXISTS notification_log (
  id SERIAL PRIMARY KEY,
  notification_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  reference_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_log_type ON notification_log(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_log_sent_at ON notification_log(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_log_reference ON notification_log(reference_id);

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE notification_settings IS 'Configurable notification recipients and enable/disable per type';
COMMENT ON TABLE notification_log IS 'Audit trail of all email notifications sent';
COMMENT ON COLUMN notification_settings.recipient_emails IS 'Array of email addresses. Empty array means customer-only (uses order/lead email).';
