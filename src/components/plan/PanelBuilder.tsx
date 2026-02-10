'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
  Card,
  Heading,
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
import { Info, Plus, Minus, ArrowRight, X, ChevronDown, ChevronUp } from 'lucide-react'

/* ─── Product images ─── */
const TRACK_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Track-Color-White-Black-700x700.jpg'

/* ─── Option configs ─── */
const TOP_OPTIONS: { value: TopAttachment; label: string; image?: string }[] = [
  { value: 'tracking', label: 'Tracking', image: TRACK_IMAGE },
  { value: 'velcro', label: 'Velcro' },
]

const SIDE_OPTIONS: { value: SideAttachment; label: string; image?: string; adj: string }[] = [
  { value: 'none', label: 'None', adj: '+0"' },
  { value: 'marine_snaps', label: 'Marine Snaps', image: '/images/products/marine-snaps.png', adj: '+1"' },
  { value: 'magnetic_door', label: 'Magnetic Door', image: '/images/products/neodymium-magnets.png', adj: '+1"' },
  { value: 'stucco_strip', label: 'Stucco Strip', adj: '-1"' },
]

const SIDE_LABEL_MAP: Record<SideAttachment, string> = {
  none: 'Open',
  marine_snaps: 'Snaps',
  magnetic_door: 'Magnets',
  stucco_strip: 'Stucco',
}

const TOP_LABEL_MAP: Record<TopAttachment, string> = {
  tracking: 'Track',
  velcro: 'Velcro',
}

/* ─── Constants ─── */
const GREEN = '#406517'
const GREEN_LIGHT = '#5a8a2a'
const SNAP_COUNT = 5
const SELECT_CLS = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-all cursor-pointer appearance-none'
const INPUT_CLS = 'w-20 px-2 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-colors'

/* ─── Saved panel type ─── */
export interface SavedPanel {
  id: string
  finalWidth: number
  finalHeight: number
  rawWidth: number
  rawHeight: number
  topAttachment: TopAttachment
  side1: SideAttachment
  side2: SideAttachment
  side: number // which side of the porch (1, 2, 3, ...)
}

/* ─── Responsive hook ─── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Product image thumbnail next to dropdown
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ProductThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
      <Image src={src} alt={alt} width={40} height={40} className="object-cover w-full h-full" />
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG Panel Visualizer
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PanelVisualizer({
  finalWidth,
  finalHeight,
  rawWidth,
  rawHeight,
  maxSize = 340,
  topAttachment,
  side1,
  side2,
}: {
  finalWidth: number
  finalHeight: number
  rawWidth: number
  rawHeight: number
  maxSize?: number
  topAttachment: TopAttachment
  side1: SideAttachment
  side2: SideAttachment
}) {
  // Compute sizes first so we can factor them into SVG dimensions
  const baseLayout = useMemo(() => {
    if (finalWidth <= 0 || finalHeight <= 0) return null
    const aspect = finalWidth / finalHeight
    // Reserve space for panel only; side padding calculated after
    const core = maxSize - 100 // leave room for edges
    let w: number, h: number
    if (aspect >= 1) { w = core; h = core / aspect }
    else { h = core; w = core * aspect }
    w = Math.max(100, w)
    h = Math.max(80, h)
    return { w, h }
  }, [finalWidth, finalHeight, maxSize])

  if (!baseLayout) return null

  const { w, h } = baseLayout

  // Magnet bars: silver rectangles, always visible regardless of panel scale
  const magH = Math.max(10, Math.round(h * 0.06))
  const magW = Math.max(4, Math.round(magH * 0.35))
  // Stucco strip: always visible proportional to panel width
  const stuccoW = Math.max(16, Math.round(w * 0.07))

  // Calculate extra space needed on each side for attachments
  const leftExtra = side1 === 'stucco_strip' ? stuccoW + 12 : side1 === 'magnetic_door' ? magW + 8 : side1 === 'marine_snaps' ? 10 : 4
  const rightExtra = side2 === 'stucco_strip' ? stuccoW + 12 : side2 === 'magnetic_door' ? magW + 8 : side2 === 'marine_snaps' ? 10 : 4
  const topExtra = 30 // track/velcro + dimension label
  const bottomExtra = 34 // floor dashed line + width dimension

  const px = leftExtra + 36 // panel X start – extra room for height label
  const py = topExtra + 6  // panel Y start
  const svgW = px + w + rightExtra + 24
  const svgH = py + h + bottomExtra

  const snapYs = Array.from({ length: SNAP_COUNT }, (_, i) => py + (h / (SNAP_COUNT + 1)) * (i + 1))
  const snapXs = Array.from({ length: SNAP_COUNT }, (_, i) => px + (w / (SNAP_COUNT + 1)) * (i + 1))

  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="block mx-auto">
      {/* Panel body */}
      <rect x={px} y={py} width={w} height={h} fill="#e8f0dc" stroke={GREEN} strokeWidth={2.5} rx={4} />

      {/* Screen mesh crosshatch */}
      {Array.from({ length: Math.floor(w / 14) }).map((_, i) => (
        <line key={`v${i}`} x1={px + 7 + i * 14} y1={py + 3} x2={px + 7 + i * 14} y2={py + h - 3} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />
      ))}
      {Array.from({ length: Math.floor(h / 14) }).map((_, i) => (
        <line key={`h${i}`} x1={px + 3} y1={py + 7 + i * 14} x2={px + w - 3} y2={py + 7 + i * 14} stroke={GREEN} strokeWidth={0.3} opacity={0.25} />
      ))}

      {/* ── TOP ── */}
      {topAttachment === 'tracking' ? (
        <>
          <rect x={px - 6} y={py - 12} width={w + 12} height={10} fill="#444" rx={3} />
          <rect x={px - 3} y={py - 10} width={w + 6} height={6} fill="#666" rx={2} />
          {snapXs.map((cx, i) => (
            <g key={`tc${i}`}>
              <circle cx={cx} cy={py - 4} r={3} fill="#222" />
              <line x1={cx} y1={py - 1} x2={cx} y2={py + 2} stroke="#333" strokeWidth={1.5} />
            </g>
          ))}
        </>
      ) : (
        <rect x={px} y={py - 5} width={w} height={5} fill="#B8860B" rx={1} opacity={0.8} />
      )}

      {/* ── LEFT SIDE ── */}
      {side1 === 'marine_snaps' && snapYs.map((cy, i) => (
        <g key={`ls${i}`}>
          <circle cx={px} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} />
          <circle cx={px} cy={cy} r={1.8} fill="#555" />
        </g>
      ))}
      {/* Magnets: 5 small silver bars ~2" long x 1/4" wide */}
      {side1 === 'magnetic_door' && snapYs.map((cy, i) => (
        <g key={`lm${i}`}>
          <rect x={px - 4} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.6} rx={1} />
          <rect x={px - 3} y={cy - magH / 2 + 1} width={magW - 2} height={magH - 2} fill="#d8d8d8" rx={0.5} opacity={0.5} />
        </g>
      ))}
      {/* Stucco strip: 3" wide strip, magnets on panel side, snaps on outside */}
      {side1 === 'stucco_strip' && (
        <g>
          {/* Strip body */}
          <rect x={px - stuccoW - 2} y={py} width={stuccoW} height={h} fill="#C4A265" stroke="#A08040" strokeWidth={1} rx={2} />
          {/* Texture lines */}
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (
            <line key={`st1t${i}`} x1={px - stuccoW - 1} y1={py + 4 + i * 8} x2={px - 3} y2={py + 4 + i * 8} stroke="#B89850" strokeWidth={0.4} opacity={0.5} />
          ))}
          {/* Magnets on panel side (right edge of strip) */}
          {snapYs.map((cy, i) => (
            <rect key={`st1m${i}`} x={px - 4} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.5} rx={1} />
          ))}
          {/* Marine snaps on outer side (left edge of strip) */}
          {snapYs.map((cy, i) => (
            <g key={`st1s${i}`}>
              <circle cx={px - stuccoW - 2} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} />
              <circle cx={px - stuccoW - 2} cy={cy} r={1.4} fill="#555" />
            </g>
          ))}
        </g>
      )}

      {/* ── RIGHT SIDE ── */}
      {side2 === 'marine_snaps' && snapYs.map((cy, i) => (
        <g key={`rs${i}`}>
          <circle cx={px + w} cy={cy} r={4.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.8} />
          <circle cx={px + w} cy={cy} r={1.8} fill="#555" />
        </g>
      ))}
      {/* Magnets: 5 small silver bars */}
      {side2 === 'magnetic_door' && snapYs.map((cy, i) => (
        <g key={`rm${i}`}>
          <rect x={px + w + 1} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.6} rx={1} />
          <rect x={px + w + 2} y={cy - magH / 2 + 1} width={magW - 2} height={magH - 2} fill="#d8d8d8" rx={0.5} opacity={0.5} />
        </g>
      ))}
      {/* Stucco strip: 3" wide strip, magnets on panel side, snaps on outside */}
      {side2 === 'stucco_strip' && (
        <g>
          {/* Strip body */}
          <rect x={px + w + 2} y={py} width={stuccoW} height={h} fill="#C4A265" stroke="#A08040" strokeWidth={1} rx={2} />
          {/* Texture lines */}
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (
            <line key={`st2t${i}`} x1={px + w + 3} y1={py + 4 + i * 8} x2={px + w + stuccoW + 1} y2={py + 4 + i * 8} stroke="#B89850" strokeWidth={0.4} opacity={0.5} />
          ))}
          {/* Magnets on panel side (left edge of strip) */}
          {snapYs.map((cy, i) => (
            <rect key={`st2m${i}`} x={px + w + 1} y={cy - magH / 2} width={magW} height={magH} fill="#c0c0c0" stroke="#888" strokeWidth={0.5} rx={1} />
          ))}
          {/* Marine snaps on outer side (right edge of strip) */}
          {snapYs.map((cy, i) => (
            <g key={`st2s${i}`}>
              <circle cx={px + w + stuccoW + 2} cy={cy} r={3.5} fill="#2a2a2a" stroke="#111" strokeWidth={0.7} />
              <circle cx={px + w + stuccoW + 2} cy={cy} r={1.4} fill="#555" />
            </g>
          ))}
        </g>
      )}

      {/* ── FLOOR dashed line ── */}
      <line x1={px - 12} y1={py + h + 4} x2={px + w + 12} y2={py + h + 4} stroke="#aaa" strokeWidth={1} strokeDasharray="4,3" />

      {/* ── DIMENSION: width across bottom ── */}
      <line x1={px} y1={py + h + 18} x2={px + w} y2={py + h + 18} stroke={GREEN_LIGHT} strokeWidth={1} markerEnd="url(#aR)" markerStart="url(#aL)" />
      <text x={px + w / 2} y={py + h + 30} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700} fontFamily="system-ui">
        {rawWidth}&quot; raw  &#x2192;  {finalWidth}&quot; cut
      </text>

      {/* ── DIMENSION: height along left ── */}
      <line x1={px - 22} y1={py} x2={px - 22} y2={py + h} stroke={GREEN_LIGHT} strokeWidth={1} markerEnd="url(#aD)" markerStart="url(#aU)" />
      <text x={px - 30} y={py + h / 2 + 3} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700} fontFamily="system-ui"
        transform={`rotate(-90 ${px - 30} ${py + h / 2 + 3})`}>
        {finalHeight}&quot;
      </text>

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
   Width Breakdown
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function BreakdownLine({ label, value, isFirst, note }: { label: string; value: number; isFirst?: boolean; note?: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        {isFirst ? <ArrowRight className="w-3 h-3 text-gray-400" /> : value > 0 ? <Plus className="w-3 h-3 text-blue-500" /> : value < 0 ? <Minus className="w-3 h-3 text-amber-600" /> : <span className="w-3" />}
        <span className="text-gray-700">{label}</span>
        {note && <span className="text-gray-400 hidden sm:inline">({note})</span>}
      </div>
      <span className="font-mono font-semibold text-gray-800">{isFirst ? '' : value > 0 ? '+' : ''}{value}&quot;</span>
    </div>
  )
}

function AdjustmentBreakdownDisplay({ widthBreakdown, heightBreakdown, side1Label, side2Label, topLabel }: {
  widthBreakdown: WidthBreakdown; heightBreakdown: HeightBreakdown; side1Label: string; side2Label: string; topLabel: string
}) {
  const [open, setOpen] = useState(true)

  const widthLines: { label: string; value: number; note?: string; isFirst?: boolean }[] = [
    { label: 'Measured width', value: widthBreakdown.base, isFirst: true },
  ]
  if (widthBreakdown.side1Add !== 0) widthLines.push({ label: `Side 1 (${side1Label})`, value: widthBreakdown.side1Add, note: widthBreakdown.side1Add > 0 ? 'Snaps to surface' : 'Stucco channel' })
  if (widthBreakdown.side2Add !== 0) widthLines.push({ label: `Side 2 (${side2Label})`, value: widthBreakdown.side2Add, note: widthBreakdown.side2Add > 0 ? 'Snaps to surface' : 'Stucco channel' })
  if (widthBreakdown.relaxedFitAdd > 0) widthLines.push({ label: 'Tracking relaxed fit', value: widthBreakdown.relaxedFitAdd, note: '+1" per 10ft of width' })

  const heightLines: { label: string; value: number; note?: string; isFirst?: boolean }[] = [
    { label: 'Measured height', value: heightBreakdown.base, isFirst: true },
    { label: 'Base overlap', value: heightBreakdown.overlapAdd, note: 'Always +2" per panel' },
  ]
  if (heightBreakdown.topAdd !== 0) heightLines.push({ label: `Top (${topLabel})`, value: heightBreakdown.topAdd, note: 'Velcro fold-over' })

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">Adjustment breakdown</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-gray-200 pt-2.5">
          {/* Width section */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Width</div>
          <div className="space-y-1.5 mb-2">
            {widthLines.map((line, i) => (
              <BreakdownLine key={`w${i}`} label={line.label} value={line.value} isFirst={line.isFirst} note={line.note} />
            ))}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
              <span className="font-semibold text-[#406517]">Final cut width</span>
              <span className="font-mono font-bold text-[#406517]">{widthBreakdown.total}&quot;</span>
            </div>
          </div>
          {/* Height section */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">Height</div>
          <div className="space-y-1.5">
            {heightLines.map((line, i) => (
              <BreakdownLine key={`h${i}`} label={line.label} value={line.value} isFirst={line.isFirst} note={line.note} />
            ))}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200">
              <span className="font-semibold text-[#406517]">Final cut height</span>
              <span className="font-mono font-bold text-[#406517]">{heightBreakdown.total}&quot;</span>
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

function EdgeSelector<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; image?: string; adj?: string }[]
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        {selected?.image && <ProductThumb src={selected.image} alt={selected.label} />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={SELECT_CLS}
          style={{ minWidth: 130 }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}{o.adj && o.adj !== '+0"' ? ` (${o.adj})` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Single Panel Builder – Panel in center, selectors on edges
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SinglePanelBuilder({ onAddPanel, nextSide }: { onAddPanel: (panel: SavedPanel) => void; nextSide: number }) {
  const isDesktop = useIsDesktop()
  const [widthInches, setWidthInches] = useState<string>('96')
  const [heightInches, setHeightInches] = useState<string>('96')
  const [topAttachment, setTopAttachment] = useState<TopAttachment>('tracking')
  const [side1, setSide1] = useState<SideAttachment>('marine_snaps')
  const [side2, setSide2] = useState<SideAttachment>('marine_snaps')
  const [side, setSide] = useState<number>(nextSide)

  // Keep side in sync with nextSide when it changes from parent
  useEffect(() => { setSide(nextSide) }, [nextSide])

  const width = parseFloat(widthInches) || 0
  const height = parseFloat(heightInches) || 0

  const results = useMemo(() => {
    if (width <= 0 || height <= 0) return null
    return calculatePanelDimensions({ widthInches: width, heightInches: height, topAttachment, side1Attachment: side1, side2Attachment: side2 })
  }, [width, height, topAttachment, side1, side2])

  const isComplete = width > 0 && height > 0

  const handleAdd = () => {
    if (!results || !isComplete) return
    onAddPanel({
      id: `panel-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      finalWidth: results.finalWidth, finalHeight: results.finalHeight,
      rawWidth: width, rawHeight: height, topAttachment, side1, side2, side,
    })
  }

  return (
    <Card className="!p-0 !bg-white !border-2 !border-gray-200 overflow-hidden">
      {/* ── Dimensions row ── */}
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Side</span>
            <select
              value={side}
              onChange={(e) => setSide(parseInt(e.target.value))}
              className="w-16 px-2 py-2 border-2 border-gray-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517] bg-white transition-colors cursor-pointer appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Opening Size:</span>
          <div className="flex items-center gap-2">
            <input type="number" min={1} value={widthInches} onChange={(e) => setWidthInches(e.target.value)} placeholder="Width" className={INPUT_CLS} />
            <span className="text-gray-500 text-xs font-medium">in</span>
          </div>
          <span className="text-gray-400 font-bold text-lg">&times;</span>
          <div className="flex items-center gap-2">
            <input type="number" min={1} value={heightInches} onChange={(e) => setHeightInches(e.target.value)} placeholder="Height" className={INPUT_CLS} />
            <span className="text-gray-500 text-xs font-medium">in</span>
          </div>
        </div>
      </div>

      {/* ── Main area: panel + edge selectors ── */}
      <div className="px-4 py-6 md:px-8 md:py-8">
        {/* TOP selector centered */}
        <div className="flex justify-center mb-4">
          <EdgeSelector label="Top Attachment" value={topAttachment} onChange={setTopAttachment} options={TOP_OPTIONS} />
        </div>

        {/* Middle row: Side1 | Panel | Side2 */}
        <div className="flex items-center justify-center gap-3 md:gap-6">
          {/* Side 1 – left */}
          <div className="shrink-0">
            <EdgeSelector label="Side 1" value={side1} onChange={setSide1} options={SIDE_OPTIONS} />
          </div>

          {/* Panel visualization */}
          <div className="flex-1 flex justify-center min-w-0">
            {results ? (
              <PanelVisualizer
                finalWidth={results.finalWidth}
                finalHeight={results.finalHeight}
                rawWidth={width}
                rawHeight={height}
                maxSize={isDesktop ? 420 : 280}
                topAttachment={topAttachment}
                side1={side1}
                side2={side2}
              />
            ) : (
              <div className="flex items-center justify-center h-48 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Text size="sm" className="text-gray-400 !mb-0">Enter dimensions</Text>
              </div>
            )}
          </div>

          {/* Side 2 – right */}
          <div className="shrink-0">
            <EdgeSelector label="Side 2" value={side2} onChange={setSide2} options={SIDE_OPTIONS} />
          </div>
        </div>
      </div>

      {/* ── Results bar ── */}
      <div className="bg-[#406517]/5 border-t-2 border-[#406517]/20 px-5 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Final dims */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Final Width</div>
              <div className={`text-3xl font-black tabular-nums ${isComplete ? 'text-[#406517]' : 'text-gray-300'}`}>
                {results ? `${results.finalWidth}"` : '--'}
              </div>
            </div>
            <span className="text-gray-300 text-2xl font-light">&times;</span>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Final Height</div>
              <div className={`text-3xl font-black tabular-nums ${isComplete ? 'text-[#406517]' : 'text-gray-300'}`}>
                {results ? `${results.finalHeight}"` : '--'}
              </div>
            </div>
          </div>

          {/* Breakdown + notes */}
          <div className="flex-1 max-w-sm space-y-2">
            {results && (
              <AdjustmentBreakdownDisplay widthBreakdown={results.widthBreakdown} heightBreakdown={results.heightBreakdown} side1Label={SIDE_LABEL_MAP[side1]} side2Label={SIDE_LABEL_MAP[side2]} topLabel={TOP_LABEL_MAP[topAttachment]} />
            )}
          </div>

          {/* Add button */}
          <Button variant="primary" size="md" onClick={handleAdd} disabled={!isComplete}>
            Add Panel
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Project Side Row – panels flow together without card borders
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SidePanelRow({
  sideNum,
  panels,
  globalIndex,
  onRemove,
}: {
  sideNum: number
  panels: SavedPanel[]
  globalIndex: (id: string) => number
  onRemove: (id: string) => void
}) {
  return (
    <div>
      {/* Side header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center text-xs font-bold">
          {sideNum}
        </div>
        <span className="text-sm font-semibold text-gray-700">Side {sideNum}</span>
        <span className="text-xs text-gray-400">({panels.length} panel{panels.length !== 1 ? 's' : ''})</span>
      </div>

      {/* Panels flowing together horizontally */}
      <div className="flex items-end overflow-x-auto gap-0 pb-2">
        {panels.map((panel) => {
          const idx = globalIndex(panel.id)
          return (
            <div key={panel.id} className="relative group shrink-0 flex flex-col items-center" style={{ marginLeft: panels.indexOf(panel) > 0 ? -2 : 0 }}>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(panel.id)}
                className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Remove panel"
              >
                <X className="w-3 h-3" />
              </button>

              {/* SVG Visualizer */}
              <PanelVisualizer
                finalWidth={panel.finalWidth}
                finalHeight={panel.finalHeight}
                rawWidth={panel.rawWidth}
                rawHeight={panel.rawHeight}
                maxSize={240}
                topAttachment={panel.topAttachment}
                side1={panel.side1}
                side2={panel.side2}
              />

              {/* Small label underneath */}
              <div className="text-center mt-0.5">
                <div className="text-xs font-bold text-[#406517] tabular-nums">
                  Panel {idx + 1}: {panel.finalWidth}&quot; &times; {panel.finalHeight}&quot;
                </div>
                <div className="text-[10px] text-gray-400">
                  {TOP_LABEL_MAP[panel.topAttachment]} &middot; {SIDE_LABEL_MAP[panel.side1]} | {SIDE_LABEL_MAP[panel.side2]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Export
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function PanelBuilder() {
  const [addedPanels, setAddedPanels] = useState<SavedPanel[]>([])

  const handleAddPanel = (panel: SavedPanel) => setAddedPanels((prev) => [...prev, panel])
  const handleRemovePanel = (id: string) => setAddedPanels((prev) => prev.filter((p) => p.id !== id))

  // Group panels by side number, sorted
  const sideGroups = useMemo(() => {
    const groups: Map<number, SavedPanel[]> = new Map()
    for (const p of addedPanels) {
      if (!groups.has(p.side)) groups.set(p.side, [])
      groups.get(p.side)!.push(p)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b)
  }, [addedPanels])

  // Global index lookup for panel numbering
  const globalIndex = (id: string) => addedPanels.findIndex((p) => p.id === id)

  // Suggest the next side number (highest existing or 1)
  const nextSide = sideGroups.length > 0 ? sideGroups[sideGroups.length - 1][0] : 1

  return (
    <Stack gap="lg">
      <div className="text-center mb-2">
        <Heading level={3} className="!mb-1">Panel Calculator</Heading>
        <Text className="text-sm text-gray-500 !mb-0">
          Enter your raw opening measurements, select how each edge attaches, and get your final cut dimensions.
        </Text>
      </div>

      <SinglePanelBuilder onAddPanel={handleAddPanel} nextSide={nextSide} />

      {addedPanels.length > 0 && (
        <Card className="!p-4 md:!p-6 !bg-gray-50/50 !border-2 !border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Text className="font-semibold text-[#406517] !mb-0">Project Panels ({addedPanels.length})</Text>
          </div>
          <div className="space-y-6">
            {sideGroups.map(([sideNum, panels]) => (
              <SidePanelRow
                key={sideNum}
                sideNum={sideNum}
                panels={panels}
                globalIndex={globalIndex}
                onRemove={handleRemovePanel}
              />
            ))}
          </div>
        </Card>
      )}
    </Stack>
  )
}
