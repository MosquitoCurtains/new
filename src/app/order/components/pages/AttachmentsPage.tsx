'use client'

/**
 * AttachmentsPage — Customer-facing attachment items + snap tool ordering.
 *
 * Mirrors admin AttachmentItemsSection + SnapToolSection, filtered for admin_only = false.
 * Snap tool is limited to 1 per cart.
 * Used by /order/attachments and /order-attachments/ (shell wrapper).
 */

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Info, X } from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getPriceLabel } from '@/hooks/useProducts'
import type { DBProduct } from '@/hooks/useProducts'
import StepNav from '../StepNav'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

function formatMoney(value: number) { return value.toFixed(2) }

type ProductModalInfo = {
  name: string
  image?: string
  price: number
  unit: string
  description?: string
  sku?: string
  step?: number
  min?: number
  max?: number
  packSize?: number
  packPrice?: number
}

function ProductDetailModal({ product, onClose }: { product: ProductModalInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {product.image && (
          <div className="relative w-full h-64 sm:h-72 bg-gray-50 shrink-0">
            <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, 384px" />
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"><X className="w-4 h-4 text-gray-700" /></button>
          </div>
        )}
        <div className="p-5 overflow-y-auto">
          {!product.image && (
            <div className="flex justify-end -mt-1 -mr-1 mb-2">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><X className="w-4 h-4 text-gray-600" /></button>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-[#003365]">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{product.unit}</span>
          </div>
          {product.packSize && product.packSize > 1 && product.packPrice !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
              <span className="text-sm text-blue-800 font-medium">Pack of {product.packSize} = ${product.packPrice.toFixed(2)}</span>
            </div>
          )}
          {product.description && <p className="text-sm text-gray-600 mb-4">{product.description}</p>}
          <div className="space-y-2 border-t border-gray-100 pt-3">
            {product.sku && <div className="flex justify-between text-sm"><span className="text-gray-500">SKU</span><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{product.sku}</span></div>}
            {product.step !== undefined && product.step > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Sold In</span><span className="font-medium text-gray-900">Increments of {product.step}</span></div>}
            {product.min !== undefined && product.max !== undefined && <div className="flex justify-between text-sm"><span className="text-gray-500">Qty Range</span><span className="font-medium text-gray-900">{product.min} &ndash; {product.max}</span></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function AttachmentsPage() {
  const { addItem, cart } = useCartContext()
  const { attachmentItems, attachmentGroups, snapTool, isLoading: productsLoading } = useProducts()

  const [attachmentQtys, setAttachmentQtys] = useState<Record<string, number>>({})
  const [productModal, setProductModal] = useState<ProductModalInfo | null>(null)

  // Snap tool: limit 1 in cart
  const snapToolInCart = cart?.items.some(item => item.productSku === 'snap_tool') ?? false

  // =========================================================================
  // ATTACHMENT ITEMS
  // =========================================================================

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

  // =========================================================================
  // SNAP TOOL
  // =========================================================================

  const addSnapTool = () => {
    if (!snapTool || snapToolInCart) return
    addItem({
      type: 'addon',
      productSku: snapTool.sku,
      name: snapTool.name || 'Industrial Snap Tool',
      description: snapTool.description || 'Fully refundable if returned',
      quantity: 1,
      unitPrice: Number(snapTool.base_price),
      totalPrice: Number(snapTool.base_price),
    })
  }

  // =========================================================================
  // LOADING
  // =========================================================================

  if (productsLoading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
      </Container>
    )
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Order Attachment Items"
          subtitle="Marine snaps, magnetic strips, velcro, and other attachment hardware for your curtains."
          videoId={VIDEOS.OPTIONS_OVERVIEW}
          videoTitle="Hardware Options Overview"
          variant="compact"
        />

        <StepNav flow="mc" currentStep={3} />

        {/* ATTACHMENT ITEMS */}
        <section>
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
              <Button variant="primary" onClick={addAllAttachmentItems} disabled={!hasSelectedAttachments}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add All Items
              </Button>
            </div>
          </Card>
        </section>

        {/* SNAP TOOL — limit 1 */}
        {snapTool && (
          <section>
            <Card variant="elevated" className="!p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <Heading level={2} className="!mb-1">{snapTool.name || 'Industrial Snap Tool'}</Heading>
                  <Text size="sm" className="text-gray-500 !mb-0">
                    ${formatMoney(Number(snapTool.base_price))} - {snapTool.description || 'Fully refundable if returned'}
                  </Text>
                </div>
                <Button variant={snapToolInCart ? 'outline' : 'primary'} onClick={addSnapTool} disabled={snapToolInCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {snapToolInCart ? 'Already in Cart' : `Add ${snapTool.name || 'Snap Tool'}`}
                </Button>
              </div>
            </Card>
          </section>
        )}

        <StepNav flow="mc" currentStep={3} />

        <FinalCTATemplate />
      </Stack>

      {productModal && <ProductDetailModal product={productModal} onClose={() => setProductModal(null)} />}
    </Container>
  )
}
