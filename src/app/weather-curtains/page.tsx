'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Snowflake,
  Award,
  Wrench,
  Thermometer,
  MessageSquare,
  Calculator,
  Hammer,
  RefreshCw,
  Building,
  Home,
  UtensilsCrossed,
  TreePine,
  Camera,
  DollarSign,
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
  Card,
} from '@/lib/design-system'
import type { PowerHeaderAction } from '@/lib/design-system/templates/PowerHeaderTemplate'

// Action buttons matching start-project flow
const heroActions: PowerHeaderAction[] = [
  {
    icon: MessageSquare,
    title: 'Expert Assistance',
    description: 'Send photos, get personalized guidance from our team.',
    href: '/start-project?mode=planner&product=cv',
    buttonText: 'Get Help',
    color: '#406517',
  },
  {
    icon: Calculator,
    title: 'Instant Quote',
    description: 'Quick specs for an estimate within 5% of actual cost.',
    href: '/start-project?mode=quote&product=cv',
    buttonText: 'Calculate',
    color: '#003365',
  },
  {
    icon: Hammer,
    title: 'DIY Builder',
    description: 'Configure panels yourself and add directly to cart.',
    href: '/start-project?mode=diy&product=cv',
    buttonText: 'Build',
    color: '#B30158',
  },
]

// Pricing examples
const PRICING_EXAMPLES = [
  { label: 'Small Porch', price: '$1,481.00', shipping: '+ Shipping' },
  { label: 'Medium Patio', price: '$2,410.00', shipping: '+ Shipping' },
  { label: 'Large Enclosure', price: '$1,745.00', shipping: '+ Shipping' },
]

// Application types
const APPLICATIONS = [
  { icon: Home, label: 'Porches' },
  { icon: Building, label: 'Patios' },
  { icon: UtensilsCrossed, label: 'Restaurants' },
  { icon: TreePine, label: 'Pergolas' },
  { icon: Building, label: 'Gazebos' },
  { icon: Building, label: 'Pavilions' },
]

export default function WeatherCurtainsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            POWER HEADER - With Project Flow Actions
            ================================================================ */}
        <PowerHeaderTemplate
          title="Outdoor Cold Weather Curtains"
          subtitle="Use Clear Vinyl Weather Curtains with Space Heater to Stay Warm. Custom made Weather Curtain Panels to Insulate Outdoor Space."
          videoId="ca6GufadXoE"
          videoTitle="Clear Vinyl Weather Curtains Overview"
          thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Video-Thumbnail.jpg"
          variant="compact"
          actions={heroActions}
        />

        {/* ================================================================
            KEY BENEFITS
            ================================================================ */}
        <Card className="p-6 bg-[#003365]/5 border-[#003365]/20">
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 5 }} gap="md">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#003365]" />
              <Text className="text-sm text-gray-700">Stay Warm with Space Heater</Text>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#003365]" />
              <Text className="text-sm text-gray-700">Custom Made Panels</Text>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#003365]" />
              <Text className="text-sm text-gray-700">Marine-Grade Quality</Text>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#003365]" />
              <Text className="text-sm text-gray-700">Ships in 6-10 Days</Text>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#003365]" />
              <Text className="text-sm text-gray-700">92,083+ Happy Customers</Text>
            </div>
          </Grid>
        </Card>

        {/* ================================================================
            WHY CHOOSE US - Using Template
            ================================================================ */}
        <WhyChooseUsTemplate />

        {/* ================================================================
            PRICING EXAMPLES
            ================================================================ */}
        <HeaderBarSection icon={DollarSign} label="Clear Vinyl Projects & Pricing" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
            {PRICING_EXAMPLES.map((example, idx) => (
              <Card key={idx} className="p-6 text-center">
                <Text className="text-gray-500 text-sm mb-2">{example.label}</Text>
                <Text className="text-2xl font-bold text-[#003365] mb-1">{example.price}</Text>
                <Text className="text-gray-500 text-sm">{example.shipping}</Text>
              </Card>
            ))}
          </Grid>
          <div className="text-center mt-6">
            <Button variant="primary" asChild>
              <Link href="/start-project?mode=quote&product=cv">
                Get Your Instant Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            INTERCHANGEABLE PANELS
            ================================================================ */}
        <HeaderBarSection icon={RefreshCw} label="Interchangeable With Mosquito Curtains" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                We offer both Summer Mosquito Netting Curtains & Clear Vinyl Winter Weather Curtains that will enable 
                you to enjoy family time just outside your own home.
              </Text>
              <Card className="p-4 bg-[#003365]/5 border-[#003365]/20">
                <Text className="text-[#003365] font-medium">
                  Best of all, the two products are entirely replaceable with each other using the same tracking system!
                </Text>
              </Card>
              <Text className="text-gray-600">
                Switch from bug protection in summer to weather protection in winter - same hardware, different panels.
              </Text>
            </Stack>
            <Grid responsiveCols={{ mobile: 2 }} gap="md">
              <Card className="p-4 text-center">
                <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/01-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg"
                    alt="Summer insect panels"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="font-medium text-gray-900">Summer Insect Panels</Text>
              </Card>
              <Card className="p-4 text-center">
                <Frame ratio="4/3" className="rounded-lg overflow-hidden mb-3">
                  <img
                    src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Clear-Vinyl-Porch-Enclosure-1024x768.jpg"
                    alt="Winter weather curtains"
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <Text className="font-medium text-gray-900">Winter Weather Curtains</Text>
              </Card>
            </Grid>
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            APPLICATION TYPES
            ================================================================ */}
        <HeaderBarSection icon={Building} label="We Do All Types Of Weather Curtain Enclosures" variant="dark">
          <Text className="text-gray-600 mb-6 text-center">
            Residential & Commercial applications - from small porches to large restaurant patios.
          </Text>
          <Grid responsiveCols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
            {APPLICATIONS.map((app, idx) => {
              const Icon = app.icon
              return (
                <Card key={idx} className="p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-[#003365]/10 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#003365]" />
                    </div>
                  </div>
                  <Text className="font-medium text-gray-900 text-sm">{app.label}</Text>
                </Card>
              )
            })}
          </Grid>
        </HeaderBarSection>

        {/* ================================================================
            CONTENT SECTIONS
            ================================================================ */}
        <HeaderBarSection icon={Snowflake} label="Clear Vinyl Plastic Porch Enclosures" variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600 text-lg">
                Are you wasting usable living space in your own home?
              </Text>
              <Text className="text-gray-600">
                Think about the possibilities if that porch or patio wasn&apos;t so cold in the winter. A cozy dinner outside, 
                board games with the kids, a hangout for your teens, a hangout for you.
              </Text>
              <Text className="text-gray-600">
                Protect your porch or patio from cold wind, rain, snow or spring pollen with custom-made Clear Vinyl 
                Plastic Weather Curtain Enclosures. Used in conjunction with a space heater, our plastic porch enclosure 
                curtains create a warm, cozy, protected all-weather room.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">Custom-made with marine-grade quality materials</ListItem>
                <ListItem variant="checked" iconColor="#003365">Waterproof all-weather protection</ListItem>
                <ListItem variant="checked" iconColor="#003365">Protect family, pets, and plants from frost</ListItem>
                <ListItem variant="checked" iconColor="#003365">Affordable outdoor living extension</ListItem>
              </BulletedList>
            </Stack>
            <YouTubeEmbed
              videoId="ca6GufadXoE"
              title="Clear Vinyl Enclosures"
              variant="card"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Video-Thumbnail.jpg"
            />
          </TwoColumn>
        </HeaderBarSection>

        {/* ================================================================
            GET STARTED CTA
            ================================================================ */}
        <HeaderBarSection icon={MessageSquare} label="Ready to Get Started?" variant="dark">
          <div className="text-center max-w-2xl mx-auto">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Contact our planning team for personalized guidance
            </Text>
            <Text className="text-gray-600 mb-6">
              We&apos;ll help you design the perfect weather enclosure for your space.
            </Text>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/start-project?product=cv">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/clear-vinyl">
                  Learn More About Clear Vinyl
                </Link>
              </Button>
            </div>
          </div>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA - Shared template
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
