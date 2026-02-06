'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Sun,
  Ruler,
  CheckCircle,
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

export default function ShadeMeshPage() {
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
              <Sun className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Shade Screen Mesh
            </Heading>
            <Text className="text-xl text-gray-600">
              Multi-purpose shade fabric that provides sun protection, privacy, and 
              insect blocking all in one material.
            </Text>
          </Stack>
        </section>

        {/* Product Info */}
        <HeaderBarSection icon={Sun} label="Product Details" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Mesh.jpg"
                alt="Shade mesh material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Shade mesh is a denser weave than standard mosquito netting. It blocks 
                a significant amount of sunlight while still allowing air to flow and 
                keeping insects out.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Blocks harsh sunlight</ListItem>
                <ListItem variant="checked" iconColor="#406517">Provides privacy</ListItem>
                <ListItem variant="checked" iconColor="#406517">Still blocks insects</ListItem>
                <ListItem variant="checked" iconColor="#406517">Allows airflow</ListItem>
                <ListItem variant="checked" iconColor="#406517">UV resistant</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Shade Levels */}
        <HeaderBarSection icon={CheckCircle} label="Shade Levels Available" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">50%</span>
              </div>
              <Heading level={5}>50% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Moderate shade while maintaining good visibility and airflow.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">70%</span>
              </div>
              <Heading level={5}>70% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Good balance of shade and visibility. Most popular option.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">90%</span>
              </div>
              <Heading level={5}>90% Shade</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Maximum shade and privacy. Ideal for full sun exposure.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Colors */}
        <HeaderBarSection icon={Sun} label="Available Colors" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="lg" className="max-w-md mx-auto">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-3" />
              <Heading level={5}>Black</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Maximum heat absorption</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-full mx-auto mb-3" />
              <Heading level={5}>White</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Reflects heat</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={Sun} label="Common Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Patios</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Sun-exposed areas</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Greenhouses</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Plant protection</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Carports</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Vehicle shade</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Pool Areas</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Privacy + shade</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Shade Mesh Videos" variant="dark">
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
          <Heading level={2} className="!mb-4">Need Shade Mesh?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing and availability on shade screen mesh.
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
