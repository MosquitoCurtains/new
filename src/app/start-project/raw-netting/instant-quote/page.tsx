'use client'

/**
 * Raw Netting - Contact for Quote
 *
 * Raw materials don't have instant pricing. Collect project details
 * and contact info for a custom quote.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Spinner,
} from '@/lib/design-system'

export default function RawNettingContactQuotePage() {
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [notes, setNotes] = useState('')
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = !!(contact.firstName && contact.lastName && contact.email && contact.phone)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const payload = {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        product: 'raw_materials',
        projectType: 'quote',
        notes: JSON.stringify({ projectNote: notes }),
        session_id: sessionId,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-8 text-center" style={{ borderColor: '#B3015820' }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#B3015810' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#B30158' }} />
              </div>
              <Heading level={2} className="!mb-2">Request Submitted!</Heading>
              <Text className="text-gray-600 mb-6">Thank you, {contact.firstName}! We&apos;ll contact you within 1 business day with a custom quote for your raw materials.</Text>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" asChild><Link href="/">Return Home</Link></Button>
                <Button variant="outline" asChild><a href="tel:7706454745">Call (770) 645-4745</a></Button>
              </div>
            </div>
          </section>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#B3015810' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-5 md:p-6 lg:p-8" style={{ borderColor: '#B3015820' }}>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/start-project/raw-netting">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>

            <div className="text-center mb-6">
              <Heading level={2} className="!text-xl md:!text-2xl !mb-1">Contact for Quote</Heading>
              <Text size="sm" className="text-gray-600 !mb-0">Share your project details and we&apos;ll send a custom quote within 24-48 hours.</Text>
            </div>

            <Card variant="elevated" className="!p-6 max-w-xl mx-auto">
              <Stack gap="md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <Input value={contact.firstName} onChange={(e) => setContact(prev => ({ ...prev, firstName: e.target.value }))} placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <Input value={contact.lastName} onChange={(e) => setContact(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input type="email" value={contact.email} onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <Input type="tel" value={contact.phone} onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))} placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project details (mesh type, quantity, dimensions)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your project. What mesh type do you need? How much fabric? Any specific dimensions?"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors resize-none"
                  />
                </div>
                <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? <><Spinner size="sm" className="mr-2" />Submitting...</> : <>Request Quote</>}
                </Button>
              </Stack>
            </Card>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
