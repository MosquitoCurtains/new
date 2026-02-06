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

export default function TwoSidedIrregularVelcroPage() {
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
              <span className="px-2 py-1 bg-[#003365]/10 text-[#003365] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              2-Sided Irregular Velcro
            </Heading>
            <Text className="text-xl text-gray-600">
              Your 2-sided space has arches, angles, or varying heights, and you prefer 
              the economical velcro attachment option.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Irregular-Velcro-Example.jpg"
                alt="Irregular velcro attachment example"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Two open sides to cover</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro (fixed position, economical)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-shaped panels required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Irregular + Velcro</strong> combines custom panel shapes with 
                  economical velcro attachment. Panels are cut to your exact opening shape.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Benefits */}
        <HeaderBarSection icon={Layers} label="Velcro for Irregular Shapes" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Cost Savings</Heading>
              <Text className="text-gray-600 !mb-0">
                Even with custom-shaped panels, velcro keeps costs down compared to 
                tracking systems that would need to follow curved paths.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Perfect Fit</Heading>
              <Text className="text-gray-600 !mb-0">
                Velcro strips can follow any shape - arches, angles, curves. The attachment 
                conforms perfectly to your opening.
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
                  Irregular shapes need careful measurement and planning. A video call 
                  ensures we capture your exact configuration correctly.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Verify opening shapes</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan panel configurations</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Discuss velcro placement</ListItem>
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
