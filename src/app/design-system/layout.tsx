'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Container, 
  Stack, 
  Card,
  Text,
} from '@/lib/design-system'
import { 
  Layout, 
  Type, 
  Square, 
  FormInput,
  List,
  Layers,
  Play,
  ChevronRight,
  Home,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    title: 'Layout',
    icon: Layout,
    items: [
      { name: 'Container', href: '/design-system/container' },
      { name: 'Stack', href: '/design-system/stack' },
      { name: 'Grid', href: '/design-system/grid' },
      { name: 'TwoColumn', href: '/design-system/two-column' },
      { name: 'Frame', href: '/design-system/frame' },
    ]
  },
  {
    title: 'Sections',
    icon: Layers,
    items: [
      { name: 'HeaderBarSection', href: '/design-system/header-bar-section' },
      { name: 'GradientSection', href: '/design-system/gradient-section' },
      { name: 'CTASection', href: '/design-system/cta-section' },
    ]
  },
  {
    title: 'Typography',
    icon: Type,
    items: [
      { name: 'Heading', href: '/design-system/heading' },
      { name: 'Text', href: '/design-system/text' },
    ]
  },
  {
    title: 'Forms',
    icon: FormInput,
    items: [
      { name: 'Button', href: '/design-system/button' },
      { name: 'Input', href: '/design-system/input' },
    ]
  },
  {
    title: 'Cards',
    icon: Square,
    items: [
      { name: 'Card', href: '/design-system/card' },
      { name: 'FeatureCard', href: '/design-system/feature-card' },
    ]
  },
  {
    title: 'Lists',
    icon: List,
    items: [
      { name: 'BulletedList', href: '/design-system/bulleted-list' },
    ]
  },
  {
    title: 'Media',
    icon: Play,
    items: [
      { name: 'YouTubeEmbed', href: '/design-system/youtube-embed' },
    ]
  },
  {
    title: 'Templates',
    icon: Layers,
    items: [
      { name: 'PowerHeaderTemplate', href: '/design-system/power-header-template' },
      { name: 'WhyChooseUsTemplate', href: '/design-system/why-choose-us-template' },
      { name: 'FinalCTATemplate', href: '/design-system/final-cta-template' },
    ]
  },
]

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOverview = pathname === '/design-system'

  return (
    <Container size="full">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4 sticky top-0 h-screen overflow-y-auto hidden lg:block">
          <Stack gap="md">
            {/* Logo/Home */}
            <Link 
              href="/design-system" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                isOverview ? 'bg-[#406517] text-white' : 'text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Home className="w-5 h-5" />
              Design System
            </Link>

            {/* Navigation Sections */}
            {NAV_SECTIONS.map((section) => {
              const SectionIcon = section.icon
              return (
                <div key={section.title}>
                  <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <SectionIcon className="w-4 h-4" />
                    {section.title}
                  </div>
                  <Stack gap="xs" className="mt-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive 
                              ? 'bg-[#406517] text-white' 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                          {item.name}
                        </Link>
                      )
                    })}
                  </Stack>
                </div>
              )
            })}
          </Stack>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </Container>
  )
}
