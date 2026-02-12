'use client'

/**
 * Simple header for order pages. Uses the same subtle gradient as
 * PowerHeaderTemplate (home page) — no video, no actions, no CTA.
 */

export interface OrderPageHeaderProps {
  title: string
  subtitle?: string
}

export function OrderPageHeader({ title, subtitle }: OrderPageHeaderProps) {
  return (
    <section className="relative">
      {/* Background blurs — match PowerHeaderTemplate */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
      </div>

      {/* Main container — same gradient and border as PowerHeaderTemplate compact */}
      <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl overflow-hidden">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base md:text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
