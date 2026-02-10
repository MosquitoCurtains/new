import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/plan/3-sided/irregular-velcro',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
