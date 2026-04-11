import type { Metadata, Viewport } from "next";
import { Outfit, DM_Serif_Display } from "next/font/google";
import AnalyticsScripts from "@/components/AnalyticsScripts";
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

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";

export const metadata: Metadata = {
  title: {
    default: "Estación Snack — Snacks naturales por kilo · Santa Cruz",
    template: "%s · Estación Snack",
  },
  description:
    "Frutos secos y snacks naturales por kilo en Santa Cruz. Mix de nueces, almendras, maní confitado y más. Despacho martes y viernes. Pide por WhatsApp.",
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "frutos secos santa cruz",
    "snacks por kilo",
    "mix de frutos secos",
    "maní confitado",
    "almendras",
    "delivery snacks chile",
    "estacion snack",
  ],
  openGraph: {
    title: "Estación Snack — Snacks por kilo",
    description: "Frutos secos y dulces frescos por kilo en Santa Cruz.",
    url: SITE,
    siteName: "Estación Snack",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Estación Snack" }],
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

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE}/#business`,
  name: "Estación Snack",
  description:
    "Frutos secos y snacks naturales por kilo en Santa Cruz, Chile. Despacho martes y viernes.",
  url: SITE,
  image: `${SITE}/og-image.jpg`,
  telephone: "+56953743338",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Cruz",
    addressRegion: "Región de O'Higgins",
    addressCountry: "CL",
  },
  areaServed: "Santa Cruz, Chile",
  openingHours: "Tu,Fr 10:00-19:00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} ${dmSerif.variable} ${outfit.className}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
