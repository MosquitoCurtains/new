'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal,
  AlertTriangle,
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

export default function TwoSidedIrregularTrackingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan/2-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to 2-Sided Exposure
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">2-Sided</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Irregular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              2-Sided Irregular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 2-sided space has arches, angles, or varying heights, and you want 
              sliding tracking for curtain operation.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Irregular-Example.jpg"
                alt="Irregular shape example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Two open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings</ListItem>
                <ListItem variant="checked" iconColor="#003365">Tracking for side-to-side operation</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom solutions required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Irregular shapes</strong> include arches, peaked ceilings, 
                  varying heights, angled openings, or any non-rectangular configuration.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Special Considerations */}
        <HeaderBarSection icon={SlidersHorizontal} label="Tracking with Irregular Shapes" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Track Follows Shape</Heading>
              <Text className="text-gray-600 !mb-0">
                Our powder-coated aluminum track can be bent and shaped to follow your 
                ceiling contours, including gentle curves and angles.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Panel Shapes</Heading>
              <Text className="text-gray-600 !mb-0">
                Curtain panels are custom-cut to match your exact opening shape. Arched 
                tops, angled bottoms - we can accommodate almost anything.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planner Required */}
        <HeaderBarSection icon={Users} label="Planner Recommended" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Let's Plan This Together</Heading>
                <Text className="text-gray-600">
                  Irregular shapes require careful planning to ensure proper fit. A quick 
                  video call lets us see your exact configuration and design the right solution.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Verify track routing</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan panel shapes</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Ensure proper measurements</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Get accurate pricing</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free consultation. No obligation.
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
