'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../shared-utils'

// Mosquito Curtains Light Theme
interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ label, options, placeholder = 'Select...', value, onChange, error, helperText, disabled = false, className = '' }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)
    const displayValue = selectedOption?.label || placeholder

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
    }

    return (
      <div className={cn('w-full relative', className)} ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full pl-4 pr-12 py-3 rounded-xl border hover:border-[#406517] focus:border-[#406517] focus:outline-none focus:ring-2 focus:ring-[#406517]/20 transition-colors cursor-pointer text-left',
              'bg-white',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-100',
              !selectedOption && 'text-gray-400',
              selectedOption && 'text-gray-900',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300'
            )}
          >
            {displayValue}
          </button>
          
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isOpen && !disabled && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full top-full mt-1 py-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto overscroll-contain">
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-4 py-2 text-left transition-colors',
                      isSelected
                        ? 'bg-[#406517]/10 text-[#406517] font-semibold'
                        : 'text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
