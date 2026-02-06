import { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, Bug, Snowflake, ArrowRight } from 'lucide-react'
import {
  Container,
  Stack,
  Grid,
  Text,
  Heading,
  Card,
  Button,
  FinalCTATemplate,
} from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'FAQ | Mosquito Curtains',
  description: 'Frequently asked questions about Mosquito Curtains and Clear Vinyl products.',
}

export default function FAQHubPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] text-sm px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Get Your Questions Answered</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Frequently Asked Questions
          </Heading>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, ordering, installation, and more.
          </Text>
        </div>

        {/* FAQ Category Cards */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
          
          {/* Mosquito Curtains FAQ */}
          <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-[#406517]/30">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#406517]/10 rounded-2xl flex items-center justify-center">
                  <Bug className="w-8 h-8 text-[#406517]" />
                </div>
                <div>
                  <Heading level={2} className="!text-2xl !mb-1">
                    Mosquito Curtains FAQ
                  </Heading>
                  <Text className="text-gray-500">40+ Questions Answered</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-6 flex-grow">
                Questions about ordering, planning, installation, mesh types, tracking systems, and more for our mosquito netting products.
              </Text>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#406517] rounded-full"></span>
                  Ordering & Returns
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#406517] rounded-full"></span>
                  Planning Your Project
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#406517] rounded-full"></span>
                  Installation & Care
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#406517] rounded-full"></span>
                  Shipping & Delivery
                </div>
              </div>
              <Button variant="primary" asChild className="w-full">
                <Link href="/faq/mosquito-curtains">
                  View Mosquito Curtains FAQ
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Clear Vinyl FAQ */}
          <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-[#003365]/30">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#003365]/10 rounded-2xl flex items-center justify-center">
                  <Snowflake className="w-8 h-8 text-[#003365]" />
                </div>
                <div>
                  <Heading level={2} className="!text-2xl !mb-1">
                    Clear Vinyl FAQ
                  </Heading>
                  <Text className="text-gray-500">20+ Questions Answered</Text>
                </div>
              </div>
              <Text className="text-gray-600 mb-6 flex-grow">
                Questions about our clear vinyl winter panels for weather protection, ordering, installation, and maintenance.
              </Text>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#003365] rounded-full"></span>
                  Weather Protection
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#003365] rounded-full"></span>
                  Ordering & Pricing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#003365] rounded-full"></span>
                  Installation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-[#003365] rounded-full"></span>
                  Care & Maintenance
                </div>
              </div>
              <Button variant="secondary" asChild className="w-full">
                <Link href="/faq/clear-vinyl">
                  View Clear Vinyl FAQ
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </Grid>

        {/* Quick Help Section */}
        <Card className="p-8 bg-gray-50 text-center">
          <Heading level={3} className="!text-xl !mb-3">
            Can&apos;t find what you&apos;re looking for?
          </Heading>
          <Text className="text-gray-600 mb-6">
            Our planning team is here to help with any questions about your project.
          </Text>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:7706454745">
                Call (770) 645-4745
              </a>
            </Button>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
