# Prompts de imágenes — Estación Snack

Seis prompts de generación de imagen, uno por producto. Pegalos en
**Codex CLI / Antigravity / DALL-E / Midjourney / Stable Diffusion / Flux**
o cualquier otro generador.

## Estilo target (común a todas las imágenes)

- **Aspect ratio**: cuadrado (1:1, 1024×1024 mínimo)
- **Fondo**: cremoso / off-white (`#FAF9F7`) o blanco puro (`#ffffff`)
- **Iluminación**: natural soft, dirección lateral suave, sombras sutiles
- **Composición**: producto centrado, bowl o plato pequeño + bolsa sellada al lado
- **Color**: paleta cálida (terracotta `#B94A1F`, oliva `#5E6B3E` como acentos en props secundarios — mantel, pieza de cerámica)
- **Estilo**: editorial food photography (tipo Graza, Magic Spoon, Olipop) — NO packshot estéril sobre blanco
- **NO incluir**: logos de marcas (Docile, Bardú), texto sobreimpreso, manos de modelo, watermarks

## Salida + integración

Cada imagen se guarda en `public/img/` con el nombre indicado en cada prompt
(ej: `mix-europeo-x-kilo.webp`). Reemplazan los packshots actuales que el
auditor identificó como problema visual #1.

Después de subir las 6 imágenes, ejecutá:
```bash
npm run dev   # verificar visualmente
```

Las URLs en `data/products.json` ya apuntan a estos nombres exactos —
no hace falta editar JSON si los nombres coinciden.

## Versiones por producto

Idealmente generá **3 variantes por producto** y elegí la mejor.
También considerá **dos formatos**:
1. **Hero/PDP** (1:1 o 4:5, sin texto)
2. **Card del grid** (1:1 cuadrado, idealmente más limpio)

## Los 6 prompts

Ver archivos individuales:
- `01-mix-europeo.md`
- `02-mani-confitado-tropical.md`
- `03-mani-confitado-rojo.md`
- `04-chuby-bardu.md`
- `05-gomita-osito-docile.md`
- `06-almendra-entera.md`
