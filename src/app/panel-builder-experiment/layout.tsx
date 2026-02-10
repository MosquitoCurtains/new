import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Builder Experiment | Mosquito Curtains',
  description: 'Experimental panel dimension calculator with attachment selection and visualizer.',
  robots: { index: false, follow: false },
}

export default function PanelBuilderExperimentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
