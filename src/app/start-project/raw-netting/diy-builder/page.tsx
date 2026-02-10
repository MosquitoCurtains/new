'use client'

import { useRouter } from 'next/navigation'
import { Container, Stack } from '@/lib/design-system'
import { FabricConfigurator, type FabricOrder } from '@/components/project'

export default function RawNettingDIYBuilderPage() {
  const router = useRouter()

  const handleAddToCart = async (order: FabricOrder, price: number) => {
    localStorage.setItem('mc_cart', JSON.stringify({
      type: 'raw_materials',
      fabric: order,
      totals: { total: price },
      productType: 'raw_materials',
      timestamp: Date.now(),
    }))
    router.push('/cart')
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <FabricConfigurator
          initialFabricType="heavy_mosquito"
          initialColor="black"
          onAddToCart={handleAddToCart}
        />
      </Stack>
    </Container>
  )
}
