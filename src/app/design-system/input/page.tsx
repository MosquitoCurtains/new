'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Input,
  Grid,
} from '@/lib/design-system'
import { Copy, Check, Search, Mail, Lock } from 'lucide-react'

const CODE_EXAMPLE = `import { Input } from '@/lib/design-system'
import { Search, Mail } from 'lucide-react'

// Basic input
<Input placeholder="Enter your name" />

// With label
<Input label="Email" type="email" placeholder="you@example.com" />

// With icon
<Input icon={Search} placeholder="Search..." />

// With error
<Input label="Password" type="password" error="Password is required" />

// Disabled
<Input label="Disabled" disabled value="Can't edit this" />`

export default function InputPage() {
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
          <Heading level={1} className="!mb-0">Input</Heading>
          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Forms</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Text input component with label, icon, and error state support.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/forms/Input.tsx
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
        <Heading level={3} className="!mb-4">Examples</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 2 }} gap="lg">
          <Stack gap="md">
            <div>
              <Text className="font-semibold !mb-2">Basic</Text>
              <Input placeholder="Enter your name" />
            </div>
            <div>
              <Text className="font-semibold !mb-2">With Label</Text>
              <Input label="Email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Text className="font-semibold !mb-2">With Icon</Text>
              <Input icon={Search} placeholder="Search..." />
            </div>
          </Stack>
          <Stack gap="md">
            <div>
              <Text className="font-semibold !mb-2">With Error</Text>
              <Input label="Password" type="password" error="Password is required" />
            </div>
            <div>
              <Text className="font-semibold !mb-2">Disabled</Text>
              <Input label="Disabled" disabled value="Can't edit this" />
            </div>
            <div>
              <Text className="font-semibold !mb-2">With Icon and Label</Text>
              <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" />
            </div>
          </Stack>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">label</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Input label</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">icon</code></td>
                <td className="py-3 pr-4 text-gray-600">LucideIcon</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Icon component</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">error</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Error message</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">type</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">'text'</td>
                <td className="py-3 text-gray-600">Input type</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">disabled</code></td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">Disabled state</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Text size="sm" className="text-gray-500 mt-4 !mb-0">
          Also accepts all standard HTML input attributes (placeholder, value, onChange, etc.)
        </Text>
      </Card>
    </Stack>
  )
}
