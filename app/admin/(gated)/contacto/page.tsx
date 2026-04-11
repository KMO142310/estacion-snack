import { adminListContactMessages } from "@/lib/supabase/admin";

export const revalidate = 0;

function fmt(iso: string) {
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function ContactoPage() {
  const messages = await adminListContactMessages();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>
          Mensajes de contacto
        </h1>
        <p style={{ fontSize: 14, color: "#5F5A52" }}>
          {messages.length} mensaje{messages.length !== 1 ? "s" : ""}. Solo lectura.
          {messages.length === 0 && " (Requiere migration 0004 aplicada en Supabase)"}
        </p>
      </div>

      {messages.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid rgba(0,0,0,.06)", padding: 48, textAlign: "center" }}>
          <p style={{ fontWeight: 700 }}>Sin mensajes aún</p>
          <p style={{ fontSize: 13, color: "#5F5A52", marginTop: 4 }}>Cuando alguien use el formulario de contacto, aparecerá aquí.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: `1.5px solid ${msg.read ? "rgba(0,0,0,.06)" : "var(--orange)"}`,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{msg.name}</span>
                  {!msg.read && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: "2px 8px", background: "#FFF3E0", color: "var(--orange)", borderRadius: 6, textTransform: "uppercase" }}>
                      Nuevo
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#5F5A52" }}>{fmt(msg.created_at)}</span>
              </div>
              <div style={{ fontSize: 13, color: "#5F5A52", marginBottom: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>✉️ <a href={`mailto:${msg.email}`} style={{ color: "inherit" }}>{msg.email}</a></span>
                {msg.phone && <span>📱 {msg.phone}</span>}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
