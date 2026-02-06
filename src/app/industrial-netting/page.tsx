'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Building,
  Filter,
  Sun,
  Droplets,
  Wind,
  Shield,
Camera, Info} from 'lucide-react'
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
  MC_HERO_ACTIONS,
} from '@/lib/design-system'

const GALLERY_IMAGES = [
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Industrial netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/08-Boat-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Warehouse netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Industrial screens' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/11-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Commercial netting' },
  { src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg', alt: 'Industrial enclosure' },
]

const PHYSICAL_FILTER_EXAMPLES = [
  'Segregate warehouse from insects (Health Dept)',
  'Entomology experiments & Insectaries',
  'Safe zones for workers in malarial countries',
  'Screens to dry crops',
  'Vat covers for wineries',
  'Screen door for convex airplane door (USDA)',
  'Personal fall protection',
  'Construction netting to contain dropped objects',
  'HVAC pre-filters for cost savings',
]

const OPTICAL_FILTER_EXAMPLES = [
  'Projection screens',
  'Shade Mesh panels',
  'Privacy mesh for top secret equipment',
  'Sniper Hides for US Special Forces',
  'Shade Screens',
]

const HYDRO_FILTER_EXAMPLES = [
  'Grow algae to oxygenate water for water treatment facility',
  'Segregate baby eels from hungry adults',
  'Oil Spill Curtain to catch tar balls',
]

export default function IndustrialNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        <PowerHeaderTemplate
          title="Industrial Netting Solutions"
          subtitle="If you can imagine it, we can probably make it! Custom netting solutions for industry."
          videoId="bCBWpJGC9Fg"
          videoTitle="Industrial Netting Solutions"
          variant="compact"
          actions={MC_HERO_ACTIONS}
        />

        <WhyChooseUsTemplate />

        <HeaderBarSection icon={Building} label="Client Installed Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md">
            {GALLERY_IMAGES.map((img, idx) => (
              <Frame key={idx} ratio="4/3" className="rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </Frame>
            ))}
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Filter} label="Understanding Industrial Netting As A Type Of Filter" variant="dark">
          <TwoColumn gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-gray-600">
                We provide custom netting solutions for industry. If you think about mesh netting, it is really 
                a type of filter. Some things are allowed to pass through while other things are blocked.
              </Text>
              <Text className="text-gray-600">
                All that is required is the appropriate industrial Netting mesh specific to the application and 
                a means to rig it. When you are looking for ideas, our planners will work WITH you to outline a 
                surprisingly affordable industrial netting solution.
              </Text>
              <Button variant="primary" asChild>
                <Link href="/contact">Contact Us to Brainstorm<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg" alt="Industrial netting" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
          <Card variant="elevated" className="!p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <Heading level={4} className="!mb-3">Physical Filters</Heading>
            <Text className="text-sm text-gray-600 mb-4">
              Stop physical objects like insects, falling hammers, or dust while still allowing air flow.
            </Text>
            <BulletedList spacing="tight">
              {PHYSICAL_FILTER_EXAMPLES.map((example, idx) => (
                <ListItem key={idx} variant="default"><span className="text-xs">{example}</span></ListItem>
              ))}
            </BulletedList>
          </Card>
          
          <Card variant="elevated" className="!p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full mb-4 flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-600" />
            </div>
            <Heading level={4} className="!mb-3">Optical Filters</Heading>
            <Text className="text-sm text-gray-600 mb-4">
              For shade, projection mapping screens, and concealment applications.
            </Text>
            <BulletedList spacing="tight">
              {OPTICAL_FILTER_EXAMPLES.map((example, idx) => (
                <ListItem key={idx} variant="default"><span className="text-xs">{example}</span></ListItem>
              ))}
            </BulletedList>
          </Card>
          
          <Card variant="elevated" className="!p-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full mb-4 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <Heading level={4} className="!mb-3">Hydro Filtration</Heading>
            <Text className="text-sm text-gray-600 mb-4">
              When water must flow through a physical barrier to block unwanted objects.
            </Text>
            <BulletedList spacing="tight">
              {HYDRO_FILTER_EXAMPLES.map((example, idx) => (
                <ListItem key={idx} variant="default"><span className="text-xs">{example}</span></ListItem>
              ))}
            </BulletedList>
          </Card>
        </Grid>

        <HeaderBarSection icon={Wind} label="Pre-Filter Screens For HVAC" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Heading level={3}>Pre-Filter Screens For Cottonwoods, Pollen, Dust & Humidity</Heading>
              <Text className="text-gray-600">
                We make cost effective custom screens to keep out large particulates so that your Air Handler 
                unit will run more efficiently. With our pre-screens, you will save on expensive air handler 
                filter replacements and save on servicing frequency.
              </Text>
              <Text className="text-gray-600">
                Our HVAC screens are externally mounted so that visual inspections are easy. All Chiller screens 
                are bound with a sturdy webbing around the entire perimeter. When it gets dirty, rinse with a 
                hose or wash in a machine. It is that easy!
              </Text>
            </Stack>
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/16-Garage-Door-Mosquito-Mesh-Netting-Panels-1200-1024x768.jpg" alt="HVAC pre-filter" className="w-full h-full object-cover" />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        <HeaderBarSection icon={Shield} label="Quality & Service" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-2xl overflow-hidden">
              <img src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Mosquito-Curtains-Team-1200-300x225.jpg" alt="Mosquito Curtains Team" className="w-full h-full object-cover" />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                You want it done right the first time, right? Our most important concern is always quality so 
                that your choice as a facilities engineer is the right choice.
              </Text>
              <Text className="text-gray-600">
                We will set up an online planning session with screen sharing. You will describe your situation 
                and your goals. We will work together to make an industrial netting solution for you. If you 
                have any digital photos, during our planning session, we can draw on them as you watch.
              </Text>
              <Button variant="primary" asChild>
                <Link href="/contact">Get Started<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Industrial Netting Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/03/Industrial-Photo-Hero-1024x576.jpg"
                  alt="Screen partition for industrial warehouse"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/12-Industrial-Netting-Applications-Construction-Netting-1200-300x225.jpg"
                  alt="Construction Netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Industrial-Netting-Applications-1200-300x225.jpg"
                  alt="Industrial Netting Applications"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/05-HVAC-Wash-Netting-300x225.jpg"
                  alt="HVAC pre-filters"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Industrial-Netting-Applications-1200-300x225.jpg"
                  alt="Commercial Netting Applications"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Industrial-Netting-Applications-1200-300x225.jpg"
                  alt="Industrial Netting Applications"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industrial-Netting-Applications-Large-Dumpster-1200-300x225.jpg"
                  alt="Container Netting for large dumpster"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industiral-Netting-Applications-Tampico-Dock-Screen-300x225.jpg"
                  alt="Insect netting for Produce"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/33-Mosquito-Netting-On-Screen-Porch-1200-300x225.jpg"
                  alt="Industrial Netting with one-way visibility"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/34-Mosquito-Netting-On-Screen-Porch-300x225.jpg"
                  alt="Commercial Netting with one-way visibility"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/21-Theater-Scrims-Projection-Screens-1200-300x225.jpg"
                  alt="Industrial Netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industrial-Netting-Health-Department-Requirement-1200-300x225.jpg"
                  alt="Industrial Food Netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Industrial-Netting-Applications-1200-300x225.jpg"
                  alt="Industrial Screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/00-HVAC-Chiller-Screens-1200-768x576.jpg"
                  alt="HVAC chiller screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/05-HVAC-Wash-Netting-768x576.jpg"
                  alt="Air handler screens"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Boeing-Writeup-HVAC-768x576.jpg"
                  alt="Chiller Screens for Boeing"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Industiral-Netting-Applications-Tampico-Dock-Screen-768x576.jpg"
                  alt="Insect netting for Produce"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/00-Industrial-Netting-Applications-1200-768x576.jpg"
                  alt="Industrial Netting Applications"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Screen-Sewing-1200-768x576.jpg"
                  alt="Custom Insect Curtains"
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
          </Grid>
        </HeaderBarSection>

        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Industrial-Netting-Applications-1200-300x225.jpg"
            alt="Industrial Netting Applications"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/05-HVAC-Wash-Netting-300x225.jpg"
            alt="HVAC pre-filters"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/06-Industrial-Netting-Applications-1200-300x225.jpg"
            alt="Commercial Netting Applications"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/04-Industrial-Netting-Applications-1200-300x225.jpg"
            alt="Industrial Netting Applications"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industrial-Netting-Applications-Large-Dumpster-1200-300x225.jpg"
            alt="Container Netting for large dumpster"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industiral-Netting-Applications-Tampico-Dock-Screen-300x225.jpg"
            alt="Insect netting for Produce"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/33-Mosquito-Netting-On-Screen-Porch-1200-300x225.jpg"
            alt="Industrial Netting with one-way visibility"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/34-Mosquito-Netting-On-Screen-Porch-300x225.jpg"
            alt="Commercial Netting with one-way visibility"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/21-Theater-Scrims-Projection-Screens-1200-300x225.jpg"
            alt="Can See Out Perfectly"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/10/Industrial-Netting-Health-Department-Requirement-1200-300x225.jpg"
            alt="Industrial Food Netting"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/03-Industrial-Netting-Applications-1200-300x225.jpg"
            alt="Industrial Screens"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Other Industrial Netting Applications" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We have provided screening and filter solutions for a wide variety of interesting applications over 15yrs. We have BIG netting fabric and we know how to rig it. If you think about netting, it is a type of filter. Some things you want to block and other things you want to let pass through like air flow or sunlight. Our netting is super tough and has been used as scaffold netting to keep people below from getting bonked on the head by falling debris or perhaps a dropped hammer. We’ve made tank hatch covers for the Marines to allow air flow in on a hot day but to keep some jack wagon from tossing in a grenade. Think filter and we can probably help! Click on the first picture that will show a warehouse curtain 38ft tall and 500ft wide
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2021/01/Industiral-Netting-Applications-Tampico-Dock-Screen-768x576.jpg"
                alt="Insect netting for Produce"
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
