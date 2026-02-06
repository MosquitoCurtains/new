 'use client'

 /**
  * MC Sales
  *
  * Salesperson flow for adding products to the cart.
  * Mirrors the Gravity Forms pricing rules used in mc-sales.
  */

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
 import { Container, Stack, Grid, Card, Heading, Text, Button, Input } from '@/lib/design-system'
import type { MeshColor, MeshTopAttachment, MeshType, VelcroColor } from '@/lib/pricing/types'
 import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
 import { useCart } from '@/hooks/useCart'

 type ScrimColor = 'silver' | 'white'
 type ScrimPanel = {
   id: string
   widthFeet: number | undefined
   widthInches: number | undefined
   heightInches: number | undefined
   color: ScrimColor
   topAttachment: 'standard_track' | 'heavy_track' | 'velcro' | 'special_rigging'
   velcroColor?: 'black' | 'white'
 }

 type AttachmentItem = {
   id: string
   label: string
   sku: string
   unitLabel: string
   unitPrice: number
   step: number
   min: number
   max: number
   group: string
   description?: string
 }

 const TOP_ATTACHMENTS = [
   { id: 'standard_track', label: 'Standard Track (<10 Tall Panels)' },
   { id: 'heavy_track', label: 'Heavy Track (>10 Tall Panels)' },
   { id: 'velcro', label: 'Velcro®' },
   { id: 'special_rigging', label: 'Special Rigging' },
 ] as const

 const ATTACHMENT_ITEMS: AttachmentItem[] = [
   {
     id: 'marine_snaps_black',
     label: 'Black Marine Snaps',
     sku: 'marine_snaps_black',
     unitLabel: 'snaps',
     unitPrice: 1.5,
     step: 10,
     min: 0,
     max: 200,
     group: 'Sealing Sides',
     description: '$15 per pack of 10',
   },
   {
     id: 'marine_snaps_white',
     label: 'White Marine Snaps',
     sku: 'marine_snaps_white',
     unitLabel: 'snaps',
     unitPrice: 1.5,
     step: 10,
     min: 0,
     max: 200,
     group: 'Sealing Sides',
     description: '$15 per pack of 10',
   },
   {
     id: 'adhesive_snaps_clear',
     label: 'Clear Adhesive Marine Snaps',
     sku: 'adhesive_snaps_clear',
     unitLabel: 'snaps',
     unitPrice: 3,
     step: 5,
     min: 0,
     max: 50,
     group: 'Sealing Sides',
     description: '$15 per set of 5',
   },
   {
     id: 'adhesive_snaps_white',
     label: 'White Adhesive Marine Snaps',
     sku: 'adhesive_snaps_white',
     unitLabel: 'snaps',
     unitPrice: 3,
     step: 5,
     min: 0,
     max: 50,
     group: 'Sealing Sides',
     description: '$15 per set of 5',
   },
   {
     id: 'adhesive_snaps_black',
     label: 'Black Adhesive Marine Snaps',
     sku: 'adhesive_snaps_black',
     unitLabel: 'snaps',
     unitPrice: 3,
     step: 5,
     min: 0,
     max: 50,
     group: 'Sealing Sides',
     description: '$15 per set of 5',
   },
   {
     id: 'panel_snaps',
     label: 'Panel to Panel Marine Snaps',
     sku: 'panel_snaps',
     unitLabel: 'snaps',
     unitPrice: 10 / 6,
     step: 6,
     min: 0,
     max: 30,
     group: 'Sealing Sides',
     description: '$10 per pack of 6',
   },
   {
     id: 'rubber_washers',
     label: 'Rubber Washers',
     sku: 'rubber_washers',
     unitLabel: 'washers',
     unitPrice: 0.2,
     step: 10,
     min: 0,
     max: 200,
     group: 'Sealing Sides',
     description: '$2 per pack of 10',
   },
   {
     id: 'block_magnets',
     label: 'Block Shaped Magnets',
     sku: 'block_magnets',
     unitLabel: 'magnets',
     unitPrice: 1,
     step: 2,
     min: 10,
     max: 100,
     group: 'Magnetic Doorways',
     description: '$10 per 10',
   },
   {
     id: 'fiberglass_rods',
     label: '10ft Fiberglass Rods & Clips',
     sku: 'fiberglass_rods',
     unitLabel: 'rods',
     unitPrice: 10,
     step: 1,
     min: 0,
     max: 22,
     group: 'Magnetic Doorways',
     description: '$10 each',
   },
   {
     id: 'rod_clips',
     label: 'Fiberglass Rod Clips',
     sku: 'rod_clips',
     unitLabel: 'clips',
     unitPrice: 2,
     step: 1,
     min: 0,
     max: 10,
     group: 'Magnetic Doorways',
     description: '$2 each',
   },
   {
     id: 'elastic_cord_black',
     label: 'Black Elastic Cord & D-Rings',
     sku: 'elastic_cord_black',
     unitLabel: 'cords',
     unitPrice: 10,
     step: 1,
     min: 0,
     max: 12,
     group: 'Elastic Cord & Tethers',
     description: '$10 each',
   },
   {
     id: 'elastic_cord_white',
     label: 'White Elastic Cord & D-Rings',
     sku: 'elastic_cord_white',
     unitLabel: 'cords',
     unitPrice: 10,
     step: 1,
     min: 0,
     max: 12,
     group: 'Elastic Cord & Tethers',
     description: '$10 each',
   },
   {
     id: 'tether_clips',
     label: 'Tether Clips',
     sku: 'tether_clips',
     unitLabel: 'clips',
     unitPrice: 10,
     step: 1,
     min: 0,
     max: 10,
     group: 'Elastic Cord & Tethers',
     description: '$10 each',
   },
   {
     id: 'belted_ribs',
     label: 'Belted Ribs',
     sku: 'belted_ribs',
     unitLabel: 'ribs',
     unitPrice: 15,
     step: 1,
     min: 0,
     max: 12,
     group: 'Elastic Cord & Tethers',
     description: '$15 each',
   },
   {
     id: 'fastwax',
     label: 'Fastwax Cleaner',
     sku: 'fastwax_cleaner',
     unitLabel: 'bottles',
     unitPrice: 15,
     step: 1,
     min: 0,
     max: 4,
     group: 'Other Items',
     description: '$15 per bottle',
   },
   {
     id: 'webbing_black',
     label: 'Black 2" Webbing',
     sku: 'webbing_black',
     unitLabel: 'feet',
     unitPrice: 0.4,
     step: 10,
     min: 0,
     max: 200,
     group: 'Other Items',
     description: '$4 per 10ft',
   },
   {
     id: 'webbing_white',
     label: 'White 2" Webbing',
     sku: 'webbing_white',
     unitLabel: 'feet',
     unitPrice: 0.4,
     step: 10,
     min: 0,
     max: 200,
     group: 'Other Items',
     description: '$4 per 10ft',
   },
   {
     id: 'snap_tape_black',
     label: 'Black Snap Tape',
     sku: 'snap_tape_black',
     unitLabel: 'feet',
     unitPrice: 2,
     step: 5,
     min: 0,
     max: 100,
     group: 'Other Items',
     description: '$10 per 5ft',
   },
   {
     id: 'snap_tape_white',
     label: 'White Snap Tape',
     sku: 'snap_tape_white',
     unitLabel: 'feet',
     unitPrice: 2,
     step: 5,
     min: 0,
     max: 100,
     group: 'Other Items',
     description: '$10 per 5ft',
   },
   {
     id: 'tie_up_straps',
     label: 'Tie Up Straps',
     sku: 'tie_up_straps',
     unitLabel: 'straps',
     unitPrice: 2,
     step: 1,
     min: 0,
     max: 40,
     group: 'Other Items',
     description: '$2 each',
   },
   {
     id: 'adhesive_velcro_white',
     label: 'White Adhesive Hook Velcro',
     sku: 'adhesive_velcro_white',
     unitLabel: 'feet',
     unitPrice: 0,
     step: 5,
     min: 0,
     max: 200,
     group: 'Other Items',
   },
   {
     id: 'adhesive_velcro_black',
     label: 'Black Adhesive Hook Velcro',
     sku: 'adhesive_velcro_black',
     unitLabel: 'feet',
     unitPrice: 0,
     step: 5,
     min: 0,
     max: 200,
     group: 'Other Items',
   },
   {
     id: 'l_screws',
     label: 'L Screws',
     sku: 'l_screws',
     unitLabel: 'screws',
     unitPrice: 0,
     step: 4,
     min: 0,
     max: 60,
     group: 'Other Items',
   },
   {
     id: 'screw_studs_1',
     label: '1" Screw Studs',
     sku: 'screw_studs_1',
     unitLabel: 'studs',
     unitPrice: 0,
     step: 10,
     min: 0,
     max: 150,
     group: 'Other Items',
   },
   {
     id: 'screw_studs_2',
     label: '2" Screw Studs',
     sku: 'screw_studs_2',
     unitLabel: 'studs',
     unitPrice: 0,
     step: 10,
     min: 0,
     max: 150,
     group: 'Other Items',
   },
 ]

 const ATTACHMENT_GROUPS = Array.from(
   new Set(ATTACHMENT_ITEMS.map((item) => item.group))
 )

type MeshPanelSize = {
  id: string
  widthFeet: number | undefined
  widthInches: number | undefined
  heightInches: number | undefined
}

type StuccoStrip = {
  id: string
  heightInches: number | undefined
  quantity: number | undefined
}

 function createDefaultScrimPanel(): ScrimPanel {
   return {
     id: `scrim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
     widthFeet: undefined,
     widthInches: undefined,
     heightInches: undefined,
     color: 'silver',
     topAttachment: 'velcro',
     velcroColor: 'black',
   }
}

function createDefaultMeshSize(): MeshPanelSize {
  return {
    id: `mesh-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    widthFeet: undefined,
    widthInches: undefined,
    heightInches: undefined,
  }
}

function createDefaultStuccoStrip(): StuccoStrip {
  return {
    id: `stucco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    heightInches: undefined,
    quantity: undefined,
  }
}

 function formatMoney(value: number) {
   return value.toFixed(2)
 }

 // =============================================================================
 // COMPONENT
 // =============================================================================

 export default function MCSalesPage() {
   const router = useRouter()
   const { addItem, isLoading } = useCart()
  const [meshOptions, setMeshOptions] = useState<{
    meshType: MeshType
    meshColor: MeshColor
    topAttachment: MeshTopAttachment
    velcroColor?: VelcroColor
  }>({
    meshType: 'heavy_mosquito',
    meshColor: 'black',
    topAttachment: 'velcro',
    velcroColor: 'black',
  })
  const [meshSizes, setMeshSizes] = useState<MeshPanelSize[]>([createDefaultMeshSize()])
   const [scrimPanels, setScrimPanels] = useState<ScrimPanel[]>([createDefaultScrimPanel()])
   const [stuccoStrips, setStuccoStrips] = useState<StuccoStrip[]>([createDefaultStuccoStrip()])
   const [trackWeight, setTrackWeight] = useState<'standard' | 'heavy'>('standard')
   const [trackColor, setTrackColor] = useState<'white' | 'black'>('white')
   const [trackItems, setTrackItems] = useState({
     straightTrack: 0,
     curves90: 0,
     curves135: 0,
     splices: 0,
     endCaps: 0,
     carriers: 0,
   })
   const [attachmentQtys, setAttachmentQtys] = useState<Record<string, number>>({})
   const [adjustments, setAdjustments] = useState({
     positive: 0,
     negative: 0,
     taxCredit: 0,
     tariff: 0,
   })

   const meshTotals = useMemo(() => {
    const panelTotals = meshSizes.map((size) => calculateMeshPanelPrice({
      widthFeet: size.widthFeet ?? 0,
      widthInches: size.widthInches ?? 0,
      heightInches: size.heightInches ?? 0,
      meshType: meshOptions.meshType,
      meshColor: meshOptions.meshColor,
      topAttachment: meshOptions.topAttachment,
      velcroColor: meshOptions.velcroColor,
    }))
     const subtotal = panelTotals.reduce((sum, item) => sum + item.total, 0)
     return { panelTotals, subtotal }
  }, [meshSizes, meshOptions])

   const scrimTotals = useMemo(() => {
     const panelTotals = scrimPanels.map((panel) => {
       const totalWidthFeet = (panel.widthFeet ?? 0) + ((panel.widthInches ?? 0) / 12)
       return totalWidthFeet * 18.5 + 24
     })
     const subtotal = panelTotals.reduce((sum, value) => sum + value, 0)
     return { panelTotals, subtotal }
   }, [scrimPanels])

  const stuccoTotals = useMemo(() => {
    const stripTotals = stuccoStrips.map((strip) => (strip.heightInches ?? 0) * 24 * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, value) => sum + value, 0)
    return { stripTotals, subtotal }
  }, [stuccoStrips])

   const trackPricing = useMemo(() => {
     const isHeavy = trackWeight === 'heavy'
     const prices = {
       straightTrack: isHeavy ? 42 : 30,
       curve: 25,
       splice: isHeavy ? 5 : 7,
       endCap: isHeavy ? 1 : 1.5,
       carrier: isHeavy ? 1.25 : 0.5,
     }
     const subtotal = (
       trackItems.straightTrack * prices.straightTrack +
       trackItems.curves90 * prices.curve +
       trackItems.curves135 * prices.curve +
       trackItems.splices * prices.splice +
       trackItems.endCaps * prices.endCap +
       trackItems.carriers * prices.carrier
     )
     return { prices, subtotal }
   }, [trackItems, trackWeight])

  const addMeshSize = () => setMeshSizes([...meshSizes, createDefaultMeshSize()])
  const updateMeshSize = (index: number, size: MeshPanelSize) => {
    const next = [...meshSizes]
    next[index] = size
    setMeshSizes(next)
  }
  const removeMeshSize = (index: number) => {
    if (meshSizes.length > 1) {
      setMeshSizes(meshSizes.filter((_, i) => i !== index))
    }
  }

   const addScrimPanel = () => setScrimPanels([...scrimPanels, createDefaultScrimPanel()])
   const updateScrimPanel = (index: number, panel: ScrimPanel) => {
     const next = [...scrimPanels]
     next[index] = panel
     setScrimPanels(next)
   }
  const removeScrimPanel = (index: number) => {
    if (scrimPanels.length > 1) {
      setScrimPanels(scrimPanels.filter((_, i) => i !== index))
    }
  }

  const addStuccoStrip = () => setStuccoStrips([...stuccoStrips, createDefaultStuccoStrip()])
  const updateStuccoStrip = (index: number, strip: StuccoStrip) => {
    const next = [...stuccoStrips]
    next[index] = strip
    setStuccoStrips(next)
  }
  const removeStuccoStrip = (index: number) => {
    if (stuccoStrips.length > 1) {
      setStuccoStrips(stuccoStrips.filter((_, i) => i !== index))
    }
  }

   const addMeshPanelsToCart = () => {
    meshSizes.forEach((size, index) => {
       const breakdown = meshTotals.panelTotals[index]
      const totalWidth = (size.widthFeet ?? 0) + ((size.widthInches ?? 0) / 12)
       addItem({
         type: 'panel',
         productSku: 'mesh_panel',
        name: `Mesh Panel ${index + 1}`,
        description: `${totalWidth.toFixed(1)}ft x ${size.heightInches ?? 0}in ${meshOptions.meshType.replace(/_/g, ' ')} - ${meshOptions.meshColor}`,
         quantity: 1,
         unitPrice: breakdown.total,
         totalPrice: breakdown.total,
         options: {
          widthFeet: size.widthFeet ?? 0,
          widthInches: size.widthInches ?? 0,
          heightInches: size.heightInches ?? 0,
          meshType: meshOptions.meshType,
          color: meshOptions.meshColor,
          topAttachment: meshOptions.topAttachment,
          velcroColor: meshOptions.velcroColor || 'black',
         },
       })
     })
     router.push('/cart')
   }

   const addScrimPanelsToCart = () => {
     scrimPanels.forEach((panel, index) => {
       const totalWidth = (panel.widthFeet ?? 0) + ((panel.widthInches ?? 0) / 12)
       const price = scrimTotals.panelTotals[index]
       addItem({
         type: 'panel',
         productSku: 'scrim_panel',
         name: `Scrim Panel ${index + 1}`,
         description: `${totalWidth.toFixed(1)}ft x ${panel.heightInches ?? 0}in scrim - ${panel.color}`,
         quantity: 1,
         unitPrice: price,
         totalPrice: price,
         options: {
           widthFeet: panel.widthFeet ?? 0,
           widthInches: panel.widthInches ?? 0,
           heightInches: panel.heightInches ?? 0,
           color: panel.color,
           topAttachment: panel.topAttachment,
           velcroColor: panel.velcroColor || 'black',
         },
       })
     })
     router.push('/cart')
   }

   const addStuccoToCart = () => {
    stuccoStrips.forEach((strip, index) => {
      const height = strip.heightInches ?? 0
      const qty = strip.quantity ?? 0
      const unitPrice = height * 24
      addItem({
        type: 'hardware',
        productSku: 'stucco_strip',
        name: `Stucco Strip ${index + 1}`,
        description: `${height}in height x ${qty}`,
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty,
        options: {
          heightInches: height,
        },
      })
    })
    router.push('/cart')
  }

   const addTracksToCart = () => {
     const isHeavy = trackWeight === 'heavy'
     const labelPrefix = isHeavy ? 'Heavy' : 'Standard'
     if (trackItems.straightTrack > 0) {
       addItem({
         type: 'track',
         productSku: isHeavy ? 'heavy_track_7ft' : 'standard_track_7ft',
         name: `${labelPrefix} 7ft Straight Track`,
         description: `${trackColor} track`,
         quantity: trackItems.straightTrack,
         unitPrice: trackPricing.prices.straightTrack,
         totalPrice: trackItems.straightTrack * trackPricing.prices.straightTrack,
         options: { color: trackColor, length: '7ft', weight: trackWeight },
       })
     }
     if (trackItems.curves90 > 0) {
       addItem({
         type: 'hardware',
         productSku: isHeavy ? 'heavy_curve_90' : 'standard_curve_90',
         name: `${labelPrefix} 90 Degree Curve`,
         description: `${trackColor} track`,
         quantity: trackItems.curves90,
         unitPrice: trackPricing.prices.curve,
         totalPrice: trackItems.curves90 * trackPricing.prices.curve,
         options: { color: trackColor, weight: trackWeight },
       })
     }
     if (trackItems.curves135 > 0) {
       addItem({
         type: 'hardware',
         productSku: isHeavy ? 'heavy_curve_135' : 'standard_curve_135',
         name: `${labelPrefix} 135 Degree Curve`,
         description: `${trackColor} track`,
         quantity: trackItems.curves135,
         unitPrice: trackPricing.prices.curve,
         totalPrice: trackItems.curves135 * trackPricing.prices.curve,
         options: { color: trackColor, weight: trackWeight },
       })
     }
     if (trackItems.splices > 0) {
       addItem({
         type: 'hardware',
         productSku: isHeavy ? 'heavy_splice' : 'standard_splice',
         name: `${labelPrefix} Splice`,
         description: `${trackColor} splice`,
         quantity: trackItems.splices,
         unitPrice: trackPricing.prices.splice,
         totalPrice: trackItems.splices * trackPricing.prices.splice,
         options: { color: trackColor, weight: trackWeight },
       })
     }
     if (trackItems.endCaps > 0) {
       addItem({
         type: 'hardware',
         productSku: isHeavy ? 'heavy_end_caps' : 'standard_end_caps',
         name: `${labelPrefix} End Caps`,
         description: `${trackColor} end caps`,
         quantity: trackItems.endCaps,
         unitPrice: trackPricing.prices.endCap,
         totalPrice: trackItems.endCaps * trackPricing.prices.endCap,
         options: { color: trackColor, weight: trackWeight },
       })
     }
     if (trackItems.carriers > 0) {
       addItem({
         type: 'hardware',
         productSku: isHeavy ? 'heavy_carriers' : 'standard_carriers',
         name: `${labelPrefix} Carriers`,
         description: `${trackColor} carriers`,
         quantity: trackItems.carriers,
         unitPrice: trackPricing.prices.carrier,
         totalPrice: trackItems.carriers * trackPricing.prices.carrier,
         options: { color: trackColor, weight: trackWeight },
       })
     }
     router.push('/cart')
   }

   const addAttachmentItem = (item: AttachmentItem, qty: number) => {
     if (qty <= 0) return
     addItem({
       type: 'hardware',
       productSku: item.sku,
       name: item.label,
       description: item.description || `${qty} ${item.unitLabel}`,
       quantity: 1,
       unitPrice: item.unitPrice * qty,
       totalPrice: item.unitPrice * qty,
       options: {
         quantity: qty,
         unit: item.unitLabel,
       },
     })
     setAttachmentQtys((prev) => ({ ...prev, [item.id]: 0 }))
   }

   const addAllAttachmentItems = () => {
     ATTACHMENT_ITEMS.forEach((item) => {
       const qty = attachmentQtys[item.id] || 0
       if (qty > 0) {
         addItem({
           type: 'hardware',
           productSku: item.sku,
           name: item.label,
           description: item.description || `${qty} ${item.unitLabel}`,
           quantity: 1,
           unitPrice: item.unitPrice * qty,
           totalPrice: item.unitPrice * qty,
           options: {
             quantity: qty,
             unit: item.unitLabel,
           },
         })
       }
     })
     setAttachmentQtys({})
     router.push('/cart')
   }

   const attachmentSubtotal = useMemo(() => {
     return ATTACHMENT_ITEMS.reduce((sum, item) => {
       const qty = attachmentQtys[item.id] || 0
       return sum + (item.unitPrice * qty)
     }, 0)
   }, [attachmentQtys])

   const hasSelectedAttachments = useMemo(() => {
     return ATTACHMENT_ITEMS.some((item) => (attachmentQtys[item.id] || 0) > 0)
   }, [attachmentQtys])

   const addAdjustment = (type: 'positive' | 'negative' | 'taxCredit' | 'tariff') => {
     const amount = adjustments[type]
     if (!amount) return
     const signedAmount = (type === 'negative' || type === 'taxCredit')
       ? -Math.abs(amount)
       : Math.abs(amount)
     const nameMap = {
       positive: 'Positive Price Adjustment',
       negative: 'Negative Price Adjustment',
       taxCredit: 'Credit for Sales Tax Exemption',
       tariff: 'Canadian Tariff',
     }
     addItem({
       type: 'addon',
       productSku: `adjustment_${type}`,
       name: nameMap[type],
       description: 'Manual adjustment',
       quantity: 1,
       unitPrice: signedAmount,
       totalPrice: signedAmount,
       options: { amount: signedAmount },
     })
     setAdjustments((prev) => ({ ...prev, [type]: 0 }))
   }

   const addSnapTool = () => {
     addItem({
       type: 'addon',
       productSku: 'industrial_snap_tool',
       name: 'Industrial Snap Tool',
       description: 'Fully refundable if returned',
       quantity: 1,
       unitPrice: 130,
       totalPrice: 130,
     })
     router.push('/cart')
   }

   return (
     <Container size="xl">
       <Stack gap="lg">
         <section>
           <Heading level={1} className="!mb-1">MC Sales</Heading>
           <Text className="text-gray-600">
             Salesperson order builder. All pricing matches Gravity Forms.
           </Text>
         </section>

        {/* Mesh Panels */}
        <Card variant="elevated" className="!p-6">
          <Heading level={2} className="!mb-4">Mesh Panels</Heading>
          
          {/* Panel Options */}
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Type</label>
              <select
                value={meshOptions.meshType}
                onChange={(e) => {
                  const nextType = e.target.value as MeshType
                  const nextColor = nextType === 'heavy_mosquito'
                    ? (meshOptions.meshColor === 'ivory' ? 'ivory' : meshOptions.meshColor)
                    : meshOptions.meshColor === 'ivory'
                      ? 'black'
                      : meshOptions.meshColor
                  setMeshOptions({ ...meshOptions, meshType: nextType, meshColor: nextColor })
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="heavy_mosquito">Heavy Mosquito</option>
                <option value="no_see_um">No-See-Um</option>
                <option value="shade">Shade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Color</label>
              <select
                value={meshOptions.meshColor}
                onChange={(e) => setMeshOptions({ ...meshOptions, meshColor: e.target.value as MeshColor })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="black">Black</option>
                <option value="white">White</option>
                {meshOptions.meshType === 'heavy_mosquito' && (
                  <option value="ivory">Ivory</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
              <select
                value={meshOptions.topAttachment}
                onChange={(e) => {
                  const nextAttachment = e.target.value as MeshTopAttachment
                  setMeshOptions({
                    ...meshOptions,
                    topAttachment: nextAttachment,
                    velcroColor: nextAttachment === 'velcro' ? (meshOptions.velcroColor || 'black') : undefined,
                  })
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                {TOP_ATTACHMENTS.map((attachment) => (
                  <option key={attachment.id} value={attachment.id}>{attachment.label}</option>
                ))}
              </select>
            </div>
            {meshOptions.topAttachment === 'velcro' && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
                <select
                  value={meshOptions.velcroColor || 'black'}
                  onChange={(e) => setMeshOptions({ ...meshOptions, velcroColor: e.target.value as VelcroColor })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  <option value="black">Black</option>
                  <option value="white">White</option>
                </select>
              </div>
            )}
          </Grid>

          {/* Panel Sizes Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div>
              <div>Width (ft)</div>
              <div>Width (in)</div>
              <div>Height (in)</div>
              <div className="text-right">Price</div>
              <div></div>
            </div>
            
            {/* Panel Rows */}
            {meshSizes.map((size, index) => (
              <div 
                key={size.id} 
                className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={size.widthFeet ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, widthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="ft"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={size.widthInches ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={24}
                    value={size.heightInches ?? ''}
                    onChange={(e) => updateMeshSize(index, { ...size, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div className="text-sm text-gray-700 text-right font-medium">
                  ${formatMoney(meshTotals.panelTotals[index]?.total || 0)}
                </div>
                <div className="flex justify-end gap-1">
                  {meshSizes.length > 1 && (
                    <button
                      onClick={() => removeMeshSize(index)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Remove panel"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === meshSizes.length - 1 && (
                    <button
                      onClick={addMeshSize}
                      className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                      aria-label="Add panel"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal and Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Text className="text-gray-600 !mb-0">Subtotal:</Text>
              <Text className="text-xl font-semibold !mb-0">${formatMoney(meshTotals.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addMeshPanelsToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Mesh Panels
            </Button>
          </div>
        </Card>

         {/* Scrim Panels */}
        <Card variant="elevated" className="!p-6">
          <Heading level={2} className="!mb-4">Scrim Panels</Heading>
          
          {/* Panel Options */}
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Color</label>
              <select
                value={scrimPanels[0]?.color || 'silver'}
                onChange={(e) => {
                  const newColor = e.target.value as ScrimColor
                  setScrimPanels(scrimPanels.map(panel => ({ ...panel, color: newColor })))
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="silver">Silver</option>
                <option value="white">White</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Top Attachment</label>
              <select
                value={scrimPanels[0]?.topAttachment || 'velcro'}
                onChange={(e) => {
                  const newAttachment = e.target.value as ScrimPanel['topAttachment']
                  setScrimPanels(scrimPanels.map(panel => ({
                    ...panel,
                    topAttachment: newAttachment,
                    velcroColor: newAttachment === 'velcro' ? (panel.velcroColor || 'black') : undefined,
                  })))
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                {TOP_ATTACHMENTS.map((attachment) => (
                  <option key={attachment.id} value={attachment.id}>{attachment.label}</option>
                ))}
              </select>
            </div>
            {scrimPanels[0]?.topAttachment === 'velcro' && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Velcro Color</label>
                <select
                  value={scrimPanels[0]?.velcroColor || 'black'}
                  onChange={(e) => {
                    const newVelcroColor = e.target.value as ScrimPanel['velcroColor']
                    setScrimPanels(scrimPanels.map(panel => ({ ...panel, velcroColor: newVelcroColor })))
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                >
                  <option value="black">Black</option>
                  <option value="white">White</option>
                </select>
              </div>
            )}
          </Grid>

          {/* Panel Sizes Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div>
              <div>Width (ft)</div>
              <div>Width (in)</div>
              <div>Height (in)</div>
              <div className="text-right">Price</div>
              <div></div>
            </div>
            
            {/* Panel Rows */}
            {scrimPanels.map((panel, index) => (
              <div 
                key={panel.id} 
                className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={panel.widthFeet ?? ''}
                    onChange={(e) => updateScrimPanel(index, { ...panel, widthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="ft"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={panel.widthInches ?? ''}
                    onChange={(e) => updateScrimPanel(index, { ...panel, widthInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={24}
                    max={144}
                    value={panel.heightInches ?? ''}
                    onChange={(e) => updateScrimPanel(index, { ...panel, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div className="text-sm text-gray-700 text-right font-medium">
                  ${formatMoney(scrimTotals.panelTotals[index] || 0)}
                </div>
                <div className="flex justify-end gap-1">
                  {scrimPanels.length > 1 && (
                    <button
                      onClick={() => removeScrimPanel(index)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Remove panel"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === scrimPanels.length - 1 && (
                    <button
                      onClick={addScrimPanel}
                      className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                      aria-label="Add panel"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal and Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Text className="text-gray-600 !mb-0">Subtotal:</Text>
              <Text className="text-xl font-semibold !mb-0">${formatMoney(scrimTotals.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addScrimPanelsToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Scrim Panels
            </Button>
          </div>
        </Card>

         {/* Stucco Strips */}
        <Card variant="elevated" className="!p-6">
          <Heading level={2} className="!mb-4">Stucco Strips</Heading>
          <Text size="sm" className="text-gray-500 !mb-4">$24 per inch of height</Text>
          
          {/* Stucco Strips Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 text-xs font-medium text-gray-600">
              <div>#</div>
              <div>Height (in)</div>
              <div>Quantity</div>
              <div className="text-right">Price</div>
              <div></div>
            </div>
            
            {/* Strip Rows */}
            {stuccoStrips.map((strip, index) => (
              <div 
                key={strip.id} 
                className="px-3 py-2 grid grid-cols-[40px_1fr_1fr_80px_48px] gap-2 items-center border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={strip.heightInches ?? ''}
                    onChange={(e) => updateStuccoStrip(index, { ...strip, heightInches: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="in"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={1}
                    value={strip.quantity ?? ''}
                    onChange={(e) => updateStuccoStrip(index, { ...strip, quantity: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                    placeholder="qty"
                  />
                </div>
                <div className="text-sm text-gray-700 text-right font-medium">
                  ${formatMoney(stuccoTotals.stripTotals[index] || 0)}
                </div>
                <div className="flex justify-end gap-1">
                  {stuccoStrips.length > 1 && (
                    <button
                      onClick={() => removeStuccoStrip(index)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      aria-label="Remove strip"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  {index === stuccoStrips.length - 1 && (
                    <button
                      onClick={addStuccoStrip}
                      className="w-7 h-7 rounded-full bg-[#406517] text-white flex items-center justify-center hover:bg-[#335112] transition-colors"
                      aria-label="Add strip"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal and Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Text className="text-gray-600 !mb-0">Subtotal:</Text>
              <Text className="text-xl font-semibold !mb-0">${formatMoney(stuccoTotals.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addStuccoToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Stucco Strips
            </Button>
          </div>
        </Card>

         {/* Track Hardware */}
         <Card variant="elevated" className="!p-6">
           <Heading level={2} className="!mb-4">Tracking Hardware</Heading>
           <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md">
             <div>
               <label className="block text-sm text-gray-600 mb-1">Track Weight</label>
               <div className="flex gap-2">
                 {(['standard', 'heavy'] as const).map((weight) => (
                   <button
                     key={weight}
                     onClick={() => setTrackWeight(weight)}
                     className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                       trackWeight === weight ? 'bg-[#003365] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                     }`}
                   >
                     {weight === 'standard' ? 'Standard' : 'Heavy'}
                   </button>
                 ))}
               </div>
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">Track Color</label>
               <select
                 value={trackColor}
                 onChange={(e) => setTrackColor(e.target.value as 'white' | 'black')}
                 className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
               >
                 <option value="white">White</option>
                 <option value="black">Black</option>
               </select>
             </div>
           </Grid>
           <Grid responsiveCols={{ mobile: 1, tablet: 3 }} gap="md" className="mt-4">
             <div>
               <label className="block text-sm text-gray-600 mb-1">7ft Straight Track</label>
               <Input
                 type="number"
                 min={0}
                 value={trackItems.straightTrack}
                 onChange={(e) => setTrackItems({ ...trackItems, straightTrack: parseInt(e.target.value) || 0 })}
               />
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">90 Degree Curves</label>
               <Input
                 type="number"
                 min={0}
                 value={trackItems.curves90}
                 onChange={(e) => setTrackItems({ ...trackItems, curves90: parseInt(e.target.value) || 0 })}
               />
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">135 Degree Curves</label>
               <Input
                 type="number"
                 min={0}
                 value={trackItems.curves135}
                 onChange={(e) => setTrackItems({ ...trackItems, curves135: parseInt(e.target.value) || 0 })}
               />
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">Splices</label>
               <Input
                 type="number"
                 min={0}
                 value={trackItems.splices}
                 onChange={(e) => setTrackItems({ ...trackItems, splices: parseInt(e.target.value) || 0 })}
               />
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">End Caps</label>
               <Input
                 type="number"
                 min={0}
                 step={2}
                 value={trackItems.endCaps}
                 onChange={(e) => setTrackItems({ ...trackItems, endCaps: parseInt(e.target.value) || 0 })}
               />
             </div>
             <div>
               <label className="block text-sm text-gray-600 mb-1">Carriers</label>
               <Input
                 type="number"
                 min={0}
                 step={10}
                 value={trackItems.carriers}
                 onChange={(e) => setTrackItems({ ...trackItems, carriers: parseInt(e.target.value) || 0 })}
               />
             </div>
           </Grid>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Text className="text-gray-600 !mb-0">Subtotal:</Text>
              <Text className="text-xl font-semibold !mb-0">${formatMoney(trackPricing.subtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addTracksToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Tracking Hardware
            </Button>
          </div>
         </Card>

         {/* Attachment Items */}
         <Card variant="elevated" className="!p-6">
           <Heading level={2} className="!mb-4">Attachment Items</Heading>
           <Stack gap="lg">
             {ATTACHMENT_GROUPS.map((group) => (
               <div key={group}>
                 <Heading level={3} className="!mb-3">{group}</Heading>
                 <Stack gap="sm">
                   {ATTACHMENT_ITEMS.filter((item) => item.group === group).map((item) => {
                     const qty = attachmentQtys[item.id] || 0
                     return (
                       <Card key={item.id} variant="outlined" className="!p-4">
                         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                           <div>
                             <Text className="font-medium text-gray-900 !mb-1">{item.label}</Text>
                             <Text size="sm" className="text-gray-500 !mb-0">
                               {item.description || `$${formatMoney(item.unitPrice)} per ${item.unitLabel}`}
                             </Text>
                           </div>
                           <div className="flex items-center gap-3 justify-end">
                             <input
                               type="number"
                               min={item.min}
                               max={item.max}
                               step={item.step}
                               value={qty}
                               onChange={(e) => setAttachmentQtys((prev) => ({
                                 ...prev,
                                 [item.id]: parseInt(e.target.value) || 0,
                               }))}
                               className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                             />
                             <Button
                               variant={qty > 0 ? 'primary' : 'outline'}
                               onClick={() => addAttachmentItem(item, qty)}
                               disabled={qty <= 0}
                             >
                               Add
                             </Button>
                           </div>
                         </div>
                       </Card>
                     )
                   })}
                 </Stack>
               </div>
             ))}
           </Stack>
          
          {/* Subtotal and Add All Button */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Text className="text-gray-600 !mb-0">Subtotal:</Text>
              <Text className="text-xl font-semibold !mb-0">${formatMoney(attachmentSubtotal)}</Text>
            </div>
            <Button
              variant="primary"
              onClick={addAllAttachmentItems}
              disabled={!hasSelectedAttachments || isLoading}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add Attachment Items
            </Button>
          </div>
         </Card>

         {/* Snap Tool */}
         <Card variant="elevated" className="!p-6">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
             <div>
               <Heading level={2} className="!mb-1">Industrial Snap Tool</Heading>
               <Text size="sm" className="text-gray-500 !mb-0">
                 $130.00 - Fully refundable if returned
               </Text>
             </div>
             <Button
               variant="primary"
               onClick={addSnapTool}
             >
               <ShoppingCart className="w-5 h-5 mr-2" />
               Add Snap Tool
             </Button>
           </div>
         </Card>

         {/* Adjustments */}
         <Card variant="elevated" className="!p-6">
           <Heading level={2} className="!mb-4">Adjustments</Heading>
           <Stack gap="sm">
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Positive Price Adjustment</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={adjustments.positive}
                     onChange={(e) => setAdjustments({ ...adjustments, positive: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addAdjustment('positive')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
             <Card variant="outlined" className="!p-4">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                 <Text className="font-medium text-gray-900 !mb-0">Negative Price Adjustment</Text>
                 <div className="flex items-center gap-3 justify-end">
                   <input
                     type="number"
                     min={0}
                     value={adjustments.negative}
                     onChange={(e) => setAdjustments({ ...adjustments, negative: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addAdjustment('negative')}>
                     Add
                   </Button>
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
                     value={adjustments.taxCredit}
                     onChange={(e) => setAdjustments({ ...adjustments, taxCredit: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addAdjustment('taxCredit')}>
                     Add
                   </Button>
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
                     value={adjustments.tariff}
                     onChange={(e) => setAdjustments({ ...adjustments, tariff: parseFloat(e.target.value) || 0 })}
                     className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-[#003365] focus:border-transparent"
                   />
                   <Button variant="outline" onClick={() => addAdjustment('tariff')}>
                     Add
                   </Button>
                 </div>
               </div>
             </Card>
           </Stack>
         </Card>
       </Stack>
     </Container>
   )
 }
