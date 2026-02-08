'use client'

/**
 * DimensionTable — Add/remove rows with dimension inputs + live price per row.
 *
 * Used for: Mesh panels, Clear vinyl panels, Roll-up shades.
 * Each row has width (ft + in) + height (in) inputs with a live per-row price.
 */

import { Plus, Trash2 } from 'lucide-react'
import { Button, Text } from '@/lib/design-system'
import LivePriceDisplay from './LivePriceDisplay'

// =============================================================================
// TYPES
// =============================================================================

export interface DimensionRow {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

interface DimensionTableProps {
  rows: DimensionRow[]
  onUpdateRow: (id: string, field: keyof DimensionRow, value: number | undefined) => void
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  /** Returns the price for a given row. Called for each row on every render. */
  calculateRowPrice: (row: DimensionRow) => number
  /** Label for the height column, e.g. "Height (in)" or "Drop (in)" */
  heightLabel?: string
  /** Show width inches column? Default true */
  showWidthInches?: boolean
  /** Max rows allowed */
  maxRows?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DimensionTable({
  rows,
  onUpdateRow,
  onAddRow,
  onRemoveRow,
  calculateRowPrice,
  heightLabel = 'Height (in)',
  showWidthInches = true,
  maxRows = 20,
}: DimensionTableProps) {
  const totalPrice = rows.reduce((sum, row) => sum + calculateRowPrice(row), 0)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <span>Width (ft)</span>
        {showWidthInches && <span>+ Inches</span>}
        <span>{heightLabel}</span>
        <span className="w-24 text-right">Price</span>
        <span className="w-8" />
      </div>

      {/* Rows */}
      {rows.map((row, idx) => {
        const rowPrice = calculateRowPrice(row)
        return (
          <div
            key={row.id}
            className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 items-center p-3 bg-gray-50 rounded-xl"
          >
            {/* Width Feet */}
            <div>
              <label className="md:hidden text-xs text-gray-500 mb-1 block">Width (ft)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={row.widthFeet ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                  onUpdateRow(row.id, 'widthFeet', v)
                }}
                placeholder="ft"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-medium focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20 outline-none"
              />
            </div>

            {/* Width Inches */}
            {showWidthInches && (
              <div>
                <label className="md:hidden text-xs text-gray-500 mb-1 block">+ Inches</label>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={row.widthInches ?? ''}
                  onChange={(e) => {
                    const v = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                    onUpdateRow(row.id, 'widthInches', v)
                  }}
                  placeholder="in"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-medium focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20 outline-none"
                />
              </div>
            )}

            {/* Height */}
            <div>
              <label className="md:hidden text-xs text-gray-500 mb-1 block">{heightLabel}</label>
              <input
                type="number"
                min={1}
                max={240}
                value={row.heightInches ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                  onUpdateRow(row.id, 'heightInches', v)
                }}
                placeholder="inches"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-medium focus:border-[#003365] focus:ring-1 focus:ring-[#003365]/20 outline-none"
              />
            </div>

            {/* Row Price */}
            <div className="w-24 text-right">
              <span className={`text-sm font-bold tabular-nums ${rowPrice > 0 ? 'text-[#406517]' : 'text-gray-300'}`}>
                ${rowPrice.toFixed(2)}
              </span>
            </div>

            {/* Remove */}
            <div className="w-8 flex justify-center">
              {rows.length > 1 && (
                <button
                  onClick={() => onRemoveRow(row.id)}
                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}

      {/* Add Row + Total */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRow}
          disabled={rows.length >= maxRows}
          className="!text-[#003365]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Panel
        </Button>
        <LivePriceDisplay
          price={totalPrice}
          dimmed={totalPrice === 0}
          size="md"
          label="Total:"
        />
      </div>
    </div>
  )
}
