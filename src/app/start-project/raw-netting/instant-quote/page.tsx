'use client'

/**
 * Raw Netting - Instant Quote → Path Selection
 *
 * Raw materials don't have instant pricing. Direct users to
 * Expert Assistance or the DIY Builder.
 */

import Link from 'next/link'
import {
  MessageSquare,
  Hammer,
  Check,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Card,
  Heading,
  Text,
  Badge,
} from '@/lib/design-system'

export default function RawNettingInstantQuotePage() {
  return (
    <Container size="xl">
      <Link href="/start-project/raw-netting" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1">
        <ArrowLeft className="w-3 h-3" />
        Back to Options
      </Link>
      <Stack gap="lg">
        <section className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#B3015810' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003365]/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#406517]/5 via-white to-[#003365]/5 border-2 rounded-3xl p-5 md:p-6 lg:p-8" style={{ borderColor: '#B3015820' }}>

            <div className="text-center mb-6">
              <Heading level={2} className="!text-xl md:!text-2xl !mb-2">
                Raw Mesh Fabric Quote
              </Heading>
              <Text size="sm" className="text-gray-600 !mb-0">
                Raw materials are custom-quoted per project. Choose how you&apos;d like to proceed.
              </Text>
            </div>

            {/* Info card */}
            <Card variant="outlined" className="!p-4 !bg-[#003365]/5 !border-[#003365]/20 max-w-2xl mx-auto mb-6">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#003365] mt-0.5 flex-shrink-0" />
                <Text size="sm" className="text-[#003365] !mb-0">
                  Raw mesh fabric pricing depends on the specific mesh type, quantity, and dimensions needed. Our team will provide an exact quote tailored to your project.
                </Text>
              </div>
            </Card>

            {/* Path cards */}
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md" className="max-w-3xl mx-auto">
              <Link href="/start-project/raw-netting/expert-assistance">
                <Card
                  variant="elevated"
                  className="relative h-full flex flex-col text-left p-5 rounded-2xl border-2 transition-all bg-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                >
                  <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: '#406517', borderColor: '#406517' }}>
                    Recommended
                  </Badge>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#40651715' }}>
                    <MessageSquare className="w-5 h-5" style={{ color: '#406517' }} />
                  </div>
                  <Heading level={4} className="!mb-1">Expert Assistance</Heading>
                  <Text size="sm" className="text-gray-600 !mb-2">
                    Tell us about your project and get an exact quote
                  </Text>
                  <ul className="space-y-1 mb-4">
                    {['Share your project details', 'Expert reviews your needs', 'Custom quote within 24-48 hours'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-auto">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all" style={{ color: '#406517', borderColor: 'rgba(64,101,23,0.5)' }}>
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>

              <Link href="/start-project/raw-netting/diy-builder">
                <Card
                  variant="elevated"
                  className="relative h-full flex flex-col text-left p-5 rounded-2xl border-2 transition-all bg-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                >
                  <Badge className="absolute -top-3 right-4 !text-white" style={{ backgroundColor: '#FFA501', borderColor: '#FFA501' }}>
                    Most Control
                  </Badge>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#FFA50115' }}>
                    <Hammer className="w-5 h-5" style={{ color: '#FFA501' }} />
                  </div>
                  <Heading level={4} className="!mb-1">DIY Builder</Heading>
                  <Text size="sm" className="text-gray-600 !mb-2">Configure panels and add to cart</Text>
                  <ul className="space-y-1 mb-4">
                    {['Panel-by-panel config', 'Full control over options', 'Direct checkout'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-3.5 h-3.5 text-[#406517] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-auto">
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all" style={{ color: '#FFA501', borderColor: 'rgba(255,165,1,0.5)' }}>
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            </Grid>
          </div>
        </section>
      </Stack>
    </Container>
  )
}
