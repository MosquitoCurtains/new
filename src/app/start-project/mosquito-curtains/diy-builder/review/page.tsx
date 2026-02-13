'use client'

/**
 * Step 3: Review & Next Step (after Wizard)
 *
 * Shows the panel layout summary + pricing, then presents two CTAs:
 *   A) Submit for Free Expert Review (primary — recommended)
 *   B) I'm sure, place my order (secondary — checkout)
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  Zap,
  X,
} from 'lucide-react'
import { Container, Stack, Card, Button, Text, Heading, Spinner } from '@/lib/design-system'
import { usePricing } from '@/hooks/usePricing'
import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
import type { MeshType, MeshColor, MeshTopAttachment } from '@/lib/pricing/types'
import type { SideState, SavedPanel } from '@/components/plan/PanelBuilder'
import { calculatePanelDimensions, type TopAttachment, type SideAttachment } from '@/lib/panel-calculator'

/* ------------------------------------------------------------------ */
/*  Constants & helpers (same as instant-quote page)                    */
/* ------------------------------------------------------------------ */

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

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

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
      widthInches: panelWidth,
      heightInches: rawHeight,
      topAttachment: s.topAttachment,
      side1Attachment: s1,
      side2Attachment: s2,
    })

    return {
      id: `panel-${sideNum}-${i}`,
      finalWidth: results.finalWidth,
      finalHeight: results.finalHeight,
      rawWidth: panelWidth,
      rawHeight,
      topAttachment: s.topAttachment,
      side1: s1,
      side2: s2,
      side: sideNum,
      widthBreakdown: results.widthBreakdown,
      heightBreakdown: results.heightBreakdown,
    }
  })
}

/* ------------------------------------------------------------------ */
/*  Modal component                                                    */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ReviewPage() {
  const [data, setData] = useState<StoredState | null>(null)
  const { prices, isLoading } = usePricing()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) setData(JSON.parse(stored))
    } catch {
      /* ok */
    }
  }, [])

  /* Submit project for expert review */
  const handleSubmitForReview = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'expert-request@panel-builder.local',
          product: 'mosquito_curtains',
          projectType: 'expert_review',
          numberOfSides: data?.numSides || 0,
          topAttachment: data?.sides?.[0]?.topAttachment || 'tracking',
          notes: `Expert Review Request from Wizard\nConfig: ${JSON.stringify(data)}`,
          cart_data: data?.sides || [],
        }),
      })
      setShowConfirmation(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Failed to submit. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Empty state ── */
  if (!data) {
    return (
      <Container size="xl">
        <Stack gap="lg">
          <Card className="!p-8 text-center">
            <Text className="text-gray-600 !mb-4">
              No project configuration found. Please start from the builder.
            </Text>
            <Button variant="primary" asChild>
              <Link href="/start-project/mosquito-curtains/diy-builder">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Link>
            </Button>
          </Card>
        </Stack>
      </Container>
    )
  }

  const allPanels = data.sides.flatMap((s, i) => generatePanels(i + 1, s))

  const panelPrices = prices
    ? allPanels.map((p) => {
        const result = calculateMeshPanelPrice(
          {
            widthFeet: Math.floor(p.rawWidth / 12),
            widthInches: p.rawWidth % 12,
            heightInches: p.rawHeight,
            meshType: data.meshType,
            meshColor: data.meshColor,
            topAttachment: mapTopAttachment(p.topAttachment, p.rawHeight),
          },
          prices
        )
        return result.total
      })
    : []

  const panelTotal = panelPrices.reduce((sum, p) => sum + p, 0)

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${GREEN}15` }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: GREEN }} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">
                Review your design before we build it
              </div>
              <div className="text-sm text-gray-500">
                {allPanels.length} panels across {data.numSides} sides
              </div>
            </div>
          </div>
          <Link
            href="/start-project/mosquito-curtains/diy-builder"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Edit Configuration
          </Link>
        </div>

        {/* ── Intro copy ── */}
        <Card className="!p-5 !bg-[#406517]/5 !border-[#406517]/15">
          <Text size="sm" className="text-gray-700 !mb-0">
            Here&apos;s what you&apos;ve designed so far. Check it over, then choose how you&apos;d
            like to move forward. Every project is looked at by a real human before it&apos;s made.
          </Text>
        </Card>

        {/* ── Panel breakdown ── */}
        {isLoading ? (
          <Card className="!p-8 text-center">
            <Spinner size="lg" className="mx-auto mb-3" />
            <Text className="text-gray-500 !mb-0">Loading your project summary...</Text>
          </Card>
        ) : (
          <>
            {data.sides.map((side, sideIdx) => {
              const sidePanels = allPanels.filter((p) => p.side === sideIdx + 1)
              if (sidePanels.length === 0) return null

              return (
                <Card
                  key={sideIdx}
                  className="!p-0 !bg-white !border-2 !border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-100 px-5 py-2.5 border-b border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">Side {sideIdx + 1}</span>
                    <span className="text-gray-400 text-xs ml-3">
                      {side.totalWidth}&quot; wide &middot; {side.leftHeight}&quot;/
                      {side.rightHeight}&quot; tall
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {sidePanels.map((panel, i) => {
                      const panelIdx = allPanels.indexOf(panel)
                      const price = panelPrices[panelIdx] || 0
                      return (
                        <div
                          key={panel.id}
                          className="px-5 py-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              Panel {i + 1}
                            </div>
                            <div className="text-xs text-gray-400">
                              {panel.finalWidth}&quot; &times; {panel.finalHeight}&quot; cut &middot;{' '}
                              {data.meshType.replace(/_/g, ' ')} &middot; {data.meshColor}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-gray-700 tabular-nums">
                            {price > 0 ? fmt(price) : '--'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              )
            })}

            {/* Total */}
            <Card
              className="!p-5"
              style={{ backgroundColor: `${GREEN}08`, borderColor: `${GREEN}30` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Estimated Panel Total</div>
                  <div className="text-[10px] text-gray-400">
                    Track, hardware, and shipping not included
                  </div>
                </div>
                <div className="text-2xl font-black tabular-nums" style={{ color: GREEN }}>
                  {panelTotal > 0 ? fmt(panelTotal) : '--'}
                </div>
              </div>
            </Card>

            <div className="text-center text-xs text-gray-400">
              This is an estimate based on your configuration. Final pricing may vary.
            </div>

            {/* ══════════════════════════════════════════════════════════════
               CTAs: Expert Review (primary) + Place Order (secondary)
               ══════════════════════════════════════════════════════════════ */}
            <Card className="!p-6 md:!p-8 !bg-white !border-2 !border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option A — Expert Review (primary) */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#406517]" />
                    <Heading level={4} className="!mb-0 !text-base">
                      Want a second set of eyes?
                    </Heading>
                  </div>
                  <Text size="sm" className="text-gray-600 !mb-3">
                    Our design team will:
                  </Text>
                  <ul className="space-y-1.5 mb-4 flex-1">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Check your measurements and layout
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Flag anything that might cause gaps or sagging
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                      Suggest better attachment points if we see them
                    </li>
                  </ul>
                  <Text size="xs" className="text-gray-500 !mb-3">
                    You&apos;ll get a confirmation and can ask questions before anything is charged
                    or built.
                  </Text>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmitForReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" /> Submit for Free Expert Review
                      </>
                    )}
                  </Button>
                  <Text size="xs" className="text-gray-500 text-center !mb-0 mt-2">
                    Recommended for most homeowners
                  </Text>
                </div>

                {/* Divider */}
                <div className="hidden md:flex items-center justify-center relative">
                  <div className="absolute inset-y-0 left-0 w-px bg-gray-200" />
                </div>

                {/* Option B — Place Order (secondary) */}
                <div className="flex flex-col md:-ml-6">
                  <div className="border-t border-gray-200 pt-6 md:border-none md:pt-0">
                    <Heading level={4} className="!mb-2 !text-base text-gray-700">
                      Ready to order right now?
                    </Heading>
                    <Text size="sm" className="text-gray-500 !mb-4">
                      If you&apos;re confident in your measurements and layout, you can skip the
                      review and go straight to checkout.
                    </Text>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      onClick={() => setShowCheckoutModal(true)}
                    >
                      I&apos;m sure, let me place my order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Text size="xs" className="text-gray-400 text-center !mb-0 mt-2">
                      For experienced DIYers who are confident in their measurements
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ══════════════════════════════════════════════
           Confirmation Modal — Expert Review Submitted
           ══════════════════════════════════════════════ */}
        <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: GREEN }} />
            <Heading level={2} className="!mb-2">
              You&apos;re in the review queue
            </Heading>
            <Text className="text-gray-600 !mb-6">
              We&apos;ll look over your design within 1 business day. If everything looks good,
              we&apos;ll confirm and send your final order link. If we spot an issue, we&apos;ll
              email you with suggested changes before you pay.
            </Text>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:+18889109960"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Phone className="w-4 h-4" /> (888) 910-9960
              </a>
              <a
                href="mailto:info@mosquitocurtains.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-4 h-4" /> info@mosquitocurtains.com
              </a>
            </div>
          </div>
        </Modal>

        {/* ══════════════════════════════════════════════
           Checkout Confirmation Modal — Are you sure?
           ══════════════════════════════════════════════ */}
        <Modal open={showCheckoutModal} onClose={() => setShowCheckoutModal(false)}>
          <div className="text-center">
            <Heading level={3} className="!mb-3">
              Ready to place your order?
            </Heading>
            <Text className="text-gray-600 !mb-6">
              Almost everyone has us double-check their project first. If you&apos;d still like to
              go straight to checkout, click Continue below.
            </Text>
            <Text size="sm" className="text-gray-500 italic !mb-6">
              (We&apos;ll still give your project a once-over before it ships. If we spot anything
              worrying, we&apos;ll reach out.)
            </Text>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setShowCheckoutModal(false)
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Expert Review
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/cart">
                  Continue to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Modal>
      </Stack>
    </Container>
  )
}
