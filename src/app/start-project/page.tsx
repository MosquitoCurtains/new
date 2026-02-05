'use client'

/**
 * Start Project Page
 * 
 * SIMPLIFIED FLOW:
 * 1. Product Type Selection (Mosquito/Clear Vinyl/Raw Materials)
 * 2. Choose Your Path (Expert/Quote/DIY)
 * 3. Mode-specific steps:
 *    - Expert: Photos → Contact → Review (FAST - 2 clicks to upload!)
 *    - Quote: Options → Specs → Contact → Review
 *    - DIY: Options → Panel Builder
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
  Sparkles,
  Bug,
  Snowflake,
  MessageSquare,
  Hammer,
  Check,
  Scissors,
  Ruler,
  SlidersHorizontal,
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
import { EmailGateModal, PhotoUploader, UploadedPhoto, DIYBuilder, DIYProject, FabricConfigurator, FabricOrder, QuickSetup, QuickSetupOptions, MeshOptions, VinylOptions, RawMaterialOptions } from '@/components/project'
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

interface QuickSpecs {
  productType: ProductType
  projectWidth: number
  numberOfSides: number
  shipLocation: 'usa' | 'canada' | 'international'
}

interface WizardState {
  productType: ProductType
  options: QuickSetupOptions
  mode: ProjectMode
  email: string | null
  sessionId: string
  contact: ContactInfo
  specs: QuickSpecs
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

const initialState: WizardState = {
  productType: null,
  options: defaultMeshOptions,
  mode: null,
  email: null,
  sessionId: `session-${Date.now()}`,
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  specs: { productType: null, projectWidth: 20, numberOfSides: 3, shipLocation: 'usa' },
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
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    icon: Bug,
    color: '#406517',
  },
  {
    id: 'clear_vinyl' as const,
    title: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    description: 'Custom vinyl panels - block wind, rain & cold',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    icon: Snowflake,
    color: '#003365',
  },
  {
    id: 'raw_materials' as const,
    title: 'Raw Mesh Fabric',
    subtitle: 'DIY Materials',
    description: 'Bulk netting by the yard - up to 12ft wide',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg',
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
// PRICE CALCULATOR
// =============================================================================

function calculateQuickPrice(specs: QuickSpecs, options: QuickSetupOptions) {
  if (!specs.productType) return { subtotal: 0, shipping: 0, total: 0 }

  let pricePerFoot = 35
  if ('meshType' in options) {
    if (options.meshType === 'no_see_um') pricePerFoot += 5
    if (options.meshType === 'shade') pricePerFoot += 8
    if (options.topAttachment === 'standard_track' || options.topAttachment === 'heavy_track') pricePerFoot += 15
  }
  if (specs.productType === 'clear_vinyl') pricePerFoot += 20
  
  let subtotal = specs.projectWidth * pricePerFoot
  subtotal += (specs.numberOfSides + 1) * 45
  
  let shipping = 35 + Math.ceil(specs.projectWidth / 20) * 15
  if (specs.shipLocation === 'canada') shipping += 50
  if (specs.shipLocation === 'international') shipping += 100
  
  return { subtotal: Math.round(subtotal), shipping: Math.round(shipping), total: Math.round(subtotal + shipping) }
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function ProductTypeStep({ value, onChange }: { value: ProductType; onChange: (value: ProductType) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading level={2} className="!mb-2">What Are You Looking For?</Heading>
        <Text className="text-gray-600">Select your product type to get started</Text>
      </div>
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
              <Frame ratio="4/3">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </Frame>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" style={{ color: product.color }} />
                  <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                    {product.subtitle}
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Heading level={4} className="!mb-0 text-gray-900">{product.title}</Heading>
                  {isSelected && <CheckCircle className="w-5 h-5 text-[#406517]" />}
                </div>
                <Text size="sm" className="text-gray-600 !mb-0 mt-1">{product.description}</Text>
              </div>
            </button>
          )
        })}
      </Grid>
    </div>
  )
}

function ChoosePathStep({ value, onChange, onSelect }: { value: ProjectMode; onChange: (mode: ProjectMode) => void; onSelect: (mode: ProjectMode) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading level={2} className="!mb-2">How Can We Help?</Heading>
        <Text className="text-gray-600">Choose the approach that works best for you</Text>
      </div>
      <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
        {PATH_OPTIONS.map((path) => {
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
                'relative text-left p-6 rounded-2xl border-2 transition-all bg-white',
                'hover:transform hover:-translate-y-1 hover:shadow-lg',
                isSelected ? 'border-[#406517] bg-[#406517]/5 ring-4 ring-[#406517]/20' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: path.color, borderColor: path.color }}>
                {path.badge}
              </Badge>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${path.color}15` }}>
                <Icon className="w-6 h-6" style={{ color: path.color }} />
              </div>
              <Heading level={4} className={cn('!mb-1', isSelected && 'text-[#406517]')}>{path.title}</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">{path.description}</Text>
              <ul className="space-y-1">
                {path.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#406517] flex-shrink-0" />
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
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-[#406517]" />
        </div>
        <Heading level={2}>Your Contact Information</Heading>
        <Text className="text-gray-600">So we can reach you about your project.</Text>
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
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FFA501]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Camera className="w-8 h-8 text-[#FFA501]" />
        </div>
        <Heading level={2}>Upload Photos of Your Space</Heading>
        <Text className="text-gray-600">Photos help us understand your project and give you an accurate quote.</Text>
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

function QuickSpecsStep({ specs, options, onChange, price }: { specs: QuickSpecs; options: QuickSetupOptions; onChange: (specs: QuickSpecs) => void; price: { subtotal: number; shipping: number; total: number } }) {
  return (
    <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
      <div className="md:col-span-2">
        <Stack gap="lg">
          <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-[#B30158]/10 rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center">
              <Ruler className="w-8 h-8 text-[#B30158]" />
            </div>
            <Heading level={2}>Project Dimensions</Heading>
            <Text className="text-gray-600">Tell us about your project size.</Text>
          </div>
          <Card variant="elevated" className="!p-4">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Project Width (ft)</label>
                <select value={specs.projectWidth} onChange={(e) => onChange({ ...specs, projectWidth: Number(e.target.value) })} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]">
                  {Array.from({ length: 196 }, (_, i) => i + 5).map((n) => (<option key={n} value={n}>{n} ft</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Open Sides</label>
                <select value={specs.numberOfSides} onChange={(e) => onChange({ ...specs, numberOfSides: Number(e.target.value) })} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517]">
                  <option value={1}>1 Side</option><option value={2}>2 Sides</option><option value={3}>3 Sides</option><option value={4}>4 Sides</option><option value={5}>More than 4</option>
                </select>
              </div>
            </Grid>
          </Card>
        </Stack>
      </div>
      <div>
        <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-[#406517]/5 !via-white !to-[#003365]/5 !border-[#406517]/20 sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-[#406517]" />
            <Heading level={4} className="!mb-0">Instant Estimate</Heading>
          </div>
          <Stack gap="sm">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">${price.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="text-gray-500 italic">Calculated at checkout</span></div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between"><span className="font-semibold text-gray-900">Estimated Total</span><span className="text-xl font-bold text-[#406517]">${price.subtotal.toLocaleString()}+</span></div>
            </div>
          </Stack>
          <Text size="sm" className="text-gray-500 mt-4">Actual price depends on final measurements.</Text>
        </Card>
      </div>
    </Grid>
  )
}

function ReviewStep({ state, price }: { state: WizardState; price: { subtotal: number; shipping: number; total: number } }) {
  return (
    <Stack gap="lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#406517]" />
        </div>
        <Heading level={2}>Review Your Project</Heading>
        <Text className="text-gray-600">Confirm your details before submitting.</Text>
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
        <div className="flex items-center justify-between mb-4">
          <Heading level={4} className="!mb-0">Estimated Total</Heading>
          <span className="text-3xl font-bold text-[#406517]">${price.subtotal.toLocaleString()}+</span>
        </div>
        <Text size="sm" className="text-gray-500">A project planner will review your submission and contact you within 1 business day.</Text>
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
  const [wizardStep, setWizardStep] = useState<WizardStep>('product')
  const [modeStep, setModeStep] = useState(0)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const price = useMemo(() => calculateQuickPrice(
    { ...state.specs, productType: state.productType },
    state.options
  ), [state.specs, state.productType, state.options])

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

  // Handle email capture
  const handleEmailSubmit = (data: { email: string; firstName?: string }) => {
    setState(prev => ({ ...prev, email: data.email, contact: { ...prev.contact, email: data.email, firstName: data.firstName || '' } }))
    setShowEmailGate(false)
    setWizardStep('mode-steps')
    setModeStep(1)
  }

  // Handle path selection - immediately proceed based on mode
  const handlePathSelect = (mode: ProjectMode) => {
    setState(prev => ({ ...prev, mode }))
    
    // Expert path - show email gate then go straight to photos
    if (mode === 'planner') {
      setShowEmailGate(true)
    }
    // Quote path - show email gate then go to options
    else if (mode === 'quote') {
      setShowEmailGate(true)
    }
    // DIY path - show email gate then go to builder
    else if (mode === 'diy') {
      setShowEmailGate(true)
    }
  }

  // Can proceed to next mode step?
  const canProceedModeStep = () => {
    if (state.mode === 'planner') {
      if (modeStep === 1) return true // Photos optional
      if (modeStep === 2) return state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone
    }
    if (state.mode === 'quote') {
      if (modeStep === 1) return true // Options
      if (modeStep === 2) return true // Specs
      if (modeStep === 3) return state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone
    }
    return true
  }

  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        email: state.contact.email,
        firstName: state.contact.firstName,
        lastName: state.contact.lastName,
        phone: state.contact.phone,
        product: state.productType,
        projectType: state.mode,
        meshType: 'meshType' in state.options ? state.options.meshType : null,
        topAttachment: 'topAttachment' in state.options ? state.options.topAttachment : null,
        totalWidth: state.specs.projectWidth,
        numberOfSides: state.specs.numberOfSides,
        notes: JSON.stringify({
          options: state.options,
          photos: state.photos.map(p => ({ url: p.publicUrl, key: p.key })),
        }),
        estimatedTotal: price.subtotal,
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
        total: 4,
        steps: ['Options', 'Specs', 'Contact', 'Review'],
        icons: [SlidersHorizontal, Ruler, User, CheckCircle]
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
          
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                <Sparkles className="w-4 h-4 mr-2" />
                We are here to help
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Start Your Project Today
              </h1>
            </div>

            {/* Progress - Initial Steps */}
            {wizardStep !== 'mode-steps' && (
              <div className="flex justify-center gap-2 mb-6">
                {['product', 'path'].map((step, idx) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      wizardStep === step ? 'bg-[#406517] text-white' :
                      ['product', 'path'].indexOf(wizardStep) > idx ? 'bg-[#406517]/20 text-[#406517]' :
                      'bg-gray-100 text-gray-400'
                    )}>
                      {idx + 1}
                    </div>
                    {idx < 1 && <div className={cn('w-12 h-0.5 mx-2', ['product', 'path'].indexOf(wizardStep) > idx ? 'bg-[#406517]' : 'bg-gray-200')} />}
                  </div>
                ))}
              </div>
            )}

            {/* Progress - Mode Steps */}
            {wizardStep === 'mode-steps' && state.mode !== 'diy' && (
              <div className="flex justify-center gap-2 mb-6">
                {modeInfo.steps.map((step, idx) => {
                  const Icon = modeInfo.icons[idx]
                  return (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                        modeStep === idx + 1 ? 'bg-[#406517] text-white' :
                        modeStep > idx + 1 ? 'bg-[#406517]/20 text-[#406517]' :
                        'bg-gray-100 text-gray-400'
                      )}>
                        <Icon className="w-4 h-4" />
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
            <div className="min-h-[400px]">
              {/* Initial Steps */}
              {wizardStep === 'product' && (
                <ProductTypeStep 
                  value={state.productType} 
                  onChange={(v) => {
                    const newOptions = v === 'mosquito_curtains' ? defaultMeshOptions : v === 'clear_vinyl' ? defaultVinylOptions : defaultRawOptions
                    setState(prev => ({ ...prev, productType: v, options: newOptions, specs: { ...prev.specs, productType: v } }))
                  }} 
                />
              )}
              
              {wizardStep === 'path' && (
                <ChoosePathStep
                  value={state.mode}
                  onChange={(mode) => setState(prev => ({ ...prev, mode }))}
                  onSelect={handlePathSelect}
                />
              )}

              {/* Expert/Planner Mode Steps */}
              {wizardStep === 'mode-steps' && state.mode === 'planner' && (
                <>
                  {modeStep === 1 && <PhotosStep photos={state.photos} onPhotosChange={(photos) => setState(prev => ({ ...prev, photos }))} sessionId={state.sessionId} />}
                  {modeStep === 2 && <ContactStep data={state.contact} onChange={(contact) => setState(prev => ({ ...prev, contact }))} />}
                  {modeStep === 3 && <ReviewStep state={state} price={price} />}
                </>
              )}

              {/* Quote Mode Steps */}
              {wizardStep === 'mode-steps' && state.mode === 'quote' && (
                <>
                  {modeStep === 1 && state.productType && (
                    <QuickSetup
                      productType={state.productType}
                      options={state.options}
                      onChange={(opts) => setState(prev => ({ ...prev, options: opts }))}
                    />
                  )}
                  {modeStep === 2 && <QuickSpecsStep specs={state.specs} options={state.options} onChange={(specs) => setState(prev => ({ ...prev, specs }))} price={price} />}
                  {modeStep === 3 && <ContactStep data={state.contact} onChange={(contact) => setState(prev => ({ ...prev, contact }))} />}
                  {modeStep === 4 && <ReviewStep state={state} price={price} />}
                </>
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
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
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

            {/* Navigation - Mode Steps (not DIY) */}
            {wizardStep === 'mode-steps' && state.mode !== 'diy' && (
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
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
          </div>
        </section>

        {/* Email Gate Modal */}
        <EmailGateModal isOpen={showEmailGate} onClose={() => setShowEmailGate(false)} onSubmit={handleEmailSubmit} />
      </Stack>
    </Container>
  )
}
