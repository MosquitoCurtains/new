'use client'

import { Container, Stack } from '@/lib/design-system'
import { DIYBuilder } from '@/components/project'

export default function ClearVinylDIYBuilderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <DIYBuilder productType="clear_vinyl" />
      </Stack>
    </Container>
  )
}
