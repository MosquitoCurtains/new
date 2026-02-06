'use client'

import Link from 'next/link'
import { 
  Briefcase,
  Users,
  Heart,
  Shield,
  MessageSquare,
  Sparkles,
  Award,
  ArrowRight,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Button, 
  BulletedList,
  ListItem,
  FinalCTATemplate,
  HeaderBarSection,
  Card,
  Heading,
  YouTubeEmbed,
} from '@/lib/design-system'
import { VIDEOS } from '@/lib/constants/videos'

// Required skills
const REQUIRED_SKILLS = [
  'Ability to communicate effectively and with confidence',
  'A pleasant demeanor - someone who genuinely likes other people',
  'The ability to teach effectively and efficiently',
  'Creativity and good spatial awareness',
  'Willingness to work overtime during high season',
  'Someone who can handle problems calmly and methodically',
  'Someone who can imagine what it is like to be a business owner',
  'Good attention to detail and nimble ability to calculate basic math',
  'Familiarity with Excel and general computer skills',
  'Well organized and able to work individually and in teams',
  'A general knowledge of home improvement (what is a soffit, a joist, a header beam?)',
]

export default function OpportunitiesPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <div className="text-center py-12 md:py-16">
          <div className="inline-flex items-center gap-2 bg-[#406517]/10 text-[#406517] text-sm px-4 py-2 rounded-full mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Join Our Team</span>
          </div>
          <Heading level={1} className="!text-3xl md:!text-4xl lg:!text-5xl !mb-4">
            Career Opportunities
          </Heading>
          <Text className="text-gray-600 text-lg max-w-2xl mx-auto">
            Want to join the Mosquito Curtains team? We&apos;re always looking for great people 
            who are passionate about helping customers.
          </Text>
        </div>

        {/* ================================================================
            WORK ENVIRONMENT
            ================================================================ */}
        <HeaderBarSection icon={Users} label="Our Work Environment" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              We are a small family business that started over a garage 16 years ago. We now occupy a 16,000 sq ft 
              facility in Alpharetta, GA with 20 fantastic hard working employees.
            </Text>
            <Card className="p-6 bg-[#406517]/5 border-[#406517]/20">
              <Text className="text-[#406517] font-medium text-lg text-center">
                The ethos of our work environment is to have fun while working hard together.
              </Text>
            </Card>
            <Text className="text-gray-600">
              Those that upset the positive chemistry we&apos;ve built here together are simply asked to leave. As the owner, 
              my job is to protect everyone from toxic people that make others miserable. No one raises their voice here.
            </Text>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            BUSINESS SECURITY
            ================================================================ */}
        <HeaderBarSection icon={Shield} label="The Security of our Business and your Job" variant="dark">
          <Text className="text-gray-600">
            We are very healthy and growing like a weed. We have no debt either in our business nor the building we 
            occupy, so we can weather unpredictable storms. Because we are a value product, we actually seem to thrive 
            during recessions.
          </Text>
        </HeaderBarSection>

        {/* ================================================================
            SALES POSITIONS
            ================================================================ */}
        <HeaderBarSection icon={Briefcase} label="Planning and Sales Positions Available" variant="dark">
          <Stack gap="lg">
            <div>
              <Text className="text-gray-600 mb-4">
                Do you enjoy selling trust, respect, and likability? Great! Because we have an incredible product that 
                sells itself. This isn&apos;t a product you need to push. There are no cold calls to make. We will fill 
                your pipeline with clients who have already reached out to us.
              </Text>
            </div>

            <Card className="p-6">
              <Text className="font-semibold text-gray-900 mb-4">Required Skills:</Text>
              <BulletedList spacing="sm">
                {REQUIRED_SKILLS.map((skill, idx) => (
                  <ListItem key={idx} variant="checked" iconColor="#406517">{skill}</ListItem>
                ))}
              </BulletedList>
            </Card>

            <Card className="p-6 bg-gray-50">
              <Text className="font-semibold text-gray-900 mb-3">What will your typical day look like?</Text>
              <Text className="text-gray-600">
                Clients email us photos of their projects. You will invite them to a planning session which is more 
                or less a &quot;virtual house call&quot;. In the session, you will use our proprietary software to help them 
                plan their project.
              </Text>
            </Card>

            <Card className="p-6 bg-gray-50">
              <Text className="font-semibold text-gray-900 mb-3">Compensation</Text>
              <Text className="text-gray-600">
                We have an hourly component to compensation and a commission component. To give you realistic 
                expectations, a first year sales person can expect competitive compensation with significant 
                growth potential.
              </Text>
            </Card>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            APPLICATION FORM PLACEHOLDER
            ================================================================ */}
        <HeaderBarSection icon={MessageSquare} label="Apply Now" variant="dark">
          <Card className="p-8 text-center">
            <Heading level={3} className="!text-xl !mb-4">
              Please check out our website for an understanding of our business model, then apply below.
            </Heading>
            <Text className="text-gray-600 mb-6">
              Send your resume and a brief description of why you&apos;d be a good fit for our team.
            </Text>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <a href="mailto:jobs@mosquitocurtains.com?subject=Job Application">
                  Email Your Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:7706454745">
                  Call (770) 645-4745
                </a>
              </Button>
            </div>
          </Card>
        </HeaderBarSection>

        {/* ================================================================
            COMPANY VIDEO
            ================================================================ */}
        <HeaderBarSection icon={Sparkles} label="See Who We Are" variant="dark">
          <Card className="p-6">
            <Stack gap="md" className="items-center text-center">
              <Text className="text-gray-600 max-w-2xl">
                Watch this video to learn more about our company and what it's like to work here.
              </Text>
              <div className="w-full max-w-3xl">
                <YouTubeEmbed videoId={VIDEOS.COMPANY_OVERVIEW} title="Mosquito Curtains Company Overview" variant="card" />
              </div>
            </Stack>
          </Card>
        </HeaderBarSection>

        {/* ================================================================
            COMPANY STORY
            ================================================================ */}
        <HeaderBarSection icon={Sparkles} label="The Inception of a Dream" variant="dark">
          <Stack gap="md">
            <Text className="text-gray-600">
              The idea came to us in 1999 when we wanted to screen our own porch. We called a contractor who quoted 
              us $4,000 to screen our porch. Considering what was involved to frame, prime, paint, frame a door, 
              and screen it all, this seemed like a fair price. But I thought it was too much for something so temporal.
            </Text>
            <Text className="text-gray-600">
              We knew there had to be a better way. I trekked off to the fabric store and bought some netting and 
              webbing material. Unfortunately, fabric stores only carry 60″ wide goods, so we had to seam them 
              vertically.
            </Text>
            <Text className="text-gray-600">
              In 2004, the stars had aligned where I wasn&apos;t happy as an institutional bond salesman and was looking 
              for a career change and we decided to go for it.
            </Text>
            <Card className="p-6 bg-[#406517]/5 border-[#406517]/20 text-center">
              <Text className="text-[#406517] font-semibold text-lg">
                92,083+ Happy Customers Since 2004
              </Text>
            </Card>
          </Stack>
        </HeaderBarSection>

        {/* ================================================================
            FINAL CTA
            ================================================================ */}
        <FinalCTATemplate />

      </Stack>
    </Container>
  )
}
