'use client'

/**
 * /shade-screen-mesh/ — Shade Mesh SEO Product Page
 * 
 * Content from WP crawl. Single roll width (120").
 */

import Link from 'next/link'
import { ArrowRight, Sun } from 'lucide-react'
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
  { value: '120', label: '120"', priceLabel: '$7.00/ft', pricingKey: 'raw_panel_shade_120' },
]

const COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
]

const CROSS_LINKS = [
  { name: 'Heavy Mosquito Mesh', href: '/mosquito-netting/', description: 'Most popular — best airflow' },
  { name: 'No-See-Um Mesh', href: '/no-see-um-netting-screen/', description: 'Blocks tiny biting flies' },
  { name: 'Industrial Mesh', href: '/industrial-mesh/', description: 'Military-grade nylon' },
  { name: 'Theatre Scrim', href: '/theatre-scrim/', description: 'Shark tooth scrim material' },
]

function ShadeScreenMeshContent() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-amber-50 via-white to-[#003365]/5 border-2 border-amber-200 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-amber-100 !text-amber-800 !border-amber-300 mb-4">
                Blocks 80% Sunlight
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Shade Mesh Fabric
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Black shade mesh will not fade and blocks both insects and 80% of sunlight. Best
                shade screen material for visibility. White shade mesh is used primarily for outdoor
                projection screens. Lab tested to block 80% of sunlight.
              </p>
            </div>
          </div>
        </section>

        {/* Key Info Cards */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            <Card variant="outlined" className="!p-5">
              <div className="flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <Text className="font-semibold text-gray-900 !mb-1">Black Shade Mesh</Text>
                  <Text size="sm" className="text-gray-600 !mb-0">
                    Will not fade. Blocks 80% of sunlight plus insects. Clear looking out,
                    opaque looking in for privacy. Best visibility of any shade material.
                  </Text>
                </div>
              </div>
            </Card>
            <Card variant="outlined" className="!p-5">
              <div className="flex items-start gap-3">
                <Sun className="w-5 h-5 text-[#003365] mt-0.5 flex-shrink-0" />
                <div>
                  <Text className="font-semibold text-gray-900 !mb-1">White Shade Mesh</Text>
                  <Text size="sm" className="text-gray-600 !mb-0">
                    Used primarily for outdoor projection screens. Interesting optical qualities.
                    Also provides shade and insect protection.
                  </Text>
                </div>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Order Form */}
        <section id="order">
          <RawNettingOrderForm
            materialType="shade"
            productName="Shade Mesh"
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
                <ListItem variant="checked" iconColor="#406517">
                  Available in black or white
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Blocks 80% of sunlight — lab tested
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Clear looking out, opaque looking in
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  White version works as outdoor projection screen
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  120&quot; wide rolls — cut to your exact length
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  100% polyester, solution dyed — will not fade
                </ListItem>
              </BulletedList>
              <div className="mt-4">
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/order/roll-up-shades">
                    See Roll-Up Shade Screens
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg"
                  alt="Shade mesh fabric close-up"
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
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" />
          </Grid>
        </section>

        <RawNettingFeaturesBlock />

        {/* Cross Links */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Other Mesh Types</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {CROSS_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <Card variant="outlined" className="!p-4 h-full hover:border-amber-300 transition-colors">
                  <Text className="font-semibold text-gray-900 group-hover:text-amber-700 !mb-1 transition-colors">
                    {link.name}
                  </Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{link.description}</Text>
                </Card>
              </Link>
            ))}
          </Grid>
        </section>

        <FinalCTATemplate productLine="mc" />
      </Stack>
    </Container>
  )
}

export default function ShadeScreenMeshPage() {
  return (
    <OrderShell>
      <ShadeScreenMeshContent />
    </OrderShell>
  )
}
