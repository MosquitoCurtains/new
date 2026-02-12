'use client'

/**
 * Shared Sales Page Layout
 *
 * Renders the tabbed sales interface for any mode.
 * Each route (mc-sales, cv-sales, rn-sales, ru-sales) renders
 * this component with the appropriate mode prop.
 *
 * Uses hard links: /admin/mc-sales/project/[projectId]
 * instead of query strings.
 *
 * Collapsible cart sidebar on the right mirrors the left admin sidebar.
 * The sidebar is fixed-position, same pattern as the admin layout's left sidebar.
 */

import { useMemo, useState, useEffect, useCallback } from 'react'
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
  project_name: string | null
  status: string
  share_token: string
  estimated_total: number | null
  assigned_to: string | null
  notes: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leads?: any
}

/** Build the hard-link URL for a sales mode + optional project */
function salesUrl(salesMode: SalesMode, projectId?: string | null): string {
  const base = MODE_ROUTES[salesMode]
  return projectId ? `${base}/project/${projectId}` : base
}

export default function SalesPageLayout({ mode, projectId }: { mode: SalesMode; projectId?: string }) {
  const router = useRouter()
  const [cartCollapsed, setCartCollapsed] = useState(true)

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

  // Wrap addItem to auto-expand cart sidebar on any add
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addItemAndOpenCart = useCallback((item: any) => {
    addItem(item)
    setCartCollapsed(false)
  }, [addItem])

  // Snap tool: limit 1 in cart
  const snapToolInCart = cart?.items.some(item => item.productSku === 'snap_tool') ?? false

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

  // Load project from URL param (hard link: /admin/mc-sales/project/[projectId])
  useEffect(() => {
    if (!projectId) return

    async function loadProject() {
      try {
        const res = await fetch(`/api/admin/sales/projects/${projectId}`)
        const data = await res.json()
        if (data.project) {
          setSelectedProject(data.project)
          // If project has a salesperson, set them
          if (data.project.assigned_to) {
            const staff = staffList.find((s) => s.id === data.project.assigned_to)
            if (staff) setSelectedSalesperson(staff)
          }
          // Only load project's cart if our current cart is empty
          // (preserve existing cart items when attaching a project)
          if (!cart || cart.items.length === 0) {
            await loadFromProject(projectId)
          }
        }
      } catch (err) {
        console.error('Error loading project from URL:', err)
      }
    }
    loadProject()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

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
      // Navigate to hard link if not already there
      const expectedUrl = salesUrl(mode, selectedProject.id)
      if (!window.location.pathname.includes(`/project/${selectedProject.id}`)) {
        router.replace(expectedUrl)
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
    // Only load the project's saved cart if our current cart is empty
    // This preserves existing cart items when attaching a project
    const hasItemsInCart = cart && cart.items.length > 0
    if (!hasItemsInCart) {
      await loadFromProject(project.id)
    }
    // Navigate to hard link
    router.push(salesUrl(mode, project.id))
  }, [staffList, loadFromProject, router, mode, cart])

  // --- Handle new project creation ---
  const handleNewProject = useCallback(async (project: ProjectData) => {
    setSelectedProject(project)
    // Keep existing cart items — don't clear on new project creation either
    // Navigate to hard link
    router.push(salesUrl(mode, project.id))
  }, [router, mode])

  // --- Detach project (go back to base sales URL) ---
  const handleDetachProject = useCallback(() => {
    setSelectedProject(null)
    setSelectedSalesperson(null)
    router.push(salesUrl(mode))
  }, [router, mode])

  // --- Edit project (navigate to project detail page) ---
  const handleEditProject = useCallback(() => {
    if (!selectedProject) return
    router.push(`/admin/projects/${selectedProject.id}`)
  }, [selectedProject, router])

  const adjustmentOptions = useMemo<DBProductOption[]>(() => {
    if (!adjustmentProduct?.options) return []
    return (adjustmentProduct.options as DBProductOption[]).filter(o => o.option_name === 'type')
  }, [adjustmentProduct])

  const setMode = (newMode: SalesMode) => {
    router.push(salesUrl(newMode, selectedProject?.id))
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
              onDetachProject={handleDetachProject}
              onEditProject={handleEditProject}
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
                <MeshPanelsSection dbPrices={dbPrices} meshPanel={meshPanel} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <StuccoStripsSection stuccoProducts={stuccoProducts} getPrice={getPrice} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItemAndOpenCart} isInCart={snapToolInCart} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItemAndOpenCart} />
              </>
            )}

            {/* CV Mode */}
            {mode === 'cv' && (
              <>
                <VinylPanelsSection dbPrices={dbPrices} vinylPanel={vinylPanel} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <StuccoStripsSection zippered stuccoProducts={stuccoProducts} getPrice={getPrice} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItemAndOpenCart} isInCart={snapToolInCart} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItemAndOpenCart} />
              </>
            )}

            {/* RN Mode */}
            {mode === 'rn' && (
              <>
                <RawNettingSection dbPrices={dbPrices} getPrice={getPrice} rawMaterials={rawMaterials} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <TrackHardwareSection standardTrackItems={standardTrackItems} heavyTrackItems={heavyTrackItems} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <AttachmentItemsSection attachmentItems={attachmentItems} attachmentGroups={attachmentGroups} addItem={addItemAndOpenCart} isLoading={cartLoading} setProductModal={setProductModal} />
                <SnapToolSection snapTool={snapTool} addItem={addItemAndOpenCart} isInCart={snapToolInCart} />
                <AdjustmentsSection adjustmentOptions={adjustmentOptions} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItemAndOpenCart} />
              </>
            )}

            {/* RU Mode */}
            {mode === 'ru' && (
              <>
                <RollUpShadeSection rollupProduct={rollupProduct} getPrice={getPrice} addItem={addItemAndOpenCart} isLoading={cartLoading} />
                <PriceAdjustmentsSection addItem={addItemAndOpenCart} />
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
