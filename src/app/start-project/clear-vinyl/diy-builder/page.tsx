'use client'

import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import ClearVinylPanelBuilder from '@/components/plan/ClearVinylPanelBuilder'

export default function ClearVinylDIYBuilderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <PowerHeaderTemplate
          title="Clear Vinyl Panel Builder"
          subtitle="Configure custom clear vinyl panels with zippered stucco strips and zipper doorways. Choose your layout, dimensions, and edge attachments — then save and submit for review."
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
