'use client'

/**
 * GalleryPageTemplate
 * 
 * Template for filterable photo gallery pages.
 * Supports filtering by product type, project type, mesh type, etc.
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

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { X, Filter, Grid3X3, LayoutGrid } from 'lucide-react'
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
  meshTypes?: FilterOption[]
  colors?: FilterOption[]
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')

  // Filter images based on selections
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      if (selectedProductType && img.productType !== selectedProductType) return false
      if (selectedProjectType && img.projectType !== selectedProjectType) return false
      if (selectedMeshType && img.meshType !== selectedMeshType) return false
      return true
    })
  }, [images, selectedProductType, selectedProjectType, selectedMeshType])

  // Clear all filters
  const clearFilters = () => {
    setSelectedProductType(null)
    setSelectedProjectType(null)
    setSelectedMeshType(null)
  }

  const hasActiveFilters = selectedProductType || selectedProjectType || selectedMeshType

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
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter by:</span>
                </div>

                {/* Product Type Filter */}
                {filters.productTypes && filters.productTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filters.productTypes.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedProductType(
                          selectedProductType === opt.value ? null : opt.value
                        )}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedProductType === opt.value
                            ? 'bg-[#406517] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                        {opt.count !== undefined && (
                          <span className="ml-1 opacity-70">({opt.count})</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Project Type Filter */}
                {filters.projectTypes && filters.projectTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filters.projectTypes.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedProjectType(
                          selectedProjectType === opt.value ? null : opt.value
                        )}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedProjectType === opt.value
                            ? 'bg-[#003365] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}

                {/* View Mode Toggle */}
                <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-1.5 rounded ${viewMode === 'masonry' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
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
                      className="absolute top-2 left-2 !bg-white/90 !text-gray-900 !border-0 text-xs"
                    >
                      {image.projectType}
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
                  ←
                </button>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/50 rounded-full"
                >
                  →
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
