"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/productos` },
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFDF9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Outfit', system-ui, sans-serif",
      padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, marginBottom: 8 }}>
            Estación Snack
          </h1>
          <p style={{ fontSize: 14, color: "#5F5A52" }}>Panel de administración</p>
        </div>

        {sent ? (
          <div style={{ background: "#EDF7EC", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Revisa tu email</p>
            <p style={{ fontSize: 13, color: "#5F5A52" }}>
              Enviamos un link mágico a <strong>{email}</strong>.<br />
              Haz clic en el link para entrar al panel.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#5F5A52", display: "block", marginBottom: 6 }}>
                Email de administrador
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(0,0,0,.03)",
                  border: "2px solid rgba(0,0,0,.08)",
                  borderRadius: 12,
                  fontSize: 15,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
            {error && (
              <p style={{ fontSize: 13, color: "#D94B4B", background: "#FFECEC", padding: "10px 14px", borderRadius: 10 }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px 24px",
                background: "#1A1816",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 12,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Enviando…" : "Enviar link mágico"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
