'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Search,
  Home,
  ShoppingBag,
  Phone,
  HelpCircle,
  MapPin,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Button,
  Card,
  Heading,
} from '@/lib/design-system'

const HELPFUL_LINKS = [
  {
    icon: Home,
    title: 'Homepage',
    description: 'Start from the beginning',
    href: '/',
  },
  {
    icon: ShoppingBag,
    title: 'Products',
    description: 'Browse all product categories',
    href: '/products',
  },
  {
    icon: MapPin,
    title: 'Plan Your Project',
    description: 'Get started with project planning',
    href: '/plan',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find answers to common questions',
    href: '/faq',
  },
  {
    icon: Phone,
    title: 'Contact Us',
    description: 'Reach our planning team',
    href: '/contact',
  },
  {
    icon: Search,
    title: 'Gallery',
    description: 'See project photos for inspiration',
    href: '/gallery',
  },
]

export default function Custom404Page() {
  return (
    <Container size="lg">
      <Stack gap="lg" className="py-16">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <Heading level={1} className="!text-4xl md:!text-5xl !mb-4">
            Page Not Found
          </Heading>
          <Text size="lg" className="!text-gray-600 max-w-lg mx-auto">
            The page you are looking for may have moved or no longer exists.
            Use the links below to find what you need.
          </Text>
        </div>

        {/* Helpful Links Grid */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
          {HELPFUL_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.href} href={link.href} className="group">
                <Card variant="elevated" className="h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#406517]/10 flex items-center justify-center group-hover:bg-[#406517]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#406517]" />
                    </div>
                    <div className="flex-1">
                      <Heading level={4} className="!text-base !mb-1 group-hover:text-[#406517] transition-colors">
                        {link.title}
                      </Heading>
                      <Text size="sm" className="!text-gray-500 !mb-0">
                        {link.description}
                      </Text>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#406517] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </Grid>

        {/* CTA */}
        <div className="text-center pt-4">
          <Text className="!text-gray-500 !mb-4">
            Need help? Our planning team is available Monday - Friday, 9am - 5pm EST.
          </Text>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button variant="primary">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Stack>
    </Container>
  )
}
