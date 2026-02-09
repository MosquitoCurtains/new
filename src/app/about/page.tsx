'use client'

import { SupportPageTemplate } from '@/lib/design-system/templates'
import { Heart, Users, Award, Clock, Bug } from 'lucide-react'
import { Text, Grid, Card, Heading, YouTubeEmbed, Stack } from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'
import { ORDERS_SERVED_COUNT, ORDERS_SERVED_FORMATTED } from '@/lib/constants/orders-served'

const CONTENT_SECTIONS = [
  {
    title: 'Our Story',
    icon: Heart,
    iconColor: '#B30158',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Mosquito Curtains was founded in 2004 by a family who simply wanted to enjoy their 
          screened porch without battling mosquitoes. When we couldn't find a quality solution 
          on the market, we created our own.
        </Text>
        <Text className="text-gray-600 mb-4">
          What started as a solution for our own home has grown into a company that has served 
          over {ORDERS_SERVED_COUNT.toLocaleString()} customers across North America and beyond. We're still family-owned and 
          operated, and we still make every curtain right here in Atlanta, Georgia.
        </Text>
        <Text className="text-gray-600">
          Every order matters to us. We're not a faceless corporation - we're a small team of 
          real people who take pride in craftsmanship and customer service.
        </Text>
      </>
    ),
  },
  {
    title: 'Our Team',
    icon: Users,
    iconColor: '#003365',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          Our project planning team includes Kurt, Patrick, Aaron, Dan, John, Matt, Heather, 
          and Iryna. When you call or email, you'll talk to a real person who knows our products 
          inside and out.
        </Text>
        <Text className="text-gray-600">
          Our production team has years of experience crafting custom mosquito netting and 
          clear vinyl panels. Every panel is hand-inspected before shipping to ensure it 
          meets our quality standards.
        </Text>
      </>
    ),
  },
  {
    title: 'Our Promise',
    icon: Award,
    iconColor: '#406517',
    content: (
      <>
        <Text className="text-gray-600 mb-4">
          We stand behind every product we sell with our satisfaction guarantee. If you're 
          not happy with your purchase, we'll make it right.
        </Text>
        <Text className="text-gray-600">
          We use only marine-grade materials that are built to last outdoors. Our netting 
          is solution-dyed so it won't fade, and our hardware is stainless steel or 
          powder-coated aluminum. We believe in quality that lasts.
        </Text>
      </>
    ),
  },
]

const QUICK_LINKS = [
  { title: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
  { title: 'Reviews', href: '/reviews', description: 'See what customers are saying' },
  { title: 'Satisfaction Guarantee', href: '/satisfaction-guarantee', description: 'Our return policy' },
]

export default function AboutPage() {
  return (
    <SupportPageTemplate
      title="About Us"
      subtitle={`A family business serving ${ORDERS_SERVED_FORMATTED} customers since 2004`}
      sections={CONTENT_SECTIONS}
      quickLinks={QUICK_LINKS}
      showContactInfo={true}
    >
      {/* Company Video */}
      <section className="mt-8">
        <Card variant="elevated" className="!p-6 md:!p-8">
          <Stack gap="md" className="items-center text-center">
            <Heading level={3} className="!mb-0">See How We Work</Heading>
            <Text className="text-gray-600 max-w-2xl">
              Watch our team in action - from custom fabrication to quality control, 
              every curtain is made with care right here in Atlanta.
            </Text>
            <div className="w-full max-w-3xl">
              <YouTubeEmbed videoId={VIDEOS.COMPANY_OVERVIEW} title="About Mosquito Curtains" variant="card" />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="mt-8">
        <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#406517]">{ORDERS_SERVED_COUNT.toLocaleString()}+</p>
            <p className="text-sm text-gray-500">Happy Customers</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#003365]">2004</p>
            <p className="text-sm text-gray-500">Founded</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#B30158]">Atlanta</p>
            <p className="text-sm text-gray-500">Made in Georgia</p>
          </Card>
          <Card variant="elevated" className="!p-6 text-center">
            <p className="text-3xl font-bold text-[#FFA501]">Family</p>
            <p className="text-sm text-gray-500">Owned & Operated</p>
          </Card>
        </Grid>
      </section>
    </SupportPageTemplate>
  )
}
