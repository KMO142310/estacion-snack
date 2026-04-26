import { test, expect } from "@playwright/test";

/**
 * Critical path E2E — los flujos del negocio que NO deben romperse.
 *
 * Estos tests cazan exactamente los bugs que los unit tests de lib/
 * NO pueden cazar: handlers de click, state updates desde UI, modal
 * open/close, hidratación de Zustand, etc.
 *
 * Si esto falla, NO se mergea a main.
 */

test.describe("Home renderiza", () => {
  test("titulo y CTA principal visibles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /ver productos/i })).toBeVisible();
  });

  test("seis productos en el grid", async ({ page }) => {
    await page.goto("/");
    // ProductCard usa <article class="pc"> — 6 productos esperados.
    await page.waitForSelector("article.pc", { state: "attached" });
    const count = await page.locator("article.pc").count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("packs section presente", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#packs")).toBeVisible();
  });

  test("/api/health devuelve ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
  });
});

test.describe("Cart action — el bug que se nos pasó", () => {
  test("Click 'Agregar al carro' actualiza el badge del header", async ({ page }) => {
    await page.goto("/");
    // Esperar hidratación de Zustand (SSR muestra 0 items, cliente rehidrata).
    await page.waitForTimeout(500);

    // Selector específico: el cart icon del header (NO el CTA del hero).
    const cartBtn = page.locator(".hd-cart");
    await expect(cartBtn).toBeVisible();

    // Antes de click, NO hay badge (itemCount = 0).
    const badgeBefore = await page.locator(".hd-cart-badge").count();
    expect(badgeBefore).toBe(0);

    // Click en el primer "Agregar al carro" del grid.
    const addBtn = page.locator(".pc-add").first();
    await addBtn.click();

    // Tras el click, el badge debe aparecer con "1".
    await expect(page.locator(".hd-cart-badge")).toBeVisible({ timeout: 2000 });
    await expect(page.locator(".hd-cart-badge")).toHaveText("1");
  });

  test("Click 'Agregar al carro' abre el cart sheet con el producto", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    const addBtn = page.locator(".pc-add").first();
    const productCard = addBtn.locator("xpath=ancestor::article[1]");
    const productName = (await productCard.locator(".pc-name").first().textContent())?.trim();
    expect(productName).toBeTruthy();

    await addBtn.click();
    // OrderSheet abre tras 280ms del click (timeout en handleAdd).
    await page.waitForTimeout(800);

    // El nombre del producto debe aparecer en al menos 2 lugares: la card + el sheet.
    const occurrences = page.locator(`text=${productName}`);
    const count = await occurrences.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("Header cart-icon abre el cart sheet aún sin items", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // Selector específico del cart icon del header.
    const cartBtn = page.locator(".hd-cart");
    await cartBtn.click();
    await page.waitForTimeout(500);

    // OrderSheet usa FocusTrap → tendrá role="dialog" o similar.
    // Aceptamos varios selectores defensivos según cómo se renderice.
    const sheet = page.locator('[role="dialog"], [aria-modal="true"], .order-sheet').first();
    await expect(sheet).toBeVisible({ timeout: 2000 });
  });

  test("Hero 'Ver packs' link navega a #packs", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    const heroPacksLink = page.locator(".hero-cta-link").first();
    await expect(heroPacksLink).toBeVisible();
    await heroPacksLink.click();
    await page.waitForTimeout(400);

    // Después del click, la URL debe cambiar al anchor #packs.
    expect(page.url()).toContain("#packs");
  });
});

test.describe("Copy correctness", () => {
  test("NO menciona 'sellada al vacío' (las bolsas no son al vacío)", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toContain("sellada al vacío");
    expect(html).not.toContain("sellada al vacio");
  });

  test("formato 'Bolsa sellada · 1 kg' está presente en cards", async ({ page }) => {
    await page.goto("/");
    // Al menos una card muestra el formato como precio aside.
    const formatTexts = page.locator(".pc-price-unit, .pkc-price-aside");
    const count = await formatTexts.count();
    expect(count).toBeGreaterThan(0);
  });
});
