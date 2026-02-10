'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Bug,
  Snowflake,
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
  FinalCTATemplate,
} from '@/lib/design-system'

const PROJECT_TYPES = [
  {
    title: 'Mosquito Curtains',
    description: 'Fabricated Ready-to-hang Custom Insect Curtains With Easy Installation Kits',
    href: '/mosquito-curtain-planning-session',
    icon: Bug,
    color: '#406517',
  },
  {
    title: 'Clear Vinyl Winter Panels',
    description: 'Create A Warm Cozy Outdoor Weatherproof Space Sheltered From Wind, Rain & Cold!',
    href: '/clear-vinyl-planning-session',
    icon: Snowflake,
    color: '#003365',
  },
]

export default function PreparePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              We&apos;ve received your form entry!
            </Heading>
            <Heading level={2} className="!text-2xl md:!text-3xl text-[#406517]">
              Next Step: Prepare for Your Planning Session
            </Heading>
            <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
              During high season, we are extremely busy and really need our clients prepared.
              These pages will provide the basic information you should know to make our
              planning session, together, as efficient as possible.
            </Text>
          </Stack>
        </section>

        {/* ================================================================
            PROJECT TYPE SELECTION
            ================================================================ */}
        <section className="py-8">
          <Heading level={3} className="!text-2xl text-center !mb-8">
            Please Select Your Project Type Below
          </Heading>

          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="max-w-4xl mx-auto">
            {PROJECT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Link key={type.title} href={type.href} className="group">
                  <Card variant="elevated" className="!p-8 text-center transition-all group-hover:shadow-xl group-hover:-translate-y-1 h-full" style={{ borderColor: type.color, borderWidth: '2px' }}>
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{ backgroundColor: `${type.color}15` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: type.color }} />
                    </div>
                    <Heading level={3} className="!mb-3 group-hover:text-[#406517]">
                      {type.title}
                    </Heading>
                    <Text className="text-gray-600 !mb-6">
                      {type.description}
                    </Text>
                    <Button variant="primary" className="w-full">
                      Select {type.title.split(' ')[0]}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </section>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
