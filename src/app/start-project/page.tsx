'use client'

/**
 * Start Project Landing
 *
 * Three product flows: Mosquito Curtains, Clear Vinyl, Raw Netting.
 * Each links to /start-project/[product] for path selection.
 */

import Link from 'next/link'
import { ArrowRight, Bug, Snowflake, Scissors } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Frame,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

const PRODUCT_FLOWS = [
  {
    slug: 'mosquito-curtains',
    title: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    description: 'Custom screen panels sewn to your measurements',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200.jpg',
    icon: Bug,
    color: '#406517',
  },
  {
    slug: 'clear-vinyl',
    title: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    description: 'Custom vinyl panels - block wind, rain and cold',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
    icon: Snowflake,
    color: '#003365',
  },
  {
    slug: 'raw-netting',
    title: 'Raw Mesh Fabric',
    subtitle: 'DIY Materials',
    description: 'Bulk netting by the yard - up to 12ft wide',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200.jpg',
    icon: Scissors,
    color: '#B30158',
  },
]

export default function StartProjectLandingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Start Your Project Today
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Custom-crafted to your exact measurements. Marine-grade quality.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-base !mb-0 text-gray-900">Choose Your Product</Heading>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {PRODUCT_FLOWS.map((product) => {
                const Icon = product.icon
                return (
                  <Link key={product.slug} href={`/start-project/${product.slug}`}>
                    <Card
                      variant="elevated"
                      className={cn(
                        'h-full text-left rounded-2xl overflow-hidden border-2 transition-all',
                        'hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300'
                      )}
                    >
                      <Frame ratio="16/10">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      </Frame>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" style={{ color: product.color }} />
                          <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                            {product.subtitle}
                          </Text>
                        </div>
                        <Heading level={4} className="!mb-1 text-gray-900">{product.title}</Heading>
                        <Text size="sm" className="text-gray-600 !mb-3">{product.description}</Text>
                        <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: product.color }}>
                          Get started
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
