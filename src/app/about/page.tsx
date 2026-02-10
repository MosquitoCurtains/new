'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Users, Award } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  PowerHeaderTemplate,
  FinalCTATemplate,
  MC_SIMPLE_ACTIONS,
} from '@/lib/design-system'
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
    <Container size="xl">
      <Stack gap="lg">
        {/* Hero with video (PowerHeaderTemplate - hero left, video right) */}
        <PowerHeaderTemplate
          title="About Us"
          subtitle={`A family business serving ${ORDERS_SERVED_FORMATTED} customers since 2004`}
          videoId={VIDEOS.COMPANY_OVERVIEW}
          videoTitle="About Mosquito Curtains - See How We Work"
          variant="compact"
          actions={MC_SIMPLE_ACTIONS}
          ctaText="Contact Us"
          ctaHref="/contact"
        />

        {/* Content Sections */}
        {CONTENT_SECTIONS.map((section, idx) => (
          <section key={idx}>
            <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ backgroundColor: section.iconColor || '#406517' }}
              >
                <section.icon className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
              <div className="p-6 md:p-8">{section.content}</div>
            </div>
          </section>
        ))}

        {/* Stats Section */}
        <section>
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

        {/* Quick Links */}
        <section>
          <Heading level={3} className="text-center !mb-6">Related Information</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
            {QUICK_LINKS.map((link, idx) => (
              <Card key={idx} variant="outlined" className="!p-4 hover:border-[#406517]/50 transition-colors">
                <Link href={link.href} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{link.title}</span>
                    {link.description && (
                      <p className="text-sm text-gray-500">{link.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Contact Info */}
        <section>
          <div className="bg-[#003365] rounded-3xl p-8 md:p-12">
            <div className="text-center text-white">
              <Heading level={3} className="!text-white !mb-4">
                Need More Help?
              </Heading>
              <p className="text-white/80 mb-6">
                Our planning team is here to assist you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="highlight" asChild>
                  <a href="tel:7706454745">
                    Call (770) 645-4745
                  </a>
                </Button>
                <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10" asChild>
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <FinalCTATemplate variant="green" />
      </Stack>
    </Container>
  )
}
