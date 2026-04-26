import type { ToolDef } from "./types";
import { COMUNAS } from "@/lib/shipping";

/**
 * Definiciones de los tools que Claude puede llamar.
 *
 * Filosofía:
 * - Tools de LECTURA son admin_only=false (ambos contextos los usan, con
 *   filtros distintos en el executor — admin ve todo, customer solo lo suyo).
 * - Tools de MUTACIÓN son admin_only=true Y requires_confirmation=true.
 * - JSON schema es estricto. Argumentos opcionales con `default` documentado.
 *
 * Validación de args con Zod en executors.ts (defense in depth).
 */

export const TOOLS: ToolDef[] = [
  // ─── LECTURA ───
  {
    name: "list_orders",
    description:
      "Lista las últimas órdenes con filtros opcionales. Solo admin puede usar sin filtro de phone (cliente debe pasar su propio phone).",
    admin_only: true,
    input_schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["pending_whatsapp", "confirmed", "preparing", "delivered", "cancelled"],
          description: "Filtrar por status. Omitir = todas.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Cuántas órdenes traer. Default 10, máx 50.",
        },
        since_days: {
          type: "integer",
          minimum: 1,
          maximum: 90,
          description: "Solo órdenes de los últimos N días. Default 30.",
        },
      },
    },
  },
  {
    name: "get_order_details",
    description:
      "Detalles de un pedido: items, total, comuna, status, customer. Para admin: cualquier order_id. Para cliente: requiere access_token + phone propio.",
    admin_only: false,
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "UUID del pedido. Acepta forma corta de 8 caracteres (ej: a1b2c3d4).",
        },
        access_token: {
          type: "string",
          description: "Token del pedido (requerido para clientes, opcional para admin).",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "find_customer_by_phone",
    description:
      "Busca un cliente por teléfono y lista sus pedidos. Admin: cualquier phone. Cliente: solo su propio phone.",
    admin_only: false,
    input_schema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description:
            "Teléfono en formato chileno: solo dígitos con código país (56987654321) o con +56 / espacios — el executor normaliza.",
        },
      },
      required: ["phone"],
    },
  },

  // ─── MUTACIONES (admin only, confirm-gated) ───
  {
    name: "update_order_status",
    description:
      "Cambia el status de una orden. PRIMERA invocación con confirmed=false → muestra chip de confirmación. SEGUNDA con confirmed=true → ejecuta.",
    admin_only: true,
    requires_confirmation: true,
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "UUID del pedido.",
        },
        new_status: {
          type: "string",
          enum: ["confirmed", "preparing", "delivered", "cancelled"],
          description: "Nuevo status.",
        },
        confirmed: {
          type: "boolean",
          description:
            "Si true, ejecuta. Si false (default), responde con PENDING_CONFIRMATION para que la UI muestre el chip.",
        },
      },
      required: ["order_id", "new_status"],
    },
  },
  {
    name: "update_product_stock",
    description:
      "Actualiza el stock_kg de un producto. PRIMERA con confirmed=false → chip. SEGUNDA con confirmed=true → ejecuta.",
    admin_only: true,
    requires_confirmation: true,
    input_schema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Slug del producto (ej: 'mix-europeo', 'almendra-entera').",
        },
        new_stock_kg: {
          type: "number",
          minimum: 0,
          maximum: 999,
          description: "Nuevo stock en kg.",
        },
        confirmed: {
          type: "boolean",
          description: "Si true, ejecuta. Si false, responde PENDING_CONFIRMATION.",
        },
      },
      required: ["slug", "new_stock_kg"],
    },
  },

  // ─── EFECTOS LATERALES (sin confirmación, son utilities) ───
  {
    name: "build_whatsapp_order_message",
    description:
      "Construye una URL wa.me con el mensaje de pedido pre-armado para que el cliente lo envíe al operador. NO envía nada solo, solo genera la URL.",
    admin_only: false,
    input_schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              slug: { type: "string", description: "Slug del producto." },
              bags: { type: "integer", minimum: 1, description: "Cantidad de bolsas." },
            },
            required: ["slug", "bags"],
          },
          description: "Items del pedido.",
        },
        comuna: {
          type: "string",
          enum: COMUNAS as unknown as string[],
          description: "Comuna de entrega.",
        },
        customer_name: {
          type: "string",
          description: "Nombre del cliente.",
        },
        address_or_reference: {
          type: "string",
          description: "Dirección o punto de referencia. Solo si comuna != 'Retiro en local'.",
        },
        note: {
          type: "string",
          description: "Nota libre opcional.",
        },
      },
      required: ["items", "comuna", "customer_name"],
    },
  },
  {
    name: "notify_owner_whatsapp",
    description:
      "Genera URL wa.me hacia el WhatsApp personal del operador (Omar) con un resumen del pedido. Para que el operador la abra y vea/reenvíe el pedido. Admin only.",
    admin_only: true,
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "UUID del pedido a notificar.",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "generate_confirmation_image",
    description:
      "Devuelve la URL de una imagen OG con 'Gracias <nombre>' + items + total para enviarle al cliente como link en WhatsApp (genera preview).",
    admin_only: true,
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "UUID del pedido.",
        },
      },
      required: ["order_id"],
    },
  },
];

/** Filter de tools según contexto del actor. */
export function toolsForActor(actor: { kind: "admin" | "customer" }): ToolDef[] {
  if (actor.kind === "admin") return TOOLS;
  return TOOLS.filter((t) => !t.admin_only);
}
