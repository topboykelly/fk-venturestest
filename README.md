# F.K. Ventures

MuteDeworld-style Next.js storefront for F.K. DealsGH Ventures — wholesale bottle drinks and minerals.

## Develop

Requires **Node 20+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you see a Turbopack font error like  
`Can't resolve '@vercel/turbopack-next/internal/font/google/font'`  
or the overlay says **(stale)**:

```bash
# stop the old server (Ctrl+C), then:
rm -rf .next node_modules
npm install
npm run dev
```

Or use the shortcut: `npm run dev:clean`

## Edit content

- Brand, contact, nav, categories: [`src/data/store.ts`](src/data/store.ts)
- Products: [`src/data/catalog.ts`](src/data/catalog.ts)
- Images: [`public/images/`](public/images/)
