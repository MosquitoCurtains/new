'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Tent,
  Layers,
  Sun,
  Snowflake,
  Shield,
  Bug,
  Award,
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
  WhyChooseUsTemplate,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/096-White-Mosquito-Netting-Curtains-1200.jpg', alt: 'white mosquito net fabric' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/17-Mosquito-Netting-on-Gazebo-1200.jpg', alt: 'gazebo screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Mosquito-Netting-on-Gazebo-1200.jpg', alt: 'gazebo screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Gazebo-1200.jpg', alt: 'Clear vinyl for gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/07-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Gazebo-1200.jpg', alt: 'plastic panels for gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/123-White-Mosquito-Netting-Curtains-1200.jpg', alt: 'white porch curtains' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Clear-Vinyl-Enclosure-Moss-Green-Canvas-Gazebo-1200.jpg', alt: 'Winterize gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Gazebo-Clear-Vinyl-Plastic-Porch-Enclosure-Red.jpg', alt: 'Clear Vinyl Plastic enclosure for Gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Mosquito-Netting-on-Gazebo-1200.jpg', alt: 'Cost to screen gazebo' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/18-Mosquito-Netting-on-Gazebo-1200.jpg', alt: 'Cost to screen gazebo' },
]

export default function GazeboScreenCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Gazebo Screen Enclosures"
          subtitle="Modular Gazebo Curtains custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Tent} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
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

        <HeaderBarSection icon={Shield} label="Gazebo Screen Curtains Made To Last" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We custom-make marine grade quality Outdoor Gazebo Screen Curtains using mosquito netting that is 
                10x stronger than tissue paper thin materials stamped out in China that do not last.
              </Text>
              <Text className="text-gray-600">
                Our black curtains are crystal clear to look through and will not fade (solution dyed) and is 
                strong enough to lift our heaviest 240lb employee. If you are tired of the low quality gazebo 
                screens, we can help.
              </Text>
              <Card className="!p-4 !bg-amber-50 !border-amber-200">
                <Text className="text-sm text-amber-800 !mb-0">
                  <strong>Looking For Cheap Replacement Screens?</strong> Sorry, not us. Try gardenwinds.com or wayfair.com
                </Text>
              </Card>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden"><img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Mosquito-Netting-on-Screen-Porch-1200.jpg" alt="Elegant enclosure" className="w-full h-full object-cover" /></Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden"><img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg" alt="Super strength" className="w-full h-full object-cover" /></Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Layers} label="Top Attachment Options For Gazebo Curtains" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-3">Tracking Top Attachment</Heading>
              <Text className="text-gray-600 !mb-0">
                Enables you to slide the curtains side to side, creating decorative "swags" when gazebo curtains 
                are pulled back.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <Heading level={4} className="!mb-3">Velcro Top Attachment</Heading>
              <Text className="text-gray-600 !mb-0">
                Top will not slide. More common and less expensive. Panels are fixed in place though you may 
                still create magnetic doorways.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Sun} label="Other Gazebo Screen Mesh Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full mb-4 flex items-center justify-center">
                <Sun className="w-6 h-6 text-amber-600" />
              </div>
              <Heading level={4} className="!mb-2">Shade Mesh</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Blocks biting insects and also blocks 80% of sunlight. Outstanding clarity (inside looking out).
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                <Tent className="w-6 h-6 text-blue-600" />
              </div>
              <Heading level={4} className="!mb-2">No-See-Um Screen Mesh</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                For tiny midge flies generally found near large bodies of water. About as big as a ridge and a 
                half of your fingerprint.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full mb-4 flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-cyan-600" />
              </div>
              <Heading level={4} className="!mb-2">Clear Vinyl Winter Panels</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Want a weatherproof gazebo? They are interchangeable with our screens and use the same fasteners. 
                Swap them out seasonally.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Text className="text-lg text-gray-700 !mb-0">
            We believe we can produce a quality product that will make people happy. Call us and you will hear 
            unflinching passion. You'll want to join the <strong>92,000+ others</strong> that are now part of 
            our family of satisfied clients.
          </Text>
        </Card>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
