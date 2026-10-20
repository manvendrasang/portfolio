# Handoff v2.1 changes (October 18, 2026)

Added on top of v2.0 (full v2.0 text follows below):
- Route-change portal: a ring opens from the clicked link in the new world's color, and stars spin up briefly (`park:warp` event). Hidden under reduced motion.
- Observatory scene: three orbiters with guide rings, one per destination color.
- Nebula scene: bright signals travel along the network connections.
- Project cards lean toward the mouse with a soft light (`ProjectCard.tsx`). Mouse only, max 3.5 degrees.
- Footer "3D background" control: Auto, Full, Light, Off. Saved in localStorage. Reduced motion still forces the static backdrop.
- Points render as round sprites, not squares.
- Hero hint now says "Move your pointer" and is hidden on touch. Tilt is not implemented.
- ESLint flat config (`npm run lint`, clean), favicon (`src/app/icon.svg`), `public/og.png`, robots and sitemap. The sitemap is empty and the share image is not attached unless `NEXT_PUBLIC_SITE_URL` is set.

Checked: typecheck, lint, build, and a headless Chromium run (software GL) of the home and AI pages with no console errors.
Not checked: real GPU frame rate, phones, Lighthouse, screen reader. In the headless run the transition ring started late while the new scene mounted, so check it on a real device.
Not built: magnetic buttons, scroll choreography, sound, skill constellation, easter eggs, clickable neural nodes.

---

# Portfolio Website: Project Handoff

Project: Manvendra Sang's personal portfolio. Handoff v2.0, October 18, 2026.
Supersedes handoff v1.0, which said no code existed. A first working build now exists.

## 1. Current state in one paragraph

A complete first version of the Cosmic Amusement Park portfolio is built as a static Next.js site. It has five destinations, three project detail pages, a live 3D scene per destination, per-destination theme tokens, a résumé download, a mailto contact form, and fallbacks for reduced motion, no WebGL, and weak devices. It typechecks, builds, and every route returns the right status when served locally. It has not been viewed in a real browser by the builder (see section 9). It is not deployed yet. No git repository has been initialized.

## 2. Decisions made

| Topic | Decision | Reason |
|---|---|---|
| Framework | Next.js 15 (installed 15.5.28), App Router, React 19, TypeScript strict | Leading candidate in handoff v1.0. Static export keeps hosting free and simple. |
| Rendering | `output: "export"`, `trailingSlash: true`, unoptimized images | One build deploys to both Vercel and GitHub Pages. No server needed. |
| 3D | `three` ^0.170 and `@react-three/fiber` ^9, no drei | Keeps the bundle small. Every scene is hand-built from primitives. |
| Styling | Plain CSS in `src/app/globals.css`, design tokens as CSS variables, one token set per destination via `[data-theme]` | Matches the "CSS variables or equivalent" requirement. No Tailwind. |
| Fonts | System font stacks only | Google Fonts would add a network dependency at build time. A custom font is an open item. |
| Backend | None | Contact form builds a `mailto:` link in the visitor's mail app. |
| Hosting | Vercel or GitHub Pages, both supported | User chose either. A workflow file is included for Pages. |
| Content policy | Only facts from the résumé | Handoff v1.0 forbids invented projects, credentials, metrics, or outcomes. |
| Headline | "make it yourself" is the hero title, lowercase, gradient text | Final treatment was still open. This is a first take. |

## 3. Site map

| Route | File | World | Contents |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Cosmic Observatory (Launchpad) | Hero, park map of four portals, about, featured projects, experience timeline, skills, certifications and education, résumé section |
| `/ai/` | `src/app/ai/page.tsx` | Neural Nebula | Two AI projects, then the two AI research internships as a timeline |
| `/web/` | `src/app/web/page.tsx` | Pixel Midway | One web project, the Spoken Tutorial internship, stack chips |
| `/3d/` | `src/app/3d/page.tsx` | Render Dimension | Empty state. Shows a project grid automatically once a `3d` project exists. |
| `/contact/` | `src/app/contact/page.tsx` | Portal Garden | Email, phone, LinkedIn, résumé link, mailto form |
| `/projects/<slug>/` | `src/app/projects/[slug]/page.tsx` | Theme follows project category | Detail page, generated from `generateStaticParams` |
| 404 | `src/app/not-found.tsx` | Launchpad theme | "This ride is closed" page |

Project slugs: `agentic-it-ticket-manager`, `eeg-phoneme-classifier`, `mern-team-task-manager`.

## 4. File map

```
portfolio/
  package.json              scripts: dev, build, start (npx serve out), typecheck, lint
  next.config.mjs           static export, reads NEXT_PUBLIC_BASE_PATH
  tsconfig.json             strict, "@/*" alias to ./src/*
  README.md                 run, deploy, edit, and open items
  HANDOFF.md                this file
  .gitignore
  .github/workflows/deploy.yml   GitHub Pages deploy
  public/
    Manvendra_Sang_Resume.pdf    copy of Manvendra_Sang_Resume_Updated.pdf
    .nojekyll                    needed so GitHub Pages serves the _next folder
  src/
    lib/content.ts          single source of truth for all site content
    lib/asset.ts            asset() helper, prefixes public files with the base path
    app/layout.tsx          metadata, viewport, wraps everything in Shell
    app/globals.css         tokens, layout, components, animations, reduced-motion rules
    app/page.tsx, ai/, web/, 3d/, contact/, projects/[slug]/, not-found.tsx
    components/Shell.tsx    nav, theme selection by route, footer, page transition
    components/Backdrop.tsx decides full, lite, or static backdrop
    components/Scene.tsx    the five R3F scenes
    components/Parts.tsx    PageHead, ProjectCard, Timeline
    components/ContactForm.tsx   mailto form
```

Also produced: `/home/claude/portfolio-source.tar.gz` (source without node_modules, .next, or out).

## 5. Content, mapped from the résumé

Person: Manvendra Sang. Role line: "Full-stack developer and AI/ML builder". Email manvendrasang@gmail.com, phone +91 9971449601, LinkedIn linkedin.com/in/manvendrasang. Location shown only in data as New Delhi, India (not rendered on any page yet).

Projects (all in `projects` array in `content.ts`):
1. Agentic AI IT Ticket Manager. Category AI. Status "In progress" (résumé says "Building"). Python, LLM triage, OOP.
2. EEG Phoneme Classifier. Category AI. Status "Research project". Echo State Networks, reservoir computing, EEG. Metric 78.7% classification accuracy. Linked to the Kyushu internship.
3. MERN Team Task Manager. Category Web. Status "Live on Railway". MongoDB, Express, React, Node.js, Railway, Git. No URL supplied, so no link buttons render.

Roles (in `roles`):
1. Research Intern, Deep Learning and Reservoir Computing. Kyushu Institute of Technology (Tanaka Lab), Fukuoka. Jan to Mar 2026. Tagged AI.
2. Research Intern, AI/ML and Deep Learning (Hybrid). IIT Delhi. Jun to Sep 2025. Tagged AI.
3. Intern, Full-Stack Development (Remote). Spoken Tutorial, EduPyramids, SINE, IIT Bombay. Sep to Oct 2025. Tagged Web.

Skills: five groups (languages and web, data and cloud, AI and ML, tools and DevOps, app types). Certifications: six entries including the ICDAM 2024 publication on voice recognition systems. Education: B.Tech at Dronacharya College of Engineering (2022 to 2026) and CBSE secondary school (2008 to 2022).

Wording notes: the About text is the résumé objective, lightly changed to first person. Project descriptions stay close to résumé phrasing. Where the résumé states an aim ("reducing workload significantly"), the site says it as a goal, not a result.

## 6. Design system as built

Five theme blocks in `globals.css`. Each sets `--bg`, `--bg2`, `--fg`, `--muted`, `--accent`, `--accent2`, `--card`, `--line`.

| Theme | Page | bg / bg2 | accent / accent2 |
|---|---|---|---|
| observatory | Launchpad | #070817 / #0e1030 | #ffc857 / #7c8cff |
| nebula | AI | #07100f / #0a1d1b | #3dffc0 / #ff5fd2 |
| midway | Web | #160a24 / #240f3d | #ff4d6d / #ffd23f |
| render | 3D | #0b0b0d / #16161a | #ff7a1a / #b8c4d6 |
| portal | Contact | #0b0a1c / #14102e | #c58bff / #5fe3a1 |

Shared tokens: `--radius` 16px, `--maxw` 1120px, `--nav-h` 64px, display font Trebuchet-first stack, body font system UI, mono stack for labels.

Navigation is a sticky bar with a spinning brand dot, five links, `aria-current` on the active page, and a Menu button under 820px. Escape closes the menu. Project detail pages keep the nav highlight on their category.

Motion: page enter animation (fade, rise, blur) keyed on pathname; card lift on hover; portal glow expands on hover; chips tilt on hover; hero gradient text with glow. All CSS animation and transitions are removed under `prefers-reduced-motion`.

## 7. 3D scenes (`Scene.tsx`)

All scenes share a starfield (points), pointer parallax (damped rotation from pointer position), ambient and directional light, and a colored point light.

| Variant | What renders |
|---|---|
| observatory | Faceted icosahedron planet with a glowing ring and an orbiting moon |
| nebula | Up to 46 pulsing nodes joined by lines when closer than 5.2 units, a neural network look |
| midway | 14 by 8 grid of instanced bars rising and falling in waves, plus a rotating ferris wheel with 12 spokes and cabins |
| render | Metallic torus knot on a turntable inside a counter-rotating wireframe shell, over a grid floor |
| portal | 16 rings streaming toward the camera, fading in and out |

`Backdrop.tsx` picks the mode on the client:
- static: reduced-motion is on, or WebGL is missing. Shows a CSS gradient "stars" layer, no canvas.
- lite: window under 760px wide, 4 or fewer CPU cores, or under 4 GB device memory. 500 stars, pixel ratio up to 1.25, antialiasing off.
- full: 1600 stars, pixel ratio up to 1.75.
- It reacts live to changes in the reduced-motion setting. The canvas is loaded with `next/dynamic` and `ssr: false`, and it is keyed by variant so each page gets a fresh scene. While the mode is undecided it shows the static layer.

## 8. Deployment

Vercel: push to GitHub, import the repo, deploy with defaults. Optional env var `NEXT_PUBLIC_SITE_URL` sets `metadataBase` for share previews.

GitHub Pages: `.github/workflows/deploy.yml` builds on every push to `main` and deploys with the official Pages actions. It sets `NEXT_PUBLIC_BASE_PATH=/<repo>` automatically unless the repo is named `<owner>.github.io`. The repo's Settings, Pages, Source must be set to "GitHub Actions". Not yet tested on GitHub itself.

Local sub-path test: `NEXT_PUBLIC_BASE_PATH=/repo npm run build`.

## 9. Verification performed, and what was not

Done:
- `tsc --noEmit` clean.
- `next build` passed (11 static pages). First load JS about 107 kB per route.
- Served `out/` locally. `/`, `/ai/`, `/web/`, `/3d/`, `/contact/`, one project page, and the résumé PDF returned 200. An unknown path returned 404. The home HTML contained the headline, the résumé button, and the skip link.
- A sub-path build (`/portfolio`) rewrote all internal links, assets, and the résumé link correctly.
- Copy was scanned for the banned words in `banned-words.md`. None found.

Not done:
- No browser check. The 3D scenes, layout, spacing, contrast, mobile layout, and hover effects have not been seen on a real screen. Treat the visual design as unreviewed.
- No automated tests, no `next lint` run (no ESLint config exists), no Lighthouse or accessibility audit, no screen reader pass.
- GitHub Actions workflow and Vercel import not exercised.
- No Open Graph share image, no favicon, no sitemap or robots file.

## 10. Known issues and loose ends

1. The home hero hint says "Move your mouse (or tilt your phone)". Tilt is not implemented. Either add device orientation or reword the hint.
2. The résumé lists 78.7% for both the EEG Phoneme Classifier and the Kyushu "Edge-Based EEG Speech Emotion Decoder". The site reuses the number for the project and the internship bullet. Confirm whether these are one result or two.
3. The 3D page shows an empty state because no 3D project is confirmed. Blender and Godot appear only as tools in the résumé.
4. No hobbies section, because none were supplied.
5. The MERN project has no live URL or repository link, so its page has no link buttons.
6. Project pages have no images, videos, or screenshots. Cards are text only.
7. `npm start` runs `npx serve out`, which downloads the `serve` package on first use.
8. The footer prints the current year at build time, which is fine for a static site but will not update until the next build.
9. The pointer parallax listens on `document.body`. Touch devices get no parallax.
10. Several scenes run continuously. Battery use on laptops and phones has not been measured.

## 11. Open content questions for the owner

GitHub profile URL and repository links. Live Railway URL. Screenshots, demo videos, renders. Which 3D work to publish (GameAudioStudio and the liminal-space Blender scene were discussed earlier and never confirmed). Hobbies and interests. A short personal bio beyond the objective. Preferred domain. Whether to show location. Final presentation of the "make it yourself" headline.

## 12. Mapping to the original phases

| Phase | Status |
|---|---|
| 0 Content inventory | Done for everything the résumé covers. Open items listed in section 11. |
| 1 Design system | First pass built directly in code (tokens, nav, motion). Not formally reviewed or approved. |
| 2 Visual prototype | Skipped. The build went straight to code at the owner's request. The Superdesign canvas workflow was not used. |
| 3 Technical foundation | Done: stack, routes, content model, build verification. Testing and linting are missing. |
| 4 Core website | Done: all five pages, project templates, résumé download, contact. |
| 5 Advanced motion and 3D | First pass done, with fallbacks. Needs tuning after real-device testing. |
| 6 Test and release | Not started. |

## 13. Suggested next steps

1. Open the built site in a browser on desktop and phone and review every world. Collect visual feedback.
2. Initialize git, push to GitHub, and deploy to Vercel or Pages to get a live URL.
3. Fill the content gaps in section 11, starting with project links and one screenshot per project.
4. Decide the final look of the "make it yourself" headline and pick a real display font.
5. Fix the tilt hint (item 1 in section 10).
6. Add ESLint, a Lighthouse pass, and an accessibility audit. Add a share image and favicon.
7. Add richer interactions per world (for example a clickable ride or station per skill group), and add the first 3D project when one is confirmed.
8. Run a performance pass on the scenes (frame rate and battery on a mid-range phone).

## 14. Working notes for the next session

- All content edits go through `src/lib/content.ts`. Add a project there and its page appears.
- Do not invent project details, credentials, or metrics. Mark unknowns instead.
- Keep copy plain. The workflow files `banned-words.md`, the no-AI-slop skill, and the humanizer skill apply to site text. No em dashes in copy.
- The Superdesign skill files (SUPERDESIGN.md, INIT.md, and related) were provided as guidance. They require the Superdesign CLI, paid credits, and a design-before-code step. They were not used in this build.
- Commands: `npm install`, `npm run dev`, `npm run build`, `npm run typecheck`.
