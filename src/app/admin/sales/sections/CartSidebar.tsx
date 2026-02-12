'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, X, Trash2, Save, Send, CreditCard, Phone } from 'lucide-react'
import { Text } from '@/lib/design-system'
import type { CartLineItem } from '@/hooks/useCart'
import { formatMoney } from '../types'

interface CartSidebarProps {
  items: CartLineItem[]
  subtotal: number
  itemCount: number
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  onSave?: () => void
  onSend?: () => void
  onPlaceOrder?: () => void
  onPhoneOrder?: () => void
  isSaving?: boolean
  hasProject?: boolean
}

const GROUP_LABELS: Record<string, string> = {
  panel: 'Panels',
  track: 'Track Hardware',
  hardware: 'Hardware & Attachments',
  addon: 'Add-ons & Adjustments',
  fabric: 'Raw Materials',
}

export default function CartSidebar({
  items,
  subtotal,
  itemCount,
  removeItem,
  clearCart,
  collapsed,
  onToggleCollapse,
  onSave,
  onSend,
  onPlaceOrder,
  onPhoneOrder,
  isSaving,
  hasProject,
}: CartSidebarProps) {
  const groupedItems = useMemo(() => {
    const groups: Record<string, CartLineItem[]> = {
      panel: [],
      track: [],
      hardware: [],
      addon: [],
      fabric: [],
    }
    items.forEach((item) => {
      const key = item.type in groups ? item.type : 'addon'
      groups[key].push(item)
    })
    return groups
  }, [items])

  return (
    <aside
      className={`hidden md:flex flex-col fixed inset-y-0 right-0 z-20 bg-white border-l border-gray-200 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-12' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-2.5 border-b border-gray-100 shrink-0">
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            className="mx-auto p-1.5 rounded-md hover:bg-gray-100 transition-colors relative"
            title="Expand cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#003365] text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Collapse cart"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-[#003365]" />
              <span className="text-xs font-bold text-[#003365]">
                Cart{itemCount > 0 && ` (${itemCount})`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content (expanded only) */}
      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-12 text-center px-3">
                <ShoppingCart className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <Text size="sm" className="text-gray-400 !mb-0 !text-xs">Cart is empty</Text>
              </div>
            ) : (
              <div className="p-2.5 space-y-2.5">
                {Object.entries(groupedItems).map(([type, groupItems]) => {
                  if (groupItems.length === 0) return null
                  return (
                    <div key={type}>
                      <p className="px-1 mb-1 text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                        {GROUP_LABELS[type] || type}
                      </p>
                      <div className="space-y-px">
                        {groupItems.map((item) => (
                          <div
                            key={item.id}
                            className="group flex items-start gap-1 py-1 px-1.5 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-gray-800 truncate leading-tight">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-gray-400 truncate leading-tight">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {item.quantity > 1 && (
                                  <span className="text-[10px] text-gray-400">x{item.quantity}</span>
                                )}
                                <span className="text-[11px] font-semibold text-gray-700">
                                  ${formatMoney(item.totalPrice)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-red-500 transition-all mt-0.5"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-2.5 py-2 shrink-0 space-y-1.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Subtotal</span>
                <span className="text-sm font-bold text-gray-900">${formatMoney(subtotal)}</span>
              </div>

              {/* Action Buttons */}
              {hasProject && (
                <div className="space-y-1">
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] font-medium bg-[#003365] text-white rounded-md hover:bg-[#002244] disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    {isSaving ? 'Saving...' : 'Save Cart'}
                  </button>
                  <button
                    onClick={onSend}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[10px] font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-2.5 h-2.5" />
                    Send to Customer
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={onPhoneOrder}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-medium bg-[#406517] text-white rounded-md hover:bg-[#365512] disabled:opacity-50 transition-colors"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      Phone Order
                    </button>
                    <button
                      onClick={onPlaceOrder}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CreditCard className="w-2.5 h-2.5" />
                      Quick Order
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={clearCart}
                className="flex items-center justify-center gap-1 w-full py-1 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-2.5 h-2.5" />
                Clear
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  )
}
