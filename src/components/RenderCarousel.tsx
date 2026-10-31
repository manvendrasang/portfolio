"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";

/** Left-panel glow per slide, all drawn from the render world's palette. */
const TINTS = ["#ff7a1a", "#ffa347", "#b8c4d6", "#ff5a2e"];

const wrap = (i: number, n: number) => (i + n) % n;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Only the visible clip plays. Neighbours are mounted (so the next slide is ready) but paused. */
function Clip({ src, active, near, reduced }: { src: string; active: boolean; near: boolean; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [active, reduced]);
  if (!near) return null;
  return <video ref={ref} className="rc-clip" src={src} muted loop playsInline preload="metadata" controls={reduced} />;
}

/**
 * Vertical split carousel: copy on the left, render on the right, sliding in opposite directions.
 * Both tracks are positioned from the same index, so they can never drift out of sync.
 */
export default function RenderCarousel({ items }: { items: Project[] }) {
  const n = items.length;
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const touchY = useRef<number | null>(null);

  const go = useCallback((d: 1 | -1) => setI((cur) => wrap(cur + d, n)), [n]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    go(e.key === "ArrowUp" ? 1 : -1); // matches the buttons: the up arrow advances
  };

  if (n === 0) return null;

  return (
    <section
      className="rc"
      aria-roledescription="carousel"
      aria-label="3D renders"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (touchY.current === null) return;
        const dy = e.changedTouches[0].clientY - touchY.current;
        touchY.current = null;
        if (Math.abs(dy) > 48) go(dy < 0 ? 1 : -1);
      }}
      style={{ ["--i" as string]: i, ["--n" as string]: n }}
    >
      {/* Copy column. Rendered in reverse so it slides against the media column. */}
      <div className="rc-copy">
        <div className="rc-track rc-track-copy">
          {items
            .map((p, idx) => ({ p, idx }))
            .reverse()
            .map(({ p, idx }) => {
              const active = idx === i;
              return (
                <div
                  key={p.slug}
                  className="rc-slide rc-info"
                  style={{ ["--tint" as string]: TINTS[idx % TINTS.length] }}
                  aria-hidden={!active}
                  inert={!active}
                >
                  <p className="status">{p.status} · {idx + 1} / {n}</p>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <div>
                    {p.stack.map((s) => (
                      <span className="tag" key={s}>{s}</span>
                    ))}
                  </div>
                  <Link className="btn ghost" href={`/projects/${p.slug}/`}>View project</Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="rc-media">
        <div className="rc-track rc-track-media">
          {items.map((p, idx) => {
            const d = Math.min(wrap(idx - i, n), wrap(i - idx, n));
            return (
              <div className="rc-slide" key={p.slug} aria-hidden={idx !== i}>
                {p.video && <Clip src={p.video} active={idx === i} near={d <= 1} reduced={reduced} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rc-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous render">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next render">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </button>
      </div>

      <p className="rc-live" aria-live="polite">{items[i].title}, {i + 1} of {n}</p>
    </section>
  );
}
