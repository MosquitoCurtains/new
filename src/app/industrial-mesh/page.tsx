'use client'

/**
 * /industrial-mesh/ — Industrial Mesh SEO Product Page
 * 
 * Content from WP crawl. Special: toggle between by-the-foot and full-roll purchase.
 */

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Check, Info } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
  Button,
  TwoColumn,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  Frame,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import OrderShell from '@/app/order/components/OrderShell'
import PillSelector from '@/app/order/components/PillSelector'
import LivePriceDisplay from '@/app/order/components/LivePriceDisplay'
import RawNettingFeaturesBlock from '@/app/order/components/RawNettingFeaturesBlock'
import { useCartContext } from '@/contexts/CartContext'
import { usePricing } from '@/hooks/usePricing'

const CROSS_LINKS = [
  { name: 'Heavy Mosquito Mesh', href: '/mosquito-netting/', description: 'Most popular — best airflow' },
  { name: 'No-See-Um Mesh', href: '/no-see-um-netting-screen/', description: 'Blocks tiny biting flies' },
  { name: 'Shade Mesh', href: '/shade-screen-mesh/', description: 'Blocks 80% of sunlight' },
  { name: 'Theatre Scrim', href: '/theatre-scrim/', description: 'Shark tooth scrim material' },
]

// =============================================================================
// CUSTOM ORDER FORM FOR INDUSTRIAL MESH
// =============================================================================

function IndustrialOrderForm() {
  const { addItem } = useCartContext()
  const { prices, getPrice, isLoading } = usePricing()
  const [purchaseType, setPurchaseType] = useState<'foot' | 'roll'>('foot')
  const [lengthFeet, setLengthFeet] = useState<number | ''>('')
  const [rollQty, setRollQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const perFootRate = prices ? getPrice('raw_panel_ind_65', 0) : 0
  const rollPrice = prices ? getPrice('raw_panel_ind_full_roll', 0) : 0

  const livePrice = useMemo(() => {
    if (!prices) return 0
    if (purchaseType === 'foot') {
      if (!lengthFeet || lengthFeet < 5) return 0
      return Math.round(perFootRate * lengthFeet * 100) / 100
    } else {
      return Math.round(rollPrice * rollQty * 100) / 100
    }
  }, [prices, purchaseType, lengthFeet, perFootRate, rollPrice, rollQty])

  const isValid = purchaseType === 'foot'
    ? typeof lengthFeet === 'number' && lengthFeet >= 5 && lengthFeet <= 200
    : rollQty >= 1

  const handleAddToCart = useCallback(() => {
    if (!isValid || livePrice <= 0) return

    if (purchaseType === 'foot') {
      addItem({
        type: 'fabric',
        productSku: 'raw_netting_panel',
        name: 'Industrial Mesh',
        description: `Olive Green - 65" wide x ${lengthFeet}ft`,
        quantity: 1,
        unitPrice: livePrice,
        totalPrice: livePrice,
        options: { mesh_type: 'industrial', roll_width_industrial: '65', color: 'olive_green', purchase_type: 'by_foot', lengthFeet: lengthFeet as number },
      })
    } else {
      addItem({
        type: 'fabric',
        productSku: 'raw_netting_panel',
        name: 'Industrial Mesh - Full Roll',
        description: `65" x 330ft roll x ${rollQty}`,
        quantity: rollQty,
        unitPrice: rollPrice,
        totalPrice: livePrice,
        options: { mesh_type: 'industrial', roll_width_industrial: '65', color: 'olive_green', purchase_type: 'full_roll', rollQty },
      })
    }

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }, [isValid, livePrice, purchaseType, lengthFeet, rollQty, addItem, rollPrice])

  return (
    <Card variant="elevated" className="!p-6 !border-2 !border-[#406517]/20">
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-gray-900">Configure Your Order</h3>

        {/* Purchase Type Toggle */}
        <PillSelector
          label="Purchase Type"
          options={[
            { value: 'foot', label: 'By the Foot', sublabel: perFootRate > 0 ? `$${perFootRate.toFixed(2)}/ft` : '' },
            { value: 'roll', label: 'Full Roll', sublabel: rollPrice > 0 ? `$${rollPrice.toFixed(0)}/roll` : '' },
          ]}
          value={purchaseType}
          onChange={(v) => setPurchaseType(v as 'foot' | 'roll')}
        />

        {/* By the Foot */}
        {purchaseType === 'foot' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (feet)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={5}
                max={200}
                step={1}
                value={lengthFeet}
                onChange={(e) => {
                  const val = e.target.value
                  setLengthFeet(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0))
                }}
                placeholder="5-200"
                className="w-32 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-center text-lg font-medium focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
              />
              <Text size="sm" className="text-gray-500 !mb-0">
                feet from the 65&quot; roll
              </Text>
            </div>
          </div>
        )}

        {/* Full Roll */}
        {purchaseType === 'roll' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (rolls)</label>
            <div className="flex items-center gap-3">
              <select
                value={rollQty}
                onChange={(e) => setRollQty(parseInt(e.target.value, 10))}
                className="w-32 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-center text-lg font-medium focus:border-[#003365] focus:ring-2 focus:ring-[#003365]/20 outline-none transition-all"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <Text size="sm" className="text-gray-500 !mb-0">
                65&quot; x 330ft rolls
              </Text>
            </div>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <LivePriceDisplay price={livePrice} dimmed={!isValid} size="lg" label="" />
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!isValid || isLoading || justAdded}
            className="!rounded-full !px-6"
          >
            {justAdded ? (
              <><Check className="w-4 h-4 mr-2" />Added</>
            ) : (
              <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

// =============================================================================
// PAGE
// =============================================================================

function IndustrialMeshContent() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-green-900/10 via-white to-amber-50 border-2 border-green-800/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-green-900/10 !text-green-900 !border-green-800/30 mb-4">
                Military Overrun
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Industrial Mesh
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Incredibly strong industrial mesh, military overrun picked up for a low price.
                Extremely durable nylon at 9.4 oz/yd&sup2;. Can be zip tied on edges. Available
                in Olive Green only.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Callout */}
        <section>
          <Card variant="outlined" className="!p-5 !bg-[#406517]/5 !border-[#406517]/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
              <div>
                <Text className="font-semibold text-gray-900 !mb-1">Pricing Example</Text>
                <Text size="sm" className="text-gray-600 !mb-0">
                  Ordering 20ft from the 65-inch roll delivers a single sheet 20ft x 65-inches
                  at $80 (20ft x $4/ft). Full 65&quot; x 330ft rolls available for $900.
                </Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Order Form */}
        <section id="order">
          <IndustrialOrderForm />
        </section>

        {/* Product Details */}
        <section>
          <TwoColumn gap="lg">
            <div>
              <Heading level={2} className="!mb-4">Product Features</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">
                  Incredible price point from military overrun
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Extremely durable nylon — 9.4 oz per square yard
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Can be zip tied on edges for easy installation
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Available in Olive Green
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  65&quot; wide rolls — buy by the foot or full roll
                </ListItem>
              </BulletedList>
            </div>
            <div>
              <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg"
                  alt="Industrial mesh fabric"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </div>
          </TwoColumn>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" />
            <YouTubeEmbed videoId={VIDEOS.INDUSTRIAL_NETTING} title="Industrial Netting" />
          </Grid>
        </section>

        <RawNettingFeaturesBlock />

        {/* Cross Links */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Other Mesh Types</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {CROSS_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <Card variant="outlined" className="!p-4 h-full hover:border-green-800/30 transition-colors">
                  <Text className="font-semibold text-gray-900 group-hover:text-green-800 !mb-1 transition-colors">
                    {link.name}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{link.description}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}

export default function IndustrialMeshPage() {
  return (
    <OrderShell>
      <IndustrialMeshContent />
    </OrderShell>
  )
}
