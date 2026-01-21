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
  title: "LayerSync - Coming Soon",
  description: "The future of layer synchronization is approaching.",
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
          "antialiased bg-bg-primary text-white overflow-hidden"
        )}
      >
        {children}
      </body>
    </html>
  );
}
