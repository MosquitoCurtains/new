'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  ClipboardList,
  Camera,
  Calculator,
  Phone,
  Package,
  Wrench,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
} from '@/lib/design-system'

const STEPS = [
  {
    number: 1,
    title: 'Take Photos',
    description: 'Photograph each side of your space. Wide shots from outside and inside work best.',
    icon: Camera,
    tips: ['Stand back to capture the entire opening', 'Include ceiling and floor in shots', 'Get shots from multiple angles'],
  },
  {
    number: 2,
    title: 'Choose Your Path',
    description: 'Either get an instant quote online or schedule a call with a planner for complex projects.',
    icon: Calculator,
    tips: ['Simple projects: Use instant quote', 'Complex projects: Talk to a planner', 'Not sure? Start with instant quote'],
  },
  {
    number: 3,
    title: 'Review & Confirm',
    description: 'We\'ll create a detailed plan showing exactly what you\'re getting before you pay.',
    icon: ClipboardList,
    tips: ['Review measurements and quantities', 'Confirm mesh type and color', 'Ask questions if anything is unclear'],
  },
  {
    number: 4,
    title: 'Place Your Order',
    description: 'Once confirmed, place your order. We start manufacturing immediately.',
    icon: Package,
    tips: ['Secure online payment', 'Order confirmation email sent', 'Tracking info when shipped'],
  },
  {
    number: 5,
    title: 'Install Yourself',
    description: 'Your kit arrives with everything needed. Follow our videos for easy DIY installation.',
    icon: Wrench,
    tips: ['Complete kit included', 'Step-by-step video guides', 'Support available if needed'],
  },
]

export default function HowToOrderPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/plan-screen-porch" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planning
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              How To Order
            </Heading>
            <Text className="text-xl text-gray-600">
              Getting your custom mosquito curtains is easy. Here's the step-by-step process 
              from photos to installation.
            </Text>
          </Stack>
        </section>

        {/* Steps */}
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <HeaderBarSection key={step.number} icon={Icon} label={`Step ${step.number}: ${step.title}`} variant="dark">
              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-start">
                <Stack gap="md">
                  <Text className="text-gray-600 text-lg">{step.description}</Text>
                </Stack>
                <Card className="!p-4 !bg-[#406517]/5 !border-[#406517]/20">
                  <Heading level={5} className="!mb-2 !text-[#406517]">Tips</Heading>
                  <BulletedList spacing="sm">
                    {step.tips.map((tip, idx) => (
                      <ListItem key={idx} variant="arrow" iconColor="#406517">{tip}</ListItem>
                    ))}
                  </BulletedList>
                </Card>
              </Grid>
            </HeaderBarSection>
          )
        })}

        {/* Two Paths */}
        <HeaderBarSection icon={Phone} label="Two Ways to Order" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 !border-[#406517] !border-2">
              <div className="absolute -top-3 left-4 bg-[#406517] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <Stack gap="md" className="mt-2">
                <Heading level={3} className="!text-[#406517]">Instant Quote</Heading>
                <Text className="text-gray-600">
                  Perfect for straightforward projects. Get pricing in minutes with our 
                  online quote tool.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#406517">Immediate pricing</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Upload photos online</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Simple, guided process</ListItem>
                </BulletedList>
                <Button variant="primary" asChild className="mt-2">
                  <Link href="/start-project?mode=quote">
                    Get Instant Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Stack>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Stack gap="md">
                <Heading level={3} className="!text-[#003365]">Work With a Planner</Heading>
                <Text className="text-gray-600">
                  Best for complex projects or if you have questions. Schedule a video call 
                  with an expert.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#003365">Expert guidance</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Complex project support</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Video call walkthrough</ListItem>
                </BulletedList>
                <Button variant="outline" asChild className="mt-2">
                  <Link href="/start-project?mode=planner">
                    Schedule a Call
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </Stack>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get Started?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start with photos of your space and we'll guide you through the rest.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/plan-screen-porch">
                Back to Planning
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
