import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { safeEqual } from "@/lib/crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Default-deny: if the secret is not configured, FAIL LOUD. Never accept
  // requests when misconfigured — that would be default-allow.
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length === 0) {
    console.error("[cron:release-reservations] CRON_SECRET not configured");
    return NextResponse.json(
      { ok: false, error: "server misconfiguration" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Constant-time compare against `Bearer <secret>` to avoid timing leaks.
  if (!safeEqual(authHeader, `Bearer ${secret}`)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.rpc("fn_release_expired_reservations");
    if (error) {
      console.error("[cron:release-reservations] rpc error", error.message);
      return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
    }
    // Response body is deliberately minimal — no timestamps, no reservation
    // details, nothing that helps an attacker who has the secret map state.
    return NextResponse.json({ ok: true, released: (data as number) ?? 0 });
  } catch (e) {
    console.error("[cron:release-reservations] exception", e);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
