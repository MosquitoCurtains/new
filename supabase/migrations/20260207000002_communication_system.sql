-- Communication System Migration
-- Creates email_messages + sms_messages tables for two-way comms
-- Adapted from VibrationFit CRM schema, linked to leads instead of users
-- Run AFTER: 20260207000001_sales_cart_data.sql

-- ============================================================================
-- EMAIL MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Link to lead (MC leads are not auth users)
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  -- Email addresses
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],

  -- Content
  subject TEXT NOT NULL,
  body_text TEXT,
  body_html TEXT,

  -- Direction & Status
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent' CHECK (status IN (
    'sent', 'delivered', 'failed', 'bounced', 'opened', 'received'
  )),

  -- SES tracking
  ses_message_id TEXT,

  -- IMAP deduplication
  imap_message_id TEXT,
  imap_uid INTEGER,

  -- Threading
  is_reply BOOLEAN DEFAULT false,
  reply_to_message_id UUID REFERENCES email_messages(id) ON DELETE SET NULL,
  thread_id TEXT,

  -- Attachments
  has_attachments BOOLEAN DEFAULT false,
  attachment_urls TEXT[],

  -- Timestamps
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_messages_lead ON email_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_direction ON email_messages(direction);
CREATE INDEX IF NOT EXISTS idx_email_messages_created ON email_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_messages_thread ON email_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_from ON email_messages(from_email);
CREATE INDEX IF NOT EXISTS idx_email_messages_to ON email_messages(to_email);
CREATE INDEX IF NOT EXISTS idx_email_messages_status ON email_messages(status);

-- Unique indexes for deduplication (where not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_messages_ses_id_unique
  ON email_messages(ses_message_id) WHERE ses_message_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_messages_imap_id_unique
  ON email_messages(imap_message_id) WHERE imap_message_id IS NOT NULL;

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_email_messages_updated_at ON email_messages;
CREATE TRIGGER update_email_messages_updated_at
  BEFORE UPDATE ON email_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SMS MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Link to lead
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  -- Direction
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),

  -- Phone numbers (E.164 format)
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,

  -- Content
  body TEXT NOT NULL,
  media_urls TEXT[],  -- MMS support

  -- Delivery status
  status TEXT DEFAULT 'queued' CHECK (status IN (
    'queued', 'sent', 'delivered', 'failed', 'received'
  )),
  error_message TEXT,

  -- Twilio tracking
  twilio_sid TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_messages_lead ON sms_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_direction ON sms_messages(direction);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created ON sms_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_messages_from ON sms_messages(from_number);
CREATE INDEX IF NOT EXISTS idx_sms_messages_to ON sms_messages(to_number);

-- Unique index for Twilio SID deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_sms_messages_twilio_sid_unique
  ON sms_messages(twilio_sid) WHERE twilio_sid IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- Staff can read/write all messages
CREATE POLICY "Staff can manage email messages" ON email_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Staff can manage sms messages" ON sms_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE auth_user_id = auth.uid() AND is_active = true)
  );

-- Service role (webhooks) can insert
CREATE POLICY "Service role can insert email messages" ON email_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert sms messages" ON sms_messages
  FOR INSERT WITH CHECK (true);
