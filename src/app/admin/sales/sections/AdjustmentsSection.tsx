'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { DBProductOption } from '@/hooks/useProducts'
import { formatMoney, createDefaultAdjustmentLine, type AdjustmentLine } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

interface AdjustmentsSectionProps {
  adjustmentOptions: DBProductOption[]
  addItem: (item: any) => void
  isLoading: boolean
}

export default function AdjustmentsSection({ adjustmentOptions, addItem, isLoading }: AdjustmentsSectionProps) {
  const [adjustmentLines, setAdjustmentLines] = useState<AdjustmentLine[]>([])

  const addAdjustmentLine = () => {
    setAdjustmentLines([...adjustmentLines, createDefaultAdjustmentLine()])
  }

  const updateAdjustmentLine = (index: number, updates: Partial<AdjustmentLine>) => {
    const next = [...adjustmentLines]
    next[index] = { ...next[index], ...updates }
    setAdjustmentLines(next)
  }

  const removeAdjustmentLine = (index: number) => {
    setAdjustmentLines(adjustmentLines.filter((_, i) => i !== index))
  }

  const handleAdjustmentTypeChange = (index: number, typeValue: string) => {
    const option = adjustmentOptions.find(o => o.option_value === typeValue)
    updateAdjustmentLine(index, {
      type: typeValue,
      price: option ? Number(option.price) : 0,
      description: option ? option.display_label : '',
    })
  }

  const addAdjustmentLinesToCart = () => {
    adjustmentLines.forEach((line) => {
      if (!line.type || line.quantity <= 0) return
      const total = line.price * line.quantity
      addItem({
        type: 'addon',
        productSku: `adjustment_${line.type}`,
        name: `Adjustment: ${line.description}`,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.price,
        totalPrice: total,
        options: { adjustment_type: line.type },
      })
    })
    setAdjustmentLines([])
  }

  const adjustmentSubtotal = useMemo(() => {
    return adjustmentLines.reduce((sum, line) => sum + (line.price * line.quantity), 0)
  }, [adjustmentLines])

  if (adjustmentOptions.length === 0) return null

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={`${IMG}/2019/12/Product-Adjustment-Image-700x700.png`} alt="Adjustments" width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <div>
          <Heading level={2} className="!mb-0">Adjustments</Heading>
          <Text size="sm" className="text-gray-500 !mb-0">Webbing, velcro, notches, slopes, or custom</Text>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_80px_100px_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
          <div>#</div>
          <div>Type</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Description</div>
          <div className="text-right">Total</div>
          <div></div>
        </div>

        {adjustmentLines.map((line, index) => (
          <div key={line.id} className="px-3 py-2 grid grid-cols-[40px_1fr_80px_100px_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
            <div className="text-sm font-medium text-gray-500">{index + 1}</div>
            <div>
              <select
                value={line.type}
                onChange={(e) => handleAdjustmentTypeChange(index, e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
              >
                <option value="">Select type...</option>
                {adjustmentOptions.map((opt) => (
                  <option key={opt.option_value} value={opt.option_value}>{opt.display_label}</option>
                ))}
              </select>
            </div>
            <div>
              <input type="number" min={1} value={line.quantity} onChange={(e) => updateAdjustmentLine(index, { quantity: parseInt(e.target.value) || 1 })} className="w-full pl-2 pr-1 py-2.5 bg-white border border-gray-200 rounded text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer" />
            </div>
            <div>
              <input type="number" step="0.01" value={line.price} onChange={(e) => updateAdjustmentLine(index, { price: parseFloat(e.target.value) || 0 })} className="w-full pl-2 pr-1 py-2.5 bg-white border border-gray-200 rounded text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer" />
            </div>
            <div>
              <input type="text" value={line.description} onChange={(e) => updateAdjustmentLine(index, { description: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="Description" />
            </div>
            <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(line.price * line.quantity)}</div>
            <div className="flex justify-end gap-1">
              {adjustmentLines.length > 1 && (
                <button onClick={() => removeAdjustmentLine(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" aria-label="Remove adjustment">
                  <Minus className="w-4 h-4" />
                </button>
              )}
              {index === adjustmentLines.length - 1 && (
                <button onClick={addAdjustmentLine} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors" aria-label="Add adjustment">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {adjustmentLines.length === 0 && (
          <div className="px-3 py-4 flex items-center justify-center">
            <button onClick={addAdjustmentLine} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-[#406517] hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              Add adjustment line
            </button>
          </div>
        )}
      </div>

      {adjustmentLines.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Text className="text-gray-600 !mb-0">Subtotal:</Text>
            <Text className="text-xl font-semibold !mb-0">${formatMoney(adjustmentSubtotal)}</Text>
          </div>
          <Button variant="primary" onClick={addAdjustmentLinesToCart} disabled={isLoading || adjustmentLines.every(l => !l.type)}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add Adjustments
          </Button>
        </div>
      )}
    </Card>
  )
}
