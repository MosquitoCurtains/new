'use client'

/**
 * PanelEditor Component
 * 
 * Individual panel configuration with dimensions, mesh type, color selection.
 * Used in the DIY Builder flow.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState } from 'react'
import { Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Grid, Input, Text, Button } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import type { MeshType, MeshColor, MeshTopAttachment, VelcroColor } from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

export interface PanelConfig {
  id: string
  name: string
  widthFeet: number
  widthInches: number
  heightInches: number
  meshType: MeshType
  color: MeshColor
  topAttachment: MeshTopAttachment
  velcroColor?: VelcroColor
  notes: string
}

interface PanelEditorProps {
  panel: PanelConfig
  index: number
  onUpdate: (panel: PanelConfig) => void
  onRemove: () => void
  calculatedPrice: number
}

// =============================================================================
// CONSTANTS (from Gravity Form 16028 - Mesh Panels)
// =============================================================================

const MESH_TYPES: { id: MeshType; label: string; description: string; pricePerFoot: number; colors: MeshColor[] }[] = [
  { id: 'heavy_mosquito', label: 'Heavy Mosquito', description: 'Most popular - 90% choose this', pricePerFoot: 18, colors: ['black', 'white', 'ivory'] },
  { id: 'no_see_um', label: 'No-See-Um', description: 'Finer mesh for tiny coastal insects', pricePerFoot: 19, colors: ['black', 'white'] },
  { id: 'shade', label: 'Shade Mesh', description: 'Shade + privacy + bugs', pricePerFoot: 20, colors: ['black', 'white'] },
]

const ALL_COLORS: { id: MeshColor; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
]

const TOP_ATTACHMENTS: { id: MeshTopAttachment; label: string; description: string; showsVelcroColor?: boolean }[] = [
  { id: 'standard_track', label: 'Standard Track', description: 'For panels under 10ft tall - slides side-to-side' },
  { id: 'heavy_track', label: 'Heavy Track', description: 'For panels over 10ft tall - extra durability' },
  { id: 'velcro', label: 'Velcro®', description: 'Fixed in place - most affordable', showsVelcroColor: true },
  { id: 'special_rigging', label: 'Special Rigging', description: 'Custom attachment for unique situations' },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function PanelEditor({
  panel,
  index,
  onUpdate,
  onRemove,
  calculatedPrice,
}: PanelEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const totalWidth = panel.widthFeet + (panel.widthInches / 12)
  const sqft = (totalWidth * panel.heightInches / 12).toFixed(1)
  
  // Get available colors based on mesh type
  const selectedMesh = MESH_TYPES.find(m => m.id === panel.meshType)
  const availableColors = ALL_COLORS.filter(c => selectedMesh?.colors.includes(c.id))
  
  // Check if current color is valid for selected mesh type
  const isColorValid = availableColors.some(c => c.id === panel.color)
  
  // Show velcro color option when velcro is selected
  const showVelcroColor = panel.topAttachment === 'velcro'

  return (
    <Card variant="elevated" className="!p-0 overflow-hidden">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <div>
            <Text className="font-semibold text-gray-900 !mb-0">
              Panel {index + 1}: {panel.name || `${totalWidth.toFixed(1)}ft x ${panel.heightInches}in`}
            </Text>
            <Text size="sm" className="text-gray-500 !mb-0">
              {sqft} sq ft | {MESH_TYPES.find(m => m.id === panel.meshType)?.label} | {ALL_COLORS.find(c => c.id === panel.color)?.label}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Text className="font-bold text-[#406517] !mb-0">
            ${calculatedPrice.toFixed(2)}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="!text-red-500 hover:!bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-gray-100">
          {/* Panel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Panel Label (optional)
            </label>
            <Input
              value={panel.name}
              onChange={(e) => onUpdate({ ...panel, name: e.target.value })}
              placeholder="e.g., Front Left, Door Panel"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Panel Width
            </label>
            <Grid responsiveCols={{ mobile: 2 }} gap="sm">
              <div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={panel.widthFeet}
                    onChange={(e) => onUpdate({ ...panel, widthFeet: parseInt(e.target.value) || 0 })}
                  />
                  <Text className="text-gray-500 whitespace-nowrap">feet</Text>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={11}
                    value={panel.widthInches}
                    onChange={(e) => onUpdate({ ...panel, widthInches: parseInt(e.target.value) || 0 })}
                  />
                  <Text className="text-gray-500 whitespace-nowrap">inches</Text>
                </div>
              </div>
            </Grid>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Panel Height (inches)
            </label>
            <Input
              type="number"
              min={24}
              max={240}
              value={panel.heightInches}
              onChange={(e) => onUpdate({ ...panel, heightInches: parseInt(e.target.value) || 0 })}
              className="max-w-[150px]"
            />
            <Text size="sm" className="text-gray-500 mt-1">
              {(panel.heightInches / 12).toFixed(1)} feet
            </Text>
          </div>

          {/* Mesh Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mesh Type
            </label>
            <div className="flex flex-wrap gap-2">
              {MESH_TYPES.map((mesh) => (
                <button
                  key={mesh.id}
                  onClick={() => {
                    // Reset color if not valid for new mesh type
                    const newColor = mesh.colors.includes(panel.color) ? panel.color : mesh.colors[0]
                    onUpdate({ ...panel, meshType: mesh.id, color: newColor })
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    panel.meshType === mesh.id
                      ? 'bg-[#406517] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {mesh.label}
                </button>
              ))}
            </div>
            <Text size="sm" className="text-gray-500 mt-1">
              {selectedMesh?.description}
            </Text>
          </div>

          {/* Color - Only show colors available for selected mesh type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mesh Color
            </label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onUpdate({ ...panel, color: color.id })}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    panel.color === color.id
                      ? 'ring-2 ring-[#406517] bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <div 
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-gray-700">{color.label}</span>
                  {color.id === 'black' && <span className="text-xs text-[#406517] font-medium">90%</span>}
                </button>
              ))}
            </div>
            {panel.meshType !== 'heavy_mosquito' && (
              <Text size="sm" className="text-gray-500 mt-1">
                Ivory is only available with Heavy Mosquito mesh
              </Text>
            )}
          </div>

          {/* Top Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top Attachment
            </label>
            <div className="flex flex-wrap gap-2">
              {TOP_ATTACHMENTS.map((attachment) => (
                <button
                  key={attachment.id}
                  onClick={() => onUpdate({ ...panel, topAttachment: attachment.id, velcroColor: attachment.showsVelcroColor ? (panel.velcroColor || 'black') : undefined })}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    panel.topAttachment === attachment.id
                      ? 'bg-[#003365] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {attachment.label}
                </button>
              ))}
            </div>
            <Text size="sm" className="text-gray-500 mt-1">
              {TOP_ATTACHMENTS.find(a => a.id === panel.topAttachment)?.description}
            </Text>
          </div>

          {/* Velcro Color - Only show when Velcro is selected */}
          {showVelcroColor && (
            <div className="p-4 bg-[#003365]/5 rounded-xl border border-[#003365]/20">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velcro® Color For Mounting Surface
              </label>
              <div className="flex gap-3">
                {(['black', 'white'] as VelcroColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ ...panel, velcroColor: color })}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                      panel.velcroColor === color
                        ? 'ring-2 ring-[#003365] bg-white'
                        : 'bg-white hover:bg-gray-50'
                    )}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color === 'black' ? '#1a1a1a' : '#f5f5f5' }}
                    />
                    <span className="font-medium capitalize">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Notes
            </label>
            <textarea
              value={panel.notes}
              onChange={(e) => onUpdate({ ...panel, notes: e.target.value })}
              placeholder="Any special requirements for this panel..."
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#406517]/20 focus:border-[#406517] resize-none"
              rows={2}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

export default PanelEditor
