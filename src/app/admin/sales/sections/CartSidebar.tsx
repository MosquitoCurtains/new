'use client'

import { useMemo, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, X, Trash2, Save, Link2, CreditCard, Phone, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Text } from '@/lib/design-system'
import type { CartLineItem } from '@/hooks/useCart'
import { formatMoney } from '../types'
import { getCartOptionLabels } from '@/lib/cart-option-labels'

type ActiveAction = 'save' | 'copy' | 'phone' | 'order' | null

interface CartSidebarProps {
  items: CartLineItem[]
  subtotal: number
  itemCount: number
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  onSave?: () => Promise<void>
  onCopyLink?: () => Promise<string | null>
  onPlaceOrder?: () => Promise<void>
  onPhoneOrder?: () => Promise<void>
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
  onCopyLink,
  onPlaceOrder,
  onPhoneOrder,
  hasProject,
}: CartSidebarProps) {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [copyConfirmUrl, setCopyConfirmUrl] = useState<string | null>(null)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const runAction = useCallback(async (action: ActiveAction, fn?: () => Promise<void>) => {
    if (!fn || activeAction) return
    setActiveAction(action)
    try {
      await fn()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      showToast('error', msg)
    } finally {
      setActiveAction(null)
    }
  }, [activeAction, showToast])

  const handleSave = useCallback(() => runAction('save', async () => {
    if (!onSave) return
    await onSave()
    showToast('success', 'Cart saved')
  }), [runAction, onSave, showToast])

  const handleCopyLink = useCallback(async () => {
    if (!onCopyLink || activeAction) return
    setActiveAction('copy')
    try {
      const url = await onCopyLink()
      if (url) {
        setCopyConfirmUrl(url)
      } else {
        showToast('error', 'Could not generate link')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      showToast('error', msg)
    } finally {
      setActiveAction(null)
    }
  }, [onCopyLink, activeAction, showToast])

  const handlePhoneOrder = useCallback(() => runAction('phone', async () => {
    if (!onPhoneOrder) return
    await onPhoneOrder()
  }), [runAction, onPhoneOrder])

  const handlePlaceOrder = useCallback(() => runAction('order', async () => {
    if (!onPlaceOrder) return
    await onPlaceOrder()
  }), [runAction, onPlaceOrder])

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

  function ActionButton({
    action,
    onClick,
    icon: Icon,
    label,
    loadingLabel,
    className,
  }: {
    action: ActiveAction
    onClick: () => void
    icon: typeof Save
    label: string
    loadingLabel: string
    className: string
  }) {
    const isActive = activeAction === action
    const isDisabled = activeAction !== null && !isActive
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] font-medium rounded-md transition-colors disabled:opacity-40 ${className} ${isActive ? 'opacity-80' : ''}`}
      >
        {isActive ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Icon className="w-3 h-3" />
        )}
        {isActive ? loadingLabel : label}
      </button>
    )
  }

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
          {/* Toast notification */}
          {toast && (
            <div className={`mx-2.5 mt-2 px-3 py-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200 ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {toast.type === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {toast.message}
            </div>
          )}

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
                        {groupItems.map((item) => {
                          const optLabels = getCartOptionLabels(item.productSku, item.options)
                          return (
                            <div
                              key={item.id}
                              className="group flex items-start gap-1 py-1 px-1.5 rounded hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium text-gray-800 truncate leading-tight">
                                  {item.name}
                                </p>
                                {optLabels.length > 0 && (
                                  <div className="mt-0.5 space-y-px">
                                    {optLabels.map((ol, idx) => (
                                      <p key={idx} className="text-[9px] text-gray-500 leading-tight">
                                        <span className="font-medium text-gray-600">{ol.label}:</span> {ol.value}
                                      </p>
                                    ))}
                                  </div>
                                )}
                                {!optLabels.length && item.description && (
                                  <p className="text-[10px] text-gray-400 truncate leading-tight">
                                    {item.description}
                                  </p>
                                )}
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
                          )
                        })}
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
                  <ActionButton
                    action="save"
                    onClick={handleSave}
                    icon={Save}
                    label="Save Cart"
                    loadingLabel="Saving..."
                    className="bg-[#003365] text-white hover:bg-[#002244]"
                  />
                  <ActionButton
                    action="copy"
                    onClick={handleCopyLink}
                    icon={Link2}
                    label="Copy Link"
                    loadingLabel="Copying..."
                    className="bg-teal-600 text-white hover:bg-teal-700"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handlePhoneOrder}
                      disabled={activeAction !== null && activeAction !== 'phone'}
                      className={`flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-medium bg-[#406517] text-white rounded-md hover:bg-[#365512] disabled:opacity-40 transition-colors ${activeAction === 'phone' ? 'opacity-80' : ''}`}
                    >
                      {activeAction === 'phone' ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Phone className="w-2.5 h-2.5" />}
                      Phone Order
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={activeAction !== null && activeAction !== 'order'}
                      className={`flex items-center justify-center gap-1 flex-1 py-1.5 text-[10px] font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-40 transition-colors ${activeAction === 'order' ? 'opacity-80' : ''}`}
                    >
                      {activeAction === 'order' ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CreditCard className="w-2.5 h-2.5" />}
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

      {/* Copy Link Confirmation Modal */}
      {copyConfirmUrl && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setCopyConfirmUrl(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Link Copied</h3>
              <p className="text-sm text-gray-500 mb-4">Quote link has been copied to your clipboard and the project status has been updated to &ldquo;Quote Sent&rdquo;.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-gray-500 font-mono break-all">{copyConfirmUrl}</p>
              </div>
              <button
                onClick={() => setCopyConfirmUrl(null)}
                className="w-full py-2.5 bg-[#003365] text-white text-sm font-medium rounded-xl hover:bg-[#002244] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
