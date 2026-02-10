import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/plan/sealing-base',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
