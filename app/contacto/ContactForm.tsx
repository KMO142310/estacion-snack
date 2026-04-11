"use client";

import { useState } from "react";
import { submitContact } from "./actions";

type Step = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }));
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const errors = {
    name: touched.name && !fields.name.trim() ? "Requerido" : "",
    email: touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ? "Email inválido" : "",
    message: touched.message && !fields.message.trim() ? "Requerido" : "",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (errors.name || errors.email || errors.message) return;

    setStep("loading");
    const result = await submitContact(fields);
    if (result.ok) {
      setStep("success");
    } else {
      setErrorMsg(result.error ?? "Ocurrió un error. Intentá de nuevo.");
      setStep("error");
    }
  };

  if (step === "success") {
    return (
      <div
        style={{
          padding: 32,
          background: "var(--green-soft)",
          borderRadius: "var(--r-lg)",
          textAlign: "center",
        }}
        role="status"
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🌰</div>
        <h3 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
          Mensaje enviado
        </h3>
        <p style={{ fontSize: 15, color: "var(--sub)" }}>
          Gracias, {fields.name.split(" ")[0]}. Te respondemos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Nombre */}
      <div>
        <label htmlFor="contact-name" style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 6 }}>
          Nombre <span aria-hidden>*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          required
          autoComplete="name"
          value={fields.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => touch("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
          placeholder="Tu nombre"
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: `2px solid ${errors.name ? "var(--red)" : "rgba(0,0,0,.12)"}`,
            borderRadius: 10,
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            boxSizing: "border-box",
          }}
        />
        {errors.name && <p id="err-name" role="alert" style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 6 }}>
          Email <span aria-hidden>*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          value={fields.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => touch("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          placeholder="tu@email.com"
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: `2px solid ${errors.email ? "var(--red)" : "rgba(0,0,0,.12)"}`,
            borderRadius: 10,
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            boxSizing: "border-box",
          }}
        />
        {errors.email && <p id="err-email" role="alert" style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.email}</p>}
      </div>

      {/* Teléfono (opcional) */}
      <div>
        <label htmlFor="contact-phone" style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 6 }}>
          Teléfono <span style={{ fontWeight: 400, textTransform: "none" }}>(opcional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+56 9 XXXX XXXX"
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: "2px solid rgba(0,0,0,.12)",
            borderRadius: 10,
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="contact-message" style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--sub)", marginBottom: 6 }}>
          Mensaje <span aria-hidden>*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => touch("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          placeholder="¿En qué te podemos ayudar?"
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: `2px solid ${errors.message ? "var(--red)" : "rgba(0,0,0,.12)"}`,
            borderRadius: 10,
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
        {errors.message && <p id="err-message" role="alert" style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{errors.message}</p>}
      </div>

      {step === "error" && (
        <p role="alert" style={{ fontSize: 14, color: "var(--red)", padding: "10px 14px", background: "rgba(217,75,75,.08)", borderRadius: 8 }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={step === "loading"}
        style={{
          padding: "14px 28px",
          fontSize: 15,
          fontWeight: 800,
          borderRadius: 12,
          background: "var(--text)",
          color: "#fff",
          border: "none",
          cursor: step === "loading" ? "not-allowed" : "pointer",
          opacity: step === "loading" ? 0.7 : 1,
        }}
      >
        {step === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
