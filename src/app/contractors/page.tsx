'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Building,
  DollarSign,
  Package,
  Users,
  CheckCircle,
, Camera, Info} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  Frame,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  YouTubeEmbed,
, TwoColumn} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

export default function ContractorsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#003365]/10 rounded-full mx-auto flex items-center justify-center">
              <Building className="w-10 h-10 text-[#003365]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Contractor & Trade Program
            </Heading>
            <Text className="text-xl text-gray-600">
              Partner with us to offer mosquito curtains and clear vinyl enclosures 
              to your clients. Wholesale pricing and professional support.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="primary" asChild>
                <Link href="/start-project">
                  Apply for Trade Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* Benefits */}
        <HeaderBarSection icon={CheckCircle} label="Trade Program Benefits" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <Heading level={4} className="!mb-2">Wholesale Pricing</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Contractor discounts on all products. The more you order, the better your pricing.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <Heading level={4} className="!mb-2">Drop Shipping</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                We can ship directly to your client's address with your branding.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <Heading level={4} className="!mb-2">Sales Support</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                We help you close deals with technical support and custom quotes.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Who Should Apply */}
        <HeaderBarSection icon={Building} label="Who Should Apply" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Contractor.jpg"
                alt="Contractor installing curtains"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Our trade program is designed for professionals who work with homeowners 
                on outdoor living projects:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#003365">Screen enclosure contractors</ListItem>
                <ListItem variant="checked" iconColor="#003365">Deck and porch builders</ListItem>
                <ListItem variant="checked" iconColor="#003365">General contractors</ListItem>
                <ListItem variant="checked" iconColor="#003365">Pergola and gazebo installers</ListItem>
                <ListItem variant="checked" iconColor="#003365">Handyman services</ListItem>
                <ListItem variant="checked" iconColor="#003365">Landscaping companies</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <HeaderBarSection icon={CheckCircle} label="How the Program Works" variant="dark">
          <Card className="!p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 4 }} gap="md" className="text-center">
              <Stack gap="sm">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">1</div>
                <Text className="text-sm font-medium !mb-0">Apply</Text>
                <Text className="text-xs text-gray-500 !mb-0">Fill out trade application</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">2</div>
                <Text className="text-sm font-medium !mb-0">Get Approved</Text>
                <Text className="text-xs text-gray-500 !mb-0">Usually same day</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">3</div>
                <Text className="text-sm font-medium !mb-0">Quote Jobs</Text>
                <Text className="text-xs text-gray-500 !mb-0">We provide wholesale pricing</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-10 h-10 bg-[#003365] text-white rounded-full mx-auto flex items-center justify-center font-bold">4</div>
                <Text className="text-sm font-medium !mb-0">Profit</Text>
                <Text className="text-xs text-gray-500 !mb-0">Mark up to your clients</Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Product Videos */}
        <HeaderBarSection icon={CheckCircle} label="Product Videos" variant="dark">
          <Text className="text-gray-600 mb-6">
            Watch our product overview videos to understand the solutions we offer for your clients.
          </Text>
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <div>
              <YouTubeEmbed videoId={VIDEOS.MOSQUITO_CURTAINS_OVERVIEW} title="Mosquito Curtains Overview" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Mosquito Curtains Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.SHORT_OVERVIEW} title="Short Product Overview" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Short Product Overview</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.CUSTOM_NETTING} title="Custom Netting Orders" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Custom Netting Orders</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.CUSTOM_FITTED} title="Custom Fitted / Mesh Types" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Custom Fitted / Mesh Types</Text>
            </div>
            <div>
              <YouTubeEmbed videoId={VIDEOS.QUALITY_MATERIALS} title="Quality & Materials" variant="card" />
              <Text className="text-sm text-gray-500 mt-2 text-center">Quality & Materials</Text>
            </div>
          </Grid>
        </HeaderBarSection>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Partner With Us?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Apply for a trade account today and start offering mosquito curtains to your clients.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Apply Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA */}
        
        {/* Photo Gallery */}
        <HeaderBarSection icon={Camera} label="Contractor Gallery" variant="blue">
          <Grid responsiveCols={{ mobile: 2, tablet: 3 }} gap="md">
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                  alt="Contractor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/MC-Track-Installation-768x576.jpg"
                  alt="Contractor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Velcro-Installation-768x576.jpg"
                  alt="Contractor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Installation-1-768x576.jpg"
                  alt="Contractor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Clear-Plastic-Winter-Panels-Porch-Gray-1200-768x576.jpg"
                  alt="clear vinyl plastic winter enclosure panels"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
            <Card className="!p-0 overflow-hidden">
              <Frame ratio="4/3" className="rounded-lg overflow-hidden">
                <img
                  src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg"
                  alt="Large mosquito netting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Frame>
            </Card>
          </Grid>
        </HeaderBarSection>

        <HeaderBarSection icon={Info} label="Why Become a Professional Reseller?" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Imagine one of your clients is looking for a screened-in porch requiring framing, painting, and hanging a door.How would you price a 3-sided exposure with a total sum width of 33ft at 9ft tall? How long would it take? What would you charge?Now, imagine you could purchase a Mosquito Curtain for $1,000 and install it in about 6 hours at double or triple your typical hourly rate.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="We make custom screen and clear vinyl plastic enclosures to meet the exact needs of your clients." variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">We have done tens of thousands of screen enclosures for porches, patios, gazebos, decks, etc. along with thousands of other unique projects and applications. We would love to help you bring your client projects to life! With excellent automation and tricks up our sleeve, we can help you create solution after solution for your clients. This helps you add more value to more clients and streamlines your profitability.</Text>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Delivering the Desired End Result at an Attractive Price Point" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Our curtains may have a higher perceived value to your client since they are retractable with an overhead tracking system, removable, and far less intrusive to that lovely architecture.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                alt="Delivering the Desired End Result at an Attractive Price Point"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="High Value Mosquito Curtains" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Curtains may have a higher perceived value to your client since they are retractable with an overhead tracking system, removable, and far less intrusive to that lovely architecture.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/19-Mosquito-Netting-Various-Projects-1200-768x576.jpg"
                alt="High Value Mosquito Curtains"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Discover Your Options" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">This page is designed to give you an overview of your options and a basic understanding of our simple attachment hardware. Use the “Dive Into Details” link on any section to see more on that topic.</Text>
              <BulletedList>
                <li>Know Your Mesh Type & Color</li>
                <li>Know Your Top Attachment Preference</li>
                <li>Understand Our Simple Attachment Hardware</li>
              </BulletedList>
          </Stack>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Mosquito Curtains on Tracking" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Learn to install mosquito curtains with a tracking top attachment.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/MC-Track-Installation-768x576.jpg"
                alt="Mosquito Curtains on Tracking"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Mosquito Curtains on Velcro®" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Learn to install mosquito curtains with a Velcro® top attachment.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Velcro-Installation-768x576.jpg"
                alt="Mosquito Curtains on Velcro®"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Clear Vinyl Winter Panels" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Learn to install clear vinyl panels on Velcro® or Tracking.
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/09/Clear-Vinyl-Installation-1-768x576.jpg"
                alt="Clear Vinyl Winter Panels"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/00-Mosquito-Netting-Various-Projects-400.jpg"
            alt="Bulk Mosquito Netting For Various Projects"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        <HeaderBarSection icon={Info} label="Clear Vinyl Winter Panels" variant="green">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                Create A Warm Cozy Outdoor Weatherproof Space Sheltered From Wind, Rain & Cold!
              </Text>
            </Stack>
            <Frame ratio="4/3" className="rounded-lg overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/04/wide-net-1200-768x576.jpg"
                alt="Large mosquito netting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>
        <HeaderBarSection icon={Info} label="Raw Mesh Fabrics" variant="green">
          <Stack gap="md">
              <Text className="text-gray-600">Mosquito Netting, No-See-Um, Shade Mesh & Scrim Mesh Fabrics For Any Project</Text>
          </Stack>
        </HeaderBarSection>

        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
