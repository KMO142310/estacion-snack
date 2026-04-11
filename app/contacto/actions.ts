"use server";

import { createClient } from "@/lib/supabase/server";
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

  // Persist to Supabase (table created in migration 0004)
  try {
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() || null,
        message: payload.message.trim(),
      });

    if (dbError) {
      console.error("[contact] db insert error:", dbError.message);
      // Don't fail the user experience — still try to send email
    }
  } catch (e) {
    console.error("[contact] db error:", e);
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
