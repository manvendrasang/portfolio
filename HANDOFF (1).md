# Portfolio Website: Project Handoff

Project: Manvendra Sang's personal portfolio ("Cosmic Amusement Park").
Handoff v2.1, October 18, 2026. Supersedes v2.0 (the build summary below is carried forward and updated).

## 1. State in one paragraph

A static Next.js site with five destinations, three project pages, a live 3D scene per destination, per-destination themes, a résumé download, and a mailto contact form. This session added a route-change portal transition, orbiting destination planets, traveling neural signals, leaning project cards, a visitor-controlled 3D quality setting, ESLint, favicon, share image, robots and sitemap. It typechecks, lints clean, and builds (14 static pages, about 107 kB first-load JS per route). It was opened once in headless Chromium with software GL (home and AI pages, no console errors). It has not been checked on a real GPU or phone. It is not deployed. No git repository exists yet.

## 2. Stack and decisions (unchanged from v2.0)

- Next.js 15 App Router, React 19, TypeScript strict, `output: "export"`, `trailingSlash: true`, unoptimized images.
- three ^0.170 and @react-three/fiber ^9, no drei. All scenes hand-built from primitives.
- Plain CSS in `src/app/globals.css`, tokens as CSS variables, one set per world via `[data-theme]`.
- System fonts only. No backend. Contact form builds a `mailto:` link.
- Hosting: Vercel or GitHub Pages (workflow in `.github/workflows/deploy.yml`, untested on GitHub).
- Content policy: only facts from the résumé. Do not invent projects, credentials, metrics, or outcomes. Mark unknowns.
- Copy rules: plain wording, no em dashes, banned-words list applies.

## 3. Site map

| Route | World | Contents |
|---|---|---|
| `/` | Cosmic Observatory | Hero, park map, about, projects, experience, skills, credentials, résumé |
| `/ai/` | Neural Nebula | Two AI projects, two AI research internships |
| `/web/` | Pixel Midway | One web project, Spoken Tutorial internship, stack chips |
| `/3d/` | Render Dimension | Empty state until a `3d` project exists in content |
| `/contact/` | Portal Garden | Email, phone, LinkedIn, résumé, mailto form |
| `/projects/<slug>/` | Follows category | Slugs: `agentic-it-ticket-manager`, `eeg-phoneme-classifier`, `mern-team-task-manager` |

All content lives in `src/lib/content.ts`. Add a project there and its page appears.

## 3b. Design tokens

| Theme | bg / bg2 | accent / accent2 |
|---|---|---|
| observatory | #070817 / #0e1030 | #ffc857 / #7c8cff |
| nebula | #07100f / #0a1d1b | #3dffc0 / #ff5fd2 |
| midway | #160a24 / #240f3d | #ff4d6d / #ffd23f |
| render | #0b0b0d / #16161a | #ff7a1a / #b8c4d6 |
| portal | #0b0a1c / #14102e | #c58bff / #5fe3a1 |

## 4. What changed in this session (v2.0 to v2.1)

| Change | Files | Notes |
|---|---|---|
| Route-change portal | `Shell.tsx`, `globals.css` (`.warp`) | Records the last link click position, then on pathname change renders a ring from that point in the new theme's accent. Also fires a `park:warp` window event. Hidden under reduced motion. Skipped on first load. |
| Star warp | `Scene.tsx` (`Stars`) | Listens for `park:warp`, spins up and pushes forward, then decays over about 1.2 s. |
| Orbiting destinations | `Scene.tsx` (`Orbiter`, `Observatory`) | Three bodies on tilted orbits with faint guide rings, colored after AI, Web, and 3D worlds. Not clickable. |
| Neural signals | `Scene.tsx` (`Nebula`) | Up to 28 additive-blended dots travel along random connections. Edges are now stored. Not linked to projects. |
| Round points | `Scene.tsx` (`useDotTexture`) | Canvas radial sprite so stars and signals are round. One texture per `Stars` or `Nebula` instance, disposed on unmount. |
| Leaning project cards | `ProjectCard.tsx` (new), `Parts.tsx` re-exports it, `globals.css` (`.card.tilt`) | Mouse only, max 3.5 degrees, soft light following the pointer. `.card.lift` no longer rotates. |
| 3D quality setting | `lib/quality.ts`, `QualityControl.tsx`, `Backdrop.tsx`, `Shell.tsx` footer | Auto, Full, Light, Off, saved in localStorage, applied live through the `park:quality` event. Reduced motion always forces static and disables the control. |
| Hero hint fixed | `app/page.tsx`, `globals.css` | Now "Move your pointer to steer the scene." Hidden on touch (`@media (hover: none)`). Tilt is not implemented. |
| ESLint | `eslint.config.mjs`, `package.json` | Flat config with `next/core-web-vitals` and `next/typescript`. `npm run lint` is now `eslint .` and is clean. |
| Favicon | `src/app/icon.svg` | Planet and ring mark. |
| Share image | `public/og.png` (1200x630) | Plain: headline, name, role on a star field. Only attached to metadata when `NEXT_PUBLIC_SITE_URL` is set. |
| Robots and sitemap | `app/robots.ts`, `app/sitemap.ts` | Both `force-static`. The sitemap returns an empty list unless `NEXT_PUBLIC_SITE_URL` is set. |

## 5. Verification

Done:
- `tsc --noEmit` clean. `eslint .` clean. `next build` passes.
- Served `out/` and loaded `/` and `/ai/` in headless Chromium (software GL). No console or page errors. Screenshots showed the orbiters on the home hero and round signals on the AI scene.
- Confirmed the `.warp` element appears on navigation and animates.

Not done:
- No real GPU, laptop, or phone test. Frame rate, battery use, and touch behavior are unknown.
- In the headless run the transition ring started about 150 ms late and finished early, because the main thread was busy mounting the new scene. Software GL exaggerates this, but check it on real hardware. If it stutters, delay the scene mount until the ring starts, or mount the new scene after a short timeout.
- The other pages (`/web/`, `/3d/`, `/contact/`, project pages) were not screenshotted this session. The tilt cards, quality control, and mobile layout were not viewed.
- No Lighthouse run, no accessibility audit, no screen reader pass.
- GitHub Actions workflow and Vercel import never exercised.
- `npm audit` reports advisories after the ESLint install. Not reviewed.

## 6. Known issues and loose ends

Carried from v2.0, still open:
1. The résumé gives 78.7% for both the EEG Phoneme Classifier and the Kyushu "Edge-Based EEG Speech Emotion Decoder". The site reuses it. Ask the owner whether this is one result or two.
2. The 3D page is an empty state. No 3D project is confirmed (GameAudioStudio and a liminal-space Blender scene were discussed and never confirmed).
3. The MERN project has no live URL or repository link, so no link buttons show.
4. Project pages have no images, videos, or screenshots. Cards are text only.
5. Touch devices get no scene parallax (it listens to the pointer).
6. Several scenes run continuously. Battery use is unmeasured.
7. `npm start` runs `npx serve out`, which downloads `serve` on first use. Note that a background `serve` process did not survive between tool calls in the last session, so start it and test in the same command.
8. The footer year is set at build time.
9. No hobbies section. No personal bio beyond the objective.

New in this session:
10. The quality control only lives in the footer, so it is hard to find. Consider a small icon in the nav.
11. Orbiters and neural signals are decorative. They are not linked to destinations or projects, even though the earlier review suggested that.
12. The share image is plain and was drawn with a default system font.
13. `Stars` count is large on Full (1600) and every scene remounts on theme change. Not profiled.
14. `.card.tilt` uses `overflow: hidden` for the light layer. If a card ever gets a popover or badge that sticks out, revisit.

## 7. What is left, in order

1. **Look at it.** Run `npm run dev` on desktop and a phone. Review every world, the transition, the tilt cards, the footer control, and the mobile menu. Collect visual feedback before adding more.
2. **Deploy.** `git init`, push to GitHub, deploy on Vercel or GitHub Pages (Settings, Pages, Source: GitHub Actions). Set `NEXT_PUBLIC_SITE_URL` once the domain is known so the share image and sitemap turn on.
3. **Get content from the owner** (section 8). Add links and one screenshot per project first.
4. **Real-device performance pass.** Frame rate and battery on a mid-range phone. Tune star counts, pause the canvas when the tab is hidden or the scene is off screen, and fix the transition stutter if it shows up.
5. **Pick a display font and settle the "make it yourself" headline.** Self-host a font to avoid build-time network use.
6. **Accessibility and quality.** Lighthouse, a keyboard pass, a screen reader pass, contrast check on all five themes, and a decision about `npm audit`.
7. **More interactions from the earlier review, not yet built:** clickable neural nodes that open a project, an interactive skill constellation, scroll-driven scene changes, magnetic buttons, a navigable miniature universe, a before and after slider for 3D work, optional sound (off by default with a visible mute), hidden easter eggs.
8. **Case studies.** For each project: problem, contribution, technical choices, challenges, outcome, with links to evidence. Give the EEG number its research context.
9. **Add the first 3D project** when one is confirmed, with real renders.
10. **Tests.** There are no automated tests. Add at least a smoke test for routes.

## 8. Open questions for the owner

GitHub profile and repository links. Live Railway URL. Screenshots, demo videos, renders. Which 3D work to publish. Whether the two 78.7% figures are the same result. Hobbies and interests. A short personal bio. Preferred domain. Whether to show location. Final look of the headline. Whether the footer control is enough or should move to the nav.

## 9. Working notes

- Commands: `npm install`, `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`. Sub-path test: `NEXT_PUBLIC_BASE_PATH=/repo npm run build`.
- The Superdesign skill files were given as guidance but need its CLI and paid credits. They were not used.
- Archive: `portfolio-source-v2.1.tar.gz` holds the source without `node_modules`, `.next`, or `out`.
