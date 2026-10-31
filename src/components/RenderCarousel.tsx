"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";

/** Left-panel glow per slide, all drawn from the render world's palette. */
const TINTS = ["#ff7a1a", "#ffa347", "#b8c4d6", "#ff5a2e"];
/** How long each render stays on screen before auto-scroll moves on. */
const INTERVAL_MS = 7000;

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

type Hold = "pointer" | "focus" | "offscreen" | "hidden";

/**
 * Vertical split carousel: copy on the left, render on the right, sliding in opposite directions.
 * Both tracks are positioned from the same index, so they can never drift out of sync.
 *
 * Auto-scroll: a progress bar fills over INTERVAL_MS and moving to the next slide happens when its
 * animation ends. Pausing is just `animation-play-state`, so the bar and the slide can't disagree.
 * It holds while the pointer is over the carousel, while keyboard focus is inside it, while it is
 * scrolled out of view, and while the tab is hidden. It stays off for reduced-motion visitors.
 */
export default function RenderCarousel({ items }: { items: Project[] }) {
  const n = items.length;
  const [view, setView] = useState({ i: 0, dur: 0.6 });
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const holds = useRef<Record<Hold, boolean>>({ pointer: false, focus: false, offscreen: false, hidden: false });
  const touchY = useRef<number | null>(null);
  const { i, dur } = view;
  const auto = playing && !reduced && n > 1;

  const hold = useCallback((k: Hold, on: boolean) => {
    holds.current[k] = on;
    setHeld(Object.values(holds.current).some(Boolean));
  }, []);

  /** Longer jumps (like wrapping from the last render to the first) get a longer slide. */
  const goTo = useCallback(
    (next: number) =>
      setView((v) => ({ i: next, dur: Math.min(1.3, 0.6 + (Math.abs(next - v.i) - 1) * 0.07) })),
    [],
  );
  const step = useCallback((d: 1 | -1) => goTo(wrap(i + d, n)), [goTo, i, n]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => hold("offscreen", !e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const onVis = () => hold("hidden", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [hold]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    step(e.key === "ArrowUp" ? 1 : -1); // matches the buttons: the up arrow advances
  };

  if (n === 0) return null;

  return (
    <section
      ref={root}
      className="rc"
      aria-roledescription="carousel"
      aria-label="3D renders"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && hold("pointer", true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && hold("pointer", false)}
      // Only keyboard focus holds auto-scroll; a mouse click on a button must not freeze it.
      onFocus={(e) => hold("focus", e.target.matches(":focus-visible"))}
      onBlur={() => hold("focus", false)}
      onTouchStart={(e) => {
        touchY.current = e.touches[0].clientY;
        hold("pointer", true);
      }}
      onTouchEnd={(e) => {
        hold("pointer", false);
        if (touchY.current === null) return;
        const dy = e.changedTouches[0].clientY - touchY.current;
        touchY.current = null;
        if (Math.abs(dy) > 48) step(dy < 0 ? 1 : -1);
      }}
      style={{ ["--i" as string]: i, ["--n" as string]: n, ["--dur" as string]: `${dur}s`, ["--rc-interval" as string]: `${INTERVAL_MS}ms` }}
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
        <button type="button" onClick={() => step(-1)} aria-label="Previous render">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </button>
        {!reduced && n > 1 && (
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause auto-scroll" : "Play auto-scroll"}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {playing ? <path d="M9 6v12M15 6v12" /> : <path d="M8 5l11 7-11 7z" />}
            </svg>
          </button>
        )}
        <button type="button" onClick={() => step(1)} aria-label="Next render">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </button>
      </div>

      {auto && (
        <div className={`rc-progress${held ? " held" : ""}`} aria-hidden="true">
          {/* key restarts the fill for every slide; its animation ending advances the carousel. */}
          <span key={i} onAnimationEnd={(e) => e.animationName === "rc-fill" && step(1)} />
        </div>
      )}

      {/* Announcing every automatic change would be noisy, so the live region is only on while paused. */}
      <p className="rc-live" aria-live={auto ? "off" : "polite"}>{items[i].title}, {i + 1} of {n}</p>
    </section>
  );
}
