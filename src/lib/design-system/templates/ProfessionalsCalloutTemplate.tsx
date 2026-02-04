'use client'

/**
 * ProfessionalsCalloutTemplate
 * 
 * The "For Professionals" callout section.
 * Edit this template to update ALL instances across the site.
 * 
 * Usage:
 * ```tsx
 * import { ProfessionalsCalloutTemplate } from '@/lib/design-system'
 * 
 * <ProfessionalsCalloutTemplate />
 * ```
 */

import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import { Heading, Button } from '../components'

export function ProfessionalsCalloutTemplate() {
  return (
    <section>
      <div className="bg-white border-[#003365]/20 border-2 rounded-3xl overflow-hidden">
        {/* Full-width Header */}
        <div className="bg-[#003365] px-6 py-4 flex items-center gap-3">
          <Users className="w-6 h-6 text-white" />
          <span className="text-white font-semibold text-lg uppercase tracking-wider">
            For Professionals
          </span>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Heading level={2} className="text-gray-900 !mb-2">
                Are you a professional installer?
              </Heading>
              <p className="text-gray-600">
                Find out how to use our modular system to add a new profit center to your business!
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button variant="secondary" asChild>
                <Link href="/professionals">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
