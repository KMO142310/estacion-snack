# Cutover de dominio — estacionsnack.cl

Este documento describe los pasos para migrar el dominio `www.estacionsnack.cl`
al proyecto Next.js (`estacion-snack`). Ejecutar solo cuando la tienda esté
completamente validada en preview y el operador haya dado el OK.

---

## Pre-condiciones

Antes de ejecutar el cutover:

1. La app en `https://estacion-snack.vercel.app/` pasa el checklist manual:
   - Catálogo carga productos reales desde Supabase (no el seed estático)
   - Flujo completo: agregar al carrito → formulario → "Enviar por WhatsApp" abre WA con el mensaje correcto
   - Página `/pedido/[id]?t=...` muestra el pedido con estado correcto
   - `/admin` redirige a `/admin/login` si el email no es el admin configurado
   - El cron `/api/cron/release-reservations` responde 200 con el header correcto

2. La migration `0003_product_details.sql` fue ejecutada en el SQL Editor de Supabase.

3. `NEXT_PUBLIC_SITE_URL` está seteado en Vercel → Settings → Environment Variables
   (valor: `https://estacionsnack.cl` o `https://www.estacionsnack.cl` — elegir una y ser consistente).

---

## Paso 1 — Agregar el dominio al proyecto Next.js en Vercel

1. Ir a https://vercel.com/dashboard
2. Seleccionar el proyecto `estacion-snack` (el Next.js)
3. Settings → Domains → Add
4. Agregar: `estacionsnack.cl`
5. Agregar: `www.estacionsnack.cl`
6. Vercel mostrará los registros DNS a configurar (ver Paso 2)

## Paso 2 — Configurar DNS en el registrador

En el panel del registrador del dominio (donde compraste `estacionsnack.cl`):

Para `estacionsnack.cl` (apex / raíz):
```
Tipo: A
Nombre: @ (o vacío)
Valor: 76.76.21.21
TTL: 3600 (o el mínimo disponible)
```

Para `www.estacionsnack.cl`:
```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 3600
```

> Si el registrador no soporta CNAME en el apex, usa el registro A de arriba
> y configura `www` con un redirect 301 a `estacionsnack.cl`.

## Paso 3 — Eliminar el dominio del proyecto viejo (si aplica)

Si `estacionsnack.cl` estaba apuntando a otro proyecto de Vercel:

1. Ir al proyecto antiguo → Settings → Domains
2. Eliminar `estacionsnack.cl` y `www.estacionsnack.cl`
3. Luego volver al proyecto `estacion-snack` y los dominios se activarán solos

## Paso 4 — Verificar propagación

```bash
# Verificar que el A record apunta a Vercel
dig estacionsnack.cl A

# Verificar que www resuelve
dig www.estacionsnack.cl CNAME

# Verificar SSL (puede tomar hasta 10 min)
curl -I https://estacionsnack.cl
curl -I https://www.estacionsnack.cl
```

Vercel emite el certificado SSL automáticamente via Let's Encrypt. No hay acción manual.

## Paso 5 — Actualizar NEXT_PUBLIC_SITE_URL

Si cambiaste la URL canónica (de `estacion-snack.vercel.app` a `estacionsnack.cl`):

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# Ingresar: https://estacionsnack.cl
```

Luego hacer un redeploy:
```bash
vercel --prod
```

## Paso 6 — Verificar post-cutover

Después de que DNS propague (5–60 min según el TTL):

- [ ] `https://estacionsnack.cl` carga la tienda
- [ ] `https://www.estacionsnack.cl` carga (o redirige)
- [ ] Los links de WhatsApp en los pedidos usan el dominio correcto
- [ ] `/sitemap.xml` tiene URLs con `estacionsnack.cl`
- [ ] `/robots.txt` tiene `host: https://estacionsnack.cl`
- [ ] El admin en `/admin/login` funciona (Supabase Auth no necesita cambios)

## Qué NO hacer durante el cutover

- NO eliminar el proyecto `estacion-snack-viejo` todavía — mantenerlo como backup por 7 días
- NO cambiar las variables de entorno de Supabase (siguen siendo las mismas)
- NO apagar la rama `main` — Vercel hace deploy automático desde ahí

---

## Rollback

Si algo falla después del cutover:

1. En el registrador, volver el DNS al valor anterior (IP o CNAME del proyecto viejo)
2. Esperar propagación (el TTL que hayas configurado)
3. Investigar el error con `vercel logs estacion-snack --prod`

---

Última actualización: 2026-04-11
