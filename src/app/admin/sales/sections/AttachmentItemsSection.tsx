'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Info } from 'lucide-react'
import { Stack, Card, Heading, Text, Button } from '@/lib/design-system'
import { getPriceLabel } from '@/hooks/useProducts'
import type { DBProduct } from '@/hooks/useProducts'
import { formatMoney, type ProductModalInfo } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

interface AttachmentItemsSectionProps {
  attachmentItems: DBProduct[]
  attachmentGroups: string[]
  addItem: (item: any) => void
  isLoading: boolean
  setProductModal: (info: ProductModalInfo | null) => void
}

export default function AttachmentItemsSection({
  attachmentItems,
  attachmentGroups,
  addItem,
  isLoading,
  setProductModal,
}: AttachmentItemsSectionProps) {
  const [attachmentQtys, setAttachmentQtys] = useState<Record<string, number>>({})

  const addAttachmentItem = (item: DBProduct, qty: number) => {
    if (qty <= 0) return
    const unitPrice = Number(item.base_price)
    addItem({
      type: 'hardware',
      productSku: item.sku,
      name: item.name,
      description: item.description || `${qty} ${getPriceLabel(item.unit, item.pack_quantity).toLowerCase()}`,
      quantity: 1,
      unitPrice: unitPrice * qty,
      totalPrice: unitPrice * qty,
      options: { quantity: qty, unit: item.unit },
    })
    setAttachmentQtys((prev) => ({ ...prev, [item.sku]: 0 }))
  }

  const addAllAttachmentItems = () => {
    attachmentItems.forEach((item) => {
      const qty = attachmentQtys[item.sku] || 0
      if (qty > 0) {
        const unitPrice = Number(item.base_price)
        addItem({
          type: 'hardware',
          productSku: item.sku,
          name: item.name,
          description: item.description || `${qty} ${getPriceLabel(item.unit, item.pack_quantity).toLowerCase()}`,
          quantity: 1,
          unitPrice: unitPrice * qty,
          totalPrice: unitPrice * qty,
          options: { quantity: qty, unit: item.unit },
        })
      }
    })
    setAttachmentQtys({})
  }

  const attachmentSubtotal = useMemo(() => {
    return attachmentItems.reduce((sum, item) => {
      const qty = attachmentQtys[item.sku] || 0
      return sum + (Number(item.base_price) * qty)
    }, 0)
  }, [attachmentQtys, attachmentItems])

  const hasSelectedAttachments = useMemo(() => {
    return attachmentItems.some((item) => (attachmentQtys[item.sku] || 0) > 0)
  }, [attachmentQtys, attachmentItems])

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={`${IMG}/2019/12/Attachment-Items-700x700.jpg`} alt="Attachment Items" width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <Heading level={2} className="!mb-0">Attachment Items</Heading>
      </div>
      <Stack gap="lg">
        {attachmentGroups.map((group) => (
          <div key={group}>
            <Heading level={3} className="!mb-3">{group}</Heading>
            <Stack gap="sm">
              {attachmentItems.filter((item) => (item.category_section || 'Other Items') === group).map((item) => {
                const qty = attachmentQtys[item.sku] || 0
                const unitPrice = Number(item.base_price)
                const priceLabel = getPriceLabel(item.unit, item.pack_quantity)
                const openItemModal = () => setProductModal({
                  name: item.name,
                  image: item.image_url || undefined,
                  price: unitPrice,
                  unit: priceLabel,
                  description: item.description || undefined,
                  sku: item.sku,
                  step: item.quantity_step,
                  min: item.quantity_min,
                  max: item.quantity_max,
                  ...(item.pack_quantity > 1 ? { packSize: item.pack_quantity, packPrice: unitPrice } : {}),
                })
                return (
                  <Card key={item.sku} variant="outlined" className="!p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <div
                            className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#003365] transition-all"
                            onClick={openItemModal}
                          >
                            <Image src={item.image_url} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <Text className="font-medium text-gray-900 !mb-0 hover:text-[#003365] hover:underline cursor-pointer transition-colors" onClick={openItemModal}>{item.name}</Text>
                            <button onClick={openItemModal} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-[#003365] hover:text-white text-gray-500 transition-colors shrink-0" title="Product info">
                              <Info className="w-3 h-3" />
                            </button>
                          </div>
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
                          value={attachmentQtys[item.sku] ?? ''}
                          onChange={(e) => setAttachmentQtys((prev) => ({
                            ...prev,
                            [item.sku]: parseInt(e.target.value) || 0,
                          }))}
                          className="w-28 pl-3 pr-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                          placeholder="0"
                        />
                        <Button
                          variant={qty > 0 ? 'primary' : 'outline'}
                          onClick={() => addAttachmentItem(item, qty)}
                          disabled={qty <= 0}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </Stack>
          </div>
        ))}
      </Stack>
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Text className="text-gray-600 !mb-0">Subtotal:</Text>
          <Text className="text-xl font-semibold !mb-0">${formatMoney(attachmentSubtotal)}</Text>
        </div>
        <Button variant="primary" onClick={addAllAttachmentItems} disabled={!hasSelectedAttachments || isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Attachment Items
        </Button>
      </div>
    </Card>
  )
}
