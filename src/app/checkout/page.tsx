'use client'

/**
 * /checkout — Multi-step checkout flow.
 *
 * Steps:
 * 1. Contact Info — name, email, phone
 * 2. Shipping Address — street, city, state, zip, country (triggers shipping/tax calc)
 * 3. Order Review — line items, subtotal, shipping, tax, total
 * 4. Payment — Stripe integration (stubbed for now)
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  FileText,
  CreditCard,
  Check,
  ShoppingCart,
  Package,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Spinner,
} from '@/lib/design-system'
import { useCart, type CartLineItem } from '@/hooks/useCart'

// =============================================================================
// CONSTANTS
// =============================================================================

const STEPS = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'review', label: 'Review', icon: FileText },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
]

function formatMoney(value: number) {
  return value.toFixed(2)
}

// =============================================================================
// STEP INDICATOR
// =============================================================================

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {STEPS.map((step, idx) => {
        const Icon = step.icon
        const isActive = idx === currentStep
        const isCompleted = idx < currentStep
        return (
          <div key={step.id} className="flex items-center gap-2">
            {idx > 0 && (
              <div className={`hidden md:block w-8 h-px ${isCompleted ? 'bg-[#406517]' : 'bg-gray-200'}`} />
            )}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive ? 'bg-[#003365] text-white' : isCompleted ? 'bg-[#406517]/10 text-[#406517]' : 'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{step.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// STEP COMPONENTS
// =============================================================================

function ContactStep({
  contact,
  onChange,
}: {
  contact: { firstName: string; lastName: string; email: string; phone: string }
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-4">
      <Heading level={2}>Contact Information</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={contact.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={contact.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
            placeholder="Smith"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  )
}

function ShippingStep({
  address,
  onChange,
  isCalculating,
}: {
  address: { street: string; city: string; state: string; zip: string; country: string }
  onChange: (field: string, value: string) => void
  isCalculating: boolean
}) {
  return (
    <div className="space-y-4">
      <Heading level={2}>Shipping Address</Heading>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => onChange('street', e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
          placeholder="123 Main Street"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
            placeholder="Anytown"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
          >
            <option value="">Select State</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
          <input
            type="text"
            value={address.zip}
            onChange={(e) => onChange('zip', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
            placeholder="12345"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <select
          value={address.country}
          onChange={(e) => onChange('country', e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
      </div>
      {isCalculating && (
        <div className="flex items-center gap-2 text-sm text-gray-500 p-3 bg-gray-50 rounded-xl">
          <Spinner size="sm" />
          Calculating shipping & tax...
        </div>
      )}
    </div>
  )
}

function ReviewStep({
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingZone,
  taxRate,
}: {
  items: CartLineItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingZone: string | null
  taxRate: string | null
}) {
  return (
    <div className="space-y-6">
      <Heading level={2}>Order Review</Heading>

      {/* Line Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex-1 min-w-0">
              <Text className="font-medium text-gray-900 !mb-0">{item.name}</Text>
              <Text size="sm" className="text-gray-500 !mb-0">{item.description}</Text>
              {item.quantity > 1 && (
                <Text size="sm" className="text-gray-400 !mb-0">Qty: {item.quantity}</Text>
              )}
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              ${formatMoney(item.totalPrice)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">${formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Shipping{shippingZone && <span className="text-gray-400 ml-1">({shippingZone})</span>}
          </span>
          <span className="font-medium">{shipping > 0 ? `$${formatMoney(shipping)}` : 'Calculated'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Tax{taxRate && <span className="text-gray-400 ml-1">({taxRate})</span>}
          </span>
          <span className="font-medium">{tax > 0 ? `$${formatMoney(tax)}` : 'Calculated'}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-[#406517]">${formatMoney(total)}</span>
        </div>
      </div>
    </div>
  )
}

function PaymentStep() {
  return (
    <div className="space-y-6">
      <Heading level={2}>Payment</Heading>

      <Card variant="outlined" className="!p-8 text-center !border-dashed">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <Heading level={3} className="!mb-2">Payment Integration Coming Soon</Heading>
        <Text className="text-gray-500 !mb-4 max-w-md mx-auto">
          Secure Stripe payment integration is being configured. For now, please call us or email
          to complete your order.
        </Text>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" asChild>
            <a href="tel:+18889046326">
              Call (888) 904-6326
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="mailto:info@mosquitocurtains.com">
              Email Us
            </a>
          </Button>
        </div>
      </Card>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3">
          <ShieldCheck className="w-6 h-6 text-[#406517] mx-auto mb-1" />
          <Text size="sm" className="!mb-0 font-medium">Secure</Text>
        </div>
        <div className="text-center p-3">
          <Truck className="w-6 h-6 text-[#003365] mx-auto mb-1" />
          <Text size="sm" className="!mb-0 font-medium">Fast Shipping</Text>
        </div>
        <div className="text-center p-3">
          <Package className="w-6 h-6 text-[#B30158] mx-auto mb-1" />
          <Text size="sm" className="!mb-0 font-medium">Satisfaction Guaranteed</Text>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function CheckoutPage() {
  const {
    cart,
    isLoading,
    isCalculatingShipping,
    shippingZoneName,
    taxRateName,
    itemCount,
    updateContact,
    updateShippingAddress,
  } = useCart()

  const [step, setStep] = useState(0)
  const [contact, setContact] = useState({
    firstName: cart?.contact?.firstName || '',
    lastName: cart?.contact?.lastName || '',
    email: cart?.contact?.email || '',
    phone: cart?.contact?.phone || '',
  })
  const [address, setAddress] = useState({
    street: cart?.shippingAddress?.street || '',
    city: cart?.shippingAddress?.city || '',
    state: cart?.shippingAddress?.state || '',
    zip: cart?.shippingAddress?.zip || '',
    country: cart?.shippingAddress?.country || 'US',
  })

  const handleContactChange = useCallback((field: string, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddressChange = useCallback((field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }, [])

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return contact.firstName && contact.lastName && contact.email && contact.phone
      case 1: return address.street && address.city && address.state && address.zip
      case 2: return true
      default: return false
    }
  }, [step, contact, address])

  const handleNext = useCallback(async () => {
    if (step === 0) {
      updateContact(contact)
    }
    if (step === 1) {
      await updateShippingAddress(address)
    }
    setStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }, [step, contact, address, updateContact, updateShippingAddress])

  if (isLoading) {
    return (
      <Container size="md">
        <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
      </Container>
    )
  }

  if (!cart || itemCount === 0) {
    return (
      <Container size="md">
        <div className="py-24 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <Heading level={2}>Your cart is empty</Heading>
          <Text className="text-gray-500 !mb-6">Add some products before checking out.</Text>
          <Button variant="primary" asChild>
            <Link href="/order">
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container size="md">
      <Stack gap="lg">
        {/* Step Indicator */}
        <section className="pt-4">
          <StepIndicator currentStep={step} />
        </section>

        {/* Step Content */}
        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            {step === 0 && <ContactStep contact={contact} onChange={handleContactChange} />}
            {step === 1 && <ShippingStep address={address} onChange={handleAddressChange} isCalculating={isCalculatingShipping} />}
            {step === 2 && (
              <ReviewStep
                items={cart.items}
                subtotal={cart.subtotal}
                shipping={cart.shipping}
                tax={cart.tax}
                total={cart.total}
                shippingZone={shippingZoneName}
                taxRate={taxRateName}
              />
            )}
            {step === 3 && <PaymentStep />}
          </Card>
        </section>

        {/* Navigation */}
        <section>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(prev => Math.max(prev - 1, 0))}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < STEPS.length - 1 && (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed || isCalculatingShipping}
                className="!rounded-full !px-6"
              >
                {step === 2 ? 'Proceed to Payment' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </section>
      </Stack>
    </Container>
  )
}
