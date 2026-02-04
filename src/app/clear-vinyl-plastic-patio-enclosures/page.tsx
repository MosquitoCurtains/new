'use client'

import { ProductPageTemplate } from '@/lib/design-system/templates'
import Link from 'next/link'
import { ArrowRight, Snowflake, Sun, Repeat } from 'lucide-react'
import { 
  Stack, 
  Grid, 
  Card, 
  Heading, 
  Text, 
  Button, 
  TwoColumn, 
  YouTubeEmbed,
  BulletedList,
  ListItem,
  FeatureCard,
} from '@/lib/design-system'

// Features unique to Clear Vinyl
const CLEAR_VINYL_FEATURES = [
  {
    icon: Snowflake,
    title: 'Winter Protection',
    description: 'Block wind, rain & cold',
    color: '#003365',
  },
  {
    icon: Sun,
    title: 'Let Light In',
    description: 'Crystal clear visibility',
    color: '#FFA501',
  },
  {
    icon: Repeat,
    title: 'Interchangeable',
    description: 'Swap with mosquito curtains',
    color: '#406517',
  },
]

const BENEFITS = [
  'Double-polished marine-grade vinyl',
  'Crystal clear visibility - not cloudy or yellow',
  'Blocks wind, rain, and cold temperatures',
  'Interchangeable with mosquito curtain panels',
  'Custom-made to your exact measurements',
  'Easy DIY installation',
  'Use your patio year-round',
]

export default function ClearVinylPage() {
  return (
    <ProductPageTemplate
      title="Clear Vinyl Winter Panels"
      subtitle="Patio Weather Enclosures"
      description="Create a warm, cozy outdoor weatherproof space sheltered from wind, rain & cold. Our marine-grade vinyl panels are crystal clear and interchangeable with our mosquito curtains for year-round use."
      overviewVideoId="ca6GufadXoE"
      projectTypes={[]}
      features={CLEAR_VINYL_FEATURES}
      benefits={BENEFITS}
      showSaleBanner={true}
      saleText="10% Off Sale until Feb 14th - Code: MIDWINTER26"
    >
      {/* Restaurant Patios Section */}
      <section>
        <div className="bg-white border-2 border-[#003365]/20 rounded-3xl overflow-hidden">
          <div className="bg-[#003365] px-6 py-4">
            <span className="text-white font-semibold text-lg uppercase tracking-wider">
              Restaurant & Commercial
            </span>
          </div>
          <div className="p-6 md:p-10">
            <TwoColumn gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={2}>Restaurant Patio Enclosures</Heading>
                <Text className="text-gray-600">
                  You may have seen these clear vinyl panels in restaurants to create warm patio 
                  weather enclosures. Made from thick, double-polished marine grade vinyl, these 
                  outdoor plastic panels will keep your customers warm and dry during colder months.
                </Text>
                <Text className="text-gray-600">
                  Perfect for restaurants, bars, cafes, and any commercial space looking to extend 
                  outdoor seating into the cooler seasons.
                </Text>
                <div className="pt-2">
                  <Button variant="secondary" asChild>
                    <Link href="/contact">
                      Contact for Commercial Quote
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Stack>
              <YouTubeEmbed
                videoId="ca6GufadXoE"
                title="Clear Vinyl Description"
                variant="card"
              />
            </TwoColumn>
          </div>
        </div>
      </section>

      {/* Interchangeable System Section */}
      <section>
        <div className="bg-gradient-to-br from-[#406517]/5 to-[#003365]/5 border-2 border-[#406517]/20 rounded-3xl p-6 md:p-10">
          <div className="text-center mb-8">
            <Heading level={2} className="!mb-2">Summer & Winter Interchangeable System</Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto">
              Our mosquito netting curtains are interchangeable with our clear vinyl panels so you can 
              enjoy your patio in all seasons.
            </Text>
          </div>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-[#FFA501]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sun className="w-8 h-8 text-[#FFA501]" />
              </div>
              <Heading level={3} className="!mb-2">Summer: Mosquito Curtains</Heading>
              <Text className="text-gray-600">
                Keep bugs out while enjoying fresh air and breezes. Perfect for warm weather outdoor living.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Snowflake className="w-8 h-8 text-[#003365]" />
              </div>
              <Heading level={3} className="!mb-2">Winter: Clear Vinyl Panels</Heading>
              <Text className="text-gray-600">
                Block wind, rain, and cold while still enjoying your view. Use your patio year-round.
              </Text>
            </Card>
          </Grid>
          <div className="flex justify-center pt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </ProductPageTemplate>
  )
}
