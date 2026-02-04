'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  Button,
  Grid,
} from '@/lib/design-system'
import { Copy, Check, ArrowRight, Phone, Download } from 'lucide-react'
import Link from 'next/link'

const VARIANTS = ['primary', 'secondary', 'accent', 'outline', 'ghost', 'danger', 'highlight']
const SIZES = ['sm', 'md', 'lg']

const CODE_EXAMPLE = `import { Button } from '@/lib/design-system'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Basic button
<Button variant="primary">Click Me</Button>

// With icon
<Button variant="primary">
  Get Started
  <ArrowRight className="ml-2 w-4 h-4" />
</Button>

// As link (using asChild)
<Button variant="primary" asChild>
  <Link href="/start-project">
    Start Your Project
    <ArrowRight className="ml-2 w-4 h-4" />
  </Link>
</Button>`

export default function ButtonPage() {
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
          <Heading level={1} className="!mb-0">Button</Heading>
          <Badge className="!bg-[#B30158]/10 !text-[#B30158] !border-[#B30158]/30">Forms</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          Interactive button component with multiple variants, sizes, and states.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/forms/Button.tsx
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
        <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md">
          {VARIANTS.map((variant) => (
            <div key={variant} className="text-center">
              <Button variant={variant as any} className="mb-2">
                {variant}
              </Button>
              <Text size="xs" className="text-gray-500 !mb-0">{variant}</Text>
            </div>
          ))}
        </Grid>
      </Card>

      {/* Sizes */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Sizes</Heading>
        <div className="flex flex-wrap items-center gap-4">
          {SIZES.map((size) => (
            <div key={size} className="text-center">
              <Button variant="primary" size={size as any} className="mb-2">
                Size {size}
              </Button>
              <Text size="xs" className="text-gray-500 !mb-0 block">{size}</Text>
            </div>
          ))}
        </div>
      </Card>

      {/* With Icons */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">With Icons</Heading>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="secondary">
            <Phone className="mr-2 w-4 h-4" />
            Call Us
          </Button>
          <Button variant="outline">
            <Download className="mr-2 w-4 h-4" />
            Download
          </Button>
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">variant</code></td>
                <td className="py-3 pr-4 text-gray-600">'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'highlight'</td>
                <td className="py-3 pr-4 text-gray-600">'primary'</td>
                <td className="py-3 text-gray-600">Visual style</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">size</code></td>
                <td className="py-3 pr-4 text-gray-600">'sm' | 'md' | 'lg'</td>
                <td className="py-3 pr-4 text-gray-600">'md'</td>
                <td className="py-3 text-gray-600">Button size</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">asChild</code></td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">Render as child element (for Links)</td>
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
      </Card>

      {/* Best Practices */}
      <Card className="!p-6 border-l-4 border-l-[#406517]">
        <Heading level={3} className="!mb-4">Best Practices</Heading>
        <Stack gap="sm">
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">asChild</code> with Link for navigation buttons</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Center buttons with <code className="bg-gray-100 px-1 rounded">flex justify-center</code></Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't use <code className="bg-gray-100 px-1 rounded">w-full</code> - buttons should be natural width</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <Text className="!mb-0">Don't use <code className="bg-gray-100 px-1 rounded">flex-1</code> on buttons</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
