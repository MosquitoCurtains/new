'use client'

/**
 * PillSelector — Horizontal pill-button option selector.
 * 
 * Used for: mesh types, roll sizes, ply options, track weight, purchase type, etc.
 * Renders a row of pill-shaped buttons. Selected pill is highlighted.
 */

import { cn } from '@/lib/utils'

export interface PillOption {
  value: string
  label: string
  sublabel?: string
  disabled?: boolean
}

interface PillSelectorProps {
  options: PillOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function PillSelector({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: PillSelectorProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && onChange(option.value)}
              disabled={option.disabled}
              className={cn(
                'rounded-full font-medium transition-all duration-200 border-2 whitespace-nowrap',
                sizeClasses[size],
                isSelected
                  ? 'bg-[#003365] text-white border-[#003365] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#003365]/40 hover:text-[#003365]',
                option.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span>{option.label}</span>
              {option.sublabel && (
                <span className={cn(
                  'ml-1.5',
                  isSelected ? 'text-white/70' : 'text-gray-400'
                )}>
                  {option.sublabel}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
