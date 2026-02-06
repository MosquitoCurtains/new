import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalLayout } from "@/components/GlobalLayout";
import { TrackingProvider } from "@/components/tracking";
import { ORDERS_SERVED_STRINGS } from "@/lib/constants/orders-served";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const LOGO_URL = "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Netting-Curtains-Logo-512.png";
const SITE_URL = "https://www.mosquitocurtains.com";

export const metadata: Metadata = {
  title: {
    default: "Mosquito Curtains - Custom Screen Enclosures Since 2004",
    template: "%s | Mosquito Curtains",
  },
  description: `Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. ${ORDERS_SERVED_STRINGS.metaDescription}. DIY installation in an afternoon.`,
  keywords: "mosquito curtains, screen porch enclosures, clear vinyl enclosures, patio screens, mosquito netting, outdoor curtains",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mosquito Curtains",
    title: "Mosquito Curtains - Custom Screen Enclosures Since 2004",
    description: `Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. ${ORDERS_SERVED_STRINGS.metaDescription}. DIY installation in an afternoon.`,
    images: [
      {
        url: LOGO_URL,
        width: 512,
        height: 512,
        alt: "Mosquito Curtains Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mosquitocurtain",
    title: "Mosquito Curtains - Custom Screen Enclosures Since 2004",
    description: `Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. ${ORDERS_SERVED_STRINGS.metaDescription}.`,
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  verification: {
    // Add Google Search Console and Bing verification codes when available
    // google: "your-google-verification-code",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TrackingProvider>
          <GlobalLayout>
            {children}
          </GlobalLayout>
        </TrackingProvider>
      </body>
    </html>
  );
}
