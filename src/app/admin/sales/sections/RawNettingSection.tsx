'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, Info } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { PricingMap } from '@/lib/pricing/types'
import type { DBProduct } from '@/hooks/useProducts'
import { getProductOptions } from '@/hooks/useProducts'
import { calculateRawMeshPrice } from '@/lib/pricing/formulas'
import { formatMoney, createDefaultRawNettingLine, type RawNettingLine, type ProductModalInfo } from '../types'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

interface RawNettingSectionProps {
  dbPrices: PricingMap | null
  getPrice: (id: string, fallback?: number) => number
  rawMaterials: DBProduct[]
  addItem: (item: any) => void
  isLoading: boolean
  setProductModal: (info: ProductModalInfo | null) => void
}

export default function RawNettingSection({ dbPrices, getPrice, rawMaterials, addItem, isLoading, setProductModal }: RawNettingSectionProps) {
  // Separate regular mesh materials from industrial mesh
  const meshMaterials = useMemo(
    () => rawMaterials.filter(p => p.sku !== 'raw_industrial_mesh'),
    [rawMaterials]
  )
  const industrialProduct = useMemo(
    () => rawMaterials.find(p => p.sku === 'raw_industrial_mesh') || null,
    [rawMaterials]
  )

  // Build material key -> product lookup from DB products (keyed by sku suffix)
  // e.g. raw_heavy_mosquito -> "heavy_mosquito"
  const materialKeyFromSku = (sku: string) => sku.replace(/^raw_/, '')

  // Default material key for new lines
  const defaultMaterialKey = meshMaterials[0] ? materialKeyFromSku(meshMaterials[0].sku) : 'heavy_mosquito'

  const [lines, setLines] = useState<RawNettingLine[]>([createDefaultRawNettingLine()])
  const [industrialFeet, setIndustrialFeet] = useState<number | undefined>(undefined)
  const [industrialMode, setIndustrialMode] = useState<'foot' | 'roll'>('foot')

  // Lookup product data by material key
  const getProductForMaterial = (materialKey: string): DBProduct | undefined => {
    return meshMaterials.find(p => materialKeyFromSku(p.sku) === materialKey)
  }

  // Get roll widths for a material from DB options
  const getRollWidths = (materialKey: string) => {
    const product = getProductForMaterial(materialKey)
    return getProductOptions(product, 'roll_size')
  }

  // Get colors for a material from DB options
  const getColors = (materialKey: string) => {
    const product = getProductForMaterial(materialKey)
    return getProductOptions(product, 'color')
  }

  // Industrial purchase type options from DB
  const industrialPurchaseTypes = getProductOptions(industrialProduct, 'purchase_type')

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
    if (industrialMode === 'roll') return getPrice('raw_industrial_mesh_roll')
    return (industrialFeet ?? 0) * getPrice('raw_industrial_mesh_foot')
  }, [industrialMode, industrialFeet, getPrice])

  const addLine = () => setLines([...lines, createDefaultRawNettingLine()])
  const updateLine = (index: number, updates: Partial<RawNettingLine>) => {
    const next = [...lines]
    next[index] = { ...next[index], ...updates }
    // When material changes, reset roll width and color to first available from DB
    if (updates.materialType) {
      const widths = getRollWidths(updates.materialType)
      const colors = getColors(updates.materialType)
      if (widths.length && !widths.find(w => w.option_value === next[index].rollWidth)) {
        next[index].rollWidth = widths[0].option_value
      }
      if (colors.length && !colors.find(c => c.option_value === next[index].color)) {
        next[index].color = colors[0].option_value
      }
    }
    setLines(next)
  }
  const removeLine = (index: number) => {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== index))
  }

  const openMaterialModal = (materialKey: string) => {
    const product = getProductForMaterial(materialKey)
    if (!product) return
    setProductModal({
      name: product.name,
      image: product.image_url || undefined,
      price: 0,
      unit: '/ft',
      description: product.description || undefined,
      sku: product.sku,
    })
  }

  const openIndustrialModal = () => {
    if (!industrialProduct) return
    setProductModal({
      name: industrialProduct.name,
      image: industrialProduct.image_url || `${IMG}/2024/02/Industrial-Mesh-Looking-In-1200-2.jpg`,
      price: getPrice('raw_industrial_mesh_foot'),
      unit: '/ft or full roll',
      description: industrialProduct.description || undefined,
      sku: industrialProduct.sku,
    })
  }

  const addNettingToCart = () => {
    lines.forEach((line, index) => {
      if (!line.lengthFeet || line.lengthFeet <= 0) return
      const total = lineTotals.totals[index]
      const product = getProductForMaterial(line.materialType)
      addItem({
        type: 'fabric',
        productSku: product?.sku || `raw_${line.materialType}`,
        name: `Raw ${product?.name || line.materialType} ${line.rollWidth}"`,
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
        name: `${industrialProduct?.name || 'Raw Industrial Mesh'} (Full Roll)`,
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
        name: `${industrialProduct?.name || 'Raw Industrial Mesh'} (By the Foot)`,
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
            <Image src={`${IMG}/2019/12/Raw-Mesh.jpg`} alt="Raw Netting" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <Heading level={2} className="!mb-0">Raw Netting</Heading>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_40px_1fr_100px_100px_100px_80px_48px] gap-2 text-xs font-medium text-gray-600">
            <div>#</div><div></div><div>Material</div><div>Roll Width</div><div>Color</div><div>Length (ft)</div><div className="text-right">Price</div><div></div>
          </div>
          {lines.map((line, index) => {
            const widths = getRollWidths(line.materialType)
            const colors = getColors(line.materialType)
            const product = getProductForMaterial(line.materialType)
            const productImage = product?.image_url || `${IMG}/2019/12/Raw-Mesh.jpg`
            return (
              <div key={line.id} className="px-3 py-2 grid grid-cols-[40px_40px_1fr_100px_100px_100px_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0">
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div
                  className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#003365] transition-all"
                  onClick={() => openMaterialModal(line.materialType)}
                >
                  <Image src={productImage} alt={product?.name || ''} width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1">
                  <select value={line.materialType} onChange={(e) => updateLine(index, { materialType: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent">
                    {meshMaterials.map((m) => (
                      <option key={m.sku} value={materialKeyFromSku(m.sku)}>{m.name}</option>
                    ))}
                  </select>
                  <button onClick={() => openMaterialModal(line.materialType)} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-[#003365] hover:text-white text-gray-500 transition-colors shrink-0" title="Product info">
                    <Info className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <select value={line.rollWidth} onChange={(e) => updateLine(index, { rollWidth: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent">
                    {widths.map((w) => <option key={w.option_value} value={w.option_value}>{w.display_label}</option>)}
                  </select>
                </div>
                <div>
                  <select value={line.color} onChange={(e) => updateLine(index, { color: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent capitalize">
                    {colors.map((c) => <option key={c.option_value} value={c.option_value}>{c.display_label}</option>)}
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
      {industrialProduct && (
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-[#003365] transition-all"
              onClick={openIndustrialModal}
            >
              <Image src={industrialProduct.image_url || `${IMG}/2024/02/Industrial-Mesh-Looking-In-1200-2.jpg`} alt={industrialProduct.name} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Heading level={2} className="!mb-0">{industrialProduct.name}</Heading>
                <button onClick={openIndustrialModal} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-[#003365] hover:text-white text-gray-500 transition-colors shrink-0" title="Product info">
                  <Info className="w-3 h-3" />
                </button>
              </div>
              <Text size="sm" className="text-gray-500 !mb-0">
                {industrialPurchaseTypes.map((pt, i) => (
                  <span key={pt.option_value}>
                    {i > 0 && ' or '}
                    ${formatMoney(Number(pt.price))}/{pt.option_value === 'by_foot' ? 'ft' : 'roll'}
                  </span>
                ))}
              </Text>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_120px_80px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div><div>Purchase Type</div><div>Length (ft)</div><div className="text-right">Price</div>
            </div>
            <div className="px-3 py-2 grid grid-cols-[40px_1fr_120px_80px] gap-2 items-center">
              <div className="text-sm font-medium text-gray-500">1</div>
              <div>
                <select
                  value={industrialMode}
                  onChange={(e) => { setIndustrialMode(e.target.value as 'foot' | 'roll'); if (e.target.value === 'roll') setIndustrialFeet(undefined) }}
                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                >
                  {industrialPurchaseTypes.map((pt) => (
                    <option key={pt.option_value} value={pt.option_value === 'by_foot' ? 'foot' : 'roll'}>
                      {pt.display_label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {industrialMode === 'foot' ? (
                  <input
                    type="number"
                    min={1}
                    value={industrialFeet ?? ''}
                    onChange={(e) => setIndustrialFeet(e.target.value === '' ? undefined : parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="ft"
                  />
                ) : (
                  <span className="text-sm text-gray-500 px-2">330ft</span>
                )}
              </div>
              <div className="text-sm text-gray-700 text-right font-medium">${formatMoney(industrialPrice)}</div>
            </div>
          </div>

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
      )}
    </>
  )
}
