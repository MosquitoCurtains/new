 'use client'

 /**
  * MC Sales
  *
  * Salesperson flow for adding products to the cart.
  * All product data comes from the database — no hardcoded constants.
  * Each product variant is its own row with price on the row.
  */

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, Info, X, ChevronDown } from 'lucide-react'
 import { Container, Stack, Grid, Card, Heading, Text, Button, Input } from '@/lib/design-system'
import type { MeshColor, MeshTopAttachment, MeshType, VelcroColor } from '@/lib/pricing/types'
 import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
 import { useCart } from '@/hooks/useCart'
 import { usePricing } from '@/hooks/usePricing'
 import { useProducts, getPriceLabel } from '@/hooks/useProducts'
 import type { DBProduct, DBProductOption } from '@/hooks/useProducts'

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
  weight?: string
}

// =============================================================================
// PRODUCT DETAIL MODAL
// =============================================================================

function ProductDetailModal({ product, onClose }: { product: ProductModalInfo; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {product.image && (
          <div className="relative w-full h-64 sm:h-72 bg-gray-50 shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, 384px"
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {!product.image && (
            <div className="flex justify-end -mt-1 -mr-1 mb-2">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-[#003365]">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">{product.unit}</span>
          </div>

          {product.packSize && product.packSize > 1 && product.packPrice !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
              <span className="text-sm text-blue-800 font-medium">
                Pack of {product.packSize} = ${product.packPrice.toFixed(2)}
              </span>
            </div>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          )}

          <div className="space-y-2 border-t border-gray-100 pt-3">
            {product.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Track Weight</span>
                <span className="font-medium text-gray-900">{product.weight}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SKU</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{product.sku}</span>
              </div>
            )}
            {product.step !== undefined && product.step > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sold In</span>
                <span className="font-medium text-gray-900">Increments of {product.step}</span>
              </div>
            )}
            {product.min !== undefined && product.max !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qty Range</span>
                <span className="font-medium text-gray-900">{product.min} &ndash; {product.max}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT IMAGES (from WordPress CDN)
// =============================================================================

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const SECTION_IMAGES = {
  meshPanels: `${IMG}/2019/11/Panel-Example-700x525.jpg`,
  standardTrack: `${IMG}/2019/10/Track-Color-White-Black-700x700.jpg`,
  heavyTrack: `${IMG}/2019/10/Heavy-Track-BW-700x700.jpg`,
  attachmentItems: `${IMG}/2019/12/Attachment-Items-700x700.jpg`,
  adjustments: `${IMG}/2019/12/Product-Adjustment-Image-700x700.png`,
}

 const TOP_ATTACHMENTS = [
   { id: 'standard_track', label: 'Standard Track (<10 Tall Panels)' },
   { id: 'heavy_track', label: 'Heavy Track (>10 Tall Panels)' },
   { id: 'velcro', label: 'Velcro\u00AE' },
   { id: 'special_rigging', label: 'Special Rigging' },
 ] as const

type MeshPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

type StuccoStrip = {
  id: string
  heightInches: number | undefined
  quantity: number | undefined
}

type AdjustmentLine = {
  id: string
  type: string
  quantity: number
  price: number
  description: string
}

function createDefaultMeshSize(): MeshPanelSize {
  return {
    id: `mesh-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

function createDefaultStuccoStrip(): StuccoStrip {
  return {
    id: `stucco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    heightInches: undefined,
    quantity: undefined,
  }
}

function createDefaultAdjustmentLine(): AdjustmentLine {
  return {
    id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: '',
    quantity: 1,
    price: 0,
    description: '',
  }
}

 function formatMoney(value: number) {
   return value.toFixed(2)
 }

 // =============================================================================
 // COMPONENT
 // =============================================================================

 export default function MCSalesPage() {
   const router = useRouter()
   const { addItem, isLoading } = useCart()
   const { prices: dbPrices, isLoading: pricingLoading, getPrice } = usePricing()
   const {
     standardTrackItems,
     heavyTrackItems,
     attachmentItems,
     attachmentGroups,
     adjustmentProduct,
     snapTool,
     isLoading: productsLoading,
   } = useProducts()

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
   const [stuccoStrips, setStuccoStrips] = useState<StuccoStrip[]>([createDefaultStuccoStrip()])
   const [trackWeight, setTrackWeight] = useState<'standard' | 'heavy'>('standard')
   const [trackColor, setTrackColor] = useState<'white' | 'black'>('white')
   const [trackQtys, setTrackQtys] = useState<Record<string, number>>({})
   const [attachmentQtys, setAttachmentQtys] = useState<Record<string, number>>({})
   const [productModal, setProductModal] = useState<ProductModalInfo | null>(null)
   const [adjustmentLines, setAdjustmentLines] = useState<AdjustmentLine[]>([])
   const [legacyAdjustments, setLegacyAdjustments] = useState({
     positive: 0,
     negative: 0,
     taxCredit: 0,
     tariff: 0,
   })

   // Get adjustment options from the adjustment product
   const adjustmentOptions = useMemo<DBProductOption[]>(() => {
     if (!adjustmentProduct?.options) return []
     return (adjustmentProduct.options as DBProductOption[]).filter(o => o.option_name === 'type')
   }, [adjustmentProduct])

   // Track items based on selected weight
   const activeTrackItems = useMemo(() => {
     return trackWeight === 'heavy' ? heavyTrackItems : standardTrackItems
   }, [trackWeight, standardTrackItems, heavyTrackItems])

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

  const stuccoTotals = useMemo(() => {
    const stuccoRate = getPrice('stucco_standard', 24)
    const stripTotals = stuccoStrips.map((strip) => (strip.heightInches ?? 0) * stuccoRate * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, value) => sum + value, 0)
    return { stripTotals, subtotal }
  }, [stuccoStrips, getPrice])

   const trackPricing = useMemo(() => {
     const subtotal = activeTrackItems.reduce((sum, t) => {
       const qty = trackQtys[t.sku] || 0
       return sum + qty * Number(t.base_price)
     }, 0)
     return { subtotal }
   }, [trackQtys, activeTrackItems])

  const addMeshSize = () => setMeshSizes([...meshSizes, createDefaultMeshSize()])
  const updateMeshSize = (index: number, size: MeshPanelSize) => {
    const next = [...meshSizes]
    next[index] = size
    setMeshSizes(next)
  }
  const removeMeshSize = (index: number) => {
    if (meshSizes.length > 1) {
      setMeshSizes(meshSizes.filter((_, i) => i !== index))
    }
  }

  const addStuccoStrip = () => setStuccoStrips([...stuccoStrips, createDefaultStuccoStrip()])
  const updateStuccoStrip = (index: number, strip: StuccoStrip) => {
    const next = [...stuccoStrips]
    next[index] = strip
    setStuccoStrips(next)
  }
  const removeStuccoStrip = (index: number) => {
    if (stuccoStrips.length > 1) {
      setStuccoStrips(stuccoStrips.filter((_, i) => i !== index))
    }
  }

   const addMeshPanelsToCart = () => {
    meshSizes.forEach((size, index) => {
       const breakdown = meshTotals.panelTotals[index]
      const totalWidth = (size.widthFeet ?? 0) + ((size.widthInches ?? 0) / 12)
       addItem({
         type: 'panel',
         productSku: 'mesh_panel',
        name: `Mesh Panel ${index + 1}`,
        description: `${totalWidth.toFixed(1)}ft x ${size.heightInches ?? 0}in ${meshOptions.meshType.replace(/_/g, ' ')} - ${meshOptions.meshColor}`,
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
     router.push('/cart')
   }

   const addStuccoToCart = () => {
    const stuccoRate = getPrice('stucco_standard', 24)
    stuccoStrips.forEach((strip, index) => {
      const height = strip.heightInches ?? 0
      const qty = strip.quantity ?? 0
      const unitPrice = height * stuccoRate
      addItem({
        type: 'hardware',
        productSku: 'stucco_strip',
        name: `Stucco Strip ${index + 1}`,
        description: `${height}in height x ${qty}`,
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty,
        options: {
          heightInches: height,
        },
      })
    })
    router.push('/cart')
  }

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
     router.push('/cart')
   }

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
       options: {
         quantity: qty,
         unit: item.unit,
       },
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
           options: {
             quantity: qty,
             unit: item.unit,
           },
         })
       }
     })
     setAttachmentQtys({})
     router.push('/cart')
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

   // Adjustment line management
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
         options: {
           adjustment_type: line.type,
         },
       })
     })
     setAdjustmentLines([])
     router.push('/cart')
   }

   const adjustmentSubtotal = useMemo(() => {
     return adjustmentLines.reduce((sum, line) => sum + (line.price * line.quantity), 0)
   }, [adjustmentLines])

   const addLegacyAdjustment = (type: 'positive' | 'negative' | 'taxCredit' | 'tariff') => {
     const amount = legacyAdjustments[type]
     if (!amount) return
     const signedAmount = (type === 'negative' || type === 'taxCredit')
       ? -Math.abs(amount)
       : Math.abs(amount)
     const nameMap = {
       positive: 'Positive Price Adjustment',
       negative: 'Negative Price Adjustment',
       taxCredit: 'Credit for Sales Tax Exemption',
       tariff: 'Canadian Tariff',
     }
     addItem({
       type: 'addon',
       productSku: `adjustment_${type}`,
       name: nameMap[type],
       description: 'Manual adjustment',
       quantity: 1,
       unitPrice: signedAmount,
       totalPrice: signedAmount,
       options: { amount: signedAmount },
     })
     setLegacyAdjustments((prev) => ({ ...prev, [type]: 0 }))
   }

   const addSnapTool = () => {
     const snapToolPrice = snapTool ? Number(snapTool.base_price) : getPrice('snap_tool', 130)
     addItem({
       type: 'addon',
       productSku: 'snap_tool',
       name: 'Industrial Snap Tool',
       description: 'Fully refundable if returned',
       quantity: 1,
       unitPrice: snapToolPrice,
       totalPrice: snapToolPrice,
     })
     router.push('/cart')
   }

   if (pricingLoading || productsLoading) {
     return (
       <Container size="xl">
         <div className="flex items-center justify-center min-h-[400px]">
           <div className="text-center">
             <div className="w-8 h-8 border-2 border-[#003365] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <Text className="text-gray-500 !mb-0">Loading pricing data...</Text>
           </div>
         </div>
       </Container>
     )
   }

   return (
     <Container size="xl">
       <Stack gap="lg">
         <section>
           <Heading level={1} className="!mb-1">MC Sales</Heading>
           <Text className="text-gray-600">
             Salesperson order builder. All pricing from database.
           </Text>
         </section>

        {/* Mesh Panels */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image src={SECTION_IMAGES.meshPanels} alt="Mesh Panels" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <Heading level={2} className="!mb-0">Mesh Panels</Heading>
          </div>
          
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Type</label>
              <select
                value={meshOptions.meshType}
                onChange={(e) => {
                  const nextType = e.target.value as MeshType
                  let nextColor: MeshColor = meshOptions.meshColor
                  if (nextType === 'scrim') {
                    nextColor = 'silver'
                  } else if (meshOptions.meshType === 'scrim') {
                    nextColor = 'black'
                  } else if (nextType !== 'heavy_mosquito' && meshOptions.meshColor === 'ivory') {
                    nextColor = 'black'
                  }
                  setMeshOptions({ ...meshOptions, meshType: nextType, meshColor: nextColor })
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="heavy_mosquito">Heavy Mosquito</option>
                <option value="no_see_um">No-See-Um</option>
                <option value="shade">Shade</option>
                <option value="scrim">Scrim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Color</label>
              <select
                value={meshOptions.meshColor}
                onChange={(e) => setMeshOptions({ ...meshOptions, meshColor: e.target.value as MeshColor })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                {meshOptions.meshType === 'scrim' ? (
                  <>
                    <option value="silver">Silver</option>
                    <option value="white">White</option>
                  </>
                ) : (
                  <>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    {meshOptions.meshType === 'heavy_mosquito' && (
                      <option value="ivory">Ivory</option>
                    )}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
              <select
                value={meshOptions.topAttachment}
                onChange={(e) => {
                  const nextAttachment = e.target.value as MeshTopAttachment
                  setMeshOptions({
                    ...meshOptions,
                    topAttachment: nextAttachment,
                    velcroColor: nextAttachment === 'velcro' ? (meshOptions.velcroColor || 'black') : undefined,
                  })
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                {TOP_ATTACHMENTS.map((attachment) => (
                  <option key={attachment.id} value={attachment.id}>{attachment.label}</option>
                ))}
              </select>
            </div>
            {meshOptions.topAttachment === 'velcro' && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
                <select
                  value={meshOptions.velcroColor || 'black'}
                  onChange={(e) => setMeshOptions({ ...meshOptions, velcroColor: e.target.value as VelcroColor })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  <option value="black">Black</option>
                  <option value="white">White</option>
                </select>
              </div>
            )}
          </Grid>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div>
              <div>Width (ft)</div>
              <div>Width (in)</div>
              <div>Height (in)</div>
              <div className="text-right">Price</div>
              <div></div>
            </div>
            
            {meshSizes.map((size, index) => (
              <div 
                key={size.id} 
                className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={size.widthFeet ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, widthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="ft"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={size.widthInches ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={24}
                    value={size.heightInches ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div className="text-sm text-gray-700 text-right font-medium">
                  ${formatMoney(meshTotals.panelTotals[index]?.total || 0)}
                </div>
                <div className="flex justify-end gap-1">
                  {meshSizes.length > 1 && (
                    <button
                      onClick={() => removeMeshSize(index)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Remove panel"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === meshSizes.length - 1 && (
                    <button
                      onClick={addMeshSize}
                      className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                      aria-label="Add panel"
                    >
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
              <Text className="text-xl font-semibold !mb-0">${formatMoney(meshTotals.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addMeshPanelsToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Mesh Panels
            </Button>
          </div>
        </Card>

         {/* Stucco Strips */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image src={SECTION_IMAGES.meshPanels} alt="Stucco Strips" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <Heading level={2} className="!mb-0">Stucco Strips</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">${formatMoney(getPrice('stucco_standard', 24))} per inch of height</Text>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div>
              <div>Height (in)</div>
              <div>Quantity</div>
              <div className="text-right">Price</div>
              <div></div>
            </div>
            
            {stuccoStrips.map((strip, index) => (
              <div 
                key={strip.id} 
                className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={strip.heightInches ?? ''}
                    onChange={(e) => updateStuccoStrip(index, { ...strip, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={strip.quantity ?? ''}
                    onChange={(e) => updateStuccoStrip(index, { ...strip, quantity: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="qty"
                  />
                </div>
                <div className="text-sm text-gray-700 text-right font-medium">
                  ${formatMoney(stuccoTotals.stripTotals[index] || 0)}
                </div>
                <div className="flex justify-end gap-1">
                  {stuccoStrips.length > 1 && (
                    <button
                      onClick={() => removeStuccoStrip(index)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Remove strip"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === stuccoStrips.length - 1 && (
                    <button
                      onClick={addStuccoStrip}
                      className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                      aria-label="Add strip"
                    >
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
              <Text className="text-xl font-semibold !mb-0">${formatMoney(stuccoTotals.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addStuccoToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Stucco Strips
            </Button>
          </div>
        </Card>

         {/* Track Hardware */}
         <Card variant="elevated" className="!p-6">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
               <Image src={trackWeight === 'heavy' ? SECTION_IMAGES.heavyTrack : SECTION_IMAGES.standardTrack} alt="Tracking Hardware" width={64} height={64} className="w-full h-full object-cover" />
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
                    <Input
                      type="number"
                      min={0}
                      step={t.quantity_step}
                      value={trackQtys[t.sku] || 0}
                      onChange={(e) => setTrackQtys(prev => ({ ...prev, [t.sku]: parseInt(e.target.value) || 0 }))}
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
            <Button
              variant="primary"
              onClick={addTracksToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Tracking Hardware
            </Button>
          </div>
         </Card>

         {/* Attachment Items */}
         <Card variant="elevated" className="!p-6">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
               <Image src={SECTION_IMAGES.attachmentItems} alt="Attachment Items" width={64} height={64} className="w-full h-full object-cover" />
             </div>
             <Heading level={2} className="!mb-0">Attachment Items</Heading>
           </div>
           <Stack gap="lg">
             {attachmentGroups.map((group) => (
               <div key={group}>
                 <Heading level={3} className="!mb-3">{group}</Heading>
                 <Stack gap="sm">
                  {attachmentItems.filter((item) => (item.category_section || 'Other') === group).map((item) => {
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
                              value={qty}
                              onChange={(e) => setAttachmentQtys((prev) => ({
                                ...prev,
                                [item.sku]: parseInt(e.target.value) || 0,
                              }))}
                              className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
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
            <Button
              variant="primary"
              onClick={addAllAttachmentItems}
              disabled={!hasSelectedAttachments || isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Attachment Items
            </Button>
          </div>
         </Card>

         {/* Snap Tool */}
         <Card variant="elevated" className="!p-6">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
             <div>
               <Heading level={2} className="!mb-1">Industrial Snap Tool</Heading>
               <Text size="sm" className="text-gray-500 !mb-0">
                 ${formatMoney(snapTool ? Number(snapTool.base_price) : getPrice('snap_tool', 130))} - Fully refundable if returned
               </Text>
             </div>
             <Button
               variant="primary"
               onClick={addSnapTool}
             >
               <ShoppingCart className="w-5 h-5 mr-2" />
               Add Snap Tool
             </Button>
           </div>
         </Card>

         {/* Adjustments — Structured line items like panels */}
         {adjustmentOptions.length > 0 && (
           <Card variant="elevated" className="!p-6">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                 <Image src={SECTION_IMAGES.adjustments} alt="Adjustments" width={64} height={64} className="w-full h-full object-cover" />
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
                 <div
                   key={line.id}
                   className="px-3 py-2 grid grid-cols-[40px_1fr_80px_100px_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
                 >
                   <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                   <div>
                     <select
                       value={line.type}
                       onChange={(e) => handleAdjustmentTypeChange(index, e.target.value)}
                       className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                     >
                       <option value="">Select type...</option>
                       {adjustmentOptions.map((opt) => (
                         <option key={opt.option_value} value={opt.option_value}>
                           {opt.display_label}
                         </option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <input
                       type="number"
                       min={1}
                       value={line.quantity}
                       onChange={(e) => updateAdjustmentLine(index, { quantity: parseInt(e.target.value) || 1 })}
                       className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                     />
                   </div>
                   <div>
                     <input
                       type="number"
                       step="0.01"
                       value={line.price}
                       onChange={(e) => updateAdjustmentLine(index, { price: parseFloat(e.target.value) || 0 })}
                       className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                     />
                   </div>
                   <div>
                     <input
                       type="text"
                       value={line.description}
                       onChange={(e) => updateAdjustmentLine(index, { description: e.target.value })}
                       className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                       placeholder="Description"
                     />
                   </div>
                   <div className="text-sm text-gray-700 text-right font-medium">
                     ${formatMoney(line.price * line.quantity)}
                   </div>
                   <div className="flex justify-end gap-1">
                     {adjustmentLines.length > 1 && (
                       <button
                         onClick={() => removeAdjustmentLine(index)}
                         className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                         aria-label="Remove adjustment"
                       >
                         <Minus className="w-4 h-4" />
                       </button>
                     )}
                     {index === adjustmentLines.length - 1 && (
                       <button
                         onClick={addAdjustmentLine}
                         className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                         aria-label="Add adjustment"
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                 </div>
               ))}

               {adjustmentLines.length === 0 && (
                 <div className="px-3 py-4 flex items-center justify-center">
                   <button
                     onClick={addAdjustmentLine}
                     className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-[#406517] hover:bg-gray-50 transition-colors"
                   >
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
                 <Button
                   variant="primary"
                   onClick={addAdjustmentLinesToCart}
                   disabled={isLoading || adjustmentLines.every(l => !l.type)}
                 >
                   <ShoppingCart className="w-5 h-5 mr-2" />
                   Add Adjustments
                 </Button>
               </div>
             )}
           </Card>
         )}

         {/* Legacy Price Adjustments */}
         <Card variant="elevated" className="!p-6">
           <Heading level={2} className="!mb-4">Price Adjustments</Heading>
           <Stack gap="sm">
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Positive Price Adjustment</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={legacyAdjustments.positive}
                     onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, positive: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addLegacyAdjustment('positive')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Negative Price Adjustment</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={legacyAdjustments.negative}
                     onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, negative: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addLegacyAdjustment('negative')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Credit for Sales Tax Exemption</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={legacyAdjustments.taxCredit}
                     onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, taxCredit: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addLegacyAdjustment('taxCredit')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Canadian Tariff</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={legacyAdjustments.tariff}
                     onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, tariff: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addLegacyAdjustment('tariff')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
           </Stack>
         </Card>
      </Stack>

      {/* Product Detail Modal */}
      {productModal && (
        <ProductDetailModal product={productModal} onClose={() => setProductModal(null)} />
      )}
    </Container>
  )
 }
