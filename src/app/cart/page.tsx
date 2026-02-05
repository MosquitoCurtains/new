'use client'

/**
 * Cart Page
 * 
 * Shopping cart with line items, quantities, and checkout.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Package,
  Phone,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Spinner,
} from '@/lib/design-system'
import { useCart, CartLineItem } from '@/hooks/useCart'

// =============================================================================
// LINE ITEM COMPONENT
// =============================================================================

function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartLineItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  const isCustomItem = item.type === 'panel' || item.type === 'fabric'
  const isFabric = item.type === 'fabric'
  
  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl">
      {/* Icon/Image */}
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isFabric ? 'bg-[#B30158]/10' : 'bg-[#406517]/10'
      }`}>
        <Package className={`w-8 h-8 ${isFabric ? 'text-[#B30158]' : 'text-[#406517]'}`} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Text className="font-semibold text-gray-900 !mb-0">{item.name}</Text>
            <Text size="sm" className="text-gray-500 !mb-0">{item.description}</Text>
            {item.productSku && (
              <Text size="sm" className="text-gray-400 !mb-0">SKU: {item.productSku}</Text>
            )}
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mt-3">
          {isCustomItem ? (
            <Text size="sm" className="text-gray-500 !mb-0">{isFabric ? 'Raw fabric order' : 'Custom panel'}</Text>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(Math.max(0, item.quantity - 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
          <div className="text-right">
            <Text className="font-bold text-[#406517] !mb-0">${item.totalPrice.toFixed(2)}</Text>
            {item.quantity > 1 && (
              <Text size="sm" className="text-gray-500 !mb-0">${item.unitPrice.toFixed(2)} each</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN CART PAGE
// =============================================================================

export default function CartPage() {
  const router = useRouter()
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Proceed to checkout
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return
    
    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }
      
      const { approvalUrl } = await response.json()
      window.location.href = approvalUrl
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Container size="xl" className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <Container size="md">
        <Stack gap="lg">
          <section className="text-center py-12">
            <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-8 md:p-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <Heading level={2} className="!mb-2">Your Cart is Empty</Heading>
              <Text className="text-gray-600 mb-6">
                Start building your custom screen enclosure project!
              </Text>
              <div className="flex justify-center">
                <Button variant="primary" asChild>
                  <Link href="/start-project">
                    Start a Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </Stack>
      </Container>
    )
  }

  // Group items by type
  const panels = cart.items.filter(i => i.type === 'panel')
  const fabric = cart.items.filter(i => i.type === 'fabric')
  const track = cart.items.filter(i => i.type === 'track')
  const hardware = cart.items.filter(i => i.type === 'hardware')
  const addOns = cart.items.filter(i => i.type === 'addon')

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/start-project">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
            <Heading level={1} className="!mb-0">Your Cart</Heading>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart}
              className="text-gray-400 hover:text-red-500"
            >
              Clear Cart
            </Button>
          </div>
        </section>

        {/* Main Content */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8">
            <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Stack gap="md">
                  {/* Panels Section */}
                  {panels.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-[#406517]" />
                        <Heading level={3} className="!mb-0">Custom Panels ({panels.length})</Heading>
                      </div>
                      <Stack gap="sm">
                        {panels.map(item => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}

                  {/* Raw Fabric Section */}
                  {fabric.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-[#B30158]" />
                        <Heading level={3} className="!mb-0">Raw Mesh Fabric ({fabric.length})</Heading>
                      </div>
                      <Stack gap="sm">
                        {fabric.map(item => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}

                  {/* Track Section */}
                  {track.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-[#003365]" />
                        <Heading level={3} className="!mb-0">Track</Heading>
                      </div>
                      <Stack gap="sm">
                        {track.map(item => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}

                  {/* Hardware Section */}
                  {hardware.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-[#B30158]" />
                        <Heading level={3} className="!mb-0">Hardware</Heading>
                      </div>
                      <Stack gap="sm">
                        {hardware.map(item => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}

                  {/* Add-Ons Section */}
                  {addOns.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-[#FFA501]" />
                        <Heading level={3} className="!mb-0">Add-Ons</Heading>
                      </div>
                      <Stack gap="sm">
                        {addOns.map(item => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}
                </Stack>
              </div>

              {/* Order Summary */}
              <div>
                <Card variant="elevated" className="!p-6">
                  <Heading level={3} className="!mb-4">Order Summary</Heading>

                  <Stack gap="sm" className="mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-500 italic">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-500 italic">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Subtotal</span>
                        <span className="text-2xl font-bold text-[#406517]">${cart.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </Stack>

                  {/* Promo Code */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full"
                    >
                      {isCheckingOut ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Checkout with PayPal
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Stack gap="sm">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-[#406517]" />
                        <span>Secure checkout with PayPal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4 text-[#406517]" />
                        <span>Shipping calculated based on order</span>
                      </div>
                    </Stack>
                  </div>
                </Card>

                {/* Help Card */}
                <Card variant="outlined" className="!p-4 mt-4">
                  <Text size="sm" className="text-gray-600 !mb-2">
                    Questions about your order?
                  </Text>
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:7706454745">
                        <Phone className="w-4 h-4 mr-2" />
                        Call (770) 645-4745
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
