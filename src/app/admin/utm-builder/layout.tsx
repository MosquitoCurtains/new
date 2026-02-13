import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UTM Builder | Admin',
}

export default function UTMBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
