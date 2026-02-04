'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  PowerHeaderTemplate,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { PowerHeaderTemplate } from '@/lib/design-system'

// Compact variant (two-column: text + video)
<PowerHeaderTemplate
  title="Screened Porch Enclosures"
  subtitle="Modular Mosquito Netting Panels custom-made to fit any space."
  videoId="FqNe9pDsZ8M"
  videoTitle="Product Overview"
  thumbnailUrl="https://..." // Optional
  variant="compact"
/>

// Stacked variant (full-width video above action cards)
<PowerHeaderTemplate
  title="Clear Vinyl Enclosures"
  subtitle="Four-season room protection."
  videoId="ca6GufadXoE"
  videoTitle="Installation Guide"
  variant="stacked"
/>`

export default function PowerHeaderTemplatePage() {
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<'compact' | 'stacked'>('compact')

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
          <Heading level={1} className="!mb-0">PowerHeaderTemplate</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Template</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Hero section template with video and action cards. Use as the first element in category/product pages.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/templates/PowerHeaderTemplate.tsx
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

      {/* Variant Selector */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Variants</Heading>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedVariant('compact')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedVariant === 'compact'
                ? 'bg-[#406517] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            compact (two-column)
          </button>
          <button
            onClick={() => setSelectedVariant('stacked')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedVariant === 'stacked'
                ? 'bg-[#406517] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            stacked (full-width)
          </button>
        </div>
      </Card>

      {/* Live Example */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
        <PowerHeaderTemplate
          title="Example Hero Section"
          subtitle="This is a live preview of the PowerHeaderTemplate. Toggle between variants above."
          videoId="FqNe9pDsZ8M"
          videoTitle="Example Video"
          variant={selectedVariant}
        />
      </div>

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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">title</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Main hero title</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">subtitle</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Descriptive text below title</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">videoId</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">YouTube video ID</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">videoTitle</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">required</td>
                <td className="py-3 text-gray-600">Video accessibility title</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">thumbnailUrl</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Custom video thumbnail URL</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'compact' | 'stacked'</td>
                <td className="py-3 pr-4 text-gray-600">'stacked'</td>
                <td className="py-3 text-gray-600">Layout style</td>
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
            <Text className="!mb-0">Use as first child of Stack in category pages</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">variant="compact"</code> for most category pages</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Provide custom <code className="bg-gray-100 px-1 rounded">thumbnailUrl</code> for better visuals</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">See <code className="bg-gray-100 px-1 rounded">/screened-porch</code> for real usage</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
