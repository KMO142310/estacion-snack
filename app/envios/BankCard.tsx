"use client";

import { useState } from "react";
import { BANK_INFO } from "@/lib/business-info";

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copiar ${value}`}
      style={{
        marginLeft: 8,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 6,
        border: "1.5px solid rgba(0,0,0,.12)",
        background: copied ? "var(--green-soft)" : "transparent",
        color: copied ? "var(--green)" : "var(--sub)",
        cursor: "pointer",
        transition: "all .15s",
        flexShrink: 0,
      }}
    >
      {copied ? "¡Copiado!" : "Copiar"}
    </button>
  );
}

const ROWS: Array<{ label: string; value: string }> = [
  { label: "Banco",       value: BANK_INFO.bank },
  { label: "Tipo",        value: BANK_INFO.accountType },
  { label: "N° de cuenta", value: BANK_INFO.accountNumber },
  { label: "RUT",         value: BANK_INFO.rut },
  { label: "Nombre",      value: BANK_INFO.holder },
  { label: "Email",       value: BANK_INFO.email },
];

export default function BankCard() {
  return (
    <div style={{ padding: 24, background: "var(--orange-soft)", borderRadius: "var(--r)", marginBottom: 0 }}>
      <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Datos para transferencia</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ROWS.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
            <span style={{ color: "var(--sub)", minWidth: 130, flexShrink: 0 }}>{label}:</span>
            <strong style={{ flex: 1 }}>{value}</strong>
            <CopyBtn value={value} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 16 }}>
        Envía el comprobante por WhatsApp para confirmar el pedido.
      </p>
    </div>
  );
}
