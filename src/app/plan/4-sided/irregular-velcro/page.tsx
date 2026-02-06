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

export default function FourSidedIrregularVelcroPage() {
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
              <span className="px-2 py-1 bg-[#003365]/10 text-[#003365] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              4+ Sided Irregular Velcro
            </Heading>
            <Text className="text-xl text-gray-600">
              Your hexagonal gazebo, octagonal pavilion, or uniquely shaped structure 
              with economical velcro attachment.
            </Text>
          </Stack>
        </section>

        {/* What This Means */}
        <HeaderBarSection icon={AlertTriangle} label="Your Configuration" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Hexagonal-Velcro-Example.jpg"
                alt="Hexagonal structure with velcro"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">4+ open sides (hexagons, octagons, etc.)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Non-rectangular openings or shapes</ListItem>
                <ListItem variant="checked" iconColor="#003365">Velcro attachment (most economical)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Custom-shaped panels required</ListItem>
              </BulletedList>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  Custom shapes with velcro provides the best value for complex structures 
                  where tracking would be extremely expensive.
                </Text>
              </Card>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Best Value */}
        <HeaderBarSection icon={Layers} label="Best Value for Complex Shapes" variant="dark">
          <Card className="!p-6 !bg-green-50 !border-green-200">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="text-center">
              <Stack gap="sm">
                <Heading level={4} className="!text-green-700">Major Cost Savings</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Curved tracking for hexagonal/octagonal shapes is extremely expensive. 
                  Velcro gives you the same coverage for a fraction of the cost.
                </Text>
              </Stack>
              <Stack gap="sm">
                <Heading level={4} className="!text-green-700">Same Quality</Heading>
                <Text className="text-sm text-gray-600 !mb-0">
                  Your custom-shaped panels are identical quality. The only difference 
                  is how they attach - and that saves you money.
                </Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Expert Required */}
        <HeaderBarSection icon={Users} label="Expert Planning Required" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Complex Shapes Need Expert Eyes</Heading>
                <Text className="text-gray-600">
                  Hexagonal, octagonal, and uniquely shaped structures require careful 
                  measurement and panel planning. We'll make sure everything fits perfectly.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="arrow" iconColor="#003365">Document each opening shape</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Plan corner transitions</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Configure entry points</ListItem>
                  <ListItem variant="arrow" iconColor="#003365">Custom panel engineering</ListItem>
                </BulletedList>
              </Stack>
              <div className="text-center p-6 bg-white rounded-xl">
                <Text className="text-sm text-gray-500 mb-4">
                  Free consultation. We love unique projects!
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
