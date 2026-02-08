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
    if (!cart) return
    const newItem: CartLineItem = { ...item, id: `${item.productSku}-${Date.now()}` }
    const newItems = [...cart.items, newItem]
    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

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

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return {
    cart,
    isLoading: isLoading || pricingLoading,
    isCalculatingShipping,
    shippingZoneName,
    taxRateName,
    itemCount,
    /** DB pricing map — available for components that need to calculate prices */
    prices: dbPrices,
    updateQuantity,
    removeItem,
    addItem,
    updateContact,
    updateShippingAddress,
    clearCart,
  }
}

export default useCart
