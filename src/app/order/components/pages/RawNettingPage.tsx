'use client'

/**
 * RawNettingPage — All 5 mesh types on one scrollable page with inline ordering.
 *
 * Shared component used by /order/raw-netting and /order-mesh-netting-fabrics/.
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
  Spinner,
  YouTubeEmbed,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import { useCartContext } from '@/contexts/CartContext'
import RawNettingOrderForm from '../RawNettingOrderForm'
import RawNettingFeaturesBlock from '../RawNettingFeaturesBlock'

// =============================================================================
// PRODUCT CONFIGS (DB pricing keys — prices fetched at runtime)
// =============================================================================

const PRODUCTS = [
  {
    id: 'heavy_mosquito',
    title: "Heavy Mosquito Mesh",
    badge: 'Most Popular',
    description: 'Our most popular mesh. Best value, quality, and airflow. Stops even gnats and black flies.',
    rollSizes: [
      { value: '101', label: '101"', priceLabel: '$5.50/ft', pricingKey: 'raw_heavy_mosquito_101' },
      { value: '123', label: '123"', priceLabel: '$6.00/ft', pricingKey: 'raw_heavy_mosquito_123' },
      { value: '138', label: '138"', priceLabel: '$6.50/ft', pricingKey: 'raw_heavy_mosquito_138' },
    ],
    colors: [
      { value: 'black', label: 'Black', color: '#1a1a1a' },
      { value: 'white', label: 'White', color: '#ffffff' },
      { value: 'ivory', label: 'Ivory', color: '#fffff0' },
    ],
    detailPage: '/mosquito-netting/',
  },
  {
    id: 'no_see_um',
    title: 'No-See-Um Mesh',
    badge: null,
    description: 'Dense weave with 800 holes per sq inch. Blocks tiny biting flies found near water.',
    rollSizes: [
      { value: '101', label: '101"', priceLabel: '$6.00/ft', pricingKey: 'raw_no_see_um_101' },
      { value: '123', label: '123"', priceLabel: '$7.00/ft', pricingKey: 'raw_no_see_um_123' },
    ],
    colors: [
      { value: 'black', label: 'Black', color: '#1a1a1a' },
      { value: 'white', label: 'White', color: '#ffffff' },
    ],
    detailPage: '/no-see-um-netting-screen/',
  },
  {
    id: 'shade',
    title: 'Shade Mesh',
    badge: null,
    description: 'Blocks 80% of sunlight plus insects. Also works as an outdoor projection screen.',
    rollSizes: [
      { value: '120', label: '120"', priceLabel: '$7.00/ft', pricingKey: 'raw_shade_120' },
    ],
    colors: [
      { value: 'black', label: 'Black', color: '#1a1a1a' },
      { value: 'white', label: 'White', color: '#ffffff' },
    ],
    detailPage: '/shade-screen-mesh/',
  },
  {
    id: 'theater_scrim',
    title: 'Theatre Scrim',
    badge: null,
    description: 'Raw shark tooth scrim. 100% polyester suitable for outdoors. White or silver.',
    rollSizes: [
      { value: '120', label: '120"', priceLabel: '$7.00/ft', pricingKey: 'raw_theater_scrim_120' },
      { value: '140', label: '140"', priceLabel: '$7.50/ft', pricingKey: 'raw_theater_scrim_140' },
    ],
    colors: [
      { value: 'white', label: 'White', color: '#ffffff' },
      { value: 'silver', label: 'Silver', color: '#c0c0c0' },
    ],
    detailPage: '/theatre-scrim/',
  },
]

export function RawNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Raw Netting Fabrics"
          subtitle="Giant rolls of raw netting custom-cut to your specifications. Incredibly strong with limitless applications."
          videoId={VIDEOS.RAW_NETTING}
          videoTitle="Why Us For Raw Netting"
          variant="compact"
        />

        {/* Trust Badges */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="sm">
            {['Custom-Size', 'Fast Delivery', 'Marine-Grade', 'Multi-Purpose'].map(badge => (
              <Badge key={badge} className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 justify-center py-2">
                {badge}
              </Badge>
            ))}
          </Grid>
        </section>

        {/* Per-Product Sections */}
        {PRODUCTS.map((product) => (
          <section key={product.id} id={product.id}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Heading level={2} className="!mb-0">{product.title}</Heading>
                {product.badge && (
                  <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <Text className="text-gray-600 max-w-2xl">{product.description}</Text>
              <Link href={product.detailPage} className="text-sm text-[#003365] hover:underline font-medium inline-flex items-center gap-1">
                Full product details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <RawNettingOrderForm
                materialType={product.id}
                productName={product.title}
                rollSizes={product.rollSizes}
                colors={product.colors}
              />
            </div>
          </section>
        ))}

        {/* Industrial Mesh note */}
        <section>
          <Card variant="outlined" className="!p-5 !bg-green-900/5 !border-green-800/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Heading level={3} className="!mb-1">Industrial Mesh</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">
                  Military overrun nylon mesh. Available by the foot or full roll. See the dedicated product page.
                </Text>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/industrial-mesh/">
                  Shop Industrial Mesh
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Shared Features */}
        <RawNettingFeaturesBlock />

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" />
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" />
          </Grid>
        </section>

        {/* Quick Links */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/raw-netting-fabric-store/" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#406517]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#406517] transition-colors">Fabric Store</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Individual product pages with detailed info</Text>
              </Card>
            </Link>
            <Link href="/order/raw-netting-attachments" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#003365]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#003365] transition-colors">Attachment Hardware</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Snaps, cord, webbing & rigging supplies</Text>
              </Card>
            </Link>
            <Link href="/start-project" className="group">
              <Card variant="outlined" className="!p-5 h-full hover:border-[#B30158]/40 transition-colors">
                <Heading level={4} className="!mb-1 group-hover:text-[#B30158] transition-colors">Let Us Make It</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Custom-made panels to your exact specs</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
