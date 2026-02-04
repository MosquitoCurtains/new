'use client'

/**
 * ModeSelector Component
 * 
 * Landing page for the Start Project wizard showing three modes:
 * 1. Planner Mode - Contact us with photos (salesperson assistance)
 * 2. Instant Quote Mode - Quick estimate calculator
 * 3. DIY Builder Mode - Full panel-by-panel configuration
 */

import { useState } from 'react'
import { 
  MessageSquare, 
  Calculator, 
  Hammer,
  ArrowRight,
  Check,
  Camera,
  Clock,
  DollarSign,
  Ruler,
  Palette,
  ShoppingCart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export type ProjectMode = 'planner' | 'quote' | 'diy'

interface ModeSelectorProps {
  onSelectMode: (mode: ProjectMode) => void
  className?: string
}

interface ModeCardProps {
  mode: ProjectMode
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  badge?: string
  badgeColor?: string
  isSelected: boolean
  onSelect: () => void
}

// =============================================================================
// MODE CARD COMPONENT
// =============================================================================

function ModeCard({
  mode,
  title,
  description,
  icon,
  features,
  badge,
  badgeColor = 'bg-primary',
  isSelected,
  onSelect,
}: ModeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative text-left p-6 rounded-2xl border-2 transition-all duration-300',
        'hover:transform hover:-translate-y-1',
        isSelected
          ? 'border-primary bg-primary/10 ring-4 ring-primary/20'
          : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
      )}
    >
      {/* Badge */}
      {badge && (
        <span className={cn(
          'absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full text-white',
          badgeColor
        )}>
          {badge}
        </span>
      )}

      {/* Selection Indicator */}
      <div className={cn(
        'absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
        isSelected
          ? 'border-primary bg-primary'
          : 'border-gray-600 bg-transparent'
      )}>
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
        isSelected ? 'bg-primary/20' : 'bg-gray-800'
      )}>
        <div className={cn(
          'w-7 h-7',
          isSelected ? 'text-primary' : 'text-gray-400'
        )}>
          {icon}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className={cn(
        'text-xl font-bold mb-2',
        isSelected ? 'text-primary' : 'text-white'
      )}>
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ModeSelector({ onSelectMode, className }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<ProjectMode | null>(null)

  const handleContinue = () => {
    if (selectedMode) {
      onSelectMode(selectedMode)
    }
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          How Would You Like to Start?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose the approach that works best for you. Whether you want expert guidance, 
          a quick estimate, or to build it yourself — we&apos;ve got you covered.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Planner Mode */}
        <ModeCard
          mode="planner"
          title="Talk to an Expert"
          description="Share photos and measurements. Our team will create a custom quote for you."
          icon={<MessageSquare className="w-full h-full" />}
          features={[
            'Upload photos of your space',
            'Get personalized recommendations',
            'Expert reviews your project',
            'Custom quote within 24-48 hours',
          ]}
          badge="Most Personal"
          badgeColor="bg-purple-500"
          isSelected={selectedMode === 'planner'}
          onSelect={() => setSelectedMode('planner')}
        />

        {/* Instant Quote Mode */}
        <ModeCard
          mode="quote"
          title="Instant Quote"
          description="Answer a few questions and get an instant price estimate for your project."
          icon={<Calculator className="w-full h-full" />}
          features={[
            'Quick 5-minute process',
            'Instant price estimate',
            'Save quote to email',
            'Easy to adjust options',
          ]}
          badge="Fastest"
          badgeColor="bg-teal-500"
          isSelected={selectedMode === 'quote'}
          onSelect={() => setSelectedMode('quote')}
        />

        {/* DIY Builder Mode */}
        <ModeCard
          mode="diy"
          title="DIY Builder"
          description="Configure each panel with exact specifications. Perfect if you know what you need."
          icon={<Hammer className="w-full h-full" />}
          features={[
            'Panel-by-panel configuration',
            'Visual project preview',
            'Full control over specs',
            'Add to cart & checkout',
          ]}
          badge="Most Control"
          badgeColor="bg-orange-500"
          isSelected={selectedMode === 'diy'}
          onSelect={() => setSelectedMode('diy')}
        />
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className={cn(
            'px-8 py-4 rounded-full font-semibold text-lg',
            'flex items-center gap-3 transition-all',
            selectedMode
              ? 'bg-gradient-to-r from-primary to-teal-500 text-white hover:-translate-y-0.5'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          )}
        >
          Continue with {
            selectedMode === 'planner' ? 'Expert Help' :
            selectedMode === 'quote' ? 'Instant Quote' :
            selectedMode === 'diy' ? 'DIY Builder' :
            'Selected Mode'
          }
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Comparison Helper */}
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <h4 className="text-white font-semibold text-center mb-4">Not sure which to choose?</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 rounded-xl bg-gray-900/50">
            <Camera className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-300">Have photos but need guidance?</p>
            <p className="text-purple-400 font-medium">Choose Expert Help</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/50">
            <Clock className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-gray-300">Just need a quick estimate?</p>
            <p className="text-teal-400 font-medium">Choose Instant Quote</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/50">
            <Ruler className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-gray-300">Know your exact measurements?</p>
            <p className="text-orange-400 font-medium">Choose DIY Builder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
