VIBES Mini-Market

Monorepo con API (Express + TS), Web (Next.js + TS + Tailwind) y tipos/utilidades compartidas.

Instrucciones rápidas
- Requisitos: Node 20.x, npm.
- API: `cd api && npm i && npm run dev` → http://localhost:3001
- Web: `cd web && npm i && npm run dev` → http://localhost:3000
- Variables: crear `web/.env.local` con `NEXT_PUBLIC_API_BASE=http://localhost:3001`

Endpoints API
- GET `/api/products?search=&sort=price|name&order=asc|desc&page=1&limit=10&available=true|false`
- GET `/api/products/:id`

Páginas Web
- `/products`: listado con buscador, sort, filtro por disponibilidad y paginación.
- `/products/[id]`: detalle con imagen, precio, estado y botón de favoritos (sin lógica real).

Estructura
- `api`: Express + TypeScript, validación Zod, logging con morgan.
- `web`: Next.js App Router, Tailwind, UI responsive y accesible.
- `shared`: Tipos y util `getTopCheapestAvailable` (además se duplicó en `web/lib` por compatibilidad con externalDir).

Decisiones técnicas
- TypeScript estricto en ambos proyectos.
- Zod para validar query params del listado.
- App Router de Next 15, Tailwind 4, grid responsive (min 250px, gap 16px).
- Imágenes locales SVG en `web/public/img` y referencias desde la API.
- Tests unitarios con Vitest para `getTopCheapestAvailable`.

Scripts útiles
- API: `npm run dev` (hot reload con ts-node-dev), `npm run build && npm start`.
- Web: `npm run dev`, `npm run build`, `npm run start`, `npm run test`.

Git-flow
- Rama `feature/api`: API (listado/detalle, filtros, sort, paginación) y tipos.
- Rama `feature/web`: UI, páginas `/products` y `/products/[id]`, componentes y tests.

Pendientes / Bonus
- Opcional MongoDB: seed + lectura desde colección `products`.
- Mejoras de UI (dark mode per-user, favoritos persistentes, skeletons).
