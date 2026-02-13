'use client'

import { Container, Stack } from '@/lib/design-system'
import { PowerHeaderTemplate } from '@/lib/design-system/templates/PowerHeaderTemplate'
import { VIDEOS } from '@/lib/constants/videos'
import { CartProvider } from '@/contexts/CartContext'
import RawNettingPanelBuilder from '@/components/plan/RawNettingPanelBuilder'

export default function RawNettingDIYBuilderPage() {
  return (
    <CartProvider>
      <Container size="xl">
        <Stack gap="lg">
          <PowerHeaderTemplate
            title="Raw Netting Panel Builder"
            subtitle="Configure custom mesh panels with edge finishing options. Choose your mesh type, dimensions, and edge treatments — then save and order."
            variant="compact"
            videoId={VIDEOS.SHORT_OVERVIEW}
            videoTitle="Raw Netting Overview"
            thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Planning-Overview-Video-Thumbnail-1.jpg"
            showCta={false}
            actions={[]}
          />
          <RawNettingPanelBuilder />
        </Stack>
      </Container>
    </CartProvider>
  )
}
