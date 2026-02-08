'use client'

/**
 * TrackHardwarePage — Standard + Heavy track hardware ordering.
 *
 * Shared component used by /order/track-hardware and /order-tracking/.
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Spinner,
  YouTubeEmbed,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getProductOptions } from '@/hooks/useProducts'
import PillSelector from '../PillSelector'
import ColorSwatch from '../ColorSwatch'
import QuantityGrid, { type QuantityItem } from '../QuantityGrid'
import LivePriceDisplay from '../LivePriceDisplay'

export function TrackHardwarePage() {
  const { addItem } = useCartContext()
  const { standardTrackItems, heavyTrackItems, isLoading: productsLoading } = useProducts()

  const [weight, setWeight] = useState<'standard' | 'heavy'>('standard')
  const [color, setColor] = useState('white')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [justAdded, setJustAdded] = useState(false)

  const trackItems = weight === 'standard' ? standardTrackItems : heavyTrackItems

  // Color options from first track item
  const colorOptions = useMemo(() => {
    const firstItem = standardTrackItems[0]
    return getProductOptions(firstItem, 'color').map(o => ({
      value: o.option_value,
      label: o.display_label,
      color: o.option_value,
    }))
  }, [standardTrackItems])

  // Build QuantityItem array
  const gridItems: QuantityItem[] = useMemo(() => {
    return trackItems.map(product => ({
      product,
      quantity: quantities[product.sku] || 0,
    }))
  }, [trackItems, quantities])

  const handleUpdateQuantity = useCallback((sku: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [sku]: qty }))
  }, [])

  const totalPrice = useMemo(() => {
    return gridItems.reduce((sum, { product, quantity }) => {
      return sum + product.base_price * quantity
    }, 0)
  }, [gridItems])

  const itemsToAdd = gridItems.filter(i => i.quantity > 0)

  const handleAddToCart = useCallback(() => {
    if (itemsToAdd.length === 0) return
    itemsToAdd.forEach(({ product, quantity }) => {
      addItem({
        type: 'track',
        productSku: product.sku,
        name: product.name,
        description: `${color} - ${weight} track`,
        quantity,
        unitPrice: product.base_price,
        totalPrice: product.base_price * quantity,
        options: { weight, color },
      })
    })
    setQuantities({})
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [itemsToAdd, addItem, weight, color])

  if (productsLoading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Order Track Hardware"
          subtitle="Standard and heavy-duty ceiling track systems. Straight tracks, curves, splices, end caps, and snap carriers."
          videoId={VIDEOS.TRACKING_OVERVIEW}
          videoTitle="Tracking System Overview"
          variant="compact"
        />

        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Heading level={2} className="!mb-6">Choose Your Track</Heading>

            <div className="space-y-6">
              <PillSelector
                label="Track Weight"
                options={[
                  { value: 'standard', label: 'Standard Track' },
                  { value: 'heavy', label: 'Heavy Track' },
                ]}
                value={weight}
                onChange={(v) => { setWeight(v as 'standard' | 'heavy'); setQuantities({}) }}
                size="lg"
              />

              {colorOptions.length > 0 && (
                <ColorSwatch
                  label="Color"
                  options={colorOptions}
                  value={color}
                  onChange={setColor}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Products</label>
                <QuantityGrid
                  items={gridItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  columns={3}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <LivePriceDisplay price={totalPrice} dimmed={itemsToAdd.length === 0} size="lg" label="Total:" />
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={itemsToAdd.length === 0 || justAdded}
                  className="!rounded-full !px-6"
                >
                  {justAdded ? (
                    <><Check className="w-4 h-4 mr-2" />Added</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4 mr-2" />Add Track to Cart</>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Installation Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.TRACKING_OVERVIEW} title="Tracking System Overview" />
            <YouTubeEmbed videoId={VIDEOS.TRACKING_INSTALL} title="Tracking Installation" />
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
