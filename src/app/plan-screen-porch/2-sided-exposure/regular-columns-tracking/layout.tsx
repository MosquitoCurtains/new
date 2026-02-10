import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/plan/2-sided/regular-tracking',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
