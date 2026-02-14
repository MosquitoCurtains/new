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
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-1200.jpg', alt: 'Weather enclosures for patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200.jpg', alt: 'Clear Vinyl Enclosure Moss Green Canvas Patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/82-Screen-Patio-Enclosure-1200.jpg', alt: 'Screen Porch Enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10_Plastic-Drop-Panels-Patio-Inside-View-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels Patio Inside View Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Plastic-Enclosures-Royal-Blue-Canvas-Dairy-Queen-1200.jpg', alt: 'Plastic Enclosures Royal Blue Canvas Dairy Queen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Plastic-Enclosures-Royal-Blue-Canvas-Dairy-Queen-1200.jpg', alt: 'Plastic Enclosures Royal Blue Canvas Dairy Queen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200.jpg', alt: 'Clear Vinyl Enclosure Moss Green Canvas Patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-1200.jpg', alt: 'Plastic Panels for Screened Patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Small-Business-Plastic-Panels-On-Patio-With-Black-Canvas-1200.jpg', alt: 'Small Business Plastic Panels On Patio With Black Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/81-Screen-Patio-Enclosure-1200.jpg', alt: 'Screen Porch Enclosure' },
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
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Quick-Installation-With-Simple-Tools.jpg" alt="Quick DIY installation" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Sparkle} label="Permanent Screened Patio… or Elegant Mosquito Netting Curtains?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200.jpg" alt="Screen patio enclosure" className="w-full h-full object-cover" />
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
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg" alt="Durable mosquito netting" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg" alt="Quality screen sewing" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
