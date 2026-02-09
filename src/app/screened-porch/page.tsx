'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Award,
  Wrench,
  Sparkle,
  Shield,
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
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  // MC Hero Actions - Edit in MCHeroActions.tsx
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

// Gallery images from WordPress
const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/055-White-Mosquito-Netting-Curtains-1200.jpg', alt: '055 White Mosquito Netting Curtains 1200' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200.jpg', alt: 'Winterized Porch and Patio Enclosure Black' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg', alt: 'Clear Plastic Winter Panels Porch Gray' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tintes-400.jpg', alt: 'Clear Vinyl Red Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/6-Navy-Clear-Vinyl-Enclosure.jpg', alt: 'Navy Clear Vinyl Enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/35-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Porch-1200.jpg', alt: 'Plastic Enclosure With Cocoa Brown Canvas Porch' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Clear-Plastic-Porch-Enclosure-With-No-Canvas-1200.jpg', alt: 'Clear Plastic Porch Enclosure With No Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09_Plastic-Drop-Panels-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/7-Navy-Clear-Vinyl-Enclosure.jpg', alt: 'Navy Clear Vinyl Enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Clear-Plastic-With-No-Canvas-1200.jpg', alt: 'Clear Plastic With No Canvas' },
]

export default function ScreenedPorchPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            Edit actions in: src/lib/design-system/templates/MCHeroActions.tsx
            ================================================================ */}
        <PowerHeaderTemplate
          title="Screened Porch Enclosures"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            CLIENT GALLERY
            ================================================================ */}
        <HeaderBarSection icon={Bug} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.slice(0, 10).map((img, idx) => (
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
        </HeaderBarSection>

        {/* ================================================================
            CONTENT SECTIONS
            ================================================================ */}
        
        {/* Section 1: Custom Fitted */}
        <HeaderBarSection icon={Bug} label="Custom Fitted Screen Porch Enclosures" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Are Mosquitos sucking away your good time outside? There is nothing more viscerally maddening 
                than to see a nasty blood sucker gnawing on a child's forehead. All that is about to change! 
                Your solution will be made with top quality custom-fitted insect curtains.
              </Text>
              <Text className="text-gray-600">
                Why custom-fitted? Because every porch is different and one size never fits all. Without the 
                right bug screen fit, you don't get the correct seal. A screen patio enclosure doesn't need 
                to be complicated or expensive.
              </Text>
              <Text className="text-gray-600">
                In fact, our Mosquito Curtain porch enclosure system is about 1/4 of the cost of a permanent 
                framed screened porch enclosure with a tracking option that enables you to slide curtains 
                open in lovely decorative swags.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Heavy Mosquito Netting for mosquitoes, gnats and black flies.</ListItem>
                <ListItem variant="checked" iconColor="#406517">No-see-um Mesh designed to keep out tiny midge flies near coastal areas.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Shade Mesh to provide shade privacy & biting insect protection.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available in black, white & Ivory.</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="ZjxrDItgV8w"
              title="Custom Fitted Screen Porch Enclosures"
              variant="card"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Overview-Thumbnail.jpg"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Quality */}
        <HeaderBarSection icon={Award} label="Quality Quality and More Quality" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <YouTubeEmbed
              videoId="KmobG8rofx0"
              title="Quality Mosquito Netting"
              variant="card"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Quality-Thumbnail.jpg"
            />
            <Stack gap="md">
              <Text className="text-gray-600">
                This isn't common netting. We have been through over a dozen iterations to get our netting 
                to the lasting quality you deserve. Work with a company that takes pride in old-fashioned 
                craftsmanship. If we thought we could design a better net, we already would have done so!
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Anyone who knows will tell you 100% polyester is the best outdoor fabric and it is made to get wet.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution dyed, so the mesh will NOT fade.</ListItem>
                <ListItem variant="checked" iconColor="#406517">All sewing is double stitched with UV protected marine-grade materials down to the thread we use to stitch.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Smarter automation enables perfect stitching. We believe in quality and efficiency to create the best possible value.</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 3: DIY Installation */}
        <HeaderBarSection icon={Wrench} label="DIY Installation Advantages" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600 text-lg font-medium">
                DIY has advantages beyond cost savings:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">
                  You have control and save installation costs. You know how it works and can troubleshoot wind issues.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  It is about a level 3 of 10 on the DIY scale. If you still aren't into DIY, any handyman can install for you.
                </ListItem>
                <ListItem variant="checked" iconColor="#406517">
                  Easily take down & re-hang seasonally, or swap out with our weather enclosure panels.
                </ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/install">
                    See Installation Guide
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Quick-Installation-With-Simple-Tools.jpg"
                alt="Quick DIY installation with simple tools"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 4: Comparison */}
        <HeaderBarSection icon={Sparkle} label="Permanent vs. Mosquito Netting Curtains" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200.jpg"
                  alt="Screen patio enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg"
                  alt="Screen patio enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600">
                Nasty bloodsuckers ruining your family time outdoors this season? Screening your patio doesn't 
                need to be complicated or expensive or permanent! Now, there is a low cost elegant solution 
                that you can install in an afternoon.
              </Text>
              <Text className="text-gray-600">
                Mosquito Netting Curtains patio screen enclosure system are custom-made to your specifications 
                and hang with minimal DIY skills. If you can operate a tape measure and handle a few household 
                tools, you can be enjoying your insect free patio in less than a week. <strong>This 25ft project cost 
                under $650 all-in.</strong>
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 5: Craftsmanship */}
        <HeaderBarSection icon={Shield} label="Unique Craftsmanship & Usability" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our most important concern is always quality. The cheap gazebo screens you may have seen on 
                aluminum gazebos at home improvement stores are garbage. You can put your thumb right through 
                it and it fades by the end of the season. <strong>Our netting is strong enough to lift a 240lb man.</strong>
              </Text>
              <Text className="text-gray-600">
                All fasteners are stainless steel and our tracking hardware is powder-coated aluminum. Even more, 
                it is "solution dyed" such that the thread is colored and UV protected to its core. It means 
                that your curtains won't fade or rot prematurely.
              </Text>
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/satisfaction-guarantee">
                    See Our Guarantee
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg"
                  alt="Durable mosquito netting holds 240lb man"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg"
                  alt="Quality screen sewing"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
