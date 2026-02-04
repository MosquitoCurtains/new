'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Grid,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { Card } from '@/lib/design-system'

// Default card
<Card>
  <p>Card content here</p>
</Card>

// Elevated card (with shadow)
<Card variant="elevated">
  <p>Elevated card content</p>
</Card>

// Outlined card
<Card variant="outlined">
  <p>Outlined card content</p>
</Card>

// With hover effect
<Card variant="elevated" hover>
  <p>Hoverable card</p>
</Card>

// Custom padding
<Card className="!p-4 md:!p-6">
  <p>Responsive padding</p>
</Card>`

export default function CardPage() {
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
          <Heading level={1} className="!mb-0">Card</Heading>
          <Badge className="!bg-[#FFA501]/10 !text-[#FFA501] !border-[#FFA501]/30">Cards</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Container component for grouping content with consistent styling and optional hover effects.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/cards/Card.tsx
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

      {/* Variants */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Variants</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
          <div>
            <Text className="font-semibold !mb-2 text-center">default</Text>
            <Card className="!p-4">
              <Text className="text-center !mb-0">Default card with white background and border</Text>
            </Card>
          </div>
          <div>
            <Text className="font-semibold !mb-2 text-center">elevated</Text>
            <Card variant="elevated" className="!p-4">
              <Text className="text-center !mb-0">Elevated card with shadow</Text>
            </Card>
          </div>
          <div>
            <Text className="font-semibold !mb-2 text-center">outlined</Text>
            <Card variant="outlined" className="!p-4">
              <Text className="text-center !mb-0">Outlined card with visible border</Text>
            </Card>
          </div>
        </Grid>
      </Card>

      {/* With Hover */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">With Hover Effect</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="md">
          <div>
            <Text className="font-semibold !mb-2 text-center">hover=true</Text>
            <Card variant="elevated" hover className="!p-4 cursor-pointer">
              <Text className="text-center !mb-0">Hover over me! I lift up on hover.</Text>
            </Card>
          </div>
          <div>
            <Text className="font-semibold !mb-2 text-center">hover=false (default)</Text>
            <Card variant="elevated" className="!p-4">
              <Text className="text-center !mb-0">No hover effect</Text>
            </Card>
          </div>
        </Grid>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'default' | 'elevated' | 'outlined'</td>
                <td className="py-3 pr-4 text-gray-600">'default'</td>
                <td className="py-3 text-gray-600">Visual style</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">hover</code></td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">Enable hover lift effect</td>
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
            <Text className="!mb-0">Use responsive padding: <code className="bg-gray-100 px-1 rounded">className="!p-4 md:!p-6 lg:!p-8"</code></Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">variant="elevated"</code> with <code className="bg-gray-100 px-1 rounded">hover</code> for clickable cards</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't use fixed large padding like <code className="bg-gray-100 px-1 rounded">p-12</code></Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
