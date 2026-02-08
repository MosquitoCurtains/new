'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { ProductModalInfo } from '../types'

export default function ProductDetailModal({ product, onClose }: { product: ProductModalInfo; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-200" onClick={(e) => e.stopPropagation()}>
        {product.image && (
          <div className="relative w-full h-64 sm:h-72 bg-gray-50 shrink-0">
            <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, 384px" />
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors">
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto">
          {!product.image && (
            <div className="flex justify-end -mt-1 -mr-1 mb-2">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-[#003365]">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{product.unit}</span>
          </div>
          {product.packSize && product.packSize > 1 && product.packPrice !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
              <span className="text-sm text-blue-800 font-medium">Pack of {product.packSize} = ${product.packPrice.toFixed(2)}</span>
            </div>
          )}
          {product.description && <p className="text-sm text-gray-600 mb-4">{product.description}</p>}
          <div className="space-y-2 border-t border-gray-100 pt-3">
            {product.weight && (
              <div className="flex justify-between text-sm"><span className="text-gray-500">Track Weight</span><span className="font-medium text-gray-900">{product.weight}</span></div>
            )}
            {product.sku && (
              <div className="flex justify-between text-sm"><span className="text-gray-500">SKU</span><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{product.sku}</span></div>
            )}
            {product.step !== undefined && product.step > 0 && (
              <div className="flex justify-between text-sm"><span className="text-gray-500">Sold In</span><span className="font-medium text-gray-900">Increments of {product.step}</span></div>
            )}
            {product.min !== undefined && product.max !== undefined && (
              <div className="flex justify-between text-sm"><span className="text-gray-500">Qty Range</span><span className="font-medium text-gray-900">{product.min} &ndash; {product.max}</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
