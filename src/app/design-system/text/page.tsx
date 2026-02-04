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

const CODE_EXAMPLE = `import { Text } from '@/lib/design-system'

// Different sizes
<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="base">Base text (default)</Text>
<Text size="lg">Large text</Text>

// With custom styling
<Text className="text-gray-600">Gray text</Text>
<Text className="font-semibold">Bold text</Text>

// Remove default margin
<Text className="!mb-0">No margin below</Text>`

const SIZES = ['xs', 'sm', 'base', 'lg']

export default function TextPage() {
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
          <Heading level={1} className="!mb-0">Text</Heading>
          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Typography</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Body text component with size variants. Use for paragraphs and descriptions.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/typography/Text.tsx
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

      {/* Size Examples */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Size Variants</Heading>
        <Stack gap="md">
          {SIZES.map((size) => (
            <div key={size} className="flex items-baseline gap-4 border-b border-gray-100 pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs w-20 text-center">{size}</code>
              <Text size={size as any} className="!mb-0">
                This is text with size="{size}"
              </Text>
            </div>
          ))}
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">size</code></td>
                <td className="py-3 pr-4 text-gray-600">'xs' | 'sm' | 'base' | 'lg'</td>
                <td className="py-3 pr-4 text-gray-600">'base'</td>
                <td className="py-3 text-gray-600">Text size</td>
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
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">className="text-gray-600"</code> for body text</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Add <code className="bg-gray-100 px-1 rounded">!mb-0</code> when followed by another element</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">size="sm"</code> for secondary/helper text</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
