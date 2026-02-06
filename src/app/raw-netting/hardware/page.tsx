'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Wrench,
  Circle,
  Square,
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

const HARDWARE_TYPES = [
  {
    title: 'Grommets',
    description: 'Metal or plastic rings that reinforce holes in netting for hanging.',
    uses: ['Hanging netting', 'Tie-down points', 'Rope attachment'],
  },
  {
    title: 'Snaps',
    description: 'DOT snaps for secure attachment and easy removal.',
    uses: ['Removable panels', 'Quick attachment', 'Professional finish'],
  },
  {
    title: 'Velcro',
    description: 'Industrial-strength hook and loop for versatile attachment.',
    uses: ['Fixed installations', 'Easy seasonal removal', 'No tools needed'],
  },
  {
    title: 'Cable & Rope',
    description: 'For hanging and supporting netting installations.',
    uses: ['Suspension systems', 'Tensioning', 'Large spans'],
  },
]

export default function HardwarePage() {
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
              <Wrench className="w-8 h-8 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Attachment Hardware
            </Heading>
            <Text className="text-xl text-gray-600">
              Everything you need to attach, hang, and secure your netting projects. 
              All hardware is included when you order finished curtains from us.
            </Text>
          </Stack>
        </section>

        {/* Hardware Types */}
        <HeaderBarSection icon={Wrench} label="Hardware Types" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            {HARDWARE_TYPES.map((hardware) => (
              <Card key={hardware.title} variant="elevated" className="!p-6">
                <Heading level={4} className="!mb-2">{hardware.title}</Heading>
                <Text className="text-gray-600 mb-4">{hardware.description}</Text>
                <Text className="text-sm font-semibold text-gray-700 !mb-2">Common Uses:</Text>
                <BulletedList spacing="sm">
                  {hardware.uses.map((use, idx) => (
                    <ListItem key={idx} variant="arrow" iconColor="#406517">{use}</ListItem>
                  ))}
                </BulletedList>
              </Card>
            ))}
          </Grid>
        </HeaderBarSection>

        {/* Grommet Sizes */}
        <HeaderBarSection icon={Circle} label="Grommet Sizes" variant="dark">
          <Card className="!p-6">
            <Text className="text-gray-600 mb-6 text-center">
              Available in various sizes for different applications:
            </Text>
            <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="text-center">
              <Stack gap="sm">
                <div className="w-8 h-8 rounded-full border-4 border-gray-400 mx-auto"></div>
                <Text className="text-sm font-medium !mb-0">#0 (1/4")</Text>
                <Text className="text-xs text-gray-500 !mb-0">Light duty</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-10 h-10 rounded-full border-4 border-gray-400 mx-auto"></div>
                <Text className="text-sm font-medium !mb-0">#2 (3/8")</Text>
                <Text className="text-xs text-gray-500 !mb-0">Standard</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-12 h-12 rounded-full border-4 border-gray-400 mx-auto"></div>
                <Text className="text-sm font-medium !mb-0">#4 (1/2")</Text>
                <Text className="text-xs text-gray-500 !mb-0">Heavy duty</Text>
              </Stack>
              <Stack gap="sm">
                <div className="w-14 h-14 rounded-full border-4 border-gray-400 mx-auto"></div>
                <Text className="text-sm font-medium !mb-0">#6 (3/4")</Text>
                <Text className="text-xs text-gray-500 !mb-0">Extra heavy</Text>
              </Stack>
            </Grid>
          </Card>
        </HeaderBarSection>

        {/* Included with Orders */}
        <Card className="!p-6 !bg-[#406517]/5 !border-[#406517]/20">
          <Heading level={3} className="!mb-4 text-center">Hardware Included with Finished Curtains</Heading>
          <Text className="text-gray-600 text-center max-w-2xl mx-auto mb-4">
            When you order finished mosquito curtains or clear vinyl from us, all necessary 
            hardware is included. These raw hardware items are for DIY netting projects only.
          </Text>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/screened-porch">
                View Finished Curtains
              </Link>
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Hardware?</Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us for pricing on attachment hardware and supplies.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link href="/start-project">
                Get a Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/raw-netting/rigging">
                Rigging Ideas
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
