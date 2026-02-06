'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Play,
  Bug,
  Snowflake,
  Wrench,
  Award,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Heading,
  YouTubeEmbed,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

// Video categories
const VIDEO_CATEGORIES = [
  {
    id: 'overview',
    icon: Play,
    label: 'Product Overview',
    videos: [
      { id: 'FqNe9pDsZ8M', title: 'Mosquito Curtains Overview', description: 'Learn how our modular system works' },
      { id: 'ZjxrDItgV8w', title: 'Custom Fitted Enclosures', description: 'See how we custom-fit to your space' },
      { id: 'KmobG8rofx0', title: 'Quality & Materials', description: 'Why our materials last longer' },
    ]
  },
  {
    id: 'mosquito',
    icon: Bug,
    label: 'Mosquito Curtains',
    videos: [
      { id: 'FqNe9pDsZ8M', title: 'Mosquito Netting Overview', description: 'Introduction to mosquito curtains' },
      { id: 'ZjxrDItgV8w', title: 'Mesh Types Explained', description: 'Heavy mosquito, no-see-um, and shade' },
      { id: 'KmobG8rofx0', title: 'Tracking vs Velcro', description: 'Choose the right attachment' },
    ]
  },
  {
    id: 'clear-vinyl',
    icon: Snowflake,
    label: 'Clear Vinyl',
    videos: [
      { id: 'FqNe9pDsZ8M', title: 'Clear Vinyl Overview', description: 'Winterize your porch' },
      { id: 'ZjxrDItgV8w', title: 'Panel Options', description: 'Height and attachment choices' },
      { id: 'KmobG8rofx0', title: 'Installation Guide', description: 'How to install clear vinyl panels' },
    ]
  },
  {
    id: 'installation',
    icon: Wrench,
    label: 'Installation Guides',
    videos: [
      { id: 'FqNe9pDsZ8M', title: 'DIY Installation Overview', description: 'What to expect' },
      { id: 'ZjxrDItgV8w', title: 'Tracking Installation', description: 'Step-by-step tracking guide' },
      { id: 'KmobG8rofx0', title: 'Velcro Installation', description: 'Fixed attachment installation' },
    ]
  },
]

export default function VideosPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO
            ================================================================ */}
        <section className="relative py-12 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#B30158]/10 rounded-full mx-auto flex items-center justify-center">
              <Play className="w-8 h-8 text-[#B30158]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Video Library
            </Heading>
            <Text className="text-xl text-gray-600">
              Watch our product overviews, installation guides, and customer testimonials 
              to learn everything about Mosquito Curtains.
            </Text>
          </Stack>
        </section>

        {/* ================================================================
            FEATURED VIDEO
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 rounded-3xl p-8 md:p-12">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Product Overview"
              variant="card"
            />
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFB701]" />
                <Text className="text-[#FFB701] font-semibold uppercase tracking-wider !mb-0">Featured</Text>
              </div>
              <Heading level={2}>Product Description in a Nutshell</Heading>
              <Text className="text-gray-600">
                In just 90 seconds, learn how our modular outdoor curtain system works and 
                why 92,000+ customers trust us to protect their outdoor spaces.
              </Text>
              <Button variant="primary" asChild className="w-fit">
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>
          </Grid>
        </section>

        {/* ================================================================
            VIDEO CATEGORIES
            ================================================================ */}
        {VIDEO_CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <HeaderBarSection key={category.id} icon={Icon} label={category.label} variant="dark">
              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
                {category.videos.map((video, idx) => (
                  <div key={idx} className="space-y-3">
                    <YouTubeEmbed
                      videoId={video.id}
                      title={video.title}
                      variant="card"
                    />
                    <div>
                      <Heading level={4} className="!mb-1">{video.title}</Heading>
                      <Text className="text-sm text-gray-600 !mb-0">{video.description}</Text>
                    </div>
                  </div>
                ))}
              </Grid>
            </HeaderBarSection>
          )
        })}

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
