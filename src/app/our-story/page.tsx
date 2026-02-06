'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Users, Star, Award } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  TwoColumn,
  Frame,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'
import { ORDERS_SERVED_FORMATTED, ORDERS_SERVED_COUNT } from '@/lib/constants/orders-served'

export default function OurStoryPage() {
  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#B30158]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12 text-center">
            <Heart className="w-12 h-12 text-[#B30158] mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Story
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              How a simple family problem became a solution for {ORDERS_SERVED_FORMATTED} customers
            </p>
          </div>
        </section>

        {/* The Beginning */}
        <section>
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#406517] px-6 py-4">
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                The Beginning
              </span>
            </div>
            <div className="p-6 md:p-10">
              <TwoColumn gap="lg" className="items-center">
                <Stack gap="md">
                  <Heading level={2}>It Started With a Problem</Heading>
                  <Text className="text-gray-600">
                    Back in 2004, our family had a beautiful screened porch that we couldn't enjoy. 
                    Despite having screens, mosquitoes found their way in through gaps and worn mesh. 
                    Our kids couldn't play outside without getting eaten alive.
                  </Text>
                  <Text className="text-gray-600">
                    We looked everywhere for a solution but couldn't find quality mosquito netting 
                    that was custom-sized for our space. Everything was either cheap disposable 
                    stuff from big box stores or expensive permanent construction.
                  </Text>
                  <Text className="text-gray-600 font-medium">
                    So we made our own.
                  </Text>
                </Stack>
                <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg"
                    alt="Screen porch with mosquito curtains"
                    className="w-full h-full object-cover"
                  />
                </Frame>
              </TwoColumn>
            </div>
          </div>
        </section>

        {/* Growth */}
        <section>
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden order-2 md:order-1">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Planner-Image-1920.jpg"
                alt="Project planning"
                className="w-full h-full object-cover"
              />
            </Frame>
            <div className="order-1 md:order-2">
              <Stack gap="md">
                <Heading level={2}>Word Spread</Heading>
                <Text className="text-gray-600">
                  Neighbors noticed our porch and asked where we got those curtains. Then their 
                  friends asked. Then we started getting calls from people across the country 
                  who found us online.
                </Text>
                <Text className="text-gray-600">
                  What started as a solution for one family's porch has grown into a business 
                  that has served over {ORDERS_SERVED_COUNT.toLocaleString()} customers across North America and beyond.
                </Text>
                <Text className="text-gray-600">
                  But we're still the same family-owned company, still making every curtain 
                  right here in Atlanta, Georgia, still answering every phone call with a 
                  real person who knows our products inside and out.
                </Text>
              </Stack>
            </div>
          </TwoColumn>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-8">
            <Heading level={2}>What We Believe In</Heading>
          </div>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#406517]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#406517]" />
              </div>
              <Heading level={3}>Quality First</Heading>
              <Text className="text-gray-600">
                We use marine-grade materials that last. No cutting corners. If we wouldn't 
                put it on our own porch, we won't sell it to you.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-7 h-7 text-[#003365]" />
              </div>
              <Heading level={3}>Real People</Heading>
              <Text className="text-gray-600">
                When you call, you talk to someone who knows our products. Kurt, Patrick, 
                Aaron, Dan, John, Matt, Heather, and Iryna are here to help.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-14 h-14 bg-[#B30158]/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-7 h-7 text-[#B30158]" />
              </div>
              <Heading level={3}>Every Order Matters</Heading>
              <Text className="text-gray-600">
                We're not a faceless corporation. We're a small team that takes pride in 
                every curtain we make. Your order matters to us.
              </Text>
            </Card>
          </Grid>
        </section>

        {/* Stats */}
        <section>
          <div className="bg-[#406517] rounded-3xl p-8 md:p-12">
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg">
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">2004</p>
                <p className="text-white/80">Founded</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">{ORDERS_SERVED_COUNT.toLocaleString()}+</p>
                <p className="text-white/80">Happy Customers</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">Atlanta</p>
                <p className="text-white/80">Made in Georgia</p>
              </div>
              <div className="text-center text-white">
                <p className="text-4xl font-bold mb-1">Family</p>
                <p className="text-white/80">Owned & Operated</p>
              </div>
            </Grid>
          </div>
        </section>

        {/* Thank You */}
        <section>
          <Card variant="elevated" className="!p-8 text-center">
            <Heart className="w-8 h-8 text-[#B30158] mx-auto mb-4" />
            <Heading level={2} className="!mb-4">Thank You</Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto mb-6">
              To everyone who has trusted us with their porches, patios, garages, and 
              outdoor spaces over the years - thank you. Every order, every positive 
              review, every referral to a friend means the world to us.
            </Text>
            <Text className="text-gray-600 max-w-2xl mx-auto">
              We're honored to be part of your homes.
            </Text>
          </Card>
        </section>

        {/* CTA */}
        <FinalCTATemplate 
          title="Ready to Enjoy Your Outdoor Space?"
          subtitle={`Join the ${ORDERS_SERVED_FORMATTED} customers who have trusted us since 2004.`}
        />
      </Stack>
    </Container>
  )
}
