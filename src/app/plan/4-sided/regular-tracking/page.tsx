'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle,
  Users,
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

export default function FourSidedRegularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan/4-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to 4+ Sided Exposure
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">4+ Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Regular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              4+ Sided Regular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your freestanding structure has 4 or more rectangular sides, and you want 
              premium tracking for sliding curtain operation.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/4-Sided-Regular-Track.jpg"
                alt="4-sided regular tracking configuration"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Four or more open sides</ListItem>
                <ListItem variant="checked" iconColor="#406517">Rectangular openings (no arches)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Tracking for sliding operation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Premium gazebo/pergola setup</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  With 4+ sides all needing track, this is a more complex project that 
                  benefits from expert planning.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Track Options */}
        <HeaderBarSection icon={SlidersHorizontal} label="Track Configuration Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Full Wrap Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Continuous track around all sides. Curtains can slide freely around 
                the entire perimeter. Maximum flexibility.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Independent Side Tracks</Heading>
              <Text className="text-gray-600 !mb-0">
                Each side has separate track. Easier installation and allows different 
                opening configurations per side.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planner Recommended */}
        <HeaderBarSection icon={Users} label="Planner Strongly Recommended" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Expert Planning Saves Time</Heading>
                <Text className="text-gray-600">
                  4+ sided tracking projects have many decisions: track routing, corner 
                  transitions, doorway placement, panel configurations. Let us help.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Optimize track routing</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan corner connections</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Configure entry points</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Verify measurements</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free 15-minute planning call. No obligation.
                </Text>
                <Button variant="primary" asChild>
                  <Link href="/start-project?mode=planner">
                    Schedule Planning Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
