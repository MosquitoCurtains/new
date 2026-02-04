'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

interface BenefitRowProps {
  benefits: Benefit[]
  className?: string
}

export function BenefitRow({ benefits, className }: BenefitRowProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8',
      className
    )}>
      {benefits.map((benefit) => (
        <div key={benefit.title} className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#406517]/10 mb-3">
            <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-[#406517]" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
            {benefit.title}
          </h3>
          <p className="text-sm text-gray-600">
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  )
}
