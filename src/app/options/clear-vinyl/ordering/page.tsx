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
, Info} from 'lucide-react'
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
, Frame, TwoColumn} from '@/lib/design-system'

const STEPS = [
  {
    number: 1,
    title: 'Take Photos',
    description: 'Photograph each opening you want enclosed. Wide shots from outside and inside work best.',
    icon: Camera,
    tips: ['Include ceiling and floor', 'Show corner details', 'Capture existing hardware'],
  },
  {
    number: 2,
    title: 'Get Your Quote',
    description: 'Use our instant quote tool or schedule a call with a planner for guidance.',
    icon: Calculator,
    tips: ['Upload your photos', 'Select apron color', 'Review pricing instantly'],
  },
  {
    number: 3,
    title: 'Confirm Details',
    description: 'We\'ll create a detailed plan showing exactly what you\'re getting before you pay.',
    icon: ClipboardList,
    tips: ['Review panel layouts', 'Confirm measurements', 'Ask any questions'],
  },
  {
    number: 4,
    title: 'Place Your Order',
    description: 'Once confirmed, place your order. We begin custom manufacturing immediately.',
    icon: Package,
    tips: ['Secure checkout', 'Order confirmation emailed', 'Tracking provided'],
  },
  {
    number: 5,
    title: 'Install Yourself',
    description: 'Your complete kit arrives with everything needed. Follow our guides for easy installation.',
    icon: Wrench,
    tips: ['Complete hardware included', 'Video installation guides', 'Support if needed'],
  },
]

export default function OrderingClearVinylPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Ordering Clear Vinyl Enclosures
            </Heading>
            <Text className="text-xl text-gray-600">
              Getting your custom clear vinyl is simple. Here's the step-by-step process 
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
                <Card className="!p-4 !bg-[#003365]/5 !border-[#003365]/20">
                  <Text className="font-semibold text-[#003365] !mb-2">Tips</Text>
                  <BulletedList spacing="sm">
                    {step.tips.map((tip, idx) => (
                      <ListItem key={idx} variant="arrow" iconColor="#003365">{tip}</ListItem>
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
            <Card variant="elevated" className="!p-6 !border-[#406517] !border-2 relative">
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
                  <ListItem variant="checked" iconColor="#406517">Select your options</ListItem>
                </BulletedList>
                <Button variant="primary" asChild className="mt-2">
                  <Link href="/start-project?mode=quote&product=clear_vinyl">
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
                  <ListItem variant="checked" iconColor="#003365">Video walkthrough</ListItem>
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

        {/* Timeline */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-6 text-center">Typical Timeline</Heading>
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="text-center">
            <Stack gap="sm">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-xl font-bold text-[#406517] !mb-0">1</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Day 1</Text>
              <Text className="text-xs text-gray-500 !mb-0">Submit photos & order</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-xl font-bold text-[#406517] !mb-0">2-5</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Days 2-5</Text>
              <Text className="text-xs text-gray-500 !mb-0">Custom manufacturing</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-xl font-bold text-[#406517] !mb-0">6-8</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Days 6-8</Text>
              <Text className="text-xs text-gray-500 !mb-0">Shipping</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <Text className="text-xl font-bold text-[#406517] !mb-0">9+</Text>
              </div>
              <Text className="text-sm font-medium !mb-0">Day 9+</Text>
              <Text className="text-xs text-gray-500 !mb-0">You install!</Text>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get Started?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start with photos of your space and we'll guide you through the rest.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Start Your Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Ordering Clear Vinyl Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/kurt-square-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/05/Matt-Rier-New-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/10/Heather-1-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/07/John-Hubay-New-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/08/Iryna-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/06/Patrick-Jordan-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/07/Dan-McClaskey-150x150.jpg"
                  alt="Ordering Clear Vinyl"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Get Started Fast With a Real Person!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are happy to help you plan your project with a quick planning session. For maximum speed and efficiency, photos of your space are extremely helpful. Click the buttons below to see photo guidelines. If you have a general question, call us at 866-622-0916.</Text>
              <BulletedList>
                <li>Please provide 2-4 high resolution photos that show all complete sides of your project.</li>
                <li>Step BACK and zoom OUT so we can see as much as possible. No close-ups.</li>
                <li>Large file sizes – Small images do not provide enough resolution for planning sessions.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Good Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? We can see each full side with fastening surfaces in each high resolution photo.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                alt="Good Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Bad Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? They are too close up so we can’t see ALL fastening surfaces and corner transitions.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                alt="Bad Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Toll Free: (866) 622-0916" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">When you call, our FIRST question will be, “Have you sent photos?”</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="The Planning Team" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Aaron Gorecki

Kurt Jordan

Matt Rier

Heather Evans

John Hubay

Iryna Mardanova

Patrick Jordan

Dan McCaskey
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Aaron-150x150.jpg"
                alt="The Planning Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Need help before submitting photos?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are here to help. Give us a call and one of our planners will gladly assist you.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
