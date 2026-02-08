'use client'

/**
 * MeshPanelsPage — Customer-facing MC panel builder + stucco strips.
 *
 * Shared component used by both /order/mosquito-curtains and /order-mesh-panels/.
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
import { useProducts, getProductOptions, getFilteredOptions } from '@/hooks/useProducts'
import { usePricing } from '@/hooks/usePricing'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import type { MeshType } from '@/lib/pricing/types'
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

export function MeshPanelsPage() {
  const { addItem } = useCartContext()
  const { meshPanel, stuccoProducts, isLoading: productsLoading } = useProducts()
  const { prices, isLoading: pricingLoading } = usePricing()

  // State
  const [meshType, setMeshType] = useState('heavy_mosquito')
  const [color, setColor] = useState('black')
  const [topAttachment, setTopAttachment] = useState('standard_track')
  const [panels, setPanels] = useState<DimensionRow[]>([createRow()])
  const [justAdded, setJustAdded] = useState(false)

  // Options from DB
  const meshTypeOptions = useMemo(() =>
    getProductOptions(meshPanel, 'mesh_type').map(o => ({
      value: o.option_value,
      label: o.display_label,
      sublabel: '',
    })),
    [meshPanel]
  )

  const colorOptions = useMemo(() =>
    getFilteredOptions(meshPanel, 'color', meshType).map(o => ({
      value: o.option_value,
      label: o.display_label,
      color: o.option_value,
    })),
    [meshPanel, meshType]
  )

  const topAttachmentOptions = useMemo(() =>
    getProductOptions(meshPanel, 'top_attachment').map(o => ({
      value: o.option_value,
      label: o.display_label,
      sublabel: '',
    })),
    [meshPanel]
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
    const result = calculateMeshPanelPrice(
      { meshType: meshType as MeshType, widthFeet: row.widthFeet, widthInches: row.widthInches || 0, heightInches: row.heightInches } as any,
      prices
    )
    return result.total
  }, [prices, meshType])

  const totalPrice = panels.reduce((sum, row) => sum + calcRowPrice(row), 0)
  const validPanels = panels.filter(r => r.widthFeet && r.heightInches && calcRowPrice(r) > 0)

  const handleAddToCart = useCallback(() => {
    if (validPanels.length === 0) return
    validPanels.forEach((row) => {
      const price = calcRowPrice(row)
      addItem({
        type: 'panel',
        productSku: 'mesh_panel',
        name: `Mesh Panel - ${meshType.replace(/_/g, ' ')}`,
        description: `${row.widthFeet}'${row.widthInches ? ` ${row.widthInches}"` : ''} x ${row.heightInches}" - ${color} - ${topAttachment.replace(/_/g, ' ')}`,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        options: { meshType, color, topAttachment, widthFeet: row.widthFeet!, widthInches: row.widthInches || 0, heightInches: row.heightInches! },
      })
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [validPanels, calcRowPrice, addItem, meshType, color, topAttachment])

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
        {/* Hero */}
        <PowerHeaderTemplate
          title="Order Mosquito Curtain Panels"
          subtitle="Custom-made mosquito netting panels. Choose your mesh, color, and dimensions. Ships in 3-7 business days."
          videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW}
          videoTitle="Mosquito Curtains Overview"
          variant="compact"
        />

        {/* Panel Configurator */}
        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Heading level={2} className="!mb-6">Configure Your Panels</Heading>

            <div className="space-y-6">
              {/* Mesh Type */}
              {meshTypeOptions.length > 0 && (
                <PillSelector
                  label="Mesh Type"
                  options={meshTypeOptions}
                  value={meshType}
                  onChange={(v) => { setMeshType(v); setColor('black') }}
                />
              )}

              {/* Color */}
              {colorOptions.length > 0 && (
                <ColorSwatch
                  label="Color"
                  options={colorOptions}
                  value={color}
                  onChange={setColor}
                />
              )}

              {/* Top Attachment */}
              {topAttachmentOptions.length > 0 && (
                <PillSelector
                  label="Top Attachment"
                  options={topAttachmentOptions}
                  value={topAttachment}
                  onChange={setTopAttachment}
                />
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
                    <><Check className="w-4 h-4 mr-2" />Added {validPanels.length} Panel{validPanels.length !== 1 ? 's' : ''}</>
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
