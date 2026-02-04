'use client'

/**
 * HowItWorksTemplate
 * 
 * The 3-step process section (Plan → Receive → Install).
 * Edit this template to update ALL instances across the site.
 * 
 * Usage:
 * ```tsx
 * import { HowItWorksTemplate } from '@/lib/design-system'
 * 
 * <HowItWorksTemplate />
 * ```
 */

import React from 'react'
import Link from 'next/link'
import { Ruler, MessageSquare, Package, Home, ArrowRight } from 'lucide-react'
import { Button } from '../components'

export interface HowItWorksTemplateProps {
  /** Show CTA button (default: true) */
  showCTA?: boolean
}

const STEPS = [
  { 
    num: '1', 
    label: 'Plan', 
    desc: 'Choose options and receive instant quote', 
    icon: MessageSquare, 
    color: '#406517' 
  },
  { 
    num: '2', 
    label: 'Receive', 
    desc: 'Place order and receive custom kit - 3-8 business days', 
    icon: Package, 
    color: '#003365' 
  },
  { 
    num: '3', 
    label: 'Install', 
    desc: 'DIY in an afternoon', 
    icon: Home, 
    color: '#FFA501' 
  },
]

export function HowItWorksTemplate({ showCTA = true }: HowItWorksTemplateProps) {
  return (
    <section>
      <div className="bg-white border-gray-900/20 border-2 rounded-3xl overflow-hidden">
        {/* Full-width Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <span className="text-gray-400 text-sm hidden sm:block">
            3 simple steps to transform your space
          </span>
        </div>
        
        <div className="p-4 md:p-6">
          {/* Horizontal steps - desktop */}
          <div className="hidden md:flex items-center gap-3 mb-4">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-1">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <span className="font-semibold text-gray-900">{step.label}</span>
                  </div>
                  <p className="text-sm text-gray-500 pl-[52px]">{step.desc}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Vertical steps - mobile */}
          <div className="flex md:hidden flex-col items-center gap-2 mb-4">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="w-full bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-900 text-sm block">{step.label}</span>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="h-4 w-px bg-gray-300 relative">
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-300" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* CTA */}
          {showCTA && (
            <div className="flex justify-center">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Free Instant Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
