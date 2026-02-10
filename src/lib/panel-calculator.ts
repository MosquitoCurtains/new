/**
 * Panel dimension calculator
 * Based on Gravity Forms panel calculator + documented width/height adjustment rules.
 *
 * WIDTH ADJUSTMENTS
 * 1. Add 1" per edge that snaps to a surface (Marine Snaps, Magnetic Door)
 * 2. Subtract 1" per edge connecting a Stucco Strip (ignore strip width)
 * 3. Tracking top only: add 1" per 10ft of panel width for relaxed fit
 *
 * HEIGHT ADJUSTMENTS
 * 1. Add 2" per panel (base overlap for floor coverage)
 * 2. Velcro top: add another +2" (extra for velcro fold-over)
 * 3. Tracking top: +0" (track gives automatic 1" floor overlap via the drop)
 */

export type TopAttachment = 'tracking' | 'velcro'
export type SideAttachment = 'none' | 'marine_snaps' | 'magnetic_door' | 'stucco_strip'

/** Inch adjustment for top attachment (height only, on top of the +2 base) */
const TOP_HEIGHT_VALUES: Record<TopAttachment, number> = {
  tracking: 0,
  velcro: 2,
}

/** Inch adjustment for each side attachment (width only) */
const SIDE_VALUES: Record<SideAttachment, number> = {
  none: 0,
  marine_snaps: 1,   // snaps to surface → +1"
  magnetic_door: 1,  // magnets snap to surface → +1"
  stucco_strip: -1,  // stucco connection → −1"
}

export function getTopAdjustment(top: TopAttachment): number {
  return TOP_HEIGHT_VALUES[top] ?? 0
}

export function getSideAdjustment(side: SideAttachment): number {
  return SIDE_VALUES[side] ?? 0
}

export interface PanelInputs {
  widthInches: number
  heightInches: number
  topAttachment: TopAttachment
  side1Attachment: SideAttachment
  side2Attachment: SideAttachment
}

export interface WidthBreakdown {
  base: number          // raw measurement
  side1Add: number      // per-edge adjustment
  side2Add: number      // per-edge adjustment
  relaxedFitAdd: number // tracking only: width/120 rounded
  total: number         // final
}

export interface HeightBreakdown {
  base: number          // raw measurement
  overlapAdd: number    // always +2"
  topAdd: number        // velcro +2, tracking 0
  total: number         // final
}

export interface PanelResults {
  rawWidth: number
  rawHeight: number
  finalWidth: number
  finalHeight: number
  widthBreakdown: WidthBreakdown
  heightBreakdown: HeightBreakdown
}

/**
 * Calculate final panel dimensions from raw measurements and attachment types.
 */
export function calculatePanelDimensions(inputs: PanelInputs): PanelResults {
  const { widthInches, heightInches, topAttachment, side1Attachment, side2Attachment } = inputs

  const topAdj = getTopAdjustment(topAttachment)
  const side1Adj = getSideAdjustment(side1Attachment)
  const side2Adj = getSideAdjustment(side2Attachment)

  // WIDTH: side adjustments + tracking relaxed fit
  const side1Add = side1Adj
  const side2Add = side2Adj
  const relaxedFitAdd = topAttachment === 'tracking'
    ? Math.round(widthInches / 120)
    : 0
  const finalWidth = Math.round(widthInches + side1Add + side2Add + relaxedFitAdd)

  // HEIGHT: +2" base overlap + top attachment
  const overlapAdd = 2
  const finalHeight = heightInches + overlapAdd + topAdj

  return {
    rawWidth: widthInches,
    rawHeight: heightInches,
    finalWidth,
    finalHeight,
    widthBreakdown: {
      base: widthInches,
      side1Add,
      side2Add,
      relaxedFitAdd,
      total: finalWidth,
    },
    heightBreakdown: {
      base: heightInches,
      overlapAdd,
      topAdd: topAdj,
      total: finalHeight,
    },
  }
}
