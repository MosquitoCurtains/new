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

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  Truck,
  MessageSquare,
  Hammer,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
} from '@/lib/design-system'
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
}

const PRODUCT_SLUG: Record<ProductType, string> = {
  mosquito_curtains: 'mosquito-curtains',
  clear_vinyl: 'clear-vinyl',
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
  const productSlug = PRODUCT_SLUG[productType]
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

  // ---- MAIN PAGE ----
  return (
    <Container size="xl">
      <Link href={`/start-project/${productSlug}`} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1">
        <ArrowLeft className="w-3 h-3" />
        Back to Options
      </Link>
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

              {/* Next steps - Expert Assistance + DIY Builder */}
              {allInputsFilled && (
                <>
                  <div className="text-center">
                    <Heading level={3} className="!text-lg md:!text-xl !mb-1" style={{ color: brandColor }}>
                      Ready to move forward?
                    </Heading>
                    <Text size="sm" className="text-gray-600 !mb-0">
                      Choose the path that works best for you.
                    </Text>
                  </div>

                  <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
                    <Link href={`/start-project/${productSlug}/expert-assistance`}>
                      <Card
                        variant="elevated"
                        className="relative h-full flex flex-col text-left p-5 rounded-2xl border-2 transition-all bg-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                      >
                        <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: '#406517', borderColor: '#406517' }}>
                          Recommended
                        </Badge>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#40651715' }}>
                          <MessageSquare className="w-5 h-5" style={{ color: '#406517' }} />
                        </div>
                        <Heading level={4} className="!mb-1">Expert Assistance</Heading>
                        <Text size="sm" className="text-gray-600 !mb-2">
                          Upload photos, get personalized guidance and an exact quote
                        </Text>
                        <ul className="space-y-1 mb-4">
                          {['Upload photos of your space', 'Expert reviews your project', 'Detailed quote within 24-48 hours'].map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end mt-auto">
                          <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all" style={{ color: '#406517', borderColor: 'rgba(64,101,23,0.5)' }}>
                            Get started
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Card>
                    </Link>

                    <Link href={`/start-project/${productSlug}/diy-builder`}>
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
                  </Grid>
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
