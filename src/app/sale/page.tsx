'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Tag,
  Clock,
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
  FinalCTATemplate,
  HeaderBarSection,
  WhyChooseUsTemplate,
} from '@/lib/design-system'

export default function SalePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <Tag className="w-10 h-10 text-red-600" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Current Sales & Promotions
            </Heading>
            <Text className="text-xl text-gray-600">
              Check back here for our latest deals on mosquito curtains and clear vinyl 
              enclosures.
            </Text>
          </Stack>
        </section>

        {/* Current Deals */}
        <HeaderBarSection icon={Tag} label="Current Offers" variant="dark">
          <Card className="!p-8 !bg-gradient-to-br !from-[#406517]/10 !via-white !to-[#003365]/10 text-center">
            <Heading level={2} className="!mb-4">No Active Sales Right Now</Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
              We don't have any active promotions at the moment, but our everyday 
              pricing is already competitive. Get a quote to see for yourself!
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/start-project?mode=quote">
                  Get Your Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </HeaderBarSection>

        {/* Why We Don't Always Run Sales */}
        <HeaderBarSection icon={CheckCircle} label="Our Pricing Philosophy" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Quality-Product.jpg"
                alt="Quality mosquito curtains"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Unlike some companies that inflate prices just to mark them down, we 
                believe in fair, consistent pricing year-round.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">No artificial markups</ListItem>
                <ListItem variant="checked" iconColor="#406517">Same quality year-round</ListItem>
                <ListItem variant="checked" iconColor="#406517">Transparent pricing</ListItem>
                <ListItem variant="checked" iconColor="#406517">Best value without gimmicks</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Email Signup */}
        <HeaderBarSection icon={Clock} label="Get Notified of Future Sales" variant="dark">
          <Card className="!p-6 !bg-[#003365]/5 !border-[#003365]/20 text-center">
            <Heading level={3} className="!mb-4">Want to Know About Promotions?</Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
              Contact us to be added to our email list. We occasionally run seasonal 
              promotions and will let you know when we do.
            </Text>
            <Button variant="outline" asChild>
              <Link href="/start-project">
                Contact Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Card>
        </HeaderBarSection>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Get Started?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Don't wait for a sale - get your custom quote today and see why 90,000+ 
            customers have chosen us.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
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
