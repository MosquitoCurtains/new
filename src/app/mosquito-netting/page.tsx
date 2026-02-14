'use client'

/**
 * /mosquito-netting/ — Heavy Mosquito Mesh SEO Product Page
 * 
 * Content from WP crawl. Embedded order form + shared features.
 * Canonical URL: /mosquito-netting/ (legacy WP URL)
 */

import Link from 'next/link'
import { ArrowRight, Eye, Wind, Star, Shield } from 'lucide-react'
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
import RawNettingOrderForm from '@/app/order/components/RawNettingOrderForm'
import RawNettingFeaturesBlock from '@/app/order/components/RawNettingFeaturesBlock'

// =============================================================================
// PRODUCT DATA
// =============================================================================

const ROLL_SIZES = [
  { value: '101', label: '101"', priceLabel: '$5.50/ft', pricingKey: 'raw_panel_hm_101' },
  { value: '123', label: '123"', priceLabel: '$6.00/ft', pricingKey: 'raw_panel_hm_123' },
  { value: '138', label: '138"', priceLabel: '$6.50/ft', pricingKey: 'raw_panel_hm_138' },
]

const COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
  { value: 'ivory', label: 'Ivory', color: '#fffff0' },
]

const CROSS_LINKS = [
  { name: 'No-See-Um Mesh', href: '/no-see-um-netting-screen/', description: 'Blocks tiny biting flies' },
  { name: 'Shade Mesh', href: '/shade-screen-mesh/', description: 'Blocks 80% of sunlight' },
  { name: 'Industrial Mesh', href: '/industrial-mesh/', description: 'Military-grade nylon' },
  { name: 'Theatre Scrim', href: '/theatre-scrim/', description: 'Shark tooth scrim material' },
]

// =============================================================================
// PAGE
// =============================================================================

function MosquitoNettingContent() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/5 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 mb-4">
                Most Popular Mesh
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Our &ldquo;Heavy&rdquo; Mosquito Netting Fabric
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular mesh. Best value, quality, and airflow. Incredibly strong unlike
                cheap meshes elsewhere. Rectangular grid pattern stops even gnats and black flies.
                Our own durable recipe made to last.
              </p>
            </div>
          </div>
        </section>

        {/* Order Form */}
        <section id="order">
          <RawNettingOrderForm
            materialType="heavy_mosquito"
            productName="Heavy Mosquito Mesh"
            rollSizes={ROLL_SIZES}
            colors={COLORS}
          />
        </section>

        {/* Product Details */}
        <section>
          <TwoColumn gap="lg">
            <div>
              <Heading level={2} className="!mb-4">Why Heavy Mosquito Mesh?</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">
                  Available in black, white, or ivory
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Privacy looking in, clear looking out
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Best airflow of all our mesh types
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Most popular choice — best overall value
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Rectangular grid pattern stops gnats & black flies
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Custom-cut from massive rolls up to 138&quot; wide
                </ListItem>
              </BulletedList>
            </div>
            <div>
              <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg"
                  alt="Heavy mosquito netting fabric close-up"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </div>
          </TwoColumn>
        </section>

        {/* Color Gallery */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Available Colors</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            {COLORS.map((color) => (
              <Card key={color.value} variant="elevated" className="!p-0 overflow-hidden">
                <div
                  className="h-32"
                  style={{ backgroundColor: color.color === '#ffffff' ? '#f5f5f5' : color.color }}
                />
                <div className="p-4 text-center">
                  <Text className="font-semibold !mb-0">{color.label}</Text>
                </div>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed
              videoId={VIDEOS.RAW_NETTING}
              title="Why Us For Raw Netting"
            />
            <YouTubeEmbed
              videoId={VIDEOS.RAW_NETTING_FABRIC}
              title="Mesh Types Overview"
            />
          </Grid>
        </section>

        {/* Shared Features */}
        <RawNettingFeaturesBlock />

        {/* Cross Links */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Other Mesh Types</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {CROSS_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <Card variant="outlined" className="!p-4 h-full hover:border-[#406517]/40 transition-colors">
                  <Text className="font-semibold text-gray-900 group-hover:text-[#406517] !mb-1 transition-colors">
                    {link.name}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{link.description}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
          <div className="text-center mt-6">
            <Button variant="secondary" asChild>
              <Link href="/order/raw-netting-attachments">
                Attachment Hardware
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate productLine="mc" />
      </Stack>
    </Container>
  )
}

export default function MosquitoNettingPage() {
  return (
    <OrderShell>
      <MosquitoNettingContent />
    </OrderShell>
  )
}
