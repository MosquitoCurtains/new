'use client'

import { ProductPageTemplate } from '@/lib/design-system/templates'

// Project types for the grid
const PROJECT_TYPES = [
  {
    title: 'Screened Porch',
    href: '/screened-porch',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Screen your porch with custom curtains',
  },
  {
    title: 'Screen Patio',
    href: '/screen-patio',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2020/12/82-Screen-Patio-Enclosure-1200-400x300-1.jpg',
    description: 'Covered patio bug protection',
  },
  {
    title: 'Garage Door Screens',
    href: '/garage-door-screens',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Garage-Screen-300x225.jpg',
    description: 'Convert your garage to usable space',
  },
  {
    title: 'Pergola Screens',
    href: '/pergola-screen-curtains',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/21-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Elegant curtains for pergolas',
  },
  {
    title: 'Gazebo Screens',
    href: '/gazebo-screen-curtains',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/31-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Heavy-duty gazebo protection',
  },
  {
    title: 'Screened-In Decks',
    href: '/screened-in-decks',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/25-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Screen your covered deck',
  },
  {
    title: 'Awning Enclosures',
    href: '/awning-screen-enclosures',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/09-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Add screens to your awning',
  },
  {
    title: 'Industrial Netting',
    href: '/industrial-netting',
    image: 'https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/02-Mosquito-Netting-on-Screen-Porch-1200-1024x768.jpg',
    description: 'Commercial & industrial applications',
  },
]

const BENEFITS = [
  'Custom-made to your exact measurements',
  'Marine-grade materials that won\'t fade or rot',
  'Easy DIY installation in an afternoon',
  'Slide open like decorative curtains',
  'Swap with clear vinyl panels for winter',
  'Fraction of the cost of permanent screening',
  'Available in mosquito mesh, no-see-um, or shade fabric',
]

export default function ScreenedPorchEnclosuresPage() {
  return (
    <ProductPageTemplate
      title="Mosquito Curtains"
      subtitle="Screen Patio Enclosures"
      description="Custom-crafted mosquito netting curtains to screen any outdoor space. Made to your exact measurements, delivered in 6-10 business days, and easy to install yourself."
      overviewVideoId="FqNe9pDsZ8M"
      projectTypes={PROJECT_TYPES}
      benefits={BENEFITS}
      showSaleBanner={true}
      saleText="10% Off Sale until Feb 14th - Code: MIDWINTER26"
    />
  )
}
