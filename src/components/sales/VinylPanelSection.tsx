'use client'

/**
 * Vinyl Panel Section for Sales Page
 * 
 * Mirrors the Mesh Panel section but uses:
 * - VinylPanelSize (short/medium/tall) instead of mesh type
 * - CanvasColor dropdown for medium/tall panels
 * - Door adder and zipper adder toggles
 * - calculateVinylPanelPrice from formulas.ts
 */

import { useState, useMemo } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import type {
  VinylPanelSize,
  CanvasColor,
  VinylTopAttachment,
  VelcroColor,
  PricingMap,
} from '@/lib/pricing/types'
import { calculateVinylPanelPrice } from '@/lib/pricing/formulas'
import type { CartLineItem } from '@/hooks/useCart'

// ─── Types ──────────────────────────────────────────────────────────────────

interface VinylPanelEntry {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
  hasDoor: boolean
  hasZipper: boolean
}

interface VinylPanelSectionProps {
  prices: PricingMap
  onAddToCart: (items: CartLineItem[]) => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PANEL_SIZES: { id: VinylPanelSize; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium (default)' },
  { id: 'tall', label: 'Tall' },
]

const CANVAS_COLORS: { id: CanvasColor; label: string }[] = [
  { id: 'tbd', label: 'To Be Determined' },
  { id: 'ashen_gray', label: 'Ashen Gray' },
  { id: 'burgundy', label: 'Burgundy' },
  { id: 'black', label: 'Black' },
  { id: 'cocoa_brown', label: 'Cocoa Brown' },
  { id: 'clear_top_to_bottom', label: 'Clear Top to Bottom' },
  { id: 'forest_green', label: 'Forest Green' },
  { id: 'moss_green', label: 'Moss Green' },
  { id: 'navy_blue', label: 'Navy Blue' },
  { id: 'royal_blue', label: 'Royal Blue' },
  { id: 'sandy_tan', label: 'Sandy Tan' },
]

const TOP_ATTACHMENTS: { id: VinylTopAttachment; label: string }[] = [
  { id: 'standard_track', label: 'Standard Track (<10ft Tall)' },
  { id: 'heavy_track', label: 'Heavy Track (>10ft Tall)' },
  { id: 'velcro', label: 'Velcro' },
  { id: 'binding_only', label: 'Binding Only' },
  { id: 'special_rigging', label: 'Special Rigging' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function createDefaultEntry(): VinylPanelEntry {
  return {
    id: `vinyl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
    hasDoor: false,
    hasZipper: false,
  }
}

function formatMoney(value: number) {
  return value.toFixed(2)
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function VinylPanelSection({ prices, onAddToCart }: VinylPanelSectionProps) {
  const [panelSize, setPanelSize] = useState<VinylPanelSize>('medium')
  const [canvasColor, setCanvasColor] = useState<CanvasColor>('tbd')
  const [topAttachment, setTopAttachment] = useState<VinylTopAttachment>('standard_track')
  const [velcroColor, setVelcroColor] = useState<VelcroColor>('black')
  const [entries, setEntries] = useState<VinylPanelEntry[]>([createDefaultEntry()])

  const showCanvas = panelSize !== 'short'

  const totals = useMemo(() => {
    const panelTotals = entries.map((entry) =>
      calculateVinylPanelPrice(
        {
          widthFeet: entry.widthFeet ?? 0,
          widthInches: entry.widthInches ?? 0,
          heightInches: entry.heightInches ?? 0,
          panelSize,
          topAttachment,
          canvasColor: showCanvas ? canvasColor : undefined,
          velcroColor: topAttachment === 'velcro' ? velcroColor : undefined,
          hasDoor: entry.hasDoor,
          hasZipper: entry.hasZipper,
        },
        prices
      )
    )
    const subtotal = panelTotals.reduce((sum, t) => sum + t.total, 0)
    return { panelTotals, subtotal }
  }, [entries, panelSize, topAttachment, canvasColor, velcroColor, prices, showCanvas])

  const addEntry = () => setEntries([...entries, createDefaultEntry()])
  const removeEntry = (i: number) => {
    if (entries.length > 1) setEntries(entries.filter((_, idx) => idx !== i))
  }
  const updateEntry = (i: number, patch: Partial<VinylPanelEntry>) => {
    const next = [...entries]
    next[i] = { ...next[i], ...patch }
    setEntries(next)
  }

  const handleAddToCart = () => {
    const items: CartLineItem[] = entries.map((entry, i) => {
      const breakdown = totals.panelTotals[i]
      const totalWidth = (entry.widthFeet ?? 0) + ((entry.widthInches ?? 0) / 12)
      return {
        id: `vinyl_panel-${Date.now()}-${i}`,
        type: 'panel' as const,
        productSku: 'vinyl_panel',
        name: `Clear Vinyl Panel ${i + 1}`,
        description: `${totalWidth.toFixed(1)}ft x ${entry.heightInches ?? 0}in ${panelSize} - ${canvasColor}${entry.hasDoor ? ' +door' : ''}${entry.hasZipper ? ' +zipper' : ''}`,
        quantity: 1,
        unitPrice: breakdown.total,
        totalPrice: breakdown.total,
        options: {
          widthFeet: entry.widthFeet ?? 0,
          widthInches: entry.widthInches ?? 0,
          heightInches: entry.heightInches ?? 0,
          panelSize,
          canvasColor: showCanvas ? canvasColor : 'n/a',
          topAttachment,
          hasDoor: entry.hasDoor,
          hasZipper: entry.hasZipper,
        },
      }
    })
    onAddToCart(items)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Clear Vinyl Panels</h3>

      {/* Options row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Panel size */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Panel Size</label>
          <select
            value={panelSize}
            onChange={(e) => setPanelSize(e.target.value as VinylPanelSize)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
          >
            {PANEL_SIZES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Canvas color (only medium/tall) */}
        {showCanvas && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Canvas Color</label>
            <select
              value={canvasColor}
              onChange={(e) => setCanvasColor(e.target.value as CanvasColor)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
            >
              {CANVAS_COLORS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Top attachment */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Top Attachment</label>
          <select
            value={topAttachment}
            onChange={(e) => setTopAttachment(e.target.value as VinylTopAttachment)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
          >
            {TOP_ATTACHMENTS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Velcro color */}
        {topAttachment === 'velcro' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Velcro Color</label>
            <select
              value={velcroColor}
              onChange={(e) => setVelcroColor(e.target.value as VelcroColor)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
            >
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
        )}
      </div>

      {/* Panel entries */}
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={entry.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <span className="text-xs font-mono text-gray-400 w-6">#{i + 1}</span>
            <input
              type="number"
              placeholder="W ft"
              value={entry.widthFeet ?? ''}
              onChange={(e) => updateEntry(i, { widthFeet: e.target.value ? Number(e.target.value) : undefined })}
              className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm text-center"
              min={0}
            />
            <input
              type="number"
              placeholder="W in"
              value={entry.widthInches ?? ''}
              onChange={(e) => updateEntry(i, { widthInches: e.target.value ? Number(e.target.value) : undefined })}
              className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm text-center"
              min={0}
              max={11}
            />
            <span className="text-xs text-gray-400">x</span>
            <input
              type="number"
              placeholder="H in"
              value={entry.heightInches ?? ''}
              onChange={(e) => updateEntry(i, { heightInches: e.target.value ? Number(e.target.value) : undefined })}
              className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm text-center"
              min={0}
            />
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={entry.hasDoor}
                onChange={(e) => updateEntry(i, { hasDoor: e.target.checked })}
                className="rounded"
              />
              Door
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={entry.hasZipper}
                onChange={(e) => updateEntry(i, { hasZipper: e.target.checked })}
                className="rounded"
              />
              Zipper
            </label>
            <span className="ml-auto text-sm font-semibold text-gray-900">
              ${formatMoney(totals.panelTotals[i]?.total ?? 0)}
            </span>
            <button
              onClick={() => removeEntry(i)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              disabled={entries.length === 1}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add row + subtotal */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-sm text-[#406517] hover:underline font-medium"
        >
          <Plus className="w-4 h-4" /> Add Panel
        </button>
        <div className="text-right">
          <p className="text-xs text-gray-500">Subtotal</p>
          <p className="text-lg font-bold text-gray-900">${formatMoney(totals.subtotal)}</p>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={totals.subtotal === 0}
        className="mt-4 w-full bg-[#406517] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#4e7a1d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add Vinyl Panels to Cart
      </button>
    </div>
  )
}
