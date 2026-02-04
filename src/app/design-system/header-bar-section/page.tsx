'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Button,
  HeaderBarSection,
  TwoColumn,
  BulletedList,
  ListItem,
} from '@/lib/design-system'
import { Copy, Check, Bug, Snowflake, Wrench, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const VARIANTS = [
  { name: 'green', color: '#406517', icon: Bug },
  { name: 'blue', color: '#003365', icon: Snowflake },
  { name: 'pink', color: '#B30158', icon: Wrench },
  { name: 'dark', color: '#111827', icon: Award },
]

const CODE_EXAMPLE = `import { HeaderBarSection, TwoColumn, Stack, Text, BulletedList, ListItem, Button, YouTubeEmbed } from '@/lib/design-system'
import { Bug, ArrowRight } from 'lucide-react'
import Link from 'next/link'

<HeaderBarSection icon={Bug} label="Section Title" variant="dark">
  <TwoColumn gap="lg" className="items-center">
    <Stack gap="md">
      <Text className="text-gray-600">
        Your content paragraph here...
      </Text>
      <BulletedList spacing="sm">
        <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
        <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
      </BulletedList>
      <div className="pt-2">
        <Button variant="primary" asChild>
          <Link href="/page">
            Call to Action
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Stack>
    <YouTubeEmbed videoId="VIDEO_ID" title="Video Title" variant="card" />
  </TwoColumn>
</HeaderBarSection>`

export default function HeaderBarSectionPage() {
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>('dark')

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const SelectedIcon = VARIANTS.find(v => v.name === selectedVariant)?.icon || Bug

  return (
    <Stack gap="lg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Heading level={1} className="!mb-0">HeaderBarSection</Heading>
          <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30">Sections</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Section container with colored header bar and icon. The primary pattern for content sections in category pages.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/sections/HeaderBarSection.tsx
          </code>
        </Text>
      </Card>

      {/* Usage */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Usage</Heading>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap">
            {CODE_EXAMPLE}
          </pre>
          <button
            onClick={copyCode}
            className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </Card>

      {/* Variant Selector */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Variants</Heading>
        <div className="flex flex-wrap gap-2 mb-6">
          {VARIANTS.map((variant) => (
            <button
              key={variant.name}
              onClick={() => setSelectedVariant(variant.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedVariant === variant.name
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedVariant === variant.name ? { backgroundColor: variant.color } : {}}
            >
              <variant.icon className="w-4 h-4" />
              {variant.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Live Example */}
      <HeaderBarSection 
        icon={SelectedIcon} 
        label={`Example Section (variant="${selectedVariant}")`}
        variant={selectedVariant as any}
      >
        <TwoColumn gap="lg" className="items-center">
          <Stack gap="md">
            <Text className="text-gray-600">
              This is a live example of the HeaderBarSection component. It creates a professional
              section with a colored header bar containing an icon and label.
            </Text>
            <BulletedList spacing="sm">
              <ListItem variant="checked" iconColor="#406517">Perfect for category page content</ListItem>
              <ListItem variant="checked" iconColor="#406517">Combines with TwoColumn for text + media</ListItem>
              <ListItem variant="checked" iconColor="#406517">Multiple color variants available</ListItem>
            </BulletedList>
            <div className="pt-2">
              <Button variant="primary" asChild>
                <Link href="/screened-porch">
                  See Live Example
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </Stack>
          <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center">
            <Text className="text-gray-500 !mb-0">Video/Image goes here</Text>
          </div>
        </TwoColumn>
      </HeaderBarSection>

      {/* Props */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Props</Heading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold">Prop</th>
                <th className="text-left py-2 pr-4 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 font-semibold">Default</th>
                <th className="text-left py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">icon</code></td>
                <td className="py-3 pr-4 text-gray-600">LucideIcon</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Icon component from lucide-react</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">label</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Text displayed in header bar</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'green' | 'blue' | 'pink' | 'dark'</td>
                <td className="py-3 pr-4 text-gray-600">'green'</td>
                <td className="py-3 text-gray-600">Color theme of header bar</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Section content</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">variant="dark"</code> for most content sections</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Combine with <code className="bg-gray-100 px-1 rounded">TwoColumn</code> for text + media layouts</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">See <code className="bg-gray-100 px-1 rounded">/screened-porch</code> for real examples</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
