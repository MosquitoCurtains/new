'use client'

/**
 * Admin DIY Hardware Recommendations
 *
 * Manage the thin "calc config" rules for the DIY Panel Builder's
 * "Track & Attachments" step.
 *
 * Each rule links a product (via product_sku) to a calculation formula.
 * All display data (name, price, image) comes from the products table.
 * This page only controls: product_sku, calc_rule, calc_params,
 * color_match, product_types, sort_order, and active.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  RotateCcw,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wrench,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calculator,
  Info,
  SlidersHorizontal,
  Columns3,
  Magnet,
  Hammer,
} from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface HardwareItem {
  id: string
  product_sku: string
  calc_rule: string
  calc_params: Record<string, number | string>
  color_match: string | null
  product_types: string | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

interface ProductInfo {
  sku: string
  name: string
  base_price: number
  unit: string
  image_url: string | null
  product_type: string
  product_category: string | null
  category_section: string | null
}

// =============================================================================
// FORMULA DESCRIPTIONS
// =============================================================================

interface CalcRuleInfo {
  label: string
  formula: string
  description: string
  editableParams: { key: string; label: string; description: string }[]
  exampleFn: (params: Record<string, number | string>) => string
}

const CALC_RULES: Record<string, CalcRuleInfo> = {
  track_linear_pieces: {
    label: 'Linear Pieces',
    formula: 'ceil(total_track_feet / (piece_length_inches / 12))',
    description: 'Divides total tracking width by piece length, rounds up.',
    editableParams: [
      { key: 'piece_length_inches', label: 'Piece Length (inches)', description: 'Length of each track piece in inches (84 = 7ft)' },
    ],
    exampleFn: (params) => {
      const len = Number(params.piece_length_inches) || 84
      const ft = len / 12
      return `Example: 100ft total width = ceil(100 / ${ft.toFixed(1)}) = ${Math.ceil(100 / ft)} pieces`
    },
  },
  track_splices: {
    label: 'Track Splices',
    formula: 'total_track_pieces - number_of_track_runs',
    description: 'One splice between each pair of adjacent track pieces in a continuous run.',
    editableParams: [],
    exampleFn: () => 'Example: 15 pieces across 3 sides = 15 - 3 = 12 splices',
  },
  track_endcaps: {
    label: 'Track End Caps',
    formula: 'number_of_track_runs x per_run',
    description: 'Caps at each end of a continuous track run.',
    editableParams: [
      { key: 'per_run', label: 'Per Run', description: 'Number of end caps per track run (typically 2)' },
    ],
    exampleFn: (params) => {
      const perRun = Number(params.per_run) || 2
      return `Example: 3 sides with tracking = 3 x ${perRun} = ${3 * perRun} end caps`
    },
  },
  per_snap_edge: {
    label: 'Per Snap Edge',
    formula: 'count of edges with marine_snaps attachment',
    description: 'One pack of snaps per panel edge that uses marine snap attachment.',
    editableParams: [],
    exampleFn: () => 'Example: 4 panels, each with snaps on both sides = 8 packs',
  },
  per_doorway_count: {
    label: 'Per Doorway',
    formula: 'number_of_doorways x per_doorway',
    description: 'A fixed count of this item per magnetic doorway.',
    editableParams: [
      { key: 'per_doorway', label: 'Per Doorway', description: 'How many of this item per magnetic doorway' },
    ],
    exampleFn: (params) => {
      const per = Number(params.per_doorway) || 1
      return `Example: 2 doorways = 2 x ${per} = ${2 * per} items`
    },
  },
  per_stucco_edge: {
    label: 'Per Stucco Edge',
    formula: 'count of edges with stucco_strip attachment',
    description: 'One strip per panel edge that uses stucco strip attachment.',
    editableParams: [],
    exampleFn: () => 'Example: 3 panels with stucco on left side = 3 strips',
  },
  fixed_quantity: {
    label: 'Fixed Quantity',
    formula: 'always = quantity',
    description: 'Always recommends a fixed number regardless of panel configuration.',
    editableParams: [
      { key: 'quantity', label: 'Quantity', description: 'How many to always recommend' },
    ],
    exampleFn: (params) => {
      const qty = Number(params.quantity) || 1
      return `Always recommends: ${qty}`
    },
  },
}

// =============================================================================
// ADD ITEM MODAL
// =============================================================================

function AddItemModal({ open, onClose, onAdd, products }: {
  open: boolean
  onClose: () => void
  onAdd: (item: Partial<HardwareItem>) => void
  products: ProductInfo[]
}) {
  const [productSku, setProductSku] = useState('')
  const [calcRule, setCalcRule] = useState('fixed_quantity')

  if (!open) return null

  const ruleInfo = CALC_RULES[calcRule]
  const selectedProduct = products.find(p => p.sku === productSku)

  const handleSubmit = () => {
    if (!productSku.trim()) return
    const defaultParams: Record<string, number> = {}
    if (ruleInfo) {
      for (const p of ruleInfo.editableParams) {
        defaultParams[p.key] = p.key === 'piece_length_inches' ? 84 : p.key === 'per_run' ? 2 : 1
      }
    }
    onAdd({
      product_sku: productSku.trim(),
      calc_rule: calcRule,
      calc_params: defaultParams,
      color_match: null,
      product_types: null,
      sort_order: 100,
      active: true,
    })
    setProductSku('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <Heading level={3} className="!mb-4">Add Recommendation Rule</Heading>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Product</label>
            <select
              value={productSku}
              onChange={e => setProductSku(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  {p.name} ({p.sku}) - ${p.base_price}/{p.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              {selectedProduct.image_url && (
                <img src={selectedProduct.image_url} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              <div>
                <div className="text-sm font-semibold text-gray-800">{selectedProduct.name}</div>
                <div className="text-xs text-gray-500">${selectedProduct.base_price}/{selectedProduct.unit}</div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Calculation Rule</label>
            <select value={calcRule} onChange={e => setCalcRule(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]">
              {Object.entries(CALC_RULES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {ruleInfo && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <div className="font-mono text-gray-700 mb-1">{ruleInfo.formula}</div>
              <div className="text-gray-500">{ruleInfo.description}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!productSku.trim()}>
            <Plus className="w-4 h-4 mr-2" /> Add Rule
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// ITEM ROW
// =============================================================================

function ItemRow({ item, product, editMode, editedValues, onFieldChange }: {
  item: HardwareItem
  product: ProductInfo | null
  editMode: boolean
  editedValues: Record<string, unknown>
  onFieldChange: (id: string, field: string, value: unknown) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isActive = (editedValues[`active:${item.id}`] as boolean) ?? item.active
  const isEdited = Object.keys(editedValues).some(k => k.endsWith(`:${item.id}`))

  const getVal = <T,>(field: string, fallback: T): T => {
    const key = `${field}:${item.id}`
    return editedValues[key] !== undefined ? (editedValues[key] as T) : fallback
  }

  const ruleInfo = CALC_RULES[item.calc_rule]
  const currentParams = getVal('calc_params', item.calc_params)
  const exampleText = ruleInfo ? ruleInfo.exampleFn(currentParams) : ''

  const updateParam = (paramKey: string, value: number) => {
    const updated = { ...currentParams, [paramKey]: value }
    onFieldChange(item.id, 'calc_params', updated)
  }

  return (
    <div className={`${isEdited ? 'bg-amber-50/50' : ''} ${!isActive ? 'opacity-40' : ''} transition-opacity`}>
      {/* Main row */}
      <div
        className="px-4 py-3 grid grid-cols-[1fr_auto_auto_40px] gap-4 items-center border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Product info + rule */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {product?.image_url && (
              <img src={product.image_url} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
            )}
            <Text className="font-semibold text-gray-900 !mb-0 text-sm">
              {product?.name || item.product_sku}
            </Text>
            {product && (
              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">
                ${product.base_price}/{product.unit}
              </span>
            )}
            {item.product_types && (
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                {item.product_types}
              </span>
            )}
            {item.color_match && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                {item.color_match}
              </span>
            )}
            {!isActive && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">disabled</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#406517]/8 text-[#406517] px-1.5 py-0.5 rounded">
              <Calculator className="w-3 h-3" />
              {ruleInfo?.label || item.calc_rule}
            </span>
            {ruleInfo?.editableParams && ruleInfo.editableParams.length > 0 && (
              <span className="text-[10px] text-gray-400 font-mono">
                {ruleInfo.editableParams.map(p => `${p.key}=${currentParams[p.key] ?? '?'}`).join(', ')}
              </span>
            )}
          </div>
          {exampleText && (
            <div className="mt-1 text-xs text-gray-500 italic">{exampleText}</div>
          )}
        </div>

        {/* Product SKU */}
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
            {item.product_sku}
          </span>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-center shrink-0">
          {editMode ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFieldChange(item.id, 'active', !isActive) }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          ) : (
            isActive ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-300" />
          )}
        </div>

        {/* Expand */}
        <div className="flex items-center justify-center shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 py-4 bg-gray-50/70 border-b border-gray-200">
          {/* Formula card */}
          {ruleInfo && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-[#406517]" />
                <span className="text-sm font-bold text-gray-800">Formula: {ruleInfo.label}</span>
              </div>
              <div className="font-mono text-sm text-[#406517] bg-[#406517]/5 px-3 py-2 rounded mb-2">
                qty = {ruleInfo.formula}
              </div>
              <div className="text-xs text-gray-500 mb-3">{ruleInfo.description}</div>

              {/* Editable parameters */}
              {ruleInfo.editableParams.length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tunable Parameters</div>
                  {ruleInfo.editableParams.map(param => (
                    <div key={param.key} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{param.label}</div>
                        <div className="text-xs text-gray-400">{param.description}</div>
                      </div>
                      {editMode ? (
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={Number(currentParams[param.key]) || 0}
                          onChange={e => updateParam(param.key, parseInt(e.target.value) || 0)}
                          onClick={e => e.stopPropagation()}
                          className="w-24 px-3 py-2 bg-white border-2 border-[#406517]/30 rounded-lg text-sm font-bold text-center text-[#406517] focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517]"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#406517] tabular-nums px-3">{String(currentParams[param.key])}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Live example */}
              {exampleText && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-600">{exampleText}</span>
                </div>
              )}
            </div>
          )}

          {/* Config fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              {/* Product info (read-only, from products table) */}
              {product && (
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Product (from /admin/pricing)</div>
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-800">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        ${product.base_price}/{product.unit}
                        {product.category_section && ` | ${product.category_section}`}
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-0.5">{product.sku}</div>
                    </div>
                  </div>
                </div>
              )}

              {!product && (
                <div className="bg-red-50 rounded-lg border border-red-200 p-3">
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Product not found: {item.product_sku}
                  </div>
                  <div className="text-xs text-red-500 mt-1">Check that this SKU exists in the products table.</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={getVal('sort_order', item.sort_order)}
                      onChange={e => onFieldChange(item.id, 'sort_order', parseInt(e.target.value) || 0)}
                      onClick={e => e.stopPropagation()}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0">{item.sort_order}</Text>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Color Match</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={getVal('color_match', item.color_match || '')}
                      onChange={e => onFieldChange(item.id, 'color_match', e.target.value || null)}
                      onClick={e => e.stopPropagation()}
                      placeholder="all colors"
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0 text-xs">{item.color_match || 'all colors'}</Text>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Product Types</label>
                {editMode ? (
                  <input
                    type="text"
                    value={getVal('product_types', item.product_types || '')}
                    onChange={e => onFieldChange(item.id, 'product_types', e.target.value || null)}
                    onClick={e => e.stopPropagation()}
                    placeholder="all types (e.g. mosquito_curtains,clear_vinyl)"
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 text-xs">{item.product_types || 'all types'}</Text>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function AdminDiyHardwarePage() {
  const [items, setItems] = useState<HardwareItem[]>([])
  const [products, setProducts] = useState<ProductInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedValues, setEditedValues] = useState<Record<string, unknown>>({})
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch rules and products in parallel
      const [rulesRes, productsRes] = await Promise.all([
        fetch('/api/admin/diy-hardware'),
        fetch('/api/admin/products'),
      ])

      const rulesResult = await rulesRes.json()
      if (!rulesRes.ok) throw new Error(rulesResult.error || 'Failed to fetch rules')
      setItems(rulesResult.items || [])

      const productsResult = await productsRes.json()
      if (productsRes.ok && productsResult.data) {
        setProducts(productsResult.data.map((p: Record<string, unknown>) => ({
          sku: p.sku,
          name: p.name,
          base_price: p.base_price,
          unit: p.unit,
          image_url: p.image_url,
          product_type: p.product_type,
          product_category: p.product_category,
          category_section: p.category_section,
        })))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleFieldChange = (id: string, field: string, value: unknown) => {
    setEditedValues(prev => ({ ...prev, [`${field}:${id}`]: value }))
  }

  const hasChanges = Object.keys(editedValues).length > 0
  const changeCount = Object.keys(editedValues).length

  const handleReset = () => {
    setEditedValues({})
    setEditMode(false)
    setSuccess(null)
    setError(null)
  }

  const handleSave = async () => {
    if (!hasChanges) return
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const colonIdx = key.indexOf(':')
        return { id: key.slice(colonIdx + 1), field: key.slice(0, colonIdx), value }
      })
      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to save')
      await fetchData()
      setEditedValues({})
      setEditMode(false)
      setSuccess(`Updated ${updates.length} field${updates.length > 1 ? 's' : ''}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = async (item: Partial<HardwareItem>) => {
    try {
      setError(null)
      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', item }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to add')
      await fetchData()
      setSuccess('Rule added')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    }
  }

  const handleDeleteItem = async (id: string, sku: string) => {
    const product = products.find(p => p.sku === sku)
    const displayName = product?.name || sku
    if (!confirm(`Delete rule for "${displayName}"? This cannot be undone.`)) return
    try {
      setError(null)
      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to delete')
      await fetchData()
      setSuccess('Rule deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  // Build product lookup map
  const productMap = new Map(products.map(p => [p.sku, p]))

  // Sort items by sort_order
  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order)

  // ── Group items by product category_section (matching admin/sales layout) ──
  const SECTION_CONFIG: { id: string; title: string; subtitle: string; icon: typeof Wrench; color: string }[] = [
    { id: 'Standard Track', title: 'Standard Track', subtitle: 'Recommended when top attachment = Tracking', icon: SlidersHorizontal, color: '#406517' },
    { id: 'Sealing Sides', title: 'Sealing Sides', subtitle: 'Recommended when side edge = Marine Snaps', icon: Columns3, color: '#003365' },
    { id: 'Magnetic Doorways', title: 'Magnetic Doorways', subtitle: 'Recommended when side edge = Magnetic Door', icon: Magnet, color: '#B30158' },
    { id: 'Stucco', title: 'Stucco Strips', subtitle: 'Recommended when side edge = Stucco Strip', icon: Columns3, color: '#8B5E3C' },
    { id: 'Tools', title: 'Tools', subtitle: 'Always recommended for applicable product types', icon: Hammer, color: '#555' },
  ]

  // Map items to sections via their product's category_section (or product_type for tools)
  const getSectionId = (item: HardwareItem): string => {
    const product = productMap.get(item.product_sku)
    if (!product) return 'Other'
    if (product.product_type === 'tool') return 'Tools'
    return product.category_section || product.product_category || 'Other'
  }

  const sections = SECTION_CONFIG.map(sec => ({
    ...sec,
    items: sortedItems.filter(item => getSectionId(item) === sec.id),
  }))

  // Catch any items that don't match a known section
  const knownSectionIds = new Set(SECTION_CONFIG.map(s => s.id))
  const uncategorized = sortedItems.filter(item => !knownSectionIds.has(getSectionId(item)))

  if (loading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <Text className="text-gray-500 mt-4 !mb-0">Loading recommendation rules...</Text>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Text size="sm" className="text-gray-500 !mb-0">Back to Admin</Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#406517]/10 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#406517]" />
              </div>
              <div>
                <Heading level={1} className="!mb-0">Hardware Recommendations</Heading>
                <Text className="text-gray-500 !mb-0">
                  {items.filter(i => i.active).length} active rules &middot; Product data from{' '}
                  <Link href="/admin/pricing" className="text-[#406517] font-semibold hover:underline">/admin/pricing</Link>
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={saving}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button variant="primary" disabled={!hasChanges || saving} onClick={handleSave}>
                    {saving ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  Edit Rules
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Success */}
        {success && (
          <Card variant="outlined" className="!p-4 !bg-green-50 !border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <Text className="text-green-700 !mb-0">{success}</Text>
            </div>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-red-50 !border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <Text className="text-red-700 !mb-0">{error}</Text>
            </div>
          </Card>
        )}

        {/* Unsaved changes */}
        {editMode && hasChanges && (
          <Card variant="outlined" className="!p-4 !bg-amber-50 !border-amber-200">
            <div className="flex items-center justify-between">
              <Text className="text-amber-800 !mb-0">
                <span className="font-semibold">{changeCount}</span> unsaved change{changeCount > 1 ? 's' : ''}
              </Text>
              <Button variant="outline" size="sm" onClick={handleReset}>Discard</Button>
            </div>
          </Card>
        )}

        {/* How it works */}
        <Card variant="outlined" className="!p-4 !bg-gray-50 !border-gray-200">
          <Heading level={4} className="!mb-2 !text-sm text-gray-700">How Recommendations Work</Heading>
          <Text size="sm" className="text-gray-500 !mb-3">
            Each rule links a <strong>product</strong> (name, price, image from /admin/pricing) to a
            <strong> calculation formula</strong> that determines quantity based on the customer&apos;s panel
            configuration. Tune the parameters below to adjust how many of each product get recommended.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(CALC_RULES).map(([key, rule]) => (
              <div key={key} className="flex items-start gap-2 bg-white rounded-lg border border-gray-100 p-2.5">
                <Calculator className="w-3.5 h-3.5 text-[#406517] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">{rule.label}</div>
                  <div className="text-[10px] font-mono text-gray-500">{rule.formula}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section cards (matching admin/sales layout) */}
        {sections.map(section => {
          const Icon = section.icon
          if (section.items.length === 0 && !editMode) return null

          return (
            <Card key={section.id} variant="elevated" className="!p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: section.color }} />
                  </div>
                  <div>
                    <Heading level={2} className="!mb-0">{section.title}</Heading>
                    <Text size="sm" className="text-gray-400 !mb-0">{section.subtitle}</Text>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {section.items.filter(i => i.active).length} / {section.items.length} active
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                {section.items.map(item => (
                  <div key={item.id} className="relative group">
                    <ItemRow
                      item={item}
                      product={productMap.get(item.product_sku) || null}
                      editMode={editMode}
                      editedValues={editedValues}
                      onFieldChange={handleFieldChange}
                    />
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, item.product_sku)}
                        className="absolute top-3 right-28 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}

                {section.items.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No rules in this section.
                    {editMode && (
                      <button type="button" onClick={() => setShowAddModal(true)} className="text-[#406517] font-semibold ml-1 hover:underline">
                        Add one
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {/* Uncategorized rules (if any) */}
        {uncategorized.length > 0 && (
          <Card variant="elevated" className="!p-6">
            <Heading level={2} className="!mb-2">Other Rules</Heading>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {uncategorized.map(item => (
                <div key={item.id} className="relative group">
                  <ItemRow
                    item={item}
                    product={productMap.get(item.product_sku) || null}
                    editMode={editMode}
                    editedValues={editedValues}
                    onFieldChange={handleFieldChange}
                  />
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.product_sku)}
                      className="absolute top-3 right-28 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="h-8" />
      </Stack>

      <AddItemModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddItem} products={products} />
    </Container>
  )
}
