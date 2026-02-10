'use client'

/**
 * DIYBuilder Component
 *
 * Options + Quick Contact flow. Captures product options and contact info,
 * saves the project, and provides a share link.
 * No cart, no panels.
 */

import { useState } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Card, Stack, Heading, Text, Button, Input } from '@/lib/design-system'
import { QuickSetup, type QuickSetupOptions, type MeshOptions, type VinylOptions } from './QuickSetup'

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
  const [submitted, setSubmitted] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

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
      const data = await response.json()
      setShareUrl(data.shareUrl ? `${typeof window !== 'undefined' ? window.location.origin : ''}${data.shareUrl}` : null)
      setSubmitted(true)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to save your project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card
        variant="elevated"
        className="!p-8 md:!p-12 text-center max-w-2xl mx-auto"
        style={{ borderColor: `${brandColor}20` }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: `${brandColor}15` }}
        >
          <CheckCircle className="w-10 h-10" style={{ color: brandColor }} />
        </div>
        <Heading level={2} className="!mb-2">Project Saved!</Heading>
        <Text className="text-gray-600 mb-6">
          We&apos;ve saved your project. Here&apos;s your link to continue when you&apos;re ready:
        </Text>
        {shareUrl && (
          <div className="mb-6">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium break-all hover:bg-gray-100"
              style={{ color: brandColor }}
            >
              {shareUrl}
            </a>
            <Text size="sm" className="text-gray-500 mt-2 !mb-0">
              Bookmark this link to return to your project anytime
            </Text>
          </div>
        )}
        <Button variant="primary" asChild>
          <a href={shareUrl || '/start-project'}>Open Your Project</a>
        </Button>
      </Card>
    )
  }

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
