'use client'

/**
 * Path Selection
 *
 * Choose Expert Assistance, Instant Quote, or DIY Builder.
 * Used by /start-project/[product] pages.
 */

import Link from 'next/link'
import { MessageSquare, Calculator, Hammer, Check, ArrowLeft } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

export type ProductSlug = 'mosquito-curtains' | 'clear-vinyl' | 'raw-netting'

const PATH_OPTIONS = [
  {
    id: 'expert-assistance',
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Upload photos, get personalized guidance',
    features: ['Upload photos of your space', 'Expert reviews your project', 'Detailed quote within 24-48 hours'],
    badge: 'Recommended',
    color: '#B30158',
  },
  {
    id: 'instant-quote',
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Enter specs for a quick estimate',
    features: ['Configure options', 'Enter dimensions', 'Get instant price'],
    badge: 'Fastest',
    color: '#003365',
  },
  {
    id: 'diy-builder',
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels and add to cart',
    features: ['Panel-by-panel config', 'Full control over options', 'Direct checkout'],
    badge: 'Most Control',
    color: '#FFA501',
  },
]

// Raw netting has no instant pricing - show "Contact for quote" instead
const RAW_PATH_OPTIONS = [
  PATH_OPTIONS[0],
  {
    ...PATH_OPTIONS[1],
    title: 'Contact for Quote',
    description: 'Describe your project for a custom price',
    features: ['Share project details', 'We\'ll contact you within 24-48 hours', 'Custom quote for your materials'],
  },
  PATH_OPTIONS[2],
]

interface PathSelectionProps {
  productSlug: ProductSlug
  productTitle: string
  backHref?: string
}

export function PathSelection({ productSlug, productTitle, backHref = '/start-project' }: PathSelectionProps) {
  const paths = productSlug === 'raw-netting' ? RAW_PATH_OPTIONS : PATH_OPTIONS

  return (
    <Container size="xl">
      <Stack gap="lg">
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-5 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {backHref && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={backHref}>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                {productTitle}
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                How can we help?
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-base !mb-0 text-gray-900">Choose Your Path</Heading>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {paths.map((path) => {
                const Icon = path.icon
                const href = `/start-project/${productSlug}/${path.id}`
                return (
                  <Link key={path.id} href={href}>
                    <Card
                      variant="elevated"
                      className={cn(
                        'relative h-full text-left p-5 rounded-2xl border-2 transition-all bg-white',
                        'hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300'
                      )}
                    >
                      <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: path.color, borderColor: path.color }}>
                        {path.badge}
                      </Badge>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${path.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: path.color }} />
                      </div>
                      <Heading level={4} className="!mb-1">{path.title}</Heading>
                      <Text size="sm" className="text-gray-600 !mb-2">{path.description}</Text>
                      <ul className="space-y-1">
                        {path.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
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
