'use client'

import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Phone } from 'lucide-react'
import { Container, Stack, Text, Button, Card, Heading, BulletedList, ListItem, FinalCTATemplate, HeaderBarSection } from '@/lib/design-system'

export default function ThreeSidedIrregularVelcroPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Link href="/plan/3-sided" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to 3-Sided Exposure
        </Link>

        <section className="relative py-8 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded">3-Sided</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Irregular Columns</span>
              <span className="px-2 py-1 bg-[#406517]/10 text-[#406517] rounded font-medium">Velcro</span>
            </div>
            <Heading level={1} className="!text-3xl md:!text-4xl">
              3 Sided Exposure - Irregular Columns With Velcro Top Attachment
            </Heading>
          </Stack>
        </section>

        <HeaderBarSection icon={AlertTriangle} label="Recommended Panel Configuration & Measuring" variant="dark">
          <Card className="!p-6 !bg-amber-50 !border-amber-200">
            <Stack gap="md">
              <Text className="text-gray-700">
                This is a very rare configuration. Most porches have downspouts that obstruct a clear path AROUND the outside of your irregular corner columns. If you do have obstructions that prevent an outside hang, Velcro attachment requiring an outside path just isn&apos;t practical. Instead, we would direct you to an inside path with the tracking hardware.
              </Text>
              <Text className="text-gray-700">If you do not have obstructions, these are still tricky and we would like to help.</Text>
              <BulletedList spacing="sm">
                <ListItem variant="arrow" iconColor="#406517">
                  We strongly recommend selecting a{' '}
                  <Link href="/plan/3-sided/irregular-tracking" className="text-[#406517] underline font-medium">Tracking Attachment With Irregular Columns</Link>, or
                </ListItem>
                <ListItem variant="arrow" iconColor="#406517">Emailing us digital photos so we can help.</ListItem>
                <ListItem variant="arrow" iconColor="#406517">
                  You can be prepared with your options by exploring the topics above. Start with{' '}
                  <Link href="/plan/mesh-colors" className="text-[#406517] underline font-medium">Mesh &amp; Colors</Link>
                </ListItem>
              </BulletedList>
            </Stack>
          </Card>
        </HeaderBarSection>

        <section className="bg-gradient-to-br from-[#406517]/10 via-white to-[#003365]/10 rounded-3xl p-8 md:p-12 text-center">
          <Heading level={2} className="!mb-4">Need Help With This Configuration?</Heading>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact"><Phone className="w-5 h-5 mr-2" />Contact Us For Help Ordering</Link>
            </Button>
          </div>
        </section>

        <FinalCTATemplate />
      </Stack>
    </Container>
  )
}
