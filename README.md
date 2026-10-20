# Manvendra Sang portfolio

Cosmic Amusement Park portfolio. Next.js 15 (static export), React 19, TypeScript, React Three Fiber.
Five worlds: Launchpad, AI, Web, 3D, Contact. Each has its own theme tokens and live 3D scene.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## Deploy

### Vercel (simplest)

1. Push this folder to a GitHub repo.
2. On vercel.com choose Add New, Project, import the repo. Keep the defaults and deploy.
3. Optional: set `NEXT_PUBLIC_SITE_URL` to your final URL so share previews resolve.

### GitHub Pages

1. Push to a repo's `main` branch (the workflow is in `.github/workflows/deploy.yml`).
2. In the repo go to Settings, Pages, and set Source to GitHub Actions.
3. Each push builds and publishes. The workflow sets the sub-path automatically:
   - repo named `<username>.github.io` is served at `https://<username>.github.io/`
   - any other repo is served at `https://<username>.github.io/<repo>/`

Local check of a sub-path build: `NEXT_PUBLIC_BASE_PATH=/repo-name npm run build`.

## Edit content

Everything lives in `src/lib/content.ts`. Add a project by adding an object to `projects`; its detail page
(`/projects/<slug>/`) is generated automatically. Add `links: [{ label, href }]` for repo or live demo buttons.

## Content still to add

The site only states facts from the résumé. These are open:

- Project links: GitHub repos and live URLs (Railway app, etc.)
- Screenshots, demo videos, and renders
- 3D projects (the 3D page shows an empty state until a project with `category: "3d"` is added)
- Hobbies and personal interests (no section yet)
- A short personal bio beyond the résumé objective
- GitHub profile link
- Custom domain preference

## Accessibility and performance

- Reduced-motion preference turns off the 3D canvas and all CSS animation.
- No WebGL, small screens, and modest hardware get a static backdrop or a lighter scene.
- Skip link, visible focus rings, keyboard-operable menu (Escape closes it), semantic landmarks.
- No backend. The contact form opens the visitor's mail app.
- The headline "make it yourself" is set as the hero title. Its final treatment is open.
