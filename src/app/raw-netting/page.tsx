'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Sun,
  Factory,
  Theater,
  Wrench,
  Scissors,
  Play,
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
  YouTubeEmbed,
} from '@/lib/design-system'
import { RAW_NETTING_VIDEOS } from '@/lib/constants/videos'

const NETTING_TYPES = [
  {
    title: 'Mosquito Netting',
    description: 'Classic mosquito mesh available by the yard or roll. Perfect for DIY projects.',
    href: '/raw-netting/mosquito-net',
    icon: Bug,
  },
  {
    title: 'No-See-Um Netting',
    description: 'Finer mesh to block tiny biting midges. Essential for coastal areas.',
    href: '/raw-netting/no-see-um',
    icon: Bug,
  },
  {
    title: 'Shade Mesh',
    description: 'Provides shade, privacy, and insect protection. Multi-purpose outdoor fabric.',
    href: '/raw-netting/shade-mesh',
    icon: Sun,
  },
  {
    title: 'Theatre Scrim',
    description: 'Lightweight theatrical netting for stage productions and events.',
    href: '/raw-netting/scrim',
    icon: Theater,
  },
  {
    title: 'Industrial Mesh',
    description: 'Heavy-duty netting for agricultural, industrial, and commercial applications.',
    href: '/raw-netting/industrial',
    icon: Factory,
  },
]

export default function RawNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Scissors className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Raw Netting & Mesh
            </Heading>
            <Text className="text-xl text-gray-600">
              Premium netting and mesh fabrics sold by the yard or roll. Perfect for DIY 
              projects, custom applications, and bulk orders.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project?mode=quote">
                  Get a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/raw-netting/custom">
                  Custom Orders
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* Netting Types */}
        <HeaderBarSection icon={Bug} label="Netting Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {NETTING_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Card key={type.title} variant="elevated" className="!p-6 hover:shadow-lg transition-shadow">
                  <Link href={type.href} className="block">
                    <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#406517]" />
                    </div>
                    <Heading level={4} className="!mb-2">{type.title}</Heading>
                    <Text className="text-gray-600 mb-4 !text-sm">{type.description}</Text>
                    <span className="text-[#406517] font-medium text-sm inline-flex items-center">
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </Link>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* Video Demonstrations */}
        <HeaderBarSection icon={Play} label="Raw Netting Videos" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Watch our videos to learn about our raw netting products, materials, and how to use them for your projects.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
              {RAW_NETTING_VIDEOS.map((video) => (
                <div key={video.id}>
                  <YouTubeEmbed
                    videoId={video.id}
                    title={video.title}
                    variant="card"
                  />
                  <Text className="text-center mt-2 font-medium text-sm">
                    {video.title}
                  </Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Why Buy From Us */}
        <HeaderBarSection icon={Wrench} label="Why Buy Netting From Us?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Raw-Netting-Roll.jpg"
                alt="Raw netting rolls"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We're not just a netting retailer - we're manufacturers who use these exact 
                materials in our own professional curtain products.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Same quality we use in our products</ListItem>
                <ListItem variant="checked" iconColor="#406517">Bulk pricing available</ListItem>
                <ListItem variant="checked" iconColor="#406517">Cut to any length you need</ListItem>
                <ListItem variant="checked" iconColor="#406517">Expert advice on applications</ListItem>
                <ListItem variant="checked" iconColor="#406517">Fast shipping nationwide</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Resources */}
        <HeaderBarSection icon={Wrench} label="Helpful Resources" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/hardware" className="block">
                <Heading level={5} className="!mb-2">Attachment Hardware</Heading>
                <Text className="text-sm text-gray-600 !mb-2">
                  Grommets, snaps, velcro, and more for attaching your netting.
                </Text>
                <span className="text-[#406517] text-sm font-medium">View Hardware</span>
              </Link>
            </Card>
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/rigging" className="block">
                <Heading level={5} className="!mb-2">Fasteners & Rigging</Heading>
                <Text className="text-sm text-gray-600 !mb-2">
                  Ideas for fastening and rigging your netting projects.
                </Text>
                <span className="text-[#406517] text-sm font-medium">View Ideas</span>
              </Link>
            </Card>
            <Card className="!p-4 hover:shadow-md transition-shadow">
              <Link href="/raw-netting/custom" className="block">
                <Heading level={5} className="!mb-2">Custom Orders</Heading>
                <Text className="text-sm text-gray-600 !mb-2">
                  Let us make it for you - custom cut, sewn, and finished.
                </Text>
                <span className="text-[#406517] text-sm font-medium">Learn More</span>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Why Choose Us */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Help Choosing?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Not sure which netting is right for your project? Contact us and we'll 
            help you find the perfect material.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting/why-us">
                Why Choose Us
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
