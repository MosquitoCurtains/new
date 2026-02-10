'use client'

import { Container, Stack } from '@/lib/design-system'
import { DIYBuilder } from '@/components/project'

export default function MosquitoCurtainsDIYBuilderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <DIYBuilder productType="mosquito_curtains" />
      </Stack>
    </Container>
  )
}
