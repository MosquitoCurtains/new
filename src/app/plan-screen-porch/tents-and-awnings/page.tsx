'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  ArrowLeft,
  Tent,
  Phone,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Text, 
  Button, 
  Card,
  Heading,
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  PowerHeaderTemplate,
} from '@/lib/design-system'

export default function TentsAwningsPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Hero */}
        <div>
          <Link href="/plan-screen-porch" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Planning
          </Link>
          <PowerHeaderTemplate
            title="Tents and Awnings"
            variant="compact"
            actions={[]}
            trustBadge=""
          />
        </div>

        {/* Redirect to Free Standing - matches WordPress behavior */}
        <HeaderBarSection icon={Tent} label="Planning Tents & Awnings" variant="dark">
          <Card className="!p-8 !bg-[#003365]/5 !border-[#003365]/20 text-center">
            <Stack gap="md">
              <Heading level={2} className="!mb-2">We Want to Help</Heading>
              <Text className="text-gray-700 max-w-2xl mx-auto">
                Tents and awnings are unique structures and we want to help to make sure everything is just right for you. These projects are handled by our planning team.
              </Text>
              <Text className="text-gray-700 max-w-2xl mx-auto">
                For detailed planning information about awnings (including why we use grommets instead of tracking), pergolas, and other free-standing structures, visit our Free Standing Structures guide.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/plan-screen-porch/free-standing">
                    View Free Standing Structures Guide
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us Directly
                  </Link>
                </Button>
              </div>
            </Stack>
          </Card>
        </HeaderBarSection>

        {/* Key Points from WP */}
        <Card className="!p-6 !bg-white">
          <Heading level={3} className="!mb-4">Quick Notes for Awning Projects</Heading>
          <BulletedList spacing="md">
            <ListItem variant="arrow" iconColor="#003365">For Fixed Awnings we use Grommets (instead of either Velcro or Tracking).</ListItem>
            <ListItem variant="arrow" iconColor="#003365">We place grommets along the top of the curtain panel every 6-inches so that you can secure the top using plastic cable &quot;zip ties.&quot;</ListItem>
            <ListItem variant="arrow" iconColor="#003365">Awnings are the easiest of applications -- we will walk you through everything.</ListItem>
            <ListItem variant="arrow" iconColor="#003365">When you are ready, <Link href="/contact" className="text-[#406517] underline font-medium">contact us</Link> and follow the instructions for emailing digital photos.</ListItem>
            <ListItem variant="arrow" iconColor="#003365">We have software that enables us to draw on your photos AS YOU WATCH.</ListItem>
          </BulletedList>
        </Card>

        <FinalCTATemplate productLine="mc" />

      </Stack>
    </Container>
  )
}
