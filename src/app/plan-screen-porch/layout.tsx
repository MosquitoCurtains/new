import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plan Your Screen Porch Project',
  description: 'Plan your mosquito curtain or clear vinyl enclosure project. Choose your exposure type, mesh, tracking, and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
