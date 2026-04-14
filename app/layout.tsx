import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import ConsentBanner from "@/components/ConsentBanner";
import { safeJsonLd } from "@/lib/json-ld";
import "./globals.css";

// Fraunces como variable font — sin array de weight, habilita todo el rango 100-900
// y ahorra ~100-150 KB en fonts. Ref: Next.js next/font + web.dev font best practices.
const fraunces = Fraunces({
  subsets: ["latin"],
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
    "Frutos secos y dulces del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado en Marchigüe, Peralillo, Santa Cruz y Cunaco.",
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
    images: ["/opengraph-image"],
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
  "@type": "Store",
  "@id": `${SITE}/#business`,
  name: "Estación Snack",
  description:
    "Frutos secos y dulces del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado en Marchigüe, Peralillo, Santa Cruz y Cunaco.",
  url: SITE,
  image: `${SITE}/opengraph-image`,
  telephone: "+56953743338",
  priceRange: "$$",
  currenciesAccepted: "CLP",
  paymentAccepted: ["Transferencia bancaria", "Efectivo"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Santa Cruz centro",
    addressLocality: "Santa Cruz",
    addressRegion: "Región de O'Higgins",
    postalCode: "3130000",
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.641,
    longitude: -71.365,
  },
  areaServed: [
    { "@type": "City", name: "Marchigüe" },
    { "@type": "City", name: "Peralillo" },
    { "@type": "City", name: "Santa Cruz" },
    { "@type": "City", name: "Cunaco" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "19:30",
      closes: "21:00",
    },
  ],
  servesCuisine: "Frutos secos y snacks naturales",
  sameAs: ["https://instagram.com/estacionsnack.sc"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CL"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgJsonLd) }}
        />
        {children}
        <AnalyticsScripts />
        <ConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
