'use client'

import React from 'react'
import { cn } from '../shared-utils'
import { Card } from '../cards/Card'
import { Heading } from '../typography/Heading'
import { Text } from '../typography/Text'
import { Stack } from '../layout/Stack'

// ============================================================================
// PROOF WALL COMPONENT - Before/After Showcase
// Adapted for Mosquito Curtains - Customer Testimonials
// ============================================================================

interface ProofWallItem {
  id: string
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  story: string
  storyTitle?: string
}

interface ProofWallProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ProofWallItem[]
  heading?: string | null
  className?: string
  showHeadingOutside?: boolean
  showStoryHighlight?: boolean
}

export const ProofWall = React.forwardRef<HTMLDivElement, ProofWallProps>(
  ({
    items,
    heading,
    className = '',
    showHeadingOutside = true,
    showStoryHighlight = true,
    ...props
  }, ref) => {
    const primaryItem: ProofWallItem = items[0] ?? {
      id: 'default-proof',
      beforeImage: '/placeholder.jpg',
      afterImage: '/placeholder.jpg',
      story: '',
    }

    const displayTitle = heading === undefined ? 'Customer Transformations' : heading

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        {showHeadingOutside && displayTitle && (
          <Stack gap="sm" className="items-center text-center mb-6">
            <Heading level={2} className="text-gray-900">
              {displayTitle}
            </Heading>
          </Stack>
        )}

        <Card
          variant="default"
          className="p-4 md:p-6 space-y-6 bg-white border border-gray-200"
        >
          {!showHeadingOutside && displayTitle && (
            <Heading level={2} className="text-gray-900 text-center">
              {displayTitle}
            </Heading>
          )}

          <Stack gap="lg">
            {primaryItem.story && (
              <Text size="base" className="text-gray-600 text-center leading-relaxed">
                {primaryItem.story}
              </Text>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <Heading level={4} className="text-gray-700 uppercase tracking-[0.2em] text-center font-extrabold">
                  Before
                </Heading>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={primaryItem.beforeImage || '/placeholder.jpg'}
                    alt={primaryItem.beforeAlt || 'Before installation'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-[#406517]/30 bg-[#406517]/5 p-4">
                <Heading level={4} className="text-[#406517] uppercase tracking-[0.2em] text-center font-extrabold">
                  After
                </Heading>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={primaryItem.afterImage || '/placeholder.jpg'}
                    alt={primaryItem.afterAlt || 'After installation'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Stack>
        </Card>
      </div>
    )
  }
)
ProofWall.displayName = 'ProofWall'
