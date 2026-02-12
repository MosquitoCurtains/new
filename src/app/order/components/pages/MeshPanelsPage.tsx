'use client'

/**
 * MeshPanelsPage — Customer-facing mesh panel + stucco strip ordering.
 *
 * Mirrors admin MeshPanelsSection + StuccoStripsSection, filtered for admin_only = false.
 * Used by /order/mosquito-curtains and /order-mesh-panels/ (shell wrapper).
 */

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Container, Stack, Grid, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { OrderPageHeader } from '../OrderPageHeader'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getProductOptions, getFilteredOptions } from '@/hooks/useProducts'
import { usePricing } from '@/hooks/usePricing'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import type { MeshType, MeshColor, MeshTopAttachment, VelcroColor } from '@/lib/pricing/types'
import StepNav from '../StepNav'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

function formatMoney(value: number) { return value.toFixed(2) }

type MeshPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

function createMeshSize(): MeshPanelSize {
  return {
    id: `mesh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

type StuccoStrip = {
  id: string
  heightInches: number | undefined
  quantity: number | undefined
}

function createStuccoStrip(): StuccoStrip {
  return {
    id: `stucco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    heightInches: undefined,
    quantity: undefined,
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function MeshPanelsPage() {
  const { addItem } = useCartContext()
  const { meshPanel, stuccoProducts, isLoading: productsLoading } = useProducts()
  const { prices: dbPrices, isLoading: pricingLoading } = usePricing()

  // =========================================================================
  // MESH PANEL STATE
  // =========================================================================

  // Options from DB — NO includeAdminOnly (customer-facing)
  const meshTypeOptions = getProductOptions(meshPanel, 'mesh_type')
  const topAttachmentOptions = getProductOptions(meshPanel, 'top_attachment')
  const velcroColorOptions = getProductOptions(meshPanel, 'velcro_color')

  const defaultMeshType = meshTypeOptions.find(o => o.is_default)?.option_value || meshTypeOptions[0]?.option_value || 'heavy_mosquito'
  const defaultTopAttachment = topAttachmentOptions.find(o => o.is_default)?.option_value || topAttachmentOptions[0]?.option_value || 'velcro'
  const defaultVelcroColor = velcroColorOptions.find(o => o.is_default)?.option_value || velcroColorOptions[0]?.option_value || 'black'

  const [meshOptions, setMeshOptions] = useState<{
    meshType: MeshType
    meshColor: MeshColor
    topAttachment: MeshTopAttachment
    velcroColor?: VelcroColor
  }>({
    meshType: defaultMeshType as MeshType,
    meshColor: 'black',
    topAttachment: defaultTopAttachment as MeshTopAttachment,
    velcroColor: defaultVelcroColor as VelcroColor,
  })
  const [meshSizes, setMeshSizes] = useState<MeshPanelSize[]>([createMeshSize()])

  // Colors filtered by mesh type
  const colorOptions = getFilteredOptions(meshPanel, 'color', meshOptions.meshType)

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

  const addMeshSize = () => setMeshSizes([...meshSizes, createMeshSize()])
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
      if (!breakdown || breakdown.total <= 0) return
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

  // =========================================================================
  // STUCCO STRIP STATE
  // =========================================================================

  const stuccoProduct = stuccoProducts.find(p => p.sku === 'stucco_standard') || null
  const stuccoRate = stuccoProduct ? Number(stuccoProduct.base_price) : 0
  const stuccoLabel = stuccoProduct?.name || 'Stucco Strips'
  const stuccoImage = stuccoProduct?.image_url || `${IMG}/2019/11/Panel-Example-700x525.jpg`

  const [stuccoStrips, setStuccoStrips] = useState<StuccoStrip[]>([createStuccoStrip()])

  const stuccoTotals = useMemo(() => {
    const stripTotals = stuccoStrips.map((strip) => stuccoRate * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, value) => sum + value, 0)
    return { stripTotals, subtotal }
  }, [stuccoStrips, stuccoRate])

  const addStuccoStrip = () => setStuccoStrips([...stuccoStrips, createStuccoStrip()])
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
      const qty = strip.quantity ?? 0
      if (qty <= 0) return
      addItem({
        type: 'hardware',
        productSku: 'stucco_standard',
        name: `${stuccoLabel} ${index + 1}`,
        description: `${strip.heightInches ?? 0}in height x ${qty}`,
        quantity: qty,
        unitPrice: stuccoRate,
        totalPrice: stuccoRate * qty,
        options: { heightInches: strip.heightInches ?? 0 },
      })
    })
  }

  // =========================================================================
  // LOADING STATE
  // =========================================================================

  if (productsLoading || pricingLoading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
      </Container>
    )
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <Container size="xl">
      <Stack gap="xl">
        <OrderPageHeader
          title="Order Mosquito Curtain Panels"
          subtitle="Custom-made mosquito netting panels. Choose your mesh type, color, and dimensions. Ships in 3-7 business days."
        />

        <StepNav flow="mc" currentStep={1} />

        {/* ================================================================= */}
        {/* MESH PANELS SECTION                                                */}
        {/* ================================================================= */}
        <section>
          <Card variant="elevated" className="!p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                <Image src={meshPanel?.image_url || `${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Mesh Panels" width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <Heading level={2} className="!mb-0">{meshPanel?.name || 'Mesh Panels'}</Heading>
            </div>

            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Mesh Type</label>
                <select value={meshOptions.meshType} onChange={(e) => {
                  const nextType = e.target.value as MeshType
                  const validColors = getFilteredOptions(meshPanel, 'color', nextType)
                  const currentColorStillValid = validColors.some(c => c.option_value === meshOptions.meshColor)
                  const nextColor = currentColorStillValid
                    ? meshOptions.meshColor
                    : (validColors.find(c => c.is_default)?.option_value || validColors[0]?.option_value || 'black') as MeshColor
                  setMeshOptions({ ...meshOptions, meshType: nextType, meshColor: nextColor })
                }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {meshTypeOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Mesh Color</label>
                <select value={meshOptions.meshColor} onChange={(e) => setMeshOptions({ ...meshOptions, meshColor: e.target.value as MeshColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {colorOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
                <select value={meshOptions.topAttachment} onChange={(e) => {
                  const nextAttachment = e.target.value as MeshTopAttachment
                  setMeshOptions({ ...meshOptions, topAttachment: nextAttachment, velcroColor: nextAttachment === 'velcro' ? (meshOptions.velcroColor || defaultVelcroColor as VelcroColor) : undefined })
                }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {topAttachmentOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
              {meshOptions.topAttachment === 'velcro' && velcroColorOptions.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
                  <select value={meshOptions.velcroColor || defaultVelcroColor} onChange={(e) => setMeshOptions({ ...meshOptions, velcroColor: e.target.value as VelcroColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                    {velcroColorOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                  </select>
                </div>
              )}
            </Grid>

            <Text size="sm" className="text-gray-500 !mb-3">Enter full numbers only - no decimals.</Text>

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
              <Button variant="primary" onClick={addMeshPanelsToCart} disabled={meshTotals.subtotal <= 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add Mesh Panels
              </Button>
            </div>
          </Card>
        </section>

        {/* ================================================================= */}
        {/* STUCCO STRIPS SECTION                                              */}
        {/* ================================================================= */}
        {stuccoProduct && (
          <section>
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                  <Image src={stuccoImage} alt={stuccoLabel} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div>
                  <Heading level={2} className="!mb-0">{stuccoLabel}</Heading>
                  <Text size="sm" className="text-gray-500 !mb-0">${formatMoney(stuccoRate)} per strip</Text>
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
                <Button variant="primary" onClick={addStuccoToCart} disabled={stuccoTotals.subtotal <= 0}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add {stuccoLabel}
                </Button>
              </div>
            </Card>
          </section>
        )}

        <StepNav flow="mc" currentStep={1} />

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
