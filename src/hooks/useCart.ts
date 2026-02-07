'use client'

/**
 * useCart Hook
 * 
 * Manages shopping cart state with localStorage persistence.
 * Uses database-driven pricing via usePricing().
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { PanelConfig } from '@/components/project/PanelEditor'
import type { TrackHardware } from '@/components/project/DIYBuilder'
import type { FabricOrder } from '@/components/project/FabricConfigurator'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import { getShippingClassForItem } from '@/lib/pricing/types'
import type { PricingMap } from '@/lib/pricing/types'
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

function convertDIYToLineItems(
  panels: PanelConfig[], 
  hardware: TrackHardware,
  addOns: { snapTool: boolean; magnetDoorway: number; elasticCords: number },
  prices: PricingMap
): CartLineItem[] {
  const items: CartLineItem[] = []

  // Convert panels to line items using DB-driven pricing
  panels.forEach((panel, index) => {
    const totalWidth = panel.widthFeet + (panel.widthInches / 12)
    const unitPrice = calculateMeshPanelPrice({
      widthFeet: panel.widthFeet,
      widthInches: panel.widthInches,
      heightInches: panel.heightInches,
      meshType: panel.meshType,
      meshColor: panel.color,
      topAttachment: panel.topAttachment,
      velcroColor: panel.velcroColor,
    }, prices).total

    items.push({
      id: panel.id,
      type: 'panel',
      productSku: 'mesh_panel',
      name: panel.name || `Panel ${index + 1}`,
      description: `${totalWidth.toFixed(1)}ft x ${panel.heightInches}in ${panel.meshType.replace(/_/g, ' ')} - ${panel.color}`,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      options: {
        widthFeet: panel.widthFeet,
        widthInches: panel.widthInches,
        heightInches: panel.heightInches,
        meshType: panel.meshType,
        color: panel.color,
        topAttachment: panel.topAttachment,
        notes: panel.notes,
      },
    })
  })

  // Track pricing from DB (per-piece prices)
  const isHeavy = hardware.trackWeight === 'heavy'
  const trackPrice7ft = isHeavy
    ? (prices['track_heavy_7ft'] ?? 42)
    : (prices['track_std_7ft'] ?? 30)

  if (hardware.straightTrack > 0) {
    items.push({
      id: `track-${Date.now()}`,
      type: 'track',
      productSku: isHeavy ? 'heavy_track' : 'standard_track',
      name: `${isHeavy ? 'Heavy' : 'Standard'} Track 7ft`,
      description: `${hardware.trackColor} ${isHeavy ? 'heavy duty' : 'standard'} track`,
      quantity: hardware.straightTrack,
      unitPrice: trackPrice7ft,
      totalPrice: hardware.straightTrack * trackPrice7ft,
      options: {
        length: '7ft',
        weight: hardware.trackWeight,
        color: hardware.trackColor,
      },
    })
  }

  if (hardware.curves90 > 0) {
    const curvePrice = isHeavy
      ? (prices['track_heavy_curve_90'] ?? 25)
      : (prices['track_curve_90'] ?? 25)
    items.push({
      id: `curve90-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_curve_90',
      name: '90 Degree Curve',
      description: `${hardware.trackColor} track curve`,
      quantity: hardware.curves90,
      unitPrice: Math.round(curvePrice * 100) / 100,
      totalPrice: Math.round(hardware.curves90 * curvePrice * 100) / 100,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.curves135 > 0) {
    const curvePrice = isHeavy
      ? (prices['track_heavy_curve_135'] ?? 25)
      : (prices['track_curve_135'] ?? 25)
    items.push({
      id: `curve135-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_curve_135',
      name: '135 Degree Curve',
      description: `${hardware.trackColor} track curve`,
      quantity: hardware.curves135,
      unitPrice: Math.round(curvePrice * 100) / 100,
      totalPrice: Math.round(hardware.curves135 * curvePrice * 100) / 100,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.splices > 0) {
    const splicePrice = isHeavy
      ? (prices['track_heavy_splice'] ?? 5)
      : (prices['track_splice'] ?? 7)
    items.push({
      id: `splice-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_splice',
      name: 'Track Splice',
      description: `${hardware.trackColor} splice connector`,
      quantity: hardware.splices,
      unitPrice: splicePrice,
      totalPrice: hardware.splices * splicePrice,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.endCaps > 0) {
    const capPrice = isHeavy
      ? (prices['track_heavy_endcap'] ?? 3)
      : (prices['track_endcap'] ?? 1.5)
    items.push({
      id: `endcap-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_endcap',
      name: 'End Cap',
      description: `${hardware.trackColor} end cap`,
      quantity: hardware.endCaps,
      unitPrice: capPrice,
      totalPrice: hardware.endCaps * capPrice,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.carriers > 0) {
    const carrierPrice = isHeavy
      ? (prices['track_heavy_carrier'] ?? 1.25)
      : (prices['track_carrier'] ?? 0.5)
    items.push({
      id: `carriers-${Date.now()}`,
      type: 'hardware',
      productSku: 'snap_carriers',
      name: 'Snap Carriers',
      description: `${hardware.trackColor} snap carriers (pack of 10)`,
      quantity: Math.ceil(hardware.carriers / 10),
      unitPrice: Math.round(carrierPrice * 10 * 100) / 100,
      totalPrice: Math.round(Math.ceil(hardware.carriers / 10) * carrierPrice * 10 * 100) / 100,
      options: { color: hardware.trackColor },
    })
  }

  // Add-ons using DB pricing
  if (addOns.snapTool) {
    const snapToolPrice = prices['snap_tool'] ?? 0
    items.push({
      id: `snaptool-${Date.now()}`,
      type: 'addon',
      productSku: 'snap_tool',
      name: 'Industrial Snap Tool',
      description: '100% refundable if returned',
      quantity: 1,
      unitPrice: snapToolPrice,
      totalPrice: snapToolPrice,
    })
  }

  if (addOns.magnetDoorway > 0) {
    // Magnetic doorway kit: block magnets + fiberglass rods
    const magnetPrice = prices['block_magnet'] ?? 0
    const rodPrice = prices['fiberglass_rod'] ?? 0
    const kitPrice = Math.round((magnetPrice * 8 + rodPrice * 2) * 100) / 100
    items.push({
      id: `doorway-${Date.now()}`,
      type: 'addon',
      productSku: 'magnetic_doorway',
      name: 'Magnetic Doorway Kit',
      description: 'Block magnets + fiberglass rods',
      quantity: addOns.magnetDoorway,
      unitPrice: kitPrice,
      totalPrice: addOns.magnetDoorway * kitPrice,
    })
  }

  return items
}

function convertFabricToLineItems(fabric: FabricOrder, totalPrice: number): CartLineItem[] {
  const fabricNames: Record<string, string> = {
    heavy_mosquito: 'Heavy Mosquito Netting',
    no_see_um: 'No-See-Um Mesh',
    shade: 'Shade Mesh',
    scrim: 'Theater Scrim',
    theater_scrim: 'Theater Scrim',
  }
  
  const sqYards = (fabric.widthFeet / 3) * fabric.lengthYards
  
  return [{
    id: `fabric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'fabric',
    productSku: `raw_${fabric.fabricType}`,
    name: fabricNames[fabric.fabricType] || 'Raw Mesh Fabric',
    description: `${fabric.widthFeet}ft × ${fabric.lengthYards}yd (${sqYards.toFixed(1)} sq yds) - ${fabric.color}`,
    quantity: 1,
    unitPrice: totalPrice,
    totalPrice: totalPrice,
    options: {
      fabricType: fabric.fabricType,
      color: fabric.color,
      widthFeet: fabric.widthFeet,
      lengthYards: fabric.lengthYards,
      notes: fabric.notes,
    },
  }]
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

  // Load cart from localStorage (deferred until pricing is ready)
  useEffect(() => {
    // Wait for pricing to load before processing legacy carts
    if (pricingLoading) return

    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Handle legacy cart format (from DIY builder)
        if (parsed.type === 'diy' && parsed.project && dbPrices) {
          const { project, contact, sessionId } = parsed
          const items = convertDIYToLineItems(project.panels, project.hardware, project.addOns, dbPrices)
          const totals = calculateTotals(items)
          
          const newCart: CartData = {
            id: `cart-${Date.now()}`,
            items,
            ...totals,
            contact: contact || undefined,
            sessionId: sessionId || `session-${Date.now()}`,
            createdAt: parsed.timestamp || Date.now(),
            updatedAt: Date.now(),
          }
          setCart(newCart)
          localStorage.setItem(CART_KEY, JSON.stringify(newCart))
        } else if (parsed.type === 'raw_materials' && parsed.fabric) {
          const { fabric, totals: fabricTotals, contact, sessionId } = parsed
          const items = convertFabricToLineItems(fabric, fabricTotals?.total || 0)
          const totals = calculateTotals(items)
          
          const newCart: CartData = {
            id: `cart-${Date.now()}`,
            items,
            ...totals,
            contact: contact || undefined,
            sessionId: sessionId || `session-${Date.now()}`,
            createdAt: parsed.timestamp || Date.now(),
            updatedAt: Date.now(),
          }
          setCart(newCart)
          localStorage.setItem(CART_KEY, JSON.stringify(newCart))
        } else if (parsed.items) {
          // Standard cart format — prices already calculated
          setCart(parsed)
        } else {
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
  }, [pricingLoading, dbPrices])

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
