"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Variant } from "./Scene";
import { QUALITY_EVENT, readQuality, type Quality } from "@/lib/quality";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Mode = "pending" | "full" | "lite" | "static";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function autoMode(): "full" | "lite" {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak =
    window.innerWidth < 760 ||
    (navigator.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) < 4;
  return weak ? "lite" : "full";
}

/**
 * Decides how much 3D to run.
 *  - static: reduced-motion preference, no WebGL, or the visitor chose "Off".
 *  - lite: small screen, modest hardware, or the visitor chose "Lite".
 *  - full: everything on.
 * The visitor's choice (footer control) overrides the hardware guess, but
 * never the reduced-motion preference.
 */
export default function Backdrop({ variant }: { variant: Variant }) {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      const q: Quality = readQuality();
      if (mq.matches || q === "off" || !webglAvailable()) return setMode("static");
      setMode(q === "auto" ? autoMode() : q);
    };
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener(QUALITY_EVENT, decide);
    return () => {
      mq.removeEventListener("change", decide);
      window.removeEventListener(QUALITY_EVENT, decide);
    };
  }, []);

  if (mode === "pending" || mode === "static") {
    return <div className="backdrop-fallback" aria-hidden="true" />;
  }
  return (
    <div className="backdrop" aria-hidden="true">
      <Scene key={`${variant}-${mode}`} variant={variant} lite={mode === "lite"} />
    </div>
  );
}
