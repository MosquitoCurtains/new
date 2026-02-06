'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Square,
  Ruler,
  Camera,
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

export default function OneSidedPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Square className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              1-Sided Exposure
            </Heading>
            <Text className="text-xl text-gray-600">
              Your space has one open side that needs to be covered. This is the simplest 
              configuration and perfect for DIY installation.
            </Text>
          </Stack>
        </section>

        {/* Overview */}
        <HeaderBarSection icon={Square} label="What Is 1-Sided Exposure?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/1-Sided-Example.jpg"
                alt="1-Sided exposure example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                A 1-sided exposure means your porch, patio, or gazebo has only ONE open side 
                that insects can enter through. The other sides are blocked by walls, screens, 
                or other barriers.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Simplest configuration</ListItem>
                <ListItem variant="checked" iconColor="#406517">Perfect for DIY installation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Most economical option</ListItem>
                <ListItem variant="checked" iconColor="#406517">Quick turnaround</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Common Scenarios */}
        <HeaderBarSection icon={Camera} label="Common 1-Sided Scenarios" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">French Door Entry</Heading>
              <Text className="text-gray-600 !mb-0">
                Covering a single French door or sliding door opening to a patio.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Garage Opening</Heading>
              <Text className="text-gray-600 !mb-0">
                Single garage bay opening for workshop or recreational use.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Carport Entry</Heading>
              <Text className="text-gray-600 !mb-0">
                One open side of a carport for a screened outdoor living space.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How to Measure */}
        <HeaderBarSection icon={Ruler} label="How to Measure" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="How to Measure for 1-Sided"
              variant="card"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                Measuring for a 1-sided project is straightforward. You'll need to capture 
                the width and height of your opening.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Measure width at top and bottom</ListItem>
                <ListItem variant="checked" iconColor="#406517">Measure height at both ends</ListItem>
                <ListItem variant="checked" iconColor="#406517">Note any obstructions</ListItem>
                <ListItem variant="checked" iconColor="#406517">Take photos from inside and outside</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* What You'll Need */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">What's Included in Your Kit</Heading>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">1</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Curtain Panel(s)</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">2</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Track or Velcro</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">3</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Side Seals</Text>
            </Stack>
            <Stack gap="sm" className="text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-2xl font-bold text-[#406517] !mb-0">4</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Hardware & Instructions</Text>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get a Quote?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            1-sided projects are perfect for our instant quote tool. Get pricing in minutes.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan">
                Back to Planning
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
