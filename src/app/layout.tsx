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

export const metadata: Metadata = {
  title: "Mosquito Curtains - Custom Screen Enclosures Since 2004",
  description: `Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. ${ORDERS_SERVED_STRINGS.metaDescription}. DIY installation in an afternoon.`,
  keywords: "mosquito curtains, screen porch enclosures, clear vinyl enclosures, patio screens, mosquito netting, outdoor curtains",
  icons: {
    icon: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Netting-Curtains-Logo-512.png",
    shortcut: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Netting-Curtains-Logo-512.png",
    apple: "https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/Mosquito-Netting-Curtains-Logo-512.png",
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
