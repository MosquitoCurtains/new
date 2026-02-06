'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Award,
  Shield,
  Sun,
  Ruler,
  CheckCircle,
, Camera, Info} from 'lucide-react'
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
  YouTubeEmbed,
, TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function ClearVinylQualityPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Award className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              What Makes Our Clear Vinyl Better
            </Heading>
            <Text className="text-xl text-gray-600">
              Not all clear vinyl is created equal. Here's what sets our marine-grade 
              product apart from the competition.
            </Text>
          </Stack>
        </section>

        {/* Construction Video */}
        <YouTubeEmbed
          videoId={VIDEOS.CLEAR_VINYL_CONSTRUCTION}
          title="Clear Vinyl Panel Construction"
          variant="card"
        />

        {/* The Vinyl */}
        <HeaderBarSection icon={Shield} label="Premium 30-Gauge Marine Vinyl" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Premium-Vinyl.jpg"
                alt="Premium marine vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We use only premium 30-gauge marine-grade clear vinyl. This is the same 
                material used on high-end boats and yachts - designed to withstand harsh 
                outdoor conditions year after year.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">30-gauge thickness (thicker than most competitors)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Crystal clear optical quality</ListItem>
                <ListItem variant="checked" iconColor="#406517">Flexible in cold weather</ListItem>
                <ListItem variant="checked" iconColor="#406517">Marine-grade durability</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* UV Protection */}
        <HeaderBarSection icon={Sun} label="UV Inhibitors" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Cheap vinyl yellows and clouds quickly when exposed to sunlight. Our vinyl 
                contains UV inhibitors that:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Prevent yellowing over time</ListItem>
                <ListItem variant="checked" iconColor="#406517">Maintain crystal clarity for years</ListItem>
                <ListItem variant="checked" iconColor="#406517">Protect against UV degradation</ListItem>
                <ListItem variant="checked" iconColor="#406517">Extend product lifespan significantly</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/UV-Protection.jpg"
                alt="UV protected vinyl"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </HeaderBarSection>

        {/* Sunbrella Borders */}
        <HeaderBarSection icon={Ruler} label="Sunbrella Fabric Borders" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Sunbrella-Border.jpg"
                alt="Sunbrella fabric border"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our clear vinyl panels are bordered with genuine Sunbrella marine fabric - 
                the same material used in awnings and marine applications worldwide.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Genuine Sunbrella brand fabric</ListItem>
                <ListItem variant="checked" iconColor="#406517">Fade-resistant colors</ListItem>
                <ListItem variant="checked" iconColor="#406517">Water and mildew resistant</ListItem>
                <ListItem variant="checked" iconColor="#406517">Professional finished appearance</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Hardware */}
        <HeaderBarSection icon={CheckCircle} label="Marine-Grade Hardware" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">YKK Zippers</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                The world's most trusted zipper brand. Marine-rated for salt and moisture resistance.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">Stainless Steel</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                All metal components are stainless steel - no rust, no corrosion, no failure.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <Heading level={4} className="!mb-4">DOT Snaps</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Industrial-grade DOT snaps rated for marine use. Same as used on boat covers.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Comparison */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-6 text-center">Our Quality vs. Discount Alternatives</Heading>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Feature</th>
                  <th className="text-center py-3 font-semibold text-[#406517]">Mosquito Curtains</th>
                  <th className="text-center py-3 font-semibold text-gray-400">Discount Brands</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Vinyl Thickness</td>
                  <td className="text-center text-[#406517] font-medium">30 Gauge</td>
                  <td className="text-center text-gray-400">12-20 Gauge</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">UV Inhibitors</td>
                  <td className="text-center text-[#406517] font-medium">Yes</td>
                  <td className="text-center text-gray-400">Rarely</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Border Fabric</td>
                  <td className="text-center text-[#406517] font-medium">Sunbrella</td>
                  <td className="text-center text-gray-400">Generic polyester</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Zippers</td>
                  <td className="text-center text-[#406517] font-medium">YKK Marine</td>
                  <td className="text-center text-gray-400">Generic plastic</td>
                </tr>
                <tr>
                  <td className="py-3">Expected Lifespan</td>
                  <td className="text-center text-[#406517] font-medium">10+ Years</td>
                  <td className="text-center text-gray-400">2-3 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Experience the Difference</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Quality costs a little more upfront but saves money in the long run. Get a 
            quote for premium clear vinyl that will last.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=clear_vinyl">
                Get Clear Vinyl Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/clear-vinyl">
                Learn More About Clear Vinyl
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="What Makes Product Better Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do-768x576.jpg"
                  alt="What Makes Product Better"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/MOSQUITO-CURTAINS-CLEAR-VINYL-EXAMPLE-2400-768x576.jpg"
                  alt="What Makes Product Better"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Meticulous-Clear-Vinyl-Construction-1920-1024x576.jpg"
                  alt="What Makes Product Better"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Shade-Fabric-400x300-1.jpg"
                  alt="Shade Fabric"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Meticulous Construction Quality at a Better Price" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Our Clear Vinyl Construction – Video</Text>
              <BulletedList>
                <li>We have a perimeter webbing all double-stitched with UV protected marine-grade thread.</li>
                <li>We add a special hidden tape to prevent stitching from perforating the plastic you will never know is even there. Why? Because we know it matters years from now.</li>
                <li>We have excellent automation that enables us to keep our costs much lower with perfect stitching.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Smarter Fastening System" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This is NOT our Product

This is What We Do
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do-768x576.jpg"
                alt="Smarter Fastening System"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Meticulous-Clear-Vinyl-Construction-1920-1024x576.jpg"
            alt="Better Quality Clear Vinyl Enclosure Materials"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="When We Will Recommend Another Provider" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Essentially, we will recommend a competing product if we think their product will fulfill your objectives better than ours. Why? Unlike any other custom-made providers, we offer a NO REASON guarantee (full refund less all shipping costs) within a limited time. We do not sell what we believe won’t work, frankly because we don’t want to frustrate you, see our hard work tossed in a dumpster, and lose money at the same time. The good news is it almost never happens. That’s why folks trust us for solid answers. Here are circumstances:</Text>
              <BulletedList>
                <li>Very Large openings with little or no structural support. Sometimes you just need the clunky hardware others offer for severe wind loads</li>
                <li>Motorized Clear Vinyl Panels. They are incredible when done right but must be professionally installed and they cost a fortune. BE CAREFUL on these.</li>
                <li>For temperatures below -15° F (-26° C). You need a special supplier of 40 mil to avoid what is called cold cracking</li>
                <li>For those that want an overhead roof panel, Awning companies are better equipped for waterproofing roof panels that will drain properly.</li>
                <li>We want you to shop around because we are sassy and know we offer the best value.</li>
                <li>Hint: If you want to compare us, try your local awning company or check more online.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="More About Motorized Clear Vinyl Systems" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We do not offer Motorized Clear Vinyl Systems because they do not fit our business model of self-install. They tend to cost about 8 times our price, but if you have that kind of money, they are fantastic if done right. Most are remote controlled with automatic wind sensors. Push a button and whoosh! up and down they go. Just remember that it is a mechanical system that takes strong wind loads. Make sure it is a robust mechanism or the required framing could bend and become inoperable. Also, as we’ve mentioned, clear vinyl is prone to shrinking in the very hot sun and motorized systems can tolerate very little little size variance. Ask a LOT of questions to your provider and vet them carefully.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="We Really Do Want You Happy" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Remember the good old days when business was about more than just parting customers from their wallets? Once upon a time there were craftsmen who self-actualized through the quality of their work and their reputations. That’s who we want to be! We want to be a reliable source for solid answers. It just makes us feel great at the end of each day.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Protect your porch or patio from winter weather with quality Clear Vinyl Enclosures made to last. Because we have a smarter design and ordering process, we can offer clear vinyl enclosures at a much lower cost.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Uses For Clear Vinyl Enclosures" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Used in combination with a space heater, clear vinyl enclosures will insulate your outdoor space creating a cozy environment for you, your family, outdoor pets and plants that you do not want damaged by frost.</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
