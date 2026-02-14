'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Bug, Scissors, Award, Truck, Phone } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  TwoColumn,
  Frame,
  Text,
  Button,
  Card,
  Heading,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  PowerHeaderTemplate,
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  RN_HERO_ACTIONS,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

export default function WhyUsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">

        {/* Hero */}
        <PowerHeaderTemplate
          title="Why Buy Raw Netting From Us?"
          subtitle="We're not just a netting retailer -- we're manufacturers who use these exact materials in our own professional curtain products. The best reason to buy from us is the ideas we can share."
          videoId={VIDEOS.RAW_NETTING}
          videoTitle="Why Us For Raw Netting"
          variant="compact"
          actions={RN_HERO_ACTIONS}
        />

        {/* Key Differentiators */}
        <HeaderBarSection icon={Award} label="What Sets Us Apart" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src={`${IMG}/2019/09/Massive-Fabric-Rolls.jpg`}
                alt="Massive fabric rolls in our facility"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We only offer mesh netting that is going to last. We don't just buy netting and 
                resell it. We use these exact materials in our fabricated solutions -- mosquito 
                curtain panels, clear vinyl enclosures, shade screens, and more. When you buy from 
                us, you get the same marine-grade quality we put in our own products.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Manufacturers since 2003 -- not just resellers</ListItem>
                <ListItem variant="checked" iconColor="#406517">Same materials we use in our own products</ListItem>
                <ListItem variant="checked" iconColor="#406517">92,000+ customers served</ListItem>
                <ListItem variant="checked" iconColor="#406517">Expert advice on applications and rigging</ListItem>
                <ListItem variant="checked" iconColor="#406517">Custom fabrication available</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Key Advantages */}
        <HeaderBarSection icon={ShieldCheck} label="Key Advantages" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {[
              {
                icon: ShieldCheck,
                title: 'Marine-Grade Quality',
                desc: 'All our meshes are made for outdoor use. Solution dyed, UV resistant, and made to get wet. These are not cheap imports.',
              },
              {
                icon: Scissors,
                title: 'Very Wide Rolls',
                desc: 'Our rolls are 100" to 140" wide -- much wider than standard 54-60" fabric bolts. Less seaming needed for large projects.',
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                desc: 'Shipped in 3-7 business days anywhere in the US and Canada. We ship rolls via FedEx or UPS.',
              },
              {
                icon: Award,
                title: 'Expert Advice',
                desc: 'We\'ve seen thousands of creative applications. Call us and we can share ideas specific to your project.',
              },
              {
                icon: Phone,
                title: 'Real People',
                desc: 'Call us at (888) 264-2043. You\'ll talk to someone who actually knows the products and can help.',
              },
              {
                icon: Bug,
                title: 'Will Not Unravel',
                desc: 'Our lock stitch weave will not unravel when cut on any edge. Cut it to any shape you need.',
              },
            ].map((adv) => (
              <Card key={adv.title} variant="elevated" className="!p-5">
                <adv.icon className="w-7 h-7 text-[#406517] mb-3" />
                <Heading level={5} className="!mb-2">{adv.title}</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">{adv.desc}</Text>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Videos */}
        <HeaderBarSection icon={Bug} label="Overview Videos" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING} title="Why Us For Raw Netting" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Why Us For Raw Netting</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_FABRIC} title="Mesh Types Overview" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Mesh Types Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.MOSQUITO_NETTING_FABRIC} title="Optical Qualities" variant="card" />
              <Text className="text-center mt-2 font-medium text-sm">Optical Qualities</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* Ideas Section */}
        <HeaderBarSection icon={Scissors} label="The Best Reason: Ideas" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Over the years, we've seen virtually every possible application for raw netting. 
              From simple porch screens to complex agricultural systems to theatrical productions. 
              When you call us, we can share specific ideas for YOUR project based on what we've 
              seen work best.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              <div>
                <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_DIY} title="DIY Netting Projects" variant="card" />
                <Text className="text-center mt-2 font-medium text-sm">DIY Netting Projects</Text>
              </div>
              <div>
                <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_APPLICATIONS} title="Applications" variant="card" />
                <Text className="text-center mt-2 font-medium text-sm">Applications</Text>
              </div>
              <div>
                <YouTubeEmbed videoId={VIDEOS.RAW_NETTING_USES} title="Versatile Uses" variant="card" />
                <Text className="text-center mt-2 font-medium text-sm">Versatile Uses</Text>
              </div>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* WhyChooseUs */}
        <WhyChooseUsTemplate />

        {/* Quick Links */}
        <HeaderBarSection icon={Bug} label="Raw Netting Store Quick Links" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/order-mesh-netting-fabrics" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">1. See All Meshes</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Several Mesh Types & Colors</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/rigging" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">2. Rigging Ideas</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Helpful Ideas & Attachment Items</Text>
              </Link>
            </Card>
            <Card className="!p-5 text-center hover:shadow-md transition-shadow">
              <Link href="/raw-netting/custom" className="block">
                <Heading level={5} className="text-[#406517] !mb-1">3. Let Us Make It</Heading>
                <Text size="sm" className="text-gray-600 !mb-0">Ready to Hang Custom Panels</Text>
              </Link>
            </Card>
          </Grid>
        </HeaderBarSection>

        <FinalCTATemplate productLine="rn" />

      </Stack>
    </Container>
  )
}
