'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Wind,
  Shield,
  Factory,
  CheckCircle,
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

export default function HVACChillerScreensPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With MC Hero Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="HVAC Chiller Screens"
          subtitle="Cost-effective custom pre-filter screens for air handlers, chillers, and A/C units. Keep out cottonwoods, pollen, dust, and debris while improving efficiency."
          videoId="FqNe9pDsZ8M"
          videoTitle="Industrial Netting Overview"
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
        
        {/* Section 1: Pre-Filter Screens */}
        <HeaderBarSection icon={Wind} label="Pre-Filter Screens For HVAC Systems" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We make cost-effective custom screens to keep out large particulates so that your Air Handler 
                unit will run more efficiently. With our pre-screens, you will save on expensive air handler 
                filter replacements and save on servicing frequency.
              </Text>
              <Text className="text-gray-600">
                Our HVAC screens are externally mounted so that visual inspections are easy. Our screens are 
                custom-made and sized to your specifications. All Chiller screens are bound with a sturdy 
                webbing around the entire perimeter.
              </Text>
              <Text className="text-gray-600">
                Fasten our air handler screens with a combination of Velcro and stainless steel marine snaps. 
                When it gets dirty, rinse with a hose or wash in a machine. It's that easy!
              </Text>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Contact Us to Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
            <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/HVAC-Filter-Bottom.jpg"
                  alt="Mesh filter on bottom of HVAC unit"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/HVAC-Marine-Snaps.jpg"
                  alt="Attached with marine snaps"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Cottonwood-HVAC-Filter.jpg"
                  alt="Cottonwood mesh filter on HVAC"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/HVAC-Filter-Washing.jpg"
                  alt="Mesh filter getting washed"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 2: Benefits & Features */}
        <HeaderBarSection icon={CheckCircle} label="Benefits & Features of HVAC Screens" variant="dark">
          <TwoColumn gap="lg" className="items-start">
            <Stack gap="md">
              <Text className="text-lg font-semibold text-[#406517]">Benefits</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">ROI in about 3 months</ListItem>
                <ListItem variant="checked" iconColor="#406517">Visual Inspection (panel is outside plenum)</ListItem>
                <ListItem variant="checked" iconColor="#406517">Expected Panel Life = 3-5 years</ListItem>
                <ListItem variant="checked" iconColor="#406517">Reduce Maintenance Visits</ListItem>
                <ListItem variant="checked" iconColor="#406517">Change Filters Less Frequently</ListItem>
                <ListItem variant="checked" iconColor="#406517">Higher Efficiency Saves Energy Cost</ListItem>
                <ListItem variant="checked" iconColor="#406517">Custom-made To The Inch</ListItem>
              </BulletedList>
            </Stack>
            <Stack gap="md">
              <Text className="text-lg font-semibold text-[#003365]">Features</Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">100% Satisfaction Guarantee</ListItem>
                <ListItem variant="checked" iconColor="#003365">White, Ivory or Black</ListItem>
                <ListItem variant="checked" iconColor="#003365">Washable or Rinse With a Water Hose</ListItem>
                <ListItem variant="checked" iconColor="#003365">Easily Self-installs</ListItem>
                <ListItem variant="checked" iconColor="#003365">Delivers in 4-7 Business Days</ListItem>
                <ListItem variant="checked" iconColor="#003365">Industrial Marine-grade Outdoor Net Panels</ListItem>
                <ListItem variant="checked" iconColor="#003365">Unique Attachment Hardware</ListItem>
              </BulletedList>
            </Stack>
          </TwoColumn>
        </HeaderBarSection>

        {/* Section 3: Other Industrial Applications */}
        <HeaderBarSection icon={Factory} label="Other Industrial Netting Applications" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We have provided screening and filter solutions for a wide variety of interesting applications 
              over 10 years. We have BIG netting fabric and we know how to rig it. If you think about netting, 
              it is a type of filter. Some things you want to block and other things you want to let pass 
              through like air flow or sunlight.
            </Text>
            <Text className="text-gray-600">
              Our netting is super tough and has been used as scaffold netting to keep people below from 
              getting bonked on the head by falling debris. We've made tank hatch covers for the Marines to 
              allow air flow in on a hot day but to keep things secure. Think filter and we can probably help!
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md" className="pt-4">
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Industrial-Doorway.jpg"
                  alt="Industrial Doorway Screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Agricultural-Enclosure.jpg"
                  alt="Agricultural Enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Compliance-Screen.jpg"
                  alt="Compliance Screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Construction-Screen.jpg"
                  alt="Construction Screen"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Factory-Enclosure.jpg"
                  alt="Factory Enclosure"
                  className="w-full h-full object-cover"
                />
              </Frame>
              <Frame ratio="1/1" className="rounded-xl overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Large-Dumpster-Cover.jpg"
                  alt="Large Dumpster Cover"
                  className="w-full h-full object-cover"
                />
              </Frame>
            </Grid>
            <div className="flex justify-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/industrial-netting">
                  See Industrial Netting
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </HeaderBarSection>

        {/* Section 4: Quality & Service */}
        <HeaderBarSection icon={Shield} label="Quality & Service" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Frame ratio="1/1" className="rounded-2xl overflow-hidden max-w-md mx-auto">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg"
                alt="Our netting is strong enough to lift a 240lb man"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our most important concern is always quality. The cheap screens you may find elsewhere are 
                garbage. You can put your thumb right through them. Our netting is strong enough to lift 
                this 240lb man.
              </Text>
              <Text className="text-gray-600">
                Even more, it is "solution dyed" such that the thread is colored and UV protected to its core. 
                It means that your screens won't fade or rot prematurely. All fasteners are stainless steel 
                and our hardware is powder-coated aluminum.
              </Text>
              <div className="pt-2">
                <Button variant="primary" asChild>
                  <Link href="/contact">
                    Get Started Today
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
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
