VIBES Mini-Market

Monorepo con API (Express + TS), Web (Next.js + TS + Tailwind) y tipos compartidos.

Scripts
API

- cd api && npm i && npm run dev # http://localhost:3001

WEB

- cd web && npm i && npm run dev # http://localhost:3000

Variables

- NEXT_PUBLIC_API_BASE=http://localhost:3001

Estructura

- api: Endpoints `/api/products` y `/api/products/:id`
- web: Páginas `/products` y `/products/[id]`
- shared: Tipos y util `getTopCheapestAvailable`

Decisiones

- TS estricto, validación con Zod, App Router + Tailwind.

Pendientes

- UI, consumo API, tests util y opcional Mongo.
