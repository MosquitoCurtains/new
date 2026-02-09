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
  TreePine,
  Tent,
  Building,
  Play,
  Calculator,
  MessageSquare,
  Bug,
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
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  YouTubeEmbed,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/23-Winterized-Porch-and-Patio-Enclosure-Black-1200.jpg', alt: 'Winterized Porch and Patio Enclosure Black' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/05-Plastic-Enclosures-Royal-Blue-Canvas-Dairy-Queen-1200.jpg', alt: 'Plastic Enclosures Royal Blue Canvas Dairy Queen' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/35-Plastic-Enclosure-With-Cocoa-Brown-Canvas-Porch-1200.jpg', alt: 'Plastic Enclosure With Cocoa Brown Canvas Porch' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tintes-400.jpg', alt: 'Clear Vinyl Red Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Clear-Plastic-Porch-Enclosure-With-No-Canvas-1200.jpg', alt: 'Clear Plastic Porch Enclosure With No Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Patio-1200.jpg', alt: 'Clear Vinyl Enclosure Moss Green Canvas Patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/10_Plastic-Drop-Panels-Patio-Inside-View-Forest-Green-Canvas-1200.jpg', alt: 'Plastic Drop Panels Patio Inside View Forest Green Canvas' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/11/6-Navy-Clear-Vinyl-Enclosure.jpg', alt: 'Navy Clear Vinyl Enclosure' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Plastic-Porch-and-Patio-Enclosures-Sandy-Tan-1200.jpg', alt: 'Weather enclosures for patio' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Clear-Plastic-Winter-Panels-Porch-Gray-1200.jpg', alt: 'Clear Plastic Winter Panels Porch Gray' },
]

const PROJECT_TYPES = [
  { title: 'Porches', icon: Home },
  { title: 'Patios', icon: Layers },
  { title: 'Restaurants', icon: Building },
  { title: 'Pergolas', icon: TreePine },
  { title: 'Gazebos', icon: Tent },
  { title: 'Pavilions', icon: Home },
]

const CLEAR_VINYL_HERO_ACTIONS = [
  {
    icon: Play,
    title: 'Options',
    description: 'Thickness, colors & accessories.',
    href: '/clear-vinyl-options',
    buttonText: 'Discover',
    color: '#406517',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Get an estimate within 5% of actual cost.',
    href: '/start-project',
    buttonText: 'Calculate',
    color: '#003365',
  },
  {
    icon: MessageSquare,
    title: 'Contact',
    description: 'Send photos for personalized help!',
    href: '/contact',
    buttonText: 'Contact',
    color: '#B30158',
  },
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
          actions={CLEAR_VINYL_HERO_ACTIONS}
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
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
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
              <Card key={type.title} className="!p-4 text-center">
                <type.icon className="w-8 h-8 mx-auto mb-2 text-[#406517]" />
                <Heading level={5} className="!mb-0">{type.title}</Heading>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        <Card className="!p-8 !bg-[#003365] text-white text-center">
          <Heading level={2} className="!mb-4 text-white">Clear Vinyl Plastic Porch Enclosures</Heading>
          <Text className="text-white/90 max-w-3xl mx-auto !mb-6">
            Are you wasting usable living space in your own home? Think about the possibilities if that porch 
            or patio wasn't so cold in the winter. A cozy dinner outside, board games with the kids, a hangout 
            for football games, or maybe just a good smooch on a porch swing during a snow storm.
          </Text>
          <Text className="text-white font-semibold !mb-0">
            Congratulations! You just found a needle in a haystack and the best Quality / Price anywhere!
          </Text>
        </Card>

        <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
          <Card variant="elevated" className="!p-4">
            <Button variant="primary" className="w-full" asChild>
              <Link href="/what-makes-our-clear-vinyl-product-better">Why Our System?</Link>
            </Button>
          </Card>
          <Card variant="elevated" className="!p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/clear-vinyl-self-installation-advantages">Self-Installation</Link>
            </Button>
          </Card>
          <Card variant="elevated" className="!p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/satisfaction-guarantee">Guarantee</Link>
            </Button>
          </Card>
        </Grid>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
