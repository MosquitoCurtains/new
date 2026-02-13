'use client'

/**
 * Expert Assistance Flow
 *
 * Single-page layout: Contact info, photos, project notes, and submit.
 * Used by /start-project/[product]/expert-assistance.
 */

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Camera, CheckCircle, Info, Phone as PhoneIcon } from 'lucide-react'
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
  BulletedList,
  ListItem,
  PowerHeaderTemplate,
  ImageLightbox,
} from '@/lib/design-system'
import { PhotoUploader, UploadedPhoto } from '@/components/project'
import type { QuickSetupOptions } from './QuickSetup'

export type ProductTypeSlug = 'mosquito-curtains' | 'clear-vinyl' | 'raw-netting'

const PRODUCT_LABELS: Record<ProductTypeSlug, string> = {
  'mosquito-curtains': 'Mosquito Curtains',
  'clear-vinyl': 'Clear Vinyl Panels',
  'raw-netting': 'Raw Mesh Fabric',
}

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const GOOD_PHOTOS = [
  { url: `${IMG}/2020/04/Good-1-Big-1024x768.jpg`, alt: 'Good project photo - wide shot', caption: 'Good photo' },
  { url: `${IMG}/2020/04/Good-2-Big-1024x768.jpg`, alt: 'Good project photo - full view', caption: 'Good photo' },
] as const

const BAD_PHOTOS = [
  { url: `${IMG}/2020/04/Bad-1-Big-1024x768.jpg`, alt: 'Bad project photo - too close', caption: 'Bad photo' },
  { url: `${IMG}/2020/04/Bad-2-Big-1024x768.jpg`, alt: 'Bad project photo - not enough context', caption: 'Bad photo' },
] as const

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  projectName: string
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
    projectName: '',
    projectNote: '',
  })
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploadPrefix] = useState(() => crypto.randomUUID())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ url: string; alt?: string; caption?: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const brandColor = productType === 'mosquito-curtains' ? '#406517' : productType === 'clear-vinyl' ? '#003365' : '#B30158'
  const apiProduct = productType === 'mosquito-curtains' ? 'mosquito_curtains' : productType === 'clear-vinyl' ? 'clear_vinyl' : 'raw_materials'

  const canSubmit = !!(contact.firstName && contact.lastName && contact.email && contact.phone && contact.projectName)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const completedPhotos = photos.filter(p => p.status === 'complete')
      const payload = {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        projectName: contact.projectName || undefined,
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
        session_id: null,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        console.error('API error response:', response.status, errorBody)
        throw new Error(errorBody?.error || `Server error (${response.status})`)
      }
      setSubmitted(true)
    } catch (error) {
      console.error('Submit error:', error)
      const msg = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to submit project: ${msg}`)
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

  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero - from Contact page, no actions bar */}
        <PowerHeaderTemplate
          title="Expert Assistance"
          subtitle="Get Started Fast With a Real Person! Every porch is different and we need to see project photos to plan these correctly. You can upload from your phone or computer."
          videoId="47DB7mSxd5g"
          videoTitle="Photo Guidelines Video"
          variant="compact"
          actions={[]}
          showCta={false}
        />

        {/* Photo Guidelines */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="outlined" className="!p-6">
              <Heading level={3} className="!mb-3">Photo Guidelines</Heading>
              <BulletedList spacing="sm">
                <ListItem>Please provide 2-4 high resolution photos that show all complete sides of your project.</ListItem>
                <ListItem>Step BACK and zoom OUT so we can see as much as possible. No close-ups.</ListItem>
                <ListItem>Large file sizes -- Small images do not provide enough resolution for planning sessions.</ListItem>
              </BulletedList>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-[#406517] p-4 bg-[#406517]/5">
                <Heading level={4} className="!mb-2">Good Photos</Heading>
                <p className="text-sm text-gray-600 mb-2">We can see each full side with fastening surfaces in each high resolution photo.</p>
                <div className="grid grid-cols-2 gap-2">
                  {GOOD_PHOTOS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setLightboxImages([...GOOD_PHOTOS]); setLightboxIndex(idx); setLightboxOpen(true) }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#406517]/30 hover:border-[#406517] transition-colors cursor-pointer"
                    >
                      <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border-2 border-red-500 p-4 bg-red-50">
                <Heading level={4} className="!mb-2">Bad Photos</Heading>
                <p className="text-sm text-gray-600 mb-2">Too close up so we cannot see ALL fastening surfaces and corner transitions.</p>
                <div className="grid grid-cols-2 gap-2">
                  {BAD_PHOTOS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setLightboxImages([...BAD_PHOTOS]); setLightboxIndex(idx); setLightboxOpen(true) }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-red-300 hover:border-red-500 transition-colors cursor-pointer"
                    >
                      <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
        </section>

        {lightboxOpen && (
          <ImageLightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
            showCopyButton={false}
          />
        )}

        {/* Form Section */}
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${brandColor}10` }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-5 md:p-6 lg:p-8" style={{ borderColor: `${brandColor}20` }}>

            {/* Back button */}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/start-project/${productType}`}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>

            <Stack gap="lg" className="max-w-3xl mx-auto">

              {/* ============================================================
                  SECTION 1: Contact Information
                  ============================================================ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                    <User className="w-4 h-4" style={{ color: brandColor }} />
                  </div>
                  <Heading level={3} className="!text-lg !mb-0">Contact Information</Heading>
                </div>
                <Card variant="elevated" className="!p-5 md:!p-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                    <Input
                      value={contact.projectName}
                      onChange={(e) => setContact(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="e.g. Back Porch, Lake House Patio, Gazebo Screen"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project details (optional)</label>
                    <textarea
                      value={contact.projectNote}
                      onChange={(e) => setContact(prev => ({ ...prev, projectNote: e.target.value }))}
                      placeholder="Describe your space, what you're looking for, or any questions..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors resize-none"
                    />
                  </div>
                </Card>
              </div>

              {/* ============================================================
                  SECTION 2: Photos & Videos
                  ============================================================ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                    <Camera className="w-4 h-4" style={{ color: brandColor }} />
                  </div>
                  <Heading level={3} className="!text-lg !mb-0">Photos & Videos</Heading>
                </div>
                <Card variant="elevated" className="!p-5 md:!p-6">
                  <Text size="sm" className="text-gray-600 !mb-4">
                    Upload photos and videos of your space. These help us understand your project and provide an accurate quote.
                  </Text>
                  <PhotoUploader sessionId={uploadPrefix} maxFiles={10} onUploadComplete={setPhotos} />
                </Card>
                <Card variant="outlined" className="!p-3 !bg-[#003365]/5 !border-[#003365]/20 mt-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#003365] mt-0.5 flex-shrink-0" />
                    <Text size="sm" className="text-[#003365] !mb-0">
                      <strong>Tip:</strong> Step BACK and zoom OUT when taking photos. We need to see full sides with all fastening surfaces visible.
                    </Text>
                  </div>
                </Card>
              </div>

              {/* ============================================================
                  SECTION 3: Submit
                  ============================================================ */}
              <Card variant="elevated" className="!p-5 md:!p-6 !bg-gradient-to-br !from-[#406517]/5 !via-white !to-[#003365]/5 !border-[#406517]/20">
                <div className="text-center">
                  <Text className="text-gray-600 !mb-4">
                    A project planner will review your submission and contact you within 1 business day with a detailed quote.
                  </Text>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canSubmit}
                  >
                    {isSubmitting
                      ? <><Spinner size="sm" className="mr-2" />Submitting...</>
                      : <>Submit Project<CheckCircle className="ml-2 w-5 h-5" /></>
                    }
                  </Button>
                  {!canSubmit && (
                    <Text size="xs" className="text-gray-400 !mb-0 mt-2">
                      Please fill in all contact fields to submit.
                    </Text>
                  )}
                </div>
              </Card>

              {/* Contact alternative */}
              <div className="text-center pb-2">
                <Text size="sm" className="text-gray-500 !mb-1">Prefer to call?</Text>
                <a href="tel:7706454745" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: brandColor }}>
                  <PhoneIcon className="w-3.5 h-3.5" />
                  (770) 645-4745
                </a>
              </div>

            </Stack>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
