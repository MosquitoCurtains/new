'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ProjectType {
  name: string
  href: string
  image: string
  description?: string
}

interface ProjectTypeGridProps {
  items: ProjectType[]
  className?: string
}

export function ProjectTypeGrid({ items, className }: ProjectTypeGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6',
      className
    )}>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100"
        >
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
            <h3 className="text-white font-bold text-sm md:text-base text-center">
              {item.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
