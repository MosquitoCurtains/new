'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Tent,
  Shield,
  Droplets,
  Package,
  Flame,
  Play,
  Table2,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'
import { VIDEOS, CAMPING_VIDEOS } from '@/lib/constants/videos'

export default function CampingNetPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Durable Multi-Purpose Camping Net"
          subtitle="Tired of thin fragile netting that doesn't last? Large sheets of super durable No-See-Um net that stows tight and weighs only 2.0 oz/sq yd. Perfect for endless camping applications."
          videoId={VIDEOS.CAMPING_NET_OVERVIEW}
          videoTitle="Camping Net Overview"
          thumbnailUrl="https://img.youtube.com/vi/HaKS6_QUEko/hqdefault.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            CONTENT SECTIONS
            ================================================================ */}
        
        {/* Section 1: Camping Net Applications */}
        <HeaderBarSection icon={Tent} label="Endless Camping Applications" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Tired of thin fragile netting that doesn't last? We offer large sheets of super durable 
                No-See-Um net that stows tight and weighs only 2.0 oz/sq yd. Perfect for endless camping 
                applications.
              </Text>
              <Text className="text-gray-600">
                Available in White and Black, our camping net is machine washable and built to withstand 
                the rigors of outdoor use. Have some wild idea? If you can think it, we can probably make it!
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Super durable No-See-Um mesh</ListItem>
                <ListItem variant="checked" iconColor="#406517">Lightweight: only 2.0 oz/sq yd</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available in White and Black</ListItem>
                <ListItem variant="checked" iconColor="#406517">Machine washable</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/mosquito-netting/let-us-make-it-for-you">
                    Let Us Make It For You
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/05/camping-splash-page-min.jpg"
                  alt="Camping net application"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2025/05/Camping-mesh-general-rigging-min.jpg"
                  alt="Camping mesh rigging"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Use Cases Gallery */}
        <HeaderBarSection icon={Package} label="Multi-Purpose Applications" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center">
              Our camping net can be used for countless applications. Here are just a few ideas to get you started:
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="pt-4">
              <div className="text-center">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden mb-3">
                  <img
                    src="https://img.youtube.com/vi/ojYpYC60_Ts/hqdefault.jpg"
                    alt="Camp with your car using netting"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-sm font-medium">Camp With Your Car</Text>
              </div>
              <div className="text-center">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden mb-3">
                  <img
                    src="https://img.youtube.com/vi/Tst-LLmkgyY/hqdefault.jpg"
                    alt="Shade cover with camping mesh"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-sm font-medium">Shade Cover</Text>
              </div>
              <div className="text-center">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden mb-3">
                  <img
                    src="https://img.youtube.com/vi/qJr6McdLpqE/hqdefault.jpg"
                    alt="Make a tent with camping net"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-sm font-medium">Make A Tent</Text>
              </div>
              <div className="text-center">
                <Frame ratio="1/1" className="rounded-xl overflow-hidden mb-3">
                  <img
                    src="https://img.youtube.com/vi/GPsN2H01M_I/hqdefault.jpg"
                    alt="Rain barrier with no-see-um mesh"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="text-sm font-medium">Rain Barrier</Text>
              </div>
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Section 3: Video Demonstrations (YouTubeEmbed uses YouTube auto thumbnails) */}
        <HeaderBarSection icon={Play} label="Camping Net Video Demonstrations" variant="dark">
          <Stack gap="lg">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              Watch our camping net videos to see the many ways you can use our durable No-See-Um netting 
              for your outdoor adventures.
            </Text>
            <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
              {CAMPING_VIDEOS.map((video) => (
                <div key={video.id}>
                  <YouTubeEmbed
                    videoId={video.id}
                    title={video.title}
                    variant="card"
                    thumbnailUrl={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  />
                  <Text className="text-center mt-2 font-medium text-sm">
                    {video.title}
                  </Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </HeaderBarSection>

        {/* Section 4: Product Features */}
        <HeaderBarSection icon={Shield} label="Premium Quality Features" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#406517]" />
              </div>
              <Text className="text-lg font-semibold mb-2">Multi-Purpose</Text>
              <Text className="text-sm text-gray-600">
                Looking for a quality mesh fabric that will protect you from no-see-ums and other insects? 
                Perhaps your project is for a purpose other than insects. Our mesh netting fabric can do just that.
              </Text>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#003365]/10 rounded-xl flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6 text-[#003365]" />
              </div>
              <Text className="text-lg font-semibold mb-2">100% Polyester</Text>
              <Text className="text-sm text-gray-600">
                Our Mosquito Netting Fabric is 100% polyester made for outdoors and made to get wet. 
                It dries quickly and maintains its integrity through countless uses.
              </Text>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <Text className="text-lg font-semibold mb-2">CA Fire Rated</Text>
              <Text className="text-sm text-gray-600">
                Netting Fabrics are CA fire rated (NFPA 701 small test) for added safety in various 
                applications and environments.
              </Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* No-See-Um Netting Specs Table (from WP) */}
        <HeaderBarSection icon={Table2} label="No-See-Um Netting Specs Table" variant="dark">
          <div className="flex justify-center">
            <a
              href="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/05/All-Mesh-Netting-Specifications-Table-New.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#406517]/50 transition-colors"
            >
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/05/All-Mesh-Netting-Specifications-Table-New.jpg"
                alt="No-See-Um and mesh netting specifications table"
                className="w-full h-auto max-w-4xl"
              />
            </a>
          </div>
          <Text className="text-center text-sm text-gray-500 mt-2">Click table to enlarge</Text>
        </HeaderBarSection>

        {/* Section: Material Specs */}
        <HeaderBarSection icon={Shield} label="Quality You Can Count On" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Sold by the Foot From Massive Rolls:</strong> Common bolts of fabric are 54-60" wide. 
                  OUR mesh fabric rolls are VERY WIDE from 100" - 140".
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Will Not Unravel On Edge:</strong> Our unique mesh netting weave is a "lock stitch" 
                  such that it will not unravel when cut.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  <strong>Solution Dyed:</strong> Netting materials are solution dyed for maximum fade resistance.
                </ListItem>
              </BulletedList>
              <div className="pt-4">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Contact Us: (770) 645-4745
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <div className="bg-[#406517]/5 border-2 border-[#406517]/20 rounded-2xl p-8">
              <Text className="text-xl font-bold text-center mb-6">Available Sizes</Text>
              <Grid responsiveCols={{ mobile: 2, tablet: 2 }} className="gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 8ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 10ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 12ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 14ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 16ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">10ft x 18ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">20ft x 20ft</Text>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Text className="font-semibold">30ft x 30ft</Text>
                </div>
              </Grid>
              <Text className="text-sm text-gray-500 text-center mt-4">
                Custom sizes also available
              </Text>
            </div>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            CLIENT REVIEWS (design-system template)
            ================================================================ */}
        <ClientReviewsTemplate />

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
