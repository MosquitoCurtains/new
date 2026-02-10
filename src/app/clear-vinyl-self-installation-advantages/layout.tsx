import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/options/clear-vinyl/diy',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
