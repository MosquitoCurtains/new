'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Calculator,
  Bug,
  CheckCircle,
  Star,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Heading,
  Frame,
  BulletedList,
  ListItem,
  FinalCTATemplate,
} from '@/lib/design-system'

export default function RedditMCQuotePage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO - Reddit Landing
            ================================================================ */}
        <section className="relative py-16 text-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#406517]/10 rounded-full blur-3xl" />
          </div>

          <Stack gap="lg" className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <div className="bg-[#FF4500]/10 text-[#FF4500] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                From r/HomeImprovement to Your Porch
              </div>
            </div>

            <Heading level={1} className="!text-4xl md:!text-6xl">
              Mosquito Curtains<br />
              <span className="text-[#406517]">That Actually Work</span>
            </Heading>

            <Text className="text-xl text-gray-600">
              Custom-fitted, marine-grade quality. Not the tissue-paper thin garbage 
              from big box stores. Get an instant quote in 60 seconds.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/start-project?mode=quote&product=mosquito_curtains&utm_source=reddit&utm_medium=referral&utm_campaign=mc_quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get Instant Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Stack>
        </section>

        {/* ================================================================
            SOCIAL PROOF
            ================================================================ */}
        <section className="bg-white rounded-3xl border-2 border-gray-100 p-8">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="lg" className="text-center">
            <div>
              <Text className="text-3xl font-bold text-[#406517] !mb-1">92,000+</Text>
              <Text className="text-sm text-gray-600 !mb-0">Happy Customers</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#406517] !mb-1">450</Text>
              <Text className="text-sm text-gray-600 !mb-0">Denier Thread</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#406517] !mb-1">240 lb</Text>
              <Text className="text-sm text-gray-600 !mb-0">Man Test</Text>
            </div>
            <div>
              <Text className="text-3xl font-bold text-[#406517] !mb-1">20+</Text>
              <Text className="text-sm text-gray-600 !mb-0">Years Experience</Text>
            </div>
          </Grid>
        </section>

        {/* ================================================================
            THE REAL DEAL
            ================================================================ */}
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg" className="items-center">
          <Stack gap="md">
            <Heading level={2}>The Real Difference</Heading>
            <Text className="text-gray-600">
              We've been through a dozen iterations of netting. The cheap stuff you see at 
              Home Depot? 90 denier. Ours? 450 denier. You could literally catch a falling 
              person in our netting.
            </Text>
            <BulletedList spacing="md">
              <ListItem variant="checked" iconColor="#406517">
                <strong>Solution dyed</strong> - won't fade like cheap alternatives
              </ListItem>
              <ListItem variant="checked" iconColor="#406517">
                <strong>Double stitched</strong> - with UV protected marine-grade thread
              </ListItem>
              <ListItem variant="checked" iconColor="#406517">
                <strong>Stainless steel fasteners</strong> - powder-coated aluminum tracking
              </ListItem>
              <ListItem variant="checked" iconColor="#406517">
                <strong>Custom fitted</strong> - measured to YOUR space, not "one size fits all"
              </ListItem>
            </BulletedList>
            <Button variant="primary" asChild className="w-fit">
              <Link href="/start-project?mode=quote&product=mosquito_curtains&utm_source=reddit&utm_medium=referral&utm_campaign=mc_quote">
                Get My Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </Stack>
          <Grid responsiveCols={{ mobile: 2, tablet: 2 }} gap="md">
            <Frame ratio="1/1" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Insect-Mesh-Holds-Up-240-LB-Man-400.jpg"
                alt="Our mesh holds 240lb man"
                className="w-full h-full object-cover"
              />
            </Frame>
            <Frame ratio="1/1" className="rounded-xl overflow-hidden">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Screen-Sewing-400.jpg"
                alt="Quality sewing process"
                className="w-full h-full object-cover"
              />
            </Frame>
          </Grid>
        </Grid>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <section className="bg-gradient-to-br from-[#406517] to-[#2d4710] rounded-3xl p-8 md:p-12 text-center text-white">
          <Bug className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <Heading level={2} className="!text-white !mb-4">Ready to Reclaim Your Outdoor Space?</Heading>
          <Text className="text-white/80 max-w-2xl mx-auto mb-8">
            Get an instant quote and see why 92,000+ customers chose us.
          </Text>
          <Button variant="outline" size="lg" className="!bg-white !text-[#406517] !border-white hover:!bg-white/90" asChild>
            <Link href="/start-project?mode=quote&product=mosquito_curtains&utm_source=reddit&utm_medium=referral&utm_campaign=mc_quote">
              <Calculator className="w-5 h-5 mr-2" />
              Get Instant Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </section>

        {/* ================================================================
            FINAL CTA TEMPLATE
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
