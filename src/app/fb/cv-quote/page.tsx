'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Calculator,
  Snowflake,
  Star,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Heading,
  Frame,
  BulletedList,
  ListItem,
} from '@/lib/design-system'

export default function FBCVQuotePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO - Optimized for Facebook Ads
            ================================================================ */}
        <section className="relative py-16 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="lg" className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <div className="bg-[#003365]/10 text-[#003365] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                92,000+ Happy Customers Since 2004
              </div>
            </div>

            <Heading level={1} className="!text-4xl md:!text-6xl">
              Winterize Your Porch.<br />
              <span className="text-[#003365]">Use It Year-Round.</span>
            </Heading>

            <Text className="text-xl text-gray-600">
              Custom clear vinyl panels to protect your porch from cold, rain & snow. Get an instant quote in 60 seconds.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/start-project?mode=quote&product=clear_vinyl&utm_source=facebook&utm_medium=paid&utm_campaign=cv_quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get My Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <Text className="text-sm text-gray-500">
              No credit card required. Delivered in 3-7 days.
            </Text>
          </Stack>
        </section>

        {/* ================================================================
            SOCIAL PROOF
            ================================================================ */}
        <section className="bg-white rounded-3xl border-2 border-gray-100 p-8">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg" className="text-center">
            <div>
              <Text className="text-3xl font-bold text-[#003365] !mb-1">92,000+</Text>
              <Text className="text-sm text-gray-600 !mb-0">Happy Customers</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#003365] !mb-1">5.0</Text>
              <Text className="text-sm text-gray-600 !mb-0">Star Rating</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#003365] !mb-1">20 mil</Text>
              <Text className="text-sm text-gray-600 !mb-0">Thick Vinyl</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#003365] !mb-1">20+</Text>
              <Text className="text-sm text-gray-600 !mb-0">Years Experience</Text>
            </div>
          </Grid>
        </section>

        {/* ================================================================
            BENEFITS
            ================================================================ */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
          <Frame ratio="4/3" className="rounded-3xl overflow-hidden">
            <img
              src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg"
              alt="Beautiful porch with clear vinyl panels"
              className="w-full h-full object-cover"
            />
          </Frame>
          <Stack gap="md">
            <Heading level={2}>Why 92,000+ Customers Choose Us</Heading>
            <BulletedList spacing="md">
              <ListItem variant="checked" iconColor="#003365">
                <strong>Restaurant-Grade Quality</strong> - 20 mil thick panels used by top restaurants.
              </ListItem>
              <ListItem variant="checked" iconColor="#003365">
                <strong>DIY Installation</strong> - No contractors needed. Install yourself in an afternoon.
              </ListItem>
              <ListItem variant="checked" iconColor="#003365">
                <strong>Fast Shipping</strong> - Custom-made and delivered in 3-7 business days.
              </ListItem>
              <ListItem variant="checked" iconColor="#003365">
                <strong>Interchangeable</strong> - Swap with screen panels for year-round use.
              </ListItem>
            </BulletedList>
            <Button variant="secondary" asChild className="w-fit">
              <Link href="/start-project?mode=quote&product=clear_vinyl&utm_source=facebook&utm_medium=paid&utm_campaign=cv_quote">
                Get My Free Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Stack>
        </Grid>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#003365] to-[#002244] rounded-3xl p-8 md:p-12 text-center text-white">
          <Snowflake className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <Heading level={2} className="!text-white !mb-4">Ready to Use Your Porch Year-Round?</Heading>
          <Text className="text-white/80 max-w-2xl mx-auto mb-8">
            Join 92,000+ happy customers who winterized their porches with our clear vinyl panels.
          </Text>
          <Button variant="outline" size="lg" className="!bg-white !text-[#003365] !border-white hover:!bg-white/90" asChild>
            <Link href="/start-project?mode=quote&product=clear_vinyl&utm_source=facebook&utm_medium=paid&utm_campaign=cv_quote">
              <Calculator className="w-5 h-5 mr-2" />
              Get My Free Quote Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </section>

      </Stack>
    </Container>
  )
}
