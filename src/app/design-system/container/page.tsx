'use client'

import { useState } from 'react'
import { 
  Container, 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Button,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const SIZES = [
  { name: 'sm', value: 'max-w-3xl (768px)' },
  { name: 'md', value: 'max-w-5xl (1024px)' },
  { name: 'default', value: 'max-w-7xl (1280px)' },
  { name: 'lg', value: 'max-w-[1400px]' },
  { name: 'xl', value: 'max-w-[1600px]' },
  { name: 'full', value: 'max-w-full' },
]

const CODE_EXAMPLE = `import { Container, Stack } from '@/lib/design-system'

export default function MyPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Your content here */}
      </Stack>
    </Container>
  )
}`

export default function ContainerPage() {
  const [copied, setCopied] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('xl')

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
          <Heading level={1} className="!mb-0">Container</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Layout</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Width-constrained wrapper for page content. Use as the outermost wrapper for all pages.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/layout/Container.tsx
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
                <td className="py-3 pr-4 text-gray-600">'sm' | 'md' | 'default' | 'lg' | 'xl' | 'full'</td>
                <td className="py-3 pr-4 text-gray-600">'default'</td>
                <td className="py-3 text-gray-600">Maximum width constraint</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">className</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Additional CSS classes</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">children</code></td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Content to render inside</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Size Examples */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Size Variants</Heading>
        <Stack gap="md">
          <div className="flex flex-wrap gap-2 mb-4">
            {SIZES.map((size) => (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSize === size.name
                    ? 'bg-[#406517] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
            <Container size={selectedSize as any} className="bg-[#406517]/10 border-2 border-[#406517]/30 rounded-lg p-4">
              <div className="text-center">
                <Text className="font-semibold !mb-1">Container size="{selectedSize}"</Text>
                <Text size="sm" className="text-gray-500 !mb-0">
                  {SIZES.find(s => s.name === selectedSize)?.value}
                </Text>
              </div>
            </Container>
          </div>
        </Stack>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Always use <code className="bg-gray-100 px-1 rounded">size="xl"</code> for standard pages</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Wrap with <code className="bg-gray-100 px-1 rounded">Stack gap="lg"</code> as direct child</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't add padding classes - Container is for width only</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't nest Containers inside each other</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
