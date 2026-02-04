'use client'

import React from 'react'
import { cn } from '../shared-utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'highlight' | 'ghost' | 'ghost-secondary' | 'ghost-accent' | 'outline' | 'outline-secondary' | 'outline-accent' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  asChild?: boolean
  className?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, asChild = false, className = '', ...props }, ref) => {
    // Mosquito Curtains Light Theme Colors
    // Primary: #406517 (Forest Green)
    // Secondary: #003365 (Navy Blue)
    // Accent: #B30158 (Magenta)
    // Highlight: #FFA501 (Orange)
    
    const variants = {
      primary: `
        bg-[#406517] text-white font-semibold
        border-2 border-transparent
        hover:bg-[#365512] 
        active:bg-[#2C440E]
      `,
      secondary: `
        bg-[#003365] text-white font-semibold
        border-2 border-transparent
        hover:bg-[#002952]
        active:bg-[#001F3F]
      `,
      accent: `
        bg-[#B30158] text-white font-semibold
        border-2 border-transparent
        hover:bg-[#8E0146]
        active:bg-[#6A0135]
      `,
      highlight: `
        bg-[#FFA501] text-gray-900 font-semibold
        border-2 border-transparent
        hover:bg-[#FF8F00]
        active:bg-[#FF6F00]
      `,
      ghost: `
        bg-[#406517]/10 text-[#406517] 
        border-2 border-[#406517]/20
        hover:bg-[#406517]/20
        active:bg-[#406517]/30
      `,
      'ghost-secondary': `
        bg-[#003365]/10 text-[#003365] 
        border-2 border-[#003365]/20
        hover:bg-[#003365]/20
        active:bg-[#003365]/30
      `,
      'ghost-accent': `
        bg-[#B30158]/10 text-[#B30158] 
        border-2 border-[#B30158]/20
        hover:bg-[#B30158]/20
        active:bg-[#B30158]/30
      `,
      outline: `
        bg-transparent border-2 border-[#406517] text-[#406517]
        hover:bg-[#406517] hover:text-white
        active:bg-[#365512]
      `,
      'outline-secondary': `
        bg-transparent border-2 border-[#003365] text-[#003365]
        hover:bg-[#003365] hover:text-white
        active:bg-[#002952]
      `,
      'outline-accent': `
        bg-transparent border-2 border-[#B30158] text-[#B30158]
        hover:bg-[#B30158] hover:text-white
        active:bg-[#8E0146]
      `,
      danger: `
        bg-transparent text-[#DC2626] font-semibold
        border-2 border-[#DC2626]
        hover:bg-[#DC2626] hover:text-white hover:border-transparent
        active:bg-[#B91C1C]
      `,
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm md:text-sm md:px-5 gap-1.5',
      md: 'px-5 py-3 text-sm md:text-sm md:px-7 md:py-3 gap-2',
      lg: 'px-6 py-4 text-sm md:text-base md:px-10 md:py-4 gap-2.5',
      xl: 'px-6 py-4 text-sm md:text-lg md:px-8 md:py-5 gap-3',
    }
    
    const buttonClasses = cn(
      'inline-flex items-center justify-center',
      'rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className
    )

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(buttonClasses, (children as any).props.className),
        disabled: disabled || loading,
        ...props
      })
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.type !== 'submit') {
        e.preventDefault()
        e.stopPropagation()
      }
      props.onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
        onClick={handleClick}
      >
        {loading ? 'Loading...' : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
