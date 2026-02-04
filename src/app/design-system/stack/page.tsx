'use client'

import { useState } from 'react'
import { 
  Container, 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const GAPS = [
  { name: 'xs', value: '4px' },
  { name: 'sm', value: '8px' },
  { name: 'md', value: '16px' },
  { name: 'lg', value: '32px' },
  { name: 'xl', value: '48px' },
  { name: '2xl', value: '64px' },
]

const CODE_EXAMPLE = `import { Container, Stack, Card } from '@/lib/design-system'

export default function MyPage() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Card>Section 1</Card>
        <Card>Section 2</Card>
        <Card>Section 3</Card>
      </Stack>
    </Container>
  )
}`

export default function StackPage() {
  const [copied, setCopied] = useState(false)
  const [selectedGap, setSelectedGap] = useState<string>('lg')

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
          <Heading level={1} className="!mb-0">Stack</Heading>
          <Badge className="!bg-[#406517]/10 !text-[#406517] !border-[#406517]/30">Layout</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Vertical spacing component using CSS flexbox gap. Use for consistent spacing between sections.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/layout/Stack.tsx
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">gap</code></td>
                <td className="py-3 pr-4 text-gray-600">'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'</td>
                <td className="py-3 pr-4 text-gray-600">'md'</td>
                <td className="py-3 text-gray-600">Space between children</td>
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
                <td className="py-3 text-gray-600">Content to render</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gap Examples */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Gap Variants</Heading>
        <Stack gap="md">
          <div className="flex flex-wrap gap-2 mb-4">
            {GAPS.map((gap) => (
              <button
                key={gap.name}
                onClick={() => setSelectedGap(gap.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedGap === gap.name
                    ? 'bg-[#406517] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gap.name} ({gap.value})
              </button>
            ))}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
            <Stack gap={selectedGap as any}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#406517]/20 border-2 border-[#406517]/40 rounded-lg p-4 text-center">
                  <Text className="font-semibold !mb-0">Item {n}</Text>
                </div>
              ))}
            </Stack>
          </div>
          
          <Text size="sm" className="text-gray-500 text-center !mb-0">
            Current gap: <code className="bg-gray-100 px-1 rounded">{selectedGap}</code> = {GAPS.find(g => g.name === selectedGap)?.value}
          </Text>
        </Stack>
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">gap="lg"</code> (32px) for top-level page sections</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">gap="md"</code> (16px) for content within cards</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't add <code className="bg-gray-100 px-1 rounded">mb-X</code> to direct Stack children</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't use <code className="bg-gray-100 px-1 rounded">space-y-X</code> with Stack</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
