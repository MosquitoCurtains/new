'use client'

/**
 * GalleryPageTemplate
 * 
 * Template for filterable photo gallery pages.
 * Supports context-aware filtering — filter options change based on selected product type.
 * MC shows mesh type, color, top attachment. CV shows canvas color. Both show project type.
 * 
 * Usage:
 * ```tsx
 * <GalleryPageTemplate
 *   title="Project Gallery"
 *   images={[...]}
 *   filters={...}
 * />
 * ```
 */

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { X, Filter } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
  Frame,
  ImageLightbox,
} from '../components'
import { FinalCTATemplate } from './index'

export interface GalleryImage {
  id: string
  src: string
  thumbnail?: string
  title?: string
  description?: string
  productType?: 'mosquito_curtains' | 'clear_vinyl' | 'raw_mesh'
  projectType?: string
  meshType?: string
  topAttachment?: string
  color?: string
  canvasColor?: string
  location?: string
  customerName?: string
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface GalleryFilters {
  productTypes?: FilterOption[]
  projectTypes?: FilterOption[]
  /** MC / Raw Mesh only */
  meshTypes?: FilterOption[]
  /** MC / Raw Mesh only — mesh color (black, white, ivory) */
  colors?: FilterOption[]
  /** MC only */
  topAttachments?: FilterOption[]
  /** CV only — canvas/apron color */
  canvasColors?: FilterOption[]
}

export interface GalleryPageTemplateProps {
  /** Page title */
  title: string
  /** Page subtitle */
  subtitle?: string
  /** Gallery images */
  images: GalleryImage[]
  /** Available filters */
  filters?: GalleryFilters
  /** Initial product type filter */
  initialProductType?: string
  /** Initial project type filter */
  initialProjectType?: string
  /** Show filters */
  showFilters?: boolean
}

// ============================================================================
// Filter pill component
// ============================================================================

function FilterPill({ 
  label, 
  active, 
  onClick, 
  activeColor = 'bg-[#406517]',
  count,
}: { 
  label: string
  active: boolean
  onClick: () => void
  activeColor?: string
  count?: number 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? `${activeColor} text-white`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-1 opacity-70">({count})</span>
      )}
    </button>
  )
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
  activeColor,
}: {
  label: string
  options: FilterOption[]
  selected: string | null
  onSelect: (value: string | null) => void
  activeColor?: string
}) {
  if (!options || options.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mr-1">{label}:</span>
      {options.map(opt => (
        <FilterPill
          key={opt.value}
          label={opt.label}
          active={selected === opt.value}
          onClick={() => onSelect(selected === opt.value ? null : opt.value)}
          activeColor={activeColor}
          count={opt.count}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Main component
// ============================================================================

export function GalleryPageTemplate({
  title,
  subtitle,
  images,
  filters,
  initialProductType,
  initialProjectType,
  showFilters = true,
}: GalleryPageTemplateProps) {
  const [selectedProductType, setSelectedProductType] = useState<string | null>(initialProductType || null)
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(initialProjectType || null)
  const [selectedMeshType, setSelectedMeshType] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedTopAttachment, setSelectedTopAttachment] = useState<string | null>(null)
  const [selectedCanvasColor, setSelectedCanvasColor] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // When product type changes, clear filters that don't apply to the new type
  const handleProductTypeChange = useCallback((value: string | null) => {
    setSelectedProductType(prev => {
      const newValue = prev === value ? null : value
      // Clear MC-specific filters when switching away from MC
      if (newValue !== 'mosquito_curtains' && newValue !== 'raw_mesh') {
        setSelectedMeshType(null)
        setSelectedColor(null)
        setSelectedTopAttachment(null)
      }
      // Clear CV-specific filters when switching away from CV
      if (newValue !== 'clear_vinyl') {
        setSelectedCanvasColor(null)
      }
      return newValue
    })
  }, [])

  // Filter images based on all selections
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      if (selectedProductType && img.productType !== selectedProductType) return false
      if (selectedProjectType && img.projectType !== selectedProjectType) return false
      if (selectedMeshType && img.meshType !== selectedMeshType) return false
      if (selectedColor && img.color !== selectedColor) return false
      if (selectedTopAttachment && img.topAttachment !== selectedTopAttachment) return false
      if (selectedCanvasColor && img.canvasColor !== selectedCanvasColor) return false
      return true
    })
  }, [images, selectedProductType, selectedProjectType, selectedMeshType, selectedColor, selectedTopAttachment, selectedCanvasColor])

  // Clear all filters
  const clearFilters = () => {
    setSelectedProductType(null)
    setSelectedProjectType(null)
    setSelectedMeshType(null)
    setSelectedColor(null)
    setSelectedTopAttachment(null)
    setSelectedCanvasColor(null)
  }

  const hasActiveFilters = selectedProductType || selectedProjectType || selectedMeshType || selectedColor || selectedTopAttachment || selectedCanvasColor

  // Determine which secondary filters to show based on product type
  const showMCFilters = !selectedProductType || selectedProductType === 'mosquito_curtains' || selectedProductType === 'raw_mesh'
  const showCVFilters = !selectedProductType || selectedProductType === 'clear_vinyl'
  const showTopAttachment = selectedProductType === 'mosquito_curtains'

  // Compute product type counts — hide product types with 0 images
  const productTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    images.forEach(img => {
      if (img.productType) {
        counts[img.productType] = (counts[img.productType] || 0) + 1
      }
    })
    return counts
  }, [images])

  const activeProductTypes = useMemo(() => {
    if (!filters?.productTypes) return []
    return filters.productTypes
      .filter(opt => (productTypeCounts[opt.value] || 0) > 0)
      .map(opt => ({
        ...opt,
        count: productTypeCounts[opt.value] || 0,
      }))
  }, [filters?.productTypes, productTypeCounts])

  // Compute project type counts for current product type filter
  const projectTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    images.forEach(img => {
      if (selectedProductType && img.productType !== selectedProductType) return
      if (img.projectType) {
        counts[img.projectType] = (counts[img.projectType] || 0) + 1
      }
    })
    return counts
  }, [images, selectedProductType])

  // Filter project types to only show those with images for current product selection
  const activeProjectTypes = useMemo(() => {
    if (!filters?.projectTypes) return []
    return filters.projectTypes
      .filter(opt => (projectTypeCounts[opt.value] || 0) > 0)
      .map(opt => ({
        ...opt,
        count: projectTypeCounts[opt.value] || 0,
      }))
  }, [filters?.projectTypes, projectTypeCounts])

  // Open lightbox
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {filteredImages.length} project{filteredImages.length !== 1 ? 's' : ''} shown
            </p>
          </div>
        </section>

        {/* Filters */}
        {showFilters && filters && (
          <section>
            <Card className="!p-4">
              <div className="flex flex-col gap-3">
                {/* Top row: Product type + view toggle */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filter by:</span>
                  </div>

                  {/* Product Type Filter — only show types with images */}
                  {activeProductTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeProductTypes.map(opt => (
                        <FilterPill
                          key={opt.value}
                          label={opt.label}
                          active={selectedProductType === opt.value}
                          onClick={() => handleProductTypeChange(opt.value)}
                          activeColor="bg-[#406517]"
                          count={opt.count}
                        />
                      ))}
                    </div>
                  )}

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="ml-auto">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {/* Project Type — always shown, counts update with product filter */}
                {activeProjectTypes.length > 0 && (
                  <FilterGroup
                    label="Project"
                    options={activeProjectTypes}
                    selected={selectedProjectType}
                    onSelect={setSelectedProjectType}
                    activeColor="bg-[#003365]"
                  />
                )}

                {/* MC / Raw Mesh filters — only when applicable */}
                {showMCFilters && filters.meshTypes && filters.meshTypes.length > 0 && (
                  <FilterGroup
                    label="Mesh"
                    options={filters.meshTypes}
                    selected={selectedMeshType}
                    onSelect={setSelectedMeshType}
                    activeColor="bg-[#5a3e1b]"
                  />
                )}

                {showMCFilters && filters.colors && filters.colors.length > 0 && (
                  <FilterGroup
                    label="Mesh Color"
                    options={filters.colors}
                    selected={selectedColor}
                    onSelect={setSelectedColor}
                    activeColor="bg-gray-800"
                  />
                )}

                {showTopAttachment && filters.topAttachments && filters.topAttachments.length > 0 && (
                  <FilterGroup
                    label="Top Attachment"
                    options={filters.topAttachments}
                    selected={selectedTopAttachment}
                    onSelect={setSelectedTopAttachment}
                    activeColor="bg-[#6b4c9a]"
                  />
                )}

                {/* CV filters — only when applicable */}
                {showCVFilters && filters.canvasColors && filters.canvasColors.length > 0 && (
                  <FilterGroup
                    label="Canvas Color"
                    options={filters.canvasColors}
                    selected={selectedCanvasColor}
                    onSelect={setSelectedCanvasColor}
                    activeColor="bg-[#8b4513]"
                  />
                )}
              </div>
            </Card>
          </section>
        )}

        {/* Gallery Grid */}
        <section>
          {filteredImages.length > 0 ? (
            <Grid 
              responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} 
              gap="md"
            >
              {filteredImages.map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#406517] focus:ring-offset-2"
                >
                  <Frame ratio="4/3">
                    <img
                      src={image.thumbnail || image.src}
                      alt={image.title || `Project ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {image.title && (
                          <p className="text-white font-medium text-sm truncate">
                            {image.title}
                          </p>
                        )}
                        {image.location && (
                          <p className="text-white/70 text-xs">
                            {image.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Frame>
                  {image.projectType && (
                    <Badge 
                      className="absolute top-2 left-2 !bg-white/90 !text-gray-900 !border-0 text-xs capitalize"
                    >
                      {image.projectType.replace('_', ' ')}
                    </Badge>
                  )}
                </button>
              ))}
            </Grid>
          ) : (
            <Card className="!p-12 text-center">
              <Text className="text-gray-500">
                No projects match your current filters. Try adjusting your selection.
              </Text>
              <Button variant="ghost" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            </Card>
          )}
        </section>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={filteredImages[lightboxIndex]?.src}
              alt={filteredImages[lightboxIndex]?.title || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/50 rounded-full"
                >
                  &#8592;
                </button>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/50 rounded-full"
                >
                  &#8594;
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
