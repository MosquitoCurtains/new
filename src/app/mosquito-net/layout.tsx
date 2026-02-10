import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/raw-netting/mosquito-net',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
