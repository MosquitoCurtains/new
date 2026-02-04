'use client'

import Link from 'next/link'
import { ArrowRight, Play, CheckCircle, Settings, Palette, SlidersHorizontal } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  YouTubeEmbed,
  TwoColumn,
  Frame,
  Badge,
} from '@/lib/design-system'
import { FinalCTATemplate } from '@/lib/design-system/templates'

// Mesh types data
const MESH_TYPES = [
  {
    name: 'Heavy Mosquito Mesh',
    subtitle: '(90% Choose This in Black)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White', 'Ivory'],
    description: 'Our most popular mesh. Perfect for mosquitoes, gnats, and black flies.',
  },
  {
    name: 'No-See-Um Mesh',
    subtitle: '(For Tiny Biting Flies)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Square-Noseeum-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White'],
    description: 'Finer weave blocks tiny midge flies common near coastal areas.',
  },
  {
    name: 'Shade Mesh',
    subtitle: '(For Shade & Projection)',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Sqaure-Heavy-Shade-Mesh-Mosquito-Netting-500x500.jpg',
    colors: ['Black', 'White'],
    description: 'Provides shade privacy and insect protection. Also works as projection screen.',
  },
]

// Hardware videos
const HARDWARE_VIDEOS = [
  { id: '5dWUpGj6lYc', title: 'Marine Snaps in under 90 Seconds' },
  { id: 'QaRUVjmJKEY', title: 'Magnetic Doorways in under 90 Seconds' },
  { id: 'dbW9Xp3_InM', title: 'Stucco Strips in under 90 Seconds' },
]

export default function OptionsPage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Hero */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 border-2 border-[#406517]/20 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Your Options
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                This page gives you an overview of your options and a basic understanding of our 
                simple attachment hardware. Use the sections below to learn about each topic.
              </p>
            </div>

            {/* Overview Steps */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <Stack gap="sm">
                <div className="flex items-center gap-3">
                  <Badge className="!bg-[#406517] !text-white !border-0">1</Badge>
                  <Text className="font-medium">Choose Your Mesh Type & Color</Text>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="!bg-[#003365] !text-white !border-0">2</Badge>
                  <Text className="font-medium">Choose Your Top Attachment Preference</Text>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="!bg-[#B30158] !text-white !border-0">3</Badge>
                  <Text className="font-medium">Understand Our Simple Attachment Hardware</Text>
                </div>
              </Stack>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project">
                  Start Your Project
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
        </section>

        {/* Overview Video */}
        <section>
          <div className="max-w-4xl mx-auto">
            <YouTubeEmbed
              videoId="L9YDJOknbZ8"
              title="Planning Overview"
              variant="card"
            />
          </div>
        </section>

        {/* Step 1: Mesh Types */}
        <section id="mesh-types">
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#406517] px-6 py-4 flex items-center gap-3">
              <Palette className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Step 1: Know Your Mesh Type & Color
              </span>
            </div>
            <div className="p-6 md:p-10">
              <Text className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                Your project will be made up of mesh panels in your choice of mesh type and color. 
                Over 90% of orders choose <strong>Black Heavy Mosquito Mesh</strong>. All materials 
                are durable outdoor polyester, made to get wet and will not fade.
              </Text>

              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
                {MESH_TYPES.map((mesh, idx) => (
                  <Card key={idx} variant="elevated" className="!p-0 overflow-hidden text-center">
                    <Frame ratio="1/1">
                      <img
                        src={mesh.image}
                        alt={mesh.name}
                        className="w-full h-full object-cover"
                      />
                    </Frame>
                    <div className="p-4">
                      <Heading level={4} className="!mb-1">{mesh.name}</Heading>
                      <Text size="sm" className="text-[#406517] font-medium !mb-2">
                        {mesh.subtitle}
                      </Text>
                      <Text size="sm" className="text-gray-500 !mb-3">
                        {mesh.description}
                      </Text>
                      <div className="flex justify-center gap-2">
                        {mesh.colors.map((color) => (
                          <span 
                            key={color}
                            className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </div>
          </div>
        </section>

        {/* Step 2: Top Attachment */}
        <section id="top-attachment">
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#003365] px-6 py-4 flex items-center gap-3">
              <SlidersHorizontal className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Step 2: Two Top Attachment Options
              </span>
            </div>
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <Stack gap="xs">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#406517]" />
                    <Text><strong>Tracking Attachment</strong> allows you to slide curtains from side to side.</Text>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#406517]" />
                    <Text><strong>Velcro Attachment</strong> is fixed in place and doesn't slide.</Text>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#406517]" />
                    <Text>Both are easy to install. Velcro is less expensive (no track hardware).</Text>
                  </div>
                </Stack>
              </div>

              <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
                <Card variant="elevated" className="!p-0 overflow-hidden text-center">
                  <Frame ratio="16/9">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Track-480-Optimized-1.gif"
                      alt="Tracking attachment demonstration"
                      className="w-full h-full object-contain bg-gray-100"
                    />
                  </Frame>
                  <div className="p-4">
                    <Heading level={4} className="!mb-1">Tracking System</Heading>
                    <Text size="sm" className="text-gray-500">
                      Slides side-to-side like elegant drapes
                    </Text>
                  </div>
                </Card>
                <Card variant="elevated" className="!p-0 overflow-hidden text-center">
                  <Frame ratio="16/9">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Velcro-480-Optimized.gif"
                      alt="Velcro attachment demonstration"
                      className="w-full h-full object-contain bg-gray-100"
                    />
                  </Frame>
                  <div className="p-4">
                    <Heading level={4} className="!mb-1">Velcro Attachment</Heading>
                    <Text size="sm" className="text-gray-500">
                      Fixed in place, most affordable option
                    </Text>
                  </div>
                </Card>
              </Grid>
            </div>
          </div>
        </section>

        {/* Step 3: Hardware Videos */}
        <section id="hardware">
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <div className="bg-[#B30158] px-6 py-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">
                Step 3: Understand Our Simple Attachment Hardware
              </span>
            </div>
            <div className="p-6 md:p-10">
              <Text className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                One of our biggest focal points is the ease of installation and usability of your 
                curtains. We use versatile components like marine snaps and magnetic doorways. 
                Each video is under 90 seconds - watch them to understand how your curtains will operate.
              </Text>

              <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
                {HARDWARE_VIDEOS.map((video) => (
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
            </div>
          </div>
        </section>

        {/* Photo Guidelines */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-2 border-[#406517]/20 rounded-3xl p-6 md:p-10">
            <div className="text-center mb-8">
              <Heading level={2} className="!mb-2">Ready to Get Started?</Heading>
              <Text className="text-gray-600 max-w-2xl mx-auto">
                We're happy to help you plan your project with a quick planning session. For maximum 
                speed and efficiency, photos of your space are extremely helpful.
              </Text>
            </div>

            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card variant="elevated" className="!p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-[#406517] flex-shrink-0 mt-0.5" />
                  <div>
                    <Heading level={4} className="!mb-1">Good Photos</Heading>
                    <Text size="sm" className="text-gray-500">
                      Step BACK, zoom OUT. We need to see full sides with fastening surfaces.
                    </Text>
                  </div>
                </div>
                <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="sm">
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                      alt="Good photo example 1"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-2-Big-1024x768.jpg"
                      alt="Good photo example 2"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                </Grid>
              </Card>
              <Card variant="outlined" className="!p-6 !border-red-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">✕</span>
                  </div>
                  <div>
                    <Heading level={4} className="!mb-1">Bad Photos</Heading>
                    <Text size="sm" className="text-gray-500">
                      Too close up - we can't see all fastening surfaces and corner transitions.
                    </Text>
                  </div>
                </div>
                <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="sm">
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden opacity-60">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-1-Big-1024x768.jpg"
                      alt="Bad photo example 1"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                  <Frame ratio="4/3" className="rounded-lg overflow-hidden opacity-60">
                    <img
                      src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                      alt="Bad photo example 2"
                      className="w-full h-full object-cover"
                    />
                  </Frame>
                </Grid>
              </Card>
            </Grid>

            <div className="flex justify-center pt-8">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <Heading level={3} className="text-center !mb-6">Want to See More First?</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Link href="/install">
              <Card variant="outlined" hover className="!p-6 text-center">
                <Play className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                <Heading level={4}>See a Full Installation</Heading>
                <Text size="sm" className="text-gray-500">Watch videos of complete installs</Text>
              </Card>
            </Link>
            <Link href="/gallery">
              <Card variant="outlined" hover className="!p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-[#003365]">📸</div>
                <Heading level={4}>Client Gallery</Heading>
                <Text size="sm" className="text-gray-500">See completed projects</Text>
              </Card>
            </Link>
            <Link href="/reviews">
              <Card variant="outlined" hover className="!p-6 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-[#FFA501]">⭐</div>
                <Heading level={4}>Reviews</Heading>
                <Text size="sm" className="text-gray-500">What customers are saying</Text>
              </Card>
            </Link>
          </Grid>
        </section>

        {/* Final CTA */}
        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
