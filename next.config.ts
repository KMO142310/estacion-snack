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
