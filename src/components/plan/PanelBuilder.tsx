'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  Text,
  Stack,
  Button,
} from '@/lib/design-system'
import {
  calculatePanelDimensions,
  type TopAttachment,
  type SideAttachment,
  type WidthBreakdown,
  type HeightBreakdown,
} from '@/lib/panel-calculator'
import {
  Save, CheckCircle, Loader2, Info, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, Users, Zap, Check, Play, X, Plus, Minus,
  SlidersHorizontal, Wrench, Mail, User, ShieldCheck, Bookmark,
  Phone, Upload, Image as ImageIcon, FileText, Copy, Link2, Send, Ruler,
} from 'lucide-react'
import type { MeshType, MeshColor } from '@/lib/pricing/types'
import { useProducts } from '@/hooks/useProducts'
import { useDiyHardware, type PanelForHardware } from '@/hooks/useDiyHardware'

/* ─── Product images ─── */
const TRACK_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Track-Color-White-Black-700x700.jpg'
const VELCRO_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-Velcro-1.jpg'

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

/* ─── Mesh type data with images ─── */
const MESH_TYPE_CARDS = [
  {
    id: 'heavy_mosquito' as MeshType,
    label: 'Heavy Mosquito',
    subtitle: '90% of customers choose this',
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies. Durable outdoor polyester.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/mosquito-mesh-1600.jpg',
    colors: ['black', 'white', 'ivory'] as MeshColor[],
    popular: true,
  },
  {
    id: 'no_see_um' as MeshType,
    label: 'No-See-Um',
    subtitle: 'For tiny biting flies',
    description: 'Finer weave blocks tiny midge flies common near coastal areas. Slightly reduced airflow.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/noseeum-mesh-1600.jpg',
    colors: ['black', 'white'] as MeshColor[],
  },
  {
    id: 'shade' as MeshType,
    label: 'Shade',
    subtitle: 'Shade + privacy + bugs',
    description: 'Provides shade, privacy and insect protection all in one. Also works as a projection screen.',
    image: 'https://media.mosquitocurtains.com/site-assets/raw-netting-images/shade-mesh-1600.jpg',
    colors: ['black', 'white'] as MeshColor[],
  },
]

const MESH_COLOR_SWATCHES: { id: MeshColor; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
]

/* ─── Top attachment data with GIFs ─── */
const TOP_ATTACHMENT_CARDS = [
  {
    id: 'tracking' as TopAttachment,
    label: 'Track',
    subtitle: 'Slides side-to-side',
    description: 'Curtains slide along a ceiling-mounted track like elegant drapes. Easy open/close access. Most popular choice.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif',
    isGif: true,
    staticThumb: TRACK_IMAGE,
  },
  {
    id: 'velcro' as TopAttachment,
    label: 'Velcro',
    subtitle: 'Fixed in place',
    description: 'Panel attaches with industrial-strength Velcro along the top. Simple installation, stays put. Easy to remove for cleaning.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif',
    isGif: true,
    staticThumb: VELCRO_IMAGE,
  },
]

/* ─── Option configs for edge selectors ─── */
const TOP_OPTIONS: { value: TopAttachment; label: string; image?: string }[] = [
  { value: 'tracking', label: 'Tracking', image: TRACK_IMAGE },
  { value: 'velcro', label: 'Velcro', image: VELCRO_IMAGE },
]

const SIDE_LABEL_MAP: Record<SideAttachment, string> = {
  none: 'Open', marine_snaps: 'Snaps', magnetic_door: 'Magnets', stucco_strip: 'Stucco',
}

const TOP_LABEL_MAP: Record<TopAttachment, string> = { tracking: 'Track', velcro: 'Velcro' }

/* ─── Constants ─── */
const GREEN = '#406517'
const GREEN_LIGHT = '#5a8a2a'
const SNAP_COUNT = 5
const SELECT_CLS = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all cursor-pointer appearance-none'
const INPUT_CLS = 'w-20 px-2 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-colors'
const LS_KEY = 'mc_panel_builder'

/* ─── Side Builder Configuration Options ─── */
interface SideConfig { id: string; label: string; description: string; panelCount: number; splitType: SideAttachment }

const SIDE_CONFIGS: SideConfig[] = [
  { id: 'single', label: '1 Panel', description: 'Full width, no split', panelCount: 1, splitType: 'none' },
  { id: '2-mag', label: '2 Panels', description: 'Magnetic doorway between', panelCount: 2, splitType: 'magnetic_door' },
]

const OUTER_EDGE_OPTIONS: { value: SideAttachment; label: string; image?: string; adj: string }[] = [
  { value: 'none', label: 'None', adj: '+0"' },
  { value: 'marine_snaps', label: 'Marine Snaps', image: '/images/products/marine-snaps.png', adj: '+1"' },
  { value: 'stucco_strip', label: 'Stucco Strip', adj: '-1"' },
]

/* ─── Exported types ─── */
export interface SavedPanel {
  id: string; finalWidth: number; finalHeight: number; rawWidth: number; rawHeight: number;
  topAttachment: TopAttachment; side1: SideAttachment; side2: SideAttachment; side: number;
  widthBreakdown: WidthBreakdown; heightBreakdown: HeightBreakdown;
}

export interface SideState {
  totalWidth: string; leftHeight: string; rightHeight: string; configId: string;
  topAttachment: TopAttachment; leftEdge: SideAttachment; rightEdge: SideAttachment;
}

export function defaultSideState(): SideState {
  return { totalWidth: '240', leftHeight: '96', rightHeight: '96', configId: '2-mag', topAttachment: 'tracking', leftEdge: 'marine_snaps', rightEdge: 'marine_snaps' }
}

export interface PanelBuilderProps {
  initialMeshType?: MeshType; initialMeshColor?: MeshColor;
  contactInfo?: { email: string; firstName?: string; lastName?: string; phone?: string };
  basePath?: string;
  productType?: string;
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
        {/* Close button */}
        <button type="button" onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"><X className="w-5 h-5 text-white" /></button>
        {/* Image — fills container width */}
        <div className="relative bg-gray-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className={`w-full max-h-[55vh] ${isGif ? 'object-contain' : 'object-cover'}`} />
          {isGif && <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"><Play className="w-3 h-3" /> Animated</div>}
        </div>
        {/* Info bar — same width as image */}
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
        {/* Close */}
        <button type="button" onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="w-5 h-5 text-[#406517]" />
            <span className="text-lg font-bold text-gray-800">How to Measure</span>
          </div>
          <p className="text-sm text-gray-500">Measure in inches from inside edge to inside edge.</p>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-2 border-b border-gray-200 shrink-0">
          <button type="button" onClick={() => setTab('width')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === 'width' ? 'border-[#406517] text-[#406517]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Width
          </button>
          <button type="button" onClick={() => setTab('height')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === 'height' ? 'border-[#406517] text-[#406517]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Height
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6">
          {/* Main diagram */}
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.main} alt={`How to measure ${tab}`} className="w-full" />
          </div>

          {/* Contextual tip */}
          <div className="flex items-start gap-2.5 bg-[#406517]/5 rounded-lg px-4 py-3 mb-4">
            <Info className="w-4 h-4 text-[#406517] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">
              {tab === 'width'
                ? 'Measure the total width from inside edge to inside edge of your opening. We will split panels automatically if you choose a 2-panel layout.'
                : 'Measure height at both the left and right side — porches often have different heights due to sloped ceilings or uneven ground.'}
            </p>
          </div>

          {/* Example images */}
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
   Product image thumbnail next to dropdown
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProductThumb({ src, alt }: { src: string; alt: string }) {
  return <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0"><Image src={src} alt={alt} width={40} height={40} className="object-cover w-full h-full" /></div>
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Quantity Stepper
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function QtyStepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><Minus className="w-3 h-3 text-gray-600" /></button>
      <input type="number" value={value} onChange={e => onChange(Math.max(min, parseInt(e.target.value) || 0))} className="w-12 text-center text-sm font-bold border border-gray-300 rounded-md py-1" />
      <button type="button" onClick={() => onChange(value + 1)} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><Plus className="w-3 h-3 text-gray-600" /></button>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG Panel Visualizer
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function PanelVisualizer({ finalWidth, finalHeight, rawWidth, rawHeight, maxSize = 340, topAttachment, side1, side2 }: {
  finalWidth: number; finalHeight: number; rawWidth: number; rawHeight: number; maxSize?: number; topAttachment: TopAttachment; side1: SideAttachment; side2: SideAttachment;
}) {
  const base = useMemo(() => { if (finalWidth <= 0 || finalHeight <= 0) return null; const a = finalWidth / finalHeight; const c = maxSize - 100; let w: number, h: number; if (a >= 1) { w = c; h = c / a } else { h = c; w = c * a } return { w: Math.max(100, w), h: Math.max(80, h) } }, [finalWidth, finalHeight, maxSize])
  if (!base) return null
  const { w, h } = base
  const magH = Math.max(10, Math.round(h * 0.06)); const magW = Math.max(4, Math.round(magH * 0.35)); const stuccoW = Math.max(12, Math.round(w * 0.05))
  const leftExtra = side1 === 'stucco_strip' ? stuccoW + 12 : side1 === 'magnetic_door' ? magW + 8 : side1 === 'marine_snaps' ? 10 : 4
  const rightExtra = side2 === 'stucco_strip' ? stuccoW + 12 : side2 === 'magnetic_door' ? magW + 8 : side2 === 'marine_snaps' ? 10 : 4
  const px = leftExtra + 36; const py = 36; const svgW = px + w + rightExtra + 24; const svgH = py + h + 34
  const snapYs = Array.from({ length: SNAP_COUNT }, (_, i) => py + (h / (SNAP_COUNT + 1)) * (i + 1))
  const snapXs = Array.from({ length: SNAP_COUNT }, (_, i) => px + (w / (SNAP_COUNT + 1)) * (i + 1))
  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="block mx-auto">
      <rect x={px} y={py} width={w} height={h} fill="#e8f0dc" stroke={GREEN} strokeWidth={2.5} rx={4} />
      {Array.from({ length: Math.floor(w / 14) }).map((_, i) => <line key={`v${i}`} x1={px + 7 + i * 14} y1={py + 3} x2={px + 7 + i * 14} y2={py + h - 3} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />)}
      {Array.from({ length: Math.floor(h / 14) }).map((_, i) => <line key={`h${i}`} x1={px + 3} y1={py + 7 + i * 14} x2={px + w - 3} y2={py + 7 + i * 14} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />)}
      {topAttachment === 'tracking' ? (<><rect x={px - 6} y={py - 12} width={w + 12} height={10} fill="#444" rx={3} /><rect x={px - 3} y={py - 10} width={w + 6} height={6} fill="#666" rx={2} />{snapXs.map((cx, i) => <g key={`tc${i}`}><circle cx={cx} cy={py - 4} r={3} fill="#222" /><line x1={cx} y1={py - 1} x2={cx} y2={py + 2} stroke="#333" strokeWidth={1.5} /></g>)}</>) : <rect x={px} y={py - 5} width={w} height={5} fill="#B8860B" rx={1} opacity={0.8} />}
      {side1 === 'marine_snaps' && snapYs.map((cy, i) => <g key={`ls${i}`}><circle cx={px} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} /><circle cx={px} cy={cy} r={1.8} fill="#555" /></g>)}
      {side1 === 'magnetic_door' && snapYs.map((cy, i) => <g key={`lm${i}`}><rect x={px - 4} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.6} rx={1} /><rect x={px - 3} y={cy - magH / 2 + 1} width={magW - 2} height={magH - 2} fill="#d8d8d8" rx={0.5} opacity={0.5} /></g>)}
      {side1 === 'stucco_strip' && <g><rect x={px - stuccoW - 2} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />{Array.from({ length: Math.floor(h / 8) }).map((_, i) => <line key={`st1t${i}`} x1={px - stuccoW - 1} y1={py + 4 + i * 8} x2={px - 3} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />)}{snapYs.map((cy, i) => <rect key={`st1m${i}`} x={px - 4} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.5} rx={1} />)}{snapYs.map((cy, i) => <g key={`st1s${i}`}><circle cx={px - stuccoW - 2} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} /><circle cx={px - stuccoW - 2} cy={cy} r={1.4} fill="#555" /></g>)}</g>}
      {side2 === 'marine_snaps' && snapYs.map((cy, i) => <g key={`rs${i}`}><circle cx={px + w} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} /><circle cx={px + w} cy={cy} r={1.8} fill="#555" /></g>)}
      {side2 === 'magnetic_door' && snapYs.map((cy, i) => <g key={`rm${i}`}><rect x={px + w + 1} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.6} rx={1} /><rect x={px + w + 2} y={cy - magH / 2 + 1} width={magW - 2} height={magH - 2} fill="#d8d8d8" rx={0.5} opacity={0.5} /></g>)}
      {side2 === 'stucco_strip' && <g><rect x={px + w + 2} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />{Array.from({ length: Math.floor(h / 8) }).map((_, i) => <line key={`st2t${i}`} x1={px + w + 3} y1={py + 4 + i * 8} x2={px + w + stuccoW + 1} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />)}{snapYs.map((cy, i) => <rect key={`st2m${i}`} x={px + w + 1} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.5} rx={1} />)}{snapYs.map((cy, i) => <g key={`st2s${i}`}><circle cx={px + w + stuccoW + 2} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} /><circle cx={px + w + stuccoW + 2} cy={cy} r={1.4} fill="#555" /></g>)}</g>}
      <line x1={px - 12} y1={py + h + 4} x2={px + w + 12} y2={py + h + 4} stroke="#aaa" strokeWidth={1} strokeDasharray="4,3" />
      <line x1={px} y1={py + h + 18} x2={px + w} y2={py + h + 18} stroke={GREEN_LIGHT} strokeWidth={1} markerEnd="url(#aR)" markerStart="url(#aL)" />
      <text x={px + w / 2} y={py + h + 30} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700} fontFamily="system-ui">{rawWidth}&quot; raw  &#x2192;  {finalWidth}&quot; cut</text>
      <line x1={px - 22} y1={py} x2={px - 22} y2={py + h} stroke={GREEN_LIGHT} strokeWidth={1} markerEnd="url(#aD)" markerStart="url(#aU)" />
      <text x={px - 30} y={py + h / 2 + 3} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700} fontFamily="system-ui" transform={`rotate(-90 ${px - 30} ${py + h / 2 + 3})`}>{finalHeight}&quot;</text>
      <defs>
        <marker id="aR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto"><path d="M0,0 L6,3 L0,6" fill={GREEN_LIGHT} /></marker>
        <marker id="aL" markerWidth={6} markerHeight={6} refX={1} refY={3} orient="auto"><path d="M6,0 L0,3 L6,6" fill={GREEN_LIGHT} /></marker>
        <marker id="aD" markerWidth={6} markerHeight={6} refX={3} refY={5} orient="auto"><path d="M0,0 L3,6 L6,0" fill={GREEN_LIGHT} /></marker>
        <marker id="aU" markerWidth={6} markerHeight={6} refX={3} refY={1} orient="auto"><path d="M0,6 L3,0 L6,6" fill={GREEN_LIGHT} /></marker>
      </defs>
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Inline Measurement Breakdown (for bottom bar)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function BreakdownInline({ panel }: { panel: SavedPanel }) {
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
              {wb.relaxedFitAdd > 0 && <div className="flex justify-between"><span className="text-gray-700">Tracking fit (+1&quot;/10ft)</span><span className="font-mono text-gray-800">+{wb.relaxedFitAdd}&quot;</span></div>}
              <div className="flex justify-between border-t border-gray-200 pt-0.5 font-bold"><span className="text-[#406517]">Cut width</span><span className="font-mono text-[#406517]">{wb.total}&quot;</span></div>
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-600 uppercase text-[9px] tracking-wider mb-0.5">Height</div>
            <div className="space-y-0.5">
              <div className="flex justify-between"><span className="text-gray-700">Measured height</span><span className="font-mono text-gray-800">{hb.base}&quot;</span></div>
              <div className="flex justify-between"><span className="text-gray-700">Base overlap</span><span className="font-mono text-gray-800">+{hb.overlapAdd}&quot;</span></div>
              {hb.topAdd !== 0 && <div className="flex justify-between"><span className="text-gray-700">Top ({TOP_LABEL_MAP[panel.topAttachment]})</span><span className="font-mono text-gray-800">+{hb.topAdd}&quot;</span></div>}
              <div className="flex justify-between border-t border-gray-200 pt-0.5 font-bold"><span className="text-[#406517]">Cut height</span><span className="font-mono text-[#406517]">{hb.total}&quot;</span></div>
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
function generateSidePanels(params: {
  sideNum: number; totalWidth: number; leftHeight: number; rightHeight: number;
  config: SideConfig; topAttachment: TopAttachment; leftEdge: SideAttachment; rightEdge: SideAttachment;
}): SavedPanel[] {
  const { sideNum, totalWidth, leftHeight, rightHeight, config, topAttachment, leftEdge, rightEdge } = params
  const { panelCount, splitType } = config; const panelWidth = Math.round(totalWidth / panelCount)
  return Array.from({ length: panelCount }, (_, i) => {
    const cp = (i + 0.5) / panelCount; const rh = Math.round(leftHeight + (rightHeight - leftHeight) * cp)
    const s1: SideAttachment = i === 0 ? leftEdge : splitType; const s2: SideAttachment = i === panelCount - 1 ? rightEdge : splitType
    const r = calculatePanelDimensions({ widthInches: panelWidth, heightInches: rh, topAttachment, side1Attachment: s1, side2Attachment: s2 })
    return { id: `panel-${sideNum}-${i}-${panelWidth}-${rh}`, finalWidth: r.finalWidth, finalHeight: r.finalHeight, rawWidth: panelWidth, rawHeight: rh, topAttachment, side1: s1, side2: s2, side: sideNum, widthBreakdown: r.widthBreakdown, heightBreakdown: r.heightBreakdown }
  })
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Config Card (mini SVG for 1 vs 2 panel layout)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ConfigCard({ config, selected, onClick }: { config: SideConfig; selected: boolean; onClick: () => void }) {
  const n = config.panelCount; const svgW = 88; const svgH = 52; const gap = config.splitType === 'magnetic_door' ? 3 : 0; const pw = (svgW - 8 - gap * (n - 1)) / n
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center rounded-xl p-2.5 transition-all border-2 min-w-[100px] ${selected ? 'border-[#406517] bg-[#406517]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mb-1">
        {Array.from({ length: n }, (_, i) => { const x = 4 + i * (pw + gap); return (<g key={i}><rect x={x} y={4} width={pw} height={svgH - 8} fill={selected ? '#e8f0dc' : '#f3f4f6'} stroke={selected ? GREEN : '#999'} strokeWidth={1.5} rx={2} />{Array.from({ length: Math.floor(pw / 8) }).map((_, j) => <line key={`v${j}`} x1={x + 4 + j * 8} y1={6} x2={x + 4 + j * 8} y2={svgH - 6} stroke={selected ? GREEN : '#bbb'} strokeWidth={0.3} opacity={0.4} />)}{i < n - 1 && config.splitType === 'magnetic_door' && <g>{[16, 26, 36].map(cy => <rect key={cy} x={x + pw + 0.5} y={cy - 3} width={2} height={6} fill="#c0c0c0" stroke="#999" strokeWidth={0.3} rx={0.5} />)}</g>}</g>) })}
      </svg>
      <div className={`text-xs font-bold ${selected ? 'text-[#406517]' : 'text-gray-700'}`}>{config.label}</div>
      <div className="text-[9px] text-gray-500 leading-tight">{config.description}</div>
    </button>
  )
}

function fmt$(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Side Section
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SideSection({ sideNum, state, onChange, onSave, saveStatus, onShowMeasureGuide, isOpen, onToggle }: {
  sideNum: number; state: SideState; onChange: (u: Partial<SideState>) => void;
  onSave: () => void; saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onShowMeasureGuide?: () => void;
  isOpen: boolean; onToggle: () => void;
}) {
  const isDesktop = useIsDesktop()
  const config = SIDE_CONFIGS.find((c) => c.id === state.configId)!
  const tw = parseFloat(state.totalWidth) || 0; const lh = parseFloat(state.leftHeight) || 0; const rh = parseFloat(state.rightHeight) || 0
  const isReady = tw > 0 && lh > 0 && rh > 0
  const panels = useMemo(() => { if (!isReady) return []; return generateSidePanels({ sideNum, totalWidth: tw, leftHeight: lh, rightHeight: rh, config, topAttachment: state.topAttachment, leftEdge: state.leftEdge, rightEdge: state.rightEdge }) }, [sideNum, tw, lh, rh, config, state.topAttachment, state.leftEdge, state.rightEdge, isReady])
  const panelMaxSize = isDesktop ? (config.panelCount > 1 ? 320 : 420) : (config.panelCount > 1 ? 200 : 280)

  return (
    <Card className="!p-0 !bg-white !border-2 !border-gray-200 overflow-hidden transition-all">

      {/* ── COLLAPSED: summary row ── */}
      {!isOpen && (
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggle}>
          <div className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center text-xs font-bold shrink-0">{sideNum}</div>
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
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#406517] font-medium">
            <span>Tap to expand</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* ── EXPANDED: full configurator ── */}
      {isOpen && (
        <>
          {/* Header — click to collapse */}
          <div className="bg-[#406517] px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#4a7519] transition-colors" onClick={onToggle}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">{sideNum}</div>
              <span className="text-white font-bold text-sm">Side {sideNum}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <span>Tap to collapse</span>
                <ChevronUp className="w-4 h-4" />
              </div>
              <div onClick={e => e.stopPropagation()}>
                {isReady && (
                  <button type="button" onClick={onSave} disabled={saveStatus === 'saving'}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50">
                    {saveStatus === 'saving' ? <Loader2 className="w-3 h-3 animate-spin" /> : saveStatus === 'saved' ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {saveStatus === 'saved' ? 'Saved' : 'Save Side'}
                  </button>
                )}
              </div>
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
                <button type="button" onClick={onShowMeasureGuide} className="flex items-center gap-1.5 text-xs text-[#406517] font-semibold hover:underline transition-colors">
                  <Ruler className="w-3.5 h-3.5" /> How to measure
                </button>
              </div>
            )}
          </div>

          {/* Visualization */}
          <div className="px-4 py-6 md:px-8 md:py-8">
            <div className="flex justify-center mb-4">
              <EdgeSelector label="Top Attachment" value={state.topAttachment} onChange={(v) => onChange({ topAttachment: v })} options={TOP_OPTIONS} />
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <div className="shrink-0"><EdgeSelector label="Left Edge" value={state.leftEdge} onChange={(v) => onChange({ leftEdge: v })} options={OUTER_EDGE_OPTIONS} /></div>
              <div className="flex-1 flex items-end justify-center min-w-0">
                {isReady && panels.length > 0 ? (
                  <div className="flex items-end justify-center">
                    {panels.map((panel, i) => (
                      <div key={panel.id} className="flex items-end">
                        {i > 0 && <div className="flex flex-col items-center justify-center mx-0.5 self-center">{[0, 1, 2, 3, 4].map((k) => <div key={k} className="w-1.5 h-3 bg-gradient-to-r from-[#d0d0d0] to-[#a0a0a0] rounded-sm my-0.5" />)}<span className="text-[7px] text-gray-500 mt-0.5 whitespace-nowrap leading-none">Mag Door</span></div>}
                        <div className="flex flex-col items-center">
                          <PanelVisualizer finalWidth={panel.finalWidth} finalHeight={panel.finalHeight} rawWidth={panel.rawWidth} rawHeight={panel.rawHeight} maxSize={panelMaxSize} topAttachment={panel.topAttachment} side1={panel.side1} side2={panel.side2} />
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

          {/* ── Bottom bar: 50/50 with breakdown ── */}
          {panels.length > 0 && (
            <div className="bg-[#406517]/5 border-t border-gray-200 px-5 py-4">
              <div className={`grid gap-4 ${panels.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
                {panels.map((panel, i) => (
                  <div key={panel.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Panel {i + 1}</span>
                      <span className="font-mono font-bold text-[#406517] text-sm">{panel.finalWidth}&quot; &times; {panel.finalHeight}&quot;</span>
                    </div>
                    <div className="text-xs text-gray-500">({SIDE_LABEL_MAP[panel.side1]} | {TOP_LABEL_MAP[panel.topAttachment]} | {SIDE_LABEL_MAP[panel.side2]})</div>
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
function buildCartData(sides: SideState[], meshType: MeshType, meshColor: MeshColor) {
  return sides.map((s, i) => {
    const config = SIDE_CONFIGS.find((c) => c.id === s.configId)!
    const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0
    const panels = (tw > 0 && lh > 0 && rh > 0) ? generateSidePanels({ sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, config, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge }) : []
    return { side: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, layout: config.label, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge, meshType, meshColor, panels: panels.map(p => ({ rawWidth: p.rawWidth, rawHeight: p.rawHeight, finalWidth: p.finalWidth, finalHeight: p.finalHeight, topAttachment: p.topAttachment, side1: p.side1, side2: p.side2 })) }
  })
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Export
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PanelBuilder({ initialMeshType, initialMeshColor, contactInfo, basePath = '/start-project/mosquito-curtains/diy-builder', productType = 'mosquito_curtains' }: PanelBuilderProps = {}) {
  const { products } = useProducts()
  const { getRecommendations } = useDiyHardware()
  const [numSides, setNumSides] = useState(2)
  const [sides, setSides] = useState<SideState[]>([defaultSideState(), defaultSideState()])
  const [meshType, setMeshType] = useState<MeshType>(initialMeshType || 'heavy_mosquito')
  const [meshColor, setMeshColor] = useState<MeshColor>(initialMeshColor || 'black')
  const [hydrated, setHydrated] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  // Contact capture
  const [firstName, setFirstName] = useState(contactInfo?.firstName || '')
  const [lastName, setLastName] = useState(contactInfo?.lastName || '')
  const [email, setEmail] = useState(contactInfo?.email || '')

  // Expert review extras
  const [phone, setPhone] = useState(contactInfo?.phone || '')
  const [photos, setPhotos] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  // Save project
  const [projectName, setProjectName] = useState('')

  // Checkout modal + save-for-later
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showSaveField, setShowSaveField] = useState(false)
  const [saveForLaterEmail, setSaveForLaterEmail] = useState('')
  const [isSavingForLater, setIsSavingForLater] = useState(false)

  // Detail modals
  const [meshDetail, setMeshDetail] = useState<typeof MESH_TYPE_CARDS[0] | null>(null)
  const [attachDetail, setAttachDetail] = useState<typeof TOP_ATTACHMENT_CARDS[0] | null>(null)

  // Editable recommendations overrides
  const [recOverrides, setRecOverrides] = useState<Record<string, number>>({})

  // Measurement guide modal
  const [showMeasureGuide, setShowMeasureGuide] = useState(false)

  // Collapsible side panels — first side open by default
  const [openSides, setOpenSides] = useState<Set<number>>(new Set([0]))
  const toggleSide = useCallback((idx: number) => {
    setOpenSides(prev => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next })
  }, [])

  // Restore from localStorage
  useEffect(() => { try { const s = localStorage.getItem(LS_KEY); if (s) { const p = JSON.parse(s); if (p.numSides) setNumSides(p.numSides); if (Array.isArray(p.sides) && p.sides.length > 0) setSides(p.sides); if (p.meshType && !initialMeshType) setMeshType(p.meshType); if (p.meshColor && !initialMeshColor) setMeshColor(p.meshColor) } } catch {} setHydrated(true) }, [initialMeshType, initialMeshColor])

  // Auto-save debounced
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => { if (!hydrated) return; if (saveRef.current) clearTimeout(saveRef.current); saveRef.current = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify({ numSides, sides, meshType, meshColor })) } catch {} }, 500); return () => { if (saveRef.current) clearTimeout(saveRef.current) } }, [numSides, sides, meshType, meshColor, hydrated])

  useEffect(() => {
    setSides(prev => {
      if (prev.length < numSides) {
        // Auto-open the first newly added side
        setOpenSides(os => { const next = new Set(os); next.add(prev.length); return next })
        return [...prev, ...Array.from({ length: numSides - prev.length }, () => defaultSideState())]
      }
      return prev.slice(0, numSides)
    })
  }, [numSides])

  // Keep meshColor valid
  useEffect(() => { const card = MESH_TYPE_CARDS.find(c => c.id === meshType); if (card && !card.colors.includes(meshColor)) setMeshColor(card.colors[0]) }, [meshType, meshColor])

  const updateSide = useCallback((i: number, u: Partial<SideState>) => setSides(prev => prev.map((s, idx) => idx === i ? { ...s, ...u } : s)), [])

  const allPanels = useMemo(() => sides.flatMap((s, i) => { const c = SIDE_CONFIGS.find(x => x.id === s.configId)!; const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0; if (tw <= 0 || lh <= 0 || rh <= 0) return []; return generateSidePanels({ sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, config: c, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge }) }), [sides])
  const allSidesReady = sides.every(s => { const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0; return tw > 0 && lh > 0 && rh > 0 })

  // Recommendations — DB-driven rules + product pricing
  const baseRecs = useMemo(() => getRecommendations(allPanels as PanelForHardware[], products, meshColor, productType), [allPanels, getRecommendations, products, meshColor, productType])

  // Reset overrides when panels change
  useEffect(() => { setRecOverrides({}) }, [allPanels.length])

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const canSave = firstName.trim().length > 0 && isValidEmail(email)

  /* Submit for Expert Review — only needs email */
  const handleSaveProject = async () => {
    if (!isValidEmail(email)) return
    setSaveStatus('saving')
    try {
      const cd = buildCartData(sides, meshType, meshColor)
      const noteParts = [`Expert Review Request: ${numSides} sides, ${allPanels.length} panels`]
      if (description.trim()) noteParts.push(description.trim())

      const body: Record<string, unknown> = {
        email: email.trim(),
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        product: 'mosquito_curtains',
        projectType: 'expert_review',
        projectName: projectName.trim() || undefined,
        topAttachment: sides[0]?.topAttachment || 'tracking',
        numberOfSides: numSides,
        notes: noteParts.join('\n\n'),
        description: description.trim() || undefined,
        cart_data: cd,
        hasPhotos: photos.length > 0,
      }
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')

      // Upload photos if any
      if (photos.length > 0 && d.id) {
        const formData = new FormData()
        photos.forEach(f => formData.append('photos', f))
        formData.append('projectId', d.id)
        await fetch('/api/projects/photos', { method: 'POST', body: formData }).catch(err => console.error('Photo upload:', err))
      }

      setSaveStatus('saved')
      if (d.shareUrl) setShareUrl(d.shareUrl)
    } catch (e) { console.error('Save:', e); setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 3000) }
  }

  /* Save project — pushes name/email into expert review fields on success */
  const handleSaveForLater = async () => {
    if (!isValidEmail(saveForLaterEmail)) return
    setIsSavingForLater(true)
    try {
      const cd = buildCartData(sides, meshType, meshColor)
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveForLaterEmail.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          projectName: projectName.trim() || undefined,
          product: 'mosquito_curtains',
          projectType: 'saved_for_later',
          topAttachment: sides[0]?.topAttachment || 'tracking',
          numberOfSides: numSides,
          notes: `Saved for later: ${numSides} sides, ${allPanels.length} panels`,
          cart_data: cd,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')

      setSaveStatus('saved')
      if (d.shareUrl) setShareUrl(d.shareUrl)

      // Push saved contact info into Expert Review fields so they don't re-type
      if (saveForLaterEmail.trim() && !email) setEmail(saveForLaterEmail.trim())
      // firstName and lastName are already shared state
    } catch { alert('Could not save. Please try again.') }
    finally { setIsSavingForLater(false) }
  }

  const currentMeshCard = MESH_TYPE_CARDS.find(c => c.id === meshType)
  const availableColors = currentMeshCard?.colors || ['black', 'white']

  return (
    <Stack gap="lg">
      {/* ══════════════════════════════════════════════
         SECTION 1: OPTIONS
         ══════════════════════════════════════════════ */}
      <Card className="!p-0 !bg-white !border-2 !border-[#406517]/20 overflow-hidden">
        {/* Centered header */}
        <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2.5 mb-1.5">
            <SlidersHorizontal className="w-6 h-6 text-[#406517]" />
            <h3 className="text-xl font-bold text-gray-900">Options</h3>
          </div>
          <p className="text-sm text-gray-500">Mesh type, color & top attachment</p>
        </div>

        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT: Mesh Type — 3-across image cards */}
            <div>
              <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide mb-3">Mesh Type</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {MESH_TYPE_CARDS.map(m => (
                  <div key={m.id} role="button" tabIndex={0} onClick={() => setMeshType(m.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMeshType(m.id) }}
                    className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${meshType === m.id ? 'border-[#406517] ring-2 ring-[#406517]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="aspect-video relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                      {m.popular && <span className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-[#406517] text-white px-2 py-0.5 rounded-full leading-none">90%</span>}
                      {meshType === m.id && <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-[#406517] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                    </div>
                    <div className="p-2.5 text-center">
                      <div className="font-bold text-gray-800 text-sm leading-tight">{m.label}</div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setMeshDetail(m) }} className="text-xs text-[#406517] font-semibold hover:underline mt-0.5">See details</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Color swatches */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-700 font-semibold uppercase tracking-wide">Color:</span>
                {MESH_COLOR_SWATCHES.filter(c => availableColors.includes(c.id)).map(c => (
                  <button key={c.id} type="button" onClick={() => setMeshColor(c.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${meshColor === c.id ? 'ring-2 ring-[#406517] bg-[#406517]/5' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: c.hex }} />
                    <span className="text-gray-700">{c.label}</span>
                    {meshColor === c.id && <Check className="w-3.5 h-3.5 text-[#406517]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Top Attachment — 2 GIF cards side by side */}
            <div>
              <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide mb-3">Top Attachment</div>
              <div className="grid grid-cols-2 gap-2">
                {TOP_ATTACHMENT_CARDS.map(att => {
                  const currentTop = sides[0]?.topAttachment
                  const isActive = att.id === currentTop
                  return (
                    <div key={att.id} role="button" tabIndex={0} onClick={() => setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id })))} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id }))) }}
                      className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${isActive ? 'border-[#406517] ring-2 ring-[#406517]/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="aspect-video relative bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={att.image} alt={att.label} className="w-full h-full object-contain" />
                        {att.isGif && <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5"><Play className="w-3 h-3" /> GIF</div>}
                        {isActive && <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-[#406517] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                      </div>
                      <div className="p-2.5 text-center">
                        <div className="font-bold text-gray-800 text-sm leading-tight">{att.label}</div>
                        <div className="text-xs text-gray-600 leading-tight">{att.subtitle}</div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setAttachDetail(att) }} className="text-xs text-[#406517] font-semibold hover:underline mt-0.5">See details</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Number of Sides */}
          <div className="text-center pt-2">
            <div className="text-lg font-bold text-gray-800 mb-1">How many sides need screening?</div>
            <div className="text-sm text-gray-600 mb-3">Select the number of open sides on your porch or structure</div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button key={n} type="button" onClick={() => setNumSides(n)} className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${numSides === n ? 'bg-[#406517] text-white shadow-md ring-2 ring-[#406517]/30 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Mesh Detail Lightbox */}
      <LightboxModal open={!!meshDetail} onClose={() => setMeshDetail(null)} title={meshDetail?.label || ''} image={meshDetail?.image || ''}>
        {meshDetail && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-bold text-lg text-gray-800">{meshDetail.label}</div>
              <div className="text-sm text-[#406517] font-medium">{meshDetail.subtitle}</div>
              <div className="text-sm text-gray-600 mt-1">{meshDetail.description}</div>
              <div className="flex gap-2 mt-2">
                {meshDetail.colors.map(c => { const sw = MESH_COLOR_SWATCHES.find(s => s.id === c); return sw ? <div key={c} className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs"><div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: sw.hex }} />{sw.label}</div> : null })}
              </div>
            </div>
            <Button variant="primary" onClick={() => { setMeshType(meshDetail.id); setMeshDetail(null) }}>
              <Check className="w-4 h-4 mr-2" /> Select
            </Button>
          </div>
        )}
      </LightboxModal>

      {/* Attachment Detail Lightbox */}
      <LightboxModal open={!!attachDetail} onClose={() => setAttachDetail(null)} title={attachDetail?.label || ''} image={attachDetail?.image || ''} isGif={attachDetail?.isGif}>
        {attachDetail && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-bold text-lg text-gray-800">{attachDetail.label}</div>
              <div className="text-sm text-[#406517] font-medium">{attachDetail.subtitle}</div>
              <div className="text-sm text-gray-600 mt-1">{attachDetail.description}</div>
            </div>
            <Button variant="primary" onClick={() => { setSides(prev => prev.map(s => ({ ...s, topAttachment: attachDetail.id }))); setAttachDetail(null) }}>
              <Check className="w-4 h-4 mr-2" /> Select
            </Button>
          </div>
        )}
      </LightboxModal>

      {/* Measurement Guide Modal */}
      <MeasurementGuideModal open={showMeasureGuide} onClose={() => setShowMeasureGuide(false)} />

      {/* ══════════════════════════════════════════════
         SECTION 2: PANELS (each side is its own card)
         ══════════════════════════════════════════════ */}
      {sides.map((side, i) => (
        <SideSection key={i} sideNum={i + 1} state={side} onChange={(u) => updateSide(i, u)} onSave={handleSaveProject} saveStatus={saveStatus} onShowMeasureGuide={() => setShowMeasureGuide(true)} isOpen={openSides.has(i)} onToggle={() => toggleSide(i)} />
      ))}

      {/* ══════════════════════════════════════════════
         SECTION 3: TRACK & ATTACHMENTS
         ══════════════════════════════════════════════ */}
      {allSidesReady && baseRecs.length > 0 && (() => {
        const recsWithQty = baseRecs.map(item => {
          const qty = recOverrides[item.key] ?? item.qty
          return { ...item, qty, totalPrice: qty * item.unitPrice }
        })
        const grandTotal = recsWithQty.reduce((sum, r) => sum + r.totalPrice, 0)
        return (
          <Card className="!p-0 !bg-white !border-2 !border-[#406517]/20 overflow-hidden">
            {/* Centered header */}
            <div className="text-center px-6 pt-6 md:pt-8 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-2.5 mb-1.5">
                <Wrench className="w-6 h-6 text-[#406517]" />
                <h3 className="text-xl font-bold text-gray-900">Track & Attachments</h3>
              </div>
              <p className="text-sm text-gray-500">
                {baseRecs.length} items recommended — based on your {allPanels.length} panel{allPanels.length !== 1 ? 's' : ''} configuration
              </p>
            </div>

            <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5">
              <div className="space-y-2">
                {/* Header row */}
                <div className="hidden sm:grid grid-cols-[52px_1fr_100px_80px_70px] gap-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <div />
                  <div>Product</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Each</div>
                  <div className="text-right">Total</div>
                </div>

                {recsWithQty.map(item => (
                  <div key={item.key} className="flex items-center sm:grid sm:grid-cols-[52px_1fr_100px_80px_70px] gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    {/* Product image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.label} width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>

                    {/* Name + description */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm leading-tight">{item.label}</div>
                      <div className="text-xs text-gray-500 leading-tight">{item.description}</div>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center justify-center shrink-0">
                      <QtyStepper value={item.qty} onChange={v => setRecOverrides(prev => ({ ...prev, [item.key]: v }))} min={0} />
                    </div>

                    {/* Unit price */}
                    <div className="text-sm text-gray-600 text-right tabular-nums shrink-0 hidden sm:block">${fmt$(item.unitPrice)}</div>

                    {/* Line total */}
                    <div className="text-sm font-semibold text-gray-800 text-right tabular-nums shrink-0">
                      {item.totalPrice > 0 ? `$${fmt$(item.totalPrice)}` : <span className="text-green-600">FREE</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grand total */}
              <div className="mt-4 pt-3 border-t-2 border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">Hardware & Accessories Total</div>
                <div className="text-lg font-bold text-[#406517]">${fmt$(grandTotal)}</div>
              </div>
            </div>
          </Card>
        )
      })()}

      {/* ══════════════════════════════════════════════
         SAVE PROJECT
         ══════════════════════════════════════════════ */}
      {allSidesReady && allPanels.length > 0 && (
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
                        setLinkCopied(true)
                        setTimeout(() => setLinkCopied(false), 2000)
                      }}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-[#406517]/10 transition-colors"
                      title="Copy link"
                    >
                      {linkCopied ? <CheckCircle className="w-4 h-4 text-[#406517]" /> : <Copy className="w-4 h-4 text-[#406517]" />}
                    </button>
                  </div>
                )}
                <Text size="xs" className="text-gray-500 !mb-0 text-center">
                  We&apos;ve emailed your project link to <strong>{saveForLaterEmail}</strong>. You can return anytime to edit or submit for review.
                </Text>
                <div className="text-center">
                  <button type="button" onClick={() => setSaveStatus('idle')} className="text-xs text-[#406517] font-medium underline underline-offset-2 hover:text-[#2e4a10] transition-colors">
                    Edit project details
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Project name (e.g. &quot;Back Porch&quot;)" value={projectName} onChange={e => setProjectName(e.target.value)}
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
                    <input type="email" placeholder="Email address *" value={saveForLaterEmail} onChange={e => setSaveForLaterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors" />
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSaveForLater}
                    disabled={!isValidEmail(saveForLaterEmail) || isSavingForLater}
                  >
                    {isSavingForLater ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Bookmark className="w-4 h-4 mr-2" /> Save Project</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
         SUBMIT YOUR DESIGN
         ══════════════════════════════════════════════ */}
      {allSidesReady && allPanels.length > 0 && (
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
          </div>

          {/* Full-width form content */}
          <div className="px-6 pb-6 md:px-8 md:pb-8 pt-5 space-y-3">
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

            {/* Photo uploader */}
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#406517] hover:bg-[#406517]/5 transition-colors group">
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#406517] transition-colors" />
              <div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#406517] transition-colors">
                  {photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} selected` : 'Upload photos of your space'}
                </span>
                <span className="block text-xs text-gray-400">Optional — helps us give the best recommendation</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => {
                  if (e.target.files) setPhotos(prev => [...prev, ...Array.from(e.target.files!)])
                }}
              />
            </label>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((file, i) => (
                  <div key={i} className="relative group">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="text-[10px] text-gray-400 truncate w-14 text-center mt-0.5">{file.name.slice(0, 10)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <textarea
              placeholder="Tell us about your space: what you're enclosing, any challenges, special requests..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] transition-colors resize-none"
            />

            {/* Submit + Order buttons */}
            <div className="space-y-3 pt-1 text-center">
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveProject}
                  disabled={!isValidEmail(email) || !firstName.trim() || saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4 mr-2" /> Submit for Free Expert Review</>
                  )}
                </Button>
                <Text size="xs" className="text-gray-500 !mb-0">
                  Recommended. We&apos;ll double-check measurements, layout, and attachments before you pay.
                </Text>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Checkout */}
              <div className="space-y-1">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  I&apos;m sure, take me to checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Text size="xs" className="text-gray-400 !mb-0">
                  For experienced DIYers who are confident in their measurements.
                </Text>
              </div>
            </div>
          </div>

        </Card>
      )}

      {/* ── Checkout confirmation modal ── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCheckoutModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8">
            <button type="button" onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-3">Skip expert review?</div>
              <Text className="text-gray-600 !mb-2">
                Most customers have us double-check their project first.
              </Text>
              <Text size="sm" className="text-gray-500 !mb-6">
                We&apos;ll still look at your order before it ships and reach out if something looks off. Do you still want to go straight to checkout?
              </Text>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="primary" size="lg" onClick={() => setShowCheckoutModal(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />Back to Expert Review
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/cart">Continue to Checkout<ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Stack>
  )
}
