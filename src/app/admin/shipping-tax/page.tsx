'use client'

/**
 * Admin Shipping & Tax
 * 
 * Manage shipping zones, rates, and tax rates.
 * Two-tab layout: Shipping Zones | Tax Rates
 * Includes a test calculator to verify zone/rate matching.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Truck,
  ArrowLeft,
  RefreshCw,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Calculator,
  Globe,
  MapPin,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Percent,
} from 'lucide-react'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Spinner,
} from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

interface ShippingRate {
  id: number
  zone_id: number
  shipping_class: 'default' | 'clear_vinyl' | 'straight_track'
  flat_cost: number
  fee_percent: number
  is_active: boolean
}

interface ShippingZone {
  id: number
  name: string
  slug: string
  sort_order: number
  is_fallback: boolean
  is_active: boolean
  regions: { country_code: string; state_code: string | null }[]
  rates: ShippingRate[]
}

interface TaxRate {
  id: number
  country_code: string
  state_code: string
  postcode: string
  city: string
  rate: number
  tax_name: string
  priority: number
  is_compound: boolean
  is_shipping_taxable: boolean
  is_active: boolean
}

interface ShippingTestResult {
  total: number
  zone: { id: number; name: string; slug: string } | null
  breakdown: {
    baseOrVinyl: { class: string; flat: number; percentAmount: number; total: number }
    track: { flat: number; percentAmount: number; total: number } | null
  }
}

interface TaxTestResult {
  taxAmount: number
  rate: number
  rateName: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SHIPPING_CLASS_LABELS: Record<string, string> = {
  default: 'Base Shipping',
  clear_vinyl: 'Clear Vinyl (replaces base)',
  straight_track: 'Straight Track (additive)',
}

const SHIPPING_CLASS_COLORS: Record<string, string> = {
  default: '#406517',
  clear_vinyl: '#003365',
  straight_track: '#B30158',
}

const TAB_IDS = ['shipping', 'tax'] as const
type TabId = typeof TAB_IDS[number]

// =============================================================================
// COMPONENT
// =============================================================================

export default function AdminShippingTaxPage() {
  const [activeTab, setActiveTab] = useState<TabId>('shipping')
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Edit state
  const [editMode, setEditMode] = useState(false)
  const [editedRates, setEditedRates] = useState<Record<number, Partial<ShippingRate>>>({})
  const [editedTaxRates, setEditedTaxRates] = useState<Record<number, Partial<TaxRate>>>({})
  const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set())

  // Test calculator state
  const [testCountry, setTestCountry] = useState('US')
  const [testState, setTestState] = useState('')
  const [testZip, setTestZip] = useState('')
  const [testSubtotal, setTestSubtotal] = useState('500')
  const [testHasVinyl, setTestHasVinyl] = useState(false)
  const [testHasTrack, setTestHasTrack] = useState(false)
  const [testShippingResult, setTestShippingResult] = useState<ShippingTestResult | null>(null)
  const [testTaxResult, setTestTaxResult] = useState<TaxTestResult | null>(null)
  const [testing, setTesting] = useState(false)

  // =========================================================================
  // DATA FETCHING
  // =========================================================================

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [zonesRes, taxRes] = await Promise.all([
        fetch('/api/admin/shipping/zones'),
        fetch('/api/admin/tax/rates'),
      ])

      const zonesData = await zonesRes.json()
      const taxData = await taxRes.json()

      if (!zonesRes.ok) throw new Error(zonesData.error || 'Failed to fetch zones')
      if (!taxRes.ok) throw new Error(taxData.error || 'Failed to fetch tax rates')

      setZones(zonesData.data || [])
      setTaxRates(taxData.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // =========================================================================
  // SHIPPING RATE EDITING
  // =========================================================================

  const handleRateChange = (rateId: number, field: 'flat_cost' | 'fee_percent', value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return
    setEditedRates(prev => ({
      ...prev,
      [rateId]: { ...prev[rateId], [field]: num },
    }))
  }

  const getRateValue = (rate: ShippingRate, field: 'flat_cost' | 'fee_percent'): number => {
    return editedRates[rate.id]?.[field] ?? rate[field]
  }

  const handleSaveShippingRates = async () => {
    const updates = Object.entries(editedRates).map(([id, fields]) => ({
      id: parseInt(id),
      ...fields,
    }))

    if (updates.length === 0) return

    try {
      setSaving(true)
      setError(null)

      const res = await fetch('/api/admin/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save rates')

      await fetchData()
      setEditedRates({})
      setEditMode(false)
      setSuccess(`Updated ${updates.length} shipping rate${updates.length > 1 ? 's' : ''}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // =========================================================================
  // TAX RATE EDITING
  // =========================================================================

  const handleTaxRateChange = (rateId: number, field: 'rate' | 'tax_name', value: string) => {
    if (field === 'rate') {
      const num = parseFloat(value)
      if (isNaN(num)) return
      setEditedTaxRates(prev => ({
        ...prev,
        [rateId]: { ...prev[rateId], rate: num },
      }))
    } else {
      setEditedTaxRates(prev => ({
        ...prev,
        [rateId]: { ...prev[rateId], tax_name: value },
      }))
    }
  }

  const getTaxRateValue = (rate: TaxRate, field: 'rate' | 'tax_name'): string | number => {
    return editedTaxRates[rate.id]?.[field] ?? rate[field]
  }

  const handleSaveTaxRates = async () => {
    const updates = Object.entries(editedTaxRates).map(([id, fields]) => ({
      id: parseInt(id),
      ...fields,
    }))

    if (updates.length === 0) return

    try {
      setSaving(true)
      setError(null)

      const res = await fetch('/api/admin/tax/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save rates')

      await fetchData()
      setEditedTaxRates({})
      setEditMode(false)
      setSuccess(`Updated ${updates.length} tax rate${updates.length > 1 ? 's' : ''}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // =========================================================================
  // TEST CALCULATOR
  // =========================================================================

  const handleTest = async () => {
    if (!testState) return

    setTesting(true)
    setTestShippingResult(null)
    setTestTaxResult(null)

    try {
      const address = {
        country: testCountry,
        state: testState.toUpperCase(),
        zip: testZip || undefined,
      }
      const subtotal = parseFloat(testSubtotal) || 0

      const [shippingRes, taxRes] = await Promise.all([
        fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            hasVinyl: testHasVinyl,
            hasTrack: testHasTrack,
            subtotal,
          }),
        }),
        fetch('/api/tax/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            subtotal,
            shipping: 0, // We'll recalculate after
          }),
        }),
      ])

      const shippingData = await shippingRes.json()
      const taxData = await taxRes.json()

      if (shippingRes.ok) setTestShippingResult(shippingData)
      if (taxRes.ok) setTestTaxResult(taxData)
    } catch (err) {
      console.error('Test calculation error:', err)
    } finally {
      setTesting(false)
    }
  }

  // =========================================================================
  // HELPERS
  // =========================================================================

  const hasChanges = activeTab === 'shipping'
    ? Object.keys(editedRates).length > 0
    : Object.keys(editedTaxRates).length > 0

  const handleSave = () => {
    if (activeTab === 'shipping') handleSaveShippingRates()
    else handleSaveTaxRates()
  }

  const handleReset = () => {
    setEditedRates({})
    setEditedTaxRates({})
    setEditMode(false)
    setSuccess(null)
    setError(null)
  }

  const toggleZone = (zoneId: number) => {
    setExpandedZones(prev => {
      const next = new Set(prev)
      if (next.has(zoneId)) next.delete(zoneId)
      else next.add(zoneId)
      return next
    })
  }

  // =========================================================================
  // LOADING STATE
  // =========================================================================

  if (loading) {
    return (
      <Container size="xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <Text className="text-gray-500 mt-4 !mb-0">Loading shipping & tax data...</Text>
          </div>
        </div>
      </Container>
    )
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Text size="sm" className="text-gray-500 !mb-0">Back to Admin</Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#003365]/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#003365]" />
              </div>
              <div>
                <Heading level={1} className="!mb-0">Shipping & Tax</Heading>
                <Text className="text-gray-500 !mb-0">
                  Manage shipping zones, rates, and tax rules
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {editMode ? (
                <>
                  <Button variant="outline" onClick={handleReset} disabled={saving}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!hasChanges || saving}
                    onClick={handleSave}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  Edit Rates
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Success/Error Messages */}
        {success && (
          <Card variant="outlined" className="!p-4 !bg-green-50 !border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <Text className="text-green-700 !mb-0">{success}</Text>
            </div>
          </Card>
        )}
        {error && (
          <Card variant="outlined" className="!p-4 !bg-red-50 !border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <Text className="text-red-700 !mb-0">{error}</Text>
            </div>
          </Card>
        )}

        {/* Unsaved Changes */}
        {editMode && hasChanges && (
          <Card variant="outlined" className="!p-4 !bg-amber-50 !border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-amber-600" />
                <Text className="text-amber-800 !mb-0">
                  <span className="font-semibold">
                    {activeTab === 'shipping' ? Object.keys(editedRates).length : Object.keys(editedTaxRates).length}
                  </span> unsaved change{hasChanges ? 's' : ''}
                </Text>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>Discard</Button>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'shipping'
                ? 'text-[#003365] border-[#003365]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Shipping Zones ({zones.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tax'
                ? 'text-[#003365] border-[#003365]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Tax Rates ({taxRates.length})
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'shipping' ? (
          <ShippingZonesTab
            zones={zones}
            editMode={editMode}
            editedRates={editedRates}
            expandedZones={expandedZones}
            onToggleZone={toggleZone}
            onRateChange={handleRateChange}
            getRateValue={getRateValue}
          />
        ) : (
          <TaxRatesTab
            rates={taxRates}
            editMode={editMode}
            editedRates={editedTaxRates}
            onRateChange={handleTaxRateChange}
            getTaxRateValue={getTaxRateValue}
          />
        )}

        {/* Test Calculator */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#406517]/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#406517]" />
            </div>
            <div>
              <Heading level={3} className="!mb-0">Test Calculator</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">
                Enter an address to see which zone and rates apply
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Country</label>
              <Select
                value={testCountry}
                onChange={(val) => setTestCountry(val)}
                options={[
                  { value: 'US', label: 'United States' },
                  { value: 'CA', label: 'Canada' },
                  { value: 'GB', label: 'United Kingdom' },
                  { value: 'AU', label: 'Australia' },
                  { value: 'DE', label: 'Germany' },
                  { value: 'FR', label: 'France' },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">State/Province</label>
              <Input
                placeholder="e.g. GA, ON"
                value={testState}
                onChange={(e) => setTestState(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ZIP/Postal</label>
              <Input
                placeholder="e.g. 30004"
                value={testZip}
                onChange={(e) => setTestZip(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Subtotal ($)</label>
              <Input
                type="number"
                placeholder="500"
                value={testSubtotal}
                onChange={(e) => setTestSubtotal(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={testHasVinyl}
                onChange={(e) => setTestHasVinyl(e.target.checked)}
                className="rounded border-gray-300"
              />
              Clear Vinyl on order
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={testHasTrack}
                onChange={(e) => setTestHasTrack(e.target.checked)}
                className="rounded border-gray-300"
              />
              Track on order
            </label>
            <Button variant="primary" size="sm" onClick={handleTest} disabled={testing || !testState}>
              {testing ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Calculating...</>
              ) : (
                <><Calculator className="w-4 h-4 mr-2" />Calculate</>
              )}
            </Button>
          </div>

          {/* Test Results */}
          {(testShippingResult || testTaxResult) && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testShippingResult && (
                  <div>
                    <Text size="sm" className="font-medium text-gray-600 !mb-2">Shipping</Text>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Zone</span>
                        <span className="font-medium">{testShippingResult.zone?.name || 'No zone matched'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {testShippingResult.breakdown.baseOrVinyl.class === 'clear_vinyl' ? 'Vinyl Rate' : 'Base Rate'}
                        </span>
                        <span>
                          ${testShippingResult.breakdown.baseOrVinyl.flat.toFixed(2)}
                          {testShippingResult.breakdown.baseOrVinyl.percentAmount > 0 &&
                            ` + $${testShippingResult.breakdown.baseOrVinyl.percentAmount.toFixed(2)} fee`}
                        </span>
                      </div>
                      {testShippingResult.breakdown.track && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Track (additive)</span>
                          <span>
                            ${testShippingResult.breakdown.track.flat.toFixed(2)}
                            {testShippingResult.breakdown.track.percentAmount > 0 &&
                              ` + $${testShippingResult.breakdown.track.percentAmount.toFixed(2)} fee`}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-1 mt-1">
                        <span>Total Shipping</span>
                        <span className="text-[#003365]">${testShippingResult.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                {testTaxResult && (
                  <div>
                    <Text size="sm" className="font-medium text-gray-600 !mb-2">Tax</Text>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rate Name</span>
                        <span className="font-medium">{testTaxResult.rateName || 'No tax'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rate</span>
                        <span>{testTaxResult.rate}%</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-1 mt-1">
                        <span>Tax Amount</span>
                        <span className="text-[#003365]">${testTaxResult.taxAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        <div className="h-8" />
      </Stack>
    </Container>
  )
}

// =============================================================================
// SHIPPING ZONES TAB
// =============================================================================

function ShippingZonesTab({
  zones,
  editMode,
  editedRates,
  expandedZones,
  onToggleZone,
  onRateChange,
  getRateValue,
}: {
  zones: ShippingZone[]
  editMode: boolean
  editedRates: Record<number, Partial<ShippingRate>>
  expandedZones: Set<number>
  onToggleZone: (id: number) => void
  onRateChange: (rateId: number, field: 'flat_cost' | 'fee_percent', value: string) => void
  getRateValue: (rate: ShippingRate, field: 'flat_cost' | 'fee_percent') => number
}) {
  return (
    <Stack gap="md">
      {/* Shipping Logic Explanation */}
      <Card variant="outlined" className="!p-4 !bg-blue-50/50 !border-blue-200">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <Text className="font-medium text-blue-900 !mb-1">Shipping Calculation Logic</Text>
            <Text size="sm" className="text-blue-700 !mb-0">
              <strong>Base rate</strong> applies to standard orders. If <strong>Clear Vinyl</strong> items are on the order, the vinyl rate <strong>replaces</strong> the base rate (different packaging). If <strong>Track</strong> is on the order, the track rate is <strong>added on top</strong> (ships in a separate box). Each rate = flat cost + (subtotal x fee %).
            </Text>
          </div>
        </div>
      </Card>

      {zones.map((zone) => {
        const isExpanded = expandedZones.has(zone.id)
        const regionCount = zone.regions.length

        return (
          <Card key={zone.id} variant="elevated" className="!p-0 overflow-hidden">
            {/* Zone Header */}
            <button
              onClick={() => onToggleZone(zone.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <Text className="font-semibold text-gray-900 !mb-0">{zone.name}</Text>
                    {zone.is_fallback && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Fallback</span>
                    )}
                  </div>
                  <Text size="sm" className="text-gray-500 !mb-0">
                    {regionCount > 0 ? `${regionCount} region${regionCount > 1 ? 's' : ''}` : 'All other locations'}
                    {' | '}
                    {zone.rates.length} rate{zone.rates.length > 1 ? 's' : ''}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Quick rate summary */}
                {zone.rates.filter(r => r.shipping_class === 'default').map(r => (
                  <span key={r.id} className="text-sm text-gray-600">
                    Base: ${Number(r.flat_cost).toFixed(0)}{Number(r.fee_percent) > 0 ? ` + ${Number(r.fee_percent)}%` : ''}
                  </span>
                ))}
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-200">
                {/* Regions */}
                {zone.regions.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <Text size="sm" className="font-medium text-gray-600 !mb-0">Regions</Text>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {zone.regions.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 text-xs bg-white border border-gray-200 rounded-md text-gray-700"
                        >
                          {r.country_code}{r.state_code ? ` - ${r.state_code}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rates */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <Text size="sm" className="font-medium text-gray-600 !mb-0">Shipping Rates</Text>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 grid grid-cols-[1fr_120px_120px_140px] gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div>Shipping Class</div>
                      <div className="text-right">Flat Cost</div>
                      <div className="text-right">Fee %</div>
                      <div className="text-right">Example ($500)</div>
                    </div>

                    {/* Rate Rows */}
                    {zone.rates.map((rate) => {
                      const flat = getRateValue(rate, 'flat_cost')
                      const pct = getRateValue(rate, 'fee_percent')
                      const example = flat + (500 * pct / 100)
                      const isEdited = editedRates[rate.id] !== undefined
                      const color = SHIPPING_CLASS_COLORS[rate.shipping_class] || '#6B7280'

                      return (
                        <div
                          key={rate.id}
                          className={`px-4 py-3 grid grid-cols-[1fr_120px_120px_140px] gap-4 items-center border-b border-gray-100 last:border-0 ${
                            isEdited ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                              <Text size="sm" className="font-medium text-gray-900 !mb-0">
                                {SHIPPING_CLASS_LABELS[rate.shipping_class]}
                              </Text>
                            </div>
                          </div>

                          <div className="text-right">
                            {editMode ? (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-gray-400 text-xs">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={flat}
                                  onChange={(e) => onRateChange(rate.id, 'flat_cost', e.target.value)}
                                  className="w-20 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                                />
                              </div>
                            ) : (
                              <Text size="sm" className="font-semibold text-gray-900 !mb-0">${flat.toFixed(2)}</Text>
                            )}
                          </div>

                          <div className="text-right">
                            {editMode ? (
                              <div className="flex items-center gap-1 justify-end">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={pct}
                                  onChange={(e) => onRateChange(rate.id, 'fee_percent', e.target.value)}
                                  className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                                />
                                <span className="text-gray-400 text-xs">%</span>
                              </div>
                            ) : (
                              <Text size="sm" className="font-semibold text-gray-900 !mb-0">{pct > 0 ? `${pct}%` : '--'}</Text>
                            )}
                          </div>

                          <div className="text-right">
                            <Text size="sm" className="text-blue-600 font-medium !mb-0">
                              ${example.toFixed(2)}
                            </Text>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </Stack>
  )
}

// =============================================================================
// TAX RATES TAB
// =============================================================================

function TaxRatesTab({
  rates,
  editMode,
  editedRates,
  onRateChange,
  getTaxRateValue,
}: {
  rates: TaxRate[]
  editMode: boolean
  editedRates: Record<number, Partial<TaxRate>>
  onRateChange: (rateId: number, field: 'rate' | 'tax_name', value: string) => void
  getTaxRateValue: (rate: TaxRate, field: 'rate' | 'tax_name') => string | number
}) {
  // Group by country
  const byCountry = rates.reduce<Record<string, TaxRate[]>>((acc, r) => {
    if (!acc[r.country_code]) acc[r.country_code] = []
    acc[r.country_code].push(r)
    return acc
  }, {})

  const countryNames: Record<string, string> = {
    US: 'United States',
    CA: 'Canada',
  }

  return (
    <Stack gap="md">
      {Object.entries(byCountry).map(([country, countryRates]) => (
        <Card key={country} variant="elevated" className="!p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-gray-500" />
            <Heading level={3} className="!mb-0">{countryNames[country] || country}</Heading>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {countryRates.length} rate{countryRates.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 grid grid-cols-[80px_80px_100px_120px_1fr_100px] gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>State</div>
              <div>Postcode</div>
              <div>City</div>
              <div className="text-right">Rate %</div>
              <div>Name</div>
              <div className="text-center">Active</div>
            </div>

            {/* Rate Rows */}
            {countryRates.map((rate) => {
              const isEdited = editedRates[rate.id] !== undefined
              const rateValue = getTaxRateValue(rate, 'rate') as number
              const nameValue = getTaxRateValue(rate, 'tax_name') as string

              return (
                <div
                  key={rate.id}
                  className={`px-4 py-3 grid grid-cols-[80px_80px_100px_120px_1fr_100px] gap-4 items-center border-b border-gray-100 last:border-0 ${
                    isEdited ? 'bg-amber-50/50' : ''
                  } ${rate.rate === 0 ? 'bg-gray-50/50' : ''}`}
                >
                  <Text size="sm" className="font-medium text-gray-900 !mb-0">{rate.state_code}</Text>
                  <Text size="sm" className="text-gray-600 !mb-0">{rate.postcode}</Text>
                  <Text size="sm" className="text-gray-600 !mb-0">{rate.city}</Text>

                  <div className="text-right">
                    {editMode ? (
                      <div className="flex items-center gap-1 justify-end">
                        <input
                          type="number"
                          step="0.0001"
                          value={rateValue}
                          onChange={(e) => onRateChange(rate.id, 'rate', e.target.value)}
                          className="w-20 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                        />
                        <span className="text-gray-400 text-xs">%</span>
                      </div>
                    ) : (
                      <Text size="sm" className={`font-semibold !mb-0 ${rate.rate === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                        {Number(rateValue).toFixed(rateValue.toString().includes('.') && rateValue.toString().split('.')[1]?.length > 2 ? 4 : 2)}%
                      </Text>
                    )}
                  </div>

                  <div>
                    {editMode ? (
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => onRateChange(rate.id, 'tax_name', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                      />
                    ) : (
                      <Text size="sm" className="text-gray-700 !mb-0">{nameValue}</Text>
                    )}
                  </div>

                  <div className="text-center">
                    <span className={`inline-flex w-2 h-2 rounded-full ${rate.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </Stack>
  )
}
