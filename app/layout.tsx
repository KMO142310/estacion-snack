import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import ConsentBanner from "@/components/ConsentBanner";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estacionsnack.cl";

export const metadata: Metadata = {
  title: {
    default: "Estación Snack — Frutos secos por kilo · Santa Cruz",
    template: "%s · Estación Snack",
  },
  description:
    "Frutos secos y dulces del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado en Santa Cruz, Peralillo, Palmilla y Nancagua.",
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
    "frutos secos por kilo",
    "mix frutos secos colchagua",
    "mani confitado",
    "almendras por kilo",
    "snacks chile santa cruz",
    "estacion snack",
    "despacho frutos secos colchagua",
  ],
  openGraph: {
    title: "Estación Snack — Frutos secos por kilo",
    description:
      "Frutos secos del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado.",
    url: SITE,
    siteName: "Estación Snack",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Estación Snack — Frutos secos por kilo" }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estación Snack — Frutos secos por kilo",
    description: "Frutos secos del Valle de Colchagua, vendidos por kilo.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4EADB",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE}/#business`,
  name: "Estación Snack",
  description:
    "Frutos secos y dulces del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado en Santa Cruz y alrededores.",
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
  areaServed: [
    { "@type": "City", name: "Santa Cruz" },
    { "@type": "City", name: "Peralillo" },
    { "@type": "City", name: "Palmilla" },
    { "@type": "City", name: "Nancagua" },
  ],
  servesCuisine: "Frutos secos y snacks naturales",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <WhatsAppFloat />
        <AnalyticsScripts />
        <ConsentBanner />
      </body>
    </html>
  );
}
