'use client'

import { useRef } from 'react'
import { Download, Printer } from 'lucide-react'

interface LineItemOption {
  id: string
  option_name: string
  option_value: string
  option_display: string | null
  price_impact: number
}

interface LineItem {
  id: string
  product_sku: string
  product_name: string
  quantity: number
  width_inches: number | null
  height_inches: number | null
  length_feet: number | null
  unit_price: number
  line_total: number
  adjustment_type: string | null
  adjustment_reason: string | null
  panel_specs: Record<string, unknown> | null
  original_bundle_name: string | null
  line_item_options: LineItemOption[]
}

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  payment_method: string | null
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  salesperson_name: string | null
  created_at: string
  billing_first_name: string | null
  billing_last_name: string | null
  billing_phone: string | null
  billing_address_1: string | null
  billing_address_2: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  billing_country: string | null
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_phone: string | null
  shipping_address_1: string | null
  shipping_address_2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
}

function formatMoney(val: number | null) {
  if (val == null) return '$0.00'
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function InvoiceClient({
  order,
  lineItems,
}: {
  order: Order
  lineItems: LineItem[]
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

  // Group line items by type for display
  const panels = lineItems.filter((i) => i.product_sku?.includes('panel') || i.panel_specs)
  const other = lineItems.filter((i) => !panels.includes(i))

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
      <div ref={printRef} className="max-w-[800px] mx-auto bg-white text-black p-8 print:p-4 print:max-w-none">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">Mosquito Curtains, Inc.</h1>
            <p className="text-sm text-gray-600">1320 Union Hill Industrial Court, Suite C</p>
            <p className="text-sm text-gray-600">Alpharetta, GA 30004</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">Invoice for order {order.order_number}</h2>
            <p className="text-sm text-gray-600">Order Date: {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Production Checklist */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
          <div><span className="font-medium">Cut By:</span> ___________</div>
          <div><span className="font-medium">Sewn By:</span> ___________</div>
          <div><span className="font-medium">Checked By:</span> ___________</div>
          <div><span className="font-medium">Kit Maker:</span> ___________</div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-sm mb-1 uppercase text-gray-500">Billing Address</h3>
            <p className="text-sm">{order.billing_first_name} {order.billing_last_name}</p>
            {order.billing_address_1 && <p className="text-sm">{order.billing_address_1}</p>}
            {order.billing_address_2 && <p className="text-sm">{order.billing_address_2}</p>}
            <p className="text-sm">{[order.billing_city, order.billing_state, order.billing_zip].filter(Boolean).join(', ')}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1 uppercase text-gray-500">Shipping Address</h3>
            <p className="text-sm">{order.shipping_first_name} {order.shipping_last_name}</p>
            {order.shipping_address_1 && <p className="text-sm">{order.shipping_address_1}</p>}
            {order.shipping_address_2 && <p className="text-sm">{order.shipping_address_2}</p>}
            <p className="text-sm">{[order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}</p>
            {order.shipping_phone || order.billing_phone ? (
              <p className="text-sm">{order.shipping_phone || order.billing_phone}</p>
            ) : null}
          </div>
        </div>

        {/* Panel Details (if any) */}
        {panels.map((panel) => {
          const specs = panel.panel_specs as Record<string, unknown> | null
          const panelSizes = specs?.panels as Array<Record<string, unknown>> | undefined
          return (
            <div key={panel.id} className="mb-4 border border-gray-200 rounded p-3">
              <div className="font-bold text-sm mb-2">{panel.product_name}</div>
              {specs?.mesh_type ? (
                <p className="text-xs text-gray-600">Mesh Type: {String(specs.mesh_type)}</p>
              ) : null}
              {specs?.mesh_color ? (
                <p className="text-xs text-gray-600">Mesh Color: {String(specs.mesh_color)}</p>
              ) : null}
              {specs?.canvas_color ? (
                <p className="text-xs text-gray-600">Canvas Color: {String(specs.canvas_color)}</p>
              ) : null}
              {specs?.top_attachment ? (
                <p className="text-xs text-gray-600">Top Attachment: {String(specs.top_attachment)}</p>
              ) : null}
              {panelSizes && panelSizes.length > 0 && (
                <table className="w-full text-xs mt-2 border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 px-2">No</th>
                      <th className="text-left py-1 px-2">Width (Feet)</th>
                      <th className="text-left py-1 px-2">Width (Inches)</th>
                      <th className="text-left py-1 px-2">Height (Inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panelSizes.map((p, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-1 px-2">P{i + 1}</td>
                        <td className="py-1 px-2">{String(p.widthFeet ?? '')}</td>
                        <td className="py-1 px-2">{String(p.widthInches ?? '')}</td>
                        <td className="py-1 px-2">{String(p.height ?? '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="text-sm font-medium mt-2 text-right">
                Total: {formatMoney(panel.line_total)}
              </div>
            </div>
          )
        })}

        {/* Line Items Table */}
        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-bold">Product</th>
              <th className="text-center py-2 font-bold">Qty</th>
              <th className="text-right py-2 font-bold">Price</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">
                  <div className="font-medium">{item.product_name}</div>
                  {item.line_item_options?.map((opt) => (
                    <div key={opt.id} className="text-xs text-gray-500">
                      {opt.option_name}: {opt.option_display || opt.option_value}
                    </div>
                  ))}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">{formatMoney(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1 text-sm">
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
            <div className="flex justify-between">
              <span>Sales Person: - {order.salesperson_name || 'N/A'}</span>
              <span>$0.00</span>
            </div>
            {order.payment_method && (
              <div className="flex justify-between text-gray-600">
                <span>Payment method:</span>
                <span>{order.payment_method}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-2">
              <span>Total:</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="border-t pt-4 text-sm">
          <h3 className="font-bold mb-1">Customer Details</h3>
          <p>Email: {order.email}</p>
          {(order.billing_phone || order.shipping_phone) && (
            <p>Phone: {order.billing_phone || order.shipping_phone}</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
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
