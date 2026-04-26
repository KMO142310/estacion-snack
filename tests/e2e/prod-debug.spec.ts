import { test } from "@playwright/test";

test("debug PROD: errores client-side", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.stack || err.message}`));

  await page.goto("https://www.estacionsnack.cl/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const titleText = await page.locator("h1, h2").first().textContent();
  const hasErrorPage = await page.locator("text=Algo se nos quemó").count();
  const hasErrorBoundary = await page.locator("text=Algo falló").count();

  console.log("=== PROD DEBUG ===");
  console.log("First heading:", titleText);
  console.log("Error page visible:", hasErrorPage);
  console.log("Error boundary visible:", hasErrorBoundary);
  console.log("\nRuntime errors:");
  errors.forEach(e => console.log(e));
});
