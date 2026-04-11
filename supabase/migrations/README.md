# Supabase Migrations

Todas las migrations están en este directorio, numeradas y ordenadas. **Nunca edites una migration ya aplicada** — creá una nueva con el número siguiente.

## Cómo correr una migration

### Opción A — Supabase Dashboard (recomendada para prod)

1. Abre [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor**
2. Copia el contenido del archivo `.sql`
3. Pega y ejecuta
4. Verificá que no haya errores en el output

### Opción B — Supabase CLI (local / CI)

```bash
supabase db push
```

O para correr una migration específica:

```bash
supabase migration up --version 0005
```

---

## Estado de cada migration

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `0001_init.sql` | Schema base: products, orders, customers, stock_reservations, RPCs fn_reserve_stock y fn_place_order | ✅ Aplicada en prod |
| `0002_rls_hardening.sql` | RLS default-deny en todas las tablas, append-only audit_log, access_token en orders, search_path fijado | ✅ Aplicada en prod |
| `0003_product_details.sql` | Columnas long_description, nutrition_json, allergens en products | ✅ Aplicada en prod |
| `0004_contact_shipping.sql` | Tabla contact_messages + tabla shipping_zones con seed O'Higgins | ⚠️ **Pendiente** — correr en prod |
| `0005_combos_and_shipping_visible.sql` | Tabla combos + combo_items + seed 3 packs + columna is_visible en shipping_zones | ⚠️ **Pendiente** — correr después de 0004 |

> **Orden**: las migrations deben correrse en orden numérico. No saltes ninguna.

---

## Rollback

No hay rollback automático. Para revertir, creá una migration `000N_rollback_descripcion.sql` con los `DROP TABLE` / `ALTER TABLE ... DROP COLUMN` correspondientes.
