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

export default function FourSidedIrregularTrackingPage() {
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
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Irregular Shape</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Tracking</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              4+ Sided Irregular Tracking
            </Heading>
            <Text className="text-xl text-gray-600">
              Your freestanding structure has arches, hexagonal shape, or varying heights, 
              and you want premium tracking for the ultimate sliding curtain experience.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Complex Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Hexagonal-Gazebo-Example.jpg"
                alt="Hexagonal gazebo with tracking"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">4+ open sides (hexagons, octagons, etc.)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings or shapes</ListItem>
                <ListItem variant="checked" iconColor="#003365">Premium tracking system</ListItem>
                <ListItem variant="checked" iconColor="#003365">Highly custom engineering required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  This is our most complex configuration. Expert planning is essential 
                  to ensure a beautiful, functional result.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Challenges */}
        <HeaderBarSection icon={SlidersHorizontal} label="What Makes This Complex?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Angle Transitions</Heading>
              <Text className="text-gray-600 !mb-0">
                Hexagonal and octagonal shapes require precise track angles at each corner.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Custom Panels</Heading>
              <Text className="text-gray-600 !mb-0">
                Each panel must be shaped to match the exact opening geometry.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Height Variations</Heading>
              <Text className="text-gray-600 !mb-0">
                Peaked roofs and varying heights require multi-level track solutions.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Expert Required */}
        <HeaderBarSection icon={Users} label="Expert Planning Required" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">We've Done This Before</Heading>
                <Text className="text-gray-600">
                  Our team has enclosed countless hexagonal gazebos, octagonal pavilions, 
                  and uniquely shaped structures. We know what works.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Detailed video walkthrough</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Custom engineering plan</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Precise measurements</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Installation guidance</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free consultation. Complex doesn't mean expensive.
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
