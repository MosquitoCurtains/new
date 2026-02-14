'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Snowflake,
  Camera,
  Shield,
  Settings,
  Calculator,
  ShoppingCart,
  Award,
  HelpCircle,
  Home,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Button,
  Card,
  Heading,
  YouTubeEmbed,
  HeaderBarSection,
  FinalCTATemplate,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const QUICK_LINKS = [
  { title: 'Clear Vinyl Home', href: '/clear-vinyl-plastic-patio-enclosures' },
  { title: 'Clear Vinyl Options', href: '/clear-vinyl-options' },
  { title: 'Plan A Project', href: '/project-planning' },
]

const LEARN_MORE_CARDS = [
  {
    title: 'Why Our System?',
    href: '/what-makes-our-clear-vinyl-product-better',
    icon: Award,
  },
  {
    title: 'Self-Installation',
    href: '/clear-vinyl-self-installation-advantages',
    icon: Settings,
  },
  {
    title: 'Guarantee',
    href: '/satisfaction-guarantee',
    icon: Shield,
  },
  {
    title: 'Options',
    href: '/clear-vinyl-options',
    icon: HelpCircle,
  },
  {
    title: 'Instant Quote',
    href: '/clear-vinyl-instant-quote',
    icon: Calculator,
  },
  {
    title: 'Ordering',
    href: '/ordering-clear-vinyl',
    icon: ShoppingCart,
  },
]

export default function ClearVinylProject87444Page() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Snowflake className="w-10 h-10 text-[#003365]" />
            </div>
            <Text className="text-[#003365] font-semibold uppercase tracking-wider !mb-0">
              Project Series
            </Text>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Clear Vinyl Project #87444
            </Heading>
            <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how we worked with this customer on their clear vinyl application.
              We are happy to help you plan your project as well with a seasoned project planner!
            </Text>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              {QUICK_LINKS.map((link) => (
                <Button key={link.title} variant="outline" size="sm" asChild>
                  <Link href={link.href}>
                    {link.title}
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </Button>
              ))}
            </div>
          </Stack>
        </section>

        {/* ================================================================
            HOW TO PLAN YOUR OWN PROJECT
            ================================================================ */}
        <HeaderBarSection icon={Camera} label="How to Plan Your Own Project" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="xl" className="items-center">
            <Stack gap="md">
              <Heading level={3} className="!mb-2">
                Get Started Fast With a Real Person!
              </Heading>
              <Text className="text-gray-600">
                We are happy to help you plan your project with a quick planning session. 
                For maximum speed and efficiency, photos of your space are extremely helpful. 
                Use our{' '}
                <Link href="/contact" className="text-[#003365] underline hover:text-[#406517]">
                  quick connect form
                </Link>{' '}
                to reach out and share photos of your space.
              </Text>
              <Text className="text-gray-600">
                Review the photo guidelines video to learn what types of photos we need 
                to provide an accurate estimate for your clear vinyl project.
              </Text>
              <Button variant="accent" asChild>
                <Link href="/contact">
                  <Camera className="w-5 h-5 mr-2" />
                  Send Us Your Photos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>

            <YouTubeEmbed
              videoId={VIDEOS.PHOTO_GUIDELINES}
              title="Photo Guidelines"
              variant="card"
            />
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            LEARN MORE SECTION
            ================================================================ */}
        <HeaderBarSection icon={Snowflake} label="Learn More" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            {LEARN_MORE_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.title} href={card.href} className="group">
                  <Card variant="elevated" className="!p-6 text-center transition-all group-hover:border-[#003365] group-hover:shadow-lg group-hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 bg-[#003365]/10 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-[#003365]/20">
                      <Icon className="w-6 h-6 text-[#003365]" />
                    </div>
                    <Heading level={4} className="!mb-0 !text-base group-hover:text-[#003365]">
                      {card.title}
                    </Heading>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            RETURN CTA
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#003365]/10 via-white to-[#406517]/10 rounded-3xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-[#003365]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-[#003365]" />
          </div>
          <Heading level={2} className="!mb-4">Explore Clear Vinyl Solutions</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Visit our Clear Vinyl home page to learn about all available options,
            get an instant quote, or start planning your project.
          </Text>
          <Button variant="primary" size="lg" asChild>
            <Link href="/clear-vinyl-plastic-patio-enclosures">
              Return to Clear Vinyl Home Page
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </section>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate productLine="cv" />

      </Stack>
    </Container>
  )
}
