'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { DBProduct } from '@/hooks/useProducts'
import { formatMoney, createDefaultStuccoStrip, type StuccoStrip } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

interface StuccoStripsSectionProps {
  zippered?: boolean
  stuccoProducts: DBProduct[]
  getPrice: (id: string, fallback?: number) => number
  addItem: (item: any) => void
  isLoading: boolean
}

export default function StuccoStripsSection({ zippered = false, stuccoProducts, getPrice, addItem, isLoading }: StuccoStripsSectionProps) {
  const [stuccoStrips, setStuccoStrips] = useState<StuccoStrip[]>([createDefaultStuccoStrip()])

  // Find the right stucco product from DB
  const targetSku = zippered ? 'stucco_zippered' : 'stucco_standard'
  const stuccoProduct = stuccoProducts.find(p => p.sku === targetSku) || null

  // Read name, image, and price from DB product
  const label = stuccoProduct?.name || (zippered ? 'Zippered Stucco Strips' : 'Stucco Strips')
  const productImage = stuccoProduct?.image_url || `${IMG}/2019/11/Panel-Example-700x525.jpg`
  const stuccoRate = stuccoProduct ? Number(stuccoProduct.base_price) : getPrice(targetSku, 0)

  const stuccoTotals = useMemo(() => {
    const stripTotals = stuccoStrips.map((strip) => stuccoRate * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, value) => sum + value, 0)
    return { stripTotals, subtotal, stuccoRate }
  }, [stuccoStrips, stuccoRate])

  const addStuccoStrip = () => setStuccoStrips([...stuccoStrips, createDefaultStuccoStrip()])
  const updateStuccoStrip = (index: number, strip: StuccoStrip) => {
    const next = [...stuccoStrips]
    next[index] = strip
    setStuccoStrips(next)
  }
  const removeStuccoStrip = (index: number) => {
    if (stuccoStrips.length > 1) setStuccoStrips(stuccoStrips.filter((_, i) => i !== index))
  }

  const addStuccoToCart = () => {
    stuccoStrips.forEach((strip, index) => {
      const height = strip.heightInches ?? 0
      const qty = strip.quantity ?? 0
      addItem({
        type: 'hardware',
        productSku: targetSku,
        name: `${label} ${index + 1}`,
        description: `${height}in height x ${qty}`,
        quantity: qty,
        unitPrice: stuccoRate,
        totalPrice: stuccoRate * qty,
        options: { heightInches: height, zippered },
      })
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={productImage} alt={label} width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <div>
          <Heading level={2} className="!mb-0">{label}</Heading>
          <Text size="sm" className="text-gray-500 !mb-0">${formatMoney(stuccoTotals.stuccoRate)} per strip</Text>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
          <div>#</div><div>Height (in)</div><div>Quantity</div><div className="text-right">Price</div><div></div>
        </div>
        {stuccoStrips.map((strip, index) => (
          <div key={strip.id} className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
            <div className="text-sm font-medium text-gray-500">{index + 1}</div>
            <div><input type="number" min={1} value={strip.heightInches ?? ''} onChange={(e) => updateStuccoStrip(index, { ...strip, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="in" /></div>
            <div><input type="number" min={1} value={strip.quantity ?? ''} onChange={(e) => updateStuccoStrip(index, { ...strip, quantity: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="qty" /></div>
            <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(stuccoTotals.stripTotals[index] || 0)}</div>
            <div className="flex justify-end gap-1">
              {stuccoStrips.length > 1 && <button onClick={() => removeStuccoStrip(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" aria-label="Remove strip"><Minus className="w-4 h-4" /></button>}
              {index === stuccoStrips.length - 1 && <button onClick={addStuccoStrip} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors" aria-label="Add strip"><Plus className="w-4 h-4" /></button>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Text className="text-gray-600 !mb-0">Subtotal:</Text>
          <Text className="text-xl font-semibold !mb-0">${formatMoney(stuccoTotals.subtotal)}</Text>
        </div>
        <Button variant="primary" onClick={addStuccoToCart} disabled={isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add {label}
        </Button>
      </div>
    </Card>
  )
}
