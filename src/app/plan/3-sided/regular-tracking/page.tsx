'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
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

export default function ThreeSidedRegularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan/3-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to 3-Sided Exposure
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">3-Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Regular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Regular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              The classic screened porch setup - three rectangular sides with sliding 
              track for easy curtain operation.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Regular-Track.jpg"
                alt="3-sided regular tracking configuration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Three open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#406517">Rectangular openings throughout</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking for sliding operation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Most popular configuration</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  This is our most common project type. Thousands of homeowners have enclosed 
                  their standard screened porches with this setup.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Corner Options */}
        <HeaderBarSection icon={SlidersHorizontal} label="Corner Track Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Continuous Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Track runs continuously around all three sides. Curtains can slide 
                around corners for maximum flexibility.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Separate Per Side</Heading>
              <Text className="text-gray-600 !mb-0">
                Each side has independent track. More common and easier to install, 
                with curtains sealing at corner posts.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* DIY Friendly */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Perfect for DIY!</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
            3-sided regular tracking is straightforward enough for DIY but complex 
            enough to benefit from our instant quote tool's guidance.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote">
                Get Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/start-project?mode=planner">
                Talk to a Planner
              </Link>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
