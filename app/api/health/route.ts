import { NextResponse } from "next/server";

/**
 * Health check endpoint.
 *
 * Devuelve JSON con checks individuales + status global. Sirve para:
 *   - Uptime monitors externos (UptimeRobot, Better Stack).
 *   - Smoke test post-deploy.
 *   - Debug rápido: ¿están todas las env vars críticas presentes?
 *
 * NO hace ping a la DB — eso requeriría credenciales y podría ser costoso
 * si se llama con alta frecuencia. El DB ping se puede agregar detrás de
 * un Bearer si se necesita (ver /api/cron/release-reservations como patrón).
 *
 * Contrato:
 *   GET /api/health
 *   Response 200 { status: "ok", checks: [...], commit: ..., at: ... }
 *   Response 503 cuando algún check crítico falla.
 */

type Check = {
  name: string;
  critical: boolean;
  ok: boolean;
  detail?: string;
};

function checkEnv(name: string, critical = true): Check {
  const value = process.env[name];
  return {
    name: `env:${name}`,
    critical,
    ok: typeof value === "string" && value.length > 0,
    detail: value ? undefined : "unset",
  };
}

export async function GET() {
  const checks: Check[] = [
    checkEnv("NEXT_PUBLIC_SUPABASE_URL"),
    checkEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    checkEnv("NEXT_PUBLIC_SITE_URL"),
    checkEnv("ADMIN_EMAIL"),
    checkEnv("CRON_SECRET"),
    checkEnv("AUDIT_PEPPER"),
    checkEnv("RESEND_API_KEY", false), // opcional
    checkEnv("NEXT_PUBLIC_GA4_ID", false), // opcional
    checkEnv("NEXT_PUBLIC_META_PIXEL_ID", false), // opcional
  ];

  const criticalFailures = checks.filter((c) => c.critical && !c.ok);
  const status = criticalFailures.length === 0 ? "ok" : "degraded";
  const httpStatus = criticalFailures.length === 0 ? 200 : 503;

  return NextResponse.json(
    {
      status,
      at: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      region: process.env.VERCEL_REGION ?? "local",
      runtime: "nodejs",
      checks,
    },
    {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}

export const dynamic = "force-dynamic";
