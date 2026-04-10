import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel Cron automatically sets the Authorization header:
  //   Authorization: Bearer ${CRON_SECRET}
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.rpc("fn_release_expired_reservations");
    if (error) {
      console.error("[cron:release-reservations] rpc error", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    console.log("[cron:release-reservations] released", data ?? 0, "reservations");
    return NextResponse.json({ ok: true, released: data ?? 0, at: new Date().toISOString() });
  } catch (e) {
    console.error("[cron:release-reservations] exception", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
