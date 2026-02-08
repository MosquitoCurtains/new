'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { PricingMap } from '@/lib/pricing/types'
import { calculateRawMeshPrice } from '@/lib/pricing/formulas'
import { formatMoney, createDefaultRawNettingLine, type RawNettingLine } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

// Material type -> available roll widths
const ROLL_WIDTHS: Record<string, { width: string; label: string }[]> = {
  heavy_mosquito: [
    { width: '101', label: '101"' },
    { width: '123', label: '123"' },
    { width: '138', label: '138"' },
  ],
  no_see_um: [
    { width: '101', label: '101"' },
    { width: '123', label: '123"' },
  ],
  shade: [
    { width: '120', label: '120"' },
  ],
  theater_scrim: [
    { width: '120', label: '120"' },
    { width: '140', label: '140"' },
  ],
}

// Material type -> available colors
const MATERIAL_COLORS: Record<string, string[]> = {
  heavy_mosquito: ['black', 'white', 'ivory'],
  no_see_um: ['black', 'white'],
  shade: ['black', 'white'],
  theater_scrim: ['white', 'silver'],
}

const MATERIAL_LABELS: Record<string, string> = {
  heavy_mosquito: 'Heavy Mosquito',
  no_see_um: 'No-See-Um',
  shade: 'Shade',
  theater_scrim: 'Theater Scrim',
}

interface RawNettingSectionProps {
  dbPrices: PricingMap | null
  getPrice: (id: string, fallback?: number) => number
  addItem: (item: any) => void
  isLoading: boolean
}

export default function RawNettingSection({ dbPrices, getPrice, addItem, isLoading }: RawNettingSectionProps) {
  const [lines, setLines] = useState<RawNettingLine[]>([createDefaultRawNettingLine()])
  const [industrialMode, setIndustrialMode] = useState<'foot' | 'roll'>('foot')
  const [industrialFeet, setIndustrialFeet] = useState<number | undefined>(undefined)

  const lineTotals = useMemo(() => {
    if (!dbPrices) return { totals: [], subtotal: 0 }
    const totals = lines.map((line) => {
      if (!line.lengthFeet) return 0
      return calculateRawMeshPrice({
        materialType: line.materialType as any,
        rollWidth: parseInt(line.rollWidth) as any,
        color: line.color as any,
        lengthFeet: line.lengthFeet,
      }, dbPrices)
    })
    const subtotal = totals.reduce((sum, v) => sum + v, 0)
    return { totals, subtotal }
  }, [lines, dbPrices])

  const industrialPrice = useMemo(() => {
    if (industrialMode === 'roll') return getPrice('raw_industrial_mesh_roll', 1350)
    return (industrialFeet ?? 0) * getPrice('raw_industrial_mesh_foot', 4)
  }, [industrialMode, industrialFeet, getPrice])

  const addLine = () => setLines([...lines, createDefaultRawNettingLine()])
  const updateLine = (index: number, updates: Partial<RawNettingLine>) => {
    const next = [...lines]
    next[index] = { ...next[index], ...updates }
    // Reset dependent fields when material changes
    if (updates.materialType) {
      const widths = ROLL_WIDTHS[updates.materialType]
      const colors = MATERIAL_COLORS[updates.materialType]
      if (widths && !widths.find(w => w.width === next[index].rollWidth)) {
        next[index].rollWidth = widths[0]?.width || '101'
      }
      if (colors && !colors.includes(next[index].color)) {
        next[index].color = colors[0] || 'black'
      }
    }
    setLines(next)
  }
  const removeLine = (index: number) => {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== index))
  }

  const addNettingToCart = () => {
    lines.forEach((line, index) => {
      if (!line.lengthFeet || line.lengthFeet <= 0) return
      const total = lineTotals.totals[index]
      addItem({
        type: 'fabric',
        productSku: `raw_${line.materialType}`,
        name: `Raw ${MATERIAL_LABELS[line.materialType] || line.materialType} ${line.rollWidth}"`,
        description: `${line.lengthFeet}ft x ${line.rollWidth}" roll - ${line.color}`,
        quantity: 1,
        unitPrice: total,
        totalPrice: total,
        options: {
          materialType: line.materialType,
          rollWidth: line.rollWidth,
          color: line.color,
          lengthFeet: line.lengthFeet,
        },
      })
    })
  }

  const addIndustrialToCart = () => {
    if (industrialMode === 'roll') {
      addItem({
        type: 'fabric',
        productSku: 'raw_industrial_mesh',
        name: 'Raw Industrial Mesh (Full Roll)',
        description: '65" x 330ft full roll',
        quantity: 1,
        unitPrice: industrialPrice,
        totalPrice: industrialPrice,
        options: { purchaseType: 'roll' },
      })
    } else {
      if (!industrialFeet || industrialFeet <= 0) return
      addItem({
        type: 'fabric',
        productSku: 'raw_industrial_mesh',
        name: 'Raw Industrial Mesh (By the Foot)',
        description: `${industrialFeet}ft x 65" roll`,
        quantity: 1,
        unitPrice: industrialPrice,
        totalPrice: industrialPrice,
        options: { purchaseType: 'foot', lengthFeet: industrialFeet },
      })
    }
  }

  return (
    <>
      {/* Raw Mesh Netting */}
      <Card variant="elevated" className="!p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
            <Image src={`${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Raw Netting" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <Heading level={2} className="!mb-0">Raw Netting</Heading>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_100px_100px_100px_80px_48px] gap-2 text-xs font-medium text-gray-600">
            <div>#</div><div>Material</div><div>Roll Width</div><div>Color</div><div>Length (ft)</div><div className="text-right">Price</div><div></div>
          </div>
          {lines.map((line, index) => {
            const widths = ROLL_WIDTHS[line.materialType] || []
            const colors = MATERIAL_COLORS[line.materialType] || []
            return (
              <div key={line.id} className="px-3 py-2 grid grid-cols-[40px_1fr_100px_100px_100px_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <select value={line.materialType} onChange={(e) => updateLine(index, { materialType: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent">
                    {Object.entries(MATERIAL_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <select value={line.rollWidth} onChange={(e) => updateLine(index, { rollWidth: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent">
                    {widths.map((w) => <option key={w.width} value={w.width}>{w.label}</option>)}
                  </select>
                </div>
                <div>
                  <select value={line.color} onChange={(e) => updateLine(index, { color: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent capitalize">
                    {colors.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div><input type="number" min={1} value={line.lengthFeet ?? ''} onChange={(e) => updateLine(index, { lengthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="ft" /></div>
                <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(lineTotals.totals[index] || 0)}</div>
                <div className="flex justify-end gap-1">
                  {lines.length > 1 && <button onClick={() => removeLine(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Minus className="w-4 h-4" /></button>}
                  {index === lines.length - 1 && <button onClick={addLine} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"><Plus className="w-4 h-4" /></button>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Text className="text-gray-600 !mb-0">Subtotal:</Text>
            <Text className="text-xl font-semibold !mb-0">${formatMoney(lineTotals.subtotal)}</Text>
          </div>
          <Button variant="primary" onClick={addNettingToCart} disabled={isLoading}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add Raw Netting
          </Button>
        </div>
      </Card>

      {/* Raw Industrial Mesh */}
      <Card variant="elevated" className="!p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
            <Image src={`${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Industrial Mesh" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div>
            <Heading level={2} className="!mb-0">Raw Industrial Mesh</Heading>
            <Text size="sm" className="text-gray-500 !mb-0">65" wide roll</Text>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {(['foot', 'roll'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setIndustrialMode(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                industrialMode === mode ? 'bg-[#003365] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode === 'foot' ? 'By the Foot' : 'Full Roll (330ft)'}
            </button>
          ))}
        </div>

        {industrialMode === 'foot' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Length (ft)</label>
            <input
              type="number"
              min={1}
              value={industrialFeet ?? ''}
              onChange={(e) => setIndustrialFeet(e.target.value === '' ? undefined : parseInt(e.target.value))}
              className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
              placeholder="ft"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Text className="text-gray-600 !mb-0">Price:</Text>
            <Text className="text-xl font-semibold !mb-0">${formatMoney(industrialPrice)}</Text>
          </div>
          <Button variant="primary" onClick={addIndustrialToCart} disabled={isLoading}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add Industrial Mesh
          </Button>
        </div>
      </Card>
    </>
  )
}
