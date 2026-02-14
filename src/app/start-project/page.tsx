'use client'

/**
 * Start Project Landing — "What do you want your space to do?"
 *
 * Benefit-driven product selection. Each card maps to a customer desire,
 * not a product name. Routes to /start-project/[product] for path selection.
 */

import Link from 'next/link'
import { ArrowRight, Bug, Snowflake, Scissors, Check, Users } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
  Frame,
} from '@/lib/design-system'

const PRODUCT_FLOWS = [
  {
    slug: 'mosquito-curtains',
    productName: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    badge: 'Most Popular',
    title: 'Keep mosquitoes out (so you can actually use your porch)',
    oneLiner: 'Enjoy summer evenings outside without getting eaten alive by bugs.',
    bullets: [
      'Stops mosquitoes and bugs, no harsh chemicals',
      'Soft mesh that opens like a curtain for easy in & out',
      'Looks like it came with the house, not a cheap tent',
    ],
    proof: 'Thousands of porches protected since 2003.',
    buttonText: 'I Want Bug Protection',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200.jpg',
    icon: Bug,
    color: '#406517',
  },
  {
    slug: 'clear-vinyl',
    productName: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    badge: 'All-Weather Comfort',
    title: 'Block wind, cold, and pollen',
    oneLiner: 'Turn your porch or patio into a cozy 3-season room. Enjoy your outdoor space year-round.',
    bullets: [
      'Clear vinyl panels block cold drafts and rain',
      'Keep pollen and dust out while you keep the view',
      'Great for exposed porches, patios, and restaurants',
    ],
    proof: 'Used on homes, lake houses, and restaurant patios.',
    buttonText: 'I Want Weather Protection',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
    icon: Snowflake,
    color: '#003365',
  },
  {
    slug: 'raw-netting',
    productName: 'Raw Mesh Fabric',
    subtitle: 'DIY Materials',
    badge: 'DIY Projects',
    title: 'I just want quality netting for my own project',
    oneLiner: 'Buy the same mosquito netting we use (by the foot from massive rolls) for your own ideas.',
    bullets: [
      'Perfect for gardens, campers, boats, beds, and more',
      'Cut-to-length, multiple colors and grades',
      'Higher quality than big-box store netting',
    ],
    proof: 'Loved by tinkerers, makers, and hobbyists.',
    buttonText: "I'm Doing a DIY Project",
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
          {/* Background blurs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-5 md:p-6 lg:p-8">
            {/* Headline */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                What do you want your space to do?
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Pick the one that sounds most like you. We&apos;ll match you to the right setup.
              </p>
            </div>

            {/* Product cards */}
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {PRODUCT_FLOWS.map((product) => (
                <Link key={product.slug} href={`/start-project/${product.slug}`} className="group">
                  <Card variant="elevated" hover className="h-full overflow-hidden !p-0 !rounded-2xl relative border-2 border-transparent hover:border-[#406517]/30 transition-all">
                    {/* Badge */}
                    <Badge
                      className="absolute top-3 left-3 z-10 !text-white"
                      style={{ backgroundColor: product.color, borderColor: product.color }}
                    >
                      {product.badge}
                    </Badge>

                    {/* Image */}
                    <Frame ratio="4/3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Frame>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2">
                      {/* Product label */}
                      <div className="flex items-center gap-2">
                        <product.icon className="w-4 h-4" style={{ color: product.color }} />
                        <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                          {product.subtitle}
                        </Text>
                      </div>
                      <Heading level={4} className="!text-base md:!text-lg group-hover:text-[#406517] transition-colors !mb-0 leading-snug">
                        {product.productName}
                      </Heading>

                      {/* Benefit-driven title */}
                      <Text size="sm" className="font-medium text-gray-800 !mb-0 leading-snug">
                        {product.title}
                      </Text>

                      {/* One-liner */}
                      <Text size="sm" className="text-gray-600 italic !mb-0">
                        &ldquo;{product.oneLiner}&rdquo;
                      </Text>

                      {/* Bullets */}
                      <ul className="space-y-1.5 mt-1">
                        {product.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      {/* Micro-proof */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{product.proof}</span>
                      </div>

                      {/* CTA button */}
                      <div className="mt-2 w-full rounded-lg py-2 px-4 text-center text-sm font-semibold text-white transition-all group-hover:opacity-90"
                        style={{ backgroundColor: product.color }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {product.buttonText}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>

            {/* Microcopy under cards */}
            <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
              Most homeowners choose Bug Protection or Weather Protection.
              If you&apos;re not sure, start there. You can always change your mind on the next step.
            </p>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
