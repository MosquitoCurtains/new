'use client'

/**
 * StepNav — Step navigation bar for the multi-page order flow.
 *
 * Supports 4 flows: MC (mosquito curtains), CV (clear vinyl), RN (raw netting), RU (roll-up shades).
 * MC and CV share the same 3-step flow (panels -> track -> attachments).
 */

import Link from 'next/link'
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react'

type OrderFlow = 'mc' | 'cv' | 'rn' | 'ru'

const FLOWS: Record<OrderFlow, { label: string; href: string }[]> = {
  mc: [
    { label: 'Mesh Panels', href: '/order/mosquito-curtains' },
    { label: 'Track Hardware', href: '/order/track-hardware' },
    { label: 'Attachments', href: '/order/attachments' },
  ],
  cv: [
    { label: 'Clear Vinyl', href: '/order/clear-vinyl' },
    { label: 'Track Hardware', href: '/order/track-hardware' },
    { label: 'Attachments', href: '/order/attachments' },
  ],
  rn: [
    { label: 'Raw Netting', href: '/order/raw-netting' },
    { label: 'Attachment Items', href: '/order/raw-netting-attachments' },
  ],
  ru: [
    { label: 'Roll-Up Shades', href: '/order/roll-up-shades' },
  ],
}

interface StepNavProps {
  flow: OrderFlow
  currentStep: number // 1-based
}

export default function StepNav({ flow, currentStep }: StepNavProps) {
  const steps = FLOWS[flow]

  return (
    <nav className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
      {/* Back to Planning */}
      <Link
        href="/start-project"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#003365] transition-colors whitespace-nowrap"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Planning
      </Link>

      {/* Steps */}
      <div className="flex items-center gap-1">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isCurrent = stepNum === currentStep
          const isCompleted = stepNum < currentStep
          return (
            <Link
              key={step.href}
              href={step.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isCurrent
                  ? 'bg-[#003365] text-white'
                  : isCompleted
                    ? 'bg-[#406517]/10 text-[#406517] hover:bg-[#406517]/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                isCurrent
                  ? 'bg-white/20 text-white'
                  : isCompleted
                    ? 'bg-[#406517]/20 text-[#406517]'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNum}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Checkout */}
      <Link
        href="/cart"
        className="flex items-center gap-1.5 text-sm font-medium text-[#406517] hover:text-[#335112] transition-colors whitespace-nowrap"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Checkout
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </nav>
  )
}
