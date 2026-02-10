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

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import ProjectBar from './sections/ProjectBar'
import PhoneOrderModal from './sections/PhoneOrderModal'
import type { PhoneOrderData } from './sections/PhoneOrderModal'

const MODE_ROUTES: Record<SalesMode, string> = {
  mc: '/admin/mc-sales',
  cv: '/admin/cv-sales',
  rn: '/admin/rn-sales',
  ru: '/admin/ru-sales',
}

const MODES: SalesMode[] = ['mc', 'cv', 'rn', 'ru']

// Staff & Project types for the ProjectBar
interface Staff {
  id: string
  name: string
  email: string
  is_active: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ProjectData {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  product_type: string
  status: string
  share_token: string
  estimated_total: number | null
  assigned_to: string | null
  notes: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leads?: any
}

export default function SalesPageLayout({ mode }: { mode: SalesMode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cartCollapsed, setCartCollapsed] = useState(false)

  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading: cartLoading,
    itemCount,
    isSaving,
    dbCartId,
    saveToDb,
    loadFromProject,
    loadFromDb,
  } = useCart()
  const { prices: dbPrices, isLoading: pricingLoading, getPrice } = usePricing()
  const {
    standardTrackItems,
    heavyTrackItems,
    attachmentItems,
    attachmentGroups,
    adjustmentProduct,
    meshPanel,
    vinylPanel,
    rollupProduct,
    stuccoProducts,
    snapTool,
    rawMaterials,
    isLoading: productsLoading,
  } = useProducts()

  const [productModal, setProductModal] = useState<ProductModalInfo | null>(null)

  // Project Bar state
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [selectedSalesperson, setSelectedSalesperson] = useState<Staff | null>(null)
  const [staffList, setStaffList] = useState<Staff[]>([])

  // Load staff list on mount
  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch('/api/admin/staff?active=true')
        const data = await res.json()
        if (data.staff) setStaffList(data.staff)
      } catch {
        // Staff API might not exist yet; fail silently
      }
    }
    fetchStaff()
  }, [])

  // Load project from URL params (?project=UUID or ?cart=UUID)
  useEffect(() => {
    const projectParam = searchParams.get('project')
    const cartParam = searchParams.get('cart')

    if (projectParam) {
      // Load project and its cart
      const pid = projectParam
      async function loadProject() {
        try {
          const res = await fetch(`/api/admin/sales/projects/${pid}`)
          const data = await res.json()
          if (data.project) {
            setSelectedProject(data.project)
            // Load the project's cart into useCart
            await loadFromProject(pid)
          }
        } catch (err) {
          console.error('Error loading project from URL:', err)
        }
      }
      loadProject()
    } else if (cartParam) {
      // Load cart and resolve its project
      const cid = cartParam
      async function loadCart() {
        try {
          await loadFromDb(cid)
          const res = await fetch(`/api/admin/carts/${cartParam}`)
          const data = await res.json()
          if (data.cart?.projects) {
            const proj = Array.isArray(data.cart.projects) ? data.cart.projects[0] : data.cart.projects
            setSelectedProject(proj)
          }
        } catch (err) {
          console.error('Error loading cart from URL:', err)
        }
      }
      loadCart()
    }
  }, [searchParams, loadFromProject, loadFromDb])

  // --- Save cart to DB ---
  const handleSave = useCallback(async () => {
    if (!selectedProject) return
    const cartId = await saveToDb(
      selectedProject.id,
      selectedSalesperson?.id,
      selectedSalesperson?.name,
      mode,
    )
    if (cartId) {
      // Update URL with project param if not already there
      const url = new URL(window.location.href)
      if (!url.searchParams.has('project')) {
        url.searchParams.set('project', selectedProject.id)
        router.replace(url.pathname + url.search)
      }
    }
  }, [selectedProject, selectedSalesperson, mode, saveToDb, router])

  // --- Send cart to customer ---
  const handleSend = useCallback(async () => {
    if (!selectedProject) return
    // Save first
    await handleSave()
    // Copy the share link
    const url = `${window.location.origin}/project/${selectedProject.share_token}`
    navigator.clipboard.writeText(url)
    // Update project status to quote_sent
    try {
      await fetch(`/api/admin/sales/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'quote_sent' }),
      })
      setSelectedProject((prev) => prev ? { ...prev, status: 'quote_sent' } : null)
    } catch (err) {
      console.error('Error updating project status:', err)
    }
    alert(`Quote link copied to clipboard!\n\n${url}`)
  }, [selectedProject, handleSave])

  // --- Place order directly ---
  const handlePlaceOrder = useCallback(async () => {
    if (!selectedProject) return
    // Save cart first
    const cartId = await saveToDb(
      selectedProject.id,
      selectedSalesperson?.id,
      selectedSalesperson?.name,
      mode,
    )
    if (!cartId) return

    if (!confirm('Place order from this cart? This will create an order and mark the cart as converted.')) return

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId }),
      })
      const data = await res.json()
      if (data.success && data.order) {
        alert(`Order created: ${data.order_number}`)
        router.push(`/admin/orders/${data.order.id}`)
      } else {
        alert('Failed to create order: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Error placing order')
    }
  }, [selectedProject, selectedSalesperson, mode, saveToDb, router])

  // --- Phone Order Modal ---
  const [phoneOrderOpen, setPhoneOrderOpen] = useState(false)

  const handleOpenPhoneOrder = useCallback(async () => {
    if (!selectedProject) return
    // Save cart first
    const cartId = await saveToDb(
      selectedProject.id,
      selectedSalesperson?.id,
      selectedSalesperson?.name,
      mode,
    )
    if (!cartId) return
    setPhoneOrderOpen(true)
  }, [selectedProject, selectedSalesperson, mode, saveToDb])

  const handlePhoneOrderSubmit = useCallback(async (data: PhoneOrderData) => {
    if (!dbCartId) throw new Error('Cart must be saved first')

    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: dbCartId,
        payment_method: data.payment_method,
        payment_transaction_id: data.payment_transaction_id,
        payment_status: data.payment_status,
        billing_first_name: data.billing_first_name,
        billing_last_name: data.billing_last_name,
        billing_phone: data.billing_phone,
        billing_email: data.billing_email,
        billing_address_1: data.billing_address_1,
        billing_address_2: data.billing_address_2,
        billing_city: data.billing_city,
        billing_state: data.billing_state,
        billing_zip: data.billing_zip,
        shipping_first_name: data.shipping_first_name,
        shipping_last_name: data.shipping_last_name,
        shipping_address_1: data.shipping_address_1,
        shipping_address_2: data.shipping_address_2,
        shipping_city: data.shipping_city,
        shipping_state: data.shipping_state,
        shipping_zip: data.shipping_zip,
        internal_note: data.internal_note,
        order_source: 'phone_sale',
      }),
    })
    const result = await res.json()
    if (result.success && result.order) {
      setPhoneOrderOpen(false)
      router.push(`/admin/orders/${result.order.id}`)
    } else {
      throw new Error(result.error || 'Failed to create order')
    }
  }, [dbCartId, router])

  // --- Handle project selection from search ---
  const handleProjectSelected = useCallback(async (project: ProjectData) => {
    setSelectedProject(project)
    // If project has a salesperson, set them
    if (project.assigned_to) {
      const staff = staffList.find((s) => s.id === project.assigned_to)
      if (staff) setSelectedSalesperson(staff)
    }
    // Load the project's cart
    await loadFromProject(project.id)
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('project', project.id)
    router.replace(url.pathname + url.search)
  }, [staffList, loadFromProject, router])

  // --- Handle new project creation ---
  const handleNewProject = useCallback(async (project: ProjectData) => {
    setSelectedProject(project)
    clearCart()
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('project', project.id)
    router.replace(url.pathname + url.search)
  }, [clearCart, router])

  const adjustmentOptions = useMemo<DBProductOption[]>(() => {
    if (!adjustmentProduct?.options) return []
    return (adjustmentProduct.options as DBProductOption[]).filter(o => o.option_name === 'type')
  }, [adjustmentProduct])

  const setMode = (newMode: SalesMode) => {
    const params = new URLSearchParams()
    if (selectedProject) params.set('project', selectedProject.id)
    const paramStr = params.toString()
    router.push(MODE_ROUTES[newMode] + (paramStr ? `?${paramStr}` : ''))
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

            {/* Project Bar */}
            <ProjectBar
              mode={mode}
              selectedProject={selectedProject as Parameters<typeof ProjectBar>[0]['selectedProject']}
              selectedSalesperson={selectedSalesperson}
              staffList={staffList}
              onProjectSelected={(p) => handleProjectSelected(p as unknown as ProjectData)}
              onSalespersonChanged={setSelectedSalesperson}
              onNewProject={(p) => handleNewProject(p as unknown as ProjectData)}
            />

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
                <MeshPanelsSection dbPrices={dbPrices} meshPanel={meshPanel} addItem={addItem} isLoading={cartLoading} />
                <StuccoStripsSection stuccoProducts={stuccoProducts} getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* CV Mode */}
            {mode === 'cv' && (
              <>
                <VinylPanelsSection dbPrices={dbPrices} vinylPanel={vinylPanel} addItem={addItem} isLoading={cartLoading} />
                <StuccoStripsSection zippered stuccoProducts={stuccoProducts} getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* RN Mode */}
            {mode === 'rn' && (
              <>
                <RawNettingSection dbPrices={dbPrices} getPrice={getPrice} rawMaterials={rawMaterials} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItem} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItem} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItem} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItem} />
              </>
            )}

            {/* RU Mode */}
            {mode === 'ru' && (
              <>
                <RollUpShadeSection rollupProduct={rollupProduct} getPrice={getPrice} addItem={addItem} isLoading={cartLoading} />
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
        onSave={handleSave}
        onSend={handleSend}
        onPlaceOrder={handlePlaceOrder}
        onPhoneOrder={handleOpenPhoneOrder}
        isSaving={isSaving}
        hasProject={!!selectedProject}
      />

      {/* Product Detail Modal */}
      {productModal && <ProductDetailModal product={productModal} onClose={() => setProductModal(null)} />}

      {/* Phone Order Modal */}
      <PhoneOrderModal
        open={phoneOrderOpen}
        onClose={() => setPhoneOrderOpen(false)}
        onSubmit={handlePhoneOrderSubmit}
        prefill={{
          firstName: selectedProject?.first_name || '',
          lastName: selectedProject?.last_name || '',
          email: selectedProject?.email || '',
          phone: selectedProject?.phone || '',
        }}
        subtotal={cart?.subtotal ?? 0}
        itemCount={itemCount}
      />
    </>
  )
}
