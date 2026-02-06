'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Calculator,
  Bug,
  CheckCircle,
  Clock,
  Shield,
  Ruler,
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
  HeaderBarSection,
  YouTubeEmbed,
} from '@/lib/design-system'

export default function MosquitoCurtainsQuotePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12">
          {/* Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="xl" className="items-center">
            <Stack gap="lg">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bug className="w-6 h-6 text-[#406517]" />
                  <Text className="text-[#406517] font-semibold uppercase tracking-wider !mb-0">
                    Instant Quote Tool
                  </Text>
                </div>
                <Heading level={1} className="!text-4xl md:!text-5xl !mb-4">
                  Mosquito Curtains Instant Quote
                </Heading>
                <Text className="text-xl text-gray-600">
                  Modular Outdoor Curtain Systems to Create a Modern & Sleek Outdoor Space. 
                  Get an estimate within 5% of actual cost in seconds.
                </Text>
              </div>

              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Custom-made to your exact dimensions</ListItem>
                <ListItem variant="checked" iconColor="#406517">Delivered in 3-7 business days</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine-grade quality that lasts</ListItem>
                <ListItem variant="checked" iconColor="#406517">Easy DIY installation</ListItem>
              </BulletedList>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/start-project?mode=quote&product=mosquito_curtains">
                    <Calculator className="w-5 h-5 mr-2" />
                    Get Instant Quote
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/start-project?mode=planner&product=mosquito_curtains">
                    Talk to an Expert
                  </Link>
                </Button>
              </div>
            </Stack>

            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Product Overview Video"
              variant="card"
            />
          </Grid>
        </section>

        {/* ================================================================
            HOW IT WORKS
            ================================================================ */}
        <HeaderBarSection icon={Calculator} label="How The Quote Tool Works" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#406517]">1</span>
              </div>
              <Heading level={4} className="!mb-2">Select Mesh Type</Heading>
              <Text className="text-gray-600 !mb-0">
                Choose from Heavy Mosquito Mesh, No-See-Um Mesh, Shade Mesh, or Scrim Material
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#003365]">2</span>
              </div>
              <Heading level={4} className="!mb-2">Enter Dimensions</Heading>
              <Text className="text-gray-600 !mb-0">
                Select top attachment, number of sides, and total project width
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#B30158]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#B30158]">3</span>
              </div>
              <Heading level={4} className="!mb-2">Get Your Price</Heading>
              <Text className="text-gray-600 !mb-0">
                Instant estimate within 5% of actual cost, including shipping
              </Text>
            </Card>
          </Grid>
          <div className="flex justify-center pt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="/start-project?mode=quote&product=mosquito_curtains">
                <Calculator className="w-5 h-5 mr-2" />
                Start Your Quote Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            PRICING BREAKDOWN
            ================================================================ */}
        <HeaderBarSection icon={Ruler} label="Pricing Based on Height" variant="dark">
          <Text className="text-center text-gray-600 mb-6">
            We break pricing into 3 buckets based on the height of your project:
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center !border-[#406517]/20">
              <Heading level={4} className="!mb-2 text-[#406517]">Shorter than 78"</Heading>
              <Text className="text-gray-600 !mb-0">No Canvas Required</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center !border-[#003365]/20">
              <Heading level={4} className="!mb-2 text-[#003365]">78" - 108"</Heading>
              <Text className="text-gray-600 !mb-0">Canvas On Bottom Only</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center !border-[#B30158]/20">
              <Heading level={4} className="!mb-2 text-[#B30158]">Taller than 108"</Heading>
              <Text className="text-gray-600 !mb-0">Canvas on Top & Bottom</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            TOP ATTACHMENT OPTIONS
            ================================================================ */}
        <HeaderBarSection icon={Shield} label="Top Attachment Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Tracking (Most Popular)</Heading>
              <Text className="text-gray-600 mb-4">
                Slides side-to-side for easy operation. Perfect for areas where you want to 
                open and close your curtains regularly.
              </Text>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Tracking-Option.jpg"
                  alt="Tracking attachment slides side to side"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Velcro (Fixed)</Heading>
              <Text className="text-gray-600 mb-4">
                Does NOT slide. A more economical option for areas where you don't need to 
                open and close the curtains frequently.
              </Text>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Velcro-Option.jpg"
                  alt="Velcro fixed attachment option"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            CTA SECTION
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get Started?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get an instant quote for your mosquito curtain project. Our calculator gives you 
            an estimate within 5% of actual cost.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/start-project?mode=quote&product=mosquito_curtains">
                <Calculator className="w-5 h-5 mr-2" />
                Get Instant Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/options">
                See All Options
              </Link>
            </Button>
          </div>
        </section>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
