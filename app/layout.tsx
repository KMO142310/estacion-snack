import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { safeJsonLd } from "@/lib/json-ld";
import { absoluteUrl, INSTAGRAM_URL, SERVICE_AREAS, SITE_URL, WHATSAPP_PHONE } from "@/lib/site";
import OrderConfirmation from "@/components/OrderConfirmation";
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

export const metadata: Metadata = {
  title: {
    default: "Estación Snack — Frutos secos por kilo · Santa Cruz",
    template: "%s · Estación Snack",
  },
  description:
    "Frutos secos y dulces del Valle de Colchagua, vendidos por kilo. Despacho martes a sábado en Santa Cruz, Palmilla, Peralillo y Marchigüe.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
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
    url: SITE_URL,
    siteName: "Estación Snack",
    images: [{ url: absoluteUrl("/og-image.jpg"), width: 1200, height: 630, alt: "Estación Snack — Frutos secos por kilo" }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estación Snack — Frutos secos por kilo",
    description: "Frutos secos del Valle de Colchagua, vendidos por kilo.",
    images: [absoluteUrl("/opengraph-image")],
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

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Estación Snack",
  url: SITE_URL,
  inLanguage: "es-CL",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Estación Snack",
  url: SITE_URL,
  logo: absoluteUrl("/apple-touch-icon.png"),
  image: absoluteUrl("/og-image.jpg"),
  sameAs: [INSTAGRAM_URL],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: WHATSAPP_PHONE,
      contactType: "customer service",
      areaServed: "CL",
      availableLanguage: "es",
    },
  ],
  areaServed: SERVICE_AREAS.map((name) => ({
    "@type": "City",
    name,
  })),
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        {children}
        <OrderConfirmation />
      </body>
    </html>
  );
}
