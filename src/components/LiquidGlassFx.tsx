"use client";

import { useEffect } from "react";

/*
 * Liquid glass refraction. Adapted from "liquid-glass" by Nik Delvin (MIT License,
 * Copyright (c) 2025 Nikita Stadnik): an SVG displacement map, split per colour channel, is fed to
 * backdrop-filter so the page behind a surface bends at its edges like thick glass.
 *
 * Each target gets a --lg-bf custom property sized to its own box; the stylesheet picks it up and falls
 * back to the plain frosted blur wherever the browser cannot do backdrop-filter: url() (Safari, Firefox).
 */

const TARGETS = [".nav", ".card", ".portal", ".btn.ghost", ".timeline article"].join(",");
const SHIFT = 38; // max refraction at the very edge, in px
const BEZEL = 34; // how deep the curved edge reaches into the surface, in px
const ABERRATION = 4; // extra px of red/blue split at the edge

/*
 * Displacement map for a convex glass slab. Inside the bezel every pixel is pushed along the inward
 * normal by an amount that follows a circular (convex lens) profile: strongest at the rim, fading to
 * nothing where the surface goes flat. R and G carry x and y, centred on 128.
 */
function map(w: number, h: number, r: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const bez = Math.max(4, Math.min(BEZEL, Math.min(w, h) / 2));
  const hx = w / 2 - r;
  const hy = h / 2 - r;
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2;
      const py = y + 0.5 - h / 2;
      const qx = Math.abs(px) - hx;
      const qy = Math.abs(py) - hy;
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const out = Math.hypot(ox, oy);
      const depth = -(out + Math.min(Math.max(qx, qy), 0) - r); // distance in from the edge
      let nx = 0;
      let ny = 0;
      let m = 0;
      if (depth < bez) {
        const t = Math.max(depth, 0) / bez;
        m = 1 - Math.sqrt(1 - (1 - t) * (1 - t));
        if (out > 0) {
          nx = -(ox / out) * Math.sign(px);
          ny = -(oy / out) * Math.sign(py);
        } else if (qx > qy) nx = -Math.sign(px);
        else ny = -Math.sign(py);
      }
      const i = (y * w + x) * 4;
      d[i] = 128 + 127 * nx * m;
      d[i + 1] = 128 + 127 * ny * m;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

function filter(w: number, h: number, r: number) {
  const m = map(w, h, r);
  if (!m) return "";
  const pass = (scale: number, row: string, out: string) =>
    `<feDisplacementMap in="SourceGraphic" in2="dm" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>` +
    `<feColorMatrix type="matrix" values="${row}" result="${out}"/>`;
  const s = SHIFT * 2;
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg height="${h}" width="${w}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="displace" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
        `<feImage x="0" y="0" height="${h}" width="${w}" href="${m}" result="dm"/>` +
        pass(s + ABERRATION * 2, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0", "r") +
        pass(s + ABERRATION, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0", "g") +
        pass(s, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0", "b") +
        `<feBlend in="r" in2="g" mode="screen"/><feBlend in2="b" mode="screen"/></filter></defs></svg>`,
    ) +
    "#displace"
  );
}

function supported() {
  const t = document.createElement("div");
  t.style.cssText = "backdrop-filter: url(#t)";
  return t.style.backdropFilter.includes("url(");
}

export default function LiquidGlassFx() {
  useEffect(() => {
    if (!supported()) return;
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const ro = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const el = target as HTMLElement;
        const w = Math.round(el.offsetWidth);
        const h = Math.round(el.offsetHeight);
        if (w < 24 || h < 24) continue;
        const raw = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        const r = Math.max(1, Math.min(raw, w / 2, h / 2));
        const f = filter(w, h, r);
        if (f) el.style.setProperty("--lg-bf", `blur(1px) url('${f}') blur(1.5px) brightness(1.08) saturate(1.7)`);
      }
    });

    const scan = () => {
      document.querySelectorAll(TARGETS).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        ro.observe(el);
      });
    };
    scan();

    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  return null;
}
