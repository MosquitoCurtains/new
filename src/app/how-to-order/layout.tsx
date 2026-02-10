import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/plan/how-to-order',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
