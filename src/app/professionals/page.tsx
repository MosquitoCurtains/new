'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Hammer, Home, Calculator } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  BulletedList,
  ListItem,
  TwoColumn,
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import { FinalCTATemplate } from '@/lib/design-system/templates'

export default function ProfessionalsPage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#003365]/10 via-white to-[#406517]/10 border-2 border-[#003365]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[#003365]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                For Professionals
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                Partner with us to offer premium screen and weather enclosure solutions to your clients. 
                Contractors, builders, and installers welcome.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/contact">
                    Contact for Pro Pricing
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
          </div>
        </section>

        {/* Who We Work With */}
        <section>
          <Heading level={2} className="text-center !mb-8">Who We Work With</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#406517]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Hammer className="w-7 h-7 text-[#406517]" />
              </div>
              <Heading level={4}>Contractors</Heading>
              <Text className="text-gray-600">
                Add screen enclosures as an upsell service for your deck, patio, and porch projects.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Home className="w-7 h-7 text-[#003365]" />
              </div>
              <Heading level={4}>Builders</Heading>
              <Text className="text-gray-600">
                Offer premium outdoor living upgrades on new construction and renovations.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#B30158]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-[#B30158]" />
              </div>
              <Heading level={4}>Restaurants</Heading>
              <Text className="text-gray-600">
                Create year-round outdoor seating with our weather enclosure systems.
              </Text>
            </Card>
          </Grid>
        </section>

        {/* Benefits */}
        <section>
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#406517] px-6 py-4">
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Professional Benefits
              </span>
            </div>
            <div className="p-6 md:p-10">
              <TwoColumn gap="lg" className="items-start">
                <div>
                  <Heading level={3} className="!mb-4">Why Partner With Us</Heading>
                  <BulletedList spacing="md">
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Volume Pricing:</strong> Competitive rates for repeat business
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Dedicated Support:</strong> Direct line to our pro planning team
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Custom Solutions:</strong> We can accommodate special requirements
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Fast Turnaround:</strong> Priority production for pro orders
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Training Resources:</strong> Installation guides and support
                    </ListItem>
                    <ListItem variant="checked" iconColor="#406517">
                      <strong>Quality Materials:</strong> Marine-grade products you can stand behind
                    </ListItem>
                  </BulletedList>
                </div>
                <Card variant="outlined" className="!p-6 !bg-[#003365]/5 !border-[#003365]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-[#003365]" />
                    <Heading level={4} className="!mb-0">Get a Quote</Heading>
                  </div>
                  <Text className="text-gray-600 mb-4">
                    Contact us with your project details for professional pricing. We offer:
                  </Text>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Per-project quotes</li>
                    <li>• Volume discount structures</li>
                    <li>• Reseller arrangements</li>
                    <li>• White-label options</li>
                  </ul>
                  <Button variant="secondary" className="w-full mt-4" asChild>
                    <Link href="/contact">
                      Request Pro Pricing
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              </TwoColumn>
            </div>
          </div>
        </section>

        {/* Product Videos for Professionals */}
        <section>
          <Heading level={2} className="text-center !mb-8">Product Overview Videos</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Share these videos with your clients to help them understand our products.
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.PROFESSIONALS_OVERVIEW} title="Professionals Overview" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Professionals Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW} title="Mosquito Curtains Overview" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Mosquito Curtains Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.CLEAR_VINYL_OVERVIEW} title="Clear Vinyl Overview" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Clear Vinyl Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.ROLL_UP_SHADE} title="Roll Up Shade Screens" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Roll Up Shade Screens</Text>
            </div>
          </Grid>
        </section>

        {/* Testimonial */}
        <section>
          <Card variant="elevated" className="!p-8 text-center">
            <Text className="text-xl italic text-gray-600 mb-4">
              "We've been recommending Mosquito Curtains to our clients for years. The quality 
              is excellent and our customers love the results. The team is easy to work with 
              and always delivers on time."
            </Text>
            <Text className="font-medium">— Licensed Contractor, Georgia</Text>
          </Card>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate 
          title="Ready to Partner?"
          subtitle="Contact us to discuss professional pricing and partnership opportunities."
        />
      </Stack>
    </Container>
  )
}
