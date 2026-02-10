import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/care/mosquito-curtains',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
