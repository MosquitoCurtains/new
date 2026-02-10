'use client'

/**
 * QuickSetup Component
 * 
 * Rich options selector matching the /options page style.
 * Shows product-specific options with images, descriptions, and conditional logic.
 * 
 * Options based on actual Gravity Forms:
 * - Mesh Panels: mesh_type, mesh_color (conditional), top_attachment, velcro_color
 * - Vinyl Panels: panel_size, canvas_color (conditional), top_attachment, velcro_color
 * - Raw Materials: mesh_type, mesh_color
 */

import { useState, useEffect } from 'react'
import { 
  Palette, 
  Snowflake, 
  Scissors, 
  SlidersHorizontal, 
  Check, 
  Info,
  Play,
} from 'lucide-react'
import {
  Grid,
  Card,
  Heading,
  Text,
  Badge,
  Frame,
  Stack,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'
import type { 
  MeshType, 
  MeshColor, 
  MeshTopAttachment, 
  VelcroColor,
  VinylPanelSize,
  CanvasColor,
  VinylTopAttachment,
} from '@/lib/pricing/types'

// =============================================================================
// TYPES
// =============================================================================

type ProductType = 'mosquito_curtains' | 'clear_vinyl' | 'raw_materials'

export interface MeshOptions {
  meshType: MeshType
  meshColor: MeshColor
  topAttachment: MeshTopAttachment
  velcroColor?: VelcroColor
}

export interface VinylOptions {
  panelSize: VinylPanelSize
  canvasColor?: CanvasColor
  topAttachment: VinylTopAttachment
  velcroColor?: VelcroColor
}

export interface RawMaterialOptions {
  meshType: MeshType
  meshColor: MeshColor
}

export type QuickSetupOptions = MeshOptions | VinylOptions | RawMaterialOptions

interface QuickSetupProps {
  productType: ProductType
  options: QuickSetupOptions
  onChange: (options: QuickSetupOptions) => void
  /** When true, only track + velcro attachment options, no velcro color choice */
  simplifiedAttachments?: boolean
  /** When true, hide the "Choose Your Options" heading (parent provides it) */
  hideHeading?: boolean
}

// =============================================================================
// DATA - MESH PANELS (from Gravity Form 16028)
// =============================================================================

const MESH_TYPES = [
  {
    id: 'heavy_mosquito' as const,
    label: 'Heavy Mosquito Netting',
    subtitle: '90% of customers choose this in Black',
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 18,
    colors: ['black', 'white', 'ivory'] as MeshColor[],
    popular: true,
  },
  {
    id: 'no_see_um' as const,
    label: 'No-See-Um Netting',
    subtitle: 'For tiny biting flies',
    description: 'Finer weave blocks tiny midge flies common near coastal areas.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 19,
    colors: ['black', 'white'] as MeshColor[],
  },
  {
    id: 'shade' as const,
    label: 'Shade Netting',
    subtitle: 'Shade + privacy + bugs',
    description: 'Provides shade, privacy and insect protection. Also works as projection screen.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 20,
    colors: ['black', 'white'] as MeshColor[],
  },
]

const MESH_COLORS: { id: MeshColor; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
  { id: 'silver', label: 'Silver', hex: '#C0C0C0' },
]

const MESH_ATTACHMENTS = [
  {
    id: 'standard_track' as const,
    label: 'Standard Track',
    subtitle: 'Slides side-to-side like elegant drapes',
    description: '',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif',
    isGif: true,
  },
  {
    id: 'heavy_track' as const,
    label: 'Heavy Track',
    subtitle: 'For panels over 10ft tall',
    description: 'Extra durability for larger panels',
  },
  {
    id: 'velcro' as const,
    label: 'Velcro®',
    subtitle: 'Fixed in place, easy to install',
    description: '',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif',
    isGif: true,
    showsVelcroColor: true,
    popular: true,
  },
  {
    id: 'special_rigging' as const,
    label: 'Special Rigging',
    subtitle: 'Custom solutions',
    description: 'For unique mounting situations',
  },
]

// =============================================================================
// DATA - VINYL PANELS (from Gravity Form 16698)
// =============================================================================

const VINYL_PANEL_SIZES = [
  {
    id: 'short' as const,
    label: 'Short',
    description: 'For shorter panels',
    pricePerFoot: 28,
    hasCanvasColor: false,
  },
  {
    id: 'medium' as const,
    label: 'Medium',
    description: 'Standard height panels',
    pricePerFoot: 34,
    hasCanvasColor: true,
    popular: true,
  },
  {
    id: 'tall' as const,
    label: 'Tall',
    description: 'For taller panels',
    pricePerFoot: 41,
    hasCanvasColor: true,
  },
]

const CANVAS_COLORS: { id: CanvasColor; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'ashen_gray', label: 'Ashen Gray', hex: '#B2BEB5' },
  { id: 'sandy_tan', label: 'Sandy Tan', hex: '#D2B48C' },
  { id: 'cocoa_brown', label: 'Cocoa Brown', hex: '#D2691E' },
  { id: 'forest_green', label: 'Forest Green', hex: '#228B22' },
  { id: 'moss_green', label: 'Moss Green', hex: '#8A9A5B' },
  { id: 'navy_blue', label: 'Navy Blue', hex: '#000080' },
  { id: 'royal_blue', label: 'Royal Blue', hex: '#4169E1' },
  { id: 'burgundy', label: 'Burgundy', hex: '#800020' },
  { id: 'clear_top_to_bottom', label: 'Clear (No Border)', hex: '#E8F4F8' },
  { id: 'tbd', label: 'TBD', hex: '#cccccc' },
]

const VINYL_ATTACHMENTS = [
  {
    id: 'standard_track' as const,
    label: 'Standard Track',
    subtitle: 'Slides side-to-side',
    description: '',
  },
  {
    id: 'heavy_track' as const,
    label: 'Heavy Track',
    subtitle: 'For panels over 10ft tall',
    description: 'Extra durability for larger panels',
  },
  {
    id: 'velcro' as const,
    label: 'Velcro®',
    subtitle: 'Fixed in place',
    description: '',
    showsVelcroColor: true,
    popular: true,
  },
  {
    id: 'binding_only' as const,
    label: 'Binding Only',
    subtitle: 'Finished edge',
    description: 'Just the edge, no attachment hardware',
  },
  {
    id: 'special_rigging' as const,
    label: 'Special Rigging',
    subtitle: 'Custom solutions',
    description: 'For unique mounting situations',
  },
]

// =============================================================================
// DATA - RAW MATERIALS
// =============================================================================

const RAW_MESH_TYPES = [
  {
    id: 'heavy_mosquito' as const,
    label: 'Heavy Mosquito Netting',
    subtitle: 'Most durable, best for high-wear areas',
    description: 'Strong mesh for outdoor use and frequent movement.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 18,
    colors: ['black', 'white', 'ivory'] as MeshColor[],
  },
  {
    id: 'no_see_um' as const,
    label: 'No-See-Um Netting',
    subtitle: 'For tiny biting flies',
    description: 'Finer weave blocks midges common near coastal areas.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 19,
    colors: ['black', 'white'] as MeshColor[],
  },
  {
    id: 'shade' as const,
    label: 'Shade Netting',
    subtitle: 'Shade + privacy + bugs',
    description: 'Blocks sun while keeping airflow.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    pricePerFoot: 20,
    colors: ['black', 'white'] as MeshColor[],
  },
  {
    id: 'theater_scrim' as const,
    label: 'Theater Scrim',
    subtitle: 'Projection screens & stage',
    description: 'Ultra-fine weave for projection screens and stage backdrops.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200.jpg',
    pricePerFoot: 22,
    colors: ['white', 'silver'] as MeshColor[],
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function QuickSetup({ productType, options, onChange, simplifiedAttachments, hideHeading }: QuickSetupProps) {
  // Type guards
  const isMesh = productType === 'mosquito_curtains'
  const isVinyl = productType === 'clear_vinyl'
  const isRaw = productType === 'raw_materials'

  // Cast options based on product type
  const meshOpts = options as MeshOptions
  const vinylOpts = options as VinylOptions
  const rawOpts = options as RawMaterialOptions

  // Get available colors based on mesh type selection
  const getAvailableColors = () => {
    if (isVinyl) return []
    const meshType = isMesh ? meshOpts.meshType : rawOpts.meshType
    const meshData = (isRaw ? RAW_MESH_TYPES : MESH_TYPES).find(m => m.id === meshType)
    return meshData?.colors || ['black', 'white']
  }

  const availableColors = getAvailableColors()

  // Check if current color is valid for selected mesh type
  useEffect(() => {
    if (isMesh || isRaw) {
      const currentColor = isMesh ? meshOpts.meshColor : rawOpts.meshColor
      if (!availableColors.includes(currentColor)) {
        onChange({ ...options, meshColor: availableColors[0] || 'black' } as QuickSetupOptions)
      }
    }
  }, [isMesh ? meshOpts.meshType : rawOpts?.meshType])

  // Check if velcro color should show (hidden when simplifiedAttachments)
  const showVelcroColor = !simplifiedAttachments &&
    ((isMesh && meshOpts.topAttachment === 'velcro') || 
     (isVinyl && vinylOpts.topAttachment === 'velcro'))

  // Filter attachments to track + velcro only when simplified
  const meshAttachments = simplifiedAttachments
    ? MESH_ATTACHMENTS.filter(a => a.id === 'standard_track' || a.id === 'velcro')
    : MESH_ATTACHMENTS
  const vinylAttachments = simplifiedAttachments
    ? VINYL_ATTACHMENTS.filter(a => a.id === 'standard_track' || a.id === 'velcro')
    : VINYL_ATTACHMENTS

  // Check if canvas color should show
  const showCanvasColor = isVinyl && (vinylOpts.panelSize === 'medium' || vinylOpts.panelSize === 'tall')

  return (
    <Stack gap="lg">
      {!hideHeading && (
        <div className="text-center">
          <Heading level={2} className="!mb-2">Choose Your Options</Heading>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Info className="w-4 h-4" />
            <Text size="sm" className="!mb-0">Don&apos;t worry - you can change these later!</Text>
          </div>
        </div>
      )}

      {/* ================================================================
          MESH PANELS - Options
          ================================================================ */}
      {isMesh && (
        <>
          {/* Mesh Type with Images */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#406517]" />
              <Heading level={3} className="!mb-0">Step 1: Mesh Type</Heading>
            </div>
            <Text className="text-gray-600 mb-4">
              Over 90% of orders choose <strong>Heavy Mosquito in Black</strong>. All materials are durable outdoor polyester.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {MESH_TYPES.map((mesh) => (
                <button
                  key={mesh.id}
                  onClick={() => onChange({ ...meshOpts, meshType: mesh.id })}
                  className="text-left"
                >
                  <Card 
                    variant={meshOpts.meshType === mesh.id ? 'elevated' : 'outlined'}
                    className={cn(
                      '!p-0 overflow-hidden transition-all',
                      meshOpts.meshType === mesh.id && 'ring-2 ring-[#406517]'
                    )}
                  >
                    <Frame ratio="1/1">
                      <img
                        src={mesh.image}
                        alt={mesh.label}
                        className="w-full h-full object-cover"
                      />
                      {mesh.popular && (
                        <Badge className="absolute top-2 right-2 !bg-[#406517] !text-white !border-0">
                          90% Choose This
                        </Badge>
                      )}
                      {meshOpts.meshType === mesh.id && (
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#406517] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Frame>
                    <div className="p-4">
                      <Heading level={4} className="!mb-1">{mesh.label}</Heading>
                      <Text size="sm" className="text-[#406517] font-medium !mb-1">{mesh.subtitle}</Text>
                      <Text size="sm" className="text-gray-500 !mb-2">{mesh.description}</Text>
                      <div className="flex gap-1">
                        {mesh.colors.map((color) => {
                          const colorData = MESH_COLORS.find(c => c.id === color)
                          return (
                            <div
                              key={color}
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{ backgroundColor: colorData?.hex }}
                              title={colorData?.label}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </Grid>
          </div>

          {/* Mesh Color */}
          <Card variant="elevated" className="!p-5">
            <Heading level={4} className="!mb-4">Step 2: Mesh Color</Heading>
            <div className="flex flex-wrap gap-3">
              {MESH_COLORS.filter(c => availableColors.includes(c.id)).map((color) => (
                <button
                  key={color.id}
                  onClick={() => onChange({ ...meshOpts, meshColor: color.id })}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all',
                    meshOpts.meshColor === color.id
                      ? 'ring-2 ring-[#406517] bg-[#406517]/5'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-300" 
                    style={{ backgroundColor: color.hex }} 
                  />
                  <span className="text-gray-700">{color.label}</span>
                  {color.id === 'black' && meshOpts.meshColor !== color.id && (
                    <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">90%</Badge>
                  )}
                  {meshOpts.meshColor === color.id && <Check className="w-5 h-5 text-[#406517]" />}
                </button>
              ))}
            </div>
            {!availableColors.includes('ivory') && meshOpts.meshType !== 'heavy_mosquito' && (
              <Text size="sm" className="text-gray-500 mt-3 !mb-0">
                <Info className="w-4 h-4 inline mr-1" />
                Ivory is only available with Heavy Mosquito mesh
              </Text>
            )}
          </Card>

          {/* Top Attachment with GIFs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-[#406517]" />
              <Heading level={3} className="!mb-0">Step 3: Top Attachment</Heading>
            </div>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {meshAttachments.filter(a => a.image).map((att) => (
                <button
                  key={att.id}
                  onClick={() => onChange({ ...meshOpts, topAttachment: att.id })}
                  className="text-left"
                >
                  <Card 
                    variant={meshOpts.topAttachment === att.id ? 'elevated' : 'outlined'}
                    className={cn(
                      '!p-0 overflow-hidden transition-all',
                      meshOpts.topAttachment === att.id && 'ring-2 ring-[#406517]'
                    )}
                  >
                    {att.image && (
                      <Frame ratio="16/9">
                        <img
                          src={att.image}
                          alt={att.label}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                        {att.isGif && (
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Play className="w-3 h-3" /> GIF
                          </div>
                        )}
                      </Frame>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <Heading level={4} className="!mb-0">{att.id === 'standard_track' && simplifiedAttachments ? 'Track' : att.label}</Heading>
                        {meshOpts.topAttachment === att.id && <Check className="w-5 h-5 text-[#406517]" />}
                      </div>
                      <Text size="sm" className="text-[#406517] font-medium !mb-0">{att.subtitle}</Text>
                      {att.description ? <Text size="sm" className="text-gray-500 !mb-0">{att.description}</Text> : null}
                    </div>
                  </Card>
                </button>
              ))}
            </Grid>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className={meshAttachments.some(a => !a.image) ? 'mt-4' : ''}>
              {meshAttachments.filter(a => !a.image).map((att) => (
                <button
                  key={att.id}
                  onClick={() => onChange({ ...meshOpts, topAttachment: att.id })}
                  className={cn(
                    'p-4 rounded-xl text-left transition-all border-2',
                    meshOpts.topAttachment === att.id
                      ? 'border-[#406517] bg-[#406517]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{att.id === 'standard_track' && simplifiedAttachments ? 'Track' : att.label}</span>
                      {att.popular && <Badge className="ml-2 !bg-[#406517]/10 !text-[#406517]">Popular</Badge>}
                    </div>
                    {meshOpts.topAttachment === att.id && <Check className="w-5 h-5 text-[#406517]" />}
                  </div>
                  {att.description ? <Text size="sm" className="text-gray-500 !mb-0">{att.description}</Text> : null}
                </button>
              ))}
            </Grid>
          </div>

          {/* Velcro Color (conditional) */}
          {showVelcroColor && (
            <Card variant="elevated" className="!p-5 !bg-[#406517]/5 !border-[#406517]/20">
              <Heading level={4} className="!mb-3">Velcro® Color For Mounting Surface</Heading>
              <Text size="sm" className="text-gray-600 !mb-4">
                This is the color of the velcro strip that attaches to your structure.
              </Text>
              <div className="flex gap-3">
                {(['black', 'white'] as VelcroColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => onChange({ ...meshOpts, velcroColor: color })}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl transition-all',
                      meshOpts.velcroColor === color
                        ? 'ring-2 ring-[#406517] bg-white'
                        : 'bg-white hover:bg-gray-50'
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300" 
                      style={{ backgroundColor: color === 'black' ? '#1a1a1a' : '#f5f5f5' }} 
                    />
                    <span className="font-medium capitalize">{color}</span>
                    {meshOpts.velcroColor === color && <Check className="w-4 h-4 text-[#406517]" />}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ================================================================
          VINYL PANELS - Options
          ================================================================ */}
      {isVinyl && (
        <>
          {/* Panel Size */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Snowflake className="w-5 h-5 text-[#003365]" />
              <Heading level={3} className="!mb-0">Step 1: Panel Size</Heading>
            </div>
            <Text className="text-gray-600 mb-4">
              Price is based on panel height range. Our vinyl is always heavy-duty 20-gauge clear.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {VINYL_PANEL_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => onChange({ ...vinylOpts, panelSize: size.id })}
                  className={cn(
                    'p-5 rounded-xl text-left transition-all border-2',
                    vinylOpts.panelSize === size.id
                      ? 'border-[#003365] bg-[#003365]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Heading level={4} className="!mb-0">{size.label}</Heading>
                    {size.popular && <Badge className="!bg-[#003365]/10 !text-[#003365]">Most Common</Badge>}
                    {vinylOpts.panelSize === size.id && <Check className="w-5 h-5 text-[#003365]" />}
                  </div>
                  <Text size="sm" className="text-gray-500 !mb-2">{size.description}</Text>
                  <Text className="text-[#003365] font-bold !mb-0">${size.pricePerFoot}/linear ft</Text>
                </button>
              ))}
            </Grid>
          </div>

          {/* Canvas Color (conditional) */}
          {showCanvasColor && (
            <Card variant="elevated" className="!p-5">
              <Heading level={4} className="!mb-2">Step 2: Canvas Border Color</Heading>
              <Text size="sm" className="text-gray-600 !mb-4">
                The fabric border that frames your clear vinyl panel. Choose a color that complements your space.
              </Text>
              <div className="flex flex-wrap gap-2">
                {CANVAS_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => onChange({ ...vinylOpts, canvasColor: color.id })}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                      vinylOpts.canvasColor === color.id
                        ? 'ring-2 ring-[#003365] bg-[#003365]/5'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div 
                      className={cn(
                        "w-5 h-5 rounded-full border border-gray-300",
                        color.id === 'clear_top_to_bottom' && "border-dashed"
                      )}
                      style={{ backgroundColor: color.hex }} 
                    />
                    <span className="text-gray-700">{color.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Top Attachment */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-[#003365]" />
              <Heading level={3} className="!mb-0">Step {showCanvasColor ? '3' : '2'}: Top Attachment</Heading>
            </div>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {vinylAttachments.map((att) => (
                <button
                  key={att.id}
                  onClick={() => onChange({ ...vinylOpts, topAttachment: att.id })}
                  className={cn(
                    'p-4 rounded-xl text-left transition-all border-2',
                    vinylOpts.topAttachment === att.id
                      ? 'border-[#003365] bg-[#003365]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{att.id === 'standard_track' && simplifiedAttachments ? 'Track' : att.label}</span>
                      {att.popular && <Badge className="ml-2 !bg-[#003365]/10 !text-[#003365]">Popular</Badge>}
                    </div>
                    {vinylOpts.topAttachment === att.id && <Check className="w-5 h-5 text-[#003365]" />}
                  </div>
                  <Text size="sm" className="text-[#003365] !mb-0">{att.subtitle}</Text>
                  {att.description ? <Text size="sm" className="text-gray-500 !mb-0">{att.description}</Text> : null}
                </button>
              ))}
            </Grid>
          </div>

          {/* Velcro Color (conditional) */}
          {showVelcroColor && (
            <Card variant="elevated" className="!p-5 !bg-[#003365]/5 !border-[#003365]/20">
              <Heading level={4} className="!mb-3">Velcro® Color For Mounting Surface</Heading>
              <div className="flex gap-3">
                {(['black', 'white'] as VelcroColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => onChange({ ...vinylOpts, velcroColor: color })}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl transition-all',
                      vinylOpts.velcroColor === color
                        ? 'ring-2 ring-[#003365] bg-white'
                        : 'bg-white hover:bg-gray-50'
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300" 
                      style={{ backgroundColor: color === 'black' ? '#1a1a1a' : '#f5f5f5' }} 
                    />
                    <span className="font-medium capitalize">{color}</span>
                    {vinylOpts.velcroColor === color && <Check className="w-4 h-4 text-[#003365]" />}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ================================================================
          RAW MATERIALS - Options
          ================================================================ */}
      {isRaw && (
        <>
          {/* Fabric Type with Images */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-[#B30158]" />
              <Heading level={3} className="!mb-0">Step 1: Fabric Type</Heading>
            </div>
            <Text className="text-gray-600 mb-4">
              Raw fabric is sold by the linear yard in widths up to 12 feet. Perfect for DIY projects.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {RAW_MESH_TYPES.map((mesh) => (
                <button
                  key={mesh.id}
                  onClick={() => onChange({ ...rawOpts, meshType: mesh.id })}
                  className="text-left"
                >
                  <Card 
                    variant={rawOpts.meshType === mesh.id ? 'elevated' : 'outlined'}
                    className={cn(
                      '!p-0 overflow-hidden transition-all',
                      rawOpts.meshType === mesh.id && 'ring-2 ring-[#B30158]'
                    )}
                  >
                    <Frame ratio="16/9">
                      <img
                        src={mesh.image}
                        alt={mesh.label}
                        className="w-full h-full object-cover"
                      />
                      {rawOpts.meshType === mesh.id && (
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#B30158] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Frame>
                    <div className="p-4">
                      <Heading level={4} className="!mb-1">{mesh.label}</Heading>
                      <Text size="sm" className="text-[#B30158] font-medium !mb-1">{mesh.subtitle}</Text>
                      <Text size="sm" className="text-gray-500 !mb-0">{mesh.description}</Text>
                    </div>
                  </Card>
                </button>
              ))}
            </Grid>
          </div>

          {/* Fabric Color */}
          <Card variant="elevated" className="!p-5">
            <Heading level={4} className="!mb-4">Step 2: Fabric Color</Heading>
            <div className="flex flex-wrap gap-3">
              {MESH_COLORS.filter(c => availableColors.includes(c.id)).map((color) => (
                <button
                  key={color.id}
                  onClick={() => onChange({ ...rawOpts, meshColor: color.id })}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all',
                    rawOpts.meshColor === color.id
                      ? 'ring-2 ring-[#B30158] bg-[#B30158]/5'
                      : 'bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-300" 
                    style={{ backgroundColor: color.hex }} 
                  />
                  <span className="text-gray-700">{color.label}</span>
                  {rawOpts.meshColor === color.id && <Check className="w-5 h-5 text-[#B30158]" />}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </Stack>
  )
}

export default QuickSetup
