'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Calculator,
  Snowflake,
  CheckCircle,
  Shield,
  Ruler,
  DollarSign,
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

export default function ClearVinylQuotePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12">
          {/* Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="xl" className="items-center">
            <Stack gap="lg">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Snowflake className="w-6 h-6 text-[#003365]" />
                  <Text className="text-[#003365] font-semibold uppercase tracking-wider !mb-0">
                    Instant Quote Tool
                  </Text>
                </div>
                <Heading level={1} className="!text-4xl md:!text-5xl !mb-4">
                  Clear Vinyl Instant Quote
                </Heading>
                <Text className="text-xl text-gray-600">
                  Modular Clear Vinyl Panels Custom-Made to Fit Any Space. 
                  Winterize your porch from cold, rain & snow.
                </Text>
              </div>

              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Custom-made to your exact dimensions</ListItem>
                <ListItem variant="checked" iconColor="#003365">20 mil thick restaurant-grade quality</ListItem>
                <ListItem variant="checked" iconColor="#003365">Interchangeable with screen panels</ListItem>
                <ListItem variant="checked" iconColor="#003365">Easy DIY installation</ListItem>
              </BulletedList>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/start-project?mode=quote&product=clear_vinyl">
                    <Calculator className="w-5 h-5 mr-2" />
                    Get Instant Quote
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/start-project?mode=planner&product=clear_vinyl">
                    Talk to an Expert
                  </Link>
                </Button>
              </div>
            </Stack>

            <YouTubeEmbed
              videoId="ca6GufadXoE"
              title="Clear Vinyl Overview Video"
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
              <div className="w-12 h-12 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#003365]">1</span>
              </div>
              <Heading level={4} className="!mb-2">Select Panel Height</Heading>
              <Text className="text-gray-600 !mb-0">
                Choose from shorter than 78", 78"-108", or taller than 108"
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#406517]">2</span>
              </div>
              <Heading level={4} className="!mb-2">Enter Dimensions</Heading>
              <Text className="text-gray-600 !mb-0">
                Select top attachment, total width, and number of sides
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
            <Button variant="secondary" size="lg" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                <Calculator className="w-5 h-5 mr-2" />
                Start Your Quote Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            PRICING EXAMPLES
            ================================================================ */}
        <HeaderBarSection icon={DollarSign} label="Example Pricing" variant="dark">
          <Text className="text-center text-gray-600 mb-6">
            Here are some real project examples to give you an idea of pricing:
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-1.jpg"
                  alt="3-sided clear vinyl enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-2xl font-bold text-[#003365] !mb-1">$1,577 + Shipping</Text>
              <Text className="text-gray-600 !mb-0">3 sides</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-2.jpg"
                  alt="3-sided with kink clear vinyl enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-2xl font-bold text-[#003365] !mb-1">$2,575 + Shipping</Text>
              <Text className="text-gray-600 !mb-0">3 sides (notice the kink)</Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Frame ratio="16/9" className="rounded-xl overflow-hidden mb-4">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Example-3.jpg"
                  alt="4+ sided clear vinyl enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Text className="text-2xl font-bold text-[#003365] !mb-1">$1,865 + Shipping</Text>
              <Text className="text-gray-600 !mb-0">4+ sides</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            TOP ATTACHMENT OPTIONS
            ================================================================ */}
        <HeaderBarSection icon={Shield} label="Top Attachment Options" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Velcro (Most Common)</Heading>
              <Text className="text-gray-600 mb-4">
                Most Clear Vinyl applications use fixed Velcro top attachment. This is the 
                most economical option and works great for seasonal use.
              </Text>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Velcro-Option.jpg"
                  alt="Velcro fixed attachment for clear vinyl"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-4">Tracking</Heading>
              <Text className="text-gray-600 mb-4">
                Slides side-to-side for easy operation. Choosing tracking estimates the cost 
                of tracking hardware you will need.
              </Text>
              <Frame ratio="16/9" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/CV-Tracking-Option.jpg"
                  alt="Tracking attachment for clear vinyl"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            VALUE PROPOSITION
            ================================================================ */}
        <HeaderBarSection icon={CheckCircle} label="Cost of Clear Vinyl Plastic Enclosures" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We all search for value when making large purchases and you found a needle in a haystack. 
                We are craftsmen who focus on quality, methods and with a smarter production and ordering 
                process that will save you $$$ while delivering a superior product at lightning speed.
              </Text>
              <Text className="text-gray-600">
                We encourage you to examine other providers. Why? Because we are sassy and we know you 
                will be back. If we knew how to make these better, we would already be doing it!
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">Superior quality materials</ListItem>
                <ListItem variant="checked" iconColor="#003365">Smarter production = lower costs</ListItem>
                <ListItem variant="checked" iconColor="#003365">Lightning fast delivery</ListItem>
                <ListItem variant="checked" iconColor="#003365">100% satisfaction guarantee</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="KTrkT6DHm9k"
              title="Clear Vinyl Construction"
              variant="card"
            />
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            LEARN MORE LINKS
            ================================================================ */}
        <HeaderBarSection icon={ArrowRight} label="Learn More" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Link href="/clear-vinyl-options" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#003365] group-hover:shadow-md">
                <Text className="font-semibold text-gray-900 group-hover:text-[#003365] !mb-1">Options</Text>
                <Text className="text-sm text-gray-500 !mb-0">Apron colors & usability</Text>
              </Card>
            </Link>
            <Link href="/what-makes-our-clear-vinyl-product-better" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#003365] group-hover:shadow-md">
                <Text className="font-semibold text-gray-900 group-hover:text-[#003365] !mb-1">Why Our System?</Text>
                <Text className="text-sm text-gray-500 !mb-0">What makes us better</Text>
              </Card>
            </Link>
            <Link href="/clear-vinyl-self-installation-advantages" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#003365] group-hover:shadow-md">
                <Text className="font-semibold text-gray-900 group-hover:text-[#003365] !mb-1">Self-Installation</Text>
                <Text className="text-sm text-gray-500 !mb-0">Is it really that easy?</Text>
              </Card>
            </Link>
            <Link href="/satisfaction-guarantee" className="group">
              <Card variant="outlined" className="!p-4 text-center transition-all group-hover:border-[#003365] group-hover:shadow-md">
                <Text className="font-semibold text-gray-900 group-hover:text-[#003365] !mb-1">Guarantee</Text>
                <Text className="text-sm text-gray-500 !mb-0">Satisfaction guaranteed</Text>
              </Card>
            </Link>
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            CTA SECTION
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#003365]/10 via-white to-[#406517]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Winterize Your Porch?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Get an instant quote for your clear vinyl project. Our calculator gives you 
            an estimate within 5% of actual cost.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                <Calculator className="w-5 h-5 mr-2" />
                Get Instant Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/clear-vinyl-plastic-patio-enclosures">
                See Clear Vinyl Options
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
