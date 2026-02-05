'use client'

/**
 * ModeSelector Component
 * 
 * Mode selection cards for the Start Project wizard:
 * 1. Planner Mode - Contact us with photos (salesperson assistance)
 * 2. Instant Quote Mode - Quick estimate calculator
 * 3. DIY Builder Mode - Full panel-by-panel configuration
 * 
 * Follows Mosquito Curtains Design System patterns.
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
  Ruler,
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
  accentColor: string
  isSelected: boolean
  onSelect: () => void
}

// =============================================================================
// MODE CARD COMPONENT
// =============================================================================

function ModeCard({
  title,
  description,
  icon,
  features,
  badge,
  badgeColor = 'bg-[#406517]',
  accentColor,
  isSelected,
  onSelect,
}: ModeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative text-left p-6 rounded-2xl border-2 transition-all duration-300 bg-white',
        'hover:transform hover:-translate-y-1 hover:shadow-lg',
        isSelected
          ? 'border-[#406517] bg-[#406517]/5 ring-4 ring-[#406517]/20'
          : 'border-gray-200 hover:border-gray-300'
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
          ? 'border-[#406517] bg-[#406517]'
          : 'border-gray-300 bg-transparent'
      )}>
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Icon */}
      <div 
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors',
          isSelected ? '' : 'bg-gray-100'
        )}
        style={{ backgroundColor: isSelected ? `${accentColor}20` : undefined }}
      >
        <div 
          className="w-7 h-7"
          style={{ color: isSelected ? accentColor : '#9CA3AF' }}
        >
          {icon}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className={cn(
        'text-xl font-bold mb-2 transition-colors',
        isSelected ? 'text-[#406517]' : 'text-gray-900'
      )}>
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-[#406517] flex-shrink-0" />
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
    <div className={cn('space-y-6', className)}>
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
          badgeColor="bg-[#B30158]"
          accentColor="#B30158"
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
          badgeColor="bg-[#003365]"
          accentColor="#003365"
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
          badgeColor="bg-[#FFA501]"
          accentColor="#FFA501"
          isSelected={selectedMode === 'diy'}
          onSelect={() => setSelectedMode('diy')}
        />
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className={cn(
            'px-8 py-4 rounded-full font-semibold text-lg',
            'flex items-center gap-3 transition-all',
            selectedMode
              ? 'bg-[#406517] text-white hover:-translate-y-0.5 hover:bg-[#4d7a1c] shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-4">
        <h4 className="text-gray-900 font-semibold text-center mb-4">Not sure which to choose?</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <Camera className="w-6 h-6 text-[#B30158] mx-auto mb-2" />
            <p className="text-gray-700 mb-1">Have photos but need guidance?</p>
            <p className="text-[#B30158] font-semibold">Choose Expert Help</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <Clock className="w-6 h-6 text-[#003365] mx-auto mb-2" />
            <p className="text-gray-700 mb-1">Just need a quick estimate?</p>
            <p className="text-[#003365] font-semibold">Choose Instant Quote</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <Ruler className="w-6 h-6 text-[#FFA501] mx-auto mb-2" />
            <p className="text-gray-700 mb-1">Know your exact measurements?</p>
            <p className="text-[#FFA501] font-semibold">Choose DIY Builder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
