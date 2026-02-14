'use client'

import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import ClearVinylPanelBuilder from '@/components/plan/ClearVinylPanelBuilder'
import { Check } from 'lucide-react'

const STEPS = [
  'Choose your panel layout and dimensions for each side',
  'Configure zippered stucco strips and zipper doorways',
  'Select edge attachments and review your design',
  'Save your project or submit for free expert review',
]

export default function ClearVinylDIYBuilderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <PowerHeaderTemplate
          title="Clear Vinyl Panel Builder"
          subtitle={
            <div>
              <p className="mb-3">Design clear vinyl panels with zippered strips and doorways.</p>
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
          videoId={VIDEOS.SHORT_OVERVIEW}
          videoTitle="Clear Vinyl Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg"
          showCta={false}
          actions={[]}
        />
        <ClearVinylPanelBuilder />
      </Stack>
    </Container>
  )
}
