'use client'

/**
 * ClearVinylPage — Customer-facing CV panel builder + stucco strips.
 *
 * Shared component used by both /order/clear-vinyl and /ordering-clear-vinyl/.
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check, ArrowRight } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Spinner,
  YouTubeEmbed,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import { useProducts, getProductOptions } from '@/hooks/useProducts'
import { usePricing } from '@/hooks/usePricing'
import { calculateVinylPanelPrice } from '@/lib/pricing/formulas'
import type { VinylPanelSize } from '@/lib/pricing/types'
import PillSelector from '../PillSelector'
import ColorSwatch from '../ColorSwatch'
import DimensionTable, { type DimensionRow } from '../DimensionTable'
import LivePriceDisplay from '../LivePriceDisplay'

function createRow(): DimensionRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

function getPanelSize(heightInches: number): string {
  if (heightInches <= 48) return 'short'
  if (heightInches <= 96) return 'medium'
  return 'tall'
}

export function ClearVinylPage() {
  const { addItem } = useCartContext()
  const { vinylPanel, isLoading: productsLoading } = useProducts()
  const { prices, isLoading: pricingLoading } = usePricing()

  // State
  const [topAttachment, setTopAttachment] = useState('standard_track')
  const [canvasColor, setCanvasColor] = useState('tbd')
  const [panels, setPanels] = useState<DimensionRow[]>([createRow()])
  const [justAdded, setJustAdded] = useState(false)

  // Options from DB
  const topAttachmentOptions = useMemo(() =>
    getProductOptions(vinylPanel, 'top_attachment').map(o => ({
      value: o.option_value,
      label: o.display_label,
      sublabel: '',
    })),
    [vinylPanel]
  )

  const canvasColorOptions = useMemo(() =>
    getProductOptions(vinylPanel, 'canvas_color').map(o => ({
      value: o.option_value,
      label: o.display_label,
      color: o.option_value,
    })),
    [vinylPanel]
  )

  // Row management
  const updateRow = useCallback((id: string, field: keyof DimensionRow, value: number | undefined) => {
    setPanels(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }, [])
  const addRow = useCallback(() => setPanels(prev => [...prev, createRow()]), [])
  const removeRow = useCallback((id: string) => setPanels(prev => prev.filter(r => r.id !== id)), [])

  // Per-row price calculation
  const calcRowPrice = useCallback((row: DimensionRow) => {
    if (!prices || !row.widthFeet || !row.heightInches) return 0
    const panelSize = getPanelSize(row.heightInches) as VinylPanelSize
    const result = calculateVinylPanelPrice(
      { panelSize, widthFeet: row.widthFeet, widthInches: row.widthInches || 0, heightInches: row.heightInches } as any,
      prices
    )
    return result.total
  }, [prices])

  const totalPrice = panels.reduce((sum, row) => sum + calcRowPrice(row), 0)
  const validPanels = panels.filter(r => r.widthFeet && r.heightInches && calcRowPrice(r) > 0)

  const handleAddToCart = useCallback(() => {
    if (validPanels.length === 0) return
    validPanels.forEach((row) => {
      const price = calcRowPrice(row)
      addItem({
        type: 'panel',
        productSku: 'vinyl_panel',
        name: 'Clear Vinyl Panel',
        description: `${row.widthFeet}'${row.widthInches ? ` ${row.widthInches}"` : ''} x ${row.heightInches}" - ${canvasColor} canvas - ${topAttachment.replace(/_/g, ' ')}`,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        options: { canvasColor, topAttachment, widthFeet: row.widthFeet!, widthInches: row.widthInches || 0, heightInches: row.heightInches! },
      })
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [validPanels, calcRowPrice, addItem, canvasColor, topAttachment])

  if (productsLoading || pricingLoading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Order Clear Vinyl Panels"
          subtitle="Custom-made clear vinyl patio enclosures. Choose your canvas color and dimensions. Ships in 3-7 business days."
          videoId={VIDEOS.CLEAR_VINYL_OVERVIEW}
          videoTitle="Clear Vinyl Overview"
          variant="compact"
        />

        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Heading level={2} className="!mb-6">Configure Your Panels</Heading>

            <div className="space-y-6">
              {/* Top Attachment */}
              {topAttachmentOptions.length > 0 && (
                <PillSelector
                  label="Top Attachment"
                  options={topAttachmentOptions}
                  value={topAttachment}
                  onChange={setTopAttachment}
                />
              )}

              {/* Canvas Color */}
              {canvasColorOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canvas Color</label>
                  <select
                    value={canvasColor}
                    onChange={(e) => setCanvasColor(e.target.value)}
                    className="w-full max-w-xs px-4 py-2.5 border-2 border-gray-200 rounded-xl font-medium focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
                  >
                    {canvasColorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Panel Dimensions Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Panel Dimensions
                </label>
                <DimensionTable
                  rows={panels}
                  onUpdateRow={updateRow}
                  onAddRow={addRow}
                  onRemoveRow={removeRow}
                  calculateRowPrice={calcRowPrice}
                  heightLabel="Height (in)"
                />
              </div>

              {/* Add to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <LivePriceDisplay price={totalPrice} dimmed={validPanels.length === 0} size="lg" label="Total:" />
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={validPanels.length === 0 || justAdded}
                  className="!rounded-full !px-6"
                >
                  {justAdded ? (
                    <><Check className="w-4 h-4 mr-2" />Added</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4 mr-2" />Add {validPanels.length} Panel{validPanels.length !== 1 ? 's' : ''} to Cart</>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Next Steps */}
        <section>
          <Heading level={2} className="!mb-4 text-center">What&apos;s Next?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/order/track-hardware" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#003365]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#003365] transition-colors">Track Hardware</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Mounting track, curves, end caps & carriers</Text>
              </Card>
            </Link>
            <Link href="/order/attachments" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#003365]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#003365] transition-colors">Attachments</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Marine snaps, magnets, elastic cord & more</Text>
              </Card>
            </Link>
            <Link href="/cart" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#406517]/40 transition-colors !bg-[#406517]/5 !border-[#406517]/20">
                <Heading level={4} className="!mb-1 group-hover:text-[#406517] transition-colors">View Cart</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Review your items and proceed to checkout</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
