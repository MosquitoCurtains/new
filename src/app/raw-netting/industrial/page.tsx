'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Factory,
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

export default function IndustrialMeshPage() {
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
              <Factory className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Industrial Mesh
            </Heading>
            <Text className="text-xl text-gray-600">
              Heavy-duty netting for agricultural, industrial, and commercial applications. 
              Built tough for demanding environments.
            </Text>
          </Stack>
        </section>

        {/* Product Info */}
        <HeaderBarSection icon={Factory} label="Product Details" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Industrial-Mesh.jpg"
                alt="Industrial mesh material"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our industrial-grade mesh is designed for heavy-duty applications where 
                standard netting won't hold up. Reinforced construction and UV-stabilized 
                materials ensure long-term performance.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Heavy-duty construction</ListItem>
                <ListItem variant="checked" iconColor="#003365">UV stabilized for outdoor use</ListItem>
                <ListItem variant="checked" iconColor="#003365">Available in various mesh sizes</ListItem>
                <ListItem variant="checked" iconColor="#003365">Bulk quantities available</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Applications */}
        <HeaderBarSection icon={CheckCircle} label="Industrial Applications" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Agriculture</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Crop protection</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Bird exclusion</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Greenhouse screening</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Livestock protection</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Commercial</Heading>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#003365">Loading dock screens</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Warehouse pest control</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Construction barriers</ListItem>
                <ListItem variant="arrow" iconColor="#003365">Industrial enclosures</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Bulk Pricing */}
        <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
          <Heading level={3} className="!mb-4 text-center">Bulk & Commercial Pricing</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-4">
            We offer competitive pricing for large-scale and ongoing commercial needs. 
            Contact us to discuss your specific requirements and get volume pricing.
          </Text>
          <div className="flex justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Request Commercial Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Videos */}
        <HeaderBarSection icon={Play} label="Industrial Netting Videos" variant="dark">
          <div className="max-w-2xl mx-auto">
            <YouTubeEmbed
              videoId={VIDEOS.INDUSTRIAL_NETTING}
              title="Industrial Netting"
              variant="card"
            />
            <Text className="text-center mt-2 font-medium text-sm">Industrial Netting</Text>
          </div>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Industrial Netting Needs?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing on industrial mesh and bulk orders.
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
