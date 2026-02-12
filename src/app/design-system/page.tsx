'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Container, 
  Stack, 
  Grid,
  Card,
  Button,
  Badge,
  Heading,
  Text,
  FeatureCard,
  BulletedList,
  ListItem,
  YouTubeEmbed,
  GoogleReviews,
  GradientSection,
  HeaderBarSection,
  CTASection,
  TwoColumnSection,
  // Templates
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  HowItWorksTemplate,
  WhoWeAreWhatWeDoTemplate,
  FinalCTATemplate,
  ProfessionalsCalloutTemplate,
  PowerHeaderTemplate,
} from '@/lib/design-system'
import { 
  Palette, 
  Layout, 
  Type, 
  Square, 
  Grid3X3,
  Star,
  ArrowRight,
  Phone,
  Shield,
  Wrench,
  Truck,
  Award,
  Bug,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// Pre-built Templates
const TEMPLATES = [
  { 
    name: 'PowerHeaderTemplate', 
    description: 'Hero header with video + action cards. Two variants: "stacked" (default) or "compact" (two-column)',
    component: 'PowerHeaderTemplate',
  },
  { 
    name: 'WhyChooseUsTemplate', 
    description: '"Why 92,000+ Customers Choose Us" section with Google Reviews and 4 feature cards',
    component: 'WhyChooseUsTemplate',
  },
  { 
    name: 'ClientReviewsTemplate', 
    description: '"X+ Happy Clients Since 2004" section with 6 review cards and See more reviews button (order count from DB)',
    component: 'ClientReviewsTemplate',
  },
  { 
    name: 'HowItWorksTemplate', 
    description: '3-step process section (Plan → Receive → Install)',
    component: 'HowItWorksTemplate',
  },
  { 
    name: 'WhoWeAreWhatWeDoTemplate', 
    description: 'Two-column "Who We Are" and "What We Do" cards',
    component: 'WhoWeAreWhatWeDoTemplate',
  },
  { 
    name: 'FinalCTATemplate', 
    description: 'Big gradient call-to-action section for page bottoms',
    component: 'FinalCTATemplate',
  },
  { 
    name: 'ProfessionalsCalloutTemplate', 
    description: '"For Professionals" callout with header bar',
    component: 'ProfessionalsCalloutTemplate',
  },
]

// Brand Colors
const BRAND_COLORS = [
  { name: 'Primary Green', hex: '#406517', usage: 'Main brand color, CTAs, success states' },
  { name: 'Navy Blue', hex: '#003365', usage: 'Secondary brand, professional sections' },
  { name: 'Accent Pink', hex: '#B30158', usage: 'DIY, special highlights' },
  { name: 'Gold/Orange', hex: '#FFA501', usage: 'Stars, ratings, energy' },
  { name: 'White', hex: '#FFFFFF', usage: 'Backgrounds, cards' },
  { name: 'Gray 900', hex: '#111827', usage: 'Text, dark headers' },
  { name: 'Gray 600', hex: '#4B5563', usage: 'Body text' },
  { name: 'Gray 200', hex: '#E5E7EB', usage: 'Borders, dividers' },
]

// Component Categories
const COMPONENT_CATEGORIES = [
  {
    name: 'Section Containers',
    icon: Layout,
    color: '#406517',
    components: [
      { name: 'GradientSection', description: 'Gradient-bordered section card with optional title/subtitle' },
      { name: 'HeaderBarSection', description: 'Section with colored header bar and icon' },
      { name: 'CTASection', description: 'Big gradient call-to-action section' },
      { name: 'TwoColumnSection', description: 'Responsive two-column layout' },
    ]
  },
  {
    name: 'Layout',
    icon: Grid3X3,
    color: '#003365',
    components: [
      { name: 'Container', description: 'Width-constrained content container' },
      { name: 'Stack', description: 'Vertical spacing between children' },
      { name: 'Grid', description: 'Responsive grid layout' },
      { name: 'TwoColumn', description: 'Two-column responsive layout' },
      { name: 'Frame', description: 'Aspect ratio container for images/video' },
    ]
  },
  {
    name: 'Typography',
    icon: Type,
    color: '#B30158',
    components: [
      { name: 'Heading', description: 'h1-h6 headings with consistent styling' },
      { name: 'Text', description: 'Body text with size variants' },
      { name: 'BulletedList', description: 'List with checkmarks or bullets' },
      { name: 'ListItem', description: 'Individual list item' },
    ]
  },
  {
    name: 'Cards',
    icon: Square,
    color: '#FFA501',
    components: [
      { name: 'Card', description: 'Basic card container' },
      { name: 'FeatureCard', description: 'Icon + title + description card' },
      { name: 'ItemListCard', description: 'Card with list of items' },
    ]
  },
  {
    name: 'Marketing',
    icon: Star,
    color: '#406517',
    components: [
      { name: 'GoogleReviews', description: 'Google reviews carousel from Featurable' },
      { name: 'YouTubeEmbed', description: 'Responsive YouTube video embed' },
      { name: 'Badge', description: 'Small label/tag component' },
    ]
  },
]

export default function DesignSystemPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(COMPONENT_CATEGORIES.map(c => c.name))
  )

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 1500)
  }

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(name)) {
        newSet.delete(name)
      } else {
        newSet.add(name)
      }
      return newSet
    })
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Mosquito Curtains Design System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all components, copy code snippets, and see live examples.
            Changes to these components update everywhere across the site.
          </p>
        </div>

        {/* Color Palette */}
        <GradientSection variant="mixed" title="Brand Colors" subtitle="Click any color to copy its hex code">
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="w-full">
            {BRAND_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => copyColor(color.hex)}
                className="group text-left"
              >
                <Card variant="elevated" className="!p-4 hover:shadow-lg transition-all">
                  <div 
                    className="w-full h-16 rounded-xl mb-3 border-2 border-gray-100 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{color.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                    </div>
                    {copiedColor === color.hex ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{color.usage}</p>
                </Card>
              </button>
            ))}
          </Grid>
        </GradientSection>

        {/* Components by Category */}
        <Stack gap="md">
          {COMPONENT_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.has(category.name)
            const CategoryIcon = category.icon
            
            return (
              <Card key={category.name} className="!p-0 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <CategoryIcon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
                      <p className="text-sm text-gray-500">{category.components.length} components</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md" className="mt-4">
                      {category.components.map((comp) => (
                        <Card 
                          key={comp.name} 
                          variant="outlined" 
                          className="!p-4 hover:border-gray-300 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">{comp.name}</h3>
                          <p className="text-sm text-gray-600">{comp.description}</p>
                          <code className="block mt-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {'<'}{comp.name} {'/>'}
                          </code>
                        </Card>
                      ))}
                    </Grid>
                  </div>
                )}
              </Card>
            )
          })}
        </Stack>

        {/* Pre-built Templates Section */}
        <Card className="!p-0 overflow-hidden border-2 border-[#406517]/30">
          <div className="bg-[#406517] px-6 py-4">
            <div className="flex items-center gap-3">
              <Layout className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Pre-built Templates</h2>
              <Badge className="bg-white/20 text-white border-0">{TEMPLATES.length} templates</Badge>
            </div>
            <p className="text-white/80 text-sm mt-1">
              Drop-in content blocks. Edit once, update everywhere.
            </p>
          </div>
          <div className="p-6">
            <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
              {TEMPLATES.map((template) => (
                <Card 
                  key={template.name}
                  variant="outlined" 
                  className="!p-4 hover:border-[#406517]/50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <code className="block text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {'<'}{template.name} {'/>'} 
                  </code>
                </Card>
              ))}
            </Grid>
          </div>
        </Card>

        {/* Live Examples */}
        <div className="py-8">
          <Heading level={2} className="text-center !mb-8">Live Component Examples</Heading>
        </div>

        {/* GradientSection Example */}
        <GradientSection 
          variant="green" 
          title="GradientSection Example"
          subtitle="This is a reusable gradient-bordered section"
        >
          <Grid responsiveCols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="w-full">
            <FeatureCard 
              icon={Shield} 
              title={<span className="text-[#406517]">Quality</span>}
              iconColor="#406517"
              variant="elevated"
              className="!bg-[#406517]/5 !border-[#406517]/20 text-center"
            >
              Marine-grade materials built to last.
            </FeatureCard>
            <FeatureCard 
              icon={Wrench} 
              title={<span className="text-[#003365]">Easy Install</span>}
              iconColor="#003365"
              variant="elevated"
              className="!bg-[#003365]/5 !border-[#003365]/20 text-center"
            >
              DIY installation in an afternoon.
            </FeatureCard>
            <FeatureCard 
              icon={Truck} 
              title={<span className="text-[#B30158]">Fast Shipping</span>}
              iconColor="#B30158"
              variant="elevated"
              className="!bg-[#B30158]/5 !border-[#B30158]/20 text-center"
            >
              Delivered in 3-8 business days.
            </FeatureCard>
            <FeatureCard 
              icon={Award} 
              title={<span className="text-[#FFA501]">Guaranteed</span>}
              iconColor="#FFA501"
              variant="elevated"
              className="!bg-[#FFA501]/5 !border-[#FFA501]/20 text-center"
            >
              Satisfaction guaranteed.
            </FeatureCard>
          </Grid>
          <div className="flex justify-center pt-6">
            <Button variant="primary">
              Call to Action
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </GradientSection>

        {/* HeaderBarSection Example */}
        <HeaderBarSection 
          icon={Bug} 
          label="HeaderBarSection Example"
          variant="green"
          headerSubtitle="With optional subtitle"
        >
          <TwoColumnSection
            left={
              <Stack gap="md">
                <Heading level={3}>Two Column Content</Heading>
                <Text className="text-gray-600">
                  This demonstrates the TwoColumnSection component inside a HeaderBarSection.
                  The layout is responsive - stacking on mobile and side-by-side on desktop.
                </Text>
                <BulletedList spacing="sm">
                  <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
                  <ListItem variant="checked" iconColor="#406517">Feature three</ListItem>
                </BulletedList>
                <div className="pt-2">
                  <Button variant="primary">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Stack>
            }
            right={
              <YouTubeEmbed
                videoId="FqNe9pDsZ8M"
                title="Example Video"
                variant="card"
                thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
              />
            }
          />
        </HeaderBarSection>

        {/* CTASection Example */}
        <CTASection
          title="CTASection Example"
          subtitle="This is the big gradient call-to-action section. Edit it once, update everywhere."
          variant="green"
        >
          <Button variant="highlight" size="lg">
            Primary CTA
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
            <Phone className="mr-2 w-5 h-5" />
            Secondary CTA
          </Button>
        </CTASection>

        {/* Live Template Examples */}
        <div className="py-8">
          <Heading level={2} className="text-center !mb-2">Live Template Examples</Heading>
          <p className="text-center text-gray-600 mb-8">These are the actual templates - edit them to update everywhere</p>
        </div>

        {/* PowerHeader - Compact Variant */}
        <Card variant="outlined" className="!p-0 overflow-hidden">
          <div className="bg-[#003365] px-6 py-3 flex items-center gap-3">
            <Layout className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">PowerHeaderTemplate - variant="compact"</span>
            <Badge className="bg-white/20 text-white text-xs border-0">Space-saving</Badge>
          </div>
          <div className="p-6">
            <PowerHeaderTemplate
              title="Screened Porch Enclosures"
              subtitle="Modular Mosquito Netting Panels custom-made to fit any space. One system, limitless applications."
              videoId="FqNe9pDsZ8M"
              videoTitle="Mosquito Curtains Overview"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Mosquito-Netting-Curtains-Video-Thumbnail-1.jpg"
              variant="compact"
            />
          </div>
        </Card>

        {/* PowerHeader - Stacked Variant */}
        <Card variant="outlined" className="!p-0 overflow-hidden">
          <div className="bg-[#406517] px-6 py-3 flex items-center gap-3">
            <Layout className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">PowerHeaderTemplate - variant="stacked"</span>
            <Badge className="bg-white/20 text-white text-xs border-0">Default</Badge>
          </div>
          <div className="p-6">
            <PowerHeaderTemplate
              title="Clear Vinyl Enclosures"
              subtitle="Four-season room protection. Wind, rain, and cold stay outside."
              videoId="ca6GufadXoE"
              videoTitle="Clear Vinyl Overview"
              thumbnailUrl="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/Clear-Vinyl-Video-Thumbnail.jpg"
              variant="stacked"
            />
          </div>
        </Card>

        <WhyChooseUsTemplate showReviews={false} />

        <ClientReviewsTemplate />
        
        <HowItWorksTemplate />
        
        <WhoWeAreWhatWeDoTemplate />
        
        <ProfessionalsCalloutTemplate />
        
        <FinalCTATemplate />

        {/* Import Reference */}
        <Card className="!p-6">
          <Heading level={3} className="!mb-4">Import Components & Templates</Heading>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{`import { 
  // PRE-BUILT TEMPLATES (drop-in content blocks)
  WhyChooseUsTemplate,    // "Why 92,000+ Customers Choose Us"
  ClientReviewsTemplate,  // X+ Happy Clients, 6 reviews, See more reviews
  HowItWorksTemplate,     // 3-step process
  WhoWeAreWhatWeDoTemplate,
  FinalCTATemplate,       // Big gradient CTA
  ProfessionalsCalloutTemplate,
  
  // Section Containers (empty, add your content)
  GradientSection,
  HeaderBarSection,
  CTASection,
  TwoColumnSection,
  
  // Layout
  Container, Stack, Grid, TwoColumn, Frame,
  
  // Typography
  Heading, Text, BulletedList, ListItem,
  
  // Cards
  Card, FeatureCard,
  
  // Marketing
  GoogleReviews, YouTubeEmbed, Badge, Button,
} from '@/lib/design-system'`}
          </pre>
        </Card>

        {/* Quick Stats */}
        <Card variant="outlined" className="!p-6">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#406517]">{TEMPLATES.length}</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#003365]">4</div>
              <div className="text-sm text-gray-500">Section Containers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#B30158]">20+</div>
              <div className="text-sm text-gray-500">Components</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFA501]">100%</div>
              <div className="text-sm text-gray-500">Mobile-First</div>
            </div>
          </div>
        </Card>
      </Stack>
    </Container>
  )
}
