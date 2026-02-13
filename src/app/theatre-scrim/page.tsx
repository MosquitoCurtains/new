'use client'

/**
 * /theatre-scrim/ — Theatre Scrim SEO Product Page
 * 
 * Content from WP crawl. White or silver scrim material.
 */

import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
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

const ROLL_SIZES = [
  { value: '120', label: '120"', priceLabel: '$7.00/ft', pricingKey: 'raw_panel_scrim_120' },
  { value: '140', label: '140"', priceLabel: '$7.50/ft', pricingKey: 'raw_panel_scrim_140' },
]

const COLORS = [
  { value: 'white', label: 'White', color: '#ffffff' },
  { value: 'silver', label: 'Silver', color: '#c0c0c0' },
]

const CROSS_LINKS = [
  { name: 'Heavy Mosquito Mesh', href: '/mosquito-netting/', description: 'Most popular — best airflow' },
  { name: 'No-See-Um Mesh', href: '/no-see-um-netting-screen/', description: 'Blocks tiny biting flies' },
  { name: 'Shade Mesh', href: '/shade-screen-mesh/', description: 'Blocks 80% of sunlight' },
  { name: 'Industrial Mesh', href: '/industrial-mesh/', description: 'Military-grade nylon' },
]

function TheatreScrimContent() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-purple-50 via-white to-[#003365]/5 border-2 border-purple-200 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-purple-100 !text-purple-800 !border-purple-300 mb-4">
                Marine-Grade Quality
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Theatre Scrim Material
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Raw Shark Tooth Scrim. Though theatre scrim material is generally used indoors, our
                100% polyester material is suitable for outdoors and made to get wet. We can seam
                panels to make ANY size you desire.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Example */}
        <section>
          <Card variant="outlined" className="!p-5 !bg-purple-50 !border-purple-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
              <div>
                <Text className="font-semibold text-gray-900 !mb-1">Pricing Example</Text>
                <Text size="sm" className="text-gray-600 !mb-0">
                  Ordering 20ft from the 120-inch roll delivers a single sheet 20ft x 120-inches
                  at $140 (20ft x $7/ft).
                </Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Order Form */}
        <section id="order">
          <RawNettingOrderForm
            materialType="theater_scrim"
            productName="Theatre Scrim"
            rollSizes={ROLL_SIZES}
            colors={COLORS}
          />
        </section>

        {/* Product Details */}
        <section>
          <TwoColumn gap="lg">
            <div>
              <Heading level={2} className="!mb-4">Product Features</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#6B21A8">
                  Available in white or silver
                </ListItem>
                <ListItem variant="checked" iconColor="#6B21A8">
                  Lightweight and durable shark tooth weave
                </ListItem>
                <ListItem variant="checked" iconColor="#6B21A8">
                  Suitable for indoor projection or theater scrims
                </ListItem>
                <ListItem variant="checked" iconColor="#6B21A8">
                  100% polyester — made to get wet
                </ListItem>
                <ListItem variant="checked" iconColor="#6B21A8">
                  Can be seamed to make ANY size
                </ListItem>
                <ListItem variant="checked" iconColor="#6B21A8">
                  120&quot; and 140&quot; wide rolls available
                </ListItem>
              </BulletedList>
            </div>
            <div>
              <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg"
                  alt="Theatre scrim material"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </div>
          </TwoColumn>
        </section>

        {/* Cross Links - Custom Scrims */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            <Card variant="outlined" className="!p-5 !bg-purple-50 !border-purple-200">
              <Heading level={4} className="!mb-2">Need a Fabricated Scrim?</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                We can seam panels together to make custom theater scrims of any size.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/outdoor-projection-screens">
                  Fabricated Scrims
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
            <Card variant="outlined" className="!p-5 !bg-[#003365]/5 !border-[#003365]/20">
              <Heading level={4} className="!mb-2">Outdoor Projection Screens</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                Our shade mesh and scrim material makes excellent outdoor projection screens.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/outdoor-projection-screens">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
          </Grid>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.THEATER_SCRIM} title="Theatre Scrim Demo" />
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" />
          </Grid>
        </section>

        <RawNettingFeaturesBlock />

        {/* Cross Links */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Other Mesh Types</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {CROSS_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <Card variant="outlined" className="!p-4 h-full hover:border-purple-300 transition-colors">
                  <Text className="font-semibold text-gray-900 group-hover:text-purple-700 !mb-1 transition-colors">
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

export default function TheatreScrimPage() {
  return (
    <OrderShell>
      <TheatreScrimContent />
    </OrderShell>
  )
}
