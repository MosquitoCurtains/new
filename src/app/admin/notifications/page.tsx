'use client'

/**
 * Admin Notifications Page
 * 
 * - View/edit notification recipient emails per type
 * - Toggle notifications on/off
 * - Send manual Snap Tool Refund email
 * - View recent notification log
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Bell,
  Mail,
  Save,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  RefreshCw,
  Wrench,
  Clock,
  Trash2,
  FileText,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Badge,
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface NotificationSetting {
  id: string
  label: string
  description: string
  recipient_emails: string[]
  is_enabled: boolean
  updated_at: string
}

interface NotificationLogEntry {
  id: number
  notification_type: string
  recipient: string
  subject: string
  reference_id: string | null
  status: string
  error_message: string | null
  sent_at: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminNotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([])
  const [log, setLog] = useState<NotificationLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [editEmails, setEditEmails] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Snap tool refund form
  const [snapOrderId, setSnapOrderId] = useState('')
  const [snapEmail, setSnapEmail] = useState('')
  const [snapName, setSnapName] = useState('')
  const [isSendingSnap, setIsSendingSnap] = useState(false)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setSettings(data.settings || [])
      setLog(data.log || [])

      // Initialize edit fields with comma-separated emails
      const emails: Record<string, string> = {}
      for (const s of data.settings || []) {
        emails[s.id] = (s.recipient_emails || []).join(', ')
      }
      setEditEmails(emails)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setErrorMessage('Failed to load notification settings')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setErrorMessage('')
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  const showError = (msg: string) => {
    setErrorMessage(msg)
    setSuccessMessage('')
    setTimeout(() => setErrorMessage(''), 6000)
  }

  const handleToggle = async (setting: NotificationSetting) => {
    setSavingId(setting.id)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: setting.id, is_enabled: !setting.is_enabled }),
      })
      if (!res.ok) throw new Error('Failed to toggle')
      setSettings(prev => prev.map(s =>
        s.id === setting.id ? { ...s, is_enabled: !s.is_enabled } : s
      ))
      showSuccess(`${setting.label} ${!setting.is_enabled ? 'enabled' : 'disabled'}`)
    } catch {
      showError('Failed to update setting')
    } finally {
      setSavingId(null)
    }
  }

  const handleSaveEmails = async (setting: NotificationSetting) => {
    setSavingId(setting.id)
    try {
      const raw = editEmails[setting.id] || ''
      const emails = raw
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0)

      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: setting.id, recipient_emails: emails }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSettings(prev => prev.map(s =>
        s.id === setting.id ? { ...s, recipient_emails: emails } : s
      ))
      showSuccess(`Recipients updated for ${setting.label}`)
    } catch {
      showError('Failed to save recipients')
    } finally {
      setSavingId(null)
    }
  }

  const handleSendSnapRefund = async () => {
    if (!snapEmail) {
      showError('Customer email is required')
      return
    }
    setIsSendingSnap(true)
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'snap_tool_refund',
          orderId: snapOrderId || undefined,
          customerEmail: snapEmail,
          customerName: snapName || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      showSuccess('Snap tool refund email sent successfully!')
      setSnapOrderId('')
      setSnapEmail('')
      setSnapName('')
      // Refresh log
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setIsSendingSnap(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const typeLabels: Record<string, string> = {
    order_confirmation: 'Order Confirmation',
    new_order_alert: 'New Order Alert',
    order_refund: 'Order Refund',
    snap_tool_refund: 'Snap Tool Refund',
    new_lead: 'New Lead',
  }

  const typeColors: Record<string, string> = {
    order_confirmation: '#406517',
    new_order_alert: '#003365',
    order_refund: '#B30158',
    snap_tool_refund: '#FFA501',
    new_lead: '#0EA5E9',
  }

  const isCustomerOnly = (id: string) =>
    ['order_confirmation', 'order_refund', 'snap_tool_refund'].includes(id)

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin"
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-[#003365]/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#003365]" />
            </div>
            <div>
              <Heading level={1} className="!mb-0">Notifications</Heading>
              <Text className="text-gray-500 !mb-0">
                Email notification settings and log
              </Text>
            </div>
          </div>
        </section>

        {/* Status Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <Text size="sm" className="text-green-700 !mb-0">{successMessage}</Text>
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <Text size="sm" className="text-red-700 !mb-0">{errorMessage}</Text>
          </div>
        )}

        {/* Template Editor Link */}
        <section>
          <Link href="/admin/notifications/templates">
            <Card variant="elevated" className="!p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#003365]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#003365]" />
                  </div>
                  <div>
                    <Heading level={3} className="!text-base !mb-0 group-hover:text-[#003365] transition-colors">
                      Email Templates
                    </Heading>
                    <Text size="sm" className="text-gray-500 !mb-0">
                      Preview and customize your email template content
                    </Text>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-[#003365] rotate-180 transition-colors" />
              </div>
            </Card>
          </Link>
        </section>

        {/* Notification Settings */}
        <section>
          <Heading level={2} className="!mb-4">Notification Types</Heading>
          <Stack gap="md">
            {settings.map((setting) => (
              <Card key={setting.id} variant="elevated" className="!p-6">
                <div className="flex flex-col gap-4">
                  {/* Title row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${typeColors[setting.id] || '#6B7280'}15` }}
                      >
                        <Mail className="w-5 h-5" style={{ color: typeColors[setting.id] || '#6B7280' }} />
                      </div>
                      <div>
                        <Heading level={3} className="!text-base !mb-0">{setting.label}</Heading>
                        <Text size="sm" className="text-gray-500 !mb-0">{setting.description}</Text>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(setting)}
                      disabled={savingId === setting.id}
                      className="shrink-0"
                    >
                      {setting.is_enabled ? (
                        <ToggleRight className="w-8 h-8 text-[#406517]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Recipients (only for admin-sent types) */}
                  {!isCustomerOnly(setting.id) && (
                    <div className="flex gap-2">
                      <Input
                        value={editEmails[setting.id] || ''}
                        onChange={(e) =>
                          setEditEmails(prev => ({ ...prev, [setting.id]: e.target.value }))
                        }
                        placeholder="email1@example.com, email2@example.com"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveEmails(setting)}
                        disabled={savingId === setting.id}
                      >
                        {savingId === setting.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}

                  {isCustomerOnly(setting.id) && (
                    <Text size="sm" className="text-gray-400 !mb-0 italic">
                      Sent to the customer&apos;s email address from the order
                    </Text>
                  )}
                </div>
              </Card>
            ))}
          </Stack>
        </section>

        {/* Snap Tool Refund - Manual Send */}
        <section>
          <Card variant="elevated" className="!p-6 border-2 !border-[#FFA501]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFA501]/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#FFA501]" />
              </div>
              <div>
                <Heading level={2} className="!text-lg !mb-0">Send Snap Tool Refund Email</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">
                  Manually send the $130 snap tool refund confirmation to a customer
                </Text>
              </div>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md" className="mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID or Number
                </label>
                <Input
                  value={snapOrderId}
                  onChange={(e) => setSnapOrderId(e.target.value)}
                  placeholder="MC26-00001 or UUID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email *
                </label>
                <Input
                  type="email"
                  value={snapEmail}
                  onChange={(e) => setSnapEmail(e.target.value)}
                  placeholder="customer@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <Input
                  value={snapName}
                  onChange={(e) => setSnapName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
            </Grid>

            <Button
              variant="primary"
              onClick={handleSendSnapRefund}
              disabled={isSendingSnap || !snapEmail}
            >
              {isSendingSnap ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Snap Tool Refund Email
                </>
              )}
            </Button>
          </Card>
        </section>

        {/* Notification Log */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Heading level={2} className="!mb-0">Recent Notifications</Heading>
            <Button variant="ghost" size="sm" onClick={() => { setIsLoading(true); fetchData() }}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>

          {log.length === 0 ? (
            <Card variant="outlined" className="!p-8 text-center">
              <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <Text className="text-gray-500 !mb-0">No notifications sent yet</Text>
            </Card>
          ) : (
            <Card variant="elevated" className="!p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Recipient</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Badge
                            className="!text-xs"
                            style={{
                              backgroundColor: `${typeColors[entry.notification_type] || '#6B7280'}15`,
                              color: typeColors[entry.notification_type] || '#6B7280',
                              borderColor: `${typeColors[entry.notification_type] || '#6B7280'}30`,
                            }}
                          >
                            {typeLabels[entry.notification_type] || entry.notification_type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
                          {entry.recipient}
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[240px] truncate">
                          {entry.subject}
                        </td>
                        <td className="px-4 py-3">
                          {entry.status === 'sent' ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3.5 h-3.5" /> Sent
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600" title={entry.error_message || ''}>
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(entry.sent_at).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </section>
      </Stack>
    </Container>
  )
}
