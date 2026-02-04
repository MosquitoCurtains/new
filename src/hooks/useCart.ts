'use client'

/**
 * useCart Hook
 * 
 * Manages shopping cart state with localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react'
import type { PanelConfig } from '@/components/project/PanelEditor'
import type { TrackHardware } from '@/components/project/DIYBuilder'

// =============================================================================
// TYPES
// =============================================================================

export interface CartLineItem {
  id: string
  type: 'panel' | 'track' | 'hardware' | 'addon'
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
const CART_VERSION = 1

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
  addOns: { snapTool: boolean; magnetDoorway: number; elasticCords: number }
): CartLineItem[] {
  const items: CartLineItem[] = []

  // Convert panels to line items
  panels.forEach((panel, index) => {
    const totalWidth = panel.widthFeet + (panel.widthInches / 12)
    const meshRates: Record<string, number> = {
      heavy_mosquito: 18,
      no_see_um: 19,
      shade: 20,
      scrim: 18.5,
      theater_scrim: 18.5,
    }
    const basePrice = totalWidth * (meshRates[panel.meshType] || 18)
    const panelFee = 24
    const doorwayCost = panel.hasDoorway ? 75 : 0
    const unitPrice = basePrice + panelFee + doorwayCost

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
        hasDoorway: panel.hasDoorway,
        notes: panel.notes,
      },
    })
  })

  // Convert hardware to line items
  const isHeavy = hardware.trackWeight === 'heavy'
  const trackPrice = isHeavy ? 42 : 30

  if (hardware.straightTrack > 0) {
    items.push({
      id: `track-${Date.now()}`,
      type: 'track',
      productSku: isHeavy ? 'heavy_track' : 'standard_track',
      name: `${isHeavy ? 'Heavy' : 'Standard'} Track 7ft`,
      description: `${hardware.trackColor} ${isHeavy ? 'heavy duty' : 'standard'} track`,
      quantity: hardware.straightTrack,
      unitPrice: trackPrice,
      totalPrice: hardware.straightTrack * trackPrice,
      options: {
        length: '7ft',
        weight: hardware.trackWeight,
        color: hardware.trackColor,
      },
    })
  }

  if (hardware.curves90 > 0) {
    items.push({
      id: `curve90-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_curve_90',
      name: '90 Degree Curve',
      description: `${hardware.trackColor} track curve`,
      quantity: hardware.curves90,
      unitPrice: 25,
      totalPrice: hardware.curves90 * 25,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.curves135 > 0) {
    items.push({
      id: `curve135-${Date.now()}`,
      type: 'hardware',
      productSku: 'track_curve_135',
      name: '135 Degree Curve',
      description: `${hardware.trackColor} track curve`,
      quantity: hardware.curves135,
      unitPrice: 25,
      totalPrice: hardware.curves135 * 25,
      options: { color: hardware.trackColor },
    })
  }

  if (hardware.splices > 0) {
    const splicePrice = isHeavy ? 5 : 7
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
    const capPrice = isHeavy ? 3 : 1.5
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
    const carrierPrice = isHeavy ? 1.25 : 0.5
    items.push({
      id: `carriers-${Date.now()}`,
      type: 'hardware',
      productSku: 'snap_carriers',
      name: 'Snap Carriers',
      description: `${hardware.trackColor} snap carriers (pack of 10)`,
      quantity: Math.ceil(hardware.carriers / 10),
      unitPrice: carrierPrice * 10,
      totalPrice: Math.ceil(hardware.carriers / 10) * carrierPrice * 10,
      options: { color: hardware.trackColor },
    })
  }

  // Add-ons
  if (addOns.snapTool) {
    items.push({
      id: `snaptool-${Date.now()}`,
      type: 'addon',
      productSku: 'snap_tool',
      name: 'Industrial Snap Tool',
      description: '100% refundable if returned',
      quantity: 1,
      unitPrice: 130,
      totalPrice: 130,
    })
  }

  if (addOns.magnetDoorway > 0) {
    items.push({
      id: `doorway-${Date.now()}`,
      type: 'addon',
      productSku: 'magnetic_doorway',
      name: 'Magnetic Doorway Kit',
      description: 'Block magnets + fiberglass rods',
      quantity: addOns.magnetDoorway,
      unitPrice: 75,
      totalPrice: addOns.magnetDoorway * 75,
    })
  }

  return items
}

function calculateTotals(items: CartLineItem[]): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const shipping = subtotal > 500 ? 0 : 35 + (items.filter(i => i.type === 'panel').length * 15)
  const tax = 0 // Will be calculated at checkout based on address
  const total = subtotal + shipping + tax

  return { subtotal, shipping, tax, total }
}

// =============================================================================
// HOOK
// =============================================================================

export function useCart() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Handle legacy cart format (from DIY builder)
        if (parsed.type === 'diy' && parsed.project) {
          const { project, contact, sessionId } = parsed
          const items = convertDIYToLineItems(project.panels, project.hardware, project.addOns)
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
          // Standard cart format
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
  }, [])

  // Save cart to localStorage whenever it changes
  const saveCart = useCallback((newCart: CartData) => {
    const updated = { ...newCart, updatedAt: Date.now() }
    setCart(updated)
    localStorage.setItem(CART_KEY, JSON.stringify(updated))
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (!cart) return

    const newItems = cart.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        }
      }
      return item
    }).filter(item => item.quantity > 0)

    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

  // Remove item
  const removeItem = useCallback((itemId: string) => {
    if (!cart) return

    const newItems = cart.items.filter(item => item.id !== itemId)
    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

  // Add item
  const addItem = useCallback((item: Omit<CartLineItem, 'id'>) => {
    if (!cart) return

    const newItem: CartLineItem = {
      ...item,
      id: `${item.productSku}-${Date.now()}`,
    }

    const newItems = [...cart.items, newItem]
    const totals = calculateTotals(newItems)
    saveCart({ ...cart, items: newItems, ...totals })
  }, [cart, saveCart])

  // Update contact info
  const updateContact = useCallback((contact: CartData['contact']) => {
    if (!cart) return
    saveCart({ ...cart, contact })
  }, [cart, saveCart])

  // Update shipping address
  const updateShippingAddress = useCallback((shippingAddress: CartData['shippingAddress']) => {
    if (!cart) return
    saveCart({ ...cart, shippingAddress })
  }, [cart, saveCart])

  // Clear cart
  const clearCart = useCallback(() => {
    const newCart = createEmptyCart()
    saveCart(newCart)
  }, [saveCart])

  // Get item count
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return {
    cart,
    isLoading,
    itemCount,
    updateQuantity,
    removeItem,
    addItem,
    updateContact,
    updateShippingAddress,
    clearCart,
  }
}

export default useCart
