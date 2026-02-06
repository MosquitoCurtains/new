'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Award,
  Factory,
  Truck,
  HeadphonesIcon,
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
  WhyChooseUsTemplate,
} from '@/lib/design-system'

export default function WhyUsNettingPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/raw-netting" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Raw Netting
        </Link>

        {/* Header */}
        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Award className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Why Buy Netting From Us
            </Heading>
            <Text className="text-xl text-gray-600">
              We're not just a netting supplier - we're manufacturers who know this 
              material inside and out.
            </Text>
          </Stack>
        </section>

        {/* We're Manufacturers */}
        <HeaderBarSection icon={Factory} label="We're Manufacturers, Not Resellers" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Manufacturing.jpg"
                alt="Our manufacturing facility"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                We don't just buy netting and resell it. We use these exact materials to 
                manufacture thousands of custom mosquito curtain systems every year. This means:
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">We know the quality firsthand</ListItem>
                <ListItem variant="checked" iconColor="#406517">We buy in massive quantities (better pricing)</ListItem>
                <ListItem variant="checked" iconColor="#406517">We can advise on applications</ListItem>
                <ListItem variant="checked" iconColor="#406517">We know what works and what doesn't</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Key Benefits */}
        <HeaderBarSection icon={CheckCircle} label="What Sets Us Apart" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Premium Quality</Heading>
              <Text className="text-gray-600 !mb-0">
                The same solution-dyed, UV-resistant netting we use in our professional 
                curtain systems. Not cheap imports.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center mb-4">
                <Factory className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Custom Capabilities</Heading>
              <Text className="text-gray-600 !mb-0">
                Need it cut, hemmed, or finished? Our sewing shop can turn raw netting 
                into ready-to-install panels.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Fast Shipping</Heading>
              <Text className="text-gray-600 !mb-0">
                We stock large quantities. Most orders ship within 1-2 business days.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-lg flex items-center justify-center mb-4">
                <HeadphonesIcon className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Expert Support</Heading>
              <Text className="text-gray-600 !mb-0">
                Questions about which netting to use? Our team can help you choose the 
                right material for your specific application.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* 25+ Years */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20 text-center">
          <Heading level={3} className="!mb-4">25+ Years of Experience</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            Since 1999, we've been manufacturing mosquito curtain systems and working with 
            netting materials. Over 90,000 satisfied customers. We know what we're doing.
          </Text>
        </Card>

        {/* Why Choose Us Template */}
        <WhyChooseUsTemplate />

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Ready to Order?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you need raw netting by the yard or a completely finished product, 
            we've got you covered.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting">
                Browse Netting
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
