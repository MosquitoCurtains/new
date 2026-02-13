'use client'

/**
 * Standalone Instant Quote Page Component
 * 
 * Full-page instant quote experience for a specific product type.
 * Used by /mosquito-curtains-instant-quote/ and /clear-vinyl-instant-quote/
 * 
 * Follows PAGE_BUILDING_RULES.md and matches /start-project style:
 * - Container size="xl" > Stack gap="lg" (required structure)
 * - Gradient section card with background blurs
 * - Import from @/lib/design-system (NOT /components)
 * - Mobile-first responsive text/spacing
 * 
 * Contains the same pricing calculator as /start-project (quote mode),
 * plus all educational content via QuoteGuidance.
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  Truck,
  CheckCircle,
  Info,
  MessageSquare,
  Hammer,
  Check,
  ArrowRight,
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
  Spinner,
  Badge,
} from '@/lib/design-system'
import { PhotoUploader, UploadedPhoto } from '@/components/project'
import { QuoteGuidance } from './QuoteGuidance'
import {
  calculateMosquitoQuote,
  calculateClearVinylQuote,
  formatUSD,
  MESH_TYPE_OPTIONS,
  PANEL_HEIGHT_OPTIONS,
  MOSQUITO_ATTACHMENT_OPTIONS,
  VINYL_ATTACHMENT_OPTIONS,
  SIDES_OPTIONS,
  SHIP_LOCATION_OPTIONS,
  type MosquitoMeshType,
  type ClearVinylPanelHeight,
  type TopAttachmentMosquito,
  type TopAttachmentVinyl,
  type ShipLocation,
  type QuoteResult,
  type InstantQuotePricingConfig,
} from '@/lib/pricing/instant-quote'

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'mosquito_curtains' | 'clear_vinyl'

interface InstantQuoteState {
  meshType: MosquitoMeshType | null
  panelHeight: ClearVinylPanelHeight | null
  topAttachment: string | null
  numberOfSides: number | null
  projectWidth: number | null
  shipLocation: ShipLocation
  projectNote: string
}

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface StandaloneInstantQuoteProps {
  productType: ProductType
}

// =============================================================================
// CONSTANTS
// =============================================================================

const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors appearance-none cursor-pointer'

const initialQuoteState: InstantQuoteState = {
  meshType: null,
  panelHeight: null,
  topAttachment: null,
  numberOfSides: null,
  projectWidth: null,
  shipLocation: 'usa',
  projectNote: '',
}

const initialContact: ContactInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

const PRODUCT_META = {
  mosquito_curtains: {
    title: 'Mosquito Curtains Instant Quote Tool',
    subtitle: 'Modular Outdoor Curtain Systems to Create a Modern & Sleek Outdoor Space',
    brandColor: '#406517',
    borderColor: '#406517',
  },
  clear_vinyl: {
    title: 'Clear Vinyl Instant Quote Tool',
    subtitle: 'Modular Clear Vinyl Panels Custom-Made to Fit Any Space',
    brandColor: '#003365',
    borderColor: '#003365',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StandaloneInstantQuote({ productType }: StandaloneInstantQuoteProps) {
  const [quoteState, setQuoteState] = useState<InstantQuoteState>(initialQuoteState)
  const [contact, setContact] = useState<ContactInfo>(initialContact)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pricingConfig, setPricingConfig] = useState<InstantQuotePricingConfig | undefined>(undefined)
  const [dynamicOptions, setDynamicOptions] = useState<{
    meshTypeOptions: Array<{ value: string; label: string }>
    panelHeightOptions: Array<{ value: string; label: string }>
    mosquitoAttachmentOptions: Array<{ value: string; label: string }>
    vinylAttachmentOptions: Array<{ value: string; label: string }>
    sidesOptions: Array<{ value: number; label: string }>
    shipLocationOptions: Array<{ value: string; label: string }>
  } | null>(null)

  const isMosquito = productType === 'mosquito_curtains'
  const meta = PRODUCT_META[productType]
  const brandColor = meta.brandColor

  // Resolved dropdown options (DB-driven if available, else hard-coded fallbacks)
  const meshOptions = dynamicOptions?.meshTypeOptions ?? MESH_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))
  const heightOptions = dynamicOptions?.panelHeightOptions ?? PANEL_HEIGHT_OPTIONS.map(o => ({ value: o.value, label: o.label }))
  const mcAttachmentOptions = dynamicOptions?.mosquitoAttachmentOptions ?? MOSQUITO_ATTACHMENT_OPTIONS.map(o => ({ value: o.value, label: o.label }))
  const cvAttachmentOptions = dynamicOptions?.vinylAttachmentOptions ?? VINYL_ATTACHMENT_OPTIONS.map(o => ({ value: o.value, label: o.label }))
  const sidesOpts = dynamicOptions?.sidesOptions ?? SIDES_OPTIONS.map(o => ({ value: o.value, label: o.label }))
  const shipOpts = dynamicOptions?.shipLocationOptions ?? SHIP_LOCATION_OPTIONS.map(o => ({ value: o.value, label: o.label }))

  // Load pricing config + available options from database
  useEffect(() => {
    fetch('/api/instant-quote/pricing')
      .then(r => r.json())
      .then(data => {
        if (data.config) setPricingConfig(data.config)
        if (data.availableOptions) setDynamicOptions(data.availableOptions)
      })
      .catch(() => {
        // Falls back to hard-coded defaults (calculator default param + static arrays)
      })
  }, [])

  // Calculate price
  const price: QuoteResult = useMemo(() => {
    if (isMosquito) {
      return calculateMosquitoQuote({
        meshType: quoteState.meshType,
        topAttachment: quoteState.topAttachment as TopAttachmentMosquito | null,
        numberOfSides: quoteState.numberOfSides,
        projectWidth: quoteState.projectWidth,
        shipLocation: quoteState.shipLocation,
      }, pricingConfig)
    }
    return calculateClearVinylQuote({
      panelHeight: quoteState.panelHeight,
      topAttachment: quoteState.topAttachment as TopAttachmentVinyl | null,
      numberOfSides: quoteState.numberOfSides,
      projectWidth: quoteState.projectWidth,
      shipLocation: quoteState.shipLocation,
    }, pricingConfig)
  }, [isMosquito, quoteState, pricingConfig])

  const allInputsFilled = price.isComplete

  const canSubmit = useCallback((): boolean => {
    if (!price.isComplete) return false
    return !!(contact.firstName && contact.lastName && contact.email && contact.phone)
  }, [price.isComplete, contact])

  const handleSubmit = async () => {
    if (!canSubmit()) return
    setIsSubmitting(true)
    try {
      const payload = {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        product: productType,
        projectType: 'quote',
        meshType: quoteState.meshType,
        panelHeight: quoteState.panelHeight,
        topAttachment: quoteState.topAttachment,
        totalWidth: quoteState.projectWidth,
        numberOfSides: quoteState.numberOfSides,
        shipLocation: quoteState.shipLocation,
        subtotal: price.subtotal,
        shipping: price.shipping,
        estimatedTotal: price.total,
        notes: JSON.stringify({
          projectNote: quoteState.projectNote,
          photos: photos.map(p => ({ url: p.publicUrl, key: p.key })),
        }),
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

  // ---- SUCCESS STATE ----
  if (submitted) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${brandColor}10` }}>
                <CheckCircle className="w-10 h-10" style={{ color: brandColor }} />
              </div>
              <Heading level={2} className="!mb-2">Quote Submitted!</Heading>
              <Text className="text-gray-600 mb-6">
                Thank you, {contact.firstName}! We&apos;ll contact you within 1 business day.
              </Text>
              <Card variant="outlined" className="!p-4 !bg-white/80 !border-[#406517]/20 mb-6 inline-block">
                <Text size="sm" className="text-gray-500 !mb-1">Your Estimated Total</Text>
                <Text className="text-2xl font-bold !mb-0" style={{ color: brandColor }}>{formatUSD(price.total)}</Text>
              </Card>
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

  // ---- MAIN PAGE ----
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ============================================================
            HERO + QUOTE FORM (Gradient Section Card - /start-project style)
            ============================================================ */}
        <section className="relative">
          {/* Background blurs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${brandColor}10` }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div
            className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-5 md:p-6 lg:p-8"
            style={{ borderColor: `${meta.borderColor}20` }}
          >
            {/* Page Title */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                {meta.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                {meta.subtitle}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-sm md:!text-base !mb-0 text-gray-900">
                  Please make a selection on all 5 fields for an instant quote.
                </Heading>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            {/* Quote Calculator Content */}
            <Stack gap="lg">

              {/* Pricing Input Card */}
              <Card variant="elevated" className="!p-5 md:!p-6">
                {/* Row 1: Product-specific + attachment + sides */}
                <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
                  {/* Mosquito: Mesh Type */}
                  {isMosquito && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesh Type *</label>
                      <select
                        value={quoteState.meshType || ''}
                        onChange={(e) => setQuoteState(s => ({ ...s, meshType: (e.target.value || null) as MosquitoMeshType | null }))}
                        className={selectClass}
                      >
                        <option value="">Select Mesh Type</option>
                        {meshOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Clear Vinyl: Panel Height */}
                  {!isMosquito && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Panel Height *</label>
                      <select
                        value={quoteState.panelHeight || ''}
                        onChange={(e) => setQuoteState(s => ({ ...s, panelHeight: (e.target.value || null) as ClearVinylPanelHeight | null }))}
                        className={selectClass}
                      >
                        <option value="">Select Panel Height</option>
                        {heightOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Top Attachment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Top Attachment *</label>
                    <select
                      value={quoteState.topAttachment || ''}
                      onChange={(e) => setQuoteState(s => ({ ...s, topAttachment: e.target.value || null }))}
                      className={selectClass}
                    >
                      <option value="">Select Top Attachment</option>
                      {(isMosquito ? mcAttachmentOptions : cvAttachmentOptions).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Sides */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Sides in Project *</label>
                    <select
                      value={quoteState.numberOfSides ?? ''}
                      onChange={(e) => setQuoteState(s => ({ ...s, numberOfSides: e.target.value ? Number(e.target.value) : null }))}
                      className={selectClass}
                    >
                      <option value="">Number of Open Sides</option>
                      {sidesOpts.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </Grid>

                {/* Row 2: Width + Shipping */}
                <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Project Width (FT) *</label>
                    <select
                      value={quoteState.projectWidth ?? ''}
                      onChange={(e) => setQuoteState(s => ({ ...s, projectWidth: e.target.value ? Number(e.target.value) : null }))}
                      className={selectClass}
                    >
                      <option value="">Total Project Width (FT)</option>
                      {Array.from({ length: 196 }, (_, i) => i + 5).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Where Will We Ship? *</label>
                    <select
                      value={quoteState.shipLocation}
                      onChange={(e) => setQuoteState(s => ({ ...s, shipLocation: e.target.value as ShipLocation }))}
                      className={selectClass}
                    >
                      {shipOpts.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </Grid>
              </Card>

              {/* Price Display - inline on desktop */}
              {allInputsFilled && (
                <Card variant="elevated" className="!p-0 overflow-hidden !border-2" style={{ borderColor: `${brandColor}30` }}>
                  <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-200 md:divide-y-0 divide-y divide-gray-100">
                    <div className="flex items-center justify-between md:flex-1 px-6 py-3.5 md:flex-col md:items-center md:gap-1 md:py-5">
                      <div className="flex items-center gap-2 md:flex-col">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Subtotal</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{formatUSD(price.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between md:flex-1 px-6 py-3.5 md:flex-col md:items-center md:gap-1 md:py-5">
                      <div className="flex items-center gap-2 md:flex-col">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Shipping</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{formatUSD(price.shipping)}</span>
                    </div>
                    <div className="flex items-center justify-between md:flex-1 px-6 py-4 md:flex-col md:items-center md:gap-1 md:py-5" style={{ backgroundColor: `${brandColor}08` }}>
                      <span className="text-base font-bold text-gray-900 uppercase tracking-wide">Estimated Total</span>
                      <span className="text-2xl font-bold" style={{ color: brandColor }}>{formatUSD(price.total)}</span>
                    </div>
                  </div>
                  <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100">
                    <Text size="xs" className="text-gray-500 !mb-0">
                      * Additional shipping charges apply to Hawaii, Alaska, and Puerto Rico.
                    </Text>
                  </div>
                </Card>
              )}

              {/* Other options - same card style as path selection */}
              {allInputsFilled && (
                <Grid responsiveCols={{ mobile: 1, tablet: isMosquito ? 2 : 1 }} gap="md">
                  <Link href={isMosquito ? "/start-project/mosquito-curtains/expert-assistance" : "/start-project/clear-vinyl/expert-assistance"}>
                    <Card
                      variant="elevated"
                      className="relative h-full flex flex-col text-left p-5 rounded-2xl border-2 transition-all bg-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                    >
                      <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: '#B30158', borderColor: '#B30158' }}>
                        Recommended
                      </Badge>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#B3015815' }}>
                        <MessageSquare className="w-5 h-5" style={{ color: '#B30158' }} />
                      </div>
                      <Heading level={4} className="!mb-1">Expert Assistance</Heading>
                      <Text size="sm" className="text-gray-600 !mb-2">
                        {isMosquito ? 'Upload photos, get personalized guidance' : 'Upload photos and get a detailed quote within 24-48 hours'}
                      </Text>
                      <ul className="space-y-1 mb-4">
                        {(
                          isMosquito
                            ? ['Upload photos of your space', 'Expert reviews your project', 'Detailed quote within 24-48 hours']
                            : ['Share photos of your space', 'Our experts review your project', 'Custom quote within 24-48 hours']
                        ).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end mt-auto">
                        <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all" style={{ color: '#B30158', borderColor: 'rgba(179,1,88,0.5)' }}>
                          Get started
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                  {isMosquito && (
                    <Link href="/start-project/mosquito-curtains/diy-builder">
                      <Card
                        variant="elevated"
                        className="relative h-full flex flex-col text-left p-5 rounded-2xl border-2 transition-all bg-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                      >
                        <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}>
                          Most Control
                        </Badge>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#FFA50115' }}>
                          <Hammer className="w-5 h-5" style={{ color: '#FFA501' }} />
                        </div>
                        <Heading level={4} className="!mb-1">DIY Builder</Heading>
                        <Text size="sm" className="text-gray-600 !mb-2">Configure panels and add to cart</Text>
                        <ul className="space-y-1 mb-4">
                          {['Panel-by-panel config', 'Full control over options', 'Direct checkout'].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end mt-auto">
                          <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all" style={{ color: '#FFA501', borderColor: 'rgba(255,165,1,0.5)' }}>
                            Get started
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  )}
                </Grid>
              )}

              {/* Contact Section */}
              {allInputsFilled && (
                <>
                  {/* Decorative divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2" style={{ borderColor: `${brandColor}30` }} />
                    </div>
                  </div>

                  <div className="text-center">
                    <Heading level={3} className="!text-lg md:!text-xl !mb-1" style={{ color: brandColor }}>
                      Want to have a quick chat about your quote?
                    </Heading>
                    <Text size="sm" className="text-gray-600 !mb-0">
                      Our project planning team is super friendly and can answer any questions you may have. Drop us your contact and we&apos;ll be in touch as soon as possible.
                    </Text>
                  </div>

                  {/* Contact Form */}
                  <Card variant="elevated" className="!p-5 md:!p-6">
                    <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                      <div className="md:col-span-2">
                        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <Input value={contact.firstName} onChange={(e) => setContact(c => ({ ...c, firstName: e.target.value }))} placeholder="First Name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <Input value={contact.lastName} onChange={(e) => setContact(c => ({ ...c, lastName: e.target.value }))} placeholder="Last Name" />
                          </div>
                        </Grid>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <Input type="tel" value={contact.phone} onChange={(e) => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="Phone" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <Input type="email" value={contact.email} onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} placeholder="Email" />
                      </div>
                    </Grid>

                    {/* Project Note */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">A quick note about your project</label>
                      <textarea
                        value={quoteState.projectNote}
                        onChange={(e) => setQuoteState(s => ({ ...s, projectNote: e.target.value }))}
                        placeholder="A quick note about your project"
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors resize-none"
                      />
                    </div>
                  </Card>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional but very helpful)</label>
                    <PhotoUploader sessionId={sessionId} maxFiles={10} onUploadComplete={setPhotos} />
                  </div>

                  {/* Tip */}
                  <Card variant="outlined" className="!p-3 !bg-[#003365]/5 !border-[#003365]/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#003365] mt-0.5 flex-shrink-0" />
                      <Text size="sm" className="text-[#003365] !mb-0">
                        <strong>Tip:</strong> Step BACK and zoom OUT when taking photos. We need to see full sides with all fastening surfaces visible.
                      </Text>
                    </div>
                  </Card>

                  {/* Submit Button - Centered (never full-width per rules) */}
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !canSubmit()}
                    >
                      {isSubmitting
                        ? <><Spinner size="sm" className="mr-2" />Submitting...</>
                        : <>Submit Quote<CheckCircle className="ml-2 w-5 h-5" /></>
                      }
                    </Button>
                  </div>
                </>
              )}
            </Stack>
          </div>
        </section>

        {/* ============================================================
            EDUCATIONAL CONTENT & GUIDANCE (Below the gradient card)
            ============================================================ */}
        <QuoteGuidance productType={productType} />

      </Stack>
    </Container>
  )
}

export default StandaloneInstantQuote
