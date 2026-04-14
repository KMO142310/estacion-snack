import type { Metadata } from "next";

// noindex en TODO el panel admin — no debe aparecer en Google.
// Aplica a /admin, /admin/login, /admin/logout, y todas las rutas (gated).
// Fuente: https://developers.google.com/search/docs/crawling-indexing/block-indexing
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
