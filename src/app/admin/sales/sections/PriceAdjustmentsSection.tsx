'use client'

import { useState } from 'react'
import { Stack, Card, Heading, Text, Button } from '@/lib/design-system'

interface PriceAdjustmentsSectionProps {
  addItem: (item: any) => void
}

export default function PriceAdjustmentsSection({ addItem }: PriceAdjustmentsSectionProps) {
  const [legacyAdjustments, setLegacyAdjustments] = useState({
    discount: 0,
    discountDescription: '',
    taxCredit: 0,
    tariff: 0,
  })

  const addLegacyAdjustment = (type: 'discount' | 'taxCredit' | 'tariff') => {
    const amount = type === 'discount' ? legacyAdjustments.discount : legacyAdjustments[type]
    if (!amount) return
    const signedAmount = (type === 'discount' || type === 'taxCredit')
      ? -Math.abs(amount)
      : Math.abs(amount)
    const nameMap = {
      discount: 'Discount',
      taxCredit: 'Credit for Sales Tax Exemption',
      tariff: 'Canadian Tariff',
    }
    const description = type === 'discount' && legacyAdjustments.discountDescription
      ? legacyAdjustments.discountDescription
      : 'Manual adjustment'
    addItem({
      type: 'addon',
      productSku: `adjustment_${type}`,
      name: nameMap[type],
      description,
      quantity: 1,
      unitPrice: signedAmount,
      totalPrice: signedAmount,
      options: { amount: signedAmount },
    })
    setLegacyAdjustments((prev) => ({
      ...prev,
      ...(type === 'discount' ? { discount: 0, discountDescription: '' } : { [type]: 0 }),
    }))
  }

  return (
    <Card variant="elevated" className="!p-6">
      <Heading level={2} className="!mb-4">Price Adjustments</Heading>
      <Stack gap="sm">
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Text className="font-medium text-gray-900 !mb-0 shrink-0">Discount</Text>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <input
                type="text"
                value={legacyAdjustments.discountDescription}
                onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, discountDescription: e.target.value })}
                className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                placeholder="Discount description"
              />
              <input
                type="number"
                min={0}
                value={legacyAdjustments.discount || ''}
                onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, discount: parseFloat(e.target.value) || 0 })}
                className="w-28 pl-3 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-7 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                placeholder="$0"
              />
              <Button variant="outline" onClick={() => addLegacyAdjustment('discount')}>Add</Button>
            </div>
          </div>
        </Card>
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Text className="font-medium text-gray-900 !mb-0">Credit for Sales Tax Exemption</Text>
            <div className="flex items-center gap-3 justify-end">
              <input
                type="number"
                min={0}
                value={legacyAdjustments.taxCredit || ''}
                onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, taxCredit: parseFloat(e.target.value) || 0 })}
                className="w-28 pl-3 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-7 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                placeholder="$0"
              />
              <Button variant="outline" onClick={() => addLegacyAdjustment('taxCredit')}>Add</Button>
            </div>
          </div>
        </Card>
        <Card variant="outlined" className="!p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Text className="font-medium text-gray-900 !mb-0">Canadian Tariff</Text>
            <div className="flex items-center gap-3 justify-end">
              <input
                type="number"
                min={0}
                value={legacyAdjustments.tariff || ''}
                onChange={(e) => setLegacyAdjustments({ ...legacyAdjustments, tariff: parseFloat(e.target.value) || 0 })}
                className="w-28 pl-3 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent [&::-webkit-inner-spin-button]:h-7 [&::-webkit-inner-spin-button]:w-6 [&::-webkit-inner-spin-button]:ml-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
                placeholder="$0"
              />
              <Button variant="outline" onClick={() => addLegacyAdjustment('tariff')}>Add</Button>
            </div>
          </div>
        </Card>
      </Stack>
    </Card>
  )
}
