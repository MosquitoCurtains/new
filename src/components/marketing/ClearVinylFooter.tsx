'use client'

/**
 * ClearVinylFooter
 *
 * Shared bottom section for all clear vinyl pages (non-start-project).
 * Includes:
 *  1. Learn More HeaderBarSection with 6 clear-vinyl-specific link cards
 *  2. Blue "How to Get Started" CTA
 *
 * Usage:
 * ```tsx
 * import { ClearVinylFooter } from '@/components/marketing/ClearVinylFooter'
 * <ClearVinylFooter />
 * ```
 */

import Link from 'next/link'
import { ArrowRight, Phone, BookOpen } from 'lucide-react'
import {
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Button,
  HeaderBarSection,
} from '@/lib/design-system'

export function ClearVinylFooter() {
  return (
    <Stack gap="lg">
      {/* Learn More */}
      <HeaderBarSection icon={BookOpen} label="Learn More" variant="dark">
        <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
          <Link href="/options/clear-vinyl/considerations">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Important Considerations</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Key factors to know before ordering clear vinyl.</Text>
              <Text size="sm" className="text-[#406517] font-medium">See Considerations →</Text>
            </Card>
          </Link>
          <Link href="/install/clear-vinyl">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Self-Installation</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Is it really that easy?</Text>
              <Text size="sm" className="text-[#406517] font-medium">See a Full Installation →</Text>
            </Card>
          </Link>
          <Link href="/faq/clear-vinyl">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Clear Vinyl FAQs</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Common questions about clear vinyl panels.</Text>
              <Text size="sm" className="text-[#406517] font-medium">View FAQs →</Text>
            </Card>
          </Link>
          <Link href="/gallery?filter=clear_vinyl">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Client Gallery</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Browse real clear vinyl installations by color.</Text>
              <Text size="sm" className="text-[#406517] font-medium">View Gallery →</Text>
            </Card>
          </Link>
          <Link href="/quote/clear-vinyl">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Instant Quote</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Get a clear vinyl estimate within 5% of actual cost.</Text>
              <Text size="sm" className="text-[#406517] font-medium">Clear Vinyl Price Calculator →</Text>
            </Card>
          </Link>
          <Link href="/start-project/clear-vinyl/expert-assistance">
            <Card variant="outlined" hover className="!p-6">
              <Heading level={4} className="!mb-1">Expert Assistance</Heading>
              <Text size="sm" className="text-gray-500 !mb-3">Our team will help plan your clear vinyl project!</Text>
              <Text size="sm" className="text-[#406517] font-medium">Get Expert Help →</Text>
            </Card>
          </Link>
        </Grid>
      </HeaderBarSection>

      {/* Blue CTA */}
      <section className="bg-[#003365] rounded-3xl p-8 md:p-12 text-white text-center">
        <Heading level={1} className="!text-white !mb-3 !text-4xl md:!text-5xl">How to Get Started</Heading>
        <Text className="!text-white/80 max-w-2xl mx-auto !mb-8" size="lg">
          Ready to enclose your space with clear vinyl panels? Start your project today or give us a call.
        </Text>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" asChild className="!bg-white !text-[#003365] hover:!bg-gray-100">
            <Link href="/start-project/clear-vinyl">
              <ArrowRight className="mr-2 w-5 h-5" />
              Start Your Clear Vinyl Project
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="!border-white !text-white hover:!bg-white/10">
            <a href="tel:7706454745">
              <Phone className="mr-2 w-5 h-5" />
              Call (770) 645-4745
            </a>
          </Button>
        </div>
      </section>
    </Stack>
  )
}
