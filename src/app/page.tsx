'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Wrench, 
  Phone,
  Users,
  Heart,
  Sparkles,
  Check,
  Award,
  Bug,
  Snowflake,
  Scissors,
  Ruler,
  Package,
  Home,
  MessageSquare,
  Zap,
  Target,
} from 'lucide-react'

import { 
  Container, 
  Stack,
  Grid,
  TwoColumn,
  Frame,
  Inline,
  Cover,
  Card, 
  FeatureCard,
  ItemListCard,
  Heading,
  Text,
  Title,
  BulletedList,
  ListItem,
  Button,
  YouTubeEmbed,
  Badge,
  OfferStack,
  GoogleReviews,
  // Templates - Pre-built content blocks
  WhyChooseUsTemplate,
  HowItWorksTemplate,
  WhoWeAreWhatWeDoTemplate,
  FinalCTATemplate,
  ProfessionalsCalloutTemplate,
} from '@/lib/design-system'

// ============================================================================
// HOMEPAGE - Mosquito Curtains
// 
// Modern design with VibrationFit-style patterns:
// - Gradient-bordered section cards
// - FlowCards for process visualization
// - SwipeableCards for testimonials
// - OfferStack for features
// - Centered layouts with generous spacing
// ============================================================================

const products = [
  {
    productName: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    badge: 'Most Popular',
    title: 'Keep mosquitoes out (so you can actually use your porch)',
    oneLiner: 'Enjoy summer evenings outside without getting eaten alive by bugs.',
    bullets: [
      'Stops mosquitoes and bugs, no harsh chemicals',
      'Soft mesh that opens like a curtain for easy in & out',
      'Looks like it came with the house, not a cheap tent',
    ],
    proof: 'Thousands of porches protected since 2003.',
    buttonText: 'I Want Bug Protection',
    href: '/screened-porch-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200.jpg',
    icon: Bug,
    color: '#406517',
  },
  {
    productName: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    badge: 'All-Weather Comfort',
    title: 'Block wind, cold, and pollen',
    oneLiner: 'Turn your porch or patio into a cozy 3-season room. Enjoy your outdoor space year-round.',
    bullets: [
      'Clear vinyl panels block cold drafts and rain',
      'Keep pollen and dust out while you keep the view',
      'Great for exposed porches, patios, and restaurants',
    ],
    proof: 'Used on homes, lake houses, and restaurant patios.',
    buttonText: 'I Want Weather Protection',
    href: '/clear-vinyl-plastic-patio-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg',
    icon: Snowflake,
    color: '#003365',
  },
  {
    productName: 'Raw Mesh Fabric',
    subtitle: 'DIY Materials',
    badge: 'DIY Projects',
    title: 'I just want quality netting for my own project',
    oneLiner: 'Buy the same mosquito netting we use (by the foot from massive rolls) for your own ideas.',
    bullets: [
      'Perfect for gardens, campers, boats, beds, and more',
      'Cut-to-length, multiple colors and grades',
      'Higher quality than big-box store netting',
    ],
    proof: 'Loved by tinkerers, makers, and hobbyists.',
    buttonText: "I'm Doing a DIY Project",
    href: '/raw-netting-fabric-store',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200.jpg',
    icon: Scissors,
    color: '#B30158',
  },
]

export default function HomePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            COMBINED HERO + PRODUCTS
            ================================================================ */}
        <section className="relative">
          {/* Background blurs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>
          
          {/* Main container with gradient border */}
          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            
            {/* Hero Content - Centered */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              {/* Trust Badge */}
              <Badge variant="primary" className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">
                <Sparkles className="w-4 h-4 mr-2" />
                {ORDERS_SERVED_STRINGS.trustedBy}
              </Badge>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Transform Your Outdoor Living Space
              </h1>
              
              {/* Subheadline */}
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Custom-crafted screen enclosures and clear vinyl panels. 
                Marine-grade quality. DIY installation in an afternoon.
              </p>
              
              {/* CTA */}
              <div className="pt-1">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/start-project">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
              <div className="text-center px-4">
                <Heading level={3} className="!text-lg !mb-0 text-gray-900">Choose Your Solution</Heading>
                <Text size="sm" className="text-gray-500 !mb-0">Custom-made to your exact measurements</Text>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
            </div>
            
            {/* Product Cards */}
            <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
              {products.map((product) => (
                <Link key={product.productName} href={product.href} className="group">
                  <Card variant="elevated" hover className="h-full overflow-hidden !p-0 !rounded-2xl relative border-2 border-transparent hover:border-[#406517]/30 transition-all">
                    {/* Badge */}
                    <Badge
                      className="absolute top-3 left-3 z-10 !text-white"
                      style={{ backgroundColor: product.color, borderColor: product.color }}
                    >
                      {product.badge}
                    </Badge>

                    {/* Image */}
                    <Frame ratio="4/3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Frame>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2">
                      {/* Product label */}
                      <div className="flex items-center gap-2">
                        <product.icon className="w-4 h-4" style={{ color: product.color }} />
                        <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                          {product.subtitle}
                        </Text>
                      </div>
                      <Heading level={4} className="!text-base md:!text-lg group-hover:text-[#406517] transition-colors !mb-0 leading-snug">
                        {product.productName}
                      </Heading>

                      {/* Benefit-driven title */}
                      <Text size="sm" className="font-medium text-gray-800 !mb-0 leading-snug">
                        {product.title}
                      </Text>

                      {/* One-liner */}
                      <Text size="sm" className="text-gray-600 italic !mb-0">
                        &ldquo;{product.oneLiner}&rdquo;
                      </Text>

                      {/* Bullets */}
                      <ul className="space-y-1.5 mt-1">
                        {product.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0 mt-0.5" />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      {/* Micro-proof */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{product.proof}</span>
                      </div>

                      {/* CTA button */}
                      <div className="mt-2 w-full rounded-lg py-2 px-4 text-center text-sm font-semibold text-white transition-all group-hover:opacity-90"
                        style={{ backgroundColor: product.color }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {product.buttonText}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>

            {/* Microcopy under cards */}
            <p className="text-center text-sm text-gray-500 mt-6 max-w-xl mx-auto">
              Most homeowners choose Bug Protection or Weather Protection.
              If you&apos;re not sure, start there. You can always change your mind.
            </p>
          </div>
        </section>

        {/* ================================================================
            WHY CHOOSE US - Using Template (edit in templates/WhyChooseUsTemplate.tsx)
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            HOW IT WORKS - Using Template (edit in templates/HowItWorksTemplate.tsx)
            ================================================================ */}
        <HowItWorksTemplate />

        {/* ================================================================
            WHO WE ARE / WHAT WE DO - Using Template (edit in templates/WhoWeAreWhatWeDoTemplate.tsx)
            ================================================================ */}
        <WhoWeAreWhatWeDoTemplate />

        {/* ================================================================
            WHAT'S INCLUDED - OfferStack
            ================================================================ */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 to-[#003365]/5 border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="flex flex-col items-center">
              <div className="text-center mb-6">
                <Heading level={2} className="text-gray-900 !mb-2">What's Included With Every Order</Heading>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Everything you need for a successful installation. No hidden costs, no surprises.
                </p>
              </div>
              
              <div className="w-full max-w-3xl mx-auto mb-6">
                <OfferStack
                  items={[
                    {
                      id: 'custom-curtains',
                      title: 'Custom-Made Curtains',
                      description: 'Made to your exact measurements. Every panel is cut and sewn specifically for your space.',
                      icon: Scissors,
                      included: true
                    },
                    {
                      id: 'hardware-kit',
                      title: 'Complete Hardware Kit',
                      description: 'All mounting hardware, tracks, snaps, and fasteners included. Nothing extra to buy.',
                      icon: Wrench,
                      included: true
                    },
                    {
                      id: 'installation-guide',
                      title: 'Step-by-Step Installation Guide',
                      description: 'Detailed instructions with photos and videos. Plus phone support if you get stuck.',
                      icon: Target,
                      included: true
                    },
                    {
                      id: 'quality-guarantee',
                      title: 'Quality Guarantee',
                      description: 'Marine-grade materials built to last. If anything goes wrong, we make it right.',
                      icon: Shield,
                      included: true
                    },
                    {
                      id: 'phone-support',
                      title: 'Real Human Support',
                      description: 'Call us anytime. A real person answers the phone - not a robot.',
                      icon: Phone,
                      included: true
                    },
                  ]}
                  defaultExpanded={['custom-curtains', 'hardware-kit']}
                  allowMultiple={true}
                />
              </div>
              
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Free Instant Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================================
            MOSQUITO CURTAINS - Detailed Section
            ================================================================ */}
        <section>
          <div className="bg-white border-[#406517]/20 border-2 rounded-3xl overflow-hidden relative">
            {/* Full-width Header */}
            <div className="bg-[#406517] px-6 py-4 flex items-center gap-3">
              <Bug className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Insect Protection</span>
            </div>
            
            <div className="p-6 md:p-8 lg:p-10 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#406517]/5 rounded-full blur-3xl -z-10" />
              
              <TwoColumn gap="lg" className="items-center">
                <Stack gap="md">
                  <Heading level={2} className="!text-2xl md:!text-3xl text-gray-900">
                    Screen Patio Enclosure Benefits
                  </Heading>
                <Text className="text-gray-600">
                  Are you sick of nasty mosquitoes hunting you and your family when you're trying 
                  to enjoy your porch or patio? Any area around your house with a covered roof can 
                  be converted into valuable outdoor living space.
                </Text>
                <Text className="text-gray-600">
                  A patio screen enclosure does much more than just add value to your home. 
                  Mosquito netting curtains add living space, enclose a gazebo, awning, houseboat, 
                  pergola, pontoon boat, porch, patio or anything with an overhead structure.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#406517">Ready-to-hang custom insect curtains</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Easy DIY installation kits included</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Marine-grade quality materials</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Multiple mesh options available</ListItem>
                </BulletedList>
                <div className="pt-2">
                  <Button variant="primary" asChild>
                    <Link href="/screened-porch-enclosures">
                      Learn More About Mosquito Curtains
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Stack>
              <YouTubeEmbed
                videoId="FqNe9pDsZ8M"
                title="Mosquito Curtains Description"
                duration="1:30"
                variant="card"
                thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
              />
            </TwoColumn>
            </div>
          </div>
        </section>

        {/* ================================================================
            CLEAR VINYL - Detailed Section
            ================================================================ */}
        <section>
          <div className="bg-white border-[#003365]/20 border-2 rounded-3xl overflow-hidden relative">
            {/* Full-width Header */}
            <div className="bg-[#003365] px-6 py-4 flex items-center gap-3">
              <Snowflake className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Weather Protection</span>
            </div>
            
            <div className="p-6 md:p-8 lg:p-10 relative">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#003365]/5 rounded-full blur-3xl -z-10" />
              
              <TwoColumn gap="lg" className="items-center">
                <YouTubeEmbed
                  videoId="ca6GufadXoE"
                  title="Clear Vinyl Description"
                  duration="1:44"
                  variant="card"
                />
                <Stack gap="md">
                  <Heading level={2} className="!text-2xl md:!text-3xl text-gray-900">
                    Clear Vinyl Plastic Enclosure Kits
                  </Heading>
                <Text className="text-gray-600">
                  You may have seen these in restaurants to create warm patio weather enclosures. 
                  Our mosquito netting curtains are interchangeable with our clear plastic panels 
                  so that you can enjoy your patio in all seasons.
                </Text>
                <Text className="text-gray-600">
                  Made from a thick double polished marine grade vinyl, these outdoor plastic panels 
                  will keep you warm and dry during the winter months. Perfect for extending your 
                  outdoor living season year-round.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#003365">Interchangeable with mosquito curtains</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Double polished marine-grade vinyl</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Weatherproof wind, rain & cold protection</ListItem>
                  <ListItem variant="checked" iconColor="#003365">Same easy installation system</ListItem>
                </BulletedList>
                <div className="pt-2">
                  <Button variant="secondary" asChild>
                    <Link href="/clear-vinyl-plastic-patio-enclosures">
                      Learn More About Clear Vinyl
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Stack>
            </TwoColumn>
            </div>
          </div>
        </section>

        {/* ================================================================
            RAW MESH FABRICS - Detailed Section
            ================================================================ */}
        <section>
          <div className="bg-white border-[#B30158]/20 border-2 rounded-3xl overflow-hidden relative">
            {/* Full-width Header */}
            <div className="bg-[#B30158] px-6 py-4 flex items-center gap-3">
              <Scissors className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">DIY Materials</span>
            </div>
            
            <div className="p-6 md:p-8 lg:p-10 relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#B30158]/5 rounded-full blur-3xl -z-10" />
              
              <TwoColumn gap="lg" className="items-center">
                <Stack gap="md">
                  <Heading level={2} className="!text-2xl md:!text-3xl text-gray-900">
                    Mosquito Netting Fabric
                  </Heading>
                <Text className="text-gray-600">
                  Sometimes you have a unique project for which you only want raw mosquito netting 
                  fabric to fashion your own solution. Our quality is unmatched unlike cheap 
                  mosquito netting you may have seen on aluminum gazebos at home improvement stores.
                </Text>
                <Text className="text-gray-600">
                  Our netting is often used in agriculture, HVAC filter screens, and even as theater 
                  scrim material. We have different fabric weaves for privacy screens, shade screens, 
                  and no-see-um screens.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#B30158">Lock stitched - will not unravel when cut</ListItem>
                  <ListItem variant="checked" iconColor="#B30158">Solution dyed for fade resistance</ListItem>
                  <ListItem variant="checked" iconColor="#B30158">UV thread protection</ListItem>
                  <ListItem variant="checked" iconColor="#B30158">Jumbo sizes up to 12ft wide x ANY length</ListItem>
                  <ListItem variant="checked" iconColor="#B30158">Multiple mesh types: Mosquito, No-See-Um, Shade, Scrim</ListItem>
                </BulletedList>
                <div className="pt-2">
                  <Button variant="accent" asChild>
                    <Link href="/raw-netting-fabric-store">
                      Shop Raw Mesh Fabric
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Stack>
              <YouTubeEmbed
                videoId="WOLgWm9UMq4"
                title="Mesh Fabric Description"
                duration="1:54"
                variant="card"
              />
            </TwoColumn>
            </div>
          </div>
        </section>

        {/* ================================================================
            FEATURED PROJECTS GALLERY
            ================================================================ */}
        <section>
          <div className="bg-white border-gray-200 border-2 rounded-3xl overflow-hidden">
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
              <Award className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg uppercase tracking-wider">Featured Client Projects</span>
            </div>
            <div className="p-6 md:p-8">
              <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
                {[
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200.jpg', alt: 'Screened porch with mosquito netting curtains' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/82-Screen-Patio-Enclosure-1200.jpg', alt: 'Custom screen patio enclosure' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Mosquito-Netting-on-Gazebo-1200.jpg', alt: 'Gazebo screen curtains installation' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/22-Pergola-Screen-Panels-1200.jpg', alt: 'Pergola screen panels by Mosquito Curtains' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200.jpg', alt: 'Garage door screen enclosure' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg', alt: 'Clear vinyl winter panels for porch' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Mosquito-Mesh-Boat-Screens-Pontoon-1200.jpg', alt: 'Pontoon boat mosquito screens' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/46-Screened-In-Deck-1200.jpg', alt: 'Screened in deck enclosure' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Tent-Awning-Screens-1200.jpg', alt: 'Tent and awning screen enclosure' },
                  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Industrial-Netting-Applications-NASA-1200.jpg', alt: 'Industrial netting application' },
                ].map((img, idx) => (
                  <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Frame>
                ))}
              </Grid>
              <div className="flex justify-center pt-6">
                <Button variant="outline" asChild>
                  <Link href="/gallery">
                    See Full Gallery
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            APPLICATIONS - Where our products are used
            ================================================================ */}
        <section>
          <div className="bg-gradient-to-br from-[#406517]/5 to-transparent border-[#406517]/20 border-2 rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="text-center mb-8">
              <Heading level={2} className="text-gray-900 !mb-2">One System, Limitless Applications</Heading>
              <Text className="text-gray-600 max-w-2xl mx-auto !mb-0">
                Our custom-made modular panel system works on virtually any structure with an overhead covering. 
                Porches, patios, gazebos, pergolas, garages, boats, and more.
              </Text>
            </div>
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {[
                { title: 'Porches', href: '/screened-porch', icon: Home },
                { title: 'Patios', href: '/screen-patio', icon: Home },
                { title: 'Gazebos', href: '/gazebo-screen-curtains', icon: Home },
                { title: 'Pergolas', href: '/pergola-screen-curtains', icon: Home },
                { title: 'Garages', href: '/garage-door-screens', icon: Home },
                { title: 'Boats', href: '/boat-screens', icon: Home },
                { title: 'Decks', href: '/screened-in-decks', icon: Home },
                { title: 'Awnings', href: '/awning-screen-enclosures', icon: Home },
              ].map((app) => (
                <Link key={app.title} href={app.href} className="group">
                  <Card variant="elevated" hover className="text-center !p-4 h-full">
                    <app.icon className="w-6 h-6 text-[#406517] mx-auto mb-2" />
                    <Text className="font-semibold text-gray-900 !mb-0 group-hover:text-[#406517] transition-colors">{app.title}</Text>
                  </Card>
                </Link>
              ))}
            </Grid>
          </div>
        </section>

        {/* ================================================================
            PROFESSIONAL INSTALLERS - Using Template (edit in templates/ProfessionalsCalloutTemplate.tsx)
            ================================================================ */}
        <ProfessionalsCalloutTemplate />

        {/* ================================================================
            FINAL CTA - Using Template (edit in templates/FinalCTATemplate.tsx)
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
