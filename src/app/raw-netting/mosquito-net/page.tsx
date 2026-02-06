'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Bug,
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

export default function MosquitoNetPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/raw-netting" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Raw Netting
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Bug className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Mosquito Netting
            </Heading>
            <Text className="text-xl text-gray-600">
              Premium mosquito mesh fabric sold by the yard. The same solution-dyed 
              material we use in our professional curtain products.
            </Text>
          </Stack>
        </section>

        {/* Product Info */}
        <HeaderBarSection icon={Bug} label="Product Details" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Roll.jpg"
                alt="Mosquito netting material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our heavy-duty mosquito netting is designed to keep out mosquitoes, gnats, 
                and black flies while allowing air to flow freely through.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">450 denier (super strong)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution-dyed (won't fade)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Blocks mosquitoes, gnats, black flies</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available by the yard or roll</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <HeaderBarSection icon={CheckCircle} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 3, tablet: 3 }} gap="lg" className="max-w-xl mx-auto">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-3" />
              <Heading level={5}>Black</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Most Popular</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>White</Heading>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-[#F5F5DC] border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>Ivory</Heading>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Sizing */}
        <HeaderBarSection icon={Ruler} label="Sizing & Pricing" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center">
              Available in various widths. Contact us for current pricing and availability.
            </Text>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Width</th>
                    <th className="text-left py-3 font-semibold">Common Uses</th>
                    <th className="text-left py-3 font-semibold">Sold As</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">54" Wide</td>
                    <td>Smaller panels, patching</td>
                    <td>By the yard</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">72" Wide</td>
                    <td>Standard panels, most projects</td>
                    <td>By the yard or roll</td>
                  </tr>
                  <tr>
                    <td className="py-3">108" Wide</td>
                    <td>Large panels, fewer seams</td>
                    <td>By the yard or roll</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </HeaderBarSection>

        {/* Common Uses */}
        <HeaderBarSection icon={Bug} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Porch Screens</Heading>
              <Text className="text-xs text-gray-500 !mb-0">DIY screening projects</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Bed Canopies</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Indoor/outdoor sleeping</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Garden Protection</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Keep pests off plants</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Event Tents</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Temporary enclosures</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Order?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing and to place your order for mosquito netting.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting">
                View All Netting
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
