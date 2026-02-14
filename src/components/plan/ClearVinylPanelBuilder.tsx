'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Card,
  Text,
  Stack,
  Button,
  HeaderBarSection,
} from '@/lib/design-system'
import {
  CheckCircle, Loader2, Info, ChevronDown, ChevronUp,
  Check, Play, X,
  SlidersHorizontal, LayoutGrid, Mail, User, ShieldCheck, Bookmark, Camera,
  Phone, Image as ImageIcon, FileText, Copy, Link2, Send, Ruler,
} from 'lucide-react'
import type {
  VinylPanelSize,
  CanvasColor,
  VinylTopAttachment,
  VelcroColor,
} from '@/lib/pricing/types'
import { useProducts, getProductOptions } from '@/hooks/useProducts'
import { PhotoUploader, type UploadedPhoto } from '@/components/project'

/* ─── Measurement guide images ─── */
const MEASURE_IMAGES = {
  width: {
    main: 'https://media.mosquitocurtains.com/site-assets/measurements/measurement-1-inside-edges.jpg',
    examples: [
      'https://media.mosquitocurtains.com/site-assets/measurements/measurement-1-example-1.jpg',
      'https://media.mosquitocurtains.com/site-assets/measurements/measurement-1-example-2-.jpg',
    ],
  },
  height: {
    main: 'https://media.mosquitocurtains.com/site-assets/measurements/measurement-2-height.jpg',
    examples: [
      'https://media.mosquitocurtains.com/site-assets/measurements/measurement-2-examle-1.jpg',
      'https://media.mosquitocurtains.com/site-assets/measurements/measurement-2-example-2.jpg',
    ],
  },
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Clear Vinyl specific types
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
type ClearVinylSideAttachment = 'none' | 'marine_snaps' | 'zipper_door' | 'zippered_stucco_strip'

/* ─── Max vinyl height — remaining is Sunbrella canvas ─── */
const MAX_VINYL_HEIGHT = 72

/* ─── Panel size auto-detection ─── */
function getSizeTier(heightInches: number): VinylPanelSize {
  if (heightInches < 48) return 'short'
  if (heightInches <= 96) return 'medium'
  return 'tall'
}

/* ─── Panel size definitions ─── */
const VINYL_PANEL_SIZES: { id: VinylPanelSize; label: string; range: string; pricePerFoot: number; hasCanvasColor: boolean; popular?: boolean }[] = [
  { id: 'short', label: 'Short', range: 'Under 48"', pricePerFoot: 28, hasCanvasColor: false },
  { id: 'medium', label: 'Medium', range: '48" – 96"', pricePerFoot: 34, hasCanvasColor: true, popular: true },
  { id: 'tall', label: 'Tall', range: 'Over 96"', pricePerFoot: 41, hasCanvasColor: true },
]

/* ─── Enriched option type used for top attachments ─── */
type TopAttachOption = {
  id: VinylTopAttachment
  label: string
  subtitle: string
  description: string
  image?: string
  isGif?: boolean
  showsVelcroColor?: boolean
  popular?: boolean
}

/* ─── Enriched option type used for canvas colors ─── */
type CanvasColorOption = {
  id: CanvasColor
  label: string
  hex: string
  image?: string
}

const IMG_BASE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

/* ─── Top attachment UI enrichment (keyed by option_value) ─── */
const TOP_ATTACH_UI: Record<string, { subtitle: string; description: string; fallbackImage?: string; isGif?: boolean; showsVelcroColor?: boolean; popular?: boolean }> = {
  velcro: {
    subtitle: 'Fixed in place',
    description: 'Panel attaches with industrial-strength Velcro along the top. Simple installation.',
    fallbackImage: `${IMG_BASE}/2019/09/CV-TRACK-4-OPTIMIZED.gif`,
    isGif: true,
    showsVelcroColor: true,
    popular: true,
  },
  standard_track: {
    subtitle: 'Slides side-to-side',
    description: 'Panels slide along a ceiling-mounted track. Easy open/close access.',
    fallbackImage: `${IMG_BASE}/2019/09/CV-TRACK-12.5-OPTIMIZED.gif`,
    isGif: true,
  },
  heavy_track: {
    subtitle: 'For panels over 10ft tall',
    description: 'Extra durability for larger, heavier clear vinyl panels.',
  },
  binding_only: {
    subtitle: 'Finished edge, no hardware',
    description: 'Just the sewn edge — no track or velcro. You supply your own attachment.',
  },
  special_rigging: {
    subtitle: 'Custom solutions',
    description: 'For unique mounting situations — our team will work with you.',
  },
}

/* ─── Canvas color UI enrichment (keyed by option_value) ─── */
const CANVAS_COLOR_UI: Record<string, { hex: string; image?: string }> = {
  black: { hex: '#1a1a1a', image: `${IMG_BASE}/2019/08/07-Winterized-Porch-Plastic-Panels-Black-Canvas-1200.jpg` },
  ashen_gray: { hex: '#B2BEB5', image: `${IMG_BASE}/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg` },
  cocoa_brown: { hex: '#D2691E', image: `${IMG_BASE}/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200.jpg` },
  royal_blue: { hex: '#4169E1', image: `${IMG_BASE}/2019/08/02-Plastic-Enclosures-Royal-Blue-Canvas-Tent-1200.jpg` },
  navy_blue: { hex: '#000080', image: `${IMG_BASE}/2020/11/7-Navy-Clear-Vinyl-Enclosure.jpg` },
  moss_green: { hex: '#8A9A5B', image: `${IMG_BASE}/2019/08/00-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Church-1200.jpg` },
  forest_green: { hex: '#228B22', image: `${IMG_BASE}/2019/08/04_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200.jpg` },
  sandy_tan: { hex: '#D2B48C', image: `${IMG_BASE}/2019/08/08-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-Beach-House-1200.jpg` },
  burgundy: { hex: '#800020' },
  clear_top_to_bottom: { hex: '#E8F4F8', image: `${IMG_BASE}/2019/08/18-Clear-Plastic-Gazebo-With-No-Canvas-1200.jpg` },
  tbd: { hex: '#cccccc' },
}

/* ─── Side attachment options ─── */
const SIDE_LABEL_MAP: Record<ClearVinylSideAttachment, string> = {
  none: 'Open',
  marine_snaps: 'Snaps',
  zipper_door: 'Zipper',
  zippered_stucco_strip: 'Zip Stucco',
}

const TOP_LABEL_MAP: Record<VinylTopAttachment, string> = {
  standard_track: 'Std Track',
  heavy_track: 'Hvy Track',
  velcro: 'Velcro',
  binding_only: 'Binding',
  special_rigging: 'Special',
}

/* ─── Constants ─── */
const BLUE = '#003365'
const BLUE_LIGHT = '#1a5a9a'
const SNAP_COUNT = 5
const INPUT_CLS = 'w-20 px-2 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] bg-white transition-colors'
const SELECT_CLS = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] bg-white transition-all cursor-pointer appearance-none'
const LS_KEY = 'mc_clear_vinyl_builder'

/* ─── Side Builder Configuration Options ─── */
interface SideConfig { id: string; label: string; description: string; panelCount: number; splitType: ClearVinylSideAttachment }

const SIDE_CONFIGS: SideConfig[] = [
  { id: 'single', label: '1 Panel', description: 'Full width, no split', panelCount: 1, splitType: 'none' },
  { id: '2-zip', label: '2 Panels', description: 'Zipper doorway between', panelCount: 2, splitType: 'zipper_door' },
]

const OUTER_EDGE_OPTIONS: { value: ClearVinylSideAttachment; label: string; image?: string; adj: string }[] = [
  { value: 'none', label: 'None', adj: '+0"' },
  { value: 'marine_snaps', label: 'Marine Snaps', image: '/images/products/marine-snaps.png', adj: '+1"' },
  { value: 'zippered_stucco_strip', label: 'Zippered Stucco Strip', adj: '-1"' },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Types
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ClearVinylWidthBreakdown {
  base: number; side1Add: number; side2Add: number; relaxedFitAdd: number; total: number;
}
interface ClearVinylHeightBreakdown {
  base: number; overlapAdd: number; topAdd: number; total: number;
}
export interface ClearVinylSavedPanel {
  id: string; finalWidth: number; finalHeight: number; rawWidth: number; rawHeight: number;
  topAttachment: VinylTopAttachment; side1: ClearVinylSideAttachment; side2: ClearVinylSideAttachment; side: number;
  widthBreakdown: ClearVinylWidthBreakdown; heightBreakdown: ClearVinylHeightBreakdown;
  vinylHeight: number; canvasHeight: number;
}

export interface ClearVinylSideState {
  totalWidth: string; leftHeight: string; rightHeight: string; configId: string;
  topAttachment: VinylTopAttachment; leftEdge: ClearVinylSideAttachment; rightEdge: ClearVinylSideAttachment;
}

export function defaultClearVinylSideState(): ClearVinylSideState {
  return {
    totalWidth: '240', leftHeight: '96', rightHeight: '96',
    configId: '2-zip', topAttachment: 'standard_track',
    leftEdge: 'marine_snaps', rightEdge: 'marine_snaps',
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Panel dimension calculator (clear vinyl)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SIDE_VALUES: Record<ClearVinylSideAttachment, number> = {
  none: 0,
  marine_snaps: 1,
  zipper_door: 1,
  zippered_stucco_strip: -1,
}

const TOP_HEIGHT_VALUES: Record<VinylTopAttachment, number> = {
  standard_track: 0,
  heavy_track: 0,
  velcro: 2,
  binding_only: 0,
  special_rigging: 0,
}

function isTrackAttachment(top: VinylTopAttachment): boolean {
  return top === 'standard_track' || top === 'heavy_track'
}

function calculateClearVinylPanel(inputs: {
  widthInches: number; heightInches: number;
  topAttachment: VinylTopAttachment; side1Attachment: ClearVinylSideAttachment; side2Attachment: ClearVinylSideAttachment;
}) {
  const { widthInches, heightInches, topAttachment, side1Attachment, side2Attachment } = inputs
  const side1Add = SIDE_VALUES[side1Attachment] ?? 0
  const side2Add = SIDE_VALUES[side2Attachment] ?? 0
  const relaxedFitAdd = isTrackAttachment(topAttachment) ? Math.round(widthInches / 120) : 0
  const finalWidth = Math.round(widthInches + side1Add + side2Add + relaxedFitAdd)
  const overlapAdd = 2
  const topAdd = TOP_HEIGHT_VALUES[topAttachment] ?? 0
  const finalHeight = heightInches + overlapAdd + topAdd

  // Vinyl vs canvas split
  const vinylHeight = Math.min(MAX_VINYL_HEIGHT, heightInches)
  const canvasHeight = Math.max(0, heightInches - MAX_VINYL_HEIGHT)

  return {
    rawWidth: widthInches, rawHeight: heightInches, finalWidth, finalHeight,
    widthBreakdown: { base: widthInches, side1Add, side2Add, relaxedFitAdd, total: finalWidth } as ClearVinylWidthBreakdown,
    heightBreakdown: { base: heightInches, overlapAdd, topAdd, total: finalHeight } as ClearVinylHeightBreakdown,
    vinylHeight, canvasHeight,
  }
}

/* ─── Hooks ─── */
function useIsDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => { const m = window.matchMedia('(min-width: 768px)'); setD(m.matches); const h = (e: MediaQueryListEvent) => setD(e.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h) }, [])
  return d
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Modal overlay
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LightboxModal({ open, onClose, title, image, isGif, children }: { open: boolean; onClose: () => void; title: string; image: string; isGif?: boolean; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"><X className="w-5 h-5 text-white" /></button>
        <div className="relative bg-gray-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className={`w-full max-h-[55vh] ${isGif ? 'object-contain' : 'object-cover'}`} />
          {isGif && <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"><Play className="w-3 h-3" /> Animated</div>}
        </div>
        <div className="bg-white px-5 py-4 shrink-0">{children}</div>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Measurement Guide Modal
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MeasurementGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'width' | 'height'>('width')
  if (!open) return null
  const data = tab === 'width' ? MEASURE_IMAGES.width : MEASURE_IMAGES.height
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
        <div className="px-6 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 mb-1"><Ruler className="w-5 h-5 text-[#003365]" /><span className="text-lg font-bold text-gray-800">How to Measure</span></div>
          <p className="text-sm text-gray-500">Measure in inches from inside edge to inside edge.</p>
        </div>
        <div className="flex px-6 gap-2 border-b border-gray-200 shrink-0">
          {(['width', 'height'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors capitalize ${tab === t ? 'border-[#003365] text-[#003365]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
          ))}
        </div>
        <div className="overflow-y-auto p-6">
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.main} alt={`How to measure ${tab}`} className="w-full" />
          </div>
          <div className="flex items-start gap-2.5 bg-[#003365]/5 rounded-lg px-4 py-3 mb-4">
            <Info className="w-4 h-4 text-[#003365] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">
              {tab === 'width'
                ? 'Measure the total width from inside edge to inside edge. We split panels automatically if you choose a 2-panel layout.'
                : 'Measure height at both left and right sides — porches often have different heights.'}
            </p>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Examples</div>
          <div className="grid grid-cols-2 gap-3">
            {data.examples.map((src, i) => (
              <div key={src} className="rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${tab} measurement example ${i + 1}`} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Product image thumbnail
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProductThumb({ src, alt }: { src: string; alt: string }) {
  return <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0"><Image src={src} alt={alt} width={40} height={40} className="object-cover w-full h-full" /></div>
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG: Zipper teeth helper (zigzag line)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ZipperTeethVertical({ x, y1, y2, toothWidth = 3 }: { x: number; y1: number; y2: number; toothWidth?: number }) {
  const length = y2 - y1
  const numTeeth = Math.max(4, Math.floor(length / 6))
  const step = length / numTeeth
  let d = `M ${x} ${y1}`
  for (let i = 0; i < numTeeth; i++) {
    const yStart = y1 + i * step
    const yMid = yStart + step / 2
    const yEnd = yStart + step
    d += ` L ${x + toothWidth} ${yMid} L ${x} ${yEnd}`
  }
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#888" strokeWidth={2} />
      <path d={d} fill="none" stroke="#c0a000" strokeWidth={1.2} />
      {(() => {
        let d2 = `M ${x} ${y1}`
        for (let i = 0; i < numTeeth; i++) {
          const yStart = y1 + i * step; const yMid = yStart + step / 2; const yEnd = yStart + step
          d2 += ` L ${x - toothWidth} ${yMid} L ${x} ${yEnd}`
        }
        return <path d={d2} fill="none" stroke="#c0a000" strokeWidth={1.2} />
      })()}
      <rect x={x - 2.5} y={y1 - 3} width={5} height={6} fill="#999" stroke="#666" strokeWidth={0.5} rx={1} />
    </g>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG Panel Visualizer (clear vinyl + canvas filler)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ClearVinylPanelVisualizer({ finalWidth, finalHeight, rawWidth, rawHeight, maxSize = 340, topAttachment, side1, side2, canvasHeight, vinylHeight, canvasHex }: {
  finalWidth: number; finalHeight: number; rawWidth: number; rawHeight: number; maxSize?: number;
  topAttachment: VinylTopAttachment; side1: ClearVinylSideAttachment; side2: ClearVinylSideAttachment;
  canvasHeight: number; vinylHeight: number; canvasHex: string;
}) {
  const base = useMemo(() => {
    if (finalWidth <= 0 || finalHeight <= 0) return null
    const a = finalWidth / finalHeight; const c = maxSize - 100
    let w: number, h: number
    if (a >= 1) { w = c; h = c / a } else { h = c; w = c * a }
    return { w: Math.max(100, w), h: Math.max(80, h) }
  }, [finalWidth, finalHeight, maxSize])

  if (!base) return null
  const { w, h } = base
  const stuccoW = Math.max(12, Math.round(w * 0.05))

  // Canvas/vinyl split ratio in px
  const totalRawH = vinylHeight + canvasHeight
  const vinylPx = totalRawH > 0 ? Math.round((vinylHeight / totalRawH) * h) : h
  const canvasPx = h - vinylPx

  const leftExtra = side1 === 'zippered_stucco_strip' ? stuccoW + 16 : side1 === 'zipper_door' ? 12 : side1 === 'marine_snaps' ? 10 : 4
  const rightExtra = side2 === 'zippered_stucco_strip' ? stuccoW + 16 : side2 === 'zipper_door' ? 12 : side2 === 'marine_snaps' ? 10 : 4
  const px = leftExtra + 36; const py = 36
  const svgW = px + w + rightExtra + 24; const svgH = py + h + 34
  const snapYs = Array.from({ length: SNAP_COUNT }, (_, i) => py + (h / (SNAP_COUNT + 1)) * (i + 1))
  const snapXs = Array.from({ length: SNAP_COUNT }, (_, i) => px + (w / (SNAP_COUNT + 1)) * (i + 1))
  const isTrack = isTrackAttachment(topAttachment)

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="block mx-auto">
      <defs>
        <linearGradient id="cvGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8f4fd" /><stop offset="50%" stopColor="#f0f8ff" /><stop offset="100%" stopColor="#dceef9" />
        </linearGradient>
        <marker id="cvAR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6" fill={BLUE_LIGHT} /></marker>
        <marker id="cvAL" markerWidth={6} markerHeight={6} refX={1} refY={3} orient="auto"><path d="M6,0 L0,3 L6,6" fill={BLUE_LIGHT} /></marker>
        <marker id="cvAD" markerWidth={6} markerHeight={6} refX={3} refY={5} orient="auto"><path d="M0,0 L3,6 L6,0" fill={BLUE_LIGHT} /></marker>
        <marker id="cvAU" markerWidth={6} markerHeight={6} refX={3} refY={1} orient="auto"><path d="M0,6 L3,0 L6,6" fill={BLUE_LIGHT} /></marker>
      </defs>

      {/* ── Clear vinyl section (top portion) ── */}
      <rect x={px} y={py} width={w} height={vinylPx} fill="url(#cvGrad)" stroke={BLUE} strokeWidth={2.5} rx={canvasPx > 0 ? 4 : 4} />
      {/* Subtle transparency lines */}
      {Array.from({ length: Math.floor(w / 20) }).map((_, i) => (
        <line key={`gl${i}`} x1={px + 10 + i * 20} y1={py + 3} x2={px + 10 + i * 20} y2={py + vinylPx - 3} stroke={BLUE} strokeWidth={0.2} opacity={0.12} />
      ))}
      {/* Reflection highlights */}
      <rect x={px + 8} y={py + vinylPx * 0.15} width={w * 0.3} height={2} fill="white" opacity={0.5} rx={1} />
      <rect x={px + w * 0.5} y={py + vinylPx * 0.35} width={w * 0.25} height={1.5} fill="white" opacity={0.35} rx={1} />
      {/* "CLEAR VINYL" label */}
      <text x={px + w / 2} y={py + vinylPx / 2 + 4} textAnchor="middle" fontSize={10} fill={BLUE} fontWeight={600} fontFamily="system-ui" opacity={0.4}>
        {vinylHeight}&quot; Clear Vinyl
      </text>

      {/* ── Sunbrella canvas section (bottom portion) ── */}
      {canvasPx > 0 && (
        <g>
          <rect x={px} y={py + vinylPx} width={w} height={canvasPx} fill={canvasHex} stroke={BLUE} strokeWidth={2.5} />
          {/* Stitch line between vinyl and canvas */}
          <line x1={px + 4} y1={py + vinylPx} x2={px + w - 4} y2={py + vinylPx} stroke="white" strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />
          {/* Canvas texture */}
          {Array.from({ length: Math.floor(w / 12) }).map((_, i) => (
            <line key={`ct${i}`} x1={px + 6 + i * 12} y1={py + vinylPx + 2} x2={px + 6 + i * 12} y2={py + h - 2} stroke="white" strokeWidth={0.3} opacity={0.15} />
          ))}
          {/* Canvas label */}
          {canvasPx > 16 && (
            <text x={px + w / 2} y={py + vinylPx + canvasPx / 2 + 4} textAnchor="middle" fontSize={9} fill="white" fontWeight={600} fontFamily="system-ui" opacity={0.7}>
              {canvasHeight}&quot; Canvas
            </text>
          )}
        </g>
      )}

      {/* Outer border around entire panel */}
      <rect x={px} y={py} width={w} height={h} fill="none" stroke={BLUE} strokeWidth={2.5} rx={4} />

      {/* ── Top attachment ── */}
      {isTrack ? (
        <>
          <rect x={px - 6} y={py - 12} width={w + 12} height={10} fill="#444" rx={3} />
          <rect x={px - 3} y={py - 10} width={w + 6} height={6} fill="#666" rx={2} />
          {snapXs.map((cx, i) => (<g key={`tc${i}`}><circle cx={cx} cy={py - 4} r={3} fill="#222" /><line x1={cx} y1={py - 1} x2={cx} y2={py + 2} stroke="#333" strokeWidth={1.5} /></g>))}
        </>
      ) : topAttachment === 'velcro' ? (
        <rect x={px} y={py - 5} width={w} height={5} fill="#B8860B" rx={1} opacity={0.8} />
      ) : null}

      {/* ── Left edge ── */}
      {side1 === 'marine_snaps' && snapYs.map((cy, i) => (<g key={`ls${i}`}><circle cx={px} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} /><circle cx={px} cy={cy} r={1.8} fill="#555" /></g>))}
      {side1 === 'zipper_door' && <ZipperTeethVertical x={px - 2} y1={py + 4} y2={py + h - 4} toothWidth={3} />}
      {side1 === 'zippered_stucco_strip' && (
        <g>
          <rect x={px - stuccoW - 4} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (<line key={`st1t${i}`} x1={px - stuccoW - 3} y1={py + 4 + i * 8} x2={px - 5} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />))}
          <ZipperTeethVertical x={px - 2} y1={py + 4} y2={py + h - 4} toothWidth={2.5} />
          {snapYs.map((cy, i) => (<g key={`st1s${i}`}><circle cx={px - stuccoW - 4} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} /><circle cx={px - stuccoW - 4} cy={cy} r={1.4} fill="#555" /></g>))}
        </g>
      )}

      {/* ── Right edge ── */}
      {side2 === 'marine_snaps' && snapYs.map((cy, i) => (<g key={`rs${i}`}><circle cx={px + w} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} /><circle cx={px + w} cy={cy} r={1.8} fill="#555" /></g>))}
      {side2 === 'zipper_door' && <ZipperTeethVertical x={px + w + 2} y1={py + 4} y2={py + h - 4} toothWidth={3} />}
      {side2 === 'zippered_stucco_strip' && (
        <g>
          <rect x={px + w + 4} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (<line key={`st2t${i}`} x1={px + w + 5} y1={py + 4 + i * 8} x2={px + w + stuccoW + 3} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />))}
          <ZipperTeethVertical x={px + w + 2} y1={py + 4} y2={py + h - 4} toothWidth={2.5} />
          {snapYs.map((cy, i) => (<g key={`st2s${i}`}><circle cx={px + w + stuccoW + 4} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} /><circle cx={px + w + stuccoW + 4} cy={cy} r={1.4} fill="#555" /></g>))}
        </g>
      )}

      {/* Floor line */}
      <line x1={px - 12} y1={py + h + 4} x2={px + w + 12} y2={py + h + 4} stroke="#aaa" strokeWidth={1} strokeDasharray="4,3" />
      {/* Width dimension */}
      <line x1={px} y1={py + h + 18} x2={px + w} y2={py + h + 18} stroke={BLUE_LIGHT} strokeWidth={1} markerEnd="url(#cvAR)" markerStart="url(#cvAL)" />
      <text x={px + w / 2} y={py + h + 30} textAnchor="middle" fontSize={11} fill={BLUE} fontWeight={700} fontFamily="system-ui">{rawWidth}&quot; raw  &#x2192;  {finalWidth}&quot; cut</text>
      {/* Height dimension */}
      <line x1={px - 22} y1={py} x2={px - 22} y2={py + h} stroke={BLUE_LIGHT} strokeWidth={1} markerEnd="url(#cvAD)" markerStart="url(#cvAU)" />
      <text x={px - 30} y={py + h / 2 + 3} textAnchor="middle" fontSize={11} fill={BLUE} fontWeight={700} fontFamily="system-ui" transform={`rotate(-90 ${px - 30} ${py + h / 2 + 3})`}>{finalHeight}&quot;</text>
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Inline Measurement Breakdown
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function BreakdownInline({ panel }: { panel: ClearVinylSavedPanel }) {
  const [open, setOpen] = useState(false)
  const wb = panel.widthBreakdown; const hb = panel.heightBreakdown
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 transition-colors">
        <Info className="w-3 h-3" /><span>How we calculate</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="mt-2 bg-white/80 rounded-lg border border-gray-200 p-2.5 text-[11px] space-y-2">
          <div>
            <div className="font-bold text-gray-600 uppercase text-[9px] tracking-wider mb-0.5">Width</div>
            <div className="space-y-0.5">
              <div className="flex justify-between"><span className="text-gray-700">Measured width</span><span className="font-mono text-gray-800">{wb.base}&quot;</span></div>
              {wb.side1Add !== 0 && <div className="flex justify-between"><span className="text-gray-700">Left ({SIDE_LABEL_MAP[panel.side1]})</span><span className="font-mono text-gray-800">{wb.side1Add > 0 ? '+' : ''}{wb.side1Add}&quot;</span></div>}
              {wb.side2Add !== 0 && <div className="flex justify-between"><span className="text-gray-700">Right ({SIDE_LABEL_MAP[panel.side2]})</span><span className="font-mono text-gray-800">{wb.side2Add > 0 ? '+' : ''}{wb.side2Add}&quot;</span></div>}
              {wb.relaxedFitAdd > 0 && <div className="flex justify-between"><span className="text-gray-700">Track fit (+1&quot;/10ft)</span><span className="font-mono text-gray-800">+{wb.relaxedFitAdd}&quot;</span></div>}
              <div className="flex justify-between border-t border-gray-200 pt-0.5 font-bold"><span className="text-[#003365]">Cut width</span><span className="font-mono text-[#003365]">{wb.total}&quot;</span></div>
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-600 uppercase text-[9px] tracking-wider mb-0.5">Height</div>
            <div className="space-y-0.5">
              <div className="flex justify-between"><span className="text-gray-700">Measured height</span><span className="font-mono text-gray-800">{hb.base}&quot;</span></div>
              {panel.canvasHeight > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Vinyl: {panel.vinylHeight}&quot; + Canvas: {panel.canvasHeight}&quot;</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-gray-700">Base overlap</span><span className="font-mono text-gray-800">+{hb.overlapAdd}&quot;</span></div>
              {hb.topAdd !== 0 && <div className="flex justify-between"><span className="text-gray-700">Top ({TOP_LABEL_MAP[panel.topAttachment]})</span><span className="font-mono text-gray-800">+{hb.topAdd}&quot;</span></div>}
              <div className="flex justify-between border-t border-gray-200 pt-0.5 font-bold"><span className="text-[#003365]">Cut height</span><span className="font-mono text-[#003365]">{hb.total}&quot;</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Edge Dropdown Selector
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EdgeSelector<T extends string>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string; image?: string; adj?: string }[];
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        {selected?.image && <ProductThumb src={selected.image} alt={selected.label} />}
        <select value={value} onChange={(e) => onChange(e.target.value as T)} className={SELECT_CLS} style={{ minWidth: 130 }}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}{o.adj && o.adj !== '+0"' ? ` (${o.adj})` : ''}</option>)}
        </select>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function generateClearVinylSidePanels(params: {
  sideNum: number; totalWidth: number; leftHeight: number; rightHeight: number;
  config: SideConfig; topAttachment: VinylTopAttachment; leftEdge: ClearVinylSideAttachment; rightEdge: ClearVinylSideAttachment;
}): ClearVinylSavedPanel[] {
  const { sideNum, totalWidth, leftHeight, rightHeight, config, topAttachment, leftEdge, rightEdge } = params
  const { panelCount, splitType } = config; const panelWidth = Math.round(totalWidth / panelCount)
  return Array.from({ length: panelCount }, (_, i) => {
    const cp = (i + 0.5) / panelCount; const rh = Math.round(leftHeight + (rightHeight - leftHeight) * cp)
    const s1: ClearVinylSideAttachment = i === 0 ? leftEdge : splitType; const s2: ClearVinylSideAttachment = i === panelCount - 1 ? rightEdge : splitType
    const r = calculateClearVinylPanel({ widthInches: panelWidth, heightInches: rh, topAttachment, side1Attachment: s1, side2Attachment: s2 })
    return {
      id: `cv-panel-${sideNum}-${i}-${panelWidth}-${rh}`,
      finalWidth: r.finalWidth, finalHeight: r.finalHeight, rawWidth: panelWidth, rawHeight: rh,
      topAttachment, side1: s1, side2: s2, side: sideNum,
      widthBreakdown: r.widthBreakdown, heightBreakdown: r.heightBreakdown,
      vinylHeight: r.vinylHeight, canvasHeight: r.canvasHeight,
    }
  })
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Config Card (mini SVG for 1 vs 2 panel layout)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ConfigCard({ config, selected, onClick }: { config: SideConfig; selected: boolean; onClick: () => void }) {
  const n = config.panelCount; const svgW = 88; const svgH = 52; const gap = config.splitType === 'zipper_door' ? 4 : 0; const pw = (svgW - 8 - gap * (n - 1)) / n
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center rounded-xl p-2.5 transition-all border-2 min-w-[100px] ${selected ? 'border-[#003365] bg-[#003365]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mb-1">
        {Array.from({ length: n }, (_, i) => {
          const x = 4 + i * (pw + gap)
          return (<g key={i}><rect x={x} y={4} width={pw} height={svgH - 8} fill={selected ? '#e8f4fd' : '#f3f4f6'} stroke={selected ? BLUE : '#999'} strokeWidth={1.5} rx={2} />{Array.from({ length: Math.floor(pw / 10) }).map((_, j) => <line key={`v${j}`} x1={x + 5 + j * 10} y1={6} x2={x + 5 + j * 10} y2={svgH - 6} stroke={selected ? BLUE : '#bbb'} strokeWidth={0.2} opacity={0.3} />)}{i < n - 1 && config.splitType === 'zipper_door' && <g><line x1={x + pw + gap / 2} y1={6} x2={x + pw + gap / 2} y2={svgH - 6} stroke="#999" strokeWidth={1} />{[12, 20, 28, 36].map(cy => <g key={cy}><line x1={x + pw + gap / 2 - 2} y1={cy} x2={x + pw + gap / 2} y2={cy + 2} stroke="#c0a000" strokeWidth={0.8} /><line x1={x + pw + gap / 2 + 2} y1={cy} x2={x + pw + gap / 2} y2={cy + 2} stroke="#c0a000" strokeWidth={0.8} /></g>)}</g>}</g>)
        })}
      </svg>
      <div className={`text-xs font-bold ${selected ? 'text-[#003365]' : 'text-gray-700'}`}>{config.label}</div>
      <div className="text-[9px] text-gray-500 leading-tight">{config.description}</div>
    </button>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Side Section
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SideSection({ sideNum, state, onChange, onShowMeasureGuide, canvasHex, isOpen, onToggle }: {
  sideNum: number; state: ClearVinylSideState; onChange: (u: Partial<ClearVinylSideState>) => void;
  onShowMeasureGuide?: () => void; canvasHex: string;
  isOpen: boolean; onToggle: () => void;
}) {
  const isDesktop = useIsDesktop()
  const config = SIDE_CONFIGS.find((c) => c.id === state.configId)!
  const tw = parseFloat(state.totalWidth) || 0; const lh = parseFloat(state.leftHeight) || 0; const rh = parseFloat(state.rightHeight) || 0
  const isReady = tw > 0 && lh > 0 && rh > 0
  const panels = useMemo(() => {
    if (!isReady) return []
    return generateClearVinylSidePanels({ sideNum, totalWidth: tw, leftHeight: lh, rightHeight: rh, config, topAttachment: state.topAttachment, leftEdge: state.leftEdge, rightEdge: state.rightEdge })
  }, [sideNum, tw, lh, rh, config, state.topAttachment, state.leftEdge, state.rightEdge, isReady])
  const panelMaxSize = isDesktop ? (config.panelCount > 1 ? 320 : 420) : (config.panelCount > 1 ? 200 : 280)

  return (
    <Card className="!p-0 !bg-white !border-2 !border-gray-200 overflow-hidden transition-all">

      {/* ── COLLAPSED: summary row ── */}
      {!isOpen && (
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
          <div className="w-7 h-7 rounded-full bg-[#003365] text-white flex items-center justify-center text-xs font-bold shrink-0">{sideNum}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Side {sideNum} — {config.label}</div>
            <div className="text-xs text-gray-500 truncate">
              {isReady ? (
                <>{tw}&quot; W &times; {lh}&quot;/{rh}&quot; H &mdash; {panels.length} panel{panels.length !== 1 ? 's' : ''}</>
              ) : (
                <span className="italic text-gray-400">No dimensions yet</span>
              )}
            </div>
          </div>
          {isReady && panels.length > 0 && (
            <div className="shrink-0 text-xs text-gray-500">
              {panels.map(p => `${p.finalWidth}"×${p.finalHeight}"`).join(', ')}
            </div>
          )}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#003365] font-medium">
            <span>Tap to expand</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* ── EXPANDED: full configurator ── */}
      {isOpen && (
        <>
      <div className="bg-[#003365] px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#0a4a8a] transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">{sideNum}</div>
          <span className="text-white font-bold text-sm">Side {sideNum}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
          <span>Tap to collapse</span>
          <ChevronUp className="w-4 h-4" />
        </div>
      </div>
      {/* Layout picker */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 text-center">Panel Layout</div>
        <div className="flex justify-center gap-3">
          {SIDE_CONFIGS.map((c) => <ConfigCard key={c.id} config={c} selected={c.id === state.configId} onClick={() => onChange({ configId: c.id })} />)}
        </div>
      </div>
      {/* Dimensions */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Left H</span>
            <input type="number" min={1} value={state.leftHeight} onChange={(e) => onChange({ leftHeight: e.target.value })} className={INPUT_CLS} />
          </div>
          <span className="text-gray-400 font-bold text-lg">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Width</span>
            <input type="number" min={1} value={state.totalWidth} onChange={(e) => onChange({ totalWidth: e.target.value })} className={INPUT_CLS} />
          </div>
          <span className="text-gray-400 font-bold text-lg">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Right H</span>
            <input type="number" min={1} value={state.rightHeight} onChange={(e) => onChange({ rightHeight: e.target.value })} className={INPUT_CLS} />
            <span className="text-gray-500 text-xs">in</span>
          </div>
        </div>
        {onShowMeasureGuide && (
          <div className="flex justify-center mt-2">
            <button type="button" onClick={onShowMeasureGuide} className="flex items-center gap-1.5 text-xs text-[#003365] font-semibold hover:underline transition-colors">
              <Ruler className="w-3.5 h-3.5" /> How to measure
            </button>
          </div>
        )}
      </div>
      {/* Visualization */}
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Top Attachment</span>
            <span className="text-sm font-semibold text-[#003365]">{TOP_LABEL_MAP[state.topAttachment]}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <div className="shrink-0"><EdgeSelector label="Left Edge" value={state.leftEdge} onChange={(v) => onChange({ leftEdge: v })} options={OUTER_EDGE_OPTIONS} /></div>
          <div className="flex-1 flex items-end justify-center min-w-0">
            {isReady && panels.length > 0 ? (
              <div className="flex items-end justify-center">
                {panels.map((panel, i) => (
                  <div key={panel.id} className="flex items-end">
                    {i > 0 && (
                      <div className="flex flex-col items-center justify-center mx-0.5 self-center">
                        <svg width={10} height={Math.max(60, Math.round(panelMaxSize * 0.4))} viewBox={`0 0 10 ${Math.max(60, Math.round(panelMaxSize * 0.4))}`}>
                          <line x1={5} y1={2} x2={5} y2={Math.max(58, Math.round(panelMaxSize * 0.4) - 2)} stroke="#888" strokeWidth={1.5} />
                          {Array.from({ length: Math.max(4, Math.floor(panelMaxSize * 0.4 / 8)) }).map((_, k) => (<g key={k}><line x1={2} y1={4 + k * 8} x2={5} y2={8 + k * 8} stroke="#c0a000" strokeWidth={1} /><line x1={8} y1={4 + k * 8} x2={5} y2={8 + k * 8} stroke="#c0a000" strokeWidth={1} /></g>))}
                        </svg>
                        <span className="text-[7px] text-gray-500 mt-0.5 whitespace-nowrap leading-none">Zip Door</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <ClearVinylPanelVisualizer
                        finalWidth={panel.finalWidth} finalHeight={panel.finalHeight}
                        rawWidth={panel.rawWidth} rawHeight={panel.rawHeight}
                        maxSize={panelMaxSize} topAttachment={panel.topAttachment}
                        side1={panel.side1} side2={panel.side2}
                        canvasHeight={panel.canvasHeight} vinylHeight={panel.vinylHeight}
                        canvasHex={canvasHex}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Text size="sm" className="text-gray-500 !mb-0">Enter dimensions</Text>
              </div>
            )}
          </div>
          <div className="shrink-0"><EdgeSelector label="Right Edge" value={state.rightEdge} onChange={(v) => onChange({ rightEdge: v })} options={OUTER_EDGE_OPTIONS} /></div>
        </div>
      </div>
      {/* Bottom bar: panel info */}
      {panels.length > 0 && (
        <div className="bg-[#003365]/5 border-t border-gray-200 px-5 py-4">
          <div className={`grid gap-4 ${panels.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
            {panels.map((panel, i) => (
              <div key={panel.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Panel {i + 1}</span>
                  <span className="font-mono font-bold text-[#003365] text-sm">{panel.finalWidth}&quot; &times; {panel.finalHeight}&quot;</span>
                </div>
                <div className="text-xs text-gray-500">
                  ({SIDE_LABEL_MAP[panel.side1]} | {TOP_LABEL_MAP[panel.topAttachment]} | {SIDE_LABEL_MAP[panel.side2]})
                  {panel.canvasHeight > 0 && <span className="ml-1 text-amber-700">/ {panel.vinylHeight}&quot; vinyl + {panel.canvasHeight}&quot; canvas</span>}
                </div>
                <BreakdownInline panel={panel} />
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </Card>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildCartData(sides: ClearVinylSideState[], canvasColor: CanvasColor, panelSize: VinylPanelSize, velcroColor: VelcroColor | undefined) {
  return sides.map((s, i) => {
    const config = SIDE_CONFIGS.find((c) => c.id === s.configId)!
    const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0
    const panels = (tw > 0 && lh > 0 && rh > 0) ? generateClearVinylSidePanels({ sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, config, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge }) : []
    return {
      side: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh,
      layout: config.label, topAttachment: s.topAttachment,
      leftEdge: s.leftEdge, rightEdge: s.rightEdge,
      product: 'clear_vinyl', canvasColor, panelSize,
      velcroColor: s.topAttachment === 'velcro' ? velcroColor : undefined,
      panels: panels.map(p => ({
        rawWidth: p.rawWidth, rawHeight: p.rawHeight, finalWidth: p.finalWidth, finalHeight: p.finalHeight,
        topAttachment: p.topAttachment, side1: p.side1, side2: p.side2,
        vinylHeight: p.vinylHeight, canvasHeight: p.canvasHeight,
      })),
    }
  })
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Export
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function ClearVinylPanelBuilder() {
  const [numSides, setNumSides] = useState(2)
  const [sides, setSides] = useState<ClearVinylSideState[]>([defaultClearVinylSideState(), defaultClearVinylSideState()])
  const [hydrated, setHydrated] = useState(false)

  // Product options
  const [canvasColor, setCanvasColor] = useState<CanvasColor>('tbd')
  const [velcroColor, setVelcroColor] = useState<VelcroColor>('black')

  // Contact & submit
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [uploadPrefix] = useState(() => crypto.randomUUID())
  const [description, setDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  // Track saved project to prevent double-creation on submit
  const savedProjectIdRef = useRef<string | null>(null)

  // Detail modals
  const [attachDetail, setAttachDetail] = useState<TopAttachOption | null>(null)
  const [showMeasureGuide, setShowMeasureGuide] = useState(false)

  // Collapsible side panels — first side open by default
  const [openSides, setOpenSides] = useState<Set<number>>(new Set([0]))
  const toggleSide = useCallback((idx: number) => {
    setOpenSides(prev => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next })
  }, [])

  // DB-driven product options (filters admin_only automatically)
  const { vinylPanel, isLoading: productsLoading } = useProducts()

  const topAttachments: TopAttachOption[] = useMemo(() => {
    const dbOpts = getProductOptions(vinylPanel, 'top_attachment')
    return dbOpts.map(opt => {
      const ui = TOP_ATTACH_UI[opt.option_value] || {}
      return {
        id: opt.option_value as VinylTopAttachment,
        label: opt.display_label,
        subtitle: ui.subtitle || '',
        description: ui.description || '',
        image: opt.image_url || ui.fallbackImage,
        isGif: ui.isGif,
        showsVelcroColor: ui.showsVelcroColor,
        popular: ui.popular,
      }
    })
  }, [vinylPanel])

  const canvasColors: CanvasColorOption[] = useMemo(() => {
    const dbOpts = getProductOptions(vinylPanel, 'canvas_color')
    return dbOpts.map(opt => {
      const ui = CANVAS_COLOR_UI[opt.option_value] || { hex: '#cccccc' }
      return {
        id: opt.option_value as CanvasColor,
        label: opt.display_label,
        hex: ui.hex,
        image: opt.image_url || ui.image,
      }
    })
  }, [vinylPanel])

  // Save for later
  const [saveForLaterEmail, setSaveForLaterEmail] = useState('')
  const [isSavingForLater, setIsSavingForLater] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveDescription, setSaveDescription] = useState('')
  const [projectSaved, setProjectSaved] = useState(false)

  // Restore from localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_KEY)
      if (s) {
        const p = JSON.parse(s)
        if (p.numSides) setNumSides(p.numSides)
        if (Array.isArray(p.sides) && p.sides.length > 0) setSides(p.sides)
        if (p.canvasColor) setCanvasColor(p.canvasColor)
        if (p.velcroColor) setVelcroColor(p.velcroColor)
      }
    } catch { /* ok */ }
    setHydrated(true)
  }, [])

  // Auto-save debounced
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!hydrated) return
    if (saveRef.current) clearTimeout(saveRef.current)
    saveRef.current = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ numSides, sides, canvasColor, velcroColor })) } catch { /* ok */ }
    }, 500)
    return () => { if (saveRef.current) clearTimeout(saveRef.current) }
  }, [numSides, sides, canvasColor, velcroColor, hydrated])

  useEffect(() => {
    setSides(prev => {
      if (prev.length < numSides) {
        setOpenSides(os => { const next = new Set(os); next.add(prev.length); return next })
        return [...prev, ...Array.from({ length: numSides - prev.length }, () => defaultClearVinylSideState())]
      }
      return prev.slice(0, numSides)
    })
  }, [numSides])

  const updateSide = useCallback((i: number, u: Partial<ClearVinylSideState>) => setSides(prev => prev.map((s, idx) => idx === i ? { ...s, ...u } : s)), [])

  const allPanels = useMemo(() => sides.flatMap((s, i) => {
    const c = SIDE_CONFIGS.find(x => x.id === s.configId)!
    const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0
    if (tw <= 0 || lh <= 0 || rh <= 0) return []
    return generateClearVinylSidePanels({ sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, config: c, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge })
  }), [sides])

  const allSidesReady = sides.every(s => {
    const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0
    return tw > 0 && lh > 0 && rh > 0
  })

  // Auto-detect panel size tier from tallest panel
  const maxHeight = useMemo(() => Math.max(...allPanels.map(p => p.rawHeight), 0), [allPanels])
  const detectedSize = getSizeTier(maxHeight)
  const sizeInfo = VINYL_PANEL_SIZES.find(s => s.id === detectedSize)!

  // Whether any panel needs canvas
  const anyNeedsCanvas = allPanels.some(p => p.canvasHeight > 0)
  const showCanvasColor = sizeInfo.hasCanvasColor && anyNeedsCanvas

  // Whether any side uses velcro
  const anyUsesVelcro = sides.some(s => s.topAttachment === 'velcro')

  // Canvas hex for visualization (DB-driven with fallback)
  const canvasHex = canvasColors.find(c => c.id === canvasColor)?.hex || CANVAS_COLOR_UI[canvasColor]?.hex || '#cccccc'

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  /* Submit for salesperson review */
  const handleSubmitDesign = async () => {
    if (!isValidEmail(email) || !firstName.trim()) return
    setSubmitStatus('submitting')
    try {
      const cd = buildCartData(sides, canvasColor, detectedSize, anyUsesVelcro ? velcroColor : undefined)
      const noteParts = [`Clear Vinyl Panel Builder: ${numSides} sides, ${allPanels.length} panels`]
      noteParts.push(`Panel size tier: ${sizeInfo.label} (${sizeInfo.range})`)
      if (anyNeedsCanvas) noteParts.push(`Canvas color: ${canvasColors.find(c => c.id === canvasColor)?.label || canvasColor}`)
      if (description.trim()) noteParts.push(description.trim())

      const completedPhotos = photos.filter(p => p.status === 'complete')
      const body: Record<string, unknown> = {
        email: email.trim(),
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        product: 'clear_vinyl',
        projectType: 'expert_review',
        projectName: projectName.trim() || undefined,
        topAttachment: sides[0]?.topAttachment || 'standard_track',
        numberOfSides: numSides,
        notes: noteParts.join('\n\n'),
        description: description.trim() || undefined,
        cart_data: cd,
        photo_urls: completedPhotos.map(p => ({
          url: p.publicUrl,
          key: p.key,
          fileName: p.fileName,
        })),
      }
      // If we already saved this project, reuse its ID to prevent duplicates
      if (savedProjectIdRef.current) {
        body.existingProjectId = savedProjectIdRef.current
      }
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')

      savedProjectIdRef.current = d.project?.id || savedProjectIdRef.current
      setSubmitStatus('submitted')
      if (d.shareUrl) setShareUrl(d.shareUrl)
    } catch (e) { console.error('Submit:', e); setSubmitStatus('error'); setTimeout(() => setSubmitStatus('idle'), 3000) }
  }

  /* Save project for later */
  const handleSaveForLater = async () => {
    if (!isValidEmail(saveForLaterEmail)) return
    setIsSavingForLater(true)
    try {
      const cd = buildCartData(sides, canvasColor, detectedSize, anyUsesVelcro ? velcroColor : undefined)
      const saveBody: Record<string, unknown> = {
        email: saveForLaterEmail.trim(), firstName: firstName.trim() || undefined, lastName: lastName.trim() || undefined,
        projectName: projectName.trim() || undefined, product: 'clear_vinyl', projectType: 'saved_for_later',
        topAttachment: sides[0]?.topAttachment || 'standard_track', numberOfSides: numSides,
        notes: `Saved for later: ${numSides} sides, ${allPanels.length} panels`, cart_data: cd,
      }
      if (savedProjectIdRef.current) {
        saveBody.existingProjectId = savedProjectIdRef.current
      }
      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveBody),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')
      savedProjectIdRef.current = d.project?.id || savedProjectIdRef.current
      setSaveStatus('saved')
      setProjectSaved(true)
      if (d.shareUrl) setShareUrl(d.shareUrl)
      if (saveForLaterEmail.trim() && !email) setEmail(saveForLaterEmail.trim())
    } catch { alert('Could not save. Please try again.') }
    finally { setIsSavingForLater(false) }
  }

  return (
    <Stack gap="lg">
      {/* ══════════════════════════════════════════════
         SECTION 1: OPTIONS
         ══════════════════════════════════════════════ */}
      <HeaderBarSection icon={SlidersHorizontal} label="Options" variant="green" headerSubtitle="Top attachment, canvas color & number of sides">
        <Stack gap="md">
          {/* ── Top Attachment (DB-driven, filters admin_only) ── */}
          <div>
            <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide mb-3">Top Attachment</div>
            {productsLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading options...</div>
            ) : (
              <>
                {/* Cards for options with images */}
                {topAttachments.filter(a => a.image).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto mb-3">
                    {topAttachments.filter(a => a.image).map(att => {
                      const currentTop = sides[0]?.topAttachment
                      const isActive = att.id === currentTop
                      return (
                        <div key={att.id} role="button" tabIndex={0}
                          onClick={() => setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id })))}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id }))) }}
                          className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isActive ? 'border-[#003365] ring-2 ring-[#003365]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="aspect-video relative bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={att.image!} alt={att.label} className="w-full h-full object-cover" />
                            {att.isGif && <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5"><Play className="w-3 h-3" /> GIF</div>}
                            {att.popular && <div className="absolute top-1.5 right-1.5 bg-[#003365] text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">95% Choose</div>}
                            {isActive && <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-[#003365] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                          </div>
                          <div className="p-2.5 text-center">
                            <div className="font-bold text-gray-800 text-sm leading-tight">{att.label}</div>
                            <div className="text-xs text-gray-600 leading-tight">{att.subtitle}</div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setAttachDetail(att) }} className="text-xs text-[#003365] font-semibold hover:underline mt-0.5">See details</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Buttons for options without images */}
                {topAttachments.filter(a => !a.image).length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
                    {topAttachments.filter(a => !a.image).map(att => {
                      const currentTop = sides[0]?.topAttachment
                      const isActive = att.id === currentTop
                      return (
                        <button key={att.id} type="button"
                          onClick={() => setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id })))}
                          className={`px-3 py-2.5 rounded-xl text-left transition-all border-2 ${isActive ? 'border-[#003365] bg-[#003365]/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-medium text-gray-900 text-sm">{att.label}</span>
                            {isActive && <Check className="w-4 h-4 text-[#003365] shrink-0" />}
                          </div>
                          <div className="text-xs text-gray-500 leading-tight">{att.subtitle}</div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Velcro Color (conditional) ── */}
          {anyUsesVelcro && (
            <div className="bg-[#003365]/5 rounded-xl px-5 py-4 border border-[#003365]/10">
              <div className="text-sm font-semibold text-gray-800 mb-2">Velcro Color for Mounting Surface</div>
              <div className="flex gap-3">
                {(['black', 'white'] as VelcroColor[]).map(color => (
                  <button key={color} type="button" onClick={() => setVelcroColor(color)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${velcroColor === color ? 'ring-2 ring-[#003365] bg-white shadow-sm' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: color === 'black' ? '#1a1a1a' : '#f5f5f5' }} />
                    <span className="font-medium capitalize text-sm">{color}</span>
                    {velcroColor === color && <Check className="w-4 h-4 text-[#003365]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Number of Sides ── */}
          <div className="text-center pt-2">
            <div className="text-lg font-bold text-gray-800 mb-1">How many sides need clear vinyl panels?</div>
            <div className="text-sm text-gray-600 mb-3">Select the number of open sides on your porch or structure</div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button key={n} type="button" onClick={() => setNumSides(n)} className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${numSides === n ? 'bg-[#003365] text-white shadow-md ring-2 ring-[#003365]/30 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}`}>{n}</button>
              ))}
            </div>
          </div>
        </Stack>
      </HeaderBarSection>

      {/* Attachment Detail Lightbox */}
      <LightboxModal open={!!attachDetail} onClose={() => setAttachDetail(null)} title={attachDetail?.label || ''} image={attachDetail?.image || ''} isGif={attachDetail?.isGif}>
        {attachDetail && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-bold text-lg text-gray-800">{attachDetail.label}</div>
              <div className="text-sm text-[#003365] font-medium">{attachDetail.subtitle}</div>
              <div className="text-sm text-gray-600 mt-1">{attachDetail.description}</div>
            </div>
            <Button variant="primary" onClick={() => { setSides(prev => prev.map(s => ({ ...s, topAttachment: attachDetail.id }))); setAttachDetail(null) }}>
              <Check className="w-4 h-4 mr-2" /> Select
            </Button>
          </div>
        )}
      </LightboxModal>
      <MeasurementGuideModal open={showMeasureGuide} onClose={() => setShowMeasureGuide(false)} />

      {/* ══════════════════════════════════════════════
         SECTION 2: PANELS
         ══════════════════════════════════════════════ */}
      <HeaderBarSection icon={LayoutGrid} label="Panels" variant="green" headerSubtitle={`${numSides} side${numSides !== 1 ? 's' : ''} — ${allPanels.length} panel${allPanels.length !== 1 ? 's' : ''}`}>
        <Stack gap="md">
          {/* Panel size tier (auto-detected) */}
          {allSidesReady && (
            <div className="flex items-center justify-center gap-3 bg-[#003365]/5 rounded-xl px-4 py-3 border border-[#003365]/10">
              <Info className="w-4 h-4 text-[#003365] shrink-0" />
              <div className="text-sm">
                <span className="text-gray-700">Tallest panel: <strong>{maxHeight}&quot;</strong></span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-[#003365] font-semibold">Size tier: {sizeInfo.label} ({sizeInfo.range}) — ${sizeInfo.pricePerFoot}/linear ft</span>
              </div>
            </div>
          )}

          {/* Canvas color (only when panels need it) */}
          {showCanvasColor && (
            <div className="bg-white rounded-xl border-2 border-amber-200 px-5 py-4">
              <div className="text-sm font-bold text-gray-800 mb-1">Sunbrella Canvas Color</div>
              <div className="text-xs text-gray-600 mb-3">
                Clear vinyl is {MAX_VINYL_HEIGHT}&quot; tall. The remaining height is filled with marine-grade Sunbrella canvas in your chosen color, usually on the bottom.
              </div>
              {productsLoading ? (
                <div className="flex items-center justify-center gap-2 py-4 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading colors...</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {canvasColors.map(color => (
                    <button key={color.id} type="button" onClick={() => setCanvasColor(color.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${canvasColor === color.id ? 'ring-2 ring-[#003365] bg-[#003365]/5' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border border-gray-300 ${color.id === 'clear_top_to_bottom' ? 'border-dashed' : ''}`} style={{ backgroundColor: color.hex }} />
                      <span className="text-gray-700">{color.label}</span>
                      {canvasColor === color.id && <Check className="w-3.5 h-3.5 text-[#003365]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {sides.map((side, i) => (
            <SideSection key={i} sideNum={i + 1} state={side} onChange={(u) => updateSide(i, u)} onShowMeasureGuide={() => setShowMeasureGuide(true)} canvasHex={canvasHex} isOpen={openSides.has(i)} onToggle={() => toggleSide(i)} />
          ))}
        </Stack>
      </HeaderBarSection>

      {/* ══════════════════════════════════════════════
         SAVE YOUR PROJECT
         ══════════════════════════════════════════════ */}
      <Card className="!p-0 !bg-white !border-2 !border-[#003365]/20 overflow-hidden">
        {/* Centered header */}
        <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <Bookmark className="w-6 h-6 text-[#003365]" />
            <h3 className="text-xl font-bold text-gray-900">Save Your Project</h3>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get a shareable link emailed to you. Come back anytime to edit, review, or submit. No commitment.
          </p>
        </div>

        {/* Full-width form content */}
        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5">
          {saveStatus === 'saved' ? (
            /* ── Saved success state ── */
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#003365]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Project Saved{firstName ? ` for ${firstName}` : ''}!</span>
              </div>
              {shareUrl && (
                <div className="flex items-center gap-2 bg-[#003365]/5 border border-[#003365]/20 rounded-xl px-4 py-3">
                  <Link2 className="w-4 h-4 text-[#003365] shrink-0" />
                  <span className="text-sm font-mono text-[#003365] truncate flex-1">
                    {typeof window !== 'undefined' ? window.location.origin : ''}{shareUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${shareUrl}`
                      navigator.clipboard.writeText(fullUrl)
                      setLinkCopied(true)
                      setTimeout(() => setLinkCopied(false), 2000)
                    }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-[#003365]/10 transition-colors"
                    title="Copy link"
                  >
                    {linkCopied ? <CheckCircle className="w-4 h-4 text-[#003365]" /> : <Copy className="w-4 h-4 text-[#003365]" />}
                  </button>
                </div>
              )}
              <Text size="xs" className="text-gray-500 !mb-0 text-center">
                We&apos;ve emailed your project link to <strong>{saveForLaterEmail || email}</strong>. You can return anytime to edit or submit for review.
              </Text>
              <div className="text-center">
                <button type="button" onClick={() => setSaveStatus('idle')} className="text-xs text-[#003365] font-medium underline underline-offset-2 hover:text-[#001a33] transition-colors">
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
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="First name *" value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address *" value={saveForLaterEmail} onChange={e => setSaveForLaterEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
                </div>
              </div>
              <textarea
                placeholder="Notes for yourself (optional) — what is this project for?"
                value={saveDescription}
                onChange={e => setSaveDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors resize-none"
              />
              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveForLater}
                  disabled={!isValidEmail(saveForLaterEmail) || !firstName.trim() || isSavingForLater}
                >
                  {isSavingForLater ? (
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
         SUBMIT YOUR DESIGN
         ══════════════════════════════════════════════ */}
      {submitStatus !== 'submitted' ? (
        <Card className="!p-0 !bg-white !border-2 !border-[#003365]/20 overflow-hidden">
          {/* Centered header */}
          <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              <Send className="w-6 h-6 text-[#003365]" />
              <h3 className="text-xl font-bold text-gray-900">Submit Your Design</h3>
            </div>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Clear vinyl panels are custom-quoted. We&apos;ll review your design, confirm specs, and reach out with exact pricing and lead times.
            </p>
            {projectSaved && (
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[#003365]">
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
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="First name *" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors" />
              </div>
            </div>

            {/* Photo uploader — S3 presigned upload flow */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Upload photos of your space</p>
              <p className="text-xs text-gray-400 mb-2">Optional — helps us give the best recommendation</p>
              <PhotoUploader sessionId={uploadPrefix} maxFiles={10} onUploadComplete={setPhotos} />
            </div>

            {/* Description */}
            <textarea
              placeholder="Describe your project — what are you enclosing? Any special requirements or questions for our team?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-[#003365] transition-colors resize-none"
            />

            {/* Submit button */}
            <div className="space-y-3 pt-1 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitDesign}
                disabled={!isValidEmail(email) || !firstName.trim() || submitStatus === 'submitting'}
              >
                {submitStatus === 'submitting' ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : submitStatus === 'error' ? (
                  <>Try Again</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 mr-2" /> Submit for Expert Review</>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* ── Submitted Success ── */
        <Card className="!p-0 !bg-white !border-2 !border-[#003365]/30 overflow-hidden">
          <div className="px-6 py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-gray-800 mb-1">Design Submitted{firstName ? `, ${firstName}` : ''}!</div>
            <div className="text-sm text-gray-600 mb-4">Our team will review your clear vinyl panel configuration and reach out with a detailed quote.</div>
            {shareUrl && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Project link:</span>
                <span className="text-xs font-mono text-[#003365]">{typeof window !== 'undefined' ? window.location.origin : ''}{shareUrl}</span>
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
              Edit &amp; Resubmit
            </Button>
          </div>
        </Card>
      )}
    </Stack>
  )
}
