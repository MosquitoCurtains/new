'use client'

/**
 * DIYBuilder Component
 *
 * Step 1: Options + Contact form → saves project
 * Step 2: PanelBuilder (configure sides & panels)
 * Step 3: Choose next step (Instant Quote or Expert Assistance)
 */

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Card, Stack, Heading, Text, Button, Input } from '@/lib/design-system'
import { QuickSetup, type QuickSetupOptions, type MeshOptions, type VinylOptions } from './QuickSetup'
import PanelBuilder from '@/components/plan/PanelBuilder'
import type { MeshType, MeshColor } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export type DIYProductType = 'mosquito_curtains' | 'clear_vinyl'

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface DIYBuilderProps {
  productType: DIYProductType
}

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_MESH_OPTIONS: MeshOptions = {
  meshType: 'heavy_mosquito',
  meshColor: 'black',
  topAttachment: 'velcro',
}

const DEFAULT_VINYL_OPTIONS: VinylOptions = {
  panelSize: 'medium',
  canvasColor: 'tbd',
  topAttachment: 'velcro',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DIYBuilder({ productType }: DIYBuilderProps) {
  const isMesh = productType === 'mosquito_curtains'
  const [options, setOptions] = useState<QuickSetupOptions>(
    isMesh ? DEFAULT_MESH_OPTIONS : DEFAULT_VINYL_OPTIONS
  )
  const [contact, setContact] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'options' | 'builder'>('options')

  const brandColor = productType === 'mosquito_curtains' ? '#406517' : '#003365'
  const apiProduct = productType === 'mosquito_curtains' ? 'mosquito_curtains' : 'clear_vinyl'

  const meshOpts = options as MeshOptions
  const vinylOpts = options as VinylOptions
  const canProceedContact = !!(contact.firstName && contact.lastName && contact.email && contact.phone)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        product: apiProduct,
        projectType: 'diy',
        meshType: isMesh ? meshOpts.meshType : null,
        topAttachment: isMesh ? meshOpts.topAttachment : vinylOpts.topAttachment,
        notes: JSON.stringify({ options }),
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to submit')
      // Move to panel builder step
      setStep('builder')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to save your project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Step 2: Panel Builder ──
  if (step === 'builder' && isMesh) {
    return (
      <PanelBuilder
        initialMeshType={meshOpts.meshType as MeshType}
        initialMeshColor={meshOpts.meshColor as MeshColor}
        contactInfo={{
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          phone: contact.phone,
        }}
        basePath="/start-project/mosquito-curtains/diy-builder"
      />
    )
  }

  // ── Step 1: Options + Contact ──
  return (
    <Stack gap="lg">
      {/* Options section with step badge */}
      <div>
        <div className="flex justify-center mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            1
          </div>
        </div>
        <Heading level={3} className="!mb-4 text-center">
          Choose Your Options
        </Heading>
        <QuickSetup
          productType={isMesh ? 'mosquito_curtains' : 'clear_vinyl'}
          options={options}
          onChange={(next) => setOptions(next)}
          simplifiedAttachments
          hideHeading
        />
      </div>

      {/* Quick Contact (no step number) */}
      <div>
        <Text className="text-gray-600 !mb-4">
          We will save your project options for you and send you a link to retrieve them 24/7.
        </Text>
        <Card variant="outlined" className="!p-6">
          <Stack gap="md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                  placeholder="First name"
                  value={contact.firstName}
                  onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                  placeholder="Last name"
                  value={contact.lastName}
                  onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canProceedContact || isSubmitting}
                className="w-auto"
              >
                {isSubmitting ? 'Saving...' : (
                  <span className="inline-flex items-center gap-2">
                    Save Options and Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          </Stack>
        </Card>
      </div>
    </Stack>
  )
}

export default DIYBuilder
