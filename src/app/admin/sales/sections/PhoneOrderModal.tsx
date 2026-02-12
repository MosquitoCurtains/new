'use client'

import { useState, useMemo } from 'react'
import { X, Phone, CreditCard, MapPin, User, CheckCircle, Loader2, Lock, AlertCircle } from 'lucide-react'
import { Button, Text } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface PhoneOrderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: PhoneOrderData) => Promise<void>
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
  { value: 'phone_cc', label: 'Credit Card (Charge Now)' },
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
// HELPERS
// =============================================================================

/** Format card number with spaces (4-4-4-4) */
function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

/** Format expiry as MM/YY */
function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

/** Convert raw digits (e.g. "1226") or formatted "MM/YY" to YYYY-MM for PayPal */
function expiryToPayPal(input: string): string {
  // Strip non-digits to handle both "1226" and "12/26"
  const digits = input.replace(/\D/g, '')
  if (digits.length < 4) return ''
  const mm = digits.slice(0, 2)
  const yy = digits.slice(2, 4)
  const yyyy = parseInt(yy) < 70 ? `20${yy}` : `19${yy}`
  return `${yyyy}-${mm.padStart(2, '0')}`
}

/** Detect card brand from number */
function detectCardBrand(number: string): string {
  const n = number.replace(/\D/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^6(?:011|5)/.test(n)) return 'Discover'
  return ''
}

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
  const [step, setStep] = useState<'form' | 'processing' | 'charged'>('form')

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

  // Card fields (only used when paymentMethod === 'phone_cc')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [chargeResult, setChargeResult] = useState<{
    transactionId: string
    cardBrand?: string
    cardLastFour?: string
  } | null>(null)

  const isCardPayment = paymentMethod === 'phone_cc'
  const cardBrand = useMemo(() => detectCardBrand(cardNumber), [cardNumber])
  const cardDigits = cardNumber.replace(/\D/g, '')

  const formatMoney = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // --- Process card payment ---
  const processCardPayment = async (): Promise<{ transactionId: string; cardBrand?: string; cardLastFour?: string }> => {
    const res = await fetch('/api/admin/payments/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: subtotal.toFixed(2),
        card_number: cardNumber.replace(/\D/g, ''),
        card_expiry: expiryToPayPal(cardExpiry),
        card_cvc: cardCvc,
        cardholder_name: `${billingFirst} ${billingLast}`.trim(),
        billing_address_1: billingAddr1,
        billing_address_2: billingAddr2 || undefined,
        billing_city: billingCity,
        billing_state: billingState,
        billing_zip: billingZip,
        description: `Phone Order - ${itemCount} items`,
      }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Payment failed')
    }
    return {
      transactionId: data.transaction_id,
      cardBrand: data.card_brand,
      cardLastFour: data.card_last_four,
    }
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

    // Card validation
    if (isCardPayment && !chargeResult) {
      if (cardDigits.length < 13) {
        setError('Enter a valid card number')
        return
      }
      if (!cardExpiry || cardExpiry.length < 4) {
        setError('Enter card expiration (MM/YY)')
        return
      }
      if (!cardCvc || cardCvc.length < 3) {
        setError('Enter card security code')
        return
      }
    }

    setSubmitting(true)

    try {
      let finalTransactionId = transactionId
      let finalPaymentStatus = paymentStatus

      // If card payment, charge the card first
      if (isCardPayment && !chargeResult) {
        setStep('processing')
        const result = await processCardPayment()
        setChargeResult(result)
        setStep('charged')
        finalTransactionId = result.transactionId
        finalPaymentStatus = 'paid'
        // Brief pause to show success state
        await new Promise(r => setTimeout(r, 800))
      }

      // Now create the order
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
        payment_transaction_id: finalTransactionId,
        payment_status: finalPaymentStatus,
        internal_note: internalNote,
      })
    } catch (err) {
      setStep('form')
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

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
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" disabled={step === 'processing'}>
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
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Payment Method *</label>
                  <select value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setChargeResult(null) }} className={selectCls}>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                {/* --- CARD FIELDS (only for phone_cc) --- */}
                {isCardPayment && !chargeResult && (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Card Details</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="w-3 h-3" />
                        Processed via PayPal
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Card Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatCardNumber(cardNumber)}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className={inputCls + ' pr-20 font-mono tracking-wider'}
                          placeholder="4111 1111 1111 1111"
                          autoComplete="off"
                        />
                        {cardBrand && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">{cardBrand}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatExpiry(cardExpiry)}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className={inputCls + ' font-mono'}
                          placeholder="MM/YY"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>CVC *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className={inputCls + ' font-mono'}
                          placeholder="123"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card charged confirmation */}
                {isCardPayment && chargeResult && (
                  <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">Card Charged Successfully</p>
                        <p className="text-xs text-green-600">
                          {chargeResult.cardBrand} ending in {chargeResult.cardLastFour} &middot; {formatMoney(subtotal)}
                        </p>
                        <p className="text-xs text-green-500 font-mono mt-0.5">ID: {chargeResult.transactionId}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Non-card payment fields */}
                {!isCardPayment && (
                  <>
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
                    <div>
                      <label className={labelCls}>Payment Status *</label>
                      <div className="flex gap-3">
                        <label
                          className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentStatus === 'paid'
                              ? 'border-[#406517] bg-[#406517]/5'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input type="radio" name="payment_status" value="paid" checked={paymentStatus === 'paid'} onChange={() => setPaymentStatus('paid')} className="text-[#406517] focus:ring-[#406517]" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Paid</span>
                            <p className="text-xs text-gray-500">Payment received</p>
                          </div>
                        </label>
                        <label
                          className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentStatus === 'pending'
                              ? 'border-orange-400 bg-orange-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input type="radio" name="payment_status" value="pending" checked={paymentStatus === 'pending'} onChange={() => setPaymentStatus('pending')} className="text-orange-500 focus:ring-orange-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Pending</span>
                            <p className="text-xs text-gray-500">Awaiting payment</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </>
                )}
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
                placeholder="e.g. Customer called from 555-1234, special instructions..."
              />
            </section>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
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
              <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={step === 'processing'}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-[#406517] text-white rounded-full hover:bg-[#365512] disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
              >
                {step === 'processing' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Charging Card...</>
                ) : step === 'charged' ? (
                  <><CheckCircle className="w-4 h-4" />Creating Order...</>
                ) : isCardPayment ? (
                  <><Lock className="w-4 h-4" />Charge {formatMoney(subtotal)} &amp; Place Order</>
                ) : (
                  <><CheckCircle className="w-4 h-4" />Place Phone Order</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
