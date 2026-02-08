'use client'

/**
 * /raw-netting-fabric-store/ — Raw Netting Landing Page
 * 
 * Category cards linking to individual SEO pages for each mesh type.
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
  Play,
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
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'
import RawNettingFeaturesBlock from '@/app/order/components/RawNettingFeaturesBlock'

// =============================================================================
// MESH PRODUCT CARDS
// =============================================================================

const MESH_PRODUCTS = [
  {
    name: 'Heavy Mosquito Mesh',
    slug: '/mosquito-netting/',
    description: 'Our most popular mesh. Best value, quality, and airflow. Stops mosquitoes, gnats, and black flies.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: 'Black, White, Ivory',
    widths: '101", 123", 138"',
    startingPrice: '$5.50/ft',
    badge: 'Most Popular',
  },
  {
    name: 'No-See-Um Mesh',
    slug: '/no-see-um-netting-screen/',
    description: 'Dense weave with 800 holes per sq inch. Blocks tiny biting flies found near water.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    colors: 'Black, White',
    widths: '101", 123"',
    startingPrice: '$6.00/ft',
    badge: null,
  },
  {
    name: 'Shade Mesh',
    slug: '/shade-screen-mesh/',
    description: 'Blocks 80% of sunlight plus insects. Clear looking out, opaque looking in. Great for projection screens.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    colors: 'Black, White',
    widths: '120"',
    startingPrice: '$7.00/ft',
    badge: null,
  },
  {
    name: 'Industrial Mesh',
    slug: '/industrial-mesh/',
    description: 'Incredibly strong military overrun nylon mesh. Can be zip tied on edges. Available in Olive Green.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: 'Olive Green',
    widths: '65"',
    startingPrice: '$4.00/ft',
    badge: 'Best Price',
  },
  {
    name: 'Theatre Scrim',
    slug: '/theatre-scrim/',
    description: 'Marine-grade shark tooth scrim material. Suitable for outdoors. Available in white or silver.',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: 'White, Silver',
    widths: '120", 140"',
    startingPrice: '$7.00/ft',
    badge: null,
  },
]

// =============================================================================
// TRUST BADGES
// =============================================================================

const TRUST_BADGES = [
  { icon: Ruler, label: 'Custom-Size', description: 'Cut to your exact length' },
  { icon: Truck, label: 'Fast Delivery', description: '3-7 business days' },
  { icon: ShieldCheck, label: 'Marine-Grade', description: 'Built to last outdoors' },
  { icon: Layers, label: 'Multi-Purpose', description: 'Limitless applications' },
]

// =============================================================================
// PAGE
// =============================================================================

export default function RawNettingStorePage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30 mb-4">
                For DIY Projects & Professionals
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Raw Netting Fabric Store
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Giant rolls of marine-grade raw netting custom-cut to your specifications.
                Incredibly strong with limitless applications.
              </p>
            </div>
          </div>
        </section>

        {/* Overview Video */}
        <section>
          <div className="max-w-3xl mx-auto">
            <YouTubeEmbed
              videoId={VIDEOS.RAW_NETTING}
              title="Why Us For Raw Netting"
              variant="hero"
            />
          </div>
        </section>

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
            Choose from 5 premium mesh types. Each page has detailed product information and an order form.
          </Text>
          <div className="space-y-4">
            {MESH_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={product.slug}
                className="group block"
              >
                <Card variant="elevated" className="!p-0 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <Frame ratio="1/1" className="bg-gray-100 md:w-48 md:h-auto flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Frame>
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
                        <Text size="sm" className="text-gray-600 !mb-2">
                          {product.description}
                        </Text>
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
              <Heading level={4} className="!mb-2">Shop All On One Page</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                See all mesh types side by side with inline ordering.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/order/raw-netting">
                  All Meshes
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
            <Card variant="outlined" className="!p-5 !bg-[#406517]/5 !border-[#406517]/20">
              <Heading level={4} className="!mb-2">Attachment Hardware</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                Marine snaps, elastic cord, webbing, and more for rigging your mesh.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/order/raw-netting-attachments">
                  Shop Hardware
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </Card>
            <Card variant="outlined" className="!p-5 !bg-[#B30158]/5 !border-[#B30158]/20">
              <Heading level={4} className="!mb-2">Let Us Make It For You</Heading>
              <Text size="sm" className="text-gray-600 !mb-3">
                We custom-make finished panels to your exact measurements.
              </Text>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/start-project">
                  Start a Project
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
