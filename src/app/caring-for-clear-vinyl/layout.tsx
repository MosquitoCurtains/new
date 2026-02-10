import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/care/clear-vinyl',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
