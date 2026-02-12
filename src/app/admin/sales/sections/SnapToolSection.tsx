'use client'

import { ShoppingCart } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/lib/design-system'
import type { DBProduct } from '@/hooks/useProducts'
import { formatMoney } from '../types'

interface SnapToolSectionProps {
  snapTool: DBProduct | null
  addItem: (item: any) => void
  isInCart?: boolean
}

export default function SnapToolSection({ snapTool, addItem, isInCart }: SnapToolSectionProps) {
  if (!snapTool) return null

  const snapToolPrice = Number(snapTool.base_price)
  const snapToolName = snapTool.name || 'Industrial Snap Tool'
  const snapToolDescription = snapTool.description || 'Fully refundable if returned'

  const addSnapTool = () => {
    addItem({
      type: 'addon',
      productSku: snapTool.sku,
      name: snapToolName,
      description: snapToolDescription,
      quantity: 1,
      unitPrice: snapToolPrice,
      totalPrice: snapToolPrice,
    })
  }

  return (
    <Card variant="elevated" className="!p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Heading level={2} className="!mb-1">{snapToolName}</Heading>
          <Text size="sm" className="text-gray-500 !mb-0">
            ${formatMoney(snapToolPrice)} - {snapToolDescription}
          </Text>
        </div>
        <Button variant={isInCart ? 'outline' : 'primary'} onClick={addSnapTool} disabled={isInCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isInCart ? 'Already in Cart' : `Add ${snapToolName}`}
        </Button>
      </div>
    </Card>
  )
}
