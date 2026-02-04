import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalLayout } from "@/components/GlobalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mosquito Curtains - Custom Screen Enclosures Since 2004",
  description: "Custom-made mosquito netting curtains, clear vinyl enclosures, and raw netting fabric. Over 92,000 happy clients since 2004. DIY installation in an afternoon.",
  keywords: "mosquito curtains, screen porch enclosures, clear vinyl enclosures, patio screens, mosquito netting, outdoor curtains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GlobalLayout>
          {children}
        </GlobalLayout>
      </body>
    </html>
  );
}
