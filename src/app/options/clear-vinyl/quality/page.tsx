'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Award,
  Shield,
  Sun,
  Ruler,
  CheckCircle,
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
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

export default function ClearVinylQualityPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Award className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              What Makes Our Clear Vinyl Better
            </Heading>
            <Text className="text-xl text-gray-600">
              Not all clear vinyl is created equal. Here's what sets our marine-grade 
              product apart from the competition.
            </Text>
          </Stack>
        </section>

        {/* The Vinyl */}
        <HeaderBarSection icon={Shield} label="Premium 30-Gauge Marine Vinyl" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Premium-Vinyl.jpg"
                alt="Premium marine vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We use only premium 30-gauge marine-grade clear vinyl. This is the same 
                material used on high-end boats and yachts - designed to withstand harsh 
                outdoor conditions year after year.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">30-gauge thickness (thicker than most competitors)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Crystal clear optical quality</ListItem>
                <ListItem variant="checked" iconColor="#406517">Flexible in cold weather</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine-grade durability</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* UV Protection */}
        <HeaderBarSection icon={Sun} label="UV Inhibitors" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Cheap vinyl yellows and clouds quickly when exposed to sunlight. Our vinyl 
                contains UV inhibitors that:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Prevent yellowing over time</ListItem>
                <ListItem variant="checked" iconColor="#406517">Maintain crystal clarity for years</ListItem>
                <ListItem variant="checked" iconColor="#406517">Protect against UV degradation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Extend product lifespan significantly</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/UV-Protection.jpg"
                alt="UV protected vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Sunbrella Borders */}
        <HeaderBarSection icon={Ruler} label="Sunbrella Fabric Borders" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Sunbrella-Border.jpg"
                alt="Sunbrella fabric border"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our clear vinyl panels are bordered with genuine Sunbrella marine fabric - 
                the same material used in awnings and marine applications worldwide.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Genuine Sunbrella brand fabric</ListItem>
                <ListItem variant="checked" iconColor="#406517">Fade-resistant colors</ListItem>
                <ListItem variant="checked" iconColor="#406517">Water and mildew resistant</ListItem>
                <ListItem variant="checked" iconColor="#406517">Professional finished appearance</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Hardware */}
        <HeaderBarSection icon={CheckCircle} label="Marine-Grade Hardware" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">YKK Zippers</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                The world's most trusted zipper brand. Marine-rated for salt and moisture resistance.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">Stainless Steel</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                All metal components are stainless steel - no rust, no corrosion, no failure.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">DOT Snaps</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Industrial-grade DOT snaps rated for marine use. Same as used on boat covers.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Comparison */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-6 text-center">Our Quality vs. Discount Alternatives</Heading>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Feature</th>
                  <th className="text-center py-3 font-semibold text-[#406517]">Mosquito Curtains</th>
                  <th className="text-center py-3 font-semibold text-gray-400">Discount Brands</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Vinyl Thickness</td>
                  <td className="text-center text-[#406517] font-medium">30 Gauge</td>
                  <td className="text-center text-gray-400">12-20 Gauge</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">UV Inhibitors</td>
                  <td className="text-center text-[#406517] font-medium">Yes</td>
                  <td className="text-center text-gray-400">Rarely</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Border Fabric</td>
                  <td className="text-center text-[#406517] font-medium">Sunbrella</td>
                  <td className="text-center text-gray-400">Generic polyester</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Zippers</td>
                  <td className="text-center text-[#406517] font-medium">YKK Marine</td>
                  <td className="text-center text-gray-400">Generic plastic</td>
                </tr>
                <tr>
                  <td className="py-3">Expected Lifespan</td>
                  <td className="text-center text-[#406517] font-medium">10+ Years</td>
                  <td className="text-center text-gray-400">2-3 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Experience the Difference</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Quality costs a little more upfront but saves money in the long run. Get a 
            quote for premium clear vinyl that will last.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get Clear Vinyl Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
