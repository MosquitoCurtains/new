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

export default function ThreeSidedIrregularTrackingPage() {
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
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Irregular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Irregular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 3-sided space has arches, angles, or varying heights, and you want 
              premium tracking for sliding curtain operation.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Irregular-Example.jpg"
                alt="3-sided irregular shape example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Three open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings on some/all sides</ListItem>
                <ListItem variant="checked" iconColor="#003365">Tracking for sliding operation</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-shaped panels and track routing</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  Arched windows, cathedral ceilings, and varying heights require careful 
                  planning to ensure proper fit and function.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Special Considerations */}
        <HeaderBarSection icon={SlidersHorizontal} label="Complex Tracking Solutions" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Curved Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Track can be bent to follow arch contours while maintaining smooth 
                sliding operation.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Multi-Level Track</Heading>
              <Text className="text-gray-600 !mb-0">
                Stepped or angled track installations accommodate varying ceiling heights.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Panels</Heading>
              <Text className="text-gray-600 !mb-0">
                Each panel shaped to match your exact opening. Perfect fit guaranteed.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planner Required */}
        <HeaderBarSection icon={Users} label="Expert Planning Required" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Schedule a Planning Call</Heading>
                <Text className="text-gray-600">
                  3-sided irregular tracking projects have many variables. A video call 
                  ensures we capture everything needed for a perfect result.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Review each side's shape</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan track routing</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Design panel configurations</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Optimize doorway placement</ListItem>
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
