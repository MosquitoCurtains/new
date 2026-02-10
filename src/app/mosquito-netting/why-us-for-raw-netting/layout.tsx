import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/raw-netting/why-us',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
