'use client'

import { useRef, useMemo } from 'react'
import { Download, Printer } from 'lucide-react'
import {
  type Order,
  type LineItem,
  type Salesperson,
  type PanelGroup,
  type TrackGroup,
  type HardwareDetail,
  groupLineItems,
  buildSummaryRows,
  formatMoney,
  formatSignedMoney,
  formatDate,
  formatMeshType,
  formatTopAttachment,
  formatColor,
  formatPanelSize,
  getRawNettingDetails,
  getAdjustmentDetails,
} from '../order-document-utils'

// =============================================================================
// COMPONENT
// =============================================================================

export default function InvoiceClient({
  order,
  lineItems,
  salesperson,
}: {
  order: Order
  lineItems: LineItem[]
  salesperson: Salesperson | null
}) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => window.print()

  const handleDownloadPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default
    if (printRef.current) {
      html2pdf()
        .set({
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: `${order.order_number}-invoice.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(printRef.current)
        .save()
    }
  }

  const grouped = useMemo(() => groupLineItems(lineItems), [lineItems])
  const summaryRows = useMemo(() => buildSummaryRows(grouped), [grouped])

  return (
    <>
      {/* Action bar (hidden when printing) */}
      <div className="print:hidden flex items-center justify-end gap-3 p-4 bg-gray-100 border-b">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* Printable invoice */}
      <div ref={printRef} className="max-w-[800px] mx-auto bg-white text-black p-8 print:p-4 print:max-w-none text-[13px] leading-snug">
        {/* ── Company Header ─────────────────────────────── */}
        <div className="flex justify-between items-start mb-5 border-b pb-3">
          <div>
            <h1 className="text-lg font-bold">Mosquito Curtains, Inc.</h1>
            <p className="text-xs text-gray-600">1320 Union Hill Industrial Court, Suite C</p>
            <p className="text-xs text-gray-600">Alpharetta, GA 30004</p>
          </div>
          <div className="text-right">
            <h2 className="text-base font-bold">Invoice for order {order.order_number}</h2>
            <p className="text-xs text-gray-600">Order Date: {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* ── Production Checklist ────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-5 text-xs">
          <div><span className="font-semibold">Cut By:</span> ___________</div>
          <div><span className="font-semibold">Sewn By:</span> ___________</div>
          <div><span className="font-semibold">Checked By:</span> ___________</div>
          <div><span className="font-semibold">Kit Maker:</span> ___________</div>
        </div>

        {/* ── Addresses ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <h3 className="font-bold text-xs mb-1 uppercase text-gray-500">Billing Address</h3>
            <p className="text-xs">{order.billing_first_name} {order.billing_last_name}</p>
            {order.billing_address_1 && <p className="text-xs">{order.billing_address_1}</p>}
            {order.billing_address_2 && <p className="text-xs">{order.billing_address_2}</p>}
            <p className="text-xs">
              {[order.billing_city, order.billing_state, order.billing_zip].filter(Boolean).join(', ')}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xs mb-1 uppercase text-gray-500">Shipping Address</h3>
            <p className="text-xs">{order.shipping_first_name} {order.shipping_last_name}</p>
            {order.shipping_address_1 && <p className="text-xs">{order.shipping_address_1}</p>}
            {order.shipping_address_2 && <p className="text-xs">{order.shipping_address_2}</p>}
            <p className="text-xs">
              {[order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}
            </p>
            {(order.shipping_phone || order.billing_phone) && (
              <p className="text-xs">{order.shipping_phone || order.billing_phone}</p>
            )}
          </div>
        </div>

        {/* ── Mixed Materials Warning ─────────────────────── */}
        {grouped.hasMixedMaterials && (
          <div className="mb-4 text-center font-bold text-sm border-2 border-red-400 bg-red-50 text-red-700 py-2 rounded">
            ******* MIXED MATERIALS! *******
          </div>
        )}

        {/* ── Internal / Customer Note ────────────────────── */}
        {order.internal_note && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs">
            {order.internal_note}
          </div>
        )}
        {order.customer_note && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <span className="font-semibold">Customer Note:</span> {order.customer_note}
          </div>
        )}

        {/* ── Adjustments ─────────────────────────────────── */}
        {grouped.adjustments.length > 0 && (
          <div className="mb-4 border border-gray-200 rounded p-3">
            {grouped.adjustments.map((item) => {
              const det = getAdjustmentDetails(item)
              return (
                <div key={item.id} className="flex justify-between text-xs py-0.5">
                  <span>
                    {det.isNegative ? 'Negative' : 'Positive'} Adjustment: Qty: {item.quantity}, Price: {formatSignedMoney(det.amount)}
                  </span>
                </div>
              )
            })}
            {grouped.adjustments.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">{grouped.adjustments[0].product_name}</div>
            )}
          </div>
        )}

        {/* ── Attachments & Track Hardware ─────────────────── */}
        {(grouped.attachmentItems.length > 0 || grouped.trackGroups.length > 0 || grouped.accessoryItems.length > 0) && (
          <div className="mb-4 border border-gray-200 rounded p-3">
            <h3 className="font-bold text-xs mb-2 uppercase text-gray-700">Attachments &amp; Track Hardware</h3>

            {/* Attachment items */}
            {grouped.attachmentItems.length > 0 && (
              <AttachmentBlock items={grouped.attachmentItems} total={grouped.attachmentTotal} label="Attachment Hardware" />
            )}

            {/* Accessory items */}
            {grouped.accessoryItems.length > 0 && (
              <AttachmentBlock items={grouped.accessoryItems} total={grouped.accessoryTotal} label="Accessories" />
            )}

            {/* Stucco items */}
            {grouped.stuccoItems.length > 0 && (
              <AttachmentBlock items={grouped.stuccoItems} total={grouped.stuccoTotal} label="Stucco Strips" />
            )}

            {/* Track groups */}
            {grouped.trackGroups.map((tg, i) => (
              <TrackBlock key={i} group={tg} />
            ))}
          </div>
        )}

        {/* ── Panel Sets ──────────────────────────────────── */}
        {grouped.panelGroups.map((pg, i) => (
          <PanelGroupBlock key={i} group={pg} showPrices />
        ))}

        {/* ── Raw Netting ─────────────────────────────────── */}
        {grouped.rawNettingItems.length > 0 && (
          <div className="mb-4 border border-gray-200 rounded p-3">
            <h3 className="font-bold text-xs mb-2 uppercase text-gray-700">Raw Netting</h3>
            {grouped.rawNettingItems.map((item) => {
              const det = getRawNettingDetails(item)
              return (
                <div key={item.id} className="mb-2 last:mb-0">
                  <div className="font-semibold text-xs">{item.product_name}</div>
                  <div className="text-xs text-gray-600 space-y-0.5 mt-0.5">
                    {det.meshType && <div>Material: {formatMeshType(det.meshType)}</div>}
                    {det.rollWidth && <div>Roll Width: {det.rollWidth}&quot;</div>}
                    {det.color && <div>Color: {formatColor(det.color)}</div>}
                    {det.lengthFeet && <div>Length: {det.lengthFeet} ft</div>}
                    {det.purchaseType && <div>Purchase Type: {det.purchaseType === 'by_foot' ? 'By the Foot' : 'Full Roll'}</div>}
                  </div>
                  <div className="text-xs font-medium text-right mt-1">
                    Price: {formatMoney(item.line_total)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Snap Tool ───────────────────────────────────── */}
        {grouped.tools.length > 0 && (
          <div className="mb-4 border border-gray-200 rounded p-3">
            {grouped.tools.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="font-medium">{item.product_name}</span>
                <span>{formatMoney(item.line_total)}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Other items ─────────────────────────────────── */}
        {grouped.other.length > 0 && (
          <div className="mb-4 border border-gray-200 rounded p-3">
            {grouped.other.map((item) => (
              <div key={item.id} className="mb-2 last:mb-0">
                <div className="font-semibold text-xs">{item.product_name}</div>
                {item.line_item_options?.length > 0 && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.line_item_options.map((opt) => (
                      <div key={opt.id}>{opt.option_name}: {opt.option_display || opt.option_value}</div>
                    ))}
                  </div>
                )}
                <div className="text-xs font-medium text-right">
                  Qty: {item.quantity}, Price: {formatMoney(item.line_total)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Summary Table ───────────────────────────────── */}
        <table className="w-full text-xs mb-5 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-1.5 font-bold">Product</th>
              <th className="text-center py-1.5 font-bold w-16">Qty</th>
              <th className="text-right py-1.5 font-bold w-24">Price</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1.5">{row.label}</td>
                <td className="py-1.5 text-center">{row.qty}</td>
                <td className="py-1.5 text-right">{formatSignedMoney(row.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals ──────────────────────────────────────── */}
        <div className="flex justify-end mb-5">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatMoney(order.shipping_amount)}</span>
            </div>
            {order.tax_amount > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatMoney(order.tax_amount)}</span>
              </div>
            )}
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatMoney(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sales Person: - {salesperson?.name || order.salesperson_name || 'N/A'}</span>
              <span>$0.00</span>
            </div>
            {order.payment_method && (
              <div className="flex justify-between text-gray-600">
                <span>Payment method:</span>
                <span>{order.payment_method}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-gray-300 pt-2 mt-2">
              <span>Total:</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Customer Details ─────────────────────────────── */}
        <div className="border-t pt-3 text-xs">
          <h3 className="font-bold mb-1">Customer Details</h3>
          <p>Email: {order.email}</p>
          {(order.billing_phone || order.shipping_phone) && (
            <p>Phone: {order.billing_phone || order.shipping_phone}</p>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div className="mt-5 text-center text-xs text-gray-500">
          Please visit www.mosquitocurtains.com/install for installation instructions.
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-4 { padding: 1rem !important; }
          .print\\:max-w-none { max-width: none !important; }
        }
      `}</style>
    </>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function AttachmentBlock({
  items,
  total,
  label,
}: {
  items: HardwareDetail[]
  total: number
  label: string
}) {
  return (
    <div className="mb-3 last:mb-0">
      {items.map((hw, i) => (
        <div key={i} className="flex justify-between text-xs py-0.5">
          <span>{hw.name}: {hw.qty}</span>
          <span>({formatMoney(hw.price)})</span>
        </div>
      ))}
      <div className="text-xs font-semibold mt-1 border-t border-gray-100 pt-1">
        Total Of All {label}: {formatMoney(total)}
      </div>
    </div>
  )
}

function TrackBlock({ group }: { group: TrackGroup }) {
  return (
    <div className="mb-3 last:mb-0 mt-3">
      <div className="text-xs mb-1">
        <span className="font-semibold">Color:</span> {formatColor(group.color)}
      </div>
      {group.items.map((ti, i) => (
        <div key={i} className="flex justify-between text-xs py-0.5">
          <span>{ti.name}: {ti.qty}</span>
          <span>({formatMoney(ti.price)})</span>
        </div>
      ))}
      <div className="text-xs font-semibold mt-1 border-t border-gray-100 pt-1">
        Total Of All Tracking Hardware: {formatMoney(group.totalPrice)}
      </div>
    </div>
  )
}

function PanelGroupBlock({
  group,
  showPrices,
}: {
  group: PanelGroup
  showPrices: boolean
}) {
  return (
    <div className="mb-4 border border-gray-200 rounded p-3">
      <div className="font-bold text-xs mb-2">{group.label}</div>

      {/* Shared specs */}
      <div className="text-xs text-gray-600 space-y-0.5 mb-2">
        {group.type === 'mesh' && (
          <>
            {group.meshType && <div>Mesh Type: {formatMeshType(group.meshType)}</div>}
            {group.color && <div>Mesh Color: {formatColor(group.color)}</div>}
            {group.topAttachment && <div>Top Attachment: {formatTopAttachment(group.topAttachment)}</div>}
            {group.velcroColor && group.topAttachment?.includes('velcro') && (
              <div>Velcro Color: {formatColor(group.velcroColor)}</div>
            )}
          </>
        )}
        {group.type === 'vinyl' && (
          <>
            {group.panelSize && <div>Panel Size: {formatPanelSize(group.panelSize)}</div>}
            {group.color && <div>Canvas Color: {formatColor(group.color)}</div>}
            {group.topAttachment && <div>Top Attachment: {formatTopAttachment(group.topAttachment)}</div>}
            {group.velcroColor && group.topAttachment?.includes('velcro') && (
              <div>Velcro Color: {formatColor(group.velcroColor)}</div>
            )}
          </>
        )}
      </div>

      {/* Panel dimensions table */}
      <div className="text-xs font-medium mb-1">
        {group.type === 'vinyl' ? 'Clear Vinyl' : group.type === 'mesh' ? 'Mesh' : 'Roll-Up'} Panels{group.type !== 'rollup' && ' (Enter Numbers Only)'}:
      </div>
      <table className="w-full text-xs border-collapse mb-2">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-1 px-2 font-semibold">No</th>
            <th className="text-left py-1 px-2 font-semibold">Panel Width (Feet Portion)</th>
            <th className="text-left py-1 px-2 font-semibold">Panel Width (Inches Portion)</th>
            <th className="text-left py-1 px-2 font-semibold">Height (Inches)</th>
          </tr>
        </thead>
        <tbody>
          {group.panels.map((p) => (
            <tr key={p.index} className="border-b border-gray-100">
              <td className="py-1 px-2">P{p.index}</td>
              <td className="py-1 px-2">{p.widthFeet}</td>
              <td className="py-1 px-2">{p.widthInches}</td>
              <td className="py-1 px-2">{p.heightInches}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Set total */}
      <div className="text-xs font-medium">
        {group.label} Set: Qty: 1{showPrices && <>, Price: {formatMoney(group.totalPrice)}</>}
      </div>
      {showPrices && (
        <div className="text-xs font-semibold text-right">
          Total: {formatMoney(group.totalPrice)}
        </div>
      )}
    </div>
  )
}
