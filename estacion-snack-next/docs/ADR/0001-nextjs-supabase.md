# ADR 0001 — Next.js + Supabase como stack base

**Fecha:** 2026-04-10  
**Estado:** Aceptado

## Contexto

Estación Snack necesita:
- Catálogo con stock en tiempo real
- Carrito que descuente stock antes de que el cliente envíe el pedido por WhatsApp
- Panel de administración para gestionar stock y ver pedidos
- Presupuesto inicial bajo (~$120.000 CLP)
- Sin equipo técnico dedicado — la dueña opera el negocio sola

Se evaluaron tres opciones:

| Opción | Pros | Contras |
|--------|------|---------|
| **HTML estático + sheets** | Cero costo, cero ops | Sin stock en tiempo real; riesgo de vender lo que no hay |
| **Next.js + Supabase** | Full-stack, auth gratis, DB gestionada, plan free generoso | Más complejidad inicial |
| **Shopify** | Todo integrado | $29 USD/mes mínimo; no se adapta a venta por kilo/granel |

## Decisión

**Next.js 16 (App Router) + Supabase (PostgreSQL + Auth + Storage)**, desplegado en Vercel.

## Consecuencias

**Positivas:**
- Stock real en DB → no se vende lo que no hay
- Transacción atómica (`fn_place_order`) previene overselling en concurrencia
- Supabase Auth con magic link = admin panel sin contraseñas
- Vercel free tier cubre el tráfico esperado (negocio local, ~50-200 visitas/día)
- Código TypeScript → mantenible a largo plazo

**Negativas / riesgos:**
- Requiere crear y mantener un proyecto Supabase (bootstrapping manual una vez)
- Supabase free tier pausa proyectos inactivos >1 semana (solución: plan $25/mes cuando escale)
- Más complejo que el HTML actual → requiere entender el stack para hacer cambios grandes

## Alternativas descartadas

- **PlanetScale / Turso:** sin Auth incluido, necesita más configuración
- **Firebase:** más caro en lecturas frecuentes; query model no relacional
- **Prisma + NeonDB:** buena opción, pero Supabase ofrece storage + auth en un solo servicio
