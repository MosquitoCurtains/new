'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Scissors,
  CheckCircle,
  Wrench,
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

export default function CustomNettingPage() {
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
              <Scissors className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Custom Netting Orders
            </Heading>
            <Text className="text-xl text-gray-600">
              Let us make it for you! We can custom cut, sew, and finish your netting 
              to your exact specifications.
            </Text>
          </Stack>
        </section>

        {/* What We Can Do */}
        <HeaderBarSection icon={Scissors} label="What We Can Do For You" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
            <Frame ratio="4/3" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Custom-Sewing.jpg"
                alt="Custom netting sewing"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Stack gap="md">
              <Text className="text-gray-600">
                Beyond selling raw netting, we're a full-service manufacturing shop. We can 
                take your raw netting and transform it into a finished product ready to install.
              </Text>
              <BulletedList spacing="md">
                <ListItem variant="checked" iconColor="#406517">Cut to your exact dimensions</ListItem>
                <ListItem variant="checked" iconColor="#406517">Hem edges professionally</ListItem>
                <ListItem variant="checked" iconColor="#406517">Add grommets or snaps</ListItem>
                <ListItem variant="checked" iconColor="#406517">Add velcro strips</ListItem>
                <ListItem variant="checked" iconColor="#406517">Create custom shapes</ListItem>
                <ListItem variant="checked" iconColor="#406517">Add zippers for doorways</ListItem>
              </BulletedList>
            </Stack>
          </Grid>
        </HeaderBarSection>

        {/* Why Custom */}
        <HeaderBarSection icon={CheckCircle} label="Why Choose Custom?" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Perfect Fit</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Exact dimensions for your unique space. No guessing, no waste.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Pro Quality</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Industrial sewing machines and professional finishing techniques.
              </Text>
            </Card>
            <Card variant="elevated" className="!p-6 text-center">
              <div className="w-12 h-12 bg-[#406517]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-[#406517]" />
              </div>
              <Heading level={4} className="!mb-2">Save Time</Heading>
              <Text className="text-sm text-gray-600 !mb-0">
                Skip the DIY sewing. We'll deliver panels ready to hang.
              </Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Common Custom Projects */}
        <HeaderBarSection icon={Scissors} label="Common Custom Projects" variant="dark">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Bed Nets</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Custom canopies</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Tent Screens</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Pop-up panels</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Event Netting</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Temporary installs</Text>
            </Card>
            <Card variant="elevated" className="!p-4 text-center">
              <Heading level={5} className="!mb-1">Garden Covers</Heading>
              <Text className="text-xs text-gray-500 !mb-0">Plant protection</Text>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* How It Works */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-6 text-center">How Custom Orders Work</Heading>
          <Grid responsiveCols={{ mobile: 1, tablet: 4 }} gap="md" className="text-center">
            <Stack gap="sm">
              <div className="w-10 h-10 bg-[#406517] text-white rounded-full mx-auto flex items-center justify-center font-bold">1</div>
              <Text className="text-sm font-medium !mb-0">Contact Us</Text>
              <Text className="text-xs text-gray-500 !mb-0">Describe your project</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-10 h-10 bg-[#406517] text-white rounded-full mx-auto flex items-center justify-center font-bold">2</div>
              <Text className="text-sm font-medium !mb-0">Get Quote</Text>
              <Text className="text-xs text-gray-500 !mb-0">We'll provide pricing</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-10 h-10 bg-[#406517] text-white rounded-full mx-auto flex items-center justify-center font-bold">3</div>
              <Text className="text-sm font-medium !mb-0">We Make It</Text>
              <Text className="text-xs text-gray-500 !mb-0">Custom manufacturing</Text>
            </Stack>
            <Stack gap="sm">
              <div className="w-10 h-10 bg-[#406517] text-white rounded-full mx-auto flex items-center justify-center font-bold">4</div>
              <Text className="text-sm font-medium !mb-0">We Ship It</Text>
              <Text className="text-xs text-gray-500 !mb-0">Ready to install</Text>
            </Stack>
          </Grid>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Have a Custom Project?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Tell us what you need and we'll make it happen.
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
                View Raw Netting
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
