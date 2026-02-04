'use client'

/**
 * WhoWeAreWhatWeDoTemplate
 * 
 * Two-column section showing "Who We Are" and "What We Do" cards.
 * Edit this template to update ALL instances across the site.
 * 
 * Usage:
 * ```tsx
 * import { WhoWeAreWhatWeDoTemplate } from '@/lib/design-system'
 * 
 * <WhoWeAreWhatWeDoTemplate />
 * ```
 */

import Link from 'next/link'
import { Heart, Zap, Check, ArrowRight } from 'lucide-react'
import { TwoColumn, Stack, Heading, Text, Button } from '../components'

const WHO_WE_ARE_ITEMS = [
  'We are a small family business',
  'Dedicated to quality and service',
  'And making people happy',
  'Just like the good old days',
  'When humans answered the phone',
  'And a promise was as good as gold!',
]

const WHAT_WE_DO_ITEMS = [
  'We custom-make Mosquito Curtains',
  'With exceptional marine-grade quality',
  'Offered at an affordable price',
  'Delivered in 3-8 business days',
  'Easy DIY installation',
  'Backed by our satisfaction guarantee',
]

export function WhoWeAreWhatWeDoTemplate() {
  return (
    <section>
      <TwoColumn gap="lg">
        {/* Who We Are */}
        <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-[#406517]/20 border-2 rounded-2xl p-6 md:p-8">
          <Stack gap="md">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-[#406517]/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#406517]" />
              </div>
              <Heading level={3} className="!mb-0" style={{ color: '#406517' }}>
                Who We Are
              </Heading>
            </div>
            <div className="space-y-3">
              {WHO_WE_ARE_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 text-[#406517]" />
                  <Text className="text-gray-700 !mb-0">{item}</Text>
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <Button variant="ghost" asChild>
                <Link href="/about">
                  Learn About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </div>
        
        {/* What We Do */}
        <div className="bg-gradient-to-br from-[#003365]/5 to-transparent border-[#003365]/20 border-2 rounded-2xl p-6 md:p-8">
          <Stack gap="md">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-[#003365]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#003365]" />
              </div>
              <Heading level={3} className="!mb-0" style={{ color: '#003365' }}>
                What We Do
              </Heading>
            </div>
            <div className="space-y-3">
              {WHAT_WE_DO_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 text-[#003365]" />
                  <Text className="text-gray-700 !mb-0">{item}</Text>
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <Button variant="ghost" asChild>
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </div>
      </TwoColumn>
    </section>
  )
}
