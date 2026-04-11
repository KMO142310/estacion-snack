# PENDIENTE_USUARIO — Estación Snack

Estas son las tareas que **solo vos podés completar** porque requieren material real (fotos, datos bancarios, acceso a cuentas). El sitio está 100% funcional sin estos cambios — simplemente quedan placeholders.

---

## PRIORIDAD ALTA

### 1. Fotos de productos
Cada producto en `/img/` tiene un archivo JPG y WEBP que la app referencia. Si los archivos no existen, el placeholder crema (`#F4EADB`) aparece en su lugar.

**Fotos necesarias** (formato mínimo 600×600px, preferir 1200×1200px):
```
/public/img/mix-europeo-x-kilo.jpg + .webp
/public/img/mani-confitado-tropical-x-kilo.jpg + .webp
/public/img/mani-confitado-rojo-x-kilo.jpg + .webp
/public/img/chuby-bardu-x-kilo.jpg + .webp
/public/img/gomita-osito-docile-x-kilo.jpg + .webp
/public/img/almendra-entera-x-kilo.jpg + .webp
```

**Fotos de packs** (formato 800×600px, 4:3):
```
/public/img/pack-pica.jpg + .webp
/public/img/pack-dulce.jpg + .webp
/public/img/pack-proteina.jpg + .webp
```

**Dirección fotográfica**: Ver `DIRECCION-CREATIVA.md` §2.6 — fondo neutro o madera, luz lateral, frutos derramados, sin sobre-producción.

---

### 2. Foto de equipo/local (sección "Detrás de Estación Snack")
Actualmente hay un SVG placeholder.

**Archivo**: `/public/img/equipo.webp`  
**Especificación**: horizontal 16:7, fundador o equipo en bodega, delantal real, pesa, bolsas kraft al fondo. Sin filtros. Luz dura de mañana.

Cuando la foto esté lista, reemplazar el bloque placeholder en `components/DetrasDe.tsx` (líneas 12–33) por:
```tsx
<Image src="/img/equipo.webp" alt="El equipo de Estación Snack" fill style={{ objectFit: "cover" }} />
```

---

### 3. Capturas reales de WhatsApp (sección Prueba Social)
En `components/PruebaSocial.tsx` hay 2 testimonios de placeholder.

**Cuando tengas capturas reales**: actualizar el array `waChats` con los textos reales (nombres parciales con permiso del cliente). Idealmente también subir imágenes PNG de las capturas y mostrarlas como `<Image>`.

---

### 4. Contador de entregas
Actualizar el número en `data/metrics.json`:
```json
{
  "deliveries": 147,     ← actualizar esto
  "zones": ["Santa Cruz", "Peralillo", "Palmilla", "Nancagua"],
  "since": "agosto 2024"
}
```

---

## PRIORIDAD MEDIA

### 5. Favicon PNG (para compatibilidad máxima)
El `favicon.ico` y `apple-touch-icon.png` existentes son del diseño anterior. Para consistencia, generá versiones con el nuevo isotipo (oval + línea terracota sobre fondo burdeo).

Herramienta: [realfavicongenerator.net](https://realfavicongenerator.net) — subí el `favicon.svg`.

**Archivos a reemplazar**:
```
/public/favicon.ico
/public/apple-touch-icon.png
/public/icon-192.png
/public/icon-512.png
```

---

### 6. Precios actualizados
Los precios en `data/products.json` son los que aparecen en la tienda. Si cambian, editar ese archivo directamente.

---

### 7. Número de WhatsApp
El número `56953743338` está definido en `lib/whatsapp.ts` (constante `WA_PHONE`). Si cambia, actualizar ahí.

---

## PRIORIDAD BAJA

### 8. OG image real
El archivo `/public/og-image.jpg` (1200×630) es la imagen que aparece cuando se comparte el sitio en redes sociales. Actualmente apunta a un archivo que puede no existir. Crear una foto editorial o pantalla del sitio en ese tamaño.

### 9. Instagram handle
`@estacionsnack` está hardcodeado en el Footer. Verificar que sea el handle correcto.

---

## YA HECHO (no requiere acción)

- ✅ Catálogo de 6 productos con chips de cantidad y bottom sheet
- ✅ 3 packs con cálculo de ahorro vs. compra suelta
- ✅ Carrito Zustand con persistencia 7 días
- ✅ Mensaje WhatsApp con detalle de pedido autogenerado
- ✅ Páginas /envios, /faq, /contacto, /sobre-nosotros
- ✅ SEO: JSON-LD LocalBusiness + Product por página
- ✅ OG images dinámicos por producto
- ✅ sitemap.xml y robots.txt
- ✅ Accesibilidad: skip link, aria-labels, focus-visible, ESC para cerrar modales
- ✅ Safe area insets para iPhone con notch
- ✅ prefers-reduced-motion
