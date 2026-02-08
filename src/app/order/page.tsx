'use client'

/**
 * /order/ — Order Landing Page
 * 
 * Category cards linking to each order flow page.
 */

import Link from 'next/link'
import { ArrowRight, Bug, Droplets, Sun, Wrench, Blinds } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  Badge,
} from '@/lib/design-system'
import { PowerHeaderTemplate, FinalCTATemplate } from '@/lib/design-system/templates'
import { VIDEOS } from '@/lib/constants/videos'

const CATEGORIES = [
  {
    title: 'Mosquito Curtain Panels',
    description: 'Custom-made mesh panels for porches, patios, gazebos, and more.',
    href: '/order/mosquito-curtains',
    icon: Bug,
    color: '#406517',
  },
  {
    title: 'Clear Vinyl Panels',
    description: 'Clear plastic enclosures for weather protection and winterizing.',
    href: '/order/clear-vinyl',
    icon: Droplets,
    color: '#003365',
  },
  {
    title: 'Raw Netting Fabrics',
    description: 'Giant rolls of raw mesh custom-cut to your specifications.',
    href: '/order/raw-netting',
    icon: Sun,
    color: '#B30158',
  },
  {
    title: 'Roll-Up Shade Screens',
    description: 'Custom roll-up shades for sun and insect protection.',
    href: '/order/roll-up-shades',
    icon: Blinds,
    color: '#406517',
  },
  {
    title: 'Track Hardware',
    description: 'Ceiling track systems, curves, splices, end caps, and carriers.',
    href: '/order/track-hardware',
    icon: Wrench,
    color: '#003365',
  },
  {
    title: 'Attachment Hardware',
    description: 'Marine snaps, magnets, elastic cord, webbing, and more.',
    href: '/order/attachments',
    icon: Wrench,
    color: '#406517',
  },
]

export default function OrderLandingPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <PowerHeaderTemplate
          title="Order Products"
          subtitle="Everything you need — custom panels, track hardware, raw netting, and attachments. Self-service ordering with live pricing."
          videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW}
          videoTitle="Mosquito Curtains Overview"
          variant="compact"
        />

        <section>
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.href} href={cat.href} className="group">
                  <Card variant="elevated" className="!p-6 h-full hover:shadow-lg transition-shadow">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cat.color }} />
                    </div>
                    <Heading level={3} className="!mb-2 group-hover:text-[#003365] transition-colors">
                      {cat.title}
                    </Heading>
                    <Text size="sm" className="text-gray-600 !mb-4">
                      {cat.description}
                    </Text>
                    <span className="text-sm font-semibold text-[#003365] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Ordering
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
