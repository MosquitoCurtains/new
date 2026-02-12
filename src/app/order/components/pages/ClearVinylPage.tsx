'use client'

/**
 * ClearVinylPage — Customer-facing clear vinyl panel + zippered stucco strip ordering.
 *
 * Mirrors admin VinylPanelsSection + StuccoStripsSection (zippered), filtered for admin_only = false.
 * Used by /order/clear-vinyl and /ordering-clear-vinyl/ (shell wrapper).
 */

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Container, Stack, Grid, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { OrderPageHeader } from '../OrderPageHeader'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getProductOptions } from '@/hooks/useProducts'
import { usePricing } from '@/hooks/usePricing'
import { calculateVinylPanelPrice } from '@/lib/pricing/formulas'
import type { VinylPanelSize as VinylSizeTier, VinylTopAttachment, VelcroColor, CanvasColor } from '@/lib/pricing/types'
import StepNav from '../StepNav'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

function formatMoney(value: number) { return value.toFixed(2) }

type VinylPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

function createVinylSize(): VinylPanelSize {
  return {
    id: `vinyl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

function getSizeTier(heightInches: number | undefined): VinylSizeTier {
  if (!heightInches) return 'medium'
  if (heightInches < 48) return 'short'
  if (heightInches <= 96) return 'medium'
  return 'tall'
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

export function ClearVinylPage() {
  const { addItem } = useCartContext()
  const { vinylPanel, stuccoProducts, isLoading: productsLoading } = useProducts()
  const { prices: dbPrices, isLoading: pricingLoading } = usePricing()

  // =========================================================================
  // VINYL PANEL STATE (no includeAdminOnly for customer)
  // =========================================================================

  const topAttachmentOptions = getProductOptions(vinylPanel, 'top_attachment')
  const canvasColorOptions = getProductOptions(vinylPanel, 'canvas_color')
  const velcroColorOptions = getProductOptions(vinylPanel, 'velcro_color')

  const defaultTopAttachment = topAttachmentOptions.find(o => o.is_default)?.option_value || topAttachmentOptions[0]?.option_value || 'velcro'
  const defaultCanvasColor = canvasColorOptions.find(o => o.is_default)?.option_value || canvasColorOptions[0]?.option_value || 'tbd'
  const defaultVelcroColor = velcroColorOptions.find(o => o.is_default)?.option_value || velcroColorOptions[0]?.option_value || 'black'

  const [sizes, setSizes] = useState<VinylPanelSize[]>([createVinylSize()])
  const [sharedOptions, setSharedOptions] = useState({
    topAttachment: defaultTopAttachment as VinylTopAttachment,
    velcroColor: defaultVelcroColor as VelcroColor,
    canvasColor: defaultCanvasColor as CanvasColor,
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

  const addSize = () => setSizes([...sizes, createVinylSize()])
  const updateSize = (index: number, size: VinylPanelSize) => {
    const next = [...sizes]
    next[index] = size
    setSizes(next)
  }
  const removeSize = (index: number) => {
    if (sizes.length > 1) setSizes(sizes.filter((_, i) => i !== index))
  }

  const addVinylPanelsToCart = () => {
    sizes.forEach((size, index) => {
      const breakdown = vinylTotals.panelTotals[index]
      if (!breakdown || breakdown.total <= 0) return
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

  // =========================================================================
  // ZIPPERED STUCCO STRIPS
  // =========================================================================

  const zipperedStucco = stuccoProducts.find(p => p.sku === 'stucco_zippered') || null
  const stuccoLabel = zipperedStucco?.name || 'Zippered Stucco Strips'
  const stuccoImage = zipperedStucco?.image_url || `${IMG}/2019/11/Panel-Example-700x525.jpg`
  const stuccoRate = zipperedStucco ? Number(zipperedStucco.base_price) : 0

  const [stuccoStrips, setStuccoStrips] = useState<StuccoStrip[]>([createStuccoStrip()])

  const stuccoTotals = useMemo(() => {
    const stripTotals = stuccoStrips.map((strip) => stuccoRate * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, v) => sum + v, 0)
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
        productSku: 'stucco_zippered',
        name: `${stuccoLabel} ${index + 1}`,
        description: `${strip.heightInches ?? 0}in height x ${qty}`,
        quantity: qty,
        unitPrice: stuccoRate,
        totalPrice: stuccoRate * qty,
        options: { heightInches: strip.heightInches ?? 0, zippered: true },
      })
    })
  }

  // =========================================================================
  // LOADING
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
          title="Order Clear Vinyl Panels"
          subtitle="Custom-made clear vinyl enclosure panels with canvas aprons. Choose your size, attachment type, and canvas color."
        />

        <StepNav flow="cv" currentStep={1} />

        {/* VINYL PANELS */}
        <section>
          <Card variant="elevated" className="!p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                <Image src={vinylPanel?.image_url || `${IMG}/2019/11/Panel-Example-700x525.jpg`} alt="Vinyl Panels" width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <Heading level={2} className="!mb-0">{vinylPanel?.name || 'Clear Vinyl Panels'}</Heading>
            </div>

            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
                <select value={sharedOptions.topAttachment} onChange={(e) => setSharedOptions({ ...sharedOptions, topAttachment: e.target.value as VinylTopAttachment })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {topAttachmentOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Canvas Color</label>
                <select value={sharedOptions.canvasColor} onChange={(e) => setSharedOptions({ ...sharedOptions, canvasColor: e.target.value as CanvasColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {canvasColorOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                </select>
              </div>
              {sharedOptions.topAttachment === 'velcro' && velcroColorOptions.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
                  <select value={sharedOptions.velcroColor} onChange={(e) => setSharedOptions({ ...sharedOptions, velcroColor: e.target.value as VelcroColor })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                    {velcroColorOptions.map((o) => <option key={o.option_value} value={o.option_value}>{o.display_label}</option>)}
                  </select>
                </div>
              )}
            </Grid>

            <Text size="sm" className="text-gray-500 !mb-3">Enter full numbers only - no decimals.</Text>

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
              <Button variant="primary" onClick={addVinylPanelsToCart} disabled={vinylTotals.subtotal <= 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add Vinyl Panels
              </Button>
            </div>
          </Card>
        </section>

        {/* ZIPPERED STUCCO STRIPS */}
        {zipperedStucco && (
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

        <StepNav flow="cv" currentStep={1} />

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
