'use client'

/**
 * Admin DIY Hardware Recommendations
 *
 * Manage the recommendation rules for the DIY Panel Builder's
 * "Track & Attachments" step.
 *
 * This page controls WHAT hardware to recommend and HOW MANY
 * based on the customer's panel configuration. Pricing is managed
 * separately at /admin/pricing.
 *
 * Each item has a calculation rule and tunable parameters that
 * determine quantities. Example: 100ft of total width with
 * track_linear_pieces and piece_length_inches=84 → ceil(100/7) = 15 pieces.
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
  SlidersHorizontal,
  Magnet,
  Columns3,
  Hammer,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calculator,
  Info,
} from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface HardwareItem {
  id: string
  item_key: string
  category: string
  product_sku: string | null
  name: string
  description_template: string | null
  unit_label: string
  calc_rule: string
  calc_params: Record<string, number | string>
  color_match: string | null
  sort_order: number
  active: boolean
  admin_notes: string | null
  created_at: string
  updated_at: string
}

interface CategoryConfig {
  id: string
  title: string
  subtitle: string
  icon: typeof Wrench
  color: string
}

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'track',
    title: 'Track Hardware',
    subtitle: 'Recommended when top attachment = Tracking',
    icon: SlidersHorizontal,
    color: '#406517',
  },
  {
    id: 'snap',
    title: 'Marine Snaps',
    subtitle: 'Recommended when any side edge = Marine Snaps',
    icon: Columns3,
    color: '#003365',
  },
  {
    id: 'magnetic_door',
    title: 'Magnetic Door Hardware',
    subtitle: 'Recommended when panel layout = 2 Panels (magnetic doorway)',
    icon: Magnet,
    color: '#B30158',
  },
  {
    id: 'stucco',
    title: 'Stucco Strips',
    subtitle: 'Recommended when any side edge = Stucco Strip',
    icon: Columns3,
    color: '#8B5E3C',
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Always recommended',
    icon: Hammer,
    color: '#555',
  },
]

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
      return `Example: 100ft total width → ceil(100 / ${ft}) = ${Math.ceil(100 / ft)} pieces`
    },
  },
  track_splices: {
    label: 'Track Splices',
    formula: 'total_track_pieces - number_of_track_runs',
    description: 'One splice between each pair of adjacent track pieces in a continuous run. A "run" is one side with tracking.',
    editableParams: [],
    exampleFn: () => 'Example: 15 pieces across 3 sides → 15 - 3 = 12 splices',
  },
  track_endcaps: {
    label: 'Track End Caps',
    formula: 'number_of_track_runs × per_run',
    description: 'Caps at each end of a continuous track run.',
    editableParams: [
      { key: 'per_run', label: 'Per Run', description: 'Number of end caps per track run (typically 2)' },
    ],
    exampleFn: (params) => {
      const perRun = Number(params.per_run) || 2
      return `Example: 3 sides with tracking → 3 × ${perRun} = ${3 * perRun} end caps`
    },
  },
  per_snap_edge: {
    label: 'Per Snap Edge',
    formula: 'count of edges with marine_snaps attachment',
    description: 'One pack of snaps per panel edge that uses marine snap attachment.',
    editableParams: [],
    exampleFn: () => 'Example: 4 panels, each with snaps on both sides → 8 packs',
  },
  per_doorway_count: {
    label: 'Per Doorway',
    formula: 'number_of_doorways × per_doorway',
    description: 'A fixed count of this item per magnetic doorway. A doorway is formed where two panels meet with magnetic_door split.',
    editableParams: [
      { key: 'per_doorway', label: 'Per Doorway', description: 'How many of this item per magnetic doorway' },
    ],
    exampleFn: (params) => {
      const per = Number(params.per_doorway) || 1
      return `Example: 2 doorways → 2 × ${per} = ${2 * per} items`
    },
  },
  per_stucco_edge: {
    label: 'Per Stucco Edge',
    formula: 'count of edges with stucco_strip attachment',
    description: 'One strip per panel edge that uses stucco strip attachment.',
    editableParams: [],
    exampleFn: () => 'Example: 3 panels with stucco on left side → 3 strips',
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

function AddItemModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (item: Partial<HardwareItem>) => void
}) {
  const [itemKey, setItemKey] = useState('')
  const [category, setCategory] = useState('track')
  const [productSku, setProductSku] = useState('')
  const [name, setName] = useState('')
  const [unitLabel, setUnitLabel] = useState('each')
  const [calcRule, setCalcRule] = useState('fixed_quantity')
  const [descriptionTemplate, setDescriptionTemplate] = useState('')

  if (!open) return null

  const ruleInfo = CALC_RULES[calcRule]

  const handleSubmit = () => {
    if (!itemKey.trim() || !name.trim()) return
    // Build default calc_params from the rule's editable params
    const defaultParams: Record<string, number> = {}
    if (ruleInfo) {
      for (const p of ruleInfo.editableParams) {
        defaultParams[p.key] = p.key === 'piece_length_inches' ? 84 : p.key === 'per_run' ? 2 : 1
      }
    }
    onAdd({
      item_key: itemKey.trim(),
      category,
      product_sku: productSku.trim() || null,
      name: name.trim(),
      description_template: descriptionTemplate.trim() || null,
      unit_label: unitLabel,
      calc_rule: calcRule,
      calc_params: defaultParams,
      color_match: null,
      sort_order: 100,
      active: true,
      admin_notes: null,
    })
    setItemKey('')
    setName('')
    setProductSku('')
    setDescriptionTemplate('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <Heading level={3} className="!mb-4">Add Recommendation Rule</Heading>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Item Key (unique ID)</label>
              <input type="text" value={itemKey} onChange={e => setItemKey(e.target.value)} placeholder="e.g. track_heavy_straight" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Product SKU (from /admin/pricing)</label>
              <input type="text" value={productSku} onChange={e => setProductSku(e.target.value)} placeholder="e.g. track_standard_straight" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Display Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Heavy Track (8ft)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Calculation Rule</label>
              <select value={calcRule} onChange={e => setCalcRule(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]">
                {Object.entries(CALC_RULES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {ruleInfo && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <div className="font-mono text-gray-700 mb-1">{ruleInfo.formula}</div>
              <div className="text-gray-500">{ruleInfo.description}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Unit Label</label>
              <input type="text" value={unitLabel} onChange={e => setUnitLabel(e.target.value)} placeholder="each, pcs, packs..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description Template</label>
              <input type="text" value={descriptionTemplate} onChange={e => setDescriptionTemplate(e.target.value)} placeholder="{pieces} piece(s) for ~{total_feet}ft" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!itemKey.trim() || !name.trim()}>
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

function ItemRow({ item, editMode, editedValues, onFieldChange }: {
  item: HardwareItem
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

  // Update a single param inside calc_params
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
        {/* Name + rule + example */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Text className="font-semibold text-gray-900 !mb-0 text-sm">{item.name}</Text>
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
          {/* Example calculation */}
          {exampleText && (
            <div className="mt-1 text-xs text-gray-500 italic">{exampleText}</div>
          )}
        </div>

        {/* Product SKU */}
        <div className="text-right shrink-0">
          {item.product_sku && (
            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              {item.product_sku}
            </span>
          )}
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

              {/* Editable parameters — the main thing on this page */}
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

          {/* Other fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Item Key</label>
                <Text className="text-gray-600 !mb-0 font-mono text-xs">{item.item_key}</Text>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Display Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={getVal('name', item.name)}
                    onChange={e => onFieldChange(item.id, 'name', e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0">{item.name}</Text>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description Template</label>
                {editMode ? (
                  <input
                    type="text"
                    value={getVal('description_template', item.description_template || '')}
                    onChange={e => onFieldChange(item.id, 'description_template', e.target.value || null)}
                    onClick={e => e.stopPropagation()}
                    placeholder="e.g. {pieces} piece(s) for ~{total_feet}ft"
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 font-mono text-xs">{item.description_template || '—'}</Text>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Product SKU</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={getVal('product_sku', item.product_sku || '')}
                      onChange={e => onFieldChange(item.id, 'product_sku', e.target.value || null)}
                      onClick={e => e.stopPropagation()}
                      placeholder="SKU from products table"
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0 font-mono text-xs">{item.product_sku || '—'}</Text>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Unit Label</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={getVal('unit_label', item.unit_label)}
                      onChange={e => onFieldChange(item.id, 'unit_label', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0">{item.unit_label}</Text>
                  )}
                </div>
              </div>

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
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Admin Notes</label>
                {editMode ? (
                  <input
                    type="text"
                    value={getVal('admin_notes', item.admin_notes || '')}
                    onChange={e => onFieldChange(item.id, 'admin_notes', e.target.value || null)}
                    onClick={e => e.stopPropagation()}
                    placeholder="Internal notes..."
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-400 !mb-0 text-xs italic">{item.admin_notes || '—'}</Text>
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedValues, setEditedValues] = useState<Record<string, unknown>>({})
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/diy-hardware')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to fetch')
      setItems(result.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hardware rules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

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
      await fetchItems()
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
      await fetchItems()
      setSuccess('Rule added')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    }
  }

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Delete rule "${name}"? This cannot be undone.`)) return
    try {
      setError(null)
      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to delete')
      await fetchItems()
      setSuccess('Rule deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const itemsByCategory = CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.id).sort((a, b) => a.sort_order - b.sort_order),
  }))

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
                  {items.filter(i => i.active).length} active rules across {CATEGORIES.length} categories
                  {' '}&middot;{' '}
                  Quantities auto-calculated from panel configuration
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" onClick={fetchItems} disabled={loading}>
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
            Each rule defines a hardware item that gets recommended based on the customer&apos;s panel
            configuration. The <strong>calculation rule</strong> determines the quantity formula, and
            the <strong>parameters</strong> let you tune the numbers. Pricing comes from the products
            table (managed at{' '}
            <Link href="/admin/pricing" className="text-[#406517] font-semibold hover:underline">/admin/pricing</Link>
            ) via the product SKU link.
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

        {/* Category cards */}
        {itemsByCategory.map(category => {
          const Icon = category.icon
          if (category.items.length === 0 && !editMode) return null

          return (
            <Card key={category.id} variant="elevated" className="!p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div>
                    <Heading level={2} className="!mb-0">{category.title}</Heading>
                    <Text size="sm" className="text-gray-400 !mb-0">{category.subtitle}</Text>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {category.items.filter(i => i.active).length} / {category.items.length} active
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                {category.items.map(item => (
                  <div key={item.id} className="relative group">
                    <ItemRow
                      item={item}
                      editMode={editMode}
                      editedValues={editedValues}
                      onFieldChange={handleFieldChange}
                    />
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="absolute top-3 right-28 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}

                {category.items.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No rules in this category.
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

        <div className="h-8" />
      </Stack>

      <AddItemModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />
    </Container>
  )
}
