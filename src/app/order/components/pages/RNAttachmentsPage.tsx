'use client'

/**
 * RNAttachmentsPage — Raw netting-specific attachment hardware.
 *
 * Shared component used by /order/raw-netting-attachments and /order-raw-netting-attachment-hardware/.
 * Same structure as AttachmentsPage but focused on RN-specific items.
 */

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check, Wrench, Info } from 'lucide-react'
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
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { OrderPageHeader } from '../OrderPageHeader'
import StepNav from '../StepNav'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getPriceLabel } from '@/hooks/useProducts'

function formatMoney(value: number) { return value.toFixed(2) }

export function RNAttachmentsPage() {
  const { addItem } = useCartContext()
  const { attachmentItems, attachmentGroups, snapTool, isLoading } = useProducts()

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [justAdded, setJustAdded] = useState(false)

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
        <OrderPageHeader
          title="Raw Netting Attachment Hardware"
          subtitle="Marine snaps, elastic cord, webbing, and everything you need to rig your raw netting."
        />

        <StepNav flow="rn" currentStep={2} />

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

        {/* Grouped Attachment Items */}
        {attachmentGroups.map((group) => {
          const items = attachmentItems.filter(i => (i.category_section || 'Other Items') === group)
          if (items.length === 0) return null
          return (
            <section key={group}>
              <Heading level={2} className="!mb-4">{group}</Heading>
              <Stack gap="sm">
                {items.map((item) => {
                  const qty = quantities[item.sku] || 0
                  const unitPrice = Number(item.base_price)
                  const priceLabel = getPriceLabel(item.unit, item.pack_quantity)
                  return (
                    <Card key={item.sku} variant="outlined" className="!p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                              <Image src={item.image_url} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Text className="font-medium text-gray-900 !mb-0">{item.name}</Text>
                            <Text size="sm" className="text-gray-500 !mb-0">
                              ${formatMoney(unitPrice)} {priceLabel.toLowerCase()}
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                          <input
                            type="number"
                            min={item.quantity_min}
                            max={item.quantity_max}
                            step={item.quantity_step}
                            value={quantities[item.sku] ?? ''}
                            onChange={(e) => setQuantities(prev => ({
                              ...prev,
                              [item.sku]: parseInt(e.target.value) || 0,
                            }))}
                            className="w-28 pl-3 pr-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </Stack>
            </section>
          )
        })}

        {/* Total + Add All */}
        <section>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Text className="text-gray-600 !mb-0">Total:</Text>
              <Text className={`text-xl font-semibold !mb-0 ${itemsToAdd.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                ${formatMoney(totalPrice)}
              </Text>
            </div>
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
