'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  Award,
  Wrench,
  Layers,
  Shield,
  Home,
  Camera,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  TwoColumn,
  Frame,
  BulletedList,
  ListItem,
  WhyChooseUsTemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  CV_HERO_ACTIONS,
} from '@/lib/design-system'
import { ClearVinylFooter } from '@/components/marketing/ClearVinylFooter'

// Gallery images matched exactly to WordPress /clear-vinyl-plastic-patio-enclosures/
const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg', alt: 'Clear vinyl plastic winter enclosure panels' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/22-Small-Business-Plastic-Panels-On-Patio-With-Black-Canvas-1200.jpg', alt: 'Small Business Plastic Panels On Patio With Black Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Winterized-Porch-Plastic-Panels-Black-Canvas-1200.jpg', alt: 'Winterized Porch Plastic Panels Black Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200.jpg', alt: 'DIY Winter Porch Enclosures are a great way to protect porch and patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Gazebo-Clear-Vinyl-Plastic-Porch-Enclosure-Red.jpg', alt: 'Clear Vinyl Plastic enclosure for Gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Clear-Vinyl-Panels-Porch-Chocolate-Brown-1200.jpg', alt: 'How to keep snow off porch with clear plastic curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Pavilion-1200.jpg', alt: 'Plastic Enclosure With Cocoa Brown Canvas Pavilion' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06_Plastic-Drop-Panels-On-Restaurant-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels On Restaurant Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01_Plastic-Drop-Panels-On-Porch-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels On Porch Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200.jpg', alt: 'Weatherproofing porch from wind and rain' },
]

// Project type images from WordPress /clear-vinyl-plastic-patio-enclosures/
const PROJECT_TYPES = [
  { title: 'Porches', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-1.jpg' },
  { title: 'Patios', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Bar-2-200x117-1.jpg' },
  { title: 'Restaurants', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-3.jpg' },
  { title: 'Pergolas', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-4.jpg' },
  { title: 'Gazebos', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-6.jpg' },
  { title: 'Pavilions', image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Bar-5.jpg' },
]

export default function ClearVinylPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Clear Vinyl Plastic Enclosures"
          subtitle="Modular Clear Vinyl Panels custom-made to fit any space. One system, limitless applications."
          videoId="ca6GufadXoE"
          videoTitle="Clear Vinyl Overview"
          thumbnailUrl="https://i.ytimg.com/vi/ca6GufadXoE/maxresdefault.jpg"
          variant="compact"
          actions={CV_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Snowflake} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.map((img, idx) => (
              <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Frame>
            ))}
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="outline" asChild>
              <Link href="/gallery/clear-vinyl">See Full Gallery<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </HeaderBarSection>

        <HeaderBarSection icon={Award} label="Meticulous Construction Quality at a Better Price" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">We have a perimeter webbing all double-stitched with UV protected marine-grade thread.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We add a special hidden tape to prevent stitching from perforating the plastic you will never know is even there.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We have excellent automation that enables us to keep our costs much lower with perfect stitching.</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed videoId="KTrkT6DHm9k" title="Clear Vinyl Panel Construction" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Wrench} label="There Are Advantages to Self-Installation" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Quick-Clear-Vinyl-Panel-Installation-1920.jpg" alt="Quick installation" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">It is about a 4 out of 10 for DIY skills. Folks take pride in their own accomplishment.</ListItem>
                <ListItem variant="checked" iconColor="#406517">Other systems use hardware so complicated to remove, no one removes them and they don't LAST!</ListItem>
                <ListItem variant="checked" iconColor="#406517">You know how it works and can easily troubleshoot wind issues. You have more control!</ListItem>
                <ListItem variant="checked" iconColor="#406517">Initial installation for a 40ft wide enclosure in about 4-6 hours.</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Better Quality Clear Vinyl Enclosure Materials" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">We have rare 72" (tall) goods vs most who have only 54" goods. Larger seamless windows!</ListItem>
                <ListItem variant="checked" iconColor="#406517">We do not heat weld panels together because it is the first thing to fail.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We don't use cheap $2.85/yd plastic canvas aprons that look industrial and cheap.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We use a waterproof canvas similar to a classy Gortex-like material that costs us $10.64/yd.</ListItem>
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Meticulous-Clear-Vinyl-Construction-1920.jpg" alt="Quality construction" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Smarter Fastening System" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6 !bg-red-50 !border-red-200">
              <Heading level={4} className="!mb-3 text-red-800">This is NOT our Product</Heading>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do.jpg" alt="What not to do" className="w-full h-full object-cover" />
              </Frame>
            </Card>
            <Card variant="elevated" className="!p-6 !bg-green-50 !border-green-200">
              <Heading level={4} className="!mb-3 text-green-800">This is What We Do</Heading>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/MOSQUITO-CURTAINS-CLEAR-VINYL-EXAMPLE-2400.jpg" alt="Our quality" className="w-full h-full object-cover" />
              </Frame>
            </Card>
          </Grid>
          <Text className="text-gray-600 text-center mt-4">
            Our system is simple and not intrusive. If it is easy to hang and remove, you will be more inclined 
            to remove them during the hot summer sun that will damage panels prematurely. <strong>Sometimes 
            complicated & expensive isn't better!</strong>
          </Text>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Interchangeable With Our Summer Mosquito Curtains" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600 text-center max-w-3xl mx-auto">
              We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Panels that will enable you 
              to enjoy family time just outside your own home. Best of all, the two products are entirely 
              <strong> removable & interchangeable</strong> such that you can <strong>swap them out in the 
              Spring and Fall</strong>.
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-3.jpg" alt="Summer panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Summer Insect Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-4.jpg" alt="Winter panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Winter Weather Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Mosquito-Netting-Interchangeable-1-1200.jpg" alt="Summer panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Summer Insect Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Interchangeable-1-1200.jpg" alt="Winter panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Winter Weather Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-1.jpg" alt="Summer insect panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Summer Insect Panels</Text>
              </Stack>
              <Stack gap="sm">
                <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                  <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/06/Interchangeable-Mosquito-Curtain-Clear-Vinyl-2.jpg" alt="Winter weather panels" className="w-full h-full object-cover" />
                </Frame>
                <Text className="text-xs text-center text-gray-500">Winter Weather Panels</Text>
              </Stack>
            </Grid>
          </Stack>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="See Our Products In Action" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3}>Versatile Outdoor Solutions</Heading>
              <Text className="text-gray-600">
                Our clear vinyl panels work beautifully on boats, porches, and patios. 
                See how our canvas and netting products protect outdoor spaces in all conditions.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/start-project">Get Your Custom Quote<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
            <YouTubeEmbed videoId="WE2RuQfehiw" title="Boat & Canvas Netting Solutions" variant="card" />
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Home} label="We Do All Types Of Enclosures - Residential & Commercial" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
            {PROJECT_TYPES.map((type) => (
              <Card key={type.title} className="!p-3 text-center">
                <div className="rounded-lg overflow-hidden mb-2">
                  <img src={type.image} alt={type.title} className="w-full h-auto" />
                </div>
                <Heading level={5} className="!mb-0 uppercase tracking-wider !text-sm">{type.title}</Heading>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Camera} label="How to Get Started" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3}>Get Started Fast With a Real Person!</Heading>
              <Text className="text-gray-600">
                We are happy to help you plan your project with a quick planning session.
                For maximum speed and efficiency, photos of your space are extremely helpful.
              </Text>
              <Text className="text-gray-600">
                <strong>If you have a general question, call us at{' '}
                <a href="tel:7706454745" className="text-[#406517] underline">(770) 645-4745</a>.</strong>
              </Text>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Send Us Photos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/work-with-a-planner">
                    Work With A Planner
                  </Link>
                </Button>
              </div>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2024/11/Planner-Image-1920.jpg"
                alt="Our planning team"
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <ClearVinylFooter />

      </Stack>
    </Container>
  )
}
