import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { FloatingWallet } from "./components/FloatingWallet";
import { Footer } from "./components/Footer";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bundle-maker.vercel.app/"),
  title: "Bundle Maker — x402 Skill Creator",
  description:
    "Describe what you need and get a ready-to-use skill bundle of paid API endpoints, powered by x402",
  alternates: {
    canonical: "/",
  },
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
    url: "/",
    siteName: "Bundle Maker",
    images: [{ url: "/og.png", width: 3022, height: 1644 }],
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
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <FloatingWallet />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
