'use client'

/**
 * EmailGate Component
 * 
 * Captures email early in the funnel to enable:
 * 1. Project persistence (retrieve progress later)
 * 2. Abandoned cart recovery
 * 3. Follow-up marketing
 * 4. Journey tracking (links visitor to customer)
 * 
 * Shown before allowing progress in the project wizard.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState } from 'react'
import { Mail, Lock, ArrowRight, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/lib/design-system'
import { useTracking } from '@/components/tracking'

// =============================================================================
// TYPES
// =============================================================================

interface EmailGateProps {
  onSubmit: (data: { email: string; firstName?: string }) => void
  isLoading?: boolean
  className?: string
  variant?: 'modal' | 'inline'
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EmailGate({
  onSubmit,
  isLoading = false,
  className,
  variant = 'inline',
}: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [error, setError] = useState('')
  
  // Journey tracking integration
  const { identify, trackEvent } = useTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address')
      return
    }

    // Identify visitor (link to customer record)
    // This also tracks the email_captured event
    await identify({ 
      email, 
      firstName: firstName || undefined 
    })

    onSubmit({ email, firstName: firstName || undefined })
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className={cn(
      'rounded-2xl border-2 border-gray-200 bg-white p-8',
      variant === 'modal' && 'max-w-md mx-auto shadow-2xl',
      className
    )}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#406517]/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-[#406517]" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Save Your Progress
        </h3>
        
        <p className="text-gray-600">
          Enter your email to save your project. You can return anytime to continue where you left off.
        </p>
      </div>

      {/* Benefits */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Lock className="w-4 h-4 text-[#406517]" />
          <span>No account needed</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Sparkles className="w-4 h-4 text-[#406517]" />
          <span>Get personalized quotes</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors',
              error ? 'border-red-500' : 'border-gray-200'
            )}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
        </div>

        {/* First Name Input (Optional) */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            disabled={isLoading}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] transition-colors'
            )}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full px-6 py-4 rounded-full font-semibold text-white',
            'bg-[#406517] hover:bg-[#4d7a1c]',
            'focus:outline-none focus:ring-4 focus:ring-[#406517]/30',
            'transition-all transform hover:-translate-y-0.5',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
            'flex items-center justify-center gap-2'
          )}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Privacy Note */}
      <p className="text-center text-xs text-gray-500 mt-4">
        We respect your privacy. Your email is only used to save your project progress and send relevant updates.
      </p>
    </div>
  )
}

// =============================================================================
// EMAIL GATE MODAL WRAPPER
// =============================================================================

interface EmailGateModalProps extends EmailGateProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailGateModal({
  isOpen,
  onClose,
  ...props
}: EmailGateModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-md"
        >
          <X className="w-4 h-4" />
        </button>
        <EmailGate {...props} variant="modal" />
      </div>
    </div>
  )
}
