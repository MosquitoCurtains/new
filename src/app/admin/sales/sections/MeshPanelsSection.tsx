'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Grid, Card, Heading, Text, Button } from '@/lib/design-system'
import type { MeshColor, MeshTopAttachment, MeshType, VelcroColor } from '@/lib/pricing/types'
import type { PricingMap } from '@/lib/pricing/types'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import { formatMoney, createDefaultMeshSize, type MeshPanelSize } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const TOP_ATTACHMENTS = [
  { id: 'standard_track', label: 'Standard Track (<10 Tall Panels)' },
  { id: 'heavy_track', label: 'Heavy Track (>10 Tall Panels)' },
  { id: 'velcro', label: 'Velcro\u00AE' },
  { id: 'special_rigging', label: 'Special Rigging' },
] as const

interface MeshPanelsSectionProps {
  dbPrices: PricingMap | null
  addItem: (item: any) => void
  isLoading: boolean
}

export default function MeshPanelsSection({ dbPrices, addItem, isLoading }: MeshPanelsSectionProps) {
  const [meshOptions, setMeshOptions] = useState<{
    meshType: MeshType
    meshColor: MeshColor
    topAttachment: MeshTopAttachment
    velcroColor?: VelcroColor
  }>({
    meshType: 'heavy_mosquito',
    meshColor: 'black',
    topAttachment: 'velcro',
    velcroColor: 'black',
  })
  const [meshSizes, setMeshSizes] = useState<MeshPanelSize[]>([createDefaultMeshSize()])

  const meshTotals = useMemo(() => {
    if (!dbPrices) return { panelTotals: [], subtotal: 0 }
    const panelTotals = meshSizes.map((size) => calculateMeshPanelPrice({
      widthFeet: size.widthFeet ?? 0,
      widthInches: size.widthInches ?? 0,
      heightInches: size.heightInches ?? 0,
      meshType: meshOptions.meshType,
      meshColor: meshOptions.meshColor,
      topAttachment: meshOptions.topAttachment,
      velcroColor: meshOptions.velcroColor,
    }, dbPrices))
    const subtotal = panelTotals.reduce((sum, item) => sum + item.total, 0)
    return { panelTotals, subtotal }
  }, [meshSizes, meshOptions, dbPrices])

  const addMeshSize = () => setMeshSizes([...meshSizes, createDefaultMeshSize()])
  const updateMeshSize = (index: number, size: MeshPanelSize) => {
    const next = [...meshSizes]
    next[index] = size
    setMeshSizes(next)
  }
  const removeMeshSize = (index: number) => {
    if (meshSizes.length > 1) setMeshSizes(meshSizes.filter((_, i) => i !== index))
  }

  const addMeshPanelsToCart = () => {
    meshSizes.forEach((size, index) => {
      const breakdown = meshTotals.panelTotals[index]
      addItem({
        type: 'panel',
        productSku: 'mesh_panel',
        name: `Mesh Panel ${index + 1}`,
        description: `${size.widthFeet ?? 0}'${size.widthInches ?? 0}" x ${size.heightInches ?? 0}" ${meshOptions.meshType.replace(/_/g, ' ')} - ${meshOptions.meshColor}`,
        quantity: 1,
        unitPrice: breakdown.total,
        totalPrice: breakdown.total,
        options: {
          widthFeet: size.widthFeet ?? 0,
          widthInches: size.widthInches ?? 0,
          heightInches: size.heightInches ?? 0,
          meshType: meshOptions.meshType,
          color: meshOptions.meshColor,
          topAttachment: meshOptions.topAttachment,
          velcroColor: meshOptions.velcroColor || 'black',
        },
      })
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
          <Image src={`${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Mesh Panels" width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <Heading level={2} className="!mb-0">Mesh Panels</Heading>
      </div>

      <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mesh Type</label>
          <select value={meshOptions.meshType} onChange={(e) => {
            const nextType = e.target.value as MeshType
            let nextColor: MeshColor = meshOptions.meshColor
            if (nextType === 'scrim') nextColor = 'silver'
            else if (meshOptions.meshType === 'scrim') nextColor = 'black'
            else if (nextType !== 'heavy_mosquito' && meshOptions.meshColor === 'ivory') nextColor = 'black'
            setMeshOptions({ ...meshOptions, meshType: nextType, meshColor: nextColor })
          }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
            <option value="heavy_mosquito">Heavy Mosquito</option>
            <option value="no_see_um">No-See-Um</option>
            <option value="shade">Shade</option>
            <option value="scrim">Scrim</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mesh Color</label>
          <select value={meshOptions.meshColor} onChange={(e) => setMeshOptions({ ...meshOptions, meshColor: e.target.value as MeshColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
            {meshOptions.meshType === 'scrim' ? (
              <><option value="silver">Silver</option><option value="white">White</option></>
            ) : (
              <><option value="black">Black</option><option value="white">White</option>{meshOptions.meshType === 'heavy_mosquito' && <option value="ivory">Ivory</option>}</>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
          <select value={meshOptions.topAttachment} onChange={(e) => {
            const nextAttachment = e.target.value as MeshTopAttachment
            setMeshOptions({ ...meshOptions, topAttachment: nextAttachment, velcroColor: nextAttachment === 'velcro' ? (meshOptions.velcroColor || 'black') : undefined })
          }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
            {TOP_ATTACHMENTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </div>
        {meshOptions.topAttachment === 'velcro' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
            <select value={meshOptions.velcroColor || 'black'} onChange={(e) => setMeshOptions({ ...meshOptions, velcroColor: e.target.value as VelcroColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
        )}
      </Grid>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
          <div>#</div><div>Width (ft)</div><div>Width (in)</div><div>Height (in)</div><div className="text-right">Price</div><div></div>
        </div>
        {meshSizes.map((size, index) => (
          <div key={size.id} className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
            <div className="text-sm font-medium text-gray-500">{index + 1}</div>
            <div><input type="number" min={1} max={12} value={size.widthFeet ?? ''} onChange={(e) => updateMeshSize(index, { ...size, widthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="ft" /></div>
            <div><input type="number" min={0} max={11} value={size.widthInches ?? ''} onChange={(e) => updateMeshSize(index, { ...size, widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="in" /></div>
            <div><input type="number" min={24} value={size.heightInches ?? ''} onChange={(e) => updateMeshSize(index, { ...size, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent" placeholder="in" /></div>
            <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(meshTotals.panelTotals[index]?.total || 0)}</div>
            <div className="flex justify-end gap-1">
              {meshSizes.length > 1 && <button onClick={() => removeMeshSize(index)} className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" aria-label="Remove panel"><Minus className="w-4 h-4" /></button>}
              {index === meshSizes.length - 1 && <button onClick={addMeshSize} className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors" aria-label="Add panel"><Plus className="w-4 h-4" /></button>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <Text className="text-gray-600 !mb-0">Subtotal:</Text>
          <Text className="text-xl font-semibold !mb-0">${formatMoney(meshTotals.subtotal)}</Text>
        </div>
        <Button variant="primary" onClick={addMeshPanelsToCart} disabled={isLoading}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Mesh Panels
        </Button>
      </div>
    </Card>
  )
}
