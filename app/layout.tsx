import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LayerSync AI | Synchronize Intelligence",
  description:
    "LayerSync AI — next-generation AI automation agency. Synchronize Intelligence.",
  manifest: "/site.webmanifest",
  themeColor: "#050505",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "LayerSync AI | Synchronize Intelligence",
    description: "Next-generation AI automation agency. Synchronize Intelligence.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LayerSync AI | Synchronize Intelligence",
    description: "Next-generation AI automation agency. Synchronize Intelligence.",
    images: ["/og-image.png"],
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
        className={cn(
          orbitron.variable,
          rajdhani.variable,
          "antialiased bg-[#f5f5f7] dark:bg-bg-primary text-gray-900 dark:text-white overflow-hidden"
        )}
      >
        {children}
      </body>
    </html>
  );
}
