# Manvendra Sang portfolio

Cosmic Amusement Park portfolio. Next.js 15 (static export), React 19, TypeScript, React Three Fiber.
Five worlds: Launchpad, AI, Web, 3D, Contact. Each has its own theme tokens and live 3D scene.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## From root directory two separate terminals for easy run
```bash
npm run dev -w server
npm run dev:web
```

Local check of a sub-path build: `NEXT_PUBLIC_BASE_PATH=/repo-name npm run build`.