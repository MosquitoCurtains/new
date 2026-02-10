'use client'

import { useState } from 'react'
import {
  Card,
  Heading,
  Text,
  Stack,
} from '@/lib/design-system'

type TopAttachment = '' | 'tracking' | 'velcro'
type SideAttachment = '' | 'marine-snaps' | 'magnetic-door' | 'stucco-strip'

/**
 * PanelCalculator - Interactive panel adjustment calculator
 * 
 * Replicates the WordPress calculator found on:
 * - /plan-screen-porch/single-sided-exposure/
 * - /plan-screen-porch/2-sided-exposure/regular-columns-tracking/
 * - /plan-screen-porch/2-sided-exposure/regular-columns-velcro/
 * - /plan-screen-porch/2-sided-exposure/irregular-columns-tracking/
 * - (and all 3-sided, 4-sided equivalents)
 * 
 * Logic:
 * WIDTH:
 * - Automatically add 2 inches regardless of width
 * - Add 1 inch per 10ft (120in) of panel width for relaxed fit (tracking only)
 * - Subtract 1 inch for EACH edge connecting a Stucco Strip
 * - Add 1 inch per panel for EACH edge that will snap to some surface (marine snaps)
 * 
 * HEIGHT:
 * - Tracking: NO height adjustments (1-inch track drop provides floor overlap automatically)
 * - Velcro: Add 2 inches (1 inch overlap on top and bottom for mounting)
 */
export default function PanelCalculator() {
  const [widthInches, setWidthInches] = useState<string>('')
  const [heightInches, setHeightInches] = useState<string>('')
  const [topAttachment, setTopAttachment] = useState<TopAttachment>('')
  const [side1, setSide1] = useState<SideAttachment>('')
  const [side2, setSide2] = useState<SideAttachment>('')

  const width = parseFloat(widthInches) || 0
  const height = parseFloat(heightInches) || 0

  // Calculate final width
  let finalWidth = width
  if (width > 0 && topAttachment && side1 && side2) {
    // Always add 2 inches
    finalWidth += 2

    // Add 1 inch per 10ft of panel width for relaxed fit (tracking only)
    if (topAttachment === 'tracking') {
      finalWidth += Math.floor(width / 120)
    }

    // Side 1 adjustments
    if (side1 === 'stucco-strip') {
      finalWidth -= 1
    } else if (side1 === 'marine-snaps') {
      finalWidth += 1
    }
    // magnetic-door: no width adjustment

    // Side 2 adjustments
    if (side2 === 'stucco-strip') {
      finalWidth -= 1
    } else if (side2 === 'marine-snaps') {
      finalWidth += 1
    }
    // magnetic-door: no width adjustment
  }

  // Calculate final height
  let finalHeight = height
  if (height > 0 && topAttachment) {
    if (topAttachment === 'velcro') {
      finalHeight += 2
    }
    // Tracking: no height adjustment needed
  }

  const isComplete = width > 0 && height > 0 && topAttachment && side1 && side2

  return (
    <Card className="!p-6 !bg-white !border-2 !border-gray-200">
      <Heading level={3} className="!mb-2 text-center">Simple Panel Adjustment Calculator</Heading>
      <Text className="text-sm text-gray-500 text-center !mb-6">
        This simple panel calculator will make your panel adjustments for each panel, one at a time!
        Use this calculator by entering the 5 pieces of information required to adjust your panels. 
        Repeat for each panel larger than a stucco strip.
      </Text>
      <Text className="text-sm text-gray-500 text-center !mb-6 italic">
        NOTE: If the difference between all 4 heights is less than 1.5-inches, just use the tallest of the 4 heights. 
        If the heights differ more than 1.5-inches, call in your order because we will need to taper the slope.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Unadjusted Panel Size */}
        <div className="space-y-4">
          <div className="border-b-2 border-gray-300 pb-2">
            <Text className="font-bold text-sm uppercase tracking-wide text-gray-700 !mb-0">Unadjusted Panel Size</Text>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Width In Inches</label>
            <input
              type="number"
              value={widthInches}
              onChange={(e) => setWidthInches(e.target.value)}
              placeholder="Width (inches)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Height In Inches</label>
            <input
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              placeholder="Height (inches)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
            />
          </div>
        </div>

        {/* Column 2: Side & Top Attachment */}
        <div className="space-y-4">
          <div className="border-b-2 border-gray-300 pb-2">
            <Text className="font-bold text-sm uppercase tracking-wide text-gray-700 !mb-0">Side & Top Attachment</Text>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Top Attachment</label>
            <select
              value={topAttachment}
              onChange={(e) => setTopAttachment(e.target.value as TopAttachment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
            >
              <option value="">Please Select</option>
              <option value="tracking">Tracking</option>
              <option value="velcro">Velcro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Side 1 Attachment Type</label>
            <select
              value={side1}
              onChange={(e) => setSide1(e.target.value as SideAttachment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
            >
              <option value="">Please Select</option>
              <option value="marine-snaps">Marine Snaps</option>
              <option value="magnetic-door">Magnetic Door</option>
              <option value="stucco-strip">Stucco Strip</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Side 2 Attachment Type</label>
            <select
              value={side2}
              onChange={(e) => setSide2(e.target.value as SideAttachment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
            >
              <option value="">Please Select</option>
              <option value="marine-snaps">Marine Snaps</option>
              <option value="magnetic-door">Magnetic Door</option>
              <option value="stucco-strip">Stucco Strip</option>
            </select>
          </div>
        </div>

        {/* Column 3: Final Width & Height */}
        <div className="space-y-4">
          <div className="border-b-2 border-gray-300 pb-2">
            <Text className="font-bold text-sm uppercase tracking-wide text-gray-700 !mb-0">Final Width & Height</Text>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Final Width (Inches)</label>
            <div className={`w-full px-3 py-2 rounded-lg border-2 text-lg font-bold ${isComplete ? 'bg-[#406517]/10 border-[#406517] text-[#406517]' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              {isComplete ? Math.round(finalWidth * 10) / 10 : '--'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Final Height (Inches)</label>
            <div className={`w-full px-3 py-2 rounded-lg border-2 text-lg font-bold ${isComplete ? 'bg-[#406517]/10 border-[#406517] text-[#406517]' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              {isComplete ? Math.round(finalHeight * 10) / 10 : '--'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
