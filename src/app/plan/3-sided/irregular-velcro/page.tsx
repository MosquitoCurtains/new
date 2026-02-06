'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Layers,
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

export default function ThreeSidedIrregularVelcroPage() {
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
              <span className="px-2 py-1 bg-[#003365]/10 text-[#003365] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              3-Sided Irregular Velcro
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 3-sided space has arches or angles, and you want economical velcro 
              attachment for your custom-shaped panels.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/3-Sided-Irregular-Velcro-Example.jpg"
                alt="3-sided irregular velcro example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Three open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings on some/all sides</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro attachment (economical option)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-shaped panels required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  Custom shapes with velcro is a great way to get perfect-fit panels 
                  while keeping costs down compared to tracking.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Benefits */}
        <HeaderBarSection icon={Layers} label="Why Choose This Configuration?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Cost Effective</Heading>
              <Text className="text-gray-600 !mb-0">
                Custom-shaped panels cost the same as rectangular. Velcro attachment 
                saves over curved tracking systems.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Beautiful Results</Heading>
              <Text className="text-gray-600 !mb-0">
                Panels follow your arches and angles perfectly. Fixed in place, 
                they look clean and intentional.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Planner Recommended */}
        <HeaderBarSection icon={Users} label="Planner Recommended" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Get Expert Help</Heading>
                <Text className="text-gray-600">
                  Irregular shapes require precise measurements. A planning call helps 
                  ensure your panels fit perfectly.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Document each opening's shape</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan panel configurations</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Verify velcro placement</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Get accurate quote</ListItem>
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
