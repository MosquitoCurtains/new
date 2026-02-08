'use client'

import { ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { DBProduct } from '@/hooks/useProducts'
import { formatMoney } from '../types'

interface SnapToolSectionProps {
  snapTool: DBProduct | null
  getPrice: (id: string, fallback?: number) => number
  addItem: (item: any) => void
}

export default function SnapToolSection({ snapTool, getPrice, addItem }: SnapToolSectionProps) {
  const snapToolPrice = snapTool ? Number(snapTool.base_price) : getPrice('snap_tool')

  const addSnapTool = () => {
    addItem({
      type: 'addon',
      productSku: 'snap_tool',
      name: 'Industrial Snap Tool',
      description: 'Fully refundable if returned',
      quantity: 1,
      unitPrice: snapToolPrice,
      totalPrice: snapToolPrice,
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Heading level={2} className="!mb-1">Industrial Snap Tool</Heading>
          <Text size="sm" className="text-gray-500 !mb-0">
            ${formatMoney(snapToolPrice)} - Fully refundable if returned
          </Text>
        </div>
        <Button variant="primary" onClick={addSnapTool}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add Snap Tool
        </Button>
      </div>
    </Card>
  )
}
