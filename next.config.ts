import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Security headers globales — HSTS, nosniff, clickjacking, permissions.
        // Ref: OWASP Secure Headers Project, MDN Headers.
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        // Cache-Control largo para rutas estáticas (home + productos + páginas legales).
        // Excluye /api, /admin, /pedido (tienen sus propios headers específicos).
        // Ref: Vercel Edge Caching docs.
        source: "/((?!api|admin|pedido|_next).*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        // /pedido/[id] carries an access_token in the query string. Harden
        // the response so the token does not leak via Referer, does not
        // get cached by proxies or the browser back/forward cache, and
        // the page is not indexed by search engines.
        // Ref: SECURITY_AUDIT.md H2, OWASP ASVS §3.4, Barth/Jackson/Mitchell 2008.
        source: "/pedido/:id",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, must-revalidate",
          },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
