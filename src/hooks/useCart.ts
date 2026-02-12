'use client'

/**
 * useCart Hook
 * 
 * Manages shopping cart state with localStorage persistence.
 * Uses database-driven pricing via usePricing().
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getShippingClassForItem } from '@/lib/pricing/types'
import { usePricing } from '@/hooks/usePricing'

// =============================================================================
// TYPES
// =============================================================================

export interface CartLineItem {
  id: string
  type: 'panel' | 'track' | 'hardware' | 'addon' | 'fabric'
  productSku: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  options?: Record<string, string | number | boolean>
}

export interface CartData {
  id: string
  items: CartLineItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  contact?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  sessionId: string
  createdAt: number
  updatedAt: number
}

const CART_KEY = 'mc_cart'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createEmptyCart(): CartData {
  return {
    id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    sessionId: `session-${Date.now()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function calculateTotals(items: CartLineItem[], existingShipping?: number, existingTax?: number): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const shipping = existingShipping || 0
  const tax = existingTax || 0
  const total = subtotal + shipping + tax

  return { subtotal, shipping, tax, total }
}

function detectShippingClasses(items: CartLineItem[]): { hasVinyl: boolean; hasTrack: boolean } {
  let hasVinyl = false
  let hasTrack = false
  for (const item of items) {
    const cls = getShippingClassForItem({ type: item.type, productSku: item.productSku })
    if (cls === 'clear_vinyl') hasVinyl = true
    if (cls === 'straight_track') hasTrack = true
  }
  return { hasVinyl, hasTrack }
}

// =============================================================================
// HOOK
// =============================================================================

export function useCart() {
  const { prices: dbPrices, isLoading: pricingLoading } = usePricing()
  const [cart, setCart] = useState<CartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [shippingZoneName, setShippingZoneName] = useState<string | null>(null)
  const [taxRateName, setTaxRateName] = useState<string | null>(null)
  const calcAbortRef = useRef<AbortController | null>(null)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.items) {
          setCart(parsed)
        } else {
          // Unrecognised format — start fresh
          setCart(createEmptyCart())
        }
      } else {
        setCart(createEmptyCart())
      }
    } catch (e) {
      console.error('Error loading cart:', e)
      setCart(createEmptyCart())
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  const saveCart = useCallback((newCart: CartData) => {
    const updated = { ...newCart, updatedAt: Date.now() }
    setCart(updated)
    localStorage.setItem(CART_KEY, JSON.stringify(updated))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (!cart) return
    const newItems = cart.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity, totalPrice: item.unitPrice * quantity }
      }
      return item
    }).filter(item => item.quantity > 0)
    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

  const removeItem = useCallback((itemId: string) => {
    if (!cart) return
    const newItems = cart.items.filter(item => item.id !== itemId)
    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

  const addItem = useCallback((item: Omit<CartLineItem, 'id'>) => {
    setCart(prev => {
      if (!prev) return prev
      const newItem: CartLineItem = {
        ...item,
        id: `${item.productSku}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      }
      const newItems = [...prev.items, newItem]
      const totals = calculateTotals(newItems)
      const updated = { ...prev, items: newItems, ...totals, updatedAt: Date.now() }
      localStorage.setItem(CART_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateContact = useCallback((contact: CartData['contact']) => {
    if (!cart) return
    saveCart({ ...cart, contact })
  }, [cart, saveCart])

  const calculateShippingAndTax = useCallback(async (
    address: NonNullable<CartData['shippingAddress']>,
    items: CartLineItem[],
    subtotal: number
  ) => {
    if (calcAbortRef.current) calcAbortRef.current.abort()
    const controller = new AbortController()
    calcAbortRef.current = controller
    if (!address.country || !address.state) return
    setIsCalculatingShipping(true)
    try {
      const { hasVinyl, hasTrack } = detectShippingClasses(items)
      const [shippingRes, taxRes] = await Promise.all([
        fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            address: { country: address.country, state: address.state, zip: address.zip, city: address.city },
            hasVinyl, hasTrack, subtotal,
          }),
        }),
        fetch('/api/tax/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            address: { country: address.country, state: address.state, zip: address.zip, city: address.city },
            subtotal, shipping: 0,
          }),
        }),
      ])
      if (controller.signal.aborted) return
      const shippingData = shippingRes.ok ? await shippingRes.json() : null
      const taxData = taxRes.ok ? await taxRes.json() : null
      const shipping = shippingData?.total ?? 0
      const tax = taxData?.taxAmount ?? 0
      setShippingZoneName(shippingData?.zone?.name ?? null)
      setTaxRateName(taxData?.rateName ?? null)
      return { shipping, tax }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      console.error('Error calculating shipping/tax:', err)
      return { shipping: 0, tax: 0 }
    } finally {
      if (!controller.signal.aborted) setIsCalculatingShipping(false)
    }
  }, [])

  const updateShippingAddress = useCallback(async (shippingAddress: CartData['shippingAddress']) => {
    if (!cart) return
    const updatedCart = { ...cart, shippingAddress }
    saveCart(updatedCart)
    if (shippingAddress?.country && shippingAddress?.state) {
      const result = await calculateShippingAndTax(shippingAddress, updatedCart.items, updatedCart.subtotal)
      if (result) {
        const total = updatedCart.subtotal + result.shipping + result.tax
        saveCart({ ...updatedCart, shipping: result.shipping, tax: result.tax, total })
      }
    }
  }, [cart, saveCart, calculateShippingAndTax])

  const clearCart = useCallback(() => {
    saveCart(createEmptyCart())
  }, [saveCart])

  // =========================================================================
  // DATABASE INTEGRATION
  // =========================================================================

  const [dbCartId, setDbCartId] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Save cart to database linked to a project.
   * Creates a new cart if dbCartId is null, otherwise updates existing.
   */
  const saveToDb = useCallback(async (
    projId: string,
    salespersonId?: string,
    salespersonName?: string,
    salesMode?: string,
  ) => {
    if (!cart) return null
    setIsSaving(true)
    try {
      const items = cart.items.map((item) => ({
        product_id: item.productSku, // Use SKU as product reference
        product_sku: item.productSku,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.totalPrice,
        panel_specs: item.options || {},
        options: Object.entries(item.options || {}).map(([k, v]) => ({
          option_name: k,
          option_value: String(v),
        })),
      }))

      const payload = {
        project_id: projId,
        salesperson_id: salespersonId || null,
        salesperson_name: salespersonName || null,
        sales_mode: salesMode || null,
        items,
        subtotal: cart.subtotal,
        tax_amount: cart.tax,
        shipping_amount: cart.shipping,
        total: cart.total,
        shipping_first_name: cart.shippingAddress ? cart.contact?.firstName : null,
        shipping_last_name: cart.shippingAddress ? cart.contact?.lastName : null,
        shipping_address_1: cart.shippingAddress?.street || null,
        shipping_city: cart.shippingAddress?.city || null,
        shipping_state: cart.shippingAddress?.state || null,
        shipping_zip: cart.shippingAddress?.zip || null,
        shipping_country: cart.shippingAddress?.country || 'US',
      }

      let res: Response
      if (dbCartId) {
        // Update existing cart
        res = await fetch(`/api/admin/carts/${dbCartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new cart
        res = await fetch('/api/admin/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (data.success && data.cart) {
        setDbCartId(data.cart.id)
        setProjectId(projId)
        return data.cart.id as string
      }
      return null
    } catch (err) {
      console.error('Error saving cart to DB:', err)
      return null
    } finally {
      setIsSaving(false)
    }
  }, [cart, dbCartId])

  /**
   * Load cart from DB by project ID (fetches the project's cart).
   */
  const loadFromProject = useCallback(async (projId: string) => {
    try {
      const res = await fetch(`/api/admin/carts?project_id=${projId}&status=active`)
      const data = await res.json()
      const carts = data.carts || []
      if (carts.length === 0) {
        setProjectId(projId)
        return false
      }

      const dbCart = carts[0]
      return await loadFromDb(dbCart.id)
    } catch (err) {
      console.error('Error loading cart from project:', err)
      return false
    }
  }, [])

  /**
   * Load a specific cart from DB by cart ID.
   */
  const loadFromDb = useCallback(async (cartId: string) => {
    try {
      const res = await fetch(`/api/admin/carts/${cartId}`)
      const data = await res.json()
      if (!data.cart) return false

      const dbCart = data.cart
      const dbItems: LineItemFromDB[] = data.lineItems || []

      // Convert DB line items to CartLineItem format
      const cartItems: CartLineItem[] = dbItems.map((item: LineItemFromDB) => ({
        id: `${item.product_sku}-${item.id}`,
        type: inferType(item.product_sku),
        productSku: item.product_sku,
        name: item.product_name,
        description: '',
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.line_total),
        options: item.line_item_options?.reduce((acc: Record<string, string>, opt: { option_name: string; option_value: string }) => {
          acc[opt.option_name] = opt.option_value
          return acc
        }, {} as Record<string, string>) || {},
      }))

      const totals = {
        subtotal: Number(dbCart.subtotal) || 0,
        shipping: Number(dbCart.shipping_amount) || 0,
        tax: Number(dbCart.tax_amount) || 0,
        total: Number(dbCart.total) || 0,
      }

      const loadedCart: CartData = {
        id: dbCart.id,
        items: cartItems,
        ...totals,
        sessionId: `db-${dbCart.id}`,
        createdAt: new Date(dbCart.created_at).getTime(),
        updatedAt: new Date(dbCart.updated_at).getTime(),
      }

      setCart(loadedCart)
      setDbCartId(dbCart.id)
      setProjectId(dbCart.project_id)
      localStorage.setItem(CART_KEY, JSON.stringify(loadedCart))
      return true
    } catch (err) {
      console.error('Error loading cart from DB:', err)
      return false
    }
  }, [])

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return {
    cart,
    isLoading: isLoading || pricingLoading,
    isCalculatingShipping,
    isSaving,
    shippingZoneName,
    taxRateName,
    itemCount,
    /** DB pricing map — available for components that need to calculate prices */
    prices: dbPrices,
    /** DB cart ID (set after first save) */
    dbCartId,
    /** Linked project ID */
    projectId,
    updateQuantity,
    removeItem,
    addItem,
    updateContact,
    updateShippingAddress,
    clearCart,
    /** Save cart to database linked to a project */
    saveToDb,
    /** Load cart from DB by project ID */
    loadFromProject,
    /** Load cart from DB by cart ID */
    loadFromDb,
  }
}

// Helper: infer item type from SKU
function inferType(sku: string): CartLineItem['type'] {
  if (!sku) return 'addon'
  const s = sku.toLowerCase()
  if (s.includes('panel') || s.includes('mesh') || s.includes('vinyl') || s.includes('shade')) return 'panel'
  if (s.includes('track')) return 'track'
  if (s.includes('fabric') || s.includes('netting') || s.includes('raw')) return 'fabric'
  if (s.includes('snap') || s.includes('magnet') || s.includes('velcro') || s.includes('clip') || s.includes('grommet')) return 'hardware'
  return 'addon'
}

// Type for DB line items
interface LineItemFromDB {
  id: string
  product_sku: string
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
  line_item_options?: Array<{ option_name: string; option_value: string }>
}

export default useCart
