'use client'

/**
 * TrackHardwarePage — Customer-facing track hardware ordering.
 *
 * Mirrors admin TrackHardwareSection, filtered for admin_only = false.
 * Used by /order/track-hardware and /order-tracking/ (shell wrapper).
 */

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Info, X } from 'lucide-react'
import { Container, Stack, Grid, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getPriceLabel, getProductOptions } from '@/hooks/useProducts'
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
  weight?: string
  step?: number
  min?: number
  max?: number
  packSize?: number
  packPrice?: number
}

// Inline ProductDetailModal to avoid admin import
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
            {product.weight && <div className="flex justify-between text-sm"><span className="text-gray-500">Track Weight</span><span className="font-medium text-gray-900">{product.weight}</span></div>}
            {product.sku && <div className="flex justify-between text-sm"><span className="text-gray-500">SKU</span><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{product.sku}</span></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TrackHardwarePage() {
  const { addItem } = useCartContext()
  const { standardTrackItems, heavyTrackItems, isLoading: productsLoading } = useProducts()

  const [trackWeight, setTrackWeight] = useState<'standard' | 'heavy'>('standard')
  const [trackColor, setTrackColor] = useState('white')
  const [trackQtys, setTrackQtys] = useState<Record<string, number>>({})
  const [productModal, setProductModal] = useState<ProductModalInfo | null>(null)

  // Color options from DB (no includeAdminOnly)
  const trackColorOptions = getProductOptions(standardTrackItems[0], 'color')
  const defaultTrackColor = trackColorOptions.find(o => o.is_default)?.option_value || trackColorOptions[0]?.option_value || 'white'

  // Filter admin_only products
  const activeTrackItems = useMemo(() => {
    const items = trackWeight === 'heavy' ? heavyTrackItems : standardTrackItems
    return items.filter(p => !p.admin_only)
  }, [trackWeight, standardTrackItems, heavyTrackItems])

  const trackPricing = useMemo(() => {
    const subtotal = activeTrackItems.reduce((sum, t) => {
      const qty = trackQtys[t.sku] || 0
      return sum + qty * Number(t.base_price)
    }, 0)
    return { subtotal }
  }, [trackQtys, activeTrackItems])

  const addTracksToCart = () => {
    const labelPrefix = trackWeight === 'heavy' ? 'Heavy' : 'Standard'
    for (const t of activeTrackItems) {
      const qty = trackQtys[t.sku] || 0
      if (qty <= 0) continue
      const unitPrice = Number(t.base_price)
      addItem({
        type: t.sku.includes('straight') ? 'track' : 'hardware',
        productSku: t.sku,
        name: `${labelPrefix} ${t.name}`,
        description: `${trackColor} ${t.name.toLowerCase()}`,
        quantity: qty,
        unitPrice,
        totalPrice: qty * unitPrice,
        options: { color: trackColor, weight: trackWeight },
      })
    }
  }

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

        <StepNav flow="mc" currentStep={2} />

        <section>
          <Card variant="elevated" className="!p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                <Image src={trackWeight === 'heavy' ? `${IMG}/2019/10/Heavy-Track-BW-700x700.jpg` : `${IMG}/2019/10/Track-Color-White-Black-700x700.jpg`} alt="Tracking Hardware" width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <Heading level={2} className="!mb-0">Tracking Hardware</Heading>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Track Weight</label>
                <div className="flex gap-2">
                  {(['standard', 'heavy'] as const).map((weight) => (
                    <button
                      key={weight}
                      onClick={() => { setTrackWeight(weight); setTrackQtys({}) }}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        trackWeight === weight ? 'bg-[#003365] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {weight === 'standard' ? 'Standard' : 'Heavy'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Track Color</label>
                <select
                  value={trackColor}
                  onChange={(e) => setTrackColor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  {trackColorOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
            </Grid>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md" className="mt-4">
              {activeTrackItems.map((t) => {
                const price = Number(t.base_price)
                const openTrackModal = () => setProductModal({
                  name: `${trackWeight === 'heavy' ? 'Heavy' : 'Standard'} ${t.name}`,
                  image: t.image_url || undefined,
                  price,
                  unit: getPriceLabel(t.unit, t.pack_quantity),
                  description: t.description || undefined,
                  sku: t.sku,
                  weight: trackWeight === 'heavy' ? 'Heavy' : 'Standard',
                })
                return (
                  <div key={t.sku} className="flex items-center gap-3">
                    {t.image_url && (
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#003365] transition-all"
                        onClick={openTrackModal}
                      >
                        <Image src={t.image_url} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                        <span onClick={openTrackModal} className="hover:text-[#003365] hover:underline cursor-pointer transition-colors">{t.name}</span>
                        <button onClick={openTrackModal} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-[#003365] hover:text-white text-gray-500 transition-colors shrink-0" title="Product info">
                          <Info className="w-3 h-3" />
                        </button>
                        <span className="text-gray-400">${formatMoney(price)}/ea</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={t.quantity_step}
                        value={trackQtys[t.sku] ?? ''}
                        onChange={(e) => setTrackQtys(prev => ({ ...prev, [t.sku]: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-3 pr-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )
              })}
            </Grid>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <Text className="text-gray-600 !mb-0">Subtotal:</Text>
                <Text className="text-xl font-semibold !mb-0">${formatMoney(trackPricing.subtotal)}</Text>
              </div>
              <Button variant="primary" onClick={addTracksToCart} disabled={trackPricing.subtotal <= 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add Tracking Hardware
              </Button>
            </div>
          </Card>
        </section>

        <StepNav flow="mc" currentStep={2} />

        <FinalCTATemplate />
      </Stack>

      {productModal && <ProductDetailModal product={productModal} onClose={() => setProductModal(null)} />}
    </Container>
  )
}
