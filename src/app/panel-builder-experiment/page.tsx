'use client'

import { Ruler } from 'lucide-react'
import {
  Container,
  Stack,
  HeaderBarSection,
} from '@/lib/design-system'
import PanelBuilder from '@/components/plan/PanelBuilder'

export default function PanelBuilderExperimentPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <HeaderBarSection icon={Ruler} label="Panel Calculator" variant="dark">
          <PanelBuilder />
        </HeaderBarSection>
      </Stack>
    </Container>
  )
}
