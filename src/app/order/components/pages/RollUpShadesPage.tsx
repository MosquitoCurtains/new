'use client'

/**
 * RollUpShadesPage — Roll-up shade screen configurator.
 *
 * Shared component used by /order/roll-up-shades and /roll-up-shade-screens/.
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
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
import PillSelector from '../PillSelector'
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

export function RollUpShadesPage() {
  const { addItem } = useCartContext()
  const { rollupProduct, isLoading: productsLoading } = useProducts()
  const { prices, getPrice, isLoading: pricingLoading } = usePricing()

  const [ply, setPly] = useState('single')
  const [panels, setPanels] = useState<DimensionRow[]>([createRow()])
  const [justAdded, setJustAdded] = useState(false)

  const plyOptions = useMemo(() =>
    getProductOptions(rollupProduct, 'ply').map(o => ({
      value: o.option_value,
      label: o.display_label,
      sublabel: '',
    })),
    [rollupProduct]
  )

  // Row management
  const updateRow = useCallback((id: string, field: keyof DimensionRow, value: number | undefined) => {
    setPanels(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }, [])
  const addRow = useCallback(() => setPanels(prev => [...prev, createRow()]), [])
  const removeRow = useCallback((id: string) => setPanels(prev => prev.filter(r => r.id !== id)), [])

  // Per-row price
  const calcRowPrice = useCallback((row: DimensionRow) => {
    if (!prices || !row.widthFeet) return 0
    const widthInches = (row.widthFeet * 12) + (row.widthInches || 0)
    const baseFee = rollupProduct?.base_price || 0
    const plyRate = getPrice(`rollup_ply_${ply}`, 0)
    return Math.round((baseFee + widthInches * plyRate) * 100) / 100
  }, [prices, ply, rollupProduct, getPrice])

  const totalPrice = panels.reduce((sum, row) => sum + calcRowPrice(row), 0)
  const validPanels = panels.filter(r => r.widthFeet && calcRowPrice(r) > 0)

  const handleAddToCart = useCallback(() => {
    if (validPanels.length === 0) return
    validPanels.forEach((row) => {
      const price = calcRowPrice(row)
      const widthInches = (row.widthFeet! * 12) + (row.widthInches || 0)
      addItem({
        type: 'panel',
        productSku: 'rollup_shade_screen',
        name: `Roll-Up Shade Screen (${ply})`,
        description: `${widthInches}" wide - ${ply} ply`,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        options: { ply, widthInches },
      })
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [validPanels, calcRowPrice, addItem, ply])

  if (productsLoading || pricingLoading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Order Roll-Up Shade Screens"
          subtitle="Custom roll-up shade screens. Single or double ply. Just add width and we build it for you."
          videoId={VIDEOS.ROLL_UP_SHADE}
          videoTitle="Roll-Up Shade Screens"
          variant="compact"
        />

        <section>
          <Card variant="elevated" className="!p-6 md:!p-8">
            <Heading level={2} className="!mb-6">Configure Your Shade Screens</Heading>

            <div className="space-y-6">
              {plyOptions.length > 0 && (
                <PillSelector
                  label="Ply"
                  options={plyOptions}
                  value={ply}
                  onChange={setPly}
                  size="lg"
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Screen Dimensions</label>
                <DimensionTable
                  rows={panels}
                  onUpdateRow={updateRow}
                  onAddRow={addRow}
                  onRemoveRow={removeRow}
                  calculateRowPrice={calcRowPrice}
                  showWidthInches={true}
                  heightLabel="(not needed)"
                />
              </div>

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
                    <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
