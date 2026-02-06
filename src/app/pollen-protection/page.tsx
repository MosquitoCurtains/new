'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Flower2,
  Shield,
  Heart,
  Thermometer,
  MessageSquare,
  Calculator,
  Hammer,
  Sun,
  Wind,
  Sparkles,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  Card,
  Heading,
} from '@/lib/design-system'
import type { PowerHeaderAction } from '@/lib/design-system/templates/PowerHeaderTemplate'

// Benefits
const BENEFITS = [
  {
    icon: Heart,
    title: 'Breathe Easy',
    description: 'Enjoy outdoor spaces during allergy season without the sneezing.',
  },
  {
    icon: Shield,
    title: 'Protect Furniture',
    description: 'Keep pollen dust off your outdoor furniture and cushions.',
  },
  {
    icon: Sparkles,
    title: 'Easy Cleaning',
    description: 'Simply hose down panels to remove accumulated pollen.',
  },
  {
    icon: Sun,
    title: 'Enjoy Spring',
    description: 'Reclaim your porch during the most beautiful time of year.',
  },
]

export default function PollenProtectionPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <div className="text-center py-12 md:py-16 bg-gradient-to-b from-[#406517]/5 to-transparent rounded-3xl">
          <div className="inline-flex items-center gap-2 bg-white text-[#406517] text-sm px-4 py-2 rounded-full mb-4 shadow-sm">
            <Flower2 className="w-4 h-4" />
            <span>Allergy Season Solution</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Pollen Protection
          </Heading>
          <Text className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Keep your outdoor space clean and allergen-free with custom screen enclosures. 
            Enjoy your porch during spring without the sneezing.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </div>

        {/* ================================================================
            THE PROBLEM
            ================================================================ */}
        <HeaderBarSection icon={Wind} label="The Pollen Problem" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600 text-lg">
                Every spring, pollen season turns your outdoor living space into an allergy nightmare.
              </Text>
              <Text className="text-gray-600">
                Yellow dust coats everything - your furniture, your floors, even your drinks. For allergy sufferers, 
                it means staying indoors during the most beautiful time of year.
              </Text>
              <Text className="text-gray-600">
                But it doesn&apos;t have to be this way. Our enclosure solutions can dramatically reduce pollen exposure 
                while still letting you enjoy the fresh air.
              </Text>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Screen-Porch-Enclosure-1024x768.jpg"
                alt="Protected porch enclosure"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            OUR SOLUTIONS
            ================================================================ */}
        <HeaderBarSection icon={Shield} label="Our Pollen Protection Solutions" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card className="p-6 border-2 border-[#003365]/20 hover:border-[#003365]/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#003365]/10 rounded-xl flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-[#003365]" />
                </div>
                <div>
                  <Heading level={3} className="!text-xl !mb-1">Clear Vinyl Panels</Heading>
                  <Text className="text-sm text-gray-500">Complete Pollen Block</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-4">
                Clear vinyl panels create a complete barrier against pollen while maintaining visibility and airflow 
                when vents are open. Perfect for severe allergy sufferers.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">100% pollen barrier</ListItem>
                <ListItem variant="checked" iconColor="#003365">Maintains outdoor feel</ListItem>
                <ListItem variant="checked" iconColor="#003365">Weather protection bonus</ListItem>
              </BulletedList>
              <Button variant="secondary" asChild className="w-full mt-4">
                <Link href="/clear-vinyl">
                  Learn About Clear Vinyl
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
            <Card className="p-6 border-2 border-[#406517]/20 hover:border-[#406517]/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-[#406517]" />
                </div>
                <div>
                  <Heading level={3} className="!text-xl !mb-1">Fine Mesh Netting</Heading>
                  <Text className="text-sm text-gray-500">Pollen Reduction</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-4">
                Our no-see-um mesh has a finer weave that significantly reduces pollen while allowing maximum 
                airflow. Great for mild allergies.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Significant pollen reduction</ListItem>
                <ListItem variant="checked" iconColor="#406517">Maximum airflow</ListItem>
                <ListItem variant="checked" iconColor="#406517">Bug protection included</ListItem>
              </BulletedList>
              <Button variant="primary" asChild className="w-full mt-4">
                <Link href="/screened-porch-enclosures">
                  Learn About Mesh Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            BENEFITS
            ================================================================ */}
        <HeaderBarSection icon={Heart} label="Benefits of Pollen Protection" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-[#406517]/10 rounded-full flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#406517]" />
                    </div>
                  </div>
                  <Text className="font-semibold text-gray-900 mb-2">{benefit.title}</Text>
                  <Text className="text-gray-600 text-sm">{benefit.description}</Text>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            GET STARTED CTA
            ================================================================ */}
        <Card className="p-8 md:p-12 bg-gradient-to-r from-[#406517] to-[#2d4810] text-white text-center rounded-3xl">
          <Heading level={2} className="!text-2xl md:!text-3xl !mb-4 !text-white">
            Ready to Enjoy Spring Again?
          </Heading>
          <Text className="text-white/90 mb-8 max-w-2xl mx-auto">
            Our planning team can help you choose the best solution for your pollen protection needs. 
            Contact us today for a free consultation.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" size="lg" className="bg-white text-[#406517] hover:bg-gray-100 border-white" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </Card>

        {/* ================================================================
            FINAL CTA - Shared template
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
