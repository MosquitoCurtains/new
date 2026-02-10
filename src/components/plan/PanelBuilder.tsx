'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
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
} from '@/lib/panel-calculator'
import { Save, CheckCircle, Loader2 } from 'lucide-react'

/* ─── Product images ─── */
const TRACK_IMAGE = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Track-Color-White-Black-700x700.jpg'

/* ─── Option configs ─── */
const TOP_OPTIONS: { value: TopAttachment; label: string; image?: string }[] = [
  { value: 'tracking', label: 'Tracking', image: TRACK_IMAGE },
  { value: 'velcro', label: 'Velcro' },
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

/* ─── Side Builder Configuration Options ─── */
interface SideConfig {
  id: string
  label: string
  description: string
  panelCount: number
  splitType: SideAttachment
}

const SIDE_CONFIGS: SideConfig[] = [
  { id: 'single', label: '1 Panel', description: 'Full width, no split', panelCount: 1, splitType: 'none' },
  { id: '2-mag', label: '2 Panels', description: 'Magnetic doorway between', panelCount: 2, splitType: 'magnetic_door' },
]

/* Outer-edge-only options (no magnetic door – that only goes between panels) */
const OUTER_EDGE_OPTIONS: { value: SideAttachment; label: string; image?: string; adj: string }[] = [
  { value: 'none', label: 'None', adj: '+0"' },
  { value: 'marine_snaps', label: 'Marine Snaps', image: '/images/products/marine-snaps.png', adj: '+1"' },
  { value: 'stucco_strip', label: 'Stucco Strip', adj: '-1"' },
]

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
  side: number
}

/* ─── Per-side state for the multi-side builder ─── */
interface SideState {
  totalWidth: string
  leftHeight: string
  rightHeight: string
  configId: string
  topAttachment: TopAttachment
  leftEdge: SideAttachment
  rightEdge: SideAttachment
}

function defaultSideState(): SideState {
  return {
    totalWidth: '240',
    leftHeight: '96',
    rightHeight: '96',
    configId: '2-mag',
    topAttachment: 'tracking',
    leftEdge: 'marine_snaps',
    rightEdge: 'marine_snaps',
  }
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
  // Stucco strip: narrower dark gray channel
  const stuccoW = Math.max(12, Math.round(w * 0.05))

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
      {/* Stucco strip: narrow dark gray channel, magnets on panel side, snaps on outside */}
      {side1 === 'stucco_strip' && (
        <g>
          {/* Strip body – dark gray like track */}
          <rect x={px - stuccoW - 2} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />
          {/* Texture lines */}
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (
            <line key={`st1t${i}`} x1={px - stuccoW - 1} y1={py + 4 + i * 8} x2={px - 3} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />
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
      {/* Stucco strip: narrow dark gray channel, magnets on panel side, snaps on outside */}
      {side2 === 'stucco_strip' && (
        <g>
          {/* Strip body – dark gray like track */}
          <rect x={px + w + 2} y={py} width={stuccoW} height={h} fill="#4a4a4a" stroke="#333" strokeWidth={1} rx={2} />
          {/* Texture lines */}
          {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (
            <line key={`st2t${i}`} x1={px + w + 3} y1={py + 4 + i * 8} x2={px + w + stuccoW + 1} y2={py + 4 + i * 8} stroke="#666" strokeWidth={0.4} opacity={0.5} />
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
   Generate panels for a full side based on configuration
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function generateSidePanels(params: {
  sideNum: number
  totalWidth: number
  leftHeight: number
  rightHeight: number
  config: SideConfig
  topAttachment: TopAttachment
  leftEdge: SideAttachment
  rightEdge: SideAttachment
}): SavedPanel[] {
  const { sideNum, totalWidth, leftHeight, rightHeight, config, topAttachment, leftEdge, rightEdge } = params
  const { panelCount, splitType } = config
  const panelWidth = Math.round(totalWidth / panelCount)

  return Array.from({ length: panelCount }, (_, i) => {
    // Interpolate height at center of this panel position
    const centerPos = (i + 0.5) / panelCount
    const rawHeight = Math.round(leftHeight + (rightHeight - leftHeight) * centerPos)

    // Determine side attachments:
    //   Leftmost panel  → user's left edge  | split type
    //   Middle panels   → split type        | split type
    //   Rightmost panel → split type        | user's right edge
    //   Single panel    → user's left edge  | user's right edge
    const isFirst = i === 0
    const isLast = i === panelCount - 1
    const s1: SideAttachment = isFirst ? leftEdge : splitType
    const s2: SideAttachment = isLast ? rightEdge : splitType

    const results = calculatePanelDimensions({
      widthInches: panelWidth,
      heightInches: rawHeight,
      topAttachment,
      side1Attachment: s1,
      side2Attachment: s2,
    })

    return {
      id: `panel-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
      finalWidth: results.finalWidth,
      finalHeight: results.finalHeight,
      rawWidth: panelWidth,
      rawHeight,
      topAttachment,
      side1: s1,
      side2: s2,
      side: sideNum,
    }
  })
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Configuration Card – mini SVG diagram of panel layout
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ConfigCard({ config, selected, onClick }: { config: SideConfig; selected: boolean; onClick: () => void }) {
  const n = config.panelCount
  const svgW = 88, svgH = 52
  const gap = config.splitType === 'magnetic_door' ? 3 : 0
  const totalGap = gap * (n - 1)
  const pw = (svgW - 8 - totalGap) / n

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center rounded-xl p-2.5 transition-all border-2 min-w-[100px] ${
        selected
          ? 'border-[#406517] bg-[#406517]/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mb-1">
        {Array.from({ length: n }, (_, i) => {
          const x = 4 + i * (pw + gap)
          return (
            <g key={i}>
              {/* Panel rectangle */}
              <rect x={x} y={4} width={pw} height={svgH - 8} fill={selected ? '#e8f0dc' : '#f3f4f6'} stroke={selected ? GREEN : '#999'} strokeWidth={1.5} rx={2} />
              {/* Mesh lines */}
              {Array.from({ length: Math.floor(pw / 8) }).map((_, j) => (
                <line key={`v${j}`} x1={x + 4 + j * 8} y1={6} x2={x + 4 + j * 8} y2={svgH - 6} stroke={selected ? GREEN : '#bbb'} strokeWidth={0.3} opacity={0.4} />
              ))}

              {/* Magnetic door indicator between panels */}
              {i < n - 1 && config.splitType === 'magnetic_door' && (
                <g>
                  {[16, 26, 36].map((cy) => (
                    <rect key={cy} x={x + pw + 0.5} y={cy - 3} width={2} height={6} fill="#c0c0c0" stroke="#999" strokeWidth={0.3} rx={0.5} />
                  ))}
                </g>
              )}
            </g>
          )
        })}
      </svg>
      <div className={`text-xs font-bold ${selected ? 'text-[#406517]' : 'text-gray-600'}`}>{config.label}</div>
      <div className="text-[9px] text-gray-400 leading-tight">{config.description}</div>
    </button>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Side Section – full inline configurator + visualizer per side
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SideSection({ sideNum, state, onChange }: {
  sideNum: number
  state: SideState
  onChange: (update: Partial<SideState>) => void
}) {
  const isDesktop = useIsDesktop()
  const config = SIDE_CONFIGS.find((c) => c.id === state.configId)!
  const tw = parseFloat(state.totalWidth) || 0
  const lh = parseFloat(state.leftHeight) || 0
  const rh = parseFloat(state.rightHeight) || 0
  const isReady = tw > 0 && lh > 0 && rh > 0

  // Compute panels live from this side's configuration
  const panels = useMemo(() => {
    if (!isReady) return []
    return generateSidePanels({
      sideNum, totalWidth: tw, leftHeight: lh, rightHeight: rh,
      config, topAttachment: state.topAttachment, leftEdge: state.leftEdge, rightEdge: state.rightEdge,
    })
  }, [sideNum, tw, lh, rh, config, state.topAttachment, state.leftEdge, state.rightEdge, isReady])

  const panelMaxSize = isDesktop
    ? (config.panelCount > 1 ? 320 : 420)
    : (config.panelCount > 1 ? 200 : 280)

  return (
    <Card className="!p-0 !bg-white !border-2 !border-[#406517]/30 overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-[#406517] px-5 py-2.5 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">
            {sideNum}
          </div>
          <span className="text-white font-bold text-sm">Side {sideNum}</span>
        </div>
      </div>

      {/* ── Layout picker with mini SVG diagrams ── */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Panel Layout</div>
        <div className="flex justify-center gap-3">
          {SIDE_CONFIGS.map((c) => (
            <ConfigCard
              key={c.id}
              config={c}
              selected={c.id === state.configId}
              onClick={() => onChange({ configId: c.id })}
            />
          ))}
        </div>
      </div>

      {/* ── Dimensions: Left H | Width | Right H ── */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Left H</span>
            <input type="number" min={1} value={state.leftHeight} onChange={(e) => onChange({ leftHeight: e.target.value })} className={INPUT_CLS} />
          </div>
          <span className="text-gray-300 font-bold text-lg">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Width</span>
            <input type="number" min={1} value={state.totalWidth} onChange={(e) => onChange({ totalWidth: e.target.value })} className={INPUT_CLS} />
          </div>
          <span className="text-gray-300 font-bold text-lg">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Right H</span>
            <input type="number" min={1} value={state.rightHeight} onChange={(e) => onChange({ rightHeight: e.target.value })} className={INPUT_CLS} />
            <span className="text-gray-400 text-xs">in</span>
          </div>
        </div>
      </div>

      {/* ── Visualization: Top above, Left on left, Panels center, Right on right ── */}
      <div className="px-4 py-6 md:px-8 md:py-8">
        {/* Top selector centered above panels */}
        <div className="flex justify-center mb-4">
          <EdgeSelector label="Top Attachment" value={state.topAttachment} onChange={(v) => onChange({ topAttachment: v })} options={TOP_OPTIONS} />
        </div>

        {/* Middle row: Left Edge | Panel(s) | Right Edge */}
        <div className="flex items-center justify-center gap-3 md:gap-6">
          {/* Left edge selector */}
          <div className="shrink-0">
            <EdgeSelector label="Left Edge" value={state.leftEdge} onChange={(v) => onChange({ leftEdge: v })} options={OUTER_EDGE_OPTIONS} />
          </div>

          {/* Panels in center */}
          <div className="flex-1 flex items-end justify-center min-w-0">
            {isReady && panels.length > 0 ? (
              <div className="flex items-end justify-center">
                {panels.map((panel, i) => (
                  <div key={panel.id} className="flex items-end">
                    {/* Magnetic door indicator between panels */}
                    {i > 0 && (
                      <div className="flex flex-col items-center justify-center mx-0.5 self-center">
                        {[0, 1, 2, 3, 4].map((k) => (
                          <div key={k} className="w-1.5 h-3 bg-gradient-to-r from-[#d0d0d0] to-[#a0a0a0] rounded-sm my-0.5" />
                        ))}
                        <span className="text-[7px] text-gray-400 mt-0.5 whitespace-nowrap leading-none">Mag Door</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <PanelVisualizer
                        finalWidth={panel.finalWidth}
                        finalHeight={panel.finalHeight}
                        rawWidth={panel.rawWidth}
                        rawHeight={panel.rawHeight}
                        maxSize={panelMaxSize}
                        topAttachment={panel.topAttachment}
                        side1={panel.side1}
                        side2={panel.side2}
                      />
                      {/* Panel dimensions underneath */}
                      <div className="text-center mt-1">
                        <div className="text-xs font-bold text-[#406517] tabular-nums">
                          {panel.finalWidth}&quot; &times; {panel.finalHeight}&quot;
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Text size="sm" className="text-gray-400 !mb-0">Enter dimensions</Text>
              </div>
            )}
          </div>

          {/* Right edge selector */}
          <div className="shrink-0">
            <EdgeSelector label="Right Edge" value={state.rightEdge} onChange={(v) => onChange({ rightEdge: v })} options={OUTER_EDGE_OPTIONS} />
          </div>
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className="bg-[#406517]/5 border-t border-gray-200 px-5 py-3">
        <div className="flex items-center justify-center gap-6 text-sm">
          {panels.map((panel, i) => (
            <div key={panel.id} className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Panel {i + 1}:</span>
              <span className="font-mono font-bold text-[#406517]">{panel.finalWidth}&quot; &times; {panel.finalHeight}&quot;</span>
              <span className="text-[10px] text-gray-400">({SIDE_LABEL_MAP[panel.side1]} | {SIDE_LABEL_MAP[panel.side2]})</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Export
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Helper: build cart_data payload from sides config
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function buildCartData(sides: SideState[]) {
  return sides.map((s, i) => {
    const config = SIDE_CONFIGS.find((c) => c.id === s.configId)!
    const tw = parseFloat(s.totalWidth) || 0
    const lh = parseFloat(s.leftHeight) || 0
    const rh = parseFloat(s.rightHeight) || 0
    const panels = (tw > 0 && lh > 0 && rh > 0)
      ? generateSidePanels({
          sideNum: i + 1, totalWidth: tw, leftHeight: lh, rightHeight: rh,
          config, topAttachment: s.topAttachment, leftEdge: s.leftEdge, rightEdge: s.rightEdge,
        })
      : []

    return {
      side: i + 1,
      totalWidth: tw,
      leftHeight: lh,
      rightHeight: rh,
      layout: config.label,
      topAttachment: s.topAttachment,
      leftEdge: s.leftEdge,
      rightEdge: s.rightEdge,
      panels: panels.map((p) => ({
        rawWidth: p.rawWidth,
        rawHeight: p.rawHeight,
        finalWidth: p.finalWidth,
        finalHeight: p.finalHeight,
        topAttachment: p.topAttachment,
        side1: p.side1,
        side2: p.side2,
      })),
    }
  })
}

export default function PanelBuilder() {
  const [numSides, setNumSides] = useState(2)
  const [sides, setSides] = useState<SideState[]>([defaultSideState(), defaultSideState()])

  // Save-to-project state
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveEmail, setSaveEmail] = useState('')
  const [saveFirstName, setSaveFirstName] = useState('')
  const [saveLastName, setSaveLastName] = useState('')
  const [savePhone, setSavePhone] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  // Keep sides array in sync with numSides
  useEffect(() => {
    setSides((prev) => {
      if (prev.length < numSides) {
        return [...prev, ...Array.from({ length: numSides - prev.length }, () => defaultSideState())]
      }
      return prev.slice(0, numSides)
    })
  }, [numSides])

  const updateSide = (index: number, update: Partial<SideState>) => {
    setSides((prev) => prev.map((s, i) => (i === index ? { ...s, ...update } : s)))
  }

  // Check if all sides have valid dimensions
  const allSidesReady = sides.every((s) => {
    const tw = parseFloat(s.totalWidth) || 0
    const lh = parseFloat(s.leftHeight) || 0
    const rh = parseFloat(s.rightHeight) || 0
    return tw > 0 && lh > 0 && rh > 0
  })

  const handleSaveProject = async () => {
    if (!saveEmail.trim()) return
    setSaveStatus('saving')
    try {
      const cartData = buildCartData(sides)
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveEmail.trim(),
          firstName: saveFirstName.trim() || undefined,
          lastName: saveLastName.trim() || undefined,
          phone: savePhone.trim() || undefined,
          product: 'mosquito_curtains',
          projectType: 'porch',
          topAttachment: sides[0]?.topAttachment || 'tracking',
          numberOfSides: numSides,
          notes: `Panel Builder: ${numSides} sides configured`,
          cart_data: cartData,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaveStatus('saved')
      if (data.shareUrl) setShareUrl(data.shareUrl)
    } catch (err) {
      console.error('Save error:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <Stack gap="lg">
      {/* ── Number of Sides selector (prominent) ── */}
      <Card className="!p-5 !bg-white !border-2 !border-gray-200">
        <div className="text-center mb-3">
          <div className="text-lg font-bold text-gray-800">How many sides need screening?</div>
          <div className="text-sm text-gray-500">Select the number of open sides on your porch or structure</div>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNumSides(n)}
              className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                numSides === n
                  ? 'bg-[#406517] text-white shadow-md ring-2 ring-[#406517]/30 scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Side Sections ── */}
      {sides.map((side, i) => (
        <SideSection
          key={i}
          sideNum={i + 1}
          state={side}
          onChange={(update) => updateSide(i, update)}
        />
      ))}

      {/* ── Save to Project ── */}
      {allSidesReady && (
        <Card className="!p-0 !bg-white !border-2 !border-[#406517]/30 overflow-hidden">
          {saveStatus === 'saved' ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <div className="text-lg font-bold text-gray-800 mb-1">Project Saved!</div>
              <div className="text-sm text-gray-500 mb-4">
                Your panel configuration has been saved. We&apos;ll review it and get back to you.
              </div>
              {shareUrl && (
                <div className="text-xs text-gray-400">
                  Share link: <span className="font-mono text-[#406517]">{window.location.origin}{shareUrl}</span>
                </div>
              )}
            </div>
          ) : !showSaveForm ? (
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800">Ready to save your project?</div>
                <div className="text-sm text-gray-500">Save your configuration so our team can prepare a quote.</div>
              </div>
              <Button variant="primary" size="lg" onClick={() => setShowSaveForm(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save to Project
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-[#406517] px-5 py-2.5">
                <span className="text-white font-bold text-sm">Save Your Configuration</span>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email *</label>
                    <input
                      type="email"
                      value={saveEmail}
                      onChange={(e) => setSaveEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</label>
                    <input
                      type="tel"
                      value={savePhone}
                      onChange={(e) => setSavePhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                    <input
                      type="text"
                      value={saveFirstName}
                      onChange={(e) => setSaveFirstName(e.target.value)}
                      placeholder="First"
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                    <input
                      type="text"
                      value={saveLastName}
                      onChange={(e) => setSaveLastName(e.target.value)}
                      placeholder="Last"
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-[#406517]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSaveForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSaveProject}
                    disabled={!saveEmail.trim() || saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : saveStatus === 'error' ? (
                      'Error - Try Again'
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Project</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </Stack>
  )
}
