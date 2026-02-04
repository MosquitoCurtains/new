'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../shared-utils'
import { Card } from './Card'

// Mosquito Curtains Light Theme
interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  title?: string
  price: string
  period?: string
  description: string
  features?: string[]
  highlighted?: boolean
  ctaText?: string
  onCtaClick?: () => void
  badge?: string
  icon?: React.ElementType
  iconColor?: string
  selected?: boolean
  variant?: 'default' | 'highlighted' | 'premium' | 'elevated'
  className?: string
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ name, title, price, period = 'month', description, features = [], highlighted = false, ctaText = 'Get Started', onCtaClick, badge, icon: IconComponent, iconColor, selected = false, variant, className = '', ...props }, ref) => {
    const displayName = title || name || 'Plan'
    return (
      <Card
        ref={ref}
        variant={highlighted ? 'elevated' : 'default'}
        className={cn(
          'relative',
          highlighted && 'border-[#406517] shadow-2xl ring-2 ring-[#406517]',
          className
        )}
        {...props}
      >
        {highlighted && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#406517] text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl md:text-5xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-gray-500">/{period}</span>}
          </div>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <Check className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onCtaClick}
          className={cn(
            'w-full py-3 rounded-full font-semibold transition-all duration-200',
            highlighted
              ? 'bg-[#406517] text-white hover:bg-[#365512]'
              : 'bg-transparent border-2 border-[#406517] text-[#406517] hover:bg-[#406517] hover:text-white'
          )}
        >
          {ctaText}
        </button>
      </Card>
    )
  }
)
PricingCard.displayName = 'PricingCard'
