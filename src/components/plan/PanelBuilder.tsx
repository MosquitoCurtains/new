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
  ArrowRight, Users, Zap, Check, Play, X, Plus, Minus,
  Wrench, Magnet, Grip, Ruler,
} from 'lucide-react'
import type { MeshType, MeshColor } from '@/lib/pricing/types'

/* ─── Product images ─── */
const TRACK_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Track-Color-White-Black-700x700.jpg'
const VELCRO_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Black-Velcro-1.jpg'

/* ─── Mesh type data with images ─── */
const MESH_TYPE_CARDS = [
  {
    id: 'heavy_mosquito' as MeshType,
    label: 'Heavy Mosquito',
    subtitle: '90% of customers choose this',
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies. Durable outdoor polyester.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: ['black', 'white', 'ivory'] as MeshColor[],
    popular: true,
  },
  {
    id: 'no_see_um' as MeshType,
    label: 'No-See-Um',
    subtitle: 'For tiny biting flies',
    description: 'Finer weave blocks tiny midge flies common near coastal areas. Slightly reduced airflow.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    colors: ['black', 'white'] as MeshColor[],
  },
  {
    id: 'shade' as MeshType,
    label: 'Shade',
    subtitle: 'Shade + privacy + bugs',
    description: 'Provides shade, privacy and insect protection all in one. Also works as a projection screen.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
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
function DetailModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between rounded-t-2xl z-10">
          <span className="font-bold text-gray-800">{title}</span>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-gray-600" /></button>
        </div>
        <div className="p-5">{children}</div>
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Compute recommended hardware from panels
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
interface RecommendedItem {
  key: string; label: string; description: string; qty: number; unit: string;
  icon: React.ReactNode;
}

function computeRecommendations(panels: SavedPanel[]): RecommendedItem[] {
  if (panels.length === 0) return []

  // Track: total linear feet for panels with tracking
  const trackingPanels = panels.filter(p => p.topAttachment === 'tracking')
  const trackFeet = Math.ceil(trackingPanels.reduce((sum, p) => sum + p.finalWidth, 0) / 12)

  // Snap carriers: 1 per tracking panel (to hang from track)
  const snapCarriers = trackingPanels.length

  // Velcro: total linear feet for panels with velcro top
  const velcroPanels = panels.filter(p => p.topAttachment === 'velcro')
  const velcroFeet = Math.ceil(velcroPanels.reduce((sum, p) => sum + p.finalWidth, 0) / 12)

  // Marine snap edges: count how many edges use marine_snaps
  const snapEdges = panels.reduce((n, p) => n + (p.side1 === 'marine_snaps' ? 1 : 0) + (p.side2 === 'marine_snaps' ? 1 : 0), 0)

  // Magnetic door edges: count edges with magnetic_door
  const magnetEdges = panels.reduce((n, p) => n + (p.side1 === 'magnetic_door' ? 1 : 0) + (p.side2 === 'magnetic_door' ? 1 : 0), 0)
  // Magnetic doors come in pairs (both edges of the doorway), so count unique doorways
  const magnetDoorways = Math.ceil(magnetEdges / 2)

  // Stucco strips: count edges with stucco_strip
  const stuccoEdges = panels.reduce((n, p) => n + (p.side1 === 'stucco_strip' ? 1 : 0) + (p.side2 === 'stucco_strip' ? 1 : 0), 0)

  const items: RecommendedItem[] = []

  if (trackFeet > 0) items.push({ key: 'track', label: 'Curtain Track', description: `${trackFeet} ft of track for ${trackingPanels.length} panel${trackingPanels.length !== 1 ? 's' : ''}`, qty: trackFeet, unit: 'ft', icon: <Ruler className="w-5 h-5" /> })
  if (snapCarriers > 0) items.push({ key: 'carriers', label: 'Snap Carriers', description: '1 per tracking panel - snaps into track', qty: snapCarriers, unit: 'sets', icon: <Grip className="w-5 h-5" /> })
  if (velcroFeet > 0) items.push({ key: 'velcro', label: 'Velcro Strips', description: `${velcroFeet} ft of hook & loop for ${velcroPanels.length} panel${velcroPanels.length !== 1 ? 's' : ''}`, qty: velcroFeet, unit: 'ft', icon: <Grip className="w-5 h-5" /> })
  if (snapEdges > 0) items.push({ key: 'snaps', label: 'Marine Snap Kits', description: `For ${snapEdges} snap edge${snapEdges !== 1 ? 's' : ''}`, qty: snapEdges, unit: 'kits', icon: <Grip className="w-5 h-5" /> })
  if (magnetDoorways > 0) items.push({ key: 'magnets', label: 'Magnetic Door Strips', description: `${magnetDoorways} magnetic doorway${magnetDoorways !== 1 ? 's' : ''} (pair per doorway)`, qty: magnetDoorways, unit: 'pairs', icon: <Magnet className="w-5 h-5" /> })
  if (stuccoEdges > 0) items.push({ key: 'stucco', label: 'Stucco Strips', description: `For ${stuccoEdges} stucco edge${stuccoEdges !== 1 ? 's' : ''}`, qty: stuccoEdges, unit: 'strips', icon: <Ruler className="w-5 h-5" /> })

  // Snap tool always recommended
  items.push({ key: 'snap_tool', label: 'Snap Tool', description: 'Required for installing snaps. Fully refundable if returned.', qty: 1, unit: 'tool', icon: <Wrench className="w-5 h-5" /> })

  return items
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Side Section
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SideSection({ sideNum, state, onChange, onSave, saveStatus }: {
  sideNum: number; state: SideState; onChange: (u: Partial<SideState>) => void;
  onSave: () => void; saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}) {
  const isDesktop = useIsDesktop()
  const config = SIDE_CONFIGS.find((c) => c.id === state.configId)!
  const tw = parseFloat(state.totalWidth) || 0; const lh = parseFloat(state.leftHeight) || 0; const rh = parseFloat(state.rightHeight) || 0
  const isReady = tw > 0 && lh > 0 && rh > 0
  const panels = useMemo(() => { if (!isReady) return []; return generateSidePanels({ sideNum, totalWidth: tw, leftHeight: lh, rightHeight: rh, config, topAttachment: state.topAttachment, leftEdge: state.leftEdge, rightEdge: state.rightEdge }) }, [sideNum, tw, lh, rh, config, state.topAttachment, state.leftEdge, state.rightEdge, isReady])
  const panelMaxSize = isDesktop ? (config.panelCount > 1 ? 320 : 420) : (config.panelCount > 1 ? 200 : 280)

  return (
    <Card className="!p-0 !bg-white !border-2 !border-[#406517]/30 overflow-hidden">
      {/* Header with save button */}
      <div className="bg-[#406517] px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">{sideNum}</div>
          <span className="text-white font-bold text-sm">Side {sideNum}</span>
        </div>
        {isReady && (
          <button type="button" onClick={onSave} disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50">
            {saveStatus === 'saving' ? <Loader2 className="w-3 h-3 animate-spin" /> : saveStatus === 'saved' ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saveStatus === 'saved' ? 'Saved' : 'Save Side'}
          </button>
        )}
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
export default function PanelBuilder({ initialMeshType, initialMeshColor, contactInfo, basePath = '/start-project/mosquito-curtains/diy-builder' }: PanelBuilderProps = {}) {
  const [numSides, setNumSides] = useState(2)
  const [sides, setSides] = useState<SideState[]>([defaultSideState(), defaultSideState()])
  const [meshType, setMeshType] = useState<MeshType>(initialMeshType || 'heavy_mosquito')
  const [meshColor, setMeshColor] = useState<MeshColor>(initialMeshColor || 'black')
  const [hydrated, setHydrated] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  // Detail modals
  const [meshDetail, setMeshDetail] = useState<typeof MESH_TYPE_CARDS[0] | null>(null)
  const [attachDetail, setAttachDetail] = useState<typeof TOP_ATTACHMENT_CARDS[0] | null>(null)

  // Editable recommendations overrides
  const [recOverrides, setRecOverrides] = useState<Record<string, number>>({})

  // Restore from localStorage
  useEffect(() => { try { const s = localStorage.getItem(LS_KEY); if (s) { const p = JSON.parse(s); if (p.numSides) setNumSides(p.numSides); if (Array.isArray(p.sides) && p.sides.length > 0) setSides(p.sides); if (p.meshType && !initialMeshType) setMeshType(p.meshType); if (p.meshColor && !initialMeshColor) setMeshColor(p.meshColor) } } catch {} setHydrated(true) }, [initialMeshType, initialMeshColor])

  // Auto-save debounced
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => { if (!hydrated) return; if (saveRef.current) clearTimeout(saveRef.current); saveRef.current = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify({ numSides, sides, meshType, meshColor })) } catch {} }, 500); return () => { if (saveRef.current) clearTimeout(saveRef.current) } }, [numSides, sides, meshType, meshColor, hydrated])

  useEffect(() => { setSides(prev => prev.length < numSides ? [...prev, ...Array.from({ length: numSides - prev.length }, () => defaultSideState())] : prev.slice(0, numSides)) }, [numSides])

  // Keep meshColor valid
  useEffect(() => { const card = MESH_TYPE_CARDS.find(c => c.id === meshType); if (card && !card.colors.includes(meshColor)) setMeshColor(card.colors[0]) }, [meshType, meshColor])

  const updateSide = useCallback((i: number, u: Partial<SideState>) => setSides(prev => prev.map((s, idx) => idx === i ? { ...s, ...u } : s)), [])

  const allPanels = useMemo(() => sides.flatMap((s, i) => { const c = SIDE_CONFIGS.find(x => x.id === s.configId)!; const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0; if (tw <= 0 || lh <= 0 || rh <= 0) return []; return generateSidePanels({ sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh, config: c, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge }) }), [sides])
  const allSidesReady = sides.every(s => { const tw = parseFloat(s.totalWidth) || 0; const lh = parseFloat(s.leftHeight) || 0; const rh = parseFloat(s.rightHeight) || 0; return tw > 0 && lh > 0 && rh > 0 })

  // Recommendations
  const baseRecs = useMemo(() => computeRecommendations(allPanels), [allPanels])

  // Reset overrides when panels change
  useEffect(() => { setRecOverrides({}) }, [allPanels.length])

  const handleSaveProject = async () => {
    setSaveStatus('saving')
    try {
      const cd = buildCartData(sides, meshType, meshColor)
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: contactInfo?.email || 'anonymous@panel-builder.local', firstName: contactInfo?.firstName, lastName: contactInfo?.lastName, phone: contactInfo?.phone, product: 'mosquito_curtains', projectType: 'porch', topAttachment: sides[0]?.topAttachment || 'tracking', numberOfSides: numSides, notes: `Panel Builder: ${numSides} sides, ${allPanels.length} panels`, cart_data: cd }) })
      const d = await res.json(); if (!res.ok) throw new Error(d.error || 'Failed'); setSaveStatus('saved'); if (d.shareUrl) setShareUrl(d.shareUrl)
    } catch (e) { console.error('Save:', e); setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 3000) }
  }

  const currentMeshCard = MESH_TYPE_CARDS.find(c => c.id === meshType)
  const availableColors = currentMeshCard?.colors || ['black', 'white']

  return (
    <Stack gap="lg">
      {/* ── 50/50: Mesh Type + Top Attachment ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT: Mesh Type */}
        <Card className="!p-4 !bg-white !border-2 !border-gray-200">
          <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Mesh Type</div>
          <div className="space-y-2 mb-3">
            {MESH_TYPE_CARDS.map(m => (
              <button key={m.id} type="button" onClick={() => setMeshType(m.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${meshType === m.id ? 'border-[#406517] bg-[#406517]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.label} className="w-full h-full object-cover" />
                  {meshType === m.id && <div className="absolute inset-0 bg-[#406517]/20 flex items-center justify-center"><Check className="w-5 h-5 text-white drop-shadow" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{m.label}</span>
                    {m.popular && <span className="text-[9px] font-bold bg-[#406517] text-white px-1.5 py-0.5 rounded-full">90%</span>}
                  </div>
                  <div className="text-xs text-gray-600">{m.subtitle}</div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setMeshDetail(m) }} className="text-[10px] text-[#406517] font-semibold hover:underline shrink-0">Details</button>
              </button>
            ))}
          </div>
          {/* Color swatches */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Color:</span>
            {MESH_COLOR_SWATCHES.filter(c => availableColors.includes(c.id)).map(c => (
              <button key={c.id} type="button" onClick={() => setMeshColor(c.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${meshColor === c.id ? 'ring-2 ring-[#406517] bg-[#406517]/5' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: c.hex }} />
                <span className="text-gray-700">{c.label}</span>
                {meshColor === c.id && <Check className="w-3 h-3 text-[#406517]" />}
              </button>
            ))}
          </div>
        </Card>

        {/* RIGHT: Top Attachment */}
        <Card className="!p-4 !bg-white !border-2 !border-gray-200">
          <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Top Attachment</div>
          <div className="space-y-2">
            {TOP_ATTACHMENT_CARDS.map(att => {
              const currentTop = sides[0]?.topAttachment
              const isActive = att.id === currentTop
              return (
                <button key={att.id} type="button" onClick={() => setSides(prev => prev.map(s => ({ ...s, topAttachment: att.id })))}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${isActive ? 'border-[#406517] bg-[#406517]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={att.staticThumb} alt={att.label} className="w-full h-full object-cover" />
                    {isActive && <div className="absolute inset-0 bg-[#406517]/20 flex items-center justify-center"><Check className="w-5 h-5 text-white drop-shadow" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm">{att.label}</div>
                    <div className="text-xs text-gray-600">{att.subtitle}</div>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setAttachDetail(att) }} className="text-[10px] text-[#406517] font-semibold hover:underline shrink-0">Details</button>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Mesh Detail Modal */}
      <DetailModal open={!!meshDetail} onClose={() => setMeshDetail(null)} title={meshDetail?.label || ''}>
        {meshDetail && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meshDetail.image} alt={meshDetail.label} className="w-full aspect-square object-cover" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800 mb-1">{meshDetail.label}</div>
              <div className="text-sm text-[#406517] font-medium mb-2">{meshDetail.subtitle}</div>
              <div className="text-sm text-gray-700 leading-relaxed">{meshDetail.description}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Available Colors</div>
              <div className="flex gap-2">
                {meshDetail.colors.map(c => { const sw = MESH_COLOR_SWATCHES.find(s => s.id === c); return sw ? <div key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-xs"><div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: sw.hex }} />{sw.label}</div> : null })}
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setMeshType(meshDetail.id); setMeshDetail(null) }}>
              <Check className="w-4 h-4 mr-2" /> Select {meshDetail.label}
            </Button>
          </div>
        )}
      </DetailModal>

      {/* Attachment Detail Modal */}
      <DetailModal open={!!attachDetail} onClose={() => setAttachDetail(null)} title={attachDetail?.label || ''}>
        {attachDetail && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={attachDetail.image} alt={attachDetail.label} className="w-full aspect-video object-contain" />
              {attachDetail.isGif && <div className="text-center text-[10px] text-gray-500 py-1">Animated preview</div>}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800 mb-1">{attachDetail.label}</div>
              <div className="text-sm text-[#406517] font-medium mb-2">{attachDetail.subtitle}</div>
              <div className="text-sm text-gray-700 leading-relaxed">{attachDetail.description}</div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setSides(prev => prev.map(s => ({ ...s, topAttachment: attachDetail.id }))); setAttachDetail(null) }}>
              <Check className="w-4 h-4 mr-2" /> Select {attachDetail.label}
            </Button>
          </div>
        )}
      </DetailModal>

      {/* ── Number of Sides ── */}
      <Card className="!p-5 !bg-white !border-2 !border-gray-200">
        <div className="text-center mb-3">
          <div className="text-lg font-bold text-gray-800">How many sides need screening?</div>
          <div className="text-sm text-gray-600">Select the number of open sides on your porch or structure</div>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <button key={n} type="button" onClick={() => setNumSides(n)} className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${numSides === n ? 'bg-[#406517] text-white shadow-md ring-2 ring-[#406517]/30 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}`}>{n}</button>
          ))}
        </div>
      </Card>

      {/* ── Side Sections ── */}
      {sides.map((side, i) => (
        <SideSection key={i} sideNum={i + 1} state={side} onChange={(u) => updateSide(i, u)} onSave={handleSaveProject} saveStatus={saveStatus} />
      ))}

      {/* ── Hardware Recommendations ── */}
      {allSidesReady && baseRecs.length > 0 && (
        <Card className="!p-5 !bg-white !border-2 !border-gray-200">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-gray-800">Recommended Hardware & Accessories</div>
            <div className="text-sm text-gray-600">Based on your {allPanels.length} panel{allPanels.length !== 1 ? 's' : ''} configuration. Adjust quantities as needed.</div>
          </div>
          <div className="space-y-3">
            {baseRecs.map(item => {
              const qty = recOverrides[item.key] ?? item.qty
              return (
                <div key={item.key} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-[#406517]/10 flex items-center justify-center text-[#406517] shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <QtyStepper value={qty} onChange={v => setRecOverrides(prev => ({ ...prev, [item.key]: v }))} min={0} />
                    <span className="text-xs text-gray-500 w-8">{item.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* ── Project Summary ── */}
      {allSidesReady && allPanels.length > 0 && (
        <Card className="!p-5 !bg-[#406517]/5 !border-2 !border-[#406517]/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-gray-700 font-medium">{allPanels.length} panel{allPanels.length !== 1 ? 's' : ''} across {numSides} side{numSides !== 1 ? 's' : ''}</div>
              <div className="text-xs text-gray-600">{meshType.replace(/_/g, ' ')} mesh in {meshColor}</div>
            </div>
            <Button variant="primary" size="md" onClick={handleSaveProject} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : saveStatus === 'saved' ? <><CheckCircle className="w-4 h-4 mr-2" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save Project</>}
            </Button>
          </div>
        </Card>
      )}

      {/* ── Next Step Options ── */}
      {allSidesReady && saveStatus !== 'saved' && (
        <div>
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-gray-800">What would you like to do next?</div>
            <div className="text-sm text-gray-600">Choose how you&apos;d like to proceed with your project</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" onClick={handleSaveProject} disabled={saveStatus === 'saving'}
              className="group relative flex flex-col items-center text-center p-6 md:p-8 bg-white border-2 border-[#406517]/30 rounded-2xl hover:border-[#406517] hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-[#406517]/10 flex items-center justify-center mb-4 group-hover:bg-[#406517]/20 transition-colors"><Zap className="w-7 h-7 text-[#406517]" /></div>
              <div className="text-lg font-bold text-gray-800 mb-1">Get an Instant Quote</div>
              <div className="text-sm text-gray-600 mb-4">See estimated pricing for your panels and accessories right away.</div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#406517]">
                {saveStatus === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <>Continue to Quote <ArrowRight className="w-4 h-4" /></>}
              </span>
            </button>
            <Link href={`${basePath}/expert-assistance`} onClick={() => { try { localStorage.setItem(LS_KEY, JSON.stringify({ numSides, sides, meshType, meshColor })) } catch {} }}
              className="group relative flex flex-col items-center text-center p-6 md:p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#406517]/50 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#406517]/10 transition-colors"><Users className="w-7 h-7 text-gray-600 group-hover:text-[#406517] transition-colors" /></div>
              <div className="text-lg font-bold text-gray-800 mb-1">Send to Our Planning Team</div>
              <div className="text-sm text-gray-600 mb-4">Our experts will review your configuration, verify measurements, and provide a detailed quote.</div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 group-hover:text-[#406517] transition-colors">Talk to an Expert <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Saved Success ── */}
      {saveStatus === 'saved' && (
        <Card className="!p-0 !bg-white !border-2 !border-[#406517]/30 overflow-hidden">
          <div className="px-6 py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-lg font-bold text-gray-800 mb-1">Project Saved!</div>
            <div className="text-sm text-gray-600 mb-6">Your panel configuration has been saved. Choose your next step:</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" size="lg" asChild><Link href={`${basePath}/instant-quote`}><Zap className="w-4 h-4 mr-2" />Get Instant Quote</Link></Button>
              <Button variant="secondary" size="lg" asChild><Link href={`${basePath}/expert-assistance`}><Users className="w-4 h-4 mr-2" />Send to Planning Team</Link></Button>
            </div>
            {shareUrl && <div className="mt-4 text-xs text-gray-500">Project link: <span className="font-mono text-[#406517]">{typeof window !== 'undefined' ? window.location.origin : ''}{shareUrl}</span></div>}
          </div>
        </Card>
      )}
    </Stack>
  )
}
