'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Card, Text, Stack, Button, HeaderBarSection,
} from '@/lib/design-system'
import {
  Check, Info, Plus, Minus,
  SlidersHorizontal, Scissors, Loader2,
  CheckCircle, Mail, User, Phone, ShieldCheck, Send, Bookmark,
  ArrowRight, ArrowLeft, ShoppingCart, X, ClipboardList, Camera,
  FileText, Link2, Copy,
} from 'lucide-react'
import type { MeshType, MeshColor } from '@/lib/pricing/types'
import { useCartContext } from '@/contexts/CartContext'
import { usePricing } from '@/hooks/usePricing'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Constants & Data
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const GREEN = '#406517'
const INPUT_CLS = 'w-20 px-2 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-colors'

/* ─── Mesh types with images ─── */
const MESH_TYPE_CARDS = [
  {
    id: 'heavy_mosquito' as MeshType,
    label: 'Heavy Mosquito',
    subtitle: '90% of customers choose this',
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies. Durable outdoor polyester.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/mosquito-mesh-1600.jpg',
    colors: ['black', 'white', 'ivory'] as MeshColor[],
    rollWidths: [101, 123, 138],
    popular: true,
  },
  {
    id: 'no_see_um' as MeshType,
    label: 'No-See-Um',
    subtitle: 'For tiny biting flies',
    description: 'Finer weave blocks tiny midge flies common near coastal areas. Slightly reduced airflow.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/noseeum-mesh-1600.jpg',
    colors: ['black', 'white'] as MeshColor[],
    rollWidths: [101, 123],
  },
  {
    id: 'shade' as MeshType,
    label: 'Shade',
    subtitle: 'Shade + privacy + bugs',
    description: 'Provides shade, privacy and insect protection all in one. Also works as a projection screen.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/shade-mesh-1600.jpg',
    colors: ['black', 'white'] as MeshColor[],
    rollWidths: [120],
  },
  {
    id: 'theater_scrim' as MeshType,
    label: 'Theater Scrim',
    subtitle: 'Marine-grade shark tooth scrim',
    description: 'Suitable for outdoors. Perfect for projection screens, stage backdrops, and decorative applications.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/White-Sharks-tooth-Scrim-1200.jpg',
    colors: ['white', 'silver'] as MeshColor[],
    rollWidths: [120, 140],
  },
  {
    id: 'industrial' as MeshType,
    label: 'Industrial',
    subtitle: 'Incredibly strong military overrun',
    description: 'Military overrun nylon mesh. Can be zip tied on edges. Available in Olive Green only.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/08/Industrial-Mesh-1600.jpg',
    colors: ['olive_green'] as MeshColor[],
    rollWidths: [65],
  },
]

const MESH_COLOR_SWATCHES: { id: MeshColor; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
  { id: 'silver', label: 'Silver', hex: '#C0C0C0' },
  { id: 'olive_green', label: 'Olive Green', hex: '#556B2F' },
]

/* ─── Edge finishing options ─── */
export type EdgeFinishId =
  | 'none'
  | 'binding_1in'
  | 'binding_1in_grommets_6' | 'binding_1in_grommets_12' | 'binding_1in_grommets_24' | 'binding_1in_grommets_5eq'
  | 'binding_1in_velcro'
  | 'binding_1in_velcro_grommets_6' | 'binding_1in_velcro_grommets_12' | 'binding_1in_velcro_grommets_24' | 'binding_1in_velcro_grommets_5eq'
  | 'webbing_3in_6' | 'webbing_3in_12' | 'webbing_3in_24' | 'webbing_3in_5eq'
  | 'webbing_4in_6' | 'webbing_4in_12' | 'webbing_4in_24' | 'webbing_4in_5eq'
  | 'webbing_6in_6' | 'webbing_6in_12' | 'webbing_6in_24' | 'webbing_6in_5eq'

interface EdgeOption {
  id: EdgeFinishId
  label: string
  pricePerFt: number | null
  group: 'none' | 'binding' | 'webbing'
}

const EDGE_OPTIONS: EdgeOption[] = [
  { id: 'none', label: 'None (raw edge)', pricePerFt: 0, group: 'none' },
  // Binding — no grommets
  { id: 'binding_1in', label: '1" Binding', pricePerFt: 1.00, group: 'binding' },
  // Binding — with grommets (spacing choices)
  { id: 'binding_1in_grommets_6', label: '1" Binding — Grommets every 6"', pricePerFt: 1.00, group: 'binding' },
  { id: 'binding_1in_grommets_12', label: '1" Binding — Grommets every 12"', pricePerFt: 1.00, group: 'binding' },
  { id: 'binding_1in_grommets_24', label: '1" Binding — Grommets every 24"', pricePerFt: 1.00, group: 'binding' },
  { id: 'binding_1in_grommets_5eq', label: '1" Binding — 5 Equally Spaced Grommets', pricePerFt: 1.00, group: 'binding' },
  // Binding — velcro only
  { id: 'binding_1in_velcro', label: '1" Binding with Velcro', pricePerFt: 1.50, group: 'binding' },
  // Binding — velcro + grommets (spacing choices)
  { id: 'binding_1in_velcro_grommets_6', label: '1" Binding + Velcro — Grommets every 6"', pricePerFt: 1.50, group: 'binding' },
  { id: 'binding_1in_velcro_grommets_12', label: '1" Binding + Velcro — Grommets every 12"', pricePerFt: 1.50, group: 'binding' },
  { id: 'binding_1in_velcro_grommets_24', label: '1" Binding + Velcro — Grommets every 24"', pricePerFt: 1.50, group: 'binding' },
  { id: 'binding_1in_velcro_grommets_5eq', label: '1" Binding + Velcro — 5 Equally Spaced Grommets', pricePerFt: 1.50, group: 'binding' },
  // 3" Webbing
  { id: 'webbing_3in_6', label: '3" Webbing — Grommets every 6"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_3in_12', label: '3" Webbing — Grommets every 12"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_3in_24', label: '3" Webbing — Grommets every 24"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_3in_5eq', label: '3" Webbing — 5 Equally Spaced Grommets', pricePerFt: null, group: 'webbing' },
  // 4" Webbing
  { id: 'webbing_4in_6', label: '4" Webbing — Grommets every 6"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_4in_12', label: '4" Webbing — Grommets every 12"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_4in_24', label: '4" Webbing — Grommets every 24"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_4in_5eq', label: '4" Webbing — 5 Equally Spaced Grommets', pricePerFt: null, group: 'webbing' },
  // 6" Webbing
  { id: 'webbing_6in_6', label: '6" Webbing — Grommets every 6"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_6in_12', label: '6" Webbing — Grommets every 12"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_6in_24', label: '6" Webbing — Grommets every 24"', pricePerFt: null, group: 'webbing' },
  { id: 'webbing_6in_5eq', label: '6" Webbing — 5 Equally Spaced Grommets', pricePerFt: null, group: 'webbing' },
]

const EDGE_LABEL_SHORT: Record<EdgeFinishId, string> = {
  none: 'Raw',
  binding_1in: '1" Bind',
  binding_1in_grommets_6: '1" Bind+G 6"',
  binding_1in_grommets_12: '1" Bind+G 12"',
  binding_1in_grommets_24: '1" Bind+G 24"',
  binding_1in_grommets_5eq: '1" Bind+5G',
  binding_1in_velcro: '1" Bind+V',
  binding_1in_velcro_grommets_6: '1" B+V+G 6"',
  binding_1in_velcro_grommets_12: '1" B+V+G 12"',
  binding_1in_velcro_grommets_24: '1" B+V+G 24"',
  binding_1in_velcro_grommets_5eq: '1" B+V+5G',
  webbing_3in_6: '3" Web 6"',
  webbing_3in_12: '3" Web 12"',
  webbing_3in_24: '3" Web 24"',
  webbing_3in_5eq: '3" Web 5eq',
  webbing_4in_6: '4" Web 6"',
  webbing_4in_12: '4" Web 12"',
  webbing_4in_24: '4" Web 24"',
  webbing_4in_5eq: '4" Web 5eq',
  webbing_6in_6: '6" Web 6"',
  webbing_6in_12: '6" Web 12"',
  webbing_6in_24: '6" Web 24"',
  webbing_6in_5eq: '6" Web 5eq',
}

/* ─── Panel state ─── */
export interface RawPanelState {
  meshType: MeshType
  meshColor: MeshColor
  rollWidth: number
  widthInches: number
  topEdge: EdgeFinishId
  rightEdge: EdgeFinishId
  bottomEdge: EdgeFinishId
  leftEdge: EdgeFinishId
  allSidesSame: boolean
  notes: string
}

function defaultPanelState(): RawPanelState {
  return {
    meshType: 'heavy_mosquito',
    meshColor: 'black',
    rollWidth: 101,
    widthInches: 120,
    topEdge: 'binding_1in',
    rightEdge: 'binding_1in',
    bottomEdge: 'binding_1in',
    leftEdge: 'binding_1in',
    allSidesSame: true,
    notes: '',
  }
}

const LS_KEY = 'mc_raw_netting_builder'

/** Set of all valid EdgeFinishId values — used to sanitize stale localStorage data */
const VALID_EDGE_IDS = new Set<string>(EDGE_OPTIONS.map(o => o.id))

/** Sanitize an edge ID loaded from storage — map stale IDs to closest valid option */
function sanitizeEdgeId(id: unknown): EdgeFinishId {
  if (typeof id === 'string' && VALID_EDGE_IDS.has(id)) return id as EdgeFinishId
  // Map removed legacy IDs to sensible defaults
  if (id === 'binding_1in_grommets') return 'binding_1in_grommets_12'
  if (id === 'binding_1in_velcro_grommets') return 'binding_1in_velcro_grommets_12'
  return 'none'
}

/** Sanitize a full panel loaded from storage */
function sanitizePanel(raw: Record<string, unknown>): RawPanelState {
  const d = defaultPanelState()
  return {
    meshType: (typeof raw.meshType === 'string' ? raw.meshType : d.meshType) as MeshType,
    meshColor: (typeof raw.meshColor === 'string' ? raw.meshColor : d.meshColor) as MeshColor,
    rollWidth: typeof raw.rollWidth === 'number' ? raw.rollWidth : d.rollWidth,
    widthInches: typeof raw.widthInches === 'number' ? raw.widthInches : d.widthInches,
    topEdge: sanitizeEdgeId(raw.topEdge),
    rightEdge: sanitizeEdgeId(raw.rightEdge),
    bottomEdge: sanitizeEdgeId(raw.bottomEdge),
    leftEdge: sanitizeEdgeId(raw.leftEdge),
    allSidesSame: typeof raw.allSidesSame === 'boolean' ? raw.allSidesSame : d.allSidesSame,
    notes: typeof raw.notes === 'string' ? raw.notes : d.notes,
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Edge Finish Dropdown
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EdgeFinishSelect({ label, value, onChange, lengthInches }: {
  label: string
  value: EdgeFinishId
  onChange: (v: EdgeFinishId) => void
  lengthInches: number
}) {
  const selected = EDGE_OPTIONS.find(o => o.id === value)
  const lengthFt = lengthInches / 12
  const cost = selected?.pricePerFt != null ? selected.pricePerFt * lengthFt : null

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
        {cost != null && cost > 0 && (
          <span className="text-xs font-semibold text-[#406517]">+${cost.toFixed(2)}</span>
        )}
        {selected?.pricePerFt == null && selected?.id !== 'none' && (
          <span className="text-xs text-gray-400 italic">Quote needed</span>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EdgeFinishId)}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all cursor-pointer"
      >
        <option value="none">None (raw edge)</option>
        <optgroup label="1&quot; Binding (no grommets)">
          <option value="binding_1in">1&quot; Binding — $1.00/ft</option>
          <option value="binding_1in_velcro">1&quot; Binding with Velcro — $1.50/ft</option>
        </optgroup>
        <optgroup label="1&quot; Binding + Grommets — $1.00/ft">
          {EDGE_OPTIONS.filter(o => o.id.startsWith('binding_1in_grommets_')).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
        <optgroup label="1&quot; Binding + Velcro + Grommets — $1.50/ft">
          {EDGE_OPTIONS.filter(o => o.id.startsWith('binding_1in_velcro_grommets_')).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
        <optgroup label="3&quot; Webbing with Grommets">
          {EDGE_OPTIONS.filter(o => o.id.startsWith('webbing_3in')).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
        <optgroup label="4&quot; Webbing with Grommets">
          {EDGE_OPTIONS.filter(o => o.id.startsWith('webbing_4in')).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
        <optgroup label="6&quot; Webbing with Grommets">
          {EDGE_OPTIONS.filter(o => o.id.startsWith('webbing_6in')).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
      </select>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Edge rendering helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Pixel width for an edge strip — 1" base = 4px, webbing scales proportionally */
function edgeThickness(id: EdgeFinishId): number {
  if (id === 'none') return 0
  if (id.startsWith('webbing_6in')) return 24
  if (id.startsWith('webbing_4in')) return 16
  if (id.startsWith('webbing_3in')) return 12
  return 4 // 1" binding
}

/** Does this edge have grommets? */
function hasGrommets(id: EdgeFinishId): boolean {
  if (id === 'none') return false
  return id.includes('grommet') || id.startsWith('webbing')
}

/** Does this edge have velcro? */
function hasVelcro(id: EdgeFinishId): boolean {
  return id.includes('velcro')
}

/** Is this a "5 equally spaced" grommet option? */
function is5EquallySpaced(id: EdgeFinishId): boolean {
  return id.endsWith('_5eq')
}

/** Grommet spacing in inches for inch-based options */
function grommetSpacingInches(id: EdgeFinishId): number {
  if (id.endsWith('_6')) return 6
  if (id.endsWith('_12')) return 12
  if (id.endsWith('_24')) return 24
  return 12 // fallback
}

/** Color for the edge strip */
function edgeStripColor(id: EdgeFinishId): string {
  if (id === 'none') return 'transparent'
  if (id.startsWith('webbing')) return '#4a4a4a'
  return GREEN
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG: Render one edge (binding/webbing strip + grommets + velcro)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EdgeGraphics({ side, edgeId, px, py, rectW, rectH, edgeLengthInches }: {
  side: 'top' | 'right' | 'bottom' | 'left'
  edgeId: EdgeFinishId
  px: number; py: number; rectW: number; rectH: number
  edgeLengthInches: number
}) {
  // Raw edge — nothing rendered; the panel border is sufficient
  if (edgeId === 'none') return null

  const thick = edgeThickness(edgeId)
  const color = edgeStripColor(edgeId)
  const grommets = hasGrommets(edgeId)
  const velcro = hasVelcro(edgeId)

  const isHorizontal = side === 'top' || side === 'bottom'
  const edgeLen = isHorizontal ? rectW : rectH

  // Grommet positions — "5 equally spaced" or inch-based spacing
  let grommetPositions: number[] = []
  if (grommets) {
    if (is5EquallySpaced(edgeId)) {
      // 5 grommets equally distributed
      grommetPositions = Array.from({ length: 5 }, (_, i) => (edgeLen / 6) * (i + 1))
    } else {
      // Inch-based spacing (6", 12", 24") — compute count from real panel inches
      const spacingIn = grommetSpacingInches(edgeId)
      const count = Math.max(2, Math.floor(edgeLengthInches / spacingIn) + 1)
      grommetPositions = Array.from({ length: count }, (_, i) => {
        const frac = count <= 1 ? 0.5 : i / (count - 1)
        return frac * edgeLen
      })
    }
  }

  // Strip rectangle coordinates
  let sx: number, sy: number, sw: number, sh: number
  if (side === 'top') { sx = px; sy = py - thick; sw = rectW; sh = thick }
  else if (side === 'bottom') { sx = px; sy = py + rectH; sw = rectW; sh = thick }
  else if (side === 'left') { sx = px - thick; sy = py; sw = thick; sh = rectH }
  else { sx = px + rectW; sy = py; sw = thick; sh = rectH }

  const gr = Math.min(5.5, thick * 0.38) // grommet radius scales with strip thickness

  return (
    <g>
      {/* Strip / band */}
      <rect x={sx} y={sy} width={sw} height={sh} fill={color} rx={1} opacity={0.85} />
      {/* Stitch lines for webbing */}
      {thick >= 12 && isHorizontal && (
        <>
          <line x1={sx} y1={sy + 2} x2={sx + sw} y2={sy + 2} stroke="#888" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
          <line x1={sx} y1={sy + sh - 2} x2={sx + sw} y2={sy + sh - 2} stroke="#888" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
        </>
      )}
      {thick >= 12 && !isHorizontal && (
        <>
          <line x1={sx + 2} y1={sy} x2={sx + 2} y2={sy + sh} stroke="#888" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
          <line x1={sx + sw - 2} y1={sy} x2={sx + sw - 2} y2={sy + sh} stroke="#888" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
        </>
      )}
      {/* Velcro texture — fuzzy strip inside the binding */}
      {velcro && isHorizontal && (
        <rect x={sx + 2} y={side === 'top' ? sy + thick - 3 : sy + 1} width={sw - 4} height={2} fill="#B8860B" rx={0.5} opacity={0.7} />
      )}
      {velcro && !isHorizontal && (
        <rect x={side === 'left' ? sx + thick - 3 : sx + 1} y={sy + 2} width={2} height={sh - 4} fill="#B8860B" rx={0.5} opacity={0.7} />
      )}
      {/* Grommets */}
      {grommets && grommetPositions.map((pos, i) => {
        let cx: number, cy: number
        if (side === 'top') { cx = px + pos; cy = sy + thick / 2 }
        else if (side === 'bottom') { cx = px + pos; cy = sy + thick / 2 }
        else if (side === 'left') { cx = sx + thick / 2; cy = py + pos }
        else { cx = sx + thick / 2; cy = py + pos }
        return (
          <g key={`g${side}${i}`}>
            <circle cx={cx} cy={cy} r={gr} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} />
            <circle cx={cx} cy={cy} r={gr * 0.45} fill="white" />
          </g>
        )
      })}
    </g>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG Panel Preview (rich graphics)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function RawPanelPreview({ panel, meshHex }: { panel: RawPanelState; meshHex: string }) {
  // Compute padding needed for each edge's strip thickness
  const topThick = edgeThickness(panel.topEdge)
  const rightThick = edgeThickness(panel.rightEdge)
  const bottomThick = edgeThickness(panel.bottomEdge)
  const leftThick = edgeThickness(panel.leftEdge)

  const padTop = Math.max(40, topThick + 28)
  const padRight = Math.max(40, rightThick + 28)
  const padBottom = Math.max(40, bottomThick + 28)
  const padLeft = Math.max(40, leftThick + 28)

  // True proportions: fit within a max bounding box while preserving aspect ratio
  const MAX_W = 400
  const MAX_H = 350
  const MIN_DIM = 100 // don't let either side get too tiny
  const realW = Math.max(panel.widthInches, 1)
  const realH = Math.max(panel.rollWidth, 1)
  const aspect = realW / realH
  let rectW: number, rectH: number
  if (aspect >= MAX_W / MAX_H) {
    // width-limited
    rectW = MAX_W
    rectH = Math.max(MIN_DIM, Math.round(MAX_W / aspect))
  } else {
    // height-limited
    rectH = MAX_H
    rectW = Math.max(MIN_DIM, Math.round(MAX_H * aspect))
  }

  const svgW = padLeft + rectW + padRight
  const svgH = padTop + rectH + padBottom
  const px = padLeft
  const py = padTop

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="block mx-auto w-full" style={{ maxWidth: svgW, maxHeight: svgH }}>
      {/* Panel fill */}
      <rect x={px} y={py} width={rectW} height={rectH} fill="#e8f0dc" stroke={GREEN} strokeWidth={2} rx={3} />
      {/* Mesh crosshatch */}
      {Array.from({ length: Math.floor(rectW / 14) }).map((_, i) => (
        <line key={`v${i}`} x1={px + 7 + i * 14} y1={py + 3} x2={px + 7 + i * 14} y2={py + rectH - 3} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />
      ))}
      {Array.from({ length: Math.floor(rectH / 14) }).map((_, i) => (
        <line key={`h${i}`} x1={px + 3} y1={py + 7 + i * 14} x2={px + rectW - 3} y2={py + 7 + i * 14} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />
      ))}

      {/* Edge graphics — strips, grommets, velcro */}
      <EdgeGraphics side="top" edgeId={panel.topEdge} px={px} py={py} rectW={rectW} rectH={rectH} edgeLengthInches={panel.widthInches} />
      <EdgeGraphics side="right" edgeId={panel.rightEdge} px={px} py={py} rectW={rectW} rectH={rectH} edgeLengthInches={panel.rollWidth} />
      <EdgeGraphics side="bottom" edgeId={panel.bottomEdge} px={px} py={py} rectW={rectW} rectH={rectH} edgeLengthInches={panel.widthInches} />
      <EdgeGraphics side="left" edgeId={panel.leftEdge} px={px} py={py} rectW={rectW} rectH={rectH} edgeLengthInches={panel.rollWidth} />

      {/* Dimension annotations */}
      {/* Width — bottom arrow */}
      <line x1={px} y1={py + rectH + bottomThick + 16} x2={px + rectW} y2={py + rectH + bottomThick + 16} stroke="#8aaa5a" strokeWidth={1} markerEnd="url(#arR)" markerStart="url(#arL)" />
      <text x={px + rectW / 2} y={py + rectH + bottomThick + 30} textAnchor="middle" fontSize={13} fill={GREEN} fontWeight={700} fontFamily="system-ui">{panel.widthInches}&quot; wide</text>
      {/* Height — left arrow */}
      <line x1={px - leftThick - 16} y1={py} x2={px - leftThick - 16} y2={py + rectH} stroke="#8aaa5a" strokeWidth={1} markerEnd="url(#arD)" markerStart="url(#arU)" />
      <text x={px - leftThick - 26} y={py + rectH / 2 + 3} textAnchor="middle" fontSize={13} fill={GREEN} fontWeight={700} fontFamily="system-ui" transform={`rotate(-90 ${px - leftThick - 26} ${py + rectH / 2 + 3})`}>{panel.rollWidth}&quot; tall</text>

      {/* Arrow markers */}
      <defs>
        <marker id="arR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6" fill="#8aaa5a" /></marker>
        <marker id="arL" markerWidth={6} markerHeight={6} refX={1} refY={3} orient="auto"><path d="M6,0 L0,3 L6,6" fill="#8aaa5a" /></marker>
        <marker id="arD" markerWidth={6} markerHeight={6} refX={3} refY={5} orient="auto"><path d="M0,0 L3,6 L6,0" fill="#8aaa5a" /></marker>
        <marker id="arU" markerWidth={6} markerHeight={6} refX={3} refY={1} orient="auto"><path d="M0,6 L3,0 L6,6" fill="#8aaa5a" /></marker>
      </defs>
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Quantity Stepper (inline) — allows empty input while typing
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function QtyStepper({ value, onChange, min = 1, max = 99, suffix }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
        <Minus className="w-3.5 h-3.5 text-gray-600" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? '' : value}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9]/g, '')
          onChange(raw === '' ? 0 : Math.min(max, parseInt(raw)))
        }}
        onBlur={() => { if (value < min) onChange(min) }}
        className={INPUT_CLS}
      />
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
        <Plus className="w-3.5 h-3.5 text-gray-600" />
      </button>
      {suffix && <span className="text-gray-500 text-xs">{suffix}</span>}
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Price helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function calcEdgeCost(edgeId: EdgeFinishId, lengthInches: number): number | null {
  const opt = EDGE_OPTIONS.find(o => o.id === edgeId)
  if (!opt || opt.pricePerFt == null) return null
  return opt.pricePerFt * (lengthInches / 12)
}

function fmt$(n: number): string {
  return n % 1 === 0 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`
}

/** Format inches as feet + inches — e.g. 120 → 10'0", 134 → 11'2" */
function fmtFtIn(inches: number): string {
  if (inches <= 0) return '0"'
  const ft = Math.floor(inches / 12)
  const rem = Math.round(inches % 12)
  if (ft === 0) return `${rem}"`
  return rem === 0 ? `${ft}'` : `${ft}'${rem}"`
}

/* ─── Mesh type -> pricing key abbreviation ─── */
const MESH_KEY_ABBREV: Record<string, string> = {
  heavy_mosquito: 'hm',
  no_see_um: 'nsu',
  shade: 'shade',
  theater_scrim: 'scrim',
  industrial: 'ind',
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function RawNettingPanelBuilder() {
  const { addItem } = useCartContext()
  const { getPrice } = usePricing()

  const [panels, setPanels] = useState<RawPanelState[]>([defaultPanelState()])
  const [hydrated, setHydrated] = useState(false)

  // ── Save Your Project (lightweight) ──
  const [projectName, setProjectName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [saveDescription, setSaveDescription] = useState('')   // optional note for their own use
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [projectSaved, setProjectSaved] = useState(false)      // true once saved — auto-populates submit

  // ── Submit Your Design (full) ──
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitDescription, setSubmitDescription] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [meshDetailType, setMeshDetailType] = useState<MeshType | null>(null)

  // Restore from localStorage (sanitize stale edge IDs from previous versions)
  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_KEY)
      if (s) {
        const parsed = JSON.parse(s)
        if (Array.isArray(parsed.panels) && parsed.panels.length > 0) {
          setPanels(parsed.panels.map((p: Record<string, unknown>) => sanitizePanel(p)))
        }
      }
    } catch { /* ok */ }
    setHydrated(true)
  }, [])

  // Auto-save (debounced)
  useEffect(() => {
    if (!hydrated) return
    const t = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ panels })) } catch { /* ok */ }
    }, 500)
    return () => clearTimeout(t)
  }, [panels, hydrated])

  const updatePanel = useCallback((idx: number, update: Partial<RawPanelState>) => {
    setPanels(prev => prev.map((p, i) => {
      if (i !== idx) return p
      const next = { ...p, ...update }
      // If allSidesSame and an edge changed, sync all edges
      if (next.allSidesSame) {
        const changedEdge = update.topEdge ?? update.rightEdge ?? update.bottomEdge ?? update.leftEdge
        if (changedEdge) {
          next.topEdge = changedEdge
          next.rightEdge = changedEdge
          next.bottomEdge = changedEdge
          next.leftEdge = changedEdge
        }
      }
      return next
    }))
  }, [])

  const addPanel = useCallback(() => {
    setPanels(prev => [...prev, defaultPanelState()])
  }, [])

  const removePanel = useCallback((idx: number) => {
    setPanels(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)
  }, [])

  const duplicatePanel = useCallback((idx: number) => {
    setPanels(prev => {
      const copy = { ...prev[idx] }
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]
    })
  }, [])

  // Pricing summary (mesh cost + edge costs)
  const pricingSummary = useMemo(() => {
    return panels.map(p => {
      // Mesh cost: perFootRate × (widthInches / 12)
      const abbrev = MESH_KEY_ABBREV[p.meshType] || p.meshType
      const meshPricingKey = `raw_panel_${abbrev}_${p.rollWidth}`
      const perFootRate = getPrice(meshPricingKey, 0)
      const meshCost = perFootRate * (p.widthInches / 12)

      // Edge costs
      const topCost = calcEdgeCost(p.topEdge, p.widthInches)
      const bottomCost = calcEdgeCost(p.bottomEdge, p.widthInches)
      const leftCost = calcEdgeCost(p.leftEdge, p.rollWidth)
      const rightCost = calcEdgeCost(p.rightEdge, p.rollWidth)
      const allEdgesKnown = topCost != null && bottomCost != null && leftCost != null && rightCost != null
      const edgeTotal = allEdgesKnown ? (topCost + bottomCost + leftCost + rightCost) : null

      // Total panel cost (null if any edge requires a quote)
      const panelTotal = (allEdgesKnown && perFootRate > 0) ? meshCost + edgeTotal! : null

      return {
        meshCost, perFootRate,
        topCost, bottomCost, leftCost, rightCost,
        edgeTotal, panelTotal,
        needsQuote: !allEdgesKnown,
      }
    })
  }, [panels, getPrice])

  // Grand totals
  const grandTotal = useMemo(() => {
    const allPriced = pricingSummary.every(p => p.panelTotal != null)
    if (!allPriced) return null
    return pricingSummary.reduce((sum, p) => sum + (p.panelTotal ?? 0), 0)
  }, [pricingSummary])

  const anyNeedsQuote = pricingSummary.some(p => p.needsQuote)

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  // Build panel data for save/submit
  const buildCartData = useCallback(() => {
    return panels.map((p, i) => ({
      panelIndex: i + 1,
      meshType: p.meshType,
      meshColor: p.meshColor,
      rollWidth: p.rollWidth,
      widthInches: p.widthInches,
      topEdge: p.topEdge,
      rightEdge: p.rightEdge,
      bottomEdge: p.bottomEdge,
      leftEdge: p.leftEdge,
      allSidesSame: p.allSidesSame,
      pricing: pricingSummary[i],
    }))
  }, [panels, pricingSummary])

  // ── Save Project (lightweight — just name, first name, email) ──
  const handleSaveProject = async () => {
    if (!isValidEmail(email) || !firstName.trim()) return
    setSaveStatus('saving')
    try {
      const cd = buildCartData()
      const noteParts: string[] = []
      if (projectName.trim()) noteParts.push(`Project: ${projectName.trim()}`)
      noteParts.push(`Raw Netting Panel Builder: ${panels.length} panel${panels.length !== 1 ? 's' : ''}`)
      panels.forEach((p, i) => {
        const meshLabel = MESH_TYPE_CARDS.find(c => c.id === p.meshType)?.label || p.meshType
        noteParts.push(`Panel ${i + 1}: ${p.widthInches}"x${p.rollWidth}" ${meshLabel} (${p.meshColor})`)
      })
      if (saveDescription.trim()) noteParts.push(`Notes: ${saveDescription.trim()}`)

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          product: 'raw_materials',
          projectType: 'raw_netting_panel',
          numberOfSides: panels.length,
          notes: noteParts.join('\n'),
          description: saveDescription.trim() || undefined,
          cart_data: cd,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')
      setSaveStatus('saved')
      setProjectSaved(true)
      if (d.shareUrl) setShareUrl(d.shareUrl)
    } catch (e) {
      console.error('Save project:', e)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // ── Submit for Expert Review (full details) ──
  const handleSubmitProject = async () => {
    if (!isValidEmail(email) || !firstName.trim()) return
    setSubmitStatus('submitting')
    try {
      const cd = buildCartData()
      const noteParts: string[] = []
      if (projectName.trim()) noteParts.push(`Project: ${projectName.trim()}`)
      noteParts.push(`Raw Netting Panel Builder — Expert Review Request`)
      noteParts.push(`${panels.length} panel${panels.length !== 1 ? 's' : ''}`)
      panels.forEach((p, i) => {
        const meshLabel = MESH_TYPE_CARDS.find(c => c.id === p.meshType)?.label || p.meshType
        noteParts.push(`Panel ${i + 1}: ${p.widthInches}"x${p.rollWidth}" ${meshLabel} (${p.meshColor})`)
      })
      if (submitDescription.trim()) noteParts.push(`Description: ${submitDescription.trim()}`)

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phone: phone.trim() || undefined,
          product: 'raw_materials',
          projectType: 'raw_netting_panel',
          numberOfSides: panels.length,
          notes: noteParts.join('\n'),
          description: submitDescription.trim() || undefined,
          cart_data: cd,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')
      setSubmitStatus('submitted')
      if (d.shareUrl) setShareUrl(d.shareUrl)
    } catch (e) {
      console.error('Submit project:', e)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  // Add all panels to cart and proceed to checkout
  const handleOrderNow = useCallback(() => {
    panels.forEach((p, i) => {
      const pricing = pricingSummary[i]
      if (pricing.panelTotal == null || pricing.panelTotal <= 0) return

      const meshLabel = MESH_TYPE_CARDS.find(c => c.id === p.meshType)?.label || p.meshType
      const colorLabel = MESH_COLOR_SWATCHES.find(c => c.id === p.meshColor)?.label || p.meshColor

      addItem({
        type: 'fabric',
        productSku: 'raw_netting_panel',
        name: `Raw ${meshLabel} Panel${panels.length > 1 ? ` #${i + 1}` : ''}`,
        description: `${colorLabel} - ${p.widthInches}"W x ${p.rollWidth}"H — edges: ${EDGE_LABEL_SHORT[p.topEdge]}/${EDGE_LABEL_SHORT[p.rightEdge]}/${EDGE_LABEL_SHORT[p.bottomEdge]}/${EDGE_LABEL_SHORT[p.leftEdge]}`,
        quantity: 1,
        unitPrice: pricing.panelTotal!,
        totalPrice: pricing.panelTotal!,
        options: {
          mesh_type: p.meshType,
          [`roll_width_${p.meshType}`]: String(p.rollWidth),
          color: p.meshColor,
          purchase_type: 'by_foot',
          widthInches: p.widthInches,
          topEdge: p.topEdge,
          rightEdge: p.rightEdge,
          bottomEdge: p.bottomEdge,
          leftEdge: p.leftEdge,
        },
      })
    })
  }, [panels, pricingSummary, addItem])

  return (
    <Stack gap="lg">
      {panels.map((panel, idx) => {
        const meshCard = MESH_TYPE_CARDS.find(c => c.id === panel.meshType) || MESH_TYPE_CARDS[0]
        const availableColors = meshCard.colors
        const availableRollWidths = meshCard.rollWidths
        const meshHex = MESH_COLOR_SWATCHES.find(c => c.id === panel.meshColor)?.hex || '#1a1a1a'
        const pricing = pricingSummary[idx]

        return (
          <div key={idx}>
            {/* Panel header — always visible */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                <span className="font-bold text-gray-800">Panel {idx + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => duplicatePanel(idx)} className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Duplicate
                </button>
                {panels.length > 1 && (
                  <button type="button" onClick={() => removePanel(idx)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Remove</button>
                )}
              </div>
            </div>

            {/* ── SECTION 1: Mesh Options ── */}
            <HeaderBarSection icon={SlidersHorizontal} label={panels.length > 1 ? `Panel ${idx + 1} — Options` : 'Options'} variant="green" headerSubtitle="Mesh type, color & dimensions">
              <Stack gap="md">
                {/* 5-across mesh thumbnails — click for details modal */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {MESH_TYPE_CARDS.map(m => (
                    <div key={m.id} role="button" tabIndex={0}
                      onClick={() => setMeshDetailType(m.id)}
                      className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${panel.meshType === m.id ? 'border-[#406517] ring-2 ring-[#406517]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="aspect-[4/3] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                        {m.popular && <span className="absolute top-1 right-1 text-[9px] font-bold bg-[#406517] text-white px-1.5 py-0.5 rounded-full leading-none">Popular</span>}
                        {panel.meshType === m.id && <div className="absolute top-1 left-1 w-5 h-5 bg-[#406517] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                      </div>
                      <div className="px-1.5 py-1.5 text-center">
                        <div className="font-bold text-gray-800 text-xs leading-tight">{m.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3-col configurator: Mesh Type | Roll Width (height) | Panel Width */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mesh type dropdown */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Mesh Type</label>
                    <select
                      value={panel.meshType}
                      onChange={e => {
                        const m = MESH_TYPE_CARDS.find(c => c.id === e.target.value)
                        if (!m) return
                        const updates: Partial<RawPanelState> = { meshType: m.id }
                        if (!m.colors.includes(panel.meshColor)) updates.meshColor = m.colors[0]
                        if (!m.rollWidths.includes(panel.rollWidth)) updates.rollWidth = m.rollWidths[0]
                        updatePanel(idx, updates)
                      }}
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all cursor-pointer"
                    >
                      {MESH_TYPE_CARDS.map(m => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Roll width (height) dropdown */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Roll Width (height)</label>
                    <select
                      value={panel.rollWidth}
                      onChange={e => updatePanel(idx, { rollWidth: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all cursor-pointer"
                    >
                      {availableRollWidths.map(rw => (
                        <option key={rw} value={rw}>{rw}&quot; ({fmtFtIn(rw)})</option>
                      ))}
                    </select>
                  </div>

                  {/* Panel width input */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Panel Width</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={panel.widthInches === 0 ? '' : panel.widthInches}
                        onChange={e => {
                          const raw = e.target.value.replace(/[^0-9]/g, '')
                          updatePanel(idx, { widthInches: raw === '' ? 0 : Math.min(1200, parseInt(raw)) })
                        }}
                        onBlur={() => { if (panel.widthInches < 12) updatePanel(idx, { widthInches: 12 }) }}
                        placeholder="inches"
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all"
                      />
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap shrink-0">
                        {panel.widthInches > 0 ? fmtFtIn(panel.widthInches) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-700 font-semibold uppercase tracking-wide">Color:</span>
                  {MESH_COLOR_SWATCHES.filter(c => availableColors.includes(c.id)).map(c => (
                    <button key={c.id} type="button" onClick={() => updatePanel(idx, { meshColor: c.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${panel.meshColor === c.id ? 'ring-2 ring-[#406517] bg-[#406517]/5' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: c.hex }} />
                      <span className="text-gray-700">{c.label}</span>
                      {panel.meshColor === c.id && <Check className="w-3.5 h-3.5 text-[#406517]" />}
                    </button>
                  ))}
                </div>
              </Stack>
            </HeaderBarSection>

            {/* ── SECTION 2: Edge Finishing ── */}
            <div className="mt-4">
              <HeaderBarSection icon={Scissors} label="Edge Finishing" variant="green" headerSubtitle="Choose finishing for each side">
                <Stack gap="md">
                  {/* All-sides toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={panel.allSidesSame}
                        onChange={(e) => {
                          const checked = e.target.checked
                          if (checked) {
                            updatePanel(idx, {
                              allSidesSame: true,
                              rightEdge: panel.topEdge,
                              bottomEdge: panel.topEdge,
                              leftEdge: panel.topEdge,
                            })
                          } else {
                            updatePanel(idx, { allSidesSame: false })
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-[#406517] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Same finishing on all sides</span>
                      <span className="text-xs text-gray-500 block">Apply the same edge option to top, bottom, left, and right</span>
                    </div>
                  </label>

                  {panel.allSidesSame ? (
                    <>
                      {/* Single dropdown for all sides */}
                      <EdgeFinishSelect
                        label="All Sides"
                        value={panel.topEdge}
                        onChange={(v) => updatePanel(idx, { topEdge: v, rightEdge: v, bottomEdge: v, leftEdge: v })}
                        lengthInches={panel.widthInches}
                      />
                      {/* Visual Preview */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <RawPanelPreview panel={panel} meshHex={meshHex} />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* ── Desktop: compass layout — dropdowns on respective sides ── */}
                      {/* ── Mobile: stacked with preview at top ── */}

                      {/* Mobile: stacked dropdowns + preview */}
                      <div className="md:hidden space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <RawPanelPreview panel={panel} meshHex={meshHex} />
                        </div>
                        <EdgeFinishSelect label="Top" value={panel.topEdge} onChange={v => updatePanel(idx, { topEdge: v })} lengthInches={panel.widthInches} />
                        <EdgeFinishSelect label="Right" value={panel.rightEdge} onChange={v => updatePanel(idx, { rightEdge: v })} lengthInches={panel.rollWidth} />
                        <EdgeFinishSelect label="Bottom" value={panel.bottomEdge} onChange={v => updatePanel(idx, { bottomEdge: v })} lengthInches={panel.widthInches} />
                        <EdgeFinishSelect label="Left" value={panel.leftEdge} onChange={v => updatePanel(idx, { leftEdge: v })} lengthInches={panel.rollWidth} />
                      </div>

                      {/* Desktop: compass layout */}
                      <div className="hidden md:block">
                        {/* Top dropdown — centered above preview */}
                        <div className="max-w-xs mx-auto mb-3">
                          <EdgeFinishSelect label="Top" value={panel.topEdge} onChange={v => updatePanel(idx, { topEdge: v })} lengthInches={panel.widthInches} />
                        </div>

                        {/* Middle row: Left | Preview | Right */}
                        <div className="flex items-center gap-4">
                          <div className="w-48 shrink-0">
                            <EdgeFinishSelect label="Left" value={panel.leftEdge} onChange={v => updatePanel(idx, { leftEdge: v })} lengthInches={panel.rollWidth} />
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 min-w-0">
                            <RawPanelPreview panel={panel} meshHex={meshHex} />
                          </div>
                          <div className="w-48 shrink-0">
                            <EdgeFinishSelect label="Right" value={panel.rightEdge} onChange={v => updatePanel(idx, { rightEdge: v })} lengthInches={panel.rollWidth} />
                          </div>
                        </div>

                        {/* Bottom dropdown — centered below preview */}
                        <div className="max-w-xs mx-auto mt-3">
                          <EdgeFinishSelect label="Bottom" value={panel.bottomEdge} onChange={v => updatePanel(idx, { bottomEdge: v })} lengthInches={panel.widthInches} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Panel price breakdown */}
                  {pricing && (
                    <div className="bg-[#406517]/5 rounded-xl px-4 py-3 border border-[#406517]/10">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Panel Price Breakdown</div>
                      <div className="space-y-1 text-sm">
                        {/* Mesh cost */}
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Mesh — {meshCard.label} {panel.rollWidth}&quot;
                            <span className="text-gray-400 ml-1">({fmtFtIn(panel.widthInches)} @ {pricing.perFootRate > 0 ? `$${pricing.perFootRate.toFixed(2)}/ft` : '...'})</span>
                          </span>
                          <span className="font-semibold tabular-nums">
                            {pricing.meshCost > 0 ? fmt$(pricing.meshCost) : <span className="text-gray-400">--</span>}
                          </span>
                        </div>

                        {/* Edge costs */}
                        {[
                          { label: 'Top', cost: pricing.topCost, edge: panel.topEdge, len: panel.widthInches },
                          { label: 'Bottom', cost: pricing.bottomCost, edge: panel.bottomEdge, len: panel.widthInches },
                          { label: 'Left', cost: pricing.leftCost, edge: panel.leftEdge, len: panel.rollWidth },
                          { label: 'Right', cost: pricing.rightCost, edge: panel.rightEdge, len: panel.rollWidth },
                        ].map(({ label, cost, edge, len }) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-gray-600">
                              {label} — {EDGE_LABEL_SHORT[edge]}
                              <span className="text-gray-400 ml-1">({fmtFtIn(len)})</span>
                            </span>
                            <span className="font-semibold tabular-nums">
                              {cost != null ? (cost > 0 ? fmt$(cost) : 'Free') : <span className="text-gray-400 italic font-normal">Quote</span>}
                            </span>
                          </div>
                        ))}

                        {/* Panel total */}
                        <div className="flex justify-between border-t border-[#406517]/20 pt-2 mt-2 font-bold text-base">
                          <span className="text-gray-800">Panel Total</span>
                          <span className="text-[#406517]">
                            {pricing.panelTotal != null ? fmt$(pricing.panelTotal) : <span className="text-gray-500 italic font-normal text-sm">Requires quote for webbing</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Stack>
              </HeaderBarSection>
            </div>
          </div>
        )
      })}

      {/* Add Panel Button */}
      <div className="flex justify-center">
        <button type="button" onClick={addPanel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-[#406517] hover:text-[#406517] hover:bg-[#406517]/5 transition-all">
          <Plus className="w-4 h-4" /> Add Another Panel
        </button>
      </div>

      {/* ══════════════════════════════════════════════
         SECTION 1: ORDER SUMMARY
         ══════════════════════════════════════════════ */}
      <HeaderBarSection icon={ClipboardList} label="Order Summary" variant="green" headerSubtitle={`${panels.length} panel${panels.length !== 1 ? 's' : ''} configured`}>
        <div className="space-y-3">
          {panels.map((p, i) => {
            const meshLabel = MESH_TYPE_CARDS.find(c => c.id === p.meshType)?.label || p.meshType
            const colorLabel = MESH_COLOR_SWATCHES.find(c => c.id === p.meshColor)?.label || p.meshColor
            const pricing = pricingSummary[i]
            return (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  {panels.length > 1 && (
                    <div className="w-6 h-6 rounded-full bg-[#406517] text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{meshLabel} — {colorLabel}</div>
                    <div className="text-xs text-gray-500">
                      {fmtFtIn(p.widthInches)} W &times; {fmtFtIn(p.rollWidth)} H
                      <span className="mx-1.5 text-gray-300">|</span>
                      Edges: {EDGE_LABEL_SHORT[p.topEdge]} / {EDGE_LABEL_SHORT[p.rightEdge]} / {EDGE_LABEL_SHORT[p.bottomEdge]} / {EDGE_LABEL_SHORT[p.leftEdge]}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  {pricing.panelTotal != null ? (
                    <span className="text-sm font-bold text-[#406517]">{fmt$(pricing.panelTotal)}</span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Quote needed</span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Grand total */}
          <div className="flex items-center justify-between pt-3 border-t border-[#406517]/20">
            <span className="text-base font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-[#406517]">
              {grandTotal != null ? fmt$(grandTotal) : (
                anyNeedsQuote
                  ? <span className="text-sm text-gray-500 italic font-normal">Webbing requires quote</span>
                  : <span className="text-sm text-gray-400 font-normal">--</span>
              )}
            </span>
          </div>
        </div>
      </HeaderBarSection>

      {/* ══════════════════════════════════════════════
         SECTION 2: SAVE YOUR PROJECT
         ══════════════════════════════════════════════ */}
      <Card className="!p-0 !bg-white !border-2 !border-[#406517]/20 overflow-hidden">
        {/* Centered header */}
        <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <Bookmark className="w-6 h-6 text-[#406517]" />
            <h3 className="text-xl font-bold text-gray-900">Save Your Project</h3>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get a shareable link emailed to you. Come back anytime to edit, review, or order. No commitment.
          </p>
        </div>

        {/* Full-width form content */}
        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5">
          {saveStatus === 'saved' ? (
            /* ── Saved success state ── */
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#406517]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Project Saved{firstName ? ` for ${firstName}` : ''}!</span>
              </div>
              {shareUrl && (
                <div className="flex items-center gap-2 bg-[#406517]/5 border border-[#406517]/20 rounded-xl px-4 py-3">
                  <Link2 className="w-4 h-4 text-[#406517] shrink-0" />
                  <span className="text-sm font-mono text-[#406517] truncate flex-1">
                    {typeof window !== 'undefined' ? window.location.origin : ''}{shareUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${shareUrl}`
                      navigator.clipboard.writeText(fullUrl)
                    }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-[#406517]/10 transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4 text-[#406517]" />
                  </button>
                </div>
              )}
              <Text size="xs" className="text-gray-500 !mb-0 text-center">
                We&apos;ve emailed your project link to <strong>{email}</strong>. You can return anytime to edit or submit for review.
              </Text>
              <div className="text-center">
                <button type="button" onClick={() => setSaveStatus('idle')} className="text-xs text-[#406517] font-medium underline underline-offset-2 hover:text-[#2e4a10] transition-colors">
                  Edit project details
                </button>
              </div>
            </div>
          ) : (
            /* ── Save form ── */
            <div className="space-y-3">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Project name (e.g. &quot;Porch Enclosure&quot;)" value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="First name *" value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
                </div>
              </div>
              <textarea
                placeholder="Notes for yourself (optional) — what is this project for?"
                value={saveDescription}
                onChange={e => setSaveDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors resize-none"
              />
              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveProject}
                  disabled={!isValidEmail(email) || !firstName.trim() || saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : saveStatus === 'error' ? (
                    <>Try Again</>
                  ) : (
                    <><Bookmark className="w-4 h-4 mr-2" /> Save Project</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ══════════════════════════════════════════════
         SECTION 3: SUBMIT YOUR DESIGN
         ══════════════════════════════════════════════ */}
      {submitStatus !== 'submitted' ? (
        <Card className="!p-0 !bg-white !border-2 !border-[#406517]/20 overflow-hidden">
          {/* Centered header */}
          <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              <Send className="w-6 h-6 text-[#406517]" />
              <h3 className="text-xl font-bold text-gray-900">Submit Your Design</h3>
            </div>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Every project gets a free human review before it&apos;s built. We&apos;ll confirm pricing, check your specs, and email you a checkout link or suggest adjustments.
            </p>
            {projectSaved && (
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[#406517]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="font-medium">Auto-filled from your saved project</span>
              </div>
            )}
          </div>

          {/* Full-width form content */}
          <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5 space-y-3">
            {/* Project name (auto-populated) */}
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Project name *" value={projectName} onChange={e => setProjectName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="First name *" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
              </div>
            </div>

            {/* Photos upload */}
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#406517] hover:bg-[#406517]/5 transition-colors group">
              <Camera className="w-5 h-5 text-gray-400 group-hover:text-[#406517] transition-colors" />
              <div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#406517] transition-colors">Upload photos of your space</span>
                <span className="block text-xs text-gray-400">Optional — helps us give the best recommendation</span>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" />
            </label>

            {/* Description */}
            <textarea
              placeholder="Describe your project — what are you building? Any special requirements or questions for our team?"
              value={submitDescription}
              onChange={e => setSubmitDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors resize-none"
            />

            {/* Submit + Order buttons */}
            <div className="space-y-3 pt-1 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitProject}
                disabled={!isValidEmail(email) || !firstName.trim() || submitStatus === 'submitting'}
              >
                {submitStatus === 'submitting' ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : submitStatus === 'error' ? (
                  <>Try Again</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 mr-2" /> Submit for Free Expert Review</>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Order Now */}
              {grandTotal != null && !anyNeedsQuote ? (
                <div className="space-y-1">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Order Now — {fmt$(grandTotal)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Text size="xs" className="text-gray-400 !mb-0">
                    For customers who know exactly what they need.
                  </Text>
                </div>
              ) : (
                <div className="space-y-1">
                  <Button variant="secondary" size="lg" className="opacity-50" disabled>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {anyNeedsQuote ? 'Webbing options require expert review' : 'Enter panel dimensions to order'}
                  </Button>
                  <Text size="xs" className="text-gray-400 !mb-0">
                    {anyNeedsQuote
                      ? 'Panels with heavy webbing need a custom quote. Submit for review above.'
                      : 'Set your panel width to see pricing and enable direct ordering.'}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        /* ── Submitted Success ── */
        <Card className="!p-0 !bg-white !border-2 !border-[#406517]/30 overflow-hidden">
          <div className="px-6 py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-gray-800 mb-1">Design Submitted{firstName ? `, ${firstName}` : ''}!</div>
            <div className="text-sm text-gray-600 mb-4">Our team will review your panel configuration and reach out with a detailed quote or checkout link.</div>
            {shareUrl && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Project link:</span>
                <span className="text-xs font-mono text-[#406517]">{typeof window !== 'undefined' ? window.location.origin : ''}{shareUrl}</span>
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${shareUrl}`
                    navigator.clipboard.writeText(fullUrl)
                  }}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => setSubmitStatus('idle')}>
              Edit & Resubmit
            </Button>
          </div>
        </Card>
      )}

      {/* ── Mesh detail modal ── */}
      {meshDetailType && (() => {
        const m = MESH_TYPE_CARDS.find(c => c.id === meshDetailType)
        if (!m) return null
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMeshDetailType(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <button type="button" onClick={() => setMeshDetailType(null)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt={m.label} className="w-full aspect-video object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{m.label}</h3>
                <p className="text-sm text-gray-500 mb-3">{m.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{m.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                  <div><span className="font-semibold text-gray-700">Colors:</span> {m.colors.map(c => MESH_COLOR_SWATCHES.find(s => s.id === c)?.label || c).join(', ')}</div>
                  <div><span className="font-semibold text-gray-700">Roll widths:</span> {m.rollWidths.map(rw => `${rw}" (${fmtFtIn(rw)})`).join(', ')}</div>
                </div>
                <Button variant="primary" size="md" onClick={() => setMeshDetailType(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Checkout confirmation modal ── */}
      {showCheckoutModal && grandTotal != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCheckoutModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8">
            <button type="button" onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-3">Skip expert review?</div>
              <Text className="text-gray-600 !mb-2">
                Most customers have us double-check their panels first.
              </Text>
              <Text size="sm" className="text-gray-500 !mb-4">
                We&apos;ll still review your order before it ships. Proceed to checkout for {panels.length} panel{panels.length !== 1 ? 's' : ''} totaling <strong className="text-[#406517]">{fmt$(grandTotal)}</strong>?
              </Text>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="primary" size="lg" onClick={() => setShowCheckoutModal(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Expert Review
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/cart" onClick={() => { handleOrderNow(); setShowCheckoutModal(false) }}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart & Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Stack>
  )
}
