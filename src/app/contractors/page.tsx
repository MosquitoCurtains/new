'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Building,
  DollarSign,
  Package,
  Users,
  CheckCircle,
} from 'lucide-react'
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
} from '@/lib/design-system'

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
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
