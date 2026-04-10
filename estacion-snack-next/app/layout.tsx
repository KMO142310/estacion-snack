import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
