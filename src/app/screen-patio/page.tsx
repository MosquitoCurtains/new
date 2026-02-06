'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Bug,
  Award,
  Wrench,
  Sparkle,
  Shield,
, Camera, Info} from 'lucide-react'
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
  MC_HERO_ACTIONS,
, Card} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Screen patio enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/82-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Screened patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/83-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Patio screen ideas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/76-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Patio enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/60-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Screen patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/47-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Patio screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/39-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Screened in patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/40-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Patio curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/86-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Screen patio enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/71-Screen-Patio-Enclosure-1200-1024x768.jpg', alt: 'Patio bug screens' },
]

export default function ScreenPatioPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Screened Patio Enclosures"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Bug} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.map((img, idx) => (
              <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Frame>
            ))}
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="outline" asChild>
              <Link href="/gallery">See Full Gallery<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </HeaderBarSection>

        <HeaderBarSection icon={Bug} label="Custom Fitted Screen Patio Enclosures" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Are Mosquitos sucking away your good time outside? There is nothing more viscerally maddening 
                than to see a nasty blood sucker gnawing on a child's forehead. All that is about to change! 
                Your solution will be made with top quality custom-fitted insect curtains.
              </Text>
              <Text className="text-gray-600">
                Why custom-fitted? Because every patio is different and one size never fits all. Without the 
                right fit, you don't get the correct seal. A screen patio enclosure doesn't need to be 
                complicated or expensive.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Heavy Mosquito Netting for mosquitoes, gnats and black flies.</ListItem>
                <ListItem variant="checked" iconColor="#406517">No-see-um Mesh designed to keep out tiny midge flies near coastal areas.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Shade Mesh to provide shade privacy & biting insect protection.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Available in black, white & Ivory.</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed videoId="ZjxrDItgV8w" title="Custom Fitted Screen Patio Enclosures" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Award} label="Quality Quality and More Quality" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <YouTubeEmbed videoId="KmobG8rofx0" title="Quality Mosquito Netting" variant="card" />
            <Stack gap="md">
              <Text className="text-gray-600">
                This isn't common netting. We have been through over a dozen iterations to get our netting 
                to the lasting quality you deserve. Work with a company that takes pride in old-fashioned 
                craftsmanship.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">100% polyester is the best outdoor fabric and it is made to get wet.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Solution dyed, so the mesh will NOT fade.</ListItem>
                <ListItem variant="checked" iconColor="#406517">All sewing is double stitched with UV protected marine-grade materials.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Smarter automation enables perfect stitching.</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Wrench} label="DIY Installation Has Advantages Beyond Cost Savings" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">You have control and save installation costs. You know how it works and can troubleshoot wind issues.</ListItem>
                <ListItem variant="checked" iconColor="#406517">It is about a level 3 of 10 on the DIY scale. If you still aren't into DIY, any handyman can install for you.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Easily take down & re-hang seasonally, or swap out with our weather enclosure panels.</ListItem>
              </BulletedList>
              <Button variant="primary" asChild><Link href="/install">See Installation Guide<ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Quick-Installation-With-Simple-Tools-1024x576.jpg" alt="Quick DIY installation" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Sparkle} label="Permanent Screened Patio… or Elegant Mosquito Netting Curtains?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg" alt="Screen patio enclosure" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/81-Screen-Patio-Enclosure-1200-400x300-1.jpg" alt="Screen patio enclosure" className="w-full h-full object-cover" />
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
                and hang with minimal DIY skills. <strong>This 25ft project cost under $650 all-in.</strong>
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Unique Craftsmanship & Usability" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our most important concern is always quality. The cheap gazebo screens you may have seen on 
                aluminum gazebos at home improvement stores are garbage. <strong>Our netting is strong enough 
                to lift a 240lb man.</strong>
              </Text>
              <Text className="text-gray-600">
                All fasteners are stainless steel and our tracking hardware is powder-coated aluminum. It is 
                "solution dyed" such that the thread is colored and UV protected to its core.
              </Text>
              <Button variant="outline" asChild><Link href="/satisfaction-guarantee">See Our Guarantee<ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg" alt="Durable mosquito netting" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg" alt="Quality screen sewing" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Screen Patio Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="21 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/82-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="Screen Porch Enclosure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/83-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="Screened patio ideas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/76-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="76 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/60-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="60 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/47-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="47 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/39-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="39 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/40-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="40 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/86-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="Screen Patio Enclosure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/71-Screen-Patio-Enclosure-1200-1024x768.jpg"
                  alt="71 Screen Patio Enclosure 1200"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/86-Screen-Patio-Enclosure-400.jpg"
                  alt="Screen Patio Enclosure"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/85-Screen-Patio-Enclosure-1200-400x300-1.jpg"
                  alt="Screen Patio Enclosure"
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

        <HeaderBarSection icon={Info} label="Ordering" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Our team will help plan your project!</Text>
              <Text className="text-gray-600">10% Off Sale until Feb 14th… Coupon = Midwinter26</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Get Started Fast With a Real Person!" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We are happy to help you plan your project with a quick planning session. For maximum speed and efficiency, photos of your space are extremely helpful. Click the buttons below to see photo guidelines. If you have a general question, call us at (770) 645-4745.</Text>
              <BulletedList>
                <li>Please provide 2-4 high resolution photos that show all complete sides of your project.</li>
                <li>Step BACK and zoom OUT so we can see as much as possible. No close-ups.</li>
                <li>Large file sizes – Small images do not provide enough resolution for planning sessions.</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Good Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? We can see each full side with fastening surfaces in each high resolution photo.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Good-1-Big-1024x768.jpg"
                alt="Good Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Bad Photos" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Why? They are too close up so we can’t see ALL fastening surfaces and corner transitions.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/Bad-2-Big-1024x768.jpg"
                alt="Bad Photos"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Quick Connect Form" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Fill and a planner will connect to discuss your project!</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Permanent Screened Porch… or Elegant Mosquito Netting Curtains?" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Nasty bloodsuckers ruining your family time outdoors this season? Screening your patio doesn’t need to be complicated or expensive or permanent! Now, there is a low cost elegant solution that you can install in an afternoon. Mosquito Netting Curtains patio screen enclosure system are custom-made to your specifications and hang with minimal DIY skills. If you can operate a tape measure and handle a few household tools, you can be enjoying your insect free patio in less than a week. This 25ft project cost under $650 all-in.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg"
                alt="Screen Porch Enclosure"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Uniquely Different Porch Screen Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Think super quality marine-grade mosquito netting, custom cut to any shape, bound on all sides with a sturdy webbing. You have the option of hanging your curtains using our overhead tracking system or by a fixed Velcro® attachment to save even more. Sides are fastened using stainless steel marine snaps and doorways seal with freakishly strong rare-earth magnets.

Need Shade Screen Protection? We also offer a shade screen mesh that blocks insects & harsh sunlight!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/86-Screen-Patio-Enclosure-400.jpg"
                alt="Screen Patio Enclosure"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
