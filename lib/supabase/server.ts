import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Anon server client for Next.js server components / server actions / route
 * handlers. Respects RLS because it authenticates as the anon role (or as
 * the logged-in user via cookies if the user has a session).
 *
 * For any operation that needs to bypass RLS (admin ops, reading fresh
 * orders for the /pedido/[id] route, audit writes), use a named function
 * from `lib/supabase/admin.ts`. The raw service_role client lives there
 * and ONLY there — enforced by `.claude/hooks/pre-commit-guard.sh`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server component — cookies are read-only in some contexts
          }
        },
      },
    },
  );
}
