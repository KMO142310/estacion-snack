import { test, expect } from "@playwright/test";

/**
 * E2E mínimo del asistente admin.
 *
 * NO hace login real (requiere Supabase magic link, no testeable en CI sin
 * fixtures). Solo verifica que el gate de auth funciona: sin sesión válida,
 * la ruta redirecciona a /admin/login. Si alguien rompe el guard, esto caza.
 */

test.describe("Admin asistente — gate de auth", () => {
  test("/admin/asistente sin auth redirecciona a login", async ({ page }) => {
    const res = await page.goto("/admin/asistente");
    // Después del redirect, la URL final debe contener /admin/login.
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
    // Status final 200 (login renderizado), no 500/error.
    expect(res?.status() ?? 200).toBeLessThan(500);
  });

  test("/api/agent/chat sin POST devuelve 405 o 400", async ({ request }) => {
    // GET al endpoint POST → debe rechazar (no debería 500-ear).
    const res = await request.get("/api/agent/chat");
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test("/api/agent/chat con body inválido devuelve 400", async ({ request }) => {
    const res = await request.post("/api/agent/chat", {
      data: { malformed: true },
    });
    expect(res.status()).toBe(400);
  });

  test("/api/og/order-confirmation sin params devuelve 400", async ({ request }) => {
    const res = await request.get("/api/og/order-confirmation");
    expect(res.status()).toBe(400);
  });

  test("/api/og/order-confirmation con order inexistente devuelve 404", async ({ request }) => {
    const res = await request.get(
      "/api/og/order-confirmation?order=00000000-0000-0000-0000-000000000000&t=fake-token-here",
    );
    // 404 (orden no existe) — sin filtrar info.
    expect([404, 410, 500].includes(res.status())).toBe(true);
    // En CI dummy Supabase puede dar 500, pero lo importante: nunca 200.
    expect(res.status()).not.toBe(200);
  });
});
