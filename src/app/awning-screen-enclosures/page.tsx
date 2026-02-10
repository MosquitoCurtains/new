'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Umbrella,
  Snowflake,
  Shield,
  Users,
  Bug,
  Wrench,
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
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/26-Tent-Awning-Screens-1200.jpg', alt: 'Awning screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/24-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tinted-Inside-1200.jpg', alt: 'Clear plastic enclosures for awnings' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/14-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/15-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/18-Tent-Awning-Screens-1200.jpg', alt: 'Tent and Awning Screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/28-Tent-Awning-Screens-1200.jpg', alt: 'Tent screen panels' },
]

export default function AwningScreenEnclosuresPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Awning Screen Enclosures"
          subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
          videoId="FqNe9pDsZ8M"
          videoTitle="Mosquito Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Umbrella} label="Client Installed Projects" variant="dark">
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

        <HeaderBarSection icon={Umbrella} label="Why Choose Our Awning Screens?" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Our attachment hardware is not clunky and complicated. It's much simpler.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We only use high quality Marine Grade mesh and thread that is more durable and will last longer.</ListItem>
                <ListItem variant="checked" iconColor="#406517">We are craftsmen who make a quality product that lasts! If we don't think it will work, we will tell you!</ListItem>
              </BulletedList>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/27-Tent-Awning-Screens-1200.jpg" alt="Awning insect curtains" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/30-Tent-Awning-Screens-1200.jpg" alt="Awning curtains" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Snowflake} label="Winterize Your Awning With Clear Vinyl Panels" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tinted-Inside-1200.jpg" alt="Clear vinyl awning" className="w-full h-full object-cover" />
              </Frame>
              <Frame ratio="4/3" className="rounded-xl overflow-hidden">
                <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/25-Clear-Vinyl-Red-Canvas-Tintes-400.jpg" alt="Clear vinyl panels" className="w-full h-full object-cover" />
              </Frame>
            </Grid>
            <Stack gap="md">
              <Text className="text-gray-600">
                Interchangeable with our Awning Screen Enclosures, Clear Vinyl Plastic Awning Panels will 
                winterize your awning from cold, rain & snow. Similar to what is used in restaurants, our 
                20 mil thick panels have the same attention to quality as our Awning Screen Enclosures.
              </Text>
              <Text className="text-gray-600 font-medium">
                Typical cost for 3-sided awning clear plastic panels on a 10ft x 20ft x 9ft tall Awning is 
                less than $1,700.
              </Text>
              <Button variant="outline" asChild>
                <Link href="/clear-vinyl-plastic-patio-enclosures">
                  See Clear Vinyl Options
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Only Quality Awning Screen Enclosures" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our most important concern is always quality. The cheap awning screens you may have seen at 
                home improvement stores are garbage. You can put your thumb right through it and it will fade 
                by the end of the season.
              </Text>
              <Text className="text-gray-600">
                <strong>Our netting is strong enough to lift a 240lb man.</strong> Even more, it is "solution 
                dyed" and materials are UV protected. It means that your curtains won't fade or rot prematurely. 
                All fasteners are stainless steel for lasting marine-grade quality.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Insect-Mesh-Holds-Up-240-LB-Man-1200.jpg" alt="Strong mosquito netting" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Users} label="Our Integrity Saves You Money" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Mosquito-Curtains-Team-1200.jpg" alt="Mosquito Curtains Team" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We like to say "We make people happy and then make awning screen enclosure solutions that they 
                will brag about." If you receive your product and it's not right, we will fix it immediately. 
                If you open the box and simply don't like what you see, we will refund your purchase (less shipping).
              </Text>
              <Text className="text-gray-600">
                We believe we can produce a quality product that will make people happy and leave work each day 
                knowing that we fulfilled that promise. Call us and you will hear unflinching passion. You'll 
                want to join over 92,000 others that are now part of our family of satisfied clients.
              </Text>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
