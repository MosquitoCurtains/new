'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { Heading } from '@/lib/design-system'

// Different heading levels
<Heading level={1}>Heading 1</Heading>
<Heading level={2}>Heading 2</Heading>
<Heading level={3}>Heading 3</Heading>
<Heading level={4}>Heading 4</Heading>

// With custom styling
<Heading level={2} className="!text-2xl md:!text-3xl text-gray-900">
  Custom Styled Heading
</Heading>

// Remove default margin
<Heading level={2} className="!mb-0">No Margin</Heading>`

export default function HeadingPage() {
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
          <Heading level={1} className="!mb-0">Heading</Heading>
          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Typography</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Semantic heading component (h1-h6) with consistent styling.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/typography/Heading.tsx
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
        <Heading level={3} className="!mb-4">Heading Levels</Heading>
        <Stack gap="sm">
          <div className="border-b border-gray-200 pb-2">
            <Heading level={1}>Heading level={1}</Heading>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <Heading level={2}>Heading level={2}</Heading>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <Heading level={3}>Heading level={3}</Heading>
          </div>
          <div>
            <Heading level={4}>Heading level={4}</Heading>
          </div>
        </Stack>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">level</code></td>
                <td className="py-3 pr-4 text-gray-600">1 | 2 | 3 | 4 | 5 | 6</td>
                <td className="py-3 pr-4 text-gray-600">2</td>
                <td className="py-3 text-gray-600">HTML heading level (h1-h6)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">className</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Additional CSS classes</td>
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
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">level={2}</code> for section titles</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">level={3}</code> for card titles</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Add <code className="bg-gray-100 px-1 rounded">!mb-0</code> or <code className="bg-gray-100 px-1 rounded">!mb-2</code> to control spacing</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
