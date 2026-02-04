'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  WhyChooseUsTemplate,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { WhyChooseUsTemplate } from '@/lib/design-system'

// With Google Reviews (default)
<WhyChooseUsTemplate />

// Without Google Reviews
<WhyChooseUsTemplate showReviews={false} />`

export default function WhyChooseUsTemplatePage() {
  const [copied, setCopied] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

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
          <Heading level={1} className="!mb-0">WhyChooseUsTemplate</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Template</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          "Why 92,000+ Customers Choose Us" section with Google Reviews and 4 feature cards.
          Edit once, update everywhere.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/templates/WhyChooseUsTemplate.tsx
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

      {/* Toggle */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Options</Heading>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReviews(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !showReviews
                ? 'bg-[#406517] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            showReviews=false
          </button>
          <button
            onClick={() => setShowReviews(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              showReviews
                ? 'bg-[#406517] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            showReviews=true
          </button>
        </div>
        <Text size="sm" className="text-gray-500 mt-2 !mb-0">
          Note: Reviews require NEXT_PUBLIC_FEATURABLE_WIDGET_ID env variable
        </Text>
      </Card>

      {/* Live Example */}
      <WhyChooseUsTemplate showReviews={showReviews} />

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
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">showReviews</code></td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">true</td>
                <td className="py-3 text-gray-600">Show Google Reviews carousel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Customization</Heading>
        <Stack gap="sm">
          <Text className="!mb-0">
            To customize the content (title, feature cards, etc.), edit the source file directly:
          </Text>
          <code className="bg-gray-100 px-3 py-2 rounded block text-sm">
            src/lib/design-system/templates/WhyChooseUsTemplate.tsx
          </code>
          <Text className="text-gray-500 !mb-0">
            Changes will update everywhere this template is used.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}
