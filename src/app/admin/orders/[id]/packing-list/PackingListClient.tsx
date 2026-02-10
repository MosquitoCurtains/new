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
  salesperson_name: string | null
  created_at: string
  shipping_first_name: string | null
  shipping_last_name: string | null
  shipping_phone: string | null
  shipping_address_1: string | null
  shipping_address_2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  internal_note: string | null
}

interface Salesperson {
  name: string
  email: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function PackingListClient({
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
          filename: `${order.order_number}-packing-list.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(printRef.current)
        .save()
    }
  }

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

      {/* Printable packing list */}
      <div ref={printRef} className="max-w-[800px] mx-auto bg-white text-black p-8 print:p-4 print:max-w-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">Mosquito Curtains</h1>
            <p className="text-sm text-gray-600">1320 Union Hill Industrial Court, Suite C</p>
            <p className="text-sm text-gray-600">Alpharetta, GA 30004</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">Packing List for order {order.order_number}</h2>
            <p className="text-sm text-gray-600">Order Date: {formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Production Checklist + Shipping Address */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Cut By:</span> ___________</div>
              <div><span className="font-medium">Sewn By:</span> ___________</div>
              <div><span className="font-medium">Checked By:</span> ___________</div>
              <div><span className="font-medium">Kit Maker:</span> ___________</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1 uppercase text-gray-500">Shipping Address</h3>
            <p className="text-sm">{order.shipping_first_name} {order.shipping_last_name}</p>
            {order.shipping_address_1 && <p className="text-sm">{order.shipping_address_1}</p>}
            {order.shipping_address_2 && <p className="text-sm">{order.shipping_address_2}</p>}
            <p className="text-sm">{[order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}</p>
            {order.shipping_phone && <p className="text-sm">{order.shipping_phone}</p>}
          </div>
        </div>

        {/* Planner Info */}
        {(salesperson || order.salesperson_name) && (
          <div className="mb-4 text-sm">
            <span className="font-medium">Planner: </span>
            {salesperson?.name || order.salesperson_name}
            {salesperson?.email && (
              <span className="text-gray-600"> - {salesperson.email}</span>
            )}
          </div>
        )}

        {/* Internal Note */}
        {order.internal_note && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            {order.internal_note}
          </div>
        )}

        {/* Panel Details (if any) */}
        {lineItems
          .filter((item) => item.panel_specs)
          .map((panel) => {
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
              </div>
            )
          })}

        {/* Line Items Table (no prices) */}
        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-bold">Product</th>
              <th className="text-center py-2 font-bold">Qty</th>
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
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium">Installation Instructions:</p>
          <p className="text-sm text-blue-600">www.MosquitoCurtains.com/install</p>
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
