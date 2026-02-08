'use client'

/**
 * RNAttachmentsPage — Raw netting-specific attachment hardware.
 *
 * Shared component used by /order/raw-netting-attachments and /order-raw-netting-attachment-hardware/.
 * Same structure as AttachmentsPage but focused on RN-specific items.
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check, Wrench, ArrowRight } from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Spinner,
  Grid,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts } from '@/hooks/useProducts'
import QuantityGrid, { type QuantityItem } from '../QuantityGrid'
import LivePriceDisplay from '../LivePriceDisplay'

export function RNAttachmentsPage() {
  const { addItem } = useCartContext()
  const { attachmentItems, attachmentGroups, snapTool, isLoading } = useProducts()

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [justAdded, setJustAdded] = useState(false)

  const handleUpdateQuantity = useCallback((sku: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [sku]: qty }))
  }, [])

  // Build items list for the grid
  const gridItems: QuantityItem[] = useMemo(() => {
    return attachmentItems.map(product => ({
      product,
      quantity: quantities[product.sku] || 0,
    }))
  }, [attachmentItems, quantities])

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
          title="Raw Netting Attachment Hardware"
          subtitle="Marine snaps, elastic cord, webbing, and everything you need to rig your raw netting."
          videoId={VIDEOS.MARINE_SNAPS_90_SEC}
          videoTitle="Marine Snaps in 90 Seconds"
          variant="compact"
        />

        {/* Snap Tool CTA */}
        {snapTool && (
          <section>
            <Card variant="elevated" className="!p-6 !bg-[#406517]/5 !border-2 !border-[#406517]/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-[#406517]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-8 h-8 text-[#406517]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Heading level={3} className="!mb-1">{snapTool.name}</Heading>
                  <Text size="sm" className="text-gray-600 !mb-0">
                    Professional snap installation tool. ${snapTool.base_price.toFixed(2)} fully refundable deposit.
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

        {/* Grouped Sections */}
        {attachmentGroups.map((group) => {
          const items = gridItems.filter(i => (i.product.category_section || 'Other Items') === group)
          if (items.length === 0) return null
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

        {/* Total + Add All */}
        <section>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
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
                <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>
              )}
            </Button>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <Heading level={2} className="!mb-4 text-center">Raw Netting Store</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/raw-netting-fabric-store/" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#406517]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#406517] transition-colors">See All Meshes</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Browse individual product pages</Text>
              </Card>
            </Link>
            <Link href="/order/raw-netting" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#003365]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#003365] transition-colors">Order Raw Netting</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">All mesh types on one page</Text>
              </Card>
            </Link>
            <Link href="/start-project" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#B30158]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#B30158] transition-colors">Let Us Make It</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Custom-made panels to your specs</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
