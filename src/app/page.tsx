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
Camera, Info} from 'lucide-react'

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
HeaderBarSection} from '@/lib/design-system'

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
    title: 'Mosquito Curtains',
    subtitle: 'Insect Protection',
    description: 'Custom insect curtains. Screen your patio in an afternoon.',
    href: '/screened-porch-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200-768x576.jpg',
    badge: 'Most Popular',
    color: '#406517',
    icon: Bug,
  },
  {
    title: 'Clear Vinyl Panels',
    subtitle: 'Weather Protection',
    description: 'Four-season room. Wind, rain, and cold stay outside.',
    href: '/clear-vinyl-plastic-patio-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200-768x576.jpg',
    badge: 'All Season',
    color: '#003365',
    icon: Snowflake,
  },
  {
    title: 'Raw Mesh Fabrics',
    subtitle: 'DIY Materials',
    description: 'Premium netting for custom projects. Up to 12ft wide.',
    href: '/raw-netting-fabric-store',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg',
    badge: 'DIY',
    color: '#B30158',
    icon: Scissors,
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
                <Link key={product.title} href={product.href} className="group">
                  <Card variant="elevated" hover className="h-full overflow-hidden !p-0 !rounded-2xl relative border-2 border-transparent hover:border-[#406517]/30 transition-all">
                    <Badge 
                      className="absolute top-3 left-3 z-10 !text-white"
                      style={{ backgroundColor: product.color, borderColor: product.color }}
                    >
                      {product.badge}
                    </Badge>
                    <Frame ratio="16/10">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Frame>
                    <Stack gap="xs" className="p-4">
                      <div className="flex items-center gap-2">
                        <product.icon className="w-4 h-4" style={{ color: product.color }} />
                        <Text size="xs" className="font-semibold uppercase tracking-wider !mb-0" style={{ color: product.color }}>
                          {product.subtitle}
                        </Text>
                      </div>
                      <Heading level={4} className="!text-lg group-hover:text-[#406517] transition-colors !mb-0">
                        {product.title}
                      </Heading>
                      <Text size="sm" className="text-gray-600 !mb-1">{product.description}</Text>
                      <div className="flex items-center font-semibold text-sm" style={{ color: product.color }}>
                        Learn more
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Stack>
                  </Card>
                </Link>
              ))}
            </Grid>
            
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
            PROFESSIONAL INSTALLERS - Using Template (edit in templates/ProfessionalsCalloutTemplate.tsx)
            ================================================================ */}
        <ProfessionalsCalloutTemplate />

        {/* ================================================================
            FINAL CTA - Using Template (edit in templates/FinalCTATemplate.tsx)
            ================================================================ */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Homepage Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                  alt="Bulk Mosquito Netting For Various Projects"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200-768x576.jpg"
                  alt="clear vinyl plastic winter enclosure panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg"
                  alt="Large mosquito netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg"
                  alt="Garage Screen Door"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1-300x225.jpg"
                  alt="Shade Fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Screen Patio Enclosures &amp; Clear Vinyl Plastic Enclosures" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Tired of cheap quality products that don’t work? Custom-crafted enclosures made to fit. Made to LAST!We’re the Original with over 70,000 happy clients since 2004. If you want a crap product, call someone else!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                alt="Bulk Mosquito Netting For Various Projects"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Winter Panels" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Create a Warm, Cozy Outdoor Weatherproof Space Sheltered From the Wind, Rain & Cold With Easy Installation Kits. Google Reviews
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg"
                alt="Large mosquito netting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Are you a professional?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Find out how to use our modular system to add a new profit center to your business!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Who We Are…" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are a small family business</Text>
              <Text className="text-gray-600">Dedicated to quality and service</Text>
              <Text className="text-gray-600">And making people happy</Text>
              <Text className="text-gray-600">Just like the good old days</Text>
              <Text className="text-gray-600">When humans answered the phone</Text>
              <Text className="text-gray-600">And a promise was as good as gold!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="What We Do…" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We custom-make Mosquito Curtains</Text>
              <Text className="text-gray-600">With exceptional marine-grade quality</Text>
              <Text className="text-gray-600">Offered at an affordable price</Text>
              <Text className="text-gray-600">Delivered in 3-8 business days</Text>
              <Text className="text-gray-600">That are easy-to-self-install</Text>
              <Text className="text-gray-600">So you can enjoy family time outdoors!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Screen Patio Enclosure  Benefits" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Are you sick of nasty mosquitoes hunting you and your family when you are trying to enjoy your porch or patio? Any area around your house with a covered roof can be converted into valuable outdoor living space or a screen porch with a mosquito netting curtain. A patio screen enclosure does much more than just add value to your home. Mosquito netting curtains add living space, enclose a gazebo, awning, houseboat, pergola, pontoon boat, porch, patio or anything with an overhead structure.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
