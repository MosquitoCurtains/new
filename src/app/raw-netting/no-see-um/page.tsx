'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Bug,
  Ruler,
  AlertCircle,
  Play,
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
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function NoSeeUmPage() {
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
            <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Bug className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              No-See-Um Netting
            </Heading>
            <Text className="text-xl text-gray-600">
              Finer mesh designed to block tiny biting midges (no-see-ums) that regular 
              mosquito netting can't stop.
            </Text>
          </Stack>
        </section>

        {/* Why No-See-Um */}
        <HeaderBarSection icon={AlertCircle} label="When You Need No-See-Um Mesh" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/No-See-Um-Mesh.jpg"
                alt="No-see-um netting material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Important:</strong> If you live near salt marshes, beaches, or 
                  coastal areas, regular mosquito mesh may NOT protect you from no-see-ums 
                  (also called midges, sand flies, or punkies).
                </Text>
              </Card>
              <Text className="text-gray-600">
                No-see-ums are tiny biting flies that can pass through standard mosquito 
                mesh. Our no-see-um mesh has a tighter weave specifically designed to 
                block these pests.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Tighter weave than mosquito mesh</ListItem>
                <ListItem variant="checked" iconColor="#003365">Blocks no-see-ums and midges</ListItem>
                <ListItem variant="checked" iconColor="#003365">Essential for coastal areas</ListItem>
                <ListItem variant="checked" iconColor="#003365">Slightly reduces airflow (worth it!)</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <HeaderBarSection icon={Bug} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="lg" className="max-w-md mx-auto">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-3" />
              <Heading level={5}>Black</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Better visibility</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>White</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Classic look</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Sizing */}
        <HeaderBarSection icon={Ruler} label="Sizing & Ordering" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-4 text-center">
              Available by the yard in various widths. Contact us for current pricing.
            </Text>
            <BulletedList spacing="sm" className="max-w-md mx-auto">
              <ListItem variant="arrow" iconColor="#003365">54" wide - by the yard</ListItem>
              <ListItem variant="arrow" iconColor="#003365">72" wide - by the yard or roll</ListItem>
              <ListItem variant="arrow" iconColor="#003365">Custom widths available for large orders</ListItem>
            </BulletedList>
          </Card>
        </HeaderBarSection>

        {/* Geographic Areas */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Common No-See-Um Areas</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-4">
            If you live in or near any of these areas, consider no-see-um mesh:
          </Text>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap-md className="text-center">
            <Text className="!mb-0 font-medium">Florida Gulf Coast</Text>
            <Text className="!mb-0 font-medium">Carolinas Coast</Text>
            <Text className="!mb-0 font-medium">Chesapeake Bay</Text>
            <Text className="!mb-0 font-medium">New England Shore</Text>
            <Text className="!mb-0 font-medium">Any Salt Marsh</Text>
            <Text className="!mb-0 font-medium">Beach Communities</Text>
            <Text className="!mb-0 font-medium">Bayous & Wetlands</Text>
            <Text className="!mb-0 font-medium">Lake Properties</Text>
          </Grid>
        </Card>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="No-See-Um Netting Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING}
                title="Raw Netting Overview"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Raw Netting Overview</Text>
            </div>
            <div>
              <YouTubeEmbed
                videoId={VIDEOS.RAW_NETTING_FABRIC}
                title="Raw Netting Fabric Types"
                variant="card"
              />
              <Text className="text-center mt-2 font-medium text-sm">Raw Netting Fabric Types</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need No-See-Um Protection?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing and to place your order.
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
