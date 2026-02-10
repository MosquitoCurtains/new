'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Clock, MapPin, Send, CheckCircle, Upload } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  BulletedList,
  ListItem,
  PowerHeaderTemplate,
  ImageLightbox,
} from '@/lib/design-system'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const GOOD_PHOTO_1 = `${IMG}/2020/04/Good-1-Big-1024x768.jpg`
const GOOD_PHOTO_2 = `${IMG}/2020/04/Good-2-Big-1024x768.jpg`
const BAD_PHOTO_1 = `${IMG}/2020/04/Bad-1-Big-1024x768.jpg`
const BAD_PHOTO_2 = `${IMG}/2020/04/Bad-2-Big-1024x768.jpg`

const GOOD_PHOTOS = [
  { url: GOOD_PHOTO_1, alt: 'Good project photo - wide shot', caption: 'Good photo' },
  { url: GOOD_PHOTO_2, alt: 'Good project photo - full view', caption: 'Good photo' },
] as const

const BAD_PHOTOS = [
  { url: BAD_PHOTO_1, alt: 'Bad project photo - too close', caption: 'Bad photo' },
  { url: BAD_PHOTO_2, alt: 'Bad project photo - not enough context', caption: 'Bad photo' },
] as const

const PLANNING_TEAM = [
  { name: 'Aaron Gorecki', image: `${IMG}/2019/10/Aaron-150x150.jpg` },
  { name: 'Kurt Jordan', image: `${IMG}/2019/10/kurt-square-150x150.jpg` },
  { name: 'Matt Rier', image: `${IMG}/2021/05/Matt-Rier-New-150x150.jpg` },
  { name: 'Heather Evans', image: `${IMG}/2025/10/Heather-1-150x150.jpg` },
  { name: 'John Hubay', image: `${IMG}/2021/07/John-Hubay-New-150x150.jpg` },
  { name: 'Iryna Mardanova', image: `${IMG}/2020/08/Iryna-150x150.jpg` },
  { name: 'Patrick Jordan', image: `${IMG}/2020/06/Patrick-Jordan-150x150.jpg` },
  { name: 'Dan McCaskey', image: `${IMG}/2021/07/Dan-McClaskey-150x150.jpg` },
] as const

const CONTACT_HERO_ACTIONS = [
  { icon: Phone, title: 'Call Us', description: '(770) 645-4745 — fastest way to connect.', href: 'tel:+17706454745', buttonText: 'Call', color: '#406517' },
  { icon: Mail, title: 'Instant Quote', description: 'Get an estimate within 5% of actual cost.', href: '/mosquito-curtains-instant-quote', buttonText: 'Quote', color: '#003365' },
  { icon: Upload, title: 'Start Project', description: 'Upload photos and get personalized guidance.', href: '/start-project', buttonText: 'Start', color: '#B30158' },
] as const

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    projectType: '',
    message: '',
    workedWithUsBefore: '',
    workedWith: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ url: string; alt?: string; caption?: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const valid = selected.filter((f) => {
      const ok = /\.(jpg|jpeg|png|webp|heic|pdf|mp4|mov|webm)$/i.test(f.name)
      const maxSize = /\.(mp4|mov|webm)$/i.test(f.name) ? 100 * 1024 * 1024 : 10 * 1024 * 1024
      return ok && f.size <= maxSize
    })
    setFiles(valid)
  }

  const uploadFiles = async (): Promise<{ url: string; fileName: string }[]> => {
    if (files.length === 0) return []
    const sessionId = `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const results: { url: string; fileName: string }[] = []

    const mimeFallback: Record<string, string> = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
      'webp': 'image/webp', 'heic': 'image/heic', 'pdf': 'application/pdf',
      'mp4': 'video/mp4', 'mov': 'video/quicktime', 'webm': 'video/webm',
    }
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const fileType = file.type || mimeFallback[ext] || 'image/jpeg'
      const res = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType,
          fileSize: file.size,
          uploadType: 'project-photo',
          sessionId,
        }),
      })
      if (!res.ok) continue
      const { presignedUrl, publicUrl } = await res.json()
      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (putRes.ok) results.push({ url: publicUrl, fileName: file.name })
    }
    return results
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const uploaded = await uploadFiles()

      const extra: string[] = []
      if (formState.workedWithUsBefore === 'yes') {
        extra.push(`Previously worked with: ${formState.workedWith || 'Unknown'}`)
      }
      const fullMessage = [formState.message, ...extra].filter(Boolean).join('\n\n')

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formState.email,
          firstName: formState.firstName,
          lastName: formState.lastName,
          phone: formState.phone || undefined,
          interest: formState.interest || undefined,
          projectType: formState.projectType || undefined,
          message: fullMessage,
          source: 'contact_form',
          photo_urls: uploaded.length > 0 ? uploaded : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
          landing_page: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again or call us at (770) 645-4745.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Container size="md">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="!p-8 text-center">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={2} className="!mb-2">Message Sent!</Heading>
            <Text className="text-gray-600 mb-6">
              Thank you for contacting us. A member of our planning team will get back to you
              within 1 business day.
            </Text>
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero - PowerHeaderTemplate (pretty page hero from PAGE_BUILDING_RULES) */}
        <PowerHeaderTemplate
          title="Contact Us"
          subtitle="Get Started Fast With a Real Person! Every porch is different and we need to see project photos to plan these correctly. You can upload from your phone or computer. Want an instant estimate? Use our estimator below or call us at (770) 645-4745."
          videoId="47DB7mSxd5g"
          videoTitle="Photo Guidelines Video"
          ctaText="Fill the Form Below"
          ctaHref="#quick-connect-form"
          variant="compact"
          actions={CONTACT_HERO_ACTIONS}
        />

        {/* Photo Guidelines */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="outlined" className="!p-6">
              <Heading level={3} className="!mb-3">Photo Guidelines</Heading>
              <BulletedList spacing="sm">
                <ListItem>Please provide 2-4 high resolution photos that show all complete sides of your project.</ListItem>
                <ListItem>Step BACK and zoom OUT so we can see as much as possible. No close-ups.</ListItem>
                <ListItem>Large file sizes – Small images do not provide enough resolution for planning sessions.</ListItem>
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

        {/* Quick Connect Form */}
        <section id="quick-connect-form">
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-gray-900 px-6 py-4">
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Quick Connect Form
              </span>
              <p className="text-gray-300 text-sm mt-1">Fill and a planner will connect to discuss your project!</p>
            </div>
            <div className="p-6 md:p-10">
              <form onSubmit={handleSubmit}>
                <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={formState.firstName}
                        onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                        placeholder="First"
                        required
                      />
                      <Input
                        value={formState.lastName}
                        onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                        placeholder="Last"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <Input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I&apos;m interested in... *</label>
                    <select
                      value={formState.interest}
                      onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                      required
                    >
                      <option value="">Select option</option>
                      <option value="mosquito_curtains">Mosquito Curtains</option>
                      <option value="clear_vinyl">Clear Vinyl</option>
                      <option value="both">Both MC &amp; CV</option>
                      <option value="raw_materials">Raw Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">My project type... *</label>
                    <select
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                      required
                    >
                      <option value="">Select project type</option>
                      <option value="porch">Porch / Patio</option>
                      <option value="awning">Awning</option>
                      <option value="deck">Deck</option>
                      <option value="french_door">French Door</option>
                      <option value="garage">Garage Door</option>
                      <option value="gazebo">Gazebo</option>
                      <option value="hvac">HVAC Filter</option>
                      <option value="industrial">Industrial Application</option>
                      <option value="pergola">Pergola</option>
                      <option value="projection">Projection Screen</option>
                      <option value="other">Other Project Type</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Have you worked with us before? *</label>
                    <select
                      value={formState.workedWithUsBefore}
                      onChange={(e) => setFormState({ ...formState, workedWithUsBefore: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                      required
                    >
                      <option value="">Select</option>
                      <option value="no">No, this is my first contact form.</option>
                      <option value="yes">Yes, I have communicated with a project planner before.</option>
                    </select>
                  </div>
                  {formState.workedWithUsBefore === 'yes' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Who have you worked with previously? *</label>
                      <select
                        value={formState.workedWith}
                        onChange={(e) => setFormState({ ...formState, workedWith: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]"
                        required={formState.workedWithUsBefore === 'yes'}
                      >
                        <option value="">Select</option>
                        <option value="Aaron">Aaron</option>
                        <option value="Dan">Dan</option>
                        <option value="John">John</option>
                        <option value="Matt">Matt</option>
                        <option value="Patrick">Patrick</option>
                        <option value="Kurt">Kurt</option>
                        <option value="Heather">Heather</option>
                        <option value="Iryna">Iryna</option>
                        <option value="other">Someone else / I don&apos;t remember.</option>
                      </select>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Please upload images showing your full project from the outside (no close-ups).
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#406517] hover:bg-[#406517]/5 transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {files.length > 0
                          ? `${files.length} file(s) selected`
                          : 'Drop files here or click to select'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max. file size: 10 MB per file.</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Please tell us about your project.</label>
                    <Textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your project..."
                      rows={4}
                      className="!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-500 focus:!border-[#406517]"
                    />
                  </div>
                </Grid>
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Submit'}
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <Card variant="outlined" className="!p-6">
            <Heading level={3} className="!mb-4">Contact Information</Heading>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <div>
                <a href="tel:+17706454745" className="text-lg font-semibold text-[#406517] hover:underline">
                  (770) 645-4745
                </a>
                <p className="text-sm text-gray-600 mt-1">When you call, our FIRST question will be, &quot;Have you sent photos?&quot;</p>
              </div>
              <div>
                <a href="mailto:info@mosquitocurtains.com" className="text-lg font-semibold text-[#406517] hover:underline">
                  info@mosquitocurtains.com
                </a>
                <p className="text-sm text-gray-600 mt-1">Please read photo guidelines above!</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>Mon – Fri: 9am – 5pm EST</span>
                </div>
              </div>
              <div>
                <a
                  href="https://g.page/mosquito-curtains-inc?share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-700 hover:text-[#406517]"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>1320 Union Hill Industrial Ct Suite C, Alpharetta, GA 30004</span>
                </a>
              </div>
            </Grid>
          </Card>
        </section>

        {/* The Planning Team */}
        <section>
          <Heading level={2} className="!mb-6">The Planning Team</Heading>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {PLANNING_TEAM.map((member) => (
              <Card key={member.name} variant="outlined" className="!p-4 text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                </div>
                <p className="font-semibold text-gray-900">{member.name}</p>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Need help before submitting photos? */}
        <section>
          <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Heading level={3} className="!mb-2">Need help before submitting photos?</Heading>
                <p className="text-gray-600">We are here to help. Give us a call and one of our planners will gladly assist you.</p>
              </div>
              <a
                href="tel:+17708847705"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#406517] text-white font-semibold rounded-full hover:bg-[#335512] transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us: (770) 884-7705
              </a>
            </div>
          </Card>
        </section>
      </Stack>
    </Container>
  )
}
