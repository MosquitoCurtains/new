'use client'

/**
 * Shared Sales Page Layout
 *
 * Renders the tabbed sales interface for any mode.
 * Each route (mc-sales, cv-sales, rn-sales, ru-sales) renders
 * this component with the appropriate mode prop.
 *
 * Collapsible cart sidebar on the right mirrors the left admin sidebar.
 * The sidebar is fixed-position, same pattern as the admin layout's left sidebar.
 */

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Stack, Heading, Text } from '@/lib/design-system'
import { useCart } from '@/hooks/useCart'
import { usePricing } from '@/hooks/usePricing'
import { useProducts } from '@/hooks/useProducts'
import type { DBProductOption } from '@/hooks/useProducts'
import type { SalesMode, ProductModalInfo } from './types'
import { SALES_MODE_LABELS, SALES_MODE_SHORT } from './types'

import {
  MeshPanelsSection,
  VinylPanelsSection,
  RawNettingSection,
  RollUpShadeSection,
  StuccoStripsSection,
  TrackHardwareSection,
  AttachmentItemsSection,
  SnapToolSection,
  AdjustmentsSection,
  PriceAdjustmentsSection,
} from './sections'
import ProductDetailModal from './sections/ProductDetailModal'
import CartSidebar from './sections/CartSidebar'

const MODE_ROUTES: Record<SalesMode, string> = {
  mc: '/admin/mc-sales',
  cv: '/admin/cv-sales',
  rn: '/admin/rn-sales',
  ru: '/admin/ru-sales',
}

const MODES: SalesMode[] = ['mc', 'cv', 'rn', 'ru']

export default function SalesPageLayout({ mode }: { mode: SalesMode }) {
  const router = useRouter()
  const [cartCollapsed, setCartCollapsed] = useState(false)

  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading: cartLoading,
    itemCount,
  } = useCart()
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

  const [productModal, setProductModal] = useState<ProductModalInfo | null>(null)

  const adjustmentOptions = useMemo<DBProductOption[]>(() => {
    if (!adjustmentProduct?.options) return []
    return (adjustmentProduct.options as DBProductOption[]).filter(o => o.option_name === 'type')
  }, [adjustmentProduct])

  const setMode = (newMode: SalesMode) => {
    router.push(MODE_ROUTES[newMode])
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
    <>
      {/* Main content — margin-right offsets for the fixed cart sidebar */}
      <div
        className="transition-[margin] duration-300 ease-in-out"
        style={{ marginRight: cartCollapsed ? 48 : 288 }}
      >
        <Container size="xl">
          <Stack gap="lg">
            {/* Header */}
            <section>
              <Heading level={1} className="!mb-1">{SALES_MODE_LABELS[mode]} Sales</Heading>
              <Text className="text-gray-600">
                Salesperson order builder. All pricing from database.
              </Text>
            </section>

            {/* Mode Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m
                      ? 'bg-[#003365] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {SALES_MODE_SHORT[m]}
                </button>
              ))}
            </div>

            {/* MC Mode */}
            {mode === 'mc' && (
              <>
                <MeshPanelsSection dbPrices={dbPrices} addItem={addItem} isLoading={cartLoading} />
                <StuccoStripsSection getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} getPrice={getPrice} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* CV Mode */}
            {mode === 'cv' && (
              <>
                <VinylPanelsSection dbPrices={dbPrices} addItem={addItem} isLoading={cartLoading} />
                <StuccoStripsSection zippered getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} getPrice={getPrice} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* RN Mode */}
            {mode === 'rn' && (
              <>
                <RawNettingSection dbPrices={dbPrices} getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} getPrice={getPrice} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* RU Mode */}
            {mode === 'ru' && (
              <>
                <RollUpShadeSection addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}
          </Stack>
        </Container>
      </div>

      {/* Fixed Cart Sidebar — mirrors the admin left sidebar pattern */}
      <CartSidebar
        items={cart?.items ?? []}
        subtotal={cart?.subtotal ?? 0}
        itemCount={itemCount}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
        collapsed={cartCollapsed}
        onToggleCollapse={() => setCartCollapsed(!cartCollapsed)}
      />

      {/* Product Detail Modal */}
      {productModal && <ProductDetailModal product={productModal} onClose={() => setProductModal(null)} />}
    </>
  )
}
