'use client'

/**
 * Unified Sales Page
 *
 * Salesperson flow:
 * 1. Pick or create a lead
 * 2. Create/resume a project (auto-saved cart to Supabase)
 * 3. Build cart from MC / CV / RN product lines
 * 4. Share checkout link with the lead
 *
 * Replaces the old /admin/mc-sales page with project-based persistence.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Link2,
  Search,
  UserPlus,
  FolderOpen,
  Copy,
  Check,
  Loader2,
  X,
} from 'lucide-react'
import { usePricing } from '@/hooks/usePricing'
import { calculateMeshPanelPrice, calculateVinylPanelPrice } from '@/lib/pricing/formulas'
import type {
  MeshType,
  MeshColor,
  MeshTopAttachment,
  VelcroColor,
  VinylPanelSize,
  CanvasColor,
  VinylTopAttachment,
  PricingMap,
} from '@/lib/pricing/types'
import type { CartLineItem } from '@/hooks/useCart'

// ─── Types ──────────────────────────────────────────────────────────────────

type ProductLine = 'mc' | 'cv' | 'rn'

interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  status: string
  interest: string | null
}

interface Project {
  id: string
  share_token: string
  lead_id: string
  status: string
  product_type: string
  cart_data: CartLineItem[]
  estimated_total: number | null
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
  leads?: Lead
}

// ─── Pipeline statuses ──────────────────────────────────────────────────────

const PIPELINE_STATUSES = [
  'open', 'pending', 'need_photos', 'invitation_to_plan',
  'need_measurements', 'working_on_quote', 'quote_sent',
  'need_decision', 'order_placed', 'order_on_hold', 'difficult', 'closed',
] as const

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function statusColor(s: string) {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    need_photos: 'bg-orange-100 text-orange-700',
    invitation_to_plan: 'bg-purple-100 text-purple-700',
    need_measurements: 'bg-orange-100 text-orange-700',
    working_on_quote: 'bg-indigo-100 text-indigo-700',
    quote_sent: 'bg-green-100 text-green-700',
    need_decision: 'bg-yellow-100 text-yellow-800',
    order_placed: 'bg-emerald-100 text-emerald-700',
    order_on_hold: 'bg-amber-100 text-amber-700',
    difficult: 'bg-red-100 text-red-700',
    closed: 'bg-gray-100 text-gray-600',
  }
  return colors[s] || 'bg-gray-100 text-gray-600'
}

// ─── Product images ─────────────────────────────────────────────────────────

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

// ─── MC constants ───────────────────────────────────────────────────────────

const TOP_ATTACHMENTS = [
  { id: 'standard_track', label: 'Standard Track (<10ft Tall)' },
  { id: 'heavy_track', label: 'Heavy Track (>10ft Tall)' },
  { id: 'velcro', label: 'Velcro' },
  { id: 'special_rigging', label: 'Special Rigging' },
] as const

// ─── CV constants ───────────────────────────────────────────────────────────

const CV_PANEL_SIZES: { id: VinylPanelSize; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium (default)' },
  { id: 'tall', label: 'Tall' },
]

const CV_CANVAS_COLORS: { id: CanvasColor; label: string }[] = [
  { id: 'tbd', label: 'To Be Determined' },
  { id: 'ashen_gray', label: 'Ashen Gray' },
  { id: 'burgundy', label: 'Burgundy' },
  { id: 'black', label: 'Black' },
  { id: 'cocoa_brown', label: 'Cocoa Brown' },
  { id: 'clear_top_to_bottom', label: 'Clear Top to Bottom' },
  { id: 'forest_green', label: 'Forest Green' },
  { id: 'moss_green', label: 'Moss Green' },
  { id: 'navy_blue', label: 'Navy Blue' },
  { id: 'royal_blue', label: 'Royal Blue' },
  { id: 'sandy_tan', label: 'Sandy Tan' },
]

const CV_TOP_ATTACHMENTS: { id: VinylTopAttachment; label: string }[] = [
  { id: 'standard_track', label: 'Standard Track (<10ft Tall)' },
  { id: 'heavy_track', label: 'Heavy Track (>10ft Tall)' },
  { id: 'velcro', label: 'Velcro' },
  { id: 'binding_only', label: 'Binding Only' },
  { id: 'special_rigging', label: 'Special Rigging' },
]

// ─── RN fabric types ────────────────────────────────────────────────────────

const FABRIC_TYPES = [
  { id: 'heavy_mosquito', label: 'Heavy Mosquito Netting', pricePerSqYd: 8.5 },
  { id: 'no_see_um', label: 'No-See-Um Mesh', pricePerSqYd: 10.0 },
  { id: 'shade', label: 'Shade Mesh', pricePerSqYd: 9.5 },
  { id: 'scrim', label: 'Theater Scrim', pricePerSqYd: 12.0 },
]

// ─── Attachment items (shared MC + CV) ──────────────────────────────────────

interface AttachmentItem {
  id: string; label: string; sku: string; unitLabel: string
  unitPrice: number; step: number; min: number; max: number; group: string
  description?: string
}

const ATTACHMENT_ITEMS: AttachmentItem[] = [
  { id: 'marine_snaps_black', label: 'Black Marine Snaps', sku: 'marine_snaps_black', unitLabel: 'snaps', unitPrice: 1.5, step: 10, min: 0, max: 200, group: 'Sealing Sides', description: '$15 per pack of 10' },
  { id: 'marine_snaps_white', label: 'White Marine Snaps', sku: 'marine_snaps_white', unitLabel: 'snaps', unitPrice: 1.5, step: 10, min: 0, max: 200, group: 'Sealing Sides', description: '$15 per pack of 10' },
  { id: 'adhesive_snaps_clear', label: 'Clear Adhesive Snaps', sku: 'adhesive_snaps_clear', unitLabel: 'snaps', unitPrice: 3, step: 5, min: 0, max: 50, group: 'Sealing Sides', description: '$15 per set of 5' },
  { id: 'adhesive_snaps_black', label: 'Black Adhesive Snaps', sku: 'adhesive_snaps_black', unitLabel: 'snaps', unitPrice: 3, step: 5, min: 0, max: 50, group: 'Sealing Sides', description: '$15 per set of 5' },
  { id: 'block_magnets', label: 'Block Shaped Magnets', sku: 'block_magnets', unitLabel: 'magnets', unitPrice: 1, step: 2, min: 0, max: 100, group: 'Magnetic Doorways', description: '$10 per 10' },
  { id: 'fiberglass_rods', label: '10ft Fiberglass Rods', sku: 'fiberglass_rods', unitLabel: 'rods', unitPrice: 10, step: 1, min: 0, max: 22, group: 'Magnetic Doorways', description: '$10 each' },
  { id: 'elastic_cord_black', label: 'Black Elastic Cord', sku: 'elastic_cord_black', unitLabel: 'cords', unitPrice: 10, step: 1, min: 0, max: 12, group: 'Elastic Cord', description: '$10 each' },
  { id: 'elastic_cord_white', label: 'White Elastic Cord', sku: 'elastic_cord_white', unitLabel: 'cords', unitPrice: 10, step: 1, min: 0, max: 12, group: 'Elastic Cord', description: '$10 each' },
]

const ATTACHMENT_GROUPS = Array.from(new Set(ATTACHMENT_ITEMS.map((i) => i.group)))

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(v: number) { return v.toFixed(2) }

interface PanelRow {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
  hasDoor?: boolean
  hasZipper?: boolean
}

function createPanelRow(): PanelRow {
  return {
    id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
    hasDoor: false,
    hasZipper: false,
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SalesPage() {
  const { prices: dbPrices, isLoading: pricingLoading } = usePricing()

  // ─── Lead state ─────────────────────────────────────────────────────────
  const [leadSearch, setLeadSearch] = useState('')
  const [leadResults, setLeadResults] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [newLead, setNewLead] = useState({ email: '', first_name: '', last_name: '', phone: '' })
  const [leadLoading, setLeadLoading] = useState(false)

  // ─── Project state ──────────────────────────────────────────────────────
  const [project, setProject] = useState<Project | null>(null)
  const [existingProjects, setExistingProjects] = useState<Project[]>([])
  const [projectLoading, setProjectLoading] = useState(false)

  // ─── Cart state (synced to project.cart_data) ───────────────────────────
  const [cartItems, setCartItems] = useState<CartLineItem[]>([])
  const [productLine, setProductLine] = useState<ProductLine>('mc')

  // ─── Auto-save debounce ─────────────────────────────────────────────────
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // ─── MC panel state ─────────────────────────────────────────────────────
  const [meshType, setMeshType] = useState<MeshType>('heavy_mosquito')
  const [meshColor, setMeshColor] = useState<MeshColor>('black')
  const [meshTop, setMeshTop] = useState<MeshTopAttachment>('velcro')
  const [meshVelcro, setMeshVelcro] = useState<VelcroColor>('black')
  const [meshRows, setMeshRows] = useState<PanelRow[]>([createPanelRow()])

  // ─── CV panel state ─────────────────────────────────────────────────────
  const [cvSize, setCvSize] = useState<VinylPanelSize>('medium')
  const [cvCanvas, setCvCanvas] = useState<CanvasColor>('tbd')
  const [cvTop, setCvTop] = useState<VinylTopAttachment>('standard_track')
  const [cvVelcro, setCvVelcro] = useState<VelcroColor>('black')
  const [cvRows, setCvRows] = useState<PanelRow[]>([createPanelRow()])

  // ─── RN state ───────────────────────────────────────────────────────────
  const [rnFabric, setRnFabric] = useState('heavy_mosquito')
  const [rnColor, setRnColor] = useState('black')
  const [rnWidthFt, setRnWidthFt] = useState<number | undefined>(undefined)
  const [rnLengthYd, setRnLengthYd] = useState<number | undefined>(undefined)

  // ─── Track state (shared) ──────────────────────────────────────────────
  const [trackWeight, setTrackWeight] = useState<'standard' | 'heavy'>('standard')
  const [trackColor, setTrackColor] = useState<'white' | 'black'>('white')
  const [trackItems, setTrackItems] = useState({ straightTrack: 0, curves90: 0, curves135: 0, splices: 0, endCaps: 0, carriers: 0 })

  // ─── Attachments state (shared) ─────────────────────────────────────────
  const [attachQtys, setAttachQtys] = useState<Record<string, number>>({})

  // ─── Adjustments ────────────────────────────────────────────────────────
  const [adjPositive, setAdjPositive] = useState(0)
  const [adjNegative, setAdjNegative] = useState(0)

  // ─── Search leads ───────────────────────────────────────────────────────

  useEffect(() => {
    if (leadSearch.length < 2) { setLeadResults([]); return }
    const t = setTimeout(async () => {
      setLeadLoading(true)
      try {
        const res = await fetch(`/api/leads?search=${encodeURIComponent(leadSearch)}`)
        if (res.ok) {
          const data = await res.json()
          setLeadResults(data.leads || [])
        }
      } catch { /* ignore */ }
      setLeadLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [leadSearch])

  // ─── Load projects for selected lead ────────────────────────────────────

  useEffect(() => {
    if (!selectedLead) { setExistingProjects([]); return }
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/sales/projects?lead_id=${selectedLead.id}`)
        if (res.ok) {
          const data = await res.json()
          setExistingProjects(data.projects || [])
        }
      } catch { /* ignore */ }
    })()
  }, [selectedLead])

  // ─── Auto-save cart to project ──────────────────────────────────────────

  const saveCartToProject = useCallback(async (items: CartLineItem[], proj: Project) => {
    if (!proj) return
    setIsSaving(true)
    try {
      const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
      await fetch(`/api/admin/sales/projects/${proj.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_data: items,
          estimated_total: subtotal,
          status: items.length > 0 ? 'quoted' : 'draft',
        }),
      })
    } catch (e) {
      console.error('Auto-save failed:', e)
    }
    setIsSaving(false)
  }, [])

  // Debounced auto-save whenever cartItems change
  useEffect(() => {
    if (!project) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveCartToProject(cartItems, project)
    }, 500)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [cartItems, project, saveCartToProject])

  // ─── Create project from lead ───────────────────────────────────────────

  const createProject = async (productType?: string) => {
    if (!selectedLead) return
    setProjectLoading(true)
    try {
      const res = await fetch('/api/admin/sales/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          product_type: productType || productLine === 'mc' ? 'curtains' : productLine === 'cv' ? 'vinyl' : 'netting',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
        setCartItems(data.project.cart_data || [])
      }
    } catch (e) {
      console.error('Failed to create project:', e)
    }
    setProjectLoading(false)
  }

  const resumeProject = (proj: Project) => {
    setProject(proj)
    setCartItems(proj.cart_data || [])
  }

  // ─── Create new lead ────────────────────────────────────────────────────

  const handleCreateLead = async () => {
    if (!newLead.email) return
    setLeadLoading(true)
    try {
      const res = await fetch('/api/admin/sales/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newLead.email,
          first_name: newLead.first_name,
          last_name: newLead.last_name,
          phone: newLead.phone,
          product_type: productLine === 'mc' ? 'curtains' : productLine === 'cv' ? 'vinyl' : 'netting',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSelectedLead({
          id: data.project.lead_id,
          email: newLead.email,
          first_name: newLead.first_name,
          last_name: newLead.last_name,
          phone: newLead.phone,
          status: 'pending',
          interest: null,
        })
        setProject(data.project)
        setCartItems(data.project.cart_data || [])
        setShowNewLeadForm(false)
        setNewLead({ email: '', first_name: '', last_name: '', phone: '' })
      }
    } catch (e) {
      console.error('Failed to create lead:', e)
    }
    setLeadLoading(false)
  }

  // ─── Cart operations ────────────────────────────────────────────────────

  const addItemsToCart = (items: CartLineItem[]) => {
    setCartItems((prev) => [...prev, ...items])
  }

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const cartSubtotal = useMemo(() => cartItems.reduce((s, i) => s + i.totalPrice, 0), [cartItems])

  // ─── Share link ─────────────────────────────────────────────────────────

  const shareUrl = project ? `${typeof window !== 'undefined' ? window.location.origin : ''}/project/${project.share_token}` : ''

  const copyShareLink = async () => {
    if (!shareUrl) return
    // Update lead status to quote_sent
    if (selectedLead) {
      try {
        await fetch(`/api/leads`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedLead.id, status: 'quote_sent' }),
        })
      } catch { /* ignore */ }
    }
    await navigator.clipboard.writeText(shareUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  // ─── MC panel calculations ──────────────────────────────────────────────

  const meshTotals = useMemo(() => {
    if (!dbPrices) return { panelTotals: [] as { total: number }[], subtotal: 0 }
    const panelTotals = meshRows.map((r) =>
      calculateMeshPanelPrice({
        widthFeet: r.widthFeet ?? 0,
        widthInches: r.widthInches ?? 0,
        heightInches: r.heightInches ?? 0,
        meshType, meshColor, topAttachment: meshTop, velcroColor: meshTop === 'velcro' ? meshVelcro : undefined,
      }, dbPrices)
    )
    return { panelTotals, subtotal: panelTotals.reduce((s, t) => s + t.total, 0) }
  }, [meshRows, meshType, meshColor, meshTop, meshVelcro, dbPrices])

  const addMeshToCart = () => {
    const items: CartLineItem[] = meshRows.map((r, i) => {
      const bd = meshTotals.panelTotals[i]
      const tw = (r.widthFeet ?? 0) + ((r.widthInches ?? 0) / 12)
      return {
        id: `mesh_panel-${Date.now()}-${i}`,
        type: 'panel' as const,
        productSku: 'mesh_panel',
        name: `Mesh Panel ${i + 1}`,
        description: `${tw.toFixed(1)}ft x ${r.heightInches ?? 0}in ${meshType.replace(/_/g, ' ')} - ${meshColor}`,
        quantity: 1,
        unitPrice: bd.total,
        totalPrice: bd.total,
        options: { widthFeet: r.widthFeet ?? 0, widthInches: r.widthInches ?? 0, heightInches: r.heightInches ?? 0, meshType, color: meshColor, topAttachment: meshTop },
      }
    })
    addItemsToCart(items)
    setMeshRows([createPanelRow()])
  }

  // ─── CV panel calculations ──────────────────────────────────────────────

  const cvTotals = useMemo(() => {
    if (!dbPrices) return { panelTotals: [] as { total: number }[], subtotal: 0 }
    const panelTotals = cvRows.map((r) =>
      calculateVinylPanelPrice({
        widthFeet: r.widthFeet ?? 0,
        widthInches: r.widthInches ?? 0,
        heightInches: r.heightInches ?? 0,
        panelSize: cvSize,
        topAttachment: cvTop,
        canvasColor: cvSize !== 'short' ? cvCanvas : undefined,
        velcroColor: cvTop === 'velcro' ? cvVelcro : undefined,
        hasDoor: r.hasDoor,
        hasZipper: r.hasZipper,
      }, dbPrices)
    )
    return { panelTotals, subtotal: panelTotals.reduce((s, t) => s + t.total, 0) }
  }, [cvRows, cvSize, cvCanvas, cvTop, cvVelcro, dbPrices])

  const addCvToCart = () => {
    const items: CartLineItem[] = cvRows.map((r, i) => {
      const bd = cvTotals.panelTotals[i]
      const tw = (r.widthFeet ?? 0) + ((r.widthInches ?? 0) / 12)
      return {
        id: `vinyl_panel-${Date.now()}-${i}`,
        type: 'panel' as const,
        productSku: 'vinyl_panel',
        name: `Clear Vinyl Panel ${i + 1}`,
        description: `${tw.toFixed(1)}ft x ${r.heightInches ?? 0}in ${cvSize}${r.hasDoor ? ' +door' : ''}${r.hasZipper ? ' +zip' : ''}`,
        quantity: 1,
        unitPrice: bd.total,
        totalPrice: bd.total,
        options: { widthFeet: r.widthFeet ?? 0, widthInches: r.widthInches ?? 0, heightInches: r.heightInches ?? 0, panelSize: cvSize, canvasColor: cvCanvas, topAttachment: cvTop, hasDoor: r.hasDoor ?? false, hasZipper: r.hasZipper ?? false },
      }
    })
    addItemsToCart(items)
    setCvRows([createPanelRow()])
  }

  // ─── RN fabric calculation ──────────────────────────────────────────────

  const rnPrice = useMemo(() => {
    const ft = FABRIC_TYPES.find((f) => f.id === rnFabric)
    if (!ft || !rnWidthFt || !rnLengthYd) return 0
    const sqYd = (rnWidthFt / 3) * rnLengthYd
    return Math.round(sqYd * ft.pricePerSqYd * 100) / 100
  }, [rnFabric, rnWidthFt, rnLengthYd])

  const addRnToCart = () => {
    if (!rnWidthFt || !rnLengthYd || rnPrice === 0) return
    const sqYd = (rnWidthFt / 3) * rnLengthYd
    addItemsToCart([{
      id: `fabric-${Date.now()}`,
      type: 'fabric' as const,
      productSku: `raw_${rnFabric}`,
      name: FABRIC_TYPES.find((f) => f.id === rnFabric)?.label || 'Raw Fabric',
      description: `${rnWidthFt}ft x ${rnLengthYd}yd (${sqYd.toFixed(1)} sq yd) - ${rnColor}`,
      quantity: 1,
      unitPrice: rnPrice,
      totalPrice: rnPrice,
      options: { fabricType: rnFabric, color: rnColor, widthFeet: rnWidthFt, lengthYards: rnLengthYd },
    }])
    setRnWidthFt(undefined)
    setRnLengthYd(undefined)
  }

  // ─── Track total ────────────────────────────────────────────────────────

  const trackPricing = useMemo(() => {
    const isH = trackWeight === 'heavy'
    const p = { st: isH ? 42 : 30, c: 25, sp: isH ? 5 : 7, ec: isH ? 1 : 1.5, cr: isH ? 1.25 : 0.5 }
    const sub = trackItems.straightTrack * p.st + trackItems.curves90 * p.c + trackItems.curves135 * p.c + trackItems.splices * p.sp + trackItems.endCaps * p.ec + trackItems.carriers * p.cr
    return { prices: p, subtotal: sub }
  }, [trackItems, trackWeight])

  const addTrackToCart = () => {
    const isH = trackWeight === 'heavy'
    const pf = isH ? 'Heavy' : 'Standard'
    const items: CartLineItem[] = []
    if (trackItems.straightTrack > 0) items.push({ id: `track-st-${Date.now()}`, type: 'track', productSku: isH ? 'heavy_track_7ft' : 'standard_track_7ft', name: `${pf} 7ft Track`, description: `${trackColor}`, quantity: trackItems.straightTrack, unitPrice: trackPricing.prices.st, totalPrice: trackItems.straightTrack * trackPricing.prices.st, options: { color: trackColor, weight: trackWeight } })
    if (trackItems.curves90 > 0) items.push({ id: `track-c90-${Date.now()}`, type: 'hardware', productSku: `${trackWeight}_curve_90`, name: `${pf} 90 Curve`, description: trackColor, quantity: trackItems.curves90, unitPrice: trackPricing.prices.c, totalPrice: trackItems.curves90 * trackPricing.prices.c, options: { color: trackColor } })
    if (trackItems.curves135 > 0) items.push({ id: `track-c135-${Date.now()}`, type: 'hardware', productSku: `${trackWeight}_curve_135`, name: `${pf} 135 Curve`, description: trackColor, quantity: trackItems.curves135, unitPrice: trackPricing.prices.c, totalPrice: trackItems.curves135 * trackPricing.prices.c, options: { color: trackColor } })
    if (trackItems.splices > 0) items.push({ id: `track-sp-${Date.now()}`, type: 'hardware', productSku: `${trackWeight}_splice`, name: `${pf} Splice`, description: trackColor, quantity: trackItems.splices, unitPrice: trackPricing.prices.sp, totalPrice: trackItems.splices * trackPricing.prices.sp, options: { color: trackColor } })
    if (trackItems.endCaps > 0) items.push({ id: `track-ec-${Date.now()}`, type: 'hardware', productSku: `${trackWeight}_end_caps`, name: `${pf} End Caps`, description: trackColor, quantity: trackItems.endCaps, unitPrice: trackPricing.prices.ec, totalPrice: trackItems.endCaps * trackPricing.prices.ec, options: { color: trackColor } })
    if (trackItems.carriers > 0) items.push({ id: `track-cr-${Date.now()}`, type: 'hardware', productSku: `${trackWeight}_carriers`, name: `${pf} Carriers`, description: trackColor, quantity: trackItems.carriers, unitPrice: trackPricing.prices.cr, totalPrice: trackItems.carriers * trackPricing.prices.cr, options: { color: trackColor } })
    addItemsToCart(items)
    setTrackItems({ straightTrack: 0, curves90: 0, curves135: 0, splices: 0, endCaps: 0, carriers: 0 })
  }

  // ─── Attachments total ──────────────────────────────────────────────────

  const attachSubtotal = useMemo(() => ATTACHMENT_ITEMS.reduce((s, i) => s + i.unitPrice * (attachQtys[i.id] || 0), 0), [attachQtys])

  const addAttachmentsToCart = () => {
    const items: CartLineItem[] = []
    ATTACHMENT_ITEMS.forEach((item) => {
      const qty = attachQtys[item.id] || 0
      if (qty > 0) {
        items.push({
          id: `attach-${item.id}-${Date.now()}`,
          type: 'hardware',
          productSku: item.sku,
          name: item.label,
          description: `${qty} ${item.unitLabel}`,
          quantity: 1,
          unitPrice: item.unitPrice * qty,
          totalPrice: item.unitPrice * qty,
          options: { quantity: qty, unit: item.unitLabel },
        })
      }
    })
    addItemsToCart(items)
    setAttachQtys({})
  }

  // ─── Adjustments ────────────────────────────────────────────────────────

  const addAdjustment = (type: 'positive' | 'negative') => {
    const val = type === 'positive' ? adjPositive : adjNegative
    if (!val) return
    const signed = type === 'negative' ? -Math.abs(val) : Math.abs(val)
    addItemsToCart([{
      id: `adj-${type}-${Date.now()}`,
      type: 'addon',
      productSku: `adjustment_${type}`,
      name: type === 'positive' ? 'Positive Adjustment' : 'Negative Adjustment',
      description: 'Manual price adjustment',
      quantity: 1,
      unitPrice: signed,
      totalPrice: signed,
    }])
    if (type === 'positive') setAdjPositive(0); else setAdjNegative(0)
  }

  const addSnapTool = () => {
    addItemsToCart([{
      id: `snap-tool-${Date.now()}`,
      type: 'addon',
      productSku: 'industrial_snap_tool',
      name: 'Industrial Snap Tool',
      description: 'Fully refundable if returned',
      quantity: 1,
      unitPrice: 130,
      totalPrice: 130,
    }])
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  if (pricingLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LEFT: Product sections                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ─── Top bar: Lead picker + product tabs ─────────────────────── */}
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-gray-900">Sales</h1>

          {/* Lead picker */}
          {!selectedLead ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Select or create a lead to start</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads by name or email..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
                />
                {leadLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
              </div>

              {/* Search results */}
              {leadResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {leadResults.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setLeadSearch(''); setLeadResults([]) }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                    >
                      <span className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</span>
                      <span className="ml-2 text-gray-500">{lead.email}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${statusColor(lead.status)}`}>
                        {statusLabel(lead.status)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* New lead */}
              <button
                onClick={() => setShowNewLeadForm(!showNewLeadForm)}
                className="flex items-center gap-1.5 text-sm text-[#406517] hover:underline font-medium"
              >
                <UserPlus className="w-4 h-4" /> Create new lead
              </button>

              {showNewLeadForm && (
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Email *" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="First name" value={newLead.first_name} onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Last name" value={newLead.last_name} onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Phone" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={handleCreateLead} disabled={!newLead.email || leadLoading} className="bg-[#406517] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e7a1d] disabled:opacity-40">
                    {leadLoading ? 'Creating...' : 'Create & Start Project'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Selected lead header */
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedLead.first_name} {selectedLead.last_name}
                    <span className="ml-2 text-gray-500 font-normal">{selectedLead.email}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedLead.phone && <span>{selectedLead.phone} &middot; </span>}
                    <span className={`px-1.5 py-0.5 rounded text-xs ${statusColor(selectedLead.status)}`}>
                      {statusLabel(selectedLead.status)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedLead(null); setProject(null); setCartItems([]); setExistingProjects([]) }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Change lead
                </button>
              </div>

              {/* Project selection */}
              {!project && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {existingProjects.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Resume existing project:</p>
                      <div className="space-y-1">
                        {existingProjects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => resumeProject(p)}
                            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium">{p.product_type}</span>
                              <span className="ml-2 text-gray-500">{(p.cart_data || []).length} items</span>
                              {p.estimated_total && <span className="ml-2 text-gray-600">${fmt(p.estimated_total)}</span>}
                            </div>
                            <FolderOpen className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => createProject()}
                    disabled={projectLoading}
                    className="w-full bg-[#406517] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#4e7a1d] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {projectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    New Project
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Product line tabs (only show when project exists) */}
          {project && (
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'mc' as ProductLine, label: 'Mosquito Curtains' },
                { id: 'cv' as ProductLine, label: 'Clear Vinyl' },
                { id: 'rn' as ProductLine, label: 'Raw Netting' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProductLine(tab.id)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    productLine === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product sections (only when project is active) ──────────── */}
        {project && dbPrices && (
          <div className="space-y-6">
            {/* ═══════ MC: Mesh Panels ═══════ */}
            {productLine === 'mc' && (
              <>
                <Section title="Mesh Panels">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <Select label="Mesh Type" value={meshType} onChange={(v) => setMeshType(v as MeshType)} options={[{ value: 'heavy_mosquito', label: 'Heavy Mosquito' }, { value: 'no_see_um', label: 'No-See-Um' }, { value: 'shade', label: 'Shade' }]} />
                    <Select label="Color" value={meshColor} onChange={(v) => setMeshColor(v as MeshColor)} options={[{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }, ...(meshType === 'heavy_mosquito' ? [{ value: 'ivory', label: 'Ivory' }] : [])]} />
                    <Select label="Top Attachment" value={meshTop} onChange={(v) => setMeshTop(v as MeshTopAttachment)} options={TOP_ATTACHMENTS.map((a) => ({ value: a.id, label: a.label }))} />
                    {meshTop === 'velcro' && <Select label="Velcro Color" value={meshVelcro} onChange={(v) => setMeshVelcro(v as VelcroColor)} options={[{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }]} />}
                  </div>
                  <PanelTable rows={meshRows} setRows={setMeshRows} totals={meshTotals.panelTotals.map((t) => t.total)} />
                  <SectionFooter subtotal={meshTotals.subtotal} onAdd={addMeshToCart} label="Add Mesh Panels" />
                </Section>
              </>
            )}

            {/* ═══════ CV: Vinyl Panels ═══════ */}
            {productLine === 'cv' && (
              <>
                <Section title="Clear Vinyl Panels">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <Select label="Panel Size" value={cvSize} onChange={(v) => setCvSize(v as VinylPanelSize)} options={CV_PANEL_SIZES.map((s) => ({ value: s.id, label: s.label }))} />
                    {cvSize !== 'short' && <Select label="Canvas Color" value={cvCanvas} onChange={(v) => setCvCanvas(v as CanvasColor)} options={CV_CANVAS_COLORS.map((c) => ({ value: c.id, label: c.label }))} />}
                    <Select label="Top Attachment" value={cvTop} onChange={(v) => setCvTop(v as VinylTopAttachment)} options={CV_TOP_ATTACHMENTS.map((a) => ({ value: a.id, label: a.label }))} />
                    {cvTop === 'velcro' && <Select label="Velcro Color" value={cvVelcro} onChange={(v) => setCvVelcro(v as VelcroColor)} options={[{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }]} />}
                  </div>
                  <PanelTable rows={cvRows} setRows={setCvRows} totals={cvTotals.panelTotals.map((t) => t.total)} showDoorZipper />
                  <SectionFooter subtotal={cvTotals.subtotal} onAdd={addCvToCart} label="Add Vinyl Panels" />
                </Section>
              </>
            )}

            {/* ═══════ RN: Raw Netting ═══════ */}
            {productLine === 'rn' && (
              <Section title="Raw Fabric">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <Select label="Fabric Type" value={rnFabric} onChange={setRnFabric} options={FABRIC_TYPES.map((f) => ({ value: f.id, label: f.label }))} />
                  <Select label="Color" value={rnColor} onChange={setRnColor} options={[{ value: 'black', label: 'Black' }, { value: 'white', label: 'White' }, { value: 'ivory', label: 'Ivory' }]} />
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Width (ft)</label>
                    <input type="number" min={1} max={12} value={rnWidthFt ?? ''} onChange={(e) => setRnWidthFt(e.target.value ? Number(e.target.value) : undefined)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="ft" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Length (yd)</label>
                    <input type="number" min={1} value={rnLengthYd ?? ''} onChange={(e) => setRnLengthYd(e.target.value ? Number(e.target.value) : undefined)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="yd" />
                  </div>
                </div>
                <SectionFooter subtotal={rnPrice} onAdd={addRnToCart} label="Add Fabric" disabled={rnPrice === 0} />
              </Section>
            )}

            {/* ═══════ Track Hardware (MC + CV) ═══════ */}
            {(productLine === 'mc' || productLine === 'cv') && (
              <Section title="Track Hardware">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Select label="Track Weight" value={trackWeight} onChange={(v) => setTrackWeight(v as 'standard' | 'heavy')} options={[{ value: 'standard', label: 'Standard' }, { value: 'heavy', label: 'Heavy' }]} />
                  <Select label="Track Color" value={trackColor} onChange={(v) => setTrackColor(v as 'white' | 'black')} options={[{ value: 'white', label: 'White' }, { value: 'black', label: 'Black' }]} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <Counter label="7ft Straight Track" value={trackItems.straightTrack} onChange={(v) => setTrackItems({ ...trackItems, straightTrack: v })} price={trackPricing.prices.st} />
                  <Counter label="90 Degree Curve" value={trackItems.curves90} onChange={(v) => setTrackItems({ ...trackItems, curves90: v })} price={trackPricing.prices.c} />
                  <Counter label="135 Degree Curve" value={trackItems.curves135} onChange={(v) => setTrackItems({ ...trackItems, curves135: v })} price={trackPricing.prices.c} />
                  <Counter label="Splice" value={trackItems.splices} onChange={(v) => setTrackItems({ ...trackItems, splices: v })} price={trackPricing.prices.sp} />
                  <Counter label="End Caps" value={trackItems.endCaps} onChange={(v) => setTrackItems({ ...trackItems, endCaps: v })} price={trackPricing.prices.ec} />
                  <Counter label="Carriers" value={trackItems.carriers} onChange={(v) => setTrackItems({ ...trackItems, carriers: v })} price={trackPricing.prices.cr} />
                </div>
                <SectionFooter subtotal={trackPricing.subtotal} onAdd={addTrackToCart} label="Add Track" disabled={trackPricing.subtotal === 0} />
              </Section>
            )}

            {/* ═══════ Attachment Items (MC + CV) ═══════ */}
            {(productLine === 'mc' || productLine === 'cv') && (
              <Section title="Attachment Items">
                {ATTACHMENT_GROUPS.map((group) => (
                  <div key={group} className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ATTACHMENT_ITEMS.filter((i) => i.group === group).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                          <span className="text-xs text-gray-400">{item.description}</span>
                          <Counter
                            value={attachQtys[item.id] || 0}
                            onChange={(v) => setAttachQtys({ ...attachQtys, [item.id]: v })}
                            step={item.step}
                            min={item.min}
                            max={item.max}
                            compact
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <SectionFooter subtotal={attachSubtotal} onAdd={addAttachmentsToCart} label="Add Attachments" disabled={attachSubtotal === 0} />
              </Section>
            )}

            {/* ═══════ Adjustments ═══════ */}
            <Section title="Adjustments">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex gap-2">
                  <input type="number" min={0} value={adjPositive || ''} onChange={(e) => setAdjPositive(Number(e.target.value))} placeholder="+ amount" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={() => addAdjustment('positive')} disabled={!adjPositive} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40">+Add</button>
                </div>
                <div className="flex gap-2">
                  <input type="number" min={0} value={adjNegative || ''} onChange={(e) => setAdjNegative(Number(e.target.value))} placeholder="- amount" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={() => addAdjustment('negative')} disabled={!adjNegative} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40">-Deduct</button>
                </div>
              </div>
            </Section>

            {/* ═══════ Snap Tool ═══════ */}
            {(productLine === 'mc' || productLine === 'cv') && (
              <Section title="Snap Tool">
                <button onClick={addSnapTool} className="bg-[#406517] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#4e7a1d]">
                  Add Snap Tool ($130 refundable)
                </button>
              </Section>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RIGHT: Cart sidebar                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <aside className="w-80 lg:w-96 border-l border-gray-200 bg-white flex flex-col h-full hidden md:flex">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Cart
            </h2>
            {isSaving && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
            {!isSaving && project && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No items yet</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2.5 group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  {item.quantity > 1 && <p className="text-xs text-gray-400">Qty: {item.quantity}</p>}
                </div>
                <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">${fmt(item.totalPrice)}</p>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="p-0.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart footer */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-lg font-bold text-gray-900">${fmt(cartSubtotal)}</span>
          </div>

          {project && (
            <button
              onClick={copyShareLink}
              className="w-full flex items-center justify-center gap-2 bg-[#406517] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#4e7a1d] transition-colors"
            >
              {linkCopied ? (
                <><Check className="w-4 h-4" /> Link Copied!</>
              ) : (
                <><Link2 className="w-4 h-4" /> Share Cart Link</>
              )}
            </button>
          )}

          {project && shareUrl && (
            <p className="text-xs text-gray-400 text-center break-all">{shareUrl}</p>
          )}
        </div>
      </aside>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label?: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#406517]/30 focus:border-[#406517]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function Counter({ label, value, onChange, price, step = 1, min = 0, max = 999, compact }: {
  label?: string; value: number; onChange: (v: number) => void
  price?: number; step?: number; min?: number; max?: number; compact?: boolean
}) {
  return (
    <div className={compact ? 'flex items-center gap-1' : 'bg-gray-50 rounded-lg p-3'}>
      {!compact && label && <p className="text-xs text-gray-600 mb-1">{label}</p>}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 text-xs"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 text-xs"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      {!compact && price !== undefined && (
        <p className="text-xs text-gray-400 mt-1">${fmt(price)}/ea &middot; ${fmt(value * price)}</p>
      )}
    </div>
  )
}

function PanelTable({ rows, setRows, totals, showDoorZipper }: {
  rows: PanelRow[]; setRows: (r: PanelRow[]) => void; totals: number[]; showDoorZipper?: boolean
}) {
  const addRow = () => setRows([...rows, createPanelRow()])
  const removeRow = (i: number) => { if (rows.length > 1) setRows(rows.filter((_, idx) => idx !== i)) }
  const update = (i: number, patch: Partial<PanelRow>) => {
    const next = [...rows]; next[i] = { ...next[i], ...patch }; setRows(next)
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
        <div className={`bg-gray-50 border-b border-gray-200 px-3 py-1.5 grid gap-2 text-xs font-medium text-gray-500 ${showDoorZipper ? 'grid-cols-[28px_1fr_1fr_1fr_60px_60px_70px_32px]' : 'grid-cols-[28px_1fr_1fr_1fr_70px_32px]'}`}>
          <div>#</div><div>W ft</div><div>W in</div><div>H in</div>
          {showDoorZipper && <><div>Door</div><div>Zip</div></>}
          <div className="text-right">Price</div><div />
        </div>
        {rows.map((r, i) => (
          <div key={r.id} className={`px-3 py-1.5 grid gap-2 items-center border-b border-gray-50 last:border-0 ${showDoorZipper ? 'grid-cols-[28px_1fr_1fr_1fr_60px_60px_70px_32px]' : 'grid-cols-[28px_1fr_1fr_1fr_70px_32px]'}`}>
            <span className="text-xs text-gray-400">{i + 1}</span>
            <input type="number" min={0} max={20} value={r.widthFeet ?? ''} onChange={(e) => update(i, { widthFeet: e.target.value ? Number(e.target.value) : undefined })} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" placeholder="ft" />
            <input type="number" min={0} max={11} value={r.widthInches ?? ''} onChange={(e) => update(i, { widthInches: e.target.value ? Number(e.target.value) : undefined })} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" placeholder="in" />
            <input type="number" min={0} value={r.heightInches ?? ''} onChange={(e) => update(i, { heightInches: e.target.value ? Number(e.target.value) : undefined })} className="w-full border border-gray-200 rounded px-2 py-1 text-sm" placeholder="in" />
            {showDoorZipper && (
              <>
                <input type="checkbox" checked={r.hasDoor ?? false} onChange={(e) => update(i, { hasDoor: e.target.checked })} className="mx-auto" />
                <input type="checkbox" checked={r.hasZipper ?? false} onChange={(e) => update(i, { hasZipper: e.target.checked })} className="mx-auto" />
              </>
            )}
            <span className="text-xs font-medium text-right">${fmt(totals[i] ?? 0)}</span>
            <button onClick={() => removeRow(i)} disabled={rows.length <= 1} className="p-0.5 text-gray-300 hover:text-red-500 disabled:invisible">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addRow} className="flex items-center gap-1 text-xs text-[#406517] hover:underline font-medium mb-2">
        <Plus className="w-3.5 h-3.5" /> Add row
      </button>
    </>
  )
}

function SectionFooter({ subtotal, onAdd, label, disabled }: {
  subtotal: number; onAdd: () => void; label: string; disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div>
        <p className="text-xs text-gray-500">Section subtotal</p>
        <p className="text-base font-bold text-gray-900">${fmt(subtotal)}</p>
      </div>
      <button
        onClick={onAdd}
        disabled={disabled ?? subtotal === 0}
        className="bg-[#406517] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e7a1d] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </div>
  )
}
