'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  TwoColumn,
  BulletedList,
  ListItem,
  Button,
} from '@/lib/design-system'
import { Copy, Check, ArrowRight } from 'lucide-react'

const CODE_EXAMPLE = `import { TwoColumn, Stack, Text, BulletedList, ListItem, Button, YouTubeEmbed } from '@/lib/design-system'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

<TwoColumn gap="lg" className="items-center">
  {/* Left: Text Content */}
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
  
  {/* Right: Media */}
  <YouTubeEmbed videoId="VIDEO_ID" title="Video Title" variant="card" />
</TwoColumn>`

export default function TwoColumnPage() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Heading level={1} className="!mb-0">TwoColumn</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Layout</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Two-column responsive layout. Stacks vertically on mobile, side-by-side on desktop.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/layout/TwoColumn.tsx
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

      {/* Live Example */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Live Example</Heading>
        <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300">
          <TwoColumn gap="lg" className="items-center">
            <Stack gap="md">
              <Text className="text-gray-600">
                This is the left column content. It typically contains text, 
                bullet points, and a call-to-action button.
              </Text>
              <BulletedList spacing="sm">
                <ListItem variant="checked" iconColor="#406517">Feature one with details</ListItem>
                <ListItem variant="checked" iconColor="#406517">Feature two with details</ListItem>
                <ListItem variant="checked" iconColor="#406517">Feature three with details</ListItem>
              </BulletedList>
              <div className="pt-2">
                <Button variant="primary">
                  Example Button
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Stack>
            <div className="bg-[#406517]/10 border-2 border-[#406517]/30 rounded-xl aspect-video flex items-center justify-center">
              <Text className="text-[#406517] font-semibold !mb-0">Video/Image Area</Text>
            </div>
          </TwoColumn>
        </div>
        <Text size="xs" className="text-gray-400 text-center mt-4 !mb-0">
          Resize your browser to see responsive stacking behavior
        </Text>
      </Card>

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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">gap</code></td>
                <td className="py-3 pr-4 text-gray-600">'sm' | 'md' | 'lg' | 'xl'</td>
                <td className="py-3 pr-4 text-gray-600">'md'</td>
                <td className="py-3 text-gray-600">Space between columns</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">className</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Additional CSS classes</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode (2 children)</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Left and right column content</td>
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
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">gap="lg"</code> for content sections</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Add <code className="bg-gray-100 px-1 rounded">className="items-center"</code> for vertical alignment</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">First child = text content, second child = media (video/image)</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use inside <code className="bg-gray-100 px-1 rounded">HeaderBarSection</code> for content sections</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
