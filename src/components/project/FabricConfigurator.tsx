'use client'

/**
 * FabricConfigurator Component
 * 
 * Simple configurator for raw mesh fabric orders.
 * Width x Length by the yard with live pricing.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useMemo, useEffect } from 'react'
import { ShoppingCart, Calculator, Scissors, Ruler, Info, Check } from 'lucide-react'
import { Card, Grid, Stack, Heading, Text, Button, Badge } from '@/lib/design-system'
import type { MeshType, MeshColor } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface FabricOrder {
  fabricType: MeshType
  color: MeshColor
  widthFeet: number
  lengthYards: number
  notes: string
}

interface FabricConfiguratorProps {
  initialFabricType?: MeshType
  initialColor?: MeshColor
  onAddToCart: (order: FabricOrder, price: number) => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

const FABRIC_TYPES = [
  { 
    id: 'heavy_mosquito' as const, 
    label: 'Heavy Mosquito Netting', 
    pricePerSqYard: 8.50,
    description: 'Standard insect protection, most popular',
    maxWidth: 12,
    popular: true,
  },
  { 
    id: 'no_see_um' as const, 
    label: 'No-See-Um Mesh', 
    pricePerSqYard: 10.00,
    description: 'Finer weave for tiny insects',
    maxWidth: 12,
  },
  { 
    id: 'shade' as const, 
    label: 'Shade Mesh', 
    pricePerSqYard: 9.50,
    description: '70% UV block, privacy + breeze',
    maxWidth: 12,
  },
  { 
    id: 'theater_scrim' as const, 
    label: 'Theater Scrim', 
    pricePerSqYard: 12.00,
    description: 'Projection screens, stage backdrops',
    maxWidth: 30, // Theater scrim comes wider
  },
]

const FABRIC_COLORS: { id: MeshColor; label: string; hex: string; popular?: boolean }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a', popular: true },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
  { id: 'silver', label: 'Silver', hex: '#C0C0C0' },
]

const WIDTH_OPTIONS = [
  { feet: 4, label: "4 ft" },
  { feet: 6, label: "6 ft" },
  { feet: 8, label: "8 ft" },
  { feet: 10, label: "10 ft" },
  { feet: 12, label: "12 ft (max)" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function FabricConfigurator({ 
  initialFabricType = 'heavy_mosquito',
  initialColor = 'black',
  onAddToCart 
}: FabricConfiguratorProps) {
  const [fabricType, setFabricType] = useState<MeshType>(initialFabricType)
  const [color, setColor] = useState<MeshColor>(initialColor)
  const [widthFeet, setWidthFeet] = useState(8)
  const [lengthYards, setLengthYards] = useState(5)
  const [notes, setNotes] = useState('')

  const selectedFabric = FABRIC_TYPES.find(f => f.id === fabricType) || FABRIC_TYPES[0]
  const availableColors = useMemo<MeshColor[]>(() => {
    switch (fabricType) {
      case 'heavy_mosquito':
        return ['black', 'white', 'ivory']
      case 'no_see_um':
        return ['black', 'white']
      case 'shade':
        return ['black', 'white']
      case 'theater_scrim':
        return ['white', 'silver']
      case 'scrim':
        return ['white', 'silver']
      default:
        return ['black', 'white']
    }
  }, [fabricType])

  useEffect(() => {
    if (!availableColors.includes(color)) {
      setColor(availableColors[0] || 'black')
    }
  }, [availableColors, color])

  // Calculate price
  const pricing = useMemo(() => {
    const sqYards = (widthFeet / 3) * lengthYards // Convert width to yards
    const subtotal = sqYards * selectedFabric.pricePerSqYard
    return {
      sqYards: sqYards.toFixed(1),
      subtotal: subtotal.toFixed(2),
    }
  }, [widthFeet, lengthYards, selectedFabric])

  const handleAddToCart = () => {
    onAddToCart(
      { fabricType, color, widthFeet, lengthYards, notes },
      parseFloat(pricing.subtotal)
    )
  }

  return (
    <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
      {/* Configuration Area */}
      <div className="lg:col-span-2">
        <Stack gap="lg">
          {/* Fabric Type Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-[#B30158]" />
              <Heading level={3} className="!mb-0">Select Fabric Type</Heading>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {FABRIC_TYPES.map((fabric) => (
                <button
                  key={fabric.id}
                  onClick={() => setFabricType(fabric.id)}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    fabricType === fabric.id
                      ? 'border-[#B30158] bg-[#B30158]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{fabric.label}</span>
                        {fabric.popular && (
                          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Popular</Badge>
                        )}
                      </div>
                      <Text size="sm" className="text-gray-500 !mb-0 mt-1">{fabric.description}</Text>
                      <Text size="sm" className="text-[#B30158] font-medium !mb-0 mt-2">
                        ${fabric.pricePerSqYard.toFixed(2)}/sq yard
                      </Text>
                    </div>
                    {fabricType === fabric.id && <Check className="w-5 h-5 text-[#B30158]" />}
                  </div>
                </button>
              ))}
            </Grid>
          </div>

          {/* Color Selection */}
          <Card variant="elevated" className="!p-5">
            <Heading level={4} className="!mb-4">Fabric Color</Heading>
            <div className="flex flex-wrap gap-3">
              {FABRIC_COLORS.filter(c => availableColors.includes(c.id)).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    color === c.id
                      ? 'ring-2 ring-[#B30158] bg-[#B30158]/5'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded-full border border-gray-300" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span className="text-gray-700">{c.label}</span>
                  {c.popular && color !== c.id && (
                    <span className="text-xs bg-[#B30158]/20 text-[#B30158] px-1.5 py-0.5 rounded-full">90%</span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Dimensions */}
          <Card variant="elevated" className="!p-5">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-[#B30158]" />
              <Heading level={4} className="!mb-0">Dimensions</Heading>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              {/* Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Width (up to {selectedFabric.maxWidth}ft)
                </label>
                <div className="flex flex-wrap gap-2">
                  {WIDTH_OPTIONS.filter(w => w.feet <= selectedFabric.maxWidth).map((w) => (
                    <button
                      key={w.feet}
                      onClick={() => setWidthFeet(w.feet)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        widthFeet === w.feet
                          ? 'bg-[#B30158] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Custom width (feet)</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedFabric.maxWidth}
                    value={widthFeet}
                    onChange={(e) => setWidthFeet(Math.min(selectedFabric.maxWidth, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#B30158]/20"
                  />
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Length (yards)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLengthYards(Math.max(1, lengthYards - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={lengthYards}
                    onChange={(e) => setLengthYards(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center text-lg font-medium focus:ring-2 focus:ring-[#B30158]/20"
                  />
                  <button
                    onClick={() => setLengthYards(lengthYards + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                  <span className="text-gray-500">yards</span>
                </div>
                <Text size="sm" className="text-gray-500 mt-2">
                  = {(lengthYards * 3).toFixed(0)} feet total length
                </Text>
              </div>
            </Grid>
          </Card>

          {/* Notes */}
          <Card variant="elevated" className="!p-5">
            <Heading level={4} className="!mb-3">Special Instructions (Optional)</Heading>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements? Custom cuts, specific roll size, etc."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#B30158]/20 resize-none"
            />
          </Card>

          {/* Info Card */}
          <Card variant="outlined" className="!p-4 !bg-[#B30158]/5 !border-[#B30158]/20">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-[#B30158] flex-shrink-0 mt-0.5" />
              <div>
                <Text size="sm" className="text-gray-700 !mb-2">
                  <strong>Raw fabric ships on a roll.</strong> Perfect for:
                </Text>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Custom DIY enclosures & projects</li>
                  <li>Agricultural netting (greenhouses, farms)</li>
                  <li>HVAC & industrial filtration</li>
                  <li>Theater scrims & stage backdrops</li>
                  <li>Replacement for existing frames</li>
                </ul>
              </div>
            </div>
          </Card>
        </Stack>
      </div>

      {/* Price Summary Sidebar */}
      <div>
        <div className="sticky top-4">
          <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-[#B30158]/5 !via-white !to-[#406517]/5 !border-[#B30158]/20">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-[#B30158]" />
              <Heading level={4} className="!mb-0">Order Summary</Heading>
            </div>

            {/* Visual Preview */}
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <div 
                className="mx-auto border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center"
                style={{
                  width: `${Math.min(100, widthFeet * 8)}%`,
                  height: `${Math.min(120, lengthYards * 15)}px`,
                  backgroundColor: FABRIC_COLORS.find(c => c.id === color)?.hex || '#1a1a1a',
                  opacity: 0.7,
                }}
              >
                <div className="text-center text-white text-xs font-medium drop-shadow-lg">
                  <div>{widthFeet}ft × {lengthYards}yd</div>
                </div>
              </div>
              <Text size="sm" className="text-gray-500 text-center mt-2 !mb-0">
                {selectedFabric.label}
              </Text>
            </div>

            <Stack gap="sm" className="mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fabric</span>
                <span className="font-medium text-gray-900">{selectedFabric.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Color</span>
                <span className="font-medium text-gray-900">
                  {FABRIC_COLORS.find(c => c.id === color)?.label || color}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Size</span>
                <span className="font-medium text-gray-900">{widthFeet}ft × {lengthYards}yd</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coverage</span>
                <span className="font-medium text-gray-900">{pricing.sqYards} sq yards</span>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500 italic">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Subtotal</span>
                  <span className="text-2xl font-bold text-[#B30158]">${pricing.subtotal}</span>
                </div>
              </div>
            </Stack>

            <Button
              variant="primary"
              size="lg"
              className="w-full !bg-[#B30158] hover:!bg-[#8f0146]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </Card>

          {/* Help Card */}
          <Card variant="outlined" className="!p-4 mt-4">
            <Text size="sm" className="text-gray-600 !mb-2">
              Not sure how much you need?
            </Text>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href="tel:7706454745">Call (770) 645-4745</a>
            </Button>
          </Card>
        </div>
      </div>
    </Grid>
  )
}

export default FabricConfigurator
