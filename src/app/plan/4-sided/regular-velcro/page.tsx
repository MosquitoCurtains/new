'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Layers,
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

export default function FourSidedRegularVelcroPage() {
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
              <span className="px-2 py-1 bg-[#003365]/10 text-[#003365] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              4+ Sided Regular Velcro
            </Heading>
            <Text className="text-xl text-gray-600">
              A budget-friendly way to enclose your 4-sided gazebo or pergola with 
              fixed velcro-attached curtains.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={CheckCircle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/4-Sided-Velcro-Example.jpg"
                alt="4-sided velcro attachment example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Four or more open sides</ListItem>
                <ListItem variant="checked" iconColor="#003365">Rectangular openings</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro attachment (fixed position)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Most economical 4-sided option</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-[#003365]/5 !border-[#003365]/20">
                <Text className="text-sm text-gray-600 !mb-0">
                  Velcro-attached curtains provide full coverage at a lower cost than 
                  tracking systems. Perfect for seasonal use.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Why Velcro for 4-Sided */}
        <HeaderBarSection icon={Layers} label="Why Choose Velcro?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">Significant Savings</Heading>
              <Text className="text-gray-600 !mb-0">
                With 4+ sides, the cost savings of velcro over tracking really adds up.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">Easier Installation</Heading>
              <Text className="text-gray-600 !mb-0">
                No track mounting around all 4+ corners. Adhesive velcro is straightforward.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">Seasonal Flexibility</Heading>
              <Text className="text-gray-600 !mb-0">
                Remove curtains easily for winter. Reinstall in spring.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planning Call Still Recommended */}
        <HeaderBarSection icon={Users} label="Planning Call Recommended" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Even Simple Projects Benefit</Heading>
                <Text className="text-gray-600">
                  While velcro is simpler than tracking, 4-sided projects still have 
                  multiple corners and decisions. A quick call ensures everything is planned correctly.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Verify corner sealing approach</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan doorway locations</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Confirm measurements</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Get accurate pricing</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  15 minutes now saves hours later.
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
