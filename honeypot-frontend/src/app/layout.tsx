import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HoneyPot | Consensus x Linea Staking Game",
  description:
    "HoneyPot is a 420-day staking survival game on Linea blending NFTs, DeFi, and game theory. Mint your Bee, deposit daily, and share the pot.",
  keywords: [
    "HoneyPot",
    "Linea",
    "Consensus",
    "staking game",
    "NFT game",
    "DeFi",
  ],
  openGraph: {
    title: "HoneyPot | Consensus x Linea Staking Game",
    description:
      "Mint a Bee NFT, survive 420 days of daily deposits, and split the LINEA pot.",
    url: "https://honeypot.game",
    siteName: "HoneyPot",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-stone-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
