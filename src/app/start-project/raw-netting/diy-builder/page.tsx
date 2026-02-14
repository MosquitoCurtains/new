'use client'

import Link from 'next/link'
import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import { CartProvider } from '@/contexts/CartContext'
import RawNettingPanelBuilder from '@/components/plan/RawNettingPanelBuilder'
import { Check, ArrowLeft } from 'lucide-react'

const STEPS = [
  'Pick your mesh type, roll width, and panel dimensions',
  'Choose edge finishes for all four sides',
  'Preview your panel with live pricing',
  'Save, submit for expert review, or add to cart',
]

export default function RawNettingDIYBuilderPage() {
  return (
    <CartProvider>
      <Container size="xl">
        <Link href="/start-project/raw-netting" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1">
          <ArrowLeft className="w-3 h-3" />
          Back to Options
        </Link>
        <Stack gap="lg">
          <PowerHeaderTemplate
            title="Raw Netting Panel Builder"
            subtitle={
              <div>
                <p className="mb-3">Build custom mesh panels with edge finishing options.</p>
                <ul className="space-y-1.5 text-sm">
                  {STEPS.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#406517]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#406517]" />
                      </span>
                      <span className="text-gray-600">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            }
            variant="compact"
            videoId={VIDEOS.RAW_NETTING}
            videoTitle="Why Us For Raw Netting"
            showCta={false}
            actions={[]}
          />
          <RawNettingPanelBuilder />
        </Stack>
      </Container>
    </CartProvider>
  )
}
