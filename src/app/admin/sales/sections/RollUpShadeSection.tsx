'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { DBProduct } from '@/hooks/useProducts'
import { getProductOptions } from '@/hooks/useProducts'
import { formatMoney } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

type RollUpLine = {
  id: string
  widthInches: number | undefined
  ply: string
}

function createLine(defaultPly: string): RollUpLine {
  return {
    id: `ru-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthInches: undefined,
    ply: defaultPly,
  }
}

interface RollUpShadeSectionProps {
  rollupProduct: DBProduct | null
  getPrice: (id: string, fallback?: number) => number
  addItem: (item: any) => void
  isLoading: boolean
}

export default function RollUpShadeSection({ rollupProduct, getPrice, addItem, isLoading }: RollUpShadeSectionProps) {
  // Read ply options from database
  const plyOptions = getProductOptions(rollupProduct, 'ply')
  const defaultPly = plyOptions.find(o => o.is_default)?.option_value || plyOptions[0]?.option_value || 'single'

  const [lines, setLines] = useState<RollUpLine[]>([createLine(defaultPly)])

  // Screen fee from product base_price
  const screenFee = rollupProduct ? Number(rollupProduct.base_price) : getPrice('rollup_shade_screen')

  // Build ply rate lookup from DB options
  const plyRates = useMemo(() => {
    const rates: Record<string, number> = {}
    for (const opt of plyOptions) {
      rates[opt.option_value] = Number(opt.price)
    }
    return rates
  }, [plyOptions])

  const defaultRate = plyRates[defaultPly] ?? 1.00

  const lineTotals = useMemo(() => {
    const totals = lines.map((line) => {
      const width = line.widthInches ?? 0
      const rate = plyRates[line.ply] ?? defaultRate
      return screenFee + (width * rate)
    })
    const subtotal = totals.reduce((sum, v) => sum + v, 0)
    return { totals, subtotal }
  }, [lines, screenFee, plyRates, defaultRate])

  const addLine = () => setLines([...lines, createLine(defaultPly)])
  const updateLine = (index: number, updates: Partial<RollUpLine>) => {
    const next = [...lines]
    next[index] = { ...next[index], ...updates }
    setLines(next)
  }
  const removeLine = (index: number) => {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== index))
  }

  const addToCart = () => {
    lines.forEach((line, index) => {
      const total = lineTotals.totals[index]
      addItem({
        type: 'panel',
        productSku: 'rollup_shade_screen',
        name: `Roll-Up Shade ${index + 1}`,
        description: `${line.widthInches ?? 0}" wide - ${line.ply} ply`,
        quantity: 1,
        unitPrice: total,
        totalPrice: total,
        options: {
          widthInches: line.widthInches ?? 0,
          ply: line.ply,
        },
      })
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={rollupProduct?.image_url || `${IMG}/2024/06/Single-Ply.jpg`} alt={rollupProduct?.name || 'Roll-Up Shade Screen'} width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <div>
          <Heading level={2} className="!mb-0">{rollupProduct?.name || 'Roll-Up Shade Screens'}</Heading>
          <Text size="sm" className="text-gray-500 !mb-0">${formatMoney(screenFee)}/screen + width x ply rate</Text>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
          <div>#</div><div>Ply</div><div>Width (in)</div><div className="text-right">Price</div><div></div>
        </div>
        {lines.map((line, index) => (
          <div key={line.id} className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
            <div className="text-sm font-medium text-gray-500">{index + 1}</div>
            <div>
              <select
                value={line.ply}
                onChange={(e) => updateLine(index, { ply: e.target.value })}
                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
              >
                {plyOptions.map((o) => (
                  <option key={o.option_value} value={o.option_value}>
                    {o.display_label} (${formatMoney(Number(o.price))}/in)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                min={1}
                value={line.widthInches ?? ''}
                onChange={(e) => updateLine(index, { widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                placeholder="in"
              />
            </div>
            <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(lineTotals.totals[index] || 0)}</div>
            <div className="flex justify-end gap-1">
              {lines.length > 1 && (
                <button onClick={() => removeLine(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
              )}
              {index === lines.length - 1 && (
                <button onClick={addLine} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Text className="text-gray-600 !mb-0">Subtotal:</Text>
          <Text className="text-xl font-semibold !mb-0">${formatMoney(lineTotals.subtotal)}</Text>
        </div>
        <Button variant="primary" onClick={addToCart} disabled={isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Roll-Up Shades
        </Button>
      </div>
    </Card>
  )
}
