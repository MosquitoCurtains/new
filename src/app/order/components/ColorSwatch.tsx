'use client'

/**
 * ColorSwatch — Visual color circle selector.
 *
 * Used for: mesh color, canvas color, track color, velcro color, etc.
 * Renders a row of color circles. Selected circle has a ring.
 */

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColorOption {
  value: string
  label: string
  /** CSS color value (hex, named, etc.) */
  color: string
  /** Optional image URL for textured colors */
  imageUrl?: string
}

interface ColorSwatchProps {
  options: ColorOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Map common color names to hex values for display
 */
const COLOR_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#ffffff',
  ivory: '#fffff0',
  silver: '#c0c0c0',
  gray: '#808080',
  olive: '#556b2f',
  'olive green': '#556b2f',
}

function getColorHex(color: string): string {
  return COLOR_MAP[color.toLowerCase()] || color
}

export default function ColorSwatch({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: ColorSwatchProps) {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const checkSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = value === option.value
          const colorHex = getColorHex(option.color)
          const isLight = colorHex === '#ffffff' || colorHex === '#fffff0'

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'group relative flex flex-col items-center gap-1.5'
              )}
              title={option.label}
            >
              <div
                className={cn(
                  'rounded-full transition-all duration-200 flex items-center justify-center',
                  sizeMap[size],
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#003365] scale-110'
                    : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-[#003365]/40 hover:scale-105',
                  isLight && 'ring-gray-300'
                )}
                style={{
                  backgroundColor: option.imageUrl ? undefined : colorHex,
                  backgroundImage: option.imageUrl ? `url(${option.imageUrl})` : undefined,
                  backgroundSize: 'cover',
                }}
              >
                {isSelected && (
                  <Check
                    className={cn(
                      checkSize[size],
                      isLight ? 'text-gray-800' : 'text-white'
                    )}
                    strokeWidth={3}
                  />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                isSelected ? 'text-[#003365]' : 'text-gray-500'
              )}>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
