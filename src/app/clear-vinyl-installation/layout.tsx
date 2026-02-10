import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/install/clear-vinyl',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
