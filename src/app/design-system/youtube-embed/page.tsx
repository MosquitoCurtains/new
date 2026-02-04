'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  YouTubeEmbed,
  Grid,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { YouTubeEmbed } from '@/lib/design-system'

// Card variant (most common)
<YouTubeEmbed
  videoId="FqNe9pDsZ8M"
  title="Product Overview"
  variant="card"
  thumbnailUrl="https://..." // Optional custom thumbnail
/>

// Minimal variant
<YouTubeEmbed
  videoId="FqNe9pDsZ8M"
  title="Product Overview"
  variant="minimal"
/>

// With duration badge
<YouTubeEmbed
  videoId="FqNe9pDsZ8M"
  title="Product Overview"
  duration="1:30"
  variant="card"
/>`

export default function YouTubeEmbedPage() {
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
          <Heading level={1} className="!mb-0">YouTubeEmbed</Heading>
          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Media</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Responsive YouTube video embed with lazy loading and custom thumbnails.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/media/YouTubeEmbed.tsx
          </code>
        </Text>
      </Card>

      {/* Usage */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Usage</Heading>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
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

      {/* Live Examples */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Variants</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
          <div>
            <Text className="font-semibold !mb-2">variant="card"</Text>
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Example Video"
              variant="card"
            />
          </div>
          <div>
            <Text className="font-semibold !mb-2">variant="minimal"</Text>
            <YouTubeEmbed
              videoId="FqNe9pDsZ8M"
              title="Example Video"
              variant="minimal"
            />
          </div>
        </Grid>
      </Card>

      {/* With Duration */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">With Duration Badge</Heading>
        <div className="max-w-md">
          <YouTubeEmbed
            videoId="FqNe9pDsZ8M"
            title="Example Video"
            duration="1:30"
            variant="card"
          />
        </div>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">videoId</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">YouTube video ID (from URL)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">title</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Accessibility title</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'card' | 'minimal'</td>
                <td className="py-3 pr-4 text-gray-600">'card'</td>
                <td className="py-3 text-gray-600">Visual style</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">thumbnailUrl</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Custom thumbnail image URL</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">duration</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Video duration (e.g., "1:30")</td>
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
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">variant="card"</code> for content sections</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Provide custom <code className="bg-gray-100 px-1 rounded">thumbnailUrl</code> for better preview images</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use as second child in <code className="bg-gray-100 px-1 rounded">TwoColumn</code> layouts</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Videos are lazy-loaded - won't impact page performance</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
