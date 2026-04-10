import type { Metadata, Viewport } from "next";
import { Outfit, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Estación Snack — Snacks naturales por kilo · Santa Cruz",
  description:
    "Frutos secos y snacks naturales por kilo en Santa Cruz. Mix de nueces, almendras, maní confitado y más. Despacho martes y viernes. Pide por WhatsApp.",
  metadataBase: new URL("https://estacion-snack.vercel.app"),
  openGraph: {
    title: "Estación Snack — Snacks por kilo",
    description: "Frutos secos y dulces frescos por kilo en Santa Cruz.",
    url: "https://estacion-snack.vercel.app",
    siteName: "Estación Snack",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estación Snack — Snacks por kilo",
    description: "Frutos secos y dulces frescos por kilo en Santa Cruz.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFDF9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} ${dmSerif.variable} ${outfit.className}`}>
      <body>{children}</body>
    </html>
  );
}
