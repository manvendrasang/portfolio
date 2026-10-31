"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { person } from "@/lib/content";

/** How long the countdown runs before liftoff. The CSS timeline in splash.css is built around this. */
const INTRO_MS = 3200;
/** Iris reveal (0.12s delay + 0.95s) plus a little slack. */
const REVEAL_MS = 1250;

/** One gondola colour per world of the park: observatory, nebula, midway, render, portal. */
const WORLDS = ["#ffc857", "#3dffc0", "#ff4d6d", "#ff7a1a", "#c58bff"];
const PODS = 10;

const STAGES: [number, string][] = [
  [0, "Fueling the rides"],
  [22, "Charging the Ferris wheel"],
  [48, "Aligning the orbits"],
  [74, "Strapping in"],
  [100, "Liftoff"],
];

/** A little roller-coaster rail. The cart rides it as the countdown fills. */
const TRACK = "M4 38 C50 38 60 8 110 8 C160 8 170 36 230 36 C290 36 300 12 360 12 C410 12 420 38 476 38";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => clamp01(v) ** 2 * (3 - 2 * clamp01(v));

/** cubic-bezier(x1, y1, x2, y2) easing, same curve family CSS uses. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let u = t;
    for (let k = 0; k < 14; k++) {
      const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3;
      if (x < t) lo = u;
      else hi = u;
      u = (lo + hi) / 2;
    }
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3;
  };
}
const ease = bezier(0.45, 0.05, 0.2, 1);

const STAR_COLORS = ["#eef0ff", "#ffc857", "#7c8cff"];

const words = (text: string) => text.split(" ");

/**
 * Launch sequence shown once when the app is opened, never on in-app navigation
 * (this component lives in the root layout, so it mounts a single time).
 *
 * The visuals are CSS animations that start at first paint, so nothing flashes before React hydrates.
 * JS adds the parts CSS can't do: the warp-speed starfield, the countdown, and the cart on the rail.
 * Everything is timed against one clock (window.__spStart, set by a tiny inline script in <head>).
 */
export default function Splash() {
  const [phase, setPhase] = useState<"intro" | "go" | "done">("intro");
  const phaseRef = useRef<"intro" | "go" | "done">("intro");
  const canvas = useRef<HTMLCanvasElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const track = useRef<SVGPathElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const cart = useRef<SVGGElement>(null);
  const goRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      phaseRef.current = "done";
      html.removeAttribute("data-splash");
      html.style.overflow = "";
      setPhase("done");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    html.style.overflow = "hidden";
    const start = (window as unknown as { __spStart?: number }).__spStart ?? performance.now();
    let raf = 0;
    let doneTimer = 0;

    const go = () => {
      if (phaseRef.current !== "intro") return;
      phaseRef.current = "go";
      setPhase("go");
      html.removeAttribute("data-splash"); // lets the page's own entrance play under the opening iris
      window.dispatchEvent(new Event("park:warp")); // spins up the live starfield behind the page
      doneTimer = window.setTimeout(finish, REVEAL_MS);
    };
    goRef.current = go;

    // ---- starfield -------------------------------------------------------------------------
    const cvs = canvas.current;
    const ctx = cvs?.getContext("2d") ?? null;
    const N = window.innerWidth < 760 ? 110 : 210;
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);
    const seed = (i: number, z = Math.random()) => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.05 + Math.random() * 1.1;
      sx[i] = Math.cos(a) * r;
      sy[i] = Math.sin(a) * r;
      sz[i] = 0.05 + z * 0.95;
    };
    for (let i = 0; i < N; i++) seed(i);
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      if (!cvs) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cvs.width = Math.round(window.innerWidth * dpr);
      h = cvs.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- countdown + rail ------------------------------------------------------------------
    const rail = track.current;
    const railLen = rail?.getTotalLength() ?? 0;
    let lastStage = -1;
    let lastPct = -1;

    let prev = performance.now();
    const frame = (now: number) => {
      const t = now - start;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const p = ease(clamp01(t / INTRO_MS));

      if (phaseRef.current === "intro") {
        const n = Math.round(p * 100);
        if (n !== lastPct) {
          lastPct = n;
          if (pct.current) pct.current.textContent = `${n}%`;
          let s = 0;
          while (s + 1 < STAGES.length && n >= STAGES[s + 1][0]) s++;
          if (s !== lastStage && status.current) {
            lastStage = s;
            status.current.textContent = STAGES[s][1];
          }
        }
        if (lit.current) lit.current.style.strokeDashoffset = String(1 - p);
        if (rail && cart.current) {
          const at = p * railLen;
          const a = rail.getPointAtLength(Math.max(0, at - 1));
          const b = rail.getPointAtLength(Math.min(railLen, at + 1));
          cart.current.setAttribute(
            "transform",
            `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI).toFixed(1)})`,
          );
        }
        if (t >= INTRO_MS) go();
      }

      // Cruise, then accelerate into warp as the countdown nears zero.
      if (ctx && cvs) {
        const warp = smooth((t - 1500) / 1700);
        const speed = 0.07 + warp * warp * 2.6;
        const f = Math.max(w, h) * 0.32;
        const cx = w / 2;
        const cy = h / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.lineCap = "round";
        ctx.lineWidth = dpr * (1.2 + warp * 0.8);
        for (let g = 0; g < 3; g++) {
          ctx.strokeStyle = STAR_COLORS[g];
          ctx.globalAlpha = g === 0 ? 0.9 : 0.75;
          ctx.beginPath();
          for (let i = g; i < N; i += 3) {
            const pz = sz[i];
            sz[i] -= speed * dt;
            const z = sz[i];
            const x1 = cx + (sx[i] / z) * f;
            const y1 = cy + (sy[i] / z) * f;
            if (z < 0.03 || Math.abs(x1 - cx) > w || Math.abs(y1 - cy) > h) {
              seed(i, 1);
              continue;
            }
            ctx.moveTo(cx + (sx[i] / pz) * f, cy + (sy[i] / pz) * f);
            ctx.lineTo(x1, y1);
          }
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && go();
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  let k = 0;
  const letters = (text: string) =>
    words(text).map((word, wi) => (
      <span className="sp-word" key={wi}>
        {[...word].map((ch) => (
          <span className="sp-letter" style={{ "--k": k++ } as CSSProperties} key={k}>{ch}</span>
        ))}
        {" "}
      </span>
    ));

  return (
    <div className="sp-wrap" data-theme="observatory" data-phase={phase} role="dialog" aria-modal="true" aria-label={`Loading ${person.name}'s portfolio`}>
      <div className="sp" onClick={() => goRef.current()}>
        <canvas ref={canvas} className="sp-stars" aria-hidden="true" />
        <span className="sp-glow sp-g1" aria-hidden="true" />
        <span className="sp-glow sp-g2" aria-hidden="true" />
        <span className="sp-glow sp-g3" aria-hidden="true" />
        <span className="sp-comet" style={{ "--d": "0.7s", "--x0": "-10vw", "--y0": "8vh", "--x1": "70vw", "--y1": "46vh" } as CSSProperties} aria-hidden="true" />
        <span className="sp-comet" style={{ "--d": "1.7s", "--x0": "40vw", "--y0": "-8vh", "--x1": "110vw", "--y1": "34vh" } as CSSProperties} aria-hidden="true" />
        <span className="sp-comet" style={{ "--d": "2.5s", "--x0": "-20vw", "--y0": "50vh", "--x1": "50vw", "--y1": "92vh" } as CSSProperties} aria-hidden="true" />

        <div className="sp-stage">
          <svg className="sp-wheel" viewBox="-120 -120 240 240" aria-hidden="true">
            <defs>
              <linearGradient id="sp-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffc857" />
                <stop offset="1" stopColor="#7c8cff" />
              </linearGradient>
              <radialGradient id="sp-planet" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#fff2c8" />
                <stop offset="0.45" stopColor="#ffc857" />
                <stop offset="1" stopColor="#c2571a" />
              </radialGradient>
            </defs>
            <g className="sp-spin">
              <circle className="sp-draw" r="100" fill="none" stroke="url(#sp-ring)" strokeWidth="3" pathLength={1} />
              <circle className="sp-draw sp-draw-in" r="62" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" pathLength={1} />
              {Array.from({ length: PODS }, (_, i) => {
                const a = (i / PODS) * Math.PI * 2;
                const x = Math.cos(a) * 100;
                const y = Math.sin(a) * 100;
                return (
                  <g key={i} style={{ "--k": i } as CSSProperties}>
                    <line className="sp-draw sp-spoke" x1="0" y1="0" x2={x} y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" pathLength={1} />
                    <circle className="sp-pod" cx={x} cy={y} r="7.5" fill={WORLDS[i % WORLDS.length]} />
                  </g>
                );
              })}
            </g>
            <g className="sp-hub">
              <ellipse rx="27" ry="8" fill="none" stroke="#7c8cff" strokeWidth="2" transform="rotate(-20)" />
              <circle r="15" fill="url(#sp-planet)" />
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.4s" repeatCount="indefinite" />
                <circle cx="36" r="3" fill="#fff" />
              </g>
            </g>
          </svg>

          <div className="sp-card">
            <p className="sp-name" aria-hidden="true">{letters(person.name.toUpperCase())}</p>
            <div className="sp-headline" aria-hidden="true">
              {words(person.headline).map((wd, i) => (
                <span className="sp-hword" style={{ "--k": i } as CSSProperties} key={wd + i}>{wd} </span>
              ))}
            </div>
            <p className="sp-sub">Cosmic amusement park. Now boarding.</p>
            <div className="sp-meter">
              <div className="sp-meter-row">
                <span ref={status}>{STAGES[0][1]}</span>
                <span ref={pct}>0%</span>
              </div>
              <svg className="sp-track" viewBox="0 0 480 44" aria-hidden="true">
                <path ref={track} d={TRACK} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
                <path ref={lit} className="sp-lit" d={TRACK} fill="none" stroke="#ffc857" strokeWidth="3.5" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                <g ref={cart} className="sp-cart" transform="translate(4 38)">
                  <rect x="-8" y="-10" width="16" height="8" rx="3" fill="#fff" />
                  <circle cx="-4" cy="-1" r="2" fill="#ffc857" />
                  <circle cx="4" cy="-1" r="2" fill="#ffc857" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <button type="button" className="btn ghost sp-skip">Skip intro</button>
      </div>
      <span className="sp-flash" aria-hidden="true" />
      <span className="sp-ring" aria-hidden="true" />
    </div>
  );
}
