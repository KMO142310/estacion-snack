import { createClient } from "@/lib/supabase/server";

/**
 * Gate for any admin-only server operation. Reads the session from cookies
 * (anon client with user JWT), checks that the user exists and that their
 * email matches ADMIN_EMAIL. Throws "No autorizado" on failure.
 *
 * This is temporary until Bloque 6 replaces the env-var check with a real
 * `admins` table in Supabase. Until then, ADMIN_EMAIL is the single source
 * of truth for who can touch the admin surface.
 *
 * DO NOT use this to gate the /pedido/[id] public route — that route is
 * accessed by customers without auth, gated by an access_token query param
 * instead. See lib/supabase/admin.ts:adminGetOrderByIdPublic for that flow.
 */
export async function assertAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("No autorizado");
  }
}
