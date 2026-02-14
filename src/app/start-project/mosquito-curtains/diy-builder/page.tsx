'use client'

import Link from 'next/link'
import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import PanelBuilder from '@/components/plan/PanelBuilder'
import { Check, ArrowLeft } from 'lucide-react'

const STEPS = [
  'Choose your mesh type and color',
  'Enter dimensions for each side of your space',
  'Select edge attachments and panel layout',
  'Save your project, submit for expert review, or order directly',
]

export default function MosquitoCurtainsDIYBuilderPage() {
  return (
    <Container size="xl">
      <Link href="/start-project/mosquito-curtains" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1">
        <ArrowLeft className="w-3 h-3" />
        Back to Options
      </Link>
      <Stack gap="lg">
        <PowerHeaderTemplate
          title="DIY Project Builder"
          subtitle={
            <div>
              <p className="mb-3">Design your custom mosquito curtain panels with live pricing.</p>
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
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg"
          showCta={false}
          actions={[]}
        />
        <PanelBuilder />
      </Stack>
    </Container>
  )
}
