'use client'

/**
 * RawNettingProductOrder — Unified purchase section with dynamic gallery.
 *
 * Combines:
 * - Color swatch + roll size selector (shared state)
 * - 50/50 layout: config card (left) + hero image (right)
 * - MeshImageGallery beneath, starting from image #2
 * - Multi-line-item ordering (add multiple lengths)
 * - Live pricing + add-to-cart with sidebar auto-open
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { ShoppingCart, Check, Plus, Minus, Ruler, Loader2 } from 'lucide-react'
import { Card, Text, Button, Heading } from '@/lib/design-system'
import { HeaderBarSection } from '@/lib/design-system/components/sections/HeaderBarSection'
import { ImageLightbox, type ImageLightboxImage } from '@/lib/design-system/components/media/ImageLightbox'
import PillSelector, { type PillOption } from '@/app/order/components/PillSelector'
import ColorSwatch, { type ColorOption } from '@/app/order/components/ColorSwatch'
import LivePriceDisplay from '@/app/order/components/LivePriceDisplay'
import MeshImageGallery, { type GalleryImage } from './MeshImageGallery'
import { useCartContext } from '@/contexts/CartContext'
import { usePricing } from '@/hooks/usePricing'
import { calculateRawMeshPrice } from '@/lib/pricing/formulas'
import type { RawMeshConfig } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface RollSizeOption {
  value: string
  label: string
  priceLabel: string
  pricingKey: string
}

export interface MeshColorOption {
  value: string
  label: string
  color: string
}

interface LineItem {
  id: string
  lengthFeet: number | ''
}

interface RawNettingProductOrderProps {
  /** Product mesh type key, e.g. "heavy_mosquito" */
  meshType: string
  /** Display name, e.g. "Heavy Mosquito Mesh" */
  productName: string
  /** Available roll widths */
  rollSizes: RollSizeOption[]
  /** Available colors */
  colors: MeshColorOption[]
  /** Minimum length in feet */
  minLength?: number
  /** Maximum length in feet */
  maxLength?: number
}

let nextLineId = 1
function createLineItem(): LineItem {
  return { id: `ln_${nextLineId++}`, lengthFeet: '' }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function RawNettingProductOrder({
  meshType,
  productName,
  rollSizes,
  colors,
  minLength = 5,
  maxLength = 200,
}: RawNettingProductOrderProps) {
  const { addItem } = useCartContext()
  const { prices, getPrice, isLoading: pricingLoading } = usePricing()

  // Shared selections
  const [selectedRollSize, setSelectedRollSize] = useState(rollSizes[0]?.value || '')
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value || '')

  // Multi-line items
  const [lineItems, setLineItems] = useState<LineItem[]>([createLineItem()])
  const [justAdded, setJustAdded] = useState(false)

  // ---- Gallery image fetching (owned here so hero image is available) -------
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setGalleryLoading(true)

    const params = new URLSearchParams({
      product_type: 'raw_mesh',
      mesh_type: meshType,
      color: selectedColor,
      limit: '200',
    })

    fetch(`/api/gallery/images?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          setGalleryImages(data.images || [])
          setGalleryLoading(false)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch gallery images:', err)
          setGalleryImages([])
          setGalleryLoading(false)
        }
      })

    return () => controller.abort()
  }, [meshType, selectedColor])

  // ---- Lightbox (shared across hero + gallery grid) -------------------------
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const lightboxImages: ImageLightboxImage[] = galleryImages.map((img) => ({
    url: img.image_url,
    alt: img.title || 'Mesh photo',
  }))

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  // ---- Pill options for roll sizes ------------------------------------------
  const rollSizePills: PillOption[] = useMemo(
    () => rollSizes.map((rs) => ({ value: rs.value, label: rs.label, sublabel: rs.priceLabel })),
    [rollSizes]
  )

  // Color swatch options
  const colorSwatchOptions: ColorOption[] = useMemo(
    () => colors.map((c) => ({ value: c.value, label: c.label, color: c.color })),
    [colors]
  )

  // Per-foot rate
  const perFootRate = useMemo(() => {
    const currentRoll = rollSizes.find((rs) => rs.value === selectedRollSize)
    if (!currentRoll || !prices) return 0
    return getPrice(currentRoll.pricingKey, 0)
  }, [rollSizes, selectedRollSize, prices, getPrice])

  // Calculate prices for each line item
  const lineItemPrices = useMemo(() => {
    if (!prices) return lineItems.map(() => 0)
    return lineItems.map((li) => {
      if (!li.lengthFeet || li.lengthFeet < minLength) return 0
      return calculateRawMeshPrice(
        { materialType: meshType, rollWidth: parseInt(selectedRollSize, 10), lengthFeet: li.lengthFeet } as RawMeshConfig,
        prices
      )
    })
  }, [prices, lineItems, meshType, selectedRollSize, minLength])

  const subtotal = lineItemPrices.reduce((sum, p) => sum + p, 0)
  const validItemCount = lineItems.filter(
    (li, i) => typeof li.lengthFeet === 'number' && li.lengthFeet >= minLength && lineItemPrices[i] > 0
  ).length

  // Line item management
  const addLineItem = () => setLineItems([...lineItems, createLineItem()])
  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) setLineItems(lineItems.filter((li) => li.id !== id))
  }
  const updateLineItem = (id: string, lengthFeet: number | '') => {
    setLineItems(lineItems.map((li) => (li.id === id ? { ...li, lengthFeet } : li)))
  }

  // Add all valid items to cart
  const handleAddToCart = useCallback(() => {
    if (validItemCount === 0) return

    const selectedRoll = rollSizes.find((rs) => rs.value === selectedRollSize)
    const selectedColorObj = colors.find((c) => c.value === selectedColor)

    lineItems.forEach((li, index) => {
      const price = lineItemPrices[index]
      if (!li.lengthFeet || li.lengthFeet < minLength || price <= 0) return

      addItem({
        type: 'fabric',
        productSku: `raw_${meshType}`,
        name: productName,
        description: `${selectedColorObj?.label || selectedColor} - ${selectedRoll?.label || selectedRollSize} wide x ${li.lengthFeet}ft`,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        options: {
          materialType: meshType,
          rollWidth: selectedRollSize,
          color: selectedColor,
          lengthFeet: li.lengthFeet,
        },
      })
    })

    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      // Reset line items after adding to cart
      setLineItems([createLineItem()])
    }, 2000)
  }, [validItemCount, lineItems, lineItemPrices, rollSizes, selectedRollSize, colors, selectedColor, addItem, meshType, productName, minLength])

  // Hero image (first in set)
  const heroImage = galleryImages[0] || null

  return (
    <HeaderBarSection id="order-now" icon={ShoppingCart} label="Order Now" variant="green">
      <div className="space-y-6">
        {/* 50/50: Configure card (left) + Hero image (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* LEFT — Configure Your Order */}
          <Card variant="elevated" className="!p-5 md:!p-6 !border-2 !border-[#406517]/20">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Configure Your Order
                </h3>
                {perFootRate > 0 && (
                  <Text size="sm" className="text-[#406517] font-semibold !mb-0">
                    ${perFootRate.toFixed(2)}/ft
                  </Text>
                )}
              </div>

              {/* Roll Width + Color selectors */}
              <div className="flex flex-col gap-5">
                {rollSizes.length > 1 && (
                  <PillSelector
                    label="Roll Width"
                    options={rollSizePills}
                    value={selectedRollSize}
                    onChange={setSelectedRollSize}
                  />
                )}
                {colors.length > 1 && (
                  <ColorSwatch
                    label="Color"
                    options={colorSwatchOptions}
                    value={selectedColor}
                    onChange={setSelectedColor}
                    size="lg"
                  />
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Line items */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 grid grid-cols-[32px_1fr_80px_40px] gap-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div>#</div>
                  <div>Length (feet)</div>
                  <div className="text-right">Price</div>
                  <div />
                </div>
                {lineItems.map((li, index) => {
                  const price = lineItemPrices[index]
                  const isValid = typeof li.lengthFeet === 'number' && li.lengthFeet >= minLength
                  return (
                    <div
                      key={li.id}
                      className="px-4 py-3 grid grid-cols-[32px_1fr_80px_40px] gap-3 items-center border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-400">{index + 1}</div>
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <input
                          type="number"
                          min={minLength}
                          max={maxLength}
                          step={1}
                          value={li.lengthFeet}
                          onChange={(e) => {
                            const val = e.target.value
                            updateLineItem(li.id, val === '' ? '' : Math.max(0, parseInt(val, 10) || 0))
                          }}
                          placeholder={`${minLength}-${maxLength}`}
                          className="w-full max-w-[140px] px-3 py-2 border-2 border-gray-200 rounded-xl text-center text-sm font-medium focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">ft</span>
                      </div>
                      <div className="text-sm text-right font-medium tabular-nums">
                        {isValid && price > 0 ? (
                          <span className="text-[#406517]">${price.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-300">--</span>
                        )}
                      </div>
                      <div className="flex justify-end gap-1">
                        {lineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(li.id)}
                            className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                            aria-label="Remove"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add another */}
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 text-sm font-medium text-[#003365] hover:text-[#002244] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add another piece
              </button>

              {/* Minimum notice */}
              {lineItems.some(
                (li) => typeof li.lengthFeet === 'number' && li.lengthFeet > 0 && li.lengthFeet < minLength
              ) && (
                <p className="text-xs text-amber-600">Minimum order: {minLength} feet per piece</p>
              )}

              {/* Subtotal + Add to Cart */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <LivePriceDisplay price={subtotal} dimmed={validItemCount === 0} size="lg" label="" />
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={validItemCount === 0 || pricingLoading || justAdded}
                  className="!rounded-full !px-6"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart{validItemCount > 1 ? ` (${validItemCount})` : ''}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* RIGHT — Hero image (first from gallery) */}
          {galleryLoading ? (
            <div className="flex items-center justify-center aspect-[3/2] rounded-xl bg-gray-50 border-2 border-gray-100">
              <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
            </div>
          ) : heroImage ? (
            <button
              onClick={() => openLightbox(0)}
              className="relative group rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#406517] focus:ring-offset-2 w-full"
            >
              <div className="aspect-[3/2] w-full">
                <img
                  src={heroImage.image_url}
                  alt={heroImage.title || 'Mesh photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {galleryImages.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {galleryImages.length} photos
                </div>
              )}
            </button>
          ) : null}
        </div>

        {/* Gallery grid — remaining images (skip first, already shown above) */}
        {galleryImages.length > 1 && (
          <MeshImageGallery
            images={galleryImages}
            loading={galleryLoading}
            startIndex={1}
            onImageClick={openLightbox}
          />
        )}
      </div>

      {/* Lightbox — shared for hero + grid */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
        showCopyButton={false}
        showThumbnails={true}
        showCounter={true}
      />
    </HeaderBarSection>
  )
}
