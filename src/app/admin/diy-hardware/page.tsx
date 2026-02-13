'use client'

/**
 * Admin DIY Hardware Items
 *
 * Manage the hardware recommendation items shown in the DIY Panel Builder's
 * "Track & Attachments" step. Each item has display info, pricing, and
 * calculation parameters that control how quantities are computed.
 *
 * Mirrors the pattern of /admin/instant-quote.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ImageIcon,
} from 'lucide-react'
import { Container, Stack, Card, Heading, Text, Button, Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface HardwareItem {
  id: string
  item_key: string
  category: string
  name: string
  description_template: string | null
  image_url: string | null
  product_url: string | null
  unit_label: string
  unit_price: number
  pack_quantity: number
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
    subtitle: 'Track pieces, splices, and end caps for tracking top attachment',
    icon: SlidersHorizontal,
    color: '#406517',
  },
  {
    id: 'snap',
    title: 'Marine Snaps',
    subtitle: 'Color-matched snap packs for side edges',
    icon: Columns3,
    color: '#003365',
  },
  {
    id: 'magnetic_door',
    title: 'Magnetic Door Hardware',
    subtitle: 'Magnets and fiberglass rods for walk-through doorways',
    icon: Magnet,
    color: '#B30158',
  },
  {
    id: 'stucco',
    title: 'Stucco Strips',
    subtitle: 'Mounting strips for stucco/masonry surfaces',
    icon: Columns3,
    color: '#8B5E3C',
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Installation tools (always recommended)',
    icon: Hammer,
    color: '#555',
  },
]

const CALC_RULE_LABELS: Record<string, string> = {
  track_linear_pieces: 'Linear pieces (ceil of total width / piece length)',
  track_splices: 'Splices (total pieces - number of track runs)',
  track_endcaps: 'End caps (per_run count per continuous track run)',
  per_snap_edge: 'Per snap edge (1 per edge with marine_snaps)',
  per_doorway_count: 'Per doorway (per_doorway count x number of doorways)',
  per_stucco_edge: 'Per stucco edge (1 per edge with stucco_strip)',
  fixed_quantity: 'Fixed quantity (always recommended)',
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
  const [name, setName] = useState('')
  const [unitPrice, setUnitPrice] = useState('0')
  const [unitLabel, setUnitLabel] = useState('each')
  const [calcRule, setCalcRule] = useState('fixed_quantity')
  const [descriptionTemplate, setDescriptionTemplate] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    if (!itemKey.trim() || !name.trim()) return
    onAdd({
      item_key: itemKey.trim(),
      category,
      name: name.trim(),
      description_template: descriptionTemplate.trim() || null,
      unit_label: unitLabel,
      unit_price: parseFloat(unitPrice) || 0,
      pack_quantity: 1,
      calc_rule: calcRule,
      calc_params: calcRule === 'fixed_quantity' ? { quantity: 1 } : {},
      color_match: null,
      sort_order: 100,
      active: true,
      admin_notes: null,
      image_url: null,
      product_url: null,
    })
    // Reset
    setItemKey('')
    setName('')
    setUnitPrice('0')
    setDescriptionTemplate('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <Heading level={3} className="!mb-4">Add Hardware Item</Heading>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Item Key (unique identifier)</label>
            <input type="text" value={itemKey} onChange={e => setItemKey(e.target.value)} placeholder="e.g. track_heavy_straight" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
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
                {Object.entries(CALC_RULE_LABELS).map(([k, v]) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Display Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Heavy Track (8ft)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description Template</label>
            <input type="text" value={descriptionTemplate} onChange={e => setDescriptionTemplate(e.target.value)} placeholder="e.g. {pieces} piece(s) for ~{total_feet}ft" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Unit Price</label>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">$</span>
                <input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Unit Label</label>
              <input type="text" value={unitLabel} onChange={e => setUnitLabel(e.target.value)} placeholder="each, pcs, packs..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!itemKey.trim() || !name.trim()}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// ITEM ROW (expanded view)
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

  const getVal = (field: string, fallback: unknown) => {
    const key = `${field}:${item.id}`
    return editedValues[key] !== undefined ? editedValues[key] : fallback
  }

  return (
    <div className={`${isEdited ? 'bg-amber-50/50' : ''} ${!isActive ? 'opacity-50' : ''}`}>
      {/* Main row */}
      <div className="px-4 py-3 grid grid-cols-[48px_1fr_90px_80px_60px] gap-3 items-center border-b border-gray-100">
        {/* Image */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
          ) : (
            <ImageIcon className="w-4 h-4 text-gray-300" />
          )}
        </div>

        {/* Name + meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {editMode ? (
              <input
                type="text"
                value={getVal('name', item.name) as string}
                onChange={e => onFieldChange(item.id, 'name', e.target.value)}
                className="font-medium text-gray-900 text-sm bg-white border border-gray-200 rounded px-2 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#406517]"
              />
            ) : (
              <Text className="font-medium text-gray-900 !mb-0 text-sm truncate">{item.name}</Text>
            )}
            {!isActive && <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded shrink-0">inactive</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Text size="sm" className="text-gray-400 !mb-0 font-mono text-xs">{item.item_key}</Text>
            <span className="text-[9px] text-gray-400">|</span>
            <Text size="sm" className="text-gray-400 !mb-0 text-xs">{item.calc_rule}</Text>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          {editMode ? (
            <div className="flex items-center gap-1 justify-end">
              <span className="text-gray-400 text-sm">$</span>
              <input
                type="number"
                step="0.01"
                value={getVal('unit_price', item.unit_price) as number}
                onChange={e => onFieldChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#406517]"
              />
            </div>
          ) : (
            <Text className="font-semibold text-gray-900 !mb-0 text-sm">${Number(item.unit_price).toFixed(2)}</Text>
          )}
          <Text size="sm" className="text-gray-400 !mb-0 text-[10px]">per {item.unit_label}</Text>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-center">
          {editMode ? (
            <button
              type="button"
              onClick={() => onFieldChange(item.id, 'active', !isActive)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          ) : (
            isActive ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-300" />
          )}
        </div>

        {/* Expand */}
        <button type="button" onClick={() => setExpanded(!expanded)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Left column */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description Template</label>
                {editMode ? (
                  <input
                    type="text"
                    value={(getVal('description_template', item.description_template) as string) || ''}
                    onChange={e => onFieldChange(item.id, 'description_template', e.target.value || null)}
                    placeholder="e.g. {pieces} piece(s) for ~{total_feet}ft"
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 font-mono text-xs">{item.description_template || '—'}</Text>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                {editMode ? (
                  <input
                    type="text"
                    value={(getVal('image_url', item.image_url) as string) || ''}
                    onChange={e => onFieldChange(item.id, 'image_url', e.target.value || null)}
                    placeholder="https://..."
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 font-mono text-xs truncate">{item.image_url || '—'}</Text>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Product URL</label>
                {editMode ? (
                  <input
                    type="text"
                    value={(getVal('product_url', item.product_url) as string) || ''}
                    onChange={e => onFieldChange(item.id, 'product_url', e.target.value || null)}
                    placeholder="https://..."
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 font-mono text-xs truncate">
                    {item.product_url ? <a href={item.product_url} target="_blank" rel="noopener noreferrer" className="text-[#406517] hover:underline">{item.product_url}</a> : '—'}
                  </Text>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Unit Label</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={(getVal('unit_label', item.unit_label) as string)}
                      onChange={e => onFieldChange(item.id, 'unit_label', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0">{item.unit_label}</Text>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pack Quantity</label>
                  {editMode ? (
                    <input
                      type="number"
                      min={1}
                      value={getVal('pack_quantity', item.pack_quantity) as number}
                      onChange={e => onFieldChange(item.id, 'pack_quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0">{item.pack_quantity}</Text>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={getVal('sort_order', item.sort_order) as number}
                      onChange={e => onFieldChange(item.id, 'sort_order', parseInt(e.target.value) || 0)}
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
                      value={(getVal('color_match', item.color_match) as string) || ''}
                      onChange={e => onFieldChange(item.id, 'color_match', e.target.value || null)}
                      placeholder="null = all colors"
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517]"
                    />
                  ) : (
                    <Text className="text-gray-600 !mb-0 font-mono text-xs">{item.color_match || 'all'}</Text>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Calc Params (JSON)</label>
                {editMode ? (
                  <input
                    type="text"
                    value={JSON.stringify(getVal('calc_params', item.calc_params))}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        onFieldChange(item.id, 'calc_params', parsed)
                      } catch {
                        // Allow invalid JSON while typing — only save valid
                      }
                    }}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#406517]"
                  />
                ) : (
                  <Text className="text-gray-600 !mb-0 font-mono text-xs">{JSON.stringify(item.calc_params)}</Text>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Admin Notes</label>
                {editMode ? (
                  <input
                    type="text"
                    value={(getVal('admin_notes', item.admin_notes) as string) || ''}
                    onChange={e => onFieldChange(item.id, 'admin_notes', e.target.value || null)}
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
// MAIN PAGE COMPONENT
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

  // Fetch items from database
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/diy-hardware')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch hardware items')
      }

      setItems(result.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hardware items')
      console.error('Error fetching DIY hardware items:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Track field changes
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

      // Build updates array
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const colonIdx = key.indexOf(':')
        const field = key.slice(0, colonIdx)
        const id = key.slice(colonIdx + 1)
        return { id, field, value }
      })

      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save changes')
      }

      await fetchItems()

      setEditedValues({})
      setEditMode(false)
      setSuccess(`Successfully updated ${updates.length} field${updates.length > 1 ? 's' : ''}`)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
      console.error('Error saving DIY hardware items:', err)
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
      if (!response.ok) throw new Error(result.error || 'Failed to add item')
      await fetchItems()
      setSuccess('Item added successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    }
  }

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      setError(null)
      const response = await fetch('/api/admin/diy-hardware', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to delete item')
      await fetchItems()
      setSuccess('Item deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  // Group items by category
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
            <Text className="text-gray-500 mt-4 !mb-0">Loading DIY hardware items...</Text>
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
                <Heading level={1} className="!mb-0">DIY Hardware Items</Heading>
                <Text className="text-gray-500 !mb-0">
                  {items.length} item{items.length !== 1 ? 's' : ''} across {CATEGORIES.length} categories
                  {' '}&middot;{' '}
                  <span className="text-green-600">{items.filter(i => i.active).length} active</span>
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
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={saving}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
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
                  Edit Items
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Success Message */}
        {success && (
          <Card variant="outlined" className="!p-4 !bg-green-50 !border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <Text className="text-green-700 !mb-0">{success}</Text>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-red-50 !border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <Text className="text-red-700 !mb-0">{error}</Text>
            </div>
          </Card>
        )}

        {/* Changes Indicator */}
        {editMode && hasChanges && (
          <Card variant="outlined" className="!p-4 !bg-amber-50 !border-amber-200">
            <div className="flex items-center justify-between">
              <Text className="text-amber-800 !mb-0">
                <span className="font-semibold">{changeCount}</span> unsaved change{changeCount > 1 ? 's' : ''}
              </Text>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Discard
              </Button>
            </div>
          </Card>
        )}

        {/* Calculation Rules Reference */}
        <Card variant="outlined" className="!p-4 !bg-gray-50 !border-gray-200">
          <Heading level={4} className="!mb-2 !text-sm text-gray-700">Calculation Rules Reference</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(CALC_RULE_LABELS).map(([key, desc]) => (
              <div key={key} className="flex items-start gap-2">
                <code className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono whitespace-nowrap shrink-0">{key}</code>
                <Text size="xs" className="text-gray-500 !mb-0">{desc}</Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Hardware Categories */}
        {itemsByCategory.map(category => {
          const Icon = category.icon
          if (category.items.length === 0 && !editMode) return null

          return (
            <Card key={category.id} variant="elevated" className="!p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div>
                    <Heading level={2} className="!mb-0">{category.title}</Heading>
                    <Text size="sm" className="text-gray-400 !mb-0">{category.subtitle}</Text>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium">{category.items.length} item{category.items.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 grid grid-cols-[48px_1fr_90px_80px_60px] gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <div />
                  <div>Product</div>
                  <div className="text-right">Price</div>
                  <div className="text-center">Active</div>
                  <div />
                </div>

                {/* Rows */}
                {category.items.map(item => (
                  <div key={item.id} className="relative group">
                    <ItemRow
                      item={item}
                      editMode={editMode}
                      editedValues={editedValues}
                      onFieldChange={handleFieldChange}
                    />
                    {/* Delete button (visible in edit mode on hover) */}
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}

                {category.items.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No items in this category.
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

        {/* Bottom Spacing */}
        <div className="h-8" />
      </Stack>

      {/* Add Item Modal */}
      <AddItemModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />
    </Container>
  )
}
