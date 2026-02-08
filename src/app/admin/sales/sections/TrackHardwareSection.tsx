'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Info } from 'lucide-react'
import { Grid, Card, Heading, Text, Button } from '@/lib/design-system'
import { getPriceLabel } from '@/hooks/useProducts'
import type { DBProduct } from '@/hooks/useProducts'
import { formatMoney, type ProductModalInfo } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

interface TrackHardwareSectionProps {
  standardTrackItems: DBProduct[]
  heavyTrackItems: DBProduct[]
  addItem: (item: any) => void
  isLoading: boolean
  setProductModal: (info: ProductModalInfo | null) => void
}

export default function TrackHardwareSection({
  standardTrackItems,
  heavyTrackItems,
  addItem,
  isLoading,
  setProductModal,
}: TrackHardwareSectionProps) {
  const [trackWeight, setTrackWeight] = useState<'standard' | 'heavy'>('standard')
  const [trackColor, setTrackColor] = useState<'white' | 'black'>('white')
  const [trackQtys, setTrackQtys] = useState<Record<string, number>>({})

  const activeTrackItems = useMemo(() => {
    return trackWeight === 'heavy' ? heavyTrackItems : standardTrackItems
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

  return (
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
            onChange={(e) => setTrackColor(e.target.value as 'white' | 'black')}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
          >
            <option value="white">White</option>
            <option value="black">Black</option>
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
        <Button variant="primary" onClick={addTracksToCart} disabled={isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Tracking Hardware
        </Button>
      </div>
    </Card>
  )
}
