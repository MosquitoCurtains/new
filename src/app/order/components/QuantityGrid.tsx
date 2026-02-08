'use client'

/**
 * QuantityGrid — Grid of products with image, price, +/- quantity stepper.
 *
 * Used for: Track hardware, Attachments, RN Attachments.
 * Renders a responsive grid of product cards with quantity controls.
 */

import { Plus, Minus, Info } from 'lucide-react'
import { Card, Text, Frame, Grid } from '@/lib/design-system'
import type { DBProduct } from '@/hooks/useProducts'
import { getPriceLabel } from '@/hooks/useProducts'

// =============================================================================
// TYPES
// =============================================================================

export interface QuantityItem {
  product: DBProduct
  quantity: number
}

interface QuantityGridProps {
  items: QuantityItem[]
  onUpdateQuantity: (sku: string, quantity: number) => void
  /** How many columns on desktop? */
  columns?: 2 | 3 | 4
  /** Show product description? */
  showDescription?: boolean
  /** Show product info modal on click? */
  onProductInfo?: (product: DBProduct) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function QuantityGrid({
  items,
  onUpdateQuantity,
  columns = 3,
  showDescription = false,
  onProductInfo,
}: QuantityGridProps) {
  const colMap = {
    2: { mobile: 1 as const, tablet: 2 as const },
    3: { mobile: 1 as const, tablet: 2 as const, desktop: 3 as const },
    4: { mobile: 2 as const, tablet: 3 as const, desktop: 4 as const },
  }

  return (
    <Grid responsiveCols={colMap[columns]} gap="md">
      {items.map(({ product, quantity }) => {
        const step = product.quantity_step || 1
        const min = product.quantity_min || 0
        const max = product.quantity_max || 999

        return (
          <Card key={product.sku} variant="outlined" className="!p-0 overflow-hidden">
            {/* Product Image */}
            {product.image_url && (
              <Frame ratio="4/3" className="bg-gray-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </Frame>
            )}

            <div className="p-4">
              {/* Name + Info */}
              <div className="flex items-start justify-between gap-1 mb-1">
                <Text className="font-semibold text-gray-900 !mb-0 text-sm leading-tight">
                  {product.name}
                </Text>
                {onProductInfo && (
                  <button
                    onClick={() => onProductInfo(product)}
                    className="text-gray-300 hover:text-[#003365] transition-colors p-0.5 flex-shrink-0"
                    title="Product info"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Description */}
              {showDescription && product.description && (
                <Text size="sm" className="text-gray-500 !mb-2 line-clamp-2">
                  {product.description}
                </Text>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-lg font-bold text-[#406517]">
                  ${product.base_price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">
                  {getPriceLabel(product.unit, product.pack_quantity)}
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(product.sku, Math.max(min, quantity - step))}
                  disabled={quantity <= min}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold tabular-nums text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.sku, Math.min(max, quantity + step))}
                  disabled={quantity >= max}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {quantity > 0 && (
                  <span className="text-sm font-semibold text-[#406517] ml-auto">
                    ${(product.base_price * quantity).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </Grid>
  )
}
