'use client'

/**
 * Start Project Page
 * 
 * Multi-mode project wizard with three pathways:
 * 1. Planner Mode - Contact us with photos for expert assistance
 * 2. Instant Quote Mode - Quick specs for instant estimate  
 * 3. DIY Builder Mode - Full panel-by-panel configuration
 */

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Package, 
  Ruler, 
  Camera, 
  CheckCircle,
  Calculator,
  Phone,
  Mail,
  Plus,
  Trash2,
  ShoppingCart,
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
} from '@/lib/design-system'
import { ModeSelector, ProjectMode, EmailGateModal, PhotoUploader, UploadedPhoto, DIYBuilder, DIYProject } from '@/components/project'
import { priceCalculator, MeshPanelCartItem, TrackCartItem } from '@/lib/pricing'
import type { MeshPanelConfig, MeshType, TopAttachment, PanelColor } from '@/lib/pricing/types'
import { useRouter } from 'next/navigation'

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'mosquito_curtains' | 'clear_vinyl' | 'both' | null

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface QuickSpecs {
  productType: ProductType
  meshType: MeshType
  topAttachment: TopAttachment
  projectWidth: number
  numberOfSides: number
  shipLocation: 'usa' | 'canada' | 'international'
}

interface PanelConfig extends MeshPanelConfig {
  id: string
  name: string
}

interface WizardState {
  mode: ProjectMode | null
  email: string | null
  sessionId: string
  contact: ContactInfo
  specs: QuickSpecs
  panels: PanelConfig[]
  photos: UploadedPhoto[]
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: WizardState = {
  mode: null,
  email: null,
  sessionId: `session-${Date.now()}`,
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  specs: {
    productType: null,
    meshType: 'heavy_mosquito',
    topAttachment: 'tracking_short',
    projectWidth: 20,
    numberOfSides: 3,
    shipLocation: 'usa',
  },
  panels: [],
  photos: [],
}

// =============================================================================
// QUICK PRICE CALCULATOR (for Instant Quote mode)
// =============================================================================

function calculateQuickPrice(specs: QuickSpecs) {
  if (!specs.productType || !specs.topAttachment) {
    return { subtotal: 0, shipping: 0, total: 0 }
  }

  // Base price per linear foot
  let pricePerFoot = 35
  
  // Mesh type adjustments
  if (specs.meshType === 'no_see_um') pricePerFoot += 5
  if (specs.meshType === 'shade') pricePerFoot += 8
  
  // Attachment adjustments
  if (specs.topAttachment === 'tracking_short' || specs.topAttachment === 'tracking_tall') {
    pricePerFoot += 15
  }
  if (specs.topAttachment === 'tracking_tall') {
    pricePerFoot += 10
  }
  
  // Clear vinyl is more expensive
  if (specs.productType === 'clear_vinyl') {
    pricePerFoot += 20
  }
  
  // Calculate subtotal
  let subtotal = specs.projectWidth * pricePerFoot
  
  // Add per-panel cost (fasteners, etc)
  const panelsEstimate = specs.numberOfSides + 1
  subtotal += panelsEstimate * 45
  
  // Shipping calculation
  let shipping = 35 // Base
  shipping += Math.ceil(specs.projectWidth / 20) * 15
  
  if (specs.shipLocation === 'canada') shipping += 50
  if (specs.shipLocation === 'international') shipping += 100
  
  return {
    subtotal: Math.round(subtotal),
    shipping: Math.round(shipping),
    total: Math.round(subtotal + shipping),
  }
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function ContactStep({ 
  data, 
  onChange 
}: { 
  data: ContactInfo
  onChange: (data: ContactInfo) => void 
}) {
  return (
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <Heading level={2}>Your Contact Information</Heading>
        <Text className="text-gray-400">
          So we can reach you about your project.
        </Text>
      </div>

      <Card className="!p-6 !bg-gray-900/50 !border-gray-700">
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              First Name *
            </label>
            <Input
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Name *
            </label>
            <Input
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone *
            </label>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>
        </Grid>
      </Card>
    </Stack>
  )
}

function ProductStep({ 
  value, 
  onChange 
}: { 
  value: ProductType
  onChange: (value: ProductType) => void 
}) {
  const options = [
    {
      id: 'mosquito_curtains',
      title: 'Mosquito Curtains',
      description: 'Screen mesh to keep bugs out while enjoying fresh air',
      image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    },
    {
      id: 'clear_vinyl',
      title: 'Clear Vinyl Panels',
      description: 'Weather panels to block wind, rain & cold',
      image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    },
    {
      id: 'both',
      title: 'Both Products',
      description: 'Interchangeable system for year-round use',
      image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    },
  ]

  return (
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Package className="w-8 h-8 text-teal-400" />
        </div>
        <Heading level={2}>What Are You Looking For?</Heading>
        <Text className="text-gray-400">
          Select the product type for your project.
        </Text>
      </div>

      <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id as ProductType)}
            className={`text-left rounded-2xl overflow-hidden border-2 transition-all ${
              value === option.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <Frame ratio="4/3">
              <img
                src={option.image}
                alt={option.title}
                className="w-full h-full object-cover"
              />
            </Frame>
            <div className="p-4 bg-gray-900">
              <div className="flex items-center justify-between mb-1">
                <Heading level={4} className="!mb-0 text-white">{option.title}</Heading>
                {value === option.id && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
              <Text size="sm" className="text-gray-400 !mb-0">
                {option.description}
              </Text>
            </div>
          </button>
        ))}
      </Grid>
    </Stack>
  )
}

function QuickSpecsStep({ 
  specs, 
  onChange,
  price,
}: { 
  specs: QuickSpecs
  onChange: (specs: QuickSpecs) => void
  price: { subtotal: number; shipping: number; total: number }
}) {
  const meshOptions = [
    { id: 'heavy_mosquito', label: 'Heavy Mosquito', note: '(Most Popular)' },
    { id: 'no_see_um', label: 'No-See-Um', note: '(For tiny flies)' },
    { id: 'shade', label: 'Shade Mesh', note: '(Shade + bugs)' },
  ]

  const attachmentOptions = [
    { id: 'tracking_short', label: 'Tracking < 10ft' },
    { id: 'tracking_tall', label: 'Tracking > 10ft' },
    { id: 'velcro', label: 'Velcro (Fixed)' },
    { id: 'grommets', label: 'Grommets' },
  ]

  return (
    <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
      <div className="md:col-span-2">
        <Stack gap="lg">
          <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center">
              <Ruler className="w-8 h-8 text-purple-400" />
            </div>
            <Heading level={2}>Project Specifications</Heading>
            <Text className="text-gray-400">
              Tell us about your project to get an instant estimate.
            </Text>
          </div>

          {/* Mesh Type */}
          {(specs.productType === 'mosquito_curtains' || specs.productType === 'both') && (
            <Card className="!p-4 !bg-gray-900/50 !border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Mesh Type
              </label>
              <div className="flex flex-wrap gap-2">
                {meshOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onChange({ ...specs, meshType: opt.id as MeshType })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      specs.meshType === opt.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Top Attachment */}
          <Card className="!p-4 !bg-gray-900/50 !border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Top Attachment
            </label>
            <div className="flex flex-wrap gap-2">
              {attachmentOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ ...specs, topAttachment: opt.id as TopAttachment })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    specs.topAttachment === opt.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Dimensions */}
          <Card className="!p-4 !bg-gray-900/50 !border-gray-700">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Project Width (ft)
                </label>
                <select
                  value={specs.projectWidth}
                  onChange={(e) => onChange({ ...specs, projectWidth: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {Array.from({ length: 196 }, (_, i) => i + 5).map((n) => (
                    <option key={n} value={n}>{n} ft</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Open Sides
                </label>
                <select
                  value={specs.numberOfSides}
                  onChange={(e) => onChange({ ...specs, numberOfSides: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value={1}>1 Side</option>
                  <option value={2}>2 Sides</option>
                  <option value={3}>3 Sides</option>
                  <option value={4}>4 Sides</option>
                  <option value={5}>More than 4</option>
                </select>
              </div>
            </Grid>
          </Card>
        </Stack>
      </div>

      {/* Price Calculator */}
      <div>
        <div className="sticky top-4">
          <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-primary/10 !to-teal-500/10 !border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <Heading level={4} className="!mb-0 text-white">Instant Estimate</Heading>
            </div>

            <Stack gap="sm">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-white">${price.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-white">${price.shipping.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Estimated Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${price.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </Stack>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <Text size="sm" className="text-gray-400">
                This estimate is typically within 5% of actual cost.
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </Grid>
  )
}

function PhotosStep({ 
  photos,
  onPhotosChange,
  sessionId,
}: { 
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  sessionId: string
}) {
  return (
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Camera className="w-8 h-8 text-orange-400" />
        </div>
        <Heading level={2}>Add Photos</Heading>
        <Text className="text-gray-400">
          Photos help our planning team give you a more accurate quote and faster turnaround.
        </Text>
      </div>

      <PhotoUploader
        sessionId={sessionId}
        maxFiles={10}
        onUploadComplete={onPhotosChange}
      />

      <Card variant="outlined" className="!p-4 !bg-teal-500/10 !border-teal-500/30">
        <Text size="sm" className="text-teal-300">
          <strong>Tip:</strong> Step BACK and zoom OUT. We need to see full sides of your space 
          with all fastening surfaces visible. 2-4 photos showing all sides is ideal.
        </Text>
      </Card>
    </Stack>
  )
}

function ReviewStep({ 
  state,
  price,
}: { 
  state: WizardState
  price: { subtotal: number; shipping: number; total: number }
}) {
  const { contact, specs, photos, mode } = state

  return (
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <Heading level={2}>Review Your Project</Heading>
        <Text className="text-gray-400">
          Confirm your details before submitting.
        </Text>
      </div>

      <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
        <Card className="!p-6 !bg-gray-900/50 !border-gray-700">
          <Heading level={4} className="!mb-4 text-white">Contact Information</Heading>
          <Stack gap="sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <Text className="text-gray-300">{contact.firstName} {contact.lastName}</Text>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <Text className="text-gray-300">{contact.email}</Text>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <Text className="text-gray-300">{contact.phone}</Text>
            </div>
          </Stack>
        </Card>

        <Card className="!p-6 !bg-gray-900/50 !border-gray-700">
          <Heading level={4} className="!mb-4 text-white">Project Details</Heading>
          <Stack gap="sm">
            <div className="flex justify-between">
              <Text className="text-gray-500">Mode</Text>
              <Text className="font-medium text-white capitalize">{mode}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-gray-500">Product</Text>
              <Text className="font-medium text-white">
                {specs.productType?.replace(/_/g, ' ')}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-gray-500">Photos</Text>
              <Text className="font-medium text-white">{photos.length} uploaded</Text>
            </div>
          </Stack>
        </Card>
      </Grid>

      <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-primary/10 !to-teal-500/10 !border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <Heading level={4} className="!mb-0 text-white">Estimated Total</Heading>
          <span className="text-3xl font-bold text-primary">
            ${price.total.toLocaleString()}
          </span>
        </div>
        <Text size="sm" className="text-gray-400">
          A project planner will review your submission and contact you within 1 business day 
          to finalize measurements and answer any questions.
        </Text>
      </Card>
    </Stack>
  )
}

// =============================================================================
// MAIN WIZARD COMPONENT
// =============================================================================

export default function StartProjectPage() {
  const router = useRouter()
  const [state, setState] = useState<WizardState>(initialState)
  const [step, setStep] = useState(0) // 0 = mode selection
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const price = useMemo(() => calculateQuickPrice(state.specs), [state.specs])

  // Handle DIY add to cart
  const handleDIYAddToCart = async (project: DIYProject, totals: { total: number }) => {
    // Store cart data in localStorage
    const cartData = {
      type: 'diy',
      project,
      totals,
      contact: state.contact,
      sessionId: state.sessionId,
      timestamp: Date.now(),
    }
    localStorage.setItem('mc_cart', JSON.stringify(cartData))
    router.push('/cart')
  }

  // Define steps based on mode
  const getSteps = useCallback(() => {
    switch (state.mode) {
      case 'planner':
        return [
          { title: 'Product', icon: Package },
          { title: 'Photos', icon: Camera },
          { title: 'Contact', icon: User },
          { title: 'Review', icon: CheckCircle },
        ]
      case 'quote':
        return [
          { title: 'Product', icon: Package },
          { title: 'Specs', icon: Ruler },
          { title: 'Contact', icon: User },
          { title: 'Review', icon: CheckCircle },
        ]
      case 'diy':
        return [
          { title: 'Product', icon: Package },
          { title: 'Panels', icon: Ruler },
          { title: 'Contact', icon: User },
          { title: 'Cart', icon: ShoppingCart },
        ]
      default:
        return []
    }
  }, [state.mode])

  const steps = getSteps()

  // Handle mode selection
  const handleModeSelect = (mode: ProjectMode) => {
    setState(prev => ({ ...prev, mode }))
    setShowEmailGate(true)
  }

  // Handle email capture
  const handleEmailSubmit = (data: { email: string; firstName?: string }) => {
    setState(prev => ({ 
      ...prev, 
      email: data.email,
      contact: { ...prev.contact, email: data.email, firstName: data.firstName || '' }
    }))
    setShowEmailGate(false)
    setStep(1) // Move to first step after mode selection
  }

  // Check if can proceed to next step
  const canProceed = () => {
    if (state.mode === 'planner') {
      switch (step) {
        case 1: return state.specs.productType !== null
        case 2: return true // Photos optional
        case 3: return state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone
        default: return true
      }
    }
    if (state.mode === 'quote') {
      switch (step) {
        case 1: return state.specs.productType !== null
        case 2: return state.specs.topAttachment !== null
        case 3: return state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone
        default: return true
      }
    }
    return true
  }

  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: state.mode,
          contact: state.contact,
          specs: state.specs,
          photos: state.photos.map(p => ({ url: p.publicUrl, key: p.key })),
          estimatedTotal: price.total,
        }),
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

  // Success screen
  if (submitted) {
    return (
      <Container size="md">
        <div className="min-h-[60vh] flex items-center justify-center py-12">
          <Card className="!p-8 text-center !bg-gray-900/50 !border-gray-700">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <Heading level={2} className="!mb-2 text-white">Project Submitted!</Heading>
            <Text className="text-gray-400 mb-6">
              Thank you, {state.contact.firstName}! A project planner will review your submission 
              and contact you within 1 business day.
            </Text>
            <Text className="text-sm text-gray-500 mb-6">
              Estimated project total: <strong className="text-primary">${price.total.toLocaleString()}</strong>
            </Text>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" asChild>
                <Link href="/">Return Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:7706454745">
                  Call (770) 645-4745
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    )
  }

  // Mode selection screen
  if (step === 0) {
    return (
      <Container size="xl">
        <div className="py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading level={1} className="text-white">Start Your Project</Heading>
            <Text className="text-gray-400">
              Get an instant estimate and connect with our planning team.
            </Text>
          </div>

          {/* Mode Selector */}
          <ModeSelector onSelectMode={handleModeSelect} />

          {/* Email Gate Modal */}
          <EmailGateModal
            isOpen={showEmailGate}
            onClose={() => setShowEmailGate(false)}
            onSubmit={handleEmailSubmit}
          />
        </div>
      </Container>
    )
  }

  // Wizard steps
  return (
    <Container size="xl">
      <Stack gap="lg" className="py-6">
        {/* Header */}
        <div className="text-center">
          <Heading level={1} className="text-white">
            {state.mode === 'planner' ? 'Talk to an Expert' :
             state.mode === 'quote' ? 'Get an Instant Quote' :
             'Build Your Project'}
          </Heading>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  onClick={() => idx < step && setStep(idx + 1)}
                  disabled={idx + 1 >= step}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    idx + 1 === step
                      ? 'bg-primary text-white'
                      : idx + 1 < step
                      ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    idx + 1 < step ? 'bg-primary' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Planner Mode Steps */}
          {state.mode === 'planner' && (
            <>
              {step === 1 && (
                <ProductStep 
                  value={state.specs.productType} 
                  onChange={(v) => setState(prev => ({ 
                    ...prev, 
                    specs: { ...prev.specs, productType: v } 
                  }))} 
                />
              )}
              {step === 2 && (
                <PhotosStep 
                  photos={state.photos}
                  onPhotosChange={(photos) => setState(prev => ({ ...prev, photos }))}
                  sessionId={state.sessionId}
                />
              )}
              {step === 3 && (
                <ContactStep 
                  data={state.contact} 
                  onChange={(contact) => setState(prev => ({ ...prev, contact }))} 
                />
              )}
              {step === 4 && <ReviewStep state={state} price={price} />}
            </>
          )}

          {/* Quote Mode Steps */}
          {state.mode === 'quote' && (
            <>
              {step === 1 && (
                <ProductStep 
                  value={state.specs.productType} 
                  onChange={(v) => setState(prev => ({ 
                    ...prev, 
                    specs: { ...prev.specs, productType: v } 
                  }))} 
                />
              )}
              {step === 2 && (
                <QuickSpecsStep 
                  specs={state.specs}
                  onChange={(specs) => setState(prev => ({ ...prev, specs }))}
                  price={price}
                />
              )}
              {step === 3 && (
                <ContactStep 
                  data={state.contact} 
                  onChange={(contact) => setState(prev => ({ ...prev, contact }))} 
                />
              )}
              {step === 4 && <ReviewStep state={state} price={price} />}
            </>
          )}

          {/* DIY Mode - Full Panel Builder */}
          {state.mode === 'diy' && (
            <DIYBuilder onAddToCart={handleDIYAddToCart} />
          )}
        </div>

        {/* Navigation */}
        {state.mode !== 'diy' && (
          <div className="flex justify-between items-center pt-6 border-t border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step === steps.length ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
                <CheckCircle className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </Stack>
    </Container>
  )
}
