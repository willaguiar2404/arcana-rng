import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ variable: "--font-display", subsets: ["latin"] });
const inter = Inter({ variable: "--font-ui", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: "Arcana RNG",
  description: "Um jogo de invocação, coleção e progressão arcana.",
  openGraph: {
    title: "Arcana RNG",
    description: "Invoque. Colecione. Ascenda.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Arcana RNG" }],
  },
  twitter: { card: "summary_large_image", title: "Arcana RNG", description: "Invoque. Colecione. Ascenda.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${cinzel.variable} ${inter.variable}`}>{children}</body></html>;
}
