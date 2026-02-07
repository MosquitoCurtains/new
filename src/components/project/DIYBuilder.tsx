'use client'

/**
 * DIYBuilder Component
 * 
 * Full panel-by-panel configuration interface with hardware selection.
 * Generates line items ready for cart.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useMemo } from 'react'
import { Plus, ShoppingCart, Calculator, Package, Wrench } from 'lucide-react'
import { Card, Grid, Stack, Heading, Text, Button } from '@/lib/design-system'
import { PanelEditor, PanelConfig } from './PanelEditor'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import { usePricing } from '@/hooks/usePricing'
import type { PricingMap } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface TrackHardware {
  straightTrack: number
  curves90: number
  curves135: number
  splices: number
  endCaps: number
  carriers: number
  trackWeight: 'standard' | 'heavy'
  trackColor: 'white' | 'black'
}

export interface DIYProject {
  panels: PanelConfig[]
  hardware: TrackHardware
  addOns: {
    snapTool: boolean
    magnetDoorway: number
    elasticCords: number
  }
}

interface DIYBuilderProps {
  onAddToCart: (project: DIYProject, totals: ProjectTotals) => void
}

interface ProjectTotals {
  panelsSubtotal: number
  hardwareSubtotal: number
  addOnsSubtotal: number
  subtotal: number
  estimatedShipping: number
  total: number
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createDefaultPanel(): PanelConfig {
  return {
    id: `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    widthFeet: 5,
    widthInches: 0,
    heightInches: 96,
    meshType: 'heavy_mosquito',
    color: 'black',
    topAttachment: 'velcro', // Most popular default
    velcroColor: 'black',
    notes: '',
  }
}

/**
 * Calculate panel price using database-driven pricing.
 */
function calculatePanelPrice(panel: PanelConfig, prices: PricingMap): number {
  return calculateMeshPanelPrice({
    widthFeet: panel.widthFeet,
    widthInches: panel.widthInches,
    heightInches: panel.heightInches,
    meshType: panel.meshType,
    meshColor: panel.color,
    topAttachment: panel.topAttachment,
    velcroColor: panel.velcroColor,
  }, prices).total
}

function calculateHardwarePrice(hardware: TrackHardware): number {
  const isHeavy = hardware.trackWeight === 'heavy'
  const prices = {
    straightTrack: isHeavy ? 42 : 30,
    curve: 25,
    splice: isHeavy ? 5 : 7,
    endCap: isHeavy ? 3 : 1.5,
    carrier: isHeavy ? 1.25 : 0.5,
  }
  return (
    hardware.straightTrack * prices.straightTrack +
    hardware.curves90 * prices.curve +
    hardware.curves135 * prices.curve +
    hardware.splices * prices.splice +
    hardware.endCaps * prices.endCap +
    hardware.carriers * prices.carrier
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DIYBuilder({ onAddToCart }: DIYBuilderProps) {
  const { prices, isLoading: pricingLoading, error: pricingError } = usePricing()
  const [panels, setPanels] = useState<PanelConfig[]>([createDefaultPanel()])
  const [hardware, setHardware] = useState<TrackHardware>({
    straightTrack: 3,
    curves90: 0,
    curves135: 0,
    splices: 2,
    endCaps: 4,
    carriers: 20,
    trackWeight: 'standard',
    trackColor: 'white',
  })
  const [addOns, setAddOns] = useState({
    snapTool: false,
    magnetDoorway: 0,
    elasticCords: 0,
  })

  // Calculate totals
  const totals = useMemo<ProjectTotals>(() => {
    if (!prices) return { panelsSubtotal: 0, hardwareSubtotal: 0, addOnsSubtotal: 0, subtotal: 0, estimatedShipping: 0, total: 0 }
    const panelsSubtotal = panels.reduce((sum, panel) => sum + calculatePanelPrice(panel, prices), 0)
    const hardwareSubtotal = calculateHardwarePrice(hardware)
    const addOnsSubtotal = (addOns.snapTool ? 130 : 0) + (addOns.magnetDoorway * 75)
    const subtotal = panelsSubtotal + hardwareSubtotal + addOnsSubtotal
    const estimatedShipping = 0 // Calculated at checkout
    return { panelsSubtotal, hardwareSubtotal, addOnsSubtotal, subtotal, estimatedShipping, total: subtotal }
  }, [panels, hardware, addOns, prices])

  // Estimate recommended hardware
  const recommendedHardware = useMemo(() => {
    const totalWidth = panels.reduce((sum, p) => sum + p.widthFeet + (p.widthInches / 12), 0)
    return {
      straightTrack: Math.ceil(totalWidth / 7),
      carriers: Math.ceil(totalWidth * 2),
      endCaps: panels.length * 2,
      splices: Math.max(0, Math.ceil(totalWidth / 7) - 1),
    }
  }, [panels])

  const addPanel = () => setPanels([...panels, createDefaultPanel()])
  const updatePanel = (index: number, panel: PanelConfig) => {
    const newPanels = [...panels]
    newPanels[index] = panel
    setPanels(newPanels)
  }
  const removePanel = (index: number) => {
    if (panels.length > 1) {
      setPanels(panels.filter((_, i) => i !== index))
    }
  }

  const applyRecommendedHardware = () => {
    setHardware(prev => ({
      ...prev,
      straightTrack: recommendedHardware.straightTrack,
      carriers: recommendedHardware.carriers,
      endCaps: recommendedHardware.endCaps,
      splices: recommendedHardware.splices,
    }))
  }

  return (
    <Grid responsiveCols={{ mobile: 1, desktop: 3 }} gap="lg">
      {/* Main Configuration Area */}
      <div className="lg:col-span-2">
        <Stack gap="lg">
          {/* Panels Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#406517]" />
                <Heading level={3} className="!mb-0">Your Panels</Heading>
              </div>
              <Button variant="outline" size="sm" onClick={addPanel}>
                <Plus className="w-4 h-4 mr-2" />
                Add Panel
              </Button>
            </div>

            <Stack gap="md">
              {panels.map((panel, index) => (
                <PanelEditor
                  key={panel.id}
                  panel={panel}
                  index={index}
                  onUpdate={(p) => updatePanel(index, p)}
                  onRemove={() => removePanel(index)}
                  calculatedPrice={prices ? calculatePanelPrice(panel, prices) : 0}
                />
              ))}
            </Stack>
          </div>

          {/* Hardware Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#003365]" />
                <Heading level={3} className="!mb-0">Track Hardware</Heading>
              </div>
              <Button variant="ghost" size="sm" onClick={applyRecommendedHardware} className="text-[#003365]">
                Use Recommended
              </Button>
            </div>

            <Card variant="elevated" className="!p-4">
              <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
                {/* Track Weight */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Track Weight</label>
                  <div className="flex gap-2">
                    {(['standard', 'heavy'] as const).map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setHardware({ ...hardware, trackWeight: weight })}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          hardware.trackWeight === weight
                            ? 'bg-[#003365] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {weight === 'standard' ? 'Standard' : 'Heavy Duty'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Color */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Track Color</label>
                  <div className="flex gap-2">
                    {(['white', 'black'] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setHardware({ ...hardware, trackColor: color })}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          hardware.trackColor === color
                            ? 'bg-[#003365] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color === 'white' ? '#f5f5f5' : '#1a1a1a' }}
                          />
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hardware Quantities */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">7ft Track Pieces</label>
                  <input
                    type="number"
                    min={0}
                    value={hardware.straightTrack}
                    onChange={(e) => setHardware({ ...hardware, straightTrack: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#406517]/20"
                  />
                  <Text size="sm" className="text-gray-500 text-center mt-1">Need ~{recommendedHardware.straightTrack}</Text>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">90 Curves</label>
                  <input
                    type="number"
                    min={0}
                    value={hardware.curves90}
                    onChange={(e) => setHardware({ ...hardware, curves90: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#406517]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Splices</label>
                  <input
                    type="number"
                    min={0}
                    value={hardware.splices}
                    onChange={(e) => setHardware({ ...hardware, splices: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#406517]/20"
                  />
                  <Text size="sm" className="text-gray-500 text-center mt-1">Need ~{recommendedHardware.splices}</Text>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Caps</label>
                  <input
                    type="number"
                    min={0}
                    value={hardware.endCaps}
                    onChange={(e) => setHardware({ ...hardware, endCaps: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#406517]/20"
                  />
                  <Text size="sm" className="text-gray-500 text-center mt-1">Need ~{recommendedHardware.endCaps}</Text>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Snap Carriers</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={hardware.carriers}
                    onChange={(e) => setHardware({ ...hardware, carriers: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-center focus:ring-2 focus:ring-[#406517]/20"
                  />
                  <Text size="sm" className="text-gray-500 text-center mt-1">~2 per foot (need ~{recommendedHardware.carriers})</Text>
                </div>
              </Grid>
            </Card>
          </div>

          {/* Add-Ons Section */}
          <div>
            <Heading level={3} className="!mb-4">Recommended Add-Ons</Heading>
            <Card variant="elevated" className="!p-4">
              <Stack gap="md">
                {/* Snap Tool */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <Text className="font-medium text-gray-900 !mb-0">Industrial Snap Tool</Text>
                    <Text size="sm" className="text-gray-500 !mb-0">100% refundable if returned after project</Text>
                  </div>
                  <div className="flex items-center gap-4">
                    <Text className="font-bold text-[#406517] !mb-0">$130.00</Text>
                    <button
                      onClick={() => setAddOns({ ...addOns, snapTool: !addOns.snapTool })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        addOns.snapTool ? 'bg-[#406517]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                        addOns.snapTool ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Magnet Doorway Kits */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <Text className="font-medium text-gray-900 !mb-0">Magnetic Doorway Kit</Text>
                    <Text size="sm" className="text-gray-500 !mb-0">Block magnets + fiberglass rods for walk-through</Text>
                  </div>
                  <div className="flex items-center gap-4">
                    <Text className="font-bold text-[#406517] !mb-0">$75.00 ea</Text>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={addOns.magnetDoorway}
                      onChange={(e) => setAddOns({ ...addOns, magnetDoorway: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-900 text-center"
                    />
                  </div>
                </div>
              </Stack>
            </Card>
          </div>
        </Stack>
      </div>

      {/* Price Summary Sidebar */}
      <div>
        <div className="sticky top-4">
          <Card variant="elevated" className="!p-6 !bg-gradient-to-br !from-[#406517]/5 !via-white !to-[#003365]/5 !border-[#406517]/20">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-[#406517]" />
              <Heading level={4} className="!mb-0">Project Total</Heading>
            </div>

            <Stack gap="sm" className="mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Panels ({panels.length})</span>
                <span className="font-medium text-gray-900">${totals.panelsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Track Hardware</span>
                <span className="font-medium text-gray-900">${totals.hardwareSubtotal.toFixed(2)}</span>
              </div>
              {totals.addOnsSubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Add-Ons</span>
                  <span className="font-medium text-gray-900">${totals.addOnsSubtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500 italic">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Subtotal</span>
                  <span className="text-2xl font-bold text-[#406517]">${totals.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </Stack>

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => onAddToCart({ panels, hardware, addOns }, totals)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>

          {/* Help Card */}
          <Card variant="outlined" className="!p-4 mt-4">
            <Text size="sm" className="text-gray-600 !mb-2">
              Need help with your measurements?
            </Text>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:7706454745">Call (770) 645-4745</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Grid>
  )
}

export default DIYBuilder
