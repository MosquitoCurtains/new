'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Users,
  Compass,
  CheckCircle,
  Star,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Button,
  Card,
  Heading,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

const PLANNER_BENEFITS = [
  'Help is complimentary, no extra cost',
  'We have done this over 100,000 times',
  'We use screen sharing software to assist',
  'Our planners are not pushy, just helpful',
  'We provide a custom shopping cart',
]

const SELF_PLAN_POINTS = [
  'Web pages provide planning tips',
  'Pages provide configuration ideas',
  'You perform your own calculations',
  'You make your own panel adjustments',
  'You prepare your own cart and order online',
]

export default function ProjectPlanningPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="md" className="max-w-3xl mx-auto">
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Planning Your Project
            </Heading>
            <Text className="text-xl text-gray-600">
              Choose the option that works best for you. Most customers prefer working
              with one of our experienced planners.
            </Text>
          </Stack>
        </section>

        {/* ================================================================
            TWO OPTIONS
            ================================================================ */}
        <HeaderBarSection icon={Star} label="Choose Your Path" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">

            {/* Option 1: Planner Assistance (Recommended) */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-[#406517] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                  Easiest
                </span>
              </div>
              <Card variant="elevated" className="!p-8 h-full transition-all hover:shadow-xl" style={{ borderColor: '#406517', borderWidth: '2px' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-[#406517]" />
                  </div>
                  <Heading level={3} className="!mb-2">Planner Assistance</Heading>
                  <Text className="text-[#406517] font-semibold !mb-0">
                    This is the easiest option!
                  </Text>
                </div>

                <ul className="space-y-3 mb-8">
                  {PLANNER_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#406517] flex-shrink-0 mt-0.5" />
                      <Text className="!mb-0 text-gray-700">{benefit}</Text>
                    </li>
                  ))}
                </ul>

                <Button variant="primary" size="lg" className="w-full" asChild>
                  <Link href="/work-with-a-planner">
                    Get Started Fast With a Planner
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </Card>
            </div>

            {/* Option 2: Plan Your Own Project */}
            <Card variant="elevated" className="!p-8 h-full transition-all hover:shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-[#003365]" />
                </div>
                <Heading level={3} className="!mb-2">Plan Your Own Project</Heading>
                <Text className="text-gray-500 !mb-0">
                  This requires more work on your part.
                </Text>
              </div>

              <ul className="space-y-3 mb-8">
                {SELF_PLAN_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-[#003365] flex-shrink-0 mt-0.5" />
                    <Text className="!mb-0 text-gray-700">{point}</Text>
                  </li>
                ))}
              </ul>

              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/plan-screen-porch">
                  Visit The Planning Section
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </Card>

          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
