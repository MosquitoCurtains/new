'use client'

/**
 * /raw-netting-fabric-store/ -- Raw Netting Landing Page
 * 
 * Category cards linking to individual pages for each mesh type.
 * Trust badges, overview video, and cross-links.
 */

import Link from 'next/link'
import {
  ArrowRight,
  Ruler,
  Truck,
  ShieldCheck,
  Layers,
  Scissors,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
  Frame,
  YouTubeEmbed,
  PowerHeaderTemplate,
  FinalCTATemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import RawNettingFeaturesBlock from '@/app/order/components/RawNettingFeaturesBlock'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const MESH_PRODUCTS = [
  {
    name: 'Heavy Mosquito Mesh',
    slug: '/raw-netting/mosquito-net',
    description: 'Our most popular mesh. Best value, quality, and airflow. Stops mosquitoes, gnats, and black flies.',
    image: `${IMG}/2021/08/Mosquito-Mesh-1600.jpg`,
    colors: 'Black, White, Ivory',
    widths: '101", 123", 138"',
    startingPrice: '$5.50/ft',
    badge: 'Most Popular',
  },
  {
    name: 'No-See-Um Mesh',
    slug: '/raw-netting/no-see-um',
    description: 'Dense weave with 800 holes per sq inch. Blocks tiny biting flies found near water.',
    image: `${IMG}/2021/08/Noseeum-Mesh-1600.jpg`,
    colors: 'Black, White',
    widths: '101", 123"',
    startingPrice: '$6.00/ft',
    badge: null,
  },
  {
    name: 'Shade Mesh',
    slug: '/raw-netting/shade-mesh',
    description: 'Blocks 80% of sunlight plus insects. Clear looking out, opaque looking in. Great for projection screens.',
    image: `${IMG}/2021/08/Shade-Mesh-1600.jpg`,
    colors: 'Black, White',
    widths: '120"',
    startingPrice: '$7.00/ft',
    badge: null,
  },
  {
    name: 'Industrial Mesh',
    slug: '/raw-netting/industrial',
    description: 'Incredibly strong military overrun nylon mesh. Can be zip tied on edges. Available in Olive Green.',
    image: `${IMG}/2021/08/Industrial-Mesh-1600.jpg`,
    colors: 'Olive Green',
    widths: '65"',
    startingPrice: '$4.00/ft',
    badge: 'Best Price',
  },
  {
    name: 'Theatre Scrim',
    slug: '/raw-netting/scrim',
    description: 'Marine-grade shark tooth scrim material. Suitable for outdoors. Available in white or silver.',
    image: `${IMG}/2019/09/White-Sharks-tooth-Scrim-1200.jpg`,
    colors: 'White, Silver',
    widths: '120", 140"',
    startingPrice: '$7.00/ft',
    badge: null,
  },
]

const TRUST_BADGES = [
  { icon: Ruler, label: 'Custom-Size', description: 'Cut to your exact length' },
  { icon: Truck, label: 'Fast Delivery', description: '3-7 business days' },
  { icon: ShieldCheck, label: 'Marine-Grade', description: 'Built to last outdoors' },
  { icon: Layers, label: 'Multi-Purpose', description: 'Limitless applications' },
]

export default function RawNettingStorePage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <PowerHeaderTemplate
          title="Raw Netting Fabric Store"
          subtitle="Giant rolls of marine-grade raw netting custom-cut to your specifications. Incredibly strong with limitless applications. For DIY projects and professionals."
          videoId={VIDEOS.RAW_NETTING}
          videoTitle="Why Us For Raw Netting"
          variant="compact"
          ctaText="Shop All Meshes"
          ctaHref="/order/raw-netting"
          actions={[]}
        />

        {/* Trust Badges */}
        <section>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <Card key={badge.label} variant="outlined" className="!p-4 text-center">
                  <Icon className="w-6 h-6 text-[#406517] mx-auto mb-2" />
                  <Text className="font-semibold text-gray-900 !mb-0.5">{badge.label}</Text>
                  <Text size="sm" className="text-gray-500 !mb-0">{badge.description}</Text>
                </Card>
              )
            })}
          </Grid>
        </section>

        {/* Mesh Product Cards */}
        <section>
          <Heading level={2} className="!mb-2 text-center">Shop By Mesh Type</Heading>
          <Text className="text-gray-500 text-center !mb-8 max-w-xl mx-auto">
            We have several mesh net fabric types to choose from. Each serves a particular purpose. We sell them in raw netting pieces cut by the linear foot from huge rolls to custom fit your needs.
          </Text>
          <div className="space-y-4">
            {MESH_PRODUCTS.map((product) => (
              <Link key={product.slug} href={product.slug} className="group block">
                <Card variant="elevated" className="!p-0 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-56 md:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-5 md:p-6 flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#406517] transition-colors">
                            {product.name}
                          </h3>
                          {product.badge && (
                            <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 text-xs">
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                        <Text size="sm" className="text-gray-600 !mb-2">{product.description}</Text>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Colors: {product.colors}</span>
                          <span>Widths: {product.widths}</span>
                          <span className="font-semibold text-[#406517]">From {product.startingPrice}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#406517] group-hover:translate-x-1 transition-all ml-4 flex-shrink-0 hidden md:block" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Shared Features */}
        <RawNettingFeaturesBlock />

        {/* Cross Links */}
        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card variant="outlined" className="!p-5 !bg-[#003365]/5 !border-[#003365]/20">
              <Scissors className="w-7 h-7 text-[#003365] mb-2" />
              <Heading level={4} className="!mb-2">Shop All On One Page</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                See all mesh types side by side with inline ordering.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/order/raw-netting">
                  All Meshes <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
            <Card variant="outlined" className="!p-5 !bg-[#406517]/5 !border-[#406517]/20">
              <ShieldCheck className="w-7 h-7 text-[#406517] mb-2" />
              <Heading level={4} className="!mb-2">Attachment Hardware</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                Marine snaps, elastic cord, webbing, and more.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/raw-netting/hardware">
                  Shop Hardware <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
            <Card variant="outlined" className="!p-5 !bg-[#B30158]/5 !border-[#B30158]/20">
              <Layers className="w-7 h-7 text-[#B30158] mb-2" />
              <Heading level={4} className="!mb-2">Let Us Make It For You</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                Custom panels made to your exact measurements.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/raw-netting/custom">
                  Custom Orders <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
          </Grid>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
