'use client'

import { useEffect, useState } from 'react'
import { Zap, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { Container, Stack, Card, Button, Text, Spinner } from '@/lib/design-system'
import { usePricing } from '@/hooks/usePricing'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import type { MeshType, MeshColor, MeshTopAttachment } from '@/lib/pricing/types'
import type { SideState, SavedPanel } from '@/components/plan/PanelBuilder'
import { calculatePanelDimensions, type TopAttachment, type SideAttachment } from '@/lib/panel-calculator'

const LS_KEY = 'mc_panel_builder'
const GREEN = '#406517'

interface StoredState {
  numSides: number
  sides: SideState[]
  meshType: MeshType
  meshColor: MeshColor
}

interface SideConfig {
  id: string
  panelCount: number
  splitType: SideAttachment
}

const SIDE_CONFIGS: SideConfig[] = [
  { id: 'single', panelCount: 1, splitType: 'none' },
  { id: '2-mag', panelCount: 2, splitType: 'magnetic_door' },
]

function mapTopAttachment(top: TopAttachment, h: number): MeshTopAttachment {
  if (top === 'velcro') return 'velcro'
  return h > 120 ? 'heavy_track' : 'standard_track'
}

function fmt(n: number): string { return `$${n.toFixed(2)}` }

function generatePanels(sideNum: number, s: SideState): SavedPanel[] {
  const config = SIDE_CONFIGS.find((c) => c.id === s.configId)!
  const tw = parseFloat(s.totalWidth) || 0
  const lh = parseFloat(s.leftHeight) || 0
  const rh = parseFloat(s.rightHeight) || 0
  if (tw <= 0 || lh <= 0 || rh <= 0) return []
  const panelWidth = Math.round(tw / config.panelCount)

  return Array.from({ length: config.panelCount }, (_, i) => {
    const centerPos = (i + 0.5) / config.panelCount
    const rawHeight = Math.round(lh + (rh - lh) * centerPos)
    const isFirst = i === 0
    const isLast = i === config.panelCount - 1
    const s1: SideAttachment = isFirst ? s.leftEdge : config.splitType
    const s2: SideAttachment = isLast ? s.rightEdge : config.splitType

    const results = calculatePanelDimensions({
      widthInches: panelWidth, heightInches: rawHeight, topAttachment: s.topAttachment, side1Attachment: s1, side2Attachment: s2,
    })

    return {
      id: `panel-${sideNum}-${i}`, finalWidth: results.finalWidth, finalHeight: results.finalHeight,
      rawWidth: panelWidth, rawHeight, topAttachment: s.topAttachment, side1: s1, side2: s2, side: sideNum,
      widthBreakdown: results.widthBreakdown, heightBreakdown: results.heightBreakdown,
    }
  })
}

export default function InstantQuotePage() {
  const [data, setData] = useState<StoredState | null>(null)
  const { prices, isLoading } = usePricing()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) setData(JSON.parse(stored))
    } catch { /* ok */ }
  }, [])

  if (!data) {
    return (
      <Container size="xl">
        <Stack gap="lg">
          <Card className="!p-8 text-center">
            <Text className="text-gray-600 !mb-4">No project configuration found. Please start from the builder.</Text>
            <Button variant="primary" asChild>
              <Link href="/start-project/mosquito-curtains/diy-builder"><ArrowLeft className="w-4 h-4 mr-2" />Back to Builder</Link>
            </Button>
          </Card>
        </Stack>
      </Container>
    )
  }

  const allPanels = data.sides.flatMap((s, i) => generatePanels(i + 1, s))

  const panelPrices = prices ? allPanels.map((p) => {
    const result = calculateMeshPanelPrice({
      widthFeet: Math.floor(p.rawWidth / 12), widthInches: p.rawWidth % 12, heightInches: p.rawHeight,
      meshType: data.meshType, meshColor: data.meshColor,
      topAttachment: mapTopAttachment(p.topAttachment, p.rawHeight),
    }, prices)
    return result.total
  }) : []

  const panelTotal = panelPrices.reduce((sum, p) => sum + p, 0)

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${GREEN}15` }}>
              <Zap className="w-5 h-5" style={{ color: GREEN }} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">Instant Quote</div>
              <div className="text-sm text-gray-500">{allPanels.length} panels across {data.numSides} sides</div>
            </div>
          </div>
          <Link href="/start-project/mosquito-curtains/diy-builder" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Edit Configuration
          </Link>
        </div>

        {isLoading ? (
          <Card className="!p-8 text-center">
            <Spinner size="lg" className="mx-auto mb-3" />
            <Text className="text-gray-500 !mb-0">Loading pricing...</Text>
          </Card>
        ) : (
          <>
            {/* Panel Breakdown by Side */}
            {data.sides.map((side, sideIdx) => {
              const sidePanels = allPanels.filter((p) => p.side === sideIdx + 1)
              if (sidePanels.length === 0) return null

              return (
                <Card key={sideIdx} className="!p-0 !bg-white !border-2 !border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-5 py-2.5 border-b border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">Side {sideIdx + 1}</span>
                    <span className="text-gray-400 text-xs ml-3">
                      {side.totalWidth}&quot; wide &middot; {side.leftHeight}&quot;/{side.rightHeight}&quot; tall
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {sidePanels.map((panel, i) => {
                      const panelIdx = allPanels.indexOf(panel)
                      const price = panelPrices[panelIdx] || 0
                      return (
                        <div key={panel.id} className="px-5 py-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Panel {i + 1}</div>
                            <div className="text-xs text-gray-400">
                              {panel.finalWidth}&quot; &times; {panel.finalHeight}&quot; cut &middot;
                              {data.meshType.replace(/_/g, ' ')} &middot; {data.meshColor}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-gray-700 tabular-nums">{price > 0 ? fmt(price) : '--'}</div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )
            })}

            {/* Total */}
            <Card className="!p-5" style={{ backgroundColor: `${GREEN}08`, borderColor: `${GREEN}30` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Estimated Panel Total</div>
                  <div className="text-[10px] text-gray-400">Track, hardware, and shipping not included</div>
                </div>
                <div className="text-2xl font-black tabular-nums" style={{ color: GREEN }}>{panelTotal > 0 ? fmt(panelTotal) : '--'}</div>
              </div>
            </Card>

            <div className="text-center text-xs text-gray-400">
              This is an estimate based on your configuration. Final pricing may vary.
              Contact our team for exact pricing and to place your order.
            </div>

            <div className="flex justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project/mosquito-curtains/diy-builder/expert-assistance">
                  <Users className="w-4 h-4 mr-2" />
                  Continue with Our Team
                </Link>
              </Button>
            </div>
          </>
        )}
      </Stack>
    </Container>
  )
}

