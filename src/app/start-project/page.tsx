'use client'

/**
 * Start Project Page
 * 
 * SIMPLIFIED FLOW:
 * 1. Product Type Selection (Mosquito/Clear Vinyl/Raw Materials)
 * 2. Choose Your Path (Expert/Quote/DIY)
 * 3. Mode-specific steps:
 *    - Expert: Photos -> Contact -> Review (FAST - 2 clicks to upload!)
 *    - Quote: Single-page instant quote calculator (matches Gravity Forms pricing)
 *    - DIY: Options -> Panel Builder
 * 
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Camera, 
  CheckCircle,
  Calculator,
  Phone,
  Mail,
  Bug,
  Snowflake,
  MessageSquare,
  Hammer,
  Check,
  Scissors,
  DollarSign,
  Truck,
  Info,
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
  Frame,
  Spinner,
  Badge,
} from '@/lib/design-system'
import { PhotoUploader, UploadedPhoto, DIYBuilder, DIYProject, FabricConfigurator, FabricOrder, QuickSetup, QuickSetupOptions, MeshOptions, VinylOptions, RawMaterialOptions, QuoteGuidance } from '@/components/project'
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
} from '@/lib/pricing/instant-quote'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'mosquito_curtains' | 'clear_vinyl' | 'raw_materials' | null
type ProjectMode = 'planner' | 'quote' | 'diy' | null
type WizardStep = 'product' | 'path' | 'mode-steps'

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface InstantQuoteState {
  // Mosquito-specific
  meshType: MosquitoMeshType | null
  // Clear Vinyl-specific
  panelHeight: ClearVinylPanelHeight | null
  // Shared
  topAttachment: string | null
  numberOfSides: number | null
  projectWidth: number | null
  shipLocation: ShipLocation
  projectNote: string
}

interface WizardState {
  productType: ProductType
  options: QuickSetupOptions
  mode: ProjectMode
  email: string | null
  sessionId: string
  contact: ContactInfo
  instantQuote: InstantQuoteState
  photos: UploadedPhoto[]
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const defaultMeshOptions: MeshOptions = {
  meshType: 'heavy_mosquito',
  meshColor: 'black',
  topAttachment: 'velcro',
  velcroColor: 'black',
}

const defaultVinylOptions: VinylOptions = {
  panelSize: 'medium',
  canvasColor: 'black',
  topAttachment: 'velcro',
  velcroColor: 'black',
}

const defaultRawOptions: RawMaterialOptions = {
  meshType: 'heavy_mosquito',
  meshColor: 'black',
}

const initialInstantQuote: InstantQuoteState = {
  meshType: null,
  panelHeight: null,
  topAttachment: null,
  numberOfSides: null,
  projectWidth: null,
  shipLocation: 'usa',
  projectNote: '',
}

const initialState: WizardState = {
  productType: null,
  options: defaultMeshOptions,
  mode: null,
  email: null,
  sessionId: `session-${Date.now()}`,
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  instantQuote: { ...initialInstantQuote },
  photos: [],
}

// =============================================================================
// DATA
// =============================================================================

const PRODUCT_TYPES = [
  {
    id: 'mosquito_curtains' as const,
    title: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    description: 'Custom screen panels - sewn to your measurements',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200.jpg',
    icon: Bug,
    color: '#406517',
  },
  {
    id: 'clear_vinyl' as const,
    title: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    description: 'Custom vinyl panels - block wind, rain & cold',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
    icon: Snowflake,
    color: '#003365',
  },
  {
    id: 'raw_materials' as const,
    title: 'Raw Mesh Fabric',
    subtitle: 'DIY Materials',
    description: 'Bulk netting by the yard - up to 12ft wide',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200.jpg',
    icon: Scissors,
    color: '#B30158',
  },
]

const PATH_OPTIONS = [
  {
    id: 'planner' as const,
    icon: MessageSquare,
    title: 'Talk to an Expert',
    description: 'Upload photos, get personalized guidance',
    features: ['Upload photos of your space', 'Expert reviews your project', 'Detailed quote within 24-48 hours'],
    badge: 'Recommended',
    color: '#B30158',
  },
  {
    id: 'quote' as const,
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Enter specs for a quick estimate',
    features: ['Configure options', 'Enter dimensions', 'Get instant price'],
    badge: 'Fastest',
    color: '#003365',
  },
  {
    id: 'diy' as const,
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels and add to cart',
    features: ['Panel-by-panel config', 'Full control over options', 'Direct checkout'],
    badge: 'Most Control',
    color: '#FFA501',
  },
]

// =============================================================================
// SHARED SELECT STYLING
// =============================================================================

const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors appearance-none cursor-pointer'

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function ProductTypeStep({ value, onChange }: { value: ProductType; onChange: (value: ProductType) => void }) {
  return (
    <div>
      <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
        {PRODUCT_TYPES.map((product) => {
          const Icon = product.icon
          const isSelected = value === product.id
          return (
            <button
              key={product.id}
              onClick={() => onChange(product.id)}
              className={cn(
                'text-left rounded-2xl overflow-hidden border-2 transition-all bg-white',
                'hover:transform hover:-translate-y-1 hover:shadow-lg',
                isSelected ? 'border-[#406517] ring-2 ring-[#406517]/20' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Frame ratio="16/10">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </Frame>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon className="w-4 h-4" style={{ color: product.color }} />
                  <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                    {product.subtitle}
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Heading level={4} className="!mb-0 text-gray-900">{product.title}</Heading>
                  {isSelected && <CheckCircle className="w-5 h-5 text-[#406517]" />}
                </div>
                <Text size="sm" className="text-gray-600 !mb-0 mt-0.5">{product.description}</Text>
              </div>
            </button>
          )
        })}
      </Grid>
    </div>
  )
}

function ChoosePathStep({ value, onChange, onSelect, productType }: { value: ProjectMode; onChange: (mode: ProjectMode) => void; onSelect: (mode: ProjectMode) => void; productType: ProductType }) {
  // Filter out "quote" for raw materials (no pricing formula)
  const filteredPaths = productType === 'raw_materials' 
    ? PATH_OPTIONS.filter(p => p.id !== 'quote')
    : PATH_OPTIONS

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Heading level={2} className="!mb-1 !text-xl md:!text-2xl">How Can We Help?</Heading>
        <Text size="sm" className="text-gray-600 !mb-0">Choose the approach that works best for you</Text>
      </div>
      <Grid responsiveCols={{ mobile: 1, tablet: filteredPaths.length }} gap="md">
        {filteredPaths.map((path) => {
          const Icon = path.icon
          const isSelected = value === path.id
          return (
            <button
              key={path.id}
              onClick={() => {
                onChange(path.id)
                onSelect(path.id)
              }}
              className={cn(
                'relative text-left p-5 rounded-2xl border-2 transition-all bg-white',
                'hover:transform hover:-translate-y-1 hover:shadow-lg',
                isSelected ? 'border-[#406517] bg-[#406517]/5 ring-4 ring-[#406517]/20' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: path.color, borderColor: path.color }}>
                {path.badge}
              </Badge>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${path.color}15` }}>
                <Icon className="w-5 h-5" style={{ color: path.color }} />
              </div>
              <Heading level={4} className={cn('!mb-1', isSelected && 'text-[#406517]')}>{path.title}</Heading>
              <Text size="sm" className="text-gray-600 !mb-2">{path.description}</Text>
              <ul className="space-y-1">
                {path.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </Grid>
    </div>
  )
}

function ContactStep({ data, onChange }: { data: ContactInfo; onChange: (data: ContactInfo) => void }) {
  return (
    <Stack gap="md">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="w-6 h-6 text-[#406517]" />
        </div>
        <Heading level={2} className="!text-xl md:!text-2xl">Your Contact Information</Heading>
        <Text size="sm" className="text-gray-600 !mb-0">So we can reach you about your project.</Text>
      </div>
      <Card variant="elevated" className="!p-6 max-w-xl mx-auto w-full">
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <Input value={data.firstName} onChange={(e) => onChange({ ...data, firstName: e.target.value })} placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <Input value={data.lastName} onChange={(e) => onChange({ ...data, lastName: e.target.value })} placeholder="Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <Input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input type="tel" value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} placeholder="(555) 123-4567" />
          </div>
        </Grid>
      </Card>
    </Stack>
  )
}

function PhotosStep({ photos, onPhotosChange, sessionId }: { photos: UploadedPhoto[]; onPhotosChange: (photos: UploadedPhoto[]) => void; sessionId: string }) {
  return (
    <Stack gap="md">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#FFA501]/10 rounded-full mx-auto mb-3 flex items-center justify-center">
          <Camera className="w-6 h-6 text-[#FFA501]" />
        </div>
        <Heading level={2} className="!text-xl md:!text-2xl">Upload Photos of Your Space</Heading>
        <Text size="sm" className="text-gray-600 !mb-0">Photos help us understand your project and give you an accurate quote.</Text>
      </div>
      <PhotoUploader sessionId={sessionId} maxFiles={10} onUploadComplete={onPhotosChange} />
      <Card variant="outlined" className="!p-4 !bg-[#003365]/5 !border-[#003365]/20 max-w-2xl mx-auto">
        <Text size="sm" className="text-[#003365]">
          <strong>Tip:</strong> Step BACK and zoom OUT. We need to see full sides with all fastening surfaces visible.
        </Text>
      </Card>
    </Stack>
  )
}

function ReviewStep({ state }: { state: WizardState }) {
  return (
    <Stack gap="md">
      <div className="text-center">
        <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-3 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-[#406517]" />
        </div>
        <Heading level={2} className="!text-xl md:!text-2xl">Review Your Project</Heading>
        <Text size="sm" className="text-gray-600 !mb-0">Confirm your details before submitting.</Text>
      </div>
      <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="max-w-3xl mx-auto">
        <Card variant="elevated" className="!p-6">
          <Heading level={4} className="!mb-4">Contact Information</Heading>
          <Stack gap="sm">
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{state.contact.firstName} {state.contact.lastName}</Text></div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{state.contact.email}</Text></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><Text className="text-gray-700 !mb-0">{state.contact.phone}</Text></div>
          </Stack>
        </Card>
        <Card variant="elevated" className="!p-6">
          <Heading level={4} className="!mb-4">Project Details</Heading>
          <Stack gap="sm">
            <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Product</Text><Text className="font-medium text-gray-900 !mb-0 capitalize">{state.productType?.replace(/_/g, ' ')}</Text></div>
            {'meshType' in state.options && (
              <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Mesh</Text><Text className="font-medium text-gray-900 !mb-0 capitalize">{state.options.meshType.replace(/_/g, ' ')}</Text></div>
            )}
            <div className="flex justify-between"><Text className="text-gray-500 !mb-0">Photos</Text><Text className="font-medium text-gray-900 !mb-0">{state.photos.length} uploaded</Text></div>
          </Stack>
        </Card>
      </Grid>
      <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-[#406517]/5 !via-white !to-[#003365]/5 !border-[#406517]/20 max-w-xl mx-auto">
        <div className="text-center">
          <Text className="text-gray-600">A project planner will review your submission and contact you within 1 business day with a detailed quote.</Text>
        </div>
      </Card>
    </Stack>
  )
}

// =============================================================================
// INSTANT QUOTE STEP (Mosquito Curtains & Clear Vinyl)
// =============================================================================

function InstantQuoteStep({
  productType,
  quoteState,
  onQuoteChange,
  price,
  contact,
  onContactChange,
  photos,
  onPhotosChange,
  sessionId,
}: {
  productType: 'mosquito_curtains' | 'clear_vinyl'
  quoteState: InstantQuoteState
  onQuoteChange: (state: InstantQuoteState) => void
  price: QuoteResult
  contact: ContactInfo
  onContactChange: (data: ContactInfo) => void
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  sessionId: string
}) {
  const isMosquito = productType === 'mosquito_curtains'
  const brandColor = isMosquito ? '#406517' : '#003365'
  const allInputsFilled = price.isComplete

  return (
    <Stack gap="lg">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
          <Calculator className="w-6 h-6" style={{ color: brandColor }} />
        </div>
        <Heading level={2} className="!text-xl md:!text-2xl">Instant Price Quote</Heading>
        <Text size="sm" className="text-gray-600 !mb-0">
          {isMosquito ? 'Configure your mosquito curtain project' : 'Configure your clear vinyl project'}
        </Text>
      </div>

      {/* Pricing Input Card */}
      <Card variant="elevated" className="!p-5 md:!p-6">
        {/* Row 1: Product-specific + attachment + sides */}
        <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
          {/* Mosquito: Mesh Type */}
          {isMosquito && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesh Type</label>
              <select
                value={quoteState.meshType || ''}
                onChange={(e) => onQuoteChange({ ...quoteState, meshType: (e.target.value || null) as MosquitoMeshType | null })}
                className={selectClass}
              >
                <option value="">Select Mesh Type</option>
                {MESH_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Vinyl: Panel Height */}
          {!isMosquito && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Panel Height</label>
              <select
                value={quoteState.panelHeight || ''}
                onChange={(e) => onQuoteChange({ ...quoteState, panelHeight: (e.target.value || null) as ClearVinylPanelHeight | null })}
                className={selectClass}
              >
                <option value="">Select Panel Height</option>
                {PANEL_HEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Top Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Top Attachment</label>
            <select
              value={quoteState.topAttachment || ''}
              onChange={(e) => onQuoteChange({ ...quoteState, topAttachment: e.target.value || null })}
              className={selectClass}
            >
              <option value="">Select Top Attachment</option>
              {(isMosquito ? MOSQUITO_ATTACHMENT_OPTIONS : VINYL_ATTACHMENT_OPTIONS).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Number of Sides */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Sides</label>
            <select
              value={quoteState.numberOfSides ?? ''}
              onChange={(e) => onQuoteChange({ ...quoteState, numberOfSides: e.target.value ? Number(e.target.value) : null })}
              className={selectClass}
            >
              <option value="">Number of Open Sides</option>
              {SIDES_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </Grid>

        {/* Row 2: Width + Shipping */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Project Width (FT)</label>
            <select
              value={quoteState.projectWidth ?? ''}
              onChange={(e) => onQuoteChange({ ...quoteState, projectWidth: e.target.value ? Number(e.target.value) : null })}
              className={selectClass}
            >
              <option value="">Total Project Width (FT)</option>
              {Array.from({ length: 196 }, (_, i) => i + 5).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Where Will We Ship?</label>
            <select
              value={quoteState.shipLocation}
              onChange={(e) => onQuoteChange({ ...quoteState, shipLocation: e.target.value as ShipLocation })}
              className={selectClass}
            >
              {SHIP_LOCATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </Grid>
      </Card>

      {/* Price Display - shown when all inputs are filled */}
      {allInputsFilled && (
        <Card variant="elevated" className="!p-0 overflow-hidden !border-2" style={{ borderColor: `${brandColor}30` }}>
          {/* Price rows */}
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Subtotal</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatUSD(price.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Shipping (USD$)</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{formatUSD(price.shipping)}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: `${brandColor}08` }}>
              <span className="text-base font-bold text-gray-900 uppercase tracking-wide">Estimated Total (USD)</span>
              <span className="text-2xl font-bold" style={{ color: brandColor }}>{formatUSD(price.total)}</span>
            </div>
          </div>
          {/* Shipping note */}
          <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100">
            <Text size="xs" className="text-gray-500 !mb-0">
              * Additional shipping charges apply to Hawaii, Alaska, and Puerto Rico.
            </Text>
          </div>
        </Card>
      )}

      {/* Divider + Contact Section - shown when price is calculated */}
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
                    <Input value={contact.firstName} onChange={(e) => onContactChange({ ...contact, firstName: e.target.value })} placeholder="First Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <Input value={contact.lastName} onChange={(e) => onContactChange({ ...contact, lastName: e.target.value })} placeholder="Last Name" />
                  </div>
                </Grid>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Input type="tel" value={contact.phone} onChange={(e) => onContactChange({ ...contact, phone: e.target.value })} placeholder="Phone" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input type="email" value={contact.email} onChange={(e) => onContactChange({ ...contact, email: e.target.value })} placeholder="Email" />
              </div>
            </Grid>

            {/* Project Note */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">A quick note about your project</label>
              <textarea
                value={quoteState.projectNote}
                onChange={(e) => onQuoteChange({ ...quoteState, projectNote: e.target.value })}
                placeholder="A quick note about your project"
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors resize-none"
              />
            </div>
          </Card>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional but very helpful)</label>
            <PhotoUploader sessionId={sessionId} maxFiles={10} onUploadComplete={onPhotosChange} />
          </div>

          {/* Info note */}
          <Card variant="outlined" className="!p-3 !bg-[#003365]/5 !border-[#003365]/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#003365] mt-0.5 flex-shrink-0" />
              <Text size="sm" className="text-[#003365] !mb-0">
                <strong>Tip:</strong> Step BACK and zoom OUT when taking photos. We need to see full sides with all fastening surfaces visible.
              </Text>
            </div>
          </Card>
        </>
      )}
    </Stack>
  )
}

// =============================================================================
// MAIN WIZARD COMPONENT
// =============================================================================

export default function StartProjectPage() {
  const router = useRouter()
  const [state, setState] = useState<WizardState>(initialState)
  const [wizardStep, setWizardStep] = useState<WizardStep>('product')
  const [modeStep, setModeStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Calculate instant quote price
  const quotePrice = useMemo(() => {
    if (state.productType === 'mosquito_curtains') {
      return calculateMosquitoQuote({
        meshType: state.instantQuote.meshType,
        topAttachment: state.instantQuote.topAttachment as TopAttachmentMosquito | null,
        numberOfSides: state.instantQuote.numberOfSides,
        projectWidth: state.instantQuote.projectWidth,
        shipLocation: state.instantQuote.shipLocation,
      })
    }
    if (state.productType === 'clear_vinyl') {
      return calculateClearVinylQuote({
        panelHeight: state.instantQuote.panelHeight,
        topAttachment: state.instantQuote.topAttachment as TopAttachmentVinyl | null,
        numberOfSides: state.instantQuote.numberOfSides,
        projectWidth: state.instantQuote.projectWidth,
        shipLocation: state.instantQuote.shipLocation,
      })
    }
    return { subtotal: 0, shipping: 0, total: 0, isComplete: false }
  }, [state.productType, state.instantQuote])

  // Handle DIY add to cart
  const handleDIYAddToCart = async (project: DIYProject, totals: { total: number }) => {
    localStorage.setItem('mc_cart', JSON.stringify({ type: 'diy', project, totals, contact: state.contact, sessionId: state.sessionId, timestamp: Date.now() }))
    router.push('/cart')
  }

  // Handle Fabric add to cart
  const handleFabricAddToCart = async (order: FabricOrder, price: number) => {
    localStorage.setItem('mc_cart', JSON.stringify({ type: 'raw_materials', fabric: order, totals: { total: price }, contact: state.contact, sessionId: state.sessionId, timestamp: Date.now() }))
    router.push('/cart')
  }

  // Handle path selection - immediately proceed to mode steps
  const handlePathSelect = (mode: ProjectMode) => {
    setState(prev => ({ ...prev, mode }))
    setWizardStep('mode-steps')
    setModeStep(1)
  }

  // Can proceed to next mode step?
  const canProceedModeStep = () => {
    if (state.mode === 'planner') {
      if (modeStep === 1) return true // Photos optional
      if (modeStep === 2) return !!(state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone)
    }
    return true
  }

  // Can submit the instant quote form?
  const canSubmitQuote = (): boolean => {
    if (!quotePrice.isComplete) return false
    const c = state.contact
    return !!(c.firstName && c.lastName && c.email && c.phone)
  }

  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const isQuoteMode = state.mode === 'quote'
      const iq = state.instantQuote

      const payload = {
        email: state.contact.email,
        firstName: state.contact.firstName,
        lastName: state.contact.lastName,
        phone: state.contact.phone,
        product: state.productType,
        projectType: state.mode,
        // Instant quote fields (when in quote mode)
        meshType: isQuoteMode ? iq.meshType : ('meshType' in state.options ? state.options.meshType : null),
        panelHeight: isQuoteMode ? iq.panelHeight : null,
        topAttachment: isQuoteMode ? iq.topAttachment : ('topAttachment' in state.options ? state.options.topAttachment : null),
        totalWidth: isQuoteMode ? iq.projectWidth : null,
        numberOfSides: isQuoteMode ? iq.numberOfSides : null,
        shipLocation: isQuoteMode ? iq.shipLocation : null,
        // Pricing
        subtotal: isQuoteMode ? quotePrice.subtotal : null,
        shipping: isQuoteMode ? quotePrice.shipping : null,
        estimatedTotal: isQuoteMode ? quotePrice.total : null,
        // Notes & photos
        notes: isQuoteMode
          ? JSON.stringify({
              projectNote: iq.projectNote,
              photos: state.photos.map(p => ({ url: p.publicUrl, key: p.key })),
            })
          : JSON.stringify({
              options: state.options,
              photos: state.photos.map(p => ({ url: p.publicUrl, key: p.key })),
            }),
        session_id: state.sessionId,
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

  // Get mode step info
  const getModeStepInfo = () => {
    if (state.mode === 'planner') {
      return {
        total: 3,
        steps: ['Photos', 'Contact', 'Review'],
        icons: [Camera, User, CheckCircle]
      }
    }
    if (state.mode === 'quote') {
      return {
        total: 1,
        steps: ['Instant Quote'],
        icons: [Calculator]
      }
    }
    return { total: 0, steps: [], icons: [] }
  }
  const modeInfo = getModeStepInfo()

  // Success screen
  if (submitted) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[#406517]" />
              </div>
              <Heading level={2} className="!mb-2">Project Submitted!</Heading>
              <Text className="text-gray-600 mb-6">Thank you, {state.contact.firstName}! We&apos;ll contact you within 1 business day.</Text>
              {state.mode === 'quote' && quotePrice.isComplete && (
                <Card variant="outlined" className="!p-4 !bg-white/80 !border-[#406517]/20 mb-6 inline-block">
                  <Text size="sm" className="text-gray-500 !mb-1">Your Estimated Total</Text>
                  <Text className="text-2xl font-bold text-[#406517] !mb-0">{formatUSD(quotePrice.total)}</Text>
                </Card>
              )}
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
          {/* Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>
          
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-5 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Start Your Project Today
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Custom-crafted to your exact measurements. Marine-grade quality.
              </p>
            </div>

            {/* Divider - shown on initial steps */}
            {wizardStep !== 'mode-steps' && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
                <div className="text-center px-4">
                  <Heading level={3} className="!text-base !mb-0 text-gray-900">Choose Your Solution</Heading>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
              </div>
            )}

            {/* Progress - Mode Steps (not quote or DIY) */}
            {wizardStep === 'mode-steps' && state.mode === 'planner' && (
              <div className="flex justify-center gap-2 mb-4">
                {modeInfo.steps.map((step, idx) => {
                  const Icon = modeInfo.icons[idx]
                  return (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                        modeStep === idx + 1 ? 'bg-[#406517] text-white' :
                        modeStep > idx + 1 ? 'bg-[#406517]/20 text-[#406517]' :
                        'bg-gray-100 text-gray-400'
                      )}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {idx < modeInfo.steps.length - 1 && (
                        <div className={cn('w-8 h-0.5 mx-1', modeStep > idx + 1 ? 'bg-[#406517]' : 'bg-gray-200')} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[300px]">
              {/* Initial Steps */}
              {wizardStep === 'product' && (
                <ProductTypeStep 
                  value={state.productType} 
                  onChange={(v) => {
                    const newOptions = v === 'mosquito_curtains' ? defaultMeshOptions : v === 'clear_vinyl' ? defaultVinylOptions : defaultRawOptions
                    setState(prev => ({ 
                      ...prev, 
                      productType: v, 
                      options: newOptions, 
                      instantQuote: { ...initialInstantQuote },
                    }))
                  }} 
                />
              )}
              
              {wizardStep === 'path' && (
                <ChoosePathStep
                  value={state.mode}
                  onChange={(mode) => setState(prev => ({ ...prev, mode }))}
                  onSelect={handlePathSelect}
                  productType={state.productType}
                />
              )}

              {/* Expert/Planner Mode Steps */}
              {wizardStep === 'mode-steps' && state.mode === 'planner' && (
                <>
                  {modeStep === 1 && <PhotosStep photos={state.photos} onPhotosChange={(photos) => setState(prev => ({ ...prev, photos }))} sessionId={state.sessionId} />}
                  {modeStep === 2 && <ContactStep data={state.contact} onChange={(contact) => setState(prev => ({ ...prev, contact }))} />}
                  {modeStep === 3 && <ReviewStep state={state} />}
                </>
              )}

              {/* Quote Mode - Single Step Instant Calculator */}
              {wizardStep === 'mode-steps' && state.mode === 'quote' && (state.productType === 'mosquito_curtains' || state.productType === 'clear_vinyl') && (
                <Stack gap="xl">
                  <InstantQuoteStep
                    productType={state.productType}
                    quoteState={state.instantQuote}
                    onQuoteChange={(iq) => setState(prev => ({ ...prev, instantQuote: iq }))}
                    price={quotePrice}
                    contact={state.contact}
                    onContactChange={(contact) => setState(prev => ({ ...prev, contact }))}
                    photos={state.photos}
                    onPhotosChange={(photos) => setState(prev => ({ ...prev, photos }))}
                    sessionId={state.sessionId}
                  />
                  {/* Educational content, guidance modals, videos, examples */}
                  <QuoteGuidance productType={state.productType} />
                </Stack>
              )}

              {/* DIY Mode */}
              {wizardStep === 'mode-steps' && state.mode === 'diy' && (
                state.productType === 'raw_materials' ? (
                  <FabricConfigurator 
                    initialFabricType={'meshType' in state.options ? state.options.meshType : 'heavy_mosquito'}
                    initialColor={'meshColor' in state.options ? state.options.meshColor : 'black'}
                    onAddToCart={handleFabricAddToCart} 
                  />
                ) : (
                  <DIYBuilder onAddToCart={handleDIYAddToCart} />
                )
              )}
            </div>

            {/* Navigation - Initial Steps */}
            {wizardStep !== 'mode-steps' && wizardStep !== 'path' && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                <Button variant="ghost" disabled={wizardStep === 'product'}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={() => {
                  if (wizardStep === 'product' && state.productType) setWizardStep('path')
                }} disabled={wizardStep === 'product' && !state.productType}>
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Navigation - Planner Mode Steps */}
            {wizardStep === 'mode-steps' && state.mode === 'planner' && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                <Button variant="ghost" onClick={() => {
                  if (modeStep === 1) { setWizardStep('path'); setModeStep(0) }
                  else setModeStep(modeStep - 1)
                }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {modeStep === modeInfo.total ? (
                  <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <><Spinner size="sm" className="mr-2" />Submitting...</> : <>Submit Project<CheckCircle className="ml-2 w-5 h-5" /></>}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => setModeStep(modeStep + 1)} disabled={!canProceedModeStep()}>
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Navigation - Quote Mode */}
            {wizardStep === 'mode-steps' && state.mode === 'quote' && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                <Button variant="ghost" onClick={() => {
                  setWizardStep('path')
                  setModeStep(0)
                }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !canSubmitQuote()}
                >
                  {isSubmitting 
                    ? <><Spinner size="sm" className="mr-2" />Submitting...</> 
                    : <>Submit Quote<CheckCircle className="ml-2 w-5 h-5" /></>
                  }
                </Button>
              </div>
            )}
          </div>
        </section>

      </Stack>
    </Container>
  )
}
