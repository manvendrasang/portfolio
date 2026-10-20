"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Backdrop from "./Backdrop";
import QualityControl from "./QualityControl";
import { bySlug, destinations, person } from "@/lib/content";
import type { Variant } from "./Scene";

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

function themeFor(pathname: string): Variant {
  const p = norm(pathname);
  const hit = destinations.find((d) => norm(d.href) === p);
  if (hit) return hit.theme;
  if (p.startsWith("/projects/")) {
    const proj = bySlug(p.split("/")[2]);
    if (proj?.category === "ai") return "nebula";
    if (proj?.category === "web") return "midway";
    if (proj?.category === "3d") return "render";
  }
  return "observatory";
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const theme = themeFor(pathname);
  const [open, setOpen] = useState(false);
  const [warp, setWarp] = useState(0);
  const origin = useRef({ x: 50, y: 50 });
  const first = useRef(true);

  // Remember where the visitor clicked so the transition opens from that spot.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest("a")) {
        origin.current = {
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        };
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    setWarp((w) => w + 1);
    window.dispatchEvent(new Event("park:warp"));
  }, [pathname]);

  // Escape closes the mobile menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = (href: string) => {
    const p = norm(pathname);
    const h = norm(href);
    if (h === "/") return p === "/";
    return p === h || (p.startsWith("/projects/") && themeFor(pathname) === destinations.find((d) => norm(d.href) === h)?.theme);
  };

  return (
    <div className="shell" data-theme={theme}>
      <a className="skip" href="#main">Skip to content</a>
      <Backdrop variant={theme} />
      {warp > 0 && (
        <div className="warp" key={warp} aria-hidden="true" style={{ ["--wx" as string]: `${origin.current.x}%`, ["--wy" as string]: `${origin.current.y}%` }}>
          <span />
        </div>
      )}
      <header className="nav">
        <Link href="/" className="brand" aria-label={`${person.name}, home`}>
          <span className="brand-dot" aria-hidden="true" />
          {person.name}
        </Link>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav aria-label="Primary">
          <ul id="site-nav" className={open ? "open" : ""}>
            {destinations.map((d) => (
              <li key={d.href}>
                <Link href={d.href} aria-current={current(d.href) ? "page" : undefined}>
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" key={pathname} className="page-enter">
        {children}
      </main>
      <footer className="site">
        <div className="wrap row" style={{ justifyContent: "space-between" }}>
          <span>{person.name}, {new Date().getFullYear()}</span>
          <QualityControl />
          <span>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            {" · "}
            <a href={person.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a>
            {" · "}
            <a href={person.github} rel="noopener noreferrer" target="_blank">GitHub</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
