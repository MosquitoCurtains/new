 'use client'

 /**
  * MC Sales
  *
  * Salesperson flow for adding products to the cart.
  * Mirrors the Gravity Forms pricing rules used in mc-sales.
  */

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
 import { Container, Stack, Grid, Card, Heading, Text, Button, Input } from '@/lib/design-system'
import type { MeshColor, MeshTopAttachment, MeshType, VelcroColor } from '@/lib/pricing/types'
 import { calculateMeshPanelPrice } from '@/lib/pricing/formulas'
 import { useCart } from '@/hooks/useCart'
 import { usePricing } from '@/hooks/usePricing'

 type AttachmentItem = {
   id: string
   label: string
   sku: string
   unitLabel: string
   unitPrice: number  // fallback price if DB unavailable
   priceKey?: string  // DB pricing key for getPrice()
   step: number
   min: number
   max: number
   group: string
   description?: string
   image?: string
 }

// =============================================================================
// PRODUCT IMAGES (from WordPress CDN)
// =============================================================================

const IMG = 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads'

const SECTION_IMAGES = {
  meshPanels: `${IMG}/2019/11/Panel-Example-700x525.jpg`,
  standardTrack: `${IMG}/2019/10/Track-Color-White-Black-700x700.jpg`,
  heavyTrack: `${IMG}/2019/10/Heavy-Track-BW-700x700.jpg`,
  attachmentItems: `${IMG}/2019/12/Attachment-Items-700x700.jpg`,
  adjustments: `${IMG}/2019/12/Product-Adjustment-Image-700x700.png`,
}

const TRACK_IMAGES = {
  standard: {
    straightTrack: `${IMG}/2019/10/Straight-Track-Black-1.jpg`,
    curve90: `${IMG}/2019/10/90-Black-Track-1.jpg`,
    curve135: `${IMG}/2019/10/135-Black-Track-1.jpg`,
    splice: `${IMG}/2019/10/Black-White-Splice.jpg`,
    endCap: `${IMG}/2019/10/Black-White-End-Cap.jpg`,
    carriers: `${IMG}/2019/10/Snap-Carriers-1024.jpg`,
  },
  heavy: {
    straightTrack: `${IMG}/2019/10/Heavy-Track-BW.jpg`,
    curve90: `${IMG}/2019/10/90-Heavy-BW.jpg`,
    curve135: `${IMG}/2019/10/135-Heavy-BW.jpg`,
    splice: `${IMG}/2019/10/Heavy-Splice-BW.jpg`,
    endCap: `${IMG}/2019/10/End-Cap-Heavy-BW.jpg`,
    carriers: `${IMG}/2019/12/Heavy-Track-Carriers.jpg`,
  },
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
    priceKey: 'marine_snap',
    step: 10,
    min: 0,
    max: 200,
    group: 'Sealing Sides',
    description: '$15 per pack of 10',
    image: `${IMG}/2019/09/Black-Marine-Snap-Pack-of-10.jpg`,
  },
  {
    id: 'marine_snaps_white',
    label: 'White Marine Snaps',
    sku: 'marine_snaps_white',
    unitLabel: 'snaps',
    unitPrice: 1.5,
    priceKey: 'marine_snap',
    step: 10,
    min: 0,
    max: 200,
    group: 'Sealing Sides',
    description: '$15 per pack of 10',
    image: `${IMG}/2019/09/White-Marine-Snaps-Pack-of-10.jpg`,
  },
  {
    id: 'adhesive_snaps_clear',
    label: 'Clear Adhesive Marine Snaps',
    sku: 'adhesive_snaps_clear',
    unitLabel: 'snaps',
    unitPrice: 3,
    priceKey: 'adhesive_snap_clear',
    step: 5,
    min: 0,
    max: 50,
    group: 'Sealing Sides',
    description: '$15 per set of 5',
    image: `${IMG}/2019/09/Clear-Snap.jpg`,
  },
  {
    id: 'adhesive_snaps_white',
    label: 'White Adhesive Marine Snaps',
    sku: 'adhesive_snaps_white',
    unitLabel: 'snaps',
    unitPrice: 3,
    priceKey: 'adhesive_snap_bw',
    step: 5,
    min: 0,
    max: 50,
    group: 'Sealing Sides',
    description: '$15 per set of 5',
    image: `${IMG}/2019/09/White-Snap.jpg`,
  },
  {
    id: 'adhesive_snaps_black',
    label: 'Black Adhesive Marine Snaps',
    sku: 'adhesive_snaps_black',
    unitLabel: 'snaps',
    unitPrice: 3,
    priceKey: 'adhesive_snap_bw',
    step: 5,
    min: 0,
    max: 50,
    group: 'Sealing Sides',
    description: '$15 per set of 5',
    image: `${IMG}/2019/09/Black-Snap.jpg`,
  },
  {
    id: 'panel_snaps',
    label: 'Panel to Panel Marine Snaps',
    sku: 'panel_snaps',
    unitLabel: 'snaps',
    unitPrice: 1.67,
    priceKey: 'panel_snap',
    step: 6,
    min: 0,
    max: 30,
    group: 'Sealing Sides',
    description: '$10 per pack of 6',
    image: `${IMG}/2019/10/Panel-to-Panel-Snap.jpg`,
  },
  {
    id: 'rubber_washers',
    label: 'Rubber Washers',
    sku: 'rubber_washers',
    unitLabel: 'washers',
    unitPrice: 0.2,
    priceKey: 'rubber_washer',
    step: 10,
    min: 0,
    max: 200,
    group: 'Sealing Sides',
    description: '$2 per pack of 10',
    image: `${IMG}/2019/09/Rubber-Washers.jpg`,
  },
   {
    id: 'block_magnets',
    label: 'Block Shaped Magnets',
    sku: 'block_magnets',
    unitLabel: 'magnets',
    unitPrice: 1,
    priceKey: 'block_magnet',
    step: 2,
    min: 10,
    max: 100,
    group: 'Magnetic Doorways',
    description: '$10 per 10',
    image: `${IMG}/2019/09/Neodymium-Magnets-10-Pack.jpg`,
  },
  {
    id: 'fiberglass_rods',
    label: '10ft Fiberglass Rods & Clips',
    sku: 'fiberglass_rods',
    unitLabel: 'rods',
    unitPrice: 10,
    priceKey: 'fiberglass_rod',
    step: 1,
    min: 0,
    max: 22,
    group: 'Magnetic Doorways',
    description: '$10 each',
    image: `${IMG}/2019/09/Fiberglass-Rod-2-Pack.jpg`,
  },
  {
    id: 'rod_clips',
    label: 'Fiberglass Rod Clips',
    sku: 'rod_clips',
    unitLabel: 'clips',
    unitPrice: 2,
    priceKey: 'fiberglass_clip',
    step: 1,
    min: 0,
    max: 10,
    group: 'Magnetic Doorways',
    description: '$2 each',
    image: `${IMG}/2019/10/Fiberglass-Rod-Clips.jpg`,
  },
   {
    id: 'elastic_cord_black',
    label: 'Black Elastic Cord & D-Rings',
    sku: 'elastic_cord_black',
    unitLabel: 'cords',
    unitPrice: 10,
    priceKey: 'elastic_cord',
    step: 1,
    min: 0,
    max: 12,
    group: 'Elastic Cord & Tethers',
    description: '$10 each',
    image: `${IMG}/2019/09/Elastic-Cord.jpg`,
  },
  {
    id: 'elastic_cord_white',
    label: 'White Elastic Cord & D-Rings',
    sku: 'elastic_cord_white',
    unitLabel: 'cords',
    unitPrice: 10,
    priceKey: 'elastic_cord',
    step: 1,
    min: 0,
    max: 12,
    group: 'Elastic Cord & Tethers',
    description: '$10 each',
    image: `${IMG}/2019/10/White-Elastic-Cord.jpg`,
  },
  {
    id: 'tether_clips',
    label: 'Tether Clips',
    sku: 'tether_clips',
    unitLabel: 'clips',
    unitPrice: 10,
    priceKey: 'tether_clip',
    step: 1,
    min: 0,
    max: 10,
    group: 'Elastic Cord & Tethers',
    description: '$10 each',
    image: `${IMG}/2019/10/Tether-Clip.jpg`,
  },
  {
    id: 'belted_ribs',
    label: 'Belted Ribs',
    sku: 'belted_ribs',
    unitLabel: 'ribs',
    unitPrice: 15,
    priceKey: 'belted_rib',
    step: 1,
    min: 0,
    max: 12,
    group: 'Elastic Cord & Tethers',
    description: '$15 each',
    image: `${IMG}/2019/10/Black-Belted-Rib.jpg`,
  },
   {
    id: 'fastwax',
    label: 'Fastwax Cleaner',
    sku: 'fastwax_cleaner',
    unitLabel: 'bottles',
    unitPrice: 15,
    priceKey: 'fastwax',
    step: 1,
    min: 0,
    max: 4,
    group: 'Other Items',
    description: '$15 per bottle',
    image: `${IMG}/2019/10/Fast-Wax.jpg`,
  },
  {
    id: 'webbing_black',
    label: 'Black 2" Webbing',
    sku: 'webbing_black',
    unitLabel: 'feet',
    unitPrice: 0.4,
    priceKey: 'webbing',
    step: 10,
    min: 0,
    max: 200,
    group: 'Other Items',
    description: '$4 per 10ft',
    image: `${IMG}/2019/09/Black-Webbing.jpg`,
  },
  {
    id: 'webbing_white',
    label: 'White 2" Webbing',
    sku: 'webbing_white',
    unitLabel: 'feet',
    unitPrice: 0.4,
    priceKey: 'webbing',
    step: 10,
    min: 0,
    max: 200,
    group: 'Other Items',
    description: '$4 per 10ft',
    image: `${IMG}/2019/09/White-Webbing.jpg`,
  },
  {
    id: 'snap_tape_black',
    label: 'Black Snap Tape',
    sku: 'snap_tape_black',
    unitLabel: 'feet',
    unitPrice: 2,
    priceKey: 'snap_tape',
    step: 5,
    min: 0,
    max: 100,
    group: 'Other Items',
    description: '$10 per 5ft',
    image: `${IMG}/2020/07/Black-Snap-Tape.jpg`,
  },
  {
    id: 'snap_tape_white',
    label: 'White Snap Tape',
    sku: 'snap_tape_white',
    unitLabel: 'feet',
    unitPrice: 2,
    priceKey: 'snap_tape',
    step: 5,
    min: 0,
    max: 100,
    group: 'Other Items',
    description: '$10 per 5ft',
    image: `${IMG}/2020/07/White-Snap-Tape.jpg`,
  },
  {
    id: 'tie_up_straps',
    label: 'Tie Up Straps',
    sku: 'tie_up_straps',
    unitLabel: 'straps',
    unitPrice: 2,
    priceKey: 'tieup_strap',
    step: 1,
    min: 0,
    max: 40,
    group: 'Other Items',
    description: '$2 each',
    image: `${IMG}/2019/10/Tie-Up-Straps-1.jpg`,
  },
  {
    id: 'adhesive_velcro_white',
    label: 'White Adhesive Hook Velcro',
    sku: 'adhesive_velcro_white',
    unitLabel: 'feet',
    unitPrice: 0,
    priceKey: 'adhesive_velcro',
    step: 5,
    min: 0,
    max: 200,
    group: 'Other Items',
    image: `${IMG}/2019/10/White-Velcro-1.jpg`,
   },
   {
    id: 'adhesive_velcro_black',
    label: 'Black Adhesive Hook Velcro',
    sku: 'adhesive_velcro_black',
    unitLabel: 'feet',
    unitPrice: 0,
    priceKey: 'adhesive_velcro',
    step: 5,
    min: 0,
    max: 200,
    group: 'Other Items',
    image: `${IMG}/2019/10/Black-Velcro-1.jpg`,
  },
  {
    id: 'l_screws',
    label: 'L Screws',
    sku: 'l_screws',
    unitLabel: 'screws',
    unitPrice: 0,
    priceKey: 'l_screw',
    step: 4,
    min: 0,
    max: 60,
    group: 'Other Items',
    image: `${IMG}/2019/10/L-Screws-1.jpg`,
  },
  {
    id: 'screw_studs_1',
    label: '1" Screw Studs',
    sku: 'screw_studs_1',
    unitLabel: 'studs',
    unitPrice: 0,
    priceKey: 'screw_stud',
    step: 10,
    min: 0,
    max: 150,
    group: 'Other Items',
    image: `${IMG}/2019/10/1-INCH-SCREW.jpg`,
  },
  {
    id: 'screw_studs_2',
    label: '2" Screw Studs',
    sku: 'screw_studs_2',
    unitLabel: 'studs',
    unitPrice: 0,
    priceKey: 'screw_stud',
    step: 10,
    min: 0,
    max: 150,
    group: 'Other Items',
    image: `${IMG}/2019/10/2-INCH-SCREW.jpg`,
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
   const { prices: dbPrices, isLoading: pricingLoading, getPrice } = usePricing()
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
    if (!dbPrices) return { panelTotals: [], subtotal: 0 }
    const panelTotals = meshSizes.map((size) => calculateMeshPanelPrice({
      widthFeet: size.widthFeet ?? 0,
      widthInches: size.widthInches ?? 0,
      heightInches: size.heightInches ?? 0,
      meshType: meshOptions.meshType,
      meshColor: meshOptions.meshColor,
      topAttachment: meshOptions.topAttachment,
      velcroColor: meshOptions.velcroColor,
    }, dbPrices))
     const subtotal = panelTotals.reduce((sum, item) => sum + item.total, 0)
     return { panelTotals, subtotal }
  }, [meshSizes, meshOptions, dbPrices])

  const stuccoTotals = useMemo(() => {
    const stuccoRate = getPrice('stucco_standard', 24)
    const stripTotals = stuccoStrips.map((strip) => (strip.heightInches ?? 0) * stuccoRate * (strip.quantity ?? 0))
    const subtotal = stripTotals.reduce((sum, value) => sum + value, 0)
    return { stripTotals, subtotal }
  }, [stuccoStrips, getPrice])

   const trackPricing = useMemo(() => {
     const isHeavy = trackWeight === 'heavy'
     const prefix = isHeavy ? 'track_heavy' : 'track_std'
     const prices = {
       straightTrack: getPrice(`${prefix}_7ft`, isHeavy ? 42 : 30),
       curve90: getPrice(isHeavy ? 'track_heavy_curve_90' : 'track_curve_90', 25),
       curve135: getPrice(isHeavy ? 'track_heavy_curve_135' : 'track_curve_135', 25),
       splice: getPrice(isHeavy ? 'track_heavy_splice' : 'track_splice', isHeavy ? 5 : 7),
       endCap: getPrice(isHeavy ? 'track_heavy_endcap' : 'track_endcap', isHeavy ? 3 : 1.5),
       carrier: getPrice(isHeavy ? 'track_heavy_carrier' : 'track_carrier', isHeavy ? 1.25 : 0.5),
     }
     const subtotal = (
       trackItems.straightTrack * prices.straightTrack +
       trackItems.curves90 * prices.curve90 +
       trackItems.curves135 * prices.curve135 +
       trackItems.splices * prices.splice +
       trackItems.endCaps * prices.endCap +
       trackItems.carriers * prices.carrier
     )
     return { prices, subtotal }
   }, [trackItems, trackWeight, getPrice])

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

   const addStuccoToCart = () => {
    const stuccoRate = getPrice('stucco_standard', 24)
    stuccoStrips.forEach((strip, index) => {
      const height = strip.heightInches ?? 0
      const qty = strip.quantity ?? 0
      const unitPrice = height * stuccoRate
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
         unitPrice: trackPricing.prices.curve90,
         totalPrice: trackItems.curves90 * trackPricing.prices.curve90,
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
         unitPrice: trackPricing.prices.curve135,
         totalPrice: trackItems.curves135 * trackPricing.prices.curve135,
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

   /** Resolve the unit price for an attachment item: DB price if available, else fallback */
   const resolveAttachmentPrice = (item: AttachmentItem): number => {
     if (item.priceKey) return getPrice(item.priceKey, item.unitPrice)
     return item.unitPrice
   }

   const addAttachmentItem = (item: AttachmentItem, qty: number) => {
     if (qty <= 0) return
     const unitPrice = resolveAttachmentPrice(item)
     addItem({
       type: 'hardware',
       productSku: item.sku,
       name: item.label,
       description: item.description || `${qty} ${item.unitLabel}`,
       quantity: 1,
       unitPrice: unitPrice * qty,
       totalPrice: unitPrice * qty,
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
         const unitPrice = resolveAttachmentPrice(item)
         addItem({
           type: 'hardware',
           productSku: item.sku,
           name: item.label,
           description: item.description || `${qty} ${item.unitLabel}`,
           quantity: 1,
           unitPrice: unitPrice * qty,
           totalPrice: unitPrice * qty,
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
       const unitPrice = item.priceKey ? getPrice(item.priceKey, item.unitPrice) : item.unitPrice
       return sum + (unitPrice * qty)
     }, 0)
   }, [attachmentQtys, getPrice])

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
     const snapToolPrice = getPrice('snap_tool', 130)
     addItem({
       type: 'addon',
       productSku: 'industrial_snap_tool',
       name: 'Industrial Snap Tool',
       description: 'Fully refundable if returned',
       quantity: 1,
       unitPrice: snapToolPrice,
       totalPrice: snapToolPrice,
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image src={SECTION_IMAGES.meshPanels} alt="Mesh Panels" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <Heading level={2} className="!mb-0">Mesh Panels</Heading>
          </div>
          
          {/* Panel Options */}
          <Grid responsiveCols={{ mobile: 2, tablet: 4 }} gap="md" className="mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Type</label>
              <select
                value={meshOptions.meshType}
                onChange={(e) => {
                  const nextType = e.target.value as MeshType
                  // Reset color when switching to/from scrim
                  let nextColor: MeshColor = meshOptions.meshColor
                  if (nextType === 'scrim') {
                    nextColor = 'silver'
                  } else if (meshOptions.meshType === 'scrim') {
                    nextColor = 'black'
                  } else if (nextType !== 'heavy_mosquito' && meshOptions.meshColor === 'ivory') {
                    nextColor = 'black'
                  }
                  setMeshOptions({ ...meshOptions, meshType: nextType, meshColor: nextColor })
                }}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                <option value="heavy_mosquito">Heavy Mosquito</option>
                <option value="no_see_um">No-See-Um</option>
                <option value="shade">Shade</option>
                <option value="scrim">Scrim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesh Color</label>
              <select
                value={meshOptions.meshColor}
                onChange={(e) => setMeshOptions({ ...meshOptions, meshColor: e.target.value as MeshColor })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
              >
                {meshOptions.meshType === 'scrim' ? (
                  <>
                    <option value="silver">Silver</option>
                    <option value="white">White</option>
                  </>
                ) : (
                  <>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    {meshOptions.meshType === 'heavy_mosquito' && (
                      <option value="ivory">Ivory</option>
                    )}
                  </>
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

         {/* Stucco Strips */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
              <Image src={SECTION_IMAGES.meshPanels} alt="Stucco Strips" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <Heading level={2} className="!mb-0">Stucco Strips</Heading>
              <Text size="sm" className="text-gray-500 !mb-0">${formatMoney(getPrice('stucco_standard', 24))} per inch of height</Text>
            </div>
          </div>
          
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
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
               <Image src={trackWeight === 'heavy' ? SECTION_IMAGES.heavyTrack : SECTION_IMAGES.standardTrack} alt="Tracking Hardware" width={64} height={64} className="w-full h-full object-cover" />
             </div>
             <Heading level={2} className="!mb-0">Tracking Hardware</Heading>
           </div>
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
             {([
               { key: 'straightTrack', label: '7ft Straight Track', imgKey: 'straightTrack' as const, step: 1, price: trackPricing.prices.straightTrack },
               { key: 'curves90', label: '90 Degree Curves', imgKey: 'curve90' as const, step: 1, price: trackPricing.prices.curve90 },
               { key: 'curves135', label: '135 Degree Curves', imgKey: 'curve135' as const, step: 1, price: trackPricing.prices.curve135 },
               { key: 'splices', label: 'Splices', imgKey: 'splice' as const, step: 1, price: trackPricing.prices.splice },
               { key: 'endCaps', label: 'End Caps', imgKey: 'endCap' as const, step: 2, price: trackPricing.prices.endCap },
               { key: 'carriers', label: 'Carriers', imgKey: 'carriers' as const, step: 10, price: trackPricing.prices.carrier },
             ] as const).map(({ key, label, imgKey, step, price }) => (
               <div key={key} className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                   <Image src={TRACK_IMAGES[trackWeight][imgKey]} alt={label} width={48} height={48} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm text-gray-600 mb-1">{label} <span className="text-gray-400">${formatMoney(price)}/ea</span></label>
                   <Input
                     type="number"
                     min={0}
                     step={step}
                     value={trackItems[key]}
                     onChange={(e) => setTrackItems({ ...trackItems, [key]: parseInt(e.target.value) || 0 })}
                   />
                 </div>
               </div>
             ))}
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
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
               <Image src={SECTION_IMAGES.attachmentItems} alt="Attachment Items" width={64} height={64} className="w-full h-full object-cover" />
             </div>
             <Heading level={2} className="!mb-0">Attachment Items</Heading>
           </div>
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
                           <div className="flex items-center gap-3">
                             {item.image && (
                               <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                 <Image src={item.image} alt={item.label} width={48} height={48} className="w-full h-full object-cover" />
                               </div>
                             )}
                             <div>
                               <Text className="font-medium text-gray-900 !mb-1">{item.label}</Text>
                               <Text size="sm" className="text-gray-500 !mb-0">
                                 {item.description || `$${formatMoney(resolveAttachmentPrice(item))} per ${item.unitLabel}`}
                               </Text>
                             </div>
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
                 ${formatMoney(getPrice('snap_tool', 130))} - Fully refundable if returned
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
