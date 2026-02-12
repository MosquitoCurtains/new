'use client'

import Link from 'next/link'
import { 
  ArrowLeft,
  Award,
  Wrench,
  AlertTriangle,
  Layers,
} from 'lucide-react'
import { 
  Container, 
  Stack, 
  Grid, 
  Text, 
  Card,
  Heading,
  Frame,
  TwoColumn,
  BulletedList,
  ListItem,
  ClientReviewsTemplate,
  HeaderBarSection,
  YouTubeEmbed,
  PowerHeaderTemplate,
} from '@/lib/design-system'
import { ClearVinylFooter } from '@/components/marketing/ClearVinylFooter'

// ============================================================================
// PAGE CONTENT (extracted from WordPress via Cheerio)
// Source: https://www.mosquitocurtains.com/what-makes-our-clear-vinyl-product-better/
// ============================================================================

const PAGE_CONFIG = {
  title: 'What Makes Our Clear Vinyl Product Better',
  subtitle: 'Quality, service & price determines VALUE! See what makes our product that high value you\'ve been looking for with clear plastic enclosures.',
  videoId: 'KTrkT6DHm9k',
  videoTitle: 'Clear Vinyl Panel Construction',
}

const SECTIONS = {
  construction: {
    icon: Award,
    label: 'Meticulous Construction Quality at a Better Price',
    bullets: [
      'We have a perimeter webbing all double-stitched with UV protected marine-grade thread.',
      'We add a special hidden tape to prevent stitching from perforating the plastic you will never know is even there. Why? Because we know it matters years from now.',
      'We have excellent automation that enables us to keep our costs much lower with perfect stitching.',
    ],
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Meticulous-Clear-Vinyl-Construction-1920.jpg',
    imageAlt: 'Meticulous clear vinyl construction detail',
  },
  fastening: {
    icon: Wrench,
    label: 'Smarter Fastening System',
    bullets: [
      'Our system is simple and not intrusive. If it is easy to hang and remove, you won\'t require paying a fee to have a professional hang and remove AND you will be more inclined to remove them during the hot summer sun that will damage panels prematurely. Sometimes complicated & expensive isn\'t better!',
      'We focus on what is important. Quality, Aesthetics & Performance at a Better Price!',
    ],
    comparisonImages: {
      bad: {
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/What-Not-To-Do.jpg',
        alt: 'Example of poor quality clear vinyl - this is NOT our product',
        caption: 'This is NOT our Product',
      },
      good: {
        src: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/MOSQUITO-CURTAINS-CLEAR-VINYL-EXAMPLE-2400.jpg',
        alt: 'Mosquito Curtains clear vinyl quality example',
        caption: 'This is What We Do',
      },
    },
  },
  materials: {
    icon: Layers,
    label: 'Better Quality Clear Vinyl Enclosure Materials',
    bullets: [
      'Most folks like us in the industry use some version of 20 mil double-polished clear vinyl plastic, but not all CV is created equal.',
      'We have rare 72\u2033 (tall) goods as opposed to most who have only 54\u2033 goods. We have larger seamless windows and less production cost.',
      'We do not heat weld panels together because it is the first thing to fail.',
      'We don\'t use cheap $2.85/yd plastic canvas aprons that look industrial and cheap.',
      'We use a waterproof canvas similar to a classy Gortex-like material that costs us $10.64/yd.',
    ],
  },
  recommend: {
    icon: AlertTriangle,
    label: 'When We Will Recommend Another Provider',
    bullets: [
      'Very Large openings with little or no structural support. Sometimes you just need the clunky hardware others offer for severe wind loads.',
      'Motorized Clear Vinyl Panels. They are incredible when done right but must be professionally installed and they cost a fortune. BE CAREFUL on these.',
      'For temperatures below -15\u00B0 F (-26\u00B0 C). You need a special supplier of 40 mil to avoid what is called cold cracking.',
      'For those that want an overhead roof panel, Awning companies are better equipped for waterproofing roof panels that will drain properly.',
      'We want you to shop around because we are sassy and know we offer the best value.',
      'Hint: If you want to compare us, try your local awning company or check more online.',
    ],
  },
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function ClearVinylQualityPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        
        {/* Back Link */}
        <Link href="/clear-vinyl" className="inline-flex items-center text-gray-500 hover:text-gray-700 -mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clear Vinyl
        </Link>

        <PowerHeaderTemplate
          title={PAGE_CONFIG.title}
          subtitle={PAGE_CONFIG.subtitle}
          videoId={PAGE_CONFIG.videoId}
          videoTitle={PAGE_CONFIG.videoTitle}
          variant="compact"
        />

        {/* ============================================================ */}
        {/* COMPARISON: This is NOT our Product vs This is What We Do */}
        {/* ============================================================ */}
        <HeaderBarSection icon={SECTIONS.fastening.icon} label={SECTIONS.fastening.label} variant="dark">
          <Stack gap="lg">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
              <Card className="!p-0 overflow-hidden !border-red-300">
                <Frame ratio="4/3">
                  <img
                    src={SECTIONS.fastening.comparisonImages.bad.src}
                    alt={SECTIONS.fastening.comparisonImages.bad.alt}
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="bg-red-600 text-white text-center py-2 font-semibold">
                  {SECTIONS.fastening.comparisonImages.bad.caption}
                </div>
              </Card>
              <Card className="!p-0 overflow-hidden !border-[#406517]">
                <Frame ratio="4/3">
                  <img
                    src={SECTIONS.fastening.comparisonImages.good.src}
                    alt={SECTIONS.fastening.comparisonImages.good.alt}
                    className="w-full h-full object-cover"
                  />
                </Frame>
                <div className="bg-[#406517] text-white text-center py-2 font-semibold">
                  {SECTIONS.fastening.comparisonImages.good.caption}
                </div>
              </Card>
            </Grid>
            <BulletedList spacing="md">
              {SECTIONS.fastening.bullets.map((bullet, i) => (
                <ListItem key={i} variant="checked" iconColor="#406517">
                  {bullet}
                </ListItem>
              ))}
            </BulletedList>
          </Stack>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* CONSTRUCTION QUALITY */}
        {/* ============================================================ */}
        <HeaderBarSection icon={SECTIONS.construction.icon} label={SECTIONS.construction.label} variant="dark">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <BulletedList spacing="md">
                {SECTIONS.construction.bullets.map((bullet, i) => (
                  <ListItem key={i} variant="checked" iconColor="#406517">
                    {bullet}
                  </ListItem>
                ))}
              </BulletedList>
            </Stack>
            <Frame ratio="16/9" className="rounded-xl overflow-hidden">
              <img
                src={SECTIONS.construction.image}
                alt={SECTIONS.construction.imageAlt}
                className="w-full h-full object-cover"
              />
            </Frame>
          </TwoColumn>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* BETTER MATERIALS */}
        {/* ============================================================ */}
        <HeaderBarSection icon={SECTIONS.materials.icon} label={SECTIONS.materials.label} variant="dark">
          <BulletedList spacing="md">
            {SECTIONS.materials.bullets.map((bullet, i) => (
              <ListItem key={i} variant="checked" iconColor="#406517">
                {bullet}
              </ListItem>
            ))}
          </BulletedList>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* WHEN WE RECOMMEND ANOTHER PROVIDER */}
        {/* ============================================================ */}
        <HeaderBarSection icon={SECTIONS.recommend.icon} label={SECTIONS.recommend.label} variant="dark">
          <BulletedList spacing="md">
            {SECTIONS.recommend.bullets.map((bullet, i) => (
              <ListItem key={i} variant="x" iconColor="#dc2626">
                {bullet}
              </ListItem>
            ))}
          </BulletedList>
        </HeaderBarSection>

        {/* ============================================================ */}
        {/* CLIENT REVIEWS (shared template) */}
        {/* ============================================================ */}
        <ClientReviewsTemplate />

        <ClearVinylFooter />

      </Stack>
    </Container>
  )
}
