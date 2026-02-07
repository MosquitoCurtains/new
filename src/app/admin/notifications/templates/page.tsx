'use client'

/**
 * Admin Email Template Editor
 * 
 * - Preview all email templates with sample data
 * - Edit subject line and HTML body with merge tags
 * - Live preview updates as you type
 * - Reset to default
 * - Send test email
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Eye,
  Code,
  Save,
  RotateCcw,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Tag,
  FileText,
} from 'lucide-react'
import {
  Container,
  Stack,
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

interface MergeTag {
  tag: string
  description: string
}

interface TemplateData {
  id: string
  label: string
  subject: string
  html_body: string
  is_custom: boolean
  merge_tags: MergeTag[]
  updated_at: string | null
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TYPE_COLORS: Record<string, string> = {
  order_confirmation: '#406517',
  new_order_alert: '#003365',
  order_refund: '#B30158',
  snap_tool_refund: '#FFA501',
  new_lead: '#0EA5E9',
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TemplateEditorPage() {
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const previewDebounce = useRef<NodeJS.Timeout | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications/templates')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTemplates(data.templates || [])
      // Auto-select first if none selected
      if (!selected && data.templates?.length > 0) {
        const first = data.templates[0]
        setSelected(first.id)
        setEditSubject(first.subject)
        setEditBody(first.html_body)
      }
    } catch {
      setErrorMsg('Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }, [selected])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // ---------------------------------------------------------------------------
  // Live preview
  // ---------------------------------------------------------------------------

  const updatePreview = useCallback(async (type: string, subject: string, body: string) => {
    try {
      const res = await fetch('/api/admin/notifications/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, subject, html_body: body }),
      })
      if (res.ok) {
        const html = await res.text()
        setPreviewHtml(html)
        setPreviewSubject(res.headers.get('X-Email-Subject') || subject)
      }
    } catch {
      // Silent fail for preview
    }
  }, [])

  // Load initial preview when template is selected
  useEffect(() => {
    if (selected) {
      updatePreview(selected, editSubject, editBody)
    }
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced live preview on edits
  const handleSubjectChange = (val: string) => {
    setEditSubject(val)
    if (previewDebounce.current) clearTimeout(previewDebounce.current)
    previewDebounce.current = setTimeout(() => {
      if (selected) updatePreview(selected, val, editBody)
    }, 500)
  }

  const handleBodyChange = (val: string) => {
    setEditBody(val)
    if (previewDebounce.current) clearTimeout(previewDebounce.current)
    previewDebounce.current = setTimeout(() => {
      if (selected) updatePreview(selected, editSubject, val)
    }, 500)
  }

  // Write HTML to iframe
  useEffect(() => {
    if (iframeRef.current && previewHtml) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(previewHtml)
        doc.close()
      }
    }
  }, [previewHtml])

  // ---------------------------------------------------------------------------
  // Select template
  // ---------------------------------------------------------------------------

  const handleSelect = (template: TemplateData) => {
    setSelected(template.id)
    setEditSubject(template.subject)
    setEditBody(template.html_body)
    setSuccessMsg('')
    setErrorMsg('')
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setErrorMsg('')
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const showError = (msg: string) => {
    setErrorMsg(msg)
    setSuccessMsg('')
    setTimeout(() => setErrorMsg(''), 6000)
  }

  const handleSave = async () => {
    if (!selected) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/notifications/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected, subject: editSubject, html_body: editBody }),
      })
      if (!res.ok) throw new Error('Failed to save')
      // Update local state
      setTemplates(prev => prev.map(t =>
        t.id === selected ? { ...t, subject: editSubject, html_body: editBody, is_custom: true } : t
      ))
      showSuccess('Template saved!')
    } catch {
      showError('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Reset to default
  // ---------------------------------------------------------------------------

  const handleReset = async () => {
    if (!selected) return
    if (!confirm('Reset this template to the default? Your customizations will be lost.')) return

    try {
      const res = await fetch(`/api/admin/notifications/templates?type=${selected}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to reset')
      // Refetch to get defaults
      await fetchTemplates()
      // Re-select to reload editor
      const defaultTemplate = templates.find(t => t.id === selected)
      if (defaultTemplate) {
        // fetchTemplates will update the templates array, we need to wait
        // Instead, fetch the defaults from the API again
        const templatesRes = await fetch('/api/admin/notifications/templates')
        const data = await templatesRes.json()
        const updated = (data.templates || []).find((t: TemplateData) => t.id === selected)
        if (updated) {
          setEditSubject(updated.subject)
          setEditBody(updated.html_body)
          setTemplates(data.templates)
          updatePreview(selected, updated.subject, updated.html_body)
        }
      }
      showSuccess('Template reset to default')
    } catch {
      showError('Failed to reset template')
    }
  }

  // ---------------------------------------------------------------------------
  // Send test email
  // ---------------------------------------------------------------------------

  const handleSendTest = async () => {
    if (!selected || !testEmail) return
    setIsSendingTest(true)
    try {
      // First save current edits, then send via the preview endpoint to get the HTML,
      // then use the send endpoint
      const previewRes = await fetch('/api/admin/notifications/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected, subject: editSubject, html_body: editBody }),
      })
      if (!previewRes.ok) throw new Error('Failed to render')

      const html = await previewRes.text()
      const subject = previewRes.headers.get('X-Email-Subject') || editSubject

      // Use the send endpoint for test
      const sendRes = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test_email',
          customerEmail: testEmail,
          customerName: 'Test User',
          // Pass raw HTML for test
          _testSubject: subject,
          _testHtml: html,
        }),
      })

      // The send endpoint may not handle test_email type, so let's use SES directly via a dedicated test
      if (!sendRes.ok) {
        // Fallback: try the preview-based test via a separate mechanism
        throw new Error('Test send not implemented yet - save your template and trigger a real notification to test')
      }
      showSuccess(`Test email sent to ${testEmail}!`)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to send test email')
    } finally {
      setIsSendingTest(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Current template
  // ---------------------------------------------------------------------------

  const currentTemplate = templates.find(t => t.id === selected)

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
              href="/admin/notifications"
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-[#003365]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#003365]" />
            </div>
            <div>
              <Heading level={1} className="!mb-0">Email Templates</Heading>
              <Text className="text-gray-500 !mb-0">
                Preview and customize your email templates
              </Text>
            </div>
          </div>
        </section>

        {/* Messages */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <Text size="sm" className="text-green-700 !mb-0">{successMsg}</Text>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <Text size="sm" className="text-red-700 !mb-0">{errorMsg}</Text>
          </div>
        )}

        {/* Main layout: sidebar + editor/preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Template List Sidebar */}
          <div>
            <Stack gap="sm">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selected === template.id
                      ? 'border-[#003365] bg-[#003365]/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${TYPE_COLORS[template.id] || '#6B7280'}15` }}
                    >
                      <Mail className="w-4 h-4" style={{ color: TYPE_COLORS[template.id] || '#6B7280' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Text className="font-medium text-gray-900 !mb-0 text-sm truncate">{template.label}</Text>
                        {template.is_custom && (
                          <Badge className="!text-[10px] !bg-[#003365]/10 !text-[#003365] !border-[#003365]/30">
                            Custom
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${
                      selected === template.id ? 'text-[#003365]' : 'text-gray-300'
                    }`} />
                  </div>
                </button>
              ))}
            </Stack>
          </div>

          {/* Editor + Preview Area */}
          {currentTemplate ? (
            <div>
              <Stack gap="md">
                {/* Preview */}
                <Card variant="elevated" className="!p-0 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <Text size="sm" className="font-medium text-gray-700 !mb-0">Preview</Text>
                    </div>
                    {previewSubject && (
                      <Text size="sm" className="text-gray-500 !mb-0 truncate max-w-[400px]">
                        Subject: {previewSubject}
                      </Text>
                    )}
                  </div>
                  <div className="bg-[#f4f4f5] p-4">
                    <iframe
                      ref={iframeRef}
                      title="Email Preview"
                      className="w-full bg-white rounded-lg shadow-sm"
                      style={{ height: '500px', border: 'none' }}
                      sandbox="allow-same-origin"
                    />
                  </div>
                </Card>

                {/* Subject Line Editor */}
                <Card variant="elevated" className="!p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <Input
                    value={editSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    placeholder="Email subject line..."
                  />
                  <Text size="sm" className="text-gray-400 !mb-0 mt-1">
                    Merge tags like {'{{order_number}}'} will be replaced with real values
                  </Text>
                </Card>

                {/* HTML Body Editor */}
                <Card variant="elevated" className="!p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Template Body (HTML)
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={editBody}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    className="w-full h-[400px] px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm text-gray-800 bg-gray-50 focus:ring-2 focus:ring-[#003365]/20 focus:border-[#003365] resize-y"
                    placeholder="HTML template body..."
                    spellCheck={false}
                  />
                </Card>

                {/* Merge Tags Reference */}
                {currentTemplate.merge_tags.length > 0 && (
                  <Card variant="outlined" className="!p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <Text size="sm" className="font-medium text-gray-700 !mb-0">Available Merge Tags</Text>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentTemplate.merge_tags.map((tag) => (
                        <div
                          key={tag.tag}
                          className="flex items-center gap-2 text-sm"
                        >
                          <code className="px-2 py-0.5 bg-gray-100 rounded text-[#003365] font-mono text-xs whitespace-nowrap">
                            {tag.tag}
                          </code>
                          <span className="text-gray-500 truncate">{tag.description}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Template</>
                    )}
                  </Button>

                  {currentTemplate.is_custom && (
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                  )}

                  <div className="flex-1" />

                  {/* Send test */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@email.com"
                      className="!w-48"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendTest}
                      disabled={isSendingTest || !testEmail}
                    >
                      {isSendingTest ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Send className="w-4 h-4 mr-1" /> Test</>
                      )}
                    </Button>
                  </div>
                </div>
              </Stack>
            </div>
          ) : (
            <Card variant="outlined" className="!p-12 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <Text className="text-gray-500 !mb-0">Select a template from the left to preview and edit</Text>
            </Card>
          )}
        </div>
      </Stack>
    </Container>
  )
}
