import { NextResponse, type NextRequest } from "next/server";

/**
 * CSP nonce-based middleware.
 *
 * Genera un nonce criptográfico por request y lo inyecta en el header CSP
 * y en un header auxiliar que los Server Components leen para renderizar
 * <Script nonce={...}> y <style nonce={...}>.
 *
 * Política:
 *  - default-src 'self' — nada externo por default.
 *  - script-src 'self' 'nonce-...' https://www.googletagmanager.com https://connect.facebook.net
 *    'strict-dynamic' permite que scripts cargados con nonce puedan cargar otros (GA4, Pixel).
 *  - style-src 'self' 'unsafe-inline' — Next.js inyecta estilos inline en SSR,
 *    'unsafe-inline' es el trade-off aceptado. CSS está bajo nuestro control.
 *  - img-src — propios + data URIs (next/image placeholders) + Supabase storage + dominios de tracking.
 *  - connect-src — Supabase + dominios de tracking + Vercel Analytics.
 *  - frame-ancestors 'none' — clickjacking (duplica X-Frame-Options: DENY).
 *  - form-action 'self' https://wa.me — permite el submit al deep-link de WhatsApp.
 *  - base-uri 'self' — prohíbe <base> malicioso.
 *  - report-uri /api/csp-report — violaciones quedan en audit_log.
 *
 * Refs: CSP Level 3, W3C WebAppSec, OWASP Secure Headers.
 *       https://content-security-policy.com/examples/nextjs/
 */

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== "production";

  // En dev, Next.js inyecta scripts con eval (HMR). En prod quitamos 'unsafe-eval'.
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://va.vercel-scripts.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://va.vercel-scripts.com`;

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: *.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com`,
    `font-src 'self' data:`,
    `connect-src 'self' *.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://vitals.vercel-insights.com https://va.vercel-scripts.com`,
    `frame-ancestors 'none'`,
    `form-action 'self' https://wa.me`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  // CSP en MODO REPORT-ONLY — el navegador loguea violaciones a /api/csp-report
  // pero NO bloquea. Razón: 'strict-dynamic' requiere que Next.js propague el
  // nonce a sus chunks dinámicos, y eso no funciona out-of-the-box en Next 16.
  // Sin esto, el middleware bloquea TODOS los chunks de Next y la página no
  // hidrata — lo que rompía Zustand, Add-to-cart, OrderSheet, etc.
  // TODO: integrar nonce con next/script + cookies()/headers() en Server Components,
  // luego promover de Report-Only a enforced.
  response.headers.set("content-security-policy-report-only", csp);
  return response;
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas HTML, excluir static assets, imágenes, favicon,
    // rutas API (manejan sus propios headers), y admin (tiene noindex).
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|jpg|jpeg|png|webp|avif|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
