import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Mosquito Curtains',
  description: 'The page you are looking for does not exist. Browse our products or contact our team for help.',
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
