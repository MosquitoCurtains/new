import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/projects',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
