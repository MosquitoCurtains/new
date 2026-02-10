'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Star,
  Sparkles,
  Bug,
  Snowflake,
  Scissors,
} from 'lucide-react'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'

import {
  Container,
  Stack,
  Grid,
  Card,
  Frame,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'

// ============================================================================
// EXPERIMENT PAGE - Combined Hero + Products Above the Fold
// ============================================================================

const products = [
  {
    title: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    description: 'Custom insect curtains. Screen your patio in an afternoon.',
    href: '/screened-porch-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200.jpg',
    badge: 'Most Popular',
    color: '#406517',
    icon: Bug,
  },
  {
    title: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    description: 'Four-season room. Wind, rain, and cold stay outside.',
    href: '/clear-vinyl-plastic-patio-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
    badge: 'All Season',
    color: '#003365',
    icon: Snowflake,
  },
  {
    title: 'Raw Mesh Fabrics',
    subtitle: 'DIY Materials',
    description: 'Premium netting for custom projects. Up to 12ft wide.',
    href: '/raw-netting-fabric-store',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200.jpg',
    badge: 'DIY',
    color: '#B30158',
    icon: Scissors,
  },
]

export default function ExperimentPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            COMBINED HERO + PRODUCTS
            ================================================================ */}
        <section className="relative">
          {/* Background blurs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>
          
          {/* Main container with gradient border */}
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            
            {/* Hero Content - Centered */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              {/* Trust Badge */}
              <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                <Sparkles className="w-4 h-4 mr-2" />
                {ORDERS_SERVED_STRINGS.trustedBy}
              </Badge>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Transform Your Outdoor Living Space
              </h1>
              
              {/* Subheadline */}
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Custom-crafted screen enclosures and clear vinyl panels. 
                Marine-grade quality. DIY installation in an afternoon.
              </p>
              
              {/* CTA */}
              <div className="pt-1">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/start-project">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFA501] fill-current" />
                  ))}
                </div>
                <span>4.9/5 from 2,400+ reviews</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-lg !mb-0 text-gray-900">Choose Your Solution</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Custom-made to your exact measurements</Text>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>
            
            {/* Product Cards */}
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {products.map((product) => (
                <Link key={product.title} href={product.href} className="group">
                  <Card variant="elevated" hover className="h-full overflow-hidden !p-0 !rounded-2xl relative border-2 border-transparent hover:border-[#406517]/30 transition-all">
                    <Badge 
                      className="absolute top-3 left-3 z-10 !text-white"
                      style={{ backgroundColor: product.color, borderColor: product.color }}
                    >
                      {product.badge}
                    </Badge>
                    <Frame ratio="16/10">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Frame>
                    <Stack gap="xs" className="p-4">
                      <div className="flex items-center gap-2">
                        <product.icon className="w-4 h-4" style={{ color: product.color }} />
                        <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                          {product.subtitle}
                        </Text>
                      </div>
                      <Heading level={4} className="!text-lg group-hover:text-[#406517] transition-colors !mb-0">
                        {product.title}
                      </Heading>
                      <Text size="sm" className="text-gray-600 !mb-1">{product.description}</Text>
                      <div className="flex items-center font-semibold text-sm" style={{ color: product.color }}>
                        Learn more
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Stack>
                  </Card>
                </Link>
              ))}
            </Grid>
            
          </div>
        </section>

      </Stack>
    </Container>
  )
}
