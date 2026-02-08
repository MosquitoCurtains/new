'use client'

/**
 * AttachmentsPage — General attachment hardware + snap tool.
 *
 * Shared component used by /order/attachments and /order-attachments/.
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check, Wrench } from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Spinner,
  YouTubeEmbed,
  Grid,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts } from '@/hooks/useProducts'
import QuantityGrid, { type QuantityItem } from '../QuantityGrid'
import LivePriceDisplay from '../LivePriceDisplay'

export function AttachmentsPage() {
  const { addItem } = useCartContext()
  const { attachmentItems, attachmentGroups, snapTool, isLoading } = useProducts()

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [justAdded, setJustAdded] = useState(false)

  const handleUpdateQuantity = useCallback((sku: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [sku]: qty }))
  }, [])

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Record<string, QuantityItem[]> = {}
    for (const group of attachmentGroups) {
      groups[group] = attachmentItems
        .filter(p => (p.category_section || 'Other Items') === group)
        .map(product => ({
          product,
          quantity: quantities[product.sku] || 0,
        }))
    }
    return groups
  }, [attachmentItems, attachmentGroups, quantities])

  const totalPrice = useMemo(() => {
    return attachmentItems.reduce((sum, product) => {
      const qty = quantities[product.sku] || 0
      return sum + product.base_price * qty
    }, 0)
  }, [attachmentItems, quantities])

  const itemsToAdd = attachmentItems.filter(p => (quantities[p.sku] || 0) > 0)

  const handleAddToCart = useCallback(() => {
    if (itemsToAdd.length === 0) return
    itemsToAdd.forEach((product) => {
      const qty = quantities[product.sku] || 0
      addItem({
        type: 'hardware',
        productSku: product.sku,
        name: product.name,
        description: product.description || '',
        quantity: qty,
        unitPrice: product.base_price,
        totalPrice: product.base_price * qty,
      })
    })
    setQuantities({})
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [itemsToAdd, quantities, addItem])

  if (isLoading) {
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
          title="Order Attachment Hardware"
          subtitle="Everything you need to install your mosquito curtains. Marine snaps, magnets, elastic cord, and more."
          videoId={VIDEOS.MARINE_SNAPS_90_SEC}
          videoTitle="Marine Snaps in 90 Seconds"
          variant="compact"
        />

        {/* Grouped Sections */}
        {attachmentGroups.map((group) => {
          const items = groupedItems[group]
          if (!items || items.length === 0) return null
          return (
            <section key={group}>
              <Heading level={2} className="!mb-4">{group}</Heading>
              <QuantityGrid
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                columns={3}
                showDescription
              />
            </section>
          )
        })}

        {/* Snap Tool Upsell */}
        {snapTool && (
          <section>
            <Card variant="elevated" className="!p-6 !bg-[#406517]/5 !border-2 !border-[#406517]/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-[#406517]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-10 h-10 text-[#406517]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Heading level={3} className="!mb-1">{snapTool.name}</Heading>
                  <Text className="text-gray-600 !mb-2">
                    {snapTool.description || 'Professional snap installation tool. Fully refundable deposit.'}
                  </Text>
                  <Text className="text-2xl font-bold text-[#406517] !mb-0">
                    ${snapTool.base_price.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500 ml-2">fully refundable</span>
                  </Text>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    addItem({
                      type: 'addon',
                      productSku: snapTool.sku,
                      name: snapTool.name,
                      description: 'Fully refundable deposit',
                      quantity: 1,
                      unitPrice: snapTool.base_price,
                      totalPrice: snapTool.base_price,
                    })
                  }}
                  className="!rounded-full !px-6 whitespace-nowrap"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add Snap Tool
                </Button>
              </div>
            </Card>
          </section>
        )}

        {/* Total + Add All */}
        <section>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <LivePriceDisplay price={totalPrice} dimmed={itemsToAdd.length === 0} size="lg" label="Selected Items Total:" />
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={itemsToAdd.length === 0 || justAdded}
              className="!rounded-full !px-6"
            >
              {justAdded ? (
                <><Check className="w-4 h-4 mr-2" />Added</>
              ) : (
                <><ShoppingCart className="w-4 h-4 mr-2" />Add All Selected to Cart</>
              )}
            </Button>
          </div>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Hardware Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.MARINE_SNAPS_90_SEC} title="Marine Snaps" />
            <YouTubeEmbed videoId={VIDEOS.MAGNETIC_DOORWAYS_90_SEC} title="Magnetic Doorways" />
            <YouTubeEmbed videoId={VIDEOS.STUCCO_STRIPS_90_SEC} title="Stucco Strips" />
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
