'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Upload,
  Camera,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  Card,
  Heading,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
} from '@/lib/design-system'

export default function UploadsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <section className="relative py-12 text-center">
          <Stack gap="md" className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[#406517]/10 rounded-full mx-auto flex items-center justify-center">
              <Upload className="w-10 h-10 text-[#406517]" />
            </div>
            <Heading level={1} className="!text-4xl md:!text-5xl">
              Client File Uploads
            </Heading>
            <Text className="text-xl text-gray-600">
              Upload your photos and measurements directly to our team. We use these 
              to create your custom quote and ensure perfect fit.
            </Text>
          </Stack>
        </section>

        {/* Upload Options */}
        <HeaderBarSection icon={Upload} label="How to Send Your Files" variant="dark">
          <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#406517]/10 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#406517]" />
                </div>
                <Heading level={4}>Photos</Heading>
              </div>
              <Text className="text-gray-600 mb-4">
                Clear photos help us understand your space and provide accurate quotes.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Wide shots of the entire structure</ListItem>
                <ListItem variant="checked" iconColor="#406517">Close-ups of mounting surfaces</ListItem>
                <ListItem variant="checked" iconColor="#406517">Any obstacles or unique features</ListItem>
                <ListItem variant="checked" iconColor="#406517">Multiple angles if possible</ListItem>
              </BulletedList>
            </Card>
            <Card variant="elevated" className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#003365]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#003365]" />
                </div>
                <Heading level={4}>Measurements</Heading>
              </div>
              <Text className="text-gray-600 mb-4">
                Accurate measurements ensure your curtains fit perfectly.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#003365">Width of each opening</ListItem>
                <ListItem variant="checked" iconColor="#003365">Height (floor to ceiling)</ListItem>
                <ListItem variant="checked" iconColor="#003365">Note any variations</ListItem>
                <ListItem variant="checked" iconColor="#003365">Include a sketch if helpful</ListItem>
              </BulletedList>
            </Card>
          </Grid>
        </HeaderBarSection>

        {/* Upload Method */}
        <HeaderBarSection icon={CheckCircle} label="Upload Your Files" variant="dark">
          <Card className="!p-8 text-center">
            <Stack gap="md">
              <Heading level={3}>Start Your Project to Upload Files</Heading>
              <Text className="text-gray-600 max-w-2xl mx-auto">
                When you start a project with us, you'll be able to upload photos and 
                measurements directly through our project wizard. This keeps everything 
                organized and ensures we have what we need for your quote.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="primary" asChild>
                  <Link href="/start-project">
                    Start Your Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Stack>
          </Card>
        </HeaderBarSection>

        {/* Alternative: Email */}
        <Card className="!p-6 !bg-amber-50 !border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <Stack gap="sm">
              <Heading level={4}>Already Working With Us?</Heading>
              <Text className="text-gray-600 !mb-0">
                If you're already in contact with one of our planners, you can email 
                files directly to them. Check your email for the contact details from 
                your planner.
              </Text>
            </Stack>
          </div>
        </Card>

        {/* Final CTA */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
