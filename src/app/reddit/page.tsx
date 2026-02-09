'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Snowflake,
  Calculator,
  MessageSquare,
  Star,
  CheckCircle,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
} from '@/lib/design-system'

export default function RedditHubPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="lg" className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <div className="bg-[#FF4500]/10 text-[#FF4500] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Welcome, Redditors!
              </div>
            </div>

            <Heading level={1} className="!text-4xl md:!text-5xl">
              Custom Outdoor Enclosures<br />
              <span className="text-[#406517]">Made Right. Made to Last.</span>
            </Heading>

            <Text className="text-xl text-gray-600">
              92,000+ happy customers since 2004. Marine-grade quality, fast shipping, 
              and real humans who actually help you.
            </Text>
          </Stack>
        </section>

        {/* ================================================================
            PRODUCT OPTIONS
            ================================================================ */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
          <Card variant="elevated" className="!p-8 !border-[#406517]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center">
                <Bug className="w-6 h-6 text-[#406517]" />
              </div>
              <div>
                <Heading level={3} className="!mb-0">Mosquito Curtains</Heading>
                <Text className="text-sm text-gray-500 !mb-0">Insect Protection</Text>
              </div>
            </div>
            <Text className="text-gray-600 mb-4">
              Custom screen panels sewn to your exact measurements. Keep the bugs out, 
              let the breeze in. Available in multiple mesh types and colors.
            </Text>
            <BulletedList spacing="sm" className="mb-6">
              <ListItem variant="checked" iconColor="#406517">Heavy Mosquito, No-See-Um, and Shade Mesh</ListItem>
              <ListItem variant="checked" iconColor="#406517">Tracking or Velcro attachment</ListItem>
              <ListItem variant="checked" iconColor="#406517">3-7 day delivery</ListItem>
            </BulletedList>
            <Button variant="primary" asChild className="w-full">
              <Link href="/start-project?mode=quote&product=mosquito_curtains&utm_source=reddit">
                <Calculator className="w-4 h-4 mr-2" />
                Get MC Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Card>

          <Card variant="elevated" className="!p-8 !border-[#003365]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-xl flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-[#003365]" />
              </div>
              <div>
                <Heading level={3} className="!mb-0">Clear Vinyl Panels</Heading>
                <Text className="text-sm text-gray-500 !mb-0">Weather Protection</Text>
              </div>
            </div>
            <Text className="text-gray-600 mb-4">
              Restaurant-grade 20 mil thick vinyl panels to winterize your porch. 
              Block cold, rain, and snow while maintaining your view.
            </Text>
            <BulletedList spacing="sm" className="mb-6">
              <ListItem variant="checked" iconColor="#003365">20 mil thick vinyl</ListItem>
              <ListItem variant="checked" iconColor="#003365">Interchangeable with screen panels</ListItem>
              <ListItem variant="checked" iconColor="#003365">Zippered entrances included</ListItem>
            </BulletedList>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/start-project?mode=quote&product=clear_vinyl&utm_source=reddit">
                <Calculator className="w-4 h-4 mr-2" />
                Get CV Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Card>
        </Grid>

        {/* ================================================================
            WHY US (Reddit style - direct, no BS)
            ================================================================ */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <Heading level={2} className="text-center !mb-8">The TL;DR</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-[#406517] mx-auto mb-3" />
              <Text className="font-semibold !mb-1">Not the Cheapest</Text>
              <Text className="text-sm text-gray-600 !mb-0">But if you want quality that lasts, we're the only choice.</Text>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-[#406517] mx-auto mb-3" />
              <Text className="font-semibold !mb-1">Real Humans</Text>
              <Text className="text-sm text-gray-600 !mb-0">Our planning team actually helps you design your project.</Text>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-[#406517] mx-auto mb-3" />
              <Text className="font-semibold !mb-1">DIY Friendly</Text>
              <Text className="text-sm text-gray-600 !mb-0">Level 3/10 difficulty. Any handyman can do it.</Text>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-[#406517] mx-auto mb-3" />
              <Text className="font-semibold !mb-1">20+ Years</Text>
              <Text className="text-sm text-gray-600 !mb-0">92,000 customers. We know what we're doing.</Text>
            </div>
          </Grid>
        </section>

        {/* ================================================================
            TALK TO US
            ================================================================ */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
          <Frame ratio="4/3" className="rounded-3xl overflow-hidden">
            <img
              src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg"
              alt="Beautiful porch with mosquito curtains"
              className="w-full h-full object-cover"
            />
          </Frame>
          <Stack gap="md">
            <Heading level={2}>Have Questions? We're Here.</Heading>
            <Text className="text-gray-600">
              We're a small team in Alpharetta, GA who actually care about your project. 
              Upload photos of your space and we'll give you personalized recommendations.
            </Text>
            <BulletedList spacing="sm">
              <ListItem variant="arrow" iconColor="#B30158">Expert reviews your project</ListItem>
              <ListItem variant="arrow" iconColor="#B30158">Detailed quote within 24-48 hours</ListItem>
              <ListItem variant="arrow" iconColor="#B30158">No pressure, just help</ListItem>
            </BulletedList>
            <Button variant="accent" asChild className="w-fit">
              <Link href="/start-project?mode=planner&utm_source=reddit">
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to a Human
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Stack>
        </Grid>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
