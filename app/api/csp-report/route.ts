import { NextResponse } from "next/server";

/**
 * Endpoint que recibe violaciones de CSP enviadas por el navegador vía
 * `report-uri` en el header Content-Security-Policy (middleware.ts).
 *
 * Contrato (CSP 2 report-uri payload):
 *   POST /api/csp-report
 *   Content-Type: application/csp-report
 *   Body: { "csp-report": { "blocked-uri": ..., "violated-directive": ..., ... } }
 *
 * Este endpoint no valida autenticación — cualquiera puede postear un report.
 * Eso es lo esperado (el navegador es el cliente). Para evitar abuso:
 * - Respondemos 204 sin info.
 * - Truncamos logs (solo campos clave).
 * - No escribimos a la DB desde aquí (evita write-amplification bajo ataque).
 *   Si se quiere persistir, agregar rate-limit + batch flush a audit_log.
 *
 * Ref: CSP Level 3 — https://www.w3.org/TR/CSP3/#violation-report
 */
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    // El body puede venir como JSON directo o como { "csp-report": {...} }.
    let report: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(raw);
      report = (parsed["csp-report"] ?? parsed) as Record<string, unknown>;
    } catch {
      // No-op: body malformado, ignorar.
      return new NextResponse(null, { status: 204 });
    }

    // Solo campos útiles, evita PII y tamaño excesivo.
    const summary = {
      blocked: report["blocked-uri"],
      directive: report["violated-directive"] ?? report["effective-directive"],
      doc: report["document-uri"],
      script_sample: typeof report["script-sample"] === "string"
        ? (report["script-sample"] as string).slice(0, 120)
        : undefined,
      ua: req.headers.get("user-agent")?.slice(0, 120),
    };

    console.warn("[csp-violation]", JSON.stringify(summary));
  } catch (err) {
    console.error("[csp-report] parse error", err);
  }

  return new NextResponse(null, { status: 204 });
}

// CSP también puede usar report-to (nuevo mecanismo) que envía con method POST
// y Content-Type application/reports+json. Lo aceptamos también.
export const dynamic = "force-dynamic";
