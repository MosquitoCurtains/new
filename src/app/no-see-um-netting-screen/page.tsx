'use client'

/**
 * /no-see-um-netting-screen/ — No-See-Um Mesh SEO Product Page
 * 
 * Content from WP crawl. Embedded order form + shared features.
 */

import Link from 'next/link'
import { ArrowRight, AlertTriangle } from 'lucide-react'
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
  { value: '101', label: '101"', priceLabel: '$6.00/ft', pricingKey: 'raw_panel_nsu_101' },
  { value: '123', label: '123"', priceLabel: '$7.00/ft', pricingKey: 'raw_panel_nsu_123' },
]

const COLORS = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'white', label: 'White', color: '#ffffff' },
]

const CROSS_LINKS = [
  { name: 'Heavy Mosquito Mesh', href: '/mosquito-netting/', description: 'Most popular — best airflow' },
  { name: 'Shade Mesh', href: '/shade-screen-mesh/', description: 'Blocks 80% of sunlight' },
  { name: 'Industrial Mesh', href: '/industrial-mesh/', description: 'Military-grade nylon' },
  { name: 'Theatre Scrim', href: '/theatre-scrim/', description: 'Shark tooth scrim material' },
]

function NoSeeUmContent() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#003365]/10 via-white to-[#406517]/5 border-2 border-[#003365]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30 mb-4">
                Dense Weave Protection
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                No-See-Um Mesh Fabric
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Has smaller holes (800 holes per sq inch) with a much denser weave to keep out
                pesky biting flies known as no-see-ums found near water. Has elasticity making it
                difficult to spline screen.
              </p>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section>
          <Card variant="outlined" className="!p-5 !bg-amber-50 !border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <Text className="font-semibold text-amber-800 !mb-1">Important Note</Text>
                <Text size="sm" className="text-amber-700 !mb-0">
                  If you don&apos;t have a problem with no-see-um type bugs, we do not recommend this
                  kind of mesh. Our Heavy Mosquito Mesh provides better airflow and is a better value
                  for general insect protection.
                </Text>
              </div>
            </div>
          </Card>
        </section>

        {/* Order Form */}
        <section id="order">
          <RawNettingOrderForm
            materialType="no_see_um"
            productName="No-See-Um Mesh"
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
                <ListItem variant="checked" iconColor="#003365">
                  Available in black or white
                </ListItem>
                <ListItem variant="checked" iconColor="#003365">
                  800 holes per square inch — keeps out no-see-ums
                </ListItem>
                <ListItem variant="checked" iconColor="#003365">
                  Clear looking out through the mesh
                </ListItem>
                <ListItem variant="checked" iconColor="#003365">
                  Much denser weave than standard mosquito mesh
                </ListItem>
                <ListItem variant="checked" iconColor="#003365">
                  Very small holes for maximum protection
                </ListItem>
                <ListItem variant="checked" iconColor="#003365">
                  100% polyester — marine-grade quality
                </ListItem>
              </BulletedList>
            </div>
            <div>
              <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg"
                  alt="No-see-um mesh fabric close-up"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </div>
          </TwoColumn>
        </section>

        {/* Color Gallery */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Available Colors</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            {COLORS.map((color) => (
              <Card key={color.value} variant="elevated" className="!p-0 overflow-hidden">
                <div
                  className="h-32"
                  style={{ backgroundColor: color.color === '#ffffff' ? '#f5f5f5' : color.color }}
                />
                <div className="p-4 text-center">
                  <Text className="font-semibold !mb-0">{color.label} No-See-Um</Text>
                </div>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Videos */}
        <section>
          <Heading level={2} className="!mb-6 text-center">Videos</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" />
            <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" />
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
                <Card variant="outlined" className="!p-4 h-full hover:border-[#003365]/40 transition-colors">
                  <Text className="font-semibold text-gray-900 group-hover:text-[#003365] !mb-1 transition-colors">
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

export default function NoSeeUmPage() {
  return (
    <OrderShell>
      <NoSeeUmContent />
    </OrderShell>
  )
}
