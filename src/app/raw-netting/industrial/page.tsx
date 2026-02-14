'use client'

import Link from 'next/link'
import { ArrowRight, Factory, ShieldCheck, Scissors, Bug } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  TwoColumn,
  Frame,
  Text,
  Button,
  Card,
  Heading,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  RN_HERO_ACTIONS,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

export default function IndustrialMeshPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Industrial Mesh"
          subtitle="Incredibly strong military-overrun industrial mesh. Extremely durable nylon at 9.4 oz/yd2 that can be zip tied on edges. Available in Olive Green. Incredible price point for this quality."
          videoId={VIDEOS.INDUSTRIAL_NETTING}
          videoTitle="Industrial Netting"
          variant="compact"
          actions={RN_HERO_ACTIONS}
        />

        {/* Product Details */}
        <HeaderBarSection icon={Factory} label="Product Details" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/12/Industrial-Mesh-WooCommerce.jpg`}
                alt="Industrial mesh fabric - olive green"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                This incredibly strong industrial mesh is a military overrun that we were able to 
                pick up for a low price. It is extremely durable and can be zip tied on edges. 
                Available in Olive Green only.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Thick extremely durable nylon at 9.4 oz/yd2</ListItem>
                <ListItem variant="checked" iconColor="#406517">Can zip tie on edges</ListItem>
                <ListItem variant="checked" iconColor="#406517">Purchased from military overrun</ListItem>
                <ListItem variant="checked" iconColor="#406517">Incredible price point for quality</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available in Olive Green only</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Feature Image */}
        <HeaderBarSection icon={Factory} label="Industrial Mesh Views" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3} className="!mb-2">Excellent Visibility</Heading>
              <Text className="text-gray-600">
                Despite its incredible strength, industrial mesh maintains good visibility. 
                Looking in from outside provides privacy, while looking out from inside gives 
                clear visibility -- similar to our shade mesh properties.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2024/02/Industrial-Mesh-Looking-In-1200-2.jpg`}
                alt="Industrial mesh - looking in view"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* Pricing */}
        <HeaderBarSection icon={Scissors} label="Sizing & Pricing" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              Industrial mesh is 65 inches wide. Available by the linear foot or by the full roll 
              at a significant discount.
            </Text>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#406517] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Purchase Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Roll Width</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 font-medium">By the Foot</td>
                    <td className="px-4 py-3">65-inch roll</td>
                    <td className="px-4 py-3 text-[#406517] font-bold">$4.00 / ft</td>
                    <td className="px-4 py-3 text-gray-600">20ft x $4.00 = $80.00</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Full Roll</td>
                    <td className="px-4 py-3">65" x 330ft</td>
                    <td className="px-4 py-3 text-[#406517] font-bold">$1,350.00</td>
                    <td className="px-4 py-3 text-gray-600">~$4.09/ft (330ft roll)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center pt-2">
              <Button variant="primary" asChild>
                <Link href="/order/raw-netting">
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Industrial Applications */}
        <HeaderBarSection icon={Factory} label="Industrial Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="outlined" className="!p-5">
              <Heading level={4} className="!mb-3">Agriculture & Environment</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Crop protection / bird exclusion</ListItem>
                <ListItem variant="checked" iconColor="#406517">Greenhouse screens</ListItem>
                <ListItem variant="checked" iconColor="#406517">Entomology experiments & insectaries</ListItem>
                <ListItem variant="checked" iconColor="#406517">Screens to dry crops</ListItem>
                <ListItem variant="checked" iconColor="#406517">Vat covers for wineries</ListItem>
              </BulletedList>
            </Card>
            <Card variant="outlined" className="!p-5">
              <Heading level={4} className="!mb-3">Commercial & Industrial</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Loading dock screens</ListItem>
                <ListItem variant="checked" iconColor="#406517">Warehouse insect segregation (Health Dept)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Construction debris netting</ListItem>
                <ListItem variant="checked" iconColor="#406517">Personal fall protection</ListItem>
                <ListItem variant="checked" iconColor="#406517">HVAC pre-filters for cottonwood/pollen</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Bulk Pricing CTA */}
        <HeaderBarSection icon={ShieldCheck} label="Bulk & Commercial Orders" variant="dark">
          <div className="text-center py-4">
            <Text className="text-gray-600 max-w-2xl mx-auto mb-4">
              Need large quantities or have a custom industrial application? Contact us directly 
              for bulk pricing and custom solutions. We've done everything from 500' warehouse 
              screens to custom military applications.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/contact">
                  Contact Us for Bulk Pricing <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/industrial-netting">
                  See Industrial Solutions
                </Link>
              </Button>
            </div>
          </div>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Factory} label="Industrial Netting Video" variant="dark">
          <div className="max-w-2xl mx-auto">
            <YouTubeEmbed videoId={VIDEOS.INDUSTRIAL_NETTING} title="Industrial Netting" variant="card" />
          </div>
        </HeaderBarSection>

        {/* Quick Links */}
        <HeaderBarSection icon={Bug} label="Raw Netting Store Quick Links" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/order-mesh-netting-fabrics" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">1. See All Meshes</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Several Mesh Types & Colors</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/rigging" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">2. Rigging Ideas</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Helpful Ideas & Attachment Items</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/custom" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">3. Let Us Make It</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Ready to Hang Custom Panels</Text>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        <FinalCTATemplate productLine="rn" />

      </Stack>
    </Container>
  )
}
