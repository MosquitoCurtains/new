'use client'

/**
 * RawNettingOrderForm — Reusable order form for raw netting products.
 *
 * Renders: PillSelector (roll sizes) + ColorSwatch + Length input + LivePriceDisplay + Add to Cart.
 * Uses usePricing() and calculateRawMeshPrice() internally.
 */

import { useState, useMemo, useCallback } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Card, Button, Text } from '@/lib/design-system'
import PillSelector, { type PillOption } from './PillSelector'
import ColorSwatch, { type ColorOption } from './ColorSwatch'
import LivePriceDisplay from './LivePriceDisplay'
import { useCartContext } from '@/contexts/CartContext'
import { usePricing } from '@/hooks/usePricing'
import { calculateRawMeshPrice } from '@/lib/pricing/formulas'
import type { RawMeshConfig } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface RollSizeOption {
  /** e.g. "101", "123", "138", "120", "140" */
  value: string
  /** e.g. '101"', '123"' */
  label: string
  /** e.g. "$5.50/ft" */
  priceLabel: string
  /** The pricing key, e.g. "raw_panel_hm_101" */
  pricingKey: string
}

export interface MeshColorOption {
  value: string
  label: string
  color: string
}

interface RawNettingOrderFormProps {
  /** The material type key (matches DB sku), e.g. "heavy_mosquito" */
  materialType: string
  /** Product display name, e.g. "Heavy Mosquito Mesh" */
  productName: string
  /** Available roll sizes */
  rollSizes: RollSizeOption[]
  /** Available colors */
  colors: MeshColorOption[]
  /** Optional: minimum length in feet (default 5) */
  minLength?: number
  /** Optional: maximum length in feet (default 200) */
  maxLength?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function RawNettingOrderForm({
  materialType,
  productName,
  rollSizes,
  colors,
  minLength = 5,
  maxLength = 200,
}: RawNettingOrderFormProps) {
  const { addItem } = useCartContext()
  const { prices, getPrice, isLoading: pricingLoading } = usePricing()

  // State
  const [selectedRollSize, setSelectedRollSize] = useState(rollSizes[0]?.value || '')
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value || '')
  const [lengthFeet, setLengthFeet] = useState<number | ''>('')
  const [justAdded, setJustAdded] = useState(false)

  // Convert roll sizes to PillOption format
  const rollSizePills: PillOption[] = useMemo(() => {
    return rollSizes.map(rs => ({
      value: rs.value,
      label: rs.label,
      sublabel: rs.priceLabel,
    }))
  }, [rollSizes])

  // Convert colors to ColorOption format
  const colorSwatchOptions: ColorOption[] = useMemo(() => {
    return colors.map(c => ({
      value: c.value,
      label: c.label,
      color: c.color,
    }))
  }, [colors])

  // Calculate live price
  const livePrice = useMemo(() => {
    if (!prices || !lengthFeet || lengthFeet < minLength) return 0
    return calculateRawMeshPrice(
      { materialType, rollWidth: parseInt(selectedRollSize, 10), lengthFeet } as RawMeshConfig,
      prices
    )
  }, [prices, lengthFeet, materialType, selectedRollSize, minLength])

  // Per-foot rate for display
  const perFootRate = useMemo(() => {
    const currentRoll = rollSizes.find(rs => rs.value === selectedRollSize)
    if (!currentRoll || !prices) return 0
    return getPrice(currentRoll.pricingKey, 0)
  }, [rollSizes, selectedRollSize, prices, getPrice])

  const handleAddToCart = useCallback(() => {
    if (!lengthFeet || lengthFeet < minLength || livePrice <= 0) return

    const selectedRoll = rollSizes.find(rs => rs.value === selectedRollSize)
    const selectedColorObj = colors.find(c => c.value === selectedColor)

    addItem({
      type: 'fabric',
      productSku: 'raw_netting_panel',
      name: productName,
      description: `${selectedColorObj?.label || selectedColor} - ${selectedRoll?.label || selectedRollSize} wide x ${lengthFeet}ft`,
      quantity: 1,
      unitPrice: livePrice,
      totalPrice: livePrice,
      options: {
        mesh_type: materialType,
        [`roll_width_${materialType}`]: selectedRollSize,
        color: selectedColor,
        purchase_type: 'by_foot',
        lengthFeet,
      },
    })

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [lengthFeet, minLength, livePrice, rollSizes, selectedRollSize, colors, selectedColor, addItem, materialType, productName])

  const isValid = typeof lengthFeet === 'number' && lengthFeet >= minLength && lengthFeet <= maxLength

  return (
    <Card variant="elevated" className="!p-6 !border-2 !border-[#406517]/20">
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900">Configure Your Order</h3>

        {/* Roll Size */}
        {rollSizes.length > 1 && (
          <PillSelector
            label="Roll Width"
            options={rollSizePills}
            value={selectedRollSize}
            onChange={setSelectedRollSize}
          />
        )}

        {/* Color */}
        {colors.length > 1 && (
          <ColorSwatch
            label="Color"
            options={colorSwatchOptions}
            value={selectedColor}
            onChange={setSelectedColor}
          />
        )}

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length (feet)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={minLength}
              max={maxLength}
              step={1}
              value={lengthFeet}
              onChange={(e) => {
                const val = e.target.value
                setLengthFeet(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0))
              }}
              placeholder={`${minLength}-${maxLength}`}
              className="w-32 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-center text-lg font-medium focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
            />
            <Text size="sm" className="text-gray-500 !mb-0">
              feet {perFootRate > 0 && `@ $${perFootRate.toFixed(2)}/ft`}
            </Text>
          </div>
          {typeof lengthFeet === 'number' && lengthFeet > 0 && lengthFeet < minLength && (
            <p className="text-xs text-amber-600 mt-1">Minimum order: {minLength} feet</p>
          )}
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <LivePriceDisplay
            price={livePrice}
            dimmed={!isValid}
            size="lg"
            label=""
          />
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!isValid || pricingLoading || justAdded}
            className="!rounded-full !px-6"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
