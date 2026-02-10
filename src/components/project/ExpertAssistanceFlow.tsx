'use client'

/**
 * Expert Assistance Flow
 *
 * Photos -> Contact -> Review -> Submit for project planning.
 * Used by /start-project/[product]/expert-assistance.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, User, Camera, CheckCircle, Mail, Phone } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Spinner,
} from '@/lib/design-system'
import { PhotoUploader, UploadedPhoto } from '@/components/project'
import type { QuickSetupOptions } from './QuickSetup'
import { cn } from '@/lib/utils'

export type ProductTypeSlug = 'mosquito-curtains' | 'clear-vinyl' | 'raw-netting'

const PRODUCT_LABELS: Record<ProductTypeSlug, string> = {
  'mosquito-curtains': 'Mosquito Curtains',
  'clear-vinyl': 'Clear Vinyl Panels',
  'raw-netting': 'Raw Mesh Fabric',
}

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  projectNote: string
}

interface ExpertAssistanceFlowProps {
  productType: ProductTypeSlug
  options: QuickSetupOptions
}

export function ExpertAssistanceFlow({ productType, options }: ExpertAssistanceFlowProps) {
  const [contact, setContact] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectNote: '',
  })
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const brandColor = productType === 'mosquito-curtains' ? '#406517' : productType === 'clear-vinyl' ? '#003365' : '#B30158'
  const productLabel = PRODUCT_LABELS[productType]
  const apiProduct = productType === 'mosquito-curtains' ? 'mosquito_curtains' : productType === 'clear-vinyl' ? 'clear_vinyl' : 'raw_materials'

  const canProceedContact = !!(contact.firstName && contact.lastName && contact.email && contact.phone)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const completedPhotos = photos.filter(p => p.status === 'complete')
      const payload = {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        product: apiProduct,
        projectType: 'planner',
        meshType: 'meshType' in options ? options.meshType : null,
        panelHeight: 'panelSize' in options ? options.panelSize : null,
        topAttachment: 'topAttachment' in options ? options.topAttachment : null,
        notes: JSON.stringify({
          options,
          projectNote: contact.projectNote,
        }),
        photo_urls: completedPhotos.map(p => ({
          url: p.publicUrl,
          key: p.key,
          fileName: p.fileName,
        })),
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
      alert('Failed to submit project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-8 text-center" style={{ borderColor: `${brandColor}20` }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${brandColor}10` }}>
                <CheckCircle className="w-10 h-10" style={{ color: brandColor }} />
              </div>
              <Heading level={2} className="!mb-2">Project Submitted!</Heading>
              <Text className="text-gray-600 mb-6">Thank you, {contact.firstName}! We&apos;ll contact you within 1 business day.</Text>
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

  const steps = [
    { id: 1, label: 'Contact & Details', icon: User },
    { id: 2, label: 'Photos', icon: Camera },
    { id: 3, label: 'Review', icon: CheckCircle },
  ]

  return (
    <Container size="xl">
      <Stack gap="lg">
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${brandColor}10` }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-5 md:p-6 lg:p-8" style={{ borderColor: `${brandColor}20` }}>
            {/* Progress */}
            <div className="flex justify-center gap-2 mb-4">
              {steps.map((s, idx) => {
                const Icon = s.icon
                return (
                  <div key={s.id} className="flex items-center">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                      step === s.id ? 'text-white' : step > s.id ? 'text-gray-700' : 'bg-gray-100 text-gray-400'
                    )} style={step >= s.id ? { backgroundColor: brandColor } : undefined}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={cn('w-8 h-0.5 mx-1', step > s.id ? 'opacity-100' : 'bg-gray-200')} style={step > s.id ? { backgroundColor: brandColor } : undefined} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {step === 1 && (
                <Stack gap="md">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                      <User className="w-6 h-6" style={{ color: brandColor }} />
                    </div>
                    <Heading level={2} className="!text-xl md:!text-2xl">Contact & Quick Details</Heading>
                    <Text size="sm" className="text-gray-600 !mb-0">We&apos;ll save your info. Next, you&apos;ll upload photos and videos.</Text>
                  </div>
                  <Card variant="elevated" className="!p-6 max-w-xl mx-auto w-full">
                    <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
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
                    </Grid>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quick project details (optional)</label>
                      <textarea
                        value={contact.projectNote}
                        onChange={(e) => setContact(prev => ({ ...prev, projectNote: e.target.value }))}
                        placeholder="Describe your space, what you're looking for, or any questions..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors resize-none"
                      />
                    </div>
                  </Card>
                </Stack>
              )}

              {step === 2 && (
                <Stack gap="md">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                      <Camera className="w-6 h-6" style={{ color: brandColor }} />
                    </div>
                    <Heading level={2} className="!text-xl md:!text-2xl">Photos & Videos</Heading>
                    <Text size="sm" className="text-gray-600 !mb-0">Upload photos and videos of your space. These help us understand your project.</Text>
                  </div>
                  <PhotoUploader sessionId={sessionId} maxFiles={10} onUploadComplete={setPhotos} />
                  <Card variant="outlined" className="!p-4 !bg-[#003365]/5 !border-[#003365]/20 max-w-2xl mx-auto">
                    <Text size="sm" className="text-[#003365]">
                      <strong>Tip:</strong> Step BACK and zoom OUT. We need to see full sides with all fastening surfaces visible.
                    </Text>
                  </Card>
                </Stack>
              )}

              {step === 3 && (
                <Stack gap="md">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                      <CheckCircle className="w-6 h-6" style={{ color: brandColor }} />
                    </div>
                    <Heading level={2} className="!text-xl md:!text-2xl">Review Your Project</Heading>
                    <Text size="sm" className="text-gray-600 !mb-0">Confirm your details before submitting.</Text>
                  </div>
                  <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="max-w-3xl mx-auto">
                    <Card variant="elevated" className="!p-6">
                      <Heading level={4} className="!mb-4">Contact Information</Heading>
                      <Stack gap="sm">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{contact.firstName} {contact.lastName}</Text></div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{contact.email}</Text></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{contact.phone}</Text></div>
                      </Stack>
                    </Card>
                    <Card variant="elevated" className="!p-6">
                      <Heading level={4} className="!mb-4">Project Details</Heading>
                      <Stack gap="sm">
                        <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Product</Text><Text className="font-medium text-gray-900 !mb-0">{productLabel}</Text></div>
                        {'meshType' in options && (
                          <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Mesh</Text><Text className="font-medium text-gray-900 !mb-0 capitalize">{String(options.meshType).replace(/_/g, ' ')}</Text></div>
                        )}
                        <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Photos</Text><Text className="font-medium text-gray-900 !mb-0">{photos.length} uploaded</Text></div>
                        {contact.projectNote && (
                          <div className="pt-2 border-t border-gray-100">
                            <Text className="text-gray-500 !mb-1">Notes</Text>
                            <Text size="sm" className="text-gray-700 !mb-0">{contact.projectNote}</Text>
                          </div>
                        )}
                      </Stack>
                    </Card>
                  </Grid>
                  <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-[#406517]/5 !via-white !to-[#003365]/5 !border-[#406517]/20 max-w-xl mx-auto">
                    <div className="text-center">
                      <Text className="text-gray-600">A project planner will review your submission and contact you within 1 business day with a detailed quote.</Text>
                    </div>
                  </Card>
                </Stack>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
              {step === 1 ? (
                <Button variant="ghost" asChild>
                  <Link href={`/start-project/${productType}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {step === 3 ? (
                <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <><Spinner size="sm" className="mr-2" />Submitting...</> : <>Submit Project<CheckCircle className="ml-2 w-5 h-5" /></>}
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setStep(step + 1)} disabled={step === 1 && !canProceedContact}>
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
