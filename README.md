# WishCraft AI

Frontend-only birthday card studio. Upload a JPG, JPEG, or PNG and a name — the app generates **50 unique cards** in the browser. Browse with Previous/Next or swipe, then download HD PNG or JPEG.

No backend. Templates live in the frontend bundle.

## Features

- 50 visually different templates across 5 collections
- Auto crop/fit photo into circle, square, heart, star, ribbon/gift, polaroid, balloon, oval, diamond, and full-bleed frames
- Unique premium birthday wish on every card
- Mobile-first UI, dark mode, swipe navigation
- HD PNG and JPEG export

## Local development

Requires Node.js 18+.

```bash
npm run install:all
npm run dev
```

Open http://localhost:5173

## Production

```bash
npm run install:all
npm run build
npm run preview
```

`render.yaml` deploys `frontend/dist` as a static site.
