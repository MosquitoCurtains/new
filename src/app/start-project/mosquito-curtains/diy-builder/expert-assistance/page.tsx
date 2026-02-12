'use client'

import { useEffect, useState } from 'react'
import { Users, ArrowLeft, CheckCircle, Phone, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Container, Stack, Card, Button, Text, Heading, Input } from '@/lib/design-system'
import type { MeshType, MeshColor } from '@/lib/pricing/types'
import type { SideState } from '@/components/plan/PanelBuilder'

const LS_KEY = 'mc_panel_builder'
const GREEN = '#406517'

interface StoredState {
  numSides: number
  sides: SideState[]
  meshType: MeshType
  meshColor: MeshColor
}

export default function ExpertAssistancePage() {
  const [data, setData] = useState<StoredState | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) setData(JSON.parse(stored))
    } catch { /* ok */ }
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Save the project with expert-assistance flag
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'expert-request@panel-builder.local',
          product: 'mosquito_curtains',
          projectType: 'expert_assistance',
          numberOfSides: data?.numSides || 0,
          topAttachment: data?.sides?.[0]?.topAttachment || 'tracking',
          notes: `Expert Assistance Request\n${notes ? `Customer notes: ${notes}\n` : ''}Config: ${JSON.stringify(data)}`,
          cart_data: data?.sides || [],
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Failed to submit. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Container size="md">
        <Card className="!p-8 md:!p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: GREEN }} />
          <Heading level={2} className="!mb-2">We&apos;ve Got Your Project!</Heading>
          <Text className="text-gray-600 mb-6">
            Our planning team will review your configuration and reach out within 1 business day
            with a detailed quote and any recommendations.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="tel:+18889109960" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              <Phone className="w-4 h-4" /> (888) 910-9960
            </a>
            <a href="mailto:info@mosquitocurtains.com" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              <Mail className="w-4 h-4" /> info@mosquitocurtains.com
            </a>
          </div>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="md">
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">Expert Assistance</div>
              <div className="text-sm text-gray-500">Our team will review and quote your project</div>
            </div>
          </div>
          <Link href="/start-project/mosquito-curtains/diy-builder" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </Link>
        </div>

        {data && (
          <Card className="!p-5 !bg-gray-50 !border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Your configuration:</span>{' '}
              {data.numSides} side{data.numSides !== 1 ? 's' : ''} &middot;{' '}
              {data.meshType.replace(/_/g, ' ')} mesh in {data.meshColor}
            </div>
          </Card>
        )}

        <Card className="!p-6 !bg-white !border-2 !border-gray-200">
          <Stack gap="md">
            <Heading level={3} className="!mb-0">Anything else we should know?</Heading>
            <Text size="sm" className="text-gray-500 !mb-0">
              Share details about your porch, specific requirements, or questions. Our team will factor this into your quote.
            </Text>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Porch has uneven columns, needs custom fit on one side, interested in shade mesh for west-facing exposure..."
              rows={4}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] resize-none"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <>Send to Planning Team</>
                )}
              </Button>
            </div>
          </Stack>
        </Card>

        <div className="text-center">
          <Text size="sm" className="text-gray-400 !mb-2">Prefer to call?</Text>
          <a href="tel:+18889109960" className="text-lg font-bold hover:underline" style={{ color: GREEN }}>
            (888) 910-9960
          </a>
        </div>
      </Stack>
    </Container>
  )
}
