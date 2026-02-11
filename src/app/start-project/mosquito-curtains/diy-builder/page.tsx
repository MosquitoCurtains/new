'use client'

import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import PanelBuilder from '@/components/plan/PanelBuilder'

export default function MosquitoCurtainsDIYBuilderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <PowerHeaderTemplate
          title="DIY Panel Builder"
          subtitle="Configure your mosquito curtain panels, choose attachments, and see exactly what hardware you need — all with live pricing from our catalog."
          variant="compact"
          videoId={VIDEOS.SHORT_OVERVIEW}
          videoTitle="Mosquito Curtains Overview"
          actions={[]}
        />
        <PanelBuilder />
      </Stack>
    </Container>
  )
}
