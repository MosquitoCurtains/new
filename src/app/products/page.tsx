'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Package,
  Bug,
  Snowflake,
  Scissors,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  Frame,
  FinalCTATemplate,
  HeaderBarSection,
  WhyChooseUsTemplate,
} from '@/lib/design-system'

const PRODUCT_CATEGORIES = [
  {
    title: 'Mosquito Curtains',
    description: 'Custom mesh curtains that keep bugs out while letting breezes in. Perfect for porches, gazebos, and pergolas.',
    href: '/screened-porch',
    icon: Bug,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Curtains-Product.jpg',
  },
  {
    title: 'Clear Vinyl Enclosures',
    description: 'Weather-blocking panels that extend your outdoor season. See-through protection from wind, rain, and cold.',
    href: '/clear-vinyl',
    icon: Snowflake,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Product.jpg',
  },
  {
    title: 'Raw Netting & Mesh',
    description: 'Bulk netting fabrics sold by the yard for DIY projects. Mosquito mesh, no-see-um, shade mesh, and more.',
    href: '/raw-netting',
    icon: Scissors,
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Raw-Netting-Product.jpg',
  },
]

export default function ProductsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Package className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Our Products
            </Heading>
            <Text className="text-xl text-gray-600">
              Custom-made outdoor enclosure solutions. Mosquito curtains, clear vinyl, 
              and raw netting fabrics - all made to your exact specifications.
            </Text>
          </Stack>
        </section>

        {/* Product Categories */}
        <HeaderBarSection icon={Package} label="Product Categories" variant="dark">
          <Stack gap="lg">
            {PRODUCT_CATEGORIES.map((product, index) => {
              const Icon = product.icon
              return (
                <Card key={product.title} variant="elevated" className="!p-6">
                  <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
                    {index % 2 === 0 ? (
                      <>
                        <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </Frame>
                        <Stack gap="md">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#406517]" />
                            </div>
                            <Heading level={3}>{product.title}</Heading>
                          </div>
                          <Text className="text-gray-600">{product.description}</Text>
                          <Button variant="primary" asChild className="w-fit">
                            <Link href={product.href}>
                              Learn More
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Stack gap="md">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#406517]" />
                            </div>
                            <Heading level={3}>{product.title}</Heading>
                          </div>
                          <Text className="text-gray-600">{product.description}</Text>
                          <Button variant="primary" asChild className="w-fit">
                            <Link href={product.href}>
                              Learn More
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                        </Stack>
                        <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </Frame>
                      </>
                    )}
                  </Grid>
                </Card>
              )
            })}
          </Stack>
        </HeaderBarSection>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* Not Sure Which Product */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20 text-center">
          <Heading level={3} className="!mb-4">Not Sure Which Product You Need?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
            Talk to our team. We'll help you figure out the best solution for your 
            specific situation - whether that's bug protection, weather protection, 
            or both.
          </Text>
          <Button variant="primary" asChild>
            <Link href="/start-project?mode=planner">
              Talk to a Planner
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
