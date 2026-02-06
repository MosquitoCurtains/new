'use client'

import { useState } from 'react'
import { 
  Stack, 
  Card,
  Heading,
  Text,
  Badge,
  BulletedList,
  ListItem,
  Grid,
} from '@/lib/design-system'
import { Copy, Check } from 'lucide-react'

const CODE_EXAMPLE = `import { BulletedList, ListItem } from '@/lib/design-system'

// Checked list (most common)
<BulletedList spacing="sm">
  <ListItem variant="checked" iconColor="#406517">Feature one</ListItem>
  <ListItem variant="checked" iconColor="#406517">Feature two</ListItem>
  <ListItem variant="checked" iconColor="#406517">Feature three</ListItem>
</BulletedList>

// Bullet list
<BulletedList spacing="sm">
  <ListItem variant="default">Item one</ListItem>
  <ListItem variant="default">Item two</ListItem>
</BulletedList>

// With different icon colors (per brand)
<BulletedList spacing="sm">
  <ListItem variant="checked" iconColor="#406517">Green brand</ListItem>
  <ListItem variant="checked" iconColor="#003365">Blue brand</ListItem>
  <ListItem variant="checked" iconColor="#B30158">Pink brand</ListItem>
</BulletedList>`

export default function BulletedListPage() {
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
          <Heading level={1} className="!mb-0">BulletedList</Heading>
          <Badge className="!bg-[#003365]/10 !text-[#003365] !border-[#003365]/30">Lists</Badge>
        </div>
        <Text className="text-gray-600 !mb-0">
          List component with checkmarks or bullets. Use for feature lists in content sections.
        </Text>
      </div>

      {/* Source File */}
      <Card variant="outlined" className="!p-4">
        <Text size="sm" className="!mb-0">
          <span className="text-gray-500">Source:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            src/lib/design-system/components/lists/BulletedList.tsx
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
            <Text className="font-semibold !mb-3">variant="checked"</Text>
            <BulletedList spacing="sm">
              <ListItem variant="checked" iconColor="#406517">Feature one with checkmark</ListItem>
              <ListItem variant="checked" iconColor="#406517">Feature two with checkmark</ListItem>
              <ListItem variant="checked" iconColor="#406517">Feature three with checkmark</ListItem>
            </BulletedList>
          </div>
          <div>
            <Text className="font-semibold !mb-3">variant="default" (bullet)</Text>
            <BulletedList spacing="sm">
              <ListItem variant="default">Item one with bullet</ListItem>
              <ListItem variant="default">Item two with bullet</ListItem>
              <ListItem variant="default">Item three with bullet</ListItem>
            </BulletedList>
          </div>
        </Grid>
      </Card>

      {/* Color Options */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Brand Color Options</Heading>
        <BulletedList spacing="sm">
          <ListItem variant="checked" iconColor="#406517">Primary Green (#406517)</ListItem>
          <ListItem variant="checked" iconColor="#003365">Navy Blue (#003365)</ListItem>
          <ListItem variant="checked" iconColor="#B30158">Accent Pink (#B30158)</ListItem>
          <ListItem variant="checked" iconColor="#FFA501">Gold/Orange (#FFA501)</ListItem>
        </BulletedList>
      </Card>

      {/* Spacing Options */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Spacing Options</Heading>
        <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="lg">
          <div>
            <Text className="font-semibold !mb-3">spacing="tight"</Text>
            <BulletedList spacing="tight">
              <ListItem variant="checked" iconColor="#406517">Item one</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item two</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item three</ListItem>
            </BulletedList>
          </div>
          <div>
            <Text className="font-semibold !mb-3">spacing="sm"</Text>
            <BulletedList spacing="sm">
              <ListItem variant="checked" iconColor="#406517">Item one</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item two</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item three</ListItem>
            </BulletedList>
          </div>
          <div>
            <Text className="font-semibold !mb-3">spacing="md"</Text>
            <BulletedList spacing="md">
              <ListItem variant="checked" iconColor="#406517">Item one</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item two</ListItem>
              <ListItem variant="checked" iconColor="#406517">Item three</ListItem>
            </BulletedList>
          </div>
        </Grid>
      </Card>

      {/* Props */}
      <Card className="!p-6">
        <Heading level={3} className="!mb-4">Props</Heading>
        
        <Text className="font-semibold !mb-2">BulletedList Props</Text>
        <div className="overflow-x-auto mb-6">
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
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">spacing</code></td>
                <td className="py-3 pr-4 text-gray-600">'xs' | 'sm' | 'md' | 'lg'</td>
                <td className="py-3 pr-4 text-gray-600">'sm'</td>
                <td className="py-3 text-gray-600">Space between items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Text className="font-semibold !mb-2">ListItem Props</Text>
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
                <td className="py-3 pr-4 text-gray-600">'checked' | 'bullet'</td>
                <td className="py-3 pr-4 text-gray-600">'bullet'</td>
                <td className="py-3 text-gray-600">Icon style</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="bg-gray-100 px-1 rounded">iconColor</code></td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Icon color (hex)</td>
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
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">variant="checked"</code> for feature lists</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Match <code className="bg-gray-100 px-1 rounded">iconColor</code> to section brand color</Text>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#406517] font-bold">✓</span>
            <Text className="!mb-0">Use <code className="bg-gray-100 px-1 rounded">spacing="sm"</code> for most lists</Text>
          </div>
        </Stack>
      </Card>
    </Stack>
  )
}
