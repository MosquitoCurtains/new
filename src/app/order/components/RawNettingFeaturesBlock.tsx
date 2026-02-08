'use client'

/**
 * RawNettingFeaturesBlock — Shared feature grid for all raw netting pages.
 * 
 * Displays the 6 shared properties common to all raw netting products:
 * 1. Multi-Purpose
 * 2. 100% Polyester Made To Get Wet
 * 3. Sold by the Foot From Massive Rolls (100"-140" wide)
 * 4. CA Fire Rated (NFPA 701)
 * 5. Will Not Unravel On Edge (lock stitch)
 * 6. Solution Dyed (fade resistance)
 */

import {
  Droplets,
  Ruler,
  ShieldCheck,
  Scissors,
  Sun,
  Layers,
} from 'lucide-react'
import { Grid, Card, Text } from '@/lib/design-system'

const FEATURES = [
  {
    icon: Layers,
    title: 'Multi-Purpose',
    description: 'Limitless applications from DIY projects to commercial installations.',
    color: '#406517',
  },
  {
    icon: Droplets,
    title: '100% Polyester',
    description: 'Made to get wet. Marine-grade quality suitable for outdoor use.',
    color: '#003365',
  },
  {
    icon: Ruler,
    title: 'Sold by the Foot',
    description: 'Giant rolls 100"-140" wide. Custom-cut to your exact length.',
    color: '#406517',
  },
  {
    icon: ShieldCheck,
    title: 'CA Fire Rated',
    description: 'NFPA 701 small-scale fire test rated for safety compliance.',
    color: '#B30158',
  },
  {
    icon: Scissors,
    title: 'Will Not Unravel',
    description: 'Lock-stitch weave means edges stay clean when cut to size.',
    color: '#003365',
  },
  {
    icon: Sun,
    title: 'Solution Dyed',
    description: 'Maximum fade resistance. Color goes through the fiber, not just on it.',
    color: '#406517',
  },
]

export default function RawNettingFeaturesBlock() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Shared Across All Mesh Types
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Every raw netting product we sell shares these premium qualities.
        </p>
      </div>
      <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} variant="outlined" className="!p-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <Text className="font-semibold text-gray-900 !mb-1">{feature.title}</Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{feature.description}</Text>
                </div>
              </div>
            </Card>
          )
        })}
      </Grid>
    </section>
  )
}
