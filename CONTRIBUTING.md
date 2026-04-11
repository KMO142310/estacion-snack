# Contribuir a Estación Snack

---

## Ramas

| Prefijo | Uso |
|---------|-----|
| `feat/` | Feature nueva |
| `fix/` | Bug fix |
| `chore/` | Tooling, deps, docs |
| `hardening/` | Seguridad y RLS |

Nunca commitear directo a `main`. Todo cambio entra por PR.

---

## Commits

Formato: `tipo(scope): descripción corta en imperativo`

```
feat(checkout): agregar selector de comunas al drawer
fix(admin): revertir stock al cancelar pedido
chore(deps): actualizar supabase-js a 2.103
docs(readme): actualizar sección de migraciones
```

Tipos válidos: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `security`.

Reglas:
- Un commit = un cambio lógico. No mezclar scopes.
- Sin `--no-verify`. Si el pre-commit hook falla, investigar la causa.
- Sin credenciales literales. Verificar con `git diff --cached | grep -iE 'eyJ|sk_live'` antes de commitear.

---

## Antes de cada commit

1. `npm run typecheck` — cero errores TypeScript.
2. `npm run build` — cero warnings, build limpio.
3. `git diff --cached` — leer el diff completo.
4. Grep de secretos en el staged diff.

---

## Migraciones SQL

- Un archivo nuevo por migración: `supabase/migrations/NNNN_descripcion.sql`.
- Nunca editar un archivo ya aplicado en prod.
- Toda migración que toque RLS requiere audit (ver `docs/ARCHITECTURE.md`).
- Las migraciones se aplican manualmente en el SQL Editor de Supabase. No hay CLI automático.

---

## Hallazgos laterales

Si encontrás un bug o vulnerabilidad fuera del scope de tu tarea:
1. No lo arreglés en el mismo commit.
2. Documentarlo en `docs/LATERAL_FINDINGS.md` con fecha, descripción, evidencia e impacto.
3. Mencionarlo al cierre del bloque actual.

---

## Code style

- TypeScript estricto: cero `any`, cero `@ts-ignore`.
- Server Components por default; `"use client"` solo cuando el componente necesita estado o efectos del browser.
- No agregar features no pedidas, no refactorizar código fuera de scope.
- Comentarios solo donde la lógica no es autoevidente.
