'use client'

import React from 'react'
import { cn } from '../shared-utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hover = false, className = '', ...props }, ref) => {
    // Mosquito Curtains Light Theme
    const variants = {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white border border-gray-200 shadow-lg',
      outlined: 'bg-transparent border-2 border-gray-300',
      glass: 'bg-white/80 backdrop-blur-lg border border-gray-200/50'
    }
    
    const hoverEffect = hover ? 'hover:border-[#406517] hover:shadow-xl transition-all duration-200' : ''
    
    // Standardized padding: Mobile p-4 (16px), Tablet p-6 (24px), Desktop p-8 (32px)
    return (
      <div 
        ref={ref}
        className={cn('rounded-2xl p-4 md:p-6 lg:p-8', variants[variant], hoverEffect, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'
