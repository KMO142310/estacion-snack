"use server";

import { adminInsertContactMessage } from "@/lib/supabase/admin";
import { Resend } from "resend";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function submitContact(
  payload: ContactPayload
): Promise<{ ok: boolean; error?: string }> {
  // Validate required fields
  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { ok: false, error: "Nombre, email y mensaje son obligatorios." };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "El email no tiene un formato válido." };
  }

  // Persist to Supabase via admin wrapper (service role, bypassea RLS).
  // RLS de contact_messages no tiene policy anon insert — ver Security audit 2026-04-13.
  const dbResult = await adminInsertContactMessage({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
  });
  if (!dbResult.ok) {
    console.error("[contact] db insert error:", dbResult.error);
    // Don't fail the user experience — still try to send email
  }

  // Send email notification via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (resendKey && adminEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Estación Snack <notificaciones@estacionsnack.cl>",
        to: adminEmail,
        replyTo: payload.email,
        subject: `Nuevo mensaje de ${payload.name}`,
        text: [
          `Nombre: ${payload.name}`,
          `Email: ${payload.email}`,
          payload.phone ? `Teléfono: ${payload.phone}` : "",
          "",
          `Mensaje:`,
          payload.message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (e) {
      // Email failure is non-fatal — message already saved to DB
      console.error("[contact] resend error:", e);
    }
  }

  return { ok: true };
}
