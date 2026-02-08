'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Grid, Card, Heading, Text, Button } from '@/lib/design-system'
import type { VinylPanelSize as VinylSizeTier, VinylTopAttachment, VelcroColor, CanvasColor } from '@/lib/pricing/types'
import type { PricingMap } from '@/lib/pricing/types'
import { calculateVinylPanelPrice } from '@/lib/pricing/formulas'
import { formatMoney, createDefaultVinylSize, type VinylPanelSize } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const VINYL_TOP_ATTACHMENTS = [
  { id: 'standard_track', label: 'Standard Track' },
  { id: 'heavy_track', label: 'Heavy Track' },
  { id: 'velcro', label: 'Velcro\u00AE' },
  { id: 'binding_only', label: 'Binding Only' },
  { id: 'special_rigging', label: 'Special Rigging' },
] as const

const CANVAS_COLORS = [
  { id: 'tbd', label: 'TBD' },
  { id: 'black', label: 'Black' },
  { id: 'ashen_gray', label: 'Ashen Gray' },
  { id: 'burgundy', label: 'Burgundy' },
  { id: 'cocoa_brown', label: 'Cocoa Brown' },
  { id: 'clear_top_to_bottom', label: 'Clear (Top to Bottom)' },
  { id: 'forest_green', label: 'Forest Green' },
  { id: 'moss_green', label: 'Moss Green' },
  { id: 'navy_blue', label: 'Navy Blue' },
  { id: 'royal_blue', label: 'Royal Blue' },
  { id: 'sandy_tan', label: 'Sandy Tan' },
] as const

function getSizeTier(heightInches: number | undefined): VinylSizeTier {
  if (!heightInches) return 'medium'
  if (heightInches < 48) return 'short'
  if (heightInches <= 96) return 'medium'
  return 'tall'
}

interface VinylPanelsSectionProps {
  dbPrices: PricingMap | null
  addItem: (item: any) => void
  isLoading: boolean
}

export default function VinylPanelsSection({ dbPrices, addItem, isLoading }: VinylPanelsSectionProps) {
  const [sizes, setSizes] = useState<VinylPanelSize[]>([createDefaultVinylSize()])
  const [sharedOptions, setSharedOptions] = useState({
    topAttachment: 'velcro' as VinylTopAttachment,
    velcroColor: 'black' as VelcroColor,
    canvasColor: 'tbd' as CanvasColor,
  })

  const vinylTotals = useMemo(() => {
    if (!dbPrices) return { panelTotals: [], subtotal: 0 }
    const panelTotals = sizes.map((size) => {
      const sizeTier = getSizeTier(size.heightInches)
      return calculateVinylPanelPrice({
        widthFeet: size.widthFeet ?? 0,
        widthInches: size.widthInches ?? 0,
        heightInches: size.heightInches ?? 0,
        panelSize: sizeTier,
        topAttachment: sharedOptions.topAttachment,
        canvasColor: sizeTier !== 'short' ? sharedOptions.canvasColor : undefined,
        velcroColor: sharedOptions.topAttachment === 'velcro' ? sharedOptions.velcroColor : undefined,
      }, dbPrices)
    })
    const subtotal = panelTotals.reduce((sum, item) => sum + item.total, 0)
    return { panelTotals, subtotal }
  }, [sizes, sharedOptions, dbPrices])

  const addSize = () => setSizes([...sizes, createDefaultVinylSize()])
  const updateSize = (index: number, size: VinylPanelSize) => {
    const next = [...sizes]
    next[index] = size
    setSizes(next)
  }
  const removeSize = (index: number) => {
    if (sizes.length > 1) setSizes(sizes.filter((_, i) => i !== index))
  }

  const addToCart = () => {
    sizes.forEach((size, index) => {
      const breakdown = vinylTotals.panelTotals[index]
      const sizeTier = getSizeTier(size.heightInches)
      addItem({
        type: 'panel',
        productSku: 'vinyl_panel',
        name: `Vinyl Panel ${index + 1}`,
        description: `${size.widthFeet ?? 0}'${size.widthInches ?? 0}" x ${size.heightInches ?? 0}" clear vinyl (${sizeTier}) - ${sharedOptions.canvasColor}`,
        quantity: 1,
        unitPrice: breakdown.total,
        totalPrice: breakdown.total,
        options: {
          widthFeet: size.widthFeet ?? 0,
          widthInches: size.widthInches ?? 0,
          heightInches: size.heightInches ?? 0,
          panelSize: sizeTier,
          canvasColor: sharedOptions.canvasColor,
          topAttachment: sharedOptions.topAttachment,
          velcroColor: sharedOptions.velcroColor,
        },
      })
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={`${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Vinyl Panels" width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <Heading level={2} className="!mb-0">Clear Vinyl Panels</Heading>
      </div>

      <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
          <select value={sharedOptions.topAttachment} onChange={(e) => setSharedOptions({ ...sharedOptions, topAttachment: e.target.value as VinylTopAttachment })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
            {VINYL_TOP_ATTACHMENTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Canvas Color</label>
          <select value={sharedOptions.canvasColor} onChange={(e) => setSharedOptions({ ...sharedOptions, canvasColor: e.target.value as CanvasColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
            {CANVAS_COLORS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        {sharedOptions.topAttachment === 'velcro' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
            <select value={sharedOptions.velcroColor} onChange={(e) => setSharedOptions({ ...sharedOptions, velcroColor: e.target.value as VelcroColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
        )}
      </Grid>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_80px_48px] gap-2 text-xs font-medium text-gray-600">
          <div>#</div><div>Width (ft)</div><div>Width (in)</div><div>Height (in)</div><div>Size</div><div className="text-right">Price</div><div></div>
        </div>
        {sizes.map((size, index) => {
          const sizeTier = getSizeTier(size.heightInches)
          return (
            <div key={size.id} className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
              <div className="text-sm font-medium text-gray-500">{index + 1}</div>
              <div><input type="number" min={1} max={12} value={size.widthFeet ?? ''} onChange={(e) => updateSize(index, { ...size, widthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="ft" /></div>
              <div><input type="number" min={0} max={11} value={size.widthInches ?? ''} onChange={(e) => updateSize(index, { ...size, widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="in" /></div>
              <div><input type="number" min={12} value={size.heightInches ?? ''} onChange={(e) => updateSize(index, { ...size, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="in" /></div>
              <div className="text-xs font-medium text-gray-500 capitalize">{sizeTier}</div>
              <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(vinylTotals.panelTotals[index]?.total || 0)}</div>
              <div className="flex justify-end gap-1">
                {sizes.length > 1 && <button onClick={() => removeSize(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" aria-label="Remove panel"><Minus className="w-4 h-4" /></button>}
                {index === sizes.length - 1 && <button onClick={addSize} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors" aria-label="Add panel"><Plus className="w-4 h-4" /></button>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Text className="text-gray-600 !mb-0">Subtotal:</Text>
          <Text className="text-xl font-semibold !mb-0">${formatMoney(vinylTotals.subtotal)}</Text>
        </div>
        <Button variant="primary" onClick={addToCart} disabled={isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Vinyl Panels
        </Button>
      </div>
    </Card>
  )
}
