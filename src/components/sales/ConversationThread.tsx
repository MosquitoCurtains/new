'use client'

/**
 * ConversationThread Component
 *
 * Unified email + SMS timeline for a lead.
 * Adapted from VibrationFit's ConversationThread.
 * Uses MC design patterns (gray/white/green).
 */

import { useState } from 'react'
import { Mail, MessageSquare, Clock, Send, Loader2 } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Message {
  type: 'email' | 'sms'
  id: string
  content: string
  htmlContent?: string
  subject?: string
  direction: 'inbound' | 'outbound'
  timestamp: string
  metadata?: {
    from?: string
    to?: string
    status?: string
  }
}

interface ConversationThreadProps {
  messages: Message[]
  loading?: boolean
  leadId?: string
  leadEmail?: string
  leadPhone?: string
  onMessageSent?: () => void
}

// ─── Thread grouping ────────────────────────────────────────────────────────

interface Thread {
  id: string
  subject?: string
  startTime: string
  messages: Message[]
}

function groupMessagesIntoThreads(messages: Message[]): Thread[] {
  const threads: Thread[] = []
  let current: Thread | null = null
  const GAP_HOURS = 6

  messages.forEach((msg, i) => {
    const time = new Date(msg.timestamp)
    const shouldStart =
      !current ||
      (msg.type === 'email' && msg.subject && current.subject !== msg.subject) ||
      (i > 0 &&
        Math.abs(time.getTime() - new Date(messages[i - 1].timestamp).getTime()) >
          GAP_HOURS * 3600000)

    if (shouldStart) {
      current = { id: msg.id, subject: msg.subject, startTime: msg.timestamp, messages: [] }
      threads.push(current)
    }
    current!.messages.push(msg)
  })
  return threads
}

function getThreadLabel(thread: Thread): string {
  const d = new Date(thread.startTime)
  const now = new Date()
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (days === 0) return 'Earlier Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} Days Ago`
  if (days < 30) return `${Math.floor(days / 7)} Weeks Ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  const now = new Date()
  const ms = now.getTime() - d.getTime()
  const mins = Math.floor(ms / 60000)
  const hrs = Math.floor(ms / 3600000)
  const days = Math.floor(ms / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ConversationThread({
  messages,
  loading,
  leadId,
  leadEmail,
  leadPhone,
  onMessageSent,
}: ConversationThreadProps) {
  const [channel, setChannel] = useState<'email' | 'sms'>('email')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!composeBody.trim() || !leadId) return
    setSending(true)

    try {
      if (channel === 'email') {
        await fetch(`/api/admin/leads/${leadId}/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: composeSubject || 'Message from Mosquito Curtains',
            html: `<p>${composeBody.replace(/\n/g, '<br />')}</p>`,
          }),
        })
      } else {
        await fetch(`/api/admin/leads/${leadId}/sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: composeBody }),
        })
      }
      setComposeBody('')
      setComposeSubject('')
      onMessageSent?.()
    } catch (e) {
      console.error('Failed to send message:', e)
    }
    setSending(false)
  }

  // ─── Loading ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20" />
        ))}
      </div>
    )
  }

  // ─── Empty ──────────────────────────────────────────────────────────

  if (messages.length === 0 && !leadId) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">No Messages Yet</p>
        <p className="text-xs text-gray-400 mt-1">Select a lead to view conversation</p>
      </div>
    )
  }

  const threads = groupMessagesIntoThreads(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Message timeline */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No messages yet. Start the conversation below.</p>
          </div>
        )}

        {threads.map((thread, ti) => (
          <div key={thread.id} className="space-y-3">
            {ti > 0 && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400 font-medium">{getThreadLabel(thread)}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}
            {thread.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        ))}
      </div>

      {/* Compose bar */}
      {leadId && (
        <div className="border-t border-gray-200 pt-3 space-y-2">
          {/* Channel toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-md p-0.5">
            <button
              onClick={() => setChannel('email')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded transition-colors ${
                channel === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              <Mail className="w-3 h-3" /> Email
            </button>
            <button
              onClick={() => setChannel('sms')}
              disabled={!leadPhone}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-30 ${
                channel === 'sms' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              <MessageSquare className="w-3 h-3" /> SMS
            </button>
          </div>

          {/* Subject (email only) */}
          {channel === 'email' && (
            <input
              type="text"
              placeholder="Subject..."
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            />
          )}

          {/* Message input */}
          <div className="flex gap-2">
            <textarea
              placeholder={channel === 'email' ? 'Write email...' : 'Write SMS...'}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              rows={2}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!composeBody.trim() || sending}
              className="self-end px-3 py-2 bg-[#406517] text-white rounded-lg hover:bg-[#4e7a1d] disabled:opacity-40 transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400">Cmd+Enter to send</p>
        </div>
      )}
    </div>
  )
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isOut = message.direction === 'outbound'

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl p-3 ${
          isOut
            ? 'bg-[#406517]/10 border border-[#406517]/20'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {message.type === 'email' ? (
            <Mail className="w-3 h-3 text-gray-400" />
          ) : (
            <MessageSquare className="w-3 h-3 text-gray-400" />
          )}
          <span className="text-[10px] font-medium text-gray-400 uppercase">
            {message.type}
          </span>
          <span className={`text-[10px] px-1 py-0.5 rounded ${
            isOut ? 'bg-[#406517]/10 text-[#406517]' : 'bg-blue-50 text-blue-600'
          }`}>
            {isOut ? 'Sent' : 'Received'}
          </span>
        </div>

        {/* Email subject */}
        {message.type === 'email' && message.subject && (
          <p className="text-xs font-semibold text-gray-800 mb-1">{message.subject}</p>
        )}

        {/* Body */}
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>

        {/* Footer */}
        {message.metadata?.from && (
          <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5">
            From: {message.metadata.from}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
          <Clock className="w-2.5 h-2.5" />
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
