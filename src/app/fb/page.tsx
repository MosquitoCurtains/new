import { Metadata } from 'next'
import Link from 'next/link'
import { Bug, Snowflake, Scissors, ArrowRight } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Heading,
  Card,
  Button,
  Frame,
  FinalCTATemplate,
} from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'Welcome | Mosquito Curtains',
  description: 'Modular enclosure kits custom-made to fit any space. Mosquito Curtains, Clear Vinyl Winter Panels, and Raw Mesh Fabrics.',
}

const PRODUCTS = [
  {
    title: 'Mosquito Curtains',
    description: 'Fabricated Ready-to-Hang Custom Insect Curtains to Screen Patio Enclosures With Easy Installation Kits',
    icon: Bug,
    color: '#406517',
    href: '/screened-porch-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Mosquito-Netting-on-Screen-Porch-1200.jpg',
  },
  {
    title: 'Clear Vinyl Winter Panels',
    description: 'Create a Warm, Cozy Outdoor Weatherproof Space Sheltered From the Wind, Rain & Cold With Easy Installation Kits',
    icon: Snowflake,
    color: '#003365',
    href: '/clear-vinyl',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Clear-Vinyl-Porch-Enclosure-1024x768.jpg',
  },
  {
    title: 'Raw Mesh Fabrics',
    description: 'Mosquito Netting, No-See-Um, Shade Mesh, Industrial Mesh, & Scrim Mesh Fabrics For Any Project',
    icon: Scissors,
    color: '#6B21A8',
    href: '/raw-netting',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Raw-Netting-Fabric-Store-1024x576.jpg',
  },
]

export default function FBLandingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <div className="text-center py-12 md:py-16">
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Welcome to Mosquito Curtains
          </Heading>
          <Text className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
            Modular enclosure kits custom-made to fit any space.
          </Text>
          <Text className="text-[#406517] font-medium text-lg">
            One system, limitless applications.
          </Text>
        </div>

        {/* Product Selection Cards */}
        <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
          {PRODUCTS.map((product) => {
            const Icon = product.icon
            return (
              <Card key={product.title} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <Frame ratio="4/3" className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Frame>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${product.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: product.color }} />
                    </div>
                    <Heading level={3} className="!text-xl !mb-0">
                      {product.title}
                    </Heading>
                  </div>
                  <Text className="text-gray-600 text-sm mb-6">
                    {product.description}
                  </Text>
                  <Button 
                    variant="primary" 
                    asChild 
                    className="w-full"
                    style={{ backgroundColor: product.color }}
                  >
                    <Link href={product.href}>
                      Select
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </Grid>

        {/* Trust Indicators */}
        <div className="text-center py-8">
          <Text className="text-gray-600 text-lg">
            <span className="font-semibold text-[#406517]">92,083+</span> Happy Customers Since 2004
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            Custom-made in the USA | Ships in 1-4 days | Lifetime support
          </Text>
        </div>

        {/* Quick Help */}
        <Card className="p-8 bg-gray-50 text-center">
          <Heading level={3} className="!text-xl !mb-3">
            Not sure which product is right for you?
          </Heading>
          <Text className="text-gray-600 mb-6">
            Our planning team can help you choose the best solution for your space.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Start Your Project
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
