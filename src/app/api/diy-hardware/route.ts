import { NextResponse } from 'next/server'
import { fetchActiveDiyHardwareItems } from '@/lib/pricing/diy-hardware-service'

/**
 * GET /api/diy-hardware
 * Public endpoint — returns active DIY hardware items for the PanelBuilder.
 */
export async function GET() {
  try {
    const items = await fetchActiveDiyHardwareItems()
    return NextResponse.json({ items })
  } catch (err) {
    console.error('[DiyHardware] Public API error:', err)
    return NextResponse.json(
      { error: 'Failed to load hardware items.' },
      { status: 500 }
    )
  }
}
