'use client'

import { useState } from 'react'
import { X, Phone, CreditCard, MapPin, User, CheckCircle } from 'lucide-react'
import { Button, Text, Badge } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface PhoneOrderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: PhoneOrderData) => Promise<void>
  /** Pre-fill from the project's lead data */
  prefill: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  subtotal: number
  itemCount: number
}

export interface PhoneOrderData {
  billing_first_name: string
  billing_last_name: string
  billing_phone: string
  billing_email: string
  billing_address_1: string
  billing_address_2: string
  billing_city: string
  billing_state: string
  billing_zip: string
  shipping_same_as_billing: boolean
  shipping_first_name: string
  shipping_last_name: string
  shipping_address_1: string
  shipping_address_2: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  payment_method: string
  payment_transaction_id: string
  payment_status: 'paid' | 'pending'
  internal_note: string
}

const PAYMENT_METHODS = [
  { value: 'phone_cc', label: 'Credit Card (Phone)' },
  { value: 'check', label: 'Check' },
  { value: 'paypal_manual', label: 'PayPal (Manual)' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'wire', label: 'Wire Transfer' },
  { value: 'po', label: 'Purchase Order' },
  { value: 'other', label: 'Other' },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

// =============================================================================
// INPUT CLASSES
// =============================================================================

const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20'
const selectCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20'
const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

// =============================================================================
// COMPONENT
// =============================================================================

export default function PhoneOrderModal({
  open,
  onClose,
  onSubmit,
  prefill,
  subtotal,
  itemCount,
}: PhoneOrderModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Billing
  const [billingFirst, setBillingFirst] = useState(prefill.firstName || '')
  const [billingLast, setBillingLast] = useState(prefill.lastName || '')
  const [billingPhone, setBillingPhone] = useState(prefill.phone || '')
  const [billingEmail, setBillingEmail] = useState(prefill.email || '')
  const [billingAddr1, setBillingAddr1] = useState('')
  const [billingAddr2, setBillingAddr2] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingZip, setBillingZip] = useState('')

  // Shipping
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [shippingFirst, setShippingFirst] = useState('')
  const [shippingLast, setShippingLast] = useState('')
  const [shippingAddr1, setShippingAddr1] = useState('')
  const [shippingAddr2, setShippingAddr2] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingState, setShippingState] = useState('')
  const [shippingZip, setShippingZip] = useState('')

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('phone_cc')
  const [transactionId, setTransactionId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid')
  const [internalNote, setInternalNote] = useState('')

  const formatMoney = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!billingFirst.trim() || !billingLast.trim()) {
      setError('Billing name is required')
      return
    }
    if (!billingAddr1.trim() || !billingCity.trim() || !billingState || !billingZip.trim()) {
      setError('Complete billing address is required')
      return
    }
    if (!sameAsBilling && (!shippingAddr1.trim() || !shippingCity.trim() || !shippingState || !shippingZip.trim())) {
      setError('Complete shipping address is required')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        billing_first_name: billingFirst,
        billing_last_name: billingLast,
        billing_phone: billingPhone,
        billing_email: billingEmail,
        billing_address_1: billingAddr1,
        billing_address_2: billingAddr2,
        billing_city: billingCity,
        billing_state: billingState,
        billing_zip: billingZip,
        shipping_same_as_billing: sameAsBilling,
        shipping_first_name: sameAsBilling ? billingFirst : shippingFirst,
        shipping_last_name: sameAsBilling ? billingLast : shippingLast,
        shipping_address_1: sameAsBilling ? billingAddr1 : shippingAddr1,
        shipping_address_2: sameAsBilling ? billingAddr2 : shippingAddr2,
        shipping_city: sameAsBilling ? billingCity : shippingCity,
        shipping_state: sameAsBilling ? billingState : shippingState,
        shipping_zip: sameAsBilling ? billingZip : shippingZip,
        payment_method: paymentMethod,
        payment_transaction_id: transactionId,
        payment_status: paymentStatus,
        internal_note: internalNote,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#003365]/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#003365]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Phone Order</h2>
              <p className="text-xs text-gray-500">
                {itemCount} item{itemCount !== 1 ? 's' : ''} &middot; {formatMoney(subtotal)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* === BILLING INFO === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#003365]" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Billing Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input type="text" value={billingFirst} onChange={(e) => setBillingFirst(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input type="text" value={billingLast} onChange={(e) => setBillingLast(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Address Line 1 *</label>
                  <input type="text" value={billingAddr1} onChange={(e) => setBillingAddr1(e.target.value)} className={inputCls} placeholder="Street address" required />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Address Line 2</label>
                  <input type="text" value={billingAddr2} onChange={(e) => setBillingAddr2(e.target.value)} className={inputCls} placeholder="Apt, suite, unit (optional)" />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input type="text" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} className={inputCls} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>State *</label>
                    <select value={billingState} onChange={(e) => setBillingState(e.target.value)} className={selectCls} required>
                      <option value="">--</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>ZIP *</label>
                    <input type="text" value={billingZip} onChange={(e) => setBillingZip(e.target.value)} className={inputCls} placeholder="00000" required />
                  </div>
                </div>
              </div>
            </section>

            {/* === SHIPPING ADDRESS === */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#003365]" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Shipping Address</h3>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="rounded border-gray-300 text-[#003365] focus:ring-[#003365]"
                  />
                  Same as billing
                </label>
              </div>
              {sameAsBilling ? (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Text size="sm" className="text-gray-500 !mb-0">
                    Shipping address will match billing address above.
                  </Text>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input type="text" value={shippingFirst} onChange={(e) => setShippingFirst(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input type="text" value={shippingLast} onChange={(e) => setShippingLast(e.target.value)} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address Line 1 *</label>
                    <input type="text" value={shippingAddr1} onChange={(e) => setShippingAddr1(e.target.value)} className={inputCls} placeholder="Street address" required />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address Line 2</label>
                    <input type="text" value={shippingAddr2} onChange={(e) => setShippingAddr2(e.target.value)} className={inputCls} placeholder="Apt, suite, unit (optional)" />
                  </div>
                  <div>
                    <label className={labelCls}>City *</label>
                    <input type="text" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} className={inputCls} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>State *</label>
                      <select value={shippingState} onChange={(e) => setShippingState(e.target.value)} className={selectCls} required>
                        <option value="">--</option>
                        {US_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>ZIP *</label>
                      <input type="text" value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} className={inputCls} placeholder="00000" required />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* === PAYMENT === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-[#003365]" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Payment</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Payment Method *</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={selectCls}>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Transaction / Reference ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className={inputCls}
                    placeholder="Optional"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Payment Status *</label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentStatus === 'paid'
                          ? 'border-[#406517] bg-[#406517]/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_status"
                        value="paid"
                        checked={paymentStatus === 'paid'}
                        onChange={() => setPaymentStatus('paid')}
                        className="text-[#406517] focus:ring-[#406517]"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Paid</span>
                        <p className="text-xs text-gray-500">Payment received over the phone</p>
                      </div>
                    </label>
                    <label
                      className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentStatus === 'pending'
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_status"
                        value="pending"
                        checked={paymentStatus === 'pending'}
                        onChange={() => setPaymentStatus('pending')}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Pending</span>
                        <p className="text-xs text-gray-500">Awaiting payment (check in mail, etc.)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* === INTERNAL NOTE === */}
            <section>
              <label className={labelCls}>Internal Note (optional)</label>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={2}
                className={inputCls + ' resize-none'}
                placeholder="e.g. Customer called from 555-1234, CC ending in 4242..."
              />
            </section>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <Text size="sm" className="text-red-600 !mb-0">{error}</Text>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Total: <span className="text-lg font-bold text-gray-900">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-[#406517] text-white rounded-full hover:bg-[#365512] disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                {submitting ? 'Placing Order...' : 'Place Phone Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
