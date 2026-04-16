import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bundle Maker — x402 Skill Creator",
  description:
    "Describe what you need and get a ready-to-use skill bundle of paid API endpoints, powered by x402",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Bundle Maker — x402 Skill Creator",
    description:
      "Describe what you need and get a ready-to-use skill bundle of paid API endpoints, powered by x402",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bundle Maker — x402 Skill Creator",
    description:
      "Describe what you need and get a ready-to-use skill bundle of paid API endpoints, powered by x402",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <main className="flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
