import type { PricingMap } from '@/lib/pricing/types'
import type { DBProduct, DBProductOption } from '@/hooks/useProducts'

// =============================================================================
// SALES MODE
// =============================================================================

export type SalesMode = 'mc' | 'cv' | 'rn' | 'ru'

export const SALES_MODE_LABELS: Record<SalesMode, string> = {
  mc: 'Mosquito Curtains',
  cv: 'Clear Vinyl',
  rn: 'Raw Netting',
  ru: 'Roll-Up Shades',
}

export const SALES_MODE_SHORT: Record<SalesMode, string> = {
  mc: 'MC',
  cv: 'CV',
  rn: 'RN',
  ru: 'RU',
}

// =============================================================================
// SHARED LINE-ITEM TYPES
// =============================================================================

export type MeshPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

export type VinylPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
  canvasColor?: string
  topAttachment?: string
  velcroColor?: string
  hasDoor?: boolean
  hasZipper?: boolean
}

export type StuccoStrip = {
  id: string
  heightInches: number | undefined
  quantity: number | undefined
}

export type AdjustmentLine = {
  id: string
  type: string
  quantity: number
  price: number
  description: string
}

export type RawNettingLine = {
  id: string
  materialType: string
  rollWidth: string
  color: string
  lengthFeet: number | undefined
}

export type RollUpLine = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
  ply: 'single' | 'double'
  meshColor: string
  velcroColor: string
}

export type ProductModalInfo = {
  name: string
  image?: string
  price: number
  unit: string
  description?: string
  sku?: string
  step?: number
  min?: number
  max?: number
  packSize?: number
  packPrice?: number
  weight?: string
}

// =============================================================================
// SECTION PROP INTERFACES
// =============================================================================

export interface SharedSectionProps {
  addItem: (item: Omit<import('@/hooks/useCart').CartLineItem, 'id'>) => void
  isLoading: boolean
  getPrice: (id: string, fallback?: number) => number
  dbPrices: PricingMap | null
  setProductModal: (info: ProductModalInfo | null) => void
}

export interface TrackSectionProps extends SharedSectionProps {
  standardTrackItems: DBProduct[]
  heavyTrackItems: DBProduct[]
}

export interface AttachmentSectionProps extends SharedSectionProps {
  attachmentItems: DBProduct[]
  attachmentGroups: string[]
}

export interface SnapToolSectionProps extends SharedSectionProps {
  snapTool: DBProduct | null
}

export interface AdjustmentSectionProps extends SharedSectionProps {
  adjustmentOptions: DBProductOption[]
}

// =============================================================================
// HELPERS
// =============================================================================

export function createDefaultMeshSize(): MeshPanelSize {
  return {
    id: `mesh-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

export function createDefaultVinylSize(): VinylPanelSize {
  return {
    id: `vinyl-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
    canvasColor: 'tbd',
    topAttachment: 'standard_track',
    velcroColor: 'black',
  }
}

export function createDefaultStuccoStrip(): StuccoStrip {
  return {
    id: `stucco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    heightInches: undefined,
    quantity: undefined,
  }
}

export function createDefaultAdjustmentLine(): AdjustmentLine {
  return {
    id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: '',
    quantity: 1,
    price: 0,
    description: '',
  }
}

export function createDefaultRawNettingLine(): RawNettingLine {
  return {
    id: `rn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    materialType: 'heavy_mosquito',
    rollWidth: '101',
    color: 'black',
    lengthFeet: undefined,
  }
}

export function createDefaultRollUpLine(): RollUpLine {
  return {
    id: `ru-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
    ply: 'single',
    meshColor: 'black',
    velcroColor: 'black',
  }
}

export function formatMoney(value: number) {
  return value.toFixed(2)
}
